import { 
  BehavioralDimensionKey, 
  BehavioralVector, 
  TotemAnimalProfile, 
  TOTEM_ANIMALS_52 
} from './totemCatalogData';

export interface TotemTestQuestionOption {
  id: string;
  text: string;
  dimensionWeights: Partial<Record<BehavioralDimensionKey, number>>;
}

export interface TotemTestQuestion {
  id: number;
  question: string;
  category: string;
  options: TotemTestQuestionOption[];
}

export interface TotemMatchScore {
  animal: TotemAnimalProfile;
  similarityScore: number; // 0 - 100 percentage
}

export interface TotemTestCalculationResult {
  primaryTotem: TotemAnimalProfile;
  secondaryTotem: TotemAnimalProfile;
  shadowTotem: TotemAnimalProfile;
  topMatches: TotemMatchScore[];
  userVector: BehavioralVector;
  confidenceScore: number;
  isProximityClose: boolean;
  proximityDifference: number;
  crossEnneagramInsight: string;
}

// 15 Derin Davranışsal Senaryo Sorusu (Hayvan isimleri ASLA geçmez)
export const TOTEM_BEHAVIORAL_QUESTIONS: TotemTestQuestion[] = [
  {
    id: 1,
    question: 'Bilinmeyen, kaotik ve kontrol edemediğiniz kalabalık bir ortama girdiğinizde ilk doğal refleksiniz hangisidir?',
    category: 'Gözlem vs Eylem & Sosyal Uyum',
    options: [
      {
        id: '1a',
        text: 'Bir köşeye veya yüksek bir noktaya çekilir, ortamın dinamiklerini ve insanları sessizce analiz ederim.',
        dimensionWeights: { observation: 95, stealth: 90, solitudeNeed: 80, patience: 85, courageRisk: 40 }
      },
      {
        id: '1b',
        text: 'Doğrudan merkeze doğru ilerler, ortamın kontrolünü ve yönünü kendi varlığımla belirlerim.',
        dimensionWeights: { leadership: 95, socialEnergy: 90, courageRisk: 90, independence: 85, stealth: 20 }
      },
      {
        id: '1c',
        text: 'İnsanların arasına hızla karışır, esprili ve samimi bir dille güvenli bağlantılar kurarım.',
        dimensionWeights: { socialConnection: 95, cooperation: 90, adaptability: 90, socialEnergy: 90, solitudeNeed: 20 }
      },
      {
        id: '1d',
        text: 'Görünmez bir kamuflajla varlığımı hissettirmeden kendi amacıma odaklanırım; gerekmedikçe öne çıkmam.',
        dimensionWeights: { adaptability: 95, stealth: 95, independence: 85, observation: 85, socialEnergy: 30 }
      }
    ]
  },
  {
    id: 2,
    question: 'Sizin veya koruduğunuz birinin kırmızı çizgilerine açıkça haksız bir saldırı olduğunda tepkiniz nedir?',
    category: 'Sınır Hassasiyeti & Tehdit Refleksi',
    options: [
      {
        id: '2a',
        text: 'Hiç tereddüt etmeden, gözümü karartıp doğrudan ve şiddetli bir karşı hamleyle sınırı savururum.',
        dimensionWeights: { threatReflex: 98, protectiveness: 98, courageRisk: 95, territorialBoundary: 95 }
      },
      {
        id: '2b',
        text: 'Öfkelenmem; karşı tarafın en zayıf anını sabırla bekler, zekice ve stratejik tek bir darbeyle püskürtürüm.',
        dimensionWeights: { patience: 95, stealth: 90, observation: 95, protectiveness: 85, threatReflex: 80 }
      },
      {
        id: '2c',
        text: 'Hemen sevdiklerimi etrafıma toplar, birlik olarak geçilmez bir savunma kalkanı oluştururum.',
        dimensionWeights: { cooperation: 95, socialConnection: 95, protectiveness: 95, leadership: 80 }
      },
      {
        id: '2d',
        text: 'Çatışmaya girmem; durumu ustaca manevralarla boşa çıkarır, sınırımı sessizce aşılmaz kılarım.',
        dimensionWeights: { adaptability: 95, stealth: 90, resilience: 85, territorialBoundary: 85 }
      }
    ]
  },
  {
    id: 3,
    question: 'Hayatınızda kritik bir dönemeçte veya büyük bir karar anında pusulanız hangisidir?',
    category: 'Sezgi vs Mantık & Bağımsızlık',
    options: [
      {
        id: '3a',
        text: 'Bedenimde ve kalbimde duyduğum o ilk ilahi his; veriler ne derse desin içimdeki sese teslim olurum.',
        dimensionWeights: { intuition: 98, independence: 90, courageRisk: 80, freedomNeed: 90 }
      },
      {
        id: '3b',
        text: 'Tüm olasılıkları ve riskleri soğukkanlılıkla haritalandırır, en verimli stratejiyi uygularım.',
        dimensionWeights: { observation: 95, resilience: 90, patience: 85, leadership: 75 }
      },
      {
        id: '3c',
        text: 'Güvendiğim dostlarımın ve çemberimin fikirlerini alır, kolektif vicdanla hareket ederim.',
        dimensionWeights: { socialConnection: 95, cooperation: 95, protectiveness: 80, independence: 40 }
      },
      {
        id: '3d',
        text: 'Zamanın akışına ve işaretlere güvenirim; şartlar olgunlaşana kadar acele etmeden gözlemlerim.',
        dimensionWeights: { patience: 98, adaptability: 90, intuition: 85, solitudeNeed: 80 }
      }
    ]
  },
  {
    id: 4,
    question: 'Ağır bir baskı, kriz veya zihinsel yorgunluğun ardından pilinizi nasıl doldurursunuz?',
    category: 'Yalnızlık vs Sosyal Enerji',
    options: [
      {
        id: '4a',
        text: 'Telefonu kapatıp günlerce tek başıma doğaya, odama veya sessizliğe çekilerek.',
        dimensionWeights: { solitudeNeed: 98, independence: 90, socialEnergy: 15, stealth: 80 }
      },
      {
        id: '4b',
        text: 'Beni seven dostlarımla gülüp eğlenerek, sarılarak ve dertleşerek.',
        dimensionWeights: { socialEnergy: 95, socialConnection: 98, cooperation: 85, solitudeNeed: 15 }
      },
      {
        id: '4c',
        text: 'Yeni bir şeyler öğrenerek, araştırarak, kitaplara ve zihinsel projelere dalarak.',
        dimensionWeights: { curiosity: 95, observation: 90, solitudeNeed: 80, patience: 85 }
      },
      {
        id: '4d',
        text: 'Fiziksel olarak ter atarak, koşarak, sınırları zorlayıp bedenimi harekete geçirerek.',
        dimensionWeights: { resilience: 95, courageRisk: 85, freedomNeed: 90, socialEnergy: 65 }
      }
    ]
  },
  {
    id: 5,
    question: 'Katı kurallarla örülü, sizi kalıplara sokmaya çalışan bir sistemle karşılaştığınızda tavrınız ne olur?',
    category: 'Özgürlük İhtiyacı & Bağımsızlık',
    options: [
      {
        id: '5a',
        text: 'Tutsak edilemem; bedeli ne olursa olsun zincirleri kırar veya sistemi terk edip kendi yoluma giderim.',
        dimensionWeights: { freedomNeed: 100, independence: 98, courageRisk: 90, territorialBoundary: 85 }
      },
      {
        id: '5b',
        text: 'Sistemin kurallarını herkesten daha iyi öğrenir, sistemi kendi içinden yönetip zirvesine otururum.',
        dimensionWeights: { leadership: 95, competitiveness: 90, adaptability: 85, patience: 80 }
      },
      {
        id: '5c',
        text: 'Dışarıdan uyumlu görünürüm ama içeride kendi özgür dünyamı kimseye dokundurtmadan yaşatırım.',
        dimensionWeights: { stealth: 95, adaptability: 95, independence: 85, patience: 85 }
      },
      {
        id: '5d',
        text: 'Topluluğumu korumak için sistemi yumuşatmaya, insan odaklı hale getirmeye çalışırım.',
        dimensionWeights: { cooperation: 90, protectiveness: 90, socialConnection: 85, adaptability: 80 }
      }
    ]
  },
  {
    id: 6,
    question: 'Gözlerinizin önünde ani ve kaotik bir kriz patlak verdiğinde ilk zihinsel ve bedensel reaksiyonunuz nedir?',
    category: 'Kriz Davranışı & Dayanıklılık',
    options: [
      {
        id: '6a',
        text: 'Zihnim buz gibi berraklaşır; herkes paniklerken anında inisiyatif alır ve emirleri veririm.',
        dimensionWeights: { crisisBehavior: 98, leadership: 95, courageRisk: 90, resilience: 95 }
      },
      {
        id: '6b',
        text: 'Derhal en kırılgan ve zayıf olanların önüne geçer, onları güvenli bir alana taşırım.',
        dimensionWeights: { protectiveness: 100, cooperation: 90, crisisBehavior: 90, resilience: 90 }
      },
      {
        id: '6c',
        text: 'İlk saniyelerde kımıldamadan ortamı tarar, yangından en hızlı ve hasarsız çıkış rotasını tespit ederim.',
        dimensionWeights: { observation: 98, patience: 90, stealth: 85, adaptability: 90 }
      },
      {
        id: '6d',
        text: 'Kaosu bir fırsata veya yeni bir başlangıca çevirmek için alternatif, sıra dışı bir hamle üretirim.',
        dimensionWeights: { curiosity: 90, courageRisk: 90, adaptability: 95, crisisBehavior: 85 }
      }
    ]
  },
  {
    id: 7,
    question: 'Büyük ve zorlu bir hedefi hayata geçirirken tercih ettiğiniz ritim ve çalışma tarzı hangisidir?',
    category: 'Sabır, Sebat & İşbirliği',
    options: [
      {
        id: '7a',
        text: 'Yıllarca gerekirse kimseden alkış beklemeden, milim milim ve yıkılmaz bir sabırla inşa ederim.',
        dimensionWeights: { patience: 100, resilience: 98, independence: 85, stealth: 75 }
      },
      {
        id: '7b',
        text: 'Güçlü bir ekip kurar, görevleri mükemmel dağıtır ve kolektif sinerjiyle dağları deviririm.',
        dimensionWeights: { cooperation: 100, socialConnection: 95, leadership: 90, socialEnergy: 90 }
      },
      {
        id: '7c',
        text: 'Tek başıma, fırtına gibi patlayıcı bir enerjiyle hedefe kilitlenir ve tek hamlede bitiririm.',
        dimensionWeights: { courageRisk: 95, competitiveness: 95, independence: 95, patience: 45 }
      },
      {
        id: '7d',
        text: 'Süreç boyunca keşifler yapar, yöntemleri esnetir ve akışın getirdiği yaratıcılığı kullanırım.',
        dimensionWeights: { adaptability: 95, curiosity: 95, intuition: 85, freedomNeed: 85 }
      }
    ]
  },
  {
    id: 8,
    question: 'Bilinmeyene doğru adım atma ve güvenli bölgenin dışına çıkma konusundaki tavrınız nasıldır?',
    category: 'Cesaret & Risk Alma',
    options: [
      {
        id: '8a',
        text: 'Korku beni durdurmaz; tam tersine bilinmeyenin kokusu kanımı kaynatır ve meydan okurum.',
        dimensionWeights: { courageRisk: 100, freedomNeed: 95, competitiveness: 85, resilience: 90 }
      },
      {
        id: '8b',
        text: 'Bilinmeyene adım atarım ama önce zemini yoklar, ipuçlarını tartar ve tedbiri elden bırakmam.',
        dimensionWeights: { observation: 90, patience: 85, adaptability: 85, courageRisk: 70 }
      },
      {
        id: '8c',
        text: 'Sadece sevdiklerimin ve ailemin geleceği için gerekliyse gözümü karartıp riske girerim.',
        dimensionWeights: { protectiveness: 98, socialConnection: 90, resilience: 90, courageRisk: 80 }
      },
      {
        id: '8d',
        text: 'Güvenli bölge kavramı bana dardır; hayatın kendisi zaten sonsuz bir göç ve keşiftir.',
        dimensionWeights: { freedomNeed: 100, curiosity: 95, adaptability: 95, independence: 90 }
      }
    ]
  },
  {
    id: 9,
    question: 'İnsan ilişkilerinde güveninizi ve sadakatinizi kime ve nasıl sunarsınız?',
    category: 'Sosyal Bağlılık & Sürü Ruhu',
    options: [
      {
        id: '9a',
        text: 'Çok az insana güvenirim; ama o dar çembere girdiyseniz canımı sizin için ortaya koyarım.',
        dimensionWeights: { protectiveness: 98, socialConnection: 85, territorialBoundary: 95, independence: 80 }
      },
      {
        id: '9b',
        text: 'Herkesle mesafeli ve nazik bir bağ kurarım ama ruhumun en derin sırlarını yalnızca kendime saklarım.',
        dimensionWeights: { stealth: 95, solitudeNeed: 95, independence: 95, observation: 85 }
      },
      {
        id: '9c',
        text: 'İnsanlara peşin güvenle başlarım; dostluk, paylaşım ve neşe hayatımın en büyük zenginliğidir.',
        dimensionWeights: { socialConnection: 98, socialEnergy: 95, cooperation: 90, protectiveness: 70 }
      },
      {
        id: '9d',
        text: 'Birlikte ortak bir amaç veya ilke uğruna omuz omuza mücadele ettiğim insanlara sadık kalırım.',
        dimensionWeights: { cooperation: 95, leadership: 85, resilience: 85, competitiveness: 75 }
      }
    ]
  },
  {
    id: 10,
    question: 'Bir toplulukta veya grupta yön kaybı, kararsızlık ve anlaşmazlık çıktığında rolünüz ne olur?',
    category: 'Liderlik & Otorite',
    options: [
      {
        id: '10a',
        text: 'Masaya yumruğumu vurur veya açık bir vizyon çizerek herkesin arkamdan gelmesini sağlarım.',
        dimensionWeights: { leadership: 98, crisisBehavior: 90, competitiveness: 85, courageRisk: 85 }
      },
      {
        id: '10b',
        text: 'Tüm tarafları dinler, ortak paydaları bulur ve barışçıl bir sentezle grubu uzlaştırırım.',
        dimensionWeights: { cooperation: 95, adaptability: 90, socialConnection: 85, patience: 90 }
      },
      {
        id: '10c',
        text: 'Kavganın dışına çıkar, kenardan durumu tartar ve sadece can alıcı kritik çözümü fısıldarım.',
        dimensionWeights: { observation: 95, stealth: 85, solitudeNeed: 80, intuition: 90 }
      },
      {
        id: '10d',
        text: 'Gereksiz münakaşalara girmeden kendi işimi yapar, kendi örnek duruşumla yön gösteririm.',
        dimensionWeights: { independence: 95, freedomNeed: 90, patience: 85, leadership: 60 }
      }
    ]
  },
  {
    id: 11,
    question: 'Kendinizi duygusal olarak kırılgan veya incinmiş hissettiğinizde dışarıya ördüğünüz kalkan nasıldır?',
    category: 'Savunma, Gizlilik & Gölge Refleks',
    options: [
      {
        id: '11a',
        text: 'Kimseye zayıflığımı göstermem; buz gibi bir soğukluk veya sert bir güç zırhı takınırım.',
        dimensionWeights: { resilience: 95, stealth: 90, territorialBoundary: 95, solitudeNeed: 90 }
      },
      {
        id: '11b',
        text: 'Gülümsemeye ve şakalar yapmaya devam ederim; içimdeki kederi kimse fark etmesin isterim.',
        dimensionWeights: { adaptability: 90, socialEnergy: 85, stealth: 85, socialConnection: 70 }
      },
      {
        id: '11c',
        text: 'Sessizleşir ve tamamen mağarama çekilirim; yaralarımı kendi başıma yalayarak iyileşirim.',
        dimensionWeights: { solitudeNeed: 100, independence: 95, patience: 90, socialEnergy: 15 }
      },
      {
        id: '11d',
        text: 'Kırıldığımı doğrudan ve keskin bir şekilde söyler, sınırlarımı ihlal edeni hayatımdan çıkarırım.',
        dimensionWeights: { territorialBoundary: 100, courageRisk: 85, independence: 85, threatReflex: 85 }
      }
    ]
  },
  {
    id: 12,
    question: 'Hayatınızda eski yöntemlerin ve alıştığınız düzenin tamamen çöktüğü bir değişim fırtınası koptuğunda ne yaparsınız?',
    category: 'Adaptasyon & Yeniden Doğuş',
    options: [
      {
        id: '12a',
        text: 'Eski olan her şeyi tereddüt etmeden ateşe atar, küllerimden daha güçlü bir kimlikle doğarım.',
        dimensionWeights: { courageRisk: 98, resilience: 98, independence: 95, crisisBehavior: 95 }
      },
      {
        id: '12b',
        text: 'Su gibi akarım; yeni koşulların gerektirdiği şekli anında alır ve ortama kusursuz adapte olurum.',
        dimensionWeights: { adaptability: 100, intuition: 90, observation: 85, patience: 85 }
      },
      {
        id: '12c',
        text: 'En temel değerlerime ve sarsılmaz köklerime tutunur, fırtına dinene kadar sağlam basarım.',
        dimensionWeights: { patience: 98, resilience: 95, territorialBoundary: 85, cooperation: 75 }
      },
      {
        id: '12d',
        text: 'Yenilik beni büyüler; kaosun açtığı boşlukta daha önce kimsenin denemediği kapıları keşfederim.',
        dimensionWeights: { curiosity: 100, freedomNeed: 95, adaptability: 90, intuition: 85 }
      }
    ]
  },
  {
    id: 13,
    question: 'Hayatınızda rekabet, yarış veya başkalarıyla kıyaslanma durumlarında içinizde uyanan asıl dürtü nedir?',
    category: 'Rekabetçilik vs Kendi Kulvarı',
    options: [
      {
        id: '13a',
        text: 'İkinci olmak bana göre değildir; zirveyi almak ve en güçlü olduğumu kanıtlamak isterim.',
        dimensionWeights: { competitiveness: 100, leadership: 90, courageRisk: 90, resilience: 85 }
      },
      {
        id: '13b',
        text: 'Başkalarıyla yarışmam; benim tek rakibim dünkü kendimdir. Kendi derinliğimde ilerlerim.',
        dimensionWeights: { independence: 98, solitudeNeed: 85, patience: 90, competitiveness: 25 }
      },
      {
        id: '13c',
        text: 'Rekabet yerine dayanışmayı tercih ederim; herkesin kazandığı bir masa inşa etmek daha büyüktür.',
        dimensionWeights: { cooperation: 98, socialConnection: 95, protectiveness: 85, competitiveness: 20 }
      },
      {
        id: '13d',
        text: 'Kuralları başkalarının koyduğu bir yarışta koşmam; kendi oyunumu ve kendi kurallarımı yaratırım.',
        dimensionWeights: { freedomNeed: 98, independence: 95, curiosity: 85, adaptability: 85 }
      }
    ]
  },
  {
    id: 14,
    question: 'Doğayla, elementlerle ve çevrenizle kurduğunuz en güçlü içsel bağ hangisidir?',
    category: 'Elementel ve Ruhsal Çekim',
    options: [
      {
        id: '14a',
        text: 'Ateş ve Güneş; sıcaklık, dönüştürücü irade, tutku ve aydınlatıcı cesaret.',
        dimensionWeights: { courageRisk: 90, leadership: 85, socialEnergy: 80, crisisBehavior: 85 }
      },
      {
        id: '14b',
        text: 'Toprak ve Dağlar; kökler, sarsılmaz kayalar, kadim sabır ve güven veren zemin.',
        dimensionWeights: { resilience: 95, patience: 95, territorialBoundary: 85, observation: 80 }
      },
      {
        id: '14c',
        text: 'Hava ve Rüzgar; sınırsız ufuklar, zihinsel berraklık, özgür kanatlar ve yüksek vizyon.',
        dimensionWeights: { freedomNeed: 98, observation: 95, curiosity: 90, independence: 90 }
      },
      {
        id: '14d',
        text: 'Su ve Okyanuslar; derin sezgiler, akışkanlık, şifa, arınma ve dipsiz bilinçdışı.',
        dimensionWeights: { intuition: 98, adaptability: 95, socialConnection: 80, solitudeNeed: 80 }
      }
    ]
  },
  {
    id: 15,
    question: 'Kendi başınıza kaldığınızda, zihninizin en sessiz anında sizi en çok cezbeden derin arayış nedir?',
    category: 'Nihai Arketipik Eğilim',
    options: [
      {
        id: '15a',
        text: 'Görünmeyen evrenin derin sırlarını, sembollerini ve kadim hakikatleri çözmek.',
        dimensionWeights: { curiosity: 95, intuition: 95, observation: 95, solitudeNeed: 90 }
      },
      {
        id: '15b',
        text: 'Geride kalıcı, onurlu ve sevdiklerimi sonsuza dek koruyacak büyük bir miras bırakmak.',
        dimensionWeights: { protectiveness: 98, leadership: 90, resilience: 90, cooperation: 80 }
      },
      {
        id: '15c',
        text: 'Hiçbir prangaya bağlanmadan, dünyanın tüm coğrafyalarını ve hallerini özgürce deneyimlemek.',
        dimensionWeights: { freedomNeed: 100, independence: 95, courageRisk: 85, adaptability: 90 }
      },
      {
        id: '15d',
        text: 'İçsel bir huzur, saf bir neşe ve tüm varoluşla dingin bir uyum içinde kalabilmek.',
        dimensionWeights: { patience: 95, adaptability: 90, socialConnection: 80, intuition: 85 }
      }
    ]
  }
];

const DEFAULT_VECTOR: BehavioralVector = {
  independence: 50, socialConnection: 50, protectiveness: 50, observation: 50,
  courageRisk: 50, patience: 50, adaptability: 50, curiosity: 50, intuition: 50,
  leadership: 50, stealth: 50, resilience: 50, freedomNeed: 50, territorialBoundary: 50,
  cooperation: 50, competitiveness: 50, threatReflex: 50, solitudeNeed: 50, socialEnergy: 50, crisisBehavior: 50
};

/**
 * Kullanıcı test yanıtlarından 20 boyutlu normalize davranış vektörü çıkarır.
 * Cevaplanan soruların aktif boyutları hesaplanır. Testte doğrudan dokunulmayan boyutlar
 * kullanıcının genel yanıt eğilimine göre nötrlenir (sabit 50 puan yapay sapma yaratmaz).
 */
export function calculateUserBehavioralVector(answers: Record<number, string>): BehavioralVector {
  const dimensionTotals: Partial<Record<BehavioralDimensionKey, number>> = {};
  const dimensionCounts: Partial<Record<BehavioralDimensionKey, number>> = {};

  Object.entries(answers).forEach(([qIdStr, optId]) => {
    const qId = parseInt(qIdStr, 10);
    const question = TOTEM_BEHAVIORAL_QUESTIONS.find(q => q.id === qId);
    if (!question) return;

    const selectedOption = question.options.find(o => o.id === optId);
    if (!selectedOption) return;

    Object.entries(selectedOption.dimensionWeights).forEach(([dim, weight]) => {
      const k = dim as BehavioralDimensionKey;
      if (weight !== undefined) {
        dimensionTotals[k] = (dimensionTotals[k] || 0) + weight;
        dimensionCounts[k] = (dimensionCounts[k] || 0) + 1;
      }
    });
  });

  const allKeys = Object.keys(DEFAULT_VECTOR) as BehavioralDimensionKey[];
  const finalVector: BehavioralVector = { ...DEFAULT_VECTOR };
  
  // Calculate average of actively responded dimensions
  const activeDims = Object.keys(dimensionTotals) as BehavioralDimensionKey[];
  let activeSum = 0;
  activeDims.forEach(k => {
    const avg = Math.round((dimensionTotals[k] || 50) / (dimensionCounts[k] || 1));
    finalVector[k] = avg;
    activeSum += avg;
  });

  const userBaseline = activeDims.length > 0 ? Math.round(activeSum / activeDims.length) : 50;

  // Untouched dimensions take the user's natural baseline rather than artificial 50
  allKeys.forEach(k => {
    if (!dimensionCounts[k]) {
      finalVector[k] = userBaseline;
    }
  });

  return finalVector;
}

/**
 * Z-Score Standardize Profil Eşleme ve Korelasyon Motoru:
 * Hayvanların genel ortalama puanlarındaki farkları (bazı hayvanların her boyutta 80+ almasını)
 * nötralize eder. Bunun yerine hayvanın KENDİ arketipik tepe ve çukurları ile kullanıcının
 * tepe ve çukurlarının (hangi özelliklerin öne çıktığının) Pearson korelasyonunu ve
 * bağıl mesafe uyumunu hesaplar.
 * Böylece Kurt, Geyik, Orka gibi genel hayvanlar her teste yapay şekilde kazanamaz;
 * 52 hayvanın her biri kendi özgün karakteristiğine uygun cevaplar verildiğinde adilce birinci çıkar.
 */
export function calculateVectorSimilarity(
  userVec: BehavioralVector,
  animalVec: BehavioralVector,
  personalBonus: number = 0
): number {
  const keys = Object.keys(userVec) as BehavioralDimensionKey[];
  const N = keys.length; // 20

  // 1. Kullanıcı İstatistikleri
  let sumU = 0;
  for (const k of keys) {
    sumU += userVec[k];
  }
  const meanU = sumU / N;

  let varU = 0;
  for (const k of keys) {
    const diff = userVec[k] - meanU;
    varU += diff * diff;
  }
  const stdU = Math.sqrt(varU / N) || 1;

  // 2. Hayvan İstatistikleri
  let sumA = 0;
  for (const k of keys) {
    sumA += animalVec[k];
  }
  const meanA = sumA / N;

  let varA = 0;
  for (const k of keys) {
    const diff = animalVec[k] - meanA;
    varA += diff * diff;
  }
  const stdA = Math.sqrt(varA / N) || 1;

  // 3. Standartlaştırılmış Z-Score Pearson Korelasyonu
  let dotProduct = 0;
  let absDevDiffSum = 0;

  for (const k of keys) {
    const zU = (userVec[k] - meanU) / stdU;
    const zA = (animalVec[k] - meanA) / stdA;
    dotProduct += zU * zA;
    absDevDiffSum += Math.abs(zU - zA);
  }

  const pearson = dotProduct / N; // -1.0 to +1.0
  const normalizedPearson = (pearson + 1) / 2; // 0.0 to 1.0

  // Z-Score mesafe uyumu
  const avgZDiff = absDevDiffSum / N;
  const zDistanceScore = Math.max(0, 1 - (avgZDiff / 2.5)); // 0.0 to 1.0

  // Birleşik benzerlik: %65 profil formu korelasyonu + %35 Z-mesafe uyumu.
  // Skor yapay taban/tavan ile sıkıştırılmaz; 0-100 aralığında gerçek bileşik
  // benzerliği temsil eder. Böylece confidenceScore kalibre edilmemiş bir
  // "minimum güven" değil, doğrudan match score olur.
  const composite = Math.min(1, Math.max(0, (normalizedPearson * 0.65) + (zDistanceScore * 0.35) + personalBonus));
  return Math.round(composite * 1000) / 10;
}

/**
 * Gölge Totemi hesaplar:
 * Kişinin en bastırdığı (vektörde zıt kutupta kalan) ve bilinçdışında dengelenmeye muhtaç
 * boyutları zıt polarite (100 - userVector ve ters Z-score) ile tespit eder.
 * Bu zıt kutbu en güçlü taşıyan ve dönüştürücü koruma sunan hayvanı bulur.
 */
export function findShadowGuardianTotem(
  userVector: BehavioralVector,
  primaryId: string,
  secondaryId: string
): TotemAnimalProfile {
  // İnvert edilmiş gölge vektörü: 100 - userVector
  const invertedVector: BehavioralVector = {} as BehavioralVector;
  (Object.keys(userVector) as BehavioralDimensionKey[]).forEach(k => {
    invertedVector[k] = 100 - userVector[k];
  });

  const candidates = TOTEM_ANIMALS_52.filter(a => a.id !== primaryId && a.id !== secondaryId);
  let bestShadow: TotemAnimalProfile = candidates[0] || TOTEM_ANIMALS_52[0];
  let highestScore = -1;

  for (const animal of candidates) {
    const score = calculateVectorSimilarity(invertedVector, animal.behavioralVector);
    if (score > highestScore) {
      highestScore = score;
      bestShadow = animal;
    }
  }

  return bestShadow;
}

/**
 * Enneagram ile Totem arasındaki çapraz analiz (Totem'i Enneagram'a ZORLA UYDURMADAN bağımsız içgörü üretir)
 */
export function generateCrossEnneagramTotemInsight(
  enneagramType: number,
  primaryTotem: TotemAnimalProfile,
  userVector: BehavioralVector
): string {
  const enneaDescriptions: Record<number, { name: string; focus: string }> = {
    1: { name: 'Tip 1 (Reformcu & Mükemmeliyetçi)', focus: 'kusursuz ilke ve adalet arayışı' },
    2: { name: 'Tip 2 (Yardımsever & Şefkatli Dost)', focus: 'koşulsuz sevgi ve fedakar bağ kurma' },
    3: { name: 'Tip 3 (Başarı Odaklı Dönüştürücü)', focus: 'parlayan başarı ve verimli etki' },
    4: { name: 'Tip 4 (Özgün & Mistik Bireyci)', focus: 'derin duygusal özgünlük ve anlam' },
    5: { name: 'Tip 5 (Gözlemci & Bilge Araştırmacı)', focus: 'zihinsel yetkinlik ve sınırlarını koruma' },
    6: { name: 'Tip 6 (Sadık Muhafız & Tedbirli Stratejist)', focus: 'güvenlik ve sarsılmaz sadakat' },
    7: { name: 'Tip 7 (Maceracı & Coşkulu Vizyoner)', focus: 'özgürlük, deneyim ve acıdan kaçınma' },
    8: { name: 'Tip 8 (Meydan Okuyan Güçlü Lider)', focus: 'tavizsiz güç ve hakkaniyetli koruma' },
    9: { name: 'Tip 9 (Barışçı & Uyumlu Bilge)', focus: 'iç huzur ve bütünleştirici sükunet' }
  };

  const enneaInfo = enneaDescriptions[enneagramType] || enneaDescriptions[4];
  const totemName = primaryTotem.turkishName || primaryTotem.name;

  return `Enneagram ${enneaInfo.name} motivasyonu (${enneaInfo.focus}), testte ortaya çıkan ${totemName} arketipiyle çok boyutlu bir denge kurar. Bu iki sistem birbirine bağımlı değildir; Enneagram kişinin içsel psikolojik motorunu, ${totemName} ise kriz ve eylem anlarındaki saf davranışsal refleksini yansıtır.`;
}

/**
 * Ana Davranışsal Totem Hesaplama Fonksiyonu
 * Kullanıcı test yanıtları + isteğe bağlı kişisel astrolojik / numerolojik eğilimler
 */
export function calculateBehavioralTotemResult(
  answers: Record<number, string>,
  enneagramType: number = 4,
  personalContext?: {
    dominantElement?: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | string;
    lifePathNumber?: number;
    sunSign?: string;
  }
): TotemTestCalculationResult {
  const userVector = calculateUserBehavioralVector(answers);

  // 52 Hayvanla karşılaştırma
  const scoredMatches: TotemMatchScore[] = TOTEM_ANIMALS_52.map(animal => {
    let personalBonus = 0;
    // Eğer kullanıcının astrolojik elementi hayvanın elementiyle eşleşiyorsa +%2.5 rezonans bonusu
    if (personalContext?.dominantElement && animal.element === personalContext.dominantElement) {
      personalBonus += 0.025;
    }

    // Eşleşme yalnızca davranışsal vektör + açıkça tanımlı astrolojik element
    // rezonansından hesaplanır. Yapay/hash tabanlı puan eklenmez.
    const similarityScore = calculateVectorSimilarity(
      userVector,
      animal.behavioralVector,
      personalBonus
    );
    return {
      animal,
      similarityScore
    };
  });

  // Sıralama (En yüksek uyumdan düşüğe)
  scoredMatches.sort((a, b) => b.similarityScore - a.similarityScore);

  const primaryTotem = scoredMatches[0]?.animal || TOTEM_ANIMALS_52[0];
  
  // İkincil Müttefik Totemi: Birincilden farklı bir habitat veya tamamlayıcı müttefik
  let secondaryTotem = scoredMatches[1]?.animal || TOTEM_ANIMALS_52[1];
  // Eğer ilk 3 eşleşme çok yakınsa müttefik olarak en yüksek ikinciyi seç
  if (scoredMatches[1] && scoredMatches[1].animal.id === primaryTotem.id && scoredMatches[2]) {
    secondaryTotem = scoredMatches[2].animal;
  }

  const primaryScore = scoredMatches[0]?.similarityScore || 85;
  const secondaryScore = scoredMatches[1]?.similarityScore || 80;
  const proximityDiff = Math.round((primaryScore - secondaryScore) * 10) / 10;
  const isProximityClose = proximityDiff <= 3.8;

  const shadowTotem = findShadowGuardianTotem(userVector, primaryTotem.id, secondaryTotem.id);
  // Yapay minimum yok: skor gerçek eşleşmeyi yansıtır.
  const confidenceScore = Math.round(primaryScore * 10) / 10;

  const crossInsight = generateCrossEnneagramTotemInsight(enneagramType, primaryTotem, userVector);

  return {
    primaryTotem,
    secondaryTotem,
    shadowTotem,
    topMatches: scoredMatches.slice(0, 10),
    userVector,
    confidenceScore,
    isProximityClose,
    proximityDifference: proximityDiff,
    crossEnneagramInsight: crossInsight
  };
}
