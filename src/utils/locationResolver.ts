import tzlookup from 'tz-lookup';

export interface ResolvedLocation {
  id: string;
  name: string;
  displayName: string;
  city: string;
  region?: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
  defaultTz?: number;
}

export class LocationValidationError extends Error {
  candidates?: ResolvedLocation[];
  constructor(
    message = 'Location validation error: Doğum yeri tanınamadı. Doğum haritası hesaplanabilmesi için geçerli bir şehir/konum girilmelidir.',
    candidates?: ResolvedLocation[]
  ) {
    super(message);
    this.name = 'LocationValidationError';
    this.candidates = candidates;
    Object.setPrototypeOf(this, LocationValidationError.prototype);
  }
}

/**
 * Kapsamlı Dünya Ülkeleri Listesi (ISO Kodları, Türkçe & İngilizce isimleri ve takma adları)
 */
export interface CountryDefinition {
  code: string;
  nameTr: string;
  nameEn: string;
  flag: string;
  aliases: string[];
}

export const COMMON_WORLD_COUNTRIES: CountryDefinition[] = [
  { code: 'TR', nameTr: 'Türkiye', nameEn: 'Turkey', flag: '🇹🇷', aliases: ['turkiye', 'turkey', 'turkei', 'tr'] },
  { code: 'US', nameTr: 'Amerika Birleşik Devletleri (ABD)', nameEn: 'United States', flag: '🇺🇸', aliases: ['united states', 'usa', 'abd', 'amerika', 'us', 'united states of america'] },
  { code: 'GB', nameTr: 'Birleşik Krallık (İngiltere)', nameEn: 'United Kingdom', flag: '🇬🇧', aliases: ['united kingdom', 'uk', 'ingiltere', 'great britain', 'england', 'britain', 'gb'] },
  { code: 'DE', nameTr: 'Almanya', nameEn: 'Germany', flag: '🇩🇪', aliases: ['germany', 'almanya', 'deutschland', 'de'] },
  { code: 'FR', nameTr: 'Fransa', nameEn: 'France', flag: '🇫🇷', aliases: ['france', 'fransa', 'fr'] },
  { code: 'IT', nameTr: 'İtalya', nameEn: 'Italy', flag: '🇮🇹', aliases: ['italy', 'italya', 'italia', 'it'] },
  { code: 'ES', nameTr: 'İspanya', nameEn: 'Spain', flag: '🇪🇸', aliases: ['spain', 'ispanya', 'espana', 'es'] },
  { code: 'CH', nameTr: 'İsviçre', nameEn: 'Switzerland', flag: '🇨🇭', aliases: ['switzerland', 'isvicre', 'schweiz', 'suisse', 'ch'] },
  { code: 'AT', nameTr: 'Avusturya', nameEn: 'Austria', flag: '🇦🇹', aliases: ['austria', 'avusturya', 'osterreich', 'at'] },
  { code: 'NL', nameTr: 'Hollanda', nameEn: 'Netherlands', flag: '🇳🇱', aliases: ['netherlands', 'hollanda', 'nederland', 'nl'] },
  { code: 'BE', nameTr: 'Belçika', nameEn: 'Belgium', flag: '🇧🇪', aliases: ['belgium', 'belcika', 'belgique', 'be'] },
  { code: 'SE', nameTr: 'İsveç', nameEn: 'Sweden', flag: '🇸🇪', aliases: ['sweden', 'isvec', 'sverige', 'se'] },
  { code: 'NO', nameTr: 'Norveç', nameEn: 'Norway', flag: '🇳🇴', aliases: ['norway', 'norvec', 'norge', 'no'] },
  { code: 'DK', nameTr: 'Danimarka', nameEn: 'Denmark', flag: '🇩🇰', aliases: ['denmark', 'danimarka', 'danmark', 'dk'] },
  { code: 'FI', nameTr: 'Finlandiya', nameEn: 'Finland', flag: '🇫🇮', aliases: ['finland', 'finlandiya', 'suomi', 'fi'] },
  { code: 'GR', nameTr: 'Yunanistan', nameEn: 'Greece', flag: '🇬🇷', aliases: ['greece', 'yunanistan', 'ellada', 'gr'] },
  { code: 'PT', nameTr: 'Portekiz', nameEn: 'Portugal', flag: '🇵🇹', aliases: ['portugal', 'portekiz', 'pt'] },
  { code: 'IE', nameTr: 'İrlanda', nameEn: 'Ireland', flag: '🇮🇪', aliases: ['ireland', 'irlanda', 'ie'] },
  { code: 'PL', nameTr: 'Polonya', nameEn: 'Poland', flag: '🇵🇱', aliases: ['poland', 'polonya', 'polska', 'pl'] },
  { code: 'CZ', nameTr: 'Çekya', nameEn: 'Czech Republic', flag: '🇨🇿', aliases: ['czech republic', 'cekya', 'czechia', 'cesko', 'cz'] },
  { code: 'HU', nameTr: 'Macaristan', nameEn: 'Hungary', flag: '🇭🇺', aliases: ['hungary', 'macaristan', 'magyarorszag', 'hu'] },
  { code: 'RO', nameTr: 'Romanya', nameEn: 'Romania', flag: '🇷🇴', aliases: ['romania', 'romanya', 'ro'] },
  { code: 'BG', nameTr: 'Bulgaristan', nameEn: 'Bulgaria', flag: '🇧🇬', aliases: ['bulgaria', 'bulgaristan', 'bg'] },
  { code: 'RU', nameTr: 'Rusya', nameEn: 'Russia', flag: '🇷🇺', aliases: ['russia', 'rusya', 'ru'] },
  { code: 'UA', nameTr: 'Ukrayna', nameEn: 'Ukraine', flag: '🇺🇦', aliases: ['ukraine', 'ukrayna', 'ua'] },
  { code: 'CA', nameTr: 'Kanada', nameEn: 'Canada', flag: '🇨🇦', aliases: ['canada', 'kanada', 'ca'] },
  { code: 'MX', nameTr: 'Meksika', nameEn: 'Mexico', flag: '🇲🇽', aliases: ['mexico', 'meksika', 'mx'] },
  { code: 'BR', nameTr: 'Brezilya', nameEn: 'Brazil', flag: '🇧🇷', aliases: ['brazil', 'brezilya', 'brasil', 'br'] },
  { code: 'AR', nameTr: 'Arjantin', nameEn: 'Argentina', flag: '🇦🇷', aliases: ['argentina', 'arjantin', 'ar'] },
  { code: 'CL', nameTr: 'Şili', nameEn: 'Chile', flag: '🇨🇱', aliases: ['chile', 'sili', 'cl'] },
  { code: 'CO', nameTr: 'Kolombiya', nameEn: 'Colombia', flag: '🇨🇴', aliases: ['colombia', 'kolombiya', 'co'] },
  { code: 'PE', nameTr: 'Peru', nameEn: 'Peru', flag: '🇵🇪', aliases: ['peru', 'pe'] },
  { code: 'JP', nameTr: 'Japonya', nameEn: 'Japan', flag: '🇯🇵', aliases: ['japan', 'japonya', 'nihon', 'nippon', 'jp'] },
  { code: 'KR', nameTr: 'Güney Kore', nameEn: 'South Korea', flag: '🇰🇷', aliases: ['south korea', 'guney kore', 'korea', 'kr'] },
  { code: 'CN', nameTr: 'Çin', nameEn: 'China', flag: '🇨🇳', aliases: ['china', 'cin', 'cn'] },
  { code: 'IN', nameTr: 'Hindistan', nameEn: 'India', flag: '🇮🇳', aliases: ['india', 'hindistan', 'bharat', 'in'] },
  { code: 'ID', nameTr: 'Endonezya', nameEn: 'Indonesia', flag: '🇮🇩', aliases: ['indonesia', 'endonezya', 'id'] },
  { code: 'MY', nameTr: 'Malezya', nameEn: 'Malaysia', flag: '🇲🇾', aliases: ['malaysia', 'malezya', 'my'] },
  { code: 'SG', nameTr: 'Singapur', nameEn: 'Singapore', flag: '🇸🇬', aliases: ['singapore', 'singapur', 'sg'] },
  { code: 'TH', nameTr: 'Tayland', nameEn: 'Thailand', flag: '🇹🇭', aliases: ['thailand', 'tayland', 'th'] },
  { code: 'VN', nameTr: 'Vietnam', nameEn: 'Vietnam', flag: '🇻🇳', aliases: ['vietnam', 'vn'] },
  { code: 'PH', nameTr: 'Filipinler', nameEn: 'Philippines', flag: '🇵🇭', aliases: ['philippines', 'filipinler', 'ph'] },
  { code: 'AE', nameTr: 'Birleşik Arap Emirlikleri (BAE)', nameEn: 'United Arab Emirates', flag: '🇦🇪', aliases: ['united arab emirates', 'bae', 'uae', 'dubai', 'ae'] },
  { code: 'SA', nameTr: 'Suudi Arabistan', nameEn: 'Saudi Arabia', flag: '🇸🇦', aliases: ['saudi arabia', 'suudi arabistan', 'sa'] },
  { code: 'QA', nameTr: 'Katar', nameEn: 'Qatar', flag: '🇶🇦', aliases: ['qatar', 'katar', 'qa'] },
  { code: 'KW', nameTr: 'Kuveyt', nameEn: 'Kuwait', flag: '🇰🇼', aliases: ['kuwait', 'kuveyt', 'kw'] },
  { code: 'EG', nameTr: 'Mısır', nameEn: 'Egypt', flag: '🇪🇬', aliases: ['egypt', 'misir', 'eg'] },
  { code: 'MA', nameTr: 'Fas', nameEn: 'Morocco', flag: '🇲🇦', aliases: ['morocco', 'fas', 'maroc', 'ma'] },
  { code: 'ZA', nameTr: 'Güney Afrika', nameEn: 'South Africa', flag: '🇿🇦', aliases: ['south africa', 'guney afrika', 'za'] },
  { code: 'AU', nameTr: 'Avustralya', nameEn: 'Australia', flag: '🇦🇺', aliases: ['australia', 'avustralya', 'au'] },
  { code: 'NZ', nameTr: 'Yeni Zelanda', nameEn: 'New Zealand', flag: '🇳🇿', aliases: ['new zealand', 'yeni zelanda', 'nz'] },
  { code: 'AZ', nameTr: 'Azerbaycan', nameEn: 'Azerbaijan', flag: '🇦🇿', aliases: ['azerbaijan', 'azerbaycan', 'baki', 'az'] },
  { code: 'GE', nameTr: 'Gürcistan', nameEn: 'Georgia', flag: '🇬🇪', aliases: ['georgia', 'gurcistan', 'ge'] },
  { code: 'KZ', nameTr: 'Kazakistan', nameEn: 'Kazakhstan', flag: '🇰🇿', aliases: ['kazakhstan', 'kazakistan', 'kz'] },
  { code: 'UZ', nameTr: 'Özbekistan', nameEn: 'Uzbekistan', flag: '🇺🇿', aliases: ['uzbekistan', 'ozbekistan', 'uz'] }
];

/**
 * Uluslararası ve Türkçe karakter normalizasyonu (ç, ş, ğ, ü, ö, ı, é, è, á, ã, ñ, ø, å, ä vb.)
 */
export function normalizeLocationText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[éèêë]/g, 'e')
    .replace(/[áàâäãå]/g, 'a')
    .replace(/[óòôöõø]/g, 'o')
    .replace(/[íìîï]/g, 'i')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ß]/g, 'ss')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Koordinatlardan gerçek IANA Timezone adını offline ve ultra hızlı tespit eder.
 */
export function getTimezoneForCoordinates(lat: number, lon: number): string {
  try {
    const tz = tzlookup(lat, lon);
    if (tz) return tz;
  } catch {
    // Coordinate might be in international waters or extreme polar edge
  }
  const hourOffset = Math.round(lon / 15);
  return hourOffset >= 0 ? `Etc/GMT-${hourOffset}` : `Etc/GMT+${Math.abs(hourOffset)}`;
}

/**
 * Belirli bir tarih ve saat için o konumun gerçek UTC saat farkını (DST dahil) hesaplar.
 */
export function getTimezoneOffsetHoursForDate(
  dateStr: string,
  timeStr = '12:00',
  timeZone = 'UTC',
  defaultTz = 3
): number {
  if (!dateStr || !dateStr.includes('-')) {
    return defaultTz;
  }
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);
  const [hStr, minStr] = (timeStr || '12:00').split(':');
  const hours = isNaN(parseInt(hStr, 10)) ? 12 : parseInt(hStr, 10);
  const minutes = isNaN(parseInt(minStr, 10)) ? 0 : parseInt(minStr, 10);

  // Türkiye özel tarihi kuralı kontrolü
  if (timeZone === 'Europe/Istanbul' || timeZone === 'Turkey' || defaultTz === 3) {
    if (year > 2016 || (year === 2016 && (month > 9 || (month === 9 && day >= 8)))) {
      return 3;
    }
  }

  try {
    const targetUtcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || 'UTC',
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });

    const parts = formatter.formatToParts(targetUtcDate);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      const match = tzPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const h = parseInt(match[2], 10);
        const m = parseInt(match[3] || '0', 10);
        return sign * (h + m / 60);
      }
    }
  } catch {
    // In case invalid timezone name was provided
  }

  return defaultTz;
}

export interface RawCitySeed {
  name: string;
  displayName: string;
  city: string;
  region?: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  aliases?: string[];
}

/**
 * 81 Türkiye İli, Popüler İlçeleri ve Dünya Çapındaki Metropoller
 */
export const OFFLINE_WORLD_LOCATIONS: RawCitySeed[] = [
  // --- TÜRKİYE (81 İL & ÖNEMLİ İLÇELER) ---
  { name: 'İstanbul', displayName: 'İstanbul, Türkiye', city: 'İstanbul', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 41.0082, lon: 28.9784, aliases: ['istanbul', 'i̇stanbul', 'stamboul', 'constantinople', 'istanbul turkiye', 'istanbul turkey'] },
  { name: 'Fatih', displayName: 'Fatih, İstanbul, Türkiye', city: 'İstanbul', region: 'Fatih', country: 'Türkiye', countryCode: 'TR', lat: 41.0186, lon: 28.9497, aliases: ['fatih', 'fatih istanbul'] },
  { name: 'Kadıköy', displayName: 'Kadıköy, İstanbul, Türkiye', city: 'İstanbul', region: 'Kadıköy', country: 'Türkiye', countryCode: 'TR', lat: 40.9910, lon: 29.0254, aliases: ['kadikoy', 'kadıköy', 'kadikoy istanbul'] },
  { name: 'Beşiktaş', displayName: 'Beşiktaş, İstanbul, Türkiye', city: 'İstanbul', region: 'Beşiktaş', country: 'Türkiye', countryCode: 'TR', lat: 41.0428, lon: 29.0077, aliases: ['besiktas', 'beşiktaş'] },
  { name: 'Üsküdar', displayName: 'Üsküdar, İstanbul, Türkiye', city: 'İstanbul', region: 'Üsküdar', country: 'Türkiye', countryCode: 'TR', lat: 41.0267, lon: 29.0153, aliases: ['uskudar', 'üsküdar'] },
  { name: 'Şişli', displayName: 'Şişli, İstanbul, Türkiye', city: 'İstanbul', region: 'Şişli', country: 'Türkiye', countryCode: 'TR', lat: 41.0602, lon: 28.9877, aliases: ['sisli', 'şişli'] },
  { name: 'Bakırköy', displayName: 'Bakırköy, İstanbul, Türkiye', city: 'İstanbul', region: 'Bakırköy', country: 'Türkiye', countryCode: 'TR', lat: 40.9833, lon: 28.8667, aliases: ['bakirkoy'] },
  { name: 'Beyoğlu', displayName: 'Beyoğlu, İstanbul, Türkiye', city: 'İstanbul', region: 'Beyoğlu', country: 'Türkiye', countryCode: 'TR', lat: 41.0369, lon: 28.9775, aliases: ['beyoglu', 'pera'] },
  { name: 'Sarıyer', displayName: 'Sarıyer, İstanbul, Türkiye', city: 'İstanbul', region: 'Sarıyer', country: 'Türkiye', countryCode: 'TR', lat: 41.1667, lon: 29.0500, aliases: ['sariyer'] },
  { name: 'Ankara', displayName: 'Ankara, Türkiye', city: 'Ankara', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.9334, lon: 32.8597, aliases: ['angora', 'ankara turkiye', 'ankara turkey'] },
  { name: 'Çankaya', displayName: 'Çankaya, Ankara, Türkiye', city: 'Ankara', region: 'Çankaya', country: 'Türkiye', countryCode: 'TR', lat: 39.9078, lon: 32.8613, aliases: ['cankaya', 'çankaya'] },
  { name: 'Yenimahalle', displayName: 'Yenimahalle, Ankara, Türkiye', city: 'Ankara', region: 'Yenimahalle', country: 'Türkiye', countryCode: 'TR', lat: 39.9700, lon: 32.8000 },
  { name: 'İzmir', displayName: 'İzmir, Türkiye', city: 'İzmir', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 38.4237, lon: 27.1428, aliases: ['izmir', 'i̇zmir', 'smyrna', 'izmir turkiye', 'izmir turkey'] },
  { name: 'Karşıyaka', displayName: 'Karşıyaka, İzmir, Türkiye', city: 'İzmir', region: 'Karşıyaka', country: 'Türkiye', countryCode: 'TR', lat: 38.4554, lon: 27.1127, aliases: ['karsiyaka', 'karşıyaka'] },
  { name: 'Çeşme', displayName: 'Çeşme, İzmir, Türkiye', city: 'İzmir', region: 'Çeşme', country: 'Türkiye', countryCode: 'TR', lat: 38.3242, lon: 26.3042, aliases: ['cesme', 'çeşme'] },
  { name: 'Urla', displayName: 'Urla, İzmir, Türkiye', city: 'İzmir', region: 'Urla', country: 'Türkiye', countryCode: 'TR', lat: 38.3229, lon: 26.7640, aliases: ['urla'] },
  { name: 'Bornova', displayName: 'Bornova, İzmir, Türkiye', city: 'İzmir', region: 'Bornova', country: 'Türkiye', countryCode: 'TR', lat: 38.4694, lon: 27.2181 },
  { name: 'Bursa', displayName: 'Bursa, Türkiye', city: 'Bursa', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.1885, lon: 29.0610, aliases: ['prusa'] },
  { name: 'Nilüfer', displayName: 'Nilüfer, Bursa, Türkiye', city: 'Bursa', region: 'Nilüfer', country: 'Türkiye', countryCode: 'TR', lat: 40.2167, lon: 28.9833, aliases: ['nilufer'] },
  { name: 'Antalya', displayName: 'Antalya, Türkiye', city: 'Antalya', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 36.8969, lon: 30.7133 },
  { name: 'Alanya', displayName: 'Alanya, Antalya, Türkiye', city: 'Antalya', region: 'Alanya', country: 'Türkiye', countryCode: 'TR', lat: 36.5438, lon: 31.9998, aliases: ['alanya'] },
  { name: 'Kaş', displayName: 'Kaş, Antalya, Türkiye', city: 'Antalya', region: 'Kaş', country: 'Türkiye', countryCode: 'TR', lat: 36.2000, lon: 29.6333, aliases: ['kas'] },
  { name: 'Kemer', displayName: 'Kemer, Antalya, Türkiye', city: 'Antalya', region: 'Kemer', country: 'Türkiye', countryCode: 'TR', lat: 36.6000, lon: 30.5600 },
  { name: 'Adana', displayName: 'Adana, Türkiye', city: 'Adana', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 36.9914, lon: 35.3308 },
  { name: 'Konya', displayName: 'Konya, Türkiye', city: 'Konya', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.8746, lon: 32.4932, aliases: ['iconium'] },
  { name: 'Gaziantep', displayName: 'Gaziantep, Türkiye', city: 'Gaziantep', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.0662, lon: 37.3833, aliases: ['antep'] },
  { name: 'Şanlıurfa', displayName: 'Şanlıurfa, Türkiye', city: 'Şanlıurfa', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.1674, lon: 38.7955, aliases: ['urfa', 'sanliurfa'] },
  { name: 'Kocaeli', displayName: 'Kocaeli (İzmit), Türkiye', city: 'Kocaeli', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.7654, lon: 29.9408, aliases: ['izmit', 'i̇zmit', 'kocaeli'] },
  { name: 'Mersin', displayName: 'Mersin (İçel), Türkiye', city: 'Mersin', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 36.8121, lon: 34.6415, aliases: ['icel', 'i̇çel'] },
  { name: 'Diyarbakır', displayName: 'Diyarbakır, Türkiye', city: 'Diyarbakır', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.9144, lon: 40.2306, aliases: ['diyarbakir'] },
  { name: 'Hatay', displayName: 'Hatay (Antakya), Türkiye', city: 'Hatay', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 36.2023, lon: 36.1606, aliases: ['antakya', 'antioch'] },
  { name: 'Manisa', displayName: 'Manisa, Türkiye', city: 'Manisa', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 38.6191, lon: 27.4289 },
  { name: 'Kayseri', displayName: 'Kayseri, Türkiye', city: 'Kayseri', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.7312, lon: 35.4787, aliases: ['caesarea'] },
  { name: 'Samsun', displayName: 'Samsun, Türkiye', city: 'Samsun', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.2867, lon: 36.3300 },
  { name: 'Balıkesir', displayName: 'Balıkesir, Türkiye', city: 'Balıkesir', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 39.6484, lon: 27.8826, aliases: ['balikesir'] },
  { name: 'Ayvalık', displayName: 'Ayvalık, Balıkesir, Türkiye', city: 'Balıkesir', region: 'Ayvalık', country: 'Türkiye', countryCode: 'TR', lat: 39.3197, lon: 26.6961, aliases: ['ayvalik', 'ayvalik balikesir'] },
  { name: 'Kahramanmaraş', displayName: 'Kahramanmaraş, Türkiye', city: 'Kahramanmaraş', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 37.5858, lon: 36.9371, aliases: ['maras', 'maraş', 'kahramanmaras'] },
  { name: 'Van', displayName: 'Van, Türkiye', city: 'Van', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.4891, lon: 43.4089 },
  { name: 'Aydın', displayName: 'Aydın, Türkiye', city: 'Aydın', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 37.8560, lon: 27.8416, aliases: ['aydin'] },
  { name: 'Kuşadası', displayName: 'Kuşadası, Aydın, Türkiye', city: 'Aydın', region: 'Kuşadası', country: 'Türkiye', countryCode: 'TR', lat: 37.8579, lon: 27.2610, aliases: ['kusadasi'] },
  { name: 'Denizli', displayName: 'Denizli, Türkiye', city: 'Denizli', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 37.7765, lon: 29.0864 },
  { name: 'Sakarya', displayName: 'Sakarya (Adapazarı), Türkiye', city: 'Sakarya', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.7569, lon: 30.3783, aliases: ['adapazari', 'adapazarı'] },
  { name: 'Tekirdağ', displayName: 'Tekirdağ, Türkiye', city: 'Tekirdağ', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.9833, lon: 27.5167, aliases: ['tekirdag'] },
  { name: 'Muğla', displayName: 'Muğla, Türkiye', city: 'Muğla', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 37.2153, lon: 28.3636, aliases: ['mugla'] },
  { name: 'Bodrum', displayName: 'Bodrum, Muğla, Türkiye', city: 'Muğla', region: 'Bodrum', country: 'Türkiye', countryCode: 'TR', lat: 37.0344, lon: 27.4305, aliases: ['bodrum', 'halicarnassus'] },
  { name: 'Fethiye', displayName: 'Fethiye, Muğla, Türkiye', city: 'Muğla', region: 'Fethiye', country: 'Türkiye', countryCode: 'TR', lat: 36.6573, lon: 29.1174, aliases: ['fethiye'] },
  { name: 'Marmaris', displayName: 'Marmaris, Muğla, Türkiye', city: 'Muğla', region: 'Marmaris', country: 'Türkiye', countryCode: 'TR', lat: 36.8550, lon: 28.2742, aliases: ['marmaris'] },
  { name: 'Datça', displayName: 'Datça, Muğla, Türkiye', city: 'Muğla', region: 'Datça', country: 'Türkiye', countryCode: 'TR', lat: 36.7262, lon: 27.6860, aliases: ['datca'] },
  { name: 'Eskişehir', displayName: 'Eskişehir, Türkiye', city: 'Eskişehir', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.7767, lon: 30.5206, aliases: ['eskisehir'] },
  { name: 'Mardin', displayName: 'Mardin, Türkiye', city: 'Mardin', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.3212, lon: 40.7245 },
  { name: 'Malatya', displayName: 'Malatya, Türkiye', city: 'Malatya', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.3552, lon: 38.3095 },
  { name: 'Trabzon', displayName: 'Trabzon, Türkiye', city: 'Trabzon', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.0027, lon: 39.7168, aliases: ['trebizond'] },
  { name: 'Erzurum', displayName: 'Erzurum, Türkiye', city: 'Erzurum', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.9043, lon: 41.2679 },
  { name: 'Ordu', displayName: 'Ordu, Türkiye', city: 'Ordu', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.9839, lon: 37.8764 },
  { name: 'Afyonkarahisar', displayName: 'Afyonkarahisar, Türkiye', city: 'Afyonkarahisar', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 38.7507, lon: 30.5567, aliases: ['afyon'] },
  { name: 'Sivas', displayName: 'Sivas, Türkiye', city: 'Sivas', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.7477, lon: 37.0179 },
  { name: 'Adıyaman', displayName: 'Adıyaman, Türkiye', city: 'Adıyaman', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.7648, lon: 38.2786, aliases: ['adiyaman'] },
  { name: 'Batman', displayName: 'Batman, Türkiye', city: 'Batman', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.8812, lon: 41.1293 },
  { name: 'Tokat', displayName: 'Tokat, Türkiye', city: 'Tokat', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.3167, lon: 36.5500 },
  { name: 'Zonguldak', displayName: 'Zonguldak, Türkiye', city: 'Zonguldak', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.4564, lon: 31.7987 },
  { name: 'Elazığ', displayName: 'Elazığ, Türkiye', city: 'Elazığ', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.6810, lon: 39.2264, aliases: ['elazig'] },
  { name: 'Kütahya', displayName: 'Kütahya, Türkiye', city: 'Kütahya', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 39.4167, lon: 29.9833, aliases: ['kutahya'] },
  { name: 'Çanakkale', displayName: 'Çanakkale, Türkiye', city: 'Çanakkale', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.1553, lon: 26.4142, aliases: ['canakkale', 'dardanelles'] },
  { name: 'Osmaniye', displayName: 'Osmaniye, Türkiye', city: 'Osmaniye', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 37.0742, lon: 36.2478 },
  { name: 'Çorum', displayName: 'Çorum, Türkiye', city: 'Çorum', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.5506, lon: 34.9556, aliases: ['corum'] },
  { name: 'Giresun', displayName: 'Giresun, Türkiye', city: 'Giresun', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.9128, lon: 38.3895 },
  { name: 'Isparta', displayName: 'Isparta, Türkiye', city: 'Isparta', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 37.7648, lon: 30.5566 },
  { name: 'Yozgat', displayName: 'Yozgat, Türkiye', city: 'Yozgat', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.8181, lon: 34.8147 },
  { name: 'Muş', displayName: 'Muş, Türkiye', city: 'Muş', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.7432, lon: 41.5064, aliases: ['mus'] },
  { name: 'Edirne', displayName: 'Edirne, Türkiye', city: 'Edirne', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 41.6772, lon: 26.5557, aliases: ['adrianople'] },
  { name: 'Aksaray', displayName: 'Aksaray, Türkiye', city: 'Aksaray', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.3687, lon: 34.0370 },
  { name: 'Kastamonu', displayName: 'Kastamonu, Türkiye', city: 'Kastamonu', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.3887, lon: 33.7827 },
  { name: 'Düzce', displayName: 'Düzce, Türkiye', city: 'Düzce', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.8438, lon: 31.1565, aliases: ['duzce'] },
  { name: 'Uşak', displayName: 'Uşak, Türkiye', city: 'Uşak', region: 'Ege', country: 'Türkiye', countryCode: 'TR', lat: 38.6823, lon: 29.4082, aliases: ['usak'] },
  { name: 'Kırklareli', displayName: 'Kırklareli, Türkiye', city: 'Kırklareli', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 41.7333, lon: 27.2167, aliases: ['kirklareli'] },
  { name: 'Niğde', displayName: 'Niğde, Türkiye', city: 'Niğde', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.9667, lon: 34.6833, aliases: ['nigde'] },
  { name: 'Bitlis', displayName: 'Bitlis, Türkiye', city: 'Bitlis', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.4006, lon: 42.1095 },
  { name: 'Rize', displayName: 'Rize, Türkiye', city: 'Rize', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.0201, lon: 40.5234 },
  { name: 'Amasya', displayName: 'Amasya, Türkiye', city: 'Amasya', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.6500, lon: 35.8333 },
  { name: 'Siirt', displayName: 'Siirt, Türkiye', city: 'Siirt', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.9333, lon: 41.9500 },
  { name: 'Bolu', displayName: 'Bolu, Türkiye', city: 'Bolu', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.7358, lon: 31.6061 },
  { name: 'Nevşehir', displayName: 'Nevşehir, Türkiye', city: 'Nevşehir', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.6244, lon: 34.7142, aliases: ['nevsehir', 'cappadocia', 'kapadokya'] },
  { name: 'Yalova', displayName: 'Yalova, Türkiye', city: 'Yalova', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.6500, lon: 29.2667 },
  { name: 'Bingöl', displayName: 'Bingöl, Türkiye', city: 'Bingöl', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 38.8854, lon: 40.4983, aliases: ['bingol'] },
  { name: 'Kırıkkale', displayName: 'Kırıkkale, Türkiye', city: 'Kırıkkale', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.8468, lon: 33.5153, aliases: ['kirikkale'] },
  { name: 'Hakkari', displayName: 'Hakkari, Türkiye', city: 'Hakkari', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.5833, lon: 43.7333 },
  { name: 'Kars', displayName: 'Kars, Türkiye', city: 'Kars', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 40.6167, lon: 43.1000 },
  { name: 'Burdur', displayName: 'Burdur, Türkiye', city: 'Burdur', region: 'Akdeniz', country: 'Türkiye', countryCode: 'TR', lat: 37.7203, lon: 30.2908 },
  { name: 'Karaman', displayName: 'Karaman, Türkiye', city: 'Karaman', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 37.1759, lon: 33.2287 },
  { name: 'Karabük', displayName: 'Karabük, Türkiye', city: 'Karabük', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.2061, lon: 32.6204, aliases: ['karabuk', 'safranbolu'] },
  { name: 'Kırşehir', displayName: 'Kırşehir, Türkiye', city: 'Kırşehir', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.1425, lon: 34.1709, aliases: ['kirsehir'] },
  { name: 'Erzincan', displayName: 'Erzincan, Türkiye', city: 'Erzincan', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.7500, lon: 39.5000 },
  { name: 'Bilecik', displayName: 'Bilecik, Türkiye', city: 'Bilecik', region: 'Marmara', country: 'Türkiye', countryCode: 'TR', lat: 40.1451, lon: 29.9799 },
  { name: 'Sinop', displayName: 'Sinop, Türkiye', city: 'Sinop', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 42.0231, lon: 35.1531 },
  { name: 'Iğdır', displayName: 'Iğdır, Türkiye', city: 'Iğdır', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.9200, lon: 44.0400, aliases: ['igdir'] },
  { name: 'Bartın', displayName: 'Bartın, Türkiye', city: 'Bartın', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.6344, lon: 32.3375, aliases: ['bartin'] },
  { name: 'Çankırı', displayName: 'Çankırı, Türkiye', city: 'Çankırı', region: 'İç Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 40.6013, lon: 33.6134, aliases: ['cankiri'] },
  { name: 'Artvin', displayName: 'Artvin, Türkiye', city: 'Artvin', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 41.1828, lon: 41.8183 },
  { name: 'Gümüşhane', displayName: 'Gümüşhane, Türkiye', city: 'Gümüşhane', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.4600, lon: 39.4700, aliases: ['gumushane'] },
  { name: 'Kilis', displayName: 'Kilis, Türkiye', city: 'Kilis', region: 'Güneydoğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 36.7184, lon: 37.1212 },
  { name: 'Ardahan', displayName: 'Ardahan, Türkiye', city: 'Ardahan', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 41.1105, lon: 42.7022 },
  { name: 'Tunceli', displayName: 'Tunceli, Türkiye', city: 'Tunceli', region: 'Doğu Anadolu', country: 'Türkiye', countryCode: 'TR', lat: 39.1079, lon: 39.5401, aliases: ['dersim'] },
  { name: 'Bayburt', displayName: 'Bayburt, Türkiye', city: 'Bayburt', region: 'Karadeniz', country: 'Türkiye', countryCode: 'TR', lat: 40.2552, lon: 40.2249 },

  // --- KUZEY AMERİKA (USA & CANADA) ---
  { name: 'San Francisco', displayName: 'San Francisco, California, USA', city: 'San Francisco', region: 'California', country: 'United States', countryCode: 'US', lat: 37.7749, lon: -122.4194, aliases: ['sf', 'san francisco ca', 'san francisco usa', 'san francisco abd', 'california'] },
  { name: 'New York', displayName: 'New York, New York, USA', city: 'New York', region: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lon: -74.0060, aliases: ['nyc', 'new york city', 'manhattan', 'brooklyn', 'new york usa', 'new york abd'] },
  { name: 'Los Angeles', displayName: 'Los Angeles, California, USA', city: 'Los Angeles', region: 'California', country: 'United States', countryCode: 'US', lat: 34.0522, lon: -118.2437, aliases: ['la', 'los angeles ca', 'los angeles usa'] },
  { name: 'Chicago', displayName: 'Chicago, Illinois, USA', city: 'Chicago', region: 'Illinois', country: 'United States', countryCode: 'US', lat: 41.8781, lon: -87.6298, aliases: ['sikago', 'chicago il', 'chicago usa'] },
  { name: 'Miami', displayName: 'Miami, Florida, USA', city: 'Miami', region: 'Florida', country: 'United States', countryCode: 'US', lat: 25.7617, lon: -80.1918, aliases: ['miami fl', 'miami usa'] },
  { name: 'Seattle', displayName: 'Seattle, Washington, USA', city: 'Seattle', region: 'Washington', country: 'United States', countryCode: 'US', lat: 47.6062, lon: -122.3321, aliases: ['seattle wa', 'seattle usa'] },
  { name: 'Boston', displayName: 'Boston, Massachusetts, USA', city: 'Boston', region: 'Massachusetts', country: 'United States', countryCode: 'US', lat: 42.3601, lon: -71.0589, aliases: ['boston ma', 'boston usa'] },
  { name: 'Austin', displayName: 'Austin, Texas, USA', city: 'Austin', region: 'Texas', country: 'United States', countryCode: 'US', lat: 30.2672, lon: -97.7431, aliases: ['austin tx', 'austin texas'] },
  { name: 'Houston', displayName: 'Houston, Texas, USA', city: 'Houston', region: 'Texas', country: 'United States', countryCode: 'US', lat: 29.7604, lon: -95.3698, aliases: ['houston tx', 'houston texas'] },
  { name: 'Dallas', displayName: 'Dallas, Texas, USA', city: 'Dallas', region: 'Texas', country: 'United States', countryCode: 'US', lat: 32.7767, lon: -96.7970, aliases: ['dallas tx'] },
  { name: 'Washington', displayName: 'Washington, District of Columbia, USA', city: 'Washington', region: 'District of Columbia', country: 'United States', countryCode: 'US', lat: 38.9072, lon: -77.0369, aliases: ['washington dc', 'dc', 'washington usa'] },
  { name: 'San Diego', displayName: 'San Diego, California, USA', city: 'San Diego', region: 'California', country: 'United States', countryCode: 'US', lat: 32.7157, lon: -117.1611 },
  { name: 'Denver', displayName: 'Denver, Colorado, USA', city: 'Denver', region: 'Colorado', country: 'United States', countryCode: 'US', lat: 39.7392, lon: -104.9903 },
  { name: 'Las Vegas', displayName: 'Las Vegas, Nevada, USA', city: 'Las Vegas', region: 'Nevada', country: 'United States', countryCode: 'US', lat: 36.1699, lon: -115.1398, aliases: ['vegas'] },
  { name: 'Atlanta', displayName: 'Atlanta, Georgia, USA', city: 'Atlanta', region: 'Georgia', country: 'United States', countryCode: 'US', lat: 33.7490, lon: -84.3880 },
  { name: 'Philadelphia', displayName: 'Philadelphia, Pennsylvania, USA', city: 'Philadelphia', region: 'Pennsylvania', country: 'United States', countryCode: 'US', lat: 39.9526, lon: -75.1652, aliases: ['philly'] },
  { name: 'Phoenix', displayName: 'Phoenix, Arizona, USA', city: 'Phoenix', region: 'Arizona', country: 'United States', countryCode: 'US', lat: 33.4484, lon: -112.0740 },
  { name: 'Springfield', displayName: 'Springfield, Illinois, USA', city: 'Springfield', region: 'Illinois', country: 'United States', countryCode: 'US', lat: 39.7817, lon: -89.6501, aliases: ['springfield il', 'springfield illinois'] },
  { name: 'Springfield', displayName: 'Springfield, Missouri, USA', city: 'Springfield', region: 'Missouri', country: 'United States', countryCode: 'US', lat: 37.2090, lon: -93.2923, aliases: ['springfield mo', 'springfield missouri'] },
  { name: 'Springfield', displayName: 'Springfield, Massachusetts, USA', city: 'Springfield', region: 'Massachusetts', country: 'United States', countryCode: 'US', lat: 42.1015, lon: -72.5898, aliases: ['springfield ma', 'springfield massachusetts'] },
  { name: 'Toronto', displayName: 'Toronto, Ontario, Canada', city: 'Toronto', region: 'Ontario', country: 'Canada', countryCode: 'CA', lat: 43.6532, lon: -79.3832, aliases: ['toronto canada', 'toronto on'] },
  { name: 'Vancouver', displayName: 'Vancouver, British Columbia, Canada', city: 'Vancouver', region: 'British Columbia', country: 'Canada', countryCode: 'CA', lat: 49.2827, lon: -123.1207, aliases: ['vancouver bc', 'vancouver canada'] },
  { name: 'Montreal', displayName: 'Montréal, Québec, Canada', city: 'Montréal', region: 'Québec', country: 'Canada', countryCode: 'CA', lat: 45.5017, lon: -73.5673, aliases: ['montreal', 'montreal canada', 'quebec'] },
  { name: 'Calgary', displayName: 'Calgary, Alberta, Canada', city: 'Calgary', region: 'Alberta', country: 'Canada', countryCode: 'CA', lat: 51.0447, lon: -114.0719 },
  { name: 'Ottawa', displayName: 'Ottawa, Ontario, Canada', city: 'Ottawa', region: 'Ontario', country: 'Canada', countryCode: 'CA', lat: 45.4215, lon: -75.6972 },
  { name: 'Mexico City', displayName: 'Mexico City, Mexico', city: 'Mexico City', region: 'CDMX', country: 'Mexico', countryCode: 'MX', lat: 19.4326, lon: -99.1332, aliases: ['ciudad de mexico', 'meksiko', 'mexico', 'mexico df'] },
  { name: 'Guadalajara', displayName: 'Guadalajara, Jalisco, Mexico', city: 'Guadalajara', region: 'Jalisco', country: 'Mexico', countryCode: 'MX', lat: 20.6597, lon: -103.3496 },

  // --- AVRUPA (EUROPE) ---
  { name: 'London', displayName: 'London, United Kingdom', city: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lon: -0.1278, aliases: ['londra', 'london uk', 'greater london', 'londra ingiltere', 'london united kingdom'] },
  { name: 'Manchester', displayName: 'Manchester, United Kingdom', city: 'Manchester', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 53.4808, lon: -2.2426, aliases: ['manchester uk'] },
  { name: 'Edinburgh', displayName: 'Edinburgh, Scotland, United Kingdom', city: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', countryCode: 'GB', lat: 55.9533, lon: -3.1883, aliases: ['edinburg', 'edinburgh uk'] },
  { name: 'Birmingham', displayName: 'Birmingham, United Kingdom', city: 'Birmingham', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 52.4862, lon: -1.8904 },
  { name: 'Berlin', displayName: 'Berlin, Germany', city: 'Berlin', region: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.5200, lon: 13.4050, aliases: ['berlin almanya', 'berlin germany', 'deutschland'] },
  { name: 'München', displayName: 'München, Bayern, Germany', city: 'München', region: 'Bayern', country: 'Germany', countryCode: 'DE', lat: 48.1371, lon: 11.5754, aliases: ['munich', 'munih', 'münih', 'munchen', 'munich germany', 'munih almanya'] },
  { name: 'Frankfurt', displayName: 'Frankfurt am Main, Hessen, Germany', city: 'Frankfurt', region: 'Hessen', country: 'Germany', countryCode: 'DE', lat: 50.1109, lon: 8.6821, aliases: ['frankfurt germany', 'frankfurt almanya'] },
  { name: 'Hamburg', displayName: 'Hamburg, Germany', city: 'Hamburg', region: 'Hamburg', country: 'Germany', countryCode: 'DE', lat: 53.5511, lon: 9.9937 },
  { name: 'Köln', displayName: 'Köln, Nordrhein-Westfalen, Germany', city: 'Köln', region: 'Nordrhein-Westfalen', country: 'Germany', countryCode: 'DE', lat: 50.9375, lon: 6.9603, aliases: ['cologne', 'koln', 'koln almanya', 'cologne germany'] },
  { name: 'Heidelberg', displayName: 'Heidelberg, Baden-Württemberg, Germany', city: 'Heidelberg', region: 'Baden-Württemberg', country: 'Germany', countryCode: 'DE', lat: 49.3988, lon: 8.6724, aliases: ['heidelberg germany', 'heidelberg almanya'] },
  { name: 'Stuttgart', displayName: 'Stuttgart, Baden-Württemberg, Germany', city: 'Stuttgart', region: 'Baden-Württemberg', country: 'Germany', countryCode: 'DE', lat: 48.7758, lon: 9.1829 },
  { name: 'Paris', displayName: 'Paris, Île-de-France, France', city: 'Paris', region: 'Île-de-France', country: 'France', countryCode: 'FR', lat: 48.8566, lon: 2.3522, aliases: ['paris fransa', 'paris france'] },
  { name: 'Marseille', displayName: 'Marseille, Provence-Alpes-Côte d\'Azur, France', city: 'Marseille', region: 'PACA', country: 'France', countryCode: 'FR', lat: 43.2965, lon: 5.3698, aliases: ['marsilya', 'marseille france'] },
  { name: 'Lyon', displayName: 'Lyon, Auvergne-Rhône-Alpes, France', city: 'Lyon', region: 'ARA', country: 'France', countryCode: 'FR', lat: 45.7640, lon: 4.8357 },
  { name: 'Nice', displayName: 'Nice, Provence-Alpes-Côte d\'Azur, France', city: 'Nice', region: 'PACA', country: 'France', countryCode: 'FR', lat: 43.7102, lon: 7.2620, aliases: ['nis'] },
  { name: 'Rome', displayName: 'Roma, Lazio, Italy', city: 'Roma', region: 'Lazio', country: 'Italy', countryCode: 'IT', lat: 41.9028, lon: 12.4964, aliases: ['roma', 'rome', 'roma italya', 'rome italy'] },
  { name: 'Milano', displayName: 'Milano, Lombardia, Italy', city: 'Milano', region: 'Lombardia', country: 'Italy', countryCode: 'IT', lat: 45.4642, lon: 9.1900, aliases: ['milan', 'milano italya', 'milan italy'] },
  { name: 'Florence', displayName: 'Firenze, Toscana, Italy', city: 'Firenze', region: 'Toscana', country: 'Italy', countryCode: 'IT', lat: 43.7696, lon: 11.2558, aliases: ['florence', 'firenze', 'floransa'] },
  { name: 'Napoli', displayName: 'Napoli, Campania, Italy', city: 'Napoli', region: 'Campania', country: 'Italy', countryCode: 'IT', lat: 40.8518, lon: 14.2681, aliases: ['naples'] },
  { name: 'Madrid', displayName: 'Madrid, Spain', city: 'Madrid', region: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.4168, lon: -3.7038, aliases: ['madrid ispanya', 'madrid spain'] },
  { name: 'Barcelona', displayName: 'Barcelona, Catalunya, Spain', city: 'Barcelona', region: 'Catalunya', country: 'Spain', countryCode: 'ES', lat: 41.3879, lon: 2.1699, aliases: ['barselona', 'barcelona spain'] },
  { name: 'Valencia', displayName: 'Valencia, Spain', city: 'Valencia', region: 'Valencia', country: 'Spain', countryCode: 'ES', lat: 39.4699, lon: -0.3763 },
  { name: 'Seville', displayName: 'Sevilla, Andalucía, Spain', city: 'Sevilla', region: 'Andalucía', country: 'Spain', countryCode: 'ES', lat: 37.3891, lon: -5.9845, aliases: ['seville', 'sevilla'] },
  { name: 'Zürich', displayName: 'Zürich, Switzerland', city: 'Zürich', region: 'Zürich', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lon: 8.5417, aliases: ['zurich', 'zurih', 'zürih', 'zurich switzerland', 'zurih isvicre'] },
  { name: 'Geneva', displayName: 'Genève, Switzerland', city: 'Genève', region: 'Genève', country: 'Switzerland', countryCode: 'CH', lat: 46.2044, lon: 6.1432, aliases: ['geneve', 'cenevre', 'geneva switzerland'] },
  { name: 'Basel', displayName: 'Basel, Switzerland', city: 'Basel', region: 'Basel-Stadt', country: 'Switzerland', countryCode: 'CH', lat: 47.5596, lon: 7.5886 },
  { name: 'Vienna', displayName: 'Wien, Austria', city: 'Wien', region: 'Wien', country: 'Austria', countryCode: 'AT', lat: 48.2082, lon: 16.3738, aliases: ['wien', 'viyana', 'vienna austria', 'viyana avusturya'] },
  { name: 'Salzburg', displayName: 'Salzburg, Austria', city: 'Salzburg', region: 'Salzburg', country: 'Austria', countryCode: 'AT', lat: 47.8095, lon: 13.0550 },
  { name: 'Amsterdam', displayName: 'Amsterdam, North Holland, Netherlands', city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', countryCode: 'NL', lat: 52.3676, lon: 4.9041, aliases: ['hollanda', 'amsterdam hollanda', 'amsterdam netherlands'] },
  { name: 'Rotterdam', displayName: 'Rotterdam, South Holland, Netherlands', city: 'Rotterdam', region: 'South Holland', country: 'Netherlands', countryCode: 'NL', lat: 51.9244, lon: 4.4777 },
  { name: 'Brussels', displayName: 'Bruxelles, Belgium', city: 'Bruxelles', region: 'Brussels', country: 'Belgium', countryCode: 'BE', lat: 50.8503, lon: 4.3517, aliases: ['bruxelles', 'brüksel', 'brussel', 'brussels belgium'] },
  { name: 'Stockholm', displayName: 'Stockholm, Sweden', city: 'Stockholm', region: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.3293, lon: 18.0686, aliases: ['isvec', 'stockholm sweden', 'stokholm'] },
  { name: 'Oslo', displayName: 'Oslo, Norway', city: 'Oslo', region: 'Oslo', country: 'Norway', countryCode: 'NO', lat: 59.9139, lon: 10.7522, aliases: ['norvec', 'oslo norway'] },
  { name: 'Copenhagen', displayName: 'København, Denmark', city: 'København', region: 'Hovedstaden', country: 'Denmark', countryCode: 'DK', lat: 55.6761, lon: 12.5683, aliases: ['kobenhavn', 'kopenhag', 'copenhagen denmark'] },
  { name: 'Helsinki', displayName: 'Helsinki, Finland', city: 'Helsinki', region: 'Uusimaa', country: 'Finland', countryCode: 'FI', lat: 60.1699, lon: 24.9384, aliases: ['finlandiya'] },
  { name: 'Athens', displayName: 'Athina, Greece', city: 'Athina', region: 'Attica', country: 'Greece', countryCode: 'GR', lat: 37.9838, lon: 23.7275, aliases: ['atina', 'athens', 'athina', 'atina yunanistan'] },
  { name: 'Lisbon', displayName: 'Lisboa, Portugal', city: 'Lisboa', region: 'Lisbon', country: 'Portugal', countryCode: 'PT', lat: 38.7223, lon: -9.1393, aliases: ['lisbon', 'lizbon', 'lisbon portugal'] },
  { name: 'Porto', displayName: 'Porto, Portugal', city: 'Porto', region: 'Porto', country: 'Portugal', countryCode: 'PT', lat: 41.1579, lon: -8.6291 },
  { name: 'Dublin', displayName: 'Dublin, Leinster, Ireland', city: 'Dublin', region: 'Leinster', country: 'Ireland', countryCode: 'IE', lat: 53.3498, lon: -6.2603, aliases: ['irlanda'] },
  { name: 'Prague', displayName: 'Praha, Czech Republic', city: 'Praha', region: 'Prague', country: 'Czech Republic', countryCode: 'CZ', lat: 50.0755, lon: 14.4378, aliases: ['prag', 'praha', 'prague czech republic'] },
  { name: 'Warsaw', displayName: 'Warszawa, Poland', city: 'Warszawa', region: 'Mazovia', country: 'Poland', countryCode: 'PL', lat: 52.2297, lon: 21.0122, aliases: ['varsova', 'varşova', 'warszawa', 'warsaw poland'] },
  { name: 'Budapest', displayName: 'Budapest, Hungary', city: 'Budapest', region: 'Central Hungary', country: 'Hungary', countryCode: 'HU', lat: 47.4979, lon: 19.0402, aliases: ['budapeste', 'budapeşte', 'budapest hungary'] },
  { name: 'Bucharest', displayName: 'București, Romania', city: 'București', region: 'Bucharest', country: 'Romania', countryCode: 'RO', lat: 44.4268, lon: 26.1025, aliases: ['bukres', 'bükreş', 'bucharest'] },
  { name: 'Sofia', displayName: 'Sofia, Bulgaria', city: 'Sofia', region: 'Sofia City', country: 'Bulgaria', countryCode: 'BG', lat: 42.6977, lon: 23.3219, aliases: ['sofya'] },

  // --- ASYA & ORTA DOĞU (ASIA & MIDDLE EAST) ---
  { name: 'Tokyo', displayName: 'Tokyo, Japan', city: 'Tokyo', region: 'Kantō', country: 'Japan', countryCode: 'JP', lat: 35.6762, lon: 139.6503, aliases: ['tokyo japonya', 'tokyo japan', 'tokio'] },
  { name: 'Osaka', displayName: 'Osaka, Kansai, Japan', city: 'Osaka', region: 'Kansai', country: 'Japan', countryCode: 'JP', lat: 34.6937, lon: 135.5023, aliases: ['osaka japan'] },
  { name: 'Kyoto', displayName: 'Kyoto, Kansai, Japan', city: 'Kyoto', region: 'Kansai', country: 'Japan', countryCode: 'JP', lat: 35.0116, lon: 135.7681, aliases: ['kyoto japan', 'kiyoto'] },
  { name: 'Seoul', displayName: 'Seoul, South Korea', city: 'Seoul', region: 'Sudogwon', country: 'South Korea', countryCode: 'KR', lat: 37.5665, lon: 126.9780, aliases: ['seul', 'seoul guney kore', 'seoul south korea', 'korea'] },
  { name: 'Busan', displayName: 'Busan, South Korea', city: 'Busan', region: 'Yeongnam', country: 'South Korea', countryCode: 'KR', lat: 35.1796, lon: 129.0756 },
  { name: 'Beijing', displayName: 'Beijing, China', city: 'Beijing', region: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.9042, lon: 116.4074, aliases: ['pekin', 'beijing china'] },
  { name: 'Shanghai', displayName: 'Shanghai, China', city: 'Shanghai', region: 'Shanghai', country: 'China', countryCode: 'CN', lat: 31.2304, lon: 121.4737, aliases: ['sanghay', 'şanghay', 'shanghai china'] },
  { name: 'Hong Kong', displayName: 'Hong Kong, China', city: 'Hong Kong', region: 'HK', country: 'Hong Kong', countryCode: 'HK', lat: 22.3193, lon: 114.1694 },
  { name: 'Taipei', displayName: 'Taipei, Taiwan', city: 'Taipei', region: 'Taipei', country: 'Taiwan', countryCode: 'TW', lat: 25.0330, lon: 121.5654 },
  { name: 'Singapore', displayName: 'Singapore, Singapore', city: 'Singapore', region: 'SG', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lon: 103.8198, aliases: ['singapur', 'singapore'] },
  { name: 'Bangkok', displayName: 'Bangkok, Thailand', city: 'Bangkok', region: 'Central Thailand', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lon: 100.5018, aliases: ['tayland', 'bangkok thailand'] },
  { name: 'Mumbai', displayName: 'Mumbai, Maharashtra, India', city: 'Mumbai', region: 'Maharashtra', country: 'India', countryCode: 'IN', lat: 19.0760, lon: 72.8777, aliases: ['bombay', 'mumbai hindistan', 'mumbai india'] },
  { name: 'New Delhi', displayName: 'New Delhi, Delhi, India', city: 'New Delhi', region: 'Delhi', country: 'India', countryCode: 'IN', lat: 28.6139, lon: 77.2090, aliases: ['delhi', 'yeni delhi', 'delhi india'] },
  { name: 'Bengaluru', displayName: 'Bengaluru, Karnataka, India', city: 'Bengaluru', region: 'Karnataka', country: 'India', countryCode: 'IN', lat: 12.9716, lon: 77.5946, aliases: ['bangalore'] },
  { name: 'Dubai', displayName: 'Dubai, United Arab Emirates', city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lon: 55.2708, aliases: ['dubai bae', 'dubai uae'] },
  { name: 'Abu Dhabi', displayName: 'Abu Dhabi, United Arab Emirates', city: 'Abu Dhabi', region: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', lat: 24.4539, lon: 54.3773 },
  { name: 'Doha', displayName: 'Doha, Qatar', city: 'Doha', region: 'Ad Dawhah', country: 'Qatar', countryCode: 'QA', lat: 25.2854, lon: 51.5310, aliases: ['katar'] },
  { name: 'Riyadh', displayName: 'Riyadh, Saudi Arabia', city: 'Riyadh', region: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.7136, lon: 46.6753, aliases: ['riyad', 'suudi arabistan'] },
  { name: 'Jeddah', displayName: 'Jeddah, Makkah, Saudi Arabia', city: 'Jeddah', region: 'Makkah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.5433, lon: 39.1728, aliases: ['cidde'] },
  { name: 'Jakarta', displayName: 'Jakarta, Indonesia', city: 'Jakarta', region: 'Java', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lon: 106.8456, aliases: ['endonezya'] },
  { name: 'Kuala Lumpur', displayName: 'Kuala Lumpur, Malaysia', city: 'Kuala Lumpur', region: 'KL', country: 'Malaysia', countryCode: 'MY', lat: 3.1390, lon: 101.6869, aliases: ['malezya'] },
  { name: 'Baku', displayName: 'Baku, Azerbaijan', city: 'Baku', region: 'Absheron', country: 'Azerbaijan', countryCode: 'AZ', lat: 40.4093, lon: 49.8671, aliases: ['baki', 'bakü', 'baku azerbaycan'] },
  { name: 'Tbilisi', displayName: 'Tbilisi, Georgia', city: 'Tbilisi', region: 'Tbilisi', country: 'Georgia', countryCode: 'GE', lat: 41.7151, lon: 44.8271, aliases: ['tiflis', 'gurcistan'] },
  { name: 'Almaty', displayName: 'Almaty, Kazakhstan', city: 'Almaty', region: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ', lat: 43.2220, lon: 76.8512, aliases: ['almati', 'kazakistan'] },

  // --- GÜNEY AMERİKA (SOUTH AMERICA) ---
  { name: 'São Paulo', displayName: 'São Paulo, Brazil', city: 'São Paulo', region: 'São Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lon: -46.6333, aliases: ['sao paulo', 'sao paulo brezilya', 'sao paulo brazil', 'brasil'] },
  { name: 'Rio de Janeiro', displayName: 'Rio de Janeiro, Brazil', city: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', lat: -22.9068, lon: -43.1729, aliases: ['rio', 'rio brazil'] },
  { name: 'Buenos Aires', displayName: 'Buenos Aires, Argentina', city: 'Buenos Aires', region: 'Capital Federal', country: 'Argentina', countryCode: 'AR', lat: -34.6037, lon: -58.3816, aliases: ['buenos aires arjantin', 'buenos aires argentina'] },
  { name: 'Santiago', displayName: 'Santiago, Chile', city: 'Santiago', region: 'Santiago', country: 'Chile', countryCode: 'CL', lat: -33.4489, lon: -70.6693, aliases: ['santiago sili', 'santiago chile'] },
  { name: 'Bogotá', displayName: 'Bogotá, Colombia', city: 'Bogotá', region: 'Cundinamarca', country: 'Colombia', countryCode: 'CO', lat: 4.7110, lon: -74.0721, aliases: ['bogota', 'bogota colombia'] },
  { name: 'Lima', displayName: 'Lima, Peru', city: 'Lima', region: 'Lima', country: 'Peru', countryCode: 'PE', lat: -12.0464, lon: -77.0428, aliases: ['lima peru'] },

  // --- AFRİKA (AFRICA) ---
  { name: 'Cairo', displayName: 'Cairo, Egypt', city: 'Cairo', region: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lon: 31.2357, aliases: ['kahire', 'cairo misir', 'al qahirah', 'cairo egypt'] },
  { name: 'Johannesburg', displayName: 'Johannesburg, Gauteng, South Africa', city: 'Johannesburg', region: 'Gauteng', country: 'South Africa', countryCode: 'ZA', lat: -26.2041, lon: 28.0473, aliases: ['joburg', 'johannesburg south africa'] },
  { name: 'Cape Town', displayName: 'Cape Town, Western Cape, South Africa', city: 'Cape Town', region: 'Western Cape', country: 'South Africa', countryCode: 'ZA', lat: -33.9249, lon: 18.4241, aliases: ['cape town south africa'] },
  { name: 'Nairobi', displayName: 'Nairobi, Kenya', city: 'Nairobi', region: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.2921, lon: 36.8219 },
  { name: 'Casablanca', displayName: 'Casablanca, Morocco', city: 'Casablanca', region: 'Casablanca-Settat', country: 'Morocco', countryCode: 'MA', lat: 33.5731, lon: -7.5898, aliases: ['dar el beida', 'kazablanka', 'casablanca morocco'] },

  // --- OKYANUSYA (OCEANIA) ---
  { name: 'Sydney', displayName: 'Sydney, New South Wales, Australia', city: 'Sydney', region: 'New South Wales', country: 'Australia', countryCode: 'AU', lat: -33.8688, lon: 151.2093, aliases: ['sidney', 'sydney avustralya', 'sydney australia'] },
  { name: 'Melbourne', displayName: 'Melbourne, Victoria, Australia', city: 'Melbourne', region: 'Victoria', country: 'Australia', countryCode: 'AU', lat: -37.8136, lon: 144.9631, aliases: ['melbourne australia'] },
  { name: 'Brisbane', displayName: 'Brisbane, Queensland, Australia', city: 'Brisbane', region: 'Queensland', country: 'Australia', countryCode: 'AU', lat: -27.4698, lon: 153.0251 },
  { name: 'Auckland', displayName: 'Auckland, New Zealand', city: 'Auckland', region: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: -36.8485, lon: 174.7633, aliases: ['yeni zelanda', 'auckland new zealand'] }
];

export function buildResolvedItem(seed: RawCitySeed): ResolvedLocation {
  const tz = seed.countryCode === 'TR' ? 'Europe/Istanbul' : getTimezoneForCoordinates(seed.lat, seed.lon);
  return {
    id: `loc_${seed.countryCode.toLowerCase()}_${seed.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.round(seed.lat * 100)}`,
    name: seed.name,
    displayName: seed.displayName,
    city: seed.city,
    region: seed.region,
    country: seed.country,
    countryCode: seed.countryCode,
    lat: seed.lat,
    lon: seed.lon,
    timezone: tz,
    defaultTz: seed.countryCode === 'TR' ? 3 : undefined
  };
}

// In-Memory Search & Resolution Cache
const RESOLUTION_CACHE = new Map<string, ResolvedLocation[]>();

/**
 * Yerel zengin veri tabanından akıllı çoklu token ve takma ad araması yapar
 */
export function searchLocalLocations(query: string, countryCode?: string): ResolvedLocation[] {
  if (!query || !query.trim()) return [];
  const cleanQ = normalizeLocationText(query);
  if (!cleanQ) return [];

  const qTokens = cleanQ.split(' ').filter(Boolean);

  const matched = OFFLINE_WORLD_LOCATIONS.filter(seed => {
    if (countryCode && countryCode.trim()) {
      if (seed.countryCode.toUpperCase() !== countryCode.trim().toUpperCase()) {
        return false;
      }
    }
    const seedSearchText = [
      seed.name,
      seed.displayName,
      seed.city,
      seed.region || '',
      seed.country,
      seed.countryCode,
      ...(seed.aliases || [])
    ].map(normalizeLocationText).join(' ');

    return qTokens.every(token => seedSearchText.includes(token));
  });

  return matched.map(buildResolvedItem);
}

/**
 * Photon / OpenStreetMap servisi ile asenkron küresel coğrafi konum çözümleme.
 * Photon yanıt vermezse OpenStreetMap Nominatim motoruna otomatik geçer.
 */
export async function searchGlobalLocationsApi(
  query: string,
  countryCode?: string
): Promise<ResolvedLocation[]> {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `${trimmed.toLowerCase()}_${(countryCode || '').toUpperCase()}`;
  if (RESOLUTION_CACHE.has(cacheKey)) {
    return RESOLUTION_CACHE.get(cacheKey)!;
  }

  // Önce yerel veritabanında ara
  const localResults = searchLocalLocations(trimmed, countryCode);

  const remoteResults: ResolvedLocation[] = [];

  // 1. Birincil Motor: Photon Geocoding Engine (OpenStreetMap Tabanlı)
  try {
    let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=10`;
    if (countryCode && countryCode.trim().length === 2) {
      // If country code is specified, append query
      const cDef = COMMON_WORLD_COUNTRIES.find(c => c.code.toUpperCase() === countryCode.toUpperCase());
      if (cDef) {
        url = `https://photon.komoot.io/api/?q=${encodeURIComponent(`${trimmed}, ${cDef.nameEn}`)}&limit=10`;
      }
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TattooStudioAstrologyApp/1.0 (https://ais-build)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        for (const f of data.features) {
          if (!f || !f.geometry || !Array.isArray(f.geometry.coordinates) || f.geometry.coordinates.length < 2) {
            continue;
          }
          const [lon, lat] = f.geometry.coordinates;
          if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
            continue;
          }

          const props = f.properties || {};
          const cityName = props.name || props.city || props.town || props.village || props.municipality || props.locality || trimmed;
          const stateName = props.state || props.county || props.district || '';
          const countryName = props.country || '';
          const cCode = (props.countrycode || props.country_code || '').toUpperCase();

          if (countryCode && cCode && cCode !== countryCode.toUpperCase()) {
            continue;
          }

          const parts = [cityName];
          if (stateName && stateName !== cityName) parts.push(stateName);
          if (countryName) parts.push(countryName);
          const displayName = parts.join(', ');

          const tz = cCode === 'TR' ? 'Europe/Istanbul' : getTimezoneForCoordinates(lat, lon);

          remoteResults.push({
            id: `photon_${props.osm_id || Math.abs(Math.round(lat * 10000 + lon * 10000))}`,
            name: cityName,
            displayName,
            city: cityName,
            region: stateName || undefined,
            country: countryName || 'Dünya',
            countryCode: cCode || 'XX',
            lat,
            lon,
            timezone: tz,
            defaultTz: cCode === 'TR' ? 3 : undefined
          });
        }
      }
    }
  } catch {
    // Photon down or network error; fallback to Nominatim
  }

  // 2. İkincil Motor: OpenStreetMap Nominatim Engine (Photon boş döndüyse veya hata verdiyse)
  if (remoteResults.length === 0) {
    try {
      let nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=8`;
      if (countryCode && countryCode.trim().length === 2) {
        nomUrl += `&countrycodes=${encodeURIComponent(countryCode.toLowerCase())}`;
      }

      const res = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'TattooStudioAstrologyApp/1.0 (contact@ais-build.internal)'
        }
      });

      if (res.ok) {
        const nomData = await res.json();
        if (Array.isArray(nomData)) {
          for (const item of nomData) {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            if (isNaN(lat) || isNaN(lon)) continue;

            const addr = item.address || {};
            const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || item.name || trimmed;
            const stateName = addr.state || addr.province || addr.region || '';
            const countryName = addr.country || '';
            const cCode = (addr.country_code || '').toUpperCase();

            const parts = [cityName];
            if (stateName && stateName !== cityName) parts.push(stateName);
            if (countryName) parts.push(countryName);
            const displayName = parts.join(', ');

            const tz = cCode === 'TR' ? 'Europe/Istanbul' : getTimezoneForCoordinates(lat, lon);

            remoteResults.push({
              id: `nom_${item.osm_id || Math.abs(Math.round(lat * 10000 + lon * 10000))}`,
              name: cityName,
              displayName,
              city: cityName,
              region: stateName || undefined,
              country: countryName || 'Dünya',
              countryCode: cCode || 'XX',
              lat,
              lon,
              timezone: tz,
              defaultTz: cCode === 'TR' ? 3 : undefined
            });
          }
        }
      }
    } catch {
      // Nominatim failed as well
    }
  }

  // Birleştir ve duplicate koordinatları ele
  const combined: ResolvedLocation[] = [...localResults];
  const seenCoordinates = new Set(localResults.map(l => `${l.lat.toFixed(2)}_${l.lon.toFixed(2)}`));

  for (const rem of remoteResults) {
    const coordKey = `${rem.lat.toFixed(2)}_${rem.lon.toFixed(2)}`;
    if (!seenCoordinates.has(coordKey)) {
      seenCoordinates.add(coordKey);
      combined.push(rem);
    }
  }

  const finalResults = combined.slice(0, 10);
  RESOLUTION_CACHE.set(cacheKey, finalResults);
  return finalResults;
}

/**
 * Senkron konum çözümleme (astrology.ts ve hızlı motorlar için)
 * Kullanıcının serbest metnini offline zengin veri tabanında eşleştirir.
 */
export function resolveLocationSync(cityInput?: string | Partial<ResolvedLocation>): ResolvedLocation {
  if (!cityInput) {
    throw new LocationValidationError('Location validation error: Doğum yeri tanınamadı. Doğum haritası hesaplanabilmesi için geçerli bir şehir/konum girilmelidir.');
  }

  // 1. Zaten koordinatları olan bir nesne mi?
  if (typeof cityInput === 'object') {
    if (typeof cityInput.lat === 'number' && typeof cityInput.lon === 'number' && !isNaN(cityInput.lat) && !isNaN(cityInput.lon)) {
      const lat = cityInput.lat;
      const lon = cityInput.lon;
      const tz = cityInput.timezone || getTimezoneForCoordinates(lat, lon);
      return {
        id: cityInput.id || `loc_custom_${Math.round(lat * 100)}_${Math.round(lon * 100)}`,
        name: cityInput.name || cityInput.displayName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        displayName: cityInput.displayName || cityInput.name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        city: cityInput.city || cityInput.name || 'Özel Konum',
        region: cityInput.region,
        country: cityInput.country || 'Dünya',
        countryCode: cityInput.countryCode || 'XX',
        lat,
        lon,
        timezone: tz,
        defaultTz: cityInput.defaultTz
      };
    }
  }

  const query = typeof cityInput === 'string' ? cityInput.trim() : '';
  if (!query) {
    throw new LocationValidationError('Location validation error: Doğum yeri tanınamadı. Doğum haritası hesaplanabilmesi için geçerli bir şehir/konum girilmelidir.');
  }

  const clean = normalizeLocationText(query);
  if (!clean) {
    throw new LocationValidationError('Location validation error: Doğum yeri tanınamadı. Lütfen şehir ve ülke adını kontrol edin.');
  }

  // Exact name, display name or alias match
  const exactMatches = OFFLINE_WORLD_LOCATIONS.filter(seed => {
    const normName = normalizeLocationText(seed.name);
    const normCity = normalizeLocationText(seed.city);
    const normDisplay = normalizeLocationText(seed.displayName);
    const normAliases = (seed.aliases || []).map(normalizeLocationText);

    return (
      clean === normDisplay ||
      clean === normName ||
      normAliases.includes(clean) ||
      clean === normCity
    );
  });

  if (exactMatches.length === 1) {
    return buildResolvedItem(exactMatches[0]);
  }

  if (exactMatches.length > 1) {
    // Specific match for exact display name or alias
    const specificMatch = exactMatches.find(seed => 
      clean === normalizeLocationText(seed.displayName) ||
      clean === normalizeLocationText(seed.name) ||
      (seed.aliases || []).map(normalizeLocationText).includes(clean)
    );
    if (specificMatch && exactMatches.filter(m => normalizeLocationText(m.displayName) === clean || (m.aliases || []).map(normalizeLocationText).includes(clean)).length === 1) {
      return buildResolvedItem(specificMatch);
    }

    // Birden fazla farklı şehir varsa (Örn: Springfield IL, MO, MA), kullanıcıdan seçim istemelidir (Asla rastgele seçilmez)
    const candidates = exactMatches.map(buildResolvedItem);
    throw new LocationValidationError(
      `Birden fazla eşleşme bulundu ("${query}"). Lütfen konumu listeden seçin.`,
      candidates
    );
  }

  // Multi-token match
  const matches = searchLocalLocations(query);
  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    const distinctCities = new Set(matches.map(m => `${m.city}_${m.region}_${m.country}`));
    if (distinctCities.size > 1) {
      throw new LocationValidationError(
        `Birden fazla eşleşme bulundu ("${query}"). Lütfen konumu listeden seçin.`,
        matches.slice(0, 6)
      );
    }
    return matches[0];
  }

  // Eşleşme yerel veritabanında bulunamadı: KESİNLİKLE İSTANBUL VEYA TAHMİNİ KOORDİNAT KULLANILMAZ
  throw new LocationValidationError(
    `Location validation error: Doğum yeri tanınamadı ("${query}"). Lütfen geçerli bir şehir ve ülke adı girin (Örn: "San Francisco, USA", "Tokyo, Japan", "İzmir, Türkiye").`
  );
}

/**
 * Asenkron konum çözümleme (Tüm dünya şehirleri, kasabaları ve ilçeleri için canlı API destekli)
 */
export async function resolveLocationAsync(
  cityInput?: string | Partial<ResolvedLocation>,
  countryCode?: string
): Promise<ResolvedLocation> {
  if (!cityInput) {
    throw new LocationValidationError('Location validation error: Doğum yeri tanınamadı. Doğum haritası hesaplanabilmesi için geçerli bir şehir/konum girilmelidir.');
  }

  // 1. Zaten koordinatları olan nesne mi?
  if (typeof cityInput === 'object') {
    if (typeof cityInput.lat === 'number' && typeof cityInput.lon === 'number' && !isNaN(cityInput.lat) && !isNaN(cityInput.lon)) {
      return resolveLocationSync(cityInput);
    }
  }

  const query = typeof cityInput === 'string' ? cityInput.trim() : '';
  if (!query) {
    throw new LocationValidationError('Location validation error: Doğum yeri tanınamadı. Lütfen geçerli bir şehir ve ülke adı giriniz.');
  }

  // 2. Önce yerel veritabanında dene
  try {
    const local = resolveLocationSync(query);
    if (local) return local;
  } catch (err: unknown) {
    if (err instanceof LocationValidationError && err.candidates && err.candidates.length > 1) {
      throw err;
    }
    // Yerelde yoksa küresel Geocoding API'sine devam et
  }

  // 3. Küresel API'de ara (Photon / Nominatim)
  const results = await searchGlobalLocationsApi(query, countryCode);

  if (results.length === 0) {
    throw new LocationValidationError(
      `Location validation error: Doğum yeri tanınamadı ("${query}"). Lütfen şehir ve ülke adını kontrol edin (Örn: "San Francisco, USA", "Tokyo, Japan", "İzmir, Türkiye").`
    );
  }

  if (results.length === 1) {
    return results[0];
  }

  // Eğer kullanıcı tam olarak şehir + ülke yazmışsa (Örn: "Heidelberg, Germany" veya "San Francisco, California, USA"),
  // sonuçlar arasındaki en yakın / tam eşleşmeyi tespit et
  const cleanQ = normalizeLocationText(query);
  const exactCandidate = results.find(r => {
    const normDisp = normalizeLocationText(r.displayName);
    const normCity = normalizeLocationText(r.city);
    return cleanQ === normDisp || cleanQ === `${normCity} ${normalizeLocationText(r.country)}`;
  });

  if (exactCandidate) {
    return exactCandidate;
  }

  // Birden fazla eşleşme varsa kullanıcıya seçenek sun (ASLA rastgele seçme)
  throw new LocationValidationError(
    `Birden fazla eşleşme bulundu ("${query}"). Lütfen konumu listeden seçin.`,
    results.slice(0, 6)
  );
}
