import assert from 'node:assert';
import {
  SYMBOL_LIBRARY,
  PLANT_SYMBOLS,
  GEOMETRY_SYMBOLS,
  MYTHOLOGY_SYMBOLS,
  SACRED_OBJECT_SYMBOLS,
  ANIMAL_SYMBOLS,
  COSMIC_SYMBOLS,
  ELEMENT_SYMBOLS,
  matchPersonalizedSymbols,
  getSymbolById,
  getSymbolsByCategory
} from '../src/utils/symbolLibraryData';
import { generateTattooRecipe } from '../src/utils/recipeGenerator';
import { deriveSymbolismProfile } from '../src/utils/symbolism';
import { calculateNumerology } from '../src/utils/numerology';
import { calculateAstrology } from '../src/utils/astrology';
import { getEnneagramProfile } from '../src/utils/enneagram';
import { calculateChakraProfile } from '../src/utils/chakra';

console.log('--- RUNNING SYMBOL LIBRARY INTEGRITY & PERSONALIZATION TESTS ---');

// 1. Total Count & Category Breakdown
console.log(`Total symbols in library: ${SYMBOL_LIBRARY.length}`);
assert.ok(SYMBOL_LIBRARY.length >= 100, `Expected at least 100 symbols, got ${SYMBOL_LIBRARY.length}`);

console.log(`- Bitki/Çiçek: ${PLANT_SYMBOLS.length}`);
console.log(`- Geometri: ${GEOMETRY_SYMBOLS.length}`);
console.log(`- Mitoloji: ${MYTHOLOGY_SYMBOLS.length}`);
console.log(`- Kutsal Obje: ${SACRED_OBJECT_SYMBOLS.length}`);
console.log(`- Hayvan: ${ANIMAL_SYMBOLS.length}`);
console.log(`- Kozmik: ${COSMIC_SYMBOLS.length}`);
console.log(`- Element: ${ELEMENT_SYMBOLS.length}`);

assert.ok(PLANT_SYMBOLS.length >= 15, 'Plant symbols should be at least 15');
assert.ok(GEOMETRY_SYMBOLS.length >= 15, 'Geometry symbols should be at least 15');
assert.ok(MYTHOLOGY_SYMBOLS.length >= 12, 'Mythology symbols should be at least 12');
assert.ok(SACRED_OBJECT_SYMBOLS.length >= 12, 'Sacred object symbols should be at least 12');
assert.ok(ANIMAL_SYMBOLS.length >= 15, 'Animal symbols should be at least 15');
assert.ok(COSMIC_SYMBOLS.length >= 8, 'Cosmic symbols should be at least 8');
assert.ok(ELEMENT_SYMBOLS.length >= 8, 'Element symbols should be at least 8');

// 2. Duplicate ID & Required Fields Verification
const seenIds = new Set<string>();
for (const sym of SYMBOL_LIBRARY) {
  assert.ok(!seenIds.has(sym.id), `Duplicate symbol id found: ${sym.id}`);
  seenIds.add(sym.id);

  assert.ok(sym.name && sym.name.trim().length > 0, `Symbol ${sym.id} has empty name`);
  assert.ok(sym.category && sym.category.trim().length > 0, `Symbol ${sym.id} has empty category`);
  assert.ok(sym.meaning && sym.meaning.trim().length > 0, `Symbol ${sym.id} has empty meaning`);
  assert.ok(sym.numerologyConnection, `Symbol ${sym.id} missing numerologyConnection`);
  assert.ok(sym.astrologyConnection, `Symbol ${sym.id} missing astrologyConnection`);
  assert.ok(sym.enneagramConnection, `Symbol ${sym.id} missing enneagramConnection`);
  assert.ok(Array.isArray(sym.visualKeywords) && sym.visualKeywords.length > 0, `Symbol ${sym.id} missing visualKeywords`);
}

// 3. Backwards Compatibility: Original 23 Symbols Must Be Preserved
const original23Ids = [
  'sym-wolf', 'sym-raven', 'sym-serpent', 'sym-owl',
  'sym-phoenix', 'sym-stag', 'sym-lion', 'sym-moth',
  'sym-lotus', 'sym-black-rose', 'sym-oak', 'sym-aconite',
  'sym-metatron', 'sym-flower-of-life', 'sym-fibonacci', 'sym-sri-yantra',
  'sym-hekate', 'sym-anubis', 'sym-prometheus',
  'sym-dagger', 'sym-hourglass', 'sym-compass', 'sym-key'
];

for (const id of original23Ids) {
  const sym = getSymbolById(id);
  assert.ok(sym, `Original symbol ID ${id} must exist in the expanded library`);
}

// 4. Animal Line Abstraction Rule Check
for (const sym of ANIMAL_SYMBOLS) {
  assert.strictEqual(
    sym.designCompatibility?.canBeAbstractedToLines,
    true,
    `Animal symbol ${sym.id} must support line abstraction`
  );
  assert.ok(
    sym.designCompatibility?.abstractGeometricEquivalent &&
    sym.designCompatibility.abstractGeometricEquivalent.length > 10,
    `Animal symbol ${sym.id} must define an abstractGeometricEquivalent`
  );
}

// 5. Intelligent Personalization Matcher Check
const mockPerson = {
  id: 'test_client_1',
  name: 'Gizem Güneş',
  birthDate: '1995-07-21',
  birthTime: '14:30',
  birthPlace: 'İstanbul',
  motherName: 'Ayşe',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  totemAnswers: { 1: '1a', 2: '2b', 3: '3d', 4: '4c', 5: '5a', 6: '6d', 7: '7b', 8: '8a', 9: '9d', 10: '10a', 11: '11c', 12: '12d', 13: '13b', 14: '14a', 15: '15c' } as any
};

const num = calculateNumerology(mockPerson.name, mockPerson.birthDate);
const astro = calculateAstrology(mockPerson.birthDate, mockPerson.birthTime, { lat: 41.0082, lon: 28.9784 });
const ennea = getEnneagramProfile(4, '4w5');
const symb = deriveSymbolismProfile(num, astro, ennea, mockPerson);
const chk = calculateChakraProfile(num, astro);

const matches = matchPersonalizedSymbols(SYMBOL_LIBRARY, {
  numerology: num,
  astrology: astro,
  enneagram: ennea,
  symbolism: symb,
  chakra: chk,
  allowAnimalFigures: false,
  limit: 8
});

assert.ok(matches.length > 0, 'Personalized matcher should return resonant symbols');
assert.ok(matches[0].score > 0, 'Top match should have positive score');
for (const match of matches) {
  assert.ok(match.matchReasons.length > 0, `Match ${match.symbol.name} must have documented rationale`);
  if (match.symbol.category === 'Hayvan') {
    assert.strictEqual(match.isAnimalSuppressedToGeometry, true, 'Animals must be converted to geometry when animal figures are not allowed');
    assert.ok(match.abstractGeometricGuidance, 'Abstract guidance must be provided for animal');
  }
}

// 6. Strict Exclusion Check
const topSymbolName = matches[0].symbol.name;
const matchesWithExclusion = matchPersonalizedSymbols(SYMBOL_LIBRARY, {
  numerology: num,
  astrology: astro,
  enneagram: ennea,
  symbolism: symb,
  chakra: chk,
  excludedSymbols: [{ name: topSymbolName, reason: 'Kullanıcı istemedi' }],
  limit: 8
});

assert.ok(
  !matchesWithExclusion.some(m => m.symbol.name === topSymbolName),
  `Excluded symbol ${topSymbolName} MUST NOT be returned in recommendations`
);

// 7. Recipe Generation Exclusion Integrity
const recipe = generateTattooRecipe(mockPerson, num, astro, ennea, symb, {
  selectedStyles: ['Fine Line', 'Geometric'],
  composition: 'Dinamik Asimetrik & Kutsal Odak',
  orientation: 'Dikey (Anatomik)',
  bodyPlacement: 'Önkol İç (Forearm)',
  density: 'Dengeli & Net (%60)',
  colorScheme: 'Saf Monokrom Siyah',
  mainSymbol: 'Kutsal Lotus (Nilüfer)',
  secondarySymbols: ['Metatron Küpü (Metatron Cube)', 'Zaman Kum Saati (Hourglass & Chronos)'],
  visualAtmosphere: 'Mistik & Ezoterik',
  includeTotemInDesign: false,
  excludedDesignSymbols: [{ name: 'Metatron Küpü (Metatron Cube)', reason: 'Danışan istemiyor' }]
});

// The excluded symbol must not leak into master prompts
assert.ok(!recipe.masterEnglishPrompt.toLowerCase().includes('metatron küpü'), 'Excluded symbol should be stripped from master English prompt');
assert.ok(!recipe.masterOutlinePrompt?.toLowerCase().includes('metatron küpü'), 'Excluded symbol should be stripped from master outline prompt');
assert.ok(recipe.excludedSymbols && recipe.excludedSymbols.length === 1, 'Recipe should maintain excludedSymbols audit array');
assert.strictEqual(recipe.excludedSymbols[0].name, 'Metatron Küpü (Metatron Cube)');

console.log('✓ All symbol library integrity and personalization tests PASSED successfully!');
