import { TotemVisualProfile } from '../types';
import { TOTEM_ANIMALS_52, TotemAnimalProfile, getTotemAnimalStrict } from './totemCatalogData';

/**
 * 52 Kadim Hayvan için Görsel Dil ve Çizgisel Soyutlama Kütüphanesi
 * 
 * ÖNEMLİ PRENSİP:
 * 1. Totem hayvanı bulunduğunda hayvan figürünü birebir çizmek ZORUNLU DEĞİLDİR.
 * 2. Hayvanın anatomik çizgileri, siluet özellikleri, geometrik karşılıkları ve negatif alan
 *    potansiyelleri tek bir bütünsel dövme kompozisyonuna entegre edilebilir.
 * 3. Gerçek tarihsel/kültürel semboller ile model tarafından hayvanın formundan türetilen
 *    görsel soyutlamalar kesin olarak ayrıştırılır (Kaynak şeffaflığı).
 */

const CURATED_TOTEM_VISUAL_PROFILES: Record<string, Partial<TotemVisualProfile>> = {
  bozkir_kurdu: {
    animalId: 'bozkir_kurdu',
    animalName: 'Kurt (Wolf)',
    turkishName: 'Bozkurt & Orman Kurdu',
    element: 'Toprak',
    directRepresentationGuide: '3/4 profilden tetikte, keskin kulak duruşu, badem gözler ve ense yelesinin dinamik hatları.',
    anatomicalAbstraction: {
      keyFeatures: ['Kulak ve şakak üçgeni', 'Çene ve burun doğrusal hattı', 'Yele kıl ritmi', 'Gözün odak ekseni'],
      simplifiedVectorDescription: 'Keskin açılı 3 ana kontur çizgisi: Kulak eğimi, burun köprüsü ve çene konturu.'
    },
    geometricAbstraction: {
      coreShapes: ['Açılı üçgen düzlemler', 'Dinamik yönlü chevron (çavuş) hatları', 'Dikey ok ekseni'],
      symmetryType: 'Dinamik Asimetrik veya Aksiyal Bilateral'
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: true,
      traditionalSymbols: ['Göktürk Kurt Başlı Tuğ Damgası', 'İskit Çapraz Bozkurt Plakası'],
      basisOrOrigin: 'Tarihsel Türk ve Avrasya bozkır göçebe kurgan ikonografisi (Arkeolojik buluntularla belgeli)'
    },
    patternLanguage: '03RL kesintili kıl hatları, 30 derecelik açılı paralellikler, yönlü ritmik tarama.',
    lineLanguage: 'Keskin, kararlı, dinamik konik hat; sıfır tereddütlü düz ve hafif içbükey konturlar.',
    repetitionMotifs: ['Yele açısı tekrarı', 'Üçgen kulak modülü', 'Adım ritmi paralel çizgileri'],
    symmetryAsymmetry: 'Hareket halinde asimetrik akış; koruyucu nöbet halinde katı bilateral denge.',
    negativeSpacePotentials: [
      'İki lotus yaprağının veya geometrik üçgenin arasındaki negatif boşlukta beliren kurt profil silueti',
      'Hilal formunun iç boşluğunun kulak ve burun hattını tamamlaması'
    ],
    tattooFriendlyAbstraction: '03RL mikro-kontur ile çizilmiş 3 çizgilik geometrik siluet; yaşlanmada dağılmayı önlemek için minimum 4mm çizgi aralığı.'
  },

  kizil_geyik: {
    animalId: 'kizil_geyik',
    animalName: 'Kızıl Geyik (Red Deer)',
    turkishName: 'Kızıl Orman Geyiği',
    element: 'Toprak',
    directRepresentationGuide: 'Görkemli çok çatallı boynuzlar, asil dik boyun, derin sakin gözler ve taçlanan siluet.',
    anatomicalAbstraction: {
      keyFeatures: ['Dallanan boynuz fraktalları', 'Boyun ve göğüs yay hattı', 'Kulak yaprak formu'],
      simplifiedVectorDescription: 'Altın orana göre dallanan 7 çatallı boynuz fraktalı ve dikey omurga uzantısı.'
    },
    geometricAbstraction: {
      coreShapes: ['Fraktal ağaç dallanması', 'Fibonacci spirali boynuz eğrisi', 'Dikey kutsal eksen'],
      symmetryType: 'Radyal Taç Simetrisi'
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: true,
      traditionalSymbols: ['Pazırık Kurganı Güneş Boynuzlu Alageyik Motifi', 'Kelt Cernunnos Boynuz Düğümü'],
      basisOrOrigin: 'Altay Pazırık dövmeleri ve Kelt boynuzlu tanrı ikonografisi (Tarihsel arkeolojik kayıtlar)'
    },
    patternLanguage: 'Ağaç dalı benzeri organik fraktal çizgiler, tomurcuk noktaları, hafif whip shading.',
    lineLanguage: 'Akışkan, incelen, zarafet dolu kavisli yay hatları.',
    repetitionMotifs: ['Boynuz çatalı ritmi', 'Damlalık yaprak formları', 'Dikey büyüme meridyeni'],
    symmetryAsymmetry: 'Merkezi dikey simetri ekseni üzerinde organik asimetrik dal varyasyonları.',
    negativeSpacePotentials: [
      'Boynuz dallarının arasındaki boşlukta kutsal geometrik yaşam çiçeğinin belirmesi',
      'İki boynuz çatısı arasında saklanan ay fazı veya güneş diski'
    ],
    tattooFriendlyAbstraction: 'Boynuzların ana çatısını 05RL ile, kılcal çatalları 03RL ile çizerek deri altında net kalıcılık.'
  },

  gece_baykusu: {
    animalId: 'gece_baykusu',
    animalName: 'Alaca Baykuş (Tawny Owl)',
    turkishName: 'Kadim Alaca Baykuş',
    element: 'Hava',
    directRepresentationGuide: 'Geniş dairesel yüz diski, hipnotik delici yuvarlak gözler, katmanlı tüy örtüsü.',
    anatomicalAbstraction: {
      keyFeatures: ['Eşmerkezli çift göz halkası', 'Yüz diskinin kalp/daire formu', 'Kanat tüyü radyal yayları'],
      simplifiedVectorDescription: 'İki iç içe geçmiş daire ve ortasındaki odak noktasından yayılan radyal çizgiler.'
    },
    geometricAbstraction: {
      coreShapes: ['Eşmerkezli halkalar', 'Vesica Piscis göz geometrisi', 'Toroid radyal akış'],
      symmetryType: 'Kusursuz Bilateral ve Dairesel Simetri'
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: true,
      traditionalSymbols: ['Atina Bilgelik Glaucus Baykuşu', 'Antik Roma Minerva Baykuş Motifi'],
      basisOrOrigin: 'Klasik Yunan Atina tetradrahmi sikkeleri ve bilgelik sembolizmi (MÖ 5. yy)'
    },
    patternLanguage: 'Konsantrik daireler, radyal tüy taramaları, micro-dotwork göz irisi.',
    lineLanguage: 'Hassas dairesel konturlar, yumuşak tüysü gölgeler, geometrik keskin odak.',
    repetitionMotifs: ['Halka dizilimleri', 'Yay tüyü sıralaması', 'Göz bebeği geometrisi'],
    symmetryAsymmetry: 'Güçlü bilateral ayna simetrisi.',
    negativeSpacePotentials: [
      'İki göz halkasının kesiştiği negatif alanda Enneagram merkezinin veya üçgeninin gizlenmesi',
      'Kanat eğrilerinin birleştiği alanda hilal formu'
    ],
    tattooFriendlyAbstraction: 'Gözler net geometrik halka olarak soyutlanır, tüy detayları hafif noktalama ile açık ten alanına bırakılır.'
  },

  boynuzlu_engerek: {
    animalId: 'boynuzlu_engerek',
    animalName: 'Engerek & Yılan (Serpent / Viper)',
    turkishName: 'Şahmeran & Boynuzlu Engerek',
    element: 'Su',
    directRepresentationGuide: 'Sarmal spiral gövde akışı, elmas başlı kafa formu, çatal dil ve deri pulları.',
    anatomicalAbstraction: {
      keyFeatures: ['Sinusoidal S-dalgası', 'Pulların eşkenar dörtgen / balıksırtı deseni', 'Spiral düğüm'],
      simplifiedVectorDescription: 'Sarmal Fibonacci spiral eğrisi ve omurga boyunca eşkenar dörtgen kafes.'
    },
    geometricAbstraction: {
      coreShapes: ['Sarmal spiral (Kundalini)', 'Eşkenar dörtgen kafes (Tessellation)', 'Sonsuzluk (Lemniscate)'],
      symmetryType: 'Eksenel Kavisli Spiral Asimetri'
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: true,
      traditionalSymbols: ['Ouroboros (Kuyruğunu Isıran Yılan)', 'Asklepios Asası ve Hermes Kadüse'],
      basisOrOrigin: 'Antik Helen tıp sembolü ve antik Mısır-Simya Ouroboros mühürleri'
    },
    patternLanguage: 'Eşkenar dörtgen örgü, spiral gradyan hatları, ince pullu doku.',
    lineLanguage: 'Akışkan, kesintisiz, dinamik tek-çizgi (continuous single stroke).',
    repetitionMotifs: ['Pul kafesi', 'Dalga periyodu', 'Spiral halkalar'],
    symmetryAsymmetry: 'Anatomik hatları sarmalayan dinamik asimetrik akış.',
    negativeSpacePotentials: [
      'Yılanın sarmal halkalarının ortasındaki negatif boşlukta çakra mühürlerinin parlaması',
      'Kuyruk ve baş kıvrımının oluşturduğu negatif alanda damla motifi'
    ],
    tattooFriendlyAbstraction: 'Yılan tek bir kesintisiz çizgi (monoline) olarak tasarlanabilir; pullar aralıklı noktalama ile hava alır.'
  },

  kaya_kartali: {
    animalId: 'kaya_kartali',
    animalName: 'Kaya Kartalı (Golden Eagle)',
    turkishName: 'Kutlu Kaya Kartalı',
    element: 'Ateş',
    directRepresentationGuide: 'Geniş açılmış kanat telekleri, kanca gaga, keskin ileri bakan vizyoner gözler.',
    anatomicalAbstraction: {
      keyFeatures: ['Geniş kanat yay açısı', 'Kanca gaga profili', 'Pençe kavrayış üçgeni', 'Telek katmanları'],
      simplifiedVectorDescription: 'V şeklinde açılan iki aerodinamik yay kanadı ve merkezde keskin dikey gaga oku.'
    },
    geometricAbstraction: {
      coreShapes: ['Genişleyen ters üçgen (V-şekli)', 'Radyal telek ışınları', 'Dikey ok vektörü'],
      symmetryType: 'Aksiyal Dikey Simetri'
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: true,
      traditionalSymbols: ['Çift Başlı Selçuklu Kartalı', 'Şamanik Gök Kuşu Öksökö / Bürküt'],
      basisOrOrigin: 'Anadolu Selçuklu mimari taş kabartmaları ve Altay şamanik gök mitolojisi'
    },
    patternLanguage: 'Açılan yelpaze telek hatları, keskin geometrik katmanlar.',
    lineLanguage: 'Kuvvetli, keskin, aerodinamik, yukarı doğru yönelen hatlar.',
    repetitionMotifs: ['Telek kademeleri', 'Ok ucu tekrarları', 'Işınsal kanat hatları'],
    symmetryAsymmetry: 'Kanat açıklığında görkemli dikey simetri.',
    negativeSpacePotentials: [
      'Kanatların altındaki negatif alanda güneş diskinin veya lotus çiçeğinin yükselmesi',
      'İki kanat teleğinin arasında oluşan hançer silueti'
    ],
    tattooFriendlyAbstraction: 'Telekler birbirinden ayrık tutularak deride mürekkebin birbirine akması (blowout) engellenir.'
  }
};

/**
 * Belirli bir totem hayvanı için görsel dil profilini getirir.
 * Her animalId için SADECE o hayvana ait veri kaydı kullanılır.
 * Başka hiçbir hayvanın anatomik veya görsel özellikleri aktarılamaz.
 */
export function getTotemVisualProfile(animalIdOrName: string | TotemAnimalProfile): TotemVisualProfile {
  if (!animalIdOrName) {
    throw new Error('Görsel profil üretimi için totem hayvanı kimliği zorunludur. Boş veya tanımsız veriyle görsel profil üretilemez.');
  }

  // 1. Doğrudan ve kesin hayvan kimliği çözümü (Asla gevşek arama veya fallback wolf yapılmaz!)
  const catalogAnimal = getTotemAnimalStrict(animalIdOrName);

  // 2. Doğrudan EXACT ID eşleşmesi (Küratörlü Profiller)
  const curated = CURATED_TOTEM_VISUAL_PROFILES[catalogAnimal.id];
  if (curated && curated.animalId === catalogAnimal.id) {
    const base = generateVisualProfileFromCatalog(catalogAnimal);
    return {
      ...base,
      ...curated,
      animalId: catalogAnimal.id,
      animalName: catalogAnimal.name,
      turkishName: catalogAnimal.turkishName,
      element: catalogAnimal.element
    } as TotemVisualProfile;
  }

  // 3. 52 Hayvan Kataloğundaki o hayvana özel veriden %100 senkronize profil üret
  return generateVisualProfileFromCatalog(catalogAnimal);
}

/**
 * 52 hayvanlık katalog verisinden şeffaf ve kurallara uygun TotemVisualProfile üretir.
 */
function generateVisualProfileFromCatalog(animal: TotemAnimalProfile): TotemVisualProfile {
  const isAir = animal.element === 'Hava' || animal.realm.includes('Gökyüzü');
  const isWater = animal.element === 'Su' || animal.realm.includes('Sular') || animal.realm.includes('Okyanus');
  const isEarth = animal.element === 'Toprak' || animal.realm.includes('Orman') || animal.realm.includes('Bozkır');
  
  // Element ve anatomiye göre çizgi dili belirle
  const lineLanguage = isAir 
    ? '03RL ultra-ince aerodinamik hatlar, hafiflik hissi veren kesintili yaylar'
    : isWater
    ? 'Kesintisiz akışkan dalga hatları, yumuşak kıvrımlar ve organik spiral dönüşler'
    : isEarth
    ? 'Sağlam tabanlı tektonik konturlar, kararlı açısal geçişler ve topraklanmış çizgiler'
    : 'Dinamik yukarı yönelen alevsi ok hatları, keskin açılı ışımalar';

  const symmetry = isAir
    ? 'Bilateral kanat açıklığı simetrisi'
    : isWater
    ? 'Akışkan dinamik spiral asimetrisi'
    : 'Dengeli organik asimetri';

  return {
    animalId: animal.id,
    animalName: animal.name,
    turkishName: animal.turkishName,
    element: animal.element,
    directRepresentationGuide: `${animal.tattooPhysicalFeature}. Duruş: ${animal.posture}. Bakış: ${animal.gazeDirection}.`,
    anatomicalAbstraction: {
      keyFeatures: [
        `${animal.tattooPhysicalFeature.split(',')[0] || 'Karakteristik baş ve siluet formu'}`,
        'Siluet akış ekseni',
        'Hareket yönlendirici kontur hattı'
      ],
      simplifiedVectorDescription: `${animal.name} anatomisinden türetilmiş 3-5 ana kılavuz kontur çizgisi ve sadeleştirilmiş siluet vektörü.`
    },
    geometricAbstraction: {
      coreShapes: [
        isWater ? 'Fibonacci akış spirali' : isAir ? 'Radyal kanat yayları' : 'Açısal koruyucu çokgenler',
        'Denge ekseni',
        'Merkezi odak geometri'
      ],
      symmetryType: symmetry
    },
    traditionalSymbolicAssociations: {
      hasAuthenticTraditional: false,
      traditionalSymbols: [],
      basisOrOrigin: 'AI-derived visual abstraction (Hayvanın anatomik ve davranışsal özelliklerinden türetilmiş soyutlama)'
    },
    patternLanguage: `03RL mikro-tarama, ${animal.element.toLowerCase()} elementi rezonansında ritmik çizgi tekrarları.`,
    lineLanguage,
    repetitionMotifs: [
      'Hareket ritmi çizgileri',
      'Yüzey dokusu soyutlama basamakları'
    ],
    symmetryAsymmetry: symmetry,
    negativeSpacePotentials: [
      `Tasarımın merkezindeki geometrik hatların arasında ${animal.turkishName} siluetini hissettiren negatif alan`,
      'Çevreleyen botanik veya kutsal geometri çizgilerinin oluşturduğu karşıt boşluk'
    ],
    tattooFriendlyAbstraction: `${animal.recommendedStyles.join(' & ')} stiline uyumlu, deride yaşlanmayı tolere eden dengeli çizgi ve negatif alan dengesi.`
  };
}
