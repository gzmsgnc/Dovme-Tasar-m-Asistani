import { NumerologyProfile, AstrologyProfile, EnneagramProfile, SymbolismProfile, TotemAnimalDetail, NeededSymbolDetail } from '../types';
import { calculateTotemAnimal, PersonalTotemInput } from './totemCalculator';
import { validateCalendarDate } from './astrology';
import { calculateChakraProfile, ChakraProfile } from './chakra';

export function deriveSymbolismProfile(
  numerology: NumerologyProfile,
  astrology: AstrologyProfile,
  enneagram: EnneagramProfile,
  personalData?: PersonalTotemInput
): SymbolismProfile {
  const lp = numerology.lifePathNumber;
  const sun = astrology.sunSign;
  const moon = astrology.moonSign;
  const asc = astrology.ascendantSign;
  const ennea = enneagram.type;
  const chakraProfile: ChakraProfile = calculateChakraProfile(numerology, astrology);

  // 1. DETERMINISTIC PERSONAL TOTEM CALCULATION
  // Kullanıcının kişisel verilerinden (Doğum tarihi, saati, yeri, isim, element ve test yanıtları) dinamik olarak hesaplanır.
  const actualBirthDate = personalData?.birthDate || astrology.usedBirthDate;
  validateCalendarDate(actualBirthDate);

  const personalInput: PersonalTotemInput = {
    name: personalData?.name || 'Danışan',
    birthDate: actualBirthDate,
    birthTime: personalData?.birthTime,
    birthPlace: personalData?.birthPlace,
    motherName: personalData?.motherName,
    personalNumbers: personalData?.personalNumbers,
    personalStory: personalData?.personalStory,
    zodiacSystem: personalData?.zodiacSystem,
    totemAnswers: personalData?.totemAnswers,
    enneagramType: personalData?.enneagramType || ennea,
    lifePathNumber: lp,
    dominantElement: astrology.dominantElement,
    sunSign: sun
  };

  const totemCalc = calculateTotemAnimal(personalInput);

  const primaryTotemName = totemCalc.primaryTotem.name;
  const primaryTotemOrigin = totemCalc.isBehavioralTestBased
    ? `Davranışsal Totem Testi (%${totemCalc.behavioralReport?.confidenceScore || 85} Uyum) • ${totemCalc.primaryTotem.element || 'Hava'}`
    : `Doğum: ${personalInput.birthDate || ''} ${personalInput.birthTime ? '(' + personalInput.birthTime + ')' : ''} • Yer: ${personalInput.birthPlace || 'Belirtilmedi'} • Yaşam Yolu ${lp} • Güneş ${sun}`;
  const primaryTotemMeaning = totemCalc.primaryTotem.mainSymbolism || 'Kadim bilgelik ve sezgisel rehberlik';
  const primaryTotemPower = totemCalc.primaryTotem.strongSide || 'Yüksek sezgisel farkındalık';
  const primaryTotemRole = totemCalc.primaryTotem.compositionRole || 'Merkezi figür';

  const shadowTotemName = totemCalc.shadowTotem.name;
  const shadowTotemOrigin = totemCalc.isBehavioralTestBased
    ? `Davranışsal Gölge Kutbu • ${totemCalc.shadowTotem.element || 'Toprak'} • Bilinçdışı Dengeleyici Arketip`
    : `Bilinçdışı Gölge Matrisi • ${totemCalc.shadowTotem.element || 'Toprak'} • Ay ${moon} • Gölge Arketipi`;
  const shadowTotemMeaning = `${totemCalc.shadowTotem.shadowTrait || 'Gizli güç'} (Dönüşüm Şifası: ${totemCalc.shadowTotem.protectivePower || 'Koruma kalkanı'})`;
  const shadowTotemPower = totemCalc.shadowTotem.protectivePower || 'Koruyucu sessiz kudret';
  const shadowTotemRole = totemCalc.shadowTotem.compositionRole || 'Alt taban koruyucu';

  const allyTotemName = totemCalc.allyTotem.name;
  const allyTotemOrigin = totemCalc.isBehavioralTestBased
    ? `İkincil Davranışsal Müttefik • ${totemCalc.allyTotem.element || 'Hava'} • İkincil Rezonans`
    : `Ruhsal Yükseliş Müttefiki • Yükselen ${asc} • Gece/Gündüz Döngüsü`;
  const allyTotemMeaning = totemCalc.allyTotem.mainSymbolism || 'Zarafet ve sezgi';
  const allyTotemPower = totemCalc.allyTotem.strongSide || 'Işık ve netlik';
  const allyTotemRole = totemCalc.allyTotem.compositionRole || 'Üst taç tamamlayıcı';

  const secondaryAnimals = [shadowTotemName, allyTotemName];

  const totemHierarchy: TotemAnimalDetail[] = [
    {
      id: totemCalc.primaryTotem.id,
      role: 'Birincil Ruh Totemi',
      name: primaryTotemName,
      origin: primaryTotemOrigin,
      meaning: primaryTotemMeaning,
      archetypalPower: primaryTotemPower,
      visualRoleInTattoo: primaryTotemRole,
      profile: totemCalc.primaryTotem
    },
    {
      id: totemCalc.shadowTotem.id,
      role: 'Gölge & Muhafız Totemi',
      name: shadowTotemName,
      origin: shadowTotemOrigin,
      meaning: shadowTotemMeaning,
      archetypalPower: shadowTotemPower,
      visualRoleInTattoo: shadowTotemRole,
      profile: totemCalc.shadowTotem
    },
    {
      id: totemCalc.allyTotem.id,
      role: 'Yükseliş & Ruhsal Müttefik',
      name: allyTotemName,
      origin: allyTotemOrigin,
      meaning: allyTotemMeaning,
      archetypalPower: allyTotemPower,
      visualRoleInTattoo: allyTotemRole,
      profile: totemCalc.allyTotem
    }
  ];

  // 4. NEEDED CORRECTIVE & HARMONIZING SYMBOLS
  // Identify symbols the person *needs* based on deficiencies in chakras, elements, and karmic numbers
  const neededSymbols: NeededSymbolDetail[] = [];

  // Deficiency 1: Missing Chakras
  if (numerology.missingNumbers.includes(4)) {
    neededSymbols.push({
      symbolName: 'Kutsal Kalp Lotusu & Anahata Heksagramı',
      category: 'Çakra Şifası',
      targetDeficiency: 'Eksik 4. Çakra (Kalp Çakrası Blokajı / Katılık Riski)',
      esotericRationale: 'İsimde 4 frekansı (D, M, V) bulunmadığından kişi sınır koymakta veya sevgiyi kabul etmekte zorlanabilir. Lotus ve çift üçgen kalp yantrası sevgi dengesi kurar.',
      compositionPlacement: 'Ana totem figürünün tam göğüs kafesi merkezine ince 03RL çizgilerle yerleştirilir.'
    });
  }
  if (numerology.missingNumbers.includes(1)) {
    neededSymbols.push({
      symbolName: 'Köklenme Küpü & Prithvi Yantrası',
      category: 'Çakra Şifası',
      targetDeficiency: 'Eksik 1. Çakra (Kök Çakra / Özgüven ve Aidiyet İhtiyacı)',
      esotericRationale: '1 frekansı eksikliği hayatta kalma ve bağımsızlıkta tereddüt yaratır. Dörtgen zemin ve kök sembolü sarsılmaz bir güç kazandırır.',
      compositionPlacement: 'Tasarımın alt kaidesine sağlamlaştırıcı geometrik zemin olarak işlenir.'
    });
  }
  if (numerology.missingNumbers.includes(7)) {
    neededSymbols.push({
      symbolName: 'Her Şeyi Gören Mistik Göz & Yedi Köşeli Yıldız',
      category: 'Çakra Şifası',
      targetDeficiency: 'Eksik 7. Çakra (Mistik / Derin Sezgi ve Analiz Boşluğu)',
      esotericRationale: '7 frekansı eksikliği yüzeyde kalma veya şüphecilik getirebilir. Mistik göz ve heptagram sezgisel derinliği açar.',
      compositionPlacement: 'Totemin alnına veya kompozisyonun tepe eksenine ışık saçan bir odak olarak konur.'
    });
  }

  // Deficiency 2: Astrological Element Balance
  if (astrology.dominantElement !== 'Toprak') {
    neededSymbols.push({
      symbolName: 'Kozmik Meşe Kökleri & Kristal Matris',
      category: 'Element Dengeleyici',
      targetDeficiency: 'Toprak Elementi İhtiyacı (Fikirlerin Somutlaşması)',
      esotericRationale: 'Kişinin haritasında zihinsel/duygusal akış yoğunken topraklanma ihtiyacı belirgindir. Kökler ve kristaller enerjiyi deriye ve dünyaya sabitler.',
      compositionPlacement: 'Tasarımın alt akışında cildin doğal tonuyla birleşen kök hatları.'
    });
  }
  if (astrology.dominantElement !== 'Su') {
    neededSymbols.push({
      symbolName: 'Kutsal Hilal & Arınma Damlası',
      category: 'Element Dengeleyici',
      targetDeficiency: 'Su Elementi İhtiyacı (Duygusal Esneklik ve Akış)',
      esotericRationale: 'Rijitliği ve aşırı zihinsel gerginliği kırar; duyguların blokajsız akmasını sağlar.',
      compositionPlacement: 'Ana figürü çevreleyen kavisli su dalgası geçişleri.'
    });
  }

  // Deficiency 3: 19 Divine Protection / Cosmic Seal
  if (numerology.divineHelp19.has19) {
    neededSymbols.push({
      symbolName: '19 İlahi Yardım Mührü & Metatron Küpü',
      category: 'Karmik Borç Giderici',
      targetDeficiency: 'Alfa-Omega Rezonansı (19 İlahi Güç Aktivasyonu)',
      esotericRationale: '19 mührü başlangıç ve tamamlanmanın kutsal kodudur; zorluk anlarında kişiye ilahi bir elin uzanmasını sembolize eder.',
      compositionPlacement: 'Geometrik gridin merkez ekseninde 19 adet mikro nokta/sigil olarak kodlanır.'
    });
  } else {
    neededSymbols.push({
      symbolName: 'Yaşam Çiçeği (Flower of Life) & Merkaba',
      category: 'Astrolojik Koruyucu',
      targetDeficiency: 'Aura Koruma & Boyutsal Denge',
      esotericRationale: 'Biyo-manyetik alanı psişik kirlilikten koruyan evrensel kutsal oran gridi.',
      compositionPlacement: 'Tüm kompozisyonu arkadan kuşatan hassas dotwork mandala.'
    });
  }

  // Plant / Flora
  let plantFlora = 'Kutsal Lotus (Nilüfer) & Su Zambağı';
  let plantFloraMeaning = 'Bulanık sulardan yükselen saf aydınlanma, yenilenme ve duygusal arınma.';
  if (astrology.dominantElement === 'Ateş') {
    plantFlora = 'Kızıl Haşhaş & Akonit (Kurtboğan)';
    plantFloraMeaning = 'Tutku, uyanış, cesaret ve derin koruyucu sınırlar.';
  } else if (astrology.dominantElement === 'Hava') {
    plantFlora = 'Ginkgo Biloba & Lavanta';
    plantFloraMeaning = 'Hafıza, zamansız zarafet, zihinsel berraklık ve huzur.';
  } else if (astrology.dominantElement === 'Toprak') {
    plantFlora = 'Kadim Meşe Palamudu & Yabani Eğrelti Otu';
    plantFloraMeaning = 'Kök salma, ölümsüz bilgelik, kadim koruma ve sarsılmaz direnç.';
  }

  // Element
  const element = astrology.dominantElement || 'Ateş';
  const elementMeaning = {
    Ateş: 'Yaratıcı kıvılcım, dönüştürücü tutku, eylem ve iradenin dinamizmi.',
    Toprak: 'Kalıcılık, fiziksel nizam, topraklanma ve maddeye şekil verme gücü.',
    Hava: 'Kavramsal zeka, bilgi akışı, özgürlük ve görünmeyen bağlar.',
    Su: 'Bilinçdışının derinliği, şifa, sezgisel esneklik ve duygusal simya.'
  }[element] || 'Evrensel Eter ve Işık';

  // Crystal / Stone
  let crystalStone = 'Obsidyen & Kara Turmalin';
  let crystalStoneMeaning = 'Negatif enerjileri kesen volkanik ayna ve psişik kalkan.';
  if (sun === 'Akrep' || lp === 8) {
    crystalStone = 'Obsidyen & Yakut';
    crystalStoneMeaning = 'Gölge entegrasyonu, tutkulu irade ve kök çakra gücü.';
  } else if (sun === 'Balık' || sun === 'Yengeç' || lp === 2 || lp === 7) {
    crystalStone = 'Aytaşı & Labradorit';
    crystalStoneMeaning = 'Sezgi açıcı, aurayı koruyan mistik ışık ve rüya köprüsü.';
  } else if (sun === 'Aslan' || sun === 'Koç' || lp === 1 || lp === 3) {
    crystalStone = 'Güneş Taşı & Sitrin';
    crystalStoneMeaning = 'Bolluk, solar plexus enerjisi ve yaratıcı canlılık.';
  } else if (sun === 'Oğlak' || sun === 'Boğa' || sun === 'Başak' || lp === 4) {
    crystalStone = 'Zümrüt & Dumanlı Kuvars';
    crystalStoneMeaning = 'Köklenme, kalp çakrası şifası ve zihinsel sükunet.';
  } else if (sun === 'Kova' || sun === 'İkizler' || sun === 'Terazi' || lp === 5) {
    crystalStone = 'Lapis Lazuli & Ametist';
    crystalStoneMeaning = 'Üçüncü göz vizyonu, hakikat arayışı ve kozmik bağlantı.';
  }

  // Mythological Figure
  let mythologicalFigure = 'Hekate & Hermes';
  let mythologicalFigureMeaning = 'Kavşakların muhafızı ve boyutlar arası bilgi taşıyıcısı.';
  if (ennea === 8 || lp === 1 || sun === 'Koç') {
    mythologicalFigure = 'Ares / Mars & Prometheus';
    mythologicalFigureMeaning = 'Ateşi insanlığa getiren isyankar cesaret ve sınır tanımayan güç.';
  } else if (ennea === 4 || lp === 7 || sun === 'Akrep') {
    mythologicalFigure = 'Persephone & Anubis';
    mythologicalFigureMeaning = 'Yeraltının kraliçesi, karanlıktan doğan bilgelik ve ruhun tartıcısı.';
  } else if (ennea === 5 || lp === 11 || sun === 'Kova') {
    mythologicalFigure = 'Thoth & Athena (Minerva)';
    mythologicalFigureMeaning = 'Kutsal geometri, stratejik zeka, adil savaş ve evrensel yazıtlar.';
  } else if (ennea === 9 || lp === 9 || sun === 'Balık') {
    mythologicalFigure = 'Gaia & Ouroboros';
    mythologicalFigureMeaning = 'Doğanın ana rahmi, bütünleşme ve sonsuz döngünün barışı.';
  } else if (ennea === 3 || lp === 3 || sun === 'Aslan') {
    mythologicalFigure = 'Apollon & Helios';
    mythologicalFigureMeaning = 'Güneş arabası, müzik, kehanet ve altın oranın ışıltısı.';
  }

  // Sacred Object
  let sacredObject = 'Kadim Anahtar & Pusula';
  let sacredObjectMeaning = 'Kilitli sırları açma ve kozmik yönergeleri bulma pusulası.';
  if (lp === 1 || lp === 8) {
    sacredObject = 'Çift Ağızlı Kılıç & Hançer';
    sacredObjectMeaning = 'İllüzyonları kesen irade, net kararlar ve savunma kudreti.';
  } else if (lp === 7 || lp === 9) {
    sacredObject = 'Mistik Fener & Kum Saati';
    sacredObjectMeaning = 'Karanlığı aydınlatan içsel ışık ve zamanın kutsal ritmi.';
  } else if (lp === 2 || lp === 6) {
    sacredObject = 'Kutsal Kâse (Grail) & Ayna';
    sacredObjectMeaning = 'Ruhun derinliğini yansıtan berrak su ve şefkat kabı.';
  } else if (lp === 4 || lp === 22) {
    sacredObject = 'Gönye ve Pergel & Taş Mühür';
    sacredObjectMeaning = 'Kozmik nizamın yeryüzündeki inşası ve değişmez prensipler.';
  }

  // Geometric Symbol
  let geometricSymbol = 'Metatron Küpü & Yaşam Çiçeği';
  let geometricSymbolMeaning = 'Kozmik nizam, çok boyutlu koruma ve ilahi matematik.';
  if (lp === 1 || lp === 8) {
    geometricSymbol = 'Ters-Düz Eşkenar Dörtgen & Çift Üçgen';
    geometricSymbolMeaning = 'Eril ve dişil enerjinin irade odağında kenetlenmesi.';
  } else if (lp === 7 || lp === 11) {
    geometricSymbol = 'Merkaba & Sri Yantra';
    geometricSymbolMeaning = 'Işık beden aktivasyonu, ilahi vizyon ve boyutlar arası rezonans.';
  } else if (lp === 4 || lp === 22) {
    geometricSymbol = 'Platonik Katılar (Küp & Oktahedron)';
    geometricSymbolMeaning = 'Maddenin beş kutsal yapı taşı ve sarsılmaz temel.';
  } else if (lp === 3 || lp === 6) {
    geometricSymbol = 'Torus & Altın Oran Spirali (Fibonacci)';
    geometricSymbolMeaning = 'Kendi kendini yenileyen yaşam enerjisi ve mükemmel estetik.';
  }

  // Color Palette
  let colorPalette = ['#080808', '#1f1f1f', '#c4a47c', '#ffffff'];
  let colorThemeDescription = 'Saf Karbon Siyahı, Kömür Grisi, Antik Vurgu Altını ve Deri Negatif Alanı.';
  if (astrology.dominantElement === 'Ateş') {
    colorPalette = ['#0a0808', '#2a1212', '#b91c1c', '#f59e0b'];
    colorThemeDescription = 'Kömürleşmiş Siyah, Kızıl Alev Vurgusu ve Antik Güneş Altını.';
  } else if (astrology.dominantElement === 'Su') {
    colorPalette = ['#06080b', '#0f172a', '#38bdf8', '#e2e8f0'];
    colorThemeDescription = 'Derin Gece Mavisi, Sis Grisi, Buzul Vurgusu ve Sedefli Beyaz.';
  } else if (astrology.dominantElement === 'Toprak') {
    colorPalette = ['#090909', '#1c1917', '#15803d', '#d6d3d1'];
    colorThemeDescription = 'Kuru Toprak Siyahı, Yosun Yeşili, Meşe Kabuğu Kahvesi ve Kemik Rengi.';
  } else if (astrology.dominantElement === 'Hava') {
    colorPalette = ['#0f1118', '#252a3a', '#7889a4', '#e6eaf0'];
    colorThemeDescription = 'Kozmik Kobalt, Fırtına Grisi, Buzul Mavisi ve Saf Gümüş Vurgu.';
  }

  const mainTheme = `${astrology.sunSign} / Yaşam Yolu ${lp} Entegrasyonu: ${numerology.lifePathTitle}`;
  const emotionalTheme = `Gölgeyi Işığa Dönüştürme (${enneagram.wing}) & ${element} Elementinin Ruhsal Arınması`;

  const characterTraitSymbols = [
    `${astrology.rulingPlanet} Gezegeni Glifi`,
    `${lp} Sayısının Kutsal Geometrik Açılımı`,
    `Enneagram ${ennea} Dönüşüm Mührü`,
    `Eksik Sayı Dengeleme Tılsımı`
  ];

  const subtleDetails: string[] = [];
  if (numerology.divineHelp19.has19) {
    subtleDetails.push(`19 İlahi Matris Mührü: Tasarımın alt köşesinde veya odak sembolün gövdesinde gizlenmiş mikro 19 nokta/çentik`);
  } else {
    subtleDetails.push(`${astrology.sunSign} / ${astrology.rulingPlanet} Glifi: Geometrik çerçevenin tepe noktasında ince 03RL çizgiyle işlenmiş mikro astrolojik glif`);
  }

  if (numerology.missingNumbers.length > 0) {
    subtleDetails.push(`${numerology.missingNumbers.join(', ')} Nolu Eksik Çakraları dengeleyen ${numerology.missingNumbers.length} adet mikro Fibonacci ışın noktası`);
  } else {
    subtleDetails.push(`Pisagor Altın Oran Kılavuz Çizgisi: Kompozisyonun omurgasını oluşturan kesikli kılavuz nokta dizisi`);
  }

  const symbolInterconnection = `Merkezi odak olan ${primaryTotemName} figürü (${primaryTotemMeaning.slice(0, 40)}...), arka plandaki ${geometricSymbol} ile yapısal bir derinlik kazanır. ${plantFlora} organik kıvrımlarla sert geometrik sınırları yumuşatarak dövmenin vücut anatomisine akmasını sağlar. ${sacredObject} figürün merkez ekseninde tutulurken, gölge muhafız ${shadowTotemName} ve ihtiyaç duyulan ${neededSymbols[0]?.symbolName || 'Dengeleyici Yantra'} tasarımı enerjetik olarak eksiksiz bir koruma kalkanına dönüştürür.`;

  return {
    totemAnimal: primaryTotemName,
    totemAnimalId: totemCalc.primaryTotem.id,
    totemAnimalMeaning: primaryTotemMeaning,
    calculatedTotemName: primaryTotemName,
    calculatedTotemMeaning: primaryTotemMeaning,
    totemHierarchy,
    neededSymbols,
    secondaryAnimals,
    plantFlora,
    plantFloraMeaning,
    element,
    elementMeaning,
    crystalStone,
    crystalStoneMeaning,
    mythologicalFigure,
    mythologicalFigureMeaning,
    sacredObject,
    sacredObjectMeaning,
    geometricSymbol,
    geometricSymbolMeaning,
    colorPalette,
    colorThemeDescription,
    mainTheme,
    emotionalTheme,
    chakraProfile,
    chakraBalanceScore: chakraProfile.overallChakraBalanceScore,
    blockedChakraNumbers: chakraProfile.blockedChakras.map(chakra => chakra.number),
    dominantChakraNumbers: chakraProfile.dominantChakras.map(chakra => chakra.number),
    primaryChakraHealingDirective: chakraProfile.primaryHealingDirective,
    primaryChakraAffirmation: chakraProfile.primaryChakraAffirmation,
    shadowTotemName,
    shadowTotemMeaning,
    shadowTotemPower,
    shadowTotemRole,
    enneagramShadowTraits: enneagram.shadowTraits,
    enneagramShadowSymbolicMeaning: enneagram.symbolicMeaning,
    characterTraitSymbols,
    subtleDetails: subtleDetails.slice(0, 2),
    symbolInterconnection,
    totemTestResult: totemCalc.behavioralReport ? {
      primaryTotem: totemCalc.behavioralReport.primaryTotem,
      secondaryTotem: totemCalc.behavioralReport.secondaryTotem,
      shadowTotem: totemCalc.behavioralReport.shadowTotem,
      topMatches: totemCalc.behavioralReport.topMatches.map(m => ({
        animalId: m.animal.id,
        animalName: m.animal.name,
        similarityScore: m.similarityScore
      })),
      confidenceScore: totemCalc.behavioralReport.confidenceScore,
      isProximityClose: totemCalc.behavioralReport.isProximityClose,
      proximityDifference: totemCalc.behavioralReport.proximityDifference,
      crossEnneagramInsight: totemCalc.behavioralReport.crossEnneagramInsight
    } : undefined
  };
}
