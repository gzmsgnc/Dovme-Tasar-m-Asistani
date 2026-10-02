import { NumerologyProfile, AstrologyProfile } from '../types';

export interface ChakraItem {
  number: number; // 1-9
  sanskritName: string;
  turkishName: string;
  location: string;
  element: string;
  color: string;
  frequencyCount: number;
  status: 'Blokajlı / Eksik' | 'Pasif / Düşük' | 'Dengeli' | 'Aşırı Yoğun';
  statusExplanation: string;
  healingSymbols: string[];
  yantraGeometry: string;
  tattooPlacementAdvice: string;
}

export interface ChakraProfile {
  chakras: ChakraItem[];
  dominantChakras: ChakraItem[];
  blockedChakras: ChakraItem[];
  overallChakraBalanceScore: number;
  primaryHealingDirective: string;
  primaryChakraAffirmation: string;
}

export function calculateChakraProfile(
  numerology: NumerologyProfile,
  astrology: AstrologyProfile
): ChakraProfile {
  const counts = numerology.chakraCounts || {};

  const chakraDefinitions = [
    {
      number: 1,
      sanskritName: 'Muladhara',
      turkishName: 'Kök Çakra',
      location: 'Kuyruk Sokumu & Omurga Tabanı',
      element: 'Toprak',
      color: '#ef4444', // Kırmızı
      yantraGeometry: 'Dört Köşeli Kare & Prithvi Yantrası',
      healingSymbols: ['Kadim Meşe Kökleri', 'Metatron Küpü', 'Kara Turmalin / Hematit', 'Ayı / Boğa Arketipi'],
      baseTattooAdvice: 'Dövmenin en alt tabanına, omurga köküne veya alt sınırına sağlam bir geometrik zemin olarak yerleştirilmelidir.'
    },
    {
      number: 2,
      sanskritName: 'Svadhisthana',
      turkishName: 'Sakral Çakra',
      location: 'Alt Karın & Pelvis Bölgesi',
      element: 'Su',
      color: '#f97316', // Turuncu
      yantraGeometry: 'Gümüş Hilal & Su Nilüferi',
      healingSymbols: ['Kozmik Su Dalgası', 'Hilal Ay (Crescent Moon)', 'Koi Balığı', 'Turuncu Carnelian'],
      baseTattooAdvice: 'Kompozisyonun alt orta kavisinde, akışkan dalgalar ve kıvrımlı hatlarla organik geçiş oluşturmalıdır.'
    },
    {
      number: 3,
      sanskritName: 'Manipura',
      turkishName: 'Solar Pleksus (Mide)',
      location: 'Göbek Üstü & Diyafram',
      element: 'Ateş',
      color: '#eab308', // Altın Sarısı
      yantraGeometry: 'Ters Aşağı Bakan Ateş Üçgeni (Agni)',
      healingSymbols: ['Güneş Işınları / Solar Flare', 'Altın Aslan', 'Sitrin Taşı', 'Alev Kıvılcımları'],
      baseTattooAdvice: 'Tasarımın merkez çekim odağına veya gövde eksenine dinamik güç veren bir güneş sembolü olarak işlenmelidir.'
    },
    {
      number: 4,
      sanskritName: 'Anahata',
      turkishName: 'Kalp Çakrası',
      location: 'Göğüs Kafesi Merkezi (Timus)',
      element: 'Hava',
      color: '#10b981', // Zümrüt Yeşili / Gül Kurusu
      yantraGeometry: 'İç İçe Geçmiş İki Üçgen (Heksagram / David Yıldızı)',
      healingSymbols: ['Kutsal Lotus (Nilüfer)', 'Gül & Diken', 'Zümrüt Kristalleri', 'Kuğu / Ak Geyik'],
      baseTattooAdvice: 'Kompozisyonun alt fiziksel dünya ile üst ruhsal dünya arasındaki tam merkez köprüsüne yerleştirilmelidir.'
    },
    {
      number: 5,
      sanskritName: 'Vishuddha',
      turkishName: 'Boğaz Çakrası',
      location: 'Boğaz Çukuru & Boyun Aksı',
      element: 'Eter / Ses',
      color: '#06b6d4', // Turkuaz / Buz Mavisi
      yantraGeometry: 'İçinde Beyaz Daire Olan Hilal (Akasha)',
      healingSymbols: ['Geniş Açık Kanatlar', 'Kozmik Şahin', 'Turkuaz / Lapis', 'Mistik Ses Frekans Dalgaları'],
      baseTattooAdvice: 'Dövmenin üst kısmında yukarı doğru genişleyen kanat veya ses dalgası formuyla yükseliş hissi vermelidir.'
    },
    {
      number: 6,
      sanskritName: 'Ajna',
      turkishName: 'Üçüncü Göz Çakrası',
      location: 'İki Kaşın Ortası & Alın',
      element: 'Saf Işık / Sezgi',
      color: '#6366f1', // Çivit Mavisi / Gece Laciverti
      yantraGeometry: 'İki Taç Yapraklı Lotus & Kozmik Göz',
      healingSymbols: ['Her Şeyi Gören Göz (Eye of Providence)', 'Gece Baykuşu', 'Labradorit', 'Kutsal Geometri Ayna Sigili'],
      baseTattooAdvice: 'Kompozisyonun tepe noktasına veya geometrik eksenin üst odağına entegre edilebilir.'
    },
    {
      number: 7,
      sanskritName: 'Sahasrara',
      turkishName: 'Taç Çakra',
      location: 'Başın Tepesi (Bıngıldak)',
      element: 'Kozmik Bilinç / İlahi Eter',
      color: '#a855f7', // Menekşe Moru / Altın Beyazı
      yantraGeometry: 'Bin Yapraklı Lotus & Kutsal Çember',
      healingSymbols: ['Bin Yapraklı Lotus', 'Sri Yantra Tepe Odağı', 'Ametist Jeodu', 'Işık Hale Çemberi'],
      baseTattooAdvice: 'Tüm tasarımın en üst zirvesinde auranın evrene açıldığı taç halesi olarak işlenmelidir.'
    },
    {
      number: 8,
      sanskritName: 'Prana Mandal',
      turkishName: 'Aura & Biyo-Manyetik Kalkan',
      location: 'Bedenin Dış Enerji Alanı (Aura)',
      element: 'Kozmik Manyetizma',
      color: '#e2e8f0', // Platin / Antik Gümüş
      yantraGeometry: 'Sonsuzluk İşareti (Lemniscate) & Ouroboros',
      healingSymbols: ['Ouroboros Yılanı', 'Sonsuzluk Düğümü (Endless Knot)', 'Obsidyen Kalkan', 'Çift Ağızlı Kılıç'],
      baseTattooAdvice: 'Tasarımı dışarıdan çevreleyen koruyucu sacred mandala veya stippling gölge halkası olarak kullanılmalıdır.'
    },
    {
      number: 9,
      sanskritName: 'Karmic Moksha',
      turkishName: 'Kozmik Hafıza & Tamamlanma',
      location: 'Ruh Yıldızı & Göksel Kapı',
      element: 'Evrensel Sevgi & İlahi Bütünlük',
      color: '#f8fafc', // Kristal Beyaz / Altın
      yantraGeometry: 'Dokuz Köşeli Yıldız (Enneagram) & koşullu 19 İlahi Mührü',
      healingSymbols: ['Doğrulanmış 19 İlahi Yardım Mührü', 'Anka Kuşu (Küllerinden Doğuş)', 'Kozmik Spiral', 'Yaşam Çiçeği (Flower of Life)'],
      baseTattooAdvice: 'Tasarımın en gizli mikro-detay katmanına (gizli constellation veya dotwork sigil) kodlanmalıdır.'
    }
  ];

  const chakras: ChakraItem[] = chakraDefinitions.map((def) => {
    const count = counts[def.number] || 0;
    let status: 'Blokajlı / Eksik' | 'Pasif / Düşük' | 'Dengeli' | 'Aşırı Yoğun' = 'Dengeli';
    let statusExplanation = '';

    if (count === 0) {
      status = 'Blokajlı / Eksik';
      statusExplanation = `İsimde ${def.number} frekansında hiçbir harf bulunmamaktadır. Bu, numerolojik sembol matrisinde eksik frekans olarak işaretlenir; tasarımda destekleyici geometriyle sembolik olarak ele alınabilir.`;
    } else if (count === 1) {
      status = 'Pasif / Düşük';
      statusExplanation = `Tekil titreşim mevcut. Potansiyel var ancak dış etkenlerle çabuk yorulabilir; destekleyici geometri ile aktive edilmelidir.`;
    } else if (count >= 2 && count <= 4) {
      status = 'Dengeli';
      statusExplanation = `Bu frekans aralıkta güçlü temsil edilir ve kompozisyonda destekleyici bir eksen olarak ele alınabilir.`;
    } else {
      status = 'Aşırı Yoğun';
      statusExplanation = `${count} adet harf ile yüksek enerji yüklemesi. Fazla enerji gölge nitelikler yaratabilir; yumuşatıcı akış sembolleriyle dengelenmelidir.`;
    }

    return {
      number: def.number,
      sanskritName: def.sanskritName,
      turkishName: def.turkishName,
      location: def.location,
      element: def.element,
      color: def.color,
      frequencyCount: count,
      status,
      statusExplanation,
      healingSymbols: def.healingSymbols,
      yantraGeometry: def.yantraGeometry,
      tattooPlacementAdvice: def.baseTattooAdvice
    };
  });

  // 19 yalnızca numeroloji motoru tarafından açıkça doğrulandıysa çakra katmanına girebilir.
  if (numerology.divineHelp19?.has19 !== true) {
    const chakra9 = chakras.find(c => c.number === 9);
    if (chakra9) {
      chakra9.healingSymbols = chakra9.healingSymbols.filter(s => !/\b19\b|19\s*İlahi/i.test(s));
      chakra9.yantraGeometry = chakra9.yantraGeometry
        .replace(/\s*&\s*koşullu 19 İlahi Mührü/i, '')
        .replace(/\s*&\s*19 İlahi Mührü/i, '');
    }
  }

  const dominantChakras = chakras.filter((c) => c.status === 'Aşırı Yoğun' || c.status === 'Dengeli');
  const blockedChakras = chakras.filter((c) => c.status === 'Blokajlı / Eksik');

  // Calculate balance score (out of 100)
  const idealScore = 100;
  const penalty = blockedChakras.length * 12 + chakras.filter((c) => c.status === 'Aşırı Yoğun').length * 6;
  const overallChakraBalanceScore = Math.max(45, idealScore - penalty);

  let primaryHealingDirective = '';
  let primaryChakraAffirmation = '';
  if (blockedChakras.length > 0) {
    const names = blockedChakras.map((b) => `${b.number}. Çakra (${b.turkishName})`).join(', ');
    primaryHealingDirective = `Kişinin numerolojik haritasında tespit edilen en kritik çakra blokajları: ${names}. Dövme tasarımında bu çakraların kutsal geometrileri (${blockedChakras.map((b) => b.yantraGeometry).slice(0, 2).join(' + ')}) ve şifa sembolleri temel mimariye mutlaka entegre edilmelidir.`;
    primaryChakraAffirmation = `Bedenimdeki ve ruhumdaki tüm blokajları sevgiyle serbest bırakıyorum; ${blockedChakras[0].turkishName} frekansım dengeleniyor ve evrensel yaşam enerjisi içimden engelsizce akıyor.`;
  } else {
    primaryHealingDirective = numerology.divineHelp19?.has19 === true
      ? `Kişinin tüm temel çakralarında harf frekansı mevcuttur. Dövme tasarımı mevcut harmoniyi taçlandıracak ve doğrulanmış 19 İlahi Mührü ile auranın biyo-manyetik kalkanını güçlendirecek şekilde kurgulanacaktır.`
      : `Kişinin tüm temel çakralarında harf frekansı mevcuttur. Dövme tasarımı mevcut harmoniyi taçlandıracak ve auranın biyo-manyetik kalkanını güçlendirecek şekilde kurgulanacaktır.`;
    primaryChakraAffirmation = `Sembolik enerji haritam bütünlük, köklenme ve berraklık temalarıyla ifade edilebilir.`;
  }

  return {
    chakras,
    dominantChakras,
    blockedChakras,
    overallChakraBalanceScore,
    primaryHealingDirective,
    primaryChakraAffirmation
  };
}
