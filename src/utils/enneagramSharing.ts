/**
 * ENNEAGRAM TESTİNİ MÜŞTERİYE GÖNDERME VE CEVAPLARI İÇE AKTARMA YARDIMCISI
 * (CLIENT ENNEAGRAM QUIZ SHARING & ANSWER IMPORT ENGINE)
 */

import { ENNEAGRAM_MINI_TEST_QUESTIONS, calculateEnneagramFromAnswers, ENNEAGRAM_TYPES } from './enneagram';
import { parseClientTotemAnswers } from './totemSharing';

/**
 * Müşteriye gönderilecek zengin WhatsApp mesaj metnini oluşturur.
 */
export function generateClientWhatsAppQuizMessage(clientName: string = 'Danışanımız', customUrl?: string): string {
  const testUrl = customUrl || `${window.location.origin}/?mode=enneagram-quiz&client=${encodeURIComponent(clientName)}`;

  let msg = `✨ Merhaba ${clientName}! ✨\n\n`;
  msg += `Dövme tasarımınızın ezoterik ve psikolojik arketipini kusursuz belirleyebilmemiz için size özel 5 soruluk *Enneagram Mini Testi* hazırladık.\n\n`;
  msg += `📲 *Testi 1 dakikada telefondan çözmek için tıklayın:*\n${testUrl}\n\n`;
  msg += `─ VEYA BURADAN CEVAPLAYABİLİRSİNİZ ─\n\n`;

  ENNEAGRAM_MINI_TEST_QUESTIONS.forEach((q, idx) => {
    msg += `*${idx + 1}. ${q.question}*\n`;
    q.options.forEach((opt, optIdx) => {
      const letter = String.fromCharCode(65 + optIdx); // A, B, C...
      msg += `  ${letter}) ${opt.text} [${opt.description}]\n`;
    });
    msg += `\n`;
  });

  msg += `👉 Cevaplarınızı bana (örn: "1-A, 2-C, 3-B, 4-A, 5-D" şeklinde) ilettiğinizde tasarım reçetenize ve çizim rehberinize hemen yansıtacağız! ✨🖋️`;

  return msg;
}

/**
 * WhatsApp linki üretir.
 */
export function generateWhatsAppShareLink(phone: string = '', text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Cevapları transfer token'ına paketler: [ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Gizem]
 */
export function encodeAnswersToToken(answers: Record<number, number>, clientName: string = ''): string {
  const pairs = Object.entries(answers)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([qId, typeVal]) => `${qId}=${typeVal}`)
    .join(',');
  const safeName = clientName.trim() ? `|${clientName.trim()}` : '';
  return `[ENNEA-TOKEN:${pairs}${safeName}]`;
}

/**
 * Müşterinin WhatsApp'tan sanatçıya geri göndereceği hazır mesajı oluşturur.
 */
export function generateClientReturnWhatsAppMessage(
  answers: Record<number, number>,
  clientName: string = ''
): string {
  const calculated = calculateEnneagramFromAnswers(answers);
  const typeData = ENNEAGRAM_TYPES[calculated.type] || ENNEAGRAM_TYPES[4];
  const token = encodeAnswersToToken(answers, clientName);

  let msg = `✨ Merhaba! Enneagram Mini Testimi tamamladım:\n\n`;
  msg += `👤 *Danışan:* ${clientName || 'Danışan'}\n`;
  msg += `🔮 *Çıkan Arketip:* Tip ${calculated.wing} - ${typeData.typeName}\n`;
  msg += `🗝️ *Temel Motivasyon:* ${typeData.coreMotivation}\n\n`;
  msg += `📋 *Dövme Stüdyosu Aktarım Kodu:*\n${token}\n\n`;
  msg += `Bu kodu tasarım sisteminize yapıştırıp reçeteme doğrudan uygulayabilirsiniz! ✨`;

  return msg;
}

/**
 * Müşteriden gelen metni (Token, WhatsApp mesajı, '1-A, 2-C' veya '1:4, 2:5' formatı) ayrıştırır.
 */
export function parseClientAnswers(rawText: string): {
  answers: Record<number, number>;
  calculatedType: number;
  calculatedWing: string;
  clientName?: string;
  matchedCount: number;
} | null {
  if (!rawText || !rawText.trim()) return null;

  const text = rawText.trim();
  const answers: Record<number, number> = {};
  let detectedName: string | undefined = undefined;

  // 1. Token Formatı: [ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Gizem]
  const tokenMatch = text.match(/\[ENNEA-TOKEN:([^\]|]+)(?:\|([^\]]+))?\]/i);
  if (tokenMatch) {
    const pairsStr = tokenMatch[1];
    if (tokenMatch[2]) detectedName = tokenMatch[2].trim();

    pairsStr.split(',').forEach(p => {
      const [qStr, tStr] = p.split('=');
      const q = parseInt(qStr, 10);
      const t = parseInt(tStr, 10);
      if (!isNaN(q) && !isNaN(t) && t >= 1 && t <= 9) {
        answers[q] = t;
      }
    });

    if (Object.keys(answers).length > 0) {
      const calc = calculateEnneagramFromAnswers(answers);
      return {
        answers,
        calculatedType: calc.type,
        calculatedWing: calc.wing,
        clientName: detectedName,
        matchedCount: Object.keys(answers).length
      };
    }
  }

  // 2. Harf formatı: 1-A, 2-C, 3-B (veya 1. A, 2. B, 1: A, vb.)
  // Her sorunun seçenek harfini soru id'siyle eşleştir
  const letterMatches = text.matchAll(/(\d+)[\s.:\-)]+([A-Iİa-iı])/gi);
  let letterMatchCount = 0;
  for (const match of letterMatches) {
    const qId = parseInt(match[1], 10);
    const letter = match[2].toUpperCase();
    const charCode = letter === 'İ' ? 66 : letter.charCodeAt(0);
    const optIndex = charCode - 65; // A=0, B=1...

    const questionObj = ENNEAGRAM_MINI_TEST_QUESTIONS.find(q => q.id === qId);
    if (questionObj && questionObj.options[optIndex]) {
      answers[qId] = questionObj.options[optIndex].type;
      letterMatchCount++;
    }
  }

  if (letterMatchCount >= 2) {
    const calc = calculateEnneagramFromAnswers(answers);
    return {
      answers,
      calculatedType: calc.type,
      calculatedWing: calc.wing,
      matchedCount: letterMatchCount
    };
  }

  // 3. Sayı formatı: 1=4, 2: 5, 3-4 veya "1: 4"
  const numberPairs = text.matchAll(/(\d+)[\s:=–-]+([1-9])/g);
  let numCount = 0;
  for (const match of numberPairs) {
    const qId = parseInt(match[1], 10);
    const typeVal = parseInt(match[2], 10);
    if (qId >= 1 && qId <= 5 && typeVal >= 1 && typeVal <= 9) {
      answers[qId] = typeVal;
      numCount++;
    }
  }

  if (numCount >= 2) {
    const calc = calculateEnneagramFromAnswers(answers);
    return {
      answers,
      calculatedType: calc.type,
      calculatedWing: calc.wing,
      matchedCount: numCount
    };
  }

  // 4. Doğrudan Tip & Kanat Formatı: "Tip 4w5", "4w5", "Tip 4", "Enneagram 8w7"
  const directTypeMatch = text.match(/(?:Tip|Type|Enneagram)?\s*([1-9])\s*w\s*([1-9])/i);
  if (directTypeMatch) {
    const t = parseInt(directTypeMatch[1], 10);
    const w = parseInt(directTypeMatch[2], 10);
    return {
      answers: { 1: t, 2: t, 3: t, 4: t, 5: w },
      calculatedType: t,
      calculatedWing: `${t}w${w}`,
      matchedCount: 5
    };
  }

  const singleTypeMatch = text.match(/(?:Tip|Type|Enneagram)\s*([1-9])\b/i);
  if (singleTypeMatch) {
    const t = parseInt(singleTypeMatch[1], 10);
    const defWing = ENNEAGRAM_TYPES[t]?.wings[0] || `${t}w${t === 9 ? 1 : t + 1}`;
    return {
      answers: { 1: t, 2: t, 3: t, 4: t, 5: t },
      calculatedType: t,
      calculatedWing: defWing,
      matchedCount: 5
    };
  }

  return null;
}

/**
 * Danışan Kabul Formu verilerini tekil güvenli bir aktarım token'ına paketler.
 */
export function encodeClientIntakeToken(client: Record<string, any>): string {
  try {
    const compactPayload = {
      n: client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
      p: client.phone || '',
      e: client.email || '',
      bd: client.birthDate || '',
      bt: client.birthTime || '',
      bp: client.birthPlace || '',
      bc: client.birthCity || '',
      bco: client.birthCountry || '',
      lat: client.birthLatitude,
      lon: client.birthLongitude,
      tz: client.birthTimezone,
      mn: client.motherName || '',
      et: client.enneagramType,
      ew: client.enneagramWing,
      ea: client.enneagramAnswers,
      ta: client.totemAnswers,
      pt: client.primaryTotemId,
      st: client.secondaryTotemId,
      sht: client.shadowTotemId,
      ps: client.personalStory || ''
    };
    const jsonStr = JSON.stringify(compactPayload);
    const b64 = typeof window !== 'undefined' && typeof window.btoa === 'function'
      ? window.btoa(encodeURIComponent(jsonStr))
      : Buffer.from(jsonStr).toString('base64');
    return `[CLIENT-INTAKE:${b64}]`;
  } catch (err) {
    console.error('Failed encoding intake token:', err);
    return '';
  }
}

export interface UniversalParsedClient {
  kind: 'full_client' | 'enneagram_quiz' | 'totem_quiz';
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  birthCity?: string;
  birthCountry?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  birthTimezone?: string;
  motherName?: string;
  enneagramType?: number;
  enneagramWing?: string;
  enneagramAnswers?: Record<number, number>;
  totemAnswers?: Record<number, string>;
  primaryTotemId?: string;
  secondaryTotemId?: string;
  shadowTotemId?: string;
  totemConfidenceScore?: number;
  personalStory?: string;
}

/**
 * WhatsApp'tan veya panodan yapıştırılan HER TÜRLÜ danışan mesajını akıllıca çözer.
 */
export function parseUniversalClientImport(rawText: string): UniversalParsedClient | null {
  if (!rawText || !rawText.trim()) return null;
  const text = rawText.trim();

  // 1. [CLIENT-INTAKE:base64] formatı
  const fullIntakeMatch = text.match(/\[CLIENT-INTAKE:([A-Za-z0-9+/=_%-]+)\]/i);
  if (fullIntakeMatch) {
    try {
      const b64 = fullIntakeMatch[1];
      const decodedJson = typeof window !== 'undefined' && typeof window.atob === 'function'
        ? decodeURIComponent(window.atob(b64))
        : Buffer.from(b64, 'base64').toString('utf-8');
      const p = JSON.parse(decodedJson);
      if (p && (p.n || p.name)) {
        return {
          kind: 'full_client',
          name: p.n || p.name || 'Danışan',
          phone: p.p || p.phone,
          email: p.e || p.email,
          birthDate: p.bd || p.birthDate,
          birthTime: p.bt || p.birthTime,
          birthPlace: p.bp || p.birthPlace,
          birthCity: p.bc || p.birthCity,
          birthCountry: p.bco || p.birthCountry,
          birthLatitude: p.lat || p.birthLatitude,
          birthLongitude: p.lon || p.birthLongitude,
          birthTimezone: p.tz || p.birthTimezone,
          motherName: p.mn || p.motherName,
          enneagramType: p.et || p.enneagramType,
          enneagramWing: p.ew || p.enneagramWing,
          enneagramAnswers: p.ea || p.enneagramAnswers,
          totemAnswers: p.ta || p.totemAnswers,
          primaryTotemId: p.pt || p.primaryTotemId,
          secondaryTotemId: p.st || p.secondaryTotemId,
          shadowTotemId: p.sht || p.shadowTotemId,
          personalStory: p.ps || p.personalStory
        };
      }
    } catch (err) {
      console.warn('Error parsing CLIENT-INTAKE token:', err);
    }
  }

  // 2. [TOTEM-TOKEN:...] formatı veya Totem yanıtları
  const totemParsed = parseClientTotemAnswers(text);
  if (totemParsed) {
    const nameMatch = text.match(/(?:Danışan|İsim|Ad\s*Soyad|Adı)\s*[:=]\s*([^\n\r,]+)/i);
    const extractedName = (nameMatch ? nameMatch[1].trim() : totemParsed.clientName) || 'Danışan';
    const phoneMatch = text.match(/(?:Telefon|Tel|Phone|GSM)\s*[:=]\s*([+0-9\s-]{10,20})/i);
    const phone = phoneMatch ? phoneMatch[1].trim() : undefined;

    return {
      kind: 'totem_quiz',
      name: extractedName,
      phone,
      totemAnswers: totemParsed.answers,
      primaryTotemId: totemParsed.calculatedResult.primaryTotem.id,
      secondaryTotemId: totemParsed.calculatedResult.secondaryTotem.id,
      shadowTotemId: totemParsed.calculatedResult.shadowTotem.id,
      totemConfidenceScore: totemParsed.calculatedResult.confidenceScore
    };
  }

  // 3. [ENNEA-TOKEN:...] formatı veya Enneagram metin eşleşmesi
  const enneaParsed = parseClientAnswers(text);
  if (enneaParsed) {
    // Danışan adı metin içinden de aranabilir (örn: "Danışan: Melis Kaya" veya "İsim: Melis")
    const nameMatch = text.match(/(?:Danışan|İsim|Ad\s*Soyad|Adı)\s*[:=]\s*([^\n\r,]+)/i);
    const extractedName = (nameMatch ? nameMatch[1].trim() : enneaParsed.clientName) || 'Danışan';
    
    // Telefon da aranabilir
    const phoneMatch = text.match(/(?:Telefon|Tel|Phone|GSM)\s*[:=]\s*([+0-9\s-]{10,20})/i);
    const phone = phoneMatch ? phoneMatch[1].trim() : undefined;

    return {
      kind: 'enneagram_quiz',
      name: extractedName,
      phone,
      enneagramType: enneaParsed.calculatedType,
      enneagramWing: enneaParsed.calculatedWing,
      enneagramAnswers: enneaParsed.answers
    };
  }

  // 3. WhatsApp serbest metin danışan formu formatı
  const nameLine = text.match(/(?:Danışan|İsim|Ad\s*Soyad|Adı)\s*[:=]\s*([^\n\r]+)/i);
  if (nameLine) {
    const name = nameLine[1].replace(/[*_~]/g, '').trim();
    const phoneLine = text.match(/(?:Telefon|Tel|Phone|GSM)\s*[:=]\s*([^\n\r]+)/i);
    const birthLine = text.match(/(?:Doğum|Doğum\s*Tarihi)\s*[:=]\s*([^\n\r]+)/i);
    const motherLine = text.match(/(?:Anne\s*Adı|Anne)\s*[:=]\s*([^\n\r]+)/i);

    let birthDate: string | undefined = undefined;
    let birthTime: string | undefined = undefined;
    let birthPlace: string | undefined = undefined;

    if (birthLine) {
      const bStr = birthLine[1].replace(/[*_~]/g, '').trim();
      const dateM = bStr.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{4}-\d{2}-\d{2})/);
      if (dateM) birthDate = dateM[1];
      const timeM = bStr.match(/(\d{1,2}:\d{2})/);
      if (timeM) birthTime = timeM[1];
      const placePart = bStr.replace(/(\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{4}-\d{2}-\d{2})/, '').replace(/(\d{1,2}:\d{2})/, '').replace(/[,–-]/g, ' ').trim();
      if (placePart) birthPlace = placePart;
    }

    return {
      kind: 'full_client',
      name,
      phone: phoneLine ? phoneLine[1].replace(/[*_~]/g, '').trim() : undefined,
      birthDate,
      birthTime,
      birthPlace,
      motherName: motherLine ? motherLine[1].replace(/[*_~]/g, '').trim() : undefined
    };
  }

  return null;
}
