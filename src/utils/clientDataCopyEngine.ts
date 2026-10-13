/**
 * DÖVME TASARIM ASİSTANI V2 — DANIŞAN VERİLERİ KOPYALAMA MOTORU
 * (COMPREHENSIVE CLIENT DATA CLIPBOARD & EXPORT ENGINE)
 *
 * Danışana ait tüm bilgilerin, test cevaplarının, hesaplama sonuçlarının,
 * sembol reçetesinin ve istemlerin hem tek seferde eksiksiz hem de bölüm bazında
 * ayrı ayrı kopyalanmasını sağlar.
 */

import { 
  PersonData, 
  NumerologyProfile, 
  AstrologyProfile, 
  EnneagramProfile, 
  SymbolismProfile, 
  TattooDesignParameters, 
  TattooRecipe,
  ChakraProfile,
  PersonalSymbolPrescription
} from '../types';
import { ENNEAGRAM_MINI_TEST_QUESTIONS, getEnneagramProfile, calculateEnneagramFromAnswers } from './enneagram';
import { TOTEM_BEHAVIORAL_QUESTIONS } from './behavioralTotemEngine';
import { calculateEbcedAndYildizname, calculateSingleEbced } from './ebced';
import { validateClientMandatoryFields, validateEnneagramAnswers, validateTotemAnswers } from './dataCompleteness';
import { calculateNumerology } from './numerology';
import { calculateAstrology } from './astrology';
import { calculateTotemAnimal } from './totemCalculator';
import { calculateChakraProfile } from './chakra';
import { deriveSymbolismProfile } from './symbolism';

// ============================================================================
// 1. ASENKRON PANO İŞLEMLERİ (ROBUST CLIPBOARD API & FALLBACK)
// ============================================================================

/**
 * Metni işletim sistemi panosuna güvenle kopyalar.
 * Web Clipboard API mevcut değilse textarea fallback'i kullanır.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text || typeof text !== 'string') return false;

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Navigator clipboard API failed, attempting fallback textarea copy:', err);
  }

  // Fallback DOM copy
  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (fallbackErr) {
    console.error('Fallback execCommand copy failed:', fallbackErr);
  }

  return false;
}

// ============================================================================
// 2. VERİ GİRDİSİ VE BİLEŞEN TİPLERİ
// ============================================================================

export interface FullClientDataCopyInput {
  client: Partial<PersonData>;
  numerology?: NumerologyProfile | null;
  astrology?: AstrologyProfile | null;
  enneagram?: EnneagramProfile | null;
  symbolism?: SymbolismProfile | null;
  chakra?: ChakraProfile | null;
  parameters?: TattooDesignParameters | null;
  recipe?: TattooRecipe | null;
  prescription?: PersonalSymbolPrescription | null;
  notes?: string;
}

// ============================================================================
// 3. BÖLÜM BAZLI METİN ÜRETİCİLERİ (SECTION TEXT FORMATTERS)
// ============================================================================

/**
 * 1. Danışan Kimlik ve İletişim Bilgileri
 */
export function buildClientGeneralInfoText(client: Partial<PersonData>): string {
  const lines: string[] = [
    '=====================================================',
    'DÖVME TASARIM ASİSTANI — DANIŞAN KİMLİK VE İLETİŞİM BİLGİLERİ',
    '====================================================='
  ];

  lines.push(`Ad & Soyad       : ${client.name?.trim() || '[Belirtilmedi]'}`);
  lines.push(`Doğum Tarihi     : ${client.birthDate || '[Belirtilmedi]'}`);
  lines.push(`Doğum Saati      : ${client.birthTime || '[Belirtilmedi / 12:00 Referansı]'}`);
  lines.push(`Doğum Yeri       : ${client.birthPlace || client.birthCity || '[Belirtilmedi]'}`);
  
  if (client.birthLatitude !== undefined && client.birthLongitude !== undefined) {
    lines.push(`Coğrafi Konum    : Enlem ${client.birthLatitude.toFixed(4)}, Boylam ${client.birthLongitude.toFixed(4)} (${client.birthTimezone || 'Yerel Saat'})`);
  }

  lines.push(`Anne Adı         : ${client.motherName || '[Belirtilmedi - Ebced hesabı için opsiyonel]'}`);
  lines.push(`Telefon Numarası : ${client.phone || '[Belirtilmedi]'}`);
  lines.push(`E-Posta Adresi   : ${client.email || '[Belirtilmedi]'}`);
  lines.push(`Zodyak Sistemi   : ${client.zodiacSystem === 'Sidereal' ? 'Sideral (Vedik / Hint)' : 'Tropikal (Batı)'}`);
  
  if (client.personalNumbers) lines.push(`Kişisel Sayılar  : ${client.personalNumbers}`);
  if (client.existingSymbols) lines.push(`Mevcut Semboller : ${client.existingSymbols}`);
  if (client.existingTotems)  lines.push(`Mevcut Totemler  : ${client.existingTotems}`);
  if (client.personalStory)    lines.push(`Kişisel Hikâye   : ${client.personalStory}`);
  if (client.notes)            lines.push(`Özel Notlar      : ${client.notes}`);
  if (client.createdAt)        lines.push(`Kayıt Tarihi     : ${new Date(client.createdAt).toLocaleString('tr-TR')}`);

  // Doğrulama Durumu
  const validation = validateClientMandatoryFields(client);
  lines.push('-----------------------------------------------------');
  lines.push(`Doğrulama Durumu : ${validation.isValid ? '✓ Zorunlu Bilgiler Eksiksiz' : '⚠️ Eksik Alanlar Var'}`);
  if (!validation.isValid) {
    lines.push(`Eksik Alanlar    : ${validation.missingFields.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * 2. Enneagram Test Cevapları ve Kişilik Analizi
 */
export function buildEnneagramAnalysisText(
  answers?: Record<number, number> | null, 
  ennea?: EnneagramProfile | null
): string {
  const lines: string[] = [
    '=====================================================',
    'ENNEAGRAM KİŞİLİK VE GÖLGE ARKETİP ANALİZİ',
    '====================================================='
  ];

  const totalQuestions = ENNEAGRAM_MINI_TEST_QUESTIONS.length;
  const answeredCount = answers ? Object.keys(answers).length : 0;
  lines.push(`Test Durumu      : ${answeredCount === totalQuestions ? '✓ 15/15 Soru Eksiksiz Tamamlandı' : `⚠️ ${answeredCount}/${totalQuestions} Soru Yanıtlandı (Tamamlanmadı)`}`);

  // Test Soruları ve Verilen Yanıtlar
  lines.push('\n--- 15 SORULUK ENNEAGRAM TESTİ SORU VE CEVAPLARI ---');
  ENNEAGRAM_MINI_TEST_QUESTIONS.forEach(q => {
    const selectedType = answers ? answers[q.id] : undefined;
    const selectedOption = q.options.find(opt => opt.type === selectedType);
    lines.push(`\n[Soru ${q.id}] ${q.question}`);
    if (selectedOption) {
      lines.push(`  ↳ Seçilen Yanıt: "${selectedOption.text}"`);
      lines.push(`  ↳ Tip Rezonansı: Tip ${selectedOption.type} (${selectedOption.description})`);
    } else {
      lines.push('  ↳ Seçilen Yanıt: [Henüz yanıtlanmadı]');
    }
  });

  // Hesaplanan Profil
  if (ennea) {
    lines.push('\n--- HESAPLANMIŞ ENNEAGRAM PROFİLİ ---');
    lines.push(`Baskın Tip       : Tip ${ennea.type} — ${ennea.typeName}`);
    lines.push(`Kanat (Wing)     : ${ennea.wing}`);
    lines.push(`Temel Motivasyon : ${ennea.coreMotivation}`);
    lines.push(`Temel Korku      : ${ennea.coreFear}`);
    lines.push(`Büyüme Hattı     : Tip ${ennea.growthPoint} (Gelişim ve Entegrasyon Yönü)`);
    lines.push(`Stres Hattı      : Tip ${ennea.stressPoint} (Baskı ve Çözülme Yönü)`);
    if (ennea.strengths && ennea.strengths.length > 0) {
      lines.push(`Güçlü Nitelikler : ${ennea.strengths.join(', ')}`);
    }
    if (ennea.shadowTraits && ennea.shadowTraits.length > 0) {
      lines.push(`Gölge Yönler     : ${ennea.shadowTraits.join(', ')}`);
    }
    if (ennea.symbolicMeaning) {
      lines.push(`Dövme Sembolizmi : ${ennea.symbolicMeaning}`);
    }
  } else {
    lines.push('\n[Hesaplanmış Enneagram profili bulunamadı]');
  }

  return lines.join('\n');
}

/**
 * 3. Davranışsal Hayvan Totemi Testi ve Hiyerarşisi
 */
export function buildTotemAnalysisText(
  answers?: Record<number, string> | null,
  totemResult?: any,
  symbolism?: SymbolismProfile | null
): string {
  const lines: string[] = [
    '=====================================================',
    'DAVRANIŞSAL TOTEM HAYVANI TESTİ VE HİYERARŞİ ANALİZİ',
    '====================================================='
  ];

  const totalQuestions = TOTEM_BEHAVIORAL_QUESTIONS.length;
  const answeredCount = answers ? Object.keys(answers).length : 0;
  lines.push(`Test Durumu      : ${answeredCount === totalQuestions ? '✓ 15/15 Davranışsal Senaryo Tamamlandı' : `⚠️ ${answeredCount}/${totalQuestions} Soru Yanıtlandı`}`);

  // Test Soruları ve Verilen Yanıtlar
  lines.push('\n--- 15 SORULUK DAVRANIŞSAL SENARYO TESTİ CEVAPLARI ---');
  TOTEM_BEHAVIORAL_QUESTIONS.forEach(q => {
    const selectedOptionId = answers ? answers[q.id] : undefined;
    const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
    lines.push(`\n[Soru ${q.id} - ${q.category}]`);
    lines.push(`  ${q.question}`);
    if (selectedOption) {
      lines.push(`  ↳ Seçilen Yanıt: "${selectedOption.text}"`);
    } else {
      lines.push('  ↳ Seçilen Yanıt: [Henüz yanıtlanmadı]');
    }
  });

  // Totem Hiyerarşisi
  const primary = totemResult?.primaryTotem || symbolism?.totemHierarchy?.[0];
  const shadow = totemResult?.shadowTotem || symbolism?.totemHierarchy?.[1];
  const ally = totemResult?.secondaryTotem || totemResult?.allyTotem || symbolism?.totemHierarchy?.[2];

  lines.push('\n--- 3\'LÜ RUHANİ TOTEM HAYVANI HİYERARŞİSİ ---');
  if (primary) {
    lines.push(`\n1. BİRİNCİL RUH TOTEMİ: ${primary.name || symbolism?.totemAnimal}`);
    lines.push(`   Element       : ${primary.element || 'Hava'}`);
    lines.push(`   Arketipsel Güç: ${primary.strongSide || primary.archetypalPower || 'Sezgisel bilgelik'}`);
    lines.push(`   Sembolik Anlam: ${primary.mainSymbolism || primary.meaning || symbolism?.totemAnimalMeaning || 'Rehber güç'}`);
    lines.push(`   Tasarım Rolü  : ${primary.compositionRole || primary.visualRoleInTattoo || 'Merkezi kompozisyon odağı'}`);
  } else {
    lines.push('1. Birincil Ruh Totemi: [Hesaplanmadı]');
  }

  if (shadow) {
    lines.push(`\n2. GÖLGE & MUHAFIZ TOTEMİ: ${shadow.name || symbolism?.shadowTotemName}`);
    lines.push(`   Gölge Şifası  : ${shadow.shadowTrait || symbolism?.shadowTotemMeaning || 'Bilinçdışı koruma'}`);
    lines.push(`   Koruyucu Güç  : ${shadow.protectivePower || symbolism?.shadowTotemPower || 'Sessiz kudret'}`);
  }

  if (ally) {
    lines.push(`\n3. YÜKSELİŞ & RUHSAL MÜTTEFİK: ${ally.name || symbolism?.secondaryAnimals?.[1] || 'Müttefik Totem'}`);
    lines.push(`   Müttefik Gücü : ${ally.strongSide || ally.meaning || 'Zarafet ve ilham'}`);
  }

  if (totemResult?.confidenceScore !== undefined) {
    lines.push(`\nEşleşme Güven Skoru: %${totemResult.confidenceScore}`);
  }

  return lines.join('\n');
}

/**
 * 4. Tüm Test Cevapları ve Test Sonuçları (Enneagram + Totem Birleşik)
 */
export function buildTestAnswersAndResultsText(
  client: Partial<PersonData>,
  totemResult?: any,
  ennea?: EnneagramProfile | null,
  symbolism?: SymbolismProfile | null
): string {
  return [
    buildEnneagramAnalysisText(client.enneagramAnswers, ennea),
    '\n\n' + buildTotemAnalysisText(client.totemAnswers, totemResult, symbolism)
  ].join('');
}

/**
 * 5. Numeroloji Pisagor Analizi
 */
export function buildNumerologyAnalysisText(num?: NumerologyProfile | null): string {
  const lines: string[] = [
    '=====================================================',
    'NUMEROLOJİ PİSAGOR MATRİSİ VE SAYISAL TİTREŞİMLER',
    '====================================================='
  ];

  if (!num) {
    lines.push('[Numeroloji profili henüz hesaplanmadı veya eksik]');
    return lines.join('\n');
  }

  lines.push(`Yaşam Yolu Sayısı (Life Path) : ${num.lifePathNumber} — ${num.lifePathTitle}`);
  if (num.calculationDetails?.lifePath?.formula) {
    lines.push(`  ↳ Hesaplama Zinciri         : ${num.calculationDetails.lifePath.formula}`);
  }

  lines.push(`Ana Kulvar / İfade (Destiny)  : ${num.destinyNumber} — ${num.destinyTitle}`);
  lines.push(`Yan Kulvar / Ruh Arzusu (Soul): ${num.soulUrgeNumber} — ${num.soulUrgeTitle}`);
  lines.push(`Dış İmaj / Kişilik (Person.)  : ${num.personalityNumber} — ${num.personalityTitle}`);
  lines.push(`Dünya Misyonu (DM Sayısı)     : ${num.dmNumber} — ${num.dmTitle}`);

  lines.push(`\nİlahi Yardım 19 Mührü        : ${num.divineHelp19?.has19 ? `VAR (${num.divineHelp19.level}) — ${num.divineHelp19.reason}` : 'Tespit Edilmedi (Haritada 19 rezonansı yok)'}`);

  // 1-9 Çakra Dağılımı
  if (num.chakraCounts) {
    lines.push('\n--- İSİM HARFLERİNİN 1-9 ÇAKRA DAĞILIMI ---');
    for (let c = 1; c <= 9; c++) {
      const count = num.chakraCounts[c] || 0;
      const status = count === 0 ? 'EKSİK (Karmik Borç)' : count === 1 ? 'Tekil' : `${count} Harf (Yoğun)`;
      lines.push(`  ${c}. Çakra: ${count} Harf [${status}]`);
    }
  }

  lines.push(`\nEksik Sayılar / Karmik Borçlar: ${num.missingNumbers?.length ? num.missingNumbers.join(', ') : 'Eksik Sayı Yok (Bütünsel Denge)'}`);
  lines.push(`Üstat Sayılar (Master Numbers): ${num.masterNumbers?.length ? num.masterNumbers.join(', ') : 'Yok'}`);
  lines.push(`Kişisel Yıl Döngüsü           : ${num.personalYear} (${num.personalYearTheme})`);

  if (num.coreKeywords && num.coreKeywords.length > 0) {
    lines.push(`Anahtar Kelimeler             : ${num.coreKeywords.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * 6. Astroloji Efemeris Analizi
 */
export function buildAstrologyAnalysisText(astro?: AstrologyProfile | null): string {
  const lines: string[] = [
    '=====================================================',
    'ASTROLOJİ GERÇEK EFEMERİS VE GÖKSEL KOORDİNATLAR',
    '====================================================='
  ];

  if (!astro) {
    lines.push('[Astroloji profili henüz hesaplanmadı veya eksik]');
    return lines.join('\n');
  }

  lines.push(`Zodyak Sistemi   : ${astro.zodiacSystem === 'Sidereal' ? 'Sideral / Vedik (Lahiri Ayanamsa)' : 'Tropikal / Batı (Ekinoks Esaslı)'}`);
  lines.push(`Güneş Burcu      : ${astro.sunSignSymbol || ''} ${astro.sunSign} (${astro.sunDegreeFormatted || ''})`);
  lines.push(`  ↳ Element / Mod: ${astro.sunSignElement} / ${astro.sunSignModality}`);
  lines.push(`  ↳ Yönetici     : ${astro.rulingPlanet}`);

  lines.push(`Ay Burcu         : ${astro.moonSignSymbol || ''} ${astro.moonSign} (${astro.moonDegreeFormatted || ''})`);
  if (astro.isMoonNearCusp && astro.moonCuspMessage) {
    lines.push(`  ↳ Cusp Durumu  : ${astro.moonCuspMessage}`);
  }

  lines.push(`Yükselen Burç    : ${astro.ascendantSignSymbol || ''} ${astro.ascendantSign} (${astro.ascendantDegreeFormatted || ''})`);
  if (astro.isAscendantEstimated) {
    lines.push('  ↳ Saat Durumu  : Doğum saati girilmediğinden 12:00 öğle saati referansıyla tahmini hesaplanmıştır.');
  }

  lines.push(`Hakim Element    : ${astro.dominantElement}`);
  lines.push(`Baskın Arketip   : ${astro.archetype}`);
  lines.push(`\nGenel Özet:\n${astro.summary}`);

  return lines.join('\n');
}

/**
 * 7. Ebced ve Mizan Analizi
 */
export function buildEbcedMizanAnalysisText(client: Partial<PersonData>): string {
  const lines: string[] = [
    '=====================================================',
    'KADİM EBCED VE YILDIZNAME MİZAN HESAPLAMALARI',
    '====================================================='
  ];

  const pName = (client.name || '').trim();
  const mName = (client.motherName || '').trim();

  if (!pName) {
    lines.push('[Danışan adı girilmediğinden Ebced hesaplanamadı]');
    return lines.join('\n');
  }

  const pEbced = calculateSingleEbced(pName);
  lines.push(`Danışan Adı          : ${pName} ➔ Ebced Değeri: ${pEbced}`);

  if (mName) {
    try {
      const ebcedResult = calculateEbcedAndYildizname(pName, mName);
      lines.push(`Anne Adı             : ${mName} ➔ Ebced Değeri: ${ebcedResult.motherEbced}`);
      lines.push(`Toplam Ebced         : ${ebcedResult.totalEbced} (Ad + Anne Adı)`);
      lines.push(`Yıldızname Mizan Burcu: ${ebcedResult.yildiznameBurcName} (No: ${ebcedResult.yildiznameBurcNumber})`);
      lines.push(`Mizan Elementi       : ${ebcedResult.yildiznameElement}`);
      lines.push(`Gezegen Rehberi      : ${ebcedResult.planetGuide}`);
      lines.push(`Tılsımi Sayı         : ${ebcedResult.talismanicNumber}`);
      lines.push(`Ezoterik Mahiyet     : ${ebcedResult.esotericQuality}`);
    } catch (err: unknown) {
      lines.push(`Ebced Hesabı Hatası  : ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    lines.push('Anne Adı             : [Girilmedi]');
    lines.push(`Salt İsim Ebcedi     : ${pEbced}`);
    lines.push('Not                  : Yıldızname burcu ve Mizan hesaplaması için anne adı gereklidir.');
  }

  return lines.join('\n');
}

/**
 * 8. Çakra Rezonans Analizi
 */
export function buildChakraAnalysisText(
  chakra?: ChakraProfile | null, 
  num?: NumerologyProfile | null
): string {
  const lines: string[] = [
    '=====================================================',
    '7+2 KANONİK ÇAKRA VE ENERJİ MERKEZLERİ ANALİZİ',
    '====================================================='
  ];

  if (!chakra) {
    lines.push('[Çakra profili henüz hesaplanmadı veya eksik]');
    return lines.join('\n');
  }

  lines.push(`Bütünsel Çakra Skoru : %${chakra.overallChakraBalanceScore}`);
  lines.push(`Birincil Şifa Direktifi: ${chakra.primaryHealingDirective}`);
  const affirmation = chakra.primaryChakraAffirmation || (chakra as any).primaryAffirmation;
  if (affirmation) {
    lines.push(`Çakra Olumlaması     : "${affirmation}"`);
  }

  lines.push('\n--- 1-9 ENERJİ MERKEZLERİ DURUM DÖKÜMÜ ---');
  chakra.chakras.forEach(c => {
    const tName = c.turkishName || (c as any).nameTurkish || `${c.number}. Çakra`;
    const sName = c.sanskritName || (c as any).nameSanskrit || '';
    const color = c.color || (c as any).colorHex || '';
    const isBlocked = c.frequencyCount === 0 || c.status === 'Blokajlı / Eksik' || (c.status as string) === 'blocked';
    lines.push(`\n[${c.number}. ${tName}${sName ? ` (${sName})` : ''}]`);
    lines.push(`  Element/Renk : ${c.element}${color ? ` / ${color}` : ''}`);
    lines.push(`  Frekans Sayısı: ${c.frequencyCount} Harf [${String(c.status).toUpperCase()}]`);
    if (c.yantraGeometry) {
      lines.push(`  Sembolik Form: ${c.yantraGeometry}`);
    }
    if (isBlocked && c.healingSymbols && c.healingSymbols.length > 0) {
      lines.push(`  ⚠️ Tıkanıklık Şifası: ${c.healingSymbols.join(', ')} ile dengelenir.`);
    }
  });

  return lines.join('\n');
}

/**
 * 9. Kişisel Sembol Analizi ve Gerekçeleri
 */
export function buildSymbolAnalysisText(
  symbolism?: SymbolismProfile | null,
  prescription?: PersonalSymbolPrescription | null
): string {
  const lines: string[] = [
    '=====================================================',
    'KİŞİSEL SEMBOL REÇETESİ VE DERİN EZOTERİK GEREKÇELER',
    '====================================================='
  ];

  if (prescription) {
    lines.push(`Birleşik Arketip : "${prescription.unifiedArchetype}"`);
    lines.push(`Üretim Tarihi    : ${prescription.generatedDate}`);
    lines.push('\n--- REÇETEYE DAHİL EDİLEN SEMBOLLER VE ANALİZLERİ ---');

    prescription.symbols.forEach(sym => {
      lines.push(`\n[Sembol ${sym.index}: ${sym.symbolName}]`);
      lines.push(`  Kategori   : ${sym.designCategory} — ${sym.designRole}`);
      lines.push(`  Kaynaklar  : ${sym.sourceSummary}`);
      lines.push(`  Ana Tema   : ${sym.coreTheme}`);
      lines.push(`  Görsel Betimleme: ${sym.visualDescription}`);
      lines.push(`  Ezoterik Gerekçe: ${sym.auditTrail.derivedTheme} (Hesaplama: ${sym.auditTrail.calculationEngine})`);
    });

    lines.push('\n--- BEŞLİ TASARIM FORMÜLÜ (DESIGN FORMULA) ---');
    lines.push(`Merkez Odak            : ${prescription.designFormula.center}`);
    lines.push(`Destekleyici Geometri  : ${prescription.designFormula.supportingGeometry}`);
    lines.push(`Organik Element & Akış : ${prescription.designFormula.organicElement}`);
    lines.push(`Kişisel Mikro Detay    : ${prescription.designFormula.personalMicroDetail}`);
    lines.push(`Negatif Alan Dengesi   : ${prescription.designFormula.negativeSpace}`);
  } else if (symbolism) {
    lines.push(`Ana Tema         : ${symbolism.mainTheme}`);
    lines.push(`Duygusal Rezonans: ${symbolism.emotionalTheme}`);
    lines.push(`Bitki & Flora    : ${symbolism.plantFlora} (${symbolism.plantFloraMeaning})`);
    lines.push(`Kutsal Geometri  : ${symbolism.geometricSymbol} (${symbolism.geometricSymbolMeaning})`);
    lines.push(`Doğal Taş & Kristal: ${symbolism.crystalStone} (${symbolism.crystalStoneMeaning})`);
    lines.push(`Mitolojik Figür  : ${symbolism.mythologicalFigure} (${symbolism.mythologicalFigureMeaning})`);
    lines.push(`Kutsal Obje      : ${symbolism.sacredObject} (${symbolism.sacredObjectMeaning})`);
    if (symbolism.subtleDetails && symbolism.subtleDetails.length > 0) {
      lines.push(`Mikro Detaylar   : ${symbolism.subtleDetails.join(', ')}`);
    }
  } else {
    lines.push('[Sembolizm profili henüz hesaplanmadı]');
  }

  return lines.join('\n');
}

/**
 * 10. Dövme Reçetesi ve Tasarım Tercihleri
 */
export function buildTattooRecipeText(
  recipe?: TattooRecipe | null,
  parameters?: TattooDesignParameters | null
): string {
  const lines: string[] = [
    '=====================================================',
    'DÖVME TASARIM REÇETESİ VE KOMPOZİSYON KILAVUZU',
    '====================================================='
  ];

  const params = parameters || recipe?.parameters;
  if (!params) {
    lines.push('[Tasarım parametreleri henüz seçilmedi]');
    return lines.join('\n');
  }

  if (recipe) {
    lines.push(`Reçete Başlığı   : ${recipe.title}`);
    lines.push(`Danışan          : ${recipe.clientName}`);
    lines.push(`Oluşturulma      : ${new Date(recipe.createdAt).toLocaleDateString('tr-TR')}`);
  }

  lines.push(`Seçilen Stiller  : ${params.selectedStyles?.join(' + ') || 'Fine Line & Geometric'}`);
  lines.push(`Kompozisyon      : ${params.composition}`);
  lines.push(`Yönelim / Akış   : ${params.orientation}`);
  lines.push(`Vücut Yerleşimi  : ${params.bodyPlacement}`);
  lines.push(`Doluluk / Yoğunluk: ${params.density}`);
  lines.push(`Renk Paleti      : ${params.colorScheme}`);
  lines.push(`Görsel Atmosfer  : ${params.visualAtmosphere}`);
  lines.push(`Ana Sembol Odak  : ${params.mainSymbol || 'Kutsal Geometri'}`);

  if (params.secondarySymbols && params.secondarySymbols.length > 0) {
    lines.push(`Yardımcı Semboller: ${params.secondarySymbols.join(', ')}`);
  }

  if (params.excludedDesignSymbols && params.excludedDesignSymbols.length > 0) {
    lines.push(`Tasarımdan Çıkarılanlar: ${params.excludedDesignSymbols.map(e => e.name).join(', ')}`);
  }

  lines.push(`Totem Hayvanı Durumu   : ${params.includeTotemInDesign ? 'Tasarıma Odak Olarak Dahil Edildi' : 'Yalnızca Analiz Katmanında Tutuldu (Hayvan Çizilmeyecek)'}`);

  if (params.useMorseCodeForNumbers) {
    lines.push(`Mors Kodu Şifreleme    : AKTİF (Şifrelenen İfade: "${params.customMorseInput || 'Kişisel Sayılar'}")`);
  }

  if (recipe?.compositionGuide) {
    lines.push(`\nKompozisyon Kılavuzu:\n${recipe.compositionGuide}`);
  }
  if (recipe?.placementAnatomyNotes) {
    lines.push(`\nAnatomi ve Yerleşim Notları:\n${recipe.placementAnatomyNotes}`);
  }

  return lines.join('\n');
}

/**
 * 11. Teknik Dövme Şartnamesi ve Zanaat Analizi
 */
export function buildTechnicalTattooSpecsText(
  recipe?: TattooRecipe | null,
  parameters?: TattooDesignParameters | null
): string {
  const lines: string[] = [
    '=====================================================',
    'TEKNİK DÖVME ŞARTNAMESİ VE DERİ UYGULANABİLİRLİK RAPORU',
    '====================================================='
  ];

  const feas = recipe?.feasibility;
  if (feas) {
    lines.push(`Genel Zanaat Puanı     : ${feas.overallFeasibilityScore}/100`);
    lines.push(`İğne Konfigürasyonu    : ${feas.lineWeight}`);
    lines.push(`Negatif Alan Oranı     : ${feas.negativeSpaceRatio}`);
    lines.push(`Detay Yoğunluğu        : ${feas.detailDensity}`);
    lines.push(`Gölgelendirme Tekniği  : ${feas.shadingTechnique}`);
    lines.push(`Yaşlanma / Blowout Riski: ${feas.agingBlowoutRisk}`);
    lines.push(`Önerilen Boyut (cm)    : ${feas.recommendedSize}`);
    lines.push(`Anatomik Uyum          : ${feas.anatomicalFlow}`);
    lines.push(`\nDeğerlendirme Özeti:\n${feas.summaryEvaluation}`);
  } else if (recipe?.needleAndTechniqueGuide) {
    lines.push(`İğne ve Teknik Rehberi:\n${recipe.needleAndTechniqueGuide}`);
  } else {
    lines.push('[Teknik şartname henüz derlenmedi]');
  }

  return lines.join('\n');
}

/**
 * 12. Görsel Üretim İstemleri (Master AI Prompts)
 */
export function buildAiPromptsText(recipe?: TattooRecipe | null): string {
  const lines: string[] = [
    '=====================================================',
    'YAPAY ZEKA GÖRSEL ÜRETİM İSTEMLERİ (AI PROMPTS)',
    '====================================================='
  ];

  if (!recipe) {
    lines.push('[Reçete oluşturulmadığından AI istemleri mevcut değil]');
    return lines.join('\n');
  }

  lines.push('1. MIDJOURNEY v6.1 / NIJI 6 MASTER PROMPT:');
  lines.push(recipe.midjourneyPrompt || recipe.masterEnglishPrompt || '[Mevcut değil]');

  lines.push('\n2. DALL-E 3 MASTER TATTOO FLASH PROMPT:');
  lines.push(recipe.dalle3Prompt || recipe.masterEnglishPrompt || '[Mevcut değil]');

  lines.push('\n3. 03RL TERMAL STENCIL & ÇİZGİ TRANSFER PROMPTU:');
  lines.push(recipe.stencilPrompt || recipe.masterOutlinePrompt || '[Mevcut değil]');

  lines.push('\n4. GÖLGELİ DÖVME FLAŞI PROMPTU (SHADED FLASH):');
  lines.push(recipe.masterShadedPrompt || recipe.masterEnglishPrompt || '[Mevcut değil]');

  lines.push('\n5. NEGATİF PROMPT (YASAKLANMIŞ UNSURLAR):');
  lines.push(recipe.negativePrompt || 'blurry, low quality, colors (if monochrome), text, signature');

  return lines.join('\n');
}

/**
 * 13. TÜM DANIŞAN VERİLERİNİ KOPYALA (MASTER BİRLEŞİK METİN)
 */
export function buildCompleteClientDataText(input: FullClientDataCopyInput): string {
  const clientName = input.client.name?.trim() || 'Danışan';
  const nowStr = new Date().toLocaleString('tr-TR');

  const divider = '\n\n' + '='.repeat(60) + '\n';

  return [
    '############################################################',
    `# DÖVME TASARIM ASİSTANI V2 — TAM KAPSAMLI DANIŞAN DOSYASI`,
    `# Danışan: ${clientName}`,
    `# Dışa Aktarma Tarihi: ${nowStr}`,
    '############################################################',
    '\n',
    'BÖLÜM 1: DANIŞAN KİMLİK VE İLETİŞİM BİLGİLERİ',
    buildClientGeneralInfoText(input.client),
    divider,
    'BÖLÜM 2: ENNEAGRAM KİŞİLİK VE GÖLGE ARKETİP ANALİZİ',
    buildEnneagramAnalysisText(input.client.enneagramAnswers, input.enneagram),
    divider,
    'BÖLÜM 3: DAVRANIŞSAL TOTEM HAYVANI TESTİ VE HİYERARŞİSİ',
    buildTotemAnalysisText(input.client.totemAnswers, input.symbolism?.totemTestResult, input.symbolism),
    divider,
    'BÖLÜM 4: NUMEROLOJİ PİSAGOR MATRİSİ VE SAYISAL TİTREŞİMLER',
    buildNumerologyAnalysisText(input.numerology),
    divider,
    'BÖLÜM 5: ASTROLOJİ GERÇEK EFEMERİS VE GÖKSEL KOORDİNATLAR',
    buildAstrologyAnalysisText(input.astrology),
    divider,
    'BÖLÜM 6: KADİM EBCED VE YILDIZNAME MİZAN HESAPLAMALARI',
    buildEbcedMizanAnalysisText(input.client),
    divider,
    'BÖLÜM 7: 7+2 KANONİK ÇAKRA VE ENERJİ MERKEZLERİ ANALİZİ',
    buildChakraAnalysisText(input.chakra, input.numerology),
    divider,
    'BÖLÜM 8: KİŞİSEL SEMBOL REÇETESİ VE DERİN EZOTERİK GEREKÇELER',
    buildSymbolAnalysisText(input.symbolism, input.prescription),
    divider,
    'BÖLÜM 9: DÖVME TASARIM REÇETESİ VE KOMPOZİSYON KILAVUZU',
    buildTattooRecipeText(input.recipe, input.parameters),
    divider,
    'BÖLÜM 10: TEKNİK DÖVME ŞARTNAMESİ VE UYGULANABİLİRLİK RAPORU',
    buildTechnicalTattooSpecsText(input.recipe, input.parameters),
    divider,
    'BÖLÜM 11: YAPAY ZEKA GÖRSEL ÜRETİM İSTEMLERİ (AI PROMPTS)',
    buildAiPromptsText(input.recipe),
    '\n\n############################################################',
    '# DOSYA SONU — DÖVME TASARIM ASİSTANI V2',
    '############################################################'
  ].join('\n');
}

// ============================================================================
// 4. KULLANICI ARAYÜZÜ KOPYALAMA AKSİYONLARI (CLIPBOARD DISPATCHERS)
// ============================================================================

export async function copyClientGeneralInfo(client: Partial<PersonData>): Promise<boolean> {
  return copyTextToClipboard(buildClientGeneralInfoText(client));
}

export async function copyEnneagramAnalysis(
  answers?: Record<number, number> | null, 
  ennea?: EnneagramProfile | null
): Promise<boolean> {
  return copyTextToClipboard(buildEnneagramAnalysisText(answers, ennea));
}

export async function copyTotemAnalysis(
  answers?: Record<number, string> | null, 
  totemResult?: any, 
  symbolism?: SymbolismProfile | null
): Promise<boolean> {
  return copyTextToClipboard(buildTotemAnalysisText(answers, totemResult, symbolism));
}

export async function copyTestAnswersAndResults(
  client: Partial<PersonData>,
  totemResult?: any,
  ennea?: EnneagramProfile | null,
  symbolism?: SymbolismProfile | null
): Promise<boolean> {
  return copyTextToClipboard(buildTestAnswersAndResultsText(client, totemResult, ennea, symbolism));
}

export async function copyNumerologyAnalysis(num?: NumerologyProfile | null): Promise<boolean> {
  return copyTextToClipboard(buildNumerologyAnalysisText(num));
}

export async function copyAstrologyAnalysis(astro?: AstrologyProfile | null): Promise<boolean> {
  return copyTextToClipboard(buildAstrologyAnalysisText(astro));
}

export async function copyEbcedMizanAnalysis(client: Partial<PersonData>): Promise<boolean> {
  return copyTextToClipboard(buildEbcedMizanAnalysisText(client));
}

export async function copyChakraAnalysis(
  chakra?: ChakraProfile | null, 
  num?: NumerologyProfile | null
): Promise<boolean> {
  return copyTextToClipboard(buildChakraAnalysisText(chakra, num));
}

export async function copySymbolAnalysis(
  symbolism?: SymbolismProfile | null,
  prescription?: PersonalSymbolPrescription | null
): Promise<boolean> {
  return copyTextToClipboard(buildSymbolAnalysisText(symbolism, prescription));
}

export async function copyTattooRecipe(
  recipe?: TattooRecipe | null,
  parameters?: TattooDesignParameters | null
): Promise<boolean> {
  return copyTextToClipboard(buildTattooRecipeText(recipe, parameters));
}

export async function copyTechnicalTattooSpecs(
  recipe?: TattooRecipe | null,
  parameters?: TattooDesignParameters | null
): Promise<boolean> {
  return copyTextToClipboard(buildTechnicalTattooSpecsText(recipe, parameters));
}

export async function copyAiPrompts(recipe?: TattooRecipe | null): Promise<boolean> {
  return copyTextToClipboard(buildAiPromptsText(recipe));
}

export async function copyCompleteClientData(input: FullClientDataCopyInput): Promise<boolean> {
  return copyTextToClipboard(buildCompleteClientDataText(input));
}

/**
 * 14. Tekil PersonData nesnesinden tüm hesaplamaları dinamik derleyip eksiksiz dosya metnini üretir.
 */
export function buildCompleteClientDataFromPerson(
  client: PersonData,
  overrides?: Partial<FullClientDataCopyInput>
): string {
  let numerology: NumerologyProfile | null = overrides?.numerology || null;
  let astrology: AstrologyProfile | null = overrides?.astrology || null;
  let enneagram: EnneagramProfile | null = overrides?.enneagram || null;
  let totemResult: any = null;
  let symbolism: SymbolismProfile | null = overrides?.symbolism || null;
  let chakra: ChakraProfile | null = overrides?.chakra || null;

  // Numeroloji
  if (!numerology && client.name && client.birthDate) {
    try {
      numerology = calculateNumerology(client.name, client.birthDate);
    } catch {
      // Eksik veya geçersizse sessizce atlanır, metinde [Hesaplanmadı] olarak yer alır
    }
  }

  // Astroloji
  if (!astrology && client.birthDate) {
    try {
      astrology = calculateAstrology(
        client.birthDate,
        client.birthTime,
        client.birthPlace,
        client.zodiacSystem || 'Tropical',
        typeof client.birthLatitude === 'number' && typeof client.birthLongitude === 'number'
          ? {
              name: client.birthPlace || 'Kayıtlı Konum',
              displayName: client.birthPlace || 'Kayıtlı Konum',
              city: client.birthCity,
              region: client.birthRegion,
              country: client.birthCountry,
              countryCode: client.birthCountryCode,
              lat: client.birthLatitude,
              lon: client.birthLongitude,
              timezone: client.birthTimezone,
              defaultTz: client.birthTimezoneOffset
            }
          : undefined
      );
    } catch {
      // Ignored
    }
  }

  // Enneagram
  if (!enneagram) {
    if (client.enneagramAnswers && Object.keys(client.enneagramAnswers).length === 15) {
      try {
        const enneaCalc = calculateEnneagramFromAnswers(client.enneagramAnswers);
        enneagram = getEnneagramProfile(enneaCalc.type, enneaCalc.wing, true);
      } catch {
        // Fallback below
      }
    }
    if (!enneagram && (client.enneagramType || client.enneagramWing)) {
      try {
        enneagram = getEnneagramProfile(client.enneagramType || 4, client.enneagramWing || '4w5');
      } catch {
        // Ignored
      }
    }
  }

  // Totem & Sembolizm
  if (client.name && client.birthDate) {
    if (!totemResult && client.totemAnswers && Object.keys(client.totemAnswers).length === 15) {
      try {
        totemResult = calculateTotemAnimal({
          name: client.name,
          birthDate: client.birthDate,
          birthTime: client.birthTime,
          birthPlace: client.birthPlace,
          motherName: client.motherName,
          totemAnswers: client.totemAnswers,
          enneagramType: client.enneagramType,
          lifePathNumber: numerology?.lifePathNumber,
          dominantElement: astrology?.dominantElement,
          sunSign: astrology?.sunSign
        });
      } catch {
        // Ignored
      }
    }

    if (!symbolism && numerology && astrology && enneagram) {
      try {
        symbolism = deriveSymbolismProfile(
          numerology,
          astrology,
          enneagram,
          {
            name: client.name,
            birthDate: client.birthDate,
            birthTime: client.birthTime,
            birthPlace: client.birthPlace,
            motherName: client.motherName,
            totemAnswers: client.totemAnswers
          }
        );
      } catch {
        // Ignored
      }
    }
  }

  // Çakra
  if (!chakra && numerology && astrology) {
    try {
      chakra = calculateChakraProfile(numerology, astrology);
    } catch {
      // Ignored
    }
  }

  return buildCompleteClientDataText({
    client,
    numerology,
    astrology,
    enneagram,
    symbolism: symbolism || (totemResult ? ({
      totemTestResult: totemResult,
      totemHierarchy: [totemResult.primaryTotem, totemResult.shadowTotem, totemResult.secondaryTotem]
    } as any) : null),
    chakra,
    parameters: overrides?.parameters,
    recipe: overrides?.recipe,
    prescription: overrides?.prescription,
    notes: client.notes
  });
}

/**
 * 15. Tekil PersonData nesnesinin tüm verilerini panoya kopyalar.
 */
export async function copyCompleteClientDataFromPerson(
  client: PersonData,
  overrides?: Partial<FullClientDataCopyInput>
): Promise<boolean> {
  const text = buildCompleteClientDataFromPerson(client, overrides);
  return copyTextToClipboard(text);
}

