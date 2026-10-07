/**
 * 52+ Kadim Hayvan Profili ve 20 Davranışsal Eksen Kütüphanesi
 */

export type BehavioralDimensionKey =
  | 'independence'
  | 'socialConnection'
  | 'protectiveness'
  | 'observation'
  | 'courageRisk'
  | 'patience'
  | 'adaptability'
  | 'curiosity'
  | 'intuition'
  | 'leadership'
  | 'stealth'
  | 'resilience'
  | 'freedomNeed'
  | 'territorialBoundary'
  | 'cooperation'
  | 'competitiveness'
  | 'threatReflex'
  | 'solitudeNeed'
  | 'socialEnergy'
  | 'crisisBehavior';

export type BehavioralVector = Record<BehavioralDimensionKey, number>;

export interface TotemAnimalProfile {
  id: string;
  name: string;
  turkishName: string;
  latinName?: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  realm: 'Orman & Dağ' | 'Gökyüzü' | 'Derin Sular' | 'Bozkır & Çöl' | 'Tundra & Kutup' | 'Gökyüzü & Kozmos' | 'Açık Okyanus & Rüzgarlar';
  behavioralVector: BehavioralVector;
  mainSymbolism: string;
  strongSide: string;
  protectivePower: string;
  instinctiveSide: string;
  shadowTrait: string;
  unbalancedBehavior: string;
  suppressedTrait: string;
  tattooPhysicalFeature: string;
  gazeDirection: string;
  headAngle: string;
  posture: string;
  compositionRole: string;
  recommendedStyles: string[];
}

export const BEHAVIORAL_DIMENSION_LABELS: Record<BehavioralDimensionKey, { name: string; low: string; high: string }> = {
  independence: { name: 'Bağımsızlık', low: 'Bağlı & Toplulukçu', high: 'Tamamen Özerk' },
  socialConnection: { name: 'Sosyal Bağlılık', low: 'Bireysel & Mesafeli', high: 'Güçlü Sürü Bağı' },
  protectiveness: { name: 'Koruyuculuk', low: 'Kendi Halinde', high: 'Gözü Kara Muhafız' },
  observation: { name: 'Gözlemcilik', low: 'Hemen Eyleme Geçen', high: 'Derin Stratejik Gözlem' },
  courageRisk: { name: 'Cesaret & Risk', low: 'Temkinli & Güvenli', high: 'Korkusuz Atılım' },
  patience: { name: 'Sabır & Sebat', low: 'Hızlı & Tez Canlı', high: 'Taş Gibi Hareketsiz' },
  adaptability: { name: 'Adaptasyon', low: 'Sabit & Değişmez', high: 'Bukalemun Esnekliği' },
  curiosity: { name: 'Merak & Keşif', low: 'Mevcutla Yetinen', high: 'Sonsuz Araştırıcı' },
  intuition: { name: 'Sezgisel Karar', low: 'Saf Analitik Mantık', high: 'İçsel İlahi Sezgi' },
  leadership: { name: 'Liderlik', low: 'Takipçi & Destekçi', high: 'Doğal Otorite & Alfa' },
  stealth: { name: 'Gizlilik & Sükunet', low: 'Göz Önünde & Sesli', high: 'Görünmez Gölge' },
  resilience: { name: 'Dayanıklılık', low: 'Hassas & Kırılgan', high: 'Zorlukta Yıkılmaz' },
  freedomNeed: { name: 'Özgürlük İhtiyacı', low: 'Kurallı & Aidiyetli', high: 'Tutsak Edilemez Vahşilik' },
  territorialBoundary: { name: 'Sınır Hassasiyeti', low: 'Geçirgen Sınırlar', high: 'Tavizsiz Kırmızı Çizgi' },
  cooperation: { name: 'İşbirliği', low: 'Tek Tabanca', high: 'Sinerjik Ortaklık' },
  competitiveness: { name: 'Rekabetçilik', low: 'Paylaşımcı & Sakin', high: 'Meydan Okuyan & Galip' },
  threatReflex: { name: 'Tehdit Refleksi', low: 'Geri Çekilme / Saklanma', high: 'Karşı Saldırı / Yüzleşme' },
  solitudeNeed: { name: 'Yalnızlık İhtiyacı', low: 'Sürekli Kalabalık', high: 'Kutsal İnziva' },
  socialEnergy: { name: 'Sosyal Enerji', low: 'İçedönük Sükunet', high: 'Dışadönük Manyetizma' },
  crisisBehavior: { name: 'Kriz Davranışı', low: 'Donma / Bekleme', high: 'Anında Soğukkanlı Liderlik' }
};

// 52 Farklı Hayvan Profili ve 20 Davranışsal Vektör Ağırlıkları
export const TOTEM_ANIMALS_52: TotemAnimalProfile[] = [
  {
    id: 'bozkir_kurdu',
    name: 'Kurt (Wolf)',
    turkishName: 'Bozkır Kurdu',
    element: 'Toprak',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 75, socialConnection: 85, protectiveness: 90, observation: 85,
      courageRisk: 80, patience: 70, adaptability: 80, curiosity: 65, intuition: 85,
      leadership: 85, stealth: 75, resilience: 90, freedomNeed: 90, territorialBoundary: 90,
      cooperation: 85, competitiveness: 70, threatReflex: 85, solitudeNeed: 55, socialEnergy: 65, crisisBehavior: 85
    },
    mainSymbolism: 'Sadakat, içsel pusula, sürü bilgeliği, bağımsız irade ve vahşi uyanış.',
    strongSide: 'Kendi kurallarını koyma, sezgisel yön bulma, sevdiklerini canı pahasına kollama.',
    protectivePower: 'Aurik alanı çevrelenmiş bir sürü çemberi gibi koruyan vahşi kalkan.',
    instinctiveSide: 'Rüzgardaki en ufak kokuyu ve niyeti anında ayırt etme yeteneği.',
    shadowTrait: 'Yalnız kurt sendromu, derin güvensizlik, savunmacı saldırganlık.',
    unbalancedBehavior: 'Tehdit hissettiğinde ilk saldıran olma veya sürüyü terk edip yabancılaşma.',
    suppressedTrait: 'Koşulsuz teslimiyet ve bir yere ait olma arzusunu bastırma.',
    tattooPhysicalFeature: '3/4 açılı asil kafa yapısı, ensedeki kalkık yele tüyleri, zeki ve uyanık gözler.',
    gazeDirection: 'Sol omzun üzerinden ufuktaki ay döngüsüne bakan odaklanmış bakış.',
    headAngle: 'Hafif yukarı kalkık, rüzgarı koklayan uyanık baş açısı.',
    posture: 'Göğüs kafesi dik, omurga hattına paralel esnek ve sağlam duruş.',
    compositionRole: 'Kompozisyonun merkez odağı (%65 görsel ağırlık), zengin dokusal gölgeleme.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork', 'Blackwork']
  },
  {
    id: 'kuzgun',
    name: 'Kuzgun (Raven)',
    turkishName: 'Kadim Kuzgun',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 90, socialConnection: 35, protectiveness: 60, observation: 95,
      courageRisk: 75, patience: 85, adaptability: 90, curiosity: 95, intuition: 95,
      leadership: 50, stealth: 85, resilience: 80, freedomNeed: 95, territorialBoundary: 70,
      cooperation: 45, competitiveness: 55, threatReflex: 60, solitudeNeed: 90, socialEnergy: 30, crisisBehavior: 80
    },
    mainSymbolism: 'Okült sırlar, kehanet, karanlıkta yön bulma, ölüm ve yeniden doğum simyası.',
    strongSide: 'Sırları çözme, derin hakikat arayışı, illüzyonların ötesini görebilme.',
    protectivePower: 'Bilinçdışından gelen psişik parazitleri yutan ve dönüştüren gözlem kalkanı.',
    instinctiveSide: 'Görünmeyen tehlikeleri fısıltı gibi önceden sezme refleksi.',
    shadowTrait: 'Yalnızlaşarak dünyadan kopma, melankoli ve kibre varan mesafeli soğukluk.',
    unbalancedBehavior: 'İnsanlara güvenmeyip her sözün altında komplo arama.',
    suppressedTrait: 'Duygusal bağ kurma ve incinme korkusuyla şefkati gizleme.',
    tattooPhysicalFeature: 'Işıltılı siyah tüy detayları, gagasında gizli mühür, kanat açıklığında mikro dotwork yıldızlar.',
    gazeDirection: 'Sol omzun üzerinden geçmişe ve ufuktaki dönüşüm eşiğine bakan derin bakış.',
    headAngle: '15 derece hafif yukarı ve yana eğik, uyanık ve bilge tetiktelik açısı.',
    posture: 'Tünemiş fakat her an göğe fırlayabilecek yay gibi gergin sükunet.',
    compositionRole: 'Kompozisyonun 1. derece görsel çekim merkezi, en keskin 03RL konturlar.',
    recommendedStyles: ['Dark Surrealism', 'Fine Line', 'Dotwork', 'Geometric']
  },
  {
    id: 'kaya_kartali',
    name: 'Kartal (Golden Eagle)',
    turkishName: 'Kaya Kartalı',
    element: 'Ateş',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 95, socialConnection: 25, protectiveness: 75, observation: 95,
      courageRisk: 90, patience: 80, adaptability: 60, curiosity: 70, intuition: 85,
      leadership: 90, stealth: 65, resilience: 90, freedomNeed: 98, territorialBoundary: 95,
      cooperation: 25, competitiveness: 85, threatReflex: 90, solitudeNeed: 90, socialEnergy: 30, crisisBehavior: 90
    },
    mainSymbolism: 'Yüksek vizyon, krallık, ilahi adalet, güneş iradesi ve tavizsiz netlik.',
    strongSide: 'Geniş perspektiften bakabilme, hedefe sarsılmaz kilitlenme, onur ve cesaret.',
    protectivePower: 'Yüksek irtifadan alanı tarayarak düşük frekanslı tehditleri dağıtma.',
    instinctiveSide: 'Fırtınaları kaçmak yerine rüzgarını arkasına alarak yükselme dürtüsü.',
    shadowTrait: 'Tepeden bakma, acımasız kuralcılık, zayıflığa tahammülsüzlük.',
    unbalancedBehavior: 'Karşısındakini ezen bir otoriterlik veya ulaşılamaz bir fildişi kuleye çekilme.',
    suppressedTrait: 'Hata yapma korkusu ve kendi kusurlarıyla yüzleşmekten çekinme.',
    tattooPhysicalFeature: 'Görkemli kavisli gaga, delici göz irisleri, rüzgarı yaran geniş kanat telekleri.',
    gazeDirection: 'Doğrudan karşıya, izleyicinin ufuk çizgisine kilitlenmiş tavizsiz odak.',
    headAngle: 'Dik, hafif profilden asil ve buyurgan duruş açısı.',
    posture: 'Kanatları kısmen açık, göğüs kafesi önde, sarp kayalıkta sağlam tutunuş.',
    compositionRole: 'Tasarımın tepe ve merkez aksını domine eden anıtsal güç.',
    recommendedStyles: ['Fine Line', 'Geometric', 'Blackwork']
  },
  {
    id: 'gece_baykusu',
    name: 'Baykuş (Barn Owl)',
    turkishName: 'Gece Baykuşu',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 85, socialConnection: 20, protectiveness: 55, observation: 98,
      courageRisk: 60, patience: 95, adaptability: 75, curiosity: 90, intuition: 95,
      leadership: 40, stealth: 95, resilience: 75, freedomNeed: 90, territorialBoundary: 75,
      cooperation: 30, competitiveness: 40, threatReflex: 50, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 75
    },
    mainSymbolism: 'Karanlıkta gören gözler, kadim bilgelik, sessiz hareket ve saf hakikat.',
    strongSide: 'Maskelerin arkasını görme, sezgisel dinleme, yanılsamaları parçalama.',
    protectivePower: 'Görünmeyen tuzakları ve manipülasyonları erkenden haber verme.',
    instinctiveSide: 'Gürültüden uzaklaşıp tam sessizlikte gerçeği duyma kabiliyeti.',
    shadowTrait: 'Fazla analizden felç olma (overthinking), yaşamdan geri çekilme.',
    unbalancedBehavior: 'Duyguları mantık süzgecinde boğarak samimiyeti kaybetme.',
    suppressedTrait: 'Kontrolsüz bedensel tutkularını ve dünyevi arzularını bastırma.',
    tattooPhysicalFeature: 'Kalp şeklinde yüz diski, mikro dotwork tüyler, derin siyah göz bebekleri.',
    gazeDirection: 'Doğrudan izleyicinin ruhunun en derin noktasına bakan hipnotik gözler.',
    headAngle: 'Düz veya hafifçe yana yatık, meraklı ve sorgulayıcı bilge açı.',
    posture: 'Kanatlarını zarifçe gövdesine sarmış, hilal formunda geometrik tüneme.',
    compositionRole: 'Merkezi aydınlatan derin bilgelik odağı.',
    recommendedStyles: ['Dotwork', 'Fine Line', 'Geometric']
  },
  {
    id: 'kar_leopari',
    name: 'Kar Leoparı (Snow Leopard)',
    turkishName: 'Kar Leoparı',
    element: 'Toprak',
    realm: 'Tundra & Kutup',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 65, observation: 92,
      courageRisk: 85, patience: 90, adaptability: 85, curiosity: 75, intuition: 88,
      leadership: 65, stealth: 95, resilience: 95, freedomNeed: 95, territorialBoundary: 90,
      cooperation: 20, competitiveness: 70, threatReflex: 80, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 85
    },
    mainSymbolism: 'Sarp zirvelerin sessizliği, zarafet, görünmezlik ve içsel sabır.',
    strongSide: 'Zorlu koşullarda iz bırakmadan ilerleme, bağımsızlık, yüksek çeviklik.',
    protectivePower: 'Kişisel sınırları aşılmaz buzdan bir kale gibi koruma.',
    instinctiveSide: 'En doğru an gelene kadar günlerce sabırla pusuda bekleyebilme.',
    shadowTrait: 'Aşırı izolasyon, duygusal donukluk, kimseden yardım isteyememe.',
    unbalancedBehavior: 'Yakın ilişkileri birdenbire kesip sessizce uzaklaşma.',
    suppressedTrait: 'Sıcak temasa ve şefkate duyulan derin ama itiraf edilemeyen açlık.',
    tattooPhysicalFeature: 'Kalın benekli kürk dokusu, dengeli uzun kuyruk sarmalı, buz mavisi göz parıltısı.',
    gazeDirection: 'Gözler hafif kısılarak sislerin arasından geleceği süzen derin odak.',
    headAngle: 'Aşağıdan yukarıya doğru 20 derece kavisli, pusuya hazır baş açısı.',
    posture: 'Kayaya sarılmış, adımları sessiz, kas lifleri gergin ve esnek.',
    compositionRole: 'Kompozisyonun üstünden alta doğru inen sarmal kavis omurgası.',
    recommendedStyles: ['Micro Realism', 'Fine Line', 'Dotwork']
  },
  {
    id: 'bozayi',
    name: 'Ayı (Grizzly Bear)',
    turkishName: 'Heybetli Bozayı',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 85, socialConnection: 30, protectiveness: 98, observation: 75,
      courageRisk: 85, patience: 85, adaptability: 70, curiosity: 60, intuition: 80,
      leadership: 80, stealth: 50, resilience: 98, freedomNeed: 85, territorialBoundary: 95,
      cooperation: 35, competitiveness: 80, threatReflex: 95, solitudeNeed: 90, socialEnergy: 30, crisisBehavior: 90
    },
    mainSymbolism: 'Köklenme, sarsılmaz beden gücü, kış uykusu (içsel inziva), annelik şefkati ve şifa.',
    strongSide: 'Kendi sınırlarını ve yavrusunu/sevdiklerini ezen her tehdidi parçalama gücü.',
    protectivePower: 'Depremlerde bile yıkılmayan dağ gibi bir aurik sığınak sunma.',
    instinctiveSide: 'Kış uykusu gibi zamanı geldiğinde tüm dış dünyayı kapatıp kendi içine çekilme dürtüsü.',
    shadowTrait: 'Yıkıcı hiddet, ağırkanlılık, inatçılık ve dünyadan küsüp uyuşma.',
    unbalancedBehavior: 'Öfkelendiğinde gözü hiçbir şeyi görmeden etrafındaki her şeyi kırıp dökme.',
    suppressedTrait: 'Hafifliği, çocuksu neşeyi ve ağırlığını bir kenara bırakabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Heybetli omuz hörgücü, kalın kürk katmanları, keskin pençe detayları.',
    gazeDirection: 'Aşağıdan yukarıya doğru ağır ve vakarla bakan sarsılmaz bakış.',
    headAngle: 'Hafif öne eğik, toprağa basan güçlü boyun çizgisi.',
    posture: 'Dört ayak üzerinde ya da arka ayaklarına doğrulmuş anıtsal heybet.',
    compositionRole: 'Tasarımın alt kaidesi ve en ağır taşıyıcı merkezi.',
    recommendedStyles: ['Blackwork', 'Nordic Tribal', 'Fine Line']
  },
  {
    id: 'sibirya_kaplani',
    name: 'Kaplan (Siberian Tiger)',
    turkishName: 'Sibirya Kaplanı',
    element: 'Ateş',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 95, socialConnection: 20, protectiveness: 80, observation: 90,
      courageRisk: 95, patience: 85, adaptability: 75, curiosity: 75, intuition: 85,
      leadership: 90, stealth: 90, resilience: 95, freedomNeed: 95, territorialBoundary: 98,
      cooperation: 20, competitiveness: 95, threatReflex: 95, solitudeNeed: 95, socialEnergy: 30, crisisBehavior: 95
    },
    mainSymbolism: 'Tavizsiz cesaret, tutku, bireysel güç, asalet ve korkusuz krallık.',
    strongSide: 'Hiçbir engelden çekinmeme, tek başına ordulara karşı durabilme iradesi.',
    protectivePower: 'Korku ve panik frekansını kükremesiyle yakan ilahi kalkan.',
    instinctiveSide: 'Hedefine sessizce yaklaşıp tek bir hamlede sonuca ulaşma.',
    shadowTrait: 'Yalnızlık kibri, acımasızlık, kimseye güvenmeme ve ani öfke patlaması.',
    unbalancedBehavior: 'Kendini göstermek için gereksiz riskler alma ve sevdiklerini ürkütme.',
    suppressedTrait: 'Uysallığı, başkalarına teslim olmayı ve savunmasız kalmayı öğrenme.',
    tattooPhysicalFeature: 'Alev formunda siyah çizgiler, keskin bıyıklar, kehribar gözler.',
    gazeDirection: 'Gözlerini dikmiş, doğrudan hedefe kilitli delici odak.',
    headAngle: 'Profilden ya da 3/4 açılı, çene hafif kalkık asil duruş.',
    posture: 'Kar üzerinde yürüyen, kas lifleri belirgin esnek gövde.',
    compositionRole: 'Kompozisyonun en dinamik ve çarpıcı odak figürü.',
    recommendedStyles: ['Micro Realism', 'Fine Line', 'Japanese Neo-Traditional']
  },
  {
    id: 'kizil_tilki',
    name: 'Tilki (Red Fox)',
    turkishName: 'Kızıl Tilki',
    element: 'Ateş',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 80, socialConnection: 40, protectiveness: 65, observation: 90,
      courageRisk: 70, patience: 80, adaptability: 95, curiosity: 95, intuition: 90,
      leadership: 50, stealth: 92, resilience: 80, freedomNeed: 85, territorialBoundary: 75,
      cooperation: 45, competitiveness: 70, threatReflex: 65, solitudeNeed: 75, socialEnergy: 45, crisisBehavior: 85
    },
    mainSymbolism: 'Kıvrak zeka, kamuflaj, diplomasi, engelleri zekayla aşma ve büyüleyici espri.',
    strongSide: 'Kaba kuvvete başvurmadan tüm düğümleri çözebilme, hızlı refleks.',
    protectivePower: 'Manipülasyonları ve gizli düşmanlıkları anında sezip manevra yapma.',
    instinctiveSide: 'Tehlike anında çatışmaya girmek yerine zekice görünmez olma.',
    shadowTrait: 'Hilekarlık, aşırı kuşkuculuk, içten pazarlıklılık, sahte maskeler.',
    unbalancedBehavior: 'Ciddi konuları alaya alma ve kimseye gerçek duygularını açmama.',
    suppressedTrait: 'Saf masumiyet ve hiçbir strateji gütmeden sevebilme cesareti.',
    tattooPhysicalFeature: 'Kıvrık gür kuyruk, sivri uyanık kulaklar, badem şeklinde kurnaz gözler.',
    gazeDirection: 'Omzunun üzerinden gülümser gibi bakan zeki ve oyuncu bakış.',
    headAngle: 'Yana eğik, dinleyen ve tartan meraklı baş açısı.',
    posture: 'Bir ayağı havada, her an fırlamaya hazır esnek kıvrım.',
    compositionRole: 'Kompozisyona kıvraklık ve organik zarafet katan sarmal unsur.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Illustrative']
  },
  {
    id: 'sahingil_dogan',
    name: 'Şahin & Doğan (Peregrine Falcon)',
    turkishName: 'Gökdoğan',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 90, socialConnection: 25, protectiveness: 70, observation: 98,
      courageRisk: 95, patience: 75, adaptability: 70, curiosity: 80, intuition: 85,
      leadership: 75, stealth: 80, resilience: 85, freedomNeed: 98, territorialBoundary: 85,
      cooperation: 30, competitiveness: 90, threatReflex: 90, solitudeNeed: 85, socialEnergy: 30, crisisBehavior: 95
    },
    mainSymbolism: 'Hız, lazer odağı, yüksek irtifa bilinci, fırsatı kaçırmama ve keskin nişancılık.',
    strongSide: 'Saatte 300 km hızla dalışa geçebilme, kaosun içinde tek doğru noktayı görme.',
    protectivePower: 'Zihinsel dağınıklığı ve ertelemeyi fırtına gibi yırtıp atan odak kalkanı.',
    instinctiveSide: 'Hedefi gördüğü an tereddüt etmeden boşluğa kendini bırakma.',
    shadowTrait: 'Tünel vizyonu (etrafı görememe), sabırsızlık, başarısızlığa sıfır tolerans.',
    unbalancedBehavior: 'Küçük detaylara takılıp büyük resmi kaçırma veya insanları hızına yetişemediği için ezme.',
    suppressedTrait: 'Yavaşlamayı, durup beklemeyi ve hedefsizce var olmayı öğrenme.',
    tattooPhysicalFeature: 'Aerodinamik kanat geometrisi, göz altındaki siyah miğfer maskesi, sarı pençeler.',
    gazeDirection: 'Aşağıya, avına dikine kilitlenmiş tavizsiz lazer odak.',
    headAngle: 'Aşağıya eğik, dalışa hazır kavisli gaga.',
    posture: 'Kanatlarını arkaya katlamış, ok gibi göğü delen dalış anı.',
    compositionRole: 'Tasarıma dikey veya çapraz güçlü bir hız vektörü kazandıran hat.',
    recommendedStyles: ['Geometric', 'Fine Line', 'Dotwork']
  },
  {
    id: 'kambur_balina',
    name: 'Balina (Humpback Whale)',
    turkishName: 'Kambur Balina',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 70, socialConnection: 75, protectiveness: 85, observation: 85,
      courageRisk: 60, patience: 95, adaptability: 80, curiosity: 80, intuition: 98,
      leadership: 70, stealth: 60, resilience: 95, freedomNeed: 90, territorialBoundary: 50,
      cooperation: 80, competitiveness: 30, threatReflex: 45, solitudeNeed: 80, socialEnergy: 50, crisisBehavior: 85
    },
    mainSymbolism: 'Kadim kozmik hafıza, okyanus şarkıları, derin bilinçdışı ve telepatik frekans.',
    strongSide: 'Derin duygusal dalgaları sakinleştirme, sonsuz sabır, kadim kayıtları çözme.',
    protectivePower: 'Ruhsal travmaları ve psişik fırtınaları emen engin okyanus aurası.',
    instinctiveSide: 'Okyanus tabanından gelen frekansları tüm gövdesiyle hissedip yön bulma.',
    shadowTrait: 'Dünyevi sorumluluklardan kaçıp kendi dipsiz iç dünyasında kaybolma.',
    unbalancedBehavior: 'Derin melankoliye kapılıp günlerce dış dünyayla iletişimi kesme.',
    suppressedTrait: 'Yeryüzündeki sıradan, pratik ve maddi gerçeklikleri kabullenme.',
    tattooPhysicalFeature: 'Geniş göğüs yüzgeçleri, karın altındaki oluklu paralel hatlar, su püskürten baş.',
    gazeDirection: 'Derin okyanus boşluğundan yukarıdaki güneş ışığı huzmelerine bakan bilge göz.',
    headAngle: 'Hafif yukarıya doğru kavisli, derinlikten yükselen devasa huzur.',
    posture: 'Sarmal bir su girdabının içinde süzülen heykelsi ve yumuşak kavis.',
    compositionRole: 'Tüm tasarımın duygusal ve ruhani derinlik omurgası.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork', 'Sacred Geometry']
  },
  {
    id: 'siseburun_yunus',
    name: 'Yunus (Bottlenose Dolphin)',
    turkishName: 'Şişeburun Yunus',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 60, socialConnection: 95, protectiveness: 80, observation: 85,
      courageRisk: 75, patience: 60, adaptability: 90, curiosity: 95, intuition: 92,
      leadership: 75, stealth: 55, resilience: 80, freedomNeed: 85, territorialBoundary: 60,
      cooperation: 95, competitiveness: 50, threatReflex: 70, solitudeNeed: 35, socialEnergy: 95, crisisBehavior: 85
    },
    mainSymbolism: 'Koşulsuz neşe, kalp frekansı, nefes bilinci, şifacı enerji ve kolektif uyum.',
    strongSide: 'Yaşam sevincini her koşulda koruma, sezgisel radar, kolektif dayanışma.',
    protectivePower: 'Ağır melankoli ve negatif enerji dalgalarını neşe titreşimiyle dağıtma.',
    instinctiveSide: 'Kalp titreşimleriyle karşısındakinin gerçek niyetini anında okuma.',
    shadowTrait: 'Yüzeyellik, ciddiyetten kaçma, derin acılarla yüzleşmekten korkma.',
    unbalancedBehavior: 'Sürekli eğlence ve onay arayışıyla içindeki yaraları maskeleme.',
    suppressedTrait: 'Kederin ve yasın da kutsal bir dönüşüm kapısı olduğunu kabul etme.',
    tattooPhysicalFeature: 'Pürüzsüz parlak deri, neşeli gaga yapısı, dalgaların arasından sıçrayış.',
    gazeDirection: 'Işığa ve gökyüzüne doğru sıçrarken izleyiciye gülümseyen bakış.',
    headAngle: 'Suyun dışına fırlamış, güneşi selamlayan yukarı kavis.',
    posture: 'Dalganın üzerinde hilal formunda havada asılı kalmış dinamik eğri.',
    compositionRole: 'Tasarıma hafiflik, neşe ve akışkan su spiralleri katan unsur.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Minimalist']
  },
  {
    id: 'pasifik_ahtapotu',
    name: 'Ahtapot (Pacific Octopus)',
    turkishName: 'Pasifik Ahtapotu',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 60, observation: 95,
      courageRisk: 65, patience: 92, adaptability: 98, curiosity: 95, intuition: 92,
      leadership: 40, stealth: 98, resilience: 85, freedomNeed: 95, territorialBoundary: 80,
      cooperation: 20, competitiveness: 50, threatReflex: 60, solitudeNeed: 95, socialEnergy: 15, crisisBehavior: 90
    },
    mainSymbolism: 'Sonsuz adaptasyon, çoklu zeka, esneklik, gizem ve sınırları aşabilme.',
    strongSide: 'En dar yarıklardan bile geçebilme, dokunaçlarıyla çok boyutlu problem çözme.',
    protectivePower: 'Görünmez mürekkep kalkanıyla düşmanı şaşırtıp sessizce sıyrılma.',
    instinctiveSide: 'Dokunduğu her yüzeyin kimyasını ve hissini anında kavrama.',
    shadowTrait: 'Aşırı manipülatif olma, arkadan iş çevirme, yakalanmama kibri.',
    unbalancedBehavior: 'Duygusal bağlardan kaçmak için sürekli şekil ve kimlik değiştirme.',
    suppressedTrait: 'Sabit kalabilme, tek bir yerde kök salma ve saydam olma cesareti.',
    tattooPhysicalFeature: 'Spiral kavisli 8 dokunaç, emici vantuz detayları, akıllı ve derin gözler.',
    gazeDirection: 'Kayalığın arkasından izleyiciyi süzen kadim ve esrarengiz bakış.',
    headAngle: 'Yumuşak kubbe kafa, süzülen akışkan pozisyon.',
    posture: 'Vücudu ve kolları geometrik mandalaya dolanmış büyüleyici sarmal.',
    compositionRole: 'Tasarımın tüm boşluklarını dolduran akıcı spiral ağ.',
    recommendedStyles: ['Dotwork', 'Dark Surrealism', 'Fine Line', 'Illustrative']
  },
  {
    id: 'kunduz',
    name: 'Kunduz (Beaver)',
    turkishName: 'Usta Mimar Kunduz',
    element: 'Su',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 65, socialConnection: 85, protectiveness: 90, observation: 80,
      courageRisk: 60, patience: 95, adaptability: 85, curiosity: 75, intuition: 75,
      leadership: 70, stealth: 70, resilience: 95, freedomNeed: 65, territorialBoundary: 90,
      cooperation: 90, competitiveness: 50, threatReflex: 70, solitudeNeed: 50, socialEnergy: 65, crisisBehavior: 85
    },
    mainSymbolism: 'Kutsal mimari, yılmaz emek, yuva inşası, akışı yönlendirme ve pratik zeka.',
    strongSide: 'Yıkılan her şeyi sabırla yeniden inşa etme, suyun akışını değiştirme gücü.',
    protectivePower: 'Sevdiklerini dış tehlikelerden koruyan geçilmez sığınaklar ve bentler kurma.',
    instinctiveSide: 'Ağaç gövdesindeki en zayıf noktayı sezgisel olarak hissedip yontma.',
    shadowTrait: 'İşkoliklik, takıntılı kontrolcülük, dinlenmeyi hak görmeme.',
    unbalancedBehavior: 'Her şeyi kendi istediği gibi inşa etmeye çalışıp başkalarına alan tanımama.',
    suppressedTrait: 'Hiçbir şey üretmeden sadece var olmanın huzurunu yaşayabilme.',
    tattooPhysicalFeature: 'Pul dokulu geniş kuyruk, sağlam ön dişler, su geçirmez kalın kürk.',
    gazeDirection: 'İnşa ettiği bente ve nehrin akışına bakan gururlu gözler.',
    headAngle: 'Dik, çalışan ve tasarlayan mimar baş açısı.',
    posture: 'Kütüğün üzerinde duran, ayakları yere sağlam basan kararlı figür.',
    compositionRole: 'Tasarıma geometrik düzen, ahşap dokusu ve zemin dengesi katan unsur.',
    recommendedStyles: ['Fine Line', 'Geometric', 'Dotwork']
  },
  {
    id: 'bukalemun',
    name: 'Bukalemun (Chameleon)',
    turkishName: 'Renk Ustası Bukalemun',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 90, socialConnection: 20, protectiveness: 55, observation: 98,
      courageRisk: 45, patience: 98, adaptability: 100, curiosity: 85, intuition: 90,
      leadership: 35, stealth: 98, resilience: 75, freedomNeed: 85, territorialBoundary: 60,
      cooperation: 30, competitiveness: 35, threatReflex: 40, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 75
    },
    mainSymbolism: 'Ortama tam adaptasyon, 360 derece görüş açısı, sabır ve renk simyası.',
    strongSide: 'Görünmeden her ortama uyum sağlama, çok boyutlu farkındalık, sabır.',
    protectivePower: 'Düşmanca ortamlarda görünmez olarak enerjisini koruma kalkanı.',
    instinctiveSide: 'Bir gözü geçmişi bir gözü geleceği aynı anda tarayabilme kabiliyeti.',
    shadowTrait: 'Kimliksizleşme, başkalarının beklentilerine göre şekil alıp özünü kaybetme.',
    unbalancedBehavior: 'Herkesin suyuna giderek kendi hakikatini ve sınırlarını unutma.',
    suppressedTrait: 'Renk değiştirmeden, kendi gerçek rengiyle dimdik durabilme cesareti.',
    tattooPhysicalFeature: 'Sarmal spiral kuyruk, birbirinden bağımsız hareket eden konik gözler.',
    gazeDirection: 'Biri yukarıya göğe, diğeri aşağıya toprağa bakan çift odaklı sihir.',
    headAngle: 'Yavaşça dönen, her yönü aynı anda algılayan 360 derece açı.',
    posture: 'İnce bir dalı dört parmağıyla sıkıca kavramış, kımıldamadan duran sabır.',
    compositionRole: 'Fibonacci spirali ile kuyruğu bütünleşen ezoterik denge noktası.',
    recommendedStyles: ['Dotwork', 'Sacred Geometry', 'Fine Line']
  },
  {
    id: 'kara_panter',
    name: 'Kara Panter (Black Panther)',
    turkishName: 'Gölge Panteri',
    element: 'Su',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 95, socialConnection: 20, protectiveness: 85, observation: 92,
      courageRisk: 90, patience: 90, adaptability: 85, curiosity: 80, intuition: 92,
      leadership: 85, stealth: 98, resilience: 92, freedomNeed: 95, territorialBoundary: 95,
      cooperation: 25, competitiveness: 85, threatReflex: 95, solitudeNeed: 95, socialEnergy: 25, crisisBehavior: 95
    },
    mainSymbolism: 'Bilinçdışı gölge koruyucusu, sessiz otorite, kadınsı gizem ve korkusuz gece yürüyüşü.',
    strongSide: 'Karanlıkta korkusuzca avlanma, derin bilinçdışında yol alma, zarafet.',
    protectivePower: 'Psişik saldırıları ve karanlık korkuları yutan mutlak gece kalkanı.',
    instinctiveSide: 'Ağaç dallarında hiç ses çıkarmadan hedefine süzülme refleksi.',
    shadowTrait: 'Pusuda beklemenin getirdiği aşırı paranoya, kin ve aniden yok edici hamle arzusu.',
    unbalancedBehavior: 'Duygusal duvar örüp sevdiklerine bile pençelerini gösterme.',
    suppressedTrait: 'Karanlıktan çıkıp ışıkta da sevilmeye ve görülmeye izin verme.',
    tattooPhysicalFeature: 'İpeksi siyah kürk gölgeleri, parlayan zümrüt gözler, esnek güçlü omuz kasları.',
    gazeDirection: 'Karanlığın içinden doğrudan izleyicinin gözlerine kilitlenmiş hipnotik bakış.',
    headAngle: 'Hafif aşağı eğik, çene geride, sıçramaya hazır odak.',
    posture: 'Ağaç dalına sarılmış ya da sinsi adımlarla öne doğru ilerleyen gergin yay.',
    compositionRole: 'Kompozisyonun en koyu negatif alan ve kontrast kaynağı.',
    recommendedStyles: ['Blackwork', 'Fine Line', 'Micro Realism']
  },
  {
    id: 'bal_porsugu',
    name: 'Bal Porsuğu (Honey Badger)',
    turkishName: 'Yıkılmaz Bal Porsuğu',
    element: 'Ateş',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 90, observation: 70,
      courageRisk: 100, patience: 65, adaptability: 80, curiosity: 85, intuition: 80,
      leadership: 75, stealth: 60, resilience: 100, freedomNeed: 98, territorialBoundary: 95,
      cooperation: 20, competitiveness: 95, threatReflex: 100, solitudeNeed: 90, socialEnergy: 20, crisisBehavior: 98
    },
    mainSymbolism: 'Korkusuzluk, zehirlere karşı bağışıklık, boyun eğmez irade ve tavizsiz direnç.',
    strongSide: 'Kendinden kat kat büyük aslanlara ve zehirli yılanlara bile geri adım atmama.',
    protectivePower: 'Psikolojik zehirleri ve sindirme çabalarını tek hamlede parçalama gücü.',
    instinctiveSide: 'Tehdit gördüğü an geri çekilmek yerine doğrudan saldırgana doğru yürüme.',
    shadowTrait: 'Kavgacılık, uzlaşmazlık, gereksiz yere savaş arama ve inat.',
    unbalancedBehavior: 'En ufak eleştiride bile savunmaya geçip herkese meydan okuma.',
    suppressedTrait: 'Yumuşaklığı, barışı ve savaşmadan da güvende olunabileceğini kabul etme.',
    tattooPhysicalFeature: 'Sırt boyunca uzanan gümüş beyaz şerit, kalın deri kıvrımları, keskin pençeler.',
    gazeDirection: 'Meydan okuyan, gözünü kırpmayan tavizsiz vahşi bakış.',
    headAngle: 'Kalkık burun, dişleri hafif gösteren hırlama açısı.',
    posture: 'Yere sağlam basmış, boyun eğmeyen kalın ve sağlam gövde.',
    compositionRole: 'Kompozisyona yıkılmaz bir direnç ve cesaret enerjisi katan köşe taşı.',
    recommendedStyles: ['Blackwork', 'Nordic Tribal', 'Fine Line']
  },
  {
    id: 'kral_kobra',
    name: 'Yılan & Kobra (King Cobra)',
    turkishName: 'Kral Kobra',
    element: 'Ateş',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 75, observation: 92,
      courageRisk: 85, patience: 95, adaptability: 85, curiosity: 75, intuition: 95,
      leadership: 75, stealth: 95, resilience: 90, freedomNeed: 90, territorialBoundary: 95,
      cooperation: 15, competitiveness: 80, threatReflex: 95, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 90
    },
    mainSymbolism: 'Kundalini yaşam enerjisi, deri değiştirme (arınma), şifa ve ölümcül bilgelik.',
    strongSide: 'Zamanı geldiğinde eski benliğini soyup atabilme, hedefe anında kilitlenme.',
    protectivePower: 'Toksik insanları ve parazitleri tek bir bakış veya uyarıyla uzaklaştırma.',
    instinctiveSide: 'Yerdeki en ufak titreşimi çenesiyle hissedip tehlikeyi önceden bilme.',
    shadowTrait: 'Soğukkanlı intikamcılık, zehirli sözler, duygusal donukluk.',
    unbalancedBehavior: 'İncinmemek için önce kendisi zehir saçıp etrafındakileri yakma.',
    suppressedTrait: 'Sıcaklığı, savunmasızlığı ve kalbini korkusuzca açabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Geniş açık başlık (hood), geometrik pullar, çatallı dil, dik duruş.',
    gazeDirection: 'Doğrudan karşıya, tehdidi hipnotize eden dikey göz bebekleri.',
    headAngle: 'Yerden yükselmiş, dik ve kutsal bir sütun gibi duran baş.',
    posture: 'Kendi üzerine sarmalanmış spiral gövde, yukarıya şahlanmış tepe noktası.',
    compositionRole: 'Kundalini omurgası ve tasarımın dikey eksen kavis taşıyıcısı.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork', 'Sacred Geometry']
  },
  {
    id: 'asil_yaban_ati',
    name: 'At (Wild Mustang)',
    turkishName: 'Bozkır Yılkı Atı',
    element: 'Ateş',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 85, socialConnection: 80, protectiveness: 75, observation: 85,
      courageRisk: 85, patience: 60, adaptability: 80, curiosity: 80, intuition: 88,
      leadership: 80, stealth: 50, resilience: 95, freedomNeed: 100, territorialBoundary: 75,
      cooperation: 80, competitiveness: 75, threatReflex: 75, solitudeNeed: 45, socialEnergy: 75, crisisBehavior: 85
    },
    mainSymbolism: 'Zapt edilemez özgürlük, soyluluk, rüzgar hızı, dayanıklılık ve sadakat.',
    strongSide: 'Yorulmak bilmeyen bacaklar, rüzgar gibi esebilme, dostuna sarsılmaz bağlılık.',
    protectivePower: 'Kişiyi durağanlıktan, esaretten ve prangalardan kurtaran fırtına gücü.',
    instinctiveSide: 'Tehlikeyi kilometrelerce öteden koklayıp sürüyü güvenliğe taşıma.',
    shadowTrait: 'Bağlanma korkusu, en ufak kısıtlamada çılgınca kaçma, hırçınlık.',
    unbalancedBehavior: 'Sırf özgür kalmak için güzel ilişkileri tepip arkasına bakmadan gitme.',
    suppressedTrait: 'Bir yerde durup dinlenmeyi ve kök salmayı da bir güç olarak görme.',
    tattooPhysicalFeature: 'Rüzgarda uçuşan yele telekleri, damarları belirgin güçlü boyun, toynak kıvılcımları.',
    gazeDirection: 'Uzak ufuk çizgisine, açık bozkırlara bakan özgür ve asil gözler.',
    headAngle: 'Yukarı kalkık, burun delikleri açık rüzgarı çeken kafa.',
    posture: 'Şaha kalkmış ya da dört nala koşan dinamik kas kütlesi.',
    compositionRole: 'Tasarıma hareket, coşku ve sınırsız özgürlük katan ana güç.',
    recommendedStyles: ['Fine Line', 'Illustrative', 'Dotwork']
  },
  {
    id: 'kafkas_bizonu',
    name: 'Boğa & Bizon (Aurochs)',
    turkishName: 'Kafkas Bizonu',
    element: 'Toprak',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 75, socialConnection: 70, protectiveness: 95, observation: 70,
      courageRisk: 85, patience: 95, adaptability: 60, curiosity: 50, intuition: 75,
      leadership: 85, stealth: 40, resilience: 100, freedomNeed: 80, territorialBoundary: 95,
      cooperation: 70, competitiveness: 85, threatReflex: 95, solitudeNeed: 65, socialEnergy: 45, crisisBehavior: 90
    },
    mainSymbolism: 'Yeryüzünün sarsılmaz ağırlığı, fiziksel kuvvet, bereket ve yıkılmaz sabır.',
    strongSide: 'Tüm yükleri taşıyabilme, maddi istikrar, tükenmeyen enerji rezervi.',
    protectivePower: 'Ailesini ve alanını çevreleyen geçilmez boynuz barikatı.',
    instinctiveSide: 'Toprağın derinliklerindeki su kaynaklarını toynaklarıyla sezme.',
    shadowTrait: 'Kör öfke, aşırı maddeperestlik, değişime karşı betonlaşmış inat.',
    unbalancedBehavior: 'Bir şeye takıldığında gözü dönüp her şeyi yıkana kadar duramama.',
    suppressedTrait: 'İnceliği, zarafeti ve fiziksel güçten bağımsız maneviyatı anlama.',
    tattooPhysicalFeature: 'Devasa boyun kası, kalın kıvrık boynuzlar, toynaklarından kalkan toz bulutu.',
    gazeDirection: 'Yere yakın ama doğrudan karşıdaki engele kilitlenmiş sarsılmaz bakış.',
    headAngle: 'Aşağıya indirilmiş, toynak vuran heybetli boynuz açısı.',
    posture: 'Granit bir anıt gibi yere çakılmış dört ayak üzerinde sarsılmaz blok.',
    compositionRole: 'Kompozisyonun en alt taşıyıcı kaidesi ve zemin gücü.',
    recommendedStyles: ['Blackwork', 'Nordic Tribal', 'Fine Line']
  },
  {
    id: 'cita',
    name: 'Çita (Cheetah)',
    turkishName: 'Hızlı Çita',
    element: 'Ateş',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 85, socialConnection: 35, protectiveness: 70, observation: 92,
      courageRisk: 90, patience: 70, adaptability: 75, curiosity: 75, intuition: 85,
      leadership: 65, stealth: 85, resilience: 75, freedomNeed: 95, territorialBoundary: 80,
      cooperation: 35, competitiveness: 90, threatReflex: 70, solitudeNeed: 80, socialEnergy: 35, crisisBehavior: 90
    },
    mainSymbolism: 'Anlık patlayıcı güç, zarafet, hız, tek hedefe kilitlenme ve esneklik.',
    strongSide: 'Fırsatı anında görüp değerlendirme, olağanüstü ivmelenme, zarafet.',
    protectivePower: 'Durgunluk ve erteleme hastalığını yakan kıvılcım enerjisi.',
    instinctiveSide: 'Avın en zayıf anını saniyenin onda birinde hesaplayıp fırlama.',
    shadowTrait: 'Çabuk tükenme (burnout), sabırsızlık, uzun vadeli sürdürülebilirlik eksikliği.',
    unbalancedBehavior: 'İlk denemede başaramayınca hemen pes edip kenara çekilme.',
    suppressedTrait: 'Dayanıklılığı ve yavaş adımlarla da hedefe varılabileceğini öğrenme.',
    tattooPhysicalFeature: 'Göz altındaki siyah gözyaşı çizgileri, ince uzun omurga, aerodinamik göğüs.',
    gazeDirection: 'İleriye, ufuktaki tek bir noktaya kilitlenmiş pürdikkat odak.',
    headAngle: 'Koşu hattına paralel, rüzgar sürtünmesini sıfırlayan küçük yuvarlak baş.',
    posture: 'Dört ayağı da havada, omurgası yay gibi bükülmüş maksimum hız anı.',
    compositionRole: 'Kompozisyona yatay veya eğik güçlü bir ivme çizgisi katan figür.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork']
  },
  {
    id: 'sessiz_kugu',
    name: 'Kuğu (Mute Swan)',
    turkishName: 'Sessiz Kuğu',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 70, socialConnection: 70, protectiveness: 85, observation: 80,
      courageRisk: 65, patience: 85, adaptability: 70, curiosity: 65, intuition: 90,
      leadership: 60, stealth: 75, resilience: 80, freedomNeed: 85, territorialBoundary: 90,
      cooperation: 70, competitiveness: 55, threatReflex: 80, solitudeNeed: 70, socialEnergy: 50, crisisBehavior: 80
    },
    mainSymbolism: 'Dönüşüm, çirkin ördek yavrusundan saf ışığa geçiş, estetik, sadakat ve saflık.',
    strongSide: 'Kendi değerini keşfetme, kalbi arınma, ömür boyu süren sadakat.',
    protectivePower: 'Kişinin özsaygısını zedeleyen çirkinlikleri ve aşağılamaları püskürtme.',
    instinctiveSide: 'Kendi kanatlarının altındaki koruyucu sıcaklığı sevdiklerine sunma.',
    shadowTrait: 'Züppelik, başkalarını küçümseme, çirkin ve kusurlu olan her şeyden iğrenme.',
    unbalancedBehavior: 'Kusursuz görünmek için duygularını donuk bir zarafetin ardına saklama.',
    suppressedTrait: 'Kendi içindeki kusurları ve ham tarafları da sevgiyle kabul etme.',
    tattooPhysicalFeature: 'Kusursuz S kavisli boyun, göl suyunda yansıyan kanatlar, siyah gaga maskesi.',
    gazeDirection: 'Suya yansıyan kendi görüntüsüne ve oradan göğe bakan dingin bakış.',
    headAngle: 'Aşağıya zarifçe bükülmüş, kalbi koruyan kuğu boynu eğrisi.',
    posture: 'Durgun göl yüzeyinde dalga yaratmadan süzülen heykelsi zarafet.',
    compositionRole: 'Merkezi yumuşatan ve kadınsı hatları vücuda oturtan kavis.',
    recommendedStyles: ['Fine Line', 'Minimalist', 'Dotwork']
  },
  {
    id: 'kizil_geyik',
    name: 'Geyik (Red Stag)',
    turkishName: 'Boynuzlu Kızıl Geyik',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 80, socialConnection: 60, protectiveness: 80, observation: 95,
      courageRisk: 75, patience: 85, adaptability: 80, curiosity: 80, intuition: 95,
      leadership: 80, stealth: 85, resilience: 85, freedomNeed: 90, territorialBoundary: 85,
      cooperation: 60, competitiveness: 80, threatReflex: 75, solitudeNeed: 75, socialEnergy: 50, crisisBehavior: 85
    },
    mainSymbolism: 'Ormanın tacı, zarafet, ruhsal antenler (boynuzlar), asalet ve kalp saflığı.',
    strongSide: 'Ormanın en derin sırlarını duyma, yüksek zarafet, kötülük bilmeyen asalet.',
    protectivePower: 'Masumiyeti ve kalbin kırılgan tapınağını koruyan ilahi ışık kalkanı.',
    instinctiveSide: 'Dal çıtırtısından tehlikenin yönünü ve niyetini anında sezme.',
    shadowTrait: 'Aşırı ürkeklik, en ufak seste her şeyi bırakıp kaçma, kurban psikolojisi.',
    unbalancedBehavior: 'Sorunlarla yüzleşmek yerine sürekli ormanın derinliklerine kaçıp saklanma.',
    suppressedTrait: 'Gerektiğinde boynuzlarını kalkan yapıp savaşabilme cüreti.',
    tattooPhysicalFeature: 'Fraktal dallı görkemli boynuzlar, nemli masum gözler, ince uzun bacaklar.',
    gazeDirection: 'Sislerin arasından doğrudan izleyiciye bakan mistik ve şefkatli gözler.',
    headAngle: 'Hafif yukarı kalkık, boynuzlarının ağırlığını gururla taşıyan asil baş.',
    posture: 'Yosunlu bir tepecikte durmuş, tek ayağı hafif önde tetikte sükunet.',
    compositionRole: 'Tasarımın göğe uzanan taç ve zarafet tepesi.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Sacred Geometry']
  },
  {
    id: 'su_samuru',
    name: 'Su Samuru (River Otter)',
    turkishName: 'Nehir Samuru',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 60, socialConnection: 90, protectiveness: 80, observation: 80,
      courageRisk: 70, patience: 60, adaptability: 95, curiosity: 98, intuition: 85,
      leadership: 60, stealth: 65, resilience: 80, freedomNeed: 85, territorialBoundary: 60,
      cooperation: 90, competitiveness: 45, threatReflex: 65, solitudeNeed: 35, socialEnergy: 95, crisisBehavior: 80
    },
    mainSymbolism: 'Oyuncu bilgelik, neşe, kaygısızlık, merak, akıntıya uyum ve şefkat.',
    strongSide: 'Hayatı bir oyun gibi yaşama, en zorlu fırtınada bile neşesini yitirmeme.',
    protectivePower: 'Ağır kaygı ve kasvet enerjisini nehir sularıyla yıkayıp atma.',
    instinctiveSide: 'Nehir yatağındaki en gizli taşların altındaki hazineleri bulabilme.',
    shadowTrait: 'Sorumsuzluk, ciddiye alınması gereken anlarda kaçıp oyuna sığınma.',
    unbalancedBehavior: 'Zorlu kriz anlarında gerçekleri görmezden gelip dalga geçme.',
    suppressedTrait: 'Derinleşme ve sorumluluk alıp sebatla kalabilme disiplini.',
    tattooPhysicalFeature: 'İpeksi ıslak kürk, sevimli bıyıklar, taş tutan usta patiler.',
    gazeDirection: 'Su yüzeyinden merakla dışarı bakan neşeli ve kıpır kıpır gözler.',
    headAngle: 'Yana yatık, oyuncu bir merakla çevreyi süzen açı.',
    posture: 'Sırtüstü suda yüzen, göğsünde taş veya deniz kabuğu tutan sevimli duruş.',
    compositionRole: 'Tasarıma hafiflik, neşe ve esnek akışkanlık katan figür.',
    recommendedStyles: ['Fine Line', 'Illustrative', 'Dotwork']
  },
  {
    id: 'avrasya_vasagi',
    name: 'Vaşak (Eurasian Lynx)',
    turkishName: 'Avrasya Vaşağı',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 70, observation: 98,
      courageRisk: 80, patience: 95, adaptability: 85, curiosity: 85, intuition: 95,
      leadership: 60, stealth: 98, resilience: 90, freedomNeed: 95, territorialBoundary: 90,
      cooperation: 20, competitiveness: 65, threatReflex: 85, solitudeNeed: 98, socialEnergy: 15, crisisBehavior: 90
    },
    mainSymbolism: 'Gizli gerçeklerin bekçisi, kulak püskülleri (telepatik antenler), hayalet adımlar.',
    strongSide: 'İnsanların göremediği ve duyamadığı frekansları çözme, tam görünmezlik.',
    protectivePower: 'Kişinin mahremiyetini ve sırlarını aşılmaz bir sis perdesiyle koruma.',
    instinctiveSide: 'Karda yürürken tek bir çıtırtı bile çıkarmadan yüzlerce kilometre ilerleme.',
    shadowTrait: 'Aşırı güvensizlik, dünyaya tamamen kapanma, misantropi (insanlardan nefret etme).',
    unbalancedBehavior: 'En ufak kalabalıkta bile panikleyip herkesten kaçma.',
    suppressedTrait: 'İnsanlara güvenip sevgiyi ve sıcak iletişimi kabul edebilme.',
    tattooPhysicalFeature: 'Kulak uçlarındaki siyah püsküller, kısa küt kuyruk, karda batmayan geniş patiler.',
    gazeDirection: 'Kaya kovuğundan geleceği süzen altın sarısı derin gözler.',
    headAngle: 'Kulakları dikilmiş, fısıltıları dinleyen hafif kalkık baş.',
    posture: 'Karlı çam dalında sessizce oturmuş, pusudaki hayalet duruş.',
    compositionRole: 'Gizemli mikro detaylar ve derinlik katan mistik kedi figürü.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork']
  },
  {
    id: 'kutup_ayisi',
    name: 'Kutup Ayısı (Polar Bear)',
    turkishName: 'Kutup Ayısı',
    element: 'Su',
    realm: 'Tundra & Kutup',
    behavioralVector: {
      independence: 95, socialConnection: 20, protectiveness: 95, observation: 85,
      courageRisk: 90, patience: 95, adaptability: 85, curiosity: 70, intuition: 85,
      leadership: 85, stealth: 80, resilience: 100, freedomNeed: 95, territorialBoundary: 95,
      cooperation: 20, competitiveness: 85, threatReflex: 95, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 95
    },
    mainSymbolism: 'Buz çöllerinde hayatta kalma, mutlak dayanıklılık, yalnız irade ve kutup gücü.',
    strongSide: 'En dondurucu soğukta bile yüzlerce mil yüzebilme, tükenmez içsel ateş.',
    protectivePower: 'Kişinin kalbini dış dünyanın dondurucu sevgisizliğinden koruyan sıcak yağ tabakası.',
    instinctiveSide: 'Buzun altındaki nefes deliklerini kilometrelerce öteden koklayıp bulma.',
    shadowTrait: 'Duygusal donukluk, aşırı sertlik, zayıflığa ve gözyaşına tahammülsüzlük.',
    unbalancedBehavior: 'Duygusal yakınlık kurulduğunda buz kesilip karşısındakini dondurma.',
    suppressedTrait: 'Sıcaklığı, yumuşamayı ve kendi kırılganlığını kucaklayabilme.',
    tattooPhysicalFeature: 'Bembeyaz kalın post, siyah burun ve dudaklar, devasa yüzücü patiler.',
    gazeDirection: 'Buz kütlelerinin üzerinden sonsuz beyaz ufka bakan vakur bakış.',
    headAngle: 'Aşağıdan yukarıya doğru uzanmış, kokuyu içine çeken baş açısı.',
    posture: 'Kırılan buz dağının üzerinde dimdik duran sarsılmaz monolitik güç.',
    compositionRole: 'Kompozisyonun en anıtsal ve beyaz negatif alan taşıyıcısı.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Blackwork']
  },
  {
    id: 'albatros',
    name: 'Albatros (Wandering Albatross)',
    turkishName: 'Gezgin Albatros',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 95, socialConnection: 35, protectiveness: 70, observation: 85,
      courageRisk: 90, patience: 95, adaptability: 90, curiosity: 90, intuition: 90,
      leadership: 60, stealth: 60, resilience: 98, freedomNeed: 100, territorialBoundary: 40,
      cooperation: 40, competitiveness: 40, threatReflex: 60, solitudeNeed: 90, socialEnergy: 30, crisisBehavior: 85
    },
    mainSymbolism: 'Sonsuz seyahat, okyanusları aşan kanatlar, fırtınalarla dans ve sadakat.',
    strongSide: 'Kanat çırpmadan binlerce mil süzülebilme, rüzgar enerjisini bedava kullanma.',
    protectivePower: 'Tükenmişlik ve yorgunluk dalgalarını aerodinamik zarafetle aşma.',
    instinctiveSide: 'Fırtınanın merkezindeki hava akımlarını kullanarak yükselme.',
    shadowTrait: 'Hiçbir yere kök salamama, sürekli gitme arzusu, yersiz yurtsuzluk.',
    unbalancedBehavior: 'Bir yerde düzen kurulduğu an kaçma krizine girme.',
    suppressedTrait: 'Bir yuvaya ve toprağa ait olmanın da kutsallığını fark etme.',
    tattooPhysicalFeature: '3.5 metreye varan devasa kanat açıklığı, kavisli pembe gaga, rüzgarı yaran telekler.',
    gazeDirection: 'Fırtınalı deniz dalgalarına ve ufuk çizgisine bakan sakin bakış.',
    headAngle: 'Rüzgara paralel uzatılmış aerodinamik baş.',
    posture: 'Dalgaların üzerinde kanatlarını hiç çırpmadan süzülen kusursuz denge.',
    compositionRole: 'Tüm kompozisyonu yatayda kucaklayan en geniş kanat açıklığı.',
    recommendedStyles: ['Fine Line', 'Minimalist', 'Dotwork']
  },
  {
    id: 'kirpi',
    name: 'Kirpi (Porcupine)',
    turkishName: 'Zırhlı Kirpi',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 90, socialConnection: 20, protectiveness: 95, observation: 75,
      courageRisk: 50, patience: 90, adaptability: 70, curiosity: 75, intuition: 80,
      leadership: 40, stealth: 75, resilience: 95, freedomNeed: 85, territorialBoundary: 95,
      cooperation: 25, competitiveness: 40, threatReflex: 95, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 85
    },
    mainSymbolism: 'Kişisel sınırlar, dikenli zırh, masum iç dünya, savunma ve barışçıl duruş.',
    strongSide: 'Kimseye saldırmadan kendi sınırlarını aşılmaz bir kale haline getirme.',
    protectivePower: 'İstismarcıları ve sınır ihlali yapanları anında pişman eden diken kalkanı.',
    instinctiveSide: 'Tehdit anında top gibi kıvrılıp en hassas karnını koruma refleksi.',
    shadowTrait: 'Aşırı alınganlık, herkesi düşman sanıp sürekli dikenlerini dik tutma.',
    unbalancedBehavior: 'Sevdiklerini bile dikenleriyle yaralayıp yalnızlığa mahkum olma.',
    suppressedTrait: 'Dikenlerini indirip yumuşak karnını güvendiği birine açabilme cesareti.',
    tattooPhysicalFeature: 'İğne iğne dotwork dikenler, sevimli küçük burun, kıvrık koruyucu form.',
    gazeDirection: 'Dikenlerinin arasından merakla dışarı bakan masum gözler.',
    headAngle: 'Gövdesinin içine çekilmiş, tetikte duruş.',
    posture: 'Dairesel küre formunda toplanmış, geometrik koruma çemberi.',
    compositionRole: 'Kişisel sınırları temsil eden dairesel mikro koruma sembolü.',
    recommendedStyles: ['Dotwork', 'Fine Line', 'Geometric']
  },
  {
    id: 'beyaz_gergedan',
    name: 'Gergedan (White Rhinoceros)',
    turkishName: 'Zırhlı Gergedan',
    element: 'Toprak',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 85, socialConnection: 30, protectiveness: 90, observation: 65,
      courageRisk: 85, patience: 90, adaptability: 60, curiosity: 50, intuition: 75,
      leadership: 75, stealth: 35, resilience: 100, freedomNeed: 85, territorialBoundary: 95,
      cooperation: 35, competitiveness: 80, threatReflex: 95, solitudeNeed: 85, socialEnergy: 30, crisisBehavior: 90
    },
    mainSymbolism: 'Kalın deri (zırh), boynuz gücü, toprak kadimliği, sarsılmaz duruş ve yalnız güç.',
    strongSide: 'Dışarıdan gelen hakaretleri ve darbeleri hissetmeyen kalın deri kalkanı.',
    protectivePower: 'Kişinin kalbini dış dünyanın hoyratlığından koruyan zırh tabakası.',
    instinctiveSide: 'Görme duyusu zayıf olsa da kokuları ve sesleri mükemmel ayırt etme.',
    shadowTrait: 'Duyarsızlaşma, hissizlik, karşısındakinin acısını anlayamama.',
    unbalancedBehavior: 'Bir şeye kızdığında durmadan ileriye hücum edip köprüleri yıkma.',
    suppressedTrait: 'Hassasiyetini ve duyarlılığını bir zaaf değil bir zenginlik olarak kabul etme.',
    tattooPhysicalFeature: 'Plakalar halinde zırhlı deri kıvrımları, heybetli dev boynuz, toynak gücü.',
    gazeDirection: 'Toprağa yakın ama doğrudan hedefe bakan kararlı bakış.',
    headAngle: 'Aşağı indirilmiş, boynuzu önde sağlam hücum açısı.',
    posture: 'Toprağa çakılı, dört ayağı üzerinde sarsılmaz monolitik blok.',
    compositionRole: 'Kompozisyonun en sağlam zemin ve ağırlık merkezi.',
    recommendedStyles: ['Blackwork', 'Fine Line', 'Tribal']
  },
  {
    id: 'sakalli_akbaba',
    name: 'Akbaba & Hüma (Lammergeier)',
    turkishName: 'Sakallı Akbaba',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 95, socialConnection: 20, protectiveness: 65, observation: 95,
      courageRisk: 80, patience: 98, adaptability: 80, curiosity: 85, intuition: 90,
      leadership: 65, stealth: 70, resilience: 98, freedomNeed: 98, territorialBoundary: 75,
      cooperation: 25, competitiveness: 50, threatReflex: 65, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 85
    },
    mainSymbolism: 'Simyasal dönüşüm, kemikleri una çevirme, ölümden hayat çıkarma, saflık.',
    strongSide: 'Başkalarının çöp veya felaket dediği şeylerden en saf cevheri çıkarabilme.',
    protectivePower: 'Karmik artıkları ve psişik zehirleri yutup arındıran simya aurası.',
    instinctiveSide: 'Kayalıkları kullanarak kemikleri kırıp iliklerine ulaşma zekası.',
    shadowTrait: 'Felaket tellallığı, krizlerden beslenme, ölüm ve yıkım takıntısı.',
    unbalancedBehavior: 'İyi giden şeylerin içinde bile bir çürüme ve felaket arama.',
    suppressedTrait: 'Saf neşeyi ve doğumun getirdiği taze umudu kucaklama.',
    tattooPhysicalFeature: 'Gaga altındaki siyah sakal kılları, kızıl pas rengi göğüs, geniş kanatlar.',
    gazeDirection: 'Kanyonun derinliklerinden yukarıya bakan bilge ve gizemli gözler.',
    headAngle: 'Hafif yana eğik, gözlemleyen bilge simyacı duruşu.',
    posture: 'Sarp kayalık kenarında tünemiş, rüzgara karşı dimdik kanat açıklığı.',
    compositionRole: 'Kompozisyona ezoterik simya ve dönüşüm katan derin odak.',
    recommendedStyles: ['Dark Surrealism', 'Dotwork', 'Fine Line']
  },
  {
    id: 'kara_karga',
    name: 'Karga (Crow)',
    turkishName: 'Zeki Kara Karga',
    element: 'Hava',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 80, socialConnection: 75, protectiveness: 75, observation: 98,
      courageRisk: 75, patience: 80, adaptability: 98, curiosity: 100, intuition: 88,
      leadership: 60, stealth: 80, resilience: 90, freedomNeed: 85, territorialBoundary: 70,
      cooperation: 85, competitiveness: 65, threatReflex: 70, solitudeNeed: 60, socialEnergy: 65, crisisBehavior: 90
    },
    mainSymbolism: 'Araç kullanma zekası, kolektif bellek, problem çözme, yoldaşlık ve uyarı.',
    strongSide: 'Hiçbir engelde tıkanmama, alet yapıp zor düğümleri açma, yüzleri unutmama.',
    protectivePower: 'Dostlarına yaklaşan tehlikeleri çığlıklarla haber veren erken uyarı sistemi.',
    instinctiveSide: 'Aynadaki kendi görüntüsünü ve karmaşık mantık bulmacalarını kavrama.',
    shadowTrait: 'Kin tutma, hırsızlık, parlak şeylere körü körüne kapılma, dedikoduculuk.',
    unbalancedBehavior: 'Yıllar önce yapılan bir hatayı unutmayıp intikam planları yapma.',
    suppressedTrait: 'Affetmeyi ve geçmişin yüklerini bırakabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Kömür karası tüy ışıltısı, düz güçlü gaga, parlayan zeki gözler.',
    gazeDirection: 'Bir dalın üzerinden izleyiciyi süzen hiper-zeki ve meraklı bakış.',
    headAngle: 'Merakla yana bükülmüş, bulmaca çözen baş açısı.',
    posture: 'Tünemiş, pençelerinde anahtar veya geometrik bir cisim tutan duruş.',
    compositionRole: 'Tasarıma zeka, anahtar ve gizli mesajlar katan motif.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Illustrative']
  },
  {
    id: 'zumrut_yusufcuk',
    name: 'Yusufçuk (Dragonfly)',
    turkishName: 'Zümrüt Yusufçuk',
    element: 'Hava',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 85, socialConnection: 30, protectiveness: 50, observation: 95,
      courageRisk: 75, patience: 70, adaptability: 95, curiosity: 90, intuition: 95,
      leadership: 40, stealth: 85, resilience: 80, freedomNeed: 95, territorialBoundary: 65,
      cooperation: 30, competitiveness: 60, threatReflex: 75, solitudeNeed: 80, socialEnergy: 40, crisisBehavior: 85
    },
    mainSymbolism: 'Yanılsamaları aşma (Maya peçesi), 360 derece uçuş, hafiflik ve ışık kırılması.',
    strongSide: 'Havada asılı kalabilme, geriye ve yana uçabilme, ışığın renklerini saçma.',
    protectivePower: 'Zihinsel illüzyonları ve sahte vesveseleri ışık huzmeleriyle dağıtma.',
    instinctiveSide: 'Sudaki larvalıktan gökyüzünün en çevik avcısına dönüşme sırrı.',
    shadowTrait: 'Yüzeyde uçuşma, bir konuya derinleşememe, ışık oyunlarıyla kendini kandırma.',
    unbalancedBehavior: 'Sürekli yenilik arayışıyla elindekilerin kıymetini bilmeme.',
    suppressedTrait: 'Toprağa basıp sabit bir ağırlıkla kalabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Mikro dotwork tül kanat damarları, metalik zümrüt gövde, iri bileşik gözler.',
    gazeDirection: 'Her yöne aynı anda bakan 360 derece kristalize farkındalık.',
    headAngle: 'Düz, havada asılı kalmış hafif duruş.',
    posture: 'Nilüfer yaprağının ucuna konmuş, kanatları iki yana açık prizmatik parıltı.',
    compositionRole: 'Kompozisyona hafiflik, tül dokusu ve ışık kırılması katan unsur.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork']
  },
  {
    id: 'ates_semenderi',
    name: 'Semender (Fire Salamander)',
    turkishName: 'Ateş Semenderi',
    element: 'Ateş',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 85, socialConnection: 25, protectiveness: 65, observation: 85,
      courageRisk: 70, patience: 90, adaptability: 90, curiosity: 80, intuition: 90,
      leadership: 45, stealth: 90, resilience: 95, freedomNeed: 85, territorialBoundary: 75,
      cooperation: 30, competitiveness: 40, threatReflex: 65, solitudeNeed: 90, socialEnergy: 25, crisisBehavior: 85
    },
    mainSymbolism: 'Ateşten etkilenmeme, yenilenme (uzuvlarını yeniden çıkarma), simya ateşi.',
    strongSide: 'Küllerin ve alevlerin içinde yaşayabilme, kopan parçalarını yeniden üretme.',
    protectivePower: 'Kişiyi yakan acıları ve travmaları ruhsal zırha dönüştürme gücü.',
    instinctiveSide: 'Ateşin en sıcak anında bile serinliğini koruyan nemli deri.',
    shadowTrait: 'Zehirli savunma, yaklaşan herkesi yakma veya zehirleme eğilimi.',
    unbalancedBehavior: 'İncinmemek için etrafındaki her ilişkiyi ateşe verip kaçma.',
    suppressedTrait: 'Ateşin yanında suyun da ferahlığını kabul edip yumuşayabilme.',
    tattooPhysicalFeature: 'Sarı-siyah zıt desenler, nemli parlak deri, spiral kuyruk ucu.',
    gazeDirection: 'Ateş çemberinin içinden dış dünyaya bakan sakin ve yanmayan gözler.',
    headAngle: 'Hafif yukarı kalkık, havayı koklayan küçük bilge baş.',
    posture: 'Közlerin üzerinde kavis çizerek yürüyen sarmal sürüngen hattı.',
    compositionRole: 'Ateş ve dönüşüm elementini bedene sabitleyen kıvılcım sembolü.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Illustrative']
  },
  {
    id: 'deniz_kaplumbagasi',
    name: 'Kaplumbağa (Sea Turtle)',
    turkishName: 'Bilge Deniz Kaplumbağası',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 80, socialConnection: 40, protectiveness: 90, observation: 85,
      courageRisk: 55, patience: 100, adaptability: 85, curiosity: 75, intuition: 95,
      leadership: 50, stealth: 65, resilience: 98, freedomNeed: 90, territorialBoundary: 40,
      cooperation: 45, competitiveness: 20, threatReflex: 60, solitudeNeed: 85, socialEnergy: 30, crisisBehavior: 85
    },
    mainSymbolism: 'Yeryüzü ananın hafızası, okyanus akıntıları, uzun ömür, sabır ve koruyucu kabuk.',
    strongSide: 'Yüzyıllarca süren seyahat, binlerce mil ötedeki doğum kumsalını şaşmadan bulma.',
    protectivePower: 'Hayatın tüm darbelerini emip geri yansıtan kutsal geometrik kabuk.',
    instinctiveSide: 'Dünyanın manyetik alanını algılayıp pusulasız okyanusları aşma.',
    shadowTrait: 'Aşırı yavaşlık, kabuğuna çekilip dünyayı unutma, eylemsizlik.',
    unbalancedBehavior: 'Zorluklarla karşılaştığında tamamen içeri çekilip hayatı kaçırma.',
    suppressedTrait: 'Hızlanabilmeyi ve gerektiğinde kabuğunun dışına çıkıp risk alabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Geometrik plakalı kabuk, kürek benzeri güçlü yüzgeçler, bilge kırışık yüz.',
    gazeDirection: 'Mercan resiflerinin üzerinden sonsuz mavi akıntıya bakan dingin bakış.',
    headAngle: 'Kabuğundan dışarı uzanmış, süzülen bilge baş.',
    posture: 'Derin mavilikte yerçekimsiz gibi süzülen kutsal yavaşlık.',
    compositionRole: 'Tasarıma kutsal geometri, sonsuz sabır ve koruma katan merkez.',
    recommendedStyles: ['Sacred Geometry', 'Dotwork', 'Fine Line']
  },
  {
    id: 'sempanze',
    name: 'Primat (Chimpanzee)',
    turkishName: 'Sosyal Şempanze',
    element: 'Hava',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 55, socialConnection: 95, protectiveness: 90, observation: 90,
      courageRisk: 80, patience: 65, adaptability: 92, curiosity: 98, intuition: 85,
      leadership: 85, stealth: 60, resilience: 85, freedomNeed: 80, territorialBoundary: 85,
      cooperation: 95, competitiveness: 85, threatReflex: 85, solitudeNeed: 30, socialEnergy: 95, crisisBehavior: 90
    },
    mainSymbolism: 'Topluluk zekası, duygusal empati, alet kullanımı, hiyerarşi ve aile bağı.',
    strongSide: 'Karmaşık sosyal ağları yönetme, dayanışma, kriz anında birlik olma.',
    protectivePower: 'Ailesine ve kabilesine yönelen tehditleri kolektif güçle püskürtme.',
    instinctiveSide: 'Göz teması ve dokunuşla karşısındakinin ruh halini anında hissetme.',
    shadowTrait: 'Kabilecilik, dışlayıcılık, hiyerarşi kavgası, politik manipülasyon.',
    unbalancedBehavior: 'Grupta üstünlük kurmak için güç gösterisi yapıp zayıfları ezme.',
    suppressedTrait: 'Kendi bireysel yalnızlığıyla barışabilme ve onay arayışından kurtulma.',
    tattooPhysicalFeature: 'İnsan benzeri usta eller, derin düşünen gözler, kaslı esnek kollar.',
    gazeDirection: 'Doğrudan karşıya bakan, insan ruhunu sorgulayan derin gözler.',
    headAngle: 'Hafif öne eğik, düşünen ve tartan bilge primat açısı.',
    posture: 'Ağaç dalında oturmuş, bir eliyle yavrusunu veya bir aleti tutan duruş.',
    compositionRole: 'Tasarıma insan-doğa köprüsü ve yüksek empati katan sembol.',
    recommendedStyles: ['Fine Line', 'Micro Realism', 'Dotwork']
  },
  {
    id: 'orka',
    name: 'Orka (Killer Whale)',
    turkishName: 'Katil Balina / Orka',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 70, socialConnection: 98, protectiveness: 98, observation: 92,
      courageRisk: 95, patience: 85, adaptability: 85, curiosity: 90, intuition: 95,
      leadership: 92, stealth: 75, resilience: 98, freedomNeed: 90, territorialBoundary: 85,
      cooperation: 100, competitiveness: 80, threatReflex: 95, solitudeNeed: 35, socialEnergy: 90, crisisBehavior: 95
    },
    mainSymbolism: 'Kusursuz takım stratejisi, okyanusun zirve avcısı, aile sevgisi ve ses frekansı.',
    strongSide: 'Dünyanın en zeki kolektif av stratejileri, birbirini asla terk etmeyen aile bağı.',
    protectivePower: 'Ailesini okyanusun en büyük fırtınalarından ve düşmanlarından koruyan zırh.',
    instinctiveSide: 'Buz kütlesini dalga yaratarak kırma zekası ve telepatik ıslıklar.',
    shadowTrait: 'Acımasız güç kullanımı, kurbanıyla oynama, kabile dışındakilere merhametsizlik.',
    unbalancedBehavior: 'Kendi grubuna aşırı bağlanıp dış dünyaya karşı acımasızlaşma.',
    suppressedTrait: 'Tek başına kaldığında da kimliğini ve dengesini koruyabilme.',
    tattooPhysicalFeature: 'Siyah-beyaz kusursuz kontrast, heybetli dikey sırt yüzgeci, zarif kavisler.',
    gazeDirection: 'Gözünün arkasındaki beyaz lekeyle izleyiciyi büyüleyen derin bakış.',
    headAngle: 'Suyun yüzeyine doğru fırlayan dik ve güçlü kafa.',
    posture: 'Okyanus dalgasını yararak göğe sıçrayan monolitik zarafet.',
    compositionRole: 'Siyah ve beyazın en keskin kontrastını taşıyan anıtsal figür.',
    recommendedStyles: ['Blackwork', 'Fine Line', 'Geometric']
  },
  {
    id: 'imparator_penguen',
    name: 'Penguen (Emperor Penguin)',
    turkishName: 'İmparator Penguen',
    element: 'Su',
    realm: 'Tundra & Kutup',
    behavioralVector: {
      independence: 50, socialConnection: 98, protectiveness: 100, observation: 80,
      courageRisk: 75, patience: 100, adaptability: 85, curiosity: 70, intuition: 85,
      leadership: 70, stealth: 50, resilience: 100, freedomNeed: 65, territorialBoundary: 40,
      cooperation: 100, competitiveness: 20, threatReflex: 70, solitudeNeed: 25, socialEnergy: 95, crisisBehavior: 90
    },
    mainSymbolism: 'Kutsal ebeveynlik, -60 derecede fedakarlık, kucaklaşma, sarsılmaz sabır.',
    strongSide: 'Aylarca fırtınada kımıldamadan yumurtayı ayakları üstünde ısıtma iradesi.',
    protectivePower: 'Kolektif sevgi çemberiyle dondurucu ölüme karşı yaşamı koruma gücü.',
    instinctiveSide: 'Binlerce sesin içinden eşinin ve yavrusunun sesini tek seferde tanıma.',
    shadowTrait: 'Aşırı sürü psikolojisi, tek başına karar verememe, bireysellikten korkma.',
    unbalancedBehavior: 'Topluluk olmadan hiçbir adım atamama ve kalabalığa bağımlı olma.',
    suppressedTrait: 'Kendi başına da güçlü bir birey olarak var olabileceğini keşfetme.',
    tattooPhysicalFeature: 'Smokin zarafeti, boyun altındaki altın sarısı tüy geçişi, sağlam basış.',
    gazeDirection: 'Buz fırtınasının ortasında yavrusuna şefkatle bakan asil gözler.',
    headAngle: 'Aşağıya, göğsündeki yuvaya eğilmiş koruyucu baş açısı.',
    posture: 'Topukları üzerinde dik duran, kanatlarını iki yana hafif açmış heykel.',
    compositionRole: 'Tasarıma sarsılmaz sadakat ve fedakar koruma enerjisi katan motif.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Minimalist']
  },
  {
    id: 'pembe_flamingo',
    name: 'Flamingo (Flamingo)',
    turkishName: 'Zarif Flamingo',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 55, socialConnection: 90, protectiveness: 70, observation: 75,
      courageRisk: 55, patience: 90, adaptability: 80, curiosity: 75, intuition: 85,
      leadership: 55, stealth: 55, resilience: 85, freedomNeed: 80, territorialBoundary: 50,
      cooperation: 90, competitiveness: 45, threatReflex: 50, solitudeNeed: 40, socialEnergy: 90, crisisBehavior: 75
    },
    mainSymbolism: 'Tek bacak üzerinde denge, zarafet, pembe simya (besinden renk üretme), topluluk.',
    strongSide: 'Kaosun içinde tek ayak üstünde sarsılmadan meditasyon yapabilme dengesi.',
    protectivePower: 'Kişinin aurik dengesini ve zarafetini kaba saldırılara karşı koruma.',
    instinctiveSide: 'Tuzlu ve zehirli sularda bile şifa bularak rengini pembeye dönüştürme.',
    shadowTrait: 'Dış görünüş takıntısı, züppelik, sürüden ayrılma korkusu.',
    unbalancedBehavior: 'Kendi rengini ve tarzını korumak yerine çevresinin onayına kilitlenme.',
    suppressedTrait: 'Çirkinliği ve ham gerçekleri de zarafet kadar kucaklayabilme.',
    tattooPhysicalFeature: 'Zarif S kavisli ince boyun, uzun narin bacaklar, eğri gaga yapısı.',
    gazeDirection: 'Aynalı su yüzeyine ve göğe bakan meditatif ve dingin gözler.',
    headAngle: 'Tüylerinin arasına gömülmüş ya da zarifçe yukarı kalkık kavis.',
    posture: 'Tek bacak üzerinde duran, suyun üstünde nilüfer gibi açan zarafet.',
    compositionRole: 'Kompozisyona kadınsı denge, hafiflik ve estetik katan eğri hat.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Minimalist']
  },
  {
    id: 'yaban_tavsani',
    name: 'Tavşan (Wild Hare)',
    turkishName: 'Çevik Yaban Tavşanı',
    element: 'Hava',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 75, socialConnection: 50, protectiveness: 65, observation: 98,
      courageRisk: 50, patience: 60, adaptability: 90, curiosity: 95, intuition: 98,
      leadership: 35, stealth: 90, resilience: 75, freedomNeed: 95, territorialBoundary: 60,
      cooperation: 50, competitiveness: 55, threatReflex: 60, solitudeNeed: 75, socialEnergy: 45, crisisBehavior: 80
    },
    mainSymbolism: 'Ay döngüleri, sezgisel uyanış, ani sıçrama, bereket ve algı açıklığı.',
    strongSide: 'Tehlikeyi saniyeler önce duyup zikzaklar çizerek tuzaklardan kurtulma.',
    protectivePower: 'Ani zikzak manevralarıyla kişiyi pusu ve komplolardan kurtarma.',
    instinctiveSide: 'Ay ışığında dans ederek yeraltı tünelleriyle bağlantı kurma.',
    shadowTrait: 'Kronik panik, korku bağımlılığı, her gölgeden ürküp felç olma.',
    unbalancedBehavior: 'Hiçbir tehlike yokken bile kaçıp saklanarak fırsatları tepme.',
    suppressedTrait: 'Cesurca durup korkusunun gözünün içine bakabilme gücü.',
    tattooPhysicalFeature: 'Uzun dik kulaklar, arkaya doğru uzanan güçlü bacaklar, bıyıklar.',
    gazeDirection: 'Ay döngüsüne bakan geniş açılı uyanık ve parıltılı gözler.',
    headAngle: 'Hafif yukarı kalkık, rüzgardaki fısıltıyı dinleyen baş.',
    posture: 'Havada zıplamış ya da arka ayakları üzerinde dikilmiş uyanık heykel.',
    compositionRole: 'Tasarıma ay sembolizmi, çeviklik ve organik sıçrama katan figür.',
    recommendedStyles: ['Fine Line', 'Illustrative', 'Dotwork']
  },
  {
    id: 'orman_karincasi',
    name: 'Karınca (Forest Ant)',
    turkishName: 'Orman Karıncası',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 30, socialConnection: 100, protectiveness: 100, observation: 85,
      courageRisk: 85, patience: 100, adaptability: 90, curiosity: 80, intuition: 80,
      leadership: 70, stealth: 60, resilience: 100, freedomNeed: 40, territorialBoundary: 95,
      cooperation: 100, competitiveness: 60, threatReflex: 95, solitudeNeed: 15, socialEnergy: 95, crisisBehavior: 95
    },
    mainSymbolism: 'Kendi ağırlığının 50 katını taşıma, kusursuz nizam, kolektif irade ve sebat.',
    strongSide: 'Hiçbir yükten kaçmama, yıkılan koloniyi binlerce kez yeniden kurabilme.',
    protectivePower: 'Birlik ruhuyla devasa engelleri ve düşmanları dize getirme kalkanı.',
    instinctiveSide: 'Feromon izlerini takip ederek en karmaşık labirentten çıkma.',
    shadowTrait: 'Bireyselliği tamamen yok etme, körü körüne itaat, kendi isteklerini unutma.',
    unbalancedBehavior: 'Sistem veya iş uğruna kendini tüketene kadar durmaksızın çalışma.',
    suppressedTrait: 'Kendi kişisel arzu ve hayallerine de alan açabilme cesareti.',
    tattooPhysicalFeature: 'Üç boğumlu gövde mimarisi, antenler, güçlü çene kıskaçları.',
    gazeDirection: 'Koloninin ortak hedefine kilitlenmiş kararlı bakış.',
    headAngle: 'Öne eğik, yükü kavramış sağlam duruş açısı.',
    posture: 'Taşın üzerinde ilerleyen, ayakları zemine kenetlenmiş sarsılmaz duruş.',
    compositionRole: 'Kutsal geometri ve mikroskobik dayanıklılık detayları.',
    recommendedStyles: ['Micro Realism', 'Dotwork', 'Fine Line', 'Geometric']
  },
  {
    id: 'kartal_baykusu',
    name: 'Puhu / Kartal Baykuşu (Eagle Owl)',
    turkishName: 'Puhu / Kartal Baykuşu',
    element: 'Hava',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 95, socialConnection: 20, protectiveness: 85, observation: 98,
      courageRisk: 85, patience: 95, adaptability: 80, curiosity: 85, intuition: 95,
      leadership: 75, stealth: 95, resilience: 92, freedomNeed: 95, territorialBoundary: 95,
      cooperation: 25, competitiveness: 75, threatReflex: 85, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 90
    },
    mainSymbolism: 'Gecenin mutlak hükümdarı, sessiz kanatlar, kadim yargıç ve derin sır bilimi.',
    strongSide: 'Karanlıkta kartal kadar güçlü avlanma, en ufak fısıltıyı metrelerce öteden duyma.',
    protectivePower: 'Karanlıkta pusu kuran negatif niyetleri pençeleriyle yok etme.',
    instinctiveSide: 'Ormanın en yüksek kayalığında oturup tüm vadiyi teftiş etme.',
    shadowTrait: 'Yargılayıcılık, merhametsizlik, gece kibri ve insanlardan tiksinme.',
    unbalancedBehavior: 'Kendi üstün algısını insanları küçümsemek için kullanma.',
    suppressedTrait: 'Dünyanın sıradan kusurlarına şefkatle yaklaşabilme.',
    tattooPhysicalFeature: 'Kulak püskülleri, alev rengi turuncu iri gözler, devasa pençeler.',
    gazeDirection: 'Doğrudan ruhun en karanlık odasına bakan alevli hipnotik bakış.',
    headAngle: 'Dik, omuzlarının üzerinden 270 derece dönebilen uyanık baş.',
    posture: 'Kuru ağaç dalına tünemiş, göğsü kabarık heybetli gece nöbetçisi.',
    compositionRole: 'Kompozisyonun en karanlık ve gizemli bilgelik kaidesi.',
    recommendedStyles: ['Dark Surrealism', 'Fine Line', 'Dotwork']
  },
  {
    id: 'bal_arisi',
    name: 'Arı (Honeybee)',
    turkishName: 'Kutsal Bal Arısı',
    element: 'Ateş',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 40, socialConnection: 100, protectiveness: 100, observation: 85,
      courageRisk: 90, patience: 85, adaptability: 85, curiosity: 95, intuition: 90,
      leadership: 75, stealth: 50, resilience: 90, freedomNeed: 60, territorialBoundary: 95,
      cooperation: 100, competitiveness: 50, threatReflex: 100, solitudeNeed: 20, socialEnergy: 95, crisisBehavior: 95
    },
    mainSymbolism: 'Altın oran, petek geometrisi, yaşam iksiri, fedakarlık ve bereket.',
    strongSide: 'Çiçeklerden şifa üretme, hekzagonal kutsal mimari, kovanı canı pahasına savunma.',
    protectivePower: 'Yuvayı ve kutsal değerleri korumak için tek bir an bile tereddüt etmeme.',
    instinctiveSide: 'Güneşin açısına göre dans ederek yön bulma ve kovana haber verme.',
    shadowTrait: 'Fedakarlık kurbanı olma, kovan uğruna kendi canını yok sayma, aşırı öfke.',
    unbalancedBehavior: 'Kendi ihtiyaçlarını sıfırlayıp başkalarının hizmetinde tükenme.',
    suppressedTrait: 'Kendini feda etmeden de değerli ve sevilmeye layık olduğunu anlama.',
    tattooPhysicalFeature: 'Şeffaf çift kanat, petek heksagonları, altın sarısı şeritler.',
    gazeDirection: 'Çiçeğin merkezindeki nektara kilitlenmiş odak.',
    headAngle: 'Aşağıya dönük, nektarı emen şifacı baş.',
    posture: 'Petek deseninin üzerinde kanat çırpan dinamik simyacı.',
    compositionRole: 'Heksagonal kutsal geometri ve altın spiral ile birleşen motif.',
    recommendedStyles: ['Sacred Geometry', 'Fine Line', 'Dotwork']
  },
  {
    id: 'bozkir_kartali',
    name: 'Bozkır Kartalı (Steppe Eagle)',
    turkishName: 'Bozkır Kartalı',
    element: 'Ateş',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 90, socialConnection: 30, protectiveness: 75, observation: 95,
      courageRisk: 88, patience: 80, adaptability: 75, curiosity: 75, intuition: 85,
      leadership: 85, stealth: 65, resilience: 95, freedomNeed: 95, territorialBoundary: 90,
      cooperation: 30, competitiveness: 85, threatReflex: 90, solitudeNeed: 85, socialEnergy: 35, crisisBehavior: 90
    },
    mainSymbolism: 'Geniş ufuklar, rüzgar hükümdarlığı, kadim göçebe ruhu ve sarsılmaz onur.',
    strongSide: 'Bozkırın uçsuz bucaksız mesafelerini yorulmadan aşabilme, tavizsiz vizyon.',
    protectivePower: 'Açık arazide savunmasız kalanları koruyan yüksek irtifa kalkanı.',
    instinctiveSide: 'Yerden yükselen sıcak hava termiklerini hissedip göğe tırmanma.',
    shadowTrait: 'Yalnızlık kibri, insanlara güvenmeme, dünyayı küçümseme.',
    unbalancedBehavior: 'Kimseyle ortaklık kuramayıp her şeyi tek başına sırtlanma.',
    suppressedTrait: 'Sıcak bir yuvaya ve aidiyete duyduğu özlemi kabul edebilme.',
    tattooPhysicalFeature: 'Geniş kahverengi kanatlar, sarı gaga kökü, geniş pençeler.',
    gazeDirection: 'Uzak ufuk çizgisine bakan geniş açılı kraliyet bakışı.',
    headAngle: 'Dik, bozkır rüzgarını karşılayan asil baş.',
    posture: 'Tüm kanatlarını açmış, termik hava akımında süzülen heybet.',
    compositionRole: 'Kompozisyonun üst sınırını çizen haşmetli kanat aksı.',
    recommendedStyles: ['Fine Line', 'Blackwork', 'Geometric']
  },
  {
    id: 'col_devesi',
    name: 'Deve (Dromedary Camel)',
    turkishName: 'Çöl Devesi',
    element: 'Toprak',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 75, socialConnection: 70, protectiveness: 80, observation: 80,
      courageRisk: 60, patience: 100, adaptability: 95, curiosity: 60, intuition: 85,
      leadership: 65, stealth: 50, resilience: 100, freedomNeed: 75, territorialBoundary: 70,
      cooperation: 80, competitiveness: 40, threatReflex: 70, solitudeNeed: 65, socialEnergy: 50, crisisBehavior: 85
    },
    mainSymbolism: 'Çölü aşma, susuzluğa direnç, içsel rezervler, kadim sabır ve tevazu.',
    strongSide: 'En kurak ve çetin şartlarda bile haftalarca durmadan ilerleyebilme dayanıklılığı.',
    protectivePower: 'Kişiyi duygusal ve maddi yokluk dönemlerinde ayakta tutan rezerv gücü.',
    instinctiveSide: 'Kum fırtınasının yönünü önceden sezip gözlerini ve burun deliklerini kapatma.',
    shadowTrait: 'Derin kin tutma (deve kini), inatçılık, geçmişi asla affedememe.',
    unbalancedBehavior: 'Yıllar önce yapılan bir haksızlığı unutup barışmaya yanaşmama.',
    suppressedTrait: 'Hafifliği, kin gütmeden bağışlamayı ve akışa güvenmeyi öğrenme.',
    tattooPhysicalFeature: 'Uzun kıvrık kirpikler, heybetli tek/çift hörgüç, kumda batmayan ayaklar.',
    gazeDirection: 'Çöl ufkuna ve kum tepelerine bakan vakur ve sabırlı gözler.',
    headAngle: 'Gururla yukarı kalkık, boynunu zarifçe büken baş.',
    posture: 'Kum tepeciklerinin üzerinde adımlayan heybetli kervan başı.',
    compositionRole: 'Tasarıma sarsılmaz sabır, çöl bilgeliği ve dayanıklılık katan temel.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Minimalist']
  },
  {
    id: 'kutup_baykusu',
    name: 'Kar Baykuşu (Snowy Owl)',
    turkishName: 'Kutup Baykuşu',
    element: 'Hava',
    realm: 'Tundra & Kutup',
    behavioralVector: {
      independence: 90, socialConnection: 20, protectiveness: 75, observation: 98,
      courageRisk: 75, patience: 95, adaptability: 85, curiosity: 85, intuition: 95,
      leadership: 60, stealth: 98, resilience: 95, freedomNeed: 95, territorialBoundary: 85,
      cooperation: 25, competitiveness: 55, threatReflex: 75, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 85
    },
    mainSymbolism: 'Beyaz sessizlik, zihinsel saflık, kutup gecelerinde rehberlik ve duruluk.',
    strongSide: 'Zihinsel gürültüyü sıfırlama, saf sezgi, fırtınada bile şaşmayan pusula.',
    protectivePower: 'Kafa karışıklığını ve vesveseleri bembeyaz bir kar örtüsü gibi örten sükunet.',
    instinctiveSide: 'Buzun altındaki yaşamı gözleriyle değil kalbinin kulaklarıyla duyma.',
    shadowTrait: 'Duygusal donukluk, kibre varan sessizlik, insanlara tepeden bakma.',
    unbalancedBehavior: 'Kendi doğrularından o kadar emin olmak ki kimsenin fikrini dinlememek.',
    suppressedTrait: 'Dünyevi sıcaklığa, kusurlara ve insani zaaflara şefkat duyma.',
    tattooPhysicalFeature: 'Bembeyaz tüyler üzerine mikro siyah damlacıklar, parlayan altın gözler.',
    gazeDirection: 'Buz çölünün üzerinden tam karşıya, sonsuzluğa bakan hipnotik gözler.',
    headAngle: 'Omuzlarının üzerinden doğrudan izleyiciye bakan 180 derece kafa.',
    posture: 'Karlı bir kaya parçası üzerinde heykel gibi hareketsiz ve kusursuz duruş.',
    compositionRole: 'Tasarımın tepe noktasında negatif alanla kaynaşan saf ışık odağı.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Minimalist']
  },
  {
    id: 'boynuzlu_engerek',
    name: 'Engerek (Horned Viper)',
    turkishName: 'Çöl Engereği',
    element: 'Toprak',
    realm: 'Bozkır & Çöl',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 80, observation: 92,
      courageRisk: 70, patience: 98, adaptability: 90, curiosity: 65, intuition: 90,
      leadership: 40, stealth: 100, resilience: 92, freedomNeed: 90, territorialBoundary: 90,
      cooperation: 15, competitiveness: 60, threatReflex: 95, solitudeNeed: 98, socialEnergy: 15, crisisBehavior: 85
    },
    mainSymbolism: 'Görünmez pusu, kuma gömülme, keskin sınırlar ve anlık şimşek refleksi.',
    strongSide: 'Kumun altına tamamen gömülüp sadece gözlerini dışarıda bırakma ustası.',
    protectivePower: 'Kişinin mahremiyetini ihlal edenlere anında sınırlarını bildiren şimşek refleksi.',
    instinctiveSide: 'Yandaki kum tanesinin titreşiminden mesafeyi milimetrik hesaplama.',
    shadowTrait: 'Sürekli pusuda beklemenin getirdiği güvensizlik, aniden zehir saçma.',
    unbalancedBehavior: 'En yakınındakilere bile güvenmeyip en ufak harekette zehrini akıtma.',
    suppressedTrait: 'Açıkta ve görünür olmaktan korkmamayı, savunmasızlığı kabul etmeyi öğrenme.',
    tattooPhysicalFeature: 'Gözlerin üzerindeki minik boynuzlar, kum desenli geometrik pullar, kıvrık gövde.',
    gazeDirection: 'Kum tanelerinin arasından yukarıya bakan keskin delici göz bebekleri.',
    headAngle: 'Kumun hizasında yatay, sıçramaya hazır yay açısı.',
    posture: 'Kumun üzerinde S harfi şeklinde yan yan ilerleyen kıvrak hat.',
    compositionRole: 'Tasarıma toprak zemin kamuflajı ve gizli koruma katan unsur.',
    recommendedStyles: ['Dotwork', 'Fine Line', 'Sacred Geometry']
  },
  {
    id: 'dag_gorili',
    name: 'Goril (Mountain Gorilla)',
    turkishName: 'Dağ Gorili',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 70, socialConnection: 95, protectiveness: 100, observation: 85,
      courageRisk: 85, patience: 95, adaptability: 75, curiosity: 80, intuition: 85,
      leadership: 95, stealth: 55, resilience: 98, freedomNeed: 80, territorialBoundary: 95,
      cooperation: 95, competitiveness: 75, threatReflex: 95, solitudeNeed: 40, socialEnergy: 75, crisisBehavior: 95
    },
    mainSymbolism: 'Huzurlu güç, gümüşsırt liderliği, yumuşak kalpli dev, kabile koruyucusu.',
    strongSide: 'Gereksiz yere saldırmayan ama ailesine dokunulduğunda dünyayı yıkan devasa güç.',
    protectivePower: 'Sevdiklerini ve klanını göğsünü siper ederek koruyan anıt kalkan.',
    instinctiveSide: 'Göz teması ve vakarla tehdidi savaşmadan durdurabilme otoritesi.',
    shadowTrait: 'Aşırı sahiplenicilik, otoritesinin sorgulanmasına tahammülsüzlük, ağır baskı.',
    unbalancedBehavior: 'Gruptaki herkesin kendi kurallarına uymasını zorunlu kılma.',
    suppressedTrait: 'Liderliği başkalarına devredebilmeyi ve gevşemeyi öğrenme.',
    tattooPhysicalFeature: 'Gümüş sırt kürkü, kaslı geniş göğüs kafesi, derin düşünen bilge gözler.',
    gazeDirection: 'Doğrudan karşıya, dağların sislerine bakan vakur ve şefkatli gözler.',
    headAngle: 'Dik, omuzlarının arasına gömülü sarsılmaz baş.',
    posture: 'Ön yumrukları üzerinde yere basan, arkası geniş ve heybetli oturma duruşu.',
    compositionRole: 'Tasarımın en güvenilir ve koruyucu manevi liderlik kaidesi.',
    recommendedStyles: ['Blackwork', 'Fine Line', 'Micro Realism']
  },
  {
    id: 'mantis_karidesi',
    name: 'Mantis Karidesi (Mantis Shrimp)',
    turkishName: 'Mantis Karidesi',
    element: 'Ateş',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 95, socialConnection: 15, protectiveness: 80, observation: 100,
      courageRisk: 95, patience: 80, adaptability: 85, curiosity: 90, intuition: 90,
      leadership: 60, stealth: 85, resilience: 95, freedomNeed: 95, territorialBoundary: 98,
      cooperation: 15, competitiveness: 95, threatReflex: 100, solitudeNeed: 95, socialEnergy: 20, crisisBehavior: 95
    },
    mainSymbolism: '16 renk konisi (insanın göremediği ışıkları görme), mermi hızında darbe, kristal güç.',
    strongSide: 'Gözleriyle ultraviyole ve dairesel polarize ışığı görebilme, kurşun hızında yumruk.',
    protectivePower: 'İllüzyonları tek bir şimşek darbesiyle paramparça eden hakikat yumruğu.',
    instinctiveSide: 'Tehdidin en zayıf noktasını ışık tayfında görüp saliseler içinde vurma.',
    shadowTrait: 'Aşırı hırçınlık, her şeye yumrukla karşılık verme, sabırsız şiddet.',
    unbalancedBehavior: 'En ufak anlaşmazlıkta karşı tarafı tamamen yok etmek isteme.',
    suppressedTrait: 'Yumuşaklığı, dokunulmayı ve barış içinde kalabilmeyi öğrenme.',
    tattooPhysicalFeature: 'Gökkuşağı prizmatik zırh renkleri, yay formunda darbe kolları, kristal gözler.',
    gazeDirection: 'Boyutlar arası ışığı süzen bağımsız hareket eden küresel gözler.',
    headAngle: 'Tetikte, yay mekanizması gerilmiş pusu başı.',
    posture: 'Resif kovuğunda gerilmiş, anında patlamaya hazır renkli zırh.',
    compositionRole: 'Tasarıma prizmatik renk cümbüşü ve patlayıcı güç katan detay.',
    recommendedStyles: ['Fine Line', 'Dotwork', 'Illustrative']
  },
  {
    id: 'simurg_anka',
    name: 'Anka / Simurg (Phoenix)',
    turkishName: 'Kozmik Anka / Simurg',
    element: 'Ateş',
    realm: 'Gökyüzü',
    behavioralVector: {
      independence: 95, socialConnection: 40, protectiveness: 85, observation: 95,
      courageRisk: 100, patience: 90, adaptability: 95, curiosity: 95, intuition: 100,
      leadership: 90, stealth: 60, resilience: 100, freedomNeed: 100, territorialBoundary: 80,
      cooperation: 50, competitiveness: 70, threatReflex: 95, solitudeNeed: 90, socialEnergy: 50, crisisBehavior: 100
    },
    mainSymbolism: 'Küllerinden yeniden doğuş, ilahi ateş simyası, boyutlar arası uyanış ve ölümsüzlük.',
    strongSide: 'Her yıkımdan eskisinden kat kat güçlü çıkabilme, ruhsal arınma, vizyon.',
    protectivePower: 'Tüm karmik bağları ve negatif yükleri yakan ilahi arındırıcı ateş aurası.',
    instinctiveSide: 'Vadesi dolan her şeyi kendi ateşiyle yakıp küllerinden arınma dürtüsü.',
    shadowTrait: 'Kendini sürekli ateşe atma (kriz bağımlılığı), huzurlu dönemlerden sıkılma.',
    unbalancedBehavior: 'Sırf küllerinden doğmak için kendi kurduğu güzel şeyleri yakıp yıkma.',
    suppressedTrait: 'Yıkıma ihtiyaç duymadan da huzur ve istikrar içinde büyüyebileceğini anlama.',
    tattooPhysicalFeature: 'Alevli tüy telekleri, başında 7 köşeli yıldız tacı, spiral alev kuyrukları.',
    gazeDirection: 'Göğün en yüksek katına, ilahi kaynağa bakan transandantal gözler.',
    headAngle: 'Tamamen yukarıya dikilmiş, arınış ve yükseliş baş açısı.',
    posture: 'Alevlerin arasından kanatlarını iki yana açarak göğe yükselen diriliş.',
    compositionRole: 'Tüm dövmenin omurgasını oluşturan ilahi dönüşümün başyapıtı.',
    recommendedStyles: ['Fine Line', 'Geometric', 'Illustrative', 'Dotwork']
  },
  {
    id: 'mavi_balina',
    name: 'Mavi Balina (Blue Whale)',
    turkishName: 'Dev Mavi Balina',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 85, socialConnection: 60, protectiveness: 90, observation: 85,
      courageRisk: 55, patience: 100, adaptability: 75, curiosity: 70, intuition: 98,
      leadership: 70, stealth: 60, resilience: 100, freedomNeed: 95, territorialBoundary: 40,
      cooperation: 65, competitiveness: 20, threatReflex: 40, solitudeNeed: 90, socialEnergy: 35, crisisBehavior: 90
    },
    mainSymbolism: 'Gezegenin en büyük kalp atışı, sonsuz sükunet, engin kabulleniş ve kozmik nefes.',
    strongSide: 'Büyüklüğüne rağmen hiçbir canlıya zarar vermeyen saf güç ve sükunet.',
    protectivePower: 'Küçük egosal tartışmaları okyanusun enginliğinde eriten devasa aura.',
    instinctiveSide: 'Tüm okyanus havzasını kaplayan düşük frekanslı kalp şarkılarıyla haberleşme.',
    shadowTrait: 'Aşırı pasiflik, haksızlıklara karşı sessiz kalma, kendi heybetini unutma.',
    unbalancedBehavior: 'Kendi gücünün farkında olmayıp uyuşarak sürüklenme.',
    suppressedTrait: 'Gerektiğinde devasa gücünü ortaya koyup yön verme iradesi.',
    tattooPhysicalFeature: 'Devasa pürüzsüz gövde, göğüsteki açık mavi oluklar, okyanusu yaran kuyruk.',
    gazeDirection: 'Sonsuz okyanus derinliğine bakan şefkatli ve sakin gözler.',
    headAngle: 'Okyanus yüzeyine paralel uzanmış devasa heykel.',
    posture: 'Suyun içinde sonsuz bir dinginlikle süzülen devasa barış anıtı.',
    compositionRole: 'Tasarıma mutlak derinlik ve sonsuz sükunet katan en büyük su unsuru.',
    recommendedStyles: ['Minimalist', 'Fine Line', 'Dotwork']
  },
  {
    id: 'denizati',
    name: 'Denizatı (Seahorse)',
    turkishName: 'Mistik Denizatı',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 70, socialConnection: 75, protectiveness: 95, observation: 92,
      courageRisk: 50, patience: 98, adaptability: 90, curiosity: 80, intuition: 95,
      leadership: 40, stealth: 95, resilience: 80, freedomNeed: 75, territorialBoundary: 60,
      cooperation: 80, competitiveness: 20, threatReflex: 45, solitudeNeed: 75, socialEnergy: 40, crisisBehavior: 75
    },
    mainSymbolism: 'Fibonacci spirali, kutsal ebeveynlik (erkeğin doğurması), akıntıya tutunma, sabır.',
    strongSide: 'Fırtınalı akıntılarda kuyruğuyla bir deniz yosununa tutunup yerini koruma.',
    protectivePower: 'Kaotik duygusal fırtınalarda savrulmayı önleyen kutsal tutunma gücü.',
    instinctiveSide: 'Zırhlı derisiyle kendini akıntıya bırakıp doğru anı bekleme.',
    shadowTrait: 'Aşırı bağımlılık, bir şeye körü körüne sarılıp bırakamama, korkaklık.',
    unbalancedBehavior: 'Güvende hissetmek için bir insana veya duruma kene gibi yapışıp boğma.',
    suppressedTrait: 'Kuyruğunu bırakıp açık denize yüzebilme ve akıntıya güvenebilme cesareti.',
    tattooPhysicalFeature: 'Fibonacci sarmal kuyruk, taç şeklinde baş çıkıntısı, zırhlı halkalı gövde.',
    gazeDirection: 'Akıntının içinden yukarıya bakan masum ve bilge gözler.',
    headAngle: 'Öne eğik, at başı şeklinde asil kavis.',
    posture: 'Kuyruğuyla bir yosuna veya kutsal geometriye tutunmuş dikey süzülüş.',
    compositionRole: 'Fibonacci spirali ve altın oran ile mükemmel bütünleşen zarif motif.',
    recommendedStyles: ['Sacred Geometry', 'Fine Line', 'Dotwork']
  },
  {
    id: 'orman_jaguari',
    name: 'Orman Jaguarı (Mayan Jaguar)',
    turkishName: 'Maya Orman Jaguarı',
    element: 'Toprak',
    realm: 'Orman & Dağ',
    behavioralVector: {
      independence: 95, socialConnection: 30, protectiveness: 85, observation: 98,
      courageRisk: 95, patience: 95, adaptability: 90, curiosity: 90, intuition: 96,
      leadership: 85, stealth: 100, resilience: 95, freedomNeed: 95, territorialBoundary: 95,
      cooperation: 25, competitiveness: 85, threatReflex: 95, solitudeNeed: 95, socialEnergy: 25, crisisBehavior: 98
    },
    mainSymbolism: 'Yeraltı dünyasının şamanik efendisi, gece vizyonu, görünmez güç, gizemli dönüşüm ve sessiz otorite.',
    strongSide: 'Zifiri karanlıkta avını sezgileriyle görme, tek hamlede mutlak sonuç alma.',
    protectivePower: 'Auranın etrafına aşılmaz bir gölge kamuflajı örerek görünmeyen psişik saldırıları yutma.',
    instinctiveSide: 'Gereksiz hiçbir gürültü yapmadan tam zamanında harekete geçme.',
    shadowTrait: 'Aşırı yırtıcılık, yalnızlığı bir zırh yapıp kimseye güvenmeme, acımasızlık.',
    unbalancedBehavior: 'Karanlığa çekilip çevresindeki her şeyi tehdit veya av olarak algılama.',
    suppressedTrait: 'Şefkati ve korunma ihtiyacını zayıflık saymaktan vazgeçme.',
    tattooPhysicalFeature: 'Gül rozet desenli kaslı post, gecede parlayan kehribar gözler, gerilmiş omuz kasları.',
    gazeDirection: 'Doğrudan izleyicinin ruhuna kilitlenmiş hipnotik ve derin avcı bakışı.',
    headAngle: 'Hafif alçak, yere yakın gizli yürüyüş açısı.',
    posture: 'Sarmaşıkların veya kadim tapınak taşlarının üzerinden sessizce aşağı süzülen heybet.',
    compositionRole: 'Tasarımın alt tabanında veya merkezinde güçlü, karanlık ve mistik derinlik odağı.',
    recommendedStyles: ['Blackwork', 'Micro Realism', 'Fine Line', 'Dark Surrealism']
  },
  {
    id: 'manta_vatozu',
    name: 'Dev Manta Vatozu (Giant Manta Ray)',
    turkishName: 'Okyanus Manta Vatozu',
    element: 'Su',
    realm: 'Derin Sular',
    behavioralVector: {
      independence: 90, socialConnection: 70, protectiveness: 75, observation: 92,
      courageRisk: 70, patience: 98, adaptability: 95, curiosity: 95, intuition: 98,
      leadership: 60, stealth: 85, resilience: 95, freedomNeed: 100, territorialBoundary: 40,
      cooperation: 75, competitiveness: 20, threatReflex: 50, solitudeNeed: 80, socialEnergy: 45, crisisBehavior: 92
    },
    mainSymbolism: 'Okyanusun ruhsal kanatları, derin sükunet, akıntıların efendisi, zarif akış ve bilgelik.',
    strongSide: 'Devasa boyutuna rağmen hiçbir canlıya zarar vermeden akıntılarda zahmetsizce uçabilme.',
    protectivePower: 'Duygusal çalkantılarda ruhu derin bir huzur ve akış kalkanıyla sakinleştirme.',
    instinctiveSide: 'Okyanus akıntılarını ve su altı elektromanyetik dalgalarını kusursuz okuma.',
    shadowTrait: 'Aşırı edilgenlik, çatışmadan kaçıp derin sulara kaybolma, dünyevi sorumlulukları terk etme.',
    unbalancedBehavior: 'Sorunları çözmek yerine sonsuz akıntıya kapılıp sürüklenme.',
    suppressedTrait: 'Zarafetin yanında sınırlarını koruyacak keskin duruşu da sahiplenme.',
    tattooPhysicalFeature: 'Geniş elmas formunda kanat gövdesi, sırtındaki kutsal kontrast lekeleri, ince kuyruk spirali.',
    gazeDirection: 'Okyanusun derin maviliğine bakan bilge ve huzurlu gözler.',
    headAngle: 'Akıntıya karşı hafif yukarı dönük, süzülen uçuş başı.',
    posture: 'Sanki su altında değil gökyüzünde kanat çırpar gibi iki yana açılmış dev kanatlar.',
    compositionRole: 'Tüm tasarıma genişlik, ferahlık ve akıcı bir su geometrisi kazandıran görkemli kanat formu.',
    recommendedStyles: ['Dotwork', 'Fine Line', 'Sacred Geometry', 'Minimalist']
  }
];

/**
 * Verilen bir animalId'ye göre kataloğu arar.
 */
export function getTotemAnimalById(id: string | undefined | null): TotemAnimalProfile | undefined {
  if (!id || typeof id !== 'string') return undefined;
  const cleanId = id.trim().toLowerCase();
  return TOTEM_ANIMALS_52.find(a => a.id.toLowerCase() === cleanId);
}

/**
 * Totem hayvanını animalId, tam ad veya Türkçe adına göre KESİN olarak çözer.
 * 
 * KRİTİK GÜVENLİK KURALLARI:
 * 1. Asla gevşek alt dize araması (".includes('at')" gibi) YAPMAZ.
 * 2. Asla başka bir hayvanın verisini fallback/ödünç olarak KULLANMAZ.
 * 3. Bozkır Kurdu gibi rastgele varsayılan hayvan atamaz.
 * 4. Çözülen profil %100 o hayvana aittir (animalId, ad, anatomik ve davranışsal özellikler senkronizedir).
 */
export function getTotemAnimalStrict(idOrNameOrProfile: string | TotemAnimalProfile | undefined | null): TotemAnimalProfile {
  if (!idOrNameOrProfile) {
    throw new Error('Totem hayvanı verisi boş veya tanımsız olamaz. Eksik veri durumunda başka bir hayvanın verisi kullanılamaz.');
  }

  // 1. Zaten geçerli bir TotemAnimalProfile nesnesi ise:
  if (typeof idOrNameOrProfile === 'object' && idOrNameOrProfile.id) {
    const fromCatalog = getTotemAnimalById(idOrNameOrProfile.id);
    if (fromCatalog) return fromCatalog;
    throw new Error(`Totem hayvanı kimliği doğrulanamadı: "${idOrNameOrProfile.id}". Sistem yalnızca kanonik 52 hayvan kataloğundaki profilleri kabul eder.`);
  }

function normalizeTr(s: string): string {
  return s
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

  if (typeof idOrNameOrProfile !== 'string') {
    throw new Error(`Geçersiz totem parametresi: ${typeof idOrNameOrProfile}.`);
  }

  const query = idOrNameOrProfile.trim();
  if (!query) {
    throw new Error('Totem sorgusu boş dize olamaz.');
  }

  const qLower = query.toLowerCase();
  const qNorm = normalizeTr(qLower);

  // 2. Doğrudan exact ID eşleşmesi (örn: "manta_vatozu", "asil_yaban_ati", "kurt")
  const byId = TOTEM_ANIMALS_52.find(a => a.id.toLowerCase() === qLower || normalizeTr(a.id) === qNorm);
  if (byId) return byId;

  // 3. Doğrudan exact Name veya TurkishName eşleşmesi
  const byExactName = TOTEM_ANIMALS_52.find(a => 
    a.name.toLowerCase() === qLower || 
    a.turkishName.toLowerCase() === qLower ||
    normalizeTr(a.name) === qNorm ||
    normalizeTr(a.turkishName) === qNorm
  );
  if (byExactName) return byExactName;

  // 4. Parantez temizliği ile exact eşleşme
  const cleanWithoutParens = qLower.replace(/\(.*?\)/g, '').trim();
  const cleanNorm = normalizeTr(cleanWithoutParens);
  const parensContent = (qLower.match(/\((.*?)\)/)?.[1] || '').trim();
  const parensNorm = normalizeTr(parensContent);

  // 4a. Parantez içindeki İngilizce ad ile tam eşleşme
  if (parensNorm) {
    const byParens = TOTEM_ANIMALS_52.find(a => {
      const aParens = (a.name.toLowerCase().match(/\((.*?)\)/)?.[1] || '').trim();
      return aParens === parensContent || normalizeTr(aParens) === parensNorm || a.id.toLowerCase() === parensContent;
    });
    if (byParens) return byParens;
  }

  // 4b. Parantezsiz ana ad ile tam eşleşme (Exact base name)
  if (cleanNorm) {
    const byCleanBase = TOTEM_ANIMALS_52.find(a => {
      const aCleanBase = a.name.toLowerCase().replace(/\(.*?\)/g, '').trim();
      const aTrClean = a.turkishName.toLowerCase().replace(/\(.*?\)/g, '').trim();
      return aCleanBase === cleanWithoutParens || 
             aTrClean === cleanWithoutParens ||
             normalizeTr(aCleanBase) === cleanNorm ||
             normalizeTr(aTrClean) === cleanNorm;
    });
    if (byCleanBase) return byCleanBase;
  }

  // 4c. Güvenli kelime bazlı eşleşme (Tam kelime sınırlarıyla; rastgele harf içermesi değil!)
  const queryWords = cleanNorm.split(/[\s/_]+/).filter(w => w.length > 2);
  const byWordMatch = TOTEM_ANIMALS_52.find(a => {
    const aCleanBase = normalizeTr(a.name.toLowerCase().replace(/\(.*?\)/g, '').trim());
    const aTrClean = normalizeTr(a.turkishName.toLowerCase().replace(/\(.*?\)/g, '').trim());
    const aIdWords = a.id.toLowerCase().split('_');
    const aWords = [...aCleanBase.split(/[\s/_]+/), ...aTrClean.split(/[\s/_]+/), ...aIdWords];
    return queryWords.some(qw => aWords.some(aw => aw === qw));
  });
  if (byWordMatch) return byWordMatch;

  // 5. Kesin hata: Başka hayvanın verisi ASLA kullanılmaz
  throw new Error(`Totem hayvanı kimliği doğrulanamadı: "${query}". Sistem başka bir hayvanın anatomik/davranışsal verisini kesinlikle ödünç alamaz.`);
}


