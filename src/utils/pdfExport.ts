import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TattooRecipe } from '../types';
import { calculateEbcedAndYildizname } from './ebced';

/**
 * Generates an ultra-luxurious, comprehensive multi-page PDF document
 * containing all client information, esoteric matrices, 7+2 chakra analysis,
 * totem animal hierarchy, tattoo composition specs, components breakdown (ek dosyalar),
 * and master AI prompts.
 */
export async function exportRecipeToPDF(
  recipe: TattooRecipe,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress('PDF dökümanı hazırlanıyor...');

    const clientName = recipe.clientName || recipe.personData.name || 'Danışan';
    const cleanClientName = clientName.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s_-]/g, '').trim().replace(/\s+/g, '_');
    const fileName = `Dovme_Konsultasyon_Dosyasi_${cleanClientName}.pdf`;

    const r = recipe;
    const p = recipe.personData;
    const num = recipe.numerology;
    const astro = recipe.astrology;
    const ennea = recipe.enneagram;
    const symb = recipe.symbolism;
    const chakra = recipe.chakra;
    const shadow = recipe.shadowAnalysis;
    const params = recipe.parameters || (recipe as any).designParameters || {} as any;

    const ebcedResult = p.motherName ? calculateEbcedAndYildizname(p.name, p.motherName) : null;

    // Create offscreen container
    const container = document.createElement('div');
    container.id = 'pdf-export-virtual-container';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '820px'; // Optimized A4 ratio width
    container.style.backgroundColor = '#0b0b0e';
    container.style.color = '#e4e4e7';
    container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    container.style.padding = '36px 40px';
    container.style.boxSizing = 'border-box';
    container.style.zIndex = '-9999';

    // HTML Template
    container.innerHTML = `
      <style>
        .pdf-page-box {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #e4e4e7;
          background: #0b0b0e;
          line-height: 1.5;
        }
        .pdf-gold { color: #c4a47c; }
        .pdf-gold-bg { background-color: rgba(196, 164, 124, 0.12); }
        .pdf-border-gold { border-color: rgba(196, 164, 124, 0.35); }
        .pdf-card {
          background-color: #111116;
          border: 1px solid #23232b;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 18px;
        }
        .pdf-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          font-family: monospace;
          padding: 3px 8px;
          border-radius: 6px;
          background: #181820;
          border: 1px solid #323240;
          color: #c4a47c;
        }
        .pdf-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .pdf-table th {
          background-color: #171720;
          color: #c4a47c;
          text-align: left;
          padding: 8px 10px;
          font-family: monospace;
          font-size: 10px;
          text-transform: uppercase;
          border-bottom: 1px solid #2a2a36;
        }
        .pdf-table td {
          padding: 7px 10px;
          border-bottom: 1px solid #1c1c24;
          color: #d4d4d8;
        }
        .pdf-section-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #c4a47c;
          border-bottom: 1px solid rgba(196, 164, 124, 0.3);
          padding-bottom: 6px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      </style>

      <div class="pdf-page-box">
        <!-- HEADER / BRANDING -->
        <div style="border-bottom: 2px solid #c4a47c; padding-bottom: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px; color: #c4a47c;">✦</span>
                <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 800; letter-spacing: 3px; color: #ffffff; margin: 0; text-transform: uppercase;">
                  INKSCRIBE STUDIO
                </h1>
              </div>
              <p style="font-family: monospace; font-size: 10px; color: #c4a47c; letter-spacing: 3px; text-transform: uppercase; margin: 4px 0 0 0;">
                Kişiye Özel Ezoterik Dövme Konsültasyon & Şifa Dosyası
              </p>
            </div>
            <div style="text-align: right; font-family: monospace; font-size: 10px; color: #888899;">
              <div>Tarih: <strong style="color: #fff;">${new Date(r.createdAt).toLocaleDateString('tr-TR')}</strong></div>
              <div>Dosya Ref: <strong style="color: #c4a47c;">${r.id.substring(0, 16)}</strong></div>
              <div style="margin-top: 4px;"><span class="pdf-badge" style="background:#1e1a12; border-color:#c4a47c; color:#c4a47c;">✓ RESMİ KONSÜLTASYON RAPORU</span></div>
            </div>
          </div>

          <div style="margin-top: 16px; background: linear-gradient(90deg, rgba(196,164,124,0.15) 0%, rgba(20,20,26,0) 100%); border-left: 3px solid #c4a47c; padding: 10px 14px; border-radius: 0 8px 8px 0;">
            <div style="font-size: 16px; font-family: Georgia, serif; font-weight: 700; color: #ffffff;">
              ${r.title || 'Kişiye Özel Ruhani Dövme Reçetesi'}
            </div>
            <div style="font-size: 11px; color: #c4a47c; margin-top: 2px;">
              Danışan: <strong style="color: #ffffff;">${clientName}</strong>
            </div>
          </div>
        </div>

        <!-- 1. DANIŞAN VE DOĞUM BİLGİLERİ -->
        <div class="pdf-section-title">
          <span>◆</span> 1. DANIŞAN VE DOĞUM HARİTASI VERİLERİ
        </div>
        <div class="pdf-card">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 11px;">
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Ad & Soyad</span>
              <strong style="color: #fff; font-size: 13px;">${p.name}</strong>
            </div>
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Doğum Tarihi & Saati</span>
              <strong style="color: #fff;">${p.birthDate} ${p.birthTime ? `(${p.birthTime})` : ''}</strong>
            </div>
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Doğum Yeri / Şehir</span>
              <strong style="color: #fff;">${p.birthPlace || 'Belirtilmedi'}</strong>
            </div>
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Anne Adı & Ebced-Yıldızname</span>
              <strong style="color: #c4a47c;">
                ${p.motherName ? `${p.motherName} (Ebced: ${ebcedResult?.totalEbced || '-'} • ${ebcedResult?.yildiznameBurcName || ''})` : 'Belirtilmedi'}
              </strong>
            </div>
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Astroloji Zodyak Sistemi</span>
              <strong style="color: #fff;">${p.zodiacSystem === 'Sidereal' ? 'Vedik / Sideral (Lahiri)' : 'Batı / Tropikal Zodyak'}</strong>
            </div>
            <div>
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase; display: block;">Kişisel Sayılar & Kodlar</span>
              <strong style="color: #fff;">${p.personalNumbers || 'Pisagor Standart Matrisi'}</strong>
            </div>
          </div>
          ${p.personalStory ? `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #1f1f28; font-size: 11px;">
              <span style="font-family: monospace; font-size: 9px; color: #c4a47c; text-transform: uppercase; display: block; margin-bottom: 2px;">Danışan Hikâyesi & Yaşam Teması:</span>
              <div style="color: #d1d1d6; font-style: italic;">"${p.personalStory}"</div>
            </div>
          ` : ''}
          ${p.notes ? `
            <div style="margin-top: 8px; font-size: 11px;">
              <span style="font-family: monospace; font-size: 9px; color: #71717a; text-transform: uppercase;">Özel Notlar:</span>
              <span style="color: #a1a1aa; margin-left: 4px;">${p.notes}</span>
            </div>
          ` : ''}
        </div>

        <!-- 2. NUMEROLOJİ VE ASTROLOJİ ANALİZİ -->
        <div class="pdf-section-title">
          <span>◆</span> 2. NUMEROLOJİ, ASTROLOJİ VE ENNEAGRAM SENTEZİ
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px;">
          <!-- Numerology Column -->
          <div class="pdf-card" style="margin-bottom: 0;">
            <div style="font-family: monospace; font-size: 10px; color: #c4a47c; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">
              ✦ Pisagor Numeroloji Matrisi
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px;">
              <div style="background: #17171e; padding: 8px; border-radius: 8px; border: 1px solid #262633;">
                <span style="font-size: 9px; color: #71717a; display: block; font-family: monospace;">YAŞAM YOLU</span>
                <span style="font-size: 18px; font-weight: 800; color: #c4a47c; font-family: monospace;">${num.lifePathNumber}</span>
                <span style="font-size: 10px; color: #ccc; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${num.lifePathTitle}</span>
              </div>
              <div style="background: #17171e; padding: 8px; border-radius: 8px; border: 1px solid #262633;">
                <span style="font-size: 9px; color: #71717a; display: block; font-family: monospace;">ANA KULVAR (KADER)</span>
                <span style="font-size: 18px; font-weight: 800; color: #ffffff; font-family: monospace;">${num.destinyNumber}</span>
                <span style="font-size: 10px; color: #ccc; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${num.destinyTitle}</span>
              </div>
              <div style="background: #17171e; padding: 8px; border-radius: 8px; border: 1px solid #262633;">
                <span style="font-size: 9px; color: #71717a; display: block; font-family: monospace;">KALP ARZUSU</span>
                <span style="font-size: 18px; font-weight: 800; color: #ffffff; font-family: monospace;">${num.soulUrgeNumber}</span>
                <span style="font-size: 10px; color: #ccc; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${num.soulUrgeTitle}</span>
              </div>
              <div style="background: #17171e; padding: 8px; border-radius: 8px; border: 1px solid #262633;">
                <span style="font-size: 9px; color: #71717a; display: block; font-family: monospace;">DÜNYA MİSYONU (DM)</span>
                <span style="font-size: 18px; font-weight: 800; color: #c4a47c; font-family: monospace;">${num.dmNumber}</span>
                <span style="font-size: 10px; color: #ccc; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${num.dmTitle}</span>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 10px; font-family: monospace; color: #a1a1aa; border-top: 1px solid #1f1f28; padding-top: 8px;">
              <div>19 İlahi Yardım: <strong style="color: #c4a47c;">${num.divineHelp19.level}</strong> (${num.divineHelp19.reason})</div>
              <div style="margin-top: 3px;">Kişisel Yıl: <strong>${num.personalYear}</strong> • Eksik Sayılar: <strong>${num.missingNumbers.join(', ') || 'Yok (Tam Matris)'}</strong></div>
            </div>
          </div>

          <!-- Astrology & Enneagram Column -->
          <div class="pdf-card" style="margin-bottom: 0;">
            <div style="font-family: monospace; font-size: 10px; color: #c4a47c; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">
              ✦ Astroloji & Enneagram Arketipi
            </div>
            <div style="font-size: 11px; space-y: 6px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1c1c24; padding-bottom: 5px;">
                <span style="color: #71717a;">Güneş Burcu:</span>
                <strong style="color: #fff;">${astro.sunSign} ${astro.sunSignSymbol} (${astro.sunDegreeFormatted || ''})</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1c1c24; padding-bottom: 5px; padding-top: 4px;">
                <span style="color: #71717a;">Ay Burcu:</span>
                <strong style="color: #fff;">${astro.moonSign} ${astro.moonSignSymbol} (${astro.moonDegreeFormatted || ''})</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1c1c24; padding-bottom: 5px; padding-top: 4px;">
                <span style="color: #71717a;">Yükselen (ASC):</span>
                <strong style="color: #c4a47c;">${astro.ascendantSign} ${astro.ascendantSignSymbol} (${astro.ascendantDegreeFormatted || ''})</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1c1c24; padding-bottom: 5px; padding-top: 4px;">
                <span style="color: #71717a;">Hakim Element / Yönetici:</span>
                <strong style="color: #fff;">${astro.dominantElement} / ${astro.rulingPlanet}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 4px;">
                <span style="color: #71717a;">Enneagram Tipi:</span>
                <strong style="color: #c4a47c;">Tip ${ennea.typeName} (${ennea.wing})</strong>
              </div>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #a1a1aa; font-style: italic; background: #15151c; padding: 6px 10px; border-radius: 6px;">
              "${ennea.coreMotivation}"
            </div>
          </div>
        </div>

        <!-- 3. 7+2 ÇAKRA ANALİZİ VE ENERJİ FREKANS HARİTASI -->
        <div class="pdf-section-title">
          <span>◆</span> 3. 7+2 ÇAKRA DİZİLİMİ & ENERJİ FREKANS ANALİZİ
        </div>
        <div class="pdf-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #1f1f28; padding-bottom: 8px;">
            <div>
              <span style="font-size: 11px; color: #a1a1aa;">Genel Çakra Dengeleme Skoru:</span>
              <span style="font-size: 16px; font-weight: 800; color: #c4a47c; font-family: monospace; margin-left: 8px;">
                ${chakra?.overallChakraBalanceScore || 85} / 100
              </span>
            </div>
            <div style="font-size: 11px; color: #d4d4d8;">
              <span style="color: #71717a;">Birincil Şifa Yönergesi:</span> <strong style="color: #c4a47c;">${chakra?.primaryHealingDirective || 'Yüksek Bilinç & Topraklanma'}</strong>
            </div>
          </div>

          ${chakra && chakra.chakras ? `
            <table class="pdf-table">
              <thead>
                <tr>
                  <th style="width: 30px;">No</th>
                  <th>Çakra Adı & Sanskrit</th>
                  <th>Bölge & Element</th>
                  <th>Frekans</th>
                  <th>Durum</th>
                  <th>Kutsal Yantra & Şifa Sembolü</th>
                  <th>Dövme Anatomik Konumu</th>
                </tr>
              </thead>
              <tbody>
                ${chakra.chakras.map(c => `
                  <tr>
                    <td style="font-family: monospace; font-weight: 700; color: #c4a47c;">${c.number}</td>
                    <td><strong>${c.turkishName}</strong> <span style="color: #71717a; font-size: 9px;">(${c.sanskritName})</span></td>
                    <td>${c.location} • <span style="color:#c4a47c;">${c.element}</span></td>
                    <td style="font-family: monospace; color:#fff;">${c.frequencyCount} adet</td>
                    <td>
                      <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${
                        c.status === 'Dengeli' ? 'background: rgba(16,185,129,0.15); color: #34d399;' :
                        c.status === 'Aşırı Yoğun' ? 'background: rgba(245,158,11,0.15); color: #fbbf24;' :
                        'background: rgba(239,68,68,0.15); color: #f87171;'
                      }">
                        ${c.status}
                      </span>
                    </td>
                    <td>${c.yantraGeometry} • ${c.healingSymbols.slice(0, 2).join(', ')}</td>
                    <td style="font-size: 10px; color: #a1a1aa;">${c.tattooPlacementAdvice}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div style="font-size: 11px; color: #888;">Standart 7 çakra rezonansı ve beden akış harmonisi hesaplandı.</div>
          `}
        </div>

        <!-- 4. RUHANİ TOTEM HAYVANI & SEMBOLİZM HİYERARŞİSİ -->
        <div class="pdf-section-title">
          <span>◆</span> 4. RUHANİ TOTEM HAYVANI HİYERARŞİSİ & ARKETİPLER
        </div>
        <div class="pdf-card">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
            ${symb.totemHierarchy && symb.totemHierarchy.length >= 3 ? symb.totemHierarchy.slice(0, 3).map((t, idx) => `
              <div style="background: #16161e; border: 1px solid #262633; border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 9px; font-family: monospace; color: #c4a47c; text-transform: uppercase;">
                    ${idx === 0 ? '👑 BİRİNCİL TOTEM' : idx === 1 ? '🌑 GÖLGE TOTEMİ' : '🤝 RUHANİ MÜTTEFİK'}
                  </span>
                </div>
                <div style="font-size: 14px; font-weight: 700; color: #ffffff; font-family: Georgia, serif;">${t.name}</div>
                <div style="font-size: 10px; color: #a1a1aa; margin-top: 4px; line-height: 1.4;">${t.meaning}</div>
                <div style="font-size: 9px; color: #c4a47c; margin-top: 6px; font-family: monospace;">Rol: ${t.visualRoleInTattoo}</div>
              </div>
            `).join('') : `
              <div style="background: #16161e; border: 1px solid #262633; border-radius: 8px; padding: 12px; grid-column: span 3;">
                <div style="font-size: 14px; font-weight: 700; color: #ffffff;">Birincil Totem Rehberi: ${symb.totemAnimal}</div>
                <div style="font-size: 11px; color: #a1a1aa; margin-top: 4px;">${symb.plantFlora} ve ${symb.geometricSymbol} ile dengelenmiştir.</div>
              </div>
            `}
          </div>

          <!-- Morse Code Section if included -->
          ${params.useMorseCodeForNumbers ? `
            <div style="background: #14120c; border: 1px solid #524024; border-radius: 8px; padding: 10px 14px; margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-family: monospace; font-size: 9px; color: #c4a47c; text-transform: uppercase; font-weight: 700; display: block;">
                  ✦ MORS ALFABESİ ŞİFRELEMESİ (MICRO-DOTWORK / FINE LINE):
                </span>
                <span style="font-size: 11px; color: #d4d4d8;">
                  Gizli Mesaj / Kod: <strong style="color: #ffffff;">"${params.customMorseInput || p.birthDate}"</strong>
                </span>
              </div>
              <div style="font-family: monospace; font-size: 12px; color: #c4a47c; letter-spacing: 2px; font-weight: 700;">
                ${r.morseCodePattern?.morseStandard || (r as any).customMorseCode || '· · · — — — · · ·'}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 5. DÖVME TASARIM PARAMETRELERİ & SANATÇI BRİFİ -->
        <div class="pdf-section-title">
          <span>◆</span> 5. DÖVME TASARIM PARAMETRELERİ & ANATOMİK YERLEŞİM
        </div>
        <div class="pdf-card">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px; margin-bottom: 12px;">
            <div style="background: #16161e; padding: 8px 10px; border-radius: 8px;">
              <span style="font-size: 9px; color: #71717a; font-family: monospace; display: block;">SEÇİLİ STİLLER</span>
              <strong style="color: #fff;">${params.selectedStyles?.join(', ') || 'Fine Line'}</strong>
            </div>
            <div style="background: #16161e; padding: 8px 10px; border-radius: 8px;">
              <span style="font-size: 9px; color: #71717a; font-family: monospace; display: block;">ANATOMİK YERLEŞİM</span>
              <strong style="color: #c4a47c;">${params.bodyPlacement || 'Önkol İç'}</strong>
            </div>
            <div style="background: #16161e; padding: 8px 10px; border-radius: 8px;">
              <span style="font-size: 9px; color: #71717a; font-family: monospace; display: block;">KOMPOZİSYON & AKIŞ</span>
              <strong style="color: #fff;">${params.composition || 'Dinamik'}</strong>
            </div>
            <div style="background: #16161e; padding: 8px 10px; border-radius: 8px;">
              <span style="font-size: 9px; color: #71717a; font-family: monospace; display: block;">RENK & YOĞUNLUK</span>
              <strong style="color: #fff;">${params.colorScheme || 'Monokrom'}</strong>
            </div>
          </div>

          <div style="background: #15151b; border: 1px solid #23232d; border-radius: 8px; padding: 10px 12px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #71717a;">Ana Sembolik Odak:</span>
              <strong style="color: #c4a47c;">${params.mainSymbol || symb.totemAnimal}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #71717a;">İkincil / Tamamlayıcı Semboller:</span>
              <strong style="color: #ffffff;">${params.secondarySymbols?.join(' • ') || symb.plantFlora}</strong>
            </div>
          </div>
        </div>

        <!-- 6. EK DOSYA 1: DÖVME BİLEŞEN PARÇALARI & KATMAN REHBERİ -->
        <div class="pdf-section-title">
          <span>◆</span> 6. EK DOSYA: DÖVME BİLEŞEN PARÇALARI & KATMAN REHBERİ (PARTS BREAKDOWN)
        </div>
        <div class="pdf-card" style="font-size: 11px; line-height: 1.6; color: #d4d4d8;">
          <p style="margin-top: 0; color: #a1a1aa;">
            Bu tasarım, danışanın ruhsal frekansını dengelemek ve arketipik gölge yanlarını aydınlatmak üzere 4 temel görsel katmandan inşa edilmiştir:
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="background: #16161e; padding: 10px; border-radius: 8px; border-left: 2px solid #c4a47c;">
              <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Katman A: Ana Ruhani Odak (${params.mainSymbol})</strong>
              <span style="color: #a1a1aa; font-size: 10px;">Kişinin yaşam yolu frekansını ve bilinçdışı liderlik arketipini temsil eder. Kompozisyonun kalbidir.</span>
            </div>
            <div style="background: #16161e; padding: 10px; border-radius: 8px; border-left: 2px solid #c4a47c;">
              <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Katman B: Kutsal Geometri & Yantralar (${symb.geometricSymbol})</strong>
              <span style="color: #a1a1aa; font-size: 10px;">Blokajlı veya zayıf çakraları evrensel altın oran matematiğiyle rezonansa sokarak enerjiyi sabitler.</span>
            </div>
            <div style="background: #16161e; padding: 10px; border-radius: 8px; border-left: 2px solid #c4a47c;">
              <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Katman C: Bitkisel Şifa & Akış (${symb.plantFlora})</strong>
              <span style="color: #a1a1aa; font-size: 10px;">Bedenin anatomik kas hatlarına organik geçiş sağlayarak katı geometrik çizgileri yumuşatır ve topraklanmayı sağlar.</span>
            </div>
            <div style="background: #16161e; padding: 10px; border-radius: 8px; border-left: 2px solid #c4a47c;">
              <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Katman D: Ezoterik Kodlar & Mikro Detaylar</strong>
              <span style="color: #a1a1aa; font-size: 10px;">${params.useMorseCodeForNumbers ? 'Mors alfabeli kutsal sayılar' : 'Kişisel koruyucu sayılar'}, Efemeris burç dereceleri ve 03RL nokta gölgeleri.</span>
            </div>
          </div>
        </div>

        <!-- 7. GÖLGE ARKETİP DÖNÜŞÜM MESAJI VE DANIŞAN MEKTUBU -->
        ${shadow ? `
          <div class="pdf-section-title">
            <span>◆</span> 7. PSİKO-SEMBOLİK GÖLGE ANALİZİ & DÖNÜŞÜM ŞİFASI
          </div>
          <div class="pdf-card" style="font-size: 11px;">
            <div style="background: rgba(196,164,124,0.08); border-left: 3px solid #c4a47c; padding: 10px 14px; border-radius: 0 8px 8px 0; margin-bottom: 10px;">
              <strong style="color: #c4a47c; display: block; font-family: Georgia, serif; font-size: 13px; margin-bottom: 4px;">
                Dövmenin Holistik Dönüşüm Mesajı:
              </strong>
              <p style="color: #ffffff; font-style: italic; margin: 0; line-height: 1.5;">
                "${shadow.section2PsychoSymbolic?.tattooTransformationMessage || shadow.sectionClientExplanation?.greetingAndIntro || ''}"
              </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 10px; color: #a1a1aa;">
              <div>
                <strong style="color: #fff; display: block; margin-bottom: 2px;">Bilinçdışı Kriz Refleksi:</strong>
                <span>${shadow.section3EnneagramShadow?.stressShadowBehavior || ennea.coreFear}</span>
              </div>
              <div>
                <strong style="color: #fff; display: block; margin-bottom: 2px;">Bastırılmış Gölge Yönler:</strong>
                <span>${shadow.section2PsychoSymbolic?.suppressedAspect || shadow.section2PsychoSymbolic?.shadowAspect || 'Kırılganlık ve sezgisel derinliği gizleme eğilimi'}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 8. DÖVME SANATÇISI TEKNİK SPEC SHEET & MASTER AI PROMPTLARI -->
        <div class="pdf-section-title">
          <span>◆</span> 8. DÖVME SANATÇISI TEKNİK SPEC SHEET & MASTER AI PROMPTU
        </div>
        <div class="pdf-card" style="margin-bottom: 0;">
          <div style="font-family: monospace; font-size: 10px; color: #c4a47c; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
            ✦ Midjourney v6.1 / Niji 6 Master Prompt:
          </div>
          <div style="background: #08080a; border: 1px solid #1c1c24; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 9.5px; color: #d4d4d8; line-height: 1.5; word-break: break-all; margin-bottom: 12px;">
            ${r.midjourneyPrompt || r.masterEnglishPrompt}
          </div>

          <div style="font-family: monospace; font-size: 10px; color: #c4a47c; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
            ✦ 03RL Transfer Çizimi & İğne Rehberi:
          </div>
          <div style="background: #08080a; border: 1px solid #1c1c24; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 9.5px; color: #a1a1aa; line-height: 1.5;">
            ${r.artistSpecSheet || r.needleAndTechniqueGuide || 'Ana konturlar 03RL tight liner ile tek geçişte çekilmeli, geometrik alanlar 05RL ile desteklenmeli, gölgeler tek sulu gri yıkama tonunda bırakılmalıdır.'}
          </div>
        </div>

        <!-- FOOTER / SIGNATURE -->
        <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #22222c; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #71717a; font-family: monospace;">
          <div>
            <span>© InkScribe Studio • Ezoterik Dövme & Çakra Danışmanlığı</span>
          </div>
          <div style="color: #c4a47c;">
            Bu döküman danışana özel olarak mühürlenmiş olup telif ve tasarım hakları saklıdır.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    if (onProgress) onProgress('Yüksek çözünürlüklü sayfalar taranıyor...');

    // Convert DOM to canvas with high resolution
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0b0b0e'
    });

    // Clean up DOM element
    document.body.removeChild(container);

    if (onProgress) onProgress('PDF dosyası derleniyor...');

    // Initialize jsPDF A4 portrait
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 mm width
    const pageHeight = 297; // A4 mm height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Remaining pages if content spans multiple A4 pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    if (onProgress) onProgress('İndirme başlatılıyor...');
    pdf.save(fileName);

    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    return false;
  }
}
