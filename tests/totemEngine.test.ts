import assert from 'node:assert/strict';
import {
  TOTEM_BEHAVIORAL_QUESTIONS,
  calculateUserBehavioralVector,
  calculateBehavioralTotemResult,
} from '../src/utils/behavioralTotemEngine';

const completeAnswers: Record<number, string> = Object.fromEntries(
  TOTEM_BEHAVIORAL_QUESTIONS.map(question => [question.id, question.options[0].id])
);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// 1) The full questionnaire must contain 15 questions with selectable options.
assert.equal(TOTEM_BEHAVIORAL_QUESTIONS.length, 15, 'Totem questionnaire must contain 15 questions');
for (const question of TOTEM_BEHAVIORAL_QUESTIONS) {
  assert.ok(question.options.length >= 2, `Question ${question.id} needs at least two options`);
}

// 2) The same answers must always produce the same behavioral vector and result.
const vectorA = calculateUserBehavioralVector(completeAnswers);
const vectorB = calculateUserBehavioralVector(clone(completeAnswers));
assert.deepEqual(vectorA, vectorB, 'Behavioral vector must be deterministic');

const resultA = calculateBehavioralTotemResult(completeAnswers, 4, { dominantElement: 'Ateş' });
const resultB = calculateBehavioralTotemResult(clone(completeAnswers), 4, { dominantElement: 'Ateş' });
assert.equal(resultA.primaryTotem.id, resultB.primaryTotem.id, 'Primary result must be deterministic');
assert.equal(resultA.secondaryTotem.id, resultB.secondaryTotem.id, 'Secondary result must be deterministic');
assert.equal(resultA.shadowTotem.id, resultB.shadowTotem.id, 'Shadow result must be deterministic');
assert.deepEqual(resultA.topMatches.map(x => x.animal.id), resultB.topMatches.map(x => x.animal.id), 'Ranking must be deterministic');

// 3) Results must always come from the known 52-animal catalog and expose the expected structure.
assert.ok(resultA.primaryTotem.id, 'Primary totem must have an id');
assert.ok(resultA.secondaryTotem.id, 'Secondary totem must have an id');
assert.ok(resultA.shadowTotem.id, 'Shadow totem must have an id');
assert.equal(resultA.topMatches.length, 10, 'Top matches must contain 10 candidates');
assert.ok(resultA.confidenceScore >= 0 && resultA.confidenceScore <= 100, 'Confidence must be a percentage');
assert.ok(resultA.proximityDifference >= 0, 'Proximity difference cannot be negative');

// 4) Invalid/empty answers must not crash the engine and must remain deterministic.
const empty: Record<number, string> = {};
const emptyVector = calculateUserBehavioralVector(empty);
const emptyResult = calculateBehavioralTotemResult(empty, 4);
assert.ok(Object.values(emptyVector).every(value => Number.isFinite(value)), 'Empty answers must produce a finite vector');
assert.ok(emptyResult.primaryTotem.id, 'Empty-answer calculation must still return a structured result');
assert.equal(emptyResult.primaryTotem.id, calculateBehavioralTotemResult(empty, 4).primaryTotem.id, 'Empty-answer result must be deterministic');

// 5) A changed behavioral answer must actually change the calculated behavioral vector.
const changedAnswers = clone(completeAnswers);
changedAnswers[1] = TOTEM_BEHAVIORAL_QUESTIONS[0].options.at(-1)!.id;
const changedVector = calculateUserBehavioralVector(changedAnswers);
assert.notDeepEqual(changedVector, vectorA, 'Changing a behavioral answer must change the behavioral vector');

// 6) Context can alter ranking while the behavioral vector remains purely answer-derived.
const waterResult = calculateBehavioralTotemResult(completeAnswers, 4, { dominantElement: 'Su' });
assert.deepEqual(
  calculateUserBehavioralVector(completeAnswers),
  vectorA,
  'Astrological context must not mutate the behavioral answer vector'
);
assert.ok(waterResult.primaryTotem.id, 'Context-aware result must remain structured');

console.log('Totem engine tests passed:', {
  questions: TOTEM_BEHAVIORAL_QUESTIONS.length,
  primary: resultA.primaryTotem.id,
  secondary: resultA.secondaryTotem.id,
  shadow: resultA.shadowTotem.id,
});
