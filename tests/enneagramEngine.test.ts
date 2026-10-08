import assert from 'node:assert/strict';
import { ENNEAGRAM_MINI_TEST_QUESTIONS, calculateEnneagramFromAnswers, getEnneagramProfile } from '../src/utils/enneagram';

assert.ok(ENNEAGRAM_MINI_TEST_QUESTIONS.length >= 5);

const type4Answers = Object.fromEntries(ENNEAGRAM_MINI_TEST_QUESTIONS.map((q) => [q.id, q.options.find(o => o.type === 4)?.type ?? 4]));
const result4 = calculateEnneagramFromAnswers(type4Answers);
assert.equal(result4.type, 4);
assert.ok(result4.wing === '4w3' || result4.wing === '4w5');

const type8Answers = Object.fromEntries(ENNEAGRAM_MINI_TEST_QUESTIONS.map((q) => [q.id, q.options.find(o => o.type === 8)?.type ?? 8]));
const result8 = calculateEnneagramFromAnswers(type8Answers);
assert.equal(result8.type, 8);
assert.ok(result8.wing === '8w7' || result8.wing === '8w9');
assert.notDeepEqual(result4, result8);

const profile = getEnneagramProfile(result4.type, result4.wing, true);
assert.equal(profile.type, 4);
assert.equal(profile.wing, result4.wing);
assert.equal(profile.isDeterminedByTest, true);
assert.ok(profile.shadowTraits.length > 0);
assert.ok(profile.symbolicMeaning.length > 0);

const invalid = getEnneagramProfile(999, '999w1', false);
assert.equal(invalid.type, 4);
assert.equal(invalid.wing, '4w3');

// Test all 9 types can be matched exactly across the 5 questions
for (let t = 1; t <= 9; t++) {
  const answers = Object.fromEntries(
    ENNEAGRAM_MINI_TEST_QUESTIONS.map(q => {
      const opt = q.options.find(o => o.type === t);
      assert.ok(opt, `Question ${q.id} must have option for type ${t}`);
      return [q.id, opt.type];
    })
  );
  const res = calculateEnneagramFromAnswers(answers);
  assert.equal(res.type, t, `All options set to type ${t} must produce type ${t}`);
  assert.ok(res.wing.startsWith(`${t}w`), `Wing must belong to type ${t}`);
}

// Partial answers (e.g. 2 questions answered) must calculate without throwing
const partialRes = calculateEnneagramFromAnswers({ 1: 6, 2: 6 });
assert.equal(partialRes.type, 6);

// Empty answers must safely fallback to type 4
const emptyRes = calculateEnneagramFromAnswers({});
assert.equal(emptyRes.type, 4);

console.log('Enneagram engine tests passed');
