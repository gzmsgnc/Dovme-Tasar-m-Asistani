import { AstrologyProfile } from '../types';

export interface ZodiacSignInfo {
  name: string;
  symbol: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  modality: 'Öncü' | 'Sabit' | 'Değişken';
  rulingPlanet: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  archetype: string;
  keywords: string[];
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    name: 'Koç',
    symbol: '♈',
    element: 'Ateş',
    modality: 'Öncü',
    rulingPlanet: 'Mars',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    archetype: 'Savaşçı & Öncü Kıvılcım',
    keywords: ['Cesaret', 'Ateş', 'Dinamizm', 'Öncülük', 'Yenilmezlik'],
    description: 'Ham yaşam enerjisi, inisiyatif alma gücü ve durdurulamaz atılım.'
  },
  {
    name: 'Boğa',
    symbol: '♉',
    element: 'Toprak',
    modality: 'Sabit',
    rulingPlanet: 'Venüs',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    archetype: 'Mimar & Doğanın Koruyucusu',
    keywords: ['Kalıcılık', 'Estetik', 'Güven', 'Huzur', 'Doğurganlık'],
    description: 'Somut yaratım, köklenme gücü, bedensel ve estetik zarafet.'
  },
  {
    name: 'İkizler',
    symbol: '♊',
    element: 'Hava',
    modality: 'Değişken',
    rulingPlanet: 'Merkür',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    archetype: 'Elçi & Meraklı Simyacı',
    keywords: ['İletişim', 'İkili Doğa', 'Hız', 'Kavrayış', 'Bağlantı'],
    description: 'Zihinsel esneklik, zıtlıkların uyumu ve kutsal bilgi aktarımı.'
  },
  {
    name: 'Yengeç',
    symbol: '♋',
    element: 'Su',
    modality: 'Öncü',
    rulingPlanet: 'Ay',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    archetype: 'Kutsal Anne & Sezgisel Muhafız',
    keywords: ['Derin Duygu', 'Koruyuculuk', 'Hafıza', 'Gizem', 'Sezgi'],
    description: 'Okyanussal duyarlılık, kadim koruma içgüdüsü ve şifacı kalkan.'
  },
  {
    name: 'Aslan',
    symbol: '♌',
    element: 'Ateş',
    modality: 'Sabit',
    rulingPlanet: 'Güneş',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    archetype: 'Güneş Hükümdarı & Yürekli Yaratıcı',
    keywords: ['Asalet', 'Işık', 'Yaratıcılık', 'Cömertlik', 'Karizma'],
    description: 'Merkezdeki saf ışık, onurlu irade ve görkemli ifade gücü.'
  },
  {
    name: 'Başak',
    symbol: '♍',
    element: 'Toprak',
    modality: 'Değişken',
    rulingPlanet: 'Merkür',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    archetype: 'Kutsal Şifacı & Geometrik Usta',
    keywords: ['Arınma', 'Kusursuzluk', 'Hizmet', 'Detay', 'Analitik Zeka'],
    description: 'Kaosu kozmosa çeviren düzen, şifalı otlar ve zanaat ustalığı.'
  },
  {
    name: 'Terazi',
    symbol: '♎',
    element: 'Hava',
    modality: 'Öncü',
    rulingPlanet: 'Venüs',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    archetype: 'Kozmik Yargıç & Denge Sanatçısı',
    keywords: ['Adalet', 'Simetri', 'Uyum', 'Zarafet', 'Kozmik Denge'],
    description: 'Kutsal geometri, kusursuz estetik ve evrensel denge arayışı.'
  },
  {
    name: 'Akrep',
    symbol: '♏',
    element: 'Su',
    modality: 'Sabit',
    rulingPlanet: 'Plüton & Mars',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    archetype: 'Simyacı & Küllerinden Doğan Anka',
    keywords: ['Dönüşüm', 'Gölge Entegrasyonu', 'Güç', 'Manyetizma', 'Ölüm-Yeniden Doğuş'],
    description: 'Ruhun en derin karanlıklarını altına dönüştüren simyasal güç.'
  },
  {
    name: 'Yay',
    symbol: '♐',
    element: 'Ateş',
    modality: 'Değişken',
    rulingPlanet: 'Jüpiter',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    archetype: 'Kozmik Gezgin & Hakikat Okçusu',
    keywords: ['Vizyon', 'Genişleme', 'Özgürlük', 'Felsefe', 'Uzak Ufuklar'],
    description: 'Yıldızlara hedeflenen kutsal ok, evrensel hakikat ve sınır tanımaz bilinç.'
  },
  {
    name: 'Oğlak',
    symbol: '♑',
    element: 'Toprak',
    modality: 'Öncü',
    rulingPlanet: 'Satürn',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    archetype: 'Kadim Bilge & Zamanın Efendisi',
    keywords: ['Ustalık', 'Metanet', 'Zaman', 'Yapı', 'Zirve'],
    description: 'Dağların doruklarına ulaşan sabır, kristalleşen bilgelik ve zamanın gücü.'
  },
  {
    name: 'Kova',
    symbol: '♒',
    element: 'Hava',
    modality: 'Sabit',
    rulingPlanet: 'Uranüs & Satürn',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    archetype: 'Fütüristik Kahin & Yıldız Taşıyıcısı',
    keywords: ['Özgünlük', 'Devrim', 'Kozmik Zeka', 'İnsanlık', 'Elektrik'],
    description: 'Geleceğin frekansı, kalıpları yıkan yüksek zeka ve evrensel bilinç.'
  },
  {
    name: 'Balık',
    symbol: '♓',
    element: 'Su',
    modality: 'Değişken',
    rulingPlanet: 'Neptün & Jüpiter',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    archetype: 'Mistik Hayalperest & Bütünleşmiş Ruh',
    keywords: ['Birlik Bilinci', 'Transandantal Sezgi', 'Kozmik Okyanus', 'Rüya', 'Şefkat'],
    description: 'Formların ötesindeki birlik, sonsuz rüyalar alemi ve saf ruhani akış.'
  }
];

import { 
  resolveLocationSync,
  resolveLocationAsync,
  LocationValidationError, 
  getTimezoneOffsetHoursForDate, 
  ResolvedLocation 
} from './locationResolver';

export { LocationValidationError };

// Coordinate & Timezone Lookup Database
export interface CityLocation {
  name: string;
  lat: number;
  lon: number;
  defaultTz?: number;
  timezone?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  displayName?: string;
}

/**
 * Takvim Tarihi Doğrulama Hatası (Date validation error)
 * Doğum tarihi formatı bozuk olduğunda veya takvimde gerçekte var olmayan bir tarih girildiğinde fırlatılır.
 */
export class DateValidationError extends Error {
  constructor(message = 'Date validation error: Doğum tarihi formatı YYYY-AA-GG şeklinde ve gerçek bir takvim tarihi olmalıdır.') {
    super(message);
    this.name = 'DateValidationError';
    Object.setPrototypeOf(this, DateValidationError.prototype);
  }
}

/**
 * Doğum yerini dünya çapındaki konum veritabanında çözümler.
 * Asla tahmini, rastgele veya İstanbul varsayılanı kullanmaz.
 */
export function resolveCityLocation(cityInput?: string | Partial<ResolvedLocation>): CityLocation {
  const resolved = resolveLocationSync(cityInput);
  return {
    name: resolved.name,
    displayName: resolved.displayName,
    city: resolved.city,
    region: resolved.region,
    country: resolved.country,
    countryCode: resolved.countryCode,
    lat: resolved.lat,
    lon: resolved.lon,
    timezone: resolved.timezone,
    defaultTz: resolved.defaultTz
  };
}

/**
 * Küresel doğum yeri çözümleme.
 * Senkron motor yalnızca yerel çekirdek veri tabanını kapsar; bu fonksiyon
 * yerelde bulunmayan geçerli dünya şehirlerini Photon/Nominatim üzerinden çözer.
 * Asla İstanbul, sabit koordinat veya tahmini şehir kullanılmaz.
 */
export async function resolveCityLocationAsync(
  cityInput?: string | Partial<ResolvedLocation>,
  countryCode?: string
): Promise<CityLocation> {
  const resolved = await resolveLocationAsync(cityInput, countryCode);
  return {
    name: resolved.name,
    displayName: resolved.displayName,
    city: resolved.city,
    region: resolved.region,
    country: resolved.country,
    countryCode: resolved.countryCode,
    lat: resolved.lat,
    lon: resolved.lon,
    timezone: resolved.timezone,
    defaultTz: resolved.defaultTz
  };
}

export function isCitySupported(cityInput?: string): boolean {
  if (!cityInput || !cityInput.trim()) return false;
  try {
    resolveLocationSync(cityInput);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gerçek Takvim Tarihi Doğrulama Fonksiyonu
 * 
 * Doğum tarihinin:
 * - YYYY-AA-GG (örnek: 1991-04-23) formatında olması,
 * - Gerçek bir tarih olması,
 * - Geçerli bir ay (1-12) içermesi,
 * - Geçerli bir gün içermesi ve ilgili ayın gerçek gün sayısını (artık yıllar dahil) aşmamasını
 * kesin olarak garanti eder.
 * 
 * 1991-99-99, 1991-02-31, 1991-13-10 gibi geçersiz tarihler için açık bir hata fırlatır;
 * hiçbir tahmini veya normalize edilmiş tarih üretilmez.
 */
export function validateCalendarDate(birthDateStr?: string): { year: number; month: number; day: number } {
  if (!birthDateStr || typeof birthDateStr !== 'string' || !birthDateStr.trim()) {
    throw new DateValidationError('Date validation error: Doğum tarihi zorunludur. Doğum haritası ve numeroloji hesaplanabilmesi için geçerli bir tarih girilmelidir.');
  }

  const trimmed = birthDateStr.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    throw new DateValidationError('Date validation error: Doğum tarihi formatı YYYY-AA-GG (örnek: 1991-04-23) şeklinde olmalıdır.');
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (isNaN(year) || year < 1000 || year > 2500) {
    throw new DateValidationError(`Date validation error: Geçersiz doğum yılı: ${match[1]}. Yıl 1000 ile 2500 arasında olmalıdır.`);
  }

  if (month < 1 || month > 12) {
    throw new DateValidationError(`Date validation error: Geçersiz takvim ayı: ${match[2]}. Ay değeri 01 ile 12 arasında olmalıdır.`);
  }

  // Artık yıl hesabı: 4'e bölünen yıllar artık yıldır, ancak 100'e bölünüp 400'e bölünmeyenler artık yıl değildir.
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDays = daysInMonths[month - 1];

  if (day < 1 || day > maxDays) {
    throw new DateValidationError(`Date validation error: Geçersiz takvim tarihi (${trimmed}): ${year} yılının ${month}. ayı en fazla ${maxDays} gün içerir.`);
  }

  return { year, month, day };
}

export function isValidCalendarDate(birthDateStr?: string): { valid: boolean; error?: string } {
  try {
    validateCalendarDate(birthDateStr);
    return { valid: true };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Timezone offset for Turkey / Europe historical rules
export function getTimezoneOffsetHours(year: number, month: number, day: number, defaultTz = 2): number {
  // Turkey permanent UTC+3 started on September 8, 2016
  if (defaultTz === 2 || defaultTz === 3) {
    if (year > 2016 || (year === 2016 && (month > 9 || (month === 9 && day >= 8)))) {
      return 3;
    }
    // European DST in Turkey historically: late March to late October (+3 in summer, +2 in winter)
    const isSummerDST = month > 3 && month < 10;
    if (isSummerDST) return 3;
    if (month === 3 && day >= 25) return 3;
    if (month === 10 && day <= 25) return 3;
    return 2; // Winter time (EET)
  }
  return defaultTz;
}

// Math & Angle Utilities
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function normalizeDegrees(deg: number): number {
  let b = deg % 360.0;
  if (b < 0) b += 360.0;
  return b;
}

// Julian Day Calculation
export function calculateJulianDay(year: number, month: number, day: number, utHours: number): number {
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5 + utHours / 24.0;
  return JD;
}

// Lahiri (Chitra-Paksha) Ayanamsa for Sidereal Zodiac
export function calculateLahiriAyanamsa(JD: number): number {
  // Lahiri Ayanamsa at J2000.0 (JD 2451545.0) is approx 23° 51' 25" (23.856944°)
  // Precession rate: 50.290966 arcsec/year
  const diffDays = JD - 2451545.0;
  const ayanamsa = 23.856944 + (diffDays * 50.290966) / (3600.0 * 365.25);
  return ayanamsa;
}

// High Precision Sun Longitude (VSOP87 / Meeus)
export function calculateSunEclipticLongitude(JD: number): number {
  const T = (JD - 2451545.0) / 36525.0;
  // Mean longitude of Sun
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Mean anomaly of Sun
  const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = degToRad(M);

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);

  // True longitude
  const sunTrueLong = normalizeDegrees(L0 + C);
  // Apparent longitude (aberration & nutation correction)
  const omega = normalizeDegrees(125.04 - 1934.136 * T);
  const lambda = normalizeDegrees(sunTrueLong - 0.00569 - 0.00478 * Math.sin(degToRad(omega)));
  return lambda;
}

// High-Precision Lunar Ephemeris (Jean Meeus Astronomical Algorithms Ch 47 & 48)
export function calculateMoonEclipticLongitude(JD: number): number {
  const T = (JD - 2451545.0) / 36525.0;

  // Fundamental arguments (in degrees)
  const Lp = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841.0 - (T * T * T * T) / 65194000.0);
  const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868.0 - (T * T * T * T) / 113065000.0);
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000.0);
  const Mp = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699.0 - (T * T * T * T) / 14712000.0);
  const F = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000.0 + (T * T * T * T) / 863310000.0);

  // Periodic perturbations in longitude (Meeus Table 47.A)
  const sinDeg = (angle: number) => Math.sin(degToRad(angle));

  let sigmaL = 0;
  sigmaL += 6.288774 * sinDeg(Mp);
  sigmaL += 1.274027 * sinDeg(2 * D - Mp);
  sigmaL += 0.658314 * sinDeg(2 * D);
  sigmaL += 0.213618 * sinDeg(2 * Mp);
  sigmaL -= 0.185116 * sinDeg(M);
  sigmaL -= 0.114332 * sinDeg(2 * F);
  sigmaL += 0.058793 * sinDeg(2 * D - 2 * Mp);
  sigmaL += 0.057066 * sinDeg(2 * D - M - Mp);
  sigmaL += 0.053322 * sinDeg(2 * D + Mp);
  sigmaL += 0.045758 * sinDeg(2 * D - M);
  sigmaL -= 0.040923 * sinDeg(M - Mp);
  sigmaL -= 0.034720 * sinDeg(D);
  sigmaL -= 0.030383 * sinDeg(M + Mp);
  sigmaL += 0.015327 * sinDeg(2 * D - 2 * F);
  sigmaL -= 0.012528 * sinDeg(2 * D + M - Mp);
  sigmaL += 0.010980 * sinDeg(Mp + 2 * F);
  sigmaL += 0.010675 * sinDeg(4 * D - Mp);
  sigmaL += 0.010034 * sinDeg(3 * Mp);
  sigmaL += 0.008548 * sinDeg(4 * D - 2 * Mp);
  sigmaL -= 0.007888 * sinDeg(2 * D - M + Mp);
  sigmaL -= 0.006766 * sinDeg(2 * D + M);
  sigmaL -= 0.005163 * sinDeg(D - Mp);
  sigmaL += 0.004987 * sinDeg(D + M);
  sigmaL += 0.004036 * sinDeg(2 * D - Mp + 2 * F);
  sigmaL += 0.003994 * sinDeg(2 * D - 2 * Mp - M);
  sigmaL += 0.003861 * sinDeg(4 * D);
  sigmaL += 0.003665 * sinDeg(2 * D - 3 * Mp);
  sigmaL -= 0.002689 * sinDeg(Mp - 2 * F);
  sigmaL -= 0.002602 * sinDeg(2 * D - M + 2 * F);
  sigmaL += 0.002390 * sinDeg(2 * D - 2 * F - Mp);
  sigmaL -= 0.002348 * sinDeg(D + Mp);
  sigmaL += 0.002236 * sinDeg(2 * D - 2 * Mp + M);
  sigmaL -= 0.002120 * sinDeg(2 * Mp - 2 * F);
  sigmaL -= 0.002069 * sinDeg(2 * D + 2 * Mp);
  sigmaL += 0.002048 * sinDeg(2 * D - 2 * Mp - 2 * F);
  sigmaL -= 0.001773 * sinDeg(2 * D + Mp - 2 * F);
  sigmaL -= 0.001595 * sinDeg(2 * D + 2 * F);
  sigmaL += 0.001215 * sinDeg(4 * D - Mp - M);
  sigmaL -= 0.001110 * sinDeg(2 * Mp + 2 * F);
  sigmaL += 0.000892 * sinDeg(3 * D - Mp);
  sigmaL -= 0.000811 * sinDeg(2 * D + M - 2 * F);
  sigmaL += 0.000759 * sinDeg(4 * D - 2 * Mp - M);
  sigmaL -= 0.000713 * sinDeg(2 * Mp - M);
  sigmaL -= 0.000700 * sinDeg(2 * D + 2 * Mp - M);
  sigmaL += 0.000691 * sinDeg(2 * D + Mp - M);
  sigmaL += 0.000596 * sinDeg(2 * D - Mp - 2 * F);
  sigmaL += 0.000549 * sinDeg(4 * D + Mp);
  sigmaL += 0.000537 * sinDeg(4 * Mp);
  sigmaL += 0.000520 * sinDeg(4 * D - 3 * Mp);
  sigmaL -= 0.000487 * sinDeg(D - 2 * Mp);
  sigmaL -= 0.000399 * sinDeg(2 * D + Mp + 2 * F);
  sigmaL -= 0.000381 * sinDeg(2 * Mp - 2 * F - M);
  sigmaL += 0.000351 * sinDeg(D + Mp - M);
  sigmaL -= 0.000340 * sinDeg(3 * D);
  sigmaL += 0.000330 * sinDeg(4 * D - 2 * Mp + M);
  sigmaL += 0.000327 * sinDeg(2 * D - Mp - M + 2 * F);
  sigmaL -= 0.000323 * sinDeg(2 * Mp + M);
  sigmaL += 0.000299 * sinDeg(D - M);

  // Venus and Jupiter perturbations
  sigmaL += 0.003958 * sinDeg(119.75 + 131.849 * T);
  sigmaL += 0.001962 * sinDeg(53.09 + 479264.290 * T);
  sigmaL += 0.000318 * sinDeg(313.45 + 481266.484 * T);

  // Total apparent ecliptic longitude
  const moonLong = normalizeDegrees(Lp + sigmaL);
  return moonLong;
}

// Ascendant (ASC / Yükselen Burç) via Greenwich Mean Sidereal Time & Local Sidereal Time
export function calculateAscendantLongitude(JD: number, latDeg: number, lonDeg: number): {
  ascendantLong: number;
  gmstDeg: number;
  lstDeg: number;
  obliquityDeg: number;
} {
  const T = (JD - 2451545.0) / 36525.0;
  // Obliquity of Ecliptic (eps)
  const eps = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;

  // Greenwich Mean Sidereal Time (GMST) in degrees
  const gmst = normalizeDegrees(280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0);

  // Local Sidereal Time (LST)
  const lst = normalizeDegrees(gmst + lonDeg);

  // Ascendant Calculation
  // RAMC = LST
  const ramcRad = degToRad(lst);
  const epsRad = degToRad(eps);
  const latRad = degToRad(latDeg);

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(ramcRad));
  const ascRad = Math.atan2(y, x);
  const ascendantLong = normalizeDegrees(radToDeg(ascRad));

  return {
    ascendantLong,
    gmstDeg: gmst,
    lstDeg: lst,
    obliquityDeg: eps
  };
}

// Format longitude as sign name & degrees/minutes (e.g. 29° 24' İkizler)
export function formatDegreeInSign(longitude: number, signName: string): string {
  const degInSign = longitude % 30.0;
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60.0);
  return `${d}° ${m.toString().padStart(2, '0')}' ${signName}`;
}

// Resolve Zodiac sign from exact longitude
export function getSignFromLongitude(longitude: number): {
  sign: ZodiacSignInfo;
  signIndex: number;
  degreeInSign: number;
} {
  const norm = normalizeDegrees(longitude);
  const signIndex = Math.floor(norm / 30.0) % 12;
  const degreeInSign = norm % 30.0;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    signIndex,
    degreeInSign
  };
}

export function getSunSign(birthDateStr: string): ZodiacSignInfo {
  const { month, day } = validateCalendarDate(birthDateStr);

  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign;
    }
  }
  throw new Error(`Belirtilen doğum günü (${day}/${month}) için Zodyak burcu aralığı eşleştirilemedi.`);
}

export function calculateAstrology(
  birthDate: string,
  birthTime?: string,
  birthPlace?: string | Partial<ResolvedLocation>,
  zodiacSystem: 'Tropical' | 'Sidereal' = 'Tropical',
  explicitLocation?: Partial<ResolvedLocation>
): AstrologyProfile {
  // 1. Gerçek takvim doğrulaması (YYYY-AA-GG formatı, geçerli ay/gün ve artık yıl kontrolü)
  const { year, month, day } = validateCalendarDate(birthDate);

  // 2. Doğum yeri kontrolü (Boş veya veritabanında olmayan yerlerde İstanbul fallback'i KESİNLİKLE kaldırılmıştır)
  const location = explicitLocation && typeof explicitLocation.lat === 'number' && typeof explicitLocation.lon === 'number'
    ? resolveLocationSync(explicitLocation)
    : resolveCityLocation(birthPlace);

  const hasBirthTime = Boolean(birthTime && birthTime.trim());

  let hours = 12;
  let minutes = 0;
  if (hasBirthTime) {
    const [h, m] = (birthTime || '12:00').split(':').map(Number);
    hours = isNaN(h) ? 12 : h;
    minutes = isNaN(m) ? 0 : m;
  }

  // Calculate local timezone offset taking into account real IANA timezone & DST
  const tzOffsetHours = getTimezoneOffsetHoursForDate(
    birthDate,
    birthTime || '12:00',
    location.timezone,
    location.defaultTz ?? 3
  );
  
  // Calculate UT time in decimal hours
  const localDecimalHours = hours + minutes / 60.0;
  const utHours = localDecimalHours - tzOffsetHours;

  // Calculate Julian Day
  const JD = calculateJulianDay(year, month, day, utHours);

  // Calculate Lahiri Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(JD);

  // Calculate Tropical Astronomical Longitudes
  const tropicalSunLong = calculateSunEclipticLongitude(JD);
  const tropicalMoonLong = calculateMoonEclipticLongitude(JD);
  const { ascendantLong: tropicalAscLong, gmstDeg, lstDeg, obliquityDeg } = calculateAscendantLongitude(
    JD,
    location.lat,
    location.lon
  );

  // Apply Zodiac System (Tropical vs Sidereal)
  let activeSunLong = tropicalSunLong;
  let activeMoonLong = tropicalMoonLong;
  let activeAscLong = tropicalAscLong;

  if (zodiacSystem === 'Sidereal') {
    activeSunLong = normalizeDegrees(tropicalSunLong - ayanamsa);
    activeMoonLong = normalizeDegrees(tropicalMoonLong - ayanamsa);
    activeAscLong = normalizeDegrees(tropicalAscLong - ayanamsa);
  }

  // Determine Signs from final Longitudes
  const sunSignData = getSignFromLongitude(activeSunLong);
  const moonSignData = getSignFromLongitude(activeMoonLong);
  const ascSignData = getSignFromLongitude(activeAscLong);

  const sunSign = sunSignData.sign;
  const moonSign = moonSignData.sign;
  const ascendantSign = ascSignData.sign;

  const sunDegreeFormatted = formatDegreeInSign(activeSunLong, sunSign.name);
  const moonDegreeFormatted = formatDegreeInSign(activeMoonLong, moonSign.name);
  const ascendantDegreeFormatted = formatDegreeInSign(activeAscLong, ascendantSign.name);

  // Cusp / Ingress Detection for Moon (Critical Requirement: 29° İkizler cusp detection)
  const moonDegInSign = moonSignData.degreeInSign;
  let isMoonNearCusp = false;
  let moonCuspMessage: string | undefined = undefined;

  const nextSignIndex = (moonSignData.signIndex + 1) % 12;
  const nextSign = ZODIAC_SIGNS[nextSignIndex];
  const prevSignIndex = (moonSignData.signIndex + 11) % 12;
  const prevSign = ZODIAC_SIGNS[prevSignIndex];

  if (moonDegInSign >= 28.5) {
    isMoonNearCusp = true;
    const distanceToNext = (30.0 - moonDegInSign).toFixed(1);
    moonCuspMessage = `⚠️ Ay Burç Değişim Eşiğinde (${moonDegreeFormatted}): Ay, doğum anınızda ${moonSign.name} burcunun son derecesindedir (Anaretik 29° / Cusp) ve yaklaşık ${distanceToNext}° sonra ${nextSign.name} burcuna geçmektedir. Bu durum, hem ${moonSign.name}'in (${moonSign.keywords.slice(0, 2).join(', ')}) enerjisini hem de yaklaşan ${nextSign.name}'in (${nextSign.keywords.slice(0, 2).join(', ')}) derin sezgisel frekansını taşır. Dövme tasarımında her iki arketipin sembolik geçişi birleştirilebilir.`;
  } else if (moonDegInSign <= 1.5) {
    isMoonNearCusp = true;
    moonCuspMessage = `✦ Ay Yeni Bir Burca Giriş Yapmış (${moonDegreeFormatted}): Ay, ${prevSign.name} burcundan yeni çıkmış olup ${moonSign.name} burcunun ilk derecelerindedir. Önceki burcun son izleri ile ${moonSign.name}'in taze arketip gücü tasarımda harmanlanabilir.`;
  }

  const isAscendantEstimated = !hasBirthTime;
  const ascendantWarning = isAscendantEstimated
    ? 'Doğum saati girilmediği için Yükselen burç yaklaşık olarak öğle saati (12:00) referansıyla hesaplanmıştır. Kesin Yükselen burç (ASC) derecesi için doğum saati önerilir.'
    : undefined;

  // Element weighting calculation
  const elementCounts: Record<string, number> = { Ateş: 0, Toprak: 0, Hava: 0, Su: 0 };
  elementCounts[sunSign.element] += 3;
  elementCounts[ascendantSign.element] += isAscendantEstimated ? 1 : 2;
  elementCounts[moonSign.element] += 2;

  let dominantElement = 'Ateş';
  let maxWeight = -1;
  Object.entries(elementCounts).forEach(([elem, weight]) => {
    if (weight > maxWeight) {
      maxWeight = weight;
      dominantElement = elem;
    }
  });

  const keywords = Array.from(
    new Set([
      ...sunSign.keywords,
      ...moonSign.keywords.slice(0, 2),
      ...ascendantSign.keywords.slice(0, 2)
    ])
  ).slice(0, 7);

  const systemNameTr = zodiacSystem === 'Tropical' ? 'Batı / Tropikal Zodyak' : 'Vedik / Sideral Zodyak (Lahiri Ayanamsa)';

  const summary = `[${systemNameTr}] Güneş ${sunSign.name} (${sunDegreeFormatted} - ${sunSign.archetype}) temel iradeyi, Ay ${moonSign.name} (${moonDegreeFormatted}) bilinçaltı sezgilerini, Yükselen ${ascendantSign.name} (${ascendantDegreeFormatted}${isAscendantEstimated ? ' - Tahmini' : ''}) dış dünyaya açılan formu yönetir. Hakim ${dominantElement} elementi dövmedeki ritmi belirler.${isMoonNearCusp ? ' (Ay burç geçiş eşiğindedir).' : ''}`;

  return {
    zodiacSystem,
    sunSign: sunSign.name,
    sunSignSymbol: sunSign.symbol,
    sunSignElement: sunSign.element,
    sunSignModality: sunSign.modality,
    sunLongitude: activeSunLong,
    sunDegreeFormatted,
    rulingPlanet: sunSign.rulingPlanet,
    
    moonSign: moonSign.name,
    moonSignSymbol: moonSign.symbol,
    moonLongitude: activeMoonLong,
    moonDegreeFormatted,
    isMoonNearCusp,
    moonCuspMessage,

    ascendantSign: ascendantSign.name,
    ascendantSignSymbol: ascendantSign.symbol,
    ascendantLongitude: activeAscLong,
    ascendantDegreeFormatted,
    isAscendantEstimated,
    ascendantWarning,

    ayanamsaName: zodiacSystem === 'Sidereal' ? 'Lahiri (Chitra-Paksha)' : undefined,
    ayanamsaDegrees: zodiacSystem === 'Sidereal' ? ayanamsa : undefined,

    usedBirthDate: birthDate || 'Belirtilmedi',
    usedBirthTime: hasBirthTime ? birthTime! : 'Bilinmiyor / Girilmedi (12:00 Varsayıldı)',
    usedBirthPlace: `${location.name} (${location.lat.toFixed(2)}°K, ${location.lon.toFixed(2)}°D)`,
    dominantElement,
    archetype: sunSign.archetype,
    keywords,
    summary,

    astronomicalDetails: {
      julianDay: JD,
      utTime: `${Math.floor(utHours).toString().padStart(2, '0')}:${Math.floor((utHours % 1) * 60).toString().padStart(2, '0')} UT`,
      localSiderealTime: `${Math.floor(lstDeg)}° ${Math.floor((lstDeg % 1) * 60)}' LST`,
      greenwichMeanSiderealTime: `${Math.floor(gmstDeg)}° ${Math.floor((gmstDeg % 1) * 60)}' GMST`,
      latitude: location.lat,
      longitude: location.lon,
      timezoneOffsetHours: tzOffsetHours,
      obliquity: obliquityDeg,
      ayanamsaDegrees: ayanamsa
    }
  };
}
