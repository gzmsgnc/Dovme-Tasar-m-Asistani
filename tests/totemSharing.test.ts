import assert from 'node:assert/strict';
import { 
  generateClientWhatsAppTotemQuizMessage, 
  encodeTotemAnswersToToken, 
  generateClientReturnWhatsAppTotemMessage, 
  parseClientTotemAnswers,
  generateWhatsAppShareLink
} from '../src/utils/totemSharing';
import { parseUniversalClientImport } from '../src/utils/enneagramSharing';

// 1. WhatsApp davet mesajı ve link üretimi
const inviteMsg = generateClientWhatsAppTotemQuizMessage('Deniz', 'https://example.com/?mode=totem-quiz&client=Deniz');
assert.ok(inviteMsg.includes('Deniz'), 'Davet mesajı danışan adını içermeli');
assert.ok(inviteMsg.includes('mode=totem-quiz'), 'Davet mesajı totem linkini içermeli');

const waLink = generateWhatsAppShareLink('05321234567', 'Test');
assert.ok(waLink.includes('wa.me/905321234567') || waLink.includes('5321234567'), 'WhatsApp linki temiz numara içermeli');

// 2. Token kodlama ve geri dönüş mesajı
const sampleAnswers: Record<number, string> = {
  1: '1a', 2: '2b', 3: '3c', 4: '4d', 5: '5a',
  6: '6b', 7: '7c', 8: '8d', 9: '9a', 10: '10b',
  11: '11c', 12: '12d', 13: '13a', 14: '14b', 15: '15c'
};

const token = encodeTotemAnswersToToken(sampleAnswers, 'Deniz Yılmaz');
assert.ok(token.startsWith('[TOTEM-TOKEN:'), 'Token [TOTEM-TOKEN: ile başlamalı');
assert.ok(token.includes('|Deniz Yılmaz]'), 'Token danışan adını içermeli');

const returnMsg = generateClientReturnWhatsAppTotemMessage(sampleAnswers, 'Deniz Yılmaz');
assert.ok(returnMsg.includes('Deniz Yılmaz'));
assert.ok(returnMsg.includes('[TOTEM-TOKEN:'));
assert.ok(returnMsg.includes('Birincil Ruh Totemi:'));

// 3. Token ayrıştırma (parseClientTotemAnswers)
const parsedFromToken = parseClientTotemAnswers(token);
assert.ok(parsedFromToken, 'Token başarıyla ayrıştırılmalı');
assert.equal(parsedFromToken.clientName, 'Deniz Yılmaz');
assert.equal(parsedFromToken.matchedCount, 15);
assert.ok(parsedFromToken.calculatedResult.primaryTotem.name);

// 4. WhatsApp serbest metin ayrıştırma
const freeText = `
Selamlar, totem sorularımı cevapladım:
1-A, 2-B, 3-C, 4-D, 5-A, 6-B, 7-C, 8-D, 9-A, 10-B, 11-C, 12-D, 13-A, 14-B, 15-C
Danışan: Burak Demir
`;
const parsedFromFreeText = parseClientTotemAnswers(freeText);
assert.ok(parsedFromFreeText, 'Serbest metin başarıyla ayrıştırılmalı');
assert.equal(parsedFromFreeText.matchedCount, 15);
assert.equal(parsedFromFreeText.answers[1], '1a');
assert.equal(parsedFromFreeText.answers[15], '15c');

// 5. Universal Parser Entegrasyonu
const universalParsed = parseUniversalClientImport(returnMsg);
assert.ok(universalParsed, 'Universal import tokeni tanımalı');
assert.equal(universalParsed.kind, 'totem_quiz');
assert.equal(universalParsed.name, 'Deniz Yılmaz');
assert.ok(universalParsed.primaryTotemId);
assert.ok(universalParsed.totemAnswers);

console.log('Totem sharing and import tests passed');
