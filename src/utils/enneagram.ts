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

/**
 * 15 Soruluk Yapılandırılmış Enneagram Değerlendirmesi
 * Kişilikteki 15 temel davranışsal boyutu somut olaylar ve içgüdüsel tepkiler üzerinden ölçer.
 */
export const ENNEAGRAM_MINI_TEST_QUESTIONS: EnneagramQuestion[] = [
  // 1. Temel Motivasyon
  {
    id: 1,
    question: 'Günlük hayatınızda ve aldığınız büyük kararlarda sizi içten içe en çok harekete geçiren temel ihtiyaç nedir?',
    options: [
      { text: 'Her şeyi ilkeli, adil ve kusursuz bir ahlaki nizamla doğru yapmak.', type: 1, description: 'Doğruluk ve İlkesellik' },
      { text: 'İnsanların hayatına dokunmak, şefkat göstermek ve sevilip değer görmek.', type: 2, description: 'Sevgi ve Şefkat' },
      { text: 'Somut hedeflerime başarıyla ulaşıp kendimi ve emeğimi parlatmak.', type: 3, description: 'Başarı ve Takdir' },
      { text: 'Kendi özgün kimliğimi, derin duygularımı ve estetik varlığımı ifade etmek.', type: 4, description: 'Özgünlük ve Anlam' },
      { text: 'Dünyanın ve olayların arkasındaki nedensellik mekanizmasını zihnen kavramak.', type: 5, description: 'Bilgi ve Yetkinlik' },
      { text: 'Güvenli bir zemin oluşturmak, riskleri öngörmek ve sadık bağlar kurmak.', type: 6, description: 'Güvenlik ve Sadakat' },
      { text: 'Yeni olanaklar keşfetmek, özgürce deneyimlemek ve hayattan zevk almak.', type: 7, description: 'Özgürlük ve Coşku' },
      { text: 'Kendi gücümü ortaya koymak, adaleti savunmak ve irademe sahip çıkmak.', type: 8, description: 'Güç ve Bağımsızlık' },
      { text: 'İç huzurumu korumak, insanlarla sükunet ve uyum içinde var olmak.', type: 9, description: 'Huzur ve Denge' }
    ]
  },
  // 2. Temel Korku
  {
    id: 2,
    question: 'Hayatta sizi en derin biçimde huzursuz eden ve ne pahasına olursa olsun kaçınmak istediğiniz durum nedir?',
    options: [
      { text: 'Hatalı, adaletsiz, yozlaşmış veya kusurlu bir konuma düşmek.', type: 1, description: 'Kusurluluk Korkusu' },
      { text: 'Kimsenin ihtiyaç duymadığı, istenmeyen ve sevgiden mahrum kalmış biri olmak.', type: 2, description: 'Dışlanma Korkusu' },
      { text: 'Başarısız, yetersiz, silik veya itibarını yitirmiş duruma düşmek.', type: 3, description: 'Başarısızlık Korkusu' },
      { text: 'Sıradan, taklit, anlamsız ve içsel derinlikten yoksun bir hayat sürmek.', type: 4, description: 'Sıradanlık Korkusu' },
      { text: 'Cahil, yetkinlikten uzak, istila edilmiş ve zihinsel enerjisi tükenmiş hissetmek.', type: 5, description: 'Yetersizlik Korkusu' },
      { text: 'Desteksiz kalmak, beklenmedik bir tehlikeye hazırlıksız yakalanmak veya ihanet görmek.', type: 6, description: 'Savunmasızlık Korkusu' },
      { text: 'Acıya, can sıkıntısına mahkum olmak veya seçeneklerinin kısıtlanması.', type: 7, description: 'Tutsaklık Korkusu' },
      { text: 'Başkalarının insafına kalmak, zayıf düşmek ve manipüle edilerek ezilmek.', type: 8, description: 'Zayıflık Korkusu' },
      { text: 'Çatışma ve gerilim yüzünden iç dengemin parçalanması ve insanlarla bağımın kopması.', type: 9, description: 'Kopuş ve Çatışma Korkusu' }
    ]
  },
  // 3. Stres ve Baskı Tepkisi
  {
    id: 3,
    question: 'Üst üste binen yoğun baskı ve kriz anlarında otomatik olarak verdiğiniz ilk tepki hangisidir?',
    options: [
      { text: 'Kendime ve çevreye karşı daha da katılaşır, hataları düzeltmek için denetimi artırırım.', type: 1, description: 'Katı Denetim' },
      { text: 'Kendi ihtiyaçlarımı unutup başkalarının sorunlarına aşırı müdahil olur, sonra kırgınlık yaşarım.', type: 2, description: 'Aşırı Müdahale' },
      { text: 'Duygularımı tamamen kapatır, sadece sonuca ve krizi kurtaracak hamlelere odaklanırım.', type: 3, description: 'Duygusal Soğuma' },
      { text: 'Kabuğuma çekilir, hüzne kapılır ve dünyanın beni anlamadığı hissine gömülürüm.', type: 4, description: 'İçe Kapanma' },
      { text: 'İnsanlardan ve ortamdan tamamen soyutlanır, zihnime kapanıp bilgiyle savunma yaparım.', type: 5, description: 'Zihinsel İzolasyon' },
      { text: 'Aşırı endişelenir, en kötü ihtimalleri düşünerek sürekli tetikte ve şüpheci olurum.', type: 6, description: 'Kaygı ve Tetiktelik' },
      { text: 'Sorundan kaçmak için hızla dikkatimi başka şeylere, planlara ve eğlencelere dağıtırım.', type: 7, description: 'Odağı Dağıtma' },
      { text: 'Öfkeyle patlar, ipleri tamamen elime alır ve karşımdakileri zorlayarak otorite kurarım.', type: 8, description: 'Öfke ve Hakimiyet' },
      { text: 'Uyuşur, sorunu yok sayar veya kendimi meşgul edecek önemsiz şeylerle sakinleşmeye çalışırım.', type: 9, description: 'Uyuşma ve Erteleme' }
    ]
  },
  // 4. Çatışma ve Anlaşmazlık Davranışı
  {
    id: 4,
    question: 'Biriyle sert bir fikir ayrılığına veya açık bir tartışmaya girdiğinizde sergilediğiniz tutum ne olur?',
    options: [
      { text: 'Kelimelerimi tartarak mantıklı ve ilkeli savunma yapar, doğru olanın uygulanmasında ısrar ederim.', type: 1, description: 'İlkeli Savunma' },
      { text: 'Kırılırım; benim fedakarlıklarımın görülmediğini hissettiğimde duygusal sitemde bulunurum.', type: 2, description: 'Duygusal Sitem' },
      { text: 'Kişiselleştirmeden tartışmayı hızla pratik bir sonuca veya kendi lehime olan çözüme bağlarım.', type: 3, description: 'Pragmatik Uzlaşma' },
      { text: 'Duygularımı derinlemesine ve tavizsizce dışa vurur, samimiyetsiz bir uzlaşmayı asla kabul etmem.', type: 4, description: 'Özgün Tepki' },
      { text: 'Tartışmanın duygusal hararetinden geri çekilir, soğukkanlı mantık ve verilerle cevap veririm.', type: 5, description: 'Mantıksal Mesafe' },
      { text: 'Karşımdakinin niyetini sorgular, savunma pozisyonuna geçer veya müttefiklerimi devreye sokarım.', type: 6, description: 'İhtiyatlı Savunma' },
      { text: 'Gerilimi mizahla yumuşatmaya çalışır, durum ciddileşip boğucu hale gelirse ortamdan uzaklaşırım.', type: 7, description: 'Mizahla Kaçış' },
      { text: 'Asla geri adım atmam; doğrudan gözlerinin içine bakarak çatışmanın üzerine yürürüm.', type: 8, description: 'Açık Meydan Okuma' },
      { text: 'Huzursuzluk büyümesin diye alttan alır, ortak nokta bulmaya çalışır veya sessizce geri çekilirim.', type: 9, description: 'Alttan Alma' }
    ]
  },
  // 5. Karar Verme Süreci
  {
    id: 5,
    question: 'Hayatınızda önemli ve belirsiz bir yol ayrımına geldiğinizde kararınızı temel olarak neye dayandırırsınız?',
    options: [
      { text: 'Etik ve doğru olan ilkeler süzgecinden geçirerek doğru vicdani kararı veririm.', type: 1, description: 'Ahlaki Pusula' },
      { text: 'Kararımın sevdiklerimi ve ilişkilerimi nasıl etkileyeceğini kalpten tartarak seçerim.', type: 2, description: 'İlişkisel Öncelik' },
      { text: 'Beni en hızlı ve en verimli başarıya ulaştıracak pratik seçeneğe yönelirim.', type: 3, description: 'Stratejik Verimlilik' },
      { text: 'Kendi içsel sesime, estetik değerlerime ve bana gerçekten anlamlı gelen hislere uyarım.', type: 4, description: 'İçsel Sezgi' },
      { text: 'Kapsamlı araştırma yapar, verileri ve mantıksal sonuçları analiz ettikten sonra karar veririm.', type: 5, description: 'Objektif Analiz' },
      { text: 'Olası tüm riskleri, güvenilir otoritelerin görüşlerini ve güvenli alternatifleri tartar öyle karar alırım.', type: 6, description: 'Risk Değerlendirmesi' },
      { text: 'Bana en çok kapı açan, seçeneklerimi kısıtlamayan ve heyecan verici olan yolu seçerim.', type: 7, description: 'Fırsat ve Keşif' },
      { text: 'İçimdeki net içgüdüye ve gücüme güvenir, tereddüt etmeden kesin ve cesur adım atarım.', type: 8, description: 'İçgüdüsel Cesaret' },
      { text: 'Acele etmeden zamana bırakır, etrafımdaki dengeleri bozmayacak en doğal akışı beklerim.', type: 9, description: 'Dengeli Bekleyiş' }
    ]
  },
  // 6. Kişisel Alan ve Sınırlar
  {
    id: 6,
    question: 'Sosyal ilişkilerinizde diğer insanlarla aranızdaki kişisel sınırları nasıl korursunuz?',
    options: [
      { text: 'Herkesin uyması gereken net kurallar ve saygı çerçevesi koyarak sınırlarımı belirlerim.', type: 1, description: 'Kuralcı Sınırlar' },
      { text: 'Sınır koymakta zorlanırım; sevdiklerim söz konusu olduğunda kapılarımı sonuna kadar açarım.', type: 2, description: 'Geçirgen Sınırlar' },
      { text: 'Sınırlarımı işime, hedeflerime ve zamanımın verimliliğine göre son derece profesyonelce çizerim.', type: 3, description: 'Fonksiyonel Sınırlar' },
      { text: 'İç dünyama sadece beni gerçekten derinlemesine anlayan çok özel insanların girmesine izin veririm.', type: 4, description: 'Seçici Mahremiyet' },
      { text: 'Kişisel alanımı ve zamanımı bir kale gibi korur, davetsiz müdahaleleri anında engellerim.', type: 5, description: 'Zihinsel Kale' },
      { text: 'Güven testini geçmeyen insanlara karşı mesafeli ve temkinli durarak sınırlarımı korurum.', type: 6, description: 'Temkinli Mesafe' },
      { text: 'Beni boğan ve sınırlayan ilişkilerden uzak durur, istediğim zaman uzaklaşabileceğim esnek bağlar kurarım.', type: 7, description: 'Esnek Sınırlar' },
      { text: 'Sınırlarımı net ve tavizsiz şekilde söylerim; çizgimi aşmaya cüret eden olursa hemen püskürtürüm.', type: 8, description: 'Aşılmaz Duvar' },
      { text: 'Açıkça hayır demek yerine sessizce mesafelenir veya iç dünyama çekilerek kendimi korurum.', type: 9, description: 'Sessiz Mesafe' }
    ]
  },
  // 7. Hata ve Eleştiriyle Karşılaşma
  {
    id: 7,
    question: 'Yaptığınız bir hata ortaya çıktığında veya biri sizi sert biçimde eleştirdiğinde ne yaşarsınız?',
    options: [
      { text: 'İçimdeki acımasız ses hemen beni yargılar; hatamı hızla telafi etmek için kendimi hırpalarım.', type: 1, description: 'İçsel Yargılama' },
      { text: 'Beni artık sevmediklerini veya nankörlük ettiklerini düşünerek derin bir kırgınlık yaşarım.', type: 2, description: 'Kırgınlık ve Alınma' },
      { text: 'Hatanın imajımı zedelemesini engellemek için hızla açıklama bulur ve durumu başarıya dönüştürürüm.', type: 3, description: 'İmaj Onarımı' },
      { text: 'Eleştiri doğrudan ruhuma vurulmuş bir darbe gibi gelir; anlaşılmadığımı düşünüp derin yaralanırım.', type: 4, description: 'Kişisel İncinme' },
      { text: 'Eleştiriyi duygudan arındırıp mantıksal doğruluk payına bakarım; haksızsa zihnimde yok sayarım.', type: 5, description: 'Rasyonel Filtre' },
      { text: 'Hemen savunmaya geçerim; eleştirinin arkasında gizli bir niyet veya tehdit olup olmadığını kurgularım.', type: 6, description: 'Kuşkulu Savunma' },
      { text: 'Eleştiriyi ciddiye almamaya çalışır, konuyu neşeli bir şakayla veya dikkati dağıtarak savuştururum.', type: 7, description: 'Hafife Alma' },
      { text: 'Bana meydan okunduğunu hissederim; zayıflık kabul etmem ve karşımdakinin kusurlarını yüzüne vururum.', type: 8, description: 'Karşı Taarruz' },
      { text: 'Gerilimden kaçınmak için görünüşte kabullenirim ama içten içe kapanır ve pasif direnç gösteririm.', type: 9, description: 'Pasif Kabulleniş' }
    ]
  },
  // 8. Güç, Otorite ve Kontrol
  {
    id: 8,
    question: 'Çalışma ortamında veya bir grupta güç, liderlik ve kontrol dinamiklerine yaklaşımınız nasıldır?',
    options: [
      { text: 'Otorite kurallara ve adalete uyduğu sürece saygı duyarım; uymazsa doğru olanı savunmaktan çekinmem.', type: 1, description: 'İlkelere Bağlılık' },
      { text: 'Gücü sevgimle ve insanların vazgeçilmezi olarak elde ederim; perde arkasından yönlendirmeyi severim.', type: 2, description: 'İlişkisel Etki' },
      { text: 'Liderliği ve inisiyatifi doğal olarak alırım; verimi artırmak ve hedefe en hızlı koşan ekip olmak isterim.', type: 3, description: 'Stratejik Liderlik' },
      { text: 'Otoriteye boyun eğmeyi sevmem; kendi bağımsız, özgün tarzımı korumak benim için güçten önemlidir.', type: 4, description: 'Bağımsız Özgünlük' },
      { text: 'Güç peşinde koşmam; bilgiye ve uzmanlığa sahip olmak benim için en büyük bağımsızlıktır.', type: 5, description: 'Uzmanlık Otoritesi' },
      { text: 'Otoriteye karşı ikircikliyimdir; güvenilir bir lidersa sadakat gösteririm ama suistimal sezdiğimde sorgularım.', type: 6, description: 'Sorgulayıcı İtaat' },
      { text: 'Bana ne yapacağımı söyleyen otoriteden nefret ederim; kendi oyunumu kurmayı ve özgür kalmayı tercih ederim.', type: 7, description: 'Kural Tanımazlık' },
      { text: 'Güçlü olmayı ve ipleri elimde tutmayı isterim; kimsenin beni veya sevdiklerimi ezmesine izin vermem.', type: 8, description: 'Doğal Hakimiyet' },
      { text: 'Güç kavgalarını yorucu bulurum; herkesin eşit söz sahibi olduğu sakin ve baskısız bir ortamı tercih ederim.', type: 9, description: 'Eşitlikçi Sakinlik' }
    ]
  },
  // 9. Duygu İfadesi ve Hassasiyet
  {
    id: 9,
    question: 'İçinizde yoğun bir sevinç, öfke veya hüzün kabardığında bu duyguları dış dünyaya nasıl yansıtırsınız?',
    options: [
      { text: 'Öfkemi ve coşkumu kontrol altında tutmaya çalışırım; ölçülü ve nezaketli görünmek benim için esastır.', type: 1, description: 'Duygusal Özdenetim' },
      { text: 'Duygularımı sıcağı sıcağına, cömertçe ve içtenlikle paylaşırım; karşımdakinin hislerini de hemen sezerim.', type: 2, description: 'Dışa Vurumcu Sıcaklık' },
      { text: 'Duygularımı işlerimi aksatmayacak şekilde ertelerim; dışarıya her zaman özgüvenli ve güçlü bir duruş sergilerim.', type: 3, description: 'Kontrollü İmaj' },
      { text: 'Duygularımı en derin ve estetik haliyle yaşarım; hislerimi sanata, kelimelere veya simgelere dökmek isterim.', type: 4, description: 'Derin İfade' },
      { text: 'Duygularımı hemen dışa vurmam; önce yalnız kalarak onları mantıksal olarak anlamlandırmam gerekir.', type: 5, description: 'İçsel Ayrıştırma' },
      { text: 'Duygularımı, özellikle endişelerimi sadece gerçekten güvenimi kazanmış dar bir çemberle paylaşırım.', type: 6, description: 'Güvenli Paylaşım' },
      { text: 'Olumlu ve coşkulu hislerimi herkesle coşkuyla paylaşırım; karanlık ve ağır hisleri hızla neşeye çeviririm.', type: 7, description: 'Pozitif Dışavurum' },
      { text: 'Öfkemi ve tutkumu doğrudan, filtresiz ve güçlü biçimde ortaya koyarım; zayıflık göstergesi hisleri saklarım.', type: 8, description: 'Güçlü Dışavurum' },
      { text: 'Duygularımı içimde yatıştırır, dalgalanmaları dışarıya yansıtmamaya ve sakin görünmeye çalışırım.', type: 9, description: 'Dingin İçselleştirme' }
    ]
  },
  // 10. Günlük Enerji ve Yaşam Temposu
  {
    id: 10,
    question: 'Tipik bir gününüzü yaşarken enerjiniz, hızınız ve eyleme geçme tarzınız en çok hangisine benzer?',
    options: [
      { text: 'Düzenli, planlı ve sorumluluklarını eksiksiz yerine getiren metodik bir tempo.', type: 1, description: 'Metodik Disiplin' },
      { text: 'Etrafımdaki insanların ihtiyaçlarına koşturan, ilişkilerle beslenen hareketli bir enerji.', type: 2, description: 'İlişkisel Hareketlilik' },
      { text: 'Yüksek tempolu, yapılacaklar listesini hızla eriten, zamana karşı yarışan hırslı bir akış.', type: 3, description: 'Hızlı ve Verimli' },
      { text: 'Ruh halime göre değişen, ilham geldiğinde yoğunlaşan, bazen tamamen içe çekilen ritim.', type: 4, description: 'İlham Odaklı Ritim' },
      { text: 'Sakin, gözlemci, gereksiz fiziksel koşturmacadan kaçınan, zihinsel olarak son derece odaklı tempo.', type: 5, description: 'Zihinsel Odak' },
      { text: 'Teyakkuzda, olası aksiliklere karşı hazırlıklı, adımlarını temkinle atan istikrarlı bir ritim.', type: 6, description: 'İhtiyatlı Ritim' },
      { text: 'Hızlı, bir konudan diğerine atlayan, sürekli yeni uyaranlar ve maceralar arayan coşkulu akış.', type: 7, description: 'Değişken Coşku' },
      { text: 'Güçlü, kararlı, engelleri ezip geçen, yorgunluğu reddeden yüksek hacimli bir enerji.', type: 8, description: 'Yoğun ve Yılmaz' },
      { text: 'Aheste, telaşsız, zorlamalardan uzak ve huzurlu bir dinginlik içinde akan sakin tempo.', type: 9, description: 'Huzurlu Yavaşlık' }
    ]
  },
  // 11. İş Bitirme ve Hedefe Ulaşma Tarzı
  {
    id: 11,
    question: 'Size verilen veya kendinize koyduğunuz bir projeyi yürütürken ve tamamlarken tarzınız nasıldır?',
    options: [
      { text: 'Her ayrıntıyı defalarca kontrol eder, standartlara ve mükemmelliğe ulaşana kadar bırakmam.', type: 1, description: 'Kusursuz Standart' },
      { text: 'İşi yaparken ekip arkadaşlarımın moralini yüksek tutar, projenin insani faydasına odaklanırım.', type: 2, description: 'İnsani Katkı' },
      { text: 'Hemen bitiş çizgisine odaklanır, en kısa sürede parlayan ve alkış alan bir sonuç üretirim.', type: 3, description: 'Hızlı Başarı' },
      { text: 'Standart işlerden sıkılırım; projeye kendimden özgün ve estetik bir imza katmadan içim rahat etmez.', type: 4, description: 'Özgün İmza' },
      { text: 'Konuyu en ince teorik ayrıntısına kadar araştırır, bağımsız ve yetkin bir uzmanlıkla tamamlarım.', type: 5, description: 'Yetkin Derinlik' },
      { text: 'Tüm riskleri baştan planlar, iş birliği ve görev paylaşımıyla sağlam ve güvenli şekilde bitiririm.', type: 6, description: 'Sağlam İlerleme' },
      { text: 'Başlangıçtaki heyecanla harika fikirler üretirim; iş rutine bindiğinde sıkılıp başka şeylere kayabilirim.', type: 7, description: 'Fikir Kıvılcımı' },
      { text: 'Liderliği ele alır, ekibi arkamdan sürükler ve engelleri doğrudan aşarak hedefi vururum.', type: 8, description: 'Kararlı Sonuç' },
      { text: 'Baskı olmadığı sürece dengeli ilerlerim; aşırı zorlanırsam işi erteleyip son ana bırakabilirim.', type: 9, description: 'Akışa Bırakma' }
    ]
  },
  // 12. Grup Dinamikleri ve Topluluk İçinde Konumlanma
  {
    id: 12,
    question: 'Yeni veya kalabalık bir sosyal topluluğa girdiğinizde kendinizi nasıl konumlandırırsınız?',
    options: [
      { text: 'Ortamın kurallarını ve düzenini gözlemler, doğru ve nezaketli bir duruşla örnek olmaya çalışırım.', type: 1, description: 'Örnek Duruş' },
      { text: 'Hemen insanlarla sıcak bağ kurar, birilerine yardımcı olarak kendimi sevdiririm.', type: 2, description: 'Sıcak Kaynaşma' },
      { text: 'Dikkat çeken, profesyonel veya karizmatik bir izlenim bırakarak grupta öne çıkarım.', type: 3, description: 'Karizmatik İmaj' },
      { text: 'Topluluğun sıradan sohbetlerinden uzak durur, kenardan gözlemleyip derinliği olan insanları ararım.', type: 4, description: 'Bireysel Farklılık' },
      { text: 'Gürültüden uzak sakin bir köşede durur, insanları analiz eder ama sohbete mecbur kalmadıkça girmem.', type: 5, description: 'Sessiz Gözlem' },
      { text: 'Ortamın dinamiklerini ve güvenilirliğini tartar, bana yakın gördüğüm insanlarla ittifak kurarım.', type: 6, description: 'Güven Arayışı' },
      { text: 'Mizah ve esprilerimle ortamın neşesi olur, sohbetin merkezinde eğlenceli bağlar kurarım.', type: 7, description: 'Neşe Kaynağı' },
      { text: 'Odaya girdiğimde varlığımı hissettiririm; güçlü ve koruyucu bir duruşla doğal saygı uyandırırım.', type: 8, description: 'Güçlü Varlık' },
      { text: 'Herkesin rahat hissetmesini sağlar, kimseyle ters düşmeden ortama uyum sağlar ve kaynaşırım.', type: 9, description: 'Uyumlu Bütünleşme' }
    ]
  },
  // 13. Güven ve Sadakat Yaklaşımı
  {
    id: 13,
    question: 'Hayatınıza yeni giren bir insana veya bir kuruma güven duymanız neye bağlıdır?',
    options: [
      { text: 'Sözlerinin ve davranışlarının tutarlı, dürüst ve ahlaki ilkelere uygun olmasına bakarım.', type: 1, description: 'İlkesel Tutarlılık' },
      { text: 'Bana gösterdikleri sevgiye, şefkate ve duygusal samimiyete bakarak kalbimi açarım.', type: 2, description: 'Duygusal Yakınlık' },
      { text: 'Yetkinliklerine, profesyonelliklerine ve verdikleri sözleri yerine getirme başarılarına bakarım.', type: 3, description: 'Yetkinlik ve Güven' },
      { text: 'Gerçek ve samimi olup olmadıklarına, yapaylıktan uzak derin bir bağ kurabilmelerine bakarım.', type: 4, description: 'Ruhsal Samimiyet' },
      { text: 'Mantıklı, sınırlarıma saygılı ve bilgi düzeyinde yetkin olmalarına önem veririm.', type: 5, description: 'Akılcı Saygı' },
      { text: 'Zor zamanlarda arkamda durup durmayacaklarını uzun süre test eder, sadakati görmeden güvenmem.', type: 6, description: 'Test Edilmiş Sadakat' },
      { text: 'Beni yargılamayan, özgürlüğüme müdahale etmeyen ve birlikte hafif hissettiğim insanlara güvenirim.', type: 7, description: 'Yargısız Rahatlık' },
      { text: 'Dürüst, net ve arkamdan iş çevirmeyen açık yürekli insanlara güvenirim; ikiyüzlülüğü asla affetmem.', type: 8, description: 'Net Dürüstlük' },
      { text: 'Beni olduğum gibi kabul eden, üzerimde baskı kurmayan ve sakinlik veren insanlara güvenirim.', type: 9, description: 'Baskısız Kabul' }
    ]
  },
  // 14. Acı, Kayıp ve Hayal Kırıklığıyla Yüzleşme
  {
    id: 14,
    question: 'Ağır bir hayal kırıklığı, acı veya kayıp yaşadığınızda kendinizi nasıl toparlarsınız?',
    options: [
      { text: 'Acımı içime gömer, güçlü ve doğru durmalıyım diyerek sorumluluklarıma daha sıkı sarılırım.', type: 1, description: 'Metanet ve Görev' },
      { text: 'Değerimin bilinmediğini hissedip kırılsam da yine başkalarına yardım ederek şifa bulmaya çalışırım.', type: 2, description: 'Hizmetle İyileşme' },
      { text: 'Yenilgiyi kabullenmek zordur; hızla yeni bir hedefe yönelip başarı kazanarak yaralarımı sararım.', type: 3, description: 'Yeni Hedefe Koşma' },
      { text: 'Acının en dibine kadar iner, melankoli ve hüznü bir sanat eserine dönüştürerek yaşarım.', type: 4, description: 'Katarzis ve Melankoli' },
      { text: 'Duygusal fırtınayı zihinsel olarak çözümler, olayı bir ders ve veri olarak arşivleyip yola devam ederim.', type: 5, description: 'Zihinsel Kabulleniş' },
      { text: 'Kaygım artar; güvendiğim dostlarıma sığınır ve durumun daha kötüye gitmemesi için tedbir alırım.', type: 6, description: 'Dayanışmayla İyileşme' },
      { text: 'Acı verici hislerden hızla uzaklaşmak için yeni planlara, seyahatlere veya meşguliyetlere sığınırım.', type: 7, description: 'Pozitife Yönelme' },
      { text: 'Zayıf görünmeyi reddederim; acımı öfkeye ve eyleme dönüştürerek mücadelemi büyütürüm.', type: 8, description: 'Öfke ve Direnç' },
      { text: 'Zamana bırakırım; kabullenir, duygusal çatışmayı yatıştırır ve içsel dinginliğimi yeniden bulurum.', type: 9, description: 'Dingin Tevekkül' }
    ]
  },
  // 15. Hayatta Anlam Arayışı ve Kalıcı İz Bırakma
  {
    id: 15,
    question: 'Bu dünyada var oluşunuza dair sizi en çok tatmin eden ve bedeninizde/hayatınızda kalıcı bir iz bırakmasını istediğiniz şey nedir?',
    options: [
      { text: 'Erdemli, adil, temiz ve arkasında kusursuz bir doğruluk mirası bırakan bir duruş.', type: 1, description: 'Erdem ve Doğruluk' },
      { text: 'İnsanların kalbine dokunmuş, karşılıksız sevilmiş ve şifa dağıtmış bir hayatın hatırası.', type: 2, description: 'Şefkat ve Sevgi İzi' },
      { text: 'Potansiyelini zirveye taşımış, parlamış ve somut başarılarıyla iz bırakmış bir zafer.', type: 3, description: 'Zirve ve Başarı' },
      { text: 'Kimseye benzemeyen, derin, estetik ve ruhunun en saf özgünlüğünü yansıtan bir başyapıt.', type: 4, description: 'Özgün Ruhaniyet' },
      { text: 'Evrenin sırlarına vakıf olmuş, bilgece kavramış ve zihinsel yetkinliğe ulaşmış derin bir akıl.', type: 5, description: 'Bilgelik ve Kavrayış' },
      { text: 'Sadakatle sınanmış, zorluklara direnmiş ve sevdiklerine güvenli bir sığınak olmuş sarsılmaz bir bağ.', type: 6, description: 'Sarsılmaz Sadakat' },
      { text: 'Doyasıya yaşanmış, coşkuyla keşfedilmiş ve her anı neşeyle kutlanmış sınırsız bir özgürlük.', type: 7, description: 'Sonsuz Neşe ve Özgürlük' },
      { text: 'Kendi kaderine hükmetmiş, haksızlığa boyun eğmemiş ve adaleti söke söke almış mağrur bir güç.', type: 8, description: 'Yenilmez Güç ve İrade' },
      { text: 'Evrenle bütünleşmiş, içsel ve dışsal çatışmaları aşmış, dingin ve kutsal bir barış hali.', type: 9, description: 'Kozmik Uyum ve Huzur' }
    ]
  }
];

export const ENNEAGRAM_TEST_QUESTIONS = ENNEAGRAM_MINI_TEST_QUESTIONS;

export interface EnneagramCalculationResult {
  type: number;
  wing: string;
  scores: Record<number, number>;
  answeredCount: number;
  totalQuestions: number;
  isComplete: boolean;
  confidenceScore: number;
}

/**
 * Verilen test yanıtlarından 9 Enneagram tipi için skorları hesaplar,
 * baskın tipi (core type) ve komşu kanadı (wing) deterministik olarak bulur.
 */
export function calculateEnneagramFromAnswers(answers?: Record<number, number>): EnneagramCalculationResult {
  const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const totalQuestions = ENNEAGRAM_MINI_TEST_QUESTIONS.length;

  if (!answers || Object.keys(answers).length === 0) {
    return {
      type: 4,
      wing: '4w5',
      scores,
      answeredCount: 0,
      totalQuestions,
      isComplete: false,
      confidenceScore: 0
    };
  }

  let answeredCount = 0;
  Object.entries(answers).forEach(([, typeVal]) => {
    const t = Number(typeVal);
    if (Number.isInteger(t) && t >= 1 && t <= 9 && scores[t] !== undefined) {
      scores[t] += 1;
      answeredCount++;
    }
  });

  if (answeredCount === 0) {
    return {
      type: 4,
      wing: '4w5',
      scores,
      answeredCount: 0,
      totalQuestions,
      isComplete: false,
      confidenceScore: 0
    };
  }

  // 1. En yüksek skoru alan tipi (veya tipleri) belirle
  let maxScore = -1;
  for (let t = 1; t <= 9; t++) {
    if (scores[t] > maxScore) {
      maxScore = scores[t];
    }
  }

  const topTypes: number[] = [];
  for (let t = 1; t <= 9; t++) {
    if (scores[t] === maxScore) {
      topTypes.push(t);
    }
  }

  // 2. Beraberlik (tie-break) durumunda deterministik çözüm:
  // Enneagram psikolojisinde Soru 1 (Temel Motivasyon), Soru 2 (Temel Korku) ve Soru 3 (Stres Tepkisi)
  // en yüksek tanısal ağırlığa sahiptir.
  let maxType = topTypes[0];
  if (topTypes.length > 1) {
    const diagnosticQuestionPriority = [1, 2, 3, 4, 5];
    let resolved = false;

    for (const qId of diagnosticQuestionPriority) {
      const chosenInQ = answers[qId];
      if (chosenInQ !== undefined && topTypes.includes(Number(chosenInQ))) {
        maxType = Number(chosenInQ);
        resolved = true;
        break;
      }
    }

    if (!resolved) {
      maxType = topTypes[0];
    }
  }

  const typeData = ENNEAGRAM_TYPES[maxType] || ENNEAGRAM_TYPES[4];

  // 3. Kanat (Wing) Hesabı: Enneagram çemberindeki sağ ve sol komşu
  const leftNeighbor = maxType === 1 ? 9 : maxType - 1;
  const rightNeighbor = maxType === 9 ? 1 : maxType + 1;

  const leftScore = scores[leftNeighbor] || 0;
  const rightScore = scores[rightNeighbor] || 0;

  let wing: string;
  if (rightScore > leftScore) {
    wing = `${maxType}w${rightNeighbor}`;
  } else if (leftScore > rightScore) {
    wing = `${maxType}w${leftNeighbor}`;
  } else {
    // Eşitlik durumunda varsayılan kanonik birincil kanat kullanılır
    wing = typeData.wings[0] || `${maxType}w${rightNeighbor}`;
  }

  if (!typeData.wings.includes(wing)) {
    wing = typeData.wings[0] || `${maxType}w${rightNeighbor}`;
  }

  const isComplete = answeredCount === totalQuestions;
  const confidenceScore = Math.min(100, Math.round((maxScore / Math.max(1, answeredCount)) * 100));

  return {
    type: maxType,
    wing,
    scores,
    answeredCount,
    totalQuestions,
    isComplete,
    confidenceScore
  };
}

export function getEnneagramProfile(
  typeNumber: number,
  wing?: string,
  isDeterminedByTest: boolean = false
): EnneagramProfile {
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
