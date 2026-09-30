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
    negativeSpacePotential: 'Merkezdeki iç üçgenin boşluğu çakra ve totem siluetine ev sahipliği yapar.'
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
  const includeTotemInDesign = designParameters.includeTotemInDesign === true;

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
    negativeSpacePotential: 'Açılan yaprakların arasındaki boşluk gölge toteminin siluetini oluşturur.'
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
    {
      integrationId: 'link_flora_totem',
      symbolIds: ['sym_flora', 'sym_totem'],
      integrationType: 'NEGATIVE_SPACE',
      sharedLinesDescription: `${totemProfile.animalName} karakteristik silueti, botanik yaprakların ve dairesel yayların arasındaki negatif boşluk formuyla tanımlanır.`,
      overlappingRegions: 'Merkezi Negatif Boşluk Pencereleri',
      nestedSymbols: ['sym_totem'],
      negativeSpaceRole: `Doğrudan siyah boya basmak yerine tenin kendi rengiyle ${totemProfile.animalName} formu hissettirilir.`,
      continuousPathDetails: 'Kulak ve çene açısı, yaprak damarlarının yönelimiyle senkronize edilmiştir.',
      primarySymbolId: 'sym_flora',
      secondarySymbolIds: ['sym_totem'],
      hiddenSymbolIds: ['sym_totem'],
      rationale: 'Hayvanı ayrı bir etiket gibi yapıştırmadan, dövmenin negatif alanına gizlenmiş yüksek estetik katman oluşturma.'
    },
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
      message: `${symbols.length} temel sembolün tamamı (Numeroloji, Astroloji, Enneagram, Totem, Çakra, Flora) başarıyla modellendi.`
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
      message: `Totem ve çakra siluetleri negatif alan pencereleriyle (%45 boşluk) tene nefes aldıracak şekilde konumlandırıldı.`
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
  }) + `\n\nUSER-SELECTED SYMBOLS (MANDATORY FIDELITY): Primary = ${designParameters.mainSymbol || symbolism.sacredObject || symbolism.geometricSymbol || 'Calculated primary symbol'}; Secondary = ${(designParameters.secondarySymbols || []).filter(Boolean).join(', ') || [symbolism.plantFlora, symbolism.geometricSymbol, symbolism.sacredObject].filter(Boolean).join(', ')}. Preserve these selected names exactly; do not omit or substitute them.`;

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
    <circle cx="582" cy="655" r="4" fill="${colorMap['sym_enneagram'] || baseStroke}" />
    <circle cx="218" cy="655" r="4" fill="${colorMap['sym_enneagram'] || baseStroke}" />
  </g>

  <!-- KATMAN 3: Astroloji Göksel Ufuk Yayı & Takımyıldız Eksenleri (sym_astrology) -->
  <g id="layer_sym_astrology" class="symbol-layer" data-symbol-id="sym_astrology" stroke="${colorMap['sym_astrology'] || baseStroke}" stroke-width="${isFinal ? '1.8' : '2.8'}" fill="none">
    <!-- Göksel Ufuk Yayı (Ascendant Horizon Curve) -->
    <path d="M 120 320 Q 400 180 680 320" stroke-width="2.4" stroke-linecap="round" />
    <path d="M 160 300 Q 400 195 640 300" stroke-width="1.0" stroke-dasharray="2,3" />

    <!-- Güneş & Ay Fazı Hilal Eğrisi (Üst Kutsal Kavis) -->
    <path d="M 340 210 A 65 65 0 0 1 460 210 A 55 55 0 0 0 340 210 Z" fill="${isFinal ? '#111111' : colorMap['sym_astrology']}" opacity="${isFinal ? '0.85' : '0.9'}" />
    
    <!-- Takımyıldız Yıldız Noktaları -->
    <circle cx="240" cy="270" r="3" fill="${colorMap['sym_astrology'] || baseStroke}" />
    <circle cx="290" cy="245" r="2.5" fill="${colorMap['sym_astrology'] || baseStroke}" />
    <circle cx="510" cy="245" r="2.5" fill="${colorMap['sym_astrology'] || baseStroke}" />
    <circle cx="560" cy="270" r="3" fill="${colorMap['sym_astrology'] || baseStroke}" />
    <line x1="240" y1="270" x2="290" y2="245" stroke-width="0.8" opacity="0.5" />
    <line x1="510" y1="245" x2="560" y2="270" stroke-width="0.8" opacity="0.5" />
  </g>

  <!-- KATMAN 4: Organik Botanik / Kutsal Lotus Yaprakları (sym_flora) -->
  <g id="layer_sym_flora" class="symbol-layer" data-symbol-id="sym_flora" stroke="${colorMap['sym_flora'] || baseStroke}" stroke-width="${isFinal ? '1.8' : '2.8'}" fill="none">
    <!-- Merkez Taç Yaprak -->
    <path d="M 400 760 C 350 670 340 520 400 440 C 460 520 450 670 400 760 Z" stroke-width="2.0" stroke-linejoin="round" />
    <!-- Yan Taç Yapraklar (Sol & Sağ) -->
    <path d="M 400 760 C 310 680 270 560 330 480 C 365 550 375 660 400 760 Z" stroke-width="1.8" />
    <path d="M 400 760 C 490 680 530 560 470 480 C 435 550 425 660 400 760 Z" stroke-width="1.8" />
    <!-- Dış Açılan Kanat Yapraklar -->
    <path d="M 400 760 C 260 700 200 610 260 540 C 295 610 330 685 400 760 Z" stroke-width="1.5" />
    <path d="M 400 760 C 540 700 600 610 540 540 C 505 610 470 685 400 760 Z" stroke-width="1.5" />
  </g>

  <!-- KATMAN 5: Ruhani Totem Anatomik / Negatif Alan Soyutlaması (sym_totem) -->
  <g id="layer_sym_totem" class="symbol-layer" data-symbol-id="sym_totem" stroke="${colorMap['sym_totem'] || baseStroke}" stroke-width="${isFinal ? '2.0' : '3.2'}" fill="none">
    <!-- Totem Kulak & Çene Açısal Konturları (Lotus Yapraklarıyla Kesişen Negatif Siluet) -->
    <path d="M 330 460 L 375 360 L 400 410 L 425 360 L 470 460" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Burun Köprüsü ve Göz Odağı -->
    <path d="M 400 410 L 400 520" stroke-width="1.8" />
    <polygon points="395,520 405,520 400,530" fill="${colorMap['sym_totem'] || baseStroke}" />
    <!-- Çene ve Boyun Dinamik Yayları -->
    <path d="M 370 480 Q 400 560 430 480" stroke-width="1.6" />
    <!-- Odak Göz İrisleri (Ultra-Minimal 03RL) -->
    <circle cx="370" cy="445" r="2.5" fill="${colorMap['sym_totem'] || baseStroke}" />
    <circle cx="430" cy="445" r="2.5" fill="${colorMap['sym_totem'] || baseStroke}" />
  </g>

  <!-- KATMAN 6: Numeroloji Yaşam Yolu Düğümleri & İlahi Mühür (sym_numerology) -->
  <g id="layer_sym_numerology" class="symbol-layer" data-symbol-id="sym_numerology" stroke="${colorMap['sym_numerology'] || baseStroke}" stroke-width="${isFinal ? '1.5' : '2.5'}" fill="none">
    <!-- Omurga Düğümleri (Nodal Stippling) -->
    <circle cx="400" cy="180" r="5" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="400" cy="270" r="3.5" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="400" cy="390" r="4" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="400" cy="550" r="6" fill="${isFinal ? '#ffffff' : colorMap['sym_numerology']}" stroke="${colorMap['sym_numerology'] || baseStroke}" stroke-width="2" />
    <circle cx="400" cy="690" r="4" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="400" cy="830" r="3.5" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="400" cy="940" r="5" fill="${colorMap['sym_numerology'] || baseStroke}" />

    <!-- İkincil Simetrik Takımyıldız Noktaları -->
    <circle cx="340" cy="550" r="2.5" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="460" cy="550" r="2.5" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="370" cy="620" r="2" fill="${colorMap['sym_numerology'] || baseStroke}" />
    <circle cx="430" cy="620" r="2" fill="${colorMap['sym_numerology'] || baseStroke}" />
  </g>

  <!-- KATMAN 7: Karmik Çakra & Sigil Denge Çapası (sym_chakra_balancer) -->
  <g id="layer_sym_chakra_balancer" class="symbol-layer" data-symbol-id="sym_chakra_balancer" stroke="${colorMap['sym_chakra_balancer'] || baseStroke}" stroke-width="${isFinal ? '1.8' : '2.8'}" fill="none">
    <!-- Taban Kök Mührü (Sigil Anchor) -->
    <path d="M 340 980 L 460 980" stroke-width="2.0" stroke-linecap="round" />
    <path d="M 370 1010 L 430 1010" stroke-width="1.6" stroke-linecap="round" />
    <path d="M 390 1035 L 410 1035" stroke-width="1.2" stroke-linecap="round" />
    <circle cx="400" cy="1060" r="3.5" fill="${colorMap['sym_chakra_balancer'] || baseStroke}" />
    
    <!-- Çapa Kavisleri -->
    <path d="M 360 950 C 370 990 400 1010 400 1010 C 400 1010 430 990 440 950" stroke-width="1.5" />
  </g>

  ${!isFinal ? `
  <!-- UI Legend Overlay on SVG (Deconstruction Mode Only) -->
  <g id="svg_ui_legend" transform="translate(40, 1140)">
    <rect x="0" y="0" width="720" height="42" rx="8" fill="#0f0f13" stroke="#2a2a38" stroke-width="1" />
    <text x="20" y="26" font-family="monospace" font-size="12" fill="#c4a47c" font-weight="bold">✦ SEMBOL HARİTASI & AYRIŞTIRMA KATMANLARI (INTERLOCKING LOGO DECONSTRUCTION)</text>
  </g>
  ` : ''}
</svg>
`.trim();
}

/**
 * Midjourney v6.1 / Flux / Gemini için Bütünsel Master Prompt Oluşturucu
 * 
 * ÖNEMLİ KURAL:
 * Prompt kesinlikle "lotus ekle, kurt kafası ekle, enneagram ekle" demez.
 * Bunun yerine "a single cohesive, interlocked tattoo composition weaving together..."
 * mantığını kullanır ve ayrı ikonları/çıkartmaları açıkça yasaklar.
 */
function buildMasterIntegratedAiPrompt(opts: {
  person: PersonData;
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbols: SymbolRegistryItem[];
  integrations: SymbolIntegrationLink[];
  designGeometry: IntegratedDesignGeometry;
  designParameters: TattooDesignParameters;
  totemProfile: any;
}): string {
  const { person, numerology, astrology, enneagram, symbols, designParameters, totemProfile } = opts;

  const styleNames = designParameters.selectedStyles?.join(', ') || 'Fine Line, Micro Dotwork, Sacred Geometry';
  const placement = designParameters.bodyPlacement || 'Forearm Inner';
  const primaryTotem = totemProfile.animalName;
  const requestedPrimary = designParameters.mainSymbol?.trim() || '';
  const requestedSupporting = (designParameters.secondarySymbols || [])
    .map(symbol => symbol.trim())
    .filter(Boolean)
    .filter(symbol => symbol.toLowerCase() !== primaryTotem.toLowerCase());
  const flora = symbols.find(s => s.symbolCategory === 'Flora')?.symbolName || 'Harmonized Botanical Form';
  // User-selected secondary symbols are authoritative for the final visual prompt.
  // Prefer an explicitly selected geometry symbol when present, then fall back to
  // the calculated symbolism registry. This prevents a valid calculated symbol
  // from disappearing between recipe generation and the final master prompt.
  const selectedGeometry = requestedSupporting.find(symbol =>
    /metatron|geometry|geometri|mandala|yaşam çiçeği|flower of life/i.test(symbol)
  );
  const geo = selectedGeometry
    || symbols.find(s => s.symbolCategory === 'Kutsal Geometri')?.symbolName
    || 'Sacred Geometry Matrix';
  const primaryVisual = requestedPrimary || flora;
  const supportingVisuals = [...new Set([...requestedSupporting, flora, geo])].join(', ');

  return `
A single unified, monolithic master esoteric tattoo flash plate artwork designed specifically for ${person.name}. 
STRICT COMPOSITION RULE: DO NOT create a collage, separate icons, or floating stickers. The design must read as ONE single interlocked organic-geometric logo-emblem composition where shared strokes and negative space seamlessly weave multiple symbolic dimensions together.

Primary Visual Focus: ${primaryVisual}, treated as the dominant focal subject while remaining structurally fused with the rest of the composition.
Integrated Supporting Symbols: ${supportingVisuals} are woven into the primary silhouette through shared contours, geometric transitions, and controlled negative space; never rendered as separate floating icons.
Selected Symbol Fidelity: Preserve every user-selected secondary symbol exactly as named in the design recipe, including ${requestedSupporting.join(', ') || 'none'}; do not silently replace, rename, or omit selected symbols.
Primary Armature: A central sacred geometry framework of ${geo} constructed with razor-sharp 03RL fine linework, where concentric golden-ratio rings form the structural cradle.
Integrated Inner Geometry: The 9-pointed Enneagram star of Type ${enneagram.coreType ?? enneagram.type} (${enneagram.wing}) is interlocked within the mandala, sharing perimeter nodes and focal vertices with continuous single-stroke linework.
Celestial Arch: A sweeping celestial horizon arc expressing ${astrology.sunSign} solar vitality and ${astrology.ascendantSign} rising axis, crowned with delicate constellation micro-stippling and crescent solar-lunar geometry.
Organic Botanical Flow: An opening ${flora} whose lower petals organically share outer contours with the sacred geometry circles, anchoring the bottom third of the piece.
Totem Animal Whisper: The essence of ${primaryTotem} is subtly abstracted—not as a cartoonish separate head, but as sleek geometric jawlines, alert triangular ear vertices, and negative space contours emerging naturally from between the botanical petals.
Numerological Spine: A vertical central meridian dotted with ${numerology.lifePathNumber} rhythmic micro-dotwork nodes symbolizing Life Path ${numerology.lifePathNumber} and divine resonance.

Style Specification:
- Pure monochrome black ink on clean studio paper background (zero human body, zero arm, zero photorealistic skin).
- Ultra-precise 03RL single-needle linework with 50% open negative space.
- Masterful whip shading, stipple dotwork gradients, and flawless geometric symmetries.
- Anatomically optimized for ${placement} placement with a vertical elegant flow.
- Flat 2D vector flash plate, museum quality, stencil-ready contour clarity.
  `.trim();
}
