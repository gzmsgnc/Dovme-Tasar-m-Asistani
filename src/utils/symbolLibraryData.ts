import { SymbolLibraryItem } from '../types';
import { PLANT_SYMBOLS } from './symbols/plantSymbols';
import { GEOMETRY_SYMBOLS } from './symbols/geometrySymbols';
import { MYTHOLOGY_SYMBOLS } from './symbols/mythologySymbols';
import { SACRED_OBJECT_SYMBOLS } from './symbols/sacredObjectSymbols';
import { ANIMAL_SYMBOLS } from './symbols/animalSymbols';
import { COSMIC_SYMBOLS } from './symbols/cosmicSymbols';
import { ELEMENT_SYMBOLS } from './symbols/elementSymbols';

export {
  PLANT_SYMBOLS,
  GEOMETRY_SYMBOLS,
  MYTHOLOGY_SYMBOLS,
  SACRED_OBJECT_SYMBOLS,
  ANIMAL_SYMBOLS,
  COSMIC_SYMBOLS,
  ELEMENT_SYMBOLS
};
export { matchPersonalizedSymbols, type SymbolMatchScore, type PersonalizedSymbolQuery } from './symbols/symbolMatcher';

/**
 * Genişletilmiş ve Denetlenmiş Ezoterik Sembol Kütüphanesi
 * 
 * Kategoriler:
 * - Bitki/Çiçek (18 sembol)
 * - Geometri (18 sembol)
 * - Mitoloji (15 sembol)
 * - Kutsal Obje (14 sembol)
 * - Hayvan (18 sembol)
 * - Kozmik (10 sembol)
 * - Element (10 sembol)
 * Toplam: 103 zengin ve profesyonel sembol
 */
const rawSymbolLibrary: SymbolLibraryItem[] = [
  ...PLANT_SYMBOLS,
  ...GEOMETRY_SYMBOLS,
  ...MYTHOLOGY_SYMBOLS,
  ...SACRED_OBJECT_SYMBOLS,
  ...ANIMAL_SYMBOLS,
  ...COSMIC_SYMBOLS,
  ...ELEMENT_SYMBOLS
];

// Duplicate ID ve İsim Güvenlik Kontrolü
const seenIds = new Set<string>();
const sanitizedLibrary: SymbolLibraryItem[] = [];

for (const sym of rawSymbolLibrary) {
  if (seenIds.has(sym.id)) {
    console.warn(`[SymbolLibrary] Duplicate symbol id detected and skipped: ${sym.id}`);
    continue;
  }
  seenIds.add(sym.id);
  sanitizedLibrary.push(sym);
}

export const SYMBOL_LIBRARY: SymbolLibraryItem[] = sanitizedLibrary;

export function getSymbolById(id: string): SymbolLibraryItem | undefined {
  return SYMBOL_LIBRARY.find(sym => sym.id === id);
}

export function getSymbolsByCategory(category: string): SymbolLibraryItem[] {
  if (!category || category === 'Hepsi') return SYMBOL_LIBRARY;
  return SYMBOL_LIBRARY.filter(sym => sym.category === category);
}

export function findSymbolsBySearch(query: string): SymbolLibraryItem[] {
  if (!query?.trim()) return SYMBOL_LIBRARY;
  const q = query.trim().toLowerCase();
  return SYMBOL_LIBRARY.filter(sym =>
    sym.name.toLowerCase().includes(q) ||
    sym.meaning.toLowerCase().includes(q) ||
    sym.category.toLowerCase().includes(q) ||
    (sym.subcategory && sym.subcategory.toLowerCase().includes(q)) ||
    sym.numerologyConnection.toLowerCase().includes(q) ||
    sym.astrologyConnection.toLowerCase().includes(q) ||
    sym.enneagramConnection.toLowerCase().includes(q) ||
    sym.visualKeywords.some(kw => kw.toLowerCase().includes(q))
  );
}
