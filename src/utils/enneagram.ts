import { EnneagramProfile, EnneagramQuestion } from '../types';

export interface EnneagramTypeData {
  type: number;
  typeName: string;
  wings: string[];
  coreMotivation: string;
  coreFear: string;
  strengths: string[];
  shadowTraits: string[];
  stressPoint: number;
  growthPoint: number;
  symbolicMeaning: string;
}

export const ENNEAGRAM_TYPES: Record<number, EnneagramTypeData> = {
  1: {
    type: 1,
    typeName: 'Mükemmeliyetçi & Reformcu',
    wings: ['1w9', '1w2'],
    coreMotivation: 'Doğru olanı yapmak, dürüst ve erdemli yaşamak, dünyayı iyileştirmek.',
    coreFear: 'Kusurlu, yozlaşmış, adaletsiz veya hatalı olmak.',
    strengths: ['Yüksek etik anlayış', 'İlkeli duruş', 'Kusursuz disiplin', 'Adalet duygusu', 'Yapıcı organizasyon'],
    shadowTraits: ['Katı öfke ve yargılama', 'Aşırı eleştirellik', 'Esneyememe', 'Kendini ve başkalarını cezalandırma'],
    stressPoint: 4,
    growthPoint: 7,
    symbolicMeaning: 'Kusursuz simetri, terazi, arınmış kılıç, kristalize geometrik nizam ve kutsal mimari.'
  },
  2: {
    type: 2,
    typeName: 'Yardımsever & Fedakâr Dost',
    wings: ['2w1', '2w3'],
    coreMotivation: 'Sevilmek, değer görmek, başkalarının hayatına dokunmak ve korunmak.',
    coreFear: 'İstenmeyen, değersiz veya sevilmeye layık görülmemek.',
    strengths: ['Derin empati', 'Karşılıksız cömertlik', 'Sıcak şefkat', 'Duygusal zeka', 'Güvenli bağ kurma'],
    shadowTraits: ['Dolaylı manipülasyon', 'Kendi ihtiyaçlarını inkâr etme', 'Bağımlılık yaratma çabası', 'Kırgınlık'],
    stressPoint: 8,
    growthPoint: 4,
    symbolicMeaning: 'Şifalı sarmaşıklar, açık eller, kadeh, kalp kalkanı ve koruyucu kanatlar.'
  },
  3: {
    type: 3,
    typeName: 'Başarı Odaklı & Parlayan Dönüştürücü',
    wings: ['3w2', '3w4'],
    coreMotivation: 'Değerli hissetmek, başarı kazanmak, etki yaratmak ve parlamak.',
    coreFear: 'Başarısız, önemsiz ve yetersiz olmak.',
    strengths: ['Yüksek hedef odaklılık', 'Manyetik çekim', 'Verimlilik', 'Uyum sağlama', 'İlham verici liderlik'],
    shadowTraits: ['İmaj bağımlılığı', 'Duyguları bastırma', 'Aşırı rekabetçilik', 'Öz değerini başarıya indirgeme'],
    stressPoint: 9,
    growthPoint: 6,
    symbolicMeaning: 'Güneş amblemi, taç, altın spiral, yükselen şahin ve prizmatik ışık huzmeleri.'
  },
  4: {
    type: 4,
    typeName: 'Özgün & Mistik Bireyci',
    wings: ['4w3', '4w5'],
    coreMotivation: 'Kendini derinlemesine ifade etmek, özgün kalmak ve anlamlı bir kimlik oluşturmak.',
    coreFear: 'Sıradan, anlamsız, kimliksiz ve kusurlu olmak.',
    strengths: ['Derin estetik kavrayış', 'Özgün sanatsal yaratıcılık', 'Duygusal dürüstlük', 'Melankolik zarafet', 'Mistik sezgi'],
    shadowTraits: ['Kendine acıma', 'Kıskançlık / Yoksunluk hissi', 'Aşırı içe kapanma', 'Dramatize etme'],
    stressPoint: 2,
    growthPoint: 1,
    symbolicMeaning: 'Siyah kuğu, solmayan kara gül, ay döngüleri, mistik gözyaşı ve kırık mozaik vitray.'
  },
  5: {
    type: 5,
    typeName: 'Gözlemci & Bilge Araştırmacı',
    wings: ['5w4', '5w6'],
    coreMotivation: 'Kavramak, bilmek, yetkin olmak ve dünyayı zihinsel olarak haritalandırmak.',
    coreFear: 'Yetersiz, bilgisiz, istila edilmiş veya enerjisi tükenmiş olmak.',
    strengths: ['Derin analitik zeka', 'Objektif gözlem', 'Kavramsal ustalık', 'Sakinlik', 'Derin uzmanlık'],
    shadowTraits: ['Aşırı izolasyon', 'Duygusal kopukluk', 'Bilgi cimriliği', 'Eyleme geçmekten kaçınma'],
    stressPoint: 7,
    growthPoint: 8,
    symbolicMeaning: 'Baykuş, anahtar, labirent pusulası, kutsal geometrik fraktallar ve derin fener.'
  },
  6: {
    type: 6,
    typeName: 'Sadık & Koruyucu Muhafız',
    wings: ['6w5', '6w7'],
    coreMotivation: 'Güvende olmak, sadakat bulmak, riskleri öngörmek ve dayanışma kurmak.',
    coreFear: 'Desteksiz, yönsüz, savunmasız ve ihanete uğramış olmak.',
    strengths: ['Sarsılmaz sadakat', 'Stratejik öngörü', 'Cesur savunuculuk', 'Pratik problem çözme', 'Birlik ruhu'],
    shadowTraits: ['Kronik şüphe ve kaygı', 'Aşırı savunmacılık', 'Otorite ikilemi', 'En kötü senaryoya kilitlenme'],
    stressPoint: 3,
    growthPoint: 9,
    symbolicMeaning: 'Kurt sürüsü, demir kalkan, deniz feneri, çapraz meşaleler ve sağlam çapa.'
  },
  7: {
    type: 7,
    typeName: 'Hevesli & Maceracı Vizyoner',
    wings: ['7w6', '7w8'],
    coreMotivation: 'Özgür olmak, deneyimlemek, acıdan kaçınmak ve mutluluğu çoğaltmak.',
    coreFear: 'Sıkışmış, yoksun, acı çeken veya kısıtlanmış olmak.',
    strengths: ['Sınırsız iyimserlik', 'Hızlı zihin bağlantıları', 'Maceracı cesaret', 'Coşku', 'Yenilikçi vizyon'],
    shadowTraits: ['Derinleşmekten kaçış', 'Dürtüsellik', 'Sorumlulukları erteleme', 'Tatmin olamama'],
    stressPoint: 1,
    growthPoint: 5,
    symbolicMeaning: 'Geniş kanatlı kartal, rüzgar gülü, fırtına kelebeği, uçuşan kıvılcımlar ve kozmik harita.'
  },
  8: {
    type: 8,
    typeName: 'Meydan Okuyan & Güçlü Lider',
    wings: ['8w7', '8w9'],
    coreMotivation: 'Kendi kaderine hükmetmek, güçlü kalmak, zayıfları korumak ve adaleti sağlamak.',
    coreFear: 'Zayıf düşmek, kontrol edilmek, teslim olmak ve yaralanmak.',
    strengths: ['Durdurulamaz irade', 'Yüksek koruyuculuk', 'Doğal otorite', 'Doğruluk', 'Cesur atılım'],
    shadowTraits: ['Aşırı kontrolcülük', 'Yıkıcı öfke', 'Duygusal savunmasızlığı reddetme', 'Baskınlık'],
    stressPoint: 5,
    growthPoint: 2,
    symbolicMeaning: 'Kükreyen aslan veya boğa, meşe ağacı, çift başlı balta, volkanik lav ve zırh.'
  },
  9: {
    type: 9,
    typeName: 'Barışçı & Uyumlu Bilge',
    wings: ['9w8', '9w1'],
    coreMotivation: 'İç huzuru korumak, çatışmadan kaçınmak, uyum ve birlik yaratmak.',
    coreFear: 'Kopuş, parçalanma, çatışma ve yok sayılmak.',
    strengths: ['Bütünleştirici dinginlik', 'Derin kabullenme', 'Geniş perspektif', 'Doğayla birlik', 'Yatıştırıcı varlık'],
    shadowTraits: ['Pasif direniş', 'Kendi sesini unutma', 'Uyuşma ve erteleme', 'Aşırı ödün verme'],
    stressPoint: 6,
    growthPoint: 3,
    symbolicMeaning: 'Nilüfer / Lotus, dingin göl, ouroboros, zeytin dalı, uyuyan dağ ve sisli orman.'
  }
};

export const ENNEAGRAM_MINI_TEST_QUESTIONS: EnneagramQuestion[] = [
  {
    id: 1,
    question: 'Hayatta sizi en derinden harekete geçiren temel dürtü nedir?',
    options: [
      { text: 'Her şeyi doğru, ilkeli, etik ve kusursuz yapmak.', type: 1, description: 'Doğruluk ve İdealizm' },
      { text: 'İnsanlara yardım etmek, sevilmek ve ihtiyaç duyulmak.', type: 2, description: 'Şefkat ve Bağlılık' },
      { text: 'Hedeflerime ulaşmak, başarılı olmak ve takdir edilmek.', type: 3, description: 'Başarı ve Etki' },
      { text: 'Kendi özgün kimliğimi ve derin duygularımı ifade etmek.', type: 4, description: 'Özgünlük ve Anlam' },
      { text: 'Evreni ve olayların arkasındaki mantığı derinlemesine kavramak.', type: 5, description: 'Bilgi ve Yetkinlik' },
      { text: 'Güvende olmak, sadık bir çevre kurmak ve riskleri önceden sezmek.', type: 6, description: 'Güvenlik ve Sadakat' },
      { text: 'Yeni deneyimler yaşamak, özgür olmak ve hayattan keyif almak.', type: 7, description: 'Özgürlük ve Neşe' },
      { text: 'Güçlü olmak, kontrolü elde tutmak ve zayıfları korumak.', type: 8, description: 'Güç ve Adalet' },
      { text: 'İç huzurumu korumak, sakin kalmak ve insanlarla uyum içinde olmak.', type: 9, description: 'Huzur ve Denge' }
    ]
  },
  {
    id: 2,
    question: 'Baskı ve kriz anında ilk refleksiniz genellikle hangisi olur?',
    options: [
      { text: 'Duygularımı bir kenara bırakıp mantıklı ve soğukkanlı çözüme odaklanırım.', type: 5, description: 'Zihinsel İzolasyon' },
      { text: 'Hemen inisiyatif alır, doğrudan ve güçlü bir şekilde duruma el koyarım.', type: 8, description: 'Doğrudan Mücadele' },
      { text: 'Hataları düzeltmek için kuralları ve sistemi sıkılaştırırım.', type: 1, description: 'Disiplin ve Düzeltme' },
      { text: 'Olayın olumlu taraflarına odaklanır, alternatif eğlenceli planlar üretirim.', type: 7, description: 'Pozitif Yeniden Çerçeveleme' },
      { text: 'İç dünyama çekilir, duygularımı derinlemesine yaşarım.', type: 4, description: 'İçselleşme' },
      { text: 'Ortamı yatıştırmaya, çatışmayı yumuşatmaya çalışırım.', type: 9, description: 'Uzlaşma' },
      { text: 'Tüm risk senaryolarını hızlıca analiz edip güvendiğim insanlarla tedbir alırım.', type: 6, description: 'Risk Yönetimi' }
    ]
  },
  {
    id: 3,
    question: 'İç dünyanızda en çok kaçındığınız veya sizi en çok rahatsız eden durum nedir?',
    options: [
      { text: 'Sıradan, önemsiz veya sahte olmak.', type: 4, description: 'Kimliksizlik Korkusu' },
      { text: 'Kontrolü kaybetmek, başkalarına muhtaç veya zayıf duruma düşmek.', type: 8, description: 'Zayıflık Korkusu' },
      { text: 'Yetersiz, hazırlıksız veya cahil hissetmek.', type: 5, description: 'Yetersizlik Korkusu' },
      { text: 'Haksız, kusurlu veya ahlaken suçlu görülmek.', type: 1, description: 'Kusurluluk Korkusu' },
      { text: 'İstenmeyen, terk edilen veya sevgisiz bırakılan biri olmak.', type: 2, description: 'Dışlanma Korkusu' },
      { text: 'Başarısız, verimsiz ve itibarını kaybetmiş olmak.', type: 3, description: 'Başarısızlık Korkusu' },
      { text: 'Kısıtlanmak, çıkmaza girmek veya acıya mahkum olmak.', type: 7, description: 'Tutsaklık Korkusu' }
    ]
  },
  {
    id: 4,
    question: 'Yakın ilişkilerinizde kendinizi nasıl tanımlarsınız?',
    options: [
      { text: 'Son derece koruyucu, doğrudan ve sadık; arkamda durana canımı veririm.', type: 8, description: 'Koruyucu Lider' },
      { text: 'Verici, şefkatli ve karşımdakinin hislerini hemen sezen bir sırdaş.', type: 2, description: 'Şefkatli Destek' },
      { text: 'Dürüst, tutarlı, ilkelerine ve sözüne sadık bir yoldaş.', type: 1, description: 'Güvenilir Denge' },
      { text: 'Kişisel alanına ve zihinsel sınırlarına düşkün, derin ve seçici bir dost.', type: 5, description: 'Sessiz Bilge' },
      { text: 'Derin, tutkulu, bazen anlaşılmadığını hisseden ama çok samimi.', type: 4, description: 'Duygusal Derinlik' },
      { text: 'Kırıcı olmayan, herkesi anlayan, ortamı sakinleştiren barış elçisi.', type: 9, description: 'Barışçıl Liman' },
      { text: 'Neşeli, enerjik, maceralara sürükleyen ve hayatı renklendiren.', type: 7, description: 'Coşkulu Yolcu' }
    ]
  },
  {
    id: 5,
    question: 'Bir projeye veya hedefe başlarken odaklandığınız ana unsur nedir?',
    options: [
      { text: 'En yüksek başarı, hız, verimlilik ve parlayan bir sonuç.', type: 3, description: 'Kusursuz İmaj & Başarı' },
      { text: 'Eksiksiz bilgi toplamak, tüm sistemi baştan sona anlamak.', type: 5, description: 'Derin Bilgi' },
      { text: 'Hatasız standartlar, adil bir iş bölümü ve kusursuz kalite.', type: 1, description: 'Etik Kalite' },
      { text: 'Yaratıcı, kimsede olmayan, estetik ve özgün bir iz bırakmak.', type: 4, description: 'Sanatsal İz' },
      { text: 'Cesurca öne atılmak, engelleri yıkmak ve liderlik etmek.', type: 8, description: 'Güçlü İlerleme' },
      { text: 'Ekipten kimsenin geride kalmadığı, huzurlu ve uyumlu bir süreç.', type: 9, description: 'Kolektif Uyum' },
      { text: 'Yol boyunca bolca eğlence, yaratıcı fikirler ve keşif.', type: 7, description: 'Dinamik Keşif' }
    ]
  }
];

export function calculateEnneagramFromAnswers(answers: Record<number, number>): { type: number; wing: string } {
  const expectedQuestionIds = ENNEAGRAM_MINI_TEST_QUESTIONS.map(q => q.id);
  const providedIds = Object.keys(answers).map(Number).sort((a, b) => a - b);
  const expectedIds = [...expectedQuestionIds].sort((a, b) => a - b);

  if (
    providedIds.length !== expectedIds.length ||
    providedIds.some((id, index) => id !== expectedIds[index])
  ) {
    throw new Error('Enneagram testi eksik veya fazla cevap içeriyor; tüm sorular tam olarak cevaplanmalıdır.');
  }

  const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  Object.entries(answers).forEach(([questionId, typeVal]) => {
    if (!Number.isInteger(typeVal) || scores[typeVal] === undefined) {
      throw new Error(`Enneagram sorusu ${questionId} için geçersiz tip cevabı.`);
    }
    scores[typeVal] += 1;
  });

  let maxType = 4;
  let maxScore = -1;
  Object.entries(scores).forEach(([tStr, score]) => {
    const t = parseInt(tStr, 10);
    if (score > maxScore) {
      maxScore = score;
      maxType = t;
    }
  });

  const typeData = ENNEAGRAM_TYPES[maxType] || ENNEAGRAM_TYPES[4];
  // Calculate wing: check adjacent types (e.g. for 4, check 3 and 5)
  const leftNeighbor = maxType === 1 ? 9 : maxType - 1;
  const rightNeighbor = maxType === 9 ? 1 : maxType + 1;

  const leftScore = scores[leftNeighbor] || 0;
  const rightScore = scores[rightNeighbor] || 0;

  // Eşitlikte sağ kanadı otomatik seçme; simetrik durumda sol komşuyu seçerek
  // önceki yapay sağ-kanat önyargısını kaldırıyoruz.
  const wing = rightScore > leftScore ? `${maxType}w${rightNeighbor}` : `${maxType}w${leftNeighbor}`;

  return { type: maxType, wing };
}

export function getEnneagramProfile(typeNumber: number, wing?: string, isDeterminedByTest: boolean = false): EnneagramProfile {
  const safeType = ENNEAGRAM_TYPES[typeNumber] ? typeNumber : 4;
  const data = ENNEAGRAM_TYPES[safeType];
  const safeWing = wing && data.wings.includes(wing) ? wing : data.wings[0];

  return {
    type: data.type,
    typeName: data.typeName,
    wing: safeWing,
    coreMotivation: data.coreMotivation,
    coreFear: data.coreFear,
    strengths: data.strengths,
    shadowTraits: data.shadowTraits,
    stressPoint: data.stressPoint,
    growthPoint: data.growthPoint,
    symbolicMeaning: data.symbolicMeaning,
    isDeterminedByTest
  };
}

