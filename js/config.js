// Configuration, Curated Image Assets, and Default Data for 8-Puzzle Mobile App

export const APP_CONFIG = {
  APP_NAME: '8-PUZZLE',
  DEFAULT_PLAYER_NAME: 'Sunny Gupta',
  DEFAULT_PARTICIPANT_ID: '027',
  MAX_HINTS: 3,
  GRID_SIZE: 3,
  DEFAULT_DIFFICULTY: 'standard', // 'easy', 'standard', 'master'
  TRANSITION_DURATION: 1600, // ms
};

export const PUZZLE_IMAGES = [
  {
    id: 'puzzle_mascot',
    title: 'Neon Mascot',
    category: 'Mascot',
    difficulty: 'Standard',
    themeColor: '#6366F1',
    // High quality colorful vector illustration
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4F46E5"/>
            <stop offset="50%" stop-color="#7C3AED"/>
            <stop offset="100%" stop-color="#EC4899"/>
          </linearGradient>
          <linearGradient id="puzzleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
          <linearGradient id="puzzleWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#E2E8F0"/>
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1E1B4B" flood-opacity="0.35"/>
          </filter>
        </defs>
        
        <!-- Background Pattern -->
        <rect width="600" height="600" fill="url(#bg)"/>
        <circle cx="100" cy="100" r="140" fill="#FFFFFF" fill-opacity="0.08"/>
        <circle cx="520" cy="500" r="180" fill="#FFFFFF" fill-opacity="0.08"/>
        
        <!-- Geometric Grid Lines Accent -->
        <path d="M0,200 L600,200 M0,400 L600,400 M200,0 L200,600 M400,0 L400,600" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="8 8"/>
        
        <!-- Center Floating Puzzle Masterpiece Piece 1 (Gold Base) -->
        <g filter="url(#shadow)" transform="translate(180, 240) rotate(-8 120 120)">
          <path d="M 60,60 
                   H 110 C 110,45 125,40 135,40 C 145,40 160,45 160,60 
                   H 210 V 110 C 225,110 230,125 230,135 C 230,145 225,160 210,160 
                   V 210 H 160 C 160,225 145,230 135,230 C 125,230 110,225 110,210 
                   H 60 V 160 C 45,160 40,145 40,135 C 40,125 45,110 60,110 Z" 
                fill="url(#puzzleGold)" stroke="#D97706" stroke-width="4"/>
        </g>
        
        <!-- Center Floating Puzzle Masterpiece Piece 2 (White Sleek) -->
        <g filter="url(#shadow)" transform="translate(140, 140) rotate(6 160 160)">
          <path d="M 80,80 
                   H 150 C 150,60 170,50 185,50 C 200,50 220,60 220,80 
                   H 290 V 150 C 310,150 320,170 320,185 C 320,200 310,220 290,220 
                   V 290 H 220 C 220,270 200,260 185,260 C 170,260 150,270 150,290 
                   H 80 V 220 C 60,220 50,200 50,185 C 50,170 60,150 80,150 Z" 
                fill="url(#puzzleWhite)"/>
          
          <!-- Cute Friendly Mascot Face -->
          <circle cx="150" cy="170" r="14" fill="#312E81"/>
          <circle cx="220" cy="170" r="14" fill="#312E81"/>
          <circle cx="154" cy="166" r="4" fill="#FFFFFF"/>
          <circle cx="224" cy="166" r="4" fill="#FFFFFF"/>
          <ellipse cx="132" cy="186" rx="10" ry="6" fill="#F472B6" fill-opacity="0.8"/>
          <ellipse cx="238" cy="186" rx="10" ry="6" fill="#F472B6" fill-opacity="0.8"/>
          <path d="M 170,192 Q 185,208 200,192" stroke="#312E81" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        </g>
        
        <!-- Little Sparkles -->
        <g fill="#FDE047">
          <polygon points="100,240 106,255 120,260 106,265 100,280 94,265 80,260 94,255"/>
          <polygon points="490,140 494,152 506,155 494,158 490,170 486,158 474,155 486,152"/>
          <polygon points="450,420 455,432 467,435 455,438 450,450 445,438 433,435 445,432"/>
        </g>

        <!-- Big Bold Title Badge at Top -->
        <rect x="190" y="30" width="220" height="42" rx="21" fill="#FFFFFF" fill-opacity="0.22"/>
        <text x="300" y="58" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">8-CHALLENGE</text>
      </svg>
    `)
  },
  {
    id: 'cyber_synthwave',
    title: 'Neon Cyber City',
    category: 'Sci-Fi',
    difficulty: 'Pro',
    themeColor: '#06B6D4',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="60%" stop-color="#312E81"/>
            <stop offset="100%" stop-color="#701A75"/>
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E"/>
            <stop offset="50%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#FDE047"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#skyGrad)"/>
        
        <!-- Glowing Sun -->
        <circle cx="300" cy="270" r="120" fill="url(#sunGrad)"/>
        <rect x="170" y="270" width="260" height="6" fill="#312E81"/>
        <rect x="170" y="290" width="260" height="10" fill="#312E81"/>
        <rect x="170" y="315" width="260" height="14" fill="#312E81"/>
        <rect x="170" y="345" width="260" height="20" fill="#312E81"/>

        <!-- Synthwave Mountains -->
        <polygon points="0,380 140,240 280,380" fill="#1E1B4B" stroke="#06B6D4" stroke-width="2"/>
        <polygon points="220,380 370,210 520,380" fill="#0F172A" stroke="#EC4899" stroke-width="2"/>
        <polygon points="400,380 500,280 600,380" fill="#1E1B4B" stroke="#06B6D4" stroke-width="2"/>
        
        <!-- Cyber Perspective Floor Grid -->
        <rect x="0" y="380" width="600" height="220" fill="#090D16"/>
        <path d="M300,380 L0,600 M300,380 L100,600 M300,380 L200,600 M300,380 L300,600 M300,380 L400,600 M300,380 L500,600 M300,380 L600,600" stroke="#06B6D4" stroke-width="2.5" opacity="0.75"/>
        <path d="M0,400 L600,400 M0,430 L600,430 M0,470 L600,470 M0,525 L600,525 M0,600 L600,600" stroke="#EC4899" stroke-width="2" opacity="0.6"/>
        
        <!-- Cyber City Hologram Silhouette -->
        <rect x="220" y="310" width="30" height="70" fill="#06B6D4" opacity="0.9"/>
        <rect x="260" y="280" width="40" height="100" fill="#3B82F6" opacity="0.9"/>
        <rect x="310" y="295" width="35" height="85" fill="#8B5CF6" opacity="0.9"/>
        <rect x="355" y="325" width="25" height="55" fill="#EC4899" opacity="0.9"/>
      </svg>
    `)
  },
  {
    id: 'cosmic_galaxy',
    title: 'Cosmic Nebula',
    category: 'Space',
    difficulty: 'Expert',
    themeColor: '#8B5CF6',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <radialGradient id="spaceCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#DDD6FE"/>
            <stop offset="25%" stop-color="#8B5CF6"/>
            <stop offset="60%" stop-color="#4C1D95"/>
            <stop offset="100%" stop-color="#090514"/>
          </radialGradient>
          <radialGradient id="nebulaPink" cx="30%" cy="40%" r="40%">
            <stop offset="0%" stop-color="#F472B6" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#831843" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="nebulaCyan" cx="70%" cy="60%" r="45%">
            <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0E7490" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#spaceCore)"/>
        <rect width="600" height="600" fill="url(#nebulaPink)"/>
        <rect width="600" height="600" fill="url(#nebulaCyan)"/>
        
        <!-- Ringed Planet -->
        <g transform="translate(300, 300) rotate(-22)">
          <ellipse cx="0" cy="0" rx="160" ry="32" fill="none" stroke="#FDE047" stroke-width="12" opacity="0.85"/>
          <circle cx="0" cy="0" r="90" fill="#4338CA"/>
          <circle cx="-25" cy="-25" r="70" fill="#6366F1" opacity="0.7"/>
          <path d="M-80,0 A90,90 0 0,0 80,0 A160,32 0 0,0 -80,0" fill="#312E81" opacity="0.9"/>
          <circle cx="0" cy="0" r="90" fill="none" stroke="#A5B4FC" stroke-width="4"/>
        </g>
        
        <!-- Distant Stars and Constellations -->
        <circle cx="90" cy="120" r="3" fill="#FFFFFF"/>
        <circle cx="140" cy="80" r="4" fill="#FDE047"/>
        <circle cx="210" cy="140" r="2.5" fill="#FFFFFF"/>
        <circle cx="510" cy="110" r="3.5" fill="#FFFFFF"/>
        <circle cx="470" cy="220" r="4" fill="#F472B6"/>
        <circle cx="100" cy="480" r="3" fill="#22D3EE"/>
        <circle cx="490" cy="490" r="4" fill="#FFFFFF"/>
        <line x1="90" y1="120" x2="140" y2="80" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1"/>
        <line x1="140" y1="80" x2="210" y2="140" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1"/>
      </svg>
    `)
  },
  {
    id: 'nature_zen',
    title: 'Fuji Sunset Glow',
    category: 'Nature',
    difficulty: 'Easy',
    themeColor: '#EA580C',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF512F"/>
            <stop offset="50%" stop-color="#F09819"/>
            <stop offset="100%" stop-color="#7028E4"/>
          </linearGradient>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4A00E0"/>
            <stop offset="100%" stop-color="#190A38"/>
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#sunsetGrad)"/>
        <rect y="420" width="600" height="180" fill="url(#waterGrad)"/>
        
        <!-- Big Crimson Sun -->
        <circle cx="300" cy="230" r="95" fill="#FFF176" opacity="0.95"/>
        
        <!-- Mount Fuji Silhouette -->
        <polygon points="120,420 300,160 480,420" fill="#2E1065"/>
        <polygon points="260,220 300,160 340,220 320,210 300,225 280,210" fill="#FFFFFF"/>
        
        <!-- Reflection on lake -->
        <ellipse cx="300" cy="460" rx="140" ry="12" fill="#F59E0B" opacity="0.4"/>
        <ellipse cx="300" cy="500" rx="100" ry="8" fill="#F59E0B" opacity="0.3"/>
        <ellipse cx="300" cy="540" rx="60" ry="5" fill="#F59E0B" opacity="0.2"/>
        
        <!-- Torii Gate Silhouette -->
        <g transform="translate(180, 360) scale(0.6)" fill="#BE123C">
          <rect x="0" y="30" width="16" height="110"/>
          <rect x="124" y="30" width="16" height="110"/>
          <rect x="-20" y="10" width="180" height="16" rx="4"/>
          <rect x="-10" y="34" width="160" height="10"/>
          <rect x="62" y="24" width="16" height="20"/>
        </g>
      </svg>
    `)
  }
];

export const INITIAL_LEADERBOARD = [
  {
    rank: 1,
    name: 'Aarav Sharma',
    id: '014',
    avatar: 'A',
    avatarColor: '#6366F1',
    score: 1580,
    timeFormatted: '01:18',
    timeSec: 78,
    moves: 29,
    badge: '🥇',
    date: 'Today'
  },
  {
    rank: 2,
    name: 'Priya Patel',
    id: '089',
    avatar: 'P',
    avatarColor: '#EC4899',
    score: 1510,
    timeFormatted: '01:24',
    timeSec: 84,
    moves: 31,
    badge: '🥈',
    date: 'Today'
  },
  {
    rank: 3,
    name: 'Rohan Verma',
    id: '042',
    avatar: 'R',
    avatarColor: '#8B5CF6',
    score: 1470,
    timeFormatted: '01:29',
    timeSec: 89,
    moves: 33,
    badge: '🥉',
    date: 'Yesterday'
  },
  {
    rank: 4,
    name: 'Ananya Iyer',
    id: '105',
    avatar: 'A',
    avatarColor: '#10B981',
    score: 1390,
    timeFormatted: '01:42',
    timeSec: 102,
    moves: 36,
    badge: '#4',
    date: 'Yesterday'
  },
  {
    rank: 5,
    name: 'Vikram Mehta',
    id: '063',
    avatar: 'V',
    avatarColor: '#F59E0B',
    score: 1320,
    timeFormatted: '01:55',
    timeSec: 115,
    moves: 40,
    badge: '#5',
    date: '2d ago'
  }
];
