import assert from 'node:assert/strict';
import {
  calculateSunEclipticLongitude,
  calculateMoonEclipticLongitude,
  calculateAscendantLongitude,
  getSignFromLongitude,
  formatDegreeInSign
} from '../src/utils/astrology';

const J2000 = 2451545.0;

for (const jd of [J2000 - 100000, J2000, J2000 + 100000]) {
  const sun = calculateSunEclipticLongitude(jd);
  const moon = calculateMoonEclipticLongitude(jd);
  assert.ok(Number.isFinite(sun) && sun >= 0 && sun < 360);
  assert.ok(Number.isFinite(moon) && moon >= 0 && moon < 360);
}

for (const lon of [0, 29.999999, 30, 359.999999, 360, -0.000001, -30]) {
  const result = getSignFromLongitude(lon);
  assert.ok(result.signIndex >= 0 && result.signIndex < 12);
  assert.ok(result.degreeInSign >= 0 && result.degreeInSign < 30);
}

const asc = calculateAscendantLongitude(J2000, 41.0082, 28.9784);
assert.ok(Number.isFinite(asc.ascendantLong));
assert.ok(asc.ascendantLong >= 0 && asc.ascendantLong < 360);
assert.ok(asc.lstDeg >= 0 && asc.lstDeg < 360);
assert.ok(asc.gmstDeg >= 0 && asc.gmstDeg < 360);

assert.equal(formatDegreeInSign(59.999, 'İkizler').startsWith('29°'), true);
assert.equal(formatDegreeInSign(60, 'Yengeç'), '0° 00\' Yengeç');

console.log('Astrology math boundary tests passed');
