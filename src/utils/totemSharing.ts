/**
 * RUH TOTEM HAYVANI TESTİNİ MÜŞTERİYE GÖNDERME VE CEVAPLARI İÇE AKTARMA MOTORU
 * (CLIENT SPIRIT TOTEM QUIZ SHARING & ANSWER IMPORT ENGINE)
 */

import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult, 
  TotemTestCalculationResult 
} from './behavioralTotemEngine';
import { generateWhatsAppShareLink } from './enneagramSharing';

/**
 * Müşteriye gönderilecek zengin WhatsApp Totem Testi davet mesajını oluşturur.
 */
export function generateClientWhatsAppTotemQuizMessage(
  clientName: string = 'Danışanımız', 
  customUrl?: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ezoterik-tattoo.studio';
  const testUrl = customUrl || `${origin}/?mode=totem-quiz&client=${encodeURIComponent(clientName)}`;

  let msg = `🐺🦅 Merhaba ${clientName}! ✨\n\n`;
  msg += `Dövme tasarımınızda size rehberlik edecek Kadim Ruh Totemi, İkincil Müttefik ve Gölge Muhafız hayvanınızı belirlemek için size özel 15 soruluk *Davranışsal Ruh Totemi Testi* hazırladık.\n\n`;
  msg += `🌿 Bu test hayvan isimlerini sormaz; kriz, tehdit, özgürlük ve karar anlarındaki gerçek içsel reflekslerinizi 52 kadim hayvan arketipiyle eşleştirir.\n\n`;
  msg += `📲 *Testi 2 dakikada telefondan çözmek için tıklayın:*\n${testUrl}\n\n`;
  msg += `Testi tamamladığınızda çıkan totem analizini tek tıkla bana WhatsApp'tan iletebilirsiniz! ✨🖋️`;

  return msg;
}

/**
 * Totem cevaplarını transfer token'ına paketler: [TOTEM-TOKEN:1=1a,2=2b,3=3c...|Gizem]
 */
export function encodeTotemAnswersToToken(
  answers: Record<number, string>, 
  clientName: string = ''
): string {
  const pairs = Object.entries(answers)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([qId, optId]) => `${qId}=${optId}`)
    .join(',');
  const safeName = clientName.trim() ? `|${clientName.trim()}` : '';
  return `[TOTEM-TOKEN:${pairs}${safeName}]`;
}

/**
 * Müşterinin test sonunda WhatsApp'tan dövme sanatçısına göndereceği sonuç mesajı.
 */
export function generateClientReturnWhatsAppTotemMessage(
  answers: Record<number, string>,
  clientName: string = '',
  result?: TotemTestCalculationResult
): string {
  const calc = result || calculateBehavioralTotemResult(answers);
  const token = encodeTotemAnswersToToken(answers, clientName);

  let msg = `✨ Merhaba! Ruh Totemi Testimi tamamladım:\n\n`;
  msg += `👤 *Danışan:* ${clientName || 'Danışan'}\n`;
  msg += `🐺 *Birincil Ruh Totemi:* ${calc.primaryTotem.name} (${calc.primaryTotem.turkishName || calc.primaryTotem.name})\n`;
  msg += `   • Uyum: %${calc.confidenceScore} • Element: ${calc.primaryTotem.element}\n`;
  msg += `   • Güç: ${calc.primaryTotem.strongSide}\n\n`;
  msg += `🦅 *İkincil Müttefik:* ${calc.secondaryTotem.name} (${calc.secondaryTotem.element})\n`;
  msg += `🛡️ *Gölge Muhafız:* ${calc.shadowTotem.name} (${calc.shadowTotem.protectivePower})\n\n`;
  msg += `📋 *Dövme Stüdyosu Aktarım Kodu:*\n${token}\n\n`;
  msg += `Bu kodu tasarım konsolunuza aktararak totem figürümü dövme kompozisyonuna ekleyebilirsiniz! ✨`;

  return msg;
}

/**
 * Gelen WhatsApp mesajından veya aktarım kodundan totem yanıtlarını çözer.
 */
export function parseClientTotemAnswers(rawText: string): {
  answers: Record<number, string>;
  calculatedResult: TotemTestCalculationResult;
  clientName?: string;
  matchedCount: number;
} | null {
  if (!rawText || !rawText.trim()) return null;
  const text = rawText.trim();
  const answers: Record<number, string> = {};
  let detectedName: string | undefined = undefined;

  // 1. [TOTEM-TOKEN:1=1a,2=2b...|Gizem] formatı
  const tokenMatch = text.match(/\[TOTEM-TOKEN:([^\]|]+)(?:\|([^\]]+))?\]/i);
  if (tokenMatch) {
    const pairsStr = tokenMatch[1];
    if (tokenMatch[2]) detectedName = tokenMatch[2].trim();

    pairsStr.split(',').forEach(p => {
      const [qStr, optId] = p.split('=');
      const q = parseInt(qStr, 10);
      if (!isNaN(q) && q >= 1 && q <= 15 && optId) {
        answers[q] = optId.trim();
      }
    });

    if (Object.keys(answers).length >= 3) {
      const calc = calculateBehavioralTotemResult(answers);
      return {
        answers,
        calculatedResult: calc,
        clientName: detectedName,
        matchedCount: Object.keys(answers).length
      };
    }
  }

  // 2. Harf formatı: 1-A, 2-C, 3-B (veya 1: a, 2: c)
  const letterMatches = text.matchAll(/(\d+)[\s.:\-)]+([A-Da-d])/g);
  let letterMatchCount = 0;
  for (const match of letterMatches) {
    const qId = parseInt(match[1], 10);
    const letter = match[2].toLowerCase(); // 'a', 'b', 'c', 'd'
    if (qId >= 1 && qId <= 15) {
      answers[qId] = `${qId}${letter}`;
      letterMatchCount++;
    }
  }

  if (letterMatchCount >= 3) {
    const calc = calculateBehavioralTotemResult(answers);
    return {
      answers,
      calculatedResult: calc,
      clientName: detectedName,
      matchedCount: letterMatchCount
    };
  }

  return null;
}
