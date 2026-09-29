import { 
  BehavioralDimensionKey, 
  BehavioralVector, 
  TotemAnimalProfile, 
  TOTEM_ANIMALS_52,
  BEHAVIORAL_DIMENSION_LABELS,
  getTotemAnimalById,
  getTotemAnimalStrict
} from './totemCatalogData';
import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult,
  TotemTestCalculationResult,
  TotemMatchScore
} from './behavioralTotemEngine';
import { validateCalendarDate } from './astrology';

export { 
  TOTEM_ANIMALS_52, 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  BEHAVIORAL_DIMENSION_LABELS,
  calculateBehavioralTotemResult,
  getTotemAnimalById,
  getTotemAnimalStrict
};
export type { 
  BehavioralDimensionKey, 
  BehavioralVector, 
  TotemAnimalProfile,
  TotemTestCalculationResult,
  TotemMatchScore 
};

// Backwards-compatible aliases
export type TotemAnimalDefinition = TotemAnimalProfile;
export const TOTEM_ANIMALS_CATALOG = TOTEM_ANIMALS_52;

export interface PersonalTotemInput {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  motherName?: string;
  personalNumbers?: string;
  personalStory?: string;
  zodiacSystem?: 'Tropical' | 'Sidereal';
  totemAnswers?: Record<number, string>;
  enneagramType?: number;
  lifePathNumber?: number;
  dominantElement?: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | string;
  sunSign?: string;
  primaryTotemId?: string;
  secondaryTotemId?: string;
  shadowTotemId?: string;
  totemConfidenceScore?: number;
}

export interface TotemCalculationResult {
  primaryTotem: TotemAnimalProfile;
  shadowTotem: TotemAnimalProfile;
  allyTotem: TotemAnimalProfile;
  isBehavioralTestBased: boolean;
  behavioralReport?: TotemTestCalculationResult;
  calculationBreakdown: {
    birthDateSignature: number;
    timeQuadrantSignature: number;
    placeSignature: number;
    nameMatrixSignature: number;
    totalDeterministicHash: number;
    circadianQuadrant: string;
    planetaryDayRuler: string;
    elementalDominance: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | string;
    rationale: string;
  };
}

function hashString(str: string): number {
  let hash = 2166136261;
  const normalized = str.toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
  
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function getDayOfYear(year: number, month: number, day: number): number {
  const daysInMonths = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let total = day;
  for (let i = 0; i < month - 1; i++) {
    total += daysInMonths[i];
  }
  return total;
}

/**
 * Kişiye Özel Totem Hayvanı Hesaplama Motoru
 * 
 * 1. Eğer kullanıcının Davranışsal Totem Testi yanıtları (totemAnswers) varsa:
 *    -> Doğrudan 20 boyutlu Z-score normalize davranışsal vektör, 52 hayvan arketipi ve 
 *       astrolojik element rezonansı üzerinden deterministik olarak hesaplar!
 * 2. Eğer henüz test yanıtı yoksa:
 *    -> Doğum tarihi, saati, sirkadiyen fazı, doğum yeri, isim & anne adı frekansı,
 *       Yaşam Yolu sayısı ve Zodyak hakim elementinden 52 hayvanlık zengin havuz üzerinden
 *       tamamen deterministik ve dengeli olarak hesaplar.
 */
export function calculateTotemAnimal(personalData: PersonalTotemInput): TotemCalculationResult {
  const { 
    name, 
    birthDate, 
    birthTime, 
    birthPlace, 
    motherName, 
    totemAnswers, 
    enneagramType,
    lifePathNumber,
    dominantElement,
    sunSign
  } = personalData;

  // 1. Gerçek Takvim Tarihi Doğrulaması
  const { year, month, day } = validateCalendarDate(birthDate);

  // Yaşam Yolu hesaplaması (eğer parametrede geçilmediyse doğrudan doğum tarihinden hesaplanır)
  let actualLifePath = lifePathNumber;
  if (!actualLifePath) {
    const digits = `${day}${month}${year}`.split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    actualLifePath = sum;
  }

  const dayOfYear = getDayOfYear(year, month, day);
  const dateSignature = (year * 367) + (month * 31) + day + (dayOfYear * 7);

  // 2. Doğum Saati Vektörü
  let hour = 12;
  let minute = 0;
  if (birthTime && birthTime.includes(':')) {
    const timeParts = birthTime.split(':');
    hour = Math.min(23, Math.max(0, parseInt(timeParts[0], 10) || 12));
    minute = Math.min(59, Math.max(0, parseInt(timeParts[1], 10) || 0));
  }
  const minuteOfDay = (hour * 60) + minute;
  const timeSignature = (minuteOfDay * 19) + (hour * 73) + (minute * 3);

  let circadianQuadrant = 'Gündüz (Zenit)';
  if (hour >= 22 || hour < 4) circadianQuadrant = 'Gece & Kozmik Boşluk';
  else if (hour >= 4 && hour < 10) circadianQuadrant = 'Şafak & Uyanış';
  else if (hour >= 10 && hour < 16) circadianQuadrant = 'Öğle & Güneş Gücü';
  else circadianQuadrant = 'Günbatımı & Alacakaranlık';

  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const planetaryRulers = ['Güneş (Pazar)', 'Ay (Pazartesi)', 'Mars (Salı)', 'Merkür (Çarşamba)', 'Jüpiter (Perşembe)', 'Venüs (Cuma)', 'Satürn (Cumartesi)'];
  const planetaryDayRuler = planetaryRulers[dayOfWeek] || 'Güneş';

  const placeClean = (birthPlace && birthPlace.trim()) || 'Anadolu';
  const placeSignature = hashString(placeClean);

  const nameClean = (name && name.trim()) || 'Danışan';
  const nameSignature = hashString(nameClean);
  const motherSignature = motherName && motherName.trim() ? hashString(motherName.trim()) * 13 : 0;
  const lpSignature = actualLifePath * 997;
  const elementBonusSeed = dominantElement ? hashString(dominantElement) * 17 : 31;

  const totalDeterministicHash = Math.abs(
    ((dateSignature * 31) ^ (timeSignature * 127) ^ (placeSignature * 59) ^ ((nameSignature + motherSignature) * 97) ^ lpSignature ^ elementBonusSeed)
  );

  const totalCatalogSize = TOTEM_ANIMALS_52.length; // 52

  // 1. Eğer davranışsal test yanıtları mevcutsa (15 soruluk testten gelen cevaplar):
  if (totemAnswers && Object.keys(totemAnswers).length > 0) {
    const behavioralReport = calculateBehavioralTotemResult(totemAnswers, enneagramType, {
      dominantElement,
      lifePathNumber: actualLifePath,
      sunSign
    });

    return {
      primaryTotem: behavioralReport.primaryTotem,
      shadowTotem: behavioralReport.shadowTotem,
      allyTotem: behavioralReport.secondaryTotem,
      isBehavioralTestBased: true,
      behavioralReport,
      calculationBreakdown: {
        birthDateSignature: dateSignature,
        timeQuadrantSignature: timeSignature,
        placeSignature,
        nameMatrixSignature: nameSignature + motherSignature,
        totalDeterministicHash,
        circadianQuadrant,
        planetaryDayRuler,
        elementalDominance: behavioralReport.primaryTotem.element,
        rationale: `15 Soruluk Davranışsal Totem Testi sonuçlarına dayanmaktadır (Eşleşme Gücü: %${behavioralReport.confidenceScore}).`
      }
    };
  }

  // Kayıtlı totem kimlikleri geçmiş sonuç referansıdır; yeni hesaplamayı override edemez.
  // Böylece önceki danışanın totemi yeni danışana sızmaz.
  
  // 3. Test henüz tamamlanmamışsa: Doğum, İsim, Element ve Yaşam Yolu matrisinden deterministik seçim
  // 52 hayvan kataloğundan dengeli dağılım
  const primaryIndex = totalDeterministicHash % totalCatalogSize;
  const primaryTotem = TOTEM_ANIMALS_52[primaryIndex] || TOTEM_ANIMALS_52[0];

  // Gölge Totemi: Zıt kutup veya gece/gündüz döngüsü modülasyonu
  let shadowIndex = (Math.abs((totalDeterministicHash * 13) + (day * 17) + (hour * 7) + 23)) % totalCatalogSize;
  if (shadowIndex === primaryIndex) {
    shadowIndex = (shadowIndex + 13) % totalCatalogSize;
  }
  const shadowTotem = TOTEM_ANIMALS_52[shadowIndex] || TOTEM_ANIMALS_52[1];

  // Yükseliş Müttefiki: Göksel/ruhsal tamamlama
  let allyIndex = (Math.abs((totalDeterministicHash * 29) + (month * 23) + (minute * 11) + 41)) % totalCatalogSize;
  if (allyIndex === primaryIndex || allyIndex === shadowIndex) {
    allyIndex = (allyIndex + 7) % totalCatalogSize;
    if (allyIndex === primaryIndex || allyIndex === shadowIndex) {
      allyIndex = (allyIndex + 11) % totalCatalogSize;
    }
  }
  const allyTotem = TOTEM_ANIMALS_52[allyIndex] || TOTEM_ANIMALS_52[2];

  return {
    primaryTotem,
    shadowTotem,
    allyTotem,
    isBehavioralTestBased: false,
    calculationBreakdown: {
      birthDateSignature: dateSignature,
      timeQuadrantSignature: timeSignature,
      placeSignature,
      nameMatrixSignature: nameSignature + motherSignature,
      totalDeterministicHash,
      circadianQuadrant,
      planetaryDayRuler,
      elementalDominance: primaryTotem.element,
      rationale: `Doğum Tarihi (${year}-${month}-${day}), Doğum Saati (${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} • ${circadianQuadrant}), Doğum Yeri (${placeClean}), Yaşam Yolu ${actualLifePath} ve İsim Frekansının bileşik rezonansından hesaplanmıştır.`
    }
  };
}
