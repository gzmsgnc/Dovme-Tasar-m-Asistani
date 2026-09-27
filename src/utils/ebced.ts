// Ebced-i Kebir ve Yıldızname Hesaplama Motoru
// Kadim Doğu ezoterizminde ve Osmanlı ebced ilminde isim ve anne adı üzerinden hesaplanır.

const EBCED_TABLE: Record<string, number> = {
  'A': 1, 'E': 1, 'Â': 1, 'I': 10, 'İ': 10, 'Î': 10, 'O': 6, 'Ö': 6, 'U': 6, 'Ü': 6, 'Û': 6,
  'B': 2, 'P': 2,
  'C': 3, 'Ç': 3,
  'D': 4,
  'H': 5,
  'V': 6, 'W': 6,
  'Z': 7,
  'J': 7,
  'T': 9,
  'Y': 10,
  'K': 20, 'G': 20, 'Q': 100,
  'L': 30,
  'M': 40,
  'N': 50,
  'S': 60,
  'F': 80,
  'X': 60,
  'R': 200,
  'Ş': 300,
};

export interface EbcedYildiznameResult {
  personEbced: number;
  motherEbced: number;
  totalEbced: number;
  yildiznameBurcNumber: number; // 1-12
  yildiznameBurcName: string;
  yildiznameElement: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  planetGuide: string;
  talismanicNumber: number;
  esotericQuality: string;
}

const YILDIZNAME_BURCLARI = [
  { no: 1, name: 'Hamel (Koç)', element: 'Ateş' as const, planet: 'Merih (Mars)' },
  { no: 2, name: 'Sevr (Boğa)', element: 'Toprak' as const, planet: 'Zühre (Venüs)' },
  { no: 3, name: 'Cevza (İkizler)', element: 'Hava' as const, planet: 'Utarit (Merkür)' },
  { no: 4, name: 'Seretan (Yengeç)', element: 'Su' as const, planet: 'Kamer (Ay)' },
  { no: 5, name: 'Esed (Aslan)', element: 'Ateş' as const, planet: 'Şems (Güneş)' },
  { no: 6, name: 'Sünbüle (Başak)', element: 'Toprak' as const, planet: 'Utarit (Merkür)' },
  { no: 7, name: 'Mizan (Terazi)', element: 'Hava' as const, planet: 'Zühre (Venüs)' },
  { no: 8, name: 'Akrep (Akrep)', element: 'Su' as const, planet: 'Merih (Mars)' },
  { no: 9, name: 'Kavs (Yay)', element: 'Ateş' as const, planet: 'Müşteri (Jüpiter)' },
  { no: 10, name: 'Cedy (Oğlak)', element: 'Toprak' as const, planet: 'Zuhal (Satürn)' },
  { no: 11, name: 'Delv (Kova)', element: 'Hava' as const, planet: 'Zuhal (Satürn)' },
  { no: 12, name: 'Hut (Balık)', element: 'Su' as const, planet: 'Müşteri (Jüpiter)' },
];

export function calculateSingleEbced(nameStr: string): number {
  if (!nameStr) return 0;
  const upper = nameStr.toLocaleUpperCase('tr-TR');
  let sum = 0;
  for (const char of upper) {
    if (EBCED_TABLE[char]) {
      sum += EBCED_TABLE[char];
    }
  }
  return sum;
}

export function calculateEbcedAndYildizname(personName: string, motherName?: string): EbcedYildiznameResult {
  const pEbced = calculateSingleEbced(personName) || 108;
  const mEbced = motherName ? calculateSingleEbced(motherName) : Math.round(pEbced * 0.618);
  const total = pEbced + mEbced;

  // Yıldızname hesabı: Toplam Ebced % 12 (Kalan 0 ise 12 Balık)
  let burcIndex = total % 12;
  if (burcIndex === 0) burcIndex = 12;

  const burcInfo = YILDIZNAME_BURCLARI[burcIndex - 1] || YILDIZNAME_BURCLARI[0];

  // Element hesabı: Toplam Ebced % 4
  const elementRem = total % 4;
  let element: 'Ateş' | 'Toprak' | 'Hava' | 'Su' = burcInfo.element;
  if (elementRem === 1) element = 'Ateş';
  else if (elementRem === 2) element = 'Toprak';
  else if (elementRem === 3) element = 'Hava';
  else element = 'Su';

  // Tılsımi sayı (Kök toplam)
  let talisman = total;
  while (talisman > 9 && talisman !== 11 && talisman !== 19 && talisman !== 22) {
    talisman = talisman.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  let esotericQuality = '';
  switch (element) {
    case 'Ateş':
      esotericQuality = 'Ruhani irade, dönüştürücü içsel ateş, gölgeyle yüzleşmede cesur liderlik.';
      break;
    case 'Su':
      esotericQuality = 'Derin bilinçdışı sezgi, duygusal simya, kolektif hafıza ve arınma döngüsü.';
      break;
    case 'Hava':
      esotericQuality = 'Zihinsel berraklık, arketipsel vizyon, kutsal geometri ve sözün mühürlenişi.';
      break;
    case 'Toprak':
      esotericQuality = 'Maddesel köklenme, beden tapınağının muhafazası, kadim sabır ve kalıcı tezahür.';
      break;
  }

  return {
    personEbced: pEbced,
    motherEbced: mEbced,
    totalEbced: total,
    yildiznameBurcNumber: burcIndex,
    yildiznameBurcName: burcInfo.name,
    yildiznameElement: element,
    planetGuide: burcInfo.planet,
    talismanicNumber: talisman,
    esotericQuality
  };
}
