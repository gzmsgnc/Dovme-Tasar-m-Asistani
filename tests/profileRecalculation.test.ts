import assert from 'node:assert/strict';
import { calculateNumerology } from '../src/utils/numerology';
import { calculateAstrology } from '../src/utils/astrology';
import { calculateChakraProfile } from '../src/utils/chakra';
import { getEnneagramProfile } from '../src/utils/enneagram';

const istanbul = {
  name: 'Fatih',
  displayName: 'Fatih, İstanbul, Türkiye',
  city: 'Fatih',
  region: 'İstanbul',
  country: 'Türkiye',
  countryCode: 'TR',
  lat: 41.0082,
  lon: 28.9784,
  timezone: 'Europe/Istanbul',
  defaultTz: 3
};

const a = calculateNumerology('Gizem Selma Genç', '1991-11-24');
const b = calculateNumerology('Başka Danışan', '1992-05-17');

assert.notDeepEqual(a, b, 'Numeroloji yeni danışan verisiyle yeniden hesaplanmalı');

const astroA = calculateAstrology('1991-11-24', '03:15', 'Fatih', 'Tropical', istanbul);
const astroB = calculateAstrology('1992-05-17', '14:30', 'Fatih', 'Tropical', istanbul);
assert.notEqual(astroA.sunLongitude, astroB.sunLongitude, 'Astroloji doğum tarihi değişince yeniden hesaplanmalı');
assert.notEqual(astroA.moonLongitude, astroB.moonLongitude, 'Ay konumu yeni doğum verisiyle yeniden hesaplanmalı');

const siderealA = calculateAstrology('1991-11-24', '03:15', 'Fatih', 'Sidereal', istanbul);
assert.notEqual(astroA.sunLongitude, siderealA.sunLongitude, 'Zodyak sistemi değişince Güneş boylamı değişmeli');

const chakraA = calculateChakraProfile(a, astroA);
const chakraB = calculateChakraProfile(b, astroB);
assert.notDeepEqual(chakraA, chakraB, 'Çakra profili yeni numeroloji/astroloji verisiyle yeniden hesaplanmalı');

const enneaA = getEnneagramProfile(4, '4w5');
const enneaB = getEnneagramProfile(8, '8w9');
assert.notDeepEqual(enneaA, enneaB, 'Enneagram seçimi değişince profil değişmeli');

console.log('Profile recalculation tests passed');
