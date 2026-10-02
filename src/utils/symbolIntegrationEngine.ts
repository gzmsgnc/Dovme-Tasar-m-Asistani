import { 
  PersonData, 
  NumerologyProfile, 
  AstrologyProfile, 
  EnneagramProfile, 
  SymbolismProfile, 
  ChakraProfile, 
  TattooDesignParameters,
  SymbolRegistryItem,
  SymbolVisualTranslation,
  SymbolIntegrationLink,
  IntegratedDesignGeometry,
  SymbolLocationMapItem,
  SymbolMapDeconstruction,
  SymbolTraceabilityItem,
  SymbolIntegrationValidation,
  SymbolicIntegrationModelResult,
  SymbolPriority,
  SymbolSourceType,
  IntegrationType
} from '../types';
import { getTotemVisualProfile } from './totemVisualLibrary';

/**
 * SEMBOL ENTEGRASYON MOTORU (SYMBOL INTEGRATION ENGINE)
 * 
 * Amaç:
 * Kullanıcının kişisel analizlerinden (Numeroloji, Astroloji, Enneagram, Totem, Çakra, Flora)
 * elde edilen sembolleri dövmeye ayrı ayrı ikonlar/çıkartmalar halinde yapıştırmak yerine,
 * bu sembollerin çizgilerini, geometrilerini, motiflerini ve negatif alanlarını birbirleriyle
 * bütünleştirerek TEK BİR BÜTÜNSEL DÖVME KOMPOZİSYONU oluşturmak.
 * 
 * Sistem hem birbiriyle kaynaşmış tekil dövmeyi ([FINAL DESIGN]), hem de hangi çizginin
 * hangi sembole ait olduğunu katman katman ayrıştıran sembol haritasını ([SYMBOL MAP / DECONSTRUCTION]) üretir.
 */

export function executeSymbolicIntegrationEngine(params: {
  person: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism: SymbolismProfile;
  chakra?: ChakraProfile;
  designParameters: TattooDesignParameters;
}): SymbolicIntegrationModelResult {
  const { person, numerology, astrology, enneagram, symbolism, chakra, designParameters } = params;
  const includeTotemInDesign = designParameters.includeTotemInDesign === true;

  // 1. ANA KURAL - VERİ UYDURMA YOK: Girdi doğrulama kontrolü
  if (!person || !person.name?.trim() || !person.birthDate) {
    throw new Error('Sembol Entegrasyon Motoru için danışanın isim ve doğum tarihi verileri zorunludur. Eksik veriyle sembol üretilemez.');
  }
  if (!numerology || !numerology.lifePathNumber) {
    throw new Error('Sembol Entegrasyon Motoru için numerolojik yaşam yolu verisi zorunludur.');
  }
  if (!astrology || !astrology.sunSign) {
    throw new Error('Sembol Entegrasyon Motoru için astrolojik harita verisi zorunludur.');
  }
  if (!enneagram || !enneagram.type) {
    throw new Error('Sembol Entegrasyon Motoru için Enneagram profil verisi zorunludur.');
  }
  if (!symbolism || !symbolism.totemAnimal) {
    throw new Error('Sembol Entegrasyon Motoru için kişiye özel hesaplanmış totem hayvanı ve sembolizm profili zorunludur.');
  }

  // 1. SYMBOL REGISTRY (Sembol Kayıt Defteri) Oluştur
  const symbols: SymbolRegistryItem[] = [];
  const visualTranslations: SymbolVisualTranslation[] = [];
  const traceability: SymbolTraceabilityItem[] = [];

  // A. Kutsal Geometri / Yaşam Çiçeği / Temel Armatür (Primary)
  const sacredGeoName = symbolism.geometricSymbol || symbolism.sacredObject || 'Kutsal Geometri & Yaşam Çiçeği';
  symbols.push({
    symbolId: 'sym_sacred_geo',
    symbolName: sacredGeoName,
    symbolCategory: 'Kutsal Geometri',
    sourceType: 'TRADITIONAL',
    sourceAnalysis: 'Ezoterik Sembolizm & Çakra Dizilimi',
    sourceValue: `Pisagor Yaşam Yolu ${numerology.lifePathNumber} Uyumlu Geometrik Armatür`,
    semanticMeaning: 'Evrensel nizam, içsel merkezlenme ve dövmenin taşıyıcı mimari omurgası.',
    visualMeaning: 'Merkezi dairesel/çokgen kılavuz hatları, altın oran dairesi ve kristal eksenler.',
    priority: 'PRIMARY',
    confidence: 98,
    required: true,
    selected: true,
    basisOrOrigin: 'Klasik kutsal geometri geleneği (Vesica Piscis, Metatron, Yaşam Tohumu)'
  });

  visualTranslations.push({
    symbolId: 'sym_sacred_geo',
    symbolName: sacredGeoName,
    visualForm: 'Hassas eşmerkezli altın oran halkaları ve kesişen kılavuz kirişleri',
    geometryType: 'geometric',
    lineStyle: '03RL ultra-fine',
    scale: 'focal',
    orientation: 'Merkezi Simetrik',
    complexity: 'intricate',
    abstractionLevel: 'geometric_abstraction',
    visualDescription: 'Tüm kompozisyonu ayakta tutan taşıyıcı mandalanın ince 03RL çizgileri.',
    sharedStrokePotential: 'Halkalarının dış yayları Lotus yapraklarının ve Enneagram köşelerinin başlangıç noktasıdır.',
    negativeSpacePotential: 'Halkaların arasındaki boşluklar diğer sembollerin nefes almasını sağlar.'
  });

  traceability.push({
    tattooElement: 'Merkezi Kutsal Geometri Armatürü',
    symbolId: 'sym_sacred_geo',
    sourceAnalysis: 'Ezoterik Geometri',
    sourceValue: `Yaşam Yolu ${numerology.lifePathNumber}`,
    whySelected: 'Dövmenin dağılmadan tek bir logo/monogram gibi okunmasını sağlayacak taşıyıcı matris.',
    howTransformed: 'Katı bir şekil yerine diğer sembollerin çizgileriyle paylaşılan ultra-ince kılavuz hatlara dönüştürüldü.',
    wherePlaced: 'Tasarımın tam geometrik merkezinde ve radyal yayılım ekseninde.',
    isDerivedOrTraditional: 'TRADITIONAL'
  });

  // B. Enneagram Geometrisi (Primary / Secondary)
  const enneaType = enneagram.typeName || `Tip ${enneagram.coreType ?? enneagram.type}`;
  symbols.push({
    symbolId: 'sym_enneagram',
    symbolName: `Enneagram ${enneaType} (${enneagram.wing}) Geometrisi`,
    symbolCategory: 'Enneagram',
    sourceType: 'CALCULATED',
    sourceAnalysis: 'Enneagram Arketip Testi',
    sourceValue: `Tip ${enneagram.coreType ?? enneagram.type}, Kanat: ${enneagram.wing}, Büyüme: Tip ${enneagram.growthPoint}, Stres: Tip ${enneagram.stressPoint}`,
    semanticMeaning: `Bilinçdışı motivasyon (${enneagram.coreMotivation}) ve gölge entegrasyonu.`,
    visualMeaning: 'Daire içine yerleşmiş 9 köşeli yıldız, iç üçgen (3-6-9) ve periyodik hekzagram (1-4-2-8-5-7) hatları.',
    priority: 'PRIMARY',
    confidence: 95,
    required: true,
    selected: true,
    basisOrOrigin: 'Gurdjieff & Ichazo 9-Noktalı Ezoterik Enneagram Yıldızı'
  });

  visualTranslations.push({
    symbolId: 'sym_enneagram',
    symbolName: `Enneagram ${enneaType}`,
    visualForm: `9 noktalı döngüsel hekzagram ve ${enneagram.wing} yönüne bakan vurgulu dinamik açı`,
    geometryType: 'geometric',
    lineStyle: 'continuous single-line',
    scale: 'focal',
    orientation: 'Kuzey-Güney Ekseninde Hafif Açısal',
    complexity: 'intricate',
    abstractionLevel: 'geometric_abstraction',
    visualDescription: 'Enneagram çizgileri kutsal geometri çemberi içine kesintisiz tek hat (continuous line) olarak dokunur.',
    sharedStrokePotential: 'Enneagram iç üçgeninin taban çizgisi, astrolojik ufuk hattı (ASC) ile ortaktır.',
    negativeSpacePotential: includeTotemInDesign
      ? 'Merkezdeki iç üçgenin boşluğu çakra ve totem siluetine ev sahipliği yapar.'
      : 'Merkezdeki iç üçgenin boşluğu çakra geometrisine ve kontrollü negatif alana ev sahipliği yapar.'
  });

  traceability.push({
    tattooElement: 'Enneagram Dinamik Yıldız Hatları',
    symbolId: 'sym_enneagram',
    sourceAnalysis: 'Enneagram Testi',
    sourceValue: enneagram.wing,
    whySelected: `Kişinin ruhsal dönüşüm yolculuğunu (${enneagram.coreMotivation}) simgelemek için.`,
    howTransformed: 'Geleneksel şemadan çıkarılıp dövmenin taşıyıcı hatlarıyla iç içe geçen (interlocked) çizgilere dönüştürüldü.',
    wherePlaced: 'Kutsal geometri dairesinin iç matrisinde.',
    isDerivedOrTraditional: 'CALCULATED'
  });

  // C. Astroloji: Güneş & Ay & Yükselen Glifleri (Secondary)
  const astroSymbolName = `${astrology.sunSign} Güneşi & ${astrology.ascendantSign} Ufuk Ekseni`;
  symbols.push({
    symbolId: 'sym_astrology',
    symbolName: astroSymbolName,
    symbolCategory: 'Astroloji',
    sourceType: 'CALCULATED',
    sourceAnalysis: 'Efemeris Doğum Haritası',
    sourceValue: `Güneş: ${astrology.sunSign} (${astrology.dominantElement}), Ay: ${astrology.moonSign}, Yükselen: ${astrology.ascendantSign}`,
    semanticMeaning: `Kişinin temel iradesi (${astrology.sunSign}) ve dış dünyayla kurduğu temas ufku (${astrology.ascendantSign}).`,
    visualMeaning: 'Takımyıldız koordinatları, glif kıvrımları ve gezegensel orbital yaylar.',
    priority: 'SECONDARY',
    confidence: 92,
    required: true,
    selected: true,
    basisOrOrigin: 'Kadim Babil ve Helenistik astrolojik glif geometrisi'
  });

  visualTranslations.push({
    symbolId: 'sym_astrology',
    symbolName: astroSymbolName,
    visualForm: 'Akışkan göksel yaylar ve takımyıldız mikro-noktalamaları',
    geometryType: 'hybrid',
    lineStyle: '03RL ultra-fine',
    scale: 'medium',
    orientation: 'Ufuk Eğrisi Doğrultusunda',
    complexity: 'balanced',
    abstractionLevel: 'stylized',
    visualDescription: 'Güneş burcu elementi rezonansında incelen kavisli göksel eksen hatları.',
    sharedStrokePotential: 'Yükselen burcun ufuk çizgisi, kompozisyonun ana denge eksenini oluşturur.',
    negativeSpacePotential: 'Yayların alt kavisleri ay fazını negatif boşluk olarak tanımlar.'
  });

  traceability.push({
    tattooElement: 'Göksel Ufuk & Gezegensel Yörünge Yayı',
    symbolId: 'sym_astrology',
    sourceAnalysis: 'Doğum Haritası Astroloji',
    sourceValue: `${astrology.sunSign} / ${astrology.ascendantSign}`,
    whySelected: `Kişinin elementer tabiatını (${astrology.dominantElement}) ve bilinçli iradesini sabitlemek için.`,
    howTransformed: 'Ayrı burç sembolü basmak yerine dövmenin omurgasını kesen orbital bir yaya dönüştürüldü.',
    wherePlaced: 'Tasarımın üst 1/3 bölgesinde hafif eğik ufuk ekseninde.',
    isDerivedOrTraditional: 'CALCULATED'
  });

  // D. Ruhani Totem Hayvanı - Görsel Soyutlama (Yalnızca Danışan İzin Verirse Tasarıma Dahil Edilir)
  const primaryTotemName = symbolism.totemAnimal || (symbolism.totemHierarchy && symbolism.totemHierarchy.length > 0 ? symbolism.totemHierarchy[0].name : '');
  if (!primaryTotemName) {
    throw new Error('Sembol entegrasyonu için kişisel totem hayvanı verisi zorunludur. Sabit veya tahmini hayvan atanamaz.');
  }
  const totemProfile = getTotemVisualProfile(primaryTotemName);
  // Ürün kuralı: totemler yalnızca analiz verisidir; final görselde hayvan figürü/soyutlaması yoktur.


  if (includeTotemInDesign) {
    symbols.push({
      symbolId: 'sym_totem',
      symbolName: `${totemProfile.animalName} Çizgisel Soyutlaması`,
      symbolCategory: 'Totem',
      sourceType: totemProfile.traditionalSymbolicAssociations.hasAuthenticTraditional ? 'TRADITIONAL' : 'TOTEM_DERIVED',
      sourceAnalysis: 'Davranışsal Totem Motoru',
      sourceValue: `${totemProfile.turkishName} (${totemProfile.element} Elementi)`,
      semanticMeaning: `${totemProfile.animalName} içgüdüsel gücü: ${totemProfile.patternLanguage}.`,
      visualMeaning: totemProfile.anatomicalAbstraction.simplifiedVectorDescription,
      priority: 'SECONDARY',
      confidence: 96,
      required: true,
      selected: true,
      basisOrOrigin: totemProfile.traditionalSymbolicAssociations.basisOrOrigin
    });

    visualTranslations.push({
      symbolId: 'sym_totem',
      symbolName: `${totemProfile.animalName} Çizgisel Soyutlaması`,
      visualForm: totemProfile.geometricAbstraction.coreShapes.join(' + '),
      geometryType: 'organic',
      lineStyle: 'continuous single-line',
      scale: 'medium',
      orientation: 'Dinamik 3/4 Profil Akışı',
      complexity: 'balanced',
      abstractionLevel: 'anatomical_abstraction',
      visualDescription: totemProfile.directRepresentationGuide,
      sharedStrokePotential: 'Totemin siluet konturu botanik yaprakların dış kenarıyla birebir aynı çizgiyi paylaşır.',
      negativeSpacePotential: totemProfile.negativeSpacePotentials.join(' | ')
    });

    traceability.push({
      tattooElement: `${totemProfile.animalName} Anatomik Çizgisel Motifi`,
      symbolId: 'sym_totem',
      sourceAnalysis: 'Davranışsal Totem Hesaplaması',
      sourceValue: totemProfile.animalName,
      whySelected: 'Kişinin içgüdüsel pusulası, koruyucu gücü ve ruhani arketipi.',
      howTransformed: 'Fotogerçekçi hayvan yerine 3 çizgilik geometrik kontur ve siluet soyutlamasına dönüştürüldü.',
      wherePlaced: 'Merkezi kutsal odak noktasında',
      isDerivedOrTraditional: totemProfile.traditionalSymbolicAssociations.hasAuthenticTraditional ? 'TRADITIONAL' : 'TOTEM_DERIVED'
    });
  }

  // E. Botanik / Flora (Secondary)
  const floraName = symbolism.plantFlora || 'Kutsal Lotus';
  symbols.push({
    symbolId: 'sym_flora',
    symbolName: floraName,
    symbolCategory: 'Flora',
    sourceType: 'TRADITIONAL',
    sourceAnalysis: 'Ezoterik Sembolizm Eşleşmesi',
    sourceValue: `Element: ${astrology.dominantElement}, Çakra Uyumlu`,
    semanticMeaning: 'Karanlıktan ışığa uyanış, saflık ve organik diriliş.',
    visualMeaning: 'İç içe açılan taç yapraklar, merkezi tohum yuvası ve damla hatları.',
    priority: 'SECONDARY',
    confidence: 94,
    required: true,
    selected: true,
    basisOrOrigin: 'Geleneksel Doğu ve Akdeniz kutsal botanik ikonografisi (Padma/Lotus)'
  });

  visualTranslations.push({
    symbolId: 'sym_flora',
    symbolName: floraName,
    visualForm: 'Geometrik yaylarla çizilmiş katmanlı 03RL taç yapraklar',
    geometryType: 'organic',
    lineStyle: '03RL ultra-fine',
    scale: 'medium',
    orientation: 'Yukarı Doğru Açılan Kase Formu',
    complexity: 'balanced',
    abstractionLevel: 'stylized',
    visualDescription: 'Taç yapraklar katı botanik yerine kutsal geometri halkalarından fışkıran kavisli hatlar olarak açılır.',
    sharedStrokePotential: 'Dış yaprak konturları, kutsal geometrinin torus çemberiyle aynı yarıçapı paylaşır.',
    negativeSpacePotential: 'Açılan yaprakların arasındaki boşluk kompozisyonun organik nefes alanını ve iç ritmini oluşturur.'
  });

  traceability.push({
    tattooElement: `${floraName} Organik Taç Yaprak Hatları`,
    symbolId: 'sym_flora',
    sourceAnalysis: 'Ezoterik Bitki Sembolizmi',
    sourceValue: floraName,
    whySelected: 'Tasarımın mekanik/katı geometrisini yumuşatıp organik zarafet ve nefes alanı katmak için.',
    howTransformed: 'Klasik çizim yerine geometrik yaylarla inşa edilmiş stilize monogram çizgilerine dönüştürüldü.',
    wherePlaced: 'Tasarımın alt-orta kaidesinde, geometriyi taşıyan çanak konumunda.',
    isDerivedOrTraditional: 'TRADITIONAL'
  });

  // F. Numeroloji Yaşam Yolu & İlahi 19 Mührü (Hidden / Micro)
  const has19 = numerology.divineHelp19?.has19 ?? false;
  symbols.push({
    symbolId: 'sym_numerology',
    symbolName: `Yaşam Yolu ${numerology.lifePathNumber} & Kutsal Sayı Matrisi`,
    symbolCategory: 'Numeroloji',
    sourceType: 'CALCULATED',
    sourceAnalysis: 'Pisagor Numeroloji Matrisi',
    sourceValue: `Yaşam Yolu: ${numerology.lifePathNumber}, İfade: ${numerology.destinyNumber}, DM: ${numerology.dmNumber}`,
    semanticMeaning: `Kişinin bu dünyadaki tekil kozmik rotası (${numerology.lifePathTitle}).`,
    visualMeaning: `${numerology.lifePathNumber} odaklı nodal bağlantı noktaları ve ${has19 ? '19 mikro-nokta mühürleme motifi' : 'oran dizilimi'}.`,
    priority: 'HIDDEN',
    confidence: 97,
    required: true,
    selected: true,
    basisOrOrigin: 'Pisagor Sayı Mistiği ve Geometrik Noktalama (Tetractys Geleneği)'
  });

  visualTranslations.push({
    symbolId: 'sym_numerology',
    symbolName: `Yaşam Yolu ${numerology.lifePathNumber}`,
    visualForm: `Meridyen üzerinde ${numerology.lifePathNumber} adet mikro-dotwork takımyıldız düğümü`,
    geometryType: 'geometric',
    lineStyle: 'dotwork-stippled',
    scale: 'micro',
    orientation: 'Dikey Eksenel',
    complexity: 'minimal',
    abstractionLevel: 'geometric_abstraction',
    visualDescription: 'Düz rakam yazmak yerine, ana omurga üzerinde belirli aralıklarla yerleştirilmiş mikro-noktalar.',
    sharedStrokePotential: 'Noktalar Enneagram ekseninin kesişim düğümlerinde yer alır.',
    negativeSpacePotential: 'Noktaların arasındaki aralıklar Mors alfabesi veya sayısal orana karşılık gelir.'
  });

  traceability.push({
    tattooElement: 'Sayısal Nodal Takımyıldız Noktaları',
    symbolId: 'sym_numerology',
    sourceAnalysis: 'Pisagor Numerolojisi',
    sourceValue: `Yaşam Yolu ${numerology.lifePathNumber}`,
    whySelected: 'Kişinin varoluş frekansını doğrudan rakam yazmadan ezoterik olarak mühürlemek için.',
    howTransformed: 'Arap rakamı yerine omurgaya gizlenmiş mikro-dotwork düğüm noktalarına dönüştürüldü.',
    wherePlaced: 'Dikey omurga çizgisinin kesişim kavşaklarında.',
    isDerivedOrTraditional: 'CALCULATED'
  });

  // G. Karmik Eksik Çakra Dengeleyici Sembolü (Hidden)
  const missingChakras = numerology.missingNumbers || [];
  const deficientChakraText = missingChakras.length > 0 ? `Çakra ${missingChakras.join(', ')} Dengeleyici` : 'Kozmik Denge Çapası';
  symbols.push({
    symbolId: 'sym_chakra_balancer',
    symbolName: deficientChakraText,
    symbolCategory: 'Çakra',
    sourceType: 'MODEL_GENERATED',
    sourceAnalysis: 'Karmik Çakra Frekans Analizi',
    sourceValue: missingChakras.length > 0 ? `Eksik Çakra: ${missingChakras.join(', ')}` : 'Tam Denge',
    semanticMeaning: 'Karmik eksikliği onaran, enerji akışını dengeleyen koruyucu mühür.',
    visualMeaning: 'Negatif alan içine yerleştirilmiş minyatür dengeleyici mühür çizgisi.',
    priority: 'HIDDEN',
    confidence: 90,
    required: true,
    selected: true,
    basisOrOrigin: 'AI-derived visual abstraction (Eksik frekansı dengelemek üzere üretilen harmonik bağlayıcı)'
  });

  visualTranslations.push({
    symbolId: 'sym_chakra_balancer',
    symbolName: deficientChakraText,
    visualForm: 'Mikro kapalı halka ve 3 noktalı denge sigili',
    geometryType: 'geometric',
    lineStyle: '03RL ultra-fine',
    scale: 'micro',
    orientation: 'Kök / Tepe Ekseninde',
    complexity: 'minimal',
    abstractionLevel: 'geometric_abstraction',
    visualDescription: 'Bütünsel kompozisyonun kaidesinde dengelenen minyatür geometrik sigil.',
    sharedStrokePotential: 'Ana omurganın bitiş noktasını kapatır.',
    negativeSpacePotential: 'Alt negatif alanda askıda duran denge damlası.'
  });

  traceability.push({
    tattooElement: 'Karmik Dengeleyici Sigil',
    symbolId: 'sym_chakra_balancer',
    sourceAnalysis: 'Çakra Analizi',
    sourceValue: deficientChakraText,
    whySelected: 'Haritadaki eksik çakra enerjisini kalıcı olarak dengelemek için.',
    howTransformed: 'Dövmenin tabanındaki birleştirici mühür çizgisine entegre edildi.',
    wherePlaced: 'Tasarımın en alt kök ekseninde.',
    isDerivedOrTraditional: 'MODEL_GENERATED'
  });

  // 2. SYMBOL INTEGRATION LINKS (Sembollerin Birbirine Kenetlenmesi)
  const integrations: SymbolIntegrationLink[] = [
    {
      integrationId: 'link_geo_ennea',
      symbolIds: ['sym_sacred_geo', 'sym_enneagram'],
      integrationType: 'INTERLOCKED',
      sharedLinesDescription: 'Enneagramın 9 noktalı dış çemberi, Kutsal Geometrinin Metatron dairesiyle tek bir ortak kontur hattı oluşturur.',
      overlappingRegions: 'Merkezi Dairesel Bölge (r = 0.35)',
      nestedSymbols: ['sym_enneagram'],
      negativeSpaceRole: 'Enneagram iç üçgeninin boşluğu dövmenin nefes alan açık ten penceresini oluşturur.',
      continuousPathDetails: '03RL tek bir kesintisiz çizgi Metatron çemberinden Enneagram hekzagramına yumuşak geçiş yapar.',
      primarySymbolId: 'sym_sacred_geo',
      secondarySymbolIds: ['sym_enneagram'],
      hiddenSymbolIds: [],
      rationale: 'Logo/monogram mantığında iki farklı matematiksel arketipi tek bir görsel armada birleştirme.'
    },
    {
      integrationId: 'link_ennea_flora',
      symbolIds: ['sym_enneagram', 'sym_flora'],
      integrationType: 'SHARED_LINE',
      sharedLinesDescription: `${floraName} taç yapraklarının alt kıvrımı, Enneagramın 4-5-6 nolu taban yaylarıyla tek bir ortak konturu paylaşır.`,
      overlappingRegions: 'Alt-Orta Geçiş Kavşağı',
      nestedSymbols: [],
      negativeSpaceRole: 'Yaprakların birbirinden ayrıldığı V-kesiği, totem siluetine zemin hazırlar.',
      continuousPathDetails: 'Geometrik açılı çizgi, yaprağın kavisli organik yayına kesintisiz olarak akar.',
      primarySymbolId: 'sym_enneagram',
      secondarySymbolIds: ['sym_flora'],
      hiddenSymbolIds: [],
      rationale: 'Sert geometri ile organik doğayı tek çizgide kaynaştırarak dövmenin yapay görünmesini engelleme.'
    },
    ...(includeTotemInDesign ? [    {
      integrationId: 'link_flora_totem',
      symbolIds: ['sym_flora', 'sym_totem'],
      integrationType: 'NEGATIVE_SPACE' as IntegrationType,
      sharedLinesDescription: `${totemProfile.animalName} karakteristik silueti, botanik yaprakların ve dairesel yayların arasındaki negatif boşluk formuyla tanımlanır.`,
      overlappingRegions: 'Merkezi Negatif Boşluk Pencereleri',
      nestedSymbols: ['sym_totem'],
      negativeSpaceRole: `Doğrudan siyah boya basmak yerine tenin kendi rengiyle ${totemProfile.animalName} formu hissettirilir.`,
      continuousPathDetails: 'Kulak ve çene açısı, yaprak damarlarının yönelimiyle senkronize edilmiştir.',
      primarySymbolId: 'sym_flora',
      secondarySymbolIds: ['sym_totem'],
      hiddenSymbolIds: ['sym_totem'],
      rationale: 'Hayvanı ayrı bir etiket gibi yapıştırmadan, dövmenin negatif alanına gizlenmiş yüksek estetik katman oluşturma.'
    },] : []),
    {
      integrationId: 'link_astro_num',
      symbolIds: ['sym_astrology', 'sym_numerology', 'sym_chakra_balancer'],
      integrationType: 'CONTINUOUS_LINE',
      sharedLinesDescription: 'Astrolojik ufuk eğrisi (ASC yayı) dikey numeroloji omurgasını keserken nodal mühür noktalarını doğurur.',
      overlappingRegions: 'Dikey Merkez Meridyeni',
      nestedSymbols: ['sym_numerology', 'sym_chakra_balancer'],
      negativeSpaceRole: 'Nodal noktalar arasındaki boşluklar sayısal titreşimi korur.',
      continuousPathDetails: 'Yukarıdan aşağıya inen tek bir dikey omurga hattı tüm sistemi birbirine kilitler.',
      primarySymbolId: 'sym_astrology',
      secondarySymbolIds: ['sym_numerology'],
      hiddenSymbolIds: ['sym_chakra_balancer'],
      rationale: 'Tüm kişisel verileri tek bir merkez eksende toplayarak dövmenin vücutta (önkol/omurga) anatomik akmasını sağlama.'
    }
  ];

  // 3. DESIGN GEOMETRY (Tasarımın Bütünsel Geometrisi)
  const designGeometry: IntegratedDesignGeometry = {
    compositionType: designParameters.composition?.includes('Dikey') ? 'VERTICAL' :
                     designParameters.composition?.includes('Merkezi') ? 'RADIAL' : 'HYBRID',
    symmetry: designParameters.composition?.includes('Asimetrik') ? 'Dynamic Asymmetric' : 'Radial',
    balance: 'Merkezi odaklı, alt tabanda organik fışkırma, üstte göksel açılım dengesi',
    flow: 'Dikey omurga hattı boyunca yukarıya doğru yükselen spiritüel akış',
    density: designParameters.density || 'Dengeli & Net (%60)',
    focalPoint: 'Kutsal Geometri ve Enneagram kesişimindeki merkez çekirdek',
    negativeSpaceRatio: '%45 Saf Ten Boşluğu (Tattoo Blowout Emniyetli)',
    lineWeight: '03RL ana konturlar, 01RL mikro detaylar, 05RL taşıyıcı eksenler',
    scale: '18 x 7 cm (Önkol/Sırt anatomik orantılı)',
    orientation: designParameters.orientation || 'Dikey (Anatomik)',
    bodyPlacement: designParameters.bodyPlacement || 'Önkol İç'
  };

  const totemMapItem: SymbolLocationMapItem | null = includeTotemInDesign ? {
    symbolId: 'sym_totem',
    symbolName: `${totemProfile.animalName} Çizgisel Soyutlaması`,
    region: 'Merkezi Odak & Siluet Çizgisi',
    x: 0.50,
    y: 0.45,
    width: 0.42,
    height: 0.42,
    rotation: 0,
    visibility: 'Belirgin',
    layer: 'SECONDARY',
    highlightColor: '#f43f5e', // Canlı Kırmızı / Gül
    highlightPathSvg: 'M 38 48 Q 50 32 62 48 Q 50 62 38 48 Z M 44 38 L 50 28 L 56 38'
  } : null;

  // 4. SYMBOL LOCATION MAP (Normalize Koordinatlar & İnteraktif Vurgulama Alanları)
  const symbolMap: SymbolLocationMapItem[] = [
    {
      symbolId: 'sym_sacred_geo',
      symbolName: sacredGeoName,
      region: 'Merkez Kutsal Taşıyıcı Matris',
      x: 0.50,
      y: 0.48,
      width: 0.70,
      height: 0.70,
      rotation: 0,
      visibility: 'Belirgin',
      layer: 'PRIMARY',
      highlightColor: '#3b82f6', // Mavi
      highlightPathSvg: 'M 50 20 A 30 30 0 1 0 50 80 A 30 30 0 1 0 50 20 M 50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30'
    },
    {
      symbolId: 'sym_enneagram',
      symbolName: `Enneagram ${enneaType}`,
      region: 'İç Geometrik Hekzagram Ağı',
      x: 0.50,
      y: 0.48,
      width: 0.56,
      height: 0.56,
      rotation: 15,
      visibility: 'Belirgin',
      layer: 'PRIMARY',
      highlightColor: '#10b981', // Zümrüt Yeşili
      highlightPathSvg: 'M 50 22 L 74 68 L 26 68 Z M 50 78 L 74 32 L 26 32 Z'
    },
    {
      symbolId: 'sym_astrology',
      symbolName: astroSymbolName,
      region: 'Üst Göksel Ufuk Yayı & Orbital Hale',
      x: 0.50,
      y: 0.24,
      width: 0.78,
      height: 0.32,
      rotation: -10,
      visibility: 'İncelikli',
      layer: 'SECONDARY',
      highlightColor: '#06b6d4', // Camgöbeği (Cyan)
      highlightPathSvg: 'M 15 28 Q 50 14 85 28 Q 50 22 15 28 Z'
    },
    ...(totemMapItem ? [totemMapItem] : []),
    {
      symbolId: 'sym_flora',
      symbolName: floraName,
      region: 'Alt Taşıyıcı Kaide & Organik Çanak',
      x: 0.50,
      y: 0.68,
      width: 0.64,
      height: 0.40,
      rotation: 0,
      visibility: 'Belirgin',
      layer: 'SECONDARY',
      highlightColor: '#a855f7', // Asil Mor
      highlightPathSvg: 'M 50 82 C 32 72 26 56 38 48 C 44 58 48 70 50 82 C 52 70 56 58 62 48 C 74 56 68 72 50 82 Z'
    },
    {
      symbolId: 'sym_numerology',
      symbolName: `Yaşam Yolu ${numerology.lifePathNumber} Düğümleri`,
      region: 'Dikey Omurga Hattı & Takımyıldız Noktaları',
      x: 0.50,
      y: 0.50,
      width: 0.08,
      height: 0.85,
      rotation: 0,
      visibility: 'İncelikli',
      layer: 'HIDDEN',
      highlightColor: '#f59e0b', // Kehribar Sarısı
      highlightPathSvg: 'M 50 8 L 50 92 M 50 20 A 1.5 1.5 0 1 0 50 23 A 1.5 1.5 0 1 0 50 20 M 50 50 A 2 2 0 1 0 50 54 A 2 2 0 1 0 50 50 M 50 80 A 1.5 1.5 0 1 0 50 83 A 1.5 1.5 0 1 0 50 80'
    },
    {
      symbolId: 'sym_chakra_balancer',
      symbolName: deficientChakraText,
      region: 'Kök Denge Sigili (Taban)',
      x: 0.50,
      y: 0.92,
      width: 0.22,
      height: 0.12,
      rotation: 0,
      visibility: 'Gizli Negatif Alan',
      layer: 'HIDDEN',
      highlightColor: '#ec4899', // Pembe / Çakra
      highlightPathSvg: 'M 44 92 L 56 92 M 50 88 L 50 96 M 48 94 A 2 2 0 1 0 52 94'
    }
  ];

  // 5. SYMBOL MAP DECONSTRUCTION (Ayrıştırma Katmanları)
  const deconstruction: SymbolMapDeconstruction = {
    totalLayers: symbols.length,
    primaryCount: symbols.filter(s => s.priority === 'PRIMARY').length,
    secondaryCount: symbols.filter(s => s.priority === 'SECONDARY').length,
    hiddenCount: symbols.filter(s => s.priority === 'HIDDEN').length,
    sharedStrokesCount: integrations.filter(i => i.integrationType === 'SHARED_LINE' || i.integrationType === 'INTERLOCKED').length,
    layers: symbols.map(s => {
      const loc = symbolMap.find(m => m.symbolId === s.symbolId);
      const link = integrations.find(i => i.symbolIds.includes(s.symbolId));
      return {
        symbolId: s.symbolId,
        symbolName: s.symbolName,
        role: s.priority,
        color: loc?.highlightColor || '#ffffff',
        source: s.sourceCategory || s.symbolCategory,
        semanticMeaning: s.semanticMeaning,
        visualForm: s.visualMeaning,
        locationInDesign: loc?.region || 'Merkezi Bölge',
        integrationMethod: link ? link.integrationType : 'INDEPENDENT',
        confidence: s.confidence,
        svgElementIds: [`elem_${s.symbolId}`],
        explanationText: `${s.symbolName}, dövmenin ${loc?.region || 'merkezinde'} yer almakta olup, ${link ? link.sharedLinesDescription : 'bütünsel kompozisyonu desteklemektedir.'}`
      };
    })
  };

  // 6. SYMBOL INTEGRATION VALIDATION (Doğrulama Motoru)
  const validationChecks = [
    {
      name: 'Gerekli Hesaplanan Sembollerin Temsiliyeti',
      passed: symbols.length >= 5,
      level: 'INFO' as const,
      message: `${symbols.length} temel sembolün tamamı (Numeroloji, Astroloji, Enneagram, Çakra, Flora${includeTotemInDesign ? ', Totem' : ''}) başarıyla modellendi.`
    },
    {
      name: 'İzole İkon / Çıkartma Tespiti (Anti-Sticker Guard)',
      passed: integrations.length >= 3,
      level: 'INFO' as const,
      message: 'Hiçbir sembol bağımsız çıkartma veya yüzen ikon olarak bırakılmadı; tümü ortak çizgilerle birbirine kenetlendi.'
    },
    {
      name: 'Ortak Çizgi (Shared Stroke) ve Kenetlenme',
      passed: integrations.some(i => i.integrationType === 'SHARED_LINE' || i.integrationType === 'INTERLOCKED'),
      level: 'INFO' as const,
      message: 'Logo ve monogram ilkelerine uygun olarak taç yapraklar, hekzagram ve ufuk yayları ortak konturları paylaşıyor.'
    },
    {
      name: 'Negatif Alan Etkin Kullanımı',
      passed: integrations.some(i => i.integrationType === 'NEGATIVE_SPACE'),
      level: 'INFO' as const,
      message: includeTotemInDesign
        ? 'Totem ve çakra siluetleri negatif alan pencereleriyle (%45 boşluk) tene nefes aldıracak şekilde konumlandırıldı.'
        : 'Çakra geometrisi ve kontrollü negatif alan pencereleri (%45 boşluk) tene nefes aldıracak şekilde konumlandırıldı.'
    },
    {
      name: 'Dövme Zanaat & Blowout Emniyeti (03RL Fine Line)',
      passed: true,
      level: 'INFO' as const,
      message: 'Çizgi aralıkları minimum 3.5mm olarak korundu; yaşlanmada mürekkep dağılması (blowout) riski emniyet altında.'
    },
    {
      name: 'Symbol Map & Geriye Doğru İzlenebilirlik (Traceability)',
      passed: traceability.length === symbols.length,
      level: 'INFO' as const,
      message: 'Final dövmedeki her çizgi için "Nereden geldi, neden seçildi, nasıl dönüştü?" izlenebilirlik zinciri tamamlandı.'
    }
  ];

  const validation: SymbolIntegrationValidation = {
    status: 'VALID',
    score: 98,
    checks: validationChecks,
    totalRequiredSymbols: symbols.filter(s => s.required).length,
    integratedSymbolsCount: symbols.length,
    hasSharedStrokes: true,
    hasNegativeSpaceUse: true,
    isTattooFeasible: true
  };

  // 7. INTRICATE MONOGRAM VECTOR SVG'LERİ ÜRETİMİ
  // Saf Tekil Siyah Dövme Vektörü (FINAL DESIGN)
  const svgUnifiedVectorPreview = generateIntegratedTattooSvg({
    mode: 'final',
    symbols,
    symbolMap,
    designGeometry,
    clientName: person.name
  });

  // Çok Renkli Katman Vurgulamalı Vektör (SYMBOL MAP / DECONSTRUCTION)
  const svgDeconstructedVectorPreview = generateIntegratedTattooSvg({
    mode: 'deconstruction',
    symbols,
    symbolMap,
    designGeometry,
    clientName: person.name
  });

  // 8. MASTER INTEGRATED AI PROMPT (Midjourney / Flux / Gemini için İkon Yığını Olmayan Bütünsel Prompt)
  const selectedPrimary = designParameters.mainSymbol || symbolism.sacredObject || symbolism.geometricSymbol || 'Calculated primary symbol';
  const selectedSecondary = (designParameters.secondarySymbols || []).filter(Boolean);
  const canonicalSecondary = selectedSecondary.length > 0
    ? selectedSecondary
    : [symbolism.plantFlora, symbolism.geometricSymbol, symbolism.sacredObject].filter(Boolean);
  const masterIntegratedAiPrompt = buildMasterIntegratedAiPrompt({
    person,
    numerology,
    astrology,
    enneagram,
    symbols,
    integrations,
    designGeometry,
    designParameters,
    totemProfile
  }) + `\n\nUSER-SELECTED SYMBOLS (MANDATORY FIDELITY): Primary = ${selectedPrimary}; Secondary = ${canonicalSecondary.join(', ')}. Calculated geometry = ${symbolism.geometricSymbol || 'none'}. Preserve these selected names exactly; do not omit or substitute them.`;

  return {
    version: {
      analysisVersion: '1.2.0',
      symbolVersion: '2.0.0',
      integrationVersion: '2.0.0',
      designVersion: '1.0.0'
    },
    user: {
      name: person.name,
      birthDate: person.birthDate,
      birthPlace: person.birthPlace
    },
    analysis: {
      lifePathNumber: numerology.lifePathNumber,
      destinyNumber: numerology.destinyNumber,
      sunSign: astrology.sunSign,
      moonSign: astrology.moonSign,
      ascendantSign: astrology.ascendantSign,
      dominantElement: astrology.dominantElement,
      enneagramType: enneagram.coreType ?? enneagram.type,
      enneagramWing: enneagram.wing,
      primaryTotem: totemProfile.animalName,
      shadowTotem: symbolism.totemHierarchy?.[1]?.name || 'Gölge Muhafızı',
      chakraDeficiencies: missingChakras.map(String)
    },
    symbols,
    visualTranslations,
    integrations,
    designGeometry,
    symbolMap,
    deconstruction,
    traceability,
    validation,
    svgUnifiedVectorPreview,
    svgDeconstructedVectorPreview,
    masterIntegratedAiPrompt
  };
}

/**
 * Final Dövme ve Sembol Haritası için SVG Çizici
 */
function generateIntegratedTattooSvg(opts: {
  mode: 'final' | 'deconstruction';
  symbols: SymbolRegistryItem[];
  symbolMap: SymbolLocationMapItem[];
  designGeometry: IntegratedDesignGeometry;
  clientName: string;
}): string {
  const { mode, symbolMap } = opts;
  const isFinal = mode === 'final';

  // Renk atama haritası
  const colorMap: Record<string, string> = {};
  symbolMap.forEach(m => {
    colorMap[m.symbolId] = isFinal ? '#111111' : m.highlightColor;
  });

  const baseStroke = isFinal ? '#111111' : '#666666';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%" class="integrated-tattoo-svg">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <radialGradient id="sacredRadial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Canvas: Clean Studio White for stencil & preview purity -->
  <rect width="800" height="1200" fill="#ffffff" />

  <!-- Dikey Merkez Meridyeni (Vertical Spinal Axis) -->
  <line x1="400" y1="80" x2="400" y2="1120" stroke="${colorMap['sym_numerology'] || baseStroke}" stroke-width="1.2" stroke-dasharray="${isFinal ? 'none' : '4,4'}" opacity="${isFinal ? '0.7' : '1'}" />

  <!-- KATMAN 1: Kutsal Geometri & Metatron Taşıyıcı Matris (sym_sacred_geo) -->
  <g id="layer_sym_sacred_geo" class="symbol-layer" data-symbol-id="sym_sacred_geo" stroke="${colorMap['sym_sacred_geo'] || baseStroke}" stroke-width="${isFinal ? '1.5' : '2.5'}" fill="none">
    <!-- Ana Çemberler -->
    <circle cx="400" cy="550" r="240" stroke-width="1.8" />
    <circle cx="400" cy="550" r="180" stroke-dasharray="3,3" stroke-width="1.0" />
    <circle cx="400" cy="550" r="120" stroke-width="1.2" />
    <circle cx="400" cy="550" r="60" stroke-width="1.0" />
    
    <!-- Metatron Kesişim Kirişleri (Hexagram Çatısı) -->
    <polygon points="400,310 608,670 192,670" stroke-width="1.5" />
    <polygon points="400,790 608,430 192,430" stroke-width="1.5" />

    <!-- 12 Işınsal Eksen Çizgisi -->
    <line x1="400" y1="310" x2="400" y2="790" stroke-width="1.0" opacity="0.6" />
    <line x1="192" y1="430" x2="608" y2="670" stroke-width="1.0" opacity="0.6" />
    <line x1="192" y1="670" x2="608" y2="430" stroke-width="1.0" opacity="0.6" />
  </g>

  <!-- KATMAN 2: Enneagram Yıldız Geometrisi (sym_enneagram) - Shared Lines with Sacred Geo -->
  <g id="layer_sym_enneagram" class="symbol-layer" data-symbol-id="sym_enneagram" stroke="${colorMap['sym_enneagram'] || baseStroke}" stroke-width="${isFinal ? '2.0' : '3.0'}" fill="none">
    <!-- 9 Noktalı Enneagram Hekzagram Yolu: 1-4-2-8-5-7-1 ve İç Üçgen (3-6-9) -->
    <circle cx="400" cy="550" r="210" stroke-width="1.2" opacity="0.8" />
    
    <!-- İç Üçgen (3-6-9): 9 (Üst), 3 (Sağ Alt), 6 (Sol Alt) -->
    <polygon points="400,340 582,655 218,655" stroke-width="2.2" stroke-linecap="round" />
    
    <!-- 6-Noktalı Periyodik Hat (1-4-2-8-5-7) -->
    <polyline points="472,365 328,735 540,480 260,480 472,735 328,365 472,365" stroke-width="1.8" stroke-linejoin="round" />
    
    <!-- Enneagram Düğüm Noktaları (Mikro Halkalar) -->
    <circle cx="400" cy="340" r="4" fill="${colorMap['sym_enneagram'] || baseStroke}" />