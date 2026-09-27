/**
 * ENNEAGRAM TESTİNİ MÜŞTERİYE GÖNDERME VE CEVAPLARI İÇE AKTARMA YARDIMCISI
 * (CLIENT ENNEAGRAM QUIZ SHARING & ANSWER IMPORT ENGINE)
 */

import { ENNEAGRAM_MINI_TEST_QUESTIONS, calculateEnneagramFromAnswers, ENNEAGRAM_TYPES } from './enneagram';

/**
 * Müşteriye gönderilecek zengin WhatsApp mesaj metnini oluşturur.
 */
export function generateClientWhatsAppQuizMessage(clientName: string = 'Danışanımız', customUrl?: string): string {
  const testUrl = customUrl || `${window.location.origin}/?mode=enneagram-quiz&client=${encodeURIComponent(clientName)}`;

  let msg = `✨ Merhaba ${clientName}! ✨\n\n`;
  msg += `Dövme tasarımınızın ezoterik ve psikolojik arketipini kusursuz belirleyebilmemiz için size özel 5 soruluk *Enneagram Mini Testi* hazırladık.\n\n`;
  msg += `📲 *Testi 1 dakikada telefondan çözmek için tıklayın:*\n${testUrl}\n\n`;
  msg += `─ VEYA BURADAN CEVAPLAYABİLİRSİNİZ ─\n\n`;

  ENNEAGRAM_MINI_TEST_QUESTIONS.forEach((q, idx) => {
    msg += `*${idx + 1}. ${q.question}*\n`;
    q.options.forEach((opt, optIdx) => {
      const letter = String.fromCharCode(65 + optIdx); // A, B, C...
      msg += `  ${letter}) ${opt.text} [${opt.description}]\n`;
    });
    msg += `\n`;
  });

  msg += `👉 Cevaplarınızı bana (örn: "1-A, 2-C, 3-B, 4-A, 5-D" şeklinde) ilettiğinizde tasarım reçetenize ve çizim rehberinize hemen yansıtacağız! ✨🖋️`;

  return msg;
}

/**
 * WhatsApp linki üretir.
 */
export function generateWhatsAppShareLink(phone: string = '', text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Cevapları transfer token'ına paketler: [ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Gizem]
 */
export function encodeAnswersToToken(answers: Record<number, number>, clientName: string = ''): string {
  const pairs = Object.entries(answers)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([qId, typeVal]) => `${qId}=${typeVal}`)
    .join(',');
  const safeName = clientName.trim() ? `|${clientName.trim()}` : '';
  return `[ENNEA-TOKEN:${pairs}${safeName}]`;
}

/**
 * Müşterinin WhatsApp'tan sanatçıya geri göndereceği hazır mesajı oluşturur.
 */
export function generateClientReturnWhatsAppMessage(
  answers: Record<number, number>,
  clientName: string = ''
): string {
  const calculated = calculateEnneagramFromAnswers(answers);
  const typeData = ENNEAGRAM_TYPES[calculated.type] || ENNEAGRAM_TYPES[4];
  const token = encodeAnswersToToken(answers, clientName);

  let msg = `✨ Merhaba! Enneagram Mini Testimi tamamladım:\n\n`;
  msg += `👤 *Danışan:* ${clientName || 'Danışan'}\n`;
  msg += `🔮 *Çıkan Arketip:* Tip ${calculated.wing} - ${typeData.typeName}\n`;
  msg += `🗝️ *Temel Motivasyon:* ${typeData.coreMotivation}\n\n`;
  msg += `📋 *Dövme Stüdyosu Aktarım Kodu:*\n${token}\n\n`;
  msg += `Bu kodu tasarım sisteminize yapıştırıp reçeteme doğrudan uygulayabilirsiniz! ✨`;

  return msg;
}

/**
 * Müşteriden gelen metni (Token, WhatsApp mesajı, '1-A, 2-C' veya '1:4, 2:5' formatı) ayrıştırır.
 */
export function parseClientAnswers(rawText: string): {
  answers: Record<number, number>;
  calculatedType: number;
  calculatedWing: string;
  clientName?: string;
  matchedCount: number;
} | null {
  if (!rawText || !rawText.trim()) return null;

  const text = rawText.trim();
  const answers: Record<number, number> = {};
  let detectedName: string | undefined = undefined;

  // 1. Token Formatı: [ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Gizem]
  const tokenMatch = text.match(/\[ENNEA-TOKEN:([^\]|]+)(?:\|([^\]]+))?\]/i);
  if (tokenMatch) {
    const pairsStr = tokenMatch[1];
    if (tokenMatch[2]) detectedName = tokenMatch[2].trim();

    pairsStr.split(',').forEach(p => {
      const [qStr, tStr] = p.split('=');
      const q = parseInt(qStr, 10);
      const t = parseInt(tStr, 10);
      if (!isNaN(q) && !isNaN(t) && t >= 1 && t <= 9) {
        answers[q] = t;
      }
    });

    if (Object.keys(answers).length > 0) {
      const calc = calculateEnneagramFromAnswers(answers);
      return {
        answers,
        calculatedType: calc.type,
        calculatedWing: calc.wing,
        clientName: detectedName,
        matchedCount: Object.keys(answers).length
      };
    }
  }

  // 2. Harf formatı: 1-A, 2-C, 3-B (veya 1. A, 2. B, 1: A, vb.)
  // Her sorunun seçenek harfini soru id'siyle eşleştir
  const letterMatches = text.matchAll(/(\d+)[\s.:\-)]+([A-Iİa-iı])/gi);
  let letterMatchCount = 0;
  for (const match of letterMatches) {
    const qId = parseInt(match[1], 10);
    const letter = match[2].toUpperCase();
    const charCode = letter === 'İ' ? 66 : letter.charCodeAt(0);
    const optIndex = charCode - 65; // A=0, B=1...

    const questionObj = ENNEAGRAM_MINI_TEST_QUESTIONS.find(q => q.id === qId);
    if (questionObj && questionObj.options[optIndex]) {
      answers[qId] = questionObj.options[optIndex].type;
      letterMatchCount++;
    }
  }

  if (letterMatchCount >= 2) {
    const calc = calculateEnneagramFromAnswers(answers);
    return {
      answers,
      calculatedType: calc.type,
      calculatedWing: calc.wing,
      matchedCount: letterMatchCount
    };
  }

  // 3. Sayı formatı: 1=4, 2: 5, 3-4 veya "1: 4"
  const numberPairs = text.matchAll(/(\d+)[\s:=–-]+([1-9])/g);
  let numCount = 0;
  for (const match of numberPairs) {
    const qId = parseInt(match[1], 10);
    const typeVal = parseInt(match[2], 10);
    if (qId >= 1 && qId <= 5 && typeVal >= 1 && typeVal <= 9) {
      answers[qId] = typeVal;
      numCount++;
    }
  }

  if (numCount >= 2) {
    const calc = calculateEnneagramFromAnswers(answers);
    return {
      answers,
      calculatedType: calc.type,
      calculatedWing: calc.wing,
      matchedCount: numCount
    };
  }

  // 4. Doğrudan Tip & Kanat Formatı: "Tip 4w5", "4w5", "Tip 4", "Enneagram 8w7"
  const directTypeMatch = text.match(/(?:Tip|Type|Enneagram)?\s*([1-9])\s*w\s*([1-9])/i);
  if (directTypeMatch) {
    const t = parseInt(directTypeMatch[1], 10);
    const w = parseInt(directTypeMatch[2], 10);
    return {
      answers: { 1: t, 2: t, 3: t, 4: t, 5: w },
      calculatedType: t,
      calculatedWing: `${t}w${w}`,
      matchedCount: 5
    };
  }

  const singleTypeMatch = text.match(/(?:Tip|Type|Enneagram)\s*([1-9])\b/i);
  if (singleTypeMatch) {
    const t = parseInt(singleTypeMatch[1], 10);
    const defWing = ENNEAGRAM_TYPES[t]?.wings[0] || `${t}w${t === 9 ? 1 : t + 1}`;
    return {
      answers: { 1: t, 2: t, 3: t, 4: t, 5: t },
      calculatedType: t,
      calculatedWing: defWing,
      matchedCount: 5
    };
  }

  return null;
}
