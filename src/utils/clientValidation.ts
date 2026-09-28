/**
 * Danışan İletişim ve Veri Doğrulama Modülü
 * Telefon numarası ve e-posta doğrulama / normalizasyon işlemleri
 */

export interface PhoneValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
}

/**
 * Türkiye ve uluslararası telefon numaralarını doğrular ve normalize eder.
 * Kabul edilen Türkiye formatları:
 * - 05XXXXXXXXX
 * - +905XXXXXXXXX
 * - 5XXXXXXXXX
 * - Yaygın ayraçlar: +90 5XX XXX XX XX, 05XX-XXX-XX-XX vb.
 * 
 * Normalize edilen format: +90 5XX XXX XX XX
 */
export function normalizePhoneNumber(input?: string): PhoneValidationResult {
  if (!input || !input.trim()) {
    return {
      valid: false,
      error: 'Telefon numarası zorunludur. Lütfen geçerli bir telefon numarası giriniz.'
    };
  }

  const trimmed = input.trim();
  // Boşluk, parantez, tire, nokta temizle
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');

  // 1. Türkiye Cep Telefonu Formatı:
  // Kabul edilen ön ekler: +90, 0090, 90, 0 veya doğrudan 5 ile başlayan 10 hane
  const trMatch = cleaned.match(/^(?:\+90|0090|90|0)?(5\d{9})$/);
  if (trMatch) {
    const digits = trMatch[1]; // örn: 5321234567
    // Normalize format: +90 5XX XXX XX XX
    const normalized = `+90 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`;
    return {
      valid: true,
      normalized
    };
  }

  // 2. Uluslararası Geçerli E.164 Formatı (+ ile başlayan en az 10, en fazla 15 rakam)
  const intlMatch = cleaned.match(/^\+([1-9]\d{9,14})$/);
  if (intlMatch) {
    return {
      valid: true,
      normalized: cleaned
    };
  }

  return {
    valid: false,
    error: 'Geçersiz telefon numarası. Lütfen Türkiye cep telefonu formatında (Örn: 05XXXXXXXXX veya +90 5XX XXX XX XX) geçerli bir numara giriniz.'
  };
}

/**
 * E-posta formatını bağımsız olarak doğrular.
 * Örn: gizem@example.com -> geçerli, gizem@ -> geçersiz.
 */
export function isValidEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standart ve katı RFC 5322 uyumlu temel e-posta regex'i
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}
