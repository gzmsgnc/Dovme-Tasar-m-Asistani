/**
 * MORS ALFABESİ VE KUTSAL RAKAM ŞİFRELEME MOTORU (TATTOO MORSE CODE ENCODER)
 * 
 * Bu modül, dövme konseptinde kaba veya estetiği bozan standart rakamların (doğum tarihleri,
 * yaşam yolu sayıları, koordinatlar, 19 ilahi mührü ve kişisel sayılar)
 * dövme estetiğine (Fine Line, Micro Dotwork, Kutsal Geometri) uygun biçimde 
 * Mors Alfabesi noktaları (·) ve çizgileri (–) ile şifrelenmesini sağlar.
 */

export interface MorseToken {
  type: 'dot' | 'dash' | 'char-space' | 'word-space';
  symbol: string;
}

export interface MorseEncodeResult {
  rawInput: string;
  morseStandard: string; // e.g. ". . - -"
  morseDisplay: string;  // e.g. "· · – –"
  tokens: MorseToken[];
  tattooSpecification: string;
  visualTattooRepresentation: string;
  totalDots: number;
  totalDashes: number;
}

// Uluslararası Standart Mors Alfabesi Haritası
export const MORSE_CODE_MAP: Record<string, string> = {
  // Rakamlar (0 - 9)
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',

  // Harfler (A - Z)
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',

  // Türkçe Karakter Eşleşmeleri
  'Ç': '-.-..',
  'Ğ': '--.-.',
  'İ': '..',
  'ı': '..',
  'Ö': '---.',
  'Ş': '----',
  'Ü': '..--',

  // Semboller ve Noktalama
  '.': '.-.-.-',
  ',': '--..--',
  ':': '---...',
  '-': '-....-',
  '/': '-..-.',
  ' ': '/'
};

/**
 * Metni veya rakam dizisini Mors alfabesine çevirir.
 */
export function encodeToMorse(input: string): MorseEncodeResult {
  if (!input) {
    return {
      rawInput: '',
      morseStandard: '',
      morseDisplay: '',
      tokens: [],
      tattooSpecification: '',
      visualTattooRepresentation: '',
      totalDots: 0,
      totalDashes: 0
    };
  }

  const clean = input.toUpperCase().trim();
  const morseWords: string[] = [];
  const tokens: MorseToken[] = [];

  const words = clean.split(/\s+/);

  words.forEach((word, wIdx) => {
    const charMorseList: string[] = [];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const code = MORSE_CODE_MAP[char];
      if (code) {
        charMorseList.push(code);

        // Tokenize for visual rendering
        for (let j = 0; j < code.length; j++) {
          const sym = code[j];
          tokens.push({
            type: sym === '.' ? 'dot' : 'dash',
            symbol: sym === '.' ? '•' : '—'
          });
        }
        tokens.push({ type: 'char-space', symbol: ' ' });
      }
    }
    morseWords.push(charMorseList.join(' '));
    if (wIdx < words.length - 1) {
      tokens.push({ type: 'word-space', symbol: ' / ' });
    }
  });

  const morseStandard = morseWords.join(' / ');
  // Zarif görsel gösterim: noktalar orta nokta '•', çizgiler em-dash '—'
  const morseDisplay = morseStandard
    .replace(/\./g, '•')
    .replace(/-/g, '—');

  const tattooSpecification = `
- **Noktalar (•):** 03RL tek iğneyle (0.25mm) atılmış mikro dotwork stippling noktaları (çap: ~0.4mm).
- **Çizgiler (—):** 03RL veya 05RL ile çekilmiş 1.5mm - 2mm uzunluğunda ince fine-line hatlar.
- **Boşluk Güvenliği:** Nokta ve çizgiler arasında 1mm, karakterler arasında 2.5mm negatif deri boşluğu bırakılarak 10 yıllık pigment dağılması (blowout) önlenmiştir.
- **Yerleşim:** Geometrik mandalanın dış çemberine kavisli olarak, dikey omurga aksına lineer olarak veya ana figürün gölgesine gizli mikro mühür olarak entegre edilebilir.
  `.trim();

  const totalDots = (morseStandard.match(/\./g) || []).length;
  const totalDashes = (morseStandard.match(/-/g) || []).length;

  return {
    rawInput: input,
    morseStandard,
    morseDisplay,
    tokens,
    tattooSpecification,
    visualTattooRepresentation: morseDisplay,
    totalDots,
    totalDashes
  };
}

/**
 * Danışanın doğum tarihi, yaşam yolu ve kişisel sayıları için hazır Mors seçenekleri üretir.
 */
export function generateClientMorsePresets(
  birthDate: string,
  lifePathNumber?: number,
  personalNumbers?: string,
  dmNumber?: number,
  clientName?: string
): { title: string; subtitle: string; raw: string; result: MorseEncodeResult }[] {
  const presets: { title: string; subtitle: string; raw: string; result: MorseEncodeResult }[] = [];

  // 1. Doğum Tarihi (Formatlı)
  if (birthDate) {
    let formattedDate = birthDate;
    if (birthDate.includes('-')) {
      const [y, m, d] = birthDate.split('-');
      formattedDate = `${d}.${m}.${y}`;
    }
    presets.push({
      title: 'Doğum Tarihi (Gün.Ay.Yıl)',
      subtitle: 'En popüler dövme formatı; tarihin doğrudan rakamları yerine gizemli mikro çizgiler',
      raw: formattedDate,
      result: encodeToMorse(formattedDate)
    });

    // Sadece Gün ve Ay
    if (birthDate.includes('-')) {
      const [, m, d] = birthDate.split('-');
      const dayMonth = `${d}.${m}`;
      presets.push({
        title: 'Doğum Günü & Ayı (Minimal)',
        subtitle: 'Daha kısa ve estetik, bilek veya parmak içine uygun',
        raw: dayMonth,
        result: encodeToMorse(dayMonth)
      });
    }
  }

  // 2. Yaşam Yolu & Dünya Misyonu
  if (lifePathNumber) {
    const rawNum = dmNumber ? `${lifePathNumber} / ${dmNumber}` : `${lifePathNumber}`;
    presets.push({
      title: 'Yaşam Yolu & Misyon Sayısı',
      subtitle: `Pisagor matrisinden gelen kader anahtarı (${rawNum})`,
      raw: rawNum,
      result: encodeToMorse(rawNum)
    });
  }

  // 3. Kişisel Şans / Kutsal Sayılar
  if (personalNumbers && personalNumbers.trim()) {
    presets.push({
      title: 'Danışanın Kutsal Sayıları',
      subtitle: 'Danışanın belirttiği özel ve koruyucu sayılar',
      raw: personalNumbers.trim(),
      result: encodeToMorse(personalNumbers.trim())
    });
  }

  // 4. 19 İlahi Mührü
  presets.push({
    title: '19 İlahi Mühür Kodu',
    subtitle: 'Kozmik koruma ve şans frekansı (19)',
    raw: '19',
    result: encodeToMorse('19')
  });

  // 5. İsim Baş Harfleri veya İsim
  if (clientName && clientName.trim()) {
    const initials = clientName
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('.');
    presets.push({
      title: 'İsim Baş Harfleri',
      subtitle: `${clientName} baş harflerinin Mors kodlaması`,
      raw: initials,
      result: encodeToMorse(initials)
    });
  }

  return presets;
}
