import { ChakraProfile } from './utils/chakra';
import type { PersonalSymbolPrescription, CanonicalClientAnalysis, PrescriptionSymbol } from './utils/personalSymbolPrescription';
export type { ChakraProfile, PersonalSymbolPrescription, CanonicalClientAnalysis, PrescriptionSymbol };

export interface PersonData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthPlace?: string;
  birthCity?: string;
  birthRegion?: string;
  birthCountry?: string;
  birthCountryCode?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  birthTimezone?: string;
  birthTimezoneOffset?: number;
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
  status?: 'new' | 'in_progress' | 'completed' | string;
  source?: 'client_form' | 'manual' | string;
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
  coreType?: number; // alias for type
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
  id?: string;
  role: 'Birincil Ruh Totemi' | 'Gölge & Muhafız Totemi' | 'Yükseliş & Ruhsal Müttefik';
  name: string;
  origin: string; // e.g. "Yaşam Yolu 7 + Güneş Akrep + Enneagram 4w5"
  meaning: string;
  archetypalPower: string;
  visualRoleInTattoo: string;
  profile?: any;
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
  totemAnimalId?: string;
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
  enneagramShadowTraits?: string[];
  enneagramShadowSymbolicMeaning?: string;
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
  symbolicIntegration?: SymbolicIntegrationModelResult;
  prescription?: PersonalSymbolPrescription;
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

// ============================================================================
// SEMBOL ENTEGRASYON MODELİ (SYMBOL INTEGRATION ENGINE) VERİ YAPILARI
// ============================================================================

export type SymbolSourceType = 
  | 'CALCULATED'           // Gerçek hesaplama sonucu (Numeroloji, Astroloji, Enneagram, Ebced)
  | 'TRADITIONAL'          // Tarihsel/kültürel olarak tescilli kadim sembol (Lotus, Metatron, Yaşam Çiçeği vb.)
  | 'TOTEM_DERIVED'        // Totem hayvanının anatomik/çizgisel soyutlamasından türetilmiş motif
  | 'VISUAL_ABSTRACTION'   // Kişisel değerlerin geometrik/stilize soyutlaması
  | 'MODEL_GENERATED';     // Sembolleri birbirine kilitlemek için üretilen ortak bağlayıcı geometri

export type SymbolPriority = 'PRIMARY' | 'SECONDARY' | 'HIDDEN' | 'ACCENT' | 'SUBTLE_FILL';

export type IntegrationType = 
  | 'INTERLOCKED'          // İç içe geçmiş kenetlenen geometri
  | 'NESTED'               // Birbiri içine yerleşmiş hiyerarşik form
  | 'OVERLAPPED'           // Kesişim alanı ortaklaşan katman
  | 'SHARED_LINE'          // Tek bir çizginin iki sembolü birden çizmesi (Ortak Çizgi)
  | 'NEGATIVE_SPACE'       // İki sembolün arasındaki boşluğun üçüncü bir sembolü oluşturması
  | 'CONTINUOUS_LINE'      // Kesintisiz tek hat boyunca akan bağlantı
  | 'HYBRID';              // Çoklu entegrasyon yöntemi

export interface SymbolRegistryItem {
  symbolId: string;
  symbolName: string;
  symbolCategory: string; // 'Numeroloji' | 'Astroloji' | 'Enneagram' | 'Totem' | 'Çakra' | 'Flora' | 'Kutsal Geometri' | 'Ezoterik'
  sourceCategory?: string; // alias for symbolCategory
  sourceType: SymbolSourceType;
  sourceAnalysis: string; // e.g. 'Numeroloji Yaşam Yolu 7', 'Güneş Boğa Burcu', 'Enneagram 4w5'
  sourceValue: string;
  semanticMeaning: string;
  visualMeaning: string;
  priority: SymbolPriority;
  confidence: number; // 0 - 100
  required: boolean;
  selected: boolean;
  basisOrOrigin?: string; // Belgelenebilir kültürel kaynak veya 'AI-derived visual abstraction'
}

export interface SymbolVisualTranslation {
  symbolId: string;
  symbolName: string;
  visualForm: string; // e.g. 'Işınsal taç yaprak geometrisi ve kesişim yayları'
  geometryType: 'geometric' | 'organic' | 'calligraphic' | 'hybrid' | 'radial';
  lineStyle: '03RL ultra-fine' | 'continuous single-line' | 'whip-shaded' | 'dotwork-stippled';
  scale: 'focal' | 'medium' | 'micro';
  orientation: string;
  complexity: 'minimal' | 'balanced' | 'intricate';
  abstractionLevel: 'direct' | 'stylized' | 'anatomical_abstraction' | 'geometric_abstraction';
  visualDescription: string;
  sharedStrokePotential: string;
  negativeSpacePotential: string;
}

export interface SymbolIntegrationLink {
  integrationId: string;
  symbolIds: string[];
  integrationType: IntegrationType;
  sharedLinesDescription: string;
  overlappingRegions: string;
  nestedSymbols: string[];
  negativeSpaceRole: string;
  continuousPathDetails: string;
  primarySymbolId: string;
  secondarySymbolIds: string[];
  hiddenSymbolIds: string[];
  rationale: string;
}

export interface IntegratedDesignGeometry {
  compositionType: 'RADIAL' | 'VERTICAL' | 'HORIZONTAL' | 'ORGANIC' | 'GEOMETRIC' | 'HYBRID';
  symmetry: 'Bilateral' | 'Radial' | 'Dynamic Asymmetric' | 'Chiral';
  balance: string;
  flow: string;
  density: string;
  focalPoint: string;
  negativeSpaceRatio: string;
  lineWeight: string;
  scale: string;
  orientation: string;
  bodyPlacement: string;
}

export interface SymbolLocationMapItem {
  symbolId: string;
  symbolName: string;
  region: string; // e.g. 'Merkez Kutsal Odak', 'Üst Işınsal Hale', 'Omurga Hattı', 'Negatif Boşluk Silueti'
  x: number; // 0.0 - 1.0 (Normalize Koordinat)
  y: number; // 0.0 - 1.0 (Normalize Koordinat)
  width: number; // 0.0 - 1.0
  height: number; // 0.0 - 1.0
  rotation: number; // derece cinsinden
  visibility: 'Belirgin' | 'İncelikli' | 'Gizli Negatif Alan';
  layer: SymbolPriority;
  highlightColor: string; // e.g. '#a855f7' Mor, '#10b981' Yeşil, '#f59e0b' Kehribar vb.
  highlightPathSvg?: string; // İnteraktif vurgulama için SVG path/polyline verisi
  interactiveSvgSnippet?: string;
}

export interface SymbolMapDeconstructionLayer {
  symbolId: string;
  symbolName: string;
  role: SymbolPriority;
  color: string;
  source: string;
  semanticMeaning: string;
  visualForm: string;
  locationInDesign: string;
  integrationMethod: string;
  confidence: number;
  svgElementIds: string[];
  explanationText: string;
}

export interface SymbolMapDeconstruction {
  totalLayers: number;
  primaryCount: number;
  secondaryCount: number;
  hiddenCount: number;
  sharedStrokesCount: number;
  layers: SymbolMapDeconstructionLayer[];
}

export interface SymbolTraceabilityItem {
  tattooElement: string;
  symbolId: string;
  sourceAnalysis: string; // e.g. 'Numeroloji'
  sourceValue: string; // e.g. 'Yaşam Yolu 7'
  whySelected: string;
  howTransformed: string;
  wherePlaced: string;
  isDerivedOrTraditional: SymbolSourceType;
}

export interface SymbolIntegrationValidationCheck {
  name: string;
  passed: boolean;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

export interface SymbolIntegrationValidation {
  status: 'VALID' | 'WARNING' | 'ERROR';
  score: number; // 0 - 100
  checks: SymbolIntegrationValidationCheck[];
  totalRequiredSymbols: number;
  integratedSymbolsCount: number;
  hasSharedStrokes: boolean;
  hasNegativeSpaceUse: boolean;
  isTattooFeasible: boolean;
}

export interface TotemVisualProfile {
  animalId: string;
  animalName: string;
  turkishName: string;
  element: string;
  directRepresentationGuide: string;
  anatomicalAbstraction: {
    keyFeatures: string[]; // e.g. ['Keskin kulak açısı', 'Çene çizgisi', 'Göz odak hattı']
    simplifiedVectorDescription: string;
  };
  geometricAbstraction: {
    coreShapes: string[]; // e.g. ['Açılı üçgen düzlemler', 'Dinamik yönlü chevron hatları']
    symmetryType: string;
  };
  traditionalSymbolicAssociations: {
    hasAuthenticTraditional: boolean;
    traditionalSymbols: string[];
    basisOrOrigin: string; // Geleneksel kültür / dayanak ya da 'AI-derived visual abstraction'
  };
  patternLanguage: string; // e.g. '03RL kürk ritmi, kesintili çizgi akışı'
  lineLanguage: string; // e.g. 'Keskin, kararlı, dinamik konik kontur'
  repetitionMotifs: string[];
  symmetryAsymmetry: string;
  negativeSpacePotentials: string[]; // e.g. ['İki lotus yaprağının arasında oluşan kulak silueti']
  tattooFriendlyAbstraction: string;
}

export interface SymbolicIntegrationModelResult {
  version: {
    analysisVersion: string;
    symbolVersion: string;
    integrationVersion: string;
    designVersion: string;
  };
  user: {
    name: string;
    birthDate: string;
    birthPlace?: string;
  };
  analysis: {
    lifePathNumber: number;
    destinyNumber: number;
    sunSign: string;
    moonSign: string;
    ascendantSign: string;
    dominantElement: string;
    enneagramType: number;
    enneagramWing: string;
    primaryTotem: string;
    shadowTotem: string;
    chakraDeficiencies: string[];
  };
  symbols: SymbolRegistryItem[];
  visualTranslations: SymbolVisualTranslation[];
  integrations: SymbolIntegrationLink[];
  designGeometry: IntegratedDesignGeometry;
  symbolMap: SymbolLocationMapItem[];
  deconstruction: SymbolMapDeconstruction;
  traceability: SymbolTraceabilityItem[];
  validation: SymbolIntegrationValidation;
  svgUnifiedVectorPreview: string; // Saf tekil siyah dövme vektörü
  svgDeconstructedVectorPreview: string; // Çok renkli interaktif sembol katmanları
  masterIntegratedAiPrompt: string; // Bütünsel prompt (ayrı çıkartmalar/ikonlar yerine tek kompozisyon)
}
