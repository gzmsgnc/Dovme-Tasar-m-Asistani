import assert from 'node:assert/strict';
import { validateRecipeSymbolism } from '../src/utils/recipeGenerator';
import type { SymbolismProfile } from '../src/types';

function profile(overrides: Partial<SymbolismProfile> = {}): SymbolismProfile {
  return {
    totemAnimal: 'Kızıl Geyik',
    totemAnimalId: 'kizil_geyik',
    totemAnimalMeaning: 'test',
    totemHierarchy: [],
    neededSymbols: [],
    secondaryAnimals: [],
    plantFlora: 'Lavanta',
    plantFloraMeaning: 'test',
    element: 'Toprak',
    elementMeaning: 'test',
    crystalStone: 'Kuvars',
    crystalStoneMeaning: 'test',
    mythologicalFigure: 'Artemis',
    mythologicalFigureMeaning: 'test',
    sacredObject: 'Lotus',
    sacredObjectMeaning: 'test',
    geometricSymbol: 'Yaşam Çiçeği',
    geometricSymbolMeaning: 'test',
    colorPalette: ['Siyah'],
    colorThemeDescription: 'test',
    mainTheme: 'test',
    emotionalTheme: 'test',
    enneagramShadowTraits: ['test gölge'],
    enneagramShadowSymbolicMeaning: 'test anlam',
    chakraBalanceScore: 76,
    blockedChakraNumbers: [1, 4],
    dominantChakraNumbers: [2, 3],
    primaryChakraHealingDirective: 'test directive',
    primaryChakraAffirmation: 'test affirmation',
    characterTraitSymbols: [],
    subtleDetails: [],
    symbolInterconnection: 'test',
    totemTestResult: {
      primaryTotem: { id: 'kizil_geyik', name: 'Kızıl Geyik' },
      secondaryTotem: { id: 'bal_porsugu', name: 'Bal Porsuğu' },
      shadowTotem: { id: 'su_samuru', name: 'Su Samuru' },
      topMatches: [],
      confidenceScore: 80,
      isProximityClose: false,
      proximityDifference: 10,
      crossEnneagramInsight: 'test'
    },
    ...overrides
  };
}

validateRecipeSymbolism(profile());

assert.throws(
  () => validateRecipeSymbolism(profile({ totemAnimal: 'Bal Porsuğu' })),
  /totem sonuçları ile sembolizm profili eşleşmiyor/
);

assert.throws(
  () => validateRecipeSymbolism(profile({ totemAnimalId: 'bal_porsugu' })),
  /hesaplanmış totem kimlikleri eşleşmiyor/
);

assert.throws(
  () => validateRecipeSymbolism(profile({ totemAnimal: '' })),
  /hesaplanmış kişisel totem bulunamadı/
);

console.log('Recipe integrity tests passed');
