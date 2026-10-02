import assert from 'node:assert/strict';
import { generateTattooRecipe } from '../src/utils/recipeGenerator';
import { calculateChakraProfile } from '../src/utils/chakra';

const person = {
  id: 'prompt-test',
  name: 'Prompt Test Danışan',
  birthDate: '1991-11-24',
  motherName: 'Anne'
} as any;

const numerology = {
  lifePathNumber: 7,
  lifePathTitle: 'Araştırmacı',
  destinyNumber: 5,
  destinyTitle: 'Özgürlük',
  dmNumber: 3,
  missingNumbers: [2],
  divineHelp19: { has19: false },
  coreKeywords: ['derinlik', 'sezgi', 'araştırma']
} as any;

const astrology = {
  sunSign: 'Yay',
  moonSign: 'Balık',
  ascendantSign: 'Koç',
  dominantElement: 'Ateş'
} as any;

const enneagram = {
  type: 4,
  typeName: 'Bireyselci',
  wing: '4w5',
  growthPoint: 'Tip 1',
  shadowTraits: ['kıyaslama', 'içe çekilme']
} as any;

const symbolism = {
  totemAnimal: 'Kızıl Geyik',
  totemAnimalId: 'kizil_geyik',
  totemAnimalMeaning: 'test',
  totemHierarchy: [
    { id: 'kizil_geyik', role: 'Birincil Ruh Totemi', name: 'Kızıl Geyik', origin: 'test', meaning: 'test', archetypalPower: 'test', visualRoleInTattoo: 'test' },
    { id: 'bal_porsugu', role: 'Gölge & Muhafız Totemi', name: 'Bal Porsuğu', origin: 'test', meaning: 'gölge uyumu', archetypalPower: 'koruma', visualRoleInTattoo: 'alt taban' },
    { id: 'su_samuru', role: 'Yükseliş & Ruhsal Müttefik', name: 'Su Samuru', origin: 'test', meaning: 'duygusal uyum', archetypalPower: 'koruyucu esneklik', visualRoleInTattoo: 'akış' }
  ],
  secondaryAnimals: ['Su Samuru'],
  neededSymbols: [],
  plantFlora: 'Lavanta',
  plantFloraMeaning: 'test',
  element: 'Ateş',
  elementMeaning: 'test',
  crystalStone: 'Ametist',
  crystalStoneMeaning: 'test',
  mythologicalFigure: 'Artemis',
  mythologicalFigureMeaning: 'test',
  sacredObject: 'Lotus',
  sacredObjectMeaning: 'test',
  geometricSymbol: 'Metatron Küpü',
  geometricSymbolMeaning: 'test',
  colorPalette: ['Siyah'],
  colorThemeDescription: 'test',
  mainTheme: 'test',
  emotionalTheme: 'test',
  enneagramShadowTraits: ['kıyaslama', 'içe çekilme'],
  enneagramShadowSymbolicMeaning: 'test',
  chakraBalanceScore: 70,
  blockedChakraNumbers: [2],
  dominantChakraNumbers: [6],
  primaryChakraHealingDirective: 'ifade ve dengeyi destekle',
  primaryChakraAffirmation: 'sesimi güvenle ifade ederim',
  shadowTotemName: 'Su Samuru',
  shadowTotemMeaning: 'duygusal uyum',
  shadowTotemPower: 'koruyucu esneklik',
  shadowTotemRole: 'alt taban koruyucu',
  characterTraitSymbols: [],
  subtleDetails: ['gizli düğüm'],
  symbolInterconnection: 'test',
  totemTestResult: {
    primaryTotem: { id: 'kizil_geyik', name: 'Kızıl Geyik' },
    secondaryTotem: { id: 'bal_porsugu', name: 'Bal Porsuğu' },
    shadowTotem: { id: 'su_samuru', name: 'Su Samuru' },
    topMatches: [],
    confidenceScore: 90,
    isProximityClose: false,
    proximityDifference: 10,
    crossEnneagramInsight: 'test'
  }
} as any;

const parameters = {
  selectedStyles: ['Fine Line', 'Dotwork'],
  composition: 'Dinamik Asimetrik',
  orientation: 'Dikey (Anatomik)',
  bodyPlacement: 'Sırt (Omurga)',
  density: 'Dengeli & Net (%60)',
  colorScheme: 'Black & Grey (Gri Gölgelendirme)',
  mainSymbol: 'Kutsal Lotus',
  secondarySymbols: ['Lavanta', 'Metatron Küpü'],
  subtleDetails: ['gizli düğüm'],
  visualAtmosphere: 'Mistik & Ezoterik',
  includeTotemInDesign: false,
  useMorseCodeForNumbers: false
} as any;

const recipe = generateTattooRecipe(person, numerology, astrology, enneagram, symbolism, parameters);

assert.ok(recipe.masterEnglishPrompt.includes('Lavanta'));
assert.ok(recipe.masterEnglishPrompt.includes('Lavanta'));
assert.ok(recipe.masterEnglishPrompt.includes('Metatron Küpü'));
assert.ok(recipe.masterEnglishPrompt.includes('Life Path 7'));
assert.ok(recipe.artisticAtmosphereGuide.includes('kıyaslama'));
assert.ok(recipe.artisticAtmosphereGuide.includes('derinlik'));
assert.ok(recipe.turkishPromptExplanation.includes('Çakra Dengeleme Rezonansı'));
const expectedChakraDirective = calculateChakraProfile(numerology, astrology).primaryHealingDirective;
assert.ok(recipe.turkishPromptExplanation.includes(expectedChakraDirective));
assert.ok(recipe.symbolRationales.some(r => r.esotericConnection.includes('Yaşam Yolu 7')));
assert.equal(recipe.parameters.includeTotemInDesign, false);
assert.ok(!recipe.masterEnglishPrompt.toLowerCase().includes('kızıl geyik'));
assert.ok(!recipe.masterEnglishPrompt.includes('19 İlahi'));
assert.ok(!recipe.masterEnglishPrompt.includes('19-dot matrix'));
const integrationJson = JSON.stringify((recipe as any).symbolicIntegration ?? (recipe as any).symbolIntegrationResult ?? '');
assert.ok(!integrationJson.includes('sym_totem'));
assert.ok(!integrationJson.includes('Totem Kulak & Çene'));

console.log('Final prompt personalization tests passed');
