import assert from 'node:assert/strict';
import { getTimezoneOffsetHoursForDate } from '../src/utils/locationResolver';
import { calculateAstrology } from '../src/utils/astrology';

assert.equal(
  getTimezoneOffsetHoursForDate('2026-01-15', '12:00', 'Europe/Istanbul', 3),
  3
);

assert.equal(
  getTimezoneOffsetHoursForDate('1991-11-24', '03:15', 'Europe/Istanbul', 2),
  2
);

assert.equal(
  getTimezoneOffsetHoursForDate('2026-07-15', '12:00', 'Europe/Berlin'),
  2
);

assert.equal(
  getTimezoneOffsetHoursForDate('2026-01-15', '12:00', 'Europe/Berlin'),
  1
);

assert.equal(
  getTimezoneOffsetHoursForDate('2026-01-15', '12:00', 'Asia/Kolkata'),
  5.5
);

const historicalTurkey = calculateAstrology(
  '1991-11-24',
  '03:15',
  'Fatih, İstanbul, Türkiye',
  'Tropical'
);
assert.equal(historicalTurkey.astronomicalDetails.timezoneOffsetHours, 2);

const modernTurkey = calculateAstrology(
  '2026-09-29',
  '03:15',
  'Fatih, İstanbul, Türkiye',
  'Tropical'
);
assert.equal(modernTurkey.astronomicalDetails.timezoneOffsetHours, 3);

console.log('Timezone integrity tests passed');
