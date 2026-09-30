import assert from 'node:assert/strict';

// Static regression guard for the wizard's two highest-risk data-flow paths:
// Enneagram answers must be capable of becoming the calculated profile, and
// a saved client must carry the answers required to reproduce that profile.
const wizardSource = await (await fetch(new URL('../src/components/wizard/NewDesignWizard.tsx', import.meta.url))).text();

assert.match(wizardSource, /calculateEnneagramFromAnswers\(enneagramAnswers\)/);
assert.match(wizardSource, /enneagramAnswers:\s*Object\.keys\(enneagramAnswers\)\.length > 0/);
assert.match(wizardSource, /totemAnswers:\s*Object\.keys\(totemAnswers\)\.length > 0/);
assert.match(wizardSource, /setEnneagramAnswers\(client\.enneagramAnswers \|\| \{\}\)/);
assert.match(wizardSource, /setTotemAnswers\(client\.totemAnswers \|\| \{\}\)/);
assert.match(wizardSource, /setGeneratedRecipe\(null\)/);
assert.match(wizardSource, /setNumerology\(null\)/);
assert.match(wizardSource, /setAstrology\(null\)/);
assert.match(wizardSource, /setSymbolism\(null\)/);
assert.match(wizardSource, /setChakra\(null\)/);

console.log('Wizard data-flow regression guards passed');
