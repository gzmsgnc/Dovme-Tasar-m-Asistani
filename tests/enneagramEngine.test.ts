import assert from 'node:assert/strict';
import { 
  ENNEAGRAM_MINI_TEST_QUESTIONS, 
  calculateEnneagramFromAnswers, 
  getEnneagramProfile,
  ENNEAGRAM_TYPES 
} from '../src/utils/enneagram';
import { 
  encodeAnswersToToken, 
  parseClientAnswers, 
  generateClientWhatsAppQuizMessage,
  generateClientReturnWhatsAppMessage 
} from '../src/utils/enneagramSharing';

// 1. 15 Soruluk Yapı Doğrulaması
assert.equal(ENNEAGRAM_MINI_TEST_QUESTIONS.length, 15, 'Enneagram testi tam olarak 15 sorudan oluşmalıdır');

ENNEAGRAM_MINI_TEST_QUESTIONS.forEach((q, idx) => {
  assert.equal(q.id, idx + 1, `Soru ID'si ${idx + 1} olmalıdır`);
  assert.ok(q.question && q.question.trim().length > 10, `Soru ${q.id} metni geçerli ve anlamlı olmalıdır`);
  assert.equal(q.options.length, 9, `Soru ${q.id} tam olarak 9 Enneagram tipine ait seçenek içermelidir`);

  const typesCovered = new Set<number>();
  q.options.forEach((opt) => {
    assert.ok(opt.type >= 1 && opt.type <= 9, `Seçenek tipi 1-9 aralığında olmalıdır: ${opt.type}`);
    assert.ok(opt.text && opt.text.trim().length > 5, `Seçenek metni boş olamaz`);
    assert.ok(opt.description && opt.description.trim().length > 2, `Seçenek açıklaması bulunmalıdır`);
    typesCovered.add(opt.type);
  });
  assert.equal(typesCovered.size, 9, `Soru ${q.id} 1'den 9'a kadar tüm tipleri eksiksiz kapsamalıdır`);
});

// 2. Homojen Cevaplar ile 9 Tipin Birebir Doğrulanması
for (let t = 1; t <= 9; t++) {
  const homogeneousAnswers = Object.fromEntries(
    ENNEAGRAM_MINI_TEST_QUESTIONS.map(q => {
      const opt = q.options.find(o => o.type === t);
      assert.ok(opt, `Soru ${q.id} içinde Tip ${t} seçeneği bulunamadı`);
      return [q.id, opt.type];
    })
  );

  const res = calculateEnneagramFromAnswers(homogeneousAnswers);
  assert.equal(res.type, t, `Tüm sorular Tip ${t} işaretlendiğinde sonuç Tip ${t} olmalıdır`);
  assert.equal(res.answeredCount, 15, '15 sorunun tamamı sayılmalıdır');
  assert.equal(res.isComplete, true, 'isComplete true olmalıdır');
  assert.equal(res.scores[t], 15, `Tip ${t} skoru 15 olmalıdır`);
  assert.ok(res.wing.startsWith(`${t}w`), `Kanat ${t} tipine ait olmalıdır, bulunan: ${res.wing}`);
  assert.ok(ENNEAGRAM_TYPES[t].wings.includes(res.wing), `Kanat geçerli kanatlar listesinde yer almalıdır`);

  // Profil testi
  const prof = getEnneagramProfile(res.type, res.wing, true);
  assert.equal(prof.type, t);
  assert.equal(prof.wing, res.wing);
  assert.equal(prof.isDeterminedByTest, true);
  assert.ok(prof.typeName.length > 0);
  assert.ok(prof.coreMotivation.length > 0);
  assert.ok(prof.symbolicMeaning.length > 0);
}

// 3. Kanat (Wing) Ayrıştırma Testi
// Örnek: Tip 5 baskın olsun (10 soru Tip 5).
// Sol komşu Tip 4 (3 soru), Sağ komşu Tip 6 (1 soru) -> Kanat 5w4 olmalı.
const wingTestAnswersLeft: Record<number, number> = {
  1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5,
  11: 4, 12: 4, 13: 4, // Tip 4: 3 puan
  14: 6, // Tip 6: 1 puan
  15: 1
};
const resWingLeft = calculateEnneagramFromAnswers(wingTestAnswersLeft);
assert.equal(resWingLeft.type, 5);
assert.equal(resWingLeft.wing, '5w4', 'Sol komşu (4) sağ komşudan (6) yüksek puan aldığında 5w4 olmalıdır');

// Sağ komşu Tip 6 (3 soru), Sol komşu Tip 4 (1 soru) -> Kanat 5w6 olmalı.
const wingTestAnswersRight: Record<number, number> = {
  1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5,
  11: 6, 12: 6, 13: 6, // Tip 6: 3 puan
  14: 4, // Tip 4: 1 puan
  15: 1
};
const resWingRight = calculateEnneagramFromAnswers(wingTestAnswersRight);
assert.equal(resWingRight.type, 5);
assert.equal(resWingRight.wing, '5w6', 'Sağ komşu (6) sol komşudan (4) yüksek puan aldığında 5w6 olmalıdır');

// Tip 1 için dairesel komşuluk testi (Sol komşu: 9, Sağ komşu: 2)
const type1WithWing9: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1,
  11: 9, 12: 9, 13: 9, // Tip 9: 3 puan
  14: 2, // Tip 2: 1 puan
  15: 3
};
const res1w9 = calculateEnneagramFromAnswers(type1WithWing9);
assert.equal(res1w9.type, 1);
assert.equal(res1w9.wing, '1w9', 'Tip 1 için Tip 9 skoru Tip 2 skorundan yüksek olduğunda 1w9 olmalıdır');

// Tip 9 için dairesel komşuluk testi (Sol komşu: 8, Sağ komşu: 1)
const type9WithWing1: Record<number, number> = {
  1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9, 10: 9,
  11: 1, 12: 1, 13: 1, // Tip 1: 3 puan
  14: 8, // Tip 8: 1 puan
  15: 4
};
const res9w1 = calculateEnneagramFromAnswers(type9WithWing1);
assert.equal(res9w1.type, 9);
assert.equal(res9w1.wing, '9w1', 'Tip 9 için Tip 1 skoru Tip 8 skorundan yüksek olduğunda 9w1 olmalıdır');

// 4. Deterministik Beraberlik (Tie-Break) Testi
// Tip 3 ve Tip 8 eşit puan alsın (her biri 6 puan).
// Soru 1'de (Temel Motivasyon) Tip 8 seçilmiş olsun -> Tie-break Tip 8'i seçmeli.
const tieAnswers: Record<number, number> = {
  1: 8, 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, // 8: 6 puan (ve Soru 1'de 8 seçildi)
  7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3, // 3: 6 puan
  13: 1, 14: 2, 15: 7
};
const tieResult = calculateEnneagramFromAnswers(tieAnswers);
assert.equal(tieResult.type, 8, 'Eşit puan durumunda Soru 1 (Temel Motivasyon) belirleyici olmalıdır');

// 5. Kısmi Cevaplar (Eksik Veri) ve Boş Cevaplar
const partial = calculateEnneagramFromAnswers({ 1: 7, 2: 7, 3: 7 });
assert.equal(partial.type, 7);
assert.equal(partial.answeredCount, 3);
assert.equal(partial.isComplete, false);

const empty = calculateEnneagramFromAnswers({});
assert.equal(empty.type, 4, 'Boş cevap durumunda güvenli varsayılan Tip 4 olmalıdır');
assert.equal(empty.answeredCount, 0);
assert.equal(empty.isComplete, false);

// 6. WhatsApp Paylaşım & Ayrıştırma (Token & Regex) Testi
const fullClientAnswers: Record<number, number> = {
  1: 4, 2: 4, 3: 5, 4: 4, 5: 5, 6: 4, 7: 5, 8: 4, 9: 4, 10: 5, 11: 4, 12: 4, 13: 5, 14: 4, 15: 4
};
const token = encodeAnswersToToken(fullClientAnswers, 'Gizem');
assert.ok(token.startsWith('[ENNEA-TOKEN:'));
assert.ok(token.includes('|Gizem]'));

const parsedFromToken = parseClientAnswers(token);
assert.ok(parsedFromToken);
assert.equal(parsedFromToken.clientName, 'Gizem');
assert.equal(parsedFromToken.matchedCount, 15);
assert.equal(parsedFromToken.calculatedType, 4);
assert.equal(parsedFromToken.calculatedWing, '4w5');

// WhatsApp serbest metin mesajı ayrıştırma: "1-D, 2-D, 3-E, 4-D..."
const rawTextWhatsApp = `
Merhaba sanatçım, cevaplarım:
1-D, 2-D, 3-E, 4-D, 5-E, 6-D, 7-E, 8-D, 9-D, 10-E, 11-D, 12-D, 13-E, 14-D, 15-D
`;
const parsedText = parseClientAnswers(rawTextWhatsApp);
assert.ok(parsedText);
assert.equal(parsedText.matchedCount, 15);
assert.equal(parsedText.calculatedType, 4);

// Mesaj üretim fonksiyonlarının 15 soruyu içerdiğini doğrula
const quizMsg = generateClientWhatsAppQuizMessage('Test Müşteri');
assert.ok(quizMsg.includes('15 soruluk'));
assert.ok(quizMsg.includes('*15. '));

const returnMsg = generateClientReturnWhatsAppMessage(fullClientAnswers, 'Gizem');
assert.ok(returnMsg.includes('Gizem'));
assert.ok(returnMsg.includes('Tip 4w5'));
assert.ok(returnMsg.includes('[ENNEA-TOKEN:'));

console.log('Tüm 15 soruluk Enneagram motoru testleri başarıyla tamamlandı!');
