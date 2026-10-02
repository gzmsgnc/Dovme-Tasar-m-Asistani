import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { generateEsotericTattooStencilSvg } from './src/utils/stencilGenerator';
import { isValidCalendarDate, resolveCityLocation, CityLocation } from './src/utils/astrology';
import { searchGlobalLocationsApi, resolveLocationSync, resolveLocationAsync, LocationValidationError } from './src/utils/locationResolver';
import { calculateEnneagramFromAnswers, ENNEAGRAM_MINI_TEST_QUESTIONS } from './src/utils/enneagram';
import { calculateBehavioralTotemResult, TOTEM_BEHAVIORAL_QUESTIONS } from './src/utils/behavioralTotemEngine';
import { getTotemAnimalStrict } from './src/utils/totemCatalogData';
import { normalizePhoneNumber, isValidEmail } from './src/utils/clientValidation';
import { PersonData } from './src/types';

dotenv.config();

const PORT = 3000;

// Persistent Server-Side Client Storage
const DATA_DIR = path.join(process.cwd(), 'data');
const CLIENTS_STORAGE_FILE = path.join(DATA_DIR, 'clients.json');

const ADMIN_SESSION_COOKIE = 'studio_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const loginFailures = new Map<string, { count: number; resetAt: number }>();
const intakeRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 10_000;

function pruneRateLimitStore(store: Map<string, { count: number; resetAt: number }>, now: number): void {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  if (store.size <= RATE_LIMIT_MAX_KEYS) return;
  const entries = Array.from(store.entries()).sort((a, b) => a[1].resetAt - b[1].resetAt);
  const removeCount = store.size - RATE_LIMIT_MAX_KEYS;
  for (let i = 0; i < removeCount; i += 1) store.delete(entries[i][0]);
}

function isRateLimited(store: Map<string, { count: number; resetAt: number }>, key: string, limit: number): boolean {
  const now = Date.now();
  pruneRateLimitStore(store, now);
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (current.count >= limit) return true;
  current.count += 1;
  return false;
}

function isLoginRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  pruneRateLimitStore(loginFailures, now);
  const current = loginFailures.get(key);
  if (!current || current.resetAt <= now) {
    loginFailures.delete(key);
    return false;
  }
  return current.count >= limit;
}

function recordLoginFailure(key: string): void {
  const now = Date.now();
  const current = loginFailures.get(key);
  if (!current || current.resetAt <= now) {
    loginFailures.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  current.count += 1;
}
function getAdminPassword(): string | null {
  const password = process.env.STUDIO_ADMIN_PASSWORD;
  return typeof password === 'string' && password.length >= 12 ? password : null;
}

function createAdminSession(): string {
  const password = getAdminPassword();
  if (!password) throw new Error('STUDIO_ADMIN_PASSWORD is not configured or is too short.');
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', password).update(payload).digest('hex');
  return payload + '.' + signature;
}

function isValidAdminSession(req: Request): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  const header = req.headers.cookie || '';
  const match = header.match(new RegExp('(?:^|; )' + ADMIN_SESSION_COOKIE + '=([^;]+)'));
  if (!match) return false;
  const parts = decodeURIComponent(match[1]).split('.');
  const expiresAt = Number(parts[0]);
  const signature = parts[1];
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = crypto.createHmac('sha256', password).update(String(expiresAt)).digest('hex');
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function requireAdmin(req: Request, res: Response, next: express.NextFunction): void {
  if (!isValidAdminSession(req)) {
    res.status(401).json({ success: false, error: getAdminPassword() ? 'Stüdyo oturumu gerekli.' : 'Stüdyo yönetici erişimi yapılandırılmamış.' });
    return;
  }
  next();
}

const DEMO_ACCOUNT_IDS = new Set([
  'client_selin_kaya',
  'client_emir_arslan',
  'client_derya_yilmaz'
]);

function isDemoClientRecord(client: any): boolean {
  if (!client || typeof client !== 'object') return true;
  if (client.id && DEMO_ACCOUNT_IDS.has(client.id)) return true;

  const name = String(client.name || '').trim().toLocaleLowerCase('tr-TR');
  const email = String(client.email || '').trim().toLocaleLowerCase('tr-TR');
  const source = String(client.source || '').trim().toLocaleLowerCase('tr-TR');
  const status = String(client.status || '').trim().toLocaleLowerCase('tr-TR');

  const demoNamePatterns = ['selin kaya', 'emir arslan', 'derya yılmaz', 'demo', 'test danışan', 'test müşteri', 'test musteri'];
  return demoNamePatterns.some(pattern => name === pattern || name.includes(pattern))
    || email.includes('demo@')
    || email.includes('test@')
    || source === 'demo'
    || source === 'test'
    || status === 'demo';
}

function getPersistedClients(): PersonData[] {
  try {
    if (!fs.existsSync(CLIENTS_STORAGE_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(CLIENTS_STORAGE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const realOnly = parsed.filter((c: any) => c && c.id && c.name && !isDemoClientRecord(c));
    if (realOnly.length !== parsed.length) {
      savePersistedClients(realOnly);
    }
    return realOnly;
  } catch (err) {
    console.error('Failed reading persisted clients:', err);
    return [];
  }
}

function savePersistedClients(clients: PersonData[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const realOnly = clients.filter(c => c && c.id && c.name && !isDemoClientRecord(c));
    fs.writeFileSync(CLIENTS_STORAGE_FILE, JSON.stringify(realOnly, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing persisted clients:', err);
  }
}

let genAIClient: GoogleGenAI | null = null;
function isAnalysisOnlyTotemSymbol(value: unknown): boolean {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    return Boolean(getTotemAnimalStrict(value.trim()));
  } catch {
    return false;
  }
}

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Location Search API (Dünya çapında şehir, kasaba & yerleşim arama)
  app.get('/api/locations/search', async (req: Request, res: Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const country = typeof req.query.country === 'string' ? req.query.country : undefined;
      if (!q.trim()) {
        return res.json({ success: true, locations: [] });
      }
      const locations = await searchGlobalLocationsApi(q, country);
      return res.json({ success: true, locations });
    } catch (err: unknown) {
      console.error('Location search error:', err);
      return res.status(500).json({ success: false, error: 'Konum araması sırasında bir hata oluştu.' });
    }
  });

  // Location Resolve API
  app.post('/api/locations/resolve', async (req: Request, res: Response) => {
    try {
      const { query, countryCode, lat, lon } = req.body || {};
      if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
        const resolved = resolveLocationSync({ lat, lon, countryCode });
        return res.json({ success: true, resolved: true, location: resolved });
      }

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ success: false, resolved: false, error: 'Doğum yeri boş olamaz.' });
      }

      try {
        const resolved = await resolveLocationAsync(query, countryCode);
        return res.json({ success: true, resolved: true, location: resolved });
      } catch (syncErr) {
        if (syncErr instanceof LocationValidationError && syncErr.candidates && syncErr.candidates.length > 1) {
          return res.status(400).json({
            success: false,
            resolved: false,
            ambiguous: true,
            error: syncErr.message,
            candidates: syncErr.candidates
          });
        }

        return res.status(400).json({
          success: false,
          resolved: false,
          error: syncErr instanceof Error ? syncErr.message : 'Doğum yeri tanınamadı. Lütfen şehir ve ülke adını kontrol edin.'
        });
      }
    } catch (err: unknown) {
      return res.status(500).json({ success: false, error: 'Konum doğrulama hatası.' });
    }
  });

  // Admin session: password never reaches the browser after verification.
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const password = getAdminPassword();
    if (!password) return res.status(503).json({ success: false, error: 'Stüdyo yönetici şifresi sunucu ortamında yapılandırılmamış.' });
    const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
    if (isLoginRateLimited(clientKey, 10)) {
      return res.status(429).json({ success: false, error: 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.' });
    }
    const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
    const suppliedBuffer = Buffer.from(supplied);
    const expectedBuffer = Buffer.from(password);
    const valid = suppliedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
    if (!valid) {
      recordLoginFailure(clientKey);
      return res.status(401).json({ success: false, error: 'Yönetici şifresi hatalı.' });
    }
    loginFailures.delete(clientKey);
    const session = createAdminSession();
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', ADMIN_SESSION_COOKIE + '=' + encodeURIComponent(session) + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=' + ADMIN_SESSION_TTL_SECONDS + secureFlag);
    return res.json({ success: true });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', ADMIN_SESSION_COOKIE + '=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' + secureFlag);
    return res.json({ success: true });
  });

  app.get('/api/auth/session', (req: Request, res: Response) => {
    return res.json({ authenticated: isValidAdminSession(req), configured: Boolean(getAdminPassword()) });
  });
  // Client Intake API (Danışan Formu Kaydı & Doğrulaması)
  app.post('/api/client-intake', async (req: Request, res: Response) => {
    const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(intakeRequests, clientKey, 20)) {
      return res.status(429).json({ success: false, error: 'Çok fazla form gönderimi. Lütfen daha sonra tekrar deneyin.' });
    }
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Geçersiz form verisi.' });
      }
      const body = req.body as Record<string, any>;
      const firstName = (body.firstName || '').trim();
      const lastName = (body.lastName || '').trim();
      const combinedName = (body.name || `${firstName} ${lastName}`).trim();
      const phone = (body.phone || '').trim();
      const email = (body.email || '').trim();
      const birthDate = (body.birthDate || '').trim();
      const birthTime = (body.birthTime || '').trim();
      const birthPlace = (body.birthPlace || '').trim();
      const motherName = (body.motherName || '').trim();
      const personalStory = (body.personalStory || '').trim();
      const enneagramAnswers = body.enneagramAnswers || {};
      const totemAnswers = body.totemAnswers || {};

      const MAX_TEXT_LENGTH = 500;
      const MAX_STORY_LENGTH = 5000;

      // 1. Ad & Soyad Doğrulaması
      if (!combinedName || combinedName.length < 2 || combinedName.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({
          success: false,
          error: 'Lütfen ad ve soyadınızı eksiksiz giriniz.'
        });
      }

      // 2. Telefon Numarası Doğrulaması (Zorunlu, Türkiye & Uluslararası format kontrolü)
      const phoneValidation = normalizePhoneNumber(phone);
      if (!phoneValidation.valid) {
        return res.status(400).json({
          success: false,
          error: phoneValidation.error || 'Geçersiz telefon numarası.'
        });
      }

      // 3. E-posta Adresi Doğrulaması (Zorunlu, Format kontrolü)
      if (!email || email.length > MAX_TEXT_LENGTH || !isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi giriniz (Örn: isim@domain.com).'
        });
      }

      // 4. Doğum Tarihi Doğrulaması (Gerçek takvim tarihi kontrolü, 31.02 gibi geçersiz tarihler reddedilir)
      if (!birthDate) {
        return res.status(400).json({
          success: false,
          error: 'Doğum tarihi zorunludur.'
        });
      }
      const dateValidation = isValidCalendarDate(birthDate);
      if (!dateValidation.valid) {
        return res.status(400).json({
          success: false,
          error: dateValidation.error || 'Geçersiz doğum tarihi. Lütfen gerçek bir takvim tarihi giriniz.'
        });
      }

      // 5. Doğum Saati Doğrulaması
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)) {
        return res.status(400).json({
          success: false,
          error: 'Doğum saati zorunludur (Yükselen burç hesaplaması için gereklidir).'
        });
      }

      // 6. Doğum Yeri Doğrulaması (Kesinlikle İstanbul'a fallback yapılmaz!)
      if (!birthPlace || birthPlace.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({
          success: false,
          error: 'Doğum yeri zorunludur.'
        });
      }
      let resolvedLocation: CityLocation;
      if (typeof body.birthLatitude === 'number' && typeof body.birthLongitude === 'number' && !isNaN(body.birthLatitude) && !isNaN(body.birthLongitude)) {
        resolvedLocation = resolveCityLocation({
          name: birthPlace,
          lat: body.birthLatitude,
          lon: body.birthLongitude,
          timezone: body.birthTimezone,
          city: body.birthCity,
          region: body.birthRegion,
          country: body.birthCountry,
          countryCode: body.birthCountryCode,
          defaultTz: body.birthTimezoneOffset
        });
      } else {
        try {
          const asyncLoc = await resolveLocationAsync(birthPlace, body.birthCountryCode);
          resolvedLocation = resolveCityLocation(asyncLoc);
        } catch (err: unknown) {
          return res.status(400).json({
            success: false,
            error: err instanceof Error ? err.message : 'Doğum yeri tanınamadı. Lütfen geçerli bir şehir giriniz.'
          });
        }
      }

      // 7. Anne Adı Doğrulaması (Ebced & Yıldızname soy kökü için zorunlu)
      if (!motherName || motherName.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({
          success: false,
          error: 'Anne adı zorunludur (Ebced ve soy arketipi hesaplamaları için gereklidir).'
        });
      }

      if (personalStory.length > MAX_STORY_LENGTH) {
        return res.status(400).json({ success: false, error: `Kişisel hikâye çok uzun (maksimum ${MAX_STORY_LENGTH} karakter).` });
      }

      // 8. Enneagram Ham Cevapları (5 sorunun tamamı)
      const enneaKeys = Object.keys(enneagramAnswers);
      const expectedEnneaIds = ENNEAGRAM_MINI_TEST_QUESTIONS.map(question => String(question.id)).sort();
      const providedEnneaIds = enneaKeys.slice().sort();
      const validEnneaShape = enneaKeys.length === expectedEnneaIds.length
        && providedEnneaIds.every((id, index) => id === expectedEnneaIds[index])
        && enneaKeys.every(id => Number.isInteger(enneagramAnswers[id]) && enneagramAnswers[id] >= 1 && enneagramAnswers[id] <= 9);
      if (!validEnneaShape) {
        return res.status(400).json({
          success: false,
          error: `Enneagram testi eksik veya geçersiz (${enneaKeys.length}/${expectedEnneaIds.length}). Lütfen tüm soruları geçerli seçeneklerle yanıtlayınız.`
        });
      }

      // 9. Totem Hayvanı Ham Cevapları (15 sorunun tamamı)
      const totemKeys = Object.keys(totemAnswers);
      const validTotemAnswers = TOTEM_BEHAVIORAL_QUESTIONS.every(question => {
        const answer = totemAnswers?.[question.id];
        return typeof answer === 'string' && question.options.some(option => option.id === answer);
      });
      if (totemKeys.length !== TOTEM_BEHAVIORAL_QUESTIONS.length || !validTotemAnswers) {
        return res.status(400).json({
          success: false,
          error: `Totem testi eksik veya geçersiz (${totemKeys.length}/${TOTEM_BEHAVIORAL_QUESTIONS.length}). Lütfen tüm soruları geçerli seçeneklerle yanıtlayınız.`
        });
      }

      // 10. Ham cevaplardan stüdyo için arketip ve tip hesaplama
      const enneaResult = calculateEnneagramFromAnswers(enneagramAnswers);
      const totemResult = calculateBehavioralTotemResult(totemAnswers, enneaResult.type);

      // Public intake must never be able to choose an existing client ID or forge timestamps.
      // This prevents an unauthenticated submission from overwriting another client's record.
      const clientId = `client_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
      const nowIso = new Date().toISOString();

      const newClient: PersonData = {
        id: clientId,
        name: combinedName,
        phone: phoneValidation.normalized,
        email: email.toLowerCase(),
        birthDate: birthDate,
        birthTime: birthTime,
        birthPlace: resolvedLocation.displayName || resolvedLocation.name || birthPlace,
        birthCity: resolvedLocation.city || resolvedLocation.name,
        birthRegion: resolvedLocation.region,
        birthCountry: resolvedLocation.country,
        birthCountryCode: resolvedLocation.countryCode,
        birthLatitude: resolvedLocation.lat,
        birthLongitude: resolvedLocation.lon,
        birthTimezone: resolvedLocation.timezone,
        birthTimezoneOffset: resolvedLocation.defaultTz,
        motherName: motherName,
        zodiacSystem: 'Tropical',
        enneagramType: enneaResult.type,
        enneagramWing: enneaResult.wing,
        enneagramAnswers: { ...enneagramAnswers },
        totemAnswers: { ...totemAnswers },
        primaryTotemId: totemResult.primaryTotem?.id,
        secondaryTotemId: totemResult.secondaryTotem?.id,
        shadowTotemId: totemResult.shadowTotem?.id,
        totemConfidenceScore: totemResult.confidenceScore,
        personalStory: personalStory || undefined,
        notes: personalStory ? `Danışan Formu Notu: ${personalStory}` : undefined,
        status: 'new',
        source: 'client_form',
        createdAt: nowIso,
        updatedAt: nowIso
      };

      // Sunucu kalıcı hafızasına kaydet
      const existingClients = getPersistedClients();
      const existingIndex = existingClients.findIndex(c => c.id === newClient.id);
      let updatedClients: PersonData[];
      if (existingIndex >= 0) {
        updatedClients = [...existingClients];
        updatedClients[existingIndex] = newClient;
      } else {
        updatedClients = [newClient, ...existingClients];
      }
      savePersistedClients(updatedClients);

      return res.status(200).json({
        success: true,
        clientId: newClient.id,
        message: 'Danışan kabul formu başarıyla sunucuya kaydedildi ve stüdyoya iletildi.'
      });
    } catch (err: unknown) {
      console.error('Client intake error:', err);
      return res.status(500).json({
        success: false,
        error: 'Form işlenirken sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    }
  });

  // Danışanları listele (hem /api/clients hem /api/client-intake)
  app.get(['/api/client-intake', '/api/clients'], requireAdmin, (req: Request, res: Response) => {
    const clients = getPersistedClients();
    res.json({ success: true, clients });
  });

  // Danışan silme
  app.delete(['/api/clients/:id', '/api/client-intake/:id'], requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const clients = getPersistedClients();
    const updated = clients.filter(c => c.id !== id);
    savePersistedClients(updated);
    res.json({ success: true, clients: updated });
  });

  // Danışan senkronizasyonu (Stüdyo ile sunucu arası iki yönlü birleştirme)
  app.post('/api/clients/sync', requireAdmin, (req: Request, res: Response) => {
    try {
      const { localClients = [], deletedClientIds = [] } = req.body || {};
      const deletedIds = new Set<string>(
        Array.isArray(deletedClientIds)
          ? deletedClientIds.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
          : []
      );

      // Tombstone ile gelen silmeler önce sunucudan kaldırılır; böylece sonraki
      // senkronizasyonlarda silinen danışan yeniden dirilemez.
      if (deletedIds.size > 0) {
        const currentClients = getPersistedClients();
        savePersistedClients(currentClients.filter(c => !deletedIds.has(c.id)));
      }

      const serverClients = getPersistedClients();
      
      const mergedMap = new Map<string, PersonData>();
      // First insert server clients
      serverClients.forEach(c => {
        if (c && c.id && !DEMO_ACCOUNT_IDS.has(c.id) && !deletedIds.has(c.id)) {
          mergedMap.set(c.id, c);
        }
      });
      // Merge local clients
      if (Array.isArray(localClients)) {
        localClients.forEach((c: PersonData) => {
          if (c && c.id && !DEMO_ACCOUNT_IDS.has(c.id) && !deletedIds.has(c.id)) {
            if (!mergedMap.has(c.id)) {
              mergedMap.set(c.id, c);
            } else {
              const existing = mergedMap.get(c.id)!;
              const existingTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
              const localTime = new Date(c.updatedAt || c.createdAt || 0).getTime();
              if (localTime > existingTime) {
                mergedMap.set(c.id, c);
              }
            }
          }
        });
      }

      const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      savePersistedClients(mergedList);
      res.json({ success: true, clients: mergedList });
    } catch (err: unknown) {
      console.error('Client sync error:', err);
      res.status(500).json({ success: false, error: 'Danışan senkronizasyonu sırasında sunucuda bir hata oluştu.' });
    }
  });

  // Deep AI Esoteric & Artistic Synthesis (supports both /api/ai/deep-synthesis and /api/ai/synthesize)
  const handleSynthesis = async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      const person = body.person || body.analysisData || {};
      const numerology = body.numerology || {};
      const astrology = body.astrology || {};
      const enneagram = body.enneagram || {};
      const parameters = body.parameters || body.designParameters || {};
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true,
          message: 'Gemini API anahtarı bulunamadı, yerel hesaplama motoru kullanılıyor.'
        });
      }

      const clientName = person.name?.trim();
      const birthDate = person.birthDate?.trim();
      const lifePath = numerology.lifePathNumber || person.lifePath;
      const lifePathTitle = numerology.lifePathTitle;
      const sunSign = astrology.sunSign;
      const moonSign = astrology.moonSign;
      const ascSign = astrology.ascendantSign;
      const dominantElement = astrology.dominantElement;
      const enneaType = enneagram.wing || enneagram.typeName;
      const coreMotivation = enneagram.coreMotivation;
      const shadowTraits = Array.isArray(enneagram.shadowTraits) && enneagram.shadowTraits.length > 0
        ? enneagram.shadowTraits.join(', ')
        : (enneagram.shadowAspect || '');
      // Totems are analysis-only. Never use a personal totem as a fallback visual symbol.
      const mainSymbol = parameters.mainSymbol;

       if (isAnalysisOnlyTotemSymbol(mainSymbol)) {
         return res.status(400).json({
           success: false,
           error: 'Totemler yalnızca analiz katmanında kullanılabilir.',
           message: 'Hayvan figürü veya totem adı final görsel sembolü olarak kullanılamaz. Lütfen geometrik, botanik veya kutsal bir sembol seçin.'
         });
       }


      // 1. ANA KURAL: VERİ UYDURMA YOK - Eksik kişisel veri kontrolü
      if (!clientName || !birthDate || !lifePath || !sunSign || !enneaType || !mainSymbol) {
        return res.status(400).json({
          success: false,
          missingData: true,
          error: 'Bu sonuç için gerekli kişisel veri eksik.',
          message: 'Kişisel veri eksikken tahmini veya sabit varsayılan verilerle ezoterik sentez üretilemez. Lütfen danışanın doğum tarihi, ismi ve analiz verilerini tamamlayın.'
        });
      }

      const dateValidation = isValidCalendarDate(birthDate);
      if (!dateValidation.valid) {
        return res.status(400).json({
          success: false,
          missingData: true,
          error: dateValidation.error || 'Geçersiz doğum tarihi.',
          message: 'Gerçek bir takvim tarihi girilmeden kişisel ezoterik sentez üretilemez.'
        });
      }

      const secondarySymbols = Array.isArray(parameters.secondarySymbols) && parameters.secondarySymbols.length > 0
        ? parameters.secondarySymbols.join(', ')
        : 'Kutsal Geometri & Botanik Akış';
      const selectedStyles = Array.isArray(parameters.selectedStyles) && parameters.selectedStyles.length > 0
        ? parameters.selectedStyles.join(', ')
        : 'Fine Line, Geometric';
      const bodyPlacement = parameters.bodyPlacement || 'Önkol İç';
      const visualAtmosphere = parameters.visualAtmosphere || 'Mistik & Ezoterik';
      const colorScheme = parameters.colorScheme || 'Saf Monokrom Siyah';

      const prompt = `
Sen dünya çapında ünlü, ezoterik sembolizm, numeroloji, kadim astroloji ve profesyonel dövme sanatı konusunda uzman bir master dövme sanatçısısın.
Aşağıdaki kişi için kişiselleştirilmiş dövme tasarım reçetesini derinleştir, her sembolün neden seçildiğini ve kişinin ruhsal-matematiksel profiliyle nasıl birleştiğini şiirsel ama teknik açıdan kusursuz bir üslupla açıkla.

Kişi: ${clientName} (Doğum: ${birthDate})
Numeroloji: Yaşam Yolu ${lifePath} (${lifePathTitle})
Astroloji: Güneş ${sunSign}, Ay ${moonSign}, Yükselen ${ascSign}, Hakim Element: ${dominantElement}
Enneagram: ${enneaType} (Temel Motivasyon: ${coreMotivation}, Gölge: ${shadowTraits})
Seçilen Semboller: Ana Sembol: ${mainSymbol}, Yardımcılar: ${secondarySymbols}
Dövme Stilleri: ${selectedStyles}
Yerleşim & Kompozisyon: ${bodyPlacement}
Atmosfer & Renk: ${visualAtmosphere}, ${colorScheme}

Lütfen şu formatta geçerli bir JSON yanıt ver:
{
  "esotericInsight": "Kişinin ezoterik haritası ve dövmenin ruhsal anlamı (2-3 paragraf)",
  "technicalArtistNotes": "Dövme sanatçısı için iğne derinliği, çizgi kalınlığı, whip shading ve anatomik yerleşim rehberi",
  "symbolismDeepDive": [
    {
      "symbol": "Sembol adı",
      "reason": "Numeroloji, astroloji ve enneagramla kurulan derin bağlantı gerekçesi"
    }
  ],
  "enhancedPrompt": "Midjourney v6 için ultra detaylı, İngilizce master prompt"
}
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: unknown) {
      console.warn('AI synthesis fallback triggered:', err);
      res.json({ 
        success: false, 
        fallback: true,
        error: err instanceof Error ? err.message : String(err),
        message: 'Canlı AI servisi meşgul, yerel matematiksel ezoterik sentez devrede.' 
      });
    }
  };

  app.post('/api/ai/deep-synthesis', requireAdmin, handleSynthesis);
  app.post('/api/ai/synthesize', requireAdmin, handleSynthesis);

  // Prompt Variations Generator
  app.post('/api/ai/refine-prompts', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { recipe } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true,
          message: 'Gemini API anahtarı ayarlanmamış.'
        });
      }

      const prompt = `
Aşağıdaki dövme tasarım reçetesi için Midjourney, Flux ve Stable Diffusion'da kullanılabilecek 3 farklı sanatsal varyasyon AI promptu üret.

Reçete Başlığı: ${recipe.title}
Stiller: ${recipe.parameters.selectedStyles.join(', ')}
Ana Sembol: ${recipe.parameters.mainSymbol}
Yardımcılar: ${recipe.parameters.secondarySymbols.join(', ')}
Yerleşim: ${recipe.parameters.bodyPlacement}
Atmosfer: ${recipe.parameters.visualAtmosphere}

Lütfen JSON formatında yanıt ver:
{
  "variations": [
    {
      "name": "Varyasyon 1 Başlığı (örneğin: Ultra-Fine Line & Mistik Sigil)",
      "styleFocus": "Stil odağı",
      "prompt": "Tam İngilizce AI görsel üretim promptu",
      "tips": "Bu varyasyonun en iyi çalıştığı modeller ve püf noktalar"
    }
  ]
}
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: unknown) {
      console.warn('AI prompts fallback triggered:', err);
      res.json({ 
        success: false, 
        fallback: true,
        message: 'Varyasyon servisi meşgul, ana prompt kütüphanesi aktif.' 
      });
    }
  });

  // Visual Sketch Generation (Tattoo Flash & Stencil Linework with Auto-Fallback & Seed Randomization)
  app.post('/api/ai/generate-sketch', requireAdmin, async (req: Request, res: Response) => {
    const { 
      prompt, 
      recipe, 
      seed: requestedSeed, 
      requestId: requestedReqId, 
      variationIndex: requestedVarIndex,
      mode = 'flash' // 'stencil' | 'flash'
    } = req.body;
    
    // Generate unique tracking parameters if not provided
    const seed = typeof requestedSeed === 'number' ? requestedSeed : Math.floor(Math.random() * 1000000);
    const variationIndex = typeof requestedVarIndex === 'number' ? requestedVarIndex : 1;
    const requestId = requestedReqId || `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Extract rich metadata for high-precision vector stencil & prompt building
    const mainSymbol = recipe?.parameters?.mainSymbol;

    if (isAnalysisOnlyTotemSymbol(mainSymbol)) {
      return res.status(400).json({
        success: false,
        error: 'Totemler yalnızca analiz katmanında kullanılabilir.',
        message: 'Hayvan figürü veya totem adı final görsel sembolü olarak kullanılamaz.'
      });
    }

    const lifePathNumber = recipe?.numerology?.lifePathNumber;
    const sunSign = recipe?.astrology?.sunSign;
    const clientName = recipe?.clientName || recipe?.personData?.name;

    if (!recipe || !mainSymbol || !lifePathNumber || !sunSign) {
      return res.status(400).json({
        success: false,
        missingData: true,
        error: 'Bu sonuç için gerekli kişisel reçete verisi eksik.',
        message: 'Kişisel sembol, yaşam yolu ve astrolojik veriler olmadan dövme taslağı veya stencil üretilemez.'
      });
    }

    const secondarySymbols = Array.isArray(recipe?.parameters?.secondarySymbols) && recipe.parameters.secondarySymbols.length > 0
      ? recipe.parameters.secondarySymbols
      : ['Kutsal Geometri', 'Botanik Akış'];
    const subtleDetails = Array.isArray(recipe?.subtleDetails) && recipe.subtleDetails.length > 0
      ? recipe.subtleDetails
      : ['Kozmik Takımyıldız'];
    const moonSign = recipe?.astrology?.moonSign || '';
    const ascendantSign = recipe?.astrology?.ascendantSign || '';
    const hasDivine19 = recipe?.numerology?.divineHelp19?.has19 ?? false;
    const styles = recipe?.parameters?.selectedStyles || ['Fine Line', 'Geometric'];
    const colorScheme = recipe?.parameters?.colorScheme || 'Saf Monokrom Siyah';
    const composition = recipe?.parameters?.composition || 'Merkezi Kutsal Odak';
    const orientation = recipe?.parameters?.orientation || 'Dikey (Anatomik)';
    const bodyPlacement = recipe?.parameters?.bodyPlacement || 'Önkol İç';

    // Select the optimal prompt based on mode
    let targetPrompt = prompt;
    if (!targetPrompt) {
      if (mode === 'stencil') {
        targetPrompt = recipe?.masterOutlinePrompt || recipe?.masterEnglishPrompt || `professional tattoo stencil line art transfer sheet, pure black vector outline on clean white background, tattoo linework, stencil-ready, clean intentional contours, featuring ${mainSymbol} and ${secondarySymbols.join(', ')}`;
      } else {
        targetPrompt = recipe?.masterShadedPrompt || recipe?.masterEnglishPrompt || `professional tattoo flash sheet design, finished black and grey tattoo artwork, tattoo design, tattoo flash, stencil-ready, tattoo linework, featuring ${mainSymbol} and ${secondarySymbols.join(', ')}`;
      }
    }

    const negativePrompt = recipe?.negativePrompt || `decorative wallpaper, seamless pattern, ornamental background pattern, generic fantasy illustration, concept art, book cover, poster design, logo, emblem, random collection of symbols, separate floating symbols, unrelated decorative elements, excessive geometry, overcrowded composition, tattoo mockup, skin, body, arm, hand, photograph, human model, 3D render, photorealistic skin pores, blurry gradients, unreadable micro clutter, messy background, watermarks, text lettering, signatures, oversaturated rainbow colors, distorted anatomy, extra limbs, muddy gray fills`;

    const ai = getGenAI();
    let aiFailureReason = '';

    if (ai) {
      try {
        const fullAiPrompt = `${targetPrompt} [Variation #${variationIndex}, Seed: ${seed}]. Strict instructions: single cohesive tattoo composition, stencil-ready, clean background. DO NOT include: ${negativePrompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullAiPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1'
            }
          }
        });

        let imageUrl: string | null = null;
        let imageMime = 'image/png';
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data && part.inlineData.data.length > 50) {
              const rawData = part.inlineData.data;
              const buffer = Buffer.from(rawData, 'base64');
              // Verify buffer has valid image magic bytes (PNG: 89 50 4E 47 or JPEG: FF D8 FF)
              const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
              const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
              if (isPng || isJpeg) {
                imageMime = isJpeg ? 'image/jpeg' : 'image/png';
                imageUrl = `data:${imageMime};base64,${rawData}`;
                break;
              }
            }
          }
        }

        if (imageUrl) {
          return res.json({ 
            success: true, 
            imageUrl, 
            svgUrl: null,
            imageFormat: 'png',
            mimeType: imageMime,
            isAiLive: true,
            isFallback: false,
            modelUsed: 'gemini-3.1-flash-lite-image',
            requestId,
            seed,
            variationIndex,
            mode,
            promptUsed: fullAiPrompt,
            message: `Canlı Gemini Görsel Modeli ile yeni ${mode === 'stencil' ? 'Termal Stencil Şablonu' : 'Dövme Tasarım Flaşı'} (#${variationIndex}) başarıyla üretildi.` 
          });
        } else {
          aiFailureReason = 'Gemini modelinden geçerli görüntü formatı (PNG/JPEG) dönmedi.';
        }
      } catch (err: any) {
        aiFailureReason = err?.message || 'Kota/bağlantı sınırı';
        console.warn(`[${requestId}] Gemini image model unavailable/quota-limited (${err?.status || 'ERR'}):`, err?.message || err);
      }
    } else {
      aiFailureReason = 'GEMINI_API_KEY yapılandırılmamış';
    }

    // High-Precision Procedural Esoteric Stencil & Flash Engine (Dynamic Seed Variation)
    try {
      const fallbackSvgDataUrl = generateEsotericTattooStencilSvg({
        mainSymbol,
        secondarySymbols,
        subtleDetails,
        lifePathNumber,
        sunSign,
        moonSign,
        ascendantSign,
        hasDivine19,
        styles,
        colorScheme,
        composition,
        orientation,
        bodyPlacement,
        clientName,
        seed,
        variationIndex,
        requestId,
        mode: mode as 'stencil' | 'flash'
      });

      // Extract raw SVG text from base64 or utf8 data URL
      let svgBuffer: Buffer;
      if (fallbackSvgDataUrl.includes(';base64,')) {
        const b64 = fallbackSvgDataUrl.split(';base64,')[1];
        svgBuffer = Buffer.from(b64, 'base64');
      } else {
        const commaIdx = fallbackSvgDataUrl.indexOf(',');
        svgBuffer = Buffer.from(decodeURIComponent(fallbackSvgDataUrl.substring(commaIdx + 1)), 'utf-8');
      }

      // Convert SVG to ultra-crisp, high-fidelity 1400x1800 PNG using Sharp
      // This produces a 100% compliant, standard PNG file with magic header 0x89 0x50 0x4E 0x47
      const isStencil = mode === 'stencil';
      const pngBuffer = await sharp(svgBuffer)
        .resize(1400, 1800, {
          fit: 'contain',
          background: isStencil ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 8, g: 8, b: 8, alpha: 1 }
        })
        .png({ compressionLevel: 8 })
        .toBuffer();

      // Verify the generated PNG header
      const isValidPng = pngBuffer.length > 500 &&
        pngBuffer[0] === 0x89 &&
        pngBuffer[1] === 0x50 &&
        pngBuffer[2] === 0x4e &&
        pngBuffer[3] === 0x47;

      if (!isValidPng) {
        throw new Error('Üretilen PNG imza doğrulaması başarısız oldu.');
      }

      const pngDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

      return res.json({ 
        success: true, 
        imageUrl: pngDataUrl, 
        svgUrl: fallbackSvgDataUrl,
        imageFormat: 'png',
        mimeType: 'image/png',
        isAiLive: false,
        isFallback: true,
        modelUsed: isStencil ? 'Termal Transfer Vektör & Raster Stencil Motoru (Sharp 1400x1800)' : 'Ezoterik Dövme Flaşı Raster Motoru (Sharp 1400x1800)',
        requestId,
        seed,
        variationIndex,
        mode,
        promptUsed: targetPrompt,
        aiStatusNote: aiFailureReason.includes('quota') || aiFailureReason.includes('429') 
          ? 'Google Gemini görsel API kotası (429: Free Tier Limiti 0) nedeniyle sistem otomatik olarak yüksek çözünürlüklü (1400x1800) yerel PNG/Vektör Motoruna geçti.'
          : `Görsel motoru durumu: ${aiFailureReason || 'Yerel motor aktif'}. Gerçek PNG başarıyla derlendi.`,
        message: `${mode === 'stencil' ? 'Termal Transfer Stencil Şablonu (03RL)' : 'Dövme Tasarım Flaşı'} (#${variationIndex}, Tohum: #${seed}) başarıyla oluşturuldu.` 
      });
    } catch (fallbackErr: unknown) {
      console.error(`[${requestId}] Fallback generation error:`, fallbackErr);
      return res.status(500).json({ 
        success: false, 
        error: 'Görsel oluşturulurken bir hata meydana geldi. Bozuk dosya indirilmesi engellendi.' 
      });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dövme Tasarım Asistanı server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
