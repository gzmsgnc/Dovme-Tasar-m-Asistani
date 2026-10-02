// Esoteric Vector Tattoo Stencil & Finished Flash Art Generator
// Generates professional, stencil-ready tattoo linework and finished tattoo flash plates
// with true symbolic hierarchy, organic flow integration, and seed-based variations.

export interface StencilOptions {
  mainSymbol?: string;
  secondarySymbols?: string[];
  subtleDetails?: string[];
  lifePathNumber?: number | string;
  sunSign?: string;
  moonSign?: string;
  ascendantSign?: string;
  hasDivine19?: boolean;
  styles?: string[];
  colorScheme?: string;
  composition?: string;
  orientation?: string;
  bodyPlacement?: string;
  clientName?: string;
  seed?: number;
  variationIndex?: number;
  requestId?: string;
  mode?: 'stencil' | 'flash'; // 'stencil' = pure linework/contour; 'flash' = finished shaded artwork
}

// Deterministic Pseudo-Random Number Generator (Mulberry32)
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateEsotericTattooStencilSvg(options: StencilOptions = {}): string {
  if (!options.mainSymbol || options.lifePathNumber === undefined || !options.sunSign) {
    throw new Error('Stencil üretimi için ana sembol, yaşam yolu ve güneş burcu zorunludur. Kişisel veri olmadan stencil üretilemez.');
  }

  const {
    mainSymbol,
    secondarySymbols = ['Kutsal Geometri', 'Botanik Akış'],
    subtleDetails = ['Kozmik Takımyıldız'],
    lifePathNumber,
    sunSign,
    moonSign = '',
    ascendantSign = '',
    hasDivine19 = options.hasDivine19 ?? false,
    styles = ['Fine Line', 'Geometric'],
    colorScheme = 'Saf Monokrom Siyah',
    composition = 'Merkezi Kutsal Odak',
    orientation = 'Dikey (Anatomik)',
    bodyPlacement = 'Önkol İç',
    clientName = options.clientName || 'Danışan',
    seed = Math.floor(Math.random() * 1000000),
    variationIndex = 1,
    requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    mode = 'flash'
  } = options;

  const rng = seededRandom(seed + variationIndex * 7919);

  // Zodiac Glyphs
  const zodiacGlyphs: Record<string, string> = {
    'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋',
    'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏',
    'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
  };

  const sunGlyph = zodiacGlyphs[sunSign] || '☉';
  const moonGlyph = zodiacGlyphs[moonSign] || '☽';
  const ascGlyph = zodiacGlyphs[ascendantSign] || '↑';

  const width = 700;
  const height = 900;
  const cx = 350;
  const cy = 460;

  const isStencilMode = mode === 'stencil';

  // Palette definitions
  // In Stencil Mode: Pure black lines on clean white thermal-transfer canvas
  // In Flash Mode: Black, grey wash tones, gold/crimson accents on dark esoteric flash sheet
  const flashThemes = [
    { bg: '#080808', cardBg: '#0e0e0e', stroke: '#c4a47c', fill: '#141414', accent: '#e8c99e', wash: '#2a241b', text: '#c4a47c' },
    { bg: '#060709', cardBg: '#0b0e14', stroke: '#94a3b8', fill: '#0f172a', accent: '#cbd5e1', wash: '#1e293b', text: '#94a3b8' },
    { bg: '#0a0505', cardBg: '#140a0a', stroke: '#b91c1c', fill: '#1f0d0d', accent: '#f87171', wash: '#3b1212', text: '#ef4444' },
    { bg: '#050a07', cardBg: '#0a140f', stroke: '#10b981', fill: '#0d2417', accent: '#6ee7b7', wash: '#064e3b', text: '#10b981' },
    { bg: '#080808', cardBg: '#111111', stroke: '#e4e4e7', fill: '#18181b', accent: '#ffffff', wash: '#27272a', text: '#d4d4d8' }
  ];

  const flashTheme = flashThemes[Math.floor(rng() * flashThemes.length)];

  const colors = isStencilMode
    ? {
        bg: '#ffffff',
        cardBg: '#fafafa',
        stroke: '#050505',
        heavyStroke: '#000000',
        fineStroke: '#1a1a1a',
        fill: 'none',
        wash: '#f0f0f0',
        accent: '#000000',
        text: '#222222',
        subtext: '#666666',
        border: '#dddddd'
      }
    : {
        bg: flashTheme.bg,
        cardBg: flashTheme.cardBg,
        stroke: flashTheme.stroke,
        heavyStroke: flashTheme.accent,
        fineStroke: flashTheme.stroke,
        fill: flashTheme.fill,
        wash: flashTheme.wash,
        accent: flashTheme.accent,
        text: flashTheme.text,
        subtext: '#777777',
        border: '#222222'
      };

  // Determine Primary Subject Archetype based on mainSymbol keywords
  const symLower = mainSymbol.toLowerCase();
  let subjectType: 'wolf' | 'lion' | 'serpent' | 'phoenix' | 'eagle' | 'owl' | 'lotus' | 'stag' | 'dragon' | 'dagger' | 'geometry' = 'geometry';

  if (symLower.includes('kurt') || symLower.includes('wolf')) subjectType = 'wolf';
  else if (symLower.includes('aslan') || symLower.includes('lion')) subjectType = 'lion';
  else if (symLower.includes('yılan') || symLower.includes('serpent') || symLower.includes('ouroboros') || symLower.includes('kobra')) subjectType = 'serpent';
  else if (symLower.includes('anka') || symLower.includes('phoenix')) subjectType = 'phoenix';
  else if (symLower.includes('kartal') || symLower.includes('şahin') || symLower.includes('falcon') || symLower.includes('eagle') || symLower.includes('kuzgun')) subjectType = 'eagle';
  else if (symLower.includes('baykuş') || symLower.includes('owl')) subjectType = 'owl';
  else if (symLower.includes('lotus') || symLower.includes('nilüfer') || symLower.includes('gül') || symLower.includes('rose') || symLower.includes('çiçek')) subjectType = 'lotus';
  else if (symLower.includes('geyik') || symLower.includes('stag') || symLower.includes('boğa')) subjectType = 'stag';
  else if (symLower.includes('ejderha') || symLower.includes('dragon')) subjectType = 'dragon';
  else if (symLower.includes('kılıç') || symLower.includes('hançer') || symLower.includes('sword') || symLower.includes('dagger') || symLower.includes('anahtar')) subjectType = 'dagger';
  else subjectType = 'geometry';

  // Seeded transformations & angles
  const rotAngle = (Math.floor(rng() * 12) - 6); // subtle tilt ±6 deg
  const scaleMod = 0.95 + rng() * 0.1;
  const haloRings = 3 + Math.floor(rng() * 3);
  const stippleDensity = 36 + Math.floor(rng() * 24);

  // Generate Central Totem SVG Elements (60-70% visual weight)
  let primaryTotemSvg = '';

  if (subjectType === 'wolf') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: CELESTIAL WOLF (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Main Head Contour & Brow Structure -->
        <path d="M 0 -130 L 35 -70 L 65 -60 L 50 -10 L 80 40 L 45 60 L 25 110 L 0 95 L -25 110 L -45 60 L -80 40 L -50 -10 L -65 -60 L -35 -70 Z" 
              fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="2.2" />
        
        <!-- Angular Ears with Fine Line Inner Fur -->
        <path d="M -35 -70 L -65 -150 L -15 -100 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        <path d="M 35 -70 L 65 -150 L 15 -100 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        <line x1="-40" y1="-85" x2="-55" y2="-130" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="-30" y1="-80" x2="-40" y2="-115" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="40" y1="-85" x2="55" y2="-130" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="30" y1="-80" x2="40" y2="-115" stroke="${colors.fineStroke}" stroke-width="0.8" />

        <!-- Snout, Nose & Whiskers Contour -->
        <polygon points="0,55 18,30 -18,30" fill="${isStencilMode ? 'none' : colors.stroke}" stroke="${colors.heavyStroke}" stroke-width="1.5" />
        <line x1="0" y1="55" x2="0" y2="80" stroke="${colors.heavyStroke}" stroke-width="2" />
        <path d="M -22 75 Q 0 90 22 75" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        
        <!-- Piercing Esoteric Eyes -->
        <polygon points="-28,-5 -12,0 -24,-12" fill="${isStencilMode ? 'none' : colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.4" />
        <polygon points="28,-5 12,0 24,-12" fill="${isStencilMode ? 'none' : colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.4" />
        <circle cx="-20" cy="-5" r="2.5" fill="${colors.heavyStroke}" />
        <circle cx="20" cy="-5" r="2.5" fill="${colors.heavyStroke}" />

        <!-- Third Eye / Sacred Forehead Diamond -->
        <polygon points="0,-75 14,-55 0,-35 -14,-55" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.stroke}" stroke-width="1.4" />
        <circle cx="0" cy="-55" r="4" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1" />

        <!-- Geometric Jaw & Cheekbone Facets (Fine-Line & Dotwork Matrix) -->
        <line x1="-15" y1="-100" x2="0" y2="-75" stroke="${colors.fineStroke}" stroke-width="1" stroke-dasharray="4,2" />
        <line x1="15" y1="-100" x2="0" y2="-75" stroke="${colors.fineStroke}" stroke-width="1" stroke-dasharray="4,2" />
        <line x1="-50" y1="-10" x2="-24" y2="-12" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="50" y1="-10" x2="24" y2="-12" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="-28" y1="-5" x2="-18" y2="30" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="28" y1="-5" x2="18" y2="30" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="-80" y1="40" x2="-18" y2="30" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="80" y1="40" x2="18" y2="30" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="-45" y1="60" x2="0" y2="80" stroke="${colors.fineStroke}" stroke-width="0.8" />
        <line x1="45" y1="60" x2="0" y2="80" stroke="${colors.fineStroke}" stroke-width="0.8" />
      </g>
    `;
  } else if (subjectType === 'serpent') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: SACRED OUROBOROS & SERPENT (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Coiled S-Curve Body (Clean Dynamic Contours) -->
        <path d="M 0 -130 C 90 -130 110 -40 20 0 C -80 40 -80 110 0 130 C 80 150 90 90 40 70 C -10 50 -20 0 30 -30 C 70 -50 60 -110 0 -110" 
              fill="none" stroke="${colors.heavyStroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 0 -130 C 90 -130 110 -40 20 0 C -80 40 -80 110 0 130 C 80 150 90 90 40 70 C -10 50 -20 0 30 -30 C 70 -50 60 -110 0 -110" 
              fill="none" stroke="${isStencilMode ? colors.bg : colors.wash}" stroke-width="2.5" />
        
        <!-- Sacred Serpent Head -->
        <g transform="translate(0, -130) rotate(-25)">
          <path d="M -16 -8 L 0 -32 L 16 -8 L 10 16 L -10 16 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="2" />
          <circle cx="-7" cy="-8" r="2.5" fill="${colors.accent}" />
          <circle cx="7" cy="-8" r="2.5" fill="${colors.accent}" />
          <path d="M 0 -32 L 0 -48 L -6 -56 M 0 -48 L 6 -56" stroke="${colors.heavyStroke}" stroke-width="1.5" fill="none" />
          <polygon points="0,-18 5,-8 0,2 -5,-8" fill="none" stroke="${colors.fineStroke}" stroke-width="1" />
        </g>

        <!-- Segmental Scale Geometry & Hatching -->
        ${Array.from({ length: 18 }).map((_, i) => {
          const a = (i * 20 * Math.PI) / 180;
          const r = 85 + Math.sin(i * 0.8) * 20;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          return `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="${colors.fineStroke}" stroke-width="0.8" />`;
        }).join('')}
      </g>
    `;
  } else if (subjectType === 'lion') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: SOLAR LION (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Radial Solar Mane Ray Facets -->
        ${Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 22.5 * Math.PI) / 180;
          const x1 = Math.cos(a) * 60;
          const y1 = Math.sin(a) * 60;
          const x2 = Math.cos(a) * 140;
          const y2 = Math.sin(a) * 140;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.fineStroke}" stroke-width="${i % 2 === 0 ? 1.5 : 0.8}" stroke-dasharray="${i % 3 === 0 ? '6,3' : 'none'}" />`;
        }).join('')}

        <!-- Outer Mane Geometric Contour -->
        <polygon points="0,-145 45,-120 95,-95 130,-40 140,20 115,80 70,125 0,145 -70,125 -115,80 -140,20 -130,-40 -95,-95 -45,-120" 
                 fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="2" />

        <!-- Lion Facial Structure -->
        <path d="M -30 -60 L 0 -80 L 30 -60 L 40 0 L 25 50 L 0 70 L -25 50 L -40 0 Z" 
              fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="2" />
        
        <!-- Eyes & Nose -->
        <polygon points="-22,-15 -8,-10 -18,-22" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
        <polygon points="22,-15 8,-10 18,-22" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
        <polygon points="0,20 15,3 0,-8 -15,3" fill="${colors.heavyStroke}" />
        <line x1="0" y1="20" x2="0" y2="42" stroke="${colors.heavyStroke}" stroke-width="2" />
        <path d="M -18 38 Q 0 50 18 38" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        
        <!-- Crown / Diadem -->
        <polygon points="-30,-80 0,-115 30,-80 0,-90" fill="${isStencilMode ? 'none' : colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.5" />
      </g>
    `;
  } else if (subjectType === 'phoenix' || subjectType === 'eagle') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: CELESTIAL PHOENIX / EAGLE (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Majestic Ascending Wings -->
        <path d="M 0 30 C -80 0 -130 -60 -155 -140 C -125 -100 -80 -60 0 -20 C 80 -60 125 -100 155 -140 C 130 -60 80 0 0 30 Z" 
              fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="2.2" />
        
        <!-- Inner Feathers & Fine-Line Layering -->
        <path d="M 0 30 C -60 -10 -100 -50 -120 -110 M 0 30 C -40 -15 -70 -40 -90 -85" fill="none" stroke="${colors.fineStroke}" stroke-width="1.2" />
        <path d="M 0 30 C 60 -10 100 -50 120 -110 M 0 30 C 40 -15 70 -40 90 -85" fill="none" stroke="${colors.fineStroke}" stroke-width="1.2" />

        <!-- Raptor Head & Sharp Beak -->
        <g transform="translate(0, -60)">
          <path d="M -14 0 L 0 -25 L 14 0 L 0 25 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
          <path d="M 0 5 Q 24 10 28 26 Q 16 22 0 16" fill="${colors.heavyStroke}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
          <circle cx="-5" cy="0" r="2.5" fill="${colors.accent}" />
          <circle cx="5" cy="0" r="2.5" fill="${colors.accent}" />
        </g>

        <!-- Tail Plumes / Flaming Flurry (Flowing with Spine) -->
        <path d="M 0 30 C -25 80 -40 120 0 160 C 40 120 25 80 0 30" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        <line x1="0" y1="30" x2="0" y2="150" stroke="${colors.stroke}" stroke-width="1.5" stroke-dasharray="6,3" />
        <line x1="-15" y1="70" x2="-25" y2="135" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="15" y1="70" x2="25" y2="135" stroke="${colors.fineStroke}" stroke-width="1" />
      </g>
    `;
  } else if (subjectType === 'owl') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: MYSTIC NIGHT OWL (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Owl Silhouette & Wings -->
        <path d="M 0 -110 L 40 -95 L 75 -50 L 65 30 L 40 100 L 0 125 L -40 100 L -65 30 L -75 -50 L -40 -95 Z" 
              fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="2" />
        
        <!-- Large Concentric Hypnotic Eyes -->
        <g transform="translate(-28, -25)">
          <circle cx="0" cy="0" r="24" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="${colors.fineStroke}" stroke-width="1" stroke-dasharray="3,2" />
          <circle cx="0" cy="0" r="8" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
          <circle cx="0" cy="0" r="3.5" fill="${colors.heavyStroke}" />
        </g>
        <g transform="translate(28, -25)">
          <circle cx="0" cy="0" r="24" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="${colors.fineStroke}" stroke-width="1" stroke-dasharray="3,2" />
          <circle cx="0" cy="0" r="8" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
          <circle cx="0" cy="0" r="3.5" fill="${colors.heavyStroke}" />
        </g>

        <!-- Sharp Beak & Forehead Geometry -->
        <polygon points="0,-12 8,10 0,22 -8,10" fill="${colors.heavyStroke}" />
        <polygon points="0,-85 20,-55 0,-35 -20,-55" fill="none" stroke="${colors.fineStroke}" stroke-width="1.2" />
        <line x1="0" y1="-85" x2="0" y2="-12" stroke="${colors.fineStroke}" stroke-width="0.8" stroke-dasharray="4,2" />

        <!-- Breast Feather Chevron Stippling -->
        <path d="M -30 35 L 0 55 L 30 35 M -25 55 L 0 75 L 25 55 M -20 75 L 0 95 L 20 75" fill="none" stroke="${colors.fineStroke}" stroke-width="1.2" />
      </g>
    `;
  } else if (subjectType === 'lotus') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: SACRED BLOOMING LOTUS & UNALOME (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Central Core Petal -->
        <path d="M 0 -120 C 35 -60 30 10 0 35 C -30 10 -35 -60 0 -120 Z" 
              fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="2" />
        <line x1="0" y1="-120" x2="0" y2="35" stroke="${colors.fineStroke}" stroke-width="1" stroke-dasharray="6,3" />

        <!-- Lateral Tier 1 Petals -->
        <path d="M 0 35 C 40 30 80 -20 65 -85 C 35 -45 15 -10 0 35 Z" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
        <path d="M 0 35 C -40 30 -80 -20 -65 -85 C -35 -45 -15 -10 0 35 Z" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="1.8" />

        <!-- Lateral Tier 2 Outer Petals -->
        <path d="M 0 35 C 60 40 120 0 110 -50 C 70 -20 30 10 0 35 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.5" />
        <path d="M 0 35 C -60 40 -120 0 -110 -50 C -70 -20 -30 10 0 35 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.5" />

        <!-- Base Calyx & Crescent Cradle -->
        <path d="M -80 35 Q 0 70 80 35" fill="none" stroke="${colors.heavyStroke}" stroke-width="2" />
        <circle cx="0" cy="50" r="6" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1" />

        <!-- Lower Unalome Spiritual Spiral -->
        <path d="M 0 56 L 0 95 Q 16 110 0 125 Q -16 140 0 155 L 0 175" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.6" />
        <circle cx="0" cy="183" r="2.5" fill="${colors.heavyStroke}" />
        <circle cx="0" cy="192" r="1.5" fill="${colors.heavyStroke}" />
      </g>
    `;
  } else if (subjectType === 'dagger') {
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: CELESTIAL ALCHEMICAL DAGGER (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Vertical Blade (Double-Edged Precision Line) -->
        <polygon points="0,-150 16,-40 16,30 0,45 -16,30 -16,-40" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="2.2" />
        <line x1="0" y1="-150" x2="0" y2="45" stroke="${colors.heavyStroke}" stroke-width="1.5" />
        
        <!-- Ornate Crossguard -->
        <path d="M -70 45 Q 0 35 70 45 Q 60 60 0 52 Q -60 60 -70 45 Z" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="2" />
        <circle cx="-65" cy="48" r="4" fill="${colors.accent}" />
        <circle cx="65" cy="48" r="4" fill="${colors.accent}" />

        <!-- Pommel & Hilt Grip -->
        <rect x="-8" y="52" width="16" height="50" rx="2" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.5" />
        <line x1="-8" y1="62" x2="8" y2="62" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="-8" y1="74" x2="8" y2="74" stroke="${colors.fineStroke}" stroke-width="1" />
        <line x1="-8" y1="86" x2="8" y2="86" stroke="${colors.fineStroke}" stroke-width="1" />
        <polygon points="0,105 14,120 0,135 -14,120" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.5" />

        <!-- Serpent / Rose Intertwined around the Blade -->
        <path d="M -30 -30 Q 0 -50 30 -30 Q 35 0 0 10 Q -35 0 -30 -30" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.6" />
        <circle cx="0" cy="-40" r="10" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.fineStroke}" stroke-width="1" />
      </g>
    `;
  } else {
    // Subject Type: SACRED GEOMETRY / METATRON MATRIX
    primaryTotemSvg = `
      <!-- PRIMARY TOTEM: SACRED GEOMETRY MATRIX (65% Visual Weight) -->
      <g transform="scale(${scaleMod})">
        <!-- Outer Concentric Hexagram -->
        <polygon points="0,-140 121.2,70 -121.2,70" fill="none" stroke="${colors.heavyStroke}" stroke-width="2" />
        <polygon points="0,140 121.2,-70 -121.2,-70" fill="none" stroke="${colors.heavyStroke}" stroke-width="2" />
        
        <!-- Inner Merkabah Rotated Grid -->
        <polygon points="-140,0 70,121.2 70,-121.2" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.stroke}" stroke-width="1.2" stroke-dasharray="8,4" />
        <polygon points="140,0 -70,121.2 -70,-121.2" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.stroke}" stroke-width="1.2" stroke-dasharray="8,4" />

        <!-- 13 Nodes of Metatron's Cube -->
        <circle cx="0" cy="0" r="28" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.5" />
        <circle cx="0" cy="0" r="8" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1" />
        ${Array.from({ length: 6 }).map((_, i) => {
          const a = (i * 60 * Math.PI) / 180;
          const x1 = Math.cos(a) * 70;
          const y1 = Math.sin(a) * 70;
          const x2 = Math.cos(a) * 140;
          const y2 = Math.sin(a) * 140;
          return `
            <line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${colors.fineStroke}" stroke-width="0.8" />
            <circle cx="${x1}" cy="${y1}" r="22" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
            <circle cx="${x2}" cy="${y2}" r="16" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.stroke}" stroke-width="1.4" />
            <circle cx="${x2}" cy="${y2}" r="3.5" fill="${colors.accent}" />
          `;
        }).join('')}
      </g>
    `;
  }

  // SECONDARY ORGANIC SUPPORTING ELEMENTS (20-30% Visual Weight)
  // Integrated around and behind the primary composition (Botanical vines, Crescent Moon, Sacred Arch)
  const sec1 = secondarySymbols[0] || 'Kutsal Lotus';
  const sec2 = secondarySymbols[1] || 'Kozmik Hilal';

  const secondaryFlowSvg = `
    <!-- SECONDARY ELEMENTS: ORGANIC FLOW & LUNAR CROWN (25% Visual Weight) -->
    <!-- Upper Crescent Halo -->
    <g transform="translate(0, -180)">
      <path d="M -70 0 A 70 70 0 0 1 70 0 A 55 55 0 0 0 -70 0 Z" fill="${isStencilMode ? 'none' : colors.wash}" stroke="${colors.heavyStroke}" stroke-width="1.8" />
      <circle cx="0" cy="-15" r="7" fill="${colors.accent}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <line x1="-80" y1="0" x2="80" y2="0" stroke="${colors.fineStroke}" stroke-width="0.8" stroke-dasharray="4,2" />
    </g>

    <!-- Side Botanical Flow Vines & Leaves (framing the central composition) -->
    <g transform="translate(-110, 50) rotate(-15)">
      <path d="M 0 -80 Q -30 0 0 80 Q 20 120 0 160" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.6" />
      <!-- Leaves -->
      <path d="M -15 -30 C -35 -40 -35 -15 -15 -10 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <path d="M -18 20 C -40 10 -40 35 -18 40 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <path d="M -10 90 C -30 80 -30 105 -10 110 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
    </g>
    <g transform="translate(110, 50) scale(-1, 1) rotate(-15)">
      <path d="M 0 -80 Q -30 0 0 80 Q 20 120 0 160" fill="none" stroke="${colors.heavyStroke}" stroke-width="1.6" />
      <!-- Leaves -->
      <path d="M -15 -30 C -35 -40 -35 -15 -15 -10 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <path d="M -18 20 C -40 10 -40 35 -18 40 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <path d="M -10 90 C -30 80 -30 105 -10 110 Z" fill="${isStencilMode ? 'none' : colors.fill}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
    </g>

    <!-- Concentric Celestial Orbit Ring Framing the Subject -->
    <circle r="215" fill="none" stroke="${colors.stroke}" stroke-width="1.2" opacity="${isStencilMode ? '0.7' : '0.6'}" />
    <circle r="225" fill="none" stroke="${colors.fineStroke}" stroke-width="0.6" stroke-dasharray="2,6" />
    <circle r="235" fill="none" stroke="${colors.stroke}" stroke-width="1" stroke-dasharray="12,6" />
  `;

  // HIDDEN ESOTERIC DETAILS (5-10% Visual Weight: Numerological seals, constellation coordinates, micro-stippling)
  const hiddenDetailsSvg = `
    <!-- HIDDEN ESOTERIC ACCENTS (5-10% Visual Weight) -->
    <!-- Cardinal Planetary Glyphs & Life Path Sigil -->
    <g transform="translate(0, -235)">
      <circle cx="0" cy="0" r="13" fill="${isStencilMode ? colors.bg : colors.cardBg}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <text x="0" y="4.5" text-anchor="middle" fill="${colors.text}" font-family="'Cinzel', serif" font-size="12" font-weight="bold">${lifePathNumber}</text>
    </g>
    <g transform="translate(235, 0)">
      <circle cx="0" cy="0" r="13" fill="${isStencilMode ? colors.bg : colors.cardBg}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <text x="0" y="4.5" text-anchor="middle" fill="${colors.text}" font-size="13">${sunGlyph}</text>
    </g>
    <g transform="translate(-235, 0)">
      <circle cx="0" cy="0" r="13" fill="${isStencilMode ? colors.bg : colors.cardBg}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <text x="0" y="4.5" text-anchor="middle" fill="${colors.text}" font-size="13">${moonGlyph}</text>
    </g>
    <g transform="translate(0, 235)">
      <circle cx="0" cy="0" r="13" fill="${isStencilMode ? colors.bg : colors.cardBg}" stroke="${colors.heavyStroke}" stroke-width="1.2" />
      <text x="0" y="4.5" text-anchor="middle" fill="${colors.text}" font-size="13">${ascGlyph}</text>
    </g>

    <!-- Divine 19 Seal if present -->
    ${hasDivine19 ? `
      <g transform="translate(0, 200)">
        <polygon points="0,-16 16,0 0,16 -16,0" fill="${isStencilMode ? colors.bg : colors.cardBg}" stroke="${colors.heavyStroke}" stroke-width="1" />
        <text x="0" y="3.5" text-anchor="middle" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="bold">19</text>
      </g>
    ` : ''}

    <!-- Micro Ray Crosshairs & Stipple Field -->
    ${Array.from({ length: 24 }).map((_, i) => {
      const a = (i * 15 * Math.PI) / 180;
      const x1 = Math.cos(a) * 235;
      const y1 = Math.sin(a) * 235;
      const x2 = Math.cos(a) * 245;
      const y2 = Math.sin(a) * 245;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.fineStroke}" stroke-width="0.75" />`;
    }).join('')}
  `;

  // Master SVG Construction
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Stipple Pattern -->
    <pattern id="stipple_pat_${seed}" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="${isStencilMode ? '0.4' : '0.7'}" fill="${colors.fineStroke}" opacity="${isStencilMode ? '0.25' : '0.4'}" />
    </pattern>
  </defs>

  <!-- Background Base Canvas (Pure solid white for stencil transfer; Deep black for flash plate) -->
  <rect width="100%" height="100%" fill="${colors.bg}" />
  
  <!-- Subtle Stipple Noise (Only in Flash mode) -->
  ${!isStencilMode ? `<rect width="100%" height="100%" fill="url(#stipple_pat_${seed})" opacity="0.3" />` : ''}

  <!-- Outer Technical Tattoo Plate Border -->
  <rect x="25" y="25" width="${width - 50}" height="${height - 50}" fill="${colors.cardBg}" stroke="${colors.border}" stroke-width="1" />
  <rect x="35" y="35" width="${width - 70}" height="${height - 70}" fill="none" stroke="${colors.fineStroke}" stroke-width="0.5" stroke-dasharray="4,4" />

  <!-- Corner Precision Registration Crosshairs -->
  <g stroke="${colors.fineStroke}" stroke-width="0.8">
    <line x1="20" y1="25" x2="45" y2="25" /><line x1="25" y1="20" x2="25" y2="45" />
    <line x1="${width - 45}" y1="25" x2="${width - 20}" y2="25" /><line x1="${width - 25}" y1="20" x2="${width - 25}" y2="45" />
    <line x1="20" y1="${height - 25}" x2="45" y2="${height - 25}" /><line x1="25" y1="${height - 45}" x2="25" y2="${height - 20}" />
    <line x1="${width - 45}" y1="${height - 25}" x2="${width - 20}" y2="${height - 25}" /><line x1="${width - 25}" y1="${height - 45}" x2="${width - 25}" y2="${height - 20}" />
  </g>

  <!-- Header Metadata -->
  <g transform="translate(${cx}, 65)">
    <text x="0" y="0" text-anchor="middle" fill="${colors.text}" font-family="'Cinzel', 'Playfair Display', serif" font-size="14" font-weight="bold" letter-spacing="4">
      ${isStencilMode ? 'TERMAL TRANSFER ŞABLONU (STENCIL)' : 'DÖVME TASARIM FLAŞI (TATTOO FLASH)'}
    </text>
    <text x="0" y="16" text-anchor="middle" fill="${colors.subtext}" font-family="'JetBrains Mono', monospace" font-size="9" letter-spacing="2">
      VARYASYON #${escapeXml(variationIndex)} • TOHUM #${escapeXml(seed)} • ${isStencilMode ? '03RL SAF KONTUR' : escapeXml(styles.slice(0, 2).join(' + ').toUpperCase())}
    </text>
  </g>

  <!-- Central Tattoo Design Master Group -->
  <g transform="translate(${cx}, ${cy}) rotate(${rotAngle})">
    <!-- Secondary Organic Flow and Circular Frame -->
    ${secondaryFlowSvg}

    <!-- Central Primary Totem (65% Visual Weight) -->
    ${primaryTotemSvg}

    <!-- Hidden Esoteric Details -->
    ${hiddenDetailsSvg}
  </g>

  <!-- Bottom Technical Legend & Feasibility Summary -->
  <g transform="translate(${cx}, ${height - 65})">
    <rect x="-240" y="-22" width="480" height="42" rx="4" fill="${colors.bg}" stroke="${colors.border}" stroke-width="0.8" />
    
    <text x="0" y="-6" text-anchor="middle" fill="${colors.text}" font-family="'Cinzel', serif" font-size="10" font-weight="bold" letter-spacing="1">
      ODAK: ${escapeXml(mainSymbol.toUpperCase())} | AKIŞ: ${escapeXml(sec1.toUpperCase())}
    </text>
    
    <text x="0" y="10" text-anchor="middle" fill="${colors.subtext}" font-family="'JetBrains Mono', monospace" font-size="8" letter-spacing="1">
      [${escapeXml(requestId)}] • ${escapeXml(bodyPlacement.toUpperCase())} • ${escapeXml(orientation.toUpperCase())} • ${escapeXml(clientName.toUpperCase())}
    </text>
  </g>
</svg>
  `.trim();

  // Convert SVG to data URI safely across environments
  try {
    if (typeof Buffer !== 'undefined') {
      const base64 = Buffer.from(svg).toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    }
  } catch {
    // browser fallback
  }

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;utf8,${encoded}`;
}
