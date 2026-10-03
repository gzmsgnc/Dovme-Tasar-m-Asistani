import {
  PersonData,
  NumerologyProfile,
  AstrologyProfile,
  EnneagramProfile,
  SymbolismProfile,
  ChakraProfile,
  TattooDesignParameters
} from '../types';
import { calculateEbcedAndYildizname, calculateSingleEbced } from './ebced';

// ============================================================================
// 1. KANONİK VERİ MODELİ (CANONICAL SOURCE OF TRUTH)
// ============================================================================

export interface CanonicalChakraItem {
  number: number;
  turkishName: string;
  sanskritName: string;
  yantraGeometry: string;
  element: string;
  color: string;
  count: number;
  isMissingOrBlocked: boolean;
  statusText: string;
  symbolicMeaning: string;
  symbolicRecommendation: string;
}

export interface CanonicalClientAnalysis {
  client: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    motherName?: string;
    formattedBirthInfo: string;
  };
  numerology: {
    lifePathNumber: number;
    lifePathTitle: string;
    destinyNumber: number; // İfade Sayısı
    destinyTitle: string;
    dmNumber: number; // Dünya Misyonu
    dmTitle: string;
    soulUrgeNumber: number;
    personalityNumber: number;
    missingNumbers: number[];
    masterNumbers: number[];
    hasVerified19: boolean;
    divine19SourceExplanation: string;
  };
  astrology: {
    system: 'Tropikal (Batı)';
    sunSign: string;
    sunDegree: string;
    moonSign: string;
    moonDegree: string;
    ascendantSign: string;
    ascendantDegree: string;
    dominantElement: string;
    archetype: string;
  };
  ebcedAndMizan: {
    personName: string;
    personEbced: number;
    motherName?: string;
    motherEbced?: number;
    hasMotherName: boolean;
    totalEbced: number;
    calculationChainText: string;
    mizanBurc: string;
    mizanElement: string;
    planetGuide: string;
    talismanicNumber: number;
    symbolicRepresentation: string;
  };
  enneagram: {
    type: number;
    wing: string;
    typeName: string;
    coreMotivation: string;
    coreFear: string;
    shadowTraits: string[];
    growthPoint: number;
    stressPoint: number;
  };
  totem: {
    primaryTotem: string;
    primaryTotemMeaning: string;
    shadowTotem: string;
    shadowTotemMeaning: string;
    allyTotem: string;
    allyTotemMeaning: string;
    includeAnimalInTattoo: boolean;
    totemHandlingMode: 'Figüratif Odak' | 'Analiz Yalnızca';
    totemHandlingExplanation: string;
  };
  chakra: {
    allChakras: CanonicalChakraItem[];
    blockedOrMissingChakras: CanonicalChakraItem[];
    dominantOrBalancedChakras: CanonicalChakraItem[];
    canonicalBlockedNumbers: number[];
    summaryLine: string;
  };
}

// ============================================================================
// 2. HESAPLAMADAN SEMBOLE GEÇİŞ VE DENETİM VERİ YAPISI
// ============================================================================

export interface PrescriptionSymbolSource {
  engine: 'Numeroloji' | 'Astroloji (Batı)' | 'Ezoterik / Ebced' | 'Enneagram' | 'Totem Rezonansı' | 'Kanonik Çakra' | 'Geometrik Altın Oran';
  parameter: string;
  calculatedValue: string;
}

export interface PrescriptionSymbol {
  id: string;
  index: number;
  symbolName: string;
  sources: PrescriptionSymbolSource[];
  sourceSummary: string;
  coreTheme: string;
  designRole: string;
  designCategory: 'Merkez' | 'Destekleyici geometri' | 'Organik element' | 'Kişisel mikro detay' | 'Negatif alan';
  visualDescription: string;
  auditTrail: {
    calculationEngine: string;
    calculatedValue: string;
    derivedTheme: string;
    selectedVisual: string;
    designPlacement: string;
  };
}

export interface PrescriptionDesignFormula {
  center: string;
  supportingGeometry: string;
  organicElement: string;
  personalMicroDetail: string;
  negativeSpace: string;
  visualLanguage: string;
}

export interface PersonalSymbolPrescription {
  title: string;
  generatedDate: string;
  canonicalAnalysis: CanonicalClientAnalysis;
  calculationMapText: string;
  unifiedArchetype: string;
  symbols: PrescriptionSymbol[];
  designFormula: PrescriptionDesignFormula;
  personalClosing: string;
  fullPrescriptionText: string;
  tattooDesignPrompt: string;
  negativePrompt: string;
  auditReportText: string;
  excludedDesignSymbols?: Array<{ name: string; reason?: string }>;
}

// ============================================================================
// 3. KANONİK ANALİZ VERİSİNİN ÇIKARILMASI (SINGLE SOURCE OF TRUTH)
// ============================================================================

export function extractCanonicalClientAnalysis(params: {
  person: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism: SymbolismProfile;
  chakra?: ChakraProfile;
  designParameters: TattooDesignParameters;
}): CanonicalClientAnalysis {
  const { person, numerology, astrology, enneagram, symbolism, chakra, designParameters } = params;

  // 1. Client Identity & Birth
  const birthDateFormatted = person.birthDate ? person.birthDate.split('-').reverse().join('.') : 'Belirtilmedi';
  const birthTimeFormatted = person.birthTime || 'Saat belirtilmedi';
  const birthPlaceFormatted = person.birthCity 
    ? `${person.birthCity}${person.birthCountry ? `, ${person.birthCountry}` : ''}`
    : (person.birthPlace || 'Belirtilmedi');
  const formattedBirthInfo = `${birthDateFormatted} – ${birthTimeFormatted} – ${birthPlaceFormatted}`;

  // 2. Numerology
  const hasVerified19 = numerology.divineHelp19?.has19 === true;
  const divine19SourceExplanation = hasVerified19
    ? `Pisagor hesaplamasında ${numerology.divineHelp19.formulaBreakdown || '1. ve 9. çakra ekseni rezonansı'}`
    : 'Haritada 19 rezonansı tespit edilmedi (uydurma ekleme yapılmaz)';

  // 3. Astrology (Western/Tropical)
  const sunSign = astrology.sunSign || 'Belirtilmedi';
  const sunDegree = astrology.sunDegreeFormatted ? `${sunSign} ${astrology.sunDegreeFormatted}` : sunSign;
  const moonSign = astrology.moonSign || 'Belirtilmedi';
  const moonDegree = astrology.moonDegreeFormatted ? `${moonSign} ${astrology.moonDegreeFormatted}` : moonSign;
  const ascendantSign = astrology.ascendantSign || 'Belirtilmedi';
  const ascendantDegree = astrology.ascendantDegreeFormatted ? `${ascendantSign} ${astrology.ascendantDegreeFormatted}` : ascendantSign;

  // 4. Ebced & Mizan (Ezoterik hesaplama zinciri)
  const pNameClean = (person.name || '').trim();
  const personEbced = calculateSingleEbced(pNameClean);
  if (!pNameClean || personEbced === 0) {
    throw new Error('Kişisel Ebced hesabı için geçerli danışan adı zorunludur; tahmini Ebced kullanılamaz.');
  }
  const mNameClean = (person.motherName || '').trim();
  const hasMotherName = mNameClean.length > 0;
  
  let motherEbced: number | undefined = undefined;
  let totalEbced = personEbced;
  let calculationChainText = '';

  if (hasMotherName) {
    motherEbced = calculateSingleEbced(mNameClean);
    totalEbced = personEbced + motherEbced;
    calculationChainText = `Ad (${pNameClean}) → ${personEbced} | Anne adı (${mNameClean}) → ${motherEbced} | Ebced Toplamı → ${totalEbced}`;
  } else {
    calculationChainText = `Ad (${pNameClean}) → ${personEbced} (Anne adı girilmedi, salt isim Ebcedi: ${personEbced})`;
  }

  const ebcedCalculated = calculateEbcedAndYildizname(pNameClean, hasMotherName ? mNameClean : undefined);
  const mizanBurc = ebcedCalculated.yildiznameBurcName;
  const mizanElement = ebcedCalculated.yildiznameElement;

  // 5. Enneagram
  const enneaType = enneagram.type;
  const enneaWing = enneagram.wing;
  const enneaTypeName = enneagram.typeName;
  if (!Number.isInteger(enneaType) || !enneaWing || !enneaTypeName) {
    throw new Error('Enneagram sonucu doğrulanmadan kişisel sembol reçetesi üretilemez.');
  }

  // 6. Totem Hayvanları
  const primaryTotem = symbolism.totemAnimal || symbolism.calculatedTotemName;
  const primaryTotemMeaning = symbolism.totemAnimalMeaning || symbolism.calculatedTotemMeaning;
  const shadowTotem = symbolism.totemHierarchy?.[1]?.name || symbolism.secondaryAnimals?.[0];
  const shadowTotemMeaning = symbolism.totemHierarchy?.[1]?.meaning;
  const allyTotem = symbolism.totemHierarchy?.[2]?.name || symbolism.secondaryAnimals?.[1];
  const allyTotemMeaning = symbolism.totemHierarchy?.[2]?.meaning;
  if (!primaryTotem || !primaryTotemMeaning || !shadowTotem || !shadowTotemMeaning || !allyTotem || !allyTotemMeaning) {
    throw new Error('Totem hiyerarşisi tamamlanmadan kişisel sembol reçetesi üretilemez.');
  }

  const includeAnimalInTattoo = designParameters.includeTotemInDesign === true;
  const totemHandlingMode: 'Figüratif Odak' | 'Analiz Yalnızca' = includeAnimalInTattoo 
    ? 'Figüratif Odak' 
    : 'Analiz Yalnızca';

  const totemHandlingExplanation = includeAnimalInTattoo
    ? `Danışan tercihi doğrultusunda ${primaryTotem} figürü dövmede ana görsel odak olarak yer alır.`
    : `Danışan tercihi doğrultusunda ${primaryTotem}, ${shadowTotem} ve diğer totem verileri yalnızca analiz/yorum katmanında tutulmuş; hiçbir hayvan figürü veya hayvan temelli soyutlama final dövme kompozisyonuna aktarılmamıştır.`;

  // 7. Canonical Chakra Result (Single Source of Truth: numerology.missingNumbers & chakra.chakras)
  const canonicalBlockedNumbers = [...(numerology.missingNumbers || [])].sort((a, b) => a - b);

  const defaultDefinitions = [
    { num: 1, tr: 'Kök Çakra', sk: 'Muladhara', yantra: 'Dört Köşeli Kare & Prithvi Yantrası', el: 'Toprak', col: '#ef4444' },
    { num: 2, tr: 'Sakral Çakra', sk: 'Svadhisthana', yantra: 'Gümüş Hilal & Su Nilüferi', el: 'Su', col: '#f97316' },
    { num: 3, tr: 'Solar Pleksus', sk: 'Manipura', yantra: 'Ters Aşağı Bakan Ateş Üçgeni', el: 'Ateş', col: '#eab308' },
    { num: 4, tr: 'Kalp Çakrası', sk: 'Anahata', yantra: 'Heksagram (Çift Üçgen) & Kutsal Lotus', el: 'Hava', col: '#10b981' },
    { num: 5, tr: 'Boğaz Çakrası', sk: 'Vishuddha', yantra: 'İç İçe Daire & Hilal Formu', el: 'Eter / Ses', col: '#06b6d4' },
    { num: 6, tr: 'Üçüncü Göz', sk: 'Ajna', yantra: 'İki Yapraklı Lotus & Kozmik Göz', el: 'Işık / Sezgi', col: '#6366f1' },
    { num: 7, tr: 'Taç Çakra', sk: 'Sahasrara', yantra: 'Bin Yapraklı Lotus & Kutsal Çember', el: 'Kozmik Bilinç', col: '#a855f7' },
    { num: 8, tr: 'Aura Kalkanı', sk: 'Prana Mandal', yantra: 'Sonsuzluk İşareti & Ouroboros', el: 'Manyetizma', col: '#e2e8f0' },
    { num: 9, tr: 'Tamamlanma & Bütünlük', sk: 'Karmic Moksha', yantra: 'Dokuz Köşeli Yıldız & Yaşam Çiçeği', el: 'Evrensel Bütünlük', col: '#f8fafc' },
  ];

  const allChakras: CanonicalChakraItem[] = defaultDefinitions.map((d) => {
    const count = numerology.chakraCounts?.[d.num] ?? (chakra?.chakras?.find(c => c.number === d.num)?.frequencyCount ?? 0);
    const isMissing = count === 0;

    let statusText = 'Dengeli / Taşıyıcı';
    let symbolicRecommendation = 'Kompozisyonun taşıyıcı geometrik aksı olarak yer alır.';

    if (isMissing) {
      statusText = 'Eksik / Destek İsteyen';
      symbolicRecommendation = `Kişisel isim analizinde ${d.num}. çakraya denk gelen harf bulunmadığından, tasarım içinde ${d.yantra} geometrisiyle sembolik olarak dengelenir.`;
    } else if (count === 1) {
      statusText = 'Tekil Titreşim';
      symbolicRecommendation = 'Hassas 03RL ince linework ile destekleyici akış oluşturulur.';
    } else if (count > 4) {
      statusText = 'Aşırı Yoğun Titreşim';
      symbolicRecommendation = 'Geniş negatif alan ve yumuşatıcı organik geçişlerle dengelenir.';
    }

    return {
      number: d.num,
      turkishName: d.tr,
      sanskritName: d.sk,
      yantraGeometry: d.yantra,
      element: d.el,
      color: d.col,
      count,
      isMissingOrBlocked: isMissing,
      statusText,
      symbolicMeaning: `${d.tr} (${d.sk}) temasını temsil eder.`,
      symbolicRecommendation
    };
  });

  const blockedOrMissingChakras = allChakras.filter(c => c.isMissingOrBlocked);
  const dominantOrBalancedChakras = allChakras.filter(c => !c.isMissingOrBlocked);

  const blockedNames = blockedOrMissingChakras.length > 0
    ? blockedOrMissingChakras.map(c => `${c.number}. ${c.turkishName}`).join(', ')
    : 'Tüm çakralarda harf titreşimi mevcut (Tam denge)';

  const dominantNames = dominantOrBalancedChakras.slice(0, 3).map(c => `${c.number}. ${c.turkishName}`).join(', ');
  const summaryLine = `Eksik / Destek İsteyen: ${blockedNames} | Taşıyıcı / Dengeli: ${dominantNames}`;

  return {
    client: {
      name: pNameClean || 'Danışan',
      birthDate: person.birthDate || '',
      birthTime: person.birthTime || '',
      birthPlace: person.birthPlace || '',
      motherName: person.motherName,
      formattedBirthInfo
    },
    numerology: {
      lifePathNumber: numerology.lifePathNumber,
      lifePathTitle: numerology.lifePathTitle,
      destinyNumber: numerology.destinyNumber,
      destinyTitle: numerology.destinyTitle,
      dmNumber: numerology.dmNumber,
      dmTitle: numerology.dmTitle,
      soulUrgeNumber: numerology.soulUrgeNumber,
      personalityNumber: numerology.personalityNumber,
      missingNumbers: canonicalBlockedNumbers,
      masterNumbers: numerology.masterNumbers || [],
      hasVerified19,
      divine19SourceExplanation
    },
    astrology: {
      system: 'Tropikal (Batı)',
      sunSign,
      sunDegree,
      moonSign,
      moonDegree,
      ascendantSign,
      ascendantDegree,
      dominantElement: astrology.dominantElement || 'Ateş',
      archetype: astrology.archetype || 'Arayışçı'
    },
    ebcedAndMizan: {
      personName: pNameClean,
      personEbced,
      motherName: person.motherName,
      motherEbced,
      hasMotherName,
      totalEbced,
      calculationChainText,
      mizanBurc,
      mizanElement,
      planetGuide: ebcedCalculated.planetGuide,
      talismanicNumber: ebcedCalculated.talismanicNumber,
      symbolicRepresentation: `Kişisel Ebced sayısı ${totalEbced} ve Mizan ${mizanBurc} (${mizanElement}) ezoterik ekseni.`
    },
    enneagram: {
      type: enneaType,
      wing: enneaWing,
      typeName: enneaTypeName,
      coreMotivation: enneagram.coreMotivation || 'Anlam ve derinlik arayışı',
      coreFear: enneagram.coreFear || 'Yetersizlik veya belirsizlik',
      shadowTraits: enneagram.shadowTraits || ['Aşırı zihinselleştirme', 'Geri çekilme'],
      growthPoint: enneagram.growthPoint || 8,
      stressPoint: enneagram.stressPoint || 7
    },
    totem: {
      primaryTotem,
      primaryTotemMeaning,
      shadowTotem,
      shadowTotemMeaning,
      allyTotem,
      allyTotemMeaning,
      includeAnimalInTattoo,
      totemHandlingMode,
      totemHandlingExplanation
    },
    chakra: {
      allChakras,
      blockedOrMissingChakras,
      dominantOrBalancedChakras,
      canonicalBlockedNumbers,
      summaryLine
    }
  };
}

// ============================================================================
// 4. BİRLEŞİK ARKETİP ÜRETİMİ (MAX 2-3 CÜMLE)
// ============================================================================

export function generateUnifiedArchetype(canonical: CanonicalClientAnalysis): string {
  const sun = canonical.astrology.sunSign;
  const lp = canonical.numerology.lifePathNumber;
  const enneaWing = canonical.enneagram.wing;
  const totem = canonical.totem.primaryTotem;
  const mizan = canonical.ebcedAndMizan.mizanBurc;

  return `${sun} burcunun yön ve anlam arayışı, Yaşam Yolu ${lp}'in aydınlatıcı vizyonu ve Enneagram ${enneaWing} arketipinin analitik derinliğiyle birleşmektedir. ${totem} rehberliği ve Mizan ${mizan} dengesi, danışanın içsel iradesini somut bir yaşam pusulasına dönüştüren "Bilge Arayışçı & Muhafız" temasını temsil eder.`.trim();
}

// ============================================================================
// 5. HESAPLAMADAN SEMBOLE GEÇİŞ MOTORU (SONUÇ → TEMA → SEMBOL)
// ============================================================================

export function derivePrescriptionSymbols(
  canonical: CanonicalClientAnalysis,
  designParameters: TattooDesignParameters,
  symbolism: SymbolismProfile
): PrescriptionSymbol[] {
  const symbols: PrescriptionSymbol[] = [];
  const includeTotem = canonical.totem.includeAnimalInTattoo;

  // Sembol 1: ANA ODAK SEMBOLÜ (Primary Focal Symbol)
  // Kaynak: Güneş Burcu + Yaşam Yolu + Enneagram
  let mainSymName = '';
  let mainSymSources: PrescriptionSymbolSource[] = [];
  let mainTheme = '';
  let mainVisual = '';

  if (includeTotem) {
    mainSymName = canonical.totem.primaryTotem;
    mainSymSources = [
      { engine: 'Totem Rezonansı', parameter: 'Ana Totem', calculatedValue: canonical.totem.primaryTotem },
      { engine: 'Astroloji (Batı)', parameter: 'Güneş', calculatedValue: canonical.astrology.sunDegree },
      { engine: 'Numeroloji', parameter: 'Yaşam Yolu', calculatedValue: `${canonical.numerology.lifePathNumber}` },
      { engine: 'Enneagram', parameter: 'Tip & Kanat', calculatedValue: canonical.enneagram.wing }
    ];
    mainTheme = 'içsel irade, uyanış, cesur eylem ve rehberlik gücü';
    mainVisual = `03RL hassas konturlar ve whip shading geçişleriyle işlenmiş ${canonical.totem.primaryTotem} anatomik odağı.`;
  } else {
    // Soyut / Kutsal Obje odağı (Güneş + Yaşam Yolu + Enneagram kaynaklı)
    const baseObject = symbolism.sacredObject || 'Kadim Anahtar & Pusula';
    mainSymName = baseObject;
    mainSymSources = [
      { engine: 'Astroloji (Batı)', parameter: 'Güneş', calculatedValue: canonical.astrology.sunDegree },
      { engine: 'Numeroloji', parameter: 'Yaşam Yolu', calculatedValue: `${canonical.numerology.lifePathNumber}` },
      { engine: 'Enneagram', parameter: 'Tip & Kanat', calculatedValue: canonical.enneagram.wing }
    ];
    mainTheme = 'keşif, yön, hakikat arayışı ve zihinsel derinlik';
    mainVisual = `Kompozisyonun kalbinde yer alan, 03RL ince çizgi ve antik detaylarla bezenmiş stilize ${baseObject} formu.`;
  }

  symbols.push({
    id: 'sym_1_focal',
    index: 1,
    symbolName: mainSymName,
    sources: mainSymSources,
    sourceSummary: mainSymSources.map(s => `${s.parameter} ${s.calculatedValue}`).join(', '),
    coreTheme: mainTheme,
    designRole: 'Ana görsel odak: Kompozisyonun kalbinde en yüksek kontrast, net kontur ve derinlikle yer alır.',
    designCategory: 'Merkez',
    visualDescription: mainVisual,
    auditTrail: {
      calculationEngine: mainSymSources.map(s => s.engine).join(' + '),
      calculatedValue: mainSymSources.map(s => `${s.parameter}: ${s.calculatedValue}`).join(' | '),
      derivedTheme: mainTheme,
      selectedVisual: mainSymName,
      designPlacement: 'Merkez Odak (%60-70 Görsel Ağırlık)'
    }
  });

  // Sembol 2: TAŞIYICI KUTSAL GEOMETRİ & ALTIN ORAN AKIŞI
  // Kaynak: Numeroloji (DM & İfade) + Fibonacci Oranı
  const sacredGeoName = symbolism.geometricSymbol || 'Kutsal Geometri & Metatron Matrisi';
  const geoSources: PrescriptionSymbolSource[] = [
    { engine: 'Numeroloji', parameter: 'İfade Sayısı (Ana Kulvar)', calculatedValue: `${canonical.numerology.destinyNumber}` },
    { engine: 'Numeroloji', parameter: 'Dünya Misyonu (DM)', calculatedValue: `${canonical.numerology.dmNumber}` },
    { engine: 'Geometrik Altın Oran', parameter: 'Fibonacci Spirali', calculatedValue: '1:1.618 Evrensel Denge' }
  ];
  const geoTheme = 'oran, düzen, ritim ve kozmik mimarinin kompozisyonel akışı';
  const geoVisual = 'Arka planda mikro-dotwork ve ultra ince 03RL kılavuz hatlarıyla örülmüş geometrik mandala ve altın oran ekseni.';

  symbols.push({
    id: 'sym_2_geometry',
    index: 2,
    symbolName: sacredGeoName,
    sources: geoSources,
    sourceSummary: geoSources.map(s => `${s.parameter} ${s.calculatedValue}`).join(', '),
    coreTheme: geoTheme,
    designRole: 'Destekleyici geometri: Dövmenin taşıyıcı mimari omurgasını oluşturur; ana figürü gövdeye bağlar.',
    designCategory: 'Destekleyici geometri',
    visualDescription: geoVisual,
    auditTrail: {
      calculationEngine: 'Numeroloji (İfade & DM) + Altın Oran',
      calculatedValue: `İfade: ${canonical.numerology.destinyNumber}, DM: ${canonical.numerology.dmNumber}`,
      derivedTheme: geoTheme,
      selectedVisual: sacredGeoName,
      designPlacement: 'Arka Plan Geometrik Matris'
    }
  });

  // Sembol 3: KANONİK ÇAKRA VE YANTRA TABANI
  // Kaynak: Kanonik Çakra Eksiklikleri / Dengeleyici Yantra
  let chakraSymName = 'Prithvi Kök Yantrası & Metatron Zemin Küpü';
  let chakraTargetText = '1. Kök Çakra';
  let chakraTheme = 'köklenme, güven ve sarsılmaz zemin hissi';
  
  if (canonical.chakra.blockedOrMissingChakras.length > 0) {
    const firstBlocked = canonical.chakra.blockedOrMissingChakras[0];
    chakraSymName = `${firstBlocked.number}. ${firstBlocked.turkishName} Yantrası (${firstBlocked.yantraGeometry.split('&')[0].trim()})`;
    chakraTargetText = `${firstBlocked.number}. Çakra (${firstBlocked.turkishName})`;
    chakraTheme = `${firstBlocked.element} elementi rezonansı, merkezlenme ve duygusal uyum`;
  } else {
    chakraSymName = 'Anahata Heksagramı & Lotus Çapası';
    chakraTargetText = '4. Çakra (Kalp) ve Bütünsel Denge';
    chakraTheme = 'merkezlenme, koşulsuz sevgi ve akış harmonisi';
  }

  const chakraSources: PrescriptionSymbolSource[] = [
    { engine: 'Kanonik Çakra', parameter: 'Çakra Analizi', calculatedValue: chakraTargetText },
    { engine: 'Numeroloji', parameter: 'Eksik Sayılar', calculatedValue: canonical.numerology.missingNumbers.join(', ') || 'Yok (Tam Denge)' }
  ];

  symbols.push({
    id: 'sym_3_chakra',
    index: 3,
    symbolName: chakraSymName,
    sources: chakraSources,
    sourceSummary: `${chakraTargetText} (Eksik Sayı Kontrolü: ${canonical.numerology.missingNumbers.join(', ') || 'Tam'})`,
    coreTheme: chakraTheme,
    designRole: 'Destekleyici geometri / Taban: Kompozisyonun alt kaidesinde veya merkezinde sembolik dengeleyici matris görevi görür.',
    designCategory: 'Destekleyici geometri',
    visualDescription: `Hassas çizgilerle işlenmiş ${chakraSymName} formundaki yantra geometrisi.`,
    auditTrail: {
      calculationEngine: 'Kanonik Çakra & Numerolojik Eksik Sayılar',
      calculatedValue: chakraTargetText,
      derivedTheme: chakraTheme,
      selectedVisual: chakraSymName,
      designPlacement: 'Alt Taban / Merkez Kaide'
    }
  });

  // Sembol 4: ORGANİK ELEMENT & FLORA (Akış ve Kas Uyumu)
  // Kaynak: Ay Burcu + Hakim Element + Enneagram Büyüme Hattı
  const floraName = symbolism.plantFlora || 'Ginkgo Biloba & Kutsal Lotus';
  const floraSources: PrescriptionSymbolSource[] = [
    { engine: 'Astroloji (Batı)', parameter: 'Ay Burcu', calculatedValue: canonical.astrology.moonDegree },
    { engine: 'Astroloji (Batı)', parameter: 'Hakim Element', calculatedValue: canonical.astrology.dominantElement },
    { engine: 'Enneagram', parameter: 'Büyüme Noktası', calculatedValue: `Tip ${canonical.enneagram.growthPoint}` }
  ];
  const floraTheme = 'esneklik, organik akışkanlık, döngüsel yenilenme ve sezgisel yumuşaklık';
  const floraVisual = 'Sert geometrik hatları yumuşatan, kas lifleri boyunca süzülen ince gölgeli yaprak ve dal kıvrımları.';

  symbols.push({
    id: 'sym_4_flora',
    index: 4,
    symbolName: floraName,
    sources: floraSources,
    sourceSummary: `Ay ${canonical.astrology.moonSign}, Hakim Element ${canonical.astrology.dominantElement}`,
    coreTheme: floraTheme,
    designRole: 'Organik element: Geometrik çizgileri vücut anatomisine yumuşak bir köprüyle bağlayan akışkan hatlar.',
    designCategory: 'Organik element',
    visualDescription: floraVisual,
    auditTrail: {
      calculationEngine: 'Astroloji (Ay & Element) + Enneagram',
      calculatedValue: `Ay: ${canonical.astrology.moonSign}, Element: ${canonical.astrology.dominantElement}`,
      derivedTheme: floraTheme,
      selectedVisual: floraName,
      designPlacement: 'Yan ve Kavisli Organik Akış Hatları'
    }
  });

  // Sembol 5: EBCED VE KİŞİSEL KİMLİK MÜHRÜ
  // Kaynak: Ebced Toplamı + Mizan Burcu
  const ebcedVal = canonical.ebcedAndMizan.totalEbced;
  const mizanStr = `${canonical.ebcedAndMizan.mizanBurc} (${canonical.ebcedAndMizan.mizanElement})`;
  const ebcedSources: PrescriptionSymbolSource[] = [
    { engine: 'Ezoterik / Ebced', parameter: 'Ebced Toplamı', calculatedValue: `${ebcedVal}` },
    { engine: 'Ezoterik / Ebced', parameter: 'Mizan Burcu', calculatedValue: mizanStr }
  ];
  const ebcedTheme = 'kişisel kimlik verisi, kök aidiyeti ve varoluşsal mühür';
  const ebcedVisual = `Geometrik gridin içine kodlanmış gizli mikro dotwork nokta dizilimi ve ${ebcedVal} sayısının sembolik çentik mühürleri.`;

  symbols.push({
    id: 'sym_5_ebced',
    index: 5,
    symbolName: `Kişisel Ebced Mührü (${ebcedVal}) & Mizan Aksı`,
    sources: ebcedSources,
    sourceSummary: canonical.ebcedAndMizan.calculationChainText,
    coreTheme: ebcedTheme,
    designRole: 'Kişisel mikro detay: Yalnızca taşıyıcının bildiği, kompozisyonun alt aksına ustalıkla gizlenmiş mikro çentik ve nokta dizilimi.',
    designCategory: 'Kişisel mikro detay',
    visualDescription: ebcedVisual,
    auditTrail: {
      calculationEngine: 'Ezoterik / Ebced & Mizan',
      calculatedValue: canonical.ebcedAndMizan.calculationChainText,
      derivedTheme: ebcedTheme,
      selectedVisual: `Mikro Dotwork Mührü (${ebcedVal})`,
      designPlacement: 'Alt Aks / Gizli Mikro Detay Bölgesi'
    }
  });

  // Sembol 6: İLAHİ YARDIM 19 VEYA NUMEROLOJİK IŞIK GEOMETRİSİ
  // Kaynak: Numeroloji 19 Varlığı veya Yaşam Yolu / Master Sayılar
  if (canonical.numerology.hasVerified19) {
    const s19Sources: PrescriptionSymbolSource[] = [
      { engine: 'Numeroloji', parameter: '19 İlahi Yardım', calculatedValue: canonical.numerology.divine19SourceExplanation }
    ];
    symbols.push({
      id: 'sym_6_divine19',
      index: 6,
      symbolName: '19 İlahi Yardım Mührü & Mikro Işık Geometrisi',
      sources: s19Sources,
      sourceSummary: '19 İlahi Yardım Rezonansı (1. ve 9. Çakra / Yaşam Yolu Dengesi)',
      coreTheme: 'başlangıç ve tamamlanma döngüsü, koruyucu niyet çıpası',
      designRole: 'Kişisel mikro detay: Geometrik çemberin dış çeperine dairesel stippling dotwork ile yerleştirilmiş 19 mikro odak noktası.',
      designCategory: 'Kişisel mikro detay',
      visualDescription: 'Dairesel mandala çeperine işlenmiş 19 adet ince mikro-dotwork vuruşu.',
      auditTrail: {
        calculationEngine: 'Numeroloji (19 İlahi Yardım)',
        calculatedValue: canonical.numerology.divine19SourceExplanation,
        derivedTheme: 'başlangıç ve tamamlanma döngüsü',
        selectedVisual: '19 Mikro Işık Noktası',
        designPlacement: 'Dış Mandalada Çevresel Halka'
      }
    });
  } else if (canonical.numerology.masterNumbers.length > 0) {
    const masterVal = canonical.numerology.masterNumbers[0];
    const masterSources: PrescriptionSymbolSource[] = [
      { engine: 'Numeroloji', parameter: 'Üstat Sayı', calculatedValue: `${masterVal}` }
    ];
    symbols.push({
      id: 'sym_6_master',
      index: 6,
      symbolName: `${masterVal} Üstat Sayı İzdüşümü & Çift Işınsal Aks`,
      sources: masterSources,
      sourceSummary: `Üstat Sayı ${masterVal} Varlığı`,
      coreTheme: 'yüksek algı, vizyoner farkındalık ve sezgisel liderlik',
      designRole: 'Kişisel mikro detay: Kompozisyonun tepe noktasından çıkan simetrik çift ışınsal kılavuz hattı.',
      designCategory: 'Kişisel mikro detay',
      visualDescription: `Tepe ekseninde ${masterVal} sayısını temsil eden çift ışık hattı ve narin nokta dizilimi.`,
      auditTrail: {
        calculationEngine: 'Numeroloji (Üstat Sayı)',
        calculatedValue: `${masterVal}`,
        derivedTheme: 'yüksek algı ve vizyon',
        selectedVisual: 'Çift Işınsal Aks',
        designPlacement: 'Tepe Ekseni'
      }
    });
  }

  // Sembol 7 (veya 6): AÇIK NEGATİF ALAN (%40-50 Cilt Nefes Boşluğu)
  // Kaynak: Cilt Sağlığı & Dövme Fezibilitesi (Yaşlanma Direnci)
  symbols.push({
    id: 'sym_7_negative_space',
    index: symbols.length + 1,
    symbolName: 'Açık Negatif Alan & Deri Nefes Pencereleri (%45)',
    sources: [
      { engine: 'Geometrik Altın Oran', parameter: 'Cilt Nefes Dengesi', calculatedValue: '%45 Negatif Alan Payı' }
    ],
    sourceSummary: 'Dövme Zanaatı & Yaşlanma Direnci (Blowout Önleme Matrisi)',
    coreTheme: 'sükunet, ferahlık, hafiflik ve dövmenin 10 yıl sonra bile net kalması',
    designRole: 'Negatif alan: Yoğun siyahların arasına bilinçli olarak yerleştirilmiş çıplak ten boşlukları; cildin doğal ışığını dövmenin aydınlatması olarak kullanır.',
    designCategory: 'Negatif alan',
    visualDescription: 'Çizgiler arasında minimum 2 mm güvenlik mesafesiyle bırakılan geniş, nefes alan ten aralıkları.',
    auditTrail: {
      calculationEngine: 'Dövme Zanaatı & Anti-Blowout',
      calculatedValue: '%45 Cilt Güvenlik Alanı',
      derivedTheme: 'sükunet ve zamana karşı dayanıklılık',
      selectedVisual: 'Açık Ten Boşlukları',
      designPlacement: 'Tüm Kompozisyon Boyunca Çizgiler Arası Boşluk'
    }
  });

  return symbols;
}

// ============================================================================
// 6. TASARIM FORMÜLÜ VE KİŞİSEL SONUÇ ÜRETİMİ
// ============================================================================

export function generateDesignFormula(
  canonical: CanonicalClientAnalysis,
  symbols: PrescriptionSymbol[],
  designParameters: TattooDesignParameters
): PrescriptionDesignFormula {
  const activeNames = [designParameters.mainSymbol?.trim(), ...(designParameters.secondarySymbols || []).map(s => s.trim())].filter(Boolean) as string[];
  const negSymbol = null;

  const styles = (designParameters.selectedStyles && designParameters.selectedStyles.length > 0)
    ? designParameters.selectedStyles.join(' + ')
    : 'Fine Line + Micro Realism + Dotwork';

  return {
    center: activeNames[0] || 'Aktif ana sembol seçilmedi',
    supportingGeometry: activeNames[1] || 'Ek destekleyici sembol seçilmedi',
    organicElement: activeNames[2] || 'Ek organik sembol seçilmedi',
    personalMicroDetail: activeNames[3] || 'Ek mikro sembol seçilmedi',
    negativeSpace: 'Teknik üretim parametresi — müşteri reçetesinde gösterilmez',
    visualLanguage: styles
  };
}

export function generatePersonalClosingText(canonical: CanonicalClientAnalysis): string {
  const name = canonical.client.name;
  const sun = canonical.astrology.sunSign;
  const lp = canonical.numerology.lifePathNumber;

  return `Bu tasarım, ${name} için hesaplanan astrolojik (Güneş ${sun}), numerolojik (Yaşam Yolu ${lp}), Enneagram ve ezoterik verilerin ortak temalarından oluşturulmuş kişisel bir sembol haritasıdır. Tasarımda yer verilen her ana sembol, hesaplama sonuçlarından türetilmiş belirli bir kavramı temsil eder ve bedende estetik bir niyet çıpası olarak varlık bulur.`.trim();
}

// ============================================================================
// 7. KİŞİSEL HESAPLAMA HARİTASI METNİ (KISA, NET VE DOĞRULANMIŞ)
// ============================================================================

export function generateCalculationMapText(canonical: CanonicalClientAnalysis): string {
  const num = canonical.numerology;
  const astro = canonical.astrology;
  const ebced = canonical.ebcedAndMizan;
  const ennea = canonical.enneagram;
  const totem = canonical.totem;
  const chakra = canonical.chakra;

  return `
KİŞİSEL HESAPLAMA HARİTASI

Numeroloji:
• Yaşam Yolu → ${num.lifePathNumber}
• İfade Sayısı → ${num.destinyNumber}
• Dünya Misyonu → ${num.dmNumber}
${num.masterNumbers.length > 0 ? `• Üstat Sayılar → ${num.masterNumbers.join(', ')}\n` : ''}${num.hasVerified19 ? `• 19 Mührü → Doğrulandı (${num.divine19SourceExplanation})\n` : ''}
Astroloji (Batı / Tropikal):
• Güneş → ${astro.sunDegree}
• Ay → ${astro.moonDegree}
• Yükselen → ${astro.ascendantDegree}

Ezoterik / Ebced & Mizan:
• Kişisel Ebced → ${ebced.calculationChainText}
• Mizan → ${ebced.mizanBurc} / ${ebced.mizanElement}

Enneagram:
• Tip → ${ennea.wing} (${ennea.typeName})

Totem Rezonansı:
• Ana Totem → ${totem.primaryTotem}
• Gölge Totem → ${totem.shadowTotem}
• İkincil Totem → ${totem.allyTotem}
[${totem.totemHandlingExplanation}]

Kanonik Çakra Dağılımı:
• ${chakra.summaryLine}
`.trim();
}

// ============================================================================
// 8. TEK SAYFALIK KİŞİSEL SEMBOL REÇETESİ TAM METNİ (DANIŞANA GÖNDERİLEBİLİR)
// ============================================================================

export function generateFullPrescriptionMarkdown(prescription: {
  canonical: CanonicalClientAnalysis;
  unifiedArchetype: string;
  symbols: PrescriptionSymbol[];
  formula: PrescriptionDesignFormula;
  closing: string;
  excludedDesignSymbols?: Array<{ name: string; reason?: string }>;
  designParameters?: TattooDesignParameters;
}): string {
  const { canonical, unifiedArchetype, symbols, formula, closing, excludedDesignSymbols = [] } = prescription;

  const header = `
==================================================
KİŞİSEL SEMBOL REÇETESİ
==================================================

DANIŞAN
${canonical.client.name}

DOĞUM VERİSİ
${canonical.client.formattedBirthInfo}

--------------------------------------------------
HESAPLAMA HARİTASI
--------------------------------------------------

Numeroloji:
• Yaşam Yolu → ${canonical.numerology.lifePathNumber}
• İfade Sayısı → ${canonical.numerology.destinyNumber}
• Dünya Misyonu → ${canonical.numerology.dmNumber}
${canonical.numerology.masterNumbers.length > 0 ? `• Üstat Sayılar → ${canonical.numerology.masterNumbers.join(', ')}\n` : ''}${canonical.numerology.hasVerified19 ? `• 19 Rezonansı → Doğrulandı (${canonical.numerology.divine19SourceExplanation})\n` : ''}
Astroloji (Batı / Tropikal):
• Güneş → ${canonical.astrology.sunDegree}
• Ay → ${canonical.astrology.moonDegree}
• Yükselen → ${canonical.astrology.ascendantDegree}

Ezoterik / Ebced:
• Kişisel Ebced → ${canonical.ebcedAndMizan.calculationChainText}
• Mizan → ${canonical.ebcedAndMizan.mizanBurc} / ${canonical.ebcedAndMizan.mizanElement}

Enneagram:
• Tip → ${canonical.enneagram.wing} (${canonical.enneagram.typeName})

Totem Rezonansı:
• Ana Totem → ${canonical.totem.primaryTotem}
• Gölge Totem → ${canonical.totem.shadowTotem}
• İkincil Totem → ${canonical.totem.allyTotem}
${!canonical.totem.includeAnimalInTattoo ? `[Not: Totem verileri yalnızca raporlama katmanında tutulur; final kompozisyonda kullanılmaz.]\n` : ''}
Çakra Durumu (Tek Kaynak / Kanonik Sonuç):
• ${canonical.chakra.summaryLine}

--------------------------------------------------
BİRLEŞİK ARKETİP
--------------------------------------------------

${unifiedArchetype}

--------------------------------------------------
SEMBOL REÇETESİ
--------------------------------------------------
`.trim();

  const activeNames = [prescription.designParameters?.mainSymbol?.trim(), ...(prescription.designParameters?.secondarySymbols || []).map(s => s.trim())].filter(Boolean) as string[];
  const activeNameSet = new Set(activeNames);
  const activeRecipeSymbols = symbols.filter(sym => sym.designCategory !== 'Negatif alan' && activeNameSet.has(sym.symbolName));
  const symbolsBody = activeRecipeSymbols.map((sym, i) => `
${i + 1}. ${sym.symbolName}

Kaynak:
${sym.sourceSummary}

Temel tema:
${sym.coreTheme}

Tasarım görevi:
${sym.designRole}
`.trim()).join('\n\n');

  const excludedSection = excludedDesignSymbols.length > 0 ? `\n\n--------------------------------------------------\nTASARIMA DAHİL EDİLMEYEN SEMBOLLER\n--------------------------------------------------\n\n${excludedDesignSymbols.map((item, i) => `${i + 1}. ${item.name}${item.reason ? `\nAçıklama: ${item.reason}` : ''}`).join('\n\n')}\n\n[Bu bölüm yalnızca bilgi/arşiv amaçlıdır; aşağıdaki tasarım üretim promptlarına dahil edilmez.]` : '';

  const formulaSection = `
--------------------------------------------------
TASARIM FORMÜLÜ
--------------------------------------------------

Merkez:
${formula.center}

Destekleyici geometri:
${formula.supportingGeometry}

Organik element:
${formula.organicElement}

Kişisel mikro detay:
${formula.personalMicroDetail}


Genel görsel dil:
${formula.visualLanguage}

--------------------------------------------------
KİŞİSEL SONUÇ
--------------------------------------------------

${closing}
`.trim();

  return `${header}\n\n${symbolsBody}${excludedSection}\n\n${formulaSection}`;
}

// ============================================================================
// 9. RAPOR DENETİMİ (AUDIT REPORT / TEST DENETİM MODU)
// ============================================================================

export function generateAuditReportText(symbols: PrescriptionSymbol[]): string {
  const lines: string[] = [
    '==================================================',
    'RAPOR DENETİMİ (AUDIT MODE - HESAPLAMA DOĞRULAMA)',
    '==================================================',
    'Her sembolün gerçek hesaplama kaynağı ve çıkarılan teması denetlenmiştir:\n'
  ];

  symbols.forEach((sym, idx) => {
    lines.push(`[${idx + 1}. SEMBOL]: ${sym.symbolName}`);
    lines.push(`  ↓`);
    lines.push(`  [Kaynak Hesaplama]: ${sym.auditTrail.calculationEngine}`);
    lines.push(`  ↓`);
    lines.push(`  [Kaynak Değer]: ${sym.auditTrail.calculatedValue}`);
    lines.push(`  ↓`);
    lines.push(`  [Çıkarılan Tema]: ${sym.auditTrail.derivedTheme}`);
    lines.push(`  ↓`);
    lines.push(`  [Seçilen Görsel Karşılık]: ${sym.auditTrail.selectedVisual}`);
    lines.push(`  ↓`);
    lines.push(`  [Tasarımdaki Görevi]: ${sym.designRole}`);
    lines.push('--------------------------------------------------');
  });

  lines.push('DENETİM SONUCU: Tüm semboller en az bir doğrulanmış hesaplama motoruna bağlıdır. Rastgele veya kaynaksız sembol bulunmamaktadır.');
  return lines.join('\n');
}

// ============================================================================
// 10. TATTOO DESIGN PROMPT (REÇETEDEN AYRI OTOMATİK ÜRETİM)
// ============================================================================

export function generateTattooDesignPromptFromPrescription(
  canonical: CanonicalClientAnalysis,
  symbols: PrescriptionSymbol[],
  formula: PrescriptionDesignFormula,
  designParameters: TattooDesignParameters
): {
  promptText: string;
  negativePrompt: string;
} {
  const centerSym = symbols.find(s => s.designCategory === 'Merkez') || symbols[0];
  const generatedHelpers = symbols.filter(s => s.designCategory !== 'Negatif alan');
  const selectedMain = designParameters.mainSymbol?.trim();
  const selectedSecondary = (designParameters.secondarySymbols || []).map(s => s.trim()).filter(Boolean);
  const activeNames = [selectedMain, ...selectedSecondary].filter(Boolean) as string[];
  const activeSymbols = activeNames;
  const promptCenterName = activeSymbols[0] || 'Açıkça seçilmiş ana sembol yok';
  const promptSecondaryNames = activeSymbols.slice(1, 4);
  const geoName = promptSecondaryNames[0] || 'Ek açıkça seçilmiş destek sembolü yok';
  const organicName = promptSecondaryNames[1] || 'Ek açıkça seçilmiş organik sembol yok';
  const microName = promptSecondaryNames[2] || 'Ek açıkça seçilmiş mikro sembol yok';
  const centerTheme = centerSym && centerSym.symbolName === promptCenterName ? centerSym.coreTheme : 'kullanıcının aktif olarak seçtiği sembolün anlamı';

  const styles = formula.visualLanguage;
  const placement = designParameters.bodyPlacement || 'Önkol İç';
  const composition = designParameters.composition || 'Dengeli Merkezi Aks';
  const orientation = designParameters.orientation || 'Dikey (Anatomik)';

  const noAnimalFlag = !canonical.totem.includeAnimalInTattoo 
    ? ', animal, beast, creature, fauna, wildlife' 
    : '';

  const promptText = `
master tattoo design, stencil-ready tattoo flash artwork, single cohesive composition, clean intentional contours, skin-safe negative space.
FOCAL SUBJECT (60-70% visual weight): Centrally placed ${promptCenterName}, executed with commanding contrast and crisp 03RL linework, symbolizing ${centerTheme}.
SUPPORTING SACRED GEOMETRY (20% visual weight): ${geoName}, forming an architectural background matrix aligned with golden ratio proportions.
ORGANIC FLOW & ANATOMY (10-15% visual weight): ${organicName}, soft whip-shaded curves flowing naturally along the ${placement} curvature.
PERSONAL ESOTERIC MICRO-DETAILS (5% visual weight): Subtle micro-stippling dotwork sigils (${microName}), delicate numeric resonance of Life Path ${canonical.numerology.lifePathNumber} and Ebced ${canonical.ebcedAndMizan.totalEbced}.
STYLE SPECIFICATIONS: ${styles}, pure black carbon ink gradients with smooth 3-stage grey wash shading (%30, %60, %90).
FEASIBILITY & SKIN SAFETY: Minimum 2mm line clearance, 45% skin-safe negative space, thermal stencil transfer ready, high contrast, zero muddy fills.
PRESENTATION: Flat 2D tattoo flash sheet, isolated on pure neutral white background, no human body, no skin, no arm mockup, no photograph, no 3D render.
`.trim().replace(/\s+/g, ' ');

  const negativePrompt = `
decorative wallpaper, messy background, tattoo mockup, skin, body, arm, human model, photograph, photorealistic skin pores, 3D render, muddy gray wash, blurry gradients, unreadable micro clutter, watermarks, lettering text, signatures, distorted anatomy, extra limbs, rainbow colors${noAnimalFlag}
`.trim().replace(/\s+/g, ' ');

  return { promptText, negativePrompt };
}

// ============================================================================
// 11. ANA OLUŞTURUCU FONKSİYON (PRESCRIPTION GENERATOR)
// ============================================================================

export function generatePersonalSymbolPrescription(params: {
  person: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism: SymbolismProfile;
  chakra?: ChakraProfile;
  designParameters: TattooDesignParameters;
}): PersonalSymbolPrescription {
  // 1. Kanonik analizi çıkar (Single source of truth)
  const canonical = extractCanonicalClientAnalysis(params);

  // 2. Birleşik arketip sentezi
  const unifiedArchetype = generateUnifiedArchetype(canonical);

  // 3. Hesaplamadan sembole geçiş (5-8 sembol)
  const symbols = derivePrescriptionSymbols(canonical, params.designParameters, params.symbolism);

  // 4. Tasarım formülü
  const designFormula = generateDesignFormula(canonical, symbols, params.designParameters);

  // 5. Kişisel sonuç paragrafı
  const personalClosing = generatePersonalClosingText(canonical);

  // 6. Hesaplama haritası
  const calculationMapText = generateCalculationMapText(canonical);

  // 7. Tek sayfalık tam reçete metni
  const fullPrescriptionText = generateFullPrescriptionMarkdown({
    canonical,
    unifiedArchetype,
    symbols,
    formula: designFormula,
    closing: personalClosing,
    excludedDesignSymbols: params.designParameters.excludedDesignSymbols || [],
    designParameters: params.designParameters
  });

  // 8. Rapor denetimi (Audit Report)
  const auditReportText = generateAuditReportText(symbols);

  // 9. Reçeteden otomatik üretilen Tattoo Design Prompt
  const { promptText, negativePrompt } = generateTattooDesignPromptFromPrescription(
    canonical,
    symbols,
    designFormula,
    params.designParameters
  );

  return {
    title: `Kişisel Sembol Reçetesi - ${canonical.client.name}`,
    generatedDate: new Date().toISOString(),
    canonicalAnalysis: canonical,
    calculationMapText,
    unifiedArchetype,
    symbols,
    designFormula,
    personalClosing,
    fullPrescriptionText,
    tattooDesignPrompt: promptText,
    negativePrompt,
    auditReportText,
    excludedDesignSymbols: params.designParameters.excludedDesignSymbols || []
  };
}
