// Configuration & Full Curated / Uploaded Image Catalogue for 8-Puzzle

export const APP_CONFIG = {
  DEFAULT_NAME: 'Alex',
  MAX_HINTS: 3,
  GRID_SIZE: 3
};

// 1. Glossy Primary-Colored Interlocking Jigsaw Pattern (Matching the user's latest attached image!)
export const COLORFUL_JIGSAW_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <!-- 3D Bevel & Emboss Gradient definitions for Yellow, Blue, Green, Red, Purple -->
    <linearGradient id="jigYellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF04B"/>
      <stop offset="40%" stop-color="#FFDD00"/>
      <stop offset="100%" stop-color="#E5A700"/>
    </linearGradient>
    <linearGradient id="jigBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2575FC"/>
      <stop offset="50%" stop-color="#0048E5"/>
      <stop offset="100%" stop-color="#002C9B"/>
    </linearGradient>
    <linearGradient id="jigGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#28E05A"/>
      <stop offset="50%" stop-color="#00C836"/>
      <stop offset="100%" stop-color="#008C22"/>
    </linearGradient>
    <linearGradient id="jigRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF4B4B"/>
      <stop offset="50%" stop-color="#E50000"/>
      <stop offset="100%" stop-color="#A50000"/>
    </linearGradient>
    <linearGradient id="jigPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C035FA"/>
      <stop offset="50%" stop-color="#9A00E5"/>
      <stop offset="100%" stop-color="#64009B"/>
    </linearGradient>

    <!-- Glossy Highlight & Drop Shadow Filters -->
    <filter id="jigBevel" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="#0F172A"/>

  <!-- Row 1: (0,0)=Yellow, (0,1)=Blue, (0,2)=Green -->
  <!-- Tile 1: Top-Left Yellow with Right Tab & Bottom Tab -->
  <path d="M 0,0 H 200 C 200,35 228,55 235,75 C 242,95 228,125 200,125 H 200 V 200 H 135 C 135,225 105,240 85,232 C 65,225 65,200 65,200 H 0 Z" 
        fill="url(#jigYellow)" stroke="#D97706" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 2: Top-Center Blue with Right Tab, Left Slot, Bottom Slot -->
  <path d="M 200,0 H 400 C 400,35 428,55 435,75 C 442,95 428,125 400,125 V 200 H 265 C 265,175 235,160 215,168 C 195,175 195,200 195,200 H 200 V 125 C 228,125 242,95 235,75 C 228,55 200,35 200,0 Z" 
        fill="url(#jigBlue)" stroke="#0035A8" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 3: Top-Right Green with Left Slot & Bottom Tab -->
  <path d="M 400,0 H 600 V 200 H 535 C 535,225 505,240 485,232 C 465,225 465,200 465,200 H 400 V 125 C 428,125 442,95 435,75 C 428,55 400,35 400,0 Z" 
        fill="url(#jigGreen)" stroke="#00751A" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Row 2: (1,0)=Green, (1,1)=Red, (1,2)=Purple -->
  <!-- Tile 4: Mid-Left Green with Top Slot, Right Tab, Bottom Tab -->
  <path d="M 0,200 H 65 C 65,200 65,225 85,232 C 105,240 135,225 135,200 H 200 V 265 C 225,265 240,295 232,315 C 225,335 200,335 200,335 V 400 H 125 C 125,428 95,442 75,435 C 55,428 35,400 0,400 Z" 
        fill="url(#jigGreen)" stroke="#00751A" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 5: Mid-Center Red with Top Tab, Left Slot, Right Tab, Bottom Slot -->
  <path d="M 200,200 H 265 C 265,175 235,160 215,168 C 195,175 195,200 195,200 H 400 V 265 C 425,265 440,295 432,315 C 425,335 400,335 400,335 V 400 H 265 C 265,375 235,360 215,368 C 195,375 195,400 195,400 H 200 V 335 C 200,335 225,335 232,315 C 240,295 225,265 200,265 Z" 
        fill="url(#jigRed)" stroke="#990000" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 6: Mid-Right Purple with Top Slot, Left Slot, Bottom Tab -->
  <path d="M 400,200 H 465 C 465,200 465,225 485,232 C 505,240 535,225 535,200 H 600 V 400 H 535 C 535,425 505,440 485,432 C 465,425 465,400 465,400 H 400 V 335 C 400,335 425,335 432,315 C 440,295 425,265 400,265 Z" 
        fill="url(#jigPurple)" stroke="#4A0072" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Row 3: (2,0)=Red, (2,1)=Blue, (2,2)=Yellow -->
  <!-- Tile 7: Bottom-Left Red with Top Slot, Right Tab -->
  <path d="M 0,400 C 35,400 55,428 75,435 C 95,442 125,428 125,400 H 200 V 465 C 225,465 240,495 232,515 C 225,535 200,535 200,535 V 600 H 0 Z" 
        fill="url(#jigRed)" stroke="#990000" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 8: Bottom-Center Blue with Top Tab, Left Slot, Right Tab -->
  <path d="M 200,400 H 265 C 265,375 235,360 215,368 C 195,375 195,400 195,400 H 400 V 465 C 425,465 440,495 432,515 C 425,535 400,535 400,535 V 600 H 200 V 535 C 200,535 225,535 232,515 C 240,495 225,465 200,465 Z" 
        fill="url(#jigBlue)" stroke="#0035A8" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Tile 9 (Goal preview): Bottom-Right Yellow with Top Slot, Left Slot -->
  <path d="M 400,400 H 465 C 465,400 465,425 485,432 C 505,440 535,425 535,400 H 600 V 600 H 400 V 535 C 400,535 425,535 432,515 C 440,495 425,465 400,465 Z" 
        fill="url(#jigYellow)" stroke="#D97706" stroke-width="3" filter="url(#jigBevel)"/>

  <!-- Glossy Highlights on Tabs and Centers -->
  <ellipse cx="100" cy="100" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 100 100)"/>
  <ellipse cx="300" cy="100" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 300 100)"/>
  <ellipse cx="500" cy="100" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 500 100)"/>
  <ellipse cx="100" cy="300" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 100 300)"/>
  <ellipse cx="300" cy="300" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 300 300)"/>
  <ellipse cx="500" cy="300" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 500 300)"/>
  <ellipse cx="100" cy="500" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 100 500)"/>
  <ellipse cx="300" cy="500" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 300 500)"/>
  <ellipse cx="500" cy="500" rx="40" ry="25" fill="#FFFFFF" opacity="0.25" transform="rotate(-20 500 500)"/>
</svg>
`);

// 2. Lush Cartoon Nature Landscape
export const CARTOON_LANDSCAPE_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="60%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="70%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </radialGradient>
    <linearGradient id="mountGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="35%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="hillBack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86EFAC"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
    <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="hillLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F87171"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect width="600" height="240" fill="url(#skyGrad)"/>

  <!-- Left Cloud (Tile 1) -->
  <g fill="#FFFFFF" opacity="0.95">
    <circle cx="90" cy="80" r="30"/>
    <circle cx="120" cy="70" r="38"/>
    <circle cx="150" cy="80" r="30"/>
    <circle cx="105" cy="95" r="25"/>
    <circle cx="135" cy="95" r="25"/>
  </g>

  <!-- Happy Smiling Sun (Tile 2 center top) -->
  <g transform="translate(300, 95)">
    <g stroke="#F59E0B" stroke-width="6" stroke-linecap="round">
      <line x1="0" y1="-65" x2="0" y2="-50"/>
      <line x1="0" y1="65" x2="0" y2="50"/>
      <line x1="-65" y1="0" x2="-50" y2="0"/>
      <line x1="65" y1="0" x2="50" y2="0"/>
      <line x1="-46" y1="-46" x2="-35" y2="-35"/>
      <line x1="46" y1="46" x2="35" y2="35"/>
      <line x1="-46" y1="46" x2="-35" y2="35"/>
      <line x1="46" y1="-46" x2="35" y2="-35"/>
    </g>
    <circle cx="0" cy="0" r="42" fill="url(#sunGrad)" filter="url(#softGlow)"/>
    <circle cx="-14" cy="-6" r="5" fill="#1E1B4B"/>
    <circle cx="14" cy="-6" r="5" fill="#1E1B4B"/>
    <circle cx="-12" cy="-8" r="1.8" fill="#FFFFFF"/>
    <circle cx="16" cy="-8" r="1.8" fill="#FFFFFF"/>
    <ellipse cx="-20" cy="4" rx="5" ry="3" fill="#F472B6" opacity="0.8"/>
    <ellipse cx="20" cy="4" rx="5" ry="3" fill="#F472B6" opacity="0.8"/>
    <path d="M-10,6 Q0,18 10,6" fill="none" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Right Cloud (Tile 3) -->
  <g fill="#FFFFFF" opacity="0.95">
    <circle cx="490" cy="85" r="28"/>
    <circle cx="520" cy="75" r="34"/>
    <circle cx="550" cy="85" r="28"/>
    <circle cx="505" cy="95" r="22"/>
    <circle cx="535" cy="95" r="22"/>
  </g>

  <!-- Snowy Mountain (Tile 3) -->
  <polygon points="360,240 500,100 640,240" fill="url(#mountGrad)"/>
  <polygon points="460,140 500,100 540,140 520,135 500,150 480,135" fill="#FFFFFF"/>

  <!-- Hills & Tree (Tile 4) -->
  <path d="M 220,240 Q 380,160 600,220 L 600,400 L 220,400 Z" fill="url(#hillBack)"/>
  <path d="M 0,260 Q 200,180 440,280 L 440,420 L 0,420 Z" fill="url(#hillFront)"/>

  <path d="M 80,380 C 80,320 95,290 100,270 L 140,270 C 145,290 160,320 160,380 Z" fill="#78350F"/>
  <circle cx="70" cy="240" r="38" fill="#15803D"/>
  <circle cx="120" cy="200" r="50" fill="#22C55E"/>
  <circle cx="170" cy="240" r="38" fill="#16A34A"/>
  <circle cx="100" cy="255" r="42" fill="#15803D"/>
  <circle cx="140" cy="255" r="42" fill="#16A34A"/>
  <circle cx="115" cy="190" r="28" fill="#4ADE80" opacity="0.6"/>

  <!-- Cozy Little House (Tile 6) -->
  <g transform="translate(420, 270)">
    <rect x="-10" y="75" width="130" height="15" rx="7" fill="#14532D" opacity="0.3"/>
    <rect x="0" y="25" width="110" height="60" rx="6" fill="url(#wallGrad)" stroke="#FDE68A" stroke-width="2"/>
    <rect x="75" y="-12" width="16" height="28" fill="#991B1B" rx="2"/>
    <ellipse cx="83" cy="-12" rx="10" ry="3" fill="#7F1D1D"/>
    <circle cx="83" cy="-22" r="6" fill="#FFFFFF" opacity="0.7"/>
    <circle cx="88" cy="-34" r="8" fill="#FFFFFF" opacity="0.5"/>
    <polygon points="-10,28 55,-15 120,28" fill="url(#roofGrad)" stroke="#B91C1C" stroke-width="2"/>
    <path d="M 42,45 H 68 V 85 H 42 Z" fill="#92400E" rx="3"/>
    <circle cx="63" cy="65" r="2.5" fill="#FDE047"/>
    <rect x="12" y="42" width="22" height="22" rx="4" fill="#60A5FA" stroke="#FFFFFF" stroke-width="2"/>
    <line x1="23" y1="42" x2="23" y2="64" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="12" y1="53" x2="34" y2="53" stroke="#FFFFFF" stroke-width="1.5"/>
    <circle cx="55" cy="10" r="8" fill="#93C5FD" stroke="#FFFFFF" stroke-width="2"/>
  </g>

  <!-- Flower Meadow (Tile 7) -->
  <path d="M 0,380 Q 140,360 280,430 L 280,600 L 0,600 Z" fill="url(#hillLeft)"/>
  <circle cx="50" cy="460" r="7" fill="#FDE047"/>
  <circle cx="43" cy="460" r="5" fill="#FFFFFF"/>
  <circle cx="57" cy="460" r="5" fill="#FFFFFF"/>
  <circle cx="50" cy="453" r="5" fill="#FFFFFF"/>
  <circle cx="50" cy="467" r="5" fill="#FFFFFF"/>
  <circle cx="50" cy="460" r="4" fill="#F59E0B"/>

  <circle cx="105" cy="510" r="8" fill="#F472B6"/>
  <circle cx="97" cy="510" r="6" fill="#FDF2F8"/>
  <circle cx="113" cy="510" r="6" fill="#FDF2F8"/>
  <circle cx="105" cy="502" r="6" fill="#FDF2F8"/>
  <circle cx="105" cy="518" r="6" fill="#FDF2F8"/>
  <circle cx="105" cy="510" r="5" fill="#DB2777"/>

  <!-- Winding Path (Tile 8) -->
  <path d="M 240,600 C 260,510 320,470 300,420 C 280,370 340,310 420,330 L 460,335 C 380,330 330,390 350,440 C 370,490 320,540 330,600 Z" fill="url(#pathGrad)"/>
  <ellipse cx="280" cy="560" rx="9" ry="5" fill="#B45309" opacity="0.6"/>
  <ellipse cx="305" cy="540" rx="8" ry="4" fill="#B45309" opacity="0.6"/>
  <ellipse cx="290" cy="510" rx="7" ry="4" fill="#B45309" opacity="0.6"/>
</svg>
`);

// Complete List of Real Community Images + Landscapes uploaded for 8-Puzzle
export const PUZZLE_IMAGES_LIST = [
  {
    id: 'tree_plantation',
    title: 'Tree Plantation',
    category: 'Environment',
    url: '/puzzles/tree_plantation.jpeg',
    icon: '🌱'
  },
  {
    id: 'beach_cleanup',
    title: 'Beach Cleanup',
    category: 'Environment',
    url: '/puzzles/beach_cleanup.jpeg',
    icon: '🌊'
  },
  {
    id: 'sunset_cleanup',
    title: 'Sunset Coastal Drive',
    category: 'Environment',
    url: '/puzzles/sunset_cleanup.jpeg',
    icon: '🌅'
  },
  {
    id: 'elder_care',
    title: 'Community Care',
    category: 'Kindness',
    url: '/puzzles/elder_care.jpeg',
    icon: '👵'
  },
  {
    id: 'beach_volunteers',
    title: 'Beach Volunteers',
    category: 'Environment',
    url: '/puzzles/beach_volunteers.jpeg',
    icon: '🏖️'
  },
  {
    id: 'school_group',
    title: 'Student Project Group',
    category: 'Education',
    url: '/puzzles/school_group.jpeg',
    icon: '🏫'
  },
  {
    id: 'event_night',
    title: 'Night Camp Event',
    category: 'Community',
    url: '/puzzles/event_night.jpeg',
    icon: '🌟'
  },
  {
    id: 'activity_1',
    title: 'Social Activity 1',
    category: 'Community',
    url: '/puzzles/activity_1.jpeg',
    icon: '📸'
  },
  {
    id: 'activity_2',
    title: 'Social Activity 2',
    category: 'Community',
    url: '/puzzles/activity_2.jpeg',
    icon: '📸'
  },
  {
    id: 'activity_3',
    title: 'Social Activity 3',
    category: 'Community',
    url: '/puzzles/activity_3.jpeg',
    icon: '📸'
  },
  {
    id: 'community_art',
    title: 'Community Art Project',
    category: 'Community',
    url: '/puzzles/community_art.jpeg',
    icon: '🎨'
  }
];

// Mascot SVG
export const MASCOT_HERO_SVG = `
<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
  <defs>
    <linearGradient id="mascotGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFE043"/>
      <stop offset="60%" stop-color="#FFC000"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="puzzleBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="puzzlePink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F472B6"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="puzzlePurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#F59E0B" flood-opacity="0.4"/>
    </filter>
  </defs>

  <g transform="translate(150, 25) rotate(18) scale(0.38)">
    <path d="M20,20 H50 C50,35 65,40 75,40 C85,40 100,35 100,20 H130 V50 C115,50 110,65 110,75 C110,85 115,100 130,100 V130 H100 C100,115 85,110 75,110 C65,110 50,115 50,130 H20 V100 C35,100 40,85 40,75 C40,65 35,50 20,50 Z" fill="url(#puzzlePink)"/>
  </g>
  <g transform="translate(10, 50) rotate(-15) scale(0.35)">
    <path d="M20,20 H50 C50,35 65,40 75,40 C85,40 100,35 100,20 H130 V50 C115,50 110,65 110,75 C110,85 115,100 130,100 V130 H100 C100,115 85,110 75,110 C65,110 50,115 50,130 H20 V100 C35,100 40,85 40,75 C40,65 35,50 20,50 Z" fill="url(#puzzleBlue)"/>
  </g>
  <g transform="translate(152, 115) rotate(24) scale(0.35)">
    <path d="M20,20 H50 C50,35 65,40 75,40 C85,40 100,35 100,20 H130 V50 C115,50 110,65 110,75 C110,85 115,100 130,100 V130 H100 C100,115 85,110 75,110 C65,110 50,115 50,130 H20 V100 C35,100 40,85 40,75 C40,65 35,50 20,50 Z" fill="url(#puzzlePurple)"/>
  </g>
  <polygon points="35,38 38,46 46,49 38,52 35,60 32,52 24,49 32,46" fill="#FDE047"/>
  <polygon points="175,80 177,85 182,87 177,89 175,94 173,89 168,87 173,85" fill="#FFFFFF"/>

  <g filter="url(#goldGlow)" transform="translate(42, 35)">
    <path d="M 25,25 
             H 48 C 48,34 56,40 65,40 C 74,40 82,34 82,25 
             H 105 
             V 48 C 96,48 90,56 90,65 C 90,74 96,82 105,82 
             V 105 
             H 82 C 82,96 74,90 65,90 C 56,90 48,96 48,105 
             H 25 
             V 82 C 34,82 40,74 40,65 C 40,56 34,48 25,48 Z" 
          fill="url(#mascotGold)" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round"/>
    
    <path d="M 28,28 H 45 C 50,36 58,40 65,40 C 72,40 80,36 85,28 H 102" stroke="#FEF08A" stroke-width="3" stroke-linecap="round" fill="none"/>

    <circle cx="50" cy="62" r="6.5" fill="#1E1B4B"/>
    <circle cx="78" cy="62" r="6.5" fill="#1E1B4B"/>
    <circle cx="48" cy="59.5" r="2.5" fill="#FFFFFF"/>
    <circle cx="76" cy="59.5" r="2.5" fill="#FFFFFF"/>
    <ellipse cx="43" cy="71" rx="4.5" ry="2.8" fill="#F472B6" opacity="0.85"/>
    <ellipse cx="85" cy="71" rx="4.5" ry="2.8" fill="#F472B6" opacity="0.85"/>

    <path d="M 58,68 Q 64,80 70,68 Z" fill="#DC2626"/>
    <path d="M 59,73 Q 64,78 69,73" fill="#F43F5E"/>
    <path d="M 58,68 Q 64,72 70,68" stroke="#1E1B4B" stroke-width="1.8" fill="none"/>

    <path d="M 104,60 C 114,52 122,58 116,68 C 110,72 104,68 104,60 Z" fill="url(#mascotGold)" stroke="#F59E0B" stroke-width="2"/>
    <path d="M 26,62 C 16,56 10,64 16,72 C 22,76 26,70 26,62 Z" fill="url(#mascotGold)" stroke="#F59E0B" stroke-width="2"/>
  </g>
</svg>
`;

// Trophy SVG
export const TROPHY_HERO_SVG = `
<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
  <defs>
    <linearGradient id="goldCup" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF066"/>
      <stop offset="40%" stop-color="#FFD000"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="trophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#3730A3"/>
    </linearGradient>
    <linearGradient id="laurelLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <filter id="trophyGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#F59E0B" flood-opacity="0.5"/>
    </filter>
  </defs>

  <g fill="url(#laurelLeaf)" opacity="0.9">
    <path d="M 55,90 C 45,75 52,65 65,70 C 65,82 60,88 55,90 Z"/>
    <path d="M 45,115 C 32,105 38,92 52,98 C 52,110 48,114 45,115 Z"/>
    <path d="M 46,145 C 32,140 35,125 48,128 C 52,140 48,144 46,145 Z"/>
    <path d="M 58,172 C 48,170 48,155 60,156 C 65,166 60,171 58,172 Z"/>
    <path d="M 78,192 C 68,194 65,180 78,178 C 84,188 80,192 78,192 Z"/>
  </g>
  <g fill="url(#laurelLeaf)" opacity="0.9" transform="translate(240, 0) scale(-1, 1)">
    <path d="M 55,90 C 45,75 52,65 65,70 C 65,82 60,88 55,90 Z"/>
    <path d="M 45,115 C 32,105 38,92 52,98 C 52,110 48,114 45,115 Z"/>
    <path d="M 46,145 C 32,140 35,125 48,128 C 52,140 48,144 46,145 Z"/>
    <path d="M 58,172 C 48,170 48,155 60,156 C 65,166 60,171 58,172 Z"/>
    <path d="M 78,192 C 68,194 65,180 78,178 C 84,188 80,192 78,192 Z"/>
  </g>

  <polygon points="40,50 43,58 51,61 43,64 40,72 37,64 29,61 37,58" fill="#FDE047"/>
  <polygon points="195,45 197,52 204,54 197,56 195,63 193,56 186,54 193,52" fill="#FDE047"/>

  <g filter="url(#trophyGlow)">
    <path d="M 75,75 C 45,75 45,115 75,120 L 78,110 C 60,105 60,85 78,82 Z" fill="url(#goldCup)"/>
    <path d="M 165,75 C 195,75 195,115 165,120 L 162,110 C 180,105 180,85 162,82 Z" fill="url(#goldCup)"/>
    <path d="M 72,55 H 168 C 168,105 145,130 120,135 C 95,130 72,105 72,55 Z" fill="url(#goldCup)" stroke="#D97706" stroke-width="3"/>
    <polygon points="120,80 124,90 135,90 126,97 129,107 120,101 111,107 114,97 105,90 116,90" fill="#FFFBEB"/>
    <path d="M 112,135 H 128 V 160 H 112 Z" fill="url(#goldCup)"/>
    <ellipse cx="120" cy="160" rx="20" ry="6" fill="url(#goldCup)"/>
    <rect x="90" y="165" width="60" height="22" rx="6" fill="url(#trophyBase)" stroke="#4F46E5" stroke-width="2"/>
    <rect x="95" y="172" width="50" height="8" rx="2" fill="#818CF8" opacity="0.6"/>
  </g>
</svg>
`;

export const INITIAL_LEADERBOARD = [
  {
    rank: 1,
    name: 'Mia',
    score: 1250,
    avatar: '👧',
    avatarBg: '#EC4899',
    badge: '1',
    badgeBg: '#F59E0B'
  },
  {
    rank: 2,
    name: 'Alex',
    score: 980,
    avatar: '🧩',
    avatarBg: '#FFC000',
    badge: '2',
    badgeBg: '#93C5FD'
  },
  {
    rank: 3,
    name: 'Noah',
    score: 875,
    avatar: '👦',
    avatarBg: '#3B82F6',
    badge: '3',
    badgeBg: '#D97706'
  }
];
