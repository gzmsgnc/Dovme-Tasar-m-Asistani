import { 
  BehavioralDimensionKey, 
  BehavioralVector, 
  TotemAnimalProfile, 
  TOTEM_ANIMALS_52,
  BEHAVIORAL_DIMENSION_LABELS
} from './totemCatalogData';
import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult,
  TotemTestCalculationResult,
  TotemMatchScore
} from './behavioralTotemEngine';

export { 
  TOTEM_ANIMALS_52, 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  BEHAVIORAL_DIMENSION_LABELS,
  calculateBehavioralTotemResult 
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
    elementalDominance: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
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
 *    -> Doğrudan 20 boyutlu davranışsal vektör ve 52 hayvan uyumu üzerinden hesaplar!
 * 2. Eğer henüz test yanıtı yoksa:
 *    -> Doğum tarihi, saati, yeri ve isim frekansından 52 hayvanlık zengin havuz üzerinden deterministik hesaplar.
 */
export function calculateTotemAnimal(personalData: PersonalTotemInput): TotemCalculationResult {
  const { name, birthDate, birthTime, birthPlace, motherName, totemAnswers, enneagramType } = personalData;

  // 1. Doğum Tarihi Vektörü
  let year = 1990;
  let month = 1;
  let day = 1;

  if (birthDate && birthDate.includes('-')) {
    const parts = birthDate.split('-');
    year = parseInt(parts[0], 10) || 1990;
    month = parseInt(parts[1], 10) || 1;
    day = parseInt(parts[2], 10) || 1;
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

  const placeClean = (birthPlace || 'Anadolu').trim();
  const placeSignature = hashString(placeClean);

  const nameClean = (name || 'Yolcu').trim();
  const nameSignature = hashString(nameClean);
  const motherSignature = motherName && motherName.trim() ? hashString(motherName.trim()) * 13 : 0;

  const totalDeterministicHash = Math.abs(
    ((dateSignature * 31) ^ (timeSignature * 127) ^ (placeSignature * 59) ^ ((nameSignature + motherSignature) * 97))
  );

  const totalCatalogSize = TOTEM_ANIMALS_52.length; // 52

  // Eğer davranışsal test yanıtları mevcutsa (en az 3 soru cevaplanmışsa):
  if (totemAnswers && Object.keys(totemAnswers).length >= 3) {
    const behavioralReport = calculateBehavioralTotemResult(totemAnswers, enneagramType || 4);

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
        rationale: `15 Soruluk Davranışsal Totem Testi sonuçlarına dayanmaktadır (Benzerlik: %${behavioralReport.confidenceScore}).`
      }
    };
  }

  // Fallback: Deterministik matris (Test henüz tamamlanmamışsa)
  const primaryIndex = totalDeterministicHash % totalCatalogSize;
  const primaryTotem = TOTEM_ANIMALS_52[primaryIndex] || TOTEM_ANIMALS_52[0];

  let shadowIndex = (Math.abs(totalDeterministicHash * 7 + 13 + (day * 3))) % totalCatalogSize;
  if (shadowIndex === primaryIndex) {
    shadowIndex = (shadowIndex + 1) % totalCatalogSize;
  }
  const shadowTotem = TOTEM_ANIMALS_52[shadowIndex] || TOTEM_ANIMALS_52[1];

  let allyIndex = (Math.abs(totalDeterministicHash * 19 + 29 + (month * 11))) % totalCatalogSize;
  if (allyIndex === primaryIndex || allyIndex === shadowIndex) {
    allyIndex = (allyIndex + 2) % totalCatalogSize;
    if (allyIndex === primaryIndex || allyIndex === shadowIndex) {
      allyIndex = (allyIndex + 1) % totalCatalogSize;
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
      rationale: `Doğum Tarihi (${year}-${month}-${day}), Doğum Saati (${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}), Doğum Yeri (${placeClean}) ve İsim Matrisinin birleşik frekansından hesaplanmıştır. (Davranışsal Test henüz yapılmadı).`
    }
  };
}
