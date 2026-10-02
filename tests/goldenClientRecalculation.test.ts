import assert from 'node:assert/strict';
import { calculateNumerology } from '../src/utils/numerology';
import { calculateAstrology } from '../src/utils/astrology';
import { calculateUserBehavioralVector, calculateBehavioralTotemResult } from '../src/utils/behavioralTotemEngine';

const elifAnswers = {1:'1a',2:'2b',3:'3d',4:'4c',5:'5a',6:'6d',7:'7b',8:'8a',9:'9d',10:'10a',11:'11c',12:'12d',13:'13b',14:'14a',15:'15c'} as any;
const mertAnswers = {1:'1b',2:'2c',3:'3b',4:'4d',5:'5d',6:'6a',7:'7c',8:'8b',9:'9a',10:'10d',11:'11a',12:'12b',13:'13d',14:'14c',15:'15a'} as any;

const elifNumerology = calculateNumerology('Elif Karaca', '1988-02-17');
assert.equal(elifNumerology.lifePathNumber, 9);
assert.equal(elifNumerology.destinyNumber, 4);
assert.equal(elifNumerology.soulUrgeNumber, 8);
assert.equal(elifNumerology.personalityNumber, 5);
assert.equal(elifNumerology.dmNumber, 4);
assert.equal(elifNumerology.divineHelp19?.has19, false);

const mertNumerology = calculateNumerology('Mert Yıldırım', '1994-08-09');
assert.equal(mertNumerology.lifePathNumber, 4);
assert.equal(mertNumerology.destinyNumber, 11);
assert.equal(mertNumerology.soulUrgeNumber, 5);
assert.equal(mertNumerology.personalityNumber, 6);
assert.equal(mertNumerology.dmNumber, 6);
assert.equal(mertNumerology.divineHelp19?.has19, false);

const elifAstro = calculateAstrology('1988-02-17','22:40','İzmir, Türkiye','Tropical');
assert.ok(Math.abs(elifAstro.sunLongitude - 328.4085) < 0.05);
assert.ok(Math.abs(elifAstro.moonLongitude - 331.2303) < 0.05);
assert.ok(Math.abs(elifAstro.ascendantLongitude - 207.6113) < 0.05);

const mertAstro = calculateAstrology('1994-08-09','07:25','Bursa, Türkiye','Tropical');
assert.ok(Math.abs(mertAstro.sunLongitude - 136.3723) < 0.05);
assert.ok(Math.abs(mertAstro.moonLongitude - 159.6785) < 0.05);
assert.ok(Math.abs(mertAstro.ascendantLongitude - 150.4210) < 0.05);

assert.deepEqual(calculateUserBehavioralVector(elifAnswers), {
  independence:97,socialConnection:95,protectiveness:85,observation:93,courageRisk:83,patience:91,adaptability:91,curiosity:95,intuition:85,leadership:90,stealth:90,resilience:88,freedomNeed:98,territorialBoundary:85,cooperation:98,competitiveness:68,threatReflex:80,solitudeNeed:85,socialEnergy:62,crisisBehavior:87
});
assert.deepEqual(calculateUserBehavioralVector(mertAnswers), {
  independence:90,socialConnection:88,protectiveness:94,observation:92,courageRisk:86,patience:77,adaptability:88,curiosity:90,intuition:93,leadership:81,stealth:55,resilience:94,freedomNeed:94,territorialBoundary:95,cooperation:93,competitiveness:95,threatReflex:88,solitudeNeed:90,socialEnergy:78,crisisBehavior:98
});

for (const [answers, element] of [[elifAnswers,'Hava'],[mertAnswers,'Toprak']] as const) {
  const result = calculateBehavioralTotemResult(answers, 4, { dominantElement: element });
  assert.equal(result.topMatches.length, 10);
  assert.ok(result.confidenceScore >= 0 && result.confidenceScore <= 100);
  assert.ok(result.primaryTotem.id);
  assert.ok(result.secondaryTotem.id);
  assert.ok(result.shadowTotem.id);
}

console.log('Golden client recalculation tests passed');
