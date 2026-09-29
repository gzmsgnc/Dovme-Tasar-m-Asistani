import {
  PersonData,
  NumerologyProfile,
  AstrologyProfile,
  EnneagramProfile,
  SymbolismProfile,
  TattooDesignParameters,
  TattooRecipe,
  SymbolRationale,
  TattooFeasibility
} from '../types';
import { calculateChakraProfile } from './chakra';
import { generateShadowArchetypeAnalysis } from './shadowArchetypeAnalysis';
import { encodeToMorse } from './morseCode';
import { executeSymbolicIntegrationEngine } from './symbolIntegrationEngine';
import { getTotemAnimalStrict } from './totemCatalogData';
import { generatePersonalSymbolPrescription } from './personalSymbolPrescription';

export function validateRecipeSymbolism(symbolism: SymbolismProfile): void {
  if (!symbolism.totemAnimal?.trim()) {
    throw new Error('Tarif üretilemedi: hesaplanmış kişisel totem bulunamadı.');
  }
  const primary = symbolism.totemTestResult?.primaryTotem;
  if (primary?.name && primary.name !== symbolism.totemAnimal) {
    throw new Error('Tarif üretilemedi: totem sonuçları ile sembolizm profili eşleşmiyor.');
  }
  if (primary?.id && symbolism.totemAnimalId && primary.id !== symbolism.totemAnimalId) {
    throw new Error('Tarif üretilemedi: hesaplanmış totem kimlikleri eşleşmiyor.');
  }
}

export function generateTattooRecipe(
  person: PersonData,
  numerology: NumerologyProfile,
  astrology: AstrologyProfile,
  enneagram: EnneagramProfile,
  symbolism: SymbolismProfile,
  parameters: TattooDesignParameters
): TattooRecipe {
  const stylesStr = parameters.selectedStyles.join(' + ') || 'Fine Line & Geometric';
  const includeTotem = parameters.includeTotemInDesign === true;

  // Guard against stale/mismatched symbolism entering a recipe.
  validateRecipeSymbolism(symbolism);

  const isTotemAnimalName = (sym: string | undefined): boolean => {
    if (!sym) return false;
    const cleanSym = sym.toLowerCase().trim();
    if (cleanSym === symbolism.totemAnimal?.toLowerCase() ||
        symbolism.totemHierarchy?.some(t => t.name.toLowerCase() === cleanSym) ||
        symbolism.secondaryAnimals?.some(a => a.toLowerCase() === cleanSym)) {
      return true;
    }
    try {
      const resolved = getTotemAnimalStrict(cleanSym);
      if (resolved) return true;
    } catch {
      // not a totem animal
    }
    return false;
  };

  // Totem hayvanının tasarıma dahil edilme durumu
  let mainSymbol = parameters.mainSymbol;
  if (!includeTotem) {
    if (!mainSymbol || isTotemAnimalName(mainSymbol)) {
      mainSymbol = symbolism.sacredObject || symbolism.geometricSymbol || 'Kutsal Geometri & Yaşam Çiçeği';
    }
  } else {
    if (!mainSymbol) {
      mainSymbol = symbolism.totemAnimal;
    }
  }

  // İkincil sembollerde totem hayvanı filtrelemesi
  const rawSecondary = parameters.secondarySymbols.length > 0
    ? parameters.secondarySymbols
    : [symbolism.plantFlora, symbolism.geometricSymbol, symbolism.sacredObject];

  // Remove duplicate symbols while preserving the user's calculated hierarchy.
  const uniqueSecondarySymbols = [...new Set(rawSecondary.filter(Boolean).map(s => s.trim()))];

  const secondarySymbols = includeTotem
    ? uniqueSecondarySymbols
    : uniqueSecondarySymbols.filter(s => !isTotemAnimalName(s));

  const subtleDetails = [...(parameters.subtleDetails && parameters.subtleDetails.length > 0
    ? parameters.subtleDetails
    : symbolism.subtleDetails)];

  // Mors Alfabesi ile Rakam Şifreleme
  let morseCodePattern: { rawText: string; morseDisplay: string; morseStandard: string; tattooSpecification: string } | undefined = undefined;
  if (parameters.useMorseCodeForNumbers) {
    const rawToEncode = parameters.customMorseInput?.trim() ||
      person.personalNumbers?.trim() ||
      (person.birthDate ? person.birthDate.split('-').reverse().join('.') : '') ||
      `${numerology.lifePathNumber}`;
    const encoded = encodeToMorse(rawToEncode);
    morseCodePattern = {
      rawText: encoded.rawInput,
      morseDisplay: encoded.morseDisplay,
      morseStandard: encoded.morseStandard,
      tattooSpecification: encoded.tattooSpecification
    };
    subtleDetails.push(`Mors Alfabesi Kutsal Rakam Mührü: ${morseCodePattern.rawText} ➔ ${morseCodePattern.morseDisplay}`);
  }

  // 1. Generate Individual Symbol Rationales
  const rationales: SymbolRationale[] = [];

  // Main symbol provenance: never claim a user-selected symbol was calculated
  // from a specific profile unless the symbol is actually one of the calculated totems.
  const isCalculatedPrimaryTotem = mainSymbol.toLowerCase() === symbolism.totemAnimal?.toLowerCase();
  rationales.push({
    symbolName: mainSymbol,
    symbolCategory: '1. Ana Odak Sembolü (Primary Focal Subject)',
    esotericConnection: isCalculatedPrimaryTotem
      ? `Kişinin davranışsal/kişisel totem hesabından elde edilen ${symbolism.totemAnimal} ana ruh totemidir; Yaşam Yolu ${numerology.lifePathNumber}, Güneş ${astrology.sunSign} ve Enneagram ${enneagram.wing} bağlamıyla birlikte görsel dile çevrilir.`
      : `Ana odak sembolü danışanın/tasarımcının seçimiyle belirlenmiştir. Kişisel harita (${astrology.sunSign}, Yaşam Yolu ${numerology.lifePathNumber}, Enneagram ${enneagram.wing}) sembolün kendisinin hesaplandığı iddiası olmadan kompozisyon, anlam ve yerleşim kararlarını yönlendirir.`,
    visualRole: `Kompozisyonun 1. derece görsel çekim merkezi. En yüksek kontrast, en net kontur ve en zengin dokusal derinlik bu alanda toplanır.`
  });

  // Secondary Symbol 1
  const sec1 = secondarySymbols[0] || symbolism.plantFlora;
  rationales.push({
    symbolName: sec1,
    symbolCategory: '2. Yardımcı Sembol (Akış & Denge)',
    esotericConnection: `Hakim ${astrology.dominantElement} elementinin (${symbolism.elementMeaning}) ve Ay ${astrology.moonSign} sezgisinin koruyucu aurasını taşır. Eksik çakraların (${numerology.missingNumbers.length > 0 ? numerology.missingNumbers.join(', ') : 'Tam çakra dengesi'}) enerjetik boşluğunu dengeler.`,
    visualRole: `Ana sembolü çevreleyen organik akış hatları; kas liflerine uyum sağlayan yumuşak geçiş köprüsü.`
  });

  // Secondary Symbol 2
  const sec2 = secondarySymbols[1] || symbolism.geometricSymbol;
  rationales.push({
    symbolName: sec2,
    symbolCategory: '3. Yardımcı Sembol (Kutsal Geometri / Yapısal Matris)',
    esotericConnection: `Ana Kulvar ${numerology.destinyNumber} (${numerology.destinyTitle}) ve DM (Dünya Misyonu: ${numerology.dmNumber}) sayısal titreşimlerinin geometrik izdüşümüdür. ${numerology.divineHelp19.has19 ? '19 İlahi Yardım mührünün enerjisiyle desteklenmiştir.' : 'Kozmik dengeyi sağlar.'}`,
    visualRole: `Arka planda mikro-dotwork veya hassas linework ile işlenmiş geometrik aks ve dengeleyici zemin.`
  });

  // Secondary Symbol 3 if available
  if (secondarySymbols[2]) {
    rationales.push({
      symbolName: secondarySymbols[2],
      symbolCategory: '4. Yardımcı Sembol (Kutsal Obje / Mühür)',
      esotericConnection: `Kişinin Yükselen ${astrology.ascendantSign} aurası ve Enneagram büyüme noktası (${enneagram.growthPoint}) arasındaki potansiyeli tetikler. Mitolojik arketip (${symbolism.mythologicalFigure}) enerjisini mühürler.`,
      visualRole: `Ana figürün merkezinde veya tepe noktasında sembolik derinlik katan tamamlayıcı tılsım.`
    });
  }

  // 2. Feasibility & Skin Suitability Analysis (Dövme Uygulanabilirliği)
  const isFineLine = parameters.selectedStyles.includes('Fine Line') || parameters.selectedStyles.includes('Micro Realism');
  const isHeavyBlack = parameters.selectedStyles.includes('Blackwork') || parameters.selectedStyles.includes('Tribal');
  const isDotwork = parameters.selectedStyles.includes('Dotwork') || parameters.selectedStyles.includes('Geometric');

  let lineWeight = '03RL tek iğne (0.25mm) hassas kontur ve 05RL destekleyici hatlar';
  if (isHeavyBlack) {
    lineWeight = '07RL / 09RL kalın dış kontur, 03RL iç detaylar ve 15M1 doygun blok dolgular';
  } else if (isDotwork) {
    lineWeight = '03RL / 05RL stippling pendulum nokta vuruşları ve 05RL kılavuz konturları';
  }

  const densityStr = parameters.density || 'Dengeli & Net (%60)';
  let negativeSpaceRatio = '%45 - %50 (Geniş nefes alanları, derinin doğal ışıltısını öne çıkarır)';
  if (densityStr.includes('Yoğun') || densityStr.includes('Maksimalist')) {
    negativeSpaceRatio = '%25 - %30 (Yüksek doygunluk ve derin kontrast blokları)';
  } else if (densityStr.includes('Minimal')) {
    negativeSpaceRatio = '%65 - %70 (Geniş negatif alan, ultra sade estetik)';
  }

  const detailDensity = densityStr.includes('Yoğun') ? 'Yüksek (Büyük ölçekli yerleşim önerilir)' : 'Dengeli ve Okunabilir';
  const agingBlowoutRisk = isFineLine 
    ? 'Düşük-Orta Risk: Çizgiler arasında minimum 1.5 - 2 mm güvenlik mesafesi bırakılmalı, 5-10 yıl içinde pigment yayılması hesaplanmalıdır.'
    : 'Düşük / Güvenli: Konturlar ve negatif alan dengesi uzun vadeli yaşlanmaya karşı dirençlidir.';

  const shadingTechnique = parameters.colorScheme.includes('Tekil Vurgu')
    ? 'Whip shading geçişleri, 3 kademeli Grey Wash (%30, %60, %90) ve seçili kırmızı/altın pigment doygunluğu'
    : 'Whip Shading, Pendulum Dotwork ve pürüzsüz Black & Grey degrade tonlaması';

  const anatomicalFlow = `${parameters.bodyPlacement} bölgesinin kas yönelimine uygun ${parameters.orientation.toLowerCase()} hat; vücut hareketlerinde esneme payı gözetilmiştir.`;
  
  const recommendedSize = (parameters.bodyPlacement.includes('Sırt') || parameters.bodyPlacement.includes('Göğüs'))
    ? 'Minimum 22 x 15 cm | İdeal: 30 x 20 cm (Detayların 10 yıl sonra net okunabilmesi için)'
    : 'Minimum 14 x 8 cm | İdeal: 18 x 10 cm (Mikro detay güvenliği)';

  // Dinamik Zanaat ve Deri Uygulanabilirlik Skoru Hesaplaması (0 - 100)
  let calculatedScore = 90;

  // 1. Bölge Zorluğu ve Deri Hareketi
  const placementLower = parameters.bodyPlacement.toLowerCase();
  if (placementLower.includes('kaburga') || placementLower.includes('göğüs kafesi') || placementLower.includes('sternum') || placementLower.includes('karın')) {
    calculatedScore -= 8; // Solunum hareketi, gerilme ve elastikiyet
  } else if (placementLower.includes('boyun') || placementLower.includes('el') || placementLower.includes('parmak') || placementLower.includes('ayak')) {
    calculatedScore -= 12; // Sürtünme ve ince epidermis tabakası
  } else if (placementLower.includes('sırt') || placementLower.includes('kürek') || placementLower.includes('omuz')) {
    calculatedScore += 5; // Geniş, düz, stabil kanvas
  } else if (placementLower.includes('önkol') || placementLower.includes('üst kol') || placementLower.includes('baldır')) {
    calculatedScore += 4; // İdeal stabil zemin ve düşük deformasyon
  }

  // 2. Stil & İğne İnceltme Uyumu
  if (isFineLine) {
    calculatedScore -= 3; // İnce iğne titizliği ve 1.5mm emniyet aralığı gerektirir
  }
  if (isDotwork) {
    calculatedScore += 2; // Stippling doku yaşlanmaya karşı dirençlidir
  }
  if (isHeavyBlack) {
    calculatedScore += 3; // Doygun siyah bloklar uzun ömürlü okunabilirliğe sahiptir
  }

  // 3. Yoğunluk & Negatif Alan Dengesi
  if (parameters.density.includes('Yoğun') || parameters.density.includes('Maksimalist')) {
    calculatedScore -= 4; // Yüksek detay yoğunluğu kontrollü el işçiliği ister
  } else if (parameters.density.includes('Minimal') || parameters.density.includes('Hafif')) {
    calculatedScore += 4; // Geniş negatif alan cildi korur ve okunabilirliği artırır
  }

  const overallFeasibilityScore = Math.max(68, Math.min(99, calculatedScore));
  const summaryEvaluation = overallFeasibilityScore >= 90
    ? `Tasarım ${parameters.bodyPlacement} bölgesi için mükemmel zanaat uyumuna (${overallFeasibilityScore}/100) sahiptir. Cilt elastikiyeti ve iğne konfigürasyonu uzun vadeli dayanıklılık sunar.`
    : `Tasarım ${parameters.bodyPlacement} anatomisinde uygulanabilir (${overallFeasibilityScore}/100) durumdadır. Seçilen stil ve bölgenin esneme dinamikleri nedeniyle seans sırasında mikro-açı kontrolleri önerilir.`;

  const feasibility: TattooFeasibility = {
    lineWeight,
    negativeSpaceRatio,
    detailDensity,
    agingBlowoutRisk,
    shadingTechnique,
    anatomicalFlow,
    recommendedSize,
    overallFeasibilityScore,
    summaryEvaluation
  };

  // 3. Composition Guide
  const compositionGuide = `
**Kompozisyon Geometrisi:** ${parameters.composition}
**Görsel Hiyerarşi:** Dövmenin merkezinde **${mainSymbol}** yer alır. Bakış ilk olarak ana figürün detaylarına odaklanır, ardından **${sec1}** ile oluşturulan ${parameters.orientation.toLowerCase()} yönelimli akış çizgileri gözü **${sec2}** geometrik gridine doğru kaydırır.
**Negatif Alan Dengesi:** ${parameters.density} kurgusuna sadık kalınarak, cildin doğal tonu derin saf siyahların arasında nefes alma boşlukları olarak bırakılacaktır.
**Dinamik Ritim:** ${parameters.selectedStyles.includes('Dotwork') || parameters.selectedStyles.includes('Fine Line') ? 'Hassas nokta yoğunlukları ve ultra ince hatlar ile yumuşak geçişler sağlanacaktır.' : 'Sert hatlar ve yüksek kontrastlı gölgelendirmelerle dramatik derinlik elde edilecektir.'}
  `.trim();

  // 4. Placement & Anatomy Notes
  const placementAnatomyNotes = `
**Hedef Bölge:** ${parameters.bodyPlacement}
**Anatomik Akış:** Tasarım ${parameters.bodyPlacement} bölgesinin doğal kas lifleri ve kemik hatları boyunca uzanacaktır. Vücut hareket ettiğinde (bükülme veya gerilme anlarında) dövmenin formunu kaybetmemesi için ana aks kavisli anatomik çizgiye göre konumlandırılmalıdır.
**Yaşlanma & Dayanıklılık:** Çok küçük sıkışık detaylardan kaçınılarak cildin zaman içindeki doğal pigment dağılımı hesaba katılmıştır. Çizgi aralıkları minimum 1.5 - 2 mm güvenlik payıyla yerleştirilecektir.
  `.trim();

  // 5. Needle and Technique Guide
  let needleTechnique = `
- **Dış Konturlar & Ana Hatlar:** ${lineWeight}
- **Yumuşak Gölgelendirme (Whip Shading):** 07M1 Curved Magnum veya 05RS ile %30, %50, %80 sulandırılmış Grey Wash ton geçişleri.
- **Noktasal Doku (Stippling):** 03RL ile 4.5V - 5.0V düşük voltaj pendulum tekniği.
- **Doygun Siyah Bloklar:** 09RS / 15M1 ile derin doygun katı siyah dolgu.
  `.trim();

  if (parameters.colorScheme.includes('Tekil Vurgu')) {
    needleTechnique += `\n- **Vurgu Rengi:** Crimson Kırmızı / Antik Altın pigmenti ana figürün kritik odak noktalarına (gözler/kutsal aks) tek kat pürüzsüz uygulanacaktır.`;
  }

  // 6. Artistic Atmosphere Guide
  const artisticAtmosphereGuide = `
**Atmosfer:** ${parameters.visualAtmosphere}
**Duygusal Rezonans:** ${symbolism.emotionalTheme}
**Renk ve Tonlama:** ${parameters.colorScheme} (${symbolism.colorThemeDescription})
Tasarım, kişinin hem gölge yönlerini (${enneagram.shadowTraits.slice(0, 2).join(', ')}) kucaklayan hem de yaşam yolu erdemlerini (${numerology.coreKeywords.slice(0, 3).join(', ')}) yükselten mistik bir simya eseri hissiyatı taşımalıdır.
  `.trim();

  // 7. Summary Rationale
  const summaryRationale = includeTotem
    ? `Bu dövme tasarımı reçetesi, ${person.name} için özel olarak hesaplanan Numerolojik Yaşam Yolu (${numerology.lifePathNumber}), İfade (${numerology.destinyNumber}), DM (${numerology.dmNumber}), Güneş ${astrology.sunSign}, Ay ${astrology.moonSign}, Yükselen ${astrology.ascendantSign}, Enneagram ${enneagram.wing} ve kişisel verilerden hesaplanan Ruhani Totem Hayvanı (${symbolism.totemAnimal}) verilerini tek bir görsel dilde sentezler. Seçilen her bir sembol (${mainSymbol}, ${sec1}, ${sec2}), kişinin içsel arketipiyle rezonansa girerek deride kalıcı bir güç tılsımı oluşturur.`
    : `Bu dövme tasarımı reçetesi, ${person.name} için özel olarak hesaplanan Numerolojik Yaşam Yolu (${numerology.lifePathNumber}), İfade (${numerology.destinyNumber}), DM (${numerology.dmNumber}), Güneş ${astrology.sunSign}, Ay ${astrology.moonSign}, Yükselen ${astrology.ascendantSign} ve Enneagram ${enneagram.wing} verilerini tek bir görsel dilde sentezler. Kişisel verilerden hesaplanan Ruhani Totem Hayvanı (${symbolism.totemAnimal}) danışanın tercihi doğrultusunda dövme kompozisyonuna dahil edilmemiş, yalnızca içsel/ruhani bir rehber ve analitik kaynak olarak saklanmıştır. Dövme odağı ${mainSymbol}, ${sec1} ve ${sec2} kutsal sembolleri üzerinden kurgulanmıştır.`;

  // 8. Technical Tattoo Prompt Engineering (Strict Tattoo Flash & Stencil Fidelity)
  const englishStyleDescriptions = parameters.selectedStyles.map(s => {
    switch (s) {
      case 'Fine Line':
        return 'Fine Line (03RL single-needle ultra-crisp vector linework, controlled delicate contours, razor-sharp edge definition)';
      case 'Geometric':
        return 'Sacred Geometry (mathematical vector grids, golden ratio proportions, precise concentric mandala symmetry, Metatron matrix)';
      case 'Dotwork':
        return 'Dotwork & Stippling (pendulum stippling pointillism, controlled dot density gradients, noise-free tonal transitions)';
      case 'Blackwork':
        return 'Solid Blackwork (rich saturated solid black ink fills, stark graphic negative-space contrast, bold dynamic silhouette)';
      case 'Black & Grey':
        return 'Black & Grey Wash (smooth 3-stage grey wash shading, soft directional light gradients, velvety tonal depth)';
      case 'Realism':
        return 'Realism (anatomical accuracy, realistic ink value distribution, crisp structural definition without muddy blur)';
      case 'Micro Realism':
        return 'Micro Realism (miniature high-precision ink rendering, crisp micro-linework with safe spacing)';
      case 'Neo Traditional':
        return 'Neo Traditional (varying line weights from bold 07RL outer contours to fine 03RL inner details, balanced tonal gradients)';
      case 'Traditional/Old School':
        return 'Traditional Flash (bold clean 09RL outlines, stark high-contrast black fills, iconic tattoo flash readability)';
      case 'Dark Surrealism':
        return 'Dark Surrealism (sombre metaphysical dreamscape forms, esoteric symbolic juxtaposition, moody high-contrast shadows)';
      case 'Surrealism':
        return 'Metaphysical Surrealism (fluid symbolic transformations, dreamlike organic-geometric transitions)';
      case 'Illustrative':
        return 'Illustrative Ink (fine directional crosshatching, organic hand-drawn precision, expressive contours)';
      case 'Etching/Engraving':
        return 'Woodcut & Etching (Albrecht Dürer vintage copperplate engraving line art, precise parallel hatching lines)';
      case 'Biomechanical':
        return 'Biomechanical (cyber-organic anatomy, interwoven mechanical linkages and tendon structures)';
      case 'Watercolor':
        return 'Watercolor Ink Wash (fluid translucent ink splashes and edge bleeds contained within clean linework)';
      case 'Minimalist':
        return 'Minimalist (single continuous contour lines, maximum negative space, pure essential forms)';
      case 'Japanese/Irezumi':
        return 'Japanese Irezumi (traditional bold outline flow, stylized clouds, wind bars and dynamic waves)';
      case 'Ornamental':
        return 'Ornamental Filigree (intricate jewelry lace, symmetrical baroque flourishes, sacred unalome arches)';
      case 'Futuristic/Cyber':
        return 'Cyber Sigilism (sharp razor-blade chrome geometry, neo-tribal vector sigils, hyper-detailed tech lines)';
      case 'Trash Polka':
        return 'Trash Polka (graphic black & red collage, stark typography and dynamic brush strokes)';
      case 'Chicano':
        return 'Chicano Fine Line (delicate single-needle contours, velvety smooth grey wash gradients)';
      default:
        return `${s} tattoo style with clean intentional contours`;
    }
  }).join(', ');

  const subtleDetailsStr = subtleDetails.length > 0
    ? subtleDetails.join(', ')
    : `Sacred 19 seal, subtle constellation nodes of ${astrology.sunSign}, micro-sigils`;

  const colorStylePrompt = parameters.colorScheme === 'Saf Monokrom Siyah'
    ? 'pure stark monochrome black carbon ink'
    : parameters.colorScheme === 'Tekil Vurgu Rengi (Kırmızı/Altın)'
    ? 'black and grey ink foundation with single subtle vibrant crimson red/gold accent on focal points'
    : parameters.colorScheme === 'Black & Grey (Gri Gölgelendirme)'
    ? 'multi-tone black and grey wash with smooth 3-stage grey wash shading (%30, %60, %90)'
    : parameters.colorScheme === 'Soğuk Çift Ton (Füme & Buz Mavisi)'
    ? 'charcoal black ink with subtle glacial ice-blue wash accents'
    : 'balanced rich tattoo flash palette with intentional color restraint';

  // 1. MASTER FINISHED TATTOO FLASH PROMPT (Full Shading & Texture)
  const masterEnglishPrompt = `
tattoo design, tattoo flash, stencil-ready, tattoo linework, clean intentional contours, skin-safe negative space, tattoo-readable composition, single cohesive tattoo composition.
PRIMARY FOCAL SUBJECT (60-70% visual weight): Centrally anchored ${mainSymbol}, rendered with dominant focal depth, commanding presence and sharp intentional contours, not overshadowed by secondary elements.
ORGANIC SUPPORTING ELEMENTS (20-30% visual weight): ${sec1} and ${sec2}, organically fused into the base and silhouette of the primary subject, structural flow accents enhancing the natural anatomical line.
HIDDEN ESOTERIC DETAILS (5-10% visual weight): Delicate ${subtleDetailsStr}, sacred geometry grid, fine micro-dotwork sigils, numerological resonance (Life Path ${numerology.lifePathNumber}).
SELECTED TATTOO STYLES: ${englishStyleDescriptions}.
COMPOSITION & PLACEMENT: ${parameters.composition} composition with ${parameters.orientation} flow designed for ${parameters.bodyPlacement} anatomical curvature.
FEASIBILITY & TECHNIQUE: ${colorStylePrompt}, ${lineWeight}, ${shadingTechnique}, ${negativeSpaceRatio} open negative space, minimum 2mm line clearance preventing ink blowout for 10-year aging clarity.
CANVAS & ISOLATION: Flat 2D tattoo flash sheet artwork, isolated on clean solid background, pristine tattoo flash plate presentation, no human body, no skin, no arm mockup, no photo, no 3D render.
  `.trim().replace(/\s+/g, ' ');

  // 2. MASTER STENCIL OUTLINE PROMPT (Pure Linework, Zero Shading)
  const masterOutlinePrompt = `
professional tattoo stencil line art transfer sheet, pure black vector outline on clean white background, tattoo linework, stencil-ready, clean intentional contours, single cohesive tattoo composition.
PRIMARY SUBJECT (60-70% visual weight): Sharp 03RL/05RL vector outline of ${mainSymbol}, dominant focal subject.
SUPPORTING ELEMENTS (20-30% visual weight): Clean contour linework of ${sec1} and ${sec2} organically integrated into main silhouette.
ESOTERIC DETAILS (5-10% visual weight): Fine sacred geometry alignment lines (${sec2}), subtle micro-sigils (${subtleDetailsStr}).
STYLE CONSTRAINTS: ${englishStyleDescriptions}, zero shading, zero grey tones, pure binary black line art, open skin-safe negative space, ready for thermal stencil printer transfer, isolated on pure white background, no skin, no body, no mockup.
  `.trim().replace(/\s+/g, ' ');

  // 3. MASTER SHADED FLASH PROMPT (Rich Shading, Whip Shading & Tonal Depth)
  const masterShadedPrompt = `
professional tattoo flash sheet design, finished black and grey tattoo artwork, tattoo design, tattoo flash, stencil-ready, tattoo linework, clean intentional contours, skin-safe negative space, tattoo-readable composition, single cohesive tattoo composition.
FOCAL SUBJECT (60-70% visual weight): ${mainSymbol} with deep black ink saturation, crisp outer contours, velvety grey wash tonal values.
SUPPORTING ELEMENTS (20-30% visual weight): ${sec1} and ${sec2} interwoven seamlessly with whip shading and stippling dotwork.
HIDDEN DETAILS (5-10% visual weight): Subtle ${subtleDetailsStr}, fine sacred geometry matrix.
STYLES & TECHNIQUE: ${englishStyleDescriptions}, ${colorStylePrompt}, ${shadingTechnique}, ${negativeSpaceRatio} skin-safe negative space, isolated on clean solid background, no human body, no skin, no arm mockup, no photograph.
  `.trim().replace(/\s+/g, ' ');

  // 4. MIDJOURNEY v6.1 / NIJI 6 MASTER PROMPT
  const midjourneyPrompt = `tattoo design, tattoo flash plate, stencil-ready, ${englishStyleDescriptions}, centrally anchored ${mainSymbol}, harmonized with ${sec1} and sacred geometric lines of ${sec2}, subtle ${subtleDetailsStr}, ${colorStylePrompt}, ${shadingTechnique}, clean intentional contours, open skin-safe negative space, isolated on clean solid neutral background, flat 2D flash plate --ar 2:3 --v 6.1 --style raw --s 250 --no skin, human, body, arm, mockup, realistic photograph, 3d render, frame, blurry, text, watermark`.trim().replace(/\s+/g, ' ');

  // 5. DALL-E 3 MASTER TATTOO FLASH PROMPT
  const dalle3Prompt = `A master tattoo flash sheet artwork featuring a single cohesive tattoo design centered around ${mainSymbol}, surrounded by graceful organic accents of ${sec1} and geometric matrix lines of ${sec2}. Designed strictly in ${englishStyleDescriptions} style. Featuring ${colorStylePrompt}, crisp 03RL linework and smooth grey wash shading. The artwork is completely isolated on a flat, pure off-white paper background, presented as a tattoo studio flash sheet. Do not show any human body, arm, skin, or photo mockup. Keep the composition clean with balanced open negative space.`.trim().replace(/\s+/g, ' ');

  // 6. 03RL THERMAL STENCIL LINE ART PROMPT
  const stencilPrompt = `professional tattoo stencil line art transfer sheet, pure binary black vector outline on clean white background, 03RL single needle linework, tattoo stencil-ready, crisp contours of ${mainSymbol} with ${sec1} and sacred geometry ${sec2}, zero shading, zero grey tones, pure line art, open skin-safe negative space, thermal copier transfer sheet --ar 2:3 --v 6.1 --style raw --s 100 --no shading, grey, gradient, skin, mockup, color, blur`.trim().replace(/\s+/g, ' ');

  // 7. FLUX.1 PRO / STABLE DIFFUSION PROMPT (Photorealistic Ink & Precision Anatomy)
  const fluxPrompt = `
An intricate master tattoo design piece by world-class esoteric tattoo artists, featuring a centrally anchored ${mainSymbol}, harmonized with ${sec1} and sacred geometric lines of ${sec2}. Designed in ${englishStyleDescriptions}. Crisp 03RL black linework, smooth whip shading gradients, pure black carbon ink on neutral background. Highly readable composition, skin-friendly flow, negative space balance, occult numerology details (${subtleDetailsStr}). Professional tattoo flash presentation plate, 8k resolution, immaculate precision.
  `.trim().replace(/\s+/g, ' ');

  const chakra = calculateChakraProfile(numerology, astrology);

  // 8. TATTOO ARTIST TECHNICAL SPEC SHEET
  const artistSpecSheet = `
DÖVME SANATÇISI TEKNİK UYGULAMA BRİFİ (STUDIO SPEC SHEET):
• Danışan: ${person.name}
• Ana Odak Sembolü: ${mainSymbol} (%60-70 Görsel Çekim Merkezi)
• Yardımcı Akış Sembolleri: ${sec1}, ${sec2} (%20-30 Görsel Ağırlık)
• Ezoterik / Mikro Detaylar: ${subtleDetailsStr} (%5-10 Görsel Ağırlık)
• Vücut Yerleşimi & Doğal Akış: ${parameters.bodyPlacement} (${parameters.orientation})
• İğne Seçimi & Çizgi Kalınlıkları: ${lineWeight}
• Gölgelendirme Tekniği: ${shadingTechnique}
• Negatif Alan Oranı: ${negativeSpaceRatio}
• 10 Yıllık Yaşlanma / Blowout Koruması: ${agingBlowoutRisk}
• Önerilen Dövme Boyutu: ${recommendedSize}
• Kutsal Çakra Yönergesi: ${chakra.primaryHealingDirective}${morseCodePattern ? `\n• Mors Alfabesi Rakam Şifresi: ${morseCodePattern.rawText} ➔ [${morseCodePattern.morseDisplay}] (${morseCodePattern.tattooSpecification.split('\n')[0].replace('- ', '')})` : ''}
`.trim();

  const turkishPromptExplanation = `
**Tasarım Reçetesinden Görsel Promptuna Veri Akış Haritası:**
- **Ana Odak Sembolü (%60–70 Görsel Ağırlık):** ${mainSymbol} (Baskın merkezi figür, net kontur ve en yüksek kontrast)
- **Yardımcı Semboller (%20–30 Görsel Ağırlık):** ${sec1} ve ${sec2} (Ana figürün anatomisine ve akışına organik entegre edilmiş)
- **Gizli / Ezoterik Detaylar (%5–10 Görsel Ağırlık):** ${subtleDetailsStr} (Mikro dotwork, numerolojik mühür ve kutsal geometri matrisi)
- **Çakra Dengeleme Rezonansı:** ${chakra.primaryHealingDirective}
- **Seçilen Dövme Stilleri:** ${stylesStr} → (${englishStyleDescriptions})
- **Kompozisyon & Yönelim:** ${parameters.composition} | ${parameters.orientation} | Hedef Bölge: ${parameters.bodyPlacement}
- **Dövme Uygulanabilirliği:** ${lineWeight} | ${negativeSpaceRatio} negatif alan | ${shadingTechnique} | Min 2 mm çizgi aralığı (Anti-Aging Blowout Koruması)
- **Format:** Tekil ve bütüncül dövme tasarımı (Single cohesive tattoo flash / stencil), temiz izole zeminde, model/deri mockup içermez.
  `.trim();

  // 9. Comprehensive Anti-Slop & Anti-Mockup Negative Prompt
  const noAnimalNegative = !includeTotem ? ', animal, beast, bird, wolf, raven, eagle, predator, creature, fauna, wildlife' : '';
  const negativePrompt = `
decorative wallpaper, seamless pattern, ornamental background pattern, generic fantasy illustration, concept art, book cover, poster design, logo, emblem, random collection of symbols, separate floating symbols, unrelated decorative elements, excessive geometry, overcrowded composition, tattoo mockup, skin, body, arm, hand, photograph, human model, 3D render, photorealistic skin pores, blurry gradients, unreadable micro clutter, messy background, watermarks, text lettering, signatures, oversaturated rainbow colors, distorted anatomy, extra limbs, muddy gray fills${noAnimalNegative}
  `.trim().replace(/\s+/g, ' ');

  const title = `${person.name} - ${mainSymbol} & ${sec1} (${stylesStr})`;

  const shadowAnalysis = generateShadowArchetypeAnalysis(
    person,
    numerology,
    astrology,
    enneagram,
    symbolism,
    chakra,
    parameters
  );

  const symbolicIntegration = executeSymbolicIntegrationEngine({
    person,
    numerology,
    astrology,
    enneagram,
    symbolism,
    chakra,
    designParameters: parameters
  });

  const prescription = generatePersonalSymbolPrescription({
    person,
    numerology,
    astrology,
    enneagram,
    symbolism,
    chakra,
    designParameters: parameters
  });

  return {
    id: `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    clientId: person.id,
    clientName: person.name,
    title,
    createdAt: new Date().toISOString(),
    personData: person,
    numerology,
    astrology,
    enneagram,
    symbolism,
    parameters,
    chakra,
    morseCodePattern,
    shadowAnalysis,
    shadowDossierMarkdown: shadowAnalysis.fullMarkdownDossier,
    symbolicIntegration,
    prescription,
    symbolRationales: rationales,
    subtleDetails,
    symbolInterconnection: symbolism.symbolInterconnection,
    compositionGuide,
    placementAnatomyNotes,
    needleAndTechniqueGuide: needleTechnique,
    artisticAtmosphereGuide,
    feasibility,
    summaryRationale,
    masterEnglishPrompt: symbolicIntegration.masterIntegratedAiPrompt || masterEnglishPrompt,
    masterOutlinePrompt,
    masterShadedPrompt,
    midjourneyPrompt: shadowAnalysis.section12Prompts.midjourneyMasterPrompt || midjourneyPrompt,
    dalle3Prompt: shadowAnalysis.section12Prompts.dalle3Prompt || dalle3Prompt,
    stencilPrompt: shadowAnalysis.section12Prompts.stencilPrompt || stencilPrompt,
    fluxPrompt: shadowAnalysis.section12Prompts.fluxPrompt || fluxPrompt,
    artistSpecSheet: shadowAnalysis.section11TattooArtistBrief || artistSpecSheet,
    turkishPromptExplanation,
    negativePrompt: shadowAnalysis.section12Prompts.negativePrompt || negativePrompt,
    promptParameters: {
      aspectRatio: '2:3',
      stylizeLevel: '200',
      recommendedEngine: 'Midjourney v6.1 / Flux.1 / Stable Diffusion'
    }
  };
}

