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

  if (!birthPlace || !birthPlace.trim()) {
    throw new Error('Totem hayvanı hesaplaması için doğum yeri zorunludur. Eksik konumla varsayımsal şehir veya bölge kullanılamaz.');
  }
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
  // Not: primaryTotemId/secondaryTotemId/shadowTotemId bilinçli olarak hesaplama girdisi değildir.
  // Davranışsal totem artık doğum/isim/hash fallback'iyle üretilemez: test tamamlanmadan
  // kişiye bir hayvan atamak, sonucu cevaplardan koparır ve müşteri kabulünde yanlış pozitif üretir.
  const answeredQuestionIds = new Set(Object.keys(totemAnswers ?? {}).map(Number));
  const requiredQuestionIds = new Set(TOTEM_BEHAVIORAL_QUESTIONS.map(q => q.id));
  const hasCompleteBehavioralTest = answeredQuestionIds.size === requiredQuestionIds.size &&
    TOTEM_BEHAVIORAL_QUESTIONS.every(question => {
      const answer = totemAnswers?.[question.id];
      return typeof answer === 'string' && question.options.some(option => option.id === answer);
    });
  if (!hasCompleteBehavioralTest) {
    throw new Error(`Davranışsal Totem Testi tamamlanmadan totem hesaplanamaz. ${requiredQuestionIds.size} sorunun tamamı yanıtlanmalıdır.`);
  }

  // Bu noktaya yalnızca tamamlanmış davranışsal test ile gelinir.
  // Legacy doğum/isim/hash fallback'i bilinçli olarak devre dışıdır.
  return (() => { throw new Error('Beklenmeyen totem hesaplama durumu.'); })();

}
