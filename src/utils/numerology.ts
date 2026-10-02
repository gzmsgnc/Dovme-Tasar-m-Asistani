import { NumerologyProfile, NumerologyDetail } from '../types';
import { validateCalendarDate } from './astrology';

// Turkish Pythagorean letter-to-number mapping
export const PYTHAGOREAN_TABLE: Record<string, number> = {
  a: 1, j: 1, s: 1, ş: 1,
  b: 2, k: 2, t: 2,
  c: 3, ç: 3, l: 3, u: 3, ü: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, ö: 6, x: 6,
  g: 7, ğ: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, ı: 9, r: 9,
};

export const VOWELS = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']);

export function reduceToSingleOrMaster(num: number): { final: number; steps: string[] } {
  const steps: string[] = [`${num}`];
  if (num === 11 || num === 22 || num === 33) {
    return { final: num, steps };
  }
  let current = num;
  while (current > 9) {
    const digits = current.toString().split('').map(Number);
    const sum = digits.reduce((acc, curr) => acc + curr, 0);
    steps.push(`${digits.join(' + ')} = ${sum}`);
    if (sum === 11 || sum === 22 || sum === 33) {
      return { final: sum, steps };
    }
    current = sum;
  }
  return { final: current, steps };
}

export function reduceToSingle(num: number): { final: number; steps: string[] } {
  const steps: string[] = [`${num}`];
  let current = num;
  while (current > 9) {
    const digits = current.toString().split('').map(Number);
    const sum = digits.reduce((acc, curr) => acc + curr, 0);
    steps.push(`${digits.join(' + ')} = ${sum}`);
    current = sum;
  }
  return { final: current, steps };
}

export const NUMBER_TITLES: Record<number, { title: string; keywords: string[] }> = {
  1: { title: 'Öncü & Bağımsız Lider', keywords: ['Liderlik', 'Özgünlük', 'Cesaret', 'İnisiyatif', 'Girişimcilik'] },
  2: { title: 'Uyumlu & Sezgisel Diplomat', keywords: ['Denge', 'Empati', 'İşbirliği', 'Zarafet', 'Duyarlılık'] },
  3: { title: 'Yaratıcı & İfade Ustası', keywords: ['Sanat', 'İletişim', 'İlham', 'Neşe', 'Estetik'] },
  4: { title: 'Sağlam & Disiplinli Mimar', keywords: ['Düzen', 'Sadakat', 'Metanet', 'Pratiklik', 'Kalıcılık'] },
  5: { title: 'Özgür Ruh & Gezgin Kaşif', keywords: ['Değişim', 'Macera', 'Dinamizm', 'Esneklik', 'Çok Yönlülük'] },
  6: { title: 'Şefkatli & Koruyucu Rehber', keywords: ['Sorumluluk', 'Sevgi', 'Uyum', 'Şifa', 'Adalet'] },
  7: { title: 'Mistik & Derin Filozof', keywords: ['Bilgelik', 'Analiz', 'Sezgi', 'Gizem', 'Ruhsal Arayış'] },
  8: { title: 'Güçlü & Vizyoner Stratejist', keywords: ['Maddi-Manevi Güç', 'Otorite', 'Bolluk', 'Dönüşüm', 'Liderlik'] },
  9: { title: 'Evrensel Şifacı & Hümanist', keywords: ['Koşulsuz Sevgi', 'Bilgelik', 'Bütünlük', 'Tamamlanma', 'Fedakarlık'] },
  11: { title: 'Üstat Aydınlatıcı & Ruhsal Vizyoner', keywords: ['Yüksek Sezgi', 'İlahi İlham', 'Mistik Uyanış', 'Kanal', 'Ruhsal Işık'] },
  22: { title: 'Üstat Mimar & Maddi Dönüştürücü', keywords: ['Büyük Vizyon', 'Dünyayı Yeniden Şekillendirme', 'Sonsuz İnşa', 'Pratik Deha'] },
  33: { title: 'Üstat Öğretici & Evrensel Şefkat', keywords: ['Evrensel Fedakarlık', 'Yüksek Bilinç', 'Kozmik Şifa', 'Kutsal Hizmet'] }
};

export function calculateNumerology(name: string, birthDate: string): NumerologyProfile {
  if (!name || !name.trim()) {
    throw new Error('Numeroloji Pisagor analizi için danışan ismi zorunludur. Sabit veya tahmini isim kullanılamaz.');
  }

  // Gerçek takvim tarihi doğrulaması (YYYY-AA-GG, geçerli ay/gün ve artık yıl kontrolü)
  const { year, month, day } = validateCalendarDate(birthDate);

  const normalizedName = name.toLowerCase().trim();
  
  // 1. Life Path (Yaşam Yolu) Calculation: Day + Month + Year digits
  const yStr = year.toString();
  const mStr = month.toString().padStart(2, '0');
  const dStr = day.toString().padStart(2, '0');
  
  const allDigits = `${dStr}${mStr}${yStr}`.split('').map(Number);
  const rawLifePathSum = allDigits.reduce((acc, curr) => acc + curr, 0);
  const lifePathReduction = reduceToSingleOrMaster(rawLifePathSum);
  const lifePath = lifePathReduction.final;
  
  const lifePathStepByStep = `Doğum Tarihi: ${dStr}.${mStr}.${yStr} ➔ (${allDigits.join(' + ')}) = ${rawLifePathSum} ➔ ${lifePathReduction.steps.join(' ➔ ')}`;

  // 2. Letter calculations for Name (Destiny, Soul Urge, Personality, Chakras)
  let totalDestiny = 0;
  let totalSoulUrge = 0;
  let totalPersonality = 0;
  const letterMapping: { char: string; val: number; isVowel: boolean }[] = [];
  const chakraCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (let i = 0; i < normalizedName.length; i++) {
    const char = normalizedName[i];
    if (PYTHAGOREAN_TABLE[char]) {
      const val = PYTHAGOREAN_TABLE[char];
      const isVowel = VOWELS.has(char);
      letterMapping.push({ char, val, isVowel });
      totalDestiny += val;
      chakraCounts[val] = (chakraCounts[val] || 0) + 1;

      if (isVowel) {
        totalSoulUrge += val;
      } else {
        totalPersonality += val;
      }
    }
  }

  const destinyReduction = reduceToSingleOrMaster(totalDestiny || 1);
  const destinyNumber = destinyReduction.final;
  const destinyStep = `İsimdeki tüm harflerin Pisagor değerleri toplamı: (${letterMapping.map(l => `${l.char.toUpperCase()}=${l.val}`).join(', ')}) ➔ Toplam = ${totalDestiny} ➔ ${destinyReduction.steps.join(' ➔ ')}`;

  const vowelsList = letterMapping.filter(l => l.isVowel);
  const soulUrgeReduction = reduceToSingleOrMaster(totalSoulUrge || 1);
  const soulUrgeNumber = soulUrgeReduction.final;
  const soulUrgeStep = `İsimdeki sesli harfler (${vowelsList.map(l => `${l.char.toUpperCase()}=${l.val}`).join(' + ')}): Toplam = ${totalSoulUrge} ➔ ${soulUrgeReduction.steps.join(' ➔ ')}`;

  const consonantsList = letterMapping.filter(l => !l.isVowel);
  const personalityReduction = reduceToSingleOrMaster(totalPersonality || 1);
  const personalityNumber = personalityReduction.final;
  const personalityStep = `İsimdeki sessiz harfler (${consonantsList.map(l => `${l.char.toUpperCase()}=${l.val}`).join(' + ')}): Toplam = ${totalPersonality} ➔ ${personalityReduction.steps.join(' ➔ ')}`;

  // 3. DM (Dünya Misyonu / Denge Sayısı) = Life Path + Destiny Number
  const rawDm = lifePath + destinyNumber;
  const dmReduction = reduceToSingleOrMaster(rawDm);
  const dmNumber = dmReduction.final;
  const dmStep = `Yaşam Yolu (${lifePath}) + Ana Kulvar (${destinyNumber}) = ${rawDm} ➔ ${dmReduction.steps.join(' ➔ ')}`;

  // 4. Missing numbers (Karmik Çakralar / Eksik Sayılar)
  const missingNumbers: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (chakraCounts[num] === 0) {
      missingNumbers.push(num);
    }
  }
  const missingNumbersStep = `1'den 9'a çakra frekansları kontrolü: ${Object.entries(chakraCounts).map(([k, v]) => `${k}. Çakra: ${v} adet`).join(', ')}. Eksik (0 adet olan) çakralar: ${missingNumbers.length > 0 ? missingNumbers.join(', ') : 'Tüm çakralar mevcut'}.`;

  // 5. Master numbers (11, 22, 33)
  const masterNumbers: number[] = [];
  [lifePath, destinyNumber, soulUrgeNumber, personalityNumber, dmNumber].forEach(num => {
    if ((num === 11 || num === 22 || num === 33) && !masterNumbers.includes(num)) {
      masterNumbers.push(num);
    }
  });
  const masterNumbersStep = masterNumbers.length > 0 
    ? `Hesaplamalarda tespit edilen üstat titreşimler: ${masterNumbers.join(', ')} (Yüksek ruhsal potansiyel).`
    : `Hesaplamalarda üstat sayı (11, 22, 33) doğrudan yer almıyor; tekil 1-9 arketip matrisleri aktif.`;

  // 6. 19 Divine Help (19 İlahi Yardım) analysis
  const dayNum = parseInt(dStr, 10);
  let has19 = false;
  let divine19Reason = '';
  let divine19Level = 'Yok';
  let divine19FormulaBreakdown = '';

  if (dayNum === 19) {
    has19 = true;
    divine19Reason = 'Doğum günü doğrudan ayın 19. günü. Başlangıç (1) ve Tamamlanmanın (9) doğrudan kutsal mührü.';
    divine19Level = 'Çok Yüksek';
    divine19FormulaBreakdown = `Doğum Günü = 19 (Doğrudan 19 kapısı).`;
  } else if (rawLifePathSum === 19) {
    has19 = true;
    divine19Reason = 'Doğum tarihi rakamları toplamı indirgenmeden önce doğrudan 19 değerine ulaşıyor.';
    divine19Level = 'Yüksek';
    divine19FormulaBreakdown = `Doğum Tarihi Rakamları Toplamı = 19 (İlahi Matris).`;
  } else if (totalDestiny === 19) {
    has19 = true;
    divine19Reason = 'İsimdeki harflerin saf toplamı 19 ilahi sayısını oluşturuyor.';
    divine19Level = 'Yüksek';
    divine19FormulaBreakdown = `İsim Harf Toplamı = 19.`;
  } else {
    has19 = false;
    divine19Reason = '19 kodu yalnızca doğrudan ve denetlenebilir bir 19 değeri oluştuğunda işaretlenir. 1 ve 9 çakralarının birlikte bulunması tek başına 19 kabul edilmez.';
    divine19Level = 'Yok';
    divine19FormulaBreakdown = '19 kodu bulunamadı (doğum günü, ham tarih toplamı veya ham isim toplamı 19 değil).';
  }

  // 7. Personal Year Calculation
  const currentYear = new Date().getFullYear();
  const birthMonth = parseInt(mStr, 10);
  const birthDay = parseInt(dStr, 10);
  const pyRaw = birthDay + birthMonth + currentYear;
  const pyReduction = reduceToSingle(pyRaw);
  const personalYear = pyReduction.final;
  const personalYearStep = `Doğum Günü (${birthDay}) + Doğum Ayı (${birthMonth}) + Cari Yıl (${currentYear}) = ${pyRaw} ➔ ${pyReduction.steps.join(' ➔ ')}`;

  const personalYearThemes: Record<number, string> = {
    1: 'Yeni Başlangıçlar, Tohum Ekme ve Cesur Girişimler Yılı',
    2: 'Sabır, İşbirlikleri, Sezgiler ve Denge Kurma Yılı',
    3: 'Kendini İfade Etme, Yaratıcılık, Sosyallik ve Genişleme Yılı',
    4: 'Çalışma, Temel Atma, Disiplin ve Düzen Yılı',
    5: 'Özgürlük, Dönüşüm, Seyahat ve Beklenmedik Değişimler Yılı',
    6: 'Sorumluluk, Aile, Şifa, Sanat ve Sevgi Yılı',
    7: 'İçsel Arayış, Mistik Dinlenme, Analiz ve Ruhsal Gelişim Yılı',
    8: 'Maddi Başarı, Güç, Kararlar ve Hasat Yılı',
    9: 'Bitişler, Arınma, Tamamlanma ve Geleceğe Hazırlık Yılı'
  };

  // 8. Pinnacle & Challenge Numbers (Zirveler ve Mücadeleler)
  const bYear = parseInt(yStr, 10);
  const p1 = reduceToSingle(birthMonth + birthDay).final;
  const p2 = reduceToSingle(birthDay + bYear).final;
  const p3 = reduceToSingle(p1 + p2).final;
  const p4 = reduceToSingle(birthMonth + bYear).final;

  const c1 = Math.abs(reduceToSingle(birthMonth).final - reduceToSingle(birthDay).final);
  const c2 = Math.abs(reduceToSingle(birthDay).final - reduceToSingle(bYear).final);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(reduceToSingle(birthMonth).final - reduceToSingle(bYear).final);

  const pinnaclesStep = `1. Zirve: Ay+Gün (${birthMonth}+${birthDay}=${p1}) | 2. Zirve: Gün+Yıl (${birthDay}+${bYear}=${p2}) | 3. Zirve: (${p1}+${p2}=${p3}) | 4. Zirve: Ay+Yıl (${birthMonth}+${bYear}=${p4})
Mücadeleler: 1. Mücadele: |Ay-Gün| (${c1}) | 2. Mücadele: |Gün-Yıl| (${c2}) | 3. Mücadele: |M1-M2| (${c3}) | 4. Mücadele: |Ay-Yıl| (${c4})`;

  const lifePathInfo = NUMBER_TITLES[lifePath] || NUMBER_TITLES[1];
  const destinyInfo = NUMBER_TITLES[destinyNumber] || NUMBER_TITLES[1];
  const soulUrgeInfo = NUMBER_TITLES[soulUrgeNumber] || NUMBER_TITLES[1];
  const personalityInfo = NUMBER_TITLES[personalityNumber] || NUMBER_TITLES[1];
  const dmInfo = NUMBER_TITLES[dmNumber] || NUMBER_TITLES[1];

  const coreKeywords = Array.from(
    new Set([
      ...lifePathInfo.keywords,
      ...destinyInfo.keywords,
      ...soulUrgeInfo.keywords
    ])
  ).slice(0, 8);

  const calculationDetails: Record<string, NumerologyDetail> = {
    lifePath: {
      value: lifePath,
      title: 'Yaşam Yolu (Life Path)',
      formula: 'Doğum Tarihindeki Tüm Rakamların Toplamı',
      stepByStep: lifePathStepByStep,
      interpretation: lifePathInfo.title
    },
    destiny: {
      value: destinyNumber,
      title: 'Ana Kulvar / İfade (Destiny)',
      formula: 'İsimdeki Tüm Harflerin Pisagor Sayısal Değerleri Toplamı',
      stepByStep: destinyStep,
      interpretation: destinyInfo.title
    },
    soulUrge: {
      value: soulUrgeNumber,
      title: 'Yan Kulvar / Kalp Arzusu (Soul Urge)',
      formula: 'İsimdeki Yalnızca Sesli Harflerin (A,E,I,İ,O,Ö,U,Ü) Toplamı',
      stepByStep: soulUrgeStep,
      interpretation: soulUrgeInfo.title
    },
    personality: {
      value: personalityNumber,
      title: 'Dış İmaj / Kişilik (Personality)',
      formula: 'İsimdeki Yalnızca Sessiz Harflerin Toplamı',
      stepByStep: personalityStep,
      interpretation: personalityInfo.title
    },
    dm: {
      value: dmNumber,
      title: 'DM - Dünya Misyonu / Denge Sayısı',
      formula: 'Yaşam Yolu Sayısı + Ana Kulvar Sayısı',
      stepByStep: dmStep,
      interpretation: dmInfo.title
    },
    missingNumbers: {
      value: missingNumbers.length > 0 ? missingNumbers.join(', ') : 'Yok (Tam Denge)',
      title: 'Eksik Sayılar / Karmik Çakralar',
      formula: 'İsimde Hiç Geçmeyen 1-9 Çakra Frekansları',
      stepByStep: missingNumbersStep,
      interpretation: missingNumbers.length > 0 ? `Dövme tasarımında ${missingNumbers.join(', ')} çakrasını dengeleyici semboller kullanılır.` : 'Karmik çakra boşluğu yok.'
    },
    masterNumbers: {
      value: masterNumbers.length > 0 ? masterNumbers.join(', ') : 'Yok',
      title: 'Üstat Sayılar (Master Numbers)',
      formula: 'İndirgenmeyen 11, 22, 33 Frekansları',
      stepByStep: masterNumbersStep,
      interpretation: masterNumbers.length > 0 ? 'Özel ruhsal misyon ve derin sembolik güç.' : 'Standart arketipsel denge.'
    },
    divine19: {
      value: divine19Level,
      title: '19 İlahi Yardım Matrisi',
      formula: 'Doğum Günü = 19 VEYA Ham Doğum Tarihi Rakamları Toplamı = 19 VEYA Ham İsim Harfleri Toplamı = 19',
      stepByStep: divine19FormulaBreakdown,
      interpretation: divine19Reason
    },
    personalYear: {
      value: personalYear,
      title: `Kişisel Yıl (${currentYear})`,
      formula: 'Doğum Günü + Doğum Ayı + Cari Yıl',
      stepByStep: personalYearStep,
      interpretation: personalYearThemes[personalYear] || 'Dönüşüm Yılı'
    },
    pinnaclesAndChallenges: {
      value: `Zirveler: [${p1}, ${p2}, ${p3}, ${p4}] | Mücadeleler: [${c1}, ${c2}, ${c3}, ${c4}]`,
      title: 'Zirve & Mücadele Döngüleri',
      formula: 'Ay, Gün ve Yıl periyotlarının modüler Pisagor açılımı',
      stepByStep: pinnaclesStep,
      interpretation: 'Hayatın 4 ana evresindeki ruhsal zirveler ve aşılması gereken engeller.'
    }
  };

  return {
    lifePathNumber: lifePath,
    lifePathTitle: lifePathInfo.title,
    destinyNumber,
    destinyTitle: destinyInfo.title,
    soulUrgeNumber,
    soulUrgeTitle: soulUrgeInfo.title,
    personalityNumber,
    personalityTitle: personalityInfo.title,
    dmNumber,
    dmTitle: dmInfo.title,
    chakraCounts,
    missingNumbers,
    masterNumbers,
    divineHelp19: {
      has19,
      reason: divine19Reason,
      level: divine19Level,
      formulaBreakdown: divine19FormulaBreakdown
    },
    personalYear,
    personalYearTheme: personalYearThemes[personalYear] || 'Dönüşüm Yılı',
    pinnacleNumbers: [p1, p2, p3, p4],
    challengeNumbers: [c1, c2, c3, c4],
    coreKeywords,
    calculationDetails: calculationDetails as NumerologyProfile['calculationDetails']
  };
}

