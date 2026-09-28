import { TattooRecipe } from '../types';

/**
 * Downloads full TattooRecipe and Symbol Integration analysis as a formatted JSON file.
 * 
 * Standartlaştırılmış JSON Çıktı Şeması:
 * {
 *   "user": { ... },
 *   "analysis": { ... },
 *   "symbols": [ ... ],
 *   "visualTranslations": [ ... ],
 *   "integrations": [ ... ],
 *   "designGeometry": { ... },
 *   "symbolMap": [ ... ],
 *   "finalDesign": { ... },
 *   "traceability": [ ... ],
 *   "validation": { ... },
 *   "versions": { ... }
 * }
 */
export function downloadRecipeAsJson(recipe: TattooRecipe): boolean {
  try {
    const clientName = recipe.clientName || recipe.personData.name || 'Danisan';
    const sanitizedName = clientName.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s_-]/g, '').trim().replace(/\s+/g, '_');
    const filename = `Dovme_Tasarim_Recetesi_${sanitizedName}_${recipe.id.substring(0, 8)}.json`;

    const integration = recipe.symbolicIntegration;

    const payload = {
      user: {
        id: recipe.personData.id,
        name: recipe.personData.name,
        birthDate: recipe.personData.birthDate,
        birthTime: recipe.personData.birthTime || null,
        birthPlace: recipe.personData.birthPlace || null,
        motherName: recipe.personData.motherName || null
      },
      analysis: {
        numerology: {
          lifePathNumber: recipe.numerology.lifePathNumber,
          lifePathTitle: recipe.numerology.lifePathTitle,
          destinyNumber: recipe.numerology.destinyNumber,
          destinyTitle: recipe.numerology.destinyTitle,
          soulUrgeNumber: recipe.numerology.soulUrgeNumber,
          dmNumber: recipe.numerology.dmNumber,
          missingNumbers: recipe.numerology.missingNumbers,
          has19DivineHelp: recipe.numerology.divineHelp19?.has19 ?? false
        },
        astrology: {
          sunSign: recipe.astrology.sunSign,
          moonSign: recipe.astrology.moonSign,
          ascendantSign: recipe.astrology.ascendantSign,
          dominantElement: recipe.astrology.dominantElement,
          zodiacSystem: recipe.astrology.zodiacSystem
        },
        enneagram: {
          type: recipe.enneagram.coreType ?? recipe.enneagram.type,
          typeName: recipe.enneagram.typeName,
          wing: recipe.enneagram.wing,
          coreMotivation: recipe.enneagram.coreMotivation,
          stressPoint: recipe.enneagram.stressPoint,
          growthPoint: recipe.enneagram.growthPoint
        },
        totem: {
          primary: recipe.symbolism.totemAnimal,
          hierarchy: recipe.symbolism.totemHierarchy || [],
          includeInDesign: recipe.parameters.includeTotemInDesign ?? false
        },
        chakra: recipe.chakra ? {
          overallScore: recipe.chakra.overallChakraBalanceScore,
          primaryDirective: recipe.chakra.primaryHealingDirective
        } : null
      },
      symbols: integration?.symbols || recipe.symbolRationales || [],
      visualTranslations: integration?.visualTranslations || [],
      integrations: integration?.integrations || [],
      designGeometry: integration?.designGeometry || {
        bodyPlacement: recipe.parameters.bodyPlacement,
        composition: recipe.parameters.composition,
        density: recipe.parameters.density,
        colorScheme: recipe.parameters.colorScheme,
        selectedStyles: recipe.parameters.selectedStyles
      },
      symbolMap: integration?.symbolMap || [],
      finalDesign: {
        id: recipe.id,
        title: recipe.title,
        createdAt: recipe.createdAt,
        styles: recipe.parameters.selectedStyles,
        bodyPlacement: recipe.parameters.bodyPlacement,
        density: recipe.parameters.density,
        colorScheme: recipe.parameters.colorScheme,
        visualAtmosphere: recipe.parameters.visualAtmosphere,
        summaryRationale: recipe.summaryRationale,
        compositionGuide: recipe.compositionGuide,
        needleAndTechniqueGuide: recipe.needleAndTechniqueGuide,
        placementAnatomyNotes: recipe.placementAnatomyNotes,
        masterEnglishPrompt: recipe.masterEnglishPrompt,
        midjourneyPrompt: recipe.midjourneyPrompt || recipe.masterEnglishPrompt,
        dalle3Prompt: recipe.dalle3Prompt || recipe.masterEnglishPrompt,
        stencilPrompt: recipe.stencilPrompt || recipe.masterOutlinePrompt || recipe.masterEnglishPrompt,
        feasibility: recipe.feasibility
      },
      traceability: integration?.traceability || [],
      validation: integration?.validation || {
        status: 'VALID',
        score: 100,
        checks: []
      },
      versions: integration?.version || {
        analysisVersion: '1.2.0',
        symbolVersion: '2.0.0',
        integrationVersion: '2.0.0',
        designVersion: '1.0.0'
      }
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);

    return true;
  } catch (err) {
    console.error('Failed to export recipe JSON:', err);
    return false;
  }
}
