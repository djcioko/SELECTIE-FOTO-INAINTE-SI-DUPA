import { PresetProject } from '../types';

// Helper to create clean, high-resolution SVG data URLs representing real metalwork projects
function createWorkshopGateSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e242b"/>
        <stop offset="50%" stop-color="#2a323d"/>
        <stop offset="100%" stop-color="#181c22"/>
      </linearGradient>
      <linearGradient id="steelBeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#717c8a"/>
        <stop offset="50%" stop-color="#495565"/>
        <stop offset="100%" stop-color="#333c48"/>
      </linearGradient>
      <linearGradient id="sparkGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffea79" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#ff7b00" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#ff2200" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="torchGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#60a5fa" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#2563eb" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#1e242b" stop-opacity="0"/>
      </radialGradient>
      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Atelier / Workshop Background -->
    <rect width="1200" height="800" fill="url(#bgGrad)"/>
    <rect width="1200" height="800" fill="url(#gridPattern)"/>

    <!-- Workshop floor perspective -->
    <path d="M0 650 L1200 650 L1200 800 L0 800 Z" fill="#14181d"/>
    <line x1="0" y1="650" x2="1200" y2="650" stroke="#f59e0b" stroke-width="3" stroke-dasharray="16,16" stroke-opacity="0.4"/>

    <!-- Background Workshop Elements -->
    <rect x="80" y="220" width="220" height="380" fill="#202731" rx="4" stroke="#374151" stroke-width="2"/>
    <rect x="100" y="240" width="180" height="40" fill="#111827" rx="2"/>
    <circle cx="130" cy="260" r="8" fill="#10b981"/>
    <circle cx="160" cy="260" r="8" fill="#f59e0b"/>
    <circle cx="190" cy="260" r="8" fill="#ef4444"/>
    <text x="140" y="320" fill="#9ca3af" font-family="monospace" font-size="14" font-weight="bold">INVERTER TIG/MIG</text>
    <path d="M250 480 Q 280 620 380 640" stroke="#f97316" stroke-width="8" fill="none" stroke-linecap="round"/>

    <!-- Work Trestles / Capre de lucru -->
    <path d="M 320 650 L 370 480 L 420 650 M 350 560 L 390 560" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
    <path d="M 880 650 L 930 480 L 980 650 M 900 560 L 960 560" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
    <rect x="330" y="470" width="640" height="18" fill="#374151" rx="2"/>

    <!-- Gate Frame under fabrication (Raw steel) -->
    <g transform="translate(350, 200)">
      <!-- Outer perimeter frame -->
      <rect x="0" y="0" width="600" height="340" fill="none" stroke="url(#steelBeam)" stroke-width="24" rx="3"/>
      <!-- Diagonal brace -->
      <line x1="12" y1="12" x2="588" y2="328" stroke="url(#steelBeam)" stroke-width="16"/>
      <!-- Laser cut leaf panels (raw steel slots) -->
      <rect x="30" y="30" width="250" height="280" fill="#27323f" stroke="#475569" stroke-width="3"/>
      <g stroke="#64748b" stroke-width="4" fill="none">
        <path d="M50 80 Q150 120 180 250"/>
        <path d="M70 120 Q170 160 210 280"/>
        <path d="M90 60 Q190 100 240 220"/>
        <path d="M120 40 Q220 80 260 180"/>
        <circle cx="150" cy="180" r="14" fill="#334155"/>
        <circle cx="210" cy="140" r="18" fill="#334155"/>
      </g>
      <!-- Vertical pickets on right half -->
      <line x1="330" y1="20" x2="330" y2="320" stroke="url(#steelBeam)" stroke-width="12"/>
      <line x1="380" y1="20" x2="380" y2="320" stroke="url(#steelBeam)" stroke-width="12"/>
      <line x1="430" y1="20" x2="430" y2="320" stroke="url(#steelBeam)" stroke-width="12"/>
      <line x1="480" y1="20" x2="480" y2="320" stroke="url(#steelBeam)" stroke-width="12"/>
      <line x1="530" y1="20" x2="530" y2="320" stroke="url(#steelBeam)" stroke-width="12"/>

      <!-- Clamps & magnetic squares -->
      <polygon points="560,300 590,300 590,330" fill="#ef4444"/>
      <polygon points="10,10 40,10 10,40" fill="#ef4444"/>

      <!-- Welding point & intense glow -->
      <circle cx="588" cy="328" r="60" fill="url(#torchGlow)"/>
      <circle cx="588" cy="328" r="8" fill="#ffffff"/>
      <!-- Flying sparks -->
      <path d="M 588 328 L 650 310 M 588 328 L 670 350 M 588 328 L 640 370 M 588 328 L 610 260 M 588 328 L 540 370 M 588 328 L 690 320" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 588 328 L 630 300 M 588 328 L 645 335 M 588 328 L 620 380 M 588 328 L 680 290" stroke="#fb923c" stroke-width="2" stroke-linecap="round"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createInstalledGateSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="60%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#f0f9ff"/>
      </linearGradient>
      <linearGradient id="anthraciteMatte" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2d3748"/>
        <stop offset="50%" stop-color="#1a202c"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
      <linearGradient id="stonePillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#d1d5db"/>
        <stop offset="30%" stop-color="#f3f4f6"/>
        <stop offset="70%" stop-color="#e5e7eb"/>
        <stop offset="100%" stop-color="#9ca3af"/>
      </linearGradient>
      <pattern id="paving" width="50" height="25" patternUnits="userSpaceOnUse">
        <rect width="50" height="25" fill="#e2e8f0"/>
        <path d="M 0 0 L 50 0 M 0 25 L 50 25 M 25 0 L 25 25" stroke="#94a3b8" stroke-width="1.5"/>
      </pattern>
      <pattern id="grassPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#22c55e"/>
        <circle cx="10" cy="10" r="2" fill="#16a34a"/>
      </pattern>
    </defs>

    <!-- Sky -->
    <rect width="1200" height="800" fill="url(#skyGrad)"/>

    <!-- Modern Villa in background -->
    <polygon points="150,220 550,160 550,520 150,520" fill="#f8fafc"/>
    <rect x="220" y="240" width="120" height="100" fill="#0284c7" fill-opacity="0.25" stroke="#0f172a" stroke-width="4"/>
    <rect x="380" y="220" width="140" height="140" fill="#0284c7" fill-opacity="0.25" stroke="#0f172a" stroke-width="4"/>
    <rect x="530" y="150" width="30" height="370" fill="#334155"/>
    <polygon points="120,220 570,150 570,170 120,240" fill="#0f172a"/>

    <!-- Landscaping / Thuja bushes -->
    <ellipse cx="140" cy="460" rx="40" ry="110" fill="#15803d"/>
    <ellipse cx="180" cy="480" rx="35" ry="90" fill="#16a34a"/>
    <ellipse cx="1080" cy="460" rx="40" ry="110" fill="#15803d"/>
    <ellipse cx="1040" cy="480" rx="35" ry="90" fill="#16a34a"/>

    <!-- Paved Driveway and curb -->
    <path d="M0 550 L1200 550 L1200 800 L0 800 Z" fill="url(#paving)"/>
    <rect x="0" y="540" width="1200" height="14" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>

    <!-- Concrete / Granite Fence Pillars -->
    <!-- Left Pillar -->
    <g transform="translate(180, 240)">
      <rect x="0" y="0" width="130" height="310" fill="url(#stonePillar)" stroke="#6b7280" stroke-width="2"/>
      <rect x="-10" y="-14" width="150" height="20" fill="#475569" rx="3"/>
      <!-- Intercom & LED light -->
      <rect x="75" y="80" width="28" height="60" fill="#0f172a" rx="4"/>
      <circle cx="89" cy="100" r="6" fill="#38bdf8"/>
      <rect x="83" y="120" width="12" height="12" fill="#64748b" rx="1"/>
      <!-- House number -->
      <text x="35" y="60" fill="#1f2937" font-family="sans-serif" font-size="28" font-weight="900">24B</text>
    </g>

    <!-- Right Pillar -->
    <g transform="translate(900, 240)">
      <rect x="0" y="0" width="130" height="310" fill="url(#stonePillar)" stroke="#6b7280" stroke-width="2"/>
      <rect x="-10" y="-14" width="150" height="20" fill="#475569" rx="3"/>
      <!-- LED beacon light on pillar -->
      <polygon points="50,-14 80,-14 75,-34 55,-34" fill="#f59e0b"/>
      <circle cx="65" cy="-24" r="8" fill="#fef08a"/>
    </g>

    <!-- Sliding Gate Installed (Anthracite Powder Coating RAL 7016) -->
    <g transform="translate(320, 250)">
      <!-- Ground rail guide -->
      <rect x="-30" y="295" width="640" height="8" fill="#94a3b8"/>
      <!-- Automation motor unit -->
      <rect x="540" y="245" width="55" height="55" fill="#334155" rx="6" stroke="#0f172a" stroke-width="2"/>
      <circle cx="567" cy="272" r="10" fill="#475569"/>

      <!-- Gate Main Perimeter Frame -->
      <rect x="0" y="0" width="580" height="295" fill="none" stroke="url(#anthraciteMatte)" stroke-width="22" rx="4"/>

      <!-- Laser cut artistic screen (powder coated anthracite) -->
      <rect x="25" y="25" width="245" height="245" fill="#1e293b" stroke="#0f172a" stroke-width="3" rx="2"/>
      <!-- Laser cut organic tree branch pattern with warm backlight effect -->
      <g stroke="#94a3b8" stroke-width="4.5" fill="none" stroke-linecap="round">
        <path d="M45 70 Q145 110 175 230"/>
        <path d="M65 110 Q165 150 205 255"/>
        <path d="M85 50 Q185 90 235 200"/>
        <path d="M115 30 Q215 70 250 160"/>
        <circle cx="145" cy="165" r="14" fill="#475569"/>
        <circle cx="205" cy="125" r="18" fill="#475569"/>
      </g>

      <!-- Sleek horizontal louvers on right half -->
      <g stroke="url(#anthraciteMatte)" stroke-width="12" stroke-linecap="round">
        <line x1="300" y1="40" x2="550" y2="40"/>
        <line x1="300" y1="75" x2="550" y2="75"/>
        <line x1="300" y1="110" x2="550" y2="110"/>
        <line x1="300" y1="145" x2="550" y2="145"/>
        <line x1="300" y1="180" x2="550" y2="180"/>
        <line x1="300" y1="215" x2="550" y2="215"/>
        <line x1="300" y1="250" x2="550" y2="250"/>
      </g>

      <!-- Handle in brushed stainless steel -->
      <rect x="275" y="110" width="8" height="90" fill="#f1f5f9" rx="2" stroke="#64748b" stroke-width="1"/>
    </g>

    <!-- Sun flare / premium lighting -->
    <circle cx="1020" cy="140" r="50" fill="#fef08a" fill-opacity="0.4"/>
    <circle cx="1020" cy="140" r="120" fill="#fef08a" fill-opacity="0.1"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createWorkshopStairsSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <rect width="1200" height="800" fill="#1c1917"/>
    <!-- Brick workshop wall -->
    <g stroke="#292524" stroke-width="2" fill="none">
      <line x1="0" y1="100" x2="1200" y2="100"/>
      <line x1="0" y1="200" x2="1200" y2="200"/>
      <line x1="0" y1="300" x2="1200" y2="300"/>
      <line x1="0" y1="400" x2="1200" y2="400"/>
      <line x1="0" y1="500" x2="1200" y2="500"/>
    </g>
    <!-- Raw metal spine jig & brackets -->
    <path d="M300 700 Q500 500 700 200 Q800 120 950 80" stroke="#78716c" stroke-width="48" fill="none" stroke-linecap="round"/>
    <!-- Step brackets unpainted with tack welds -->
    <g fill="#a8a29e" stroke="#44403c" stroke-width="4">
      <polygon points="360,650 480,640 480,665 360,675"/>
      <polygon points="440,560 560,545 560,570 440,585"/>
      <polygon points="530,460 650,440 650,465 530,485"/>
      <polygon points="620,350 740,325 740,350 620,375"/>
      <polygon points="730,230 850,205 850,230 730,255"/>
      <polygon points="840,130 960,105 960,130 840,155"/>
    </g>
    <!-- Welding sparks & grinder disc -->
    <circle cx="650" cy="450" r="30" fill="#f59e0b" fill-opacity="0.4"/>
    <circle cx="650" cy="450" r="8" fill="#ffffff"/>
    <line x1="650" y1="450" x2="720" y2="470" stroke="#fef08a" stroke-width="3"/>
    <line x1="650" y1="450" x2="690" y2="510" stroke="#fef08a" stroke-width="2"/>
    <line x1="650" y1="450" x2="620" y2="520" stroke="#fb923c" stroke-width="3"/>

    <!-- Tool cart -->
    <rect x="80" y="460" width="160" height="250" fill="#b91c1c" rx="6" stroke="#7f1d1d" stroke-width="3"/>
    <rect x="95" y="490" width="130" height="30" fill="#450a0a" rx="3"/>
    <rect x="95" y="540" width="130" height="30" fill="#450a0a" rx="3"/>
    <rect x="95" y="590" width="130" height="30" fill="#450a0a" rx="3"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createInstalledStairsSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <rect width="1200" height="800" fill="#f5f5f4"/>
    <!-- Modern interior living room wall -->
    <rect x="0" y="0" width="1200" height="580" fill="#fafaf9"/>
    <!-- Microcement floor -->
    <rect x="0" y="580" width="1200" height="220" fill="#e7e5e4"/>
    <line x1="0" y1="580" x2="1200" y2="580" stroke="#d6d3d1" stroke-width="2"/>

    <!-- Large architectural picture window -->
    <rect x="80" y="80" width="300" height="420" fill="#bae6fd" fill-opacity="0.4" stroke="#1c1917" stroke-width="6"/>

    <!-- Matte black spine -->
    <path d="M300 700 Q500 500 700 200 Q800 120 950 80" stroke="#18181b" stroke-width="48" fill="none" stroke-linecap="round"/>
    
    <!-- Solid Oak Steps (Warm wood finish) -->
    <g stroke="#78350f" stroke-width="2">
      <!-- Step 1 -->
      <polygon points="330,650 510,635 510,670 330,685" fill="#d97706"/>
      <!-- Step 2 -->
      <polygon points="410,560 590,540 590,575 410,595" fill="#b45309"/>
      <!-- Step 3 -->
      <polygon points="500,460 680,435 680,470 500,495" fill="#d97706"/>
      <!-- Step 4 -->
      <polygon points="590,350 770,320 770,355 590,385" fill="#b45309"/>
      <!-- Step 5 -->
      <polygon points="700,230 880,195 880,230 700,265" fill="#d97706"/>
      <!-- Step 6 -->
      <polygon points="810,130 990,95 990,130 810,165" fill="#b45309"/>
    </g>

    <!-- Tempered Glass & Stainless Steel balustrade -->
    <path d="M420 560 Q600 360 800 140 Q880 70 1020 40" stroke="#0ea5e9" stroke-width="12" stroke-opacity="0.3" fill="none"/>
    <path d="M420 540 Q600 340 800 120 Q880 50 1020 20" stroke="#0f172a" stroke-width="8" fill="none" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PROJECTS: PresetProject[] = [
  {
    id: 'poarta-culisant-laser',
    title: 'Poartă Culisantă Decupată Laser',
    subtitle: 'Cadru oțel 80x40 + Panou traforat frunză',
    category: 'Porți & Garduri',
    leftImage: {
      url: createWorkshopGateSvg(),
      label: 'În lucru / Atelier',
      caption: 'Asamblare, suduri TIG și degresare înainte de vopsire',
    },
    rightImage: {
      url: createInstalledGateSvg(),
      label: 'Final / Montat',
      caption: 'Vopsire electrostatică antracit RAL 7016 și motorizare',
    },
    suggestedSettings: {
      showDivider: true,
      dividerWidth: 4,
      dividerColor: '#f59e0b',
      badgeStyle: 'warning',
      leftBadgeText: 'În lucru',
      rightBadgeText: 'Final',
      showBadges: false,
      companyName: '',
      companyPhone: '',
      showWatermark: false,
      showCenterIcon: false,
    },
  },
  {
    id: 'scara-elicoidala',
    title: 'Scară Elicoidală pe Ax Central',
    subtitle: 'Structură monolitică din oțel + trepte stejar',
    category: 'Scări Interioare',
    leftImage: {
      url: createWorkshopStairsSvg(),
      label: 'În lucru',
      caption: 'Structură brută pe banc de probă și calibrare console',
    },
    rightImage: {
      url: createInstalledStairsSvg(),
      label: 'Final',
      caption: 'Finisaj negru mat, trepte stejar lăcuit și balustradă sticlă',
    },
    suggestedSettings: {
      showDivider: true,
      dividerWidth: 3,
      dividerColor: '#ffffff',
      badgeStyle: 'glass',
      leftBadgeText: 'În lucru',
      rightBadgeText: 'Final',
      showBadges: false,
      companyName: '',
      companyPhone: '',
      showWatermark: false,
      showCenterIcon: false,
    },
  },
];
