import {
  SymbolLibraryItem,
  NumerologyProfile,
  AstrologyProfile,
  EnneagramProfile,
  SymbolismProfile,
  ChakraProfile
} from '../../types';

export interface SymbolMatchScore {
  symbol: SymbolLibraryItem;
  score: number;
  matchReasons: string[];
  suggestedRole: 'PRIMARY' | 'SECONDARY' | 'ACCENT' | 'SUBTLE';
  displayRepresentation: string;
  isAnimalSuppressedToGeometry: boolean;
  abstractGeometricGuidance?: string;
}

export interface PersonalizedSymbolQuery {
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  enneagram: EnneagramProfile;
  symbolism?: SymbolismProfile;
  chakra?: ChakraProfile;
  excludedSymbols?: Array<{ name: string; reason?: string }>;
  allowAnimalFigures?: boolean;
  preferredCategory?: string;
  limit?: number;
}

/**
 * Kişinin astrolojik, numerolojik, Enneagram ve çakra analizlerine göre
 * sembol kütüphanesinden en rezonanslı, kişiselleştirilmiş sembolleri puanlar ve önerir.
 * 
 * Kesin kurallar:
 * 1. Hariç tutulan (excluded) semboller kesinlikle filtrelenir (0 tolerans).
 * 2. allowAnimalFigures === false ise hayvan figürleri ya elenir ya da
 *    soyut çizgi/geometrik eşdeğerlerine dönüştürülür.
 * 3. Mevcut hiçbir hesaplama motorunun sonucunu değiştirmez; sadece kütüphaneden
 *    en uyumlu zenginleştirici sembolleri bulur.
 */
export function matchPersonalizedSymbols(
  library: SymbolLibraryItem[],
  query: PersonalizedSymbolQuery
): SymbolMatchScore[] {
  const {
    numerology,
    astrology,
    enneagram,
    symbolism,
    chakra,
    excludedSymbols = [],
    allowAnimalFigures = false,
    preferredCategory,
    limit = 12
  } = query;

  const excludedNormalized = new Set(
    excludedSymbols
      .map(item => item?.name?.trim().toLocaleLowerCase('tr-TR'))
      .filter(Boolean)
  );

  const isExcluded = (name: string): boolean => {
    const norm = name.trim().toLocaleLowerCase('tr-TR');
    for (const ex of excludedNormalized) {
      if (norm === ex || norm.startsWith(ex + ' —') || norm.startsWith(ex + ' -') || ex.includes(norm)) {
        return true;
      }
    }
    return false;
  };

  const results: SymbolMatchScore[] = [];

  const lp = numerology.lifePathNumber;
  const destiny = numerology.destinyNumber;
  const missingNumbers = numerology.missingNumbers || [];
  const dominantElement = astrology.dominantElement;
  const sunSign = astrology.sunSign;
  const moonSign = astrology.moonSign;
  const ascSign = astrology.ascendantSign;
  const enneaType = enneagram.type;
  const enneaGrowth = enneagram.growthPoint;

  for (const sym of library) {
    // 1. Hariç tutulan sembol kontrolü
    if (isExcluded(sym.name) || (sym.id && isExcluded(sym.id))) {
      continue;
    }

    // 2. Kategori filtresi
    if (preferredCategory && preferredCategory !== 'Hepsi' && sym.category !== preferredCategory) {
      continue;
    }

    let score = 0;
    const matchReasons: string[] = [];

    // Numeroloji Eşleşmesi
    if (sym.relatedNumerology) {
      if (sym.relatedNumerology.includes(lp)) {
        score += 8;
        matchReasons.push(`Yaşam Yolu ${lp} titreşimi ile doğrudan rezonans`);
      }
      if (sym.relatedNumerology.includes(destiny)) {
        score += 4;
        matchReasons.push(`İfade Sayısı ${destiny} kulvarı ile uyumlu`);
      }
      // Eksik çakra/karmik borç giderme
      const correctsMissing = sym.relatedNumerology.filter(num => missingNumbers.includes(num));
      if (correctsMissing.length > 0) {
        score += 7;
        matchReasons.push(`İsimdeki eksik ${correctsMissing.join(', ')} frekansını dengeleyici`);
      }
    }

    // Astroloji Eşleşmesi
    if (sym.relatedAstrology) {
      if (sym.relatedAstrology.includes(sunSign)) {
        score += 7;
        matchReasons.push(`Güneş ${sunSign} temel iradesi ile uyumlu`);
      }
      if (sym.relatedAstrology.includes(ascSign)) {
        score += 6;
        matchReasons.push(`Yükselen ${ascSign} dışavurum aurası ile rezonans`);
      }
      if (sym.relatedAstrology.includes(moonSign)) {
        score += 5;
        matchReasons.push(`Ay ${moonSign} duygusal derinliğini yansıtır`);
      }
    }

    // Element Eşleşmesi
    if (sym.relatedElements && dominantElement) {
      if (sym.relatedElements.includes(dominantElement as any)) {
        score += 6;
        matchReasons.push(`Hakim ${dominantElement} elementiyle doğal rezonans`);
      }
    }

    // Enneagram Eşleşmesi
    if (sym.relatedEnneagram) {
      if (sym.relatedEnneagram.includes(enneaType)) {
        score += 6;
        matchReasons.push(`Enneagram Tip ${enneaType} temel motivasyonunu destekler`);
      }
      if (enneaGrowth && sym.relatedEnneagram.includes(enneaGrowth)) {
        score += 5;
        matchReasons.push(`Enneagram Tip ${enneaGrowth} büyüme noktasına köprü kurar`);
      }
    }

    // Çakra Şifası Eşleşmesi
    if (sym.relatedChakras && chakra?.blockedChakras) {
      const blockedNumbers = chakra.blockedChakras.map(c => c.number);
      const healingMatch = sym.relatedChakras.filter(ch => blockedNumbers.includes(ch));
      if (healingMatch.length > 0) {
        score += 8;
        matchReasons.push(`Blokajlı ${healingMatch.join(', ')}. çakra için şifa geometrisi`);
      }
    }

    // Hayvan sembollerinin figürsüz soyutlama kontrolü
    const isAnimal = sym.category === 'Hayvan';
    let isAnimalSuppressedToGeometry = false;
    let displayRep = sym.name;
    let abstractGuidance: string | undefined = undefined;

    if (isAnimal) {
      if (!allowAnimalFigures) {
        isAnimalSuppressedToGeometry = true;
        const geomEquiv = sym.designCompatibility?.abstractGeometricEquivalent;
        displayRep = geomEquiv 
          ? `${sym.name} (Çizgisel Soyutlama: ${geomEquiv.substring(0, 50)}...)`
          : `${sym.name} (Geometrik Hatlar)`;
        abstractGuidance = geomEquiv;
        matchReasons.push('Kişi tercihi: Figüratif hayvan yerine arketipsel çizgisel/geometrik motif kullanılır.');
      }
    }

    // Eğer sembol kişinin profiline hiç rezonans vermiyorsa (score <= 0), listeye alınmaz
    if (score > 0) {
      let suggestedRole: 'PRIMARY' | 'SECONDARY' | 'ACCENT' | 'SUBTLE' = 'SECONDARY';
      if (score >= 18) {
        suggestedRole = 'PRIMARY';
      } else if (score >= 10) {
        suggestedRole = 'SECONDARY';
      } else if (score >= 6) {
        suggestedRole = 'ACCENT';
      } else {
        suggestedRole = 'SUBTLE';
      }

      results.push({
        symbol: sym,
        score,
        matchReasons,
        suggestedRole,
        displayRepresentation: displayRep,
        isAnimalSuppressedToGeometry,
        abstractGeometricGuidance: abstractGuidance
      });
    }
  }

  // Puanına göre sırala
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
