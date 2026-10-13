import assert from 'node:assert';
import { 
  buildClientGeneralInfoText,
  buildEnneagramAnalysisText,
  buildTotemAnalysisText,
  buildTestAnswersAndResultsText,
  buildNumerologyAnalysisText,
  buildAstrologyAnalysisText,
  buildEbcedMizanAnalysisText,
  buildChakraAnalysisText,
  buildSymbolAnalysisText,
  buildTattooRecipeText,
  buildTechnicalTattooSpecsText,
  buildAiPromptsText,
  buildCompleteClientDataText,
  buildCompleteClientDataFromPerson
} from '../src/utils/clientDataCopyEngine';
import { calculateNumerology } from '../src/utils/numerology';
import { calculateAstrology } from '../src/utils/astrology';
import { calculateTotemAnimal } from '../src/utils/totemCalculator';
import { calculateChakraProfile } from '../src/utils/chakra';
import { deriveSymbolismProfile } from '../src/utils/symbolism';
import { generateTattooRecipe } from '../src/utils/recipeGenerator';
import { generatePersonalSymbolPrescription } from '../src/utils/personalSymbolPrescription';
import { getEnneagramProfile, calculateEnneagramFromAnswers, ENNEAGRAM_MINI_TEST_QUESTIONS } from '../src/utils/enneagram';
import { TOTEM_BEHAVIORAL_QUESTIONS } from '../src/utils/behavioralTotemEngine';
import { PersonData, TattooDesignParameters } from '../src/types';

console.log('--- RUNNING CLIENT DATA COPY & EXPORT ENGINE TESTS ---');

// 1. Fixture: Golden Client with complete answers
const goldenClient: PersonData = {
  id: 'copy-golden-1',
  name: 'Zeynep Kaya',
  birthDate: '1992-06-15',
  birthTime: '14:30',
  birthPlace: 'İstanbul',
  motherName: 'Fatma',
  phone: '+90 532 111 22 33',
  email: 'zeynep@example.com',
  zodiacSystem: 'Tropical',
  notes: 'Omuz ve önkol için koruyucu sembol arayışı',
  enneagramType: 4,
  enneagramWing: '4w5',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  enneagramAnswers: {
    1: 4, 2: 4, 3: 4, 4: 4, 5: 4,
    6: 4, 7: 4, 8: 4, 9: 4, 10: 4,
    11: 4, 12: 4, 13: 4, 14: 4, 15: 4
  },
  totemAnswers: Object.fromEntries(
    TOTEM_BEHAVIORAL_QUESTIONS.map(q => [q.id, q.options[0].id])
  )
};

const numerology = calculateNumerology(goldenClient.name, goldenClient.birthDate);
const astrology = calculateAstrology(goldenClient.birthDate, goldenClient.birthTime, goldenClient.birthPlace, 'Tropical');
const enneaCalc = calculateEnneagramFromAnswers(goldenClient.enneagramAnswers);
const enneagram = getEnneagramProfile(enneaCalc.type, enneaCalc.wing, true);
const totemResult = calculateTotemAnimal({
  name: goldenClient.name,
  birthDate: goldenClient.birthDate,
  birthTime: goldenClient.birthTime,
  birthPlace: goldenClient.birthPlace,
  motherName: goldenClient.motherName,
  totemAnswers: goldenClient.totemAnswers,
  enneagramType: goldenClient.enneagramType,
  lifePathNumber: numerology.lifePathNumber,
  dominantElement: astrology.dominantElement,
  sunSign: astrology.sunSign
});
const symbolism = deriveSymbolismProfile(
  numerology,
  astrology,
  enneagram,
  {
    name: goldenClient.name,
    birthDate: goldenClient.birthDate,
    birthTime: goldenClient.birthTime,
    birthPlace: goldenClient.birthPlace,
    motherName: goldenClient.motherName,
    totemAnswers: goldenClient.totemAnswers
  }
);
const chakra = calculateChakraProfile(numerology, astrology);
const designParams: TattooDesignParameters = {
  selectedStyles: ['Fine Line', 'Geometric'],
  composition: 'Vertical',
  orientation: 'Dikey (Anatomik)',
  bodyPlacement: 'Önkol İç',
  density: 'Dengeli & Net (%60)',
  colorScheme: 'Saf Monokrom Siyah',
  visualAtmosphere: 'Mistik ve Ezoterik',
  mainSymbol: 'Kızıl Geyik',
  secondarySymbols: ['Metatron Küpü', 'Lotus'],
  excludedDesignSymbols: [{ name: 'Gül', reason: 'Danışan tercihi' }],
  includeTotemInDesign: true,
  useMorseCodeForNumbers: true,
  customMorseInput: '1992'
};

const recipe = generateTattooRecipe(
  goldenClient,
  numerology,
  astrology,
  enneagram,
  symbolism,
  designParams
);

const prescription = generatePersonalSymbolPrescription({
  person: goldenClient,
  numerology,
  astrology,
  enneagram,
  symbolism,
  chakra,
  designParameters: designParams
});

// TEST 1: Danışan Kimlik ve İletişim Bilgileri Kopyalama
console.log('Test 1: Danışan kimlik metni formatı ve Türkçe karakterler');
const clientInfoText = buildClientGeneralInfoText(goldenClient);
assert.ok(clientInfoText.includes('Zeynep Kaya'), 'Ad soyad içermeli');
assert.ok(clientInfoText.includes('1992-06-15'), 'Doğum tarihi içermeli');
assert.ok(clientInfoText.includes('İstanbul'), 'Doğum yeri içermeli');
assert.ok(clientInfoText.includes('Fatma'), 'Anne adı içermeli');
assert.ok(clientInfoText.includes('+90 532 111 22 33'), 'Telefon içermeli');
assert.ok(clientInfoText.includes('zeynep@example.com'), 'E-posta içermeli');
assert.ok(clientInfoText.includes('✓ Zorunlu Bilgiler Eksiksiz'), 'Doğrulama durumu belirtilmeli');
console.log('✓ Test 1 başarılı');

// TEST 2: 15 Soruluk Enneagram Testi ve Kişilik Analizi Kopyalama
console.log('Test 2: Enneagram 15 soru ve profil dökümü');
const enneaText = buildEnneagramAnalysisText(goldenClient.enneagramAnswers, enneagram);
assert.ok(enneaText.includes('15/15 Soru Eksiksiz Tamamlandı'), '15/15 soru tamamlanma durumu içermeli');
assert.ok(enneaText.includes('[Soru 1]'), 'Soru 1 içermeli');
assert.ok(enneaText.includes('[Soru 15]'), 'Soru 15 içermeli');
assert.ok(enneaText.includes('Baskın Tip       : Tip 4'), 'Tip 4 içermeli');
assert.ok(enneaText.includes('Temel Motivasyon :'), 'Temel motivasyon içermeli');
assert.ok(enneaText.includes('Temel Korku      :'), 'Temel korku içermeli');
console.log('✓ Test 2 başarılı');

// TEST 3: 15 Soruluk Davranışsal Totem Hayvanı Testi ve Hiyerarşisi Kopyalama
console.log('Test 3: Totem 15 senaryo sorusu ve 3\'lü hiyerarşi dökümü');
const totemText = buildTotemAnalysisText(goldenClient.totemAnswers, totemResult, symbolism);
assert.ok(totemText.includes('15/15 Davranışsal Senaryo Tamamlandı'), '15/15 senaryo durumu içermeli');
assert.ok(totemText.includes('[Soru 1 -'), 'Soru 1 kategori başlığı içermeli');
assert.ok(totemText.includes('[Soru 15 -'), 'Soru 15 kategori başlığı içermeli');
assert.ok(totemText.includes('1. BİRİNCİL RUH TOTEMİ:'), 'Birincil totem içermeli');
assert.ok(totemText.includes('2. GÖLGE & MUHAFIZ TOTEMİ:'), 'Gölge totem içermeli');
assert.ok(totemText.includes('3. YÜKSELİŞ & RUHSAL MÜTTEFİK:'), 'Müttefik totem içermeli');
console.log('✓ Test 3 başarılı');

// TEST 4: Birleşik Test Cevapları ve Sonuçları
console.log('Test 4: Birleşik test cevapları');
const combinedTestsText = buildTestAnswersAndResultsText(goldenClient, totemResult, enneagram, symbolism);
assert.ok(combinedTestsText.includes('ENNEAGRAM KİŞİLİK VE GÖLGE ARKETİP ANALİZİ'), 'Enneagram başlığı içermeli');
assert.ok(combinedTestsText.includes('DAVRANIŞSAL TOTEM HAYVANI TESTİ VE HİYERARŞİ ANALİZİ'), 'Totem başlığı içermeli');
console.log('✓ Test 4 başarılı');

// TEST 5: Numeroloji Pisagor Matrisi Kopyalama
console.log('Test 5: Numeroloji analizi dökümü');
const numText = buildNumerologyAnalysisText(numerology);
assert.ok(numText.includes('Yaşam Yolu Sayısı'), 'Yaşam yolu içermeli');
assert.ok(numText.includes('Ana Kulvar / İfade'), 'İfade sayısı içermeli');
assert.ok(numText.includes('İlahi Yardım 19 Mührü'), '19 mührü içermeli');
assert.ok(numText.includes('1-9 ÇAKRA DAĞILIMI'), 'Çakra dağılımı içermeli');
console.log('✓ Test 5 başarılı');

// TEST 6: Astroloji Efemeris Kopyalama
console.log('Test 6: Astroloji efemeris dökümü');
const astroText = buildAstrologyAnalysisText(astrology);
assert.ok(astroText.includes('Zodyak Sistemi'), 'Zodyak sistemi içermeli');
assert.ok(astroText.includes('Güneş Burcu'), 'Güneş burcu içermeli');
assert.ok(astroText.includes('Ay Burcu'), 'Ay burcu içermeli');
assert.ok(astroText.includes('Yükselen Burç'), 'Yükselen burç içermeli');
console.log('✓ Test 6 başarılı');

// TEST 7: Ebced ve Mizan Kopyalama
console.log('Test 7: Ebced ve Mizan analizi dökümü');
const ebcedText = buildEbcedMizanAnalysisText(goldenClient);
assert.ok(ebcedText.includes('Danışan Adı          : Zeynep Kaya'), 'Danışan adı içermeli');
assert.ok(ebcedText.includes('Anne Adı             : Fatma'), 'Anne adı içermeli');
assert.ok(ebcedText.includes('Yıldızname Mizan Burcu:'), 'Mizan burcu içermeli');
assert.ok(ebcedText.includes('Toplam Ebced         :'), 'Toplam ebced içermeli');
console.log('✓ Test 7 başarılı');

// TEST 8: Çakra Rezonans Analizi Kopyalama
console.log('Test 8: Çakra analizi dökümü');
const chakraText = buildChakraAnalysisText(chakra, numerology);
assert.ok(chakraText.includes('Bütünsel Çakra Skoru'), 'Çakra skoru içermeli');
assert.ok(chakraText.includes('Birincil Şifa Direktifi'), 'Şifa direktifi içermeli');
assert.ok(chakraText.includes('1. Kök Çakra'), 'Kök çakra içermeli');
console.log('✓ Test 8 başarılı');

// TEST 9: Kişisel Sembol Analizi ve Gerekçeleri Kopyalama
console.log('Test 9: Kişisel sembol reçetesi ve 5\'li formül');
const symText = buildSymbolAnalysisText(symbolism, prescription);
assert.ok(symText.includes('Birleşik Arketip'), 'Birleşik arketip içermeli');
assert.ok(symText.includes('BEŞLİ TASARIM FORMÜLÜ'), 'Beşli formül içermeli');
assert.ok(symText.includes('Merkez Odak'), 'Merkez odak içermeli');
assert.ok(symText.includes('Ezoterik Gerekçe:'), 'Audit trail ezoterik gerekçe içermeli');
console.log('✓ Test 9 başarılı');

// TEST 10: Dövme Reçetesi ve Tasarım Tercihleri Kopyalama
console.log('Test 10: Dövme reçetesi ve yerleşim tercihleri');
const recipeText = buildTattooRecipeText(recipe, designParams);
assert.ok(recipeText.includes('Seçilen Stiller  : Fine Line + Geometric'), 'Seçilen stiller içermeli');
assert.ok(recipeText.includes('Vücut Yerleşimi  : Önkol İç'), 'Vücut yerleşimi içermeli');
assert.ok(recipeText.includes('Tasarımdan Çıkarılanlar: Gül'), 'Çıkarılan semboller içermeli');
assert.ok(recipeText.includes('Mors Kodu Şifreleme    : AKTİF'), 'Mors kodu durumu içermeli');
console.log('✓ Test 10 başarılı');

// TEST 11: Teknik Dövme Şartnamesi ve Zanaat Analizi Kopyalama
console.log('Test 11: Teknik dövme şartnamesi ve uygulanabilirlik');
const techText = buildTechnicalTattooSpecsText(recipe, designParams);
assert.ok(techText.includes('Genel Zanaat Puanı'), 'Feasibility puanı içermeli');
assert.ok(techText.includes('İğne Konfigürasyonu'), 'İğne kalınlığı içermeli');
assert.ok(techText.includes('Negatif Alan Oranı'), 'Negatif alan oranı içermeli');
console.log('✓ Test 11 başarılı');

// TEST 12: Görsel Üretim İstemleri (Master AI Prompts) Kopyalama
console.log('Test 12: Master AI Prompts dökümü');
const promptsText = buildAiPromptsText(recipe);
assert.ok(promptsText.includes('1. MIDJOURNEY v6.1 / NIJI 6 MASTER PROMPT:'), 'Midjourney promptu içermeli');
assert.ok(promptsText.includes('2. DALL-E 3 MASTER TATTOO FLASH PROMPT:'), 'DALL-E promptu içermeli');
assert.ok(promptsText.includes('3. 03RL TERMAL STENCIL & ÇİZGİ TRANSFER PROMPTU:'), 'Stencil promptu içermeli');
assert.ok(promptsText.includes('5. NEGATİF PROMPT (YASAKLANMIŞ UNSURLAR):'), 'Negatif prompt içermeli');
console.log('✓ Test 12 başarılı');

// TEST 13: TÜM DANIŞAN VERİLERİNİ KOPYALA (MASTER BİRLEŞİK METİN)
console.log('Test 13: Master birleşik dosya metni (Tüm 11 bölüm eksiksiz)');
const fullDossierText = buildCompleteClientDataText({
  client: goldenClient,
  numerology,
  astrology,
  enneagram,
  symbolism,
  chakra,
  parameters: designParams,
  recipe,
  prescription
});

assert.ok(fullDossierText.includes('DÖVME TASARIM ASİSTANI V2 — TAM KAPSAMLI DANIŞAN DOSYASI'), 'Master dosya başlığı');
assert.ok(fullDossierText.includes('BÖLÜM 1: DANIŞAN KİMLİK VE İLETİŞİM BİLGİLERİ'), 'Bölüm 1');
assert.ok(fullDossierText.includes('BÖLÜM 2: ENNEAGRAM KİŞİLİK VE GÖLGE ARKETİP ANALİZİ'), 'Bölüm 2');
assert.ok(fullDossierText.includes('BÖLÜM 3: DAVRANIŞSAL TOTEM HAYVANI TESTİ VE HİYERARŞİSİ'), 'Bölüm 3');
assert.ok(fullDossierText.includes('BÖLÜM 4: NUMEROLOJİ PİSAGOR MATRİSİ VE SAYISAL TİTREŞİMLER'), 'Bölüm 4');
assert.ok(fullDossierText.includes('BÖLÜM 5: ASTROLOJİ GERÇEK EFEMERİS VE GÖKSEL KOORDİNATLAR'), 'Bölüm 5');
assert.ok(fullDossierText.includes('BÖLÜM 6: KADİM EBCED VE YILDIZNAME MİZAN HESAPLAMALARI'), 'Bölüm 6');
assert.ok(fullDossierText.includes('BÖLÜM 7: 7+2 KANONİK ÇAKRA VE ENERJİ MERKEZLERİ ANALİZİ'), 'Bölüm 7');
assert.ok(fullDossierText.includes('BÖLÜM 8: KİŞİSEL SEMBOL REÇETESİ VE DERİN EZOTERİK GEREKÇELER'), 'Bölüm 8');
assert.ok(fullDossierText.includes('BÖLÜM 9: DÖVME TASARIM REÇETESİ VE KOMPOZİSYON KILAVUZU'), 'Bölüm 9');
assert.ok(fullDossierText.includes('BÖLÜM 10: TEKNİK DÖVME ŞARTNAMESİ VE UYGULANABİLİRLİK RAPORU'), 'Bölüm 10');
assert.ok(fullDossierText.includes('BÖLÜM 11: YAPAY ZEKA GÖRSEL ÜRETİM İSTEMLERİ (AI PROMPTS)'), 'Bölüm 11');
assert.ok(fullDossierText.includes('DOSYA SONU — DÖVME TASARIM ASİSTANI V2'), 'Dosya sonu');
console.log('✓ Test 13 başarılı');

// TEST 14: Eksik Veri Durumları — ASLA TAHMİNİ VERİ YAZILMAZ
console.log('Test 14: Eksik veri dürüstlüğü ve doğruluk');
const partialClient: PersonData = {
  id: 'partial-1',
  name: 'Ahmet Yılmaz',
  birthDate: '1985-04-10',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
  // birthTime, motherName, phone, email, test answers HEPSİ EKSİK
};

const partialDossierText = buildCompleteClientDataFromPerson(partialClient);
assert.ok(partialDossierText.includes('Ahmet Yılmaz'), 'Adı yer almalı');
assert.ok(partialDossierText.includes('[Belirtilmedi / 12:00 Referansı]'), 'Eksik doğum saati net belirtilmeli');
assert.ok(partialDossierText.includes('[Belirtilmedi - Ebced hesabı için opsiyonel]'), 'Eksik anne adı net belirtilmeli');
assert.ok(partialDossierText.includes('[Henüz yanıtlanmadı]'), 'Cevaplanmamış test soruları net belirtilmeli');
assert.ok(!partialDossierText.includes('undefined'), 'Asla "undefined" kelimesi basılmamalı');
assert.ok(!partialDossierText.includes('null'), 'Asla "null" kelimesi basılmamalı');
console.log('✓ Test 14 başarılı');

console.log('--- TÜM DANIŞAN VERİLERİ KOPYALAMA TESTLERİ BAŞARIYLA GEÇTİ ---');
