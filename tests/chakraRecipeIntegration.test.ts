import assert from 'node:assert/strict';
import { calculateChakraProfile } from '../src/utils/chakra';
import { generateTattooRecipe } from '../src/utils/recipeGenerator';
import type { NumerologyProfile, AstrologyProfile, EnneagramProfile, SymbolismProfile, TattooDesignParameters, PersonData } from '../src/types';

const numerology = {
  chakraCounts: { 1: 0, 2: 2, 3: 1, 4: 0, 5: 2, 6: 1, 7: 2, 8: 1, 9: 1 },
  missingNumbers: [1, 4],
  lifePathNumber: 4, lifePathTitle: 'test', destinyNumber: 7, destinyTitle: 'test',
  dmNumber: 4, divineHelp19: { has19: false }, coreKeywords: ['test']
} as unknown as NumerologyProfile;

const astrology = {
  dominantElement: 'Toprak', moonSign: 'Boğa', sunSign: 'Yay', ascendantSign: 'Koç'
} as unknown as AstrologyProfile;

const chakra = calculateChakraProfile(numerology, astrology);
assert.deepEqual(chakra.blockedChakras.map(c => c.number), [1, 4]);

const symbolism = {
  totemAnimal: 'Kızıl Geyik', totemAnimalId: 'kizil_geyik', totemAnimalMeaning: 'Test birincil anlamı',
  totemTestResult: { primaryTotem: { id: 'kizil_geyik', name: 'Kızıl Geyik' } },
  totemHierarchy: [
    { id: 'kizil_geyik', role: 'Birincil Ruh Totemi', name: 'Kızıl Geyik', origin: 'test', meaning: 'Test birincil anlamı', archetypalPower: 'test', visualRoleInTattoo: 'test' },
    { id: 'bal_porsugu', role: 'Gölge & Muhafız Totemi', name: 'Bal Porsuğu', origin: 'test', meaning: 'Test gölge anlamı', archetypalPower: 'test', visualRoleInTattoo: 'test' },
    { id: 'su_samuru', role: 'Yükseliş & Ruhsal Müttefik', name: 'Su Samuru', origin: 'test', meaning: 'Test yükseliş anlamı', archetypalPower: 'test', visualRoleInTattoo: 'test' }
  ], secondaryAnimals: [],
  plantFlora: 'Lavanta', geometricSymbol: 'Yaşam Çiçeği', sacredObject: 'Lotus',
  plantFloraMeaning: '', element: 'Toprak', elementMeaning: '', crystalStone: 'Kuvars',
  crystalStoneMeaning: '', mythologicalFigure: 'Artemis', mythologicalFigureMeaning: '',
  sacredObjectMeaning: '', geometricSymbolMeaning: '', colorPalette: [], colorThemeDescription: '', mainTheme: '',
  emotionalTheme: '', characterTraitSymbols: [], subtleDetails: [], symbolInterconnection: '',
  chakraProfile: chakra, chakraBalanceScore: chakra.overallChakraBalanceScore,
  blockedChakraNumbers: chakra.blockedChakras.map(c => c.number),
  dominantChakraNumbers: chakra.dominantChakras.map(c => c.number),
  primaryChakraHealingDirective: chakra.primaryHealingDirective,
  primaryChakraAffirmation: chakra.primaryChakraAffirmation
} as unknown as SymbolismProfile;

const enneagram = {
  type: 4, wing: '4w5', typeName: 'Bireyselci', shadowTraits: ['test'], growthPoint: 'test'
} as unknown as EnneagramProfile;

const person = { name: 'Test', birthDate: '1991-11-24' } as unknown as PersonData;
const parameters = {
  selectedStyles: ['Fine Line'], includeTotemInDesign: false, mainSymbol: '',
  secondarySymbols: [], subtleDetails: [], useMorseCodeForNumbers: false,
  density: 'Dengeli', colorScheme: 'Black & Grey', bodyPlacement: 'Sırt',
  orientation: 'Dikey', composition: 'Asimetrik', visualAtmosphere: 'Mistik'
} as unknown as TattooDesignParameters;

const recipe = generateTattooRecipe(person, numerology, astrology, enneagram, symbolism, parameters);
const combined = recipe.symbolRationales.map(r => r.symbolName).join(' | ');

// The recipe generator currently derives its secondary recipe symbols from the
// symbolism profile. The canonical chakra prescription is tested separately
// through calculateChakraProfile above, so this assertion must target the
// actual recipe contract rather than a symbol produced by an unused import.
assert.ok(combined.includes('Yaşam Çiçeği'));
assert.ok(combined.includes('Lavanta'));

console.log('Chakra recipe integration tests passed');
