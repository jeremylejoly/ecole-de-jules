import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Volume2, VolumeX, Star, MapPin, Compass, Shield, HelpCircle, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/audio';

interface DashboardProps {
  stars: number;
  completedGames: Record<string, boolean>;
  onSelectWorld: (worldId: 'pirates' | 'dinosaures' | 'police' | 'nature') => void;
  onResetProgress: () => void;
}

export default function Dashboard({ stars, completedGames, onSelectWorld, onResetProgress }: DashboardProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hoveredWorld, setHoveredWorld] = useState<'pirates' | 'dinosaures' | 'police' | 'nature' | null>(null);
  
  // Custom interactive map image background (Base64 data or standard map.jpg fallback)
  const [customMapImage, setCustomMapImage] = useState<string | null>(() => {
    return localStorage.getItem('jules_custom_map');
  });

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      setTimeout(() => playClickSound(), 100);
    }
  };

  const handleMapImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size to avoid exceeding localStorage limits
    if (file.size > 1.8 * 1024 * 1024) {
      alert("Oups ! L'image est un peu trop lourde pour le navigateur Jules (max 1.8 Mo). Essayez d'utiliser une version compressée ou plus petite !");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          localStorage.setItem('jules_custom_map', dataUrl);
          setCustomMapImage(dataUrl);
          playClickSound();
        } catch (err) {
          alert("Aïe, stockage saturé. Essayez une image de résolution inférieure.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetMapImage = () => {
    localStorage.removeItem('jules_custom_map');
    setCustomMapImage(null);
    playClickSound();
  };

  const worlds = [
    {
      id: 'pirates' as const,
      title: "L'Île aux Pirates",
      emoji: '🏴‍☠️',
      color: 'from-amber-500 to-amber-900 border-amber-400/40',
      badge: 'Moussaillon du Calcul',
      sub: 'Chiffres, trésors & arithmétique ! 🪙',
      badgeIcon: '🪙',
      tasks: ['pirate_treasure', 'pirate_counting', 'pirate_patterns'],
      coords: { x: 175, y: 195 }, // Perfectly adapted to the skull island on the provided image
      colorHex: '#f59e0b',
    },
    {
      id: 'dinosaures' as const,
      title: 'La Vallée des Dinos',
      emoji: '🦕',
      color: 'from-emerald-500 to-emerald-950 border-emerald-400/40',
      badge: 'Explorateur de Fossiles',
      sub: "L'alphabet, l'écriture & dinos ! 🦖",
      badgeIcon: '🦖',
      tasks: ['dino_fossil_hunt', 'dino_feeding', 'dino_jigsaw'],
      coords: { x: 445, y: 185 }, // Perfectly adapted to the dinosaur valley on the provided image
      colorHex: '#10b981',
    },
    {
      id: 'police' as const,
      title: 'Le Commissariat Légo',
      emoji: '🚓',
      color: 'from-blue-500 to-indigo-950 border-blue-400/40',
      badge: "Détective d'Élite",
      sub: 'Symétrie de briques, reflex & labyrinthes ! 🧱',
      badgeIcon: '👮‍♂️',
      coords: { x: 835, y: 195 }, // Perfectly matches the "POLICE" command station building
      tasks: ['lego_symmetry', 'police_detective', 'police_maze'],
      colorHex: '#3b82f6',
    },
    {
      id: 'nature' as const,
      title: 'La Forêt Magique',
      emoji: '🌲',
      color: 'from-green-500 to-teal-900 border-green-400/40',
      badge: 'Gardien de la Nature',
      sub: 'Herbiers, fléchettes & renard au terrier ! 🦊',
      badgeIcon: '🦉',
      coords: { x: 740, y: 510 }, // Placed over the deep magical nature forest next to the tepee camping and stream
      tasks: ['nature_shadow', 'nature_audio', 'nature_darts', 'nature_fox'],
      colorHex: '#059669',
    },
  ];

  // Calculate status counts
  const totalCompletedCount = Object.values(completedGames).filter(Boolean).length;
  
  return (
    <div className="w-full flex flex-col items-center">
      {/* Top action bar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-5 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow select-none">
            🎒
          </div>
          <div>
            <h4 className="font-sans font-bold text-white text-xs sm:text-sm">L'École de Jules</h4>
            <p className="font-mono text-[9px] text-[#22c55e] uppercase tracking-wider font-bold">5 Ans Ready ! 🚀</p>
          </div>
        </div>

        {/* Action Controls: Sound & Custom Map */}
        <div className="flex items-center gap-2">
          {/* Custom Map Upload Button */}
          <label className="h-10 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full flex items-center gap-2 justify-center text-xs font-semibold cursor-pointer transition shadow shadow-black/40">
            <Upload size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Ajouter ma carte Jules 🗺️</span>
            <span className="sm:hidden">Ma Carte 🗺️</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleMapImageUpload} 
              className="hidden" 
            />
          </label>

          {customMapImage && (
            <button
              id="btn-reset-map-bg"
              onClick={handleResetMapImage}
              className="w-10 h-10 bg-slate-800 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-slate-700 rounded-full flex items-center justify-center transition shadow cursor-pointer"
              title="Réinitialiser l'image de fond"
            >
              <RotateCcw size={14} />
            </button>
          )}

          <button
            id="btn-toggle-sound-dash"
            onClick={handleToggleSound}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow cursor-pointer ${
              soundOn
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700/80'
            }`}
            title={soundOn ? 'Couper le son' : 'Activer le son'}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Hero Welcome Unit */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-slate-900 to-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 select-none text-9xl pointer-events-none">
          🌟
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 text-left">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold py-1 px-3 rounded-full border border-amber-500/20 mb-2 select-none">
              <Sparkles size={10} fill="currentColor" /> EXPÉDITION INTERACTIVE
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white mb-2 leading-tight">
              Bonjour Jules ! Prêt à t'amuser ? 🧭
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Voici la carte de ton monde imaginaire ! Clique sur une île, une vallée préhistorique, un commissariat de briques ou une forêt magique pour lancer tes jeux favoris !
            </p>
          </div>

          {/* Star counter */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <Star size={38} className="text-amber-400 animate-pulse" fill="currentColor" />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-black text-slate-950 pt-0.5">
                {stars}
              </div>
            </div>
            <h3 className="font-sans font-extrabold text-xl text-white mt-1 leading-none">
              {stars} Étoiles ⭐️
            </h3>
            <span className="text-[10px] text-slate-400 font-sans mt-1">
              {totalCompletedCount} / 13 épreuves terminées
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Whimsical Cartoon SVG World Map */}
      <div className="w-full max-w-5xl text-left mb-8">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-xs sm:text-sm font-sans font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <span>🗺️ TA GRANDE CARTE DE JEU INTERACTIVE :</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400 animate-pulse">
            💡 Survollez les zones pour voir vos badges !
          </span>
        </div>

        <div className="relative bg-slate-950/80 rounded-3xl p-1 border border-slate-800 shadow-2xl overflow-hidden aspect-[1000/650] select-none">
          {/* Drifting Clouds Animation Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="cloud-1 absolute top-[10%] left-[-150px] w-36 h-10 bg-white/10 rounded-full filter blur-[1px] animate-cloud"></div>
            <div className="cloud-2 absolute top-[25%] left-[-200px] w-48 h-12 bg-white/5 rounded-full filter blur-[2px] animate-cloud-slow"></div>
            <div className="cloud-3 absolute top-[45%] right-[-180px] w-40 h-10 bg-white/8 rounded-full filter blur-[1px] animate-cloud-reverse"></div>
          </div>

          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full rounded-2.5xl"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            {/* GRADIENTS DEFINITIONS */}
            <defs>
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="islandSand" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="plainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="60%" stopColor="#166534" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
              <linearGradient id="volcanoGrad" x1="0%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
              <linearGradient id="lavaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="30%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="legoYard" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <radialGradient id="sunRay" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowPirates" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowDinos" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowPolice" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowNature" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0" />
              </radialGradient>
            </defs>

            {customMapImage ? (
              <image href={customMapImage} width="1000" height="650" preserveAspectRatio="none" />
            ) : (
              <>
                {/* OCEAN / SEA BASE */}
                <rect width="1000" height="650" fill="url(#oceanGrad)" />

                {/* DECORATIVE BACKGROUND grid pattern overlay */}
                <g opacity="0.1">
                  <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 0,400 L 1000,400 M 0,500 L 1000,500 M 0,600 L 1000,600" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 100,0 L 100,650 M 200,0 L 200,650 M 300,0 L 300,650 M 400,0 L 400,650 M 500,0 L 500,650 M 600,0 L 600,650 M 700,0 L 700,650 M 800,0 L 800,650 M 900,0 L 900,650" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
                </g>

                {/* SEAWATER WAVES CRASHINGS */}
                <path d="M 50 120 Q 80 110 110 120 M 120 420 Q 150 410 180 420 M 350 560 Q 380 550 410 560 M 800 60 Q 820 50 840 60" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

                {/* MAIN CONTINENT ISLAND MASS (Bottom & Right) */}
                <path d="M 280 650 Q 350 450 400 480 Q 480 520 540 460 Q 640 380 550 250 Q 480 150 580 80 Q 650 40 900 80 Q 1000 120 1000 650 Z" fill="url(#plainGrad)" stroke="#14532d" strokeWidth="4" />

                {/* COCONUT TROPICAL ISLAND (Bottom-Left Pirates shore) */}
            <path d="M -20 600 Q 120 480 260 520 Q 340 540 340 650 Z" fill="url(#islandSand)" stroke="#ca8a04" strokeWidth="3" />
            <path d="M 0 590 C 80 510 210 540 280 650" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="4,4" />

            {/* WINDING RIVER FROM WATERFALL */}
            <path d="M 880 75 Q 860 140 820 170 Q 780 200 760 280 Q 740 340 680 390 Q 620 440 590 530 Q 560 620 540 650" fill="none" stroke="#22d3ee" strokeWidth="28" strokeLinecap="round" />
            <path d="M 880 75 Q 860 140 820 170 Q 780 200 760 280 Q 740 340 680 390 Q 620 440 590 530 Q 560 620 540 650" fill="none" stroke="#0ea5e9" strokeWidth="20" strokeLinecap="round" />
            <path d="M 880 75 Q 860 140 820 170 Q 780 200 760 280" fill="none" stroke="#e0f2fe" strokeWidth="12" strokeLinecap="round" opacity="0.7" />

            {/* WOODEN BRIDGE ON THE RIVER */}
            <g transform="translate(620, 420) rotate(-35)">
              <rect x="-10" y="-30" width="22" height="60" fill="#78350f" rx="3" stroke="#451a03" strokeWidth="2" />
              {/* Wooden planks */}
              <line x1="-10" y1="-20" x2="12" y2="-20" stroke="#92400e" strokeWidth="3" />
              <line x1="-10" y1="-10" x2="12" y2="-10" stroke="#92400e" strokeWidth="3" />
              <line x1="-10" y1="0" x2="12" y2="0" stroke="#92400e" strokeWidth="3" />
              <line x1="-10" y1="10" x2="12" y2="10" stroke="#92400e" strokeWidth="3" />
              <line x1="-10" y1="20" x2="12" y2="20" stroke="#92400e" strokeWidth="3" />
              {/* Handrails */}
              <path d="M -10 -30 L -10 30" stroke="#451a03" strokeWidth="4" />
              <path d="M 12 -30 L 12 30" stroke="#451a03" strokeWidth="4" />
            </g>

            {/* CURVED ROAD NETWORK IN THE VILLAGE */}
            {/* Main loop */}
            <path d="M 520 650 C 480 500, 520 400, 680 320 C 780 280, 890 290, 930 400 C 960 480, 890 600, 780 620 C 650 630, 580 650, 520 650" fill="none" stroke="url(#roadGrad)" strokeWidth="32" strokeLinecap="round" />
            <path d="M 520 650 C 480 500, 520 400, 680 320 C 780 280, 890 290, 930 400 C 960 480, 890 600, 780 620 C 650 630, 580 650, 520 650" fill="none" stroke="#facc15" strokeWidth="2.5" strokeDasharray="10,12" opacity="0.8" />

            {/* Side streets to Lego Police station */}
            <path d="M 680 320 C 700 220, 740 140, 850 130" fill="none" stroke="url(#roadGrad)" strokeWidth="24" />
            <path d="M 680 320 C 700 220, 740 140, 850 130" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6,8" opacity="0.8" />


            {/* ============================================================= */}
            {/* SECTOR 1: L'ÎLE AUX PIRATES (Top-Left) */}
            {/* ============================================================= */}
            <g id="map-pirates-sector" className="transition-all duration-300">
              {/* Pirates glowing active hover halo */}
              {hoveredWorld === 'pirates' && (
                <circle cx="210" cy="190" r="140" fill="url(#glowPirates)" />
              )}

              {/* Pirate Sand Island Base */}
              <path d="M 100 240 Q 140 120 250 130 Q 320 140 330 220 Q 340 280 250 300 Q 160 320 120 280 Z" fill="url(#islandSand)" stroke="#ca8a04" strokeWidth="3.5" />
              {/* Crashing sand particles */}
              <ellipse cx="210" cy="210" rx="90" ry="70" fill="#fef08a" opacity="0.4" />

              {/* SKULL ROCK (La caverne du crâne géant) */}
              <g transform="translate(195, 155) scale(1.15)">
                <path d="M 10 35 C 10 10, 50 10, 50 35 C 50 45, 42 50, 42 55 L 18 55 C 18 50, 10 45, 10 35 Z" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
                {/* Nose cavity */}
                <polygon points="30,34 26,40 34,40" fill="#1e293b" />
                {/* Teeth cuts */}
                <line x1="23" y1="55" x2="23" y2="48" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="30" y1="55" x2="30" y2="46" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="37" y1="55" x2="37" y2="48" stroke="#1e293b" strokeWidth="2.5" />
                {/* Eye sockets */}
                <ellipse cx="22" cy="27" rx="5" ry="6" fill="#0f172a" />
                <ellipse cx="38" cy="27" rx="5" ry="6" fill="#0f172a" />
                {/* Golden glowing eye inside */}
                <circle cx="23" cy="27" r="1.5" fill="#eab308" className="animate-pulse" />
                <circle cx="37" cy="27" r="1.5" fill="#eab308" className="animate-pulse" />
              </g>

              {/* Pirates Black Flag */}
              <line x1="165" y1="140" x2="165" y2="185" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <rect x="135" y="142" width="30" height="20" fill="#0f172a" rx="2" />
              <circle cx="150" cy="151" r="3.5" fill="#ffffff" />
              <line x1="144" y1="146" x2="156" y2="156" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="156" y1="146" x2="144" y2="156" stroke="#ffffff" strokeWidth="1.2" />

              {/* FLOATING PIRATE SHIP (Navire en bois) */}
              <g transform="translate(80, 260) scale(0.95)" className="animate-bounce" style={{ animationDuration: '4s' }}>
                <path d="M 12 30 Q 30 45 60 30 L 52 14 L 18 14 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                {/* Sails */}
                <path d="M 28 14 L 28 -12 Q 18 -5 28 2 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M 45 14 L 45 -4 Q 38 4 45 10 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                <line x1="28" y1="14" x2="28" y2="-15" stroke="#451a03" strokeWidth="2.5" />
                <line x1="45" y1="14" x2="45" y2="-6" stroke="#451a03" strokeWidth="2" />
                {/* Pirate shield emblem on hull */}
                <circle cx="36" cy="26" r="3.5" fill="#fbbf24" stroke="#451a03" strokeWidth="1" />
              </g>

              {/* Golden beach Treasure Chest */}
              <g transform="translate(290, 235)">
                <rect x="0" y="5" width="22" height="15" fill="#b45309" stroke="#451a03" strokeWidth="1.5" rx="2" />
                <path d="M 0 5 Q 11 -3 22 5 Z" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />
                <rect x="9" y="4" width="4" height="6" fill="#facc15" />
              </g>
            </g>


            {/* ============================================================= */}
            {/* SECTOR 2: LA VALLÉE DES DINOS (Top-Center) */}
            {/* ============================================================= */}
            <g id="map-dino-sector">
              {/* Dinos glowing active hover halo */}
              {hoveredWorld === 'dinosaures' && (
                <circle cx="500" cy="190" r="145" fill="url(#glowDinos)" />
              )}

              {/* Prehistoric Tall Volcano */}
              <g transform="translate(485, 30)">
                {/* Volcano Mountain Base */}
                <polygon points="12,120 88,120 60,30 40,30" fill="url(#volcanoGrad)" stroke="#1c1917" strokeWidth="2.5" />
                {/* Red Lava Crater Cap */}
                <ellipse cx="50" cy="30" rx="10" ry="3.5" fill="#dc2626" />
                {/* Flowing magma lines */}
                <path d="M 46 31 Q 42 60 38 85 M 54 31 Q 58 55 64 90 M 50 32 Q 50 70 52 105" fill="none" stroke="url(#lavaGrad)" strokeWidth="4.5" strokeLinecap="round" />
                {/* Smoke clouds hovering over the volcano */}
                <circle cx="50" cy="12" r="10" fill="#475569" opacity="0.65" />
                <circle cx="62" cy="8" r="8" fill="#64748b" opacity="0.5" />
                <circle cx="38" cy="14" r="7" fill="#475569" opacity="0.4" />
              </g>

              {/* Beautiful Green Diplodocus Dino Grazing */}
              <g transform="translate(370, 150) scale(0.9)">
                {/* Tail */}
                <path d="M -10 40 Q -40 30 -50 10 Q -35 25 -10 30" fill="#10b981" />
                {/* Body */}
                <ellipse cx="20" cy="35" rx="34" ry="18" fill="#10b981" stroke="#047857" strokeWidth="2" />
                {/* Long neck */}
                <path d="M 40 28 Q 70 15 55 -25 C 50 -35, 75 -40, 70 -20 Q 55 10 40 32" fill="#10b981" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
                {/* Head */}
                <circle cx="64" cy="-30" r="7" fill="#10b981" />
                <circle cx="66" cy="-31" r="1" fill="#ffffff" />
                {/* Legs */}
                <rect x="0" y="44" width="7" height="18" fill="#047857" rx="3" />
                <rect x="14" y="48" width="7" height="16" fill="#10b981" rx="3" />
                <rect x="30" y="46" width="7" height="17" fill="#047857" rx="3" />
                <rect x="40" y="44" width="7" height="19" fill="#10b981" rx="3" />
              </g>

              {/* Prehistoric cave-man bones / fossils prints */}
              <g transform="translate(490, 200) rotate(25)" opacity="0.7">
                <line x1="0" y1="5" x2="30" y2="5" stroke="#f1f5f9" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="0" cy="2" r="3.5" fill="#f1f5f9" />
                <circle cx="0" cy="8" r="3.5" fill="#f1f5f9" />
                <circle cx="30" cy="2" r="3.5" fill="#f1f5f9" />
                <circle cx="30" cy="8" r="3.5" fill="#f1f5f9" />
              </g>

              {/* Primitve fern bush plants */}
              <path d="M 600 240 Q 590 200 570 205 M 600 240 Q 610 195 625 210 M 600 240 Q 600 180 595 190" fill="none" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
            </g>


            {/* ============================================================= */}
            {/* SECTOR 3: LE COMMISSARIAT LEGO & CITYY (Top-Right) */}
            {/* ============================================================= */}
            <g id="map-police-sector">
              {/* Lego City glowing active hover halo */}
              {hoveredWorld === 'police' && (
                <circle cx="790" cy="220" r="135" fill="url(#glowPolice)" />
              )}

              {/* Grid structured LEGO Yard Base ground */}
              <path d="M 660 120 L 890 100 L 960 280 L 730 300 Z" fill="url(#legoYard)" opacity="0.85" />

              {/* LEGO Blocks pile (bottom of the sector) */}
              <g transform="translate(720, 260)">
                {/* Yellow LEGO brick (2x2) */}
                <rect x="0" y="5" width="22" height="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" rx="1.5" />
                <circle cx="5" cy="4" r="2" fill="#ca8a04" />
                <circle cx="11" cy="4" r="2" fill="#ca8a04" />
                <circle cx="17" cy="4" r="2" fill="#ca8a04" />
                {/* Red LEGO brick (3x2) stacked */}
                <rect x="15" y="-4" width="30" height="14" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />
                <circle cx="21" cy="-5" r="2" fill="#b91c1c" />
                <circle cx="29" cy="-5" r="2" fill="#b91c1c" />
                <circle cx="37" cy="-5" r="2" fill="#b91c1c" />
              </g>

              {/* Central Police Lego Building Station */}
              <g transform="translate(790, 110)">
                {/* Blue Base blocks */}
                <rect x="-35" y="20" width="70" height="40" fill="#1e3a8a" stroke="#172554" strokeWidth="2.5" rx="2" />
                {/* White towers adjacent */}
                <rect x="-30" y="-10" width="20" height="30" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="1" />
                <rect x="10" y="-10" width="20" height="30" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="1" />
                {/* Helicopter Pad ("H" logo inside yellow circle on a base plate) */}
                <rect x="-15" y="-20" width="30" height="10" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="0" cy="-15" r="4.5" fill="#facc15" />
                <path d="M -2.5 -17.5 L -2.5 -12.5 M 2.5 -17.5 L 2.5 -12.5 M -2.5 -15 L 2.5 -15" stroke="#0f172a" strokeWidth="1.2" />

                {/* Major POLICE letters signage bar */}
                <rect x="-24" y="26" width="48" height="8" fill="#1d4ed8" rx="1" />
                <circle cx="-16" cy="30" r="1.5" fill="#eff6ff" />
                <circle cx="16" cy="30" r="1.5" fill="#eff6ff" />

                {/* Glowing police strobe signal sirens */}
                <polygon points="-12,-10 -6,-10 -9,-14" fill="#3b82f6" className="animate-pulse" />
                <polygon points="18,-10 24,-10 21,-14" fill="#3b82f6" className="animate-pulse" />
              </g>

              {/* Small Lego Cruiser police car on road */}
              <g transform="translate(860, 210) rotate(10)" className="animate-pulse">
                <rect x="0" y="4" width="34" height="15" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" rx="2" />
                <rect x="8" y="-2" width="18" height="9" fill="#eff6ff" stroke="#0f172a" strokeWidth="1.2" rx="1" />
                {/* Wheels */}
                <circle cx="8" cy="18" r="4.5" fill="#0f172a" />
                <circle cx="8" cy="18" r="2" fill="#94a3b8" />
                <circle cx="26" cy="18" r="4.5" fill="#0f172a" />
                <circle cx="26" cy="18" r="2" fill="#94a3b8" />
                {/* Blue Siren light on top */}
                <circle cx="17" cy="-4" r="2.5" fill="#3b82f6" className="animate-ping" />
                <circle cx="17" cy="-4" r="2" fill="#60a5fa" />
              </g>
            </g>


            {/* ============================================================= */}
            {/* SECTOR 4: LA FORÊT MAGIQUE (Bottom-Center/Right) */}
            {/* ============================================================= */}
            <g id="map-nature-sector">
              {/* Forest glowing active hover halo */}
              {hoveredWorld === 'nature' && (
                <circle cx="670" cy="490" r="145" fill="url(#glowNature)" />
              )}

              {/* Handcrafted staggered Forest evergreens pine trees */}
              {/* Tree 1 */}
              <g transform="translate(680, 390)">
                <polygon points="0,0 -16,30 16,30" fill="#047857" />
                <polygon points="0,15 -14,42 14,42" fill="#065f46" />
                <rect x="-3" y="42" width="6" height="10" fill="#78350f" />
              </g>
              {/* Tree 2 */}
              <g transform="translate(640, 480) scale(1.15)">
                <polygon points="0,0 -16,30 16,30" fill="#065f46" />
                <polygon points="0,15 -14,42 14,42" fill="#047857" />
                <rect x="-3" y="42" width="6" height="10" fill="#78350f" />
              </g>
              {/* Tree 3 */}
              <g transform="translate(730, 520) scale(0.9)">
                <polygon points="0,0 -16,30 16,30" fill="#047857" />
                <polygon points="0,15 -14,42 14,42" fill="#064e40" />
                <rect x="-3" y="42" width="6" height="10" fill="#78350f" />
              </g>

              {/* Cute Orange Tepee Camping Tent */}
              <g transform="translate(780, 450) scale(1.1)">
                <polygon points="18,0 0,32 36,32" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                {/* Tent door entry (slit) */}
                <polygon points="18,12 10,32 26,32" fill="#7c2d12" />
                {/* Yellow structural beams */}
                <line x1="18" y1="0" x2="18" y2="-4" stroke="#eab308" strokeWidth="2.5" />
              </g>

              {/* Glowing Campfire layout beside the tent */}
              <g transform="translate(835, 475)">
                {/* Wood logs stacked */}
                <line x1="-8" y1="6" x2="8" y2="-2" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
                <line x1="-8" y1="-2" x2="8" y2="6" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
                {/* Fire fire sparks flares */}
                <path d="M -4 2 Q 0 -14 2 -6 Q 6 -12 4 4" fill="#ef4444" opacity="0.9" />
                <path d="M 0 4 Q 2 -10 -2 -2" fill="#f59e0b" />
                {/* Fire light glow halo */}
                <circle cx="0" cy="2" r="8" fill="#fef08a" opacity="0.3" className="animate-ping" />
              </g>

              {/* SLEEPING FOX (Le renard assoupi sous l'arbre) */}
              <g transform="translate(710, 465) scale(0.95)" className="animate-pulse">
                {/* Round tail */}
                <ellipse cx="-4" cy="18" rx="8" ry="6" fill="#f97316" transform="rotate(-15 -4 18)" />
                <ellipse cx="-8" cy="17" rx="3.5" ry="3" fill="#ffffff" />
                {/* Body ball */}
                <circle cx="8" cy="16" r="10" fill="#f97316" />
                {/* White chest fluff */}
                <ellipse cx="6" cy="18" rx="6" ry="4" fill="#f1f5f9" />
                {/* Fox Ears */}
                <polygon points="11,6 14,-1 16,8" fill="#ea580c" />
                <polygon points="4,7 5,-2 9,8" fill="#ea580c" />
                {/* Head */}
                <circle cx="10" cy="10" r="6.5" fill="#f97316" />
                {/* Sleeping cute slit eyes */}
                <line x1="7" y1="10" x2="9" y2="10" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="11" y1="10" x2="13" y2="10" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
                {/* Nose tip */}
                <circle cx="10.5" cy="13.5" r="1.5" fill="#0f172a" />
              </g>
            </g>
          </>
        )}


            {/* ============================================================= */}
            {/* COMPASS ROSE & MAP LABELS & SHIP TRACK */}
            {/* ============================================================= */}
            {/* Classic compass rose on top right navy area */}
            <g transform="translate(80, 75)" className="opacity-90">
              <circle cx="0" cy="0" r="44" fill="url(#sunRay)" />
              <circle cx="0" cy="0" r="30" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeDasharray="4,6" />
              
              {/* Star points */}
              <polygon points="0,-26 -4,-4 4,-4" fill="#ef4444" /> {/* North (Red) */}
              <polygon points="0,26 -4,4 4,4" fill="#cbd5e1" />   {/* South */}
              <polygon points="-26,0 -4,-4 -4,4" fill="#cbd5e1" /> {/* West */}
              <polygon points="26,0 4,-4 4,4" fill="#cbd5e1" />   {/* East */}
              <polygon points="-16,-16 0,-4 -4,0" fill="#94a3b8" />
              <polygon points="16,-16 0,-4 4,0" fill="#94a3b8" />
              
              <circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#f8fafc" strokeWidth="1.5" />
              
              {/* North label */}
              <text x="0" y="-32" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="extrabold" fontFamily="sans-serif">N</text>
              <text x="32" y="4" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold" fontFamily="sans-serif">E</text>
              <text x="-32" y="4" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold" fontFamily="sans-serif">O</text>
              <text x="0" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold" fontFamily="sans-serif">S</text>
            </g>

            {/* A sea monster tail peaking from bottom left corner */}
            <g transform="translate(430, 100)" opacity="0.3" className="animate-bounce">
              <path d="M 0 10 Q 15 0 25 20 Q 35 40 50 30" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
            </g>


            {/* ============================================================= */}
            {/* INTERACTIVE OVERLAYS (Invisible buttons and visible pointers) */}
            {/* ============================================================= */}
            {worlds.map((w) => {
              const completedCount = w.tasks.filter(t => completedGames[t]).length;
              const totalTasksCount = w.tasks.length;
              const allCleared = completedCount === totalTasksCount;
              const isHovered = hoveredWorld === w.id;

              return (
                <g
                  key={w.id}
                  className="cursor-pointer group select-none"
                  onClick={() => {
                    playClickSound();
                    onSelectWorld(w.id);
                  }}
                  onMouseEnter={() => setHoveredWorld(w.id)}
                  onMouseLeave={() => setHoveredWorld(null)}
                >
                  {/* Invisible broad mouse click catcher circle */}
                  <circle
                    cx={w.coords.x}
                    cy={w.coords.y}
                    r="90"
                    fill="transparent"
                  />

                  {/* PULSING TARGET ANCHOR PIN */}
                  <g transform={`translate(${w.coords.x}, ${w.coords.y})`}>
                    {/* Ring animation */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered ? "36" : "26"}
                      fill="none"
                      stroke={w.colorHex}
                      strokeWidth="3.5"
                      strokeDasharray="4,2"
                      className="animate-spin"
                      style={{ animationDuration: '15s' }}
                    />
                    
                    {/* Glowing background container */}
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="#0f172a"
                      stroke={w.colorHex}
                      strokeWidth="3"
                      className="shadow-2xl filter drop-shadow"
                    />

                    {/* Emoji display */}
                    <text
                      x="0"
                      y="7"
                      textAnchor="middle"
                      className="text-2xl select-none"
                    >
                      {w.emoji}
                    </text>

                    {/* Bouncing Map PIN icon directly above */}
                    <g transform="translate(0, -32)" className="animate-bounce" style={{ animationDuration: isHovered ? '0.8s' : '2s' }}>
                      <path d="M -8 -13 C -8 -22, 8 -22, 8 -13 C 8 -5, 0 0, 0 0 C 0 0, -8 -5, -8 -13 Z" fill={w.colorHex} stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="0" cy="-13" r="3.5" fill="#ffffff" />
                    </g>
                  </g>

                  {/* BEAUTIFUL POPUP INFO CARD FOR PROGRESSION */}
                  <g
                    transform={`translate(${w.coords.x}, ${w.coords.y + 44})`}
                    className="transition-all duration-300 pointer-events-none"
                  >
                    {/* Background Plate */}
                    <rect
                      x="-85"
                      y="-4"
                      width="170"
                      height="35"
                      rx="14"
                      fill="#0b1329"
                      stroke={isHovered ? w.colorHex : "#334155"}
                      strokeWidth={isHovered ? "2.5" : "1.5"}
                      className="filter drop-shadow-lg"
                    />

                    {/* Title */}
                    <text
                      x="0"
                      y="11"
                      fill="#f8fafc"
                      fontSize="10"
                      fontWeight="black"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {w.title.toUpperCase()}
                    </text>

                    {/* Progress details */}
                    <text
                      x="0"
                      y="23"
                      fill={allCleared ? "#22c55e" : "#cbd5e1"}
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {allCleared ? `🏆 ${w.badge.toUpperCase()}` : `Progression: ${completedCount} / ${totalTasksCount}`}
                    </text>

                    {/* Completed Gold icon mini crown */}
                    {allCleared && (
                      <circle cx="70" cy="12" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1" className="animate-bounce" />
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Trophy / Badges Chest showcase display */}
      <div className="w-full max-w-5xl text-left bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-8 px-5">
        <h2 className="text-xs sm:text-sm font-sans font-bold text-slate-100 flex items-center gap-2 mb-1.5 select-none uppercase tracking-wider">
          <Trophy size={16} className="text-amber-500" />
          <span>🏆 COFFRE DES BADGES D'HONNEUR DE JULES :</span>
        </h2>
        <p className="text-[11px] text-slate-400 mb-5 font-sans">
          Arrive au bout de toutes les épreuves d'une région sur la carte pour débloquer sa médaille d'or spéciale !
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {worlds.map((w) => {
            const hasBadge = w.tasks.every(t => completedGames[t]);

            return (
              <div
                id={`badge-plate-${w.id}`}
                key={w.id}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition ${
                  hasBadge
                    ? 'bg-slate-900/90 border-amber-500/50 scale-100 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-900 opacity-40 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2.5xl mb-2 shadow-inner ${
                  hasBadge ? 'bg-gradient-to-br from-amber-400 to-yellow-600 animate-bounce' : 'bg-slate-900'
                }`}>
                  {hasBadge ? w.badgeIcon : '🔒'}
                </div>
                <h4 className="font-sans font-bold text-xs text-white truncate max-w-full">
                  {w.badge}
                </h4>
                <span className="text-[9px] font-mono text-[#10b981] mt-1 uppercase tracking-wide">
                  {hasBadge ? 'Médaille Obtenue !' : 'Monde à explorer'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety settings: reset progress */}
      <div className="w-full max-w-5xl flex justify-center py-4 border-t border-slate-800/60">
        {!showResetConfirm ? (
          <button
            id="btn-prompt-reset-progress"
            onClick={() => { playClickSound(); setShowResetConfirm(true); }}
            className="text-slate-500 hover:text-slate-400 text-xs font-mono transition cursor-pointer"
          >
            ⚠️ EFFACER LES ÉTOILES ET RECOMMENCER L'ÉCOLE
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-red-950/20 px-4 py-2 rounded-xl border border-red-500/20">
            <span className="text-slate-200 text-xs font-sans">Voulez-vous réinitialiser toutes vos étoiles ?</span>
            <button
              id="btn-confirm-reset"
              onClick={() => {
                playClickSound();
                onResetProgress();
                setShowResetConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-sans font-bold text-[10px] py-1 px-2.5 rounded cursor-pointer"
            >
              OUI, EFFACER
            </button>
            <button
              id="btn-cancel-reset"
              onClick={() => { playClickSound(); setShowResetConfirm(false); }}
              className="text-slate-400 hover:text-white text-[10px] font-sans underline cursor-pointer"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

