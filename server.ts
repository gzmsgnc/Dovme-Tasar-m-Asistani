import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { generateEsotericTattooStencilSvg } from './src/utils/stencilGenerator';

dotenv.config();

const PORT = 3000;

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Deep AI Esoteric & Artistic Synthesis
  app.post('/api/ai/deep-synthesis', async (req: Request, res: Response) => {
    try {
      const { person, numerology, astrology, enneagram, symbolism, parameters } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true,
          message: 'Gemini API anahtarı bulunamadı, yerel hesaplama motoru kullanılıyor.'
        });
      }

      const prompt = `
Sen dünya çapında ünlü, ezoterik sembolizm, numeroloji, kadim astroloji ve profesyonel dövme sanatı konusunda uzman bir master dövme sanatçısısın.
Aşağıdaki kişi için kişiselleştirilmiş dövme tasarım reçetesini derinleştir, her sembolün neden seçildiğini ve kişinin ruhsal-matematiksel profiliyle nasıl birleştiğini şiirsel ama teknik açıdan kusursuz bir üslupla açıkla.

Kişi: ${person.name} (Doğum: ${person.birthDate} ${person.birthTime || ''})
Numeroloji: Yaşam Yolu ${numerology.lifePathNumber} (${numerology.lifePathTitle}), İfade ${numerology.destinyNumber}, DM ${numerology.dmNumber}, Eksik Sayılar: ${numerology.missingNumbers.join(',') || 'Yok'}, 19 İlahi Yardım: ${numerology.divineHelp19.has19 ? 'Var' : 'Yok'}
Astroloji: Güneş ${astrology.sunSign}, Ay ${astrology.moonSign}, Yükselen ${astrology.ascendantSign}, Hakim Element: ${astrology.dominantElement}
Enneagram: ${enneagram.wing} (Temel Motivasyon: ${enneagram.coreMotivation}, Gölge: ${enneagram.shadowTraits.join(', ')})
Seçilen Semboller: Ana Sembol: ${parameters.mainSymbol}, Yardımcılar: ${parameters.secondarySymbols.join(', ')}
Dövme Stilleri: ${parameters.selectedStyles.join(', ')}
Yerleşim & Kompozisyon: ${parameters.bodyPlacement} (${parameters.composition})
Atmosfer & Renk: ${parameters.visualAtmosphere}, ${parameters.colorScheme}

Lütfen şu formatta JSON yanıt ver:
{
  "esotericInsight": "Kişinin ezoterik haritası ve dövmenin ruhsal anlamı (2-3 paragraf)",
  "technicalArtistNotes": "Dövme sanatçısı için iğne derinliği, çizgi kalınlığı, whip shading ve anatomik yerleşim rehberi",
  "symbolismDeepDive": [
    {
      "symbol": "Sembol adı",
      "reason": "Numeroloji, astroloji ve enneagramla kurulan derin bağlantı gerekçesi"
    }
  ],
  "enhancedPrompt": "Midjourney v6 için ultra detaylı, İngilizce master prompt"
}
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: unknown) {
      console.warn('AI synthesis fallback triggered:', err);
      res.json({ 
        success: false, 
        fallback: true,
        message: 'Canlı AI servisi meşgul, yerel matematiksel ezoterik sentez devrede.' 
      });
    }
  });

  // Prompt Variations Generator
  app.post('/api/ai/refine-prompts', async (req: Request, res: Response) => {
    try {
      const { recipe } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true,
          message: 'Gemini API anahtarı ayarlanmamış.'
        });
      }

      const prompt = `
Aşağıdaki dövme tasarım reçetesi için Midjourney, Flux ve Stable Diffusion'da kullanılabilecek 3 farklı sanatsal varyasyon AI promptu üret.

Reçete Başlığı: ${recipe.title}
Stiller: ${recipe.parameters.selectedStyles.join(', ')}
Ana Sembol: ${recipe.parameters.mainSymbol}
Yardımcılar: ${recipe.parameters.secondarySymbols.join(', ')}
Yerleşim: ${recipe.parameters.bodyPlacement}
Atmosfer: ${recipe.parameters.visualAtmosphere}

Lütfen JSON formatında yanıt ver:
{
  "variations": [
    {
      "name": "Varyasyon 1 Başlığı (örneğin: Ultra-Fine Line & Mistik Sigil)",
      "styleFocus": "Stil odağı",
      "prompt": "Tam İngilizce AI görsel üretim promptu",
      "tips": "Bu varyasyonun en iyi çalıştığı modeller ve püf noktalar"
    }
  ]
}
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: unknown) {
      console.warn('AI prompts fallback triggered:', err);
      res.json({ 
        success: false, 
        fallback: true,
        message: 'Varyasyon servisi meşgul, ana prompt kütüphanesi aktif.' 
      });
    }
  });

  // Visual Sketch Generation (Tattoo Flash & Stencil Linework with Auto-Fallback & Seed Randomization)
  app.post('/api/ai/generate-sketch', async (req: Request, res: Response) => {
    const { 
      prompt, 
      recipe, 
      seed: requestedSeed, 
      requestId: requestedReqId, 
      variationIndex: requestedVarIndex,
      mode = 'flash' // 'stencil' | 'flash'
    } = req.body;
    
    // Generate unique tracking parameters if not provided
    const seed = typeof requestedSeed === 'number' ? requestedSeed : Math.floor(Math.random() * 1000000);
    const variationIndex = typeof requestedVarIndex === 'number' ? requestedVarIndex : 1;
    const requestId = requestedReqId || `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Extract rich metadata for high-precision vector stencil & prompt building
    const mainSymbol = recipe?.parameters?.mainSymbol || 'Kurt (Wolf)';
    const secondarySymbols = recipe?.parameters?.secondarySymbols || ['Kutsal Lotus', 'Kutsal Geometri'];
    const subtleDetails = recipe?.subtleDetails || ['19 İlahi Yardım Mührü', 'Kozmik Takımyıldız'];
    const lifePathNumber = recipe?.numerology?.lifePathNumber || '7';
    const sunSign = recipe?.astrology?.sunSign || 'Akrep';
    const moonSign = recipe?.astrology?.moonSign || 'Balık';
    const ascendantSign = recipe?.astrology?.ascendantSign || 'Yay';
    const hasDivine19 = recipe?.numerology?.divineHelp19?.has19 ?? true;
    const styles = recipe?.parameters?.selectedStyles || ['Fine Line', 'Dotwork', 'Geometric'];
    const colorScheme = recipe?.parameters?.colorScheme || 'Saf Monokrom Siyah';
    const composition = recipe?.parameters?.composition || 'Merkezi Kutsal Odak';
    const orientation = recipe?.parameters?.orientation || 'Dikey (Anatomik)';
    const bodyPlacement = recipe?.parameters?.bodyPlacement || 'Önkol İç';
    const clientName = recipe?.clientName || 'Danışan';

    // Select the optimal prompt based on mode
    let targetPrompt = prompt;
    if (!targetPrompt) {
      if (mode === 'stencil') {
        targetPrompt = recipe?.masterOutlinePrompt || recipe?.masterEnglishPrompt || `professional tattoo stencil line art transfer sheet, pure black vector outline on clean white background, tattoo linework, stencil-ready, clean intentional contours, featuring ${mainSymbol} and ${secondarySymbols.join(', ')}`;
      } else {
        targetPrompt = recipe?.masterShadedPrompt || recipe?.masterEnglishPrompt || `professional tattoo flash sheet design, finished black and grey tattoo artwork, tattoo design, tattoo flash, stencil-ready, tattoo linework, featuring ${mainSymbol} and ${secondarySymbols.join(', ')}`;
      }
    }

    const negativePrompt = recipe?.negativePrompt || `decorative wallpaper, seamless pattern, ornamental background pattern, generic fantasy illustration, concept art, book cover, poster design, logo, emblem, random collection of symbols, separate floating symbols, unrelated decorative elements, excessive geometry, overcrowded composition, tattoo mockup, skin, body, arm, hand, photograph, human model, 3D render, photorealistic skin pores, blurry gradients, unreadable micro clutter, messy background, watermarks, text lettering, signatures, oversaturated rainbow colors, distorted anatomy, extra limbs, muddy gray fills`;

    const ai = getGenAI();
    let aiFailureReason = '';

    if (ai) {
      try {
        const fullAiPrompt = `${targetPrompt} [Variation #${variationIndex}, Seed: ${seed}]. Strict instructions: single cohesive tattoo composition, stencil-ready, clean background. DO NOT include: ${negativePrompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullAiPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1'
            }
          }
        });

        let imageUrl: string | null = null;
        let imageMime = 'image/png';
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data && part.inlineData.data.length > 50) {
              const rawData = part.inlineData.data;
              const buffer = Buffer.from(rawData, 'base64');
              // Verify buffer has valid image magic bytes (PNG: 89 50 4E 47 or JPEG: FF D8 FF)
              const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
              const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
              if (isPng || isJpeg) {
                imageMime = isJpeg ? 'image/jpeg' : 'image/png';
                imageUrl = `data:${imageMime};base64,${rawData}`;
                break;
              }
            }
          }
        }

        if (imageUrl) {
          return res.json({ 
            success: true, 
            imageUrl, 
            svgUrl: null,
            imageFormat: 'png',
            mimeType: imageMime,
            isAiLive: true,
            isFallback: false,
            modelUsed: 'gemini-3.1-flash-lite-image',
            requestId,
            seed,
            variationIndex,
            mode,
            promptUsed: fullAiPrompt,
            message: `Canlı Gemini Görsel Modeli ile yeni ${mode === 'stencil' ? 'Termal Stencil Şablonu' : 'Dövme Tasarım Flaşı'} (#${variationIndex}) başarıyla üretildi.` 
          });
        } else {
          aiFailureReason = 'Gemini modelinden geçerli görüntü formatı (PNG/JPEG) dönmedi.';
        }
      } catch (err: any) {
        aiFailureReason = err?.message || 'Kota/bağlantı sınırı';
        console.warn(`[${requestId}] Gemini image model unavailable/quota-limited (${err?.status || 'ERR'}):`, err?.message || err);
      }
    } else {
      aiFailureReason = 'GEMINI_API_KEY yapılandırılmamış';
    }

    // High-Precision Procedural Esoteric Stencil & Flash Engine (Dynamic Seed Variation)
    try {
      const fallbackSvgDataUrl = generateEsotericTattooStencilSvg({
        mainSymbol,
        secondarySymbols,
        subtleDetails,
        lifePathNumber,
        sunSign,
        moonSign,
        ascendantSign,
        hasDivine19,
        styles,
        colorScheme,
        composition,
        orientation,
        bodyPlacement,
        clientName,
        seed,
        variationIndex,
        requestId,
        mode: mode as 'stencil' | 'flash'
      });

      // Extract raw SVG text from base64 or utf8 data URL
      let svgBuffer: Buffer;
      if (fallbackSvgDataUrl.includes(';base64,')) {
        const b64 = fallbackSvgDataUrl.split(';base64,')[1];
        svgBuffer = Buffer.from(b64, 'base64');
      } else {
        const commaIdx = fallbackSvgDataUrl.indexOf(',');
        svgBuffer = Buffer.from(decodeURIComponent(fallbackSvgDataUrl.substring(commaIdx + 1)), 'utf-8');
      }

      // Convert SVG to ultra-crisp, high-fidelity 1400x1800 PNG using Sharp
      // This produces a 100% compliant, standard PNG file with magic header 0x89 0x50 0x4E 0x47
      const isStencil = mode === 'stencil';
      const pngBuffer = await sharp(svgBuffer)
        .resize(1400, 1800, {
          fit: 'contain',
          background: isStencil ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 8, g: 8, b: 8, alpha: 1 }
        })
        .png({ compressionLevel: 8 })
        .toBuffer();

      // Verify the generated PNG header
      const isValidPng = pngBuffer.length > 500 &&
        pngBuffer[0] === 0x89 &&
        pngBuffer[1] === 0x50 &&
        pngBuffer[2] === 0x4e &&
        pngBuffer[3] === 0x47;

      if (!isValidPng) {
        throw new Error('Üretilen PNG imza doğrulaması başarısız oldu.');
      }

      const pngDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

      return res.json({ 
        success: true, 
        imageUrl: pngDataUrl, 
        svgUrl: fallbackSvgDataUrl,
        imageFormat: 'png',
        mimeType: 'image/png',
        isAiLive: false,
        isFallback: true,
        modelUsed: isStencil ? 'Termal Transfer Vektör & Raster Stencil Motoru (Sharp 1400x1800)' : 'Ezoterik Dövme Flaşı Raster Motoru (Sharp 1400x1800)',
        requestId,
        seed,
        variationIndex,
        mode,
        promptUsed: targetPrompt,
        aiStatusNote: aiFailureReason.includes('quota') || aiFailureReason.includes('429') 
          ? 'Google Gemini görsel API kotası (429: Free Tier Limiti 0) nedeniyle sistem otomatik olarak yüksek çözünürlüklü (1400x1800) yerel PNG/Vektör Motoruna geçti.'
          : `Görsel motoru durumu: ${aiFailureReason || 'Yerel motor aktif'}. Gerçek PNG başarıyla derlendi.`,
        message: `${mode === 'stencil' ? 'Termal Transfer Stencil Şablonu (03RL)' : 'Dövme Tasarım Flaşı'} (#${variationIndex}, Tohum: #${seed}) başarıyla oluşturuldu.` 
      });
    } catch (fallbackErr: unknown) {
      console.error(`[${requestId}] Fallback generation error:`, fallbackErr);
      return res.status(500).json({ 
        success: false, 
        error: 'Görsel oluşturulurken bir hata meydana geldi. Bozuk dosya indirilmesi engellendi.' 
      });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dövme Tasarım Asistanı server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
