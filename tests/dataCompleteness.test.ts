import assert from 'node:assert/strict';
import {
  DataCompletenessError,
  IncompleteTestError,
  validateClientMandatoryFields,
  validateEnneagramAnswers,
  validateTotemAnswers,
  validateNumerologyPrerequisites,
  validateAstrologyPrerequisites,
  validateEbcedPrerequisites,
  validateChakraPrerequisites,
  validateRecipePrerequisites,
  validateExportPrerequisites,
  assertDataComplete
} from '../src/utils/dataCompleteness';
import { generateTattooRecipe } from '../src/utils/recipeGenerator';
import { downloadRecipeAsJson } from '../src/utils/jsonExport';

console.log('--- RUNNING DATA COMPLETENESS & MANDATORY VALIDATION TESTS ---');

// 1. DANIŞAN ZORUNLU KİMLİK BİLGİLERİ DENETİMİ
{
  // Boş veya 'Misafir' ismi reddedilmeli
  const res1 = validateClientMandatoryFields({ name: '', birthDate: '1991-11-24', birthPlace: 'İstanbul' });
  assert.equal(res1.isValid, false);
  assert.ok(res1.missingFields.includes('Ad Soyad'));

  const resGuest = validateClientMandatoryFields({ name: 'Misafir', birthDate: '1991-11-24', birthPlace: 'İstanbul' });
  assert.equal(resGuest.isValid, false);
  assert.ok(resGuest.missingFields.includes('Gerçek Ad Soyad'));

  // Geçersiz veya eksik doğum tarihi reddedilmeli
  const res2 = validateClientMandatoryFields({ name: 'Ahmet Yılmaz', birthDate: '', birthPlace: 'İstanbul' });
  assert.equal(res2.isValid, false);
  assert.ok(res2.missingFields.includes('Doğum Tarihi'));

  const resInvalidDate = validateClientMandatoryFields({ name: 'Ahmet Yılmaz', birthDate: '1991-02-31', birthPlace: 'İstanbul' });
  assert.equal(resInvalidDate.isValid, false);
  assert.ok(resInvalidDate.missingFields.includes('Geçerli Doğum Tarihi'));

  // Eksik veya tanınmayan doğum yeri reddedilmeli
  const res3 = validateClientMandatoryFields({ name: 'Ahmet Yılmaz', birthDate: '1991-11-24', birthPlace: '' });
  assert.equal(res3.isValid, false);
  assert.ok(res3.missingFields.includes('Doğum Yeri'));

  // Geçerli veriler onaylanmalı
  const resValid = validateClientMandatoryFields({ 
    name: 'Gizem Selma Genç', 
    birthDate: '1991-11-24', 
    birthPlace: 'Fatih, İstanbul, Türkiye' 
  });
  assert.equal(resValid.isValid, true);
  assert.equal(resValid.missingFields.length, 0);

  console.log('✓ Danışan zorunlu kimlik alanları denetimleri başarılı');
}

// 2. 15 SORULUK ENNEAGRAM TESTİ TAMLIĞI DENETİMİ
{
  // Boş cevaplar reddedilmeli
  const enneaEmpty = validateEnneagramAnswers({});
  assert.equal(enneaEmpty.isComplete, false);
  assert.equal(enneaEmpty.totalQuestions, 15);
  assert.equal(enneaEmpty.answeredQuestions, 0);
  assert.equal(enneaEmpty.missingQuestionIds.length, 15);

  // Kısmi (14/15) cevaplar reddedilmeli ve eksik soru ID'si belirtilmeli
  const partialAnswers: Record<number, number> = {};
  for (let i = 1; i <= 14; i++) {
    partialAnswers[i] = 4;
  }
  const enneaPartial = validateEnneagramAnswers(partialAnswers);
  assert.equal(enneaPartial.isComplete, false);
  assert.equal(enneaPartial.answeredQuestions, 14);
  assert.deepEqual(enneaPartial.missingQuestionIds, [15]);

  // Tam 15/15 cevap onaylanmalı
  const fullAnswers: Record<number, number> = {};
  for (let i = 1; i <= 15; i++) {
    fullAnswers[i] = (i % 9) + 1;
  }
  const enneaFull = validateEnneagramAnswers(fullAnswers);
  assert.equal(enneaFull.isComplete, true);
  assert.equal(enneaFull.answeredQuestions, 15);
  assert.equal(enneaFull.missingQuestionIds.length, 0);

  console.log('✓ 15 Soruluk Enneagram testi tamlık denetimleri başarılı');
}

// 3. 15 SORULUK DAVRANIŞSAL TOTEM TESTİ TAMLIĞI DENETİMİ
{
  // Boş cevaplar reddedilmeli
  const totemEmpty = validateTotemAnswers({});
  assert.equal(totemEmpty.isComplete, false);
  assert.equal(totemEmpty.totalQuestions, 15);
  assert.equal(totemEmpty.answeredQuestions, 0);
  assert.equal(totemEmpty.missingQuestionIds.length, 15);

  // Kısmi cevaplar (Örn: Soru 5 ve 10 eksik)
  const partialTotem: Record<number, string> = {};
  for (let i = 1; i <= 15; i++) {
    if (i !== 5 && i !== 10) {
      partialTotem[i] = `${i}a`;
    }
  }
  const totemPartial = validateTotemAnswers(partialTotem);
  assert.equal(totemPartial.isComplete, false);
  assert.equal(totemPartial.answeredQuestions, 13);
  assert.deepEqual(totemPartial.missingQuestionIds, [5, 10]);

  // Tam 15/15 cevap onaylanmalı
  const fullTotem: Record<number, string> = {};
  for (let i = 1; i <= 15; i++) {
    fullTotem[i] = `${i}b`;
  }
  const totemFull = validateTotemAnswers(fullTotem);
  assert.equal(totemFull.isComplete, true);
  assert.equal(totemFull.answeredQuestions, 15);
  assert.equal(totemFull.missingQuestionIds.length, 0);

  console.log('✓ 15 Soruluk Davranışsal Totem testi tamlık denetimleri başarılı');
}

// 4. HESAPLAMA MOTORLARI ÖN ŞARTLARI DENETİMİ
{
  // Numeroloji: İsimsiz veya tarihsiz çalıştırılamaz
  const numCheck1 = validateNumerologyPrerequisites('', '1991-11-24');
  assert.equal(numCheck1.isValid, false);
  const numCheck2 = validateNumerologyPrerequisites('Caner', '');
  assert.equal(numCheck2.isValid, false);
  const numCheckValid = validateNumerologyPrerequisites('Caner', '1991-11-24');
  assert.equal(numCheckValid.isValid, true);

  // Astroloji: Doğum tarihsiz veya doğum yersiz çalıştırılamaz
  const astroCheck1 = validateAstrologyPrerequisites('', 'İstanbul');
  assert.equal(astroCheck1.isValid, false);
  const astroCheck2 = validateAstrologyPrerequisites('1991-11-24', '');
  assert.equal(astroCheck2.isValid, false);
  const astroCheckValid = validateAstrologyPrerequisites('1991-11-24', 'İstanbul');
  assert.equal(astroCheckValid.isValid, true);

  // Ebced: Anne adı olmadan Ebced/Yıldızname çalıştırılamaz
  const ebcedCheck1 = validateEbcedPrerequisites('Caner', '');
  assert.equal(ebcedCheck1.isValid, false);
  const ebcedCheckValid = validateEbcedPrerequisites('Caner', 'Meryem');
  assert.equal(ebcedCheckValid.isValid, true);

  // Çakra: Numeroloji ve Astroloji eksikse çalıştırılamaz
  const chakraCheck1 = validateChakraPrerequisites(null, null);
  assert.equal(chakraCheck1.isValid, false);
  const chakraCheckValid = validateChakraPrerequisites({ lifePathNumber: 7 } as any, { sunSign: 'Yay' } as any);
  assert.equal(chakraCheckValid.isValid, true);

  console.log('✓ Hesaplama motorları ön şart denetimleri başarılı');
}

// 5. REÇETE ÜRETİMİNDE KESİN EKSİK VERİ ENGELİ
{
  const { calculateNumerology } = await import('../src/utils/numerology');
  const { calculateAstrology } = await import('../src/utils/astrology');
  const { getEnneagramProfile } = await import('../src/utils/enneagram');
  const { deriveSymbolismProfile } = await import('../src/utils/symbolism');

  const validPerson: any = {
    id: 'test-client',
    name: 'Gizem Selma Genç',
    birthDate: '1991-11-24',
    birthPlace: 'Fatih, İstanbul, Türkiye',
    motherName: 'Sevgi'
  };

  const validNum = calculateNumerology('Gizem Selma Genç', '1991-11-24');
  const validAstro = calculateAstrology('1991-11-24', '12:00', 'Fatih, İstanbul, Türkiye');
  const validEnnea = getEnneagramProfile(4, '4w5');
  const completeTotemAnswers: Record<number, string> = Object.fromEntries(
    Array.from({ length: 15 }, (_, index) => [index + 1, `${index + 1}a`])
  );
  const validSymb = deriveSymbolismProfile(validNum, validAstro, validEnnea, {
    name: 'Gizem Selma Genç',
    birthDate: '1991-11-24',
    birthPlace: 'Fatih, İstanbul, Türkiye',
    totemAnswers: completeTotemAnswers,
    enneagramType: 4,
    lifePathNumber: 7
  });

  const validParams: any = {
    selectedStyles: ['Fine Line', 'Geometric'],
    bodyPlacement: 'Önkol İç',
    composition: 'Dinamik Asimetrik',
    orientation: 'Dikey (Anatomik)',
    density: 'Dengeli & Net (%60)',
    colorScheme: 'Saf Monokrom Siyah',
    visualAtmosphere: 'Mistik & Ezoterik',
    mainSymbol: validSymb.totemAnimal,
    secondarySymbols: []
  };

  // 1. İsim 'Misafir' ise generateTattooRecipe hata fırlatmalı
  assert.throws(
    () => generateTattooRecipe({ ...validPerson, name: 'Misafir' }, validNum, validAstro, validEnnea, validSymb, validParams),
    (err: any) => err instanceof DataCompletenessError && err.missingFields.includes('Gerçek Ad Soyad')
  );

  // 2. Doğum tarihi eksikse hata fırlatmalı
  assert.throws(
    () => generateTattooRecipe({ ...validPerson, birthDate: '' }, validNum, validAstro, validEnnea, validSymb, validParams),
    (err: any) => err instanceof DataCompletenessError && err.missingFields.includes('Doğum Tarihi')
  );

  // 3. Stiller seçilmemişse hata fırlatmalı
  assert.throws(
    () => generateTattooRecipe(validPerson, validNum, validAstro, validEnnea, validSymb, { ...validParams, selectedStyles: [] }),
    (err: any) => err instanceof DataCompletenessError && err.missingFields.includes('En Az Bir Dövme Stili')
  );

  // 4. Tüm veriler tamken başarıyla reçete üretilmeli
  const recipe = generateTattooRecipe(validPerson, validNum, validAstro, validEnnea, validSymb, validParams);
  assert.ok(recipe);
  assert.equal(recipe.clientName, 'Gizem Selma Genç');

  console.log('✓ generateTattooRecipe zorunlu veri tamlığı engeli başarılı');
}

// 6. DIŞA AKTARMADA EKSİK REÇETE ENGELİ
{
  // Eksik veya boş reçete ile downloadRecipeAsJson çalıştırılamaz
  assert.throws(
    () => downloadRecipeAsJson(null as any),
    (err: any) => err instanceof DataCompletenessError
  );

  assert.throws(
    () => downloadRecipeAsJson({ id: '', clientName: 'Ahmet' } as any),
    (err: any) => err instanceof DataCompletenessError
  );

  console.log('✓ Dışa aktarma (export) eksik veri engeli başarılı');
}

// 7. ASSERT DATA COMPLETE VE HATA TİPİ KONTROLÜ
{
  assert.throws(
    () => assertDataComplete({
      isValid: false,
      missingFields: ['Ad Soyad', 'Doğum Tarihi'],
      errors: { name: 'Eksik' },
      warnings: [],
      summaryMessage: 'Zorunlu alanlar eksik.'
    }, 'Test Modülü'),
    (err: any) => {
      assert.ok(err instanceof DataCompletenessError);
      assert.deepEqual(err.missingFields, ['Ad Soyad', 'Doğum Tarihi']);
      return true;
    }
  );

  console.log('✓ assertDataComplete kesin engelleme fonksiyonu başarılı');
}

console.log('--- TÜM VERİ TAMAMLIĞI VE EKSİK CEVAP ENGELİ TESTLERİ BAŞARIYLA TAMAMLANDI ---');
