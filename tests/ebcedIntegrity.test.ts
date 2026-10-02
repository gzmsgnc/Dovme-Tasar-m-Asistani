import assert from 'node:assert/strict';
import { calculateSingleEbced, calculateEbcedAndYildizname } from '../src/utils/ebced';

assert.equal(calculateSingleEbced('Elif Karaca'), 347);
assert.equal(calculateSingleEbced('Aylin'), 101);

const result = calculateEbcedAndYildizname('Elif Karaca', 'Aylin');
assert.equal(result.personEbced, 347);
assert.equal(result.motherEbced, 101);
assert.equal(result.totalEbced, 448);
assert.throws(() => calculateEbcedAndYildizname('Elif Karaca'), /anne adı zorunludur/);
assert.throws(() => calculateEbcedAndYildizname('', 'Aylin'), /danışan adı zorunludur/);
assert.throws(() => calculateEbcedAndYildizname('123', 'Aylin'), /danışan adında/i);
assert.throws(() => calculateEbcedAndYildizname('Elif Karaca', '123'), /anne adında/i);

console.log('Ebced integrity tests passed');
