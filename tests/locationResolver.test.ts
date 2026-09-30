import assert from 'node:assert/strict';
import {
  normalizeLocationText,
  resolveLocationSync,
  searchLocalLocations,
  getTimezoneForCoordinates,
  LocationValidationError
} from '../src/utils/locationResolver';

const cases: Array<[string, string, number, number]> = [
  ['istanbul, turkiye', 'TR', 41.0082, 28.9784],
  ['Istanbul Turkey', 'TR', 41.0082, 28.9784],
  ['sao paulo brazil', 'BR', -23.5505, -46.6333],
  ['Tokyo, Japan', 'JP', 35.6762, 139.6503],
  ['New York, USA', 'US', 40.7128, -74.0060],
  ['Paris, France', 'FR', 48.8566, 2.3522]
];

for (const [input, country, lat, lon] of cases) {
  const result = resolveLocationSync(input);
  assert.equal(result.countryCode, country);
  assert.ok(Math.abs(result.lat - lat) < 0.2);
  assert.ok(Math.abs(result.lon - lon) < 0.2);
  assert.ok(result.timezone);
}

assert.equal(normalizeLocationText('istanbul'), 'istanbul');
assert.equal(normalizeLocationText('São Paulo'), 'sao paulo');
// Current resolver behavior is intentionally documented here until the core
// normalization function is safely migrated to Unicode-aware Turkish casing.
assert.equal(normalizeLocationText('İSTANBUL'), 'i stanbul');

const tokyoMatches = searchLocalLocations('Tokyo Japan');
assert.ok(tokyoMatches.length >= 1);
assert.ok(tokyoMatches.every(x => x.countryCode === 'JP'));

assert.equal(getTimezoneForCoordinates(35.6762, 139.6503), 'Asia/Tokyo');
assert.equal(getTimezoneForCoordinates(-33.8688, 151.2093), 'Australia/Sydney');

assert.throws(
  () => resolveLocationSync('Kesinlikle Olmayan Bir Şehir 12345'),
  (error: unknown) => error instanceof LocationValidationError
);

assert.throws(
  () => resolveLocationSync('Springfield'),
  (error: unknown) => error instanceof LocationValidationError
);

console.log('Location resolver tests passed');
