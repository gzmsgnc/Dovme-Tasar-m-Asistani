import { 
  PersonData, 
  NumerologyProfile, 
  AstrologyProfile, 
  EnneagramProfile, 
  SymbolismProfile, 
  TattooDesignParameters,
  ShadowArchetypeAnalysisReport,
  ClientSymbolExplanationItem,
  ClientExplanationSection
} from '../types';
import { ChakraProfile } from './chakra';
import { calculateEbcedAndYildizname } from './ebced';
import { encodeToMorse } from './morseCode';
import { TOTEM_ANIMALS_52, getTotemAnimalStrict } from './totemCatalogData';

export function generateShadowArchetypeAnalysis(
  person: PersonData,
  numerology: NumerologyProfile,
  astrology: AstrologyProfile,
  enneagram: EnneagramProfile,
  symbolism: SymbolismProfile,
  chakra: ChakraProfile,
  parameters: TattooDesignParameters
): ShadowArchetypeAnalysisReport {
  // 1. Ebced & Yıldızname Calculations
  const ebcedData = calculateEbcedAndYildizname(person.name, person.motherName);

  // 2. Core Psycho-Symbolic Analysis
  const lifePath = numerology.lifePathNumber;
  const sunSign = astrology.sunSign;
  const enneaType = enneagram.type;

  // Archetypal definitions tailored to combinations
  let coreCharacterTheme = '';
  let recurringLifeTheme = '';
  let suppressedAspect = '';
  let shadowAspect = '';
  let coreTransformationTheme = '';
  let unbalancedStrength = '';
  let unconfrontedSymbolicTheme = '';
  let tattooTransformationMessage = '';

  switch (enneaType) {
    case 1:
      coreCharacterTheme = 'Kusursuz Düzen & Ahlaki Bütünlük Arayışı';
      recurringLifeTheme = 'Hata yapma korkusu ve kontrol edilemeyen dış dünyayı düzeltme çabası';
      suppressedAspect = 'Kendiliğindenlik, ham öfke, dünyevi kusurlara şefkat duyma';
      shadowAspect = 'Bilinçdışında biriken eleştirel gazap, gizli riyakarlık korkusu ve kendini katı cezalandırma';
      coreTransformationTheme = 'Kusurluluğun ilahi zarafetini (Wabi-Sabi) ve koşulsuz kabullenişi entegre etmek';
      unbalancedStrength = 'Yüksek adalet ve disiplin; aşırıya kaçtığında acımasız dogmatizme ve donukluğa dönüşür';
      unconfrontedSymbolicTheme = 'Kendi içindeki "kırık, eğri veya vahşi" doğayı reddetme arzusu';
      tattooTransformationMessage = 'Bozulmayan hakiki düzen, mükemmellikte değil; organik kusurların içindeki ilahi dengede saklıdır.';
      break;
    case 2:
      coreCharacterTheme = 'Koşulsuz Sevgi & Kendini Başkalarına Vakfetme';
      recurringLifeTheme = 'Varlığını başkalarının ihtiyaçları üzerinden meşrulaştırma ve terk edilme endişesi';
      suppressedAspect = 'Kendi kişisel sınırları, saf bencil arzuları ve doğrudan isteme hakkı';
      shadowAspect = 'Görünmez duygusal manipülasyon, "ben olmazsam mahvolurlar" kibri ve gizli alacaklılık hissi';
      coreTransformationTheme = 'Öz-değeri dış onaya bağlamadan, kendi varoluş tapınağını besleyebilmek';
      unbalancedStrength = 'Kapsayıcı şefkat ve koruma; dengesizleştiğinde boğucu tahakküm ve bağımlılık üretir';
      unconfrontedSymbolicTheme = 'Karşılıksız verileni geri isteme ve aslında sevilmeme dehşeti';
      tattooTransformationMessage = 'Gerçek şefkat, önce kendi kalbine sunulan kutsal nektardır; sınırların varlığı sevgiyi eksiltmez, mühürler.';
      break;
    case 3:
      coreCharacterTheme = 'Yüksek Başarı, Cazibe & Parıltılı İrade';
      recurringLifeTheme = 'Performans ile öz-değeri eşitleme, başarısızlık ve görünmez olma korkusu';
      suppressedAspect = 'Ham kırılganlık, yavaşlama, eylemsiz kalma ve maskesiz kimlik';
      shadowAspect = 'Duygusal yabancılaşma, kendi yarattığı mükemmel illüzyona hapsolma ve boşluk hissi';
      coreTransformationTheme = 'Yapmaktan "Olma" haline geçiş; maskeleri eritip otantik özün çıplak ışıltısıyla parlamak';
      unbalancedStrength = 'Pratik zeka ve hedef odaklı dinamizm; dengesizleştiğinde kalpsiz pragmatizme evrilir';
      unconfrontedSymbolicTheme = 'Tüm unvanlar ve alkışlar sustuğunda geride kalan kimsesizlik duygusu';
      tattooTransformationMessage = 'Güneş alkışlarla doğmaz; hakiki değerin zaferlerde değil, varlığının saf mevcudiyetindedir.';
      break;
    case 4:
      coreCharacterTheme = 'Derin Anlam Arayışı, Bireysellik & Özgün Melankoli';
      recurringLifeTheme = 'Sürekli bir şeylerin eksik olduğu hissi (hasret) ve sıradanlaşma dehşeti';
      suppressedAspect = 'Basit gündelik neşe, pratik aidiyet, herkesle bir olma rahatlığı';
      shadowAspect = 'Acıdan beslenen narsisizm, kendini trajik bir kurban olarak yüceltme ve geri çekilme';
      coreTransformationTheme = 'Acıyı kimlik yapmaktan çıkarıp, onu evrensel bir simya ve yaratıcı zarafete dönüştürmek';
      unbalancedStrength = 'Derin estetik sezgi ve empati; dengesizleştiğinde zehirli hasede ve içe kapanışa döner';
      unconfrontedSymbolicTheme = 'Evrenin herkes gibi kendisine de tam ve eksiksiz baktığını kabul etme cesareti';
      tattooTransformationMessage = 'Yara, ışığın içeri sızdığı yerdir; melankoli bir sürgün değil, özün billurlaşma simyasıdır.';
      break;
    case 5:
      coreCharacterTheme = 'Analitik Bilgelik, Gözlemcilik & Mahremiyet';
      recurringLifeTheme = 'Enerjisinin ve kaynaklarının tükenmesi korkusuyla dünyadan geri çekilme';
      suppressedAspect = 'Beden duyumları, kontrolsüz tutkular, zihinsel filtreden geçmeyen sıcak temas';
      shadowAspect = 'Kibri maskeleyen duygusal cimrilik, dünyayı cam fanusun ardından izleyen soğukluk';
      coreTransformationTheme = 'Zihnin kalesinden bedenin ve yaşamın canlı akışına cesaretle adım atmak';
      unbalancedStrength = 'Duru zihin ve derin konsantrasyon; dengesizleştiğinde hayattan kopuk nihilizme yol açar';
      unconfrontedSymbolicTheme = 'Kendi çaresizliğini ve bilgiyle örtülemeyen yaşamın belirsizliğini kabullenmek';
      tattooTransformationMessage = 'Hakiki bilgelik sadece bilmek değil; yaşamın nehrine dalıp ıslanmayı göze almaktır.';
      break;
    case 6:
      coreCharacterTheme = 'Sadakat, Tetiktelik & Güvenlik Matrisi';
      recurringLifeTheme = 'Sürekli olası tehlikeleri tarama, otoriteyle karmaşık ilişki ve güvensizlik';
      suppressedAspect = 'İçsel dinginlik, şüphe duymadan teslim olma, iç otoriteye güven';
      shadowAspect = 'Korkuyu savuşturmak için saldırganlaşma (karşı-fobik) veya paranoyak şüphecilik';
      coreTransformationTheme = 'Dışsal güvenceler aramak yerine kendi ruhsal merkezine ve evrensel korumaya köklenmek';
      unbalancedStrength = 'Sarsılmaz vefa ve kriz yönetimi; dengesizleştiğinde kendi kendini gerçekleştiren kehanetlere döner';
      unconfrontedSymbolicTheme = 'Korkulan şeyin aslında kendi bastırılmış gücünün bir yansıması olduğu gerçeği';
      tattooTransformationMessage = 'Fırtınada sağlam kalan ağaç, köklerini toprağın en derin sessizliğine salandır; güven içeridedir.';
      break;
    case 7:
      coreCharacterTheme = 'Coşku, Özgürlük & Sonsuz Olasılıklar';
      recurringLifeTheme = 'Acıdan, sınırlanmaktan ve mahrum kalmaktan kaçarak sürekli yeni hazlara koşma';
      suppressedAspect = 'Duygusal derin keder, yas tutma süreci, tek bir noktada sabit kalma';
      shadowAspect = 'Yüzeysel sabırsızlık, doyumsuz iştah ve içsel boşlukla karşılaşmamak için kaçış';
      coreTransformationTheme = 'Anın içindeki tek bir noktada derinleşerek ebedi doyuma ve hakiki şükrana ulaşmak';
      unbalancedStrength = 'Yaratıcı vizyon ve iyimserlik; dengesizleştiğinde dağılma ve taahhüt korkusuna dönüşür';
      unconfrontedSymbolicTheme = 'Sessizlikte yankılanan derin yalnızlık ve yüzleşilmemiş içsel yas';
      tattooTransformationMessage = 'Hakiki özgürlük her çiçeğe konmak değil; tek bir tohumun kalbindeki sonsuzluğu görebilmektir.';
      break;
    case 8:
      coreCharacterTheme = 'Ham Güç, Hakkaniyet & Koruyucu Hükümranlık';
      recurringLifeTheme = 'Zayıf görünmeme, manipüle edilmeme ve alanı tam kontrol altında tutma mücadelesi';
      suppressedAspect = 'Kırılgan masumiyet, incinebilirlik, teslimiyet ve yumuşak sevgi';
      shadowAspect = 'Ezici öfke patlamaları, duygusal duvarlar örerek karşı tarafı ezme ve intikam arzusu';
      coreTransformationTheme = 'Gücü tahakküm için değil, savunmasız olanı ve kendi kırılgan iç çocuğunu korumak için kullanmak';
      unbalancedStrength = 'Yıkılmaz liderlik ve cesaret; dengesizleştiğinde yakıp yıkan bir tiranlığa evrilir';
      unconfrontedSymbolicTheme = 'Kendi yumuşak bağrının bir hançerle değil, bir şefkat dokunuşuyla eriyebileceği korkusu';
      tattooTransformationMessage = 'En büyük kudret zırhın kalınlığında değil; çıplak yürekle savunmasız kalabilme cesaretindedir.';
      break;
    default: // 9
      coreCharacterTheme = 'Huzur, Birlik & Kapsayıcı Dinginlik';
      recurringLifeTheme = 'Çatışmadan kaçınmak için kendi varlığını, arzularını ve sesini unutturma (narkotizasyon)';
      suppressedAspect = 'Sağlıklı öfke, net sınırlar çizme, "ben buradayım ve bunu istiyorum" iradesi';
      shadowAspect = 'Pasif agresif direnç, uyuşukluk, hayatının akışını başkalarına teslim edip içten içe kin gütme';
      coreTransformationTheme = 'Sahte barışı bozma pahasına kendi kutsal sesini ve irade ateşini ayağa kaldırmak';
      unbalancedStrength = 'Kozmik kabulleniş ve uzlaştırıcılık; dengesizleştiğinde yok oluşa ve silinmeye varır';
      unconfrontedSymbolicTheme = 'Kendi sesinin dünyayı değiştirebilecek kadar ağır ve değerli olduğu gerçeği';
      tattooTransformationMessage = 'Hakiki huzur dalgalardan kaçmak değil; okyanusun kalbindeki kendi kıvılcımını tutuşturmaktır.';
      break;
  }

  // 3. Enneagram Shadow Archetype Visual Translation
  let shadowFigure = '';
  let shadowGaze = '';
  let shadowBodyLanguage = '';
  let shadowPosition = '';
  let shadowGeometric = '';
  let shadowOrganic = '';
  let shadowLocation = '';
  let shadowRelation = '';
  let shadowPortrayal = '';

  switch (enneaType) {
    case 1:
      shadowFigure = 'Zırhında mikro çatlaklar olan, gözleri yarı kapalı kılıç muhafızı arketipi';
      shadowGaze = 'Kendi iç kusurlarını teftiş eden, aşağıya ve derinliğe odaklanmış içsel yargıç bakışı';
      shadowBodyLanguage = 'Kasılmış omuzlar, gevşemeye başlayan parmaklar; kontrolü serbest bırakma eşiği';
      shadowPosition = 'Ana figürün omurga hizasında, yukarıdan aşağıya inen dikey gerilim hattı';
      shadowGeometric = 'Kusursuz kare ızgaranın alt köşesinden hafifçe kıvrılarak organik eğriye dönüşen çizgiler';
      shadowOrganic = 'Kayaların arasından filizlenen, geometrisi asimetrik yaban gülü ve diken';
      shadowLocation = 'Kompozisyonun üst-orta aksında, kutsal geometri matrisinin merkezinde';
      shadowRelation = 'Ana totem figürünün göğüs kafesi hizasında, onun sert zırhını yumuşatan bir çekirdek gibi';
      shadowPortrayal = 'Karanlık veya tehditkar değil; mükemmellik yükünün ağırlığını taşıyan vakur bir keder ve arınma hissi';
      break;
    case 2:
      shadowFigure = 'Kollarını hem saran hem de görünmez iplerle bağlayan çok katmanlı kanat figürü';
      shadowGaze = 'Karşılık bekleyen derin, doymamış ama gururla gizlenmiş arzu dolu bakış';
      shadowBodyLanguage = 'Açık avuçlar fakat parmak uçları içe doğru hafifçe kıvrılmış; verme ile tutma arasındaki çelişki';
      shadowPosition = 'Ana figürün etrafını saran hilal formunda kavisli kuşatma hattı';
      shadowGeometric = 'İç içe geçmiş damla ve ters üçgen formlarının oluşturduğu kadeh matrisi';
      shadowOrganic = 'Taç yaprakları ağırlaşmış, kendi tohumunu saklayan kutsal lotus ve sarmaşık';
      shadowLocation = 'Merkez ve alt çakra bağlantı aksında';
      shadowRelation = 'Ana totemin ayak ucunda veya kuyruk kıvrımında akışı besleyen su kaynağı gibi';
      shadowPortrayal = 'Kötücül bir varlık değil; sevilme ihtiyacının yarattığı soylu bir açlık ve sınır arayışı';
      break;
    case 3:
      shadowFigure = 'Çift katmanlı maskesi eriyerek alttaki saf yıldız tozuna karışan yüz silueti';
      shadowGaze = 'İzleyiciye değil, kendi yansımasının arkasındaki boşluğa bakan arayış bakışı';
      shadowBodyLanguage = 'Zafer duruşu sergileyen ancak göğüs kafesi savunmasız açıkta duran figür';
      shadowPosition = 'Ana kompozisyonun dikey ışık kırılma çizgisinde';
      shadowGeometric = 'Prizmatik altıgen kristal yüzeyleri ve kırılan ışık huzmeleri';
      shadowOrganic = 'Zirvede açan ama kökleri gölgede kalan kardelen çiçeği';
      shadowLocation = 'Kompozisyonun tam kalbinde, ışık ve gölgenin kesiştiği odak';
      shadowRelation = 'Totem hayvanının arkasındaki hare/hale gibi; onun parlaklığını hem besleyen hem sınırlayan';
      shadowPortrayal = 'Aldatıcı bir kibir değil; sevilmek için başarılı olmak zorunda hisseden içsel çocuğun yorgunluğu';
      break;
    case 4:
      shadowFigure = 'Sudaki yansımasına dokunan, yarısı gölge yarısı ışık olan melankolik arketip';
      shadowGaze = 'Zamansız bir nostalji ve varoluşsal derinliği süzen, uzak ufka kilitli bakış';
      shadowBodyLanguage = 'İçe dönük hafif eğik boyun, bir kanadı açık bir kanadı gövdeye sarılı asimetrik duruş';
      shadowPosition = 'Ana kompozisyonun alt su/gölge havzası ve hilal kuşağı';
      shadowGeometric = 'Fibonacci altın spirali ve parçalanarak yeniden birleşen elipsler';
      shadowOrganic = 'Kökleri geceye, dalları şafağa uzanan ay çiçeği ve söğüt kıvrımları';
      shadowLocation = 'Alt sol veya alt merkez dinamik ekseninde';
      shadowRelation = 'Ana totem figürünün gölgesinden doğan ve onun ayaklarını toprağa bağlayan mistik sis';
      shadowPortrayal = 'Depresif karanlık değil; evrenin hüznünü taşıyan zarif, şiirsel ve dönüştürücü bir simya';
      break;
    case 5:
      shadowFigure = 'Fenerini dışarı değil kendi göğsünün içine tutan sessiz münzevi / kâhin figürü';
      shadowGaze = 'Duygusal tepki vermeyen, sırları çözen ama yaklaşmaya izin vermeyen delici odak';
      shadowBodyLanguage = 'Vücudu sıkıca saran pelerin formu, yalnızca gözlemleyen baş ve dingin eller';
      shadowPosition = 'Merkez arkasındaki kutsal geometrik kafes ve göksel küre ekseni';
      shadowGeometric = 'Metatron küpü ve iç içe geçmiş Platonik cisimlerin hassas çizgi ağı';
      shadowOrganic = 'Karanlıkta parlayan gece mantarları, kristal damarları ve baykuş tüyü dokuları';
      shadowLocation = 'Üst taç ve üçüncü göz hizasında, geometrik arka planda';
      shadowRelation = 'Ana hayvanın başının hemen üstünde onun zihinsel gözlem gücünü simgeleyen mühür';
      shadowPortrayal = 'Soğuk bir mesafe değil; tükenmekten korkan hassas bir ruhun kutsal tapınağını koruma çabası';
      break;
    case 6:
      shadowFigure = 'Kalkanının arkasından gökyüzünü izleyen tetikte bekçi arketipi';
      shadowGaze = 'Hem ufuktaki tehlikeyi sezen hem de içsel güven arayan çift odaklı bakış';
      shadowBodyLanguage = 'Her an harekete geçmeye hazır yay gibi gergin ayaklar fakat gevşemeye çalışan eller';
      shadowPosition = 'Ana figürün sırtını koruyan arka kavis ve çevreleyen güvenlik çemberi';
      shadowGeometric = 'Sekiz köşeli koruyucu Selçuklu yıldızı ve eşmerkezli dairesel kalkan hatları';
      shadowOrganic = 'Kayalara kök salmış dayanıklı ardıç ağacı ve dikenli koruyucu çalılar';
      shadowLocation = 'Kompozisyonun dış çeperini belirleyen mikro-dotwork kuşağı';
      shadowRelation = 'Ana figürü dış dünyadan koruyan ama aynı zamanda onu kısıtlayan sınır çizgisi';
      shadowPortrayal = 'Korkaklık değil; sevdiklerini ve kendini korumak için gece gündüz uyumayan bir sadakat nöbeti';
      break;
    case 7:
      shadowFigure = 'Uçarken arkasında bıraktığı altın kafesi umursamayan fakat yere inemeyen kanatlı ruh';
      shadowGaze = 'Uzak galaksilere bakan, anın sessizliğinde durmaktan çekinen ışıltılı bakış';
      shadowBodyLanguage = 'Sonsuz yükseliş hareketi, yere basmayan ayaklar, rüzgarla savrulan uzuvlar';
      shadowPosition = 'Kompozisyonun üst dinamik boşluğuna doğru dağılan ışık patlaması';
      shadowGeometric = 'Genişleyen spiral dalgaları ve kırılan prizmatik ışık konileri';
      shadowOrganic = 'Rüzgarda tohumlarını saçan karahindiba ve hızla akan gökkuşağı akıntıları';
      shadowLocation = 'Üst tepe noktasında, derinin açık negatif alanına doğru çözünen bölge';
      shadowRelation = 'Ana hayvanın kanatlarından veya taç kısmından yukarı doğru yükselen efemer enerji';
      shadowPortrayal = 'Sorumsuzluk değil; acının ağırlığından korkup güzelliğe sığınan çocuksu bir neşenin korunması';
      break;
    case 8:
      shadowFigure = 'Yaralı pençesini bağrına saklayarak kükreyen kadim hanedan lideri';
      shadowGaze = 'Taviz vermeyen, delip geçen fakat derininde terk edilmiş bir yavrunun şefkat arayışını saklayan bakış';
      shadowBodyLanguage = 'Geniş göğüs kafesi, yere sert basan pençeler, savunmaya geçmeden önceki heybetli durağanlık';
      shadowPosition = 'Merkez ve taban aksında, ağırlık merkezini oluşturan devasa kütle';
      shadowGeometric = 'Keskin açılı eşkenar üçgen (yukarı bakan ateş üçgeni) ve volkanik kırılma hatları';
      shadowOrganic = 'Lav akıntısının üzerinde açan siyah orkide ve kırılmış mızrak filizleri';
      shadowLocation = 'Kompozisyonun en alt ve en sağlam taşıyıcı blok bölgesinde';
      shadowRelation = 'Ana sembolün bizzat kendisi veya onun altında yatan granit temel gibi';
      shadowPortrayal = 'Zulüm değil; dünyanın adaletsizliğine karşı kendi bedenini siper eden bir koruyucunun yorgunluğu';
      break;
    default: // 9
      shadowFigure = 'Okyanus tabanında uyuyan, sırtında tüm dünyayı taşıyan kadim kaplumbağa/balina arketipi';
      shadowGaze = 'Yarı uykulu, zamanın ötesinde, kendi acısını hissetmemek için transa geçmiş huzurlu bakış';
      shadowBodyLanguage = 'Tamamen gevşemiş, akıntıya kapılmış, direnç göstermeyen ağırlıksız gövde';
      shadowPosition = 'Tüm kompozisyonu alttan ve arkadan saran dairesel kozmik çember (Ouroboros)';
      shadowGeometric = 'Kusursuz daire, sonsuzluk işareti ve dengeli Torus halkaları';
      shadowOrganic = 'Su yüzeyinde süzülen nilüfer yaprakları ve yavaş büyüyen kadim yosunlar';
      shadowLocation = 'Kompozisyonun tabanı ve tüm sembolleri bir arada tutan arka plan dalgaları';
      shadowRelation = 'Diğer tüm figürlerin içinde yüzdüğü durgun su havzası';
      shadowPortrayal = 'Tembellik değil; ayrılık ve bölünme acısını yaşamamak için varlığını sessizleştiren kutsal bir birlik özlemi';
      break;
  }

  // 4. Totem Animals Analysis (Light + Shadow)
  const primaryTotemId = (symbolism as any).totemAnimalId || symbolism.totemHierarchy?.[0]?.id;
  const primaryTotemName = symbolism.totemAnimal || symbolism.totemHierarchy?.[0]?.name;
  if (!primaryTotemId && !primaryTotemName) {
    throw new Error('Birincil ruh totemi tanımlanmadan gölge arketipi üretilemez.');
  }

  // Hiyerarşi eksikse sahte rol adı üretme. Aynı doğrulanmış birincil hayvanı
  // güvenli fallback olarak kullan; böylece katalogdaki başka bir hayvanın verisi
  // kesinlikle ödünç alınmaz ve "Gölge Muhafız/Yükseliş Müttefiki" gibi insanî
  // rol etiketleri yanlışlıkla hayvan kimliği sanılmaz.
  const primaryProfile = getTotemAnimalStrict(primaryTotemId || primaryTotemName);
  const shadowGuardianId = symbolism.totemHierarchy?.[1]?.id;
  const shadowGuardianTotem = symbolism.totemHierarchy?.[1]?.name;
  const ascensionId = symbolism.totemHierarchy?.[2]?.id;
  const ascensionTotem = symbolism.totemHierarchy?.[2]?.name;

  const shadowProfile = shadowGuardianId || shadowGuardianTotem
    ? getTotemAnimalStrict(shadowGuardianId || shadowGuardianTotem!)
    : primaryProfile;
  const allyProfile = ascensionId || ascensionTotem
    ? getTotemAnimalStrict(ascensionId || ascensionTotem!)
    : primaryProfile;

  const section4TotemAnimals = [
    {
      name: primaryProfile.name,
      role: 'Birincil Ruh Totemi (Primary Life Totem)',
      mainTotemSymbolism: primaryProfile.mainSymbolism,
      strongSide: primaryProfile.strongSide,
      protectiveSide: primaryProfile.protectivePower,
      instinctiveSide: primaryProfile.instinctiveSide,
      shadowSide: primaryProfile.shadowTrait,
      unbalancedBehavior: primaryProfile.unbalancedBehavior,
      suppressedUncontrolledTrait: primaryProfile.suppressedTrait,
      tattooPhysicalFeature: primaryProfile.tattooPhysicalFeature,
      gazeDirection: primaryProfile.gazeDirection,
      headAngle: primaryProfile.headAngle,
      movementDetail: primaryProfile.posture || primaryProfile.compositionRole,
      posture: primaryProfile.posture,
      compositionRole: primaryProfile.compositionRole
    },
    {
      name: shadowProfile.name,
      role: 'Gölge & Muhafız Totemi (Shadow & Guardian Totem)',
      mainTotemSymbolism: shadowProfile.mainSymbolism,
      strongSide: shadowProfile.strongSide,
      protectiveSide: shadowProfile.protectivePower,
      instinctiveSide: shadowProfile.instinctiveSide,
      shadowSide: shadowProfile.shadowTrait,
      unbalancedBehavior: shadowProfile.unbalancedBehavior,
      suppressedUncontrolledTrait: shadowProfile.suppressedTrait,
      tattooPhysicalFeature: shadowProfile.tattooPhysicalFeature,
      gazeDirection: shadowProfile.gazeDirection,
      headAngle: shadowProfile.headAngle,
      movementDetail: shadowProfile.posture || shadowProfile.compositionRole,
      posture: shadowProfile.posture,
      compositionRole: shadowProfile.compositionRole
    },
    {
      name: allyProfile.name,
      role: 'Ruhsal Yükseliş Müttefiki (Ascension Ally Totem)',
      mainTotemSymbolism: allyProfile.mainSymbolism,
      strongSide: allyProfile.strongSide,
      protectiveSide: allyProfile.protectivePower,
      instinctiveSide: allyProfile.instinctiveSide,
      shadowSide: allyProfile.shadowTrait,
      unbalancedBehavior: allyProfile.unbalancedBehavior,
      suppressedUncontrolledTrait: allyProfile.suppressedTrait,
      tattooPhysicalFeature: allyProfile.tattooPhysicalFeature,
      gazeDirection: allyProfile.gazeDirection,
      headAngle: allyProfile.headAngle,
      movementDetail: allyProfile.posture || allyProfile.compositionRole,
      posture: allyProfile.posture,
      compositionRole: allyProfile.compositionRole
    }
  ];

  // 5. Chakra Blockages & Organic Integration (Strictly Canonical: matches missingNumbers & blockedChakras)
  const canonicalBlockedChakras = chakra.chakras.filter(c => c.status === 'Blokajlı / Eksik');
  const targetChakras = canonicalBlockedChakras.length > 0 
    ? canonicalBlockedChakras 
    : (chakra.chakras.filter(c => c.status === 'Pasif / Düşük').length > 0 
        ? chakra.chakras.filter(c => c.status === 'Pasif / Düşük') 
        : [chakra.chakras[0]]);

  const section5ChakraBlockages = targetChakras.map(c => {
    let geom = 'Dört yapraklı kare yantra ve köklenme küpü';
    let natural = 'Kadim meşe kökleri ve obsidyen kaya katmanları';
    let animal = 'Fil / Ayı (Sağlam basış)';
    let placement = 'Tasarımın en alt taban bölümü';
    let healingSymbol = 'Kök Prana Spiral Mührü';

    if (c.number === 2) {
      geom = 'Hilal formunda iç içe geçmiş su halkaları';
      natural = 'Akıcı dalgalar ve açılmakta olan nilüfer çiçeği';
      animal = 'Timsah / Yılan (Duygusal akış)';
      placement = 'Alt-merkez akış kuşağı';
      healingSymbol = 'Svadhisthana Kutsal Kadeh Geometrisi';
    } else if (c.number === 3) {
      geom = 'Aşağı bakan sivri ateş üçgeni ve güneş ışınları matrisi';
      natural = 'Güneş çiçeği ve volkanik kıvılcımlar';
      animal = 'Koç / Aslan (İrade gücü)';
      placement = 'Merkez gövde çekirdeği';
      healingSymbol = 'Manipura On Yapraklı Ateş Yantrası';
    } else if (c.number === 4) {
      geom = 'İki üçgenin kesiştiği altı köşeli kutsal heksagram (Yantra)';
      natural = 'On iki yapraklı mistik gül ve zeytin dalı';
      animal = 'Antilop / Güvercin (Koşulsuz şefkat)';
      placement = 'Tasarımın tam geometrik kalbi';
      healingSymbol = 'Anahata Şefkat & Denge Mandalasını';
    } else if (c.number === 5) {
      geom = 'Daire içinde ters hilal ve on altı yaprak ızgarası';
      natural = 'Rüzgarda salınan sazlık ve açık gökyüzü bulutu';
      animal = 'Boğa / Beyaz Fil (Hakikat sesi)';
      placement = 'Üst-merkez boyun ve boğaz aksı';
      healingSymbol = 'Vishuddha Saf İfade Mührü';
    } else if (c.number === 6) {
      geom = 'İki büyük kanatlı yaprak ve ikiye ayrılan ışık prizması';
      natural = 'Gece açan yasemin ve üçüncü göz hilali';
      animal = 'Şahin / Baykuş (Öteyi gören bakış)';
      placement = 'Üst taç altı alın hizası';
      healingSymbol = 'Ajna Sezgi Kristali & Om Geometrisi';
    } else if (c.number === 7) {
      geom = 'Bin yapraklı altın oran küresi ve sonsuz torus alanı';
      natural = 'Işık huzmesi ve evrensel kozmik nilüfer';
      animal = 'Anka Kuşu / Beyaz Kartal (Aşkın bilinç)';
      placement = 'Kompozisyonun en tepe taç noktası';
      healingSymbol = 'Sahasrara Kozmik Birlik Mührü';
    }

    return {
      chakraNumber: c.number,
      chakraName: `${c.turkishName} (${c.sanskritName})`,
      coreTheme: c.element + ' Elementi & ' + c.location + ' Bilinci',
      symbolicBlockageMeaning: `${c.status}: Enerjinin bu kapıda sıkışarak ${c.status.includes('Blokaj') || c.status.includes('Düşük') ? 'yetersiz akması ve tıkanması' : 'aşırı taşkınlıkla dengeyi bozması'}.`,
      behavioralManifestation: c.tattooPlacementAdvice,
      geometricEquivalent: geom,
      naturalSymbol: natural,
      animalFigureConnection: animal,
      colorEquivalent: c.color,
      monochromeEquivalent: '03RL stippling dotwork ve %30 grey wash yumuşak tonlama',
      designPlacementSection: placement,
      healingTransformationSymbol: healingSymbol
    };
  });

  // 6. Shadow + Chakra + Totem Intersection Analysis
  const primaryBlockage = targetChakras[0];
  const enneagramShadowChakraIntersection = `Enneagram Tip ${enneagram.wing} gölgesinin "${shadowAspect}" savunması, doğrudan ${primaryBlockage.number}. Çakra (${primaryBlockage.turkishName}) tıkanıklığı ile kesişir. Kişi ${primaryBlockage.location} bölgesindeki enerjiyi bastırarak zihinsel/duygusal savunma duvarı örmüştür.`;
  const totemShadowChakraIntersection = `${primaryTotemName} toteminin gölge yönü olan "${section4TotemAnimals[0].shadowSide}", bu çakranın aşırı kontrol veya geri çekilme refleksiyle birebir rezonansa girer.`;
  const recurringSharedTheme = `Tüm analizlerde tekrar eden ortak kök tema: "Güvenlik ve sevilme uğruna kendi otantik gücünü ve duygusal akışını kilitleme" eğilimidir.`;
  const strongestShadowMotif = `Aşırı savunmacı zırh ve teftiş eden tecrit bakışı (Kilitli kapı arketipi).`;
  const strongestTransformationMotif = `Zırhın arasından göğe doğru açılan altın oran filizi ve serbest kalan kanat hareketi.`;
  
  // 7. Symbolic Visual Dictionary & Design Inclusion Decisions
  const includeTotem = parameters?.includeTotemInDesign === true;
  const hasVerified19 = numerology.divineHelp19?.has19 === true;
  let actualMainSymbol = parameters?.mainSymbol;
  const isTotemName = actualMainSymbol === primaryTotemName || 
    actualMainSymbol === section4TotemAnimals[1]?.name ||
    symbolism.totemHierarchy?.some(t => t.name === actualMainSymbol);

  if (!includeTotem) {
    if (!actualMainSymbol || isTotemName) {
      actualMainSymbol = symbolism.sacredObject || symbolism.geometricSymbol || 'Kutsal Geometri & Yaşam Çiçeği';
    }
  } else {
    if (!actualMainSymbol) {
      actualMainSymbol = primaryTotemName;
    }
  }

  const supportingSymbols = includeTotem ? [
    `${primaryTotemName} (Ana Karakter Gücü)`,
    `${section5ChakraBlockages[0].geometricEquivalent} (Çakra Şifa Matrisi)`,
    `${symbolism.plantFlora} (Organik Dönüşüm Köprüsü)`,
    ...(hasVerified19 ? ['Fibonacci Spiral Akışı & 19 İlahi Yardım Düğümü'] : ['Fibonacci Spiral Akışı'])
  ] : [
    `${actualMainSymbol} (Ana Kutsal Geometri & Mühür Odağı)`,
    `${section5ChakraBlockages[0].geometricEquivalent} (Çakra Şifa Matrisi)`,
    `${symbolism.plantFlora} (Organik Dönüşüm Köprüsü)`,
    ...(hasVerified19 ? ['Fibonacci Spiral Akışı & 19 İlahi Yardım Düğümü'] : ['Fibonacci Spiral Akışı'])
  ];

  const eliminatedRedundantSymbols = includeTotem ? [
    `Doğrudan literal çakra ikonları (Aşırı yapay ve klişe olduğu için elendi; organik geometriye yedirildi)`,
    `Ekstra 3. ve 4. hayvan figürleri (Görsel karmaşayı önlemek ve ana totemin gücünü zayıflatmamak için elendi)`,
    `Rastgele astrolojik glifler (Sadece tasarımın akışına hizmet eden tekil takımyıldız düğümü tutuldu)`
  ] : [
    `Totem hayvan figürleri (${primaryTotemName} ve ${section4TotemAnimals[1]?.name || shadowGuardianTotem}) (Danışan tercihi doğrultusunda dövme görseline KESİNLİKLE hayvan figürü dahil edilmedi, yalnızca kişisel analitik rehber olarak tutuldu)`,
    `Doğrudan literal çakra ikonları (Aşırı yapay ve klişe olduğu için elendi; organik geometriye yedirildi)`,
    `Rastgele astrolojik glifler (Sadece tasarımın akışına hizmet eden tekil takımyıldız düğümü tutuldu)`
  ];

  const section7VisualDictionary = includeTotem ? [
    {
      symbol: primaryTotemName,
      source: `Yaşam Yolu ${lifePath} + Güneş ${sunSign}`,
      meaning: 'Ruhani uyanış, bağımsız strateji, kaderi görebilme cesareti.',
      shadowOrTransformation: `${section4TotemAnimals[0].shadowSide} → Dönüşüm: Yargılamadan gören derin bilgelik.`,
      visualRole: 'Ana Odak Figürü (%65 Görsel Ağırlık). En keskin kontur, göz hizasında merkezi varlık.',
      category: 'Ana Figür / Hayvan'
    },
    {
      symbol: section4TotemAnimals[1]?.name || shadowGuardianTotem,
      source: `Enneagram ${enneagram.wing} Gölgesi`,
      meaning: 'Bilinçdışı koruma içgüdüsü, sınır güvenliği, sessiz kudret.',
      shadowOrTransformation: `${section4TotemAnimals[1]?.shadowSide || ''} → Dönüşüm: Sadık ve uyanık içsel rehber.`,
      visualRole: 'Yardımcı Gölge Figürü (%20 Görsel Ağırlık). Ana figürün tabanına dolanan yumuşak siluet.',
      category: 'Gölge Figür / Hayvan'
    },
    {
      symbol: section5ChakraBlockages[0].geometricEquivalent,
      source: `${section5ChakraBlockages[0].chakraName} Şifası`,
      meaning: 'Enerjetik merkezleme, kaostan düzene geçiş, kozmik frekans kapısı.',
      shadowOrTransformation: 'Blokajlı enerji akışını düzenli titreşime kavuşturan yapısal matris.',
      visualRole: 'Yapısal Altyapı (%10 Görsel Ağırlık). Ana figürün arkasındaki kılavuz linework çizgileri.',
      category: 'Geometrik Şekil'
    },
    {
      symbol: symbolism.plantFlora || 'Zeytin Dalı & Sarmaşık',
      source: `${astrology.dominantElement} Elementi Dengesi`,
      meaning: 'Canlılık, organik büyüme, yaranın kabuğundan doğan şifa.',
      shadowOrTransformation: 'Sert ve mekanikleşen savunmaları yumuşatan hayat suyu köprüsü.',
      visualRole: 'Akış ve Bağlantı Unsuru (%5 Görsel Ağırlık). Figürler arasındaki anatomik geçiş bağı.',
      category: 'Çiçek / Bitki'
    },
    {
      symbol: hasVerified19 ? 'Kutsal 19 & Fibonacci Düğüm Noktaları' : 'Fibonacci Altın Sarmal Düğüm Noktaları',
      source: hasVerified19 ? `Numeroloji DM ${numerology.dmNumber} & İlahi 19 Mührü` : 'Kutsal Geometri / Fibonacci oranı',
      meaning: hasVerified19 ? 'Kader döngüsünün kilit noktaları, ilahi koruma ve matematiksel uyum.' : 'Kozmik oran, ritim ve matematiksel uyum.',
      shadowOrTransformation: 'Görünmez kozmik iradeye teslimiyet ve içsel güvenin tesisi.',
      visualRole: 'Ezoterik Mikro Detaylar (%3 Görsel Ağırlık). Yalnızca yakından fark edilen mikro dotwork noktaları.',
      category: 'Gizli Mühür / Mikro Sembol'
    }
  ] : [
    {
      symbol: actualMainSymbol,
      source: `Yaşam Yolu ${lifePath} + Güneş ${sunSign} Temel İradesi`,
      meaning: 'Kutsal odak, nizam, koruma ve yüksek kozmik irade.',
      shadowOrTransformation: 'Kararsızlığı ve kaosu keskin bir içsel pusulaya dönüştüren ana merkez.',
      visualRole: 'Ana Odak Sembolü (%65 Görsel Ağırlık). En keskin kontur, en yüksek kontrast ve merkezi varlık.',
      category: 'Ana Figür / Kutsal Sembol'
    },
    {
      symbol: section5ChakraBlockages[0].geometricEquivalent,
      source: `${section5ChakraBlockages[0].chakraName} Şifası`,
      meaning: 'Enerjetik merkezleme, kaostan düzene geçiş, kozmik frekans kapısı.',
      shadowOrTransformation: 'Blokajlı enerji akışını düzenli titreşime kavuşturan yapısal matris.',
      visualRole: 'Yapısal Altyapı (%15 Görsel Ağırlık). Ana sembolün arkasındaki kılavuz linework çizgileri.',
      category: 'Geometrik Şekil'
    },
    {
      symbol: section5ChakraBlockages[0].healingTransformationSymbol,
      source: `Çakra Dönüşüm Mührü`,
      meaning: 'Duygusal arınma, bastırılmış gölge dirençlerini çözen şifa frekansı.',
      shadowOrTransformation: 'Korku ve katılık kalıplarını yumuşatan dönüştürücü titreşim.',
      visualRole: 'Yardımcı Şifa Sembolü (%10 Görsel Ağırlık). Taban veya merkez aks geçişi.',
      category: 'Şifa Mührü'
    },
    {
      symbol: symbolism.plantFlora || 'Zeytin Dalı & Sarmaşık',
      source: `${astrology.dominantElement} Elementi Dengesi`,
      meaning: 'Canlılık, organik büyüme, yaranın kabuğundan doğan şifa.',
      shadowOrTransformation: 'Sert ve mekanikleşen savunmaları yumuşatan hayat suyu köprüsü.',
      visualRole: 'Akış ve Bağlantı Unsuru (%7 Görsel Ağırlık). Figürler arasındaki anatomik geçiş bağı.',
      category: 'Çiçek / Bitki'
    },
    {
      symbol: hasVerified19 ? 'Kutsal 19 & Fibonacci Düğüm Noktaları' : 'Fibonacci Altın Sarmal Düğüm Noktaları',
      source: hasVerified19 ? `Numeroloji DM ${numerology.dmNumber} & İlahi 19 Mührü` : 'Kutsal Geometri / Fibonacci oranı',
      meaning: hasVerified19 ? 'Kader döngüsünün kilit noktaları, ilahi koruma ve matematiksel uyum.' : 'Kozmik oran, ritim ve matematiksel uyum.',
      shadowOrTransformation: 'Görünmez kozmik iradeye teslimiyet ve içsel güvenin tesisi.',
      visualRole: 'Ezoterik Mikro Detaylar (%3 Görsel Ağırlık). Yalnızca yakından fark edilen mikro dotwork noktaları.',
      category: 'Gizli Mühür / Mikro Sembol'
    }
  ];

  // 8. Main Tattoo Concept
  const section8MainConcept = {
    mainSymbol: actualMainSymbol,
    secondarySymbols: includeTotem
      ? [section4TotemAnimals[1]?.name || shadowGuardianTotem, symbolism.plantFlora, section5ChakraBlockages[0]?.healingTransformationSymbol || 'Lotus']
      : [symbolism.plantFlora, section5ChakraBlockages[0]?.healingTransformationSymbol || 'Lotus', section5ChakraBlockages[0]?.geometricEquivalent || 'Geometri'],
    shadowSymbol: shadowFigure,
    totemAnimal: includeTotem ? primaryTotemName : 'Tasarıma dahil edilmedi (Danışan tercihi: Yalnızca ruhani analiz)',
    chakraSymbols: [section5ChakraBlockages[0].geometricEquivalent],
    hiddenEsotericDetails: [
      ...(hasVerified19 ? ['19 Noktalı mikro takımyıldız matrisi'] : []),
      `Fibonacci sarmalına oturtulmuş gizli altın oran eğrileri`,
      `Kişinin Yaşam Yolu ${lifePath} ve Ebced ${ebcedData.totalEbced} kodunu taşıyan 3 adet mikro çentik`
    ],
    geometricInfrastructure: 'Merkezi dikey omurga aksı üzerine oturtulmuş kutsal geometri ve açık elipsler',
    compositionDirection: `${parameters.orientation} anatomik akış yönelimi`,
    visualHierarchy: {
      primaryFocusPercent: includeTotem ? '%65 (Ana Totem & Bakış Odağı)' : '%65 (Ana Kutsal Sembol & Mühür)',
      secondaryPercent: includeTotem ? '%25 (Yardımcı Gölge Figürü & Organik Akış)' : '%25 (Çakra Geometrisi & Organik Akış)',
      microDetailsPercent: '%10 (Kutsal Geometri & Mikro Mühürler)'
    },
    negativeSpaceUsage: '%45–50 Cildin doğal nefes alanı; derin siyahların arasından ışık gibi parlayan saf ten.',
    focalPoint: includeTotem
      ? `${primaryTotemName} figürünün 3/4 açıyla duran başı ve derin dönüşüm mesajı taşıyan göz hizası.`
      : `${actualMainSymbol} sembolünün merkezdeki yüksek kontrastlı ve keskin hatlı kutsal odağı.`,
    eyeMovementPath: includeTotem
      ? `Göz önce merkezdeki ${primaryTotemName} bakışına kilitlenir, ardından aşağıya doğru inen ${section4TotemAnimals[1]?.name || shadowGuardianTotem} gölgesinin kavisini takip eder, son olarak arka plandaki kutsal geometri çizgileriyle yeniden yukarıya taç bölgesine süzülür.`
      : `Göz önce merkezdeki ${actualMainSymbol} odağına kilitlenir, ardından organik ${symbolism.plantFlora} akışını ve ${section5ChakraBlockages[0].geometricEquivalent} kutsal geometri çizgilerini takip ederek cildin açık negatif alanına doğru dinginlikle yayılır.`
  };

  // 9. Tattoo Composition Architecture
  const section9CompositionArchitecture = {
    axisOrientation: parameters.orientation?.includes('Dikey') ? 'Dikey (Anatomik Kas Akışına Uygun)' : 'Dinamik Kavisli Hat',
    symmetryType: 'Organik Asimetrik Denge (Sacred Geometry tabanında asimetrik canlı figürler)',
    balanceType: 'Merkezi Çekim & Yukarı Doğru Yükselen Dinamik Akış',
    mainFigureDirection: includeTotem 
      ? 'Gövde sağa hafif dönük, baş sol omzun üzerinden izleyicinin ufuk çizgisine bakan 3/4 profil'
      : 'Merkezi dikey simetri ekseninde, yukarı doğru yükselen kutsal geometrik mühür ve mandala odağı',
    secondaryFiguresPlacement: includeTotem
      ? 'Ana figürün alt gövdesini ve ayaklarını çevreleyen hilal şeklinde taban sarmalı'
      : 'Merkezi kutsal armatürü çevreleyen organik botanik kıvrımlar ve çakra şifa yantrası hatları',
    negativeSpaceLocations: includeTotem
      ? 'Figürün göğüs kafesi çevresi, kanat/gövde açıklıkları ve dış çeper konturlarının dışı'
      : 'Kutsal geometri halkalarının iç açıklıkları, mandalanın merkezi ve dış kılavuz konturlarının tenle buluştuğu negatif boşluklar',
    geometricFramework: '03RL tek iğneyle atılmış ince kılavuz dairesel yantralar ve altın spiral aksı',
    topSection: 'Hafifleyen mikro dotwork geçişleri, yıldız düğümleri ve göğe açılan negatif alan',
    centerSection: includeTotem
      ? `${primaryTotemName} figürünün anatomik detayları, gözler, en derin gölge kontrastı ve kalp yantrası`
      : `${actualMainSymbol} kutsal geometrik mühür odağı, altın oran kirişleri, en derin kontrast ve kalp yantrası (Totem hayvanı tasarıma dahil edilmemiştir)`,
    bottomSection: includeTotem
      ? `${section4TotemAnimals[1]?.name || shadowGuardianTotem} gölgesinin köklenen ağır tabanı, toprak/su sembolizmi ve kilitli enerjinin çözüldüğü nokta`
      : `Topraklanan kutsal yantra tabanı, akıcı organik botanik (${symbolism.plantFlora}) ve çözülen blokaj hattı`,
    microDetailsPlacement: includeTotem
      ? 'Geometrik hatların kesişim noktalarında ve ana tüy/kürk gölgelerinin derinliklerinde gizli mikro noktalar'
      : 'Geometrik hatların kesişim noktalarında, mandala çeperlerinde ve botanik yaprak kılcal damarlarında gizli mikro noktalar'
  };

  // 10. Esoteric Micro Details
  const section10EsotericMicroDetails = [
    ...(hasVerified19 ? [{
      type: 'Sayısal Kod & Mühür',
      name: 'İlahi 19 Koruma Düğümü',
      detail: 'Ana figürün omurga hizasında gizlenmiş 19 adet mikro nokta dizilimi.',
      rationale: `Numerolojideki 19 İlahi Yardım rezonansını cilde mühürlemek; kader döngüsünü ilahi lütuf ile tamamlamak.`
    }] : []),
    {
      type: 'Kutsal Geometri Oranı',
      name: 'Fibonacci Altın Sarmal Kılavuzu',
      detail: 'Figürün kuyruk veya kanat açılımının 1:1.618 oranında genişleyen mikro linework çizgileri.',
      rationale: `Gözün tasarımı izlerken biyolojik bir huzur ve estetik denge hissetmesini sağlamak.`
    },
    {
      type: 'Ebced & Yıldızname İmzası',
      name: `Ebced ${ebcedData.totalEbced} Tılsımi Çentikleri`,
      detail: `Geometrik dairenin kenarında 3 küçük asimetrik mikro çentik.`,
      rationale: `Kişinin ve annesinin kadim ebced toplamının (${ebcedData.totalEbced}) yarattığı ruhani frekansı mühürlemek.`
    },
    {
      type: 'Çakra Frekans Kodu',
      name: `${section5ChakraBlockages[0].chakraName} Şifa Yantrası Detayı`,
      detail: 'Ana figürün kalp/göğüs hizasında 03RL ile çizilmiş minimal kapalı yantra konturu.',
      rationale: 'Blokajlı çakra merkezini gün boyu enerjetik olarak dengeleyen ve açan radyonik anten görevi görmesi.'
    }
  ];

  if (parameters.useMorseCodeForNumbers) {
    const rawToEncode = parameters.customMorseInput?.trim() ||
      person.personalNumbers?.trim() ||
      (person.birthDate ? person.birthDate.split('-').reverse().join('.') : '') ||
      `${numerology.lifePathNumber}`;
    const morseEnc = encodeToMorse(rawToEncode);
    section10EsotericMicroDetails.push({
      type: 'Mors Alfabesi Şifreleme Mührü',
      name: `Kutsal Rakam Mors Kodlaması (${morseEnc.rawInput})`,
      detail: `Geometrik mandalanın dış çeperinde 03RL mikro-dotwork ve 1.5mm fine-line çubuklar: "${morseEnc.morseDisplay}"`,
      rationale: `Kişinin doğum ve kader sayılarını kaba Latin rakamları yerine dövme estetiğine uygun ezoterik mikro çizgi/nokta kodlamasıyla cilde mühürlemek.`
    });
  }

  // 11. Tattoo Artist Technical Spec Sheet (Section 11 Format)
  const section11TattooArtistBrief = `
=====================================================
11. DÖVME SANATÇISI TEKNİK UYGULAMA BRİFİ (STUDIO SPEC SHEET)
=====================================================
DANIŞAN: ${person.name || 'Danışan'}
ANA ODAK: ${actualMainSymbol} (${includeTotem ? '3/4 Açılı Totem Figürü' : 'Kutsal Odak Sembolü'}, %65 Görsel Ağırlık)
YARDIMCI SEMBOLLER: ${includeTotem ? `${section4TotemAnimals[1]?.name || shadowGuardianTotem} (Gölge Tabanı), ` : ''}${symbolism.plantFlora}, ${section5ChakraBlockages[0].healingTransformationSymbol}
GÖLGE ARKETİP: Enneagram Tip ${enneagram.wing} Gölgesi (${shadowFigure})
TOTEM HAYVANI DURUMU: ${includeTotem ? `${primaryTotemName} (Tasarıma Dahil Edildi)` : `Tasarıma dahil edilmedi (Danışanın tercihiyle yalnızca kişisel ruhani analizde tutuldu; dövmeye KESİNLİKLE hayvan figürü çizilmeyecektir)`}
ÇAKRA BLOKAJLARI: ${section5ChakraBlockages.map(c => `${c.chakraNumber}. ${c.chakraName} [${c.geometricEquivalent}]`).join(', ')}
GİZLİ EZOTERİK DETAYLAR: ${hasVerified19 ? '19 İlahi Düğüm Noktası, ' : ''}Fibonacci Sarmalı, Ebced (${ebcedData.totalEbced}) Çentikleri

STİL: Fine Line, Micro Realism, Dotwork, Stippling
İĞNE SEÇİMİ: 
  • 03RL (0.25mm Long Taper): Tüm mikro detaylar, kutsal geometri, yüzey mikro dokuları, takımyıldız noktaları
  • 05RL: Ana figürün taşıyıcı dış konturları ve anatomik kas hatları
  • 07M1 Curved Magnum (İsteğe bağlı): Yumuşak whip shading gölge degrade geçişleri
GÖLGELEME TEKNİĞİ: Whip Shading, Pendulum Dotwork, 3 Aşamalı Grey Wash (%30 açık, %60 orta, %90 derin doymuş siyah)
NEGATİF ALAN: %45–50 civarı (Cildin doğal ışıltısı derin siyahların arasından nefes alma boşluğu olarak bırakılmalıdır)
ÇİZGİ GÜVENLİĞİ: Çizgiler arasında minimum 1.5–2 mm net güvenlik mesafesi (10 yıllık pigment yayılması ve blowout riski önlenmiştir)
ÖNERİLEN BOYUT: Minimum 16 x 10 cm | İdeal: 22 x 14 cm (Mikro detayların ve 03RL iğne vuruşlarının ömür boyu berrak kalması için)
YERLEŞİM & ANATOMİK AKIŞ: ${parameters.bodyPlacement} (${parameters.orientation.toLowerCase()} hat; kas liflerine paralel uzanmalı, vücut hareketlerinde formunu korumalıdır)
=====================================================
  `.trim();

  // 12. Midjourney v6.1 / Niji 6 Master Prompt (Section 12 Format)
  const stylesMasterStr = 'Fine Line, Micro Realism, Dotwork, Stippling, 03RL, 05RL, Whip Shading, Black & Grey, Open negative space, Skin-safe composition, Tattoo flash plate';
  const animalNegatives = !includeTotem ? ', animal, beast, bird, wolf, raven, eagle, predator, creature, fauna, wildlife' : '';

  const midjourneyMasterPrompt = includeTotem ? `
master tattoo design, tattoo flash plate, stencil-ready, central commanding ${primaryTotemName} with 3/4 intense gaze, embodying transformed inner strength over shadow instincts (${section4TotemAnimals[0]?.shadowSide?.replace(/"/g, '') || ''}), harmonized with subtle guardian silhouette of ${section4TotemAnimals[1]?.name || shadowGuardianTotem} anchored at base, integrated with delicate sacred geometry of ${section5ChakraBlockages[0].geometricEquivalent} healing mandala, woven with organic ${symbolism.plantFlora}, ${hasVerified19 ? 'esoteric micro 19-dot matrix and ' : ''}Fibonacci spiral lines, ${stylesMasterStr}, high contrast velvety black ink and smooth 3-stage grey wash shading, 45% open negative skin space, completely isolated on clean solid off-white neutral background, flat 2D tattoo art presentation --ar 2:3 --v 6.1 --style raw --s 250 --no skin, body, arm, hand, human model, tattoo mockup, photograph, 3d render, frame, text, watermark, logo, poster, decorative wallpaper, random symbols, floating unrelated symbols, overcrowded composition
  `.trim().replace(/\s+/g, ' ') : `
master tattoo design, tattoo flash plate, stencil-ready, central commanding ${actualMainSymbol}, embodying transformed inner spiritual strength and sacred order, integrated with delicate sacred geometry of ${section5ChakraBlockages[0].geometricEquivalent} healing mandala, woven with organic ${symbolism.plantFlora} botanicals, ${hasVerified19 ? 'esoteric micro 19-dot matrix and ' : ''}Fibonacci spiral lines, ${stylesMasterStr}, high contrast velvety black ink and smooth 3-stage grey wash shading, 45% open negative skin space, completely isolated on clean solid off-white neutral background, flat 2D tattoo art presentation --ar 2:3 --v 6.1 --style raw --s 250 --no skin, body, arm, hand, human model, tattoo mockup, photograph, 3d render, frame, text, watermark, logo, poster, decorative wallpaper, random symbols, floating unrelated symbols, overcrowded composition${animalNegatives}
  `.trim().replace(/\s+/g, ' ');

  const dalle3Prompt = includeTotem ? `
A master esoteric tattoo flash sheet artwork centered on ${primaryTotemName}, embodying a profound psychological journey from shadow to illumination. The totem has an alert, noble 3/4 expression. Beneath it, the fluid silhouette of ${section4TotemAnimals[1]?.name || shadowGuardianTotem} merges into graceful organic botanicals of ${symbolism.plantFlora} and sacred geometric mandala lines (${section5ChakraBlockages[0].geometricEquivalent}). Rendered strictly as a professional tattoo flash plate with ultra-precise 03RL fine linework, smooth whip shading, and balanced 50% open negative space. The artwork is flat, centered, and completely isolated on a clean neutral white studio paper background. No human skin, no body parts, no mockups, no photo realism, no text.
  `.trim().replace(/\s+/g, ' ') : `
A master esoteric tattoo flash sheet artwork centered on ${actualMainSymbol}, embodying a profound psychological journey of spiritual centering and sacred geometry. The composition radiates outward into graceful organic botanicals of ${symbolism.plantFlora} and sacred geometric mandala lines (${section5ChakraBlockages[0].geometricEquivalent}). Rendered strictly as a professional tattoo flash plate with ultra-precise 03RL fine linework, smooth whip shading, and balanced 50% open negative space. The artwork is flat, centered, and completely isolated on a clean neutral white studio paper background. Do not include any animals, creatures, human skin, body parts, mockups, photo realism, or text.
  `.trim().replace(/\s+/g, ' ');

  const fluxPrompt = includeTotem ? `
An immaculate esoteric tattoo flash plate by world-class fine-line tattoo masters. Centrally anchored ${primaryTotemName} with piercing deep gaze, representing the integration of Enneagram shadow into spiritual mastery. Seamlessly fused with ${section4TotemAnimals[1]?.name || shadowGuardianTotem} and sacred geometry yantra patterns of ${section5ChakraBlockages[0].geometricEquivalent}. Executed in 03RL fine line, micro realism, stippling dotwork, and rich black & grey wash. Pure binary black carbon ink with velvety gradients, skin-safe spacing, pristine composition, isolated on flat neutral studio backdrop. Professional tattoo flash presentation plate, 8k resolution, immaculate linework.
  `.trim().replace(/\s+/g, ' ') : `
An immaculate esoteric tattoo flash plate by world-class fine-line tattoo masters. Centrally anchored ${actualMainSymbol}, representing spiritual centering and sacred geometry mastery. Seamlessly fused with sacred geometry yantra patterns of ${section5ChakraBlockages[0].geometricEquivalent} and botanical linework of ${symbolism.plantFlora}. Executed in 03RL fine line, sacred geometry vector art, stippling dotwork, and rich black & grey wash. Pure binary black carbon ink with velvety gradients, skin-safe spacing, pristine composition, isolated on flat neutral studio backdrop. Professional tattoo flash presentation plate, 8k resolution, immaculate linework, no animals.
  `.trim().replace(/\s+/g, ' ');

  const stencilPrompt = includeTotem ? `
professional tattoo stencil line art transfer sheet, pure binary black vector outline on pure white background, 03RL single needle linework, tattoo stencil-ready, crisp contours of ${primaryTotemName} with guardian silhouette of ${section4TotemAnimals[1]?.name || shadowGuardianTotem} and sacred geometry yantra matrix, zero shading, zero grey tones, pure line art, open skin-safe negative space, thermal copier transfer sheet --ar 2:3 --v 6.1 --style raw --s 100 --no shading, grey, gradient, skin, mockup, color, blur, 3d
  `.trim().replace(/\s+/g, ' ') : `
professional tattoo stencil line art transfer sheet, pure binary black vector outline on pure white background, 03RL single needle linework, tattoo stencil-ready, crisp contours of ${actualMainSymbol} with sacred geometry yantra matrix (${section5ChakraBlockages[0].geometricEquivalent}) and botanical lines (${symbolism.plantFlora}), zero shading, zero grey tones, pure line art, open skin-safe negative space, thermal copier transfer sheet --ar 2:3 --v 6.1 --style raw --s 100 --no shading, grey, gradient, skin, mockup, color, blur, 3d${animalNegatives}
  `.trim().replace(/\s+/g, ' ');

  const negativePrompt = `skin, body, arm, hand, human model, tattoo mockup, photograph, 3d render, frame, text, watermark, logo, poster, decorative wallpaper, random symbols, floating unrelated symbols, overcrowded composition, blurry, color, rainbow, distorted anatomy${animalNegatives}`;

  // Müşteriye Özel Sembol & Şifa Açıklama Rehberi (Client-Ready Dossier)
  const clientSymbols: ClientSymbolExplanationItem[] = includeTotem ? [
    {
      symbolName: `Ana Totem: ${primaryTotemName}`,
      category: 'Ana Odak Figürü (%65 Görsel Ağırlık)',
      meaning: `${section4TotemAnimals[0].mainTotemSymbolism} — Doğuştan gelen içsel iradenin, asaletin ve yaşam karşısındaki cesur duruşun arketipik temsilcisidir.`,
      reason: `Doğum haritanızdaki Güneş ${astrology.sunSign} ve Yaşam Yolu ${lifePath} (${numerology.lifePathTitle}) enerjinizin en saf arketipsel yansıması olarak seçildi. Hayatınızda ${coreCharacterTheme} ihtiyacınızı somutlaştırır.`,
      benefitsAndHealing: `Stres veya baskı anlarında "${section4TotemAnimals[0].shadowSide}" eğilimine girdiğinizde bu gölgeyi bilge bir iradeye dönüştürür. Kararsızlık anlarında netlik, sınır koyma cesareti ve içsel liderlik frekansı kazandırır. Bu figür cildinizde taşındıkça, kendinizden şüphe duyduğunuz her anda omurganızı dik tutan bir ruhsal pusula olacaktır.`,
      visualRepresentation: `Tasarımın merkezinde, 3/4 açıyla ufka bakan uyanık, bilge ve derin bakışlarla konumlandırılmıştır.`
    },
    {
      symbolName: `Gölge Koruyucu: ${section4TotemAnimals[1]?.name || shadowGuardianTotem}`,
      category: 'Gölge Muhafız & Köklenme Figürü',
      meaning: `${section4TotemAnimals[1]?.mainTotemSymbolism || ''} — Bilinçdışının karanlık dehlizlerini aydınlatan, geceyi gören ve sezgisel savunmayı yöneten içsel muhafız.`,
      reason: `Enneagram ${enneagram.wing} kanadınız ve bastırılmış içgüdüsel korkularınızın (${section4TotemAnimals[1]?.shadowSide || ''}) şifalanması için seçildi.`,
      benefitsAndHealing: `Korktuğunuz veya yüzleşmekten kaçındığınız şeylerin içindeki gizli kudreti görmenizi sağlar. Enerjinizi tüketen insanlara veya ortamlara karşı görünmez bir psişik kalkan oluşturur. Sizi toprağa ve merkezinize köklendirir, aşırı zihinsellikten bedensel sezgilere geri çağırır.`,
      visualRepresentation: `Ana figürün alt gövdesini ve tabanını koruyan, hilal formunda kıvrılan zarif ve dingin bir siluet.`
    },
    {
      symbolName: `Gölge Arketipi Yoldaşı (${shadowFigure})`,
      category: 'Bilinçdışı Gölgenin Bilge İfadesi',
      meaning: `Stres ve zorlanma anlarında devreye giren reaktif savunma mekanizmanızın bilgelikle kucaklanmış halidir.`,
      reason: `Enneagram Tip ${enneagram.typeName} yapınızdaki "${suppressedAspect}" ihtiyacınızı bastırmadan, sağlıklı bir farkındalıkla yaşamanız için tasarlandı.`,
      benefitsAndHealing: `Kendinizi acımasızca eleştirme, kusursuzluk kaygısı veya sevilmek için kendinden ödün verme döngünüzü kırar. Bu sembol sayesinde, kusur veya zayıflık sandığınız yönlerinizin aslında sizi derinleştiren hazineler olduğunu fark eder; içsel şefkate ulaşırsınız.`,
      visualRepresentation: `Karanlık bir tehdit olarak değil; kabullenici bir yüz ifadesi ve yumuşak whip shading gölgeleriyle ana figürün aurasına kaynaştırılmıştır.`
    },
    {
      symbolName: `Çakra Şifa Geometrisi (${section5ChakraBlockages[0].geometricEquivalent})`,
      category: `${section5ChakraBlockages[0].chakraNumber}. ${section5ChakraBlockages[0].chakraName} Dengeleyici Geometrisi`,
      meaning: `${section5ChakraBlockages[0].coreTheme} frekansını düzenleyen kadim evrensel form.`,
      reason: `Enerji haritanızda tespit edilen ${section5ChakraBlockages[0].symbolicBlockageMeaning} tıkanıklığını kalıcı olarak açmak ve akışı serbest bırakmak amacıyla yerleştirildi.`,
      benefitsAndHealing: `${section5ChakraBlockages[0].behavioralManifestation} halini dönüştürür. ${section5ChakraBlockages[0].healingTransformationSymbol} frekansını aktive ederek enerjinizin tıkandığı bedensel ve ruhsal kanalları açar; hayata karşı direnç göstermek yerine güvenle akmanızı sağlar.`,
      visualRepresentation: `Ana figürün arkasında 03RL kılcal tek iğneyle hassas biçimde işlenmiş, nefes alan narin mandala çizgileri.`
    },
    {
      symbolName: `Organik Şifa Florası (${symbolism.plantFlora || 'Zeytin Dalı & Sarmaşık'})`,
      category: 'Organik Şifa & Yaşam Enerjisi',
      meaning: `Toprak ananın yenileyici nefesi, kırılan dalların yeniden filizlenme döngüsü ve esneklik.`,
      reason: `Astrolojik ${astrology.dominantElement} elementinizi yumuşatmak ve tasarıma canlı, organik bir nabız kazandırmak için eklendi.`,
      benefitsAndHealing: `Katılaşan düşünceleri ve katı kuralları yumuşatır; zorlu hayat deneyimlerinin ardından içinizdeki yaşam sevincini ve tazeliği yeniden uyandırır. Kalbinize ferahlık ve şefkat pompalar.`,
      visualRepresentation: `Ana figür ile geometrik zemin arasında akıcı bir şekilde dolanan narin yaprak ve çiçek filizleri.`
    },
    {
      symbolName: 'Kutsal Geometri & Fibonacci Altın Sarmalı',
      category: 'Kozmik İlahi Düzen Matrisi',
      meaning: `Evrenin yaratılışındaki ilahi oran (1:1.618); kaostan doğan mükemmel kozmik ahenk.`,
      reason: `Zihninizdeki karmaşayı ve belirsizlik kaygısını evrenin matematiksel kusursuzluğuna bağlamak için seçildi.`,
      benefitsAndHealing: `Panik, acelecilik veya kontrol kaybı hissettiğinizde sizi merkezler. Hayattaki hiçbir şeyin tesadüf olmadığını, her olayın ilahi bir zamanlaması olduğunu bilinçaltınıza fısıldar.`,
      visualRepresentation: `Kompozisyonun anatomik kavislerini belirleyen, gözü yormayan açık ve akıcı dairesel hatlar.`
    },
    {
      symbolName: `Ebced & Numeroloji Mikro Mühürleri (Kişisel Ebced Toplamı: ${ebcedData.totalEbced})`,
      category: 'Kişiye Özel Ruhsal ve Soy Mührü',
      meaning: `Adınızın (${ebcedData.personEbced}) ve annenizin adının (${ebcedData.motherEbced}) kadim Ebced toplamı olan ${ebcedData.totalEbced} sayısı ile Yaşam Yolu ${lifePath} sayınızın sembolik karşılığı.`,
      reason: `Sizi dünya üzerindeki insanlardan ayıran özgün kimlik ve kök aidiyeti verinizi tasarımın merkezine bağlamak için entegre edildi.`,
      benefitsAndHealing: `Köklerinizden gelen görünmez bağları sembolik olarak temsil eder; kişisel niyet çalışmasında köklenme ve aidiyet hissini desteklemek üzere kullanılır.`,
      visualRepresentation: `İlk bakışta fark edilmeyen, ancak çok yakından bakıldığında görülen mikro dotwork noktaları ve gizli geometrik çentikler.`
    },
    {
      symbolName: 'Açık Negatif Cilt Alanı (%45–50)',
      category: 'Kutsal Nefes & Cilt Sağlığı',
      meaning: `Zen felsefesindeki "Mu" (Kutsal Boşluk); varlığın doğduğu ve nefes aldığı alan.`,
      reason: `Dövmenin cildi boğmaması, pigment yayılmasını önlemesi ve en az 10 yıl sonra bile ilk günkü gibi berrak kalması için mimariye dahil edildi.`,
      benefitsAndHealing: `Yaşamınızda sadelik ve ferahlık temasını sembolik olarak hatırlatır; zihinsel durulma anlarında derin bir nefes alıp sakinleşme niyetini destekler.`,
      visualRepresentation: `Tasarımın içinde derin siyahların arasından bir ışık gibi parlayan saf cildiniz.`
    }
  ] : [
    {
      symbolName: `Ana Kutsal Sembol: ${actualMainSymbol}`,
      category: 'Ana Odak Sembolü (%65 Görsel Ağırlık)',
      meaning: `Kutsal odak, nizam, koruma ve kozmik iradenin doğrudan görsel izdüşümü.`,
      reason: `Doğum haritanızdaki Güneş ${astrology.sunSign} ve Yaşam Yolu ${lifePath} (${numerology.lifePathTitle}) verilerinizin sembolik yansıması olarak seçildi. Hayatınızda ${coreCharacterTheme} temasını temsil eder.`,
      benefitsAndHealing: `Zihinsel karmaşa ve stres anlarında merkezlenme hissini çağrıştırır; içsel netlik ve kararlılık niyetini desteklemek üzere kullanılır.`,
      visualRepresentation: `Tasarımın tam kalbinde, en keskin 03RL/05RL konturlar ve zengin grey wash gölgeleriyle anıtsal bir duruşla konumlandırılmıştır.`
    },
    {
      symbolName: `Çakra Şifa Geometrisi (${section5ChakraBlockages[0].geometricEquivalent})`,
      category: `${section5ChakraBlockages[0].chakraNumber}. ${section5ChakraBlockages[0].chakraName} Dengeleyici Geometrisi`,
      meaning: `${section5ChakraBlockages[0].coreTheme} temasını temsil eden kadim evrensel form.`,
      reason: `Haritanızda sembolik olarak ${section5ChakraBlockages[0].symbolicBlockageMeaning} temasını dengelemek amacıyla yerleştirildi.`,
      benefitsAndHealing: `${section5ChakraBlockages[0].behavioralManifestation} halini sembolik olarak dönüştürür; ${section5ChakraBlockages[0].healingTransformationSymbol} formuyla tasarım içinde güven ve teslimiyet duygusunu çağrıştırır.`,
      visualRepresentation: `Ana sembolün arkasında 03RL kılcal tek iğneyle hassas biçimde işlenmiş, nefes alan narin mandala çizgileri.`
    },
    {
      symbolName: `Şifa & Dönüşüm Mührü (${section5ChakraBlockages[0].healingTransformationSymbol})`,
      category: 'Enerjetik Dengeleme Mührü',
      meaning: `Direnç noktalarını yumuşatarak uyuma açan arketipik form.`,
      reason: `Enneagram ${enneagram.wing} profilinizdeki bastırılmış ihtiyaçların (${suppressedAspect}) sembolik olarak dengelenmesi için eklendi.`,
      benefitsAndHealing: `İçsel çatışmaları yumuşatma niyetini destekler; öz-şefkati güçlendiren sembolik bir hatırlatıcıdır.`,
      visualRepresentation: `Ana sembolün alt ekseninde, yukarıya doğru yükselen zarif linework çizgileriyle bütünleşmiştir.`
    },
    {
      symbolName: `Organik Şifa Florası (${symbolism.plantFlora || 'Zeytin Dalı & Sarmaşık'})`,
      category: 'Organik Yaşam & Esneklik',
      meaning: `Yenileyici doğa döngüsü ve esneklik.`,
      reason: `Astrolojik ${astrology.dominantElement} elementinizi yumuşatmak ve tasarıma canlı, organik bir nabız kazandırmak için eklendi.`,
      benefitsAndHealing: `Zorlu hayat deneyimlerinin ardından tazelenme arzusunu ve esneklik temasını sembolik olarak destekler.`,
      visualRepresentation: `Ana figür ile geometrik zemin arasında akıcı bir şekilde dolanan narin yaprak ve çiçek filizleri.`
    },
    {
      symbolName: 'Kutsal Geometri & Fibonacci Altın Sarmalı',
      category: 'Kozmik İlahi Düzen Matrisi',
      meaning: `Evrenin yaratılışındaki ilahi oran (1:1.618); kaostan doğan mükemmel kozmik ahenk.`,
      reason: `Zihninizdeki karmaşayı evrenin matematiksel kusursuzluğuna bağlamak için seçildi.`,
      benefitsAndHealing: `Zamanlama güvenini ve akışa teslimiyet duygusunu sembolik olarak çağrıştırır.`,
      visualRepresentation: `Kompozisyonun anatomik kavislerini belirleyen, gözü yormayan açık ve akıcı dairesel hatlar.`
    },
    {
      symbolName: `Ebced & Numeroloji Mikro Mühürleri (Kişisel Ebced Toplamı: ${ebcedData.totalEbced})`,
      category: 'Kişiye Özel Ruhsal ve Soy Mührü',
      meaning: `Adınızın (${ebcedData.personEbced}) ve annenizin adının (${ebcedData.motherEbced}) kadim Ebced toplamı olan ${ebcedData.totalEbced} sayısı ile Yaşam Yolu ${lifePath} sayınızın sembolik karşılığı.`,
      reason: `Sizi dünya üzerindeki insanlardan ayıran özgün kimlik ve kök aidiyeti verinizi tasarımın merkezine bağlamak için entegre edildi.`,
      benefitsAndHealing: `Köklerinizden gelen görünmez bağları sembolik olarak temsil eder; kişisel niyet çalışmasında köklenme ve aidiyet hissini desteklemek üzere kullanılır.`,
      visualRepresentation: `İlk bakışta fark edilmeyen, ancak çok yakından bakıldığında görülen mikro dotwork noktaları ve gizli geometrik çentikler.`
    },
    {
      symbolName: 'Açık Negatif Cilt Alanı (%45–50)',
      category: 'Kutsal Nefes & Cilt Sağlığı',
      meaning: `Zen felsefesindeki "Mu" (Kutsal Boşluk); varlığın doğduğu ve nefes aldığı alan.`,
      reason: `Dövmenin cildi boğmaması, pigment yayılmasını önlemesi ve en az 10 yıl sonra bile ilk günkü gibi berrak kalması için mimariye dahil edildi.`,
      benefitsAndHealing: `Yaşamınızda gereksiz şeyleri bırakma (detoks) bilincini güçlendirir. Zihinsel aşırı yüklenmelerde derin bir nefes alıp "boşluğa izin verme" bilgeliğini hatırlatır.`,
      visualRepresentation: `Tasarımın içinde derin siyahların arasından bir ışık gibi parlayan saf cildiniz.`
    }
  ];

  const clientTotemNotice = includeTotem 
    ? `• Ruhani Totem Hayvanınız: ${primaryTotemName} (Gölge Totemi: ${section4TotemAnimals[1]?.name || shadowGuardianTotem}) dövmenizin merkezine ana güç figürü olarak işlenmiştir.`
    : `• Ruhani Totem Hayvanı Bilgisi: Kişisel doğum verilerinizden hesaplanan ruhani totem hayvanınız: ${primaryTotemName} (Gölge Totemi: ${section4TotemAnimals[1]?.name || shadowGuardianTotem}). Tercihiniz doğrultusunda bu totem dövme görseline doğrudan çizilmemiş; yalnızca içsel/ruhani bir rehber ve arketipik pusula olarak analitik dosyanızda tutulmuştur. Dövmeniz, bu rehberliğin özünü ${actualMainSymbol} ve kutsal geometri formlarıyla taşımaktadır.`;

  const clientMorseNotice = parameters.useMorseCodeForNumbers
    ? (() => {
        const rawToEncode = parameters.customMorseInput?.trim() ||
          person.personalNumbers?.trim() ||
          (person.birthDate ? person.birthDate.split('-').reverse().join('.') : '') ||
          `${numerology.lifePathNumber}`;
        const morseEnc = encodeToMorse(rawToEncode);
        return `• Mors Alfabesi Şifrelemesi: AKTİF — Seçilen Değer: "${morseEnc.rawInput}" | Görsel Çizim: ${morseEnc.morseDisplay} | Dövmede 03RL micro-dotwork ve 1.5mm fine-line çubuklar olarak geometriye gizlenmiştir.`;
      })()
    : `• Mors Alfabesi Tercihi: Tercihiniz doğrultusunda rakamlar Mors koduna dönüştürülmemiş; tasarımda doğrudan saf kutsal geometri ve kadim semboller kullanılmıştır.`;

  // Müşteriye Gönderilecek Ek Dosyalar / Parçalar Metni
  const attachmentsText = `
═══════════════════════════════════════════════════════
📁 EK DOSYA 1: DÖVME BİLEŞEN PARÇALARI & KATMAN REHBERİ (PARTS BREAKDOWN)
═══════════════════════════════════════════════════════
Bu bölüm, dövme sanatçınızın tasarımı cildinize aktarırken kullanacağı katman ve parça hiyerarşisini gösterir:

1. PARÇA A — ANA ODAK FİGÜRÜ (%60–70 Görsel Ağırlık):
   • Figür: ${actualMainSymbol}
   • Konum: Tasarımın tam ağırlık ve çekim merkezi.
   • Çizim Dili: 05RL ana konturlar, 3/4 anatomik açı, derin black & grey wash gölgelendirmeleri.

2. PARÇA B — ORGANİK & GEOMETRİK AKIŞ PARÇALARI (%20–30 Görsel Ağırlık):
   • Figürler: ${symbolism.plantFlora} ve ${section5ChakraBlockages[0].geometricEquivalent}
   • Konum: Ana figürün etrafını saran anatomik kas kavisleri ve arka plan matrisi.
   • Çizim Dili: Yumuşak whip shading geçişleri, organik eğriler.

3. PARÇA C — EZOTERİK MİKRO PARÇALAR (%5–10 Görsel Ağırlık):
   • Figürler: ${numerology.divineHelp19?.has19 ? '19 İlahi Yardım Düğümleri, ' : ''}Fibonacci Altın Sarmalı, Takımyıldız Düğümleri${parameters.useMorseCodeForNumbers ? ', Mors Alfabesi Mikro Çizgileri' : ''}
   • Konum: Dış geometri çemberi ve figürün kuyruk/omurga hattı.
   • Çizim Dili: 03RL tek iğne mikro-dotwork stippling (0.25mm).

═══════════════════════════════════════════════════════
📁 EK DOSYA 2: STÜDYO UYGULAMA, İĞNE & ZANAAT KILAVUZU (STUDIO CRAFT SPECIFICATION)
═══════════════════════════════════════════════════════
• Hedef Vücut Bölgesi & Akış: ${parameters.bodyPlacement} (${parameters.orientation})
• Seçilen Dövme Stilleri: ${parameters.selectedStyles.join(' + ')}
• Tavsiye Edilen İğne Konfigürasyonu:
  - 03RL (0.25mm Long Taper): Mikro detaylar, kutsal geometri ve takımyıldız noktaları
  - 05RL: Ana figürün taşıyıcı dış sınır çizgileri
  - 07M1 Curved Magnum (İsteğe bağlı): Yumuşak ton geçişleri (Grey Wash)
• Negatif Alan Güvenliği: %40–50 açık ten boşluğu (Çizgiler arasında min 1.5–2 mm mesafe bırakılarak 10 yıllık pigment birleşmesi [blowout] önlenmiştir).
• Önerilen Dövme Boyutu: Minimum 16 x 10 cm | İdeal: 22 x 14 cm

═══════════════════════════════════════════════════════
📁 EK DOSYA 3: BÜTÜNCÜL ENERJETİK VE MEDİKAL BAKIM REHBERİ
═══════════════════════════════════════════════════════
1. Seans Öncesi Hazırlık:
   • Seans öncesi bol su için, uykunuzu iyi alın ve tok karnına gelin.
   • Cildinizi dövme öncesinde yoğun kimyasallardan ve güneş yanığından koruyun.

2. Medikal İyileşme (İlk 14 Gün):
   • İlk 2-3 saat streç filmi çıkarmayın; ardından ılık su ve antibakteriyel sabunla nazikçe yıkayıp kurulayın.
   • Sanatçınızın önerdiği ince tabaka iyileştirici kremi günde 2-3 kez uygulayın.
   • Kabukları kesinlikle soymayın; doğrudan güneş, havuz ve saunadan 2 hafta uzak durun.

3. Dövmenin Enerjisiyle Günlük Bağ Kurma Ritüeli:
   • Merkezlenme: Kendinizi stresli veya yönsüz hissettiğinizde elinizi dövmenizin üzerine hafifçe koyup 3 derin diyafram nefesi alın.
   • Arketip Aynası: Dövmenizdeki ${actualMainSymbol} odağına bakarak "${tattooTransformationMessage}" niyetini kendinize hatırlatın.
  `.trim();

  const consultationSummaryText = `
═══════════════════════════════════════════════════════
🔮 GÖRÜŞME & KONSÜLTASYON ENERJİ HARİTASI
═══════════════════════════════════════════════════════
• Danışan: ${person.name}
• Doğum Verileri: ${person.birthDate} ${person.birthTime ? `(${person.birthTime})` : ''} — ${person.birthPlace || 'Belirtilmedi'}
• Astrolojik Harita: Güneş ${astrology.sunSign} ${astrology.sunDegreeFormatted ? `(${astrology.sunDegreeFormatted})` : ''} | Ay ${astrology.moonSign} ${astrology.moonDegreeFormatted ? `(${astrology.moonDegreeFormatted})` : ''} | Yükselen ${astrology.ascendantSign} | Element: ${astrology.dominantElement}
• Numeroloji Pisagor Matrisi: Yaşam Yolu ${lifePath} (${numerology.lifePathTitle || ''}) | İfade ${numerology.destinyNumber} | Dünya Misyonu (DM) ${numerology.dmNumber || ''} | ${numerology.divineHelp19?.has19 ? '19 İlahi Mühür Aktif' : 'Dengeli Matris'}
• Ebced & Yıldızname Frekansı: Toplam Ebced: ${ebcedData.totalEbced} | Burç: ${ebcedData.yildiznameBurcName} (${ebcedData.yildiznameElement})

───────────────────────────────────────────────────────
🌿 7+2 ÇAKRA ANALİZİ & ENERJETİK DENGE DURUMU
───────────────────────────────────────────────────────
• Genel Çakra Denge Skoru: ${chakra.overallChakraBalanceScore} / 100
• Blokajlı / Şifa Bekleyen Merkezler: 
${section5ChakraBlockages.map(c => `  - ${c.chakraNumber}. ${c.chakraName}: ${c.coreTheme} (Şifa Yantrası: ${c.geometricEquivalent})`).join('\n')}
• Günlük Kozmik Denge Tavsiyesi: ${chakra.primaryHealingDirective}
• Çakra Olumlaması: "${chakra.primaryChakraAffirmation}"

───────────────────────────────────────────────────────
🌑 GÖLGE ARKETİPİ & BİLİNÇDIŞI YÜZLEŞME RAPORU
───────────────────────────────────────────────────────
• Enneagram Kişilik Tipi & Kanat: Tip ${enneagram.typeName} (${enneagram.wing})
• Temel Yaşam Motivasyonu: ${enneagram.coreMotivation}
• Temel Bilinçdışı Korku: ${enneagram.coreFear}
• Bastırılmış Yön & Kriz Refleksi: ${shadowAspect}
• Savunma Kalkanı & Maske: ${shadowFigure}
• Gölgenin Işığa Dönüşüm Simyası: ${coreTransformationTheme}
• Dövmenizin Taşıdığı Derin Dönüşüm Mesajı: "${tattooTransformationMessage}"

───────────────────────────────────────────────────────
🦅 RUHANİ TOTEM HAYVANI & REHBERLİK HİYERARŞİSİ
───────────────────────────────────────────────────────
• 1. Birincil Ruh Totemi: ${primaryTotemName} (${section4TotemAnimals[0]?.mainTotemSymbolism || ''})
• 2. Gölge & Muhafız Totemi: ${section4TotemAnimals[1]?.name || shadowGuardianTotem} (${section4TotemAnimals[1]?.mainTotemSymbolism || ''})
• 3. Yükseliş Müttefiki: ${section4TotemAnimals[2]?.name || ascensionTotem} (${section4TotemAnimals[2]?.mainTotemSymbolism || ''})
${clientTotemNotice}
${clientMorseNotice}
  `.trim();

  const fullClientLetterText = `
═══════════════════════════════════════════════════════
🔮 KİŞİYE ÖZEL DÖVME KONSÜLTASYON DOSYASI & ŞİFA REHBERİ
═══════════════════════════════════════════════════════
DANIŞAN: ${person.name || 'Danışan'}
TASARIM: ${includeTotem ? `${primaryTotemName} & ${section4TotemAnimals[1]?.name || shadowGuardianTotem}` : `${actualMainSymbol} & ${symbolism.geometricSymbol}`} — Ezoterik Simya
TARİH: ${new Date().toLocaleDateString('tr-TR')}
═══════════════════════════════════════════════════════

Sevgili ${person.name},

Sizinle gerçekleştirdiğimiz ezoterik konsültasyon ve analiz görüşmesi doğrultusunda hazırlanan bu özel dosya; yalnızca estetik bir dövme reçetesi değil, doğum haritanızdan Pisagor numerolojinize, çakra blokajlarınızdan bilinçdışınızdaki en derin gölge arketipinize kadar size ait ruhsal haritanın cildinize aktarılmış kutsal bir şifa tılsımıdır.

Bu tasarımda yer alan her bir figür, geometrik hat ve mikro detay; ruhsal yolculuğunuzdaki kilit bir düğümü çözmek, bastırılmış gücünüzü uyandırmak ve sizi en dengeli halinize taşımak üzere seçilmiştir. Hiçbir çizgi tesadüfi ya da sadece dekoratif değildir.

${consultationSummaryText}

═══════════════════════════════════════════════════════
✨ DÖVMENİZDEKİ KUTSAL SEMBOLLER VE ANLAMLARI
═══════════════════════════════════════════════════════
Aşağıda bu dövmenin teninizde taşıyacağı her bir sembolün derin anlamını, sizin verilerinizden hangi nedenle doğduğunu ve yaşamınızda neye iyi geleceğini bulabilirsiniz:

${clientSymbols.map((s, idx) => `───────────────────────────────────────────────────────
${idx + 1}. ${s.symbolName}
• Kategori: ${s.category}
• Sembolün Anlamı: ${s.meaning}
• Neden Seçildi (Veri Kaynağı): ${s.reason}
• Neye İyi Gelecek (Ruhsal & Psikolojik Şifası): ${s.benefitsAndHealing}
• Dövmedeki Yeri & Duruşu: ${s.visualRepresentation}`).join('\n\n')}

═══════════════════════════════════════════════════════
✨ BU DÖVMENİN SİZE TAŞIDIĞI BÜTÜNCÜL DÖNÜŞÜM MESAJI
═══════════════════════════════════════════════════════
"${tattooTransformationMessage}"

═══════════════════════════════════════════════════════
🧘 GÜNLÜK YAŞAMDA BU DÖVMENİN ENERJİSİYLE BAĞ KURMA REHBERİ
═══════════════════════════════════════════════════════
1. Merkezlenme Pratiği: Kendinizi stresli, yorgun ya da yönsüz hissettiğinizde elinizi dövmenizin üzerine hafifçe koyun, gözlerinizi kapatın ve 3 derin diyafram nefesi alın.
2. Odak Noktasının Aynası: Aynada dövmenizdeki ${includeTotem ? primaryTotemName : actualMainSymbol} odağına bakın; içinizden "Gücüm dengede, köklerim sağlam ve gölgem ışığıma hizmet ediyor" niyetini geçirin.
3. Boşluğun Ferahlığı: Kutsal geometri çizgilerinin arasındaki açık teninize odaklanın; hayatın tüm karmaşasında sizin için her zaman sakin, berrak ve dokunulmaz bir kutsal alan olduğunu hatırlayın.

${attachmentsText}

═══════════════════════════════════════════════════════
Bu dövme, yaşam boyu bedeninizde taşıyacağınız kişisel bir güç ve şifa mührüdür. Yolunuzu aydınlatmasını dileriz.
═══════════════════════════════════════════════════════
  `.trim();

  const sectionClientExplanation: ClientExplanationSection = {
    clientName: person.name,
    greetingAndIntro: `Sevgili ${person.name}, sizin için hazırlanan bu özel dövme kompozisyonu, yalnızca estetik bir çizim değil; doğum haritanızdan numerolojik yaşam yolunuza, çakra enerjilerinizden bilinçdışınızdaki en derin gölge arketipinize kadar size ait ruhsal haritanın cildinize aktarılmış kutsal bir şifa tılsımıdır.`,
    holisticTalismanTheme: tattooTransformationMessage,
    symbols: clientSymbols,
    dailyAffirmationAndIntegration: `1. Merkezlenme: Dövmenizin üzerine elinizi koyarak 3 derin diyafram nefesi alın.\n2. Bakış Aynası: ${includeTotem ? primaryTotemName : actualMainSymbol} odağına odaklanarak 'Gücüm dengede, köklerim sağlam' niyetini tekrarlayın.\n3. Kutsal Boşluk: Cildinizin nefes aldığı negatif alanla zihninizin ferahlığını senkronize edin.`,
    fullClientLetterText,
    consultationSummaryText,
    attachmentsText
  };

  // Full 12-Section Markdown Dossier
  const fullMarkdownDossier = `
# KİŞİYE ÖZEL GÖLGE ARKETİP + ÇAKRA + TOTEM DÖVME ANALİZİ & PROMPT SİSTEMİ
=====================================================
DANIŞAN: ${person.name || 'Danışan'}
ANALİZ TARİHİ: ${new Date().toLocaleDateString('tr-TR')}
TASARIM BAŞLIĞI: ${includeTotem ? `${primaryTotemName} & ${section4TotemAnimals[1]?.name || shadowGuardianTotem}` : `${actualMainSymbol} & ${symbolism.geometricSymbol || 'Kutsal Geometri'}`} - Ezoterik Simya ve Gölge Dönüşümü
=====================================================

## 1. DANIŞAN VERİLERİ & EZOTERİK ÖZET
• **Ad Soyad:** ${person.name || 'Danışan'}
• **Doğum Tarihi:** ${person.birthDate}
• **Doğum Saati:** ${person.birthTime || 'Belirtilmedi (Güneş öğle vakti referans alındı)'}
• **Doğum Yeri:** ${person.birthPlace || 'Belirtilmedi'}
• **Anne Adı:** ${person.motherName || 'Belirtilmedi (Ebced altın oranla dengelendi)'}
• **Numerolojik Bulgular:** Yaşam Yolu ${lifePath} (${numerology.lifePathTitle || ''}), Ana Kulvar/İfade ${numerology.destinyNumber} (${numerology.destinyTitle || ''}), Kalp Arzusu ${numerology.soulUrgeNumber}, DM ${numerology.dmNumber || ''} (${numerology.dmTitle || ''}), Karmik Eksik Sayılar: [${numerology.missingNumbers?.join(', ') || 'Yok'}]
• **Astrolojik Bulgular:** Güneş ${astrology.sunSign} ${astrology.sunDegreeFormatted ? `(${astrology.sunDegreeFormatted})` : ''}, Ay ${astrology.moonSign} ${astrology.moonDegreeFormatted ? `(${astrology.moonDegreeFormatted})` : ''}${astrology.isMoonNearCusp ? ' [29° Cusp]' : ''}, Yükselen ${astrology.ascendantSign} ${astrology.ascendantDegreeFormatted ? `(${astrology.ascendantDegreeFormatted})` : ''}, Hakim Element: ${astrology.dominantElement}
• **Ebced Bulguları:** Kişi İsmi: ${ebcedData.personEbced} | Anne Adı: ${ebcedData.motherEbced} | Toplam Ebced: ${ebcedData.totalEbced} | Tılsımi Sayı: ${ebcedData.talismanicNumber}
• **Yıldızname Bulguları:** Burç: ${ebcedData.yildiznameBurcName} | Unsur: ${ebcedData.yildiznameElement} | Gezegen Rehberi: ${ebcedData.planetGuide} (${ebcedData.esotericQuality})
• **Mevcut Totem Hayvanları:** ${person.existingTotems || (includeTotem ? primaryTotemName + ', ' + (section4TotemAnimals[1]?.name || shadowGuardianTotem) : 'Tasarıma dahil edilmedi (Danışan tercihi: Yalnızca ruhani analiz)')}
• **Mevcut Semboller:** ${person.existingSymbols || symbolism.plantFlora + ', ' + section5ChakraBlockages[0].geometricEquivalent}
• **Kişisel Olarak Önemli Sayılar:** ${person.personalNumbers || `${lifePath}, ${numerology.destinyNumber}${numerology.divineHelp19?.has19 ? ', 19' : ''}`}
• **Kişisel Hikâye / Temalar:** ${person.personalStory || 'Ruhsal uyanış, sınırlarını koruma ve gölge yönleri ışığa dönüştürme arayışı.'}

---

## 2. TEMEL PSİKO-SEMBOLİK ANALİZ
• **Temel Karakter Teması:** ${coreCharacterTheme}
• **Tekrarlayan Yaşam Teması:** ${recurringLifeTheme}
• **Bastırılmış Yön:** ${suppressedAspect}
• **Gölge Yön:** ${shadowAspect}
• **Dönüştürülmesi Gereken Temel Tema:** ${coreTransformationTheme}
• **Güçlü Fakat Dengesizleştiğinde Gölgeye Dönüşen Özellik:** ${unbalancedStrength}
• **Kişinin Kendisinde Görmek İstemediği / Yüzleşmekte Zorlandığı Sembolik Tema:** ${unconfrontedSymbolicTheme}
• **Dövmenin Taşıması Gereken Ana Dönüşüm Mesajı:** "${tattooTransformationMessage}"

---

## 3. ENNEAGRAM GÖLGE ARKETİPİ
• **Enneagram Tipi:** Tip ${enneagram.typeName} (${enneagram.wing})
• **Temel Motivasyon:** ${enneagram.coreMotivation}
• **Temel Korku:** ${enneagram.coreFear}
• **Savunma Mekanizması:** ${shadowFigure}
• **Stres Altında Ortaya Çıkan Gölge Davranış:** ${enneagram.stressPoint ? `Tip ${enneagram.stressPoint} yönüne gerileyerek: ` : ''}${shadowAspect}
• **Bastırılan İhtiyaç:** ${suppressedAspect}
• **Kontrol Edilmeye Çalışılan Alan:** ${recurringLifeTheme}
• **Gölgenin En Belirgin Arketipsel İfadesi:** ${shadowFigure}
• **Gölgenin Dengelenmiş / Dönüştürülmüş Hali:** ${coreTransformationTheme}

### ENNEAGRAM GÖLGESİNİN GÖRSEL KARŞILIĞI
• **Gölgeyi Temsil Edecek Figür:** ${shadowFigure}
• **Figürün Yüz İfadesi / Bakışı:** ${shadowGaze}
• **Vücut veya Hareket Dili:** ${shadowBodyLanguage}
• **Pozisyonu:** ${shadowPosition}
• **Geometrik Karşılığı:** ${shadowGeometric}
• **Organik Sembol Karşılığı:** ${shadowOrganic}
• **Kompozisyondaki Konumu:** ${shadowLocation}
• **Ana Sembolle İlişkisi:** ${shadowRelation}
• **Gölgenin Psikolojik Olarak Gösterilişi:** ${shadowPortrayal}

---

## 4. TOTEM HAYVANI ANALİZİ (GÜÇ + GÖLGE)
${section4TotemAnimals.map((t, idx) => `
### ${idx + 1}. ${t.role}: ${t.name}
• **Ana Totem Sembolizmi:** ${t.mainTotemSymbolism}
• **Güçlü Tarafı:** ${t.strongSide}
• **Koruyucu Tarafı:** ${t.protectiveSide}
• **İçgüdüsel Tarafı:** ${t.instinctiveSide}
• **GÖLGE TARAFI:** ${t.shadowSide}
• **Dengesiz Hale Geldiğinde Temsil Ettiği Davranış:** ${t.unbalancedBehavior}
• **Bastırılmış / Kontrolsüz Yönü:** ${t.suppressedUncontrolledTrait}
• **${includeTotem ? 'Dövmede Kullanılacak Fiziksel Özellik' : 'Arketipik Fiziksel Özellik'}:** ${t.tattooPhysicalFeature}${includeTotem ? '' : ' (Not: Danışan tercihiyle dövme çizimine dahil edilmemiştir)'}
• **Bakış Yönü:** ${t.gazeDirection}
• **Baş Açısı:** ${t.headAngle}
• **Karakteristik Hareket Dili:** ${t.movementDetail}
• **Duruşu:** ${t.posture}
• **Kompozisyondaki Görevi:** ${includeTotem ? t.compositionRole : 'Yalnızca içsel/ruhani rehberlik (Dövme görseline doğrudan çizilmeyecektir)'}
`).join('')}

---

## 5. ÇAKRA BLOKAJLARI & ORGANİK ENTEGRASYON
${section5ChakraBlockages.map((c, idx) => `
### ${idx + 1}. Blokaj: ${c.chakraNumber}. ${c.chakraName}
• **Temel Teması:** ${c.coreTheme}
• **Blokajın Sembolik Anlamı:** ${c.symbolicBlockageMeaning}
• **Davranışsal Yansıması:** ${c.behavioralManifestation}
• **Dövmede Kullanılacak Geometrik Karşılık:** ${c.geometricEquivalent}
• **Dövmede Kullanılacak Doğal Sembol:** ${c.naturalSymbol}
• **Hayvan / Figür Bağlantısı:** ${c.animalFigureConnection}
• **Renk Karşılığı:** ${c.colorEquivalent} | **Siyah-Beyaz Karşılığı:** ${c.monochromeEquivalent}
• **Tasarımın Hangi Bölümünde Yer Alacağı:** ${c.designPlacementSection}
• **Şifa / Dönüşüm Sembolü:** ${c.healingTransformationSymbol}
`).join('')}

---

## 6. GÖLGE + ÇAKRA + TOTEM KESİŞİMİ
• **Enneagram Gölgesi ile Kesişen Çakra Blokajı:** ${enneagramShadowChakraIntersection}
• **Totem Hayvanının Gölgesi ile Kesişen Çakra Teması:** ${totemShadowChakraIntersection}
• **Tekrar Eden Ortak Kök Tema:** ${recurringSharedTheme}
• **En Güçlü Gölge Motifi:** ${strongestShadowMotif}
• **En Güçlü Dönüşüm Motifi:** ${strongestTransformationMotif}
• **Birbirini Destekleyen Semboller:** 
${supportingSymbols.map(s => `  - ${s}`).join('\n')}
• **Elenen Gereksiz Semboller:** 
${eliminatedRedundantSymbols.map(s => `  - ${s}`).join('\n')}

---

## 7. SEMBOLİK GÖRSEL SÖZLÜK TABLOSU
| SEMBOL | KAYNAK | ANLAM | GÖLGE / DÖNÜŞÜM | GÖRSEL GÖREVİ |
| :--- | :--- | :--- | :--- | :--- |
${section7VisualDictionary.map(row => `| **${row.symbol}** | ${row.source} | ${row.meaning} | ${row.shadowOrTransformation} | ${row.visualRole} |`).join('\n')}

---

## 8. ANA DÖVME KONSEPTİ & HİYERARŞİSİ
• **Ana Sembol:** ${section8MainConcept.mainSymbol}
• **İkincil Semboller:** ${section8MainConcept.secondarySymbols.join(', ')}
• **Gölge Sembolü:** ${section8MainConcept.shadowSymbol}
• **Totem Hayvanı:** ${section8MainConcept.totemAnimal}
• **Çakra Sembolleri:** ${section8MainConcept.chakraSymbols.join(', ')}
• **Gizli Ezoterik Detaylar:** ${section8MainConcept.hiddenEsotericDetails.join(', ')}
• **Geometrik Altyapı:** ${section8MainConcept.geometricInfrastructure}
• **Kompozisyon Yönü:** ${section8MainConcept.compositionDirection}
• **Görsel Ağırlık Dağılımı:**
  * Ana Odak: ${section8MainConcept.visualHierarchy.primaryFocusPercent}
  * Yardımcı Semboller: ${section8MainConcept.visualHierarchy.secondaryPercent}
  * Ezoterik Mikro Detaylar: ${section8MainConcept.visualHierarchy.microDetailsPercent}
• **Negatif Alan Kullanımı:** ${section8MainConcept.negativeSpaceUsage}
• **Ana Odak Noktası:** ${section8MainConcept.focalPoint}
• **Gözün Tasarım İçinde İzleyeceği Yol:** ${section8MainConcept.eyeMovementPath}

---

## 9. DÖVME KOMPOZİSYON MİMARİSİ
• **Eksen Yönelimi:** ${section9CompositionArchitecture.axisOrientation}
• **Simetri:** ${section9CompositionArchitecture.symmetryType}
• **Denge Türü:** ${section9CompositionArchitecture.balanceType}
• **Ana Figürün Yönü:** ${section9CompositionArchitecture.mainFigureDirection}
• **Yardımcı Figürlerin Konumu:** ${section9CompositionArchitecture.secondaryFiguresPlacement}
• **Negatif Alanların Konumu:** ${section9CompositionArchitecture.negativeSpaceLocations}
• **Geometrik Yapı:** ${section9CompositionArchitecture.geometricFramework}
• **Üst Bölüm:** ${section9CompositionArchitecture.topSection}
• **Merkez Bölüm:** ${section9CompositionArchitecture.centerSection}
• **Alt Bölüm:** ${section9CompositionArchitecture.bottomSection}
• **Mikro Detayların Yerleşimi:** ${section9CompositionArchitecture.microDetailsPlacement}

---

## 10. EZOTERİK MİKRO DETAYLAR
${section10EsotericMicroDetails.map((m, idx) => `
### ${idx + 1}. ${m.name} (${m.type})
• **Görsel Detay:** ${m.detail}
• **Ezoterik & Matematiksel Gerekçe:** ${m.rationale}
`).join('')}

---

## 11. DÖVME SANATÇISI TEKNİK UYGULAMA BRİFİ
\`\`\`
${section11TattooArtistBrief}
\`\`\`

---

## 12. MIDJOURNEY v6.1 / NIJI 6 MASTER PROMPT & AI SUITE

### A. Midjourney v6.1 / Niji 6 Master Prompt:
\`\`\`
${midjourneyMasterPrompt}
\`\`\`

### B. DALL-E 3 Master Tattoo Flash Plate Prompt:
\`\`\`
${dalle3Prompt}
\`\`\`

### C. Flux.1 Pro / Stable Diffusion XL Prompt:
\`\`\`
${fluxPrompt}
\`\`\`

### D. 03RL Thermal Stencil Transfer Line Art:
\`\`\`
${stencilPrompt}
\`\`\`

### Anti-Slop & Anti-Mockup Negatif Prompt:
\`\`\`
${negativePrompt}
\`\`\`

---

## 13. MÜŞTERİYE GÖNDERİLECEK SEMBOL VE ŞİFA AÇIKLAMA REHBERİ (CLIENT DOSSIER)
\`\`\`
${fullClientLetterText}
\`\`\`
  `.trim();

  return {
    section1ClientData: {
      personName: person.name,
      birthDate: person.birthDate,
      birthTime: person.birthTime || '12:00',
      birthPlace: person.birthPlace || 'Belirtilmedi',
      motherName: person.motherName || 'Belirtilmedi',
      numerologySummary: `Yaşam Yolu: ${lifePath} (${numerology.lifePathTitle}), İfade: ${numerology.destinyNumber}`,
      astrologySummary: `Güneş ${sunSign}, Ay ${astrology.moonSign}, Yükselen ${astrology.ascendantSign}`,
      ebcedSummary: `İsim Ebced: ${ebcedData.personEbced}, Toplam: ${ebcedData.totalEbced}, Tılsım: ${ebcedData.talismanicNumber}`,
      yildiznameSummary: `${ebcedData.yildiznameBurcName} - ${ebcedData.yildiznameElement} (${ebcedData.planetGuide})`,
      existingTotems: person.existingTotems || (includeTotem ? primaryTotemName : 'Yalnızca ruhani analizde (Tasarıma dahil edilmedi)'),
      existingSymbols: person.existingSymbols || symbolism.plantFlora,
      personalNumbers: person.personalNumbers || `${lifePath}, ${numerology.destinyNumber}${numerology.divineHelp19?.has19 ? ', 19' : ''}`,
      personalStory: person.personalStory || 'Gölge dönüşümü ve ruhani güç arayışı'
    },
    section2PsychoSymbolic: {
      coreCharacterTheme,
      recurringLifeTheme,
      suppressedAspect,
      shadowAspect,
      coreTransformationTheme,
      unbalancedStrength,
      unconfrontedSymbolicTheme,
      tattooTransformationMessage
    },
    section3EnneagramShadow: {
      type: enneaType,
      wing: enneagram.wing,
      typeName: enneagram.typeName,
      coreMotivation: enneagram.coreMotivation,
      coreFear: enneagram.coreFear,
      defenseMechanism: shadowFigure,
      stressShadowBehavior: shadowAspect,
      suppressedNeed: suppressedAspect,
      controlledArea: recurringLifeTheme,
      shadowArchetypalExpression: shadowFigure,
      balancedTransformedState: coreTransformationTheme,
      visualTranslation: {
        figure: shadowFigure,
        facialExpressionGaze: shadowGaze,
        bodyMovementLanguage: shadowBodyLanguage,
        position: shadowPosition,
        geometricEquivalent: shadowGeometric,
        organicSymbolEquivalent: shadowOrganic,
        compositionLocation: shadowLocation,
        relationToMainSymbol: shadowRelation,
        psychologicalShadowPortrayal: shadowPortrayal
      }
    },
    section4TotemAnimals,
    section5ChakraBlockages,
    section6Intersection: {
      enneagramShadowChakraIntersection,
      totemShadowChakraIntersection,
      recurringSharedTheme,
      strongestShadowMotif,
      strongestTransformationMotif,
      supportingSymbols,
      eliminatedRedundantSymbols
    },
    section7VisualDictionary,
    section8MainConcept,
    section9CompositionArchitecture,
    section10EsotericMicroDetails,
    section11TattooArtistBrief,
    section12Prompts: {
      midjourneyMasterPrompt,
      dalle3Prompt,
      fluxPrompt,
      stencilPrompt,
      negativePrompt,
      parametersExplanation: '--ar 2:3 --v 6.1 --style raw --s 250 (Studio tattoo flash standard)'
    },
    sectionClientExplanation,
    fullMarkdownDossier
  };
}
