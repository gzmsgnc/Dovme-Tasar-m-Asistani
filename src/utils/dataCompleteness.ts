/**
 * DÖVME TASARIM ASİSTANI V2 — MERKEZİ VERİ TAMAMLIĞI VE EKSİK CEVAP ENGELİ MOTORU
 * (CENTRAL DATA COMPLETENESS & MANDATORY VALIDATION ENGINE)
 *
 * KESİN KURAL: Bir işlem için gerekli olan tek bir zorunlu bilgi veya test cevabı bile
 * eksikse o işlem başlatılamaz ve tamamlanmış sonuç üretemez.
 * Hem UI hem de hesaplama ve dışa aktarma fonksiyonlarının çekirdeğinde denetlenir.
 */

import { 
  PersonData, 
  NumerologyProfile, 
  AstrologyProfile, 
  EnneagramProfile, 
  SymbolismProfile, 
  TattooDesignParameters, 
  TattooRecipe 
} from '../types';
import { validateCalendarDate, resolveCityLocation } from './astrology';
import { normalizePhoneNumber, isValidEmail } from './clientValidation';
import { ENNEAGRAM_MINI_TEST_QUESTIONS } from './enneagram';
import { TOTEM_BEHAVIORAL_QUESTIONS } from './behavioralTotemEngine';

// ============================================================================
// 1. ÖZEL HATA SINIFLARI (CUSTOM DOMAIN COMPLETENESS ERRORS)
// ============================================================================

export class DataCompletenessError extends Error {
  code: string;
  missingFields: string[];
  details?: Record<string, any>;

  constructor(
    message: string, 
    missingFields: string[] = [], 
    code = 'DATA_COMPLETENESS_ERROR', 
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'DataCompletenessError';
    this.code = code;
    this.missingFields = missingFields;
    this.details = details;
    Object.setPrototypeOf(this, DataCompletenessError.prototype);
  }
}

export class IncompleteTestError extends DataCompletenessError {
  testType: 'enneagram' | 'totem';
  totalRequired: number;
  answeredCount: number;
  missingQuestionIds: number[];

  constructor(
    testType: 'enneagram' | 'totem',
    totalRequired: number,
    answeredCount: number,
    missingQuestionIds: number[]
  ) {
    const testName = testType === 'enneagram' ? 'Enneagram Kişilik Testi' : 'Davranışsal Totem Testi';
    const message = `${testName} tamamlanmadan sonuç hesaplanamaz. Toplam ${totalRequired} sorudan ${answeredCount} tanesi yanıtlanmış; ${missingQuestionIds.length} soru eksiktir (Eksik sorular: ${missingQuestionIds.join(', ')}).`;
    super(message, missingQuestionIds.map(id => `Soru ${id}`), `INCOMPLETE_${testType.toUpperCase()}_TEST`, {
      testType,
      totalRequired,
      answeredCount,
      missingQuestionIds
    });
    this.name = 'IncompleteTestError';
    this.testType = testType;
    this.totalRequired = totalRequired;
    this.answeredCount = answeredCount;
    this.missingQuestionIds = missingQuestionIds;
    Object.setPrototypeOf(this, IncompleteTestError.prototype);
  }
}

export class IncompleteRecipeError extends DataCompletenessError {
  constructor(message: string, missingFields: string[]) {
    super(message, missingFields, 'INCOMPLETE_RECIPE_ERROR');
    this.name = 'IncompleteRecipeError';
    Object.setPrototypeOf(this, IncompleteRecipeError.prototype);
  }
}

export class IncompleteExportError extends DataCompletenessError {
  constructor(message: string, missingFields: string[]) {
    super(message, missingFields, 'INCOMPLETE_EXPORT_ERROR');
    this.name = 'IncompleteExportError';
    Object.setPrototypeOf(this, IncompleteExportError.prototype);
  }
}

export class ModulePrerequisiteError extends DataCompletenessError {
  moduleName: string;
  constructor(moduleName: string, message: string, missingFields: string[]) {
    super(message, missingFields, `PREREQUISITE_FAILED_${moduleName.toUpperCase()}`);
    this.name = 'ModulePrerequisiteError';
    this.moduleName = moduleName;
    Object.setPrototypeOf(this, ModulePrerequisiteError.prototype);
  }
}

// ============================================================================
// 2. TİPLER VE DOĞRULAMA ÇIKTILARI (VALIDATION INTERFACES)
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  errors: Record<string, string>;
  warnings: string[];
  summaryMessage: string;
}

export interface TestCompletionResult {
  isComplete: boolean;
  testName: 'Enneagram' | 'Totem';
  totalQuestions: number;
  answeredQuestions: number;
  missingQuestionIds: number[];
  errorMessage?: string;
}

// ============================================================================
// 3. DANIŞAN ZORUNLU KİMLİK BİLGİLERİ DENETİMİ
// ============================================================================

/**
 * Danışan kimlik bilgilerindeki zorunlu alanları doğrular:
 * - Ad Soyad: En az 2 karakter, salt boşluk veya 'Misafir' olamaz.
 * - Doğum Tarihi: Geçerli YYYY-MM-DD takvim tarihi (artık yıl ve ay/gün sınırları).
 * - Doğum Yeri: Boş olamaz, geçerli ve veritabanında çözülebilir şehir/konum olmalıdır.
 * - İsteğe bağlı alanlar (telefon, e-posta): Girilmişse geçerli formatta olmalıdır.
 */
export function validateClientMandatoryFields(
  person?: Partial<PersonData> | null,
  options: { requireBirthPlace?: boolean } = { requireBirthPlace: true }
): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (!person) {
    return {
      isValid: false,
      missingFields: ['Danışan Bilgileri'],
      errors: { general: 'Danışan veri nesnesi bulunamadı.' },
      warnings: [],
      summaryMessage: 'Danışan veri nesnesi bulunamadı.'
    };
  }

  // 1. İsim Kontrolü
  const cleanName = (person.name || '').trim();
  if (!cleanName || cleanName.length < 2) {
    missingFields.push('Ad Soyad');
    errors.name = 'Danışan adı ve soyadı zorunludur (en az 2 karakter olmalıdır).';
  } else if (cleanName.toLowerCase() === 'misafir' || cleanName.toLowerCase() === 'guest') {
    missingFields.push('Gerçek Ad Soyad');
    errors.name = 'Varsayılan veya geçici isim ("Misafir") kullanılamaz; danışanın gerçek adı girilmelidir.';
  }

  // 2. Doğum Tarihi Kontrolü
  if (!person.birthDate || !person.birthDate.trim()) {
    missingFields.push('Doğum Tarihi');
    errors.birthDate = 'Doğum tarihi zorunludur.';
  } else {
    try {
      validateCalendarDate(person.birthDate);
    } catch (err) {
      missingFields.push('Geçerli Doğum Tarihi');
      errors.birthDate = err instanceof Error ? err.message : 'Doğum tarihi takvim açısından geçersizdir.';
    }
  }

  // 3. Doğum Yeri Kontrolü (İstanbul fallback'i KESİNLİKLE kabul edilmez)
  if (options.requireBirthPlace) {
    if (!person.birthPlace || !person.birthPlace.trim()) {
      missingFields.push('Doğum Yeri');
      errors.birthPlace = 'Doğum yeri zorunludur. Doğum haritası ve efemeris için geçerli bir şehir girilmelidir.';
    } else {
      try {
        if (typeof person.birthLatitude !== 'number' || typeof person.birthLongitude !== 'number') {
          resolveCityLocation(person.birthPlace);
        }
      } catch (err) {
        missingFields.push('Tanınan Doğum Yeri');
        errors.birthPlace = err instanceof Error ? err.message : 'Doğum yeri konum kütüphanesinde tanınamadı.';
      }
    }
  } else if (person.birthPlace && person.birthPlace.trim()) {
    try {
      if (typeof person.birthLatitude !== 'number' || typeof person.birthLongitude !== 'number') {
        resolveCityLocation(person.birthPlace);
      }
    } catch {
      // Bilgilendirme uyarısı
      warnings.push('Doğum yeri konumu kütüphanede tam eşleşmedi.');
    }
  }

  // 4. İsteğe Bağlı: Telefon Kontrolü (Girilmişse doğrula)
  if (person.phone && person.phone.trim()) {
    const phoneRes = normalizePhoneNumber(person.phone);
    if (!phoneRes.valid) {
      errors.phone = phoneRes.error || 'Telefon numarası formatı geçersizdir.';
    }
  }

  // 5. İsteğe Bağlı: E-posta Kontrolü (Girilmişse doğrula)
  if (person.email && person.email.trim()) {
    if (!isValidEmail(person.email)) {
      errors.email = 'E-posta adresi formatı geçersizdir.';
    }
  }

  // 6. Bilgilendirme Uyarıları (Hata değil, rehberlik)
  if (!person.birthTime || !person.birthTime.trim()) {
    warnings.push('Doğum saati belirtilmedi; Yükselen burç 12:00 öğle referansıyla tahmini hesaplanacaktır.');
  }
  if (!person.motherName || !person.motherName.trim()) {
    warnings.push('Anne adı girilmedi; Ebced ve Yıldızname hesabı için anne adı gereklidir.');
  }

  const isValid = missingFields.length === 0 && Object.keys(errors).length === 0;
  const summaryMessage = isValid
    ? 'Tüm danışan zorunlu kimlik bilgileri eksiksiz ve geçerlidir.'
    : `Zorunlu danışan bilgileri eksik veya geçersiz: ${missingFields.join(', ')}.`;

  return {
    isValid,
    missingFields,
    errors,
    warnings,
    summaryMessage
  };
}

// ============================================================================
// 4. TESTLERİN TAMLIĞI DENETİMİ (ENNEAGRAM & TOTEM 15/15)
// ============================================================================

/**
 * 15 Soruluk Enneagram Testinin eksiksiz yanıtlandığını doğrular.
 */
export function validateEnneagramAnswers(answers?: Record<number, number> | null): TestCompletionResult {
  const totalQuestions = ENNEAGRAM_MINI_TEST_QUESTIONS.length; // 15
  const missingQuestionIds: number[] = [];
  let answeredCount = 0;

  for (const q of ENNEAGRAM_MINI_TEST_QUESTIONS) {
    const val = answers ? answers[q.id] : undefined;
    if (typeof val === 'number' && Number.isInteger(val) && val >= 1 && val <= 9) {
      answeredCount++;
    } else {
      missingQuestionIds.push(q.id);
    }
  }

  const isComplete = missingQuestionIds.length === 0 && answeredCount === totalQuestions;
  const errorMessage = isComplete
    ? undefined
    : `Enneagram testinde ${missingQuestionIds.length} soru eksiktir (${answeredCount}/${totalQuestions}). Eksik sorular: ${missingQuestionIds.join(', ')}.`;

  return {
    isComplete,
    testName: 'Enneagram',
    totalQuestions,
    answeredQuestions: answeredCount,
    missingQuestionIds,
    errorMessage
  };
}

/**
 * 15 Soruluk Davranışsal Totem Testinin eksiksiz yanıtlandığını doğrular.
 */
export function validateTotemAnswers(answers?: Record<number, string> | null): TestCompletionResult {
  const totalQuestions = TOTEM_BEHAVIORAL_QUESTIONS.length; // 15
  const missingQuestionIds: number[] = [];
  let answeredCount = 0;

  for (const q of TOTEM_BEHAVIORAL_QUESTIONS) {
    const val = answers ? answers[q.id] : undefined;
    const isValidOption = typeof val === 'string' && q.options.some(opt => opt.id === val);
    if (isValidOption) {
      answeredCount++;
    } else {
      missingQuestionIds.push(q.id);
    }
  }

  const isComplete = missingQuestionIds.length === 0 && answeredCount === totalQuestions;
  const errorMessage = isComplete
    ? undefined
    : `Davranışsal Totem Testinde ${missingQuestionIds.length} soru eksiktir (${answeredCount}/${totalQuestions}). Eksik sorular: ${missingQuestionIds.join(', ')}.`;

  return {
    isComplete,
    testName: 'Totem',
    totalQuestions,
    answeredQuestions: answeredCount,
    missingQuestionIds,
    errorMessage
  };
}

// ============================================================================
// 4.1. HESAPLAMA MOTORLARI ÖN ŞART DENETİMLERİ (ENGINE PREREQUISITES)
// ============================================================================

export function validateNumerologyPrerequisites(name?: string, birthDate?: string): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!name || !name.trim()) {
    missingFields.push('Danışan Adı');
    errors.name = 'Numeroloji Pisagor analizi için danışan adı zorunludur.';
  }
  if (!birthDate || !birthDate.trim()) {
    missingFields.push('Doğum Tarihi');
    errors.birthDate = 'Numeroloji analizi için doğum tarihi zorunludur.';
  } else {
    try {
      validateCalendarDate(birthDate);
    } catch (err) {
      missingFields.push('Geçerli Doğum Tarihi');
      errors.birthDate = err instanceof Error ? err.message : 'Geçersiz doğum tarihi.';
    }
  }

  const isValid = missingFields.length === 0;
  return {
    isValid,
    missingFields,
    errors,
    warnings: [],
    summaryMessage: isValid ? 'Numeroloji analizi için tüm girdiler tamdır.' : `Numeroloji girdileri eksik: ${missingFields.join(', ')}.`
  };
}

export function validateAstrologyPrerequisites(birthDate?: string, birthPlace?: string | any): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!birthDate || !birthDate.trim()) {
    missingFields.push('Doğum Tarihi');
    errors.birthDate = 'Astroloji efemeris hesabı için doğum tarihi zorunludur.';
  } else {
    try {
      validateCalendarDate(birthDate);
    } catch (err) {
      missingFields.push('Geçerli Doğum Tarihi');
      errors.birthDate = err instanceof Error ? err.message : 'Geçersiz doğum tarihi.';
    }
  }

  if (!birthPlace || (typeof birthPlace === 'string' && !birthPlace.trim())) {
    missingFields.push('Doğum Yeri');
    errors.birthPlace = 'Astroloji hesabı için doğum yeri zorunludur.';
  }

  const isValid = missingFields.length === 0;
  return {
    isValid,
    missingFields,
    errors,
    warnings: [],
    summaryMessage: isValid ? 'Astroloji analizi için tüm girdiler tamdır.' : `Astroloji girdileri eksik: ${missingFields.join(', ')}.`
  };
}

export function validateEbcedPrerequisites(personName?: string, motherName?: string): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!personName || !personName.trim()) {
    missingFields.push('Danışan Adı');
    errors.personName = 'Ebced hesabı için danışan adı zorunludur.';
  }
  if (!motherName || !motherName.trim()) {
    missingFields.push('Anne Adı');
    errors.motherName = 'Ebced ve Yıldızname hesabı için anne adı zorunludur.';
  }

  const isValid = missingFields.length === 0;
  return {
    isValid,
    missingFields,
    errors,
    warnings: [],
    summaryMessage: isValid ? 'Ebced ve Yıldızname için tüm girdiler tamdır.' : `Ebced ve Yıldızname girdileri eksik: ${missingFields.join(', ')}.`
  };
}

export function validateChakraPrerequisites(
  numerology?: NumerologyProfile | null, 
  astrology?: AstrologyProfile | null
): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!numerology || typeof numerology.lifePathNumber !== 'number') {
    missingFields.push('Numeroloji Profili');
    errors.numerology = 'Çakra profili için numeroloji analizi zorunludur.';
  }
  if (!astrology || !astrology.sunSign) {
    missingFields.push('Astroloji Profili');
    errors.astrology = 'Çakra profili için astroloji analizi zorunludur.';
  }

  const isValid = missingFields.length === 0;
  return {
    isValid,
    missingFields,
    errors,
    warnings: [],
    summaryMessage: isValid ? 'Çakra analizi için tüm ön şartlar tamdır.' : `Çakra analizi ön şartları eksik: ${missingFields.join(', ')}.`
  };
}

// ============================================================================
// 5. REÇETE ÜRETİMİ ÖN ŞARTLARI DENETİMİ (RECIPE PREREQUISITES)
// ============================================================================

/**
 * Dövme tasarım reçetesi (TattooRecipe) üretilmeden önce tüm bileşenlerin tam olduğunu doğrular:
 * - Danışan zorunlu alanları (ad, doğum tarihi)
 * - Numeroloji profili
 * - Astroloji profili
 * - Enneagram profili (15/15 soru veya doğrulanmış tip)
 * - Sembolizm & Totem profili (15/15 Davranışsal Totem testi)
 * - Dövme parametreleri (seçili stiller, kompozisyon, yerleşim, ana sembol)
 */
export function validateRecipePrerequisites(
  person: PersonData | null | undefined,
  numerology: NumerologyProfile | null | undefined,
  astrology: AstrologyProfile | null | undefined,
  enneagram: EnneagramProfile | null | undefined,
  symbolism: SymbolismProfile | null | undefined,
  parameters: TattooDesignParameters | null | undefined,
  options: { requireBirthPlace?: boolean } = { requireBirthPlace: false }
): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // 1. Danışan kimlik denetimi
  const clientValidation = validateClientMandatoryFields(person, options);
  if (!clientValidation.isValid) {
    missingFields.push(...clientValidation.missingFields);
    Object.assign(errors, clientValidation.errors);
  }

  // 2. Numeroloji profil denetimi
  if (!numerology || typeof numerology.lifePathNumber !== 'number') {
    missingFields.push('Numeroloji Profili');
    errors.numerology = 'Numeroloji profili hesaplanmamış veya eksik.';
  }

  // 3. Astroloji profil denetimi
  if (!astrology || !astrology.sunSign || !astrology.moonSign) {
    missingFields.push('Astroloji Profili');
    errors.astrology = 'Astroloji efemeris profili hesaplanmamış veya eksik.';
  }

  // 4. Enneagram profil denetimi
  if (!enneagram || typeof enneagram.type !== 'number' || !enneagram.wing) {
    missingFields.push('Enneagram Profili');
    errors.enneagram = 'Enneagram kişilik profili belirlenmemiş.';
  }

  // 5. Sembolizm & Totem denetimi
  if (!symbolism || !symbolism.totemAnimal || !symbolism.totemAnimal.trim()) {
    missingFields.push('Totem Sembolizm Profili');
    errors.symbolism = 'Totem hayvanı ve sembolizm profili hesaplanmamış.';
  }

  // 6. Totem Testi tamlığı denetimi
  if (person?.totemAnswers) {
    const totemCheck = validateTotemAnswers(person.totemAnswers);
    if (!totemCheck.isComplete) {
      missingFields.push(`Davranışsal Totem Testi (${totemCheck.answeredQuestions}/15)`);
      errors.totemTest = totemCheck.errorMessage || 'Totem testi 15 sorudan eksik.';
    }
  }

  // 7. Tasarım parametreleri denetimi
  if (!parameters) {
    missingFields.push('Tasarım Parametreleri');
    errors.parameters = 'Tasarım parametreleri tanımlanmamış.';
  } else {
    if (!parameters.selectedStyles || parameters.selectedStyles.length === 0) {
      missingFields.push('En Az Bir Dövme Stili');
      errors.styles = 'Lütfen en az bir dövme stili seçiniz (Örn: Fine Line, Geometric).';
    }
    if (!parameters.bodyPlacement || !parameters.bodyPlacement.trim()) {
      missingFields.push('Vücut Yerleşim Bölgesi');
      errors.bodyPlacement = 'Vücut yerleşim bölgesi seçilmelidir.';
    }
    if (!parameters.composition || !parameters.composition.trim()) {
      missingFields.push('Kompozisyon Akışı');
      errors.composition = 'Kompozisyon yönelimi ve akışı seçilmelidir.';
    }
  }

  const isValid = missingFields.length === 0 && Object.keys(errors).length === 0;
  const summaryMessage = isValid
    ? 'Reçete oluşturmak için gereken tüm hesaplamalar ve girdiler eksiksizdir.'
    : `Dövme reçetesi oluşturulamadı. Eksik veya geçersiz bileşenler: ${missingFields.join(', ')}.`;

  return {
    isValid,
    missingFields,
    errors,
    warnings,
    summaryMessage
  };
}

// ============================================================================
// 6. DIŞA AKTARMA ÖN ŞARTLARI DENETİMİ (EXPORT PREREQUISITES)
// ============================================================================

/**
 * PDF veya JSON Konsültasyon Dosyası dışa aktarılmadan önce reçetenin
 * tam ve bütünsel olduğunu doğrular. Eksik reçeteyle dosya oluşturulamaz.
 */
export function validateExportPrerequisites(recipe: TattooRecipe | null | undefined): ValidationResult {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!recipe) {
    return {
      isValid: false,
      missingFields: ['Reçete Nesnesi'],
      errors: { recipe: 'Dışa aktarılacak dövme reçetesi bulunamadı.' },
      warnings: [],
      summaryMessage: 'Reçete nesnesi boş olduğundan dışa aktarma işlemi başlatılamaz.'
    };
  }

  if (!recipe.id || !recipe.id.trim()) {
    missingFields.push('Reçete Kimliği (ID)');
    errors.id = 'Reçete benzersiz kimliği eksik.';
  }

  const clientCheck = validateClientMandatoryFields(recipe.personData);
  if (!clientCheck.isValid) {
    missingFields.push(...clientCheck.missingFields);
    Object.assign(errors, clientCheck.errors);
  }

  if (!recipe.numerology || typeof recipe.numerology.lifePathNumber !== 'number') {
    missingFields.push('Numeroloji Verisi');
    errors.numerology = 'Reçetede numeroloji analizi eksik.';
  }

  if (!recipe.astrology || !recipe.astrology.sunSign) {
    missingFields.push('Astroloji Verisi');
    errors.astrology = 'Reçetede astroloji analizi eksik.';
  }

  if (!recipe.enneagram || typeof recipe.enneagram.type !== 'number') {
    missingFields.push('Enneagram Verisi');
    errors.enneagram = 'Reçetede Enneagram analizi eksik.';
  }

  if (!recipe.symbolism || !recipe.symbolism.totemAnimal) {
    missingFields.push('Totem & Sembolizm Verisi');
    errors.symbolism = 'Reçetede totem hayvanı ve sembolizm verisi eksik.';
  }

  if (!recipe.symbolRationales || recipe.symbolRationales.length === 0) {
    missingFields.push('Sembol Mantıkları (Rationales)');
    errors.symbolRationales = 'Reçetede sembol gerekçeleri bulunamadı.';
  }

  const isValid = missingFields.length === 0 && Object.keys(errors).length === 0;
  const summaryMessage = isValid
    ? 'Dışa aktarma için tüm reçete ve analiz verileri eksiksizdir.'
    : `Dışa aktarma başarısız. Reçetede eksik alanlar: ${missingFields.join(', ')}.`;

  return {
    isValid,
    missingFields,
    errors,
    warnings: [],
    summaryMessage
  };
}

// ============================================================================
// 7. KESİN ENGELLEME YARDIMCISI (ASSERT DATA COMPLETE)
// ============================================================================

/**
 * Doğrulama sonucunu değerlendirir; eğer geçerli değilse anında DataCompletenessError fırlatır.
 * Bu sayede fonksiyonların gövdesinde eksik veriyle çalışma ihtimali kesin olarak ortadan kalkar.
 */
export function assertDataComplete(validationResult: ValidationResult, contextDescription = 'İşlem'): void {
  if (!validationResult.isValid) {
    throw new DataCompletenessError(
      `${contextDescription} başlatılamadı: ${validationResult.summaryMessage}`,
      validationResult.missingFields,
      'DATA_COMPLETENESS_ASSERTION_FAILED',
      { errors: validationResult.errors }
    );
  }
}
