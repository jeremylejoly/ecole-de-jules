import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Play, RotateCcw, ArrowLeft, Plus, Minus, Search, Sparkles, Navigation } from 'lucide-react';
import { playCorrectSound, playErrorSound, playLegoClick, playPoliceSiren, playClickSound } from '../utils/audio';

interface PoliceLegoGamesProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onCompleteGame: (gameId: string) => void;
}

export default function PoliceLegoGames({ onBack, onAddStars, onCompleteGame }: PoliceLegoGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'lego_symmetry',
      title: 'Le Miroir de Briques',
      descr: 'Observe le dessin de gauche et complète sa symétrie parfaite à droite de l\'axe rose !',
      emoji: '🪞',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'police_detective',
      title: 'Détective Police',
      descr: 'Observe bien le plan et retrouve les 5 objets cachés dans le commissariat en Légos !',
      emoji: '🔍',
      color: 'from-yellow-500 to-amber-600',
    },
    {
      id: 'police_maze',
      title: 'Le Labyrinthe du Voleur',
      descr: 'Programme les déplacements de la voiture de police pour rattraper le voleur !',
      emoji: '🚓',
      color: 'from-slate-600 to-slate-800',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-4xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                id="btn-police-back-lobby"
                onClick={() => { playClickSound(); onBack(); }}
                className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-white py-2 px-4 rounded-full font-sans font-medium text-sm transition shadow-md touch-manipulation cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Retour au Village</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-mono bg-blue-500/20 text-blue-300 py-1 px-3 rounded-full border border-blue-500/30">
                  🚨 BRIGADE LEGO POLICE
                </span>
              </div>
            </div>

            {/* Hub Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none select-none text-9xl">
                👮‍♂️
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight mb-2 flex items-center gap-3">
                <span>Lego Police Station</span>
                <span className="text-2xl sm:text-3xl">🚓</span>
              </h1>
              <p className="text-blue-100 max-w-xl text-sm sm:text-base font-sans">
                Deviens le capitaine d'enquête ! Réalise des exercices de poids logiques, programme des trajets de poursuite et cherche les indices volés !
              </p>
            </div>

            {/* List of activities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {games.map((game) => (
                <button
                  id={`btn-start-${game.id}`}
                  key={game.id}
                  onClick={() => { playClickSound(); setActiveGame(game.id); }}
                  className="group flex flex-col text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl p-6 transition duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] outline-none cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110`}>
                    {game.emoji}
                  </div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4 flex-grow">
                    {game.descr}
                  </p>
                  <span className="flex items-center gap-2 text-blue-400 font-sans font-semibold text-xs mt-auto">
                    <Play size={12} fill="currentColor" />
                    Rejoindre l'enquête
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-session"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-4xl bg-slate-800/90 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl relative"
          >
            {/* Session Topbar */}
            <div className="flex justify-between items-center mb-6">
              <button
                id="btn-exit-game-police"
                onClick={() => { playClickSound(); setActiveGame(null); }}
                className="flex items-center gap-1.5 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quitter l'enquête</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">👮‍♂️</span>
                <span className="text-white font-sans font-bold text-sm">
                  {games.find((g) => g.id === activeGame)?.title}
                </span>
              </div>
            </div>

            {/* Core game component */}
            {activeGame === 'lego_symmetry' && (
              <LegoSymmetryGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('lego_symmetry');
                }}
              />
            )}
            {activeGame === 'police_detective' && (
              <PoliceDetectiveGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('police_detective');
                }}
              />
            )}
            {activeGame === 'police_maze' && (
              <PoliceMazeGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('police_maze');
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- GAME 7: LE MIROIR DE BRIQUES (Tactile Grid Symmetry Matcher) -----------------
interface SymmetryLevel {
  title: string;
  hint: string;
  leftLines: [ [number, number], [number, number] ][]; // arrays of [from, to] coordinates
  rightTargets: [number, number][]; // coordinates the child needs to click on the right representation
}

function LegoSymmetryGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(0); // 0 to 2
  const [activeRightCoords, setActiveRightCoords] = useState<string[]>([]); // "x,y" string array
  const [isDone, setIsDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');

  const levels: SymmetryLevel[] = [
    {
      title: "La Flèche Magique",
      hint: "Touche le point doré pour compléter la flèche !",
      leftLines: [
        [[5, 1], [2, 35]], // (x, y) where y can be scaled
        [[2, 3.5], [5, 6]],
      ],
      rightTargets: [
        [8, 3.5], // reflected of [2, 3.5]
      ],
    },
    {
      title: "La Couronne Royale",
      hint: "Touche les deux points dorés pour compléter la couronne !",
      leftLines: [
        [[5, 1.5], [2, 3.5]],
        [[2, 3.5], [4, 5]],
        [[4, 5], [5, 4]],
      ],
      rightTargets: [
        [8, 3.5], // reflected of [2, 3.5]
        [6, 5],   // reflected of [4, 5]
      ],
    },
    {
      title: "Le Joyau Secret",
      hint: "Touche les trois points dorés pour fermer le joyau !",
      leftLines: [
        [[5, 1.5], [2, 1.5]],
        [[2, 1.5], [0.5, 3.5]],
        [[0.5, 3.5], [2, 5.5]],
        [[2, 5.5], [5, 5.5]],
      ],
      rightTargets: [
        [8, 1.5],   // reflected of [2, 1.5]
        [9.5, 3.5], // reflected of [0.5, 3.5]
        [8, 5.5],   // reflected of [2, 5.5]
      ],
    },
  ];

  const currentLevelData = levels[level];

  useEffect(() => {
    setActiveRightCoords([]);
    setIsDone(false);
    setMessage(currentLevelData.hint);
    
    // Auto-narrate the instructions to the child
    speakText(currentLevelData.hint);
  }, [level]);

  // Voice synthesis helper
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis blocked or unsupported", e);
    }
  };

  const handleNodeClick = (x: number, y: number, isTarget: boolean) => {
    if (isDone) return;

    if (!isTarget) {
      // Wrong node tapped
      playErrorSound();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage("Oups ! Essaie de toucher le point tout jaune doré ! ✨");
      speakText("Touche le point tout jaune doré !");
      return;
    }

    const coordStr = `${x},${y}`;
    if (activeRightCoords.includes(coordStr)) {
      // already active, ignore or deactivate
      return;
    }

    // Correct target tapped!
    playLegoClick();
    const updated = [...activeRightCoords, coordStr];
    setActiveRightCoords(updated);

    // Check if level solved
    const allSolved = currentLevelData.rightTargets.every(([tx, ty]) =>
      updated.includes(`${tx},${ty}`)
    );

    if (allSolved) {
      playCorrectSound();
      setMessage("🌟 Magnifique ! C'est parfaitement symétrique !");
      speakText("Magnifique ! C'est gagné !");
      if (level < 2) {
        setTimeout(() => {
          setLevel((prev) => prev + 1);
        }, 1600);
      } else {
        setIsDone(true);
        setTimeout(() => {
          onWin();
        }, 1200);
      }
    }
  };

  // Convert leftLines to mirror lines drawn on the right if target is activated
  const getRightLinesToDraw = (): [ [number, number], [number, number] ][ ] => {
    // For each left line, map to right side
    return currentLevelData.leftLines.map(([fromNode, toNode]) => {
      const rxFrom = 10 - fromNode[0];
      const ryFrom = fromNode[1];
      const rxTo = 10 - toNode[0];
      const ryTo = toNode[1];

      // We should only draw this right line once both endpoints are satisfied or if it connects to the axis
      // Let's check if the non-axis endpoints are activated by the user
      const isFromOnAxis = fromNode[0] === 5;
      const isToOnAxis = toNode[0] === 5;

      const isFromActive = isFromOnAxis || activeRightCoords.includes(`${rxFrom},${ryFrom}`);
      const isToActive = isToOnAxis || activeRightCoords.includes(`${rxTo},${ryTo}`);

      if (isFromActive && isToActive) {
        return [[rxFrom, ryFrom], [rxTo, ryTo]];
      }
      return null;
    }).filter(Boolean) as [ [number, number], [number, number] ][];
  };

  const rightLines = getRightLinesToDraw();

  return (
    <div className="flex flex-col items-center select-none">
      {/* Title */}
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🪞 Le Miroir de Briques
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Observe le dessin à gauche de la ligne rose. Touche les ronds orange pour dessiner le même de l'autre côté !
        </p>
      </div>

      {/* Level indicators */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((lv) => (
          <div
            key={lv}
            className={`w-12 h-2.5 rounded-full ${
              level > lv ? 'bg-indigo-500' : level === lv ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Voice speaker bubble */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-3 rounded-2xl flex items-center gap-3 mb-5 shadow-lg">
        <button
          id="btn-symmetry-voice-replay"
          onClick={() => speakText(message)}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow active:scale-95"
          title="Réécouter la consigne voisée"
        >
          🔊
        </button>
        <p className="text-xs sm:text-sm font-bold text-[#a5b4fc] text-left leading-tight">
          {message}
        </p>
      </div>

      {/* Notebook Graph Grid */}
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-72 h-72 sm:w-80 sm:h-80 bg-slate-950 border-4 border-slate-700 rounded-3xl p-2 sm:p-4 overflow-hidden shadow-2xl"
      >
        {/* Sky blue grid lines */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-7 pointer-events-none opacity-40">
          {Array.from({ length: 11 }).map((_, cIdx) => (
            <div key={`col-${cIdx}`} className="border-r border-[#60a5fa]/40 h-full" style={{ gridColumnStart: cIdx + 1 }} />
          ))}
          {Array.from({ length: 8 }).map((_, rIdx) => (
            <div key={`row-${rIdx}`} className="border-b border-[#60a5fa]/40 w-full" style={{ gridRowStart: rIdx + 1 }} />
          ))}
        </div>

        {/* Vertical Symmetry Axis (The Pink Line in the middle) */}
        <div className="absolute left-[50%] top-0 bottom-0 w-[5px] bg-[#fb7185] pointer-events-none z-10" />

        {/* Left Side "Locked / Cadenas" text watermarked (like screenshot) */}
        <div className="absolute left-2 top-2 bg-slate-900/80 rounded-xl px-2 py-1 text-[10px] text-slate-400 border border-slate-800 pointer-events-none flex items-center gap-1">
          🔒 Verrouillé
        </div>

        {/* SVG Wrapper to draw black and colored construction line segments */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {/* 1. Draw LEFT solid black original lines */}
          {currentLevelData.leftLines.map(([fromNode, toNode], idx) => {
            // map 0..10 horizontally, and 0..7 vertically to % coordinates on canvas
            const x1 = `${fromNode[0] * 10}%`;
            const y1 = `${fromNode[1] * (100/7)}%`;
            const x2 = `${toNode[0] * 10}%`;
            const y2 = `${toNode[1] * (100/7)}%`;

            return (
              <line
                key={`left-line-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#020617"
                strokeWidth="5"
                strokeLinecap="round"
                className="drop-shadow-md"
              />
            );
          })}

          {/* 2. Draw RIGHT mirrored completed lines (bright golden/yellow representation) */}
          {rightLines.map(([fromNode, toNode], idx) => {
            const x1 = `${fromNode[0] * 10}%`;
            const y1 = `${fromNode[1] * (100/7)}%`;
            const x2 = `${toNode[0] * 10}%`;
            const y2 = `${toNode[1] * (100/7)}%`;

            return (
              <line
                key={`right-line-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#eab308"
                strokeWidth="5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]"
              />
            );
          })}
        </svg>

        {/* Clickable node buttons overlays on intersections */}
        {/* We place interactive dots on target coordinates on the right part (X coordinate > 5) */}
        {/* And also a few distraction/incorrect dots so they can learn */}
        {Array.from({ length: 11 }).map((_, cIdx) => 
          Array.from({ length: 8 }).map((_, rIdx) => {
            // Avoid placing interactable buttons on the left side or directly on axis
            if (cIdx <= 5) return null;

            // Check if is a correct point on target symmetry layout
            const isTarget = currentLevelData.rightTargets.some(([tx, ty]) => tx === cIdx && ty === rIdx);
            const isActivated = activeRightCoords.includes(`${cIdx},${rIdx}`);

            // Let's also display translucent dots ONLY for coordinates that are on the grid so the kid can click easily
            // We want dots only at a few key coordinates to not clutter the screen, especially the targets + some nearby distractors
            const isDistraction = !isTarget && (
              (cIdx === 7 && rIdx === 1.5) ||
              (cIdx === 9 && rIdx === 3.5) ||
              (cIdx === 6 && rIdx === 3.5) ||
              (cIdx === 8 && rIdx === 5.5) ||
              (cIdx === 7 && rIdx === 5)
            );

            if (!isTarget && !isDistraction) return null;

            return (
              <button
                id={`grid-node-${cIdx}-${rIdx}`}
                key={`node-${cIdx}-${rIdx}`}
                onClick={() => handleNodeClick(cIdx, rIdx, isTarget)}
                style={{
                  left: `${cIdx * 10}%`,
                  top: `${rIdx * (100 / 7)}%`,
                }}
                className={`absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center transition focus:outline-none cursor-pointer ${
                  isActivated
                    ? 'bg-amber-500 border-2 border-white scale-110 shadow-lg glow ring-4 ring-yellow-400/30'
                    : isTarget
                    ? 'bg-amber-400/80 animate-pulse border-2 border-dashed border-amber-300 scale-100 hover:scale-110 shadow'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-750 opacity-20'
                }`}
              >
                {isActivated ? (
                  <span className="text-xs">🌟</span>
                ) : isTarget ? (
                  <span className="w-2.5 h-2.5 bg-amber-300 rounded-full" />
                ) : null}
              </button>
            );
          })
        )}
      </motion.div>

      {/* Clear/Restart buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          id="btn-symmetry-restart"
          onClick={() => {
            setActiveRightCoords([]);
            setMessage(currentLevelData.hint);
          }}
          className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-sans font-bold py-2.5 px-6 rounded-2xl text-xs border border-slate-700 cursor-pointer"
        >
          🧹 Recommencer le miroir
        </button>
      </div>
    </div>
  );
}

// ----------------- GAME 8: DETECTIVE POLICE (Cherche et Trouve) -----------------
interface SeekItem {
  id: string;
  emoji: string;
  name: string;
  x: number; // percentage left 0-95
  y: number; // percentage top 0-90
  isFound: boolean;
}

const ALL_DETECTIVE_SCENARIOS = [
  // Level 1 items
  [
    { id: 'item1', emoji: '🍩', name: 'Le Donut Rond', x: 22, y: 35, isFound: false },
    { id: 'item2', emoji: '🔑', name: 'La Clef d\'or', x: 84, y: 15, isFound: false },
    { id: 'item3', emoji: '🐶', name: 'Le Chiot Police', x: 45, y: 72, isFound: false },
    { id: 'item4', emoji: '📻', name: 'Le Talkie-Walkie', x: 62, y: 44, isFound: false },
    { id: 'item5', emoji: '🕵️', name: 'Le Chapeau Detective', x: 12, y: 81, isFound: false },
  ],
  // Level 2 items
  [
    { id: 'item6', emoji: '🥐', name: 'La Chocolatine', x: 74, y: 62, isFound: false },
    { id: 'item7', emoji: '🔦', name: 'La Lampe torche', x: 15, y: 22, isFound: false },
    { id: 'item8', emoji: '🐱', name: 'Le Chat Noir', x: 50, y: 38, isFound: false },
    { id: 'item9', emoji: '🧭', name: 'La Boussole Légos', x: 88, y: 75, isFound: false },
    { id: 'item10', emoji: '💵', name: 'Le Billet Volé', x: 34, y: 12, isFound: false },
  ],
];

// Noise decors (elements scattered to distract child)
const NOISE_DECORS = [
  { id: 'noise1', emoji: '🚓', x: 10, y: 10 },
  { id: 'noise2', emoji: '👮', x: 70, y: 20 },
  { id: 'noise3', emoji: '🪜', x: 40, y: 15 },
  { id: 'noise4', emoji: '📦', x: 80, y: 55 },
  { id: 'noise5', emoji: '🧱', x: 30, y: 45 },
  { id: 'noise6', emoji: '🚲', x: 92, y: 33 },
  { id: 'noise7', emoji: '🏙️', x: 5, y: 60 },
  { id: 'noise8', emoji: '🚥', x: 58, y: 10 },
  { id: 'noise9', emoji: '🚨', x: 78, y: 90 },
  { id: 'noise10', emoji: '🛹', x: 25, y: 65 },
  { id: 'noise11', emoji: '🍕', x: 91, y: 11 },
  { id: 'noise12', emoji: '🥛', x: 48, y: 88 }
];

function PoliceDetectiveGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(0); // 0 or 1
  const [seekTargets, setSeekTargets] = useState<SeekItem[]>([]);
  const [complete, setComplete] = useState(false);

  const startLevel = () => {
    setComplete(false);
    const setList = JSON.parse(JSON.stringify(ALL_DETECTIVE_SCENARIOS[level])) as SeekItem[];
    setSeekTargets(setList);
  };

  useEffect(() => {
    startLevel();
  }, [level]);

  const handleTargetClick = (targetId: string) => {
    playLegoClick();
    setSeekTargets((prev) => {
      const updated = prev.map((tg) => (tg.id === targetId ? { ...tg, isFound: true } : tg));
      const allFound = updated.every((tg) => tg.isFound);
      if (allFound) {
        playPoliceSiren();
        if (level < 1) {
          setTimeout(() => {
            setLevel(1);
          }, 1800);
        } else {
          setComplete(true);
          playCorrectSound();
          onWin();
        }
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🔍 Cherche et Trouve Légo police
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Cinq petits objets ou indices ont été égarés dans la station de Légos ! Inspecte le plan et touche-les pour les retrouver !
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2 mb-4">
        {[0, 1].map((lv) => (
          <div
            key={lv}
            className={`w-12 h-2.5 rounded-full ${
              level > lv ? 'bg-yellow-500' : level === lv ? 'bg-yellow-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Checklist Sideboard */}
      <div className="w-full max-w-xl bg-slate-950 p-4 border border-slate-800 rounded-2xl mb-6 shadow-inner flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs font-bold text-yellow-500 uppercase font-mono tracking-wider w-full flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
          <Search size={12} /> Target Box Checklist :
        </div>
        <div className="grid grid-cols-5 gap-2 w-full">
          {seekTargets.map((tg) => (
            <div
              id={`checklist-item-${tg.id}`}
              key={tg.id}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center relative ${
                tg.isFound
                  ? 'bg-emerald-950/40 border-emerald-500/50 opacity-40'
                  : 'bg-slate-900 border-slate-800 hover:shadow shadow-md'
              }`}
            >
              <span className="text-2xl mb-1 select-none">{tg.emoji}</span>
              <span className="text-[9px] text-slate-300 font-sans truncate w-full">{tg.name.split(' ')[1]}</span>
              {tg.isFound && (
                <div className="absolute inset-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <span className="bg-emerald-500 text-white rounded-full p-0.5 text-[8px] font-bold">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* THE SEARCHING CANVAS GRID */}
      <div className="relative w-full max-w-xl aspect-[16/10] bg-slate-900 border-4 border-slate-700 rounded-3xl overflow-hidden shadow-2xl select-none min-h-[220px]">
        {/* Background landscape sketch representing lego baseplate */}
        <div className="absolute inset-0 bg-gradient-to-lg from-blue-950 via-slate-900 to-indigo-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Scattered Noise Elements */}
        {NOISE_DECORS.map((dec) => (
          <div
            id={`noise-decor-${dec.id}`}
            key={dec.id}
            className="absolute text-2xl sm:text-3xl pointer-events-none select-none select-none opacity-20 filter blur-[0.4px]"
            style={{ left: `${dec.x}%`, top: `${dec.y}%` }}
          >
            {dec.emoji}
          </div>
        ))}

        {/* TARGET CLUES TO CLIK */}
        {seekTargets.map((target) => (
          <button
            id={`canvas-target-${target.id}`}
            key={target.id}
            disabled={target.isFound}
            onClick={() => handleTargetClick(target.id)}
            className={`absolute flex items-center justify-center w-12 h-12 rounded-full border transition transform active:scale-90 hover:scale-[1.15] select-none text-3xl outline-none touch-manipulation cursor-pointer ${
              target.isFound
                ? 'opacity-0 scale-0 pointer-events-none'
                : 'bg-slate-800/10 hover:bg-white/10 border-transparent hover:border-yellow-400/40'
            }`}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          >
            <span>{target.emoji}</span>
          </button>
        ))}

        {complete && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
            <span className="text-5xl mb-2 animate-bounce">🚨👮‍♂️</span>
            <p className="text-xl font-bold font-sans text-yellow-400">Excellent Travail Détective !</p>
            <p className="text-xs text-slate-300 mt-1 max-w-sm">Tu as résolu l'affaire et mis à l'abri tous les objets Légos !</p>
          </div>
        )}
      </div>

      <p className="text-[10px] font-mono text-slate-400 mt-2">
        💡 Conseil : Regarde bien dans les coins de la grille et tape sur l'objet dès que tu le reconnais !
      </p>

      {complete && (
        <div className="mt-6">
          <button
            id="btn-detective-scramble"
            onClick={() => { setLevel(0); startLevel(); }}
            className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Chercher d'autres objets</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------- GAME 9: LE LABYRINTHE DU VOLEUR (Pathfinding Coding / Logic) -----------------
type Direction = 'N' | 'S' | 'E' | 'O';

function PoliceMazeGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(0); // 0, 1
  const [carPos, setCarPos] = useState({ x: 0, y: 3 });
  const [thiefPos, setThiefPos] = useState({ x: 3, y: 0 });
  const [commandQueue, setCommandQueue] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [levelGrid, setLevelGrid] = useState<number[][]>([]); // 4x4 coordinate grids (0=road, 1=lego block obstable)
  const [isDone, setIsDone] = useState(false);
  const [currentCarHeading, setCurrentCarHeading] = useState<Direction>('N');

  const setupLevel = () => {
    setIsRunning(false);
    setIsDone(false);
    setCommandQueue([]);
    // Setup grid: 0 (street), 1 (brick obstacle blocker)
    if (level === 0) {
      setCarPos({ x: 0, y: 3 });
      setThiefPos({ x: 3, y: 0 });
      setLevelGrid([
        [0, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 0, 0, 0],
        [0, 1, 1, 1],
      ]);
      setCurrentCarHeading('E');
    } else {
      setCarPos({ x: 0, y: 3 });
      setThiefPos({ x: 2, y: 1 });
      setLevelGrid([
        [0, 0, 0, 1],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
      ]);
      setCurrentCarHeading('N');
    }
  };

  useEffect(() => {
    setupLevel();
  }, [level]);

  const addCommand = (cmd: string) => {
    if (commandQueue.length >= 6 || isRunning) return;
    playLegoClick();
    setCommandQueue((prev) => [...prev, cmd]);
  };

  const popCommand = () => {
    if (isRunning) return;
    playLegoClick();
    setCommandQueue((prev) => prev.slice(0, -1));
  };

  const handleRunCode = async () => {
    if (commandQueue.length === 0 || isRunning) return;
    setIsRunning(true);
    playPoliceSiren();

    // Copy initial positions to simulate
    let tempX = carPos.x;
    let tempY = carPos.y;

    for (let c = 0; c < commandQueue.length; c++) {
      const cmd = commandQueue[c];
      await new Promise((r) => setTimeout(r, 650));

      if (cmd === 'UP') {
        tempY -= 1;
      } else if (cmd === 'DOWN') {
        tempY += 1;
      } else if (cmd === 'RIGHT') {
        tempX += 1;
      } else if (cmd === 'LEFT') {
        tempX -= 1;
      }

      // Check bounds or crash into blocks
      if (
        tempX < 0 ||
        tempX > 3 ||
        tempY < 0 ||
        tempY > 3 ||
        levelGrid[tempY][tempX] === 1
      ) {
        // Crash ! Stop simulation
        playErrorSound();
        setIsRunning(false);
        setupLevel();
        return;
      }

      setCarPos({ x: tempX, y: tempY });

      // Check thief capture
      if (tempX === thiefPos.x && tempY === thiefPos.y) {
        playPoliceSiren();
        playCorrectSound();
        if (level < 1) {
          setTimeout(() => {
            setLevel(1);
          }, 1500);
        } else {
          setIsDone(true);
          onWin();
        }
        setIsRunning(false);
        return;
      }
    }

    // Finished running commands but no win
    playErrorSound();
    setIsRunning(false);
    setTimeout(() => {
      setupLevel();
    }, 800);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🚓 Le Labyrinthe du Voleur
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Enregistre les instructions pour faire rouler le camion de police jusqu'au voleur ! Évite les barricades Légos en brique !
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {[0, 1].map((lv) => (
          <div
            key={lv}
            className={`w-12 h-2.5 rounded-full ${
              level > lv ? 'bg-slate-500' : level === lv ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl bg-slate-900/50 p-6 rounded-3xl border border-slate-700">
        
        {/* GRAPHIC STREET MATRIX GRID */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-4 gap-2.5 bg-slate-950 p-4 border-2 border-slate-800 rounded-2xl w-full aspect-square max-w-[240px]">
            {Array.from({ length: 4 }).map((_, y) =>
              Array.from({ length: 4 }).map((_, x) => {
                const isCar = carPos.x === x && carPos.y === y;
                const isThief = thiefPos.x === x && thiefPos.y === y;
                const isBlock = levelGrid[y] && levelGrid[y][x] === 1;

                return (
                  <div
                    id={`grid-cell-${y}-${x}`}
                    key={`${y}-${x}`}
                    className={`aspect-square rounded-xl shadow-inner flex items-center justify-center text-3xl font-bold transition select-none ${
                      isBlock
                        ? 'bg-red-500 border border-red-400'
                        : isCar
                        ? 'bg-blue-600 ring-2 ring-white scale-102 font-serif'
                        : isThief
                        ? 'bg-amber-500 ring-2 ring-yellow-400 scale-102'
                        : 'bg-slate-850 border border-slate-800'
                    }`}
                  >
                    {isCar ? '🚓' : isThief ? '🏃‍♂️' : isBlock ? '🧱' : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CONTROLLER MODULE */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">
              PROGRAMME DE ROUTE (Max : 6)
            </span>
            {/* Visual command stack queue list */}
            <div className="flex gap-1.5 h-12 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 mt-2 mb-4 overflow-x-auto min-h-[48px] items-center">
              {commandQueue.length === 0 && (
                <span className="text-[10px] text-slate-500 italic">Vide ! Clique sur les briques flèches...</span>
              )}
              {commandQueue.map((cmd, idx) => (
                <div
                  id={`queue-cmd-${idx}`}
                  key={idx}
                  className="bg-blue-500 text-white font-sans font-bold text-xs p-1.5 px-2.5 rounded shadow-md border border-blue-400 flex items-center"
                >
                  {cmd === 'UP' && '⬆️'}
                  {cmd === 'DOWN' && '⬇️'}
                  {cmd === 'LEFT' && '⬅️'}
                  {cmd === 'RIGHT' && '➡️'}
                </div>
              ))}
            </div>

            {/* Input Action Controls */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                id="btn-add-cmd-up"
                disabled={isRunning}
                onClick={() => addCommand('UP')}
                className="h-12 bg-slate-800 hover:bg-slate-755 disabled:opacity-40 rounded-xl border border-slate-700 text-lg flex items-center justify-center cursor-pointer"
                title="Monter"
              >
                ⬆️
              </button>
              <button
                id="btn-add-cmd-down"
                disabled={isRunning}
                onClick={() => addCommand('DOWN')}
                className="h-12 bg-slate-800 hover:bg-slate-755 disabled:opacity-40 rounded-xl border border-slate-700 text-lg flex items-center justify-center cursor-pointer"
                title="Descendre"
              >
                ⬇️
              </button>
              <button
                id="btn-add-cmd-left"
                disabled={isRunning}
                onClick={() => addCommand('LEFT')}
                className="h-12 bg-slate-800 hover:bg-slate-755 disabled:opacity-40 rounded-xl border border-slate-700 text-lg flex items-center justify-center cursor-pointer"
                title="Tourner Gauche"
              >
                ⬅️
              </button>
              <button
                id="btn-add-cmd-right"
                disabled={isRunning}
                onClick={() => addCommand('RIGHT')}
                className="h-12 bg-slate-800 hover:bg-slate-755 disabled:opacity-40 rounded-xl border border-slate-700 text-lg flex items-center justify-center cursor-pointer"
                title="Tourner Droite"
              >
                ➡️
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="btn-clear-commands"
              disabled={commandQueue.length === 0 || isRunning}
              onClick={popCommand}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Effacer Dernier
            </button>
            <button
              id="btn-run-commands"
              disabled={commandQueue.length === 0 || isRunning}
              onClick={handleRunCode}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 text-xs font-extrabold rounded-xl transition shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <Navigation size={12} fill="currentColor" />
              Lancer 🚨
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          id="btn-maze-reset"
          onClick={setupLevel}
          className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Réinitialiser</span>
        </button>
      </div>
    </div>
  );
}
