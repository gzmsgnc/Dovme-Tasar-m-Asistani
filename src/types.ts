import { ChakraProfile } from './utils/chakra';

export interface PersonData {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthPlace?: string;
  motherName?: string; // Anne Adı (Ebced & Yıldızname ezoterik hesabı için)
  zodiacSystem?: 'Tropical' | 'Sidereal';
  enneagramType?: number; // 1-9 if known or tested
  enneagramWing?: string; // e.g. "4w5"
  enneagramAnswers?: Record<number, number>; // Enneagram test yanıtları
  totemAnswers?: Record<number, string>; // Davranışsal Totem test yanıtları (Soru ID -> Seçenek ID)
  totemVector?: Record<string, number>; // 20 Boyutlu Davranışsal Vektör
  primaryTotemId?: string;
  secondaryTotemId?: string;
  shadowTotemId?: string;
  totemConfidenceScore?: number;
  existingTotems?: string; // Mevcut Totem Hayvanları
  existingSymbols?: string; // Mevcut Semboller
  personalNumbers?: string; // Kişisel Olarak Önemli Sayılar
  personalStory?: string; // Kişisel Hikâye / Temalar
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumerologyDetail {
  value: number | string;
  title: string;
  formula: string;
  stepByStep: string | string[];
  interpretation: string;
}

export interface NumerologyProfile {
  lifePathNumber: number; // Yaşam Yolu
  lifePathTitle: string;
  destinyNumber: number; // Ana Kulvar / İfade
  destinyTitle: string;
  soulUrgeNumber: number; // Yan Kulvar / Kalp Arzusu (Sesli harfler)
  soulUrgeTitle: string;
  personalityNumber: number; // Dış İmaj / Sessiz harfler
  personalityTitle: string;
  dmNumber: number; // DM - Dünya Misyonu / Denge Sayısı
  dmTitle: string;
  chakraCounts: Record<number, number>; // 1-9 çakra dağılımı
  missingNumbers: number[]; // Eksik Sayılar / Karmik Borçlar (0 çakra)
  masterNumbers: number[]; // 11, 22, 33 varlığı
  divineHelp19: {
    has19: boolean;
    reason: string;
    level: string; // Çok Yüksek, Yüksek, Belirgin, Potansiyel, Yok
    formulaBreakdown: string;
  };
  personalYear: number;
  personalYearTheme: string;
  pinnacleNumbers: number[];
  challengeNumbers: number[];
  coreKeywords: string[];
  
  // Step-by-step calculation transparency
  calculationDetails: {
    lifePath: NumerologyDetail;
    destiny: NumerologyDetail;
    soulUrge: NumerologyDetail;
    personality: NumerologyDetail;
    dm: NumerologyDetail;
    missingNumbers: NumerologyDetail;
    masterNumbers: NumerologyDetail;
    divine19: NumerologyDetail;
    personalYear: NumerologyDetail;
    pinnaclesAndChallenges: NumerologyDetail;
  };
}

export interface AstrologyProfile {
  zodiacSystem: 'Tropical' | 'Sidereal';
  sunSign: string;
  sunSignSymbol: string;
  sunSignElement: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  sunSignModality: 'Öncü' | 'Sabit' | 'Değişken';
  sunLongitude: number;
  sunDegreeFormatted: string;
  rulingPlanet: string;
  
  moonSign: string;
  moonSignSymbol: string;
  moonLongitude: number;
  moonDegreeFormatted: string;
  isMoonNearCusp: boolean;
  moonCuspMessage?: string;

  ascendantSign: string;
  ascendantSignSymbol: string;
  ascendantLongitude: number;
  ascendantDegreeFormatted: string;
  isAscendantEstimated: boolean; // True if birth time not specified
  ascendantWarning?: string;

  ayanamsaName?: string;
  ayanamsaDegrees?: number;

  usedBirthDate: string;
  usedBirthTime: string;
  usedBirthPlace: string;
  dominantElement: string;
  archetype: string;
  keywords: string[];
  summary: string;

  astronomicalDetails?: {
    julianDay: number;
    utTime: string;
    localSiderealTime: string;
    greenwichMeanSiderealTime: string;
    latitude: number;
    longitude: number;
    timezoneOffsetHours: number;
    obliquity: number;
    ayanamsaDegrees?: number;
  };
}

export interface EnneagramProfile {
  type: number; // 1-9
  typeName: string;
  wing: string; // e.g. "4w5"
  coreMotivation: string;
  coreFear: string;
  strengths: string[];
  shadowTraits: string[];
  stressPoint: number;
  growthPoint: number;
  symbolicMeaning: string;
  isDeterminedByTest?: boolean;
}

export interface EnneagramQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    type: number;
    description: string;
  }[];
}

export interface TotemAnimalDetail {
  role: 'Birincil Ruh Totemi' | 'Gölge & Muhafız Totemi' | 'Yükseliş & Ruhsal Müttefik';
  name: string;
  origin: string; // e.g. "Yaşam Yolu 7 + Güneş Akrep + Enneagram 4w5"
  meaning: string;
  archetypalPower: string;
  visualRoleInTattoo: string;
}

export interface NeededSymbolDetail {
  symbolName: string;
  category: 'Çakra Şifası' | 'Element Dengeleyici' | 'Karmik Borç Giderici' | 'Astrolojik Koruyucu';
  targetDeficiency: string; // e.g. "Eksik 4. Çakra (Kalp) ve Toprak Elementi Eksikliği"
  esotericRationale: string;
  compositionPlacement: string;
}

export interface SymbolismProfile {
  totemAnimal: string;
  totemAnimalMeaning: string;
  totemHierarchy: TotemAnimalDetail[]; // 3'lü Ruhani Totem Hiyerarşisi
  neededSymbols: NeededSymbolDetail[]; // Kişinin Haritasına Göre İhtiyaç Duyduğu Semboller
  secondaryAnimals: string[];
  plantFlora: string;
  plantFloraMeaning: string;
  element: string;
  elementMeaning: string;
  crystalStone: string;
  crystalStoneMeaning: string;
  mythologicalFigure: string;
  mythologicalFigureMeaning: string;
  sacredObject: string;
  sacredObjectMeaning: string;
  geometricSymbol: string;
  geometricSymbolMeaning: string;
  colorPalette: string[];
  colorThemeDescription: string;
  mainTheme: string;
  emotionalTheme: string;
  characterTraitSymbols: string[];
  
  // Refined Hierarchy & Subtle Details
  subtleDetails: string[];
  symbolInterconnection: string;
  calculatedTotemName?: string;
  calculatedTotemMeaning?: string;
  includeTotemInDesign?: boolean;
  totemTestResult?: {
    primaryTotem: any;
    secondaryTotem: any;
    shadowTotem: any;
    topMatches: Array<{
      animalId: string;
      animalName: string;
      similarityScore: number;
    }>;
    confidenceScore: number;
    isProximityClose: boolean;
    proximityDifference: number;
    crossEnneagramInsight: string;
  };
}

export interface TattooDesignParameters {
  selectedStyles: string[]; // e.g. ['Fine Line', 'Geometric', 'Dotwork']
  composition: string; // e.g. 'Dinamik Asimetrik', 'Merkezi Kutsal Odak', 'Dikey Omurga Akışı'
  orientation: 'Dikey (Anatomik)' | 'Yatay (Dinamik)' | 'Sarmal (Spiral)' | 'Organik Akış';
  bodyPlacement: string; // e.g. 'Önkol İç', 'Sırt (Omurga)', 'Pazu Dış', 'Göğüs / Sternum', 'Kaburga', 'Baldır'
  density: 'Minimal & Boşluklu (%20)' | 'Hafif & Havadar (%40)' | 'Dengeli & Net (%60)' | 'Yoğun & Detaylı (%80)' | 'Maksimalist & Dolu (%95)';
  colorScheme: 'Saf Monokrom Siyah' | 'Black & Grey (Gri Gölgelendirme)' | 'Tekil Vurgu Rengi (Kırmızı/Altın)' | 'Soğuk Çift Ton (Füme & Buz Mavisi)' | 'Zengin Polikrom Renk';
  mainSymbol: string;
  secondarySymbols: string[];
  subtleDetails?: string[];
  visualAtmosphere: string; // e.g. 'Mistik & Ezoterik', 'Karanlık & Melankolik', 'Ruhani & Zarafet Dolu', 'Sert & Keskin'
  customArtistNotes?: string;
  includeTotemInDesign?: boolean; // Totem hayvanı tasarıma dahil edilsin mi? (Varsayılan: false)
  useMorseCodeForNumbers?: boolean; // Rakamları Mors alfabesiyle (nokta/çizgi micro-dotwork) şifrele
  customMorseInput?: string; // İsteğe bağlı özel Mors metni/rakamı
}

export interface SymbolRationale {
  symbolName: string;
  symbolCategory: string;
  esotericConnection: string; // Neden bu numeroloji/astroloji/enneagram ile seçildi
  visualRole: string; // Dövmedeki kompozisyonel görevi
}

export interface TattooFeasibility {
  lineWeight: string; // e.g. 03RL fine line & 07M1 shading
  negativeSpaceRatio: string; // e.g. %40 bare skin
  detailDensity: string; // Düşük, Dengeli, Yüksek
  agingBlowoutRisk: string; // Düşük / Güvenli
  shadingTechnique: string; // Whip Shading & Grey Wash
  anatomicalFlow: string; // Kas lifi ve kemik yapısı uyumu
  recommendedSize: string; // Minimum ve ideal ölçü (cm)
  overallFeasibilityScore: number; // 0 - 100
  summaryEvaluation: string;
}

export interface TattooRecipe {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  createdAt: string;
  personData: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism: SymbolismProfile;
  parameters: TattooDesignParameters;
  
  // Recipe Details
  symbolRationales: SymbolRationale[];
  subtleDetails: string[];
  symbolInterconnection: string;
  compositionGuide: string;
  placementAnatomyNotes: string;
  needleAndTechniqueGuide: string;
  artisticAtmosphereGuide: string;
  feasibility: TattooFeasibility;
  summaryRationale: string;
  
  // AI Prompts
  masterEnglishPrompt: string;
  masterOutlinePrompt?: string;
  masterShadedPrompt?: string;
  fluxPrompt?: string;
  midjourneyPrompt?: string;
  dalle3Prompt?: string;
  stencilPrompt?: string;
  artistSpecSheet?: string;
  turkishPromptExplanation: string;
  negativePrompt: string;
  promptParameters: {
    aspectRatio: string;
    stylizeLevel: string;
    recommendedEngine: string;
  };
  
  chakra?: ChakraProfile;
  morseCodePattern?: {
    rawText: string;
    morseDisplay: string;
    morseStandard: string;
    tattooSpecification: string;
  };
  shadowAnalysis?: ShadowArchetypeAnalysisReport;
  shadowDossierMarkdown?: string;
  generatedSketchUrl?: string;
  userNotes?: string;
}

export interface ShadowArchetypeAnalysisReport {
  section1ClientData: {
    personName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    motherName: string;
    numerologySummary: string;
    astrologySummary: string;
    ebcedSummary: string;
    yildiznameSummary: string;
    existingTotems: string;
    existingSymbols: string;
    personalNumbers: string;
    personalStory: string;
  };
  section2PsychoSymbolic: {
    coreCharacterTheme: string;
    recurringLifeTheme: string;
    suppressedAspect: string;
    shadowAspect: string;
    coreTransformationTheme: string;
    unbalancedStrength: string;
    unconfrontedSymbolicTheme: string;
    tattooTransformationMessage: string;
  };
  section3EnneagramShadow: {
    type: number;
    wing: string;
    typeName: string;
    coreMotivation: string;
    coreFear: string;
    defenseMechanism: string;
    stressShadowBehavior: string;
    suppressedNeed: string;
    controlledArea: string;
    shadowArchetypalExpression: string;
    balancedTransformedState: string;
    visualTranslation: {
      figure: string;
      facialExpressionGaze: string;
      bodyMovementLanguage: string;
      position: string;
      geometricEquivalent: string;
      organicSymbolEquivalent: string;
      compositionLocation: string;
      relationToMainSymbol: string;
      psychologicalShadowPortrayal: string;
    };
  };
  section4TotemAnimals: Array<{
    name: string;
    role: string;
    mainTotemSymbolism: string;
    strongSide: string;
    protectiveSide: string;
    instinctiveSide: string;
    shadowSide: string;
    unbalancedBehavior: string;
    suppressedUncontrolledTrait: string;
    tattooPhysicalFeature: string;
    gazeDirection: string;
    headAngle: string;
    movementDetail: string;
    posture: string;
    compositionRole: string;
  }>;
  section5ChakraBlockages: Array<{
    chakraNumber: number;
    chakraName: string;
    coreTheme: string;
    symbolicBlockageMeaning: string;
    behavioralManifestation: string;
    geometricEquivalent: string;
    naturalSymbol: string;
    animalFigureConnection: string;
    colorEquivalent: string;
    monochromeEquivalent: string;
    designPlacementSection: string;
    healingTransformationSymbol: string;
  }>;
  section6Intersection: {
    enneagramShadowChakraIntersection: string;
    totemShadowChakraIntersection: string;
    recurringSharedTheme: string;
    strongestShadowMotif: string;
    strongestTransformationMotif: string;
    supportingSymbols: string[];
    eliminatedRedundantSymbols: string[];
  };
  section7VisualDictionary: Array<{
    symbol: string;
    source: string;
    meaning: string;
    shadowOrTransformation: string;
    visualRole: string;
    category: string;
  }>;
  section8MainConcept: {
    mainSymbol: string;
    secondarySymbols: string[];
    shadowSymbol: string;
    totemAnimal: string;
    chakraSymbols: string[];
    hiddenEsotericDetails: string[];
    geometricInfrastructure: string;
    compositionDirection: string;
    visualHierarchy: {
      primaryFocusPercent: string;
      secondaryPercent: string;
      microDetailsPercent: string;
    };
    negativeSpaceUsage: string;
    focalPoint: string;
    eyeMovementPath: string;
  };
  section9CompositionArchitecture: {
    axisOrientation: string;
    symmetryType: string;
    balanceType: string;
    mainFigureDirection: string;
    secondaryFiguresPlacement: string;
    negativeSpaceLocations: string;
    geometricFramework: string;
    topSection: string;
    centerSection: string;
    bottomSection: string;
    microDetailsPlacement: string;
  };
  section10EsotericMicroDetails: Array<{
    type: string;
    name: string;
    detail: string;
    rationale: string;
  }>;
  section11TattooArtistBrief: string;
  section12Prompts: {
    midjourneyMasterPrompt: string;
    dalle3Prompt: string;
    fluxPrompt: string;
    stencilPrompt: string;
    negativePrompt: string;
    parametersExplanation: string;
  };
  sectionClientExplanation: ClientExplanationSection;
  fullMarkdownDossier: string;
}

export interface ClientSymbolExplanationItem {
  symbolName: string;
  category: string;
  meaning: string;
  reason: string;
  benefitsAndHealing: string;
  visualRepresentation: string;
}

export interface ClientExplanationSection {
  clientName: string;
  greetingAndIntro: string;
  holisticTalismanTheme: string;
  symbols: ClientSymbolExplanationItem[];
  dailyAffirmationAndIntegration: string;
  fullClientLetterText: string;
  consultationSummaryText?: string;
  attachmentsText?: string; // Parçalar ve Ek Dosyalar
}

export interface SymbolLibraryItem {
  id: string;
  name: string;
  category: 'Hayvan' | 'Bitki/Çiçek' | 'Geometri' | 'Mitoloji' | 'Element' | 'Doğal Taş' | 'Kutsal Obje' | 'Kozmik';
  meaning: string;
  numerologyConnection: string;
  astrologyConnection: string;
  enneagramConnection: string;
  visualKeywords: string[];
  iconType?: string;
}

export interface StyleLibraryItem {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  recommendedNeedles: string;
  bestBodyPlacements: string[];
  compatibleStyles: string[];
  promptKeywords: string[];
  complexityRating: number; // 1-5
  visualTag: string;
}
