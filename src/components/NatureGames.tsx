import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, RotateCcw, Volume2, TreePine, Sparkles, Check } from 'lucide-react';
import { playCorrectSound, playErrorSound, playNatureChirp, playForestNote, playClickSound } from '../utils/audio';

interface NatureGamesProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onCompleteGame: (gameId: string) => void;
}

export default function NatureGames({ onBack, onAddStars, onCompleteGame }: NatureGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'nature_shadow',
      title: 'L\'Herbier Magique',
      descr: 'Associe chaque feuille ou fleur à son ombre !',
      emoji: '🍁',
      color: 'from-orange-400 to-amber-600',
    },
    {
      id: 'nature_audio',
      title: 'Symphonie Forestière',
      descr: 'Écoute la chanson des animaux et rejoue les notes !',
      emoji: '🦉',
      color: 'from-green-600 to-teal-700',
    },
    {
      id: 'nature_darts',
      title: 'Le Tir aux Fléchettes',
      descr: 'Vise la cible et fais le compte demandé !',
      emoji: '🎯',
      color: 'from-rose-500 to-amber-500',
    },
    {
      id: 'nature_fox',
      title: 'Le Renard au Terrier',
      descr: 'Guide le renard pas à pas sur le quadrillage pour l\'aider à retrouver son terrier !',
      emoji: '🦊',
      color: 'from-emerald-500 to-teal-800',
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
                id="btn-nature-back-lobby"
                onClick={() => { playClickSound(); onBack(); }}
                className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-white py-2 px-4 rounded-full font-sans font-medium text-sm transition shadow-md touch-manipulation cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Retour au Village</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 py-1 px-3 rounded-full border border-amber-500/30">
                  🌿 LA FORÊT DE LA NATURE
                </span>
              </div>
            </div>

            {/* Hub Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none select-none text-9xl">
                🌲
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight mb-2 flex items-center gap-3">
                <span>La Forêt de Magie</span>
                <span className="text-2xl sm:text-3xl">🦔</span>
              </h1>
              <p className="text-emerald-100 max-w-xl text-sm sm:text-base font-sans">
                Observe, écoute la nature et vise la cible avec tes fléchettes !
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
                  <h3 className="font-sans font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4 flex-grow">
                    {game.descr}
                  </p>
                  <span className="flex items-center gap-2 text-amber-400 font-sans font-semibold text-xs mt-auto">
                    <Play size={12} fill="currentColor" />
                    Commencer
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
                id="btn-exit-game-nature"
                onClick={() => { playClickSound(); setActiveGame(null); }}
                className="flex items-center gap-1.5 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quitter</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌲</span>
                <span className="text-white font-sans font-bold text-sm">
                  {games.find((g) => g.id === activeGame)?.title}
                </span>
              </div>
            </div>

            {/* Core game component */}
            {activeGame === 'nature_shadow' && (
              <NatureShadowGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('nature_shadow');
                }}
              />
            )}
            {activeGame === 'nature_audio' && (
              <NatureAudioGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('nature_audio');
                }}
              />
            )}
            {activeGame === 'nature_darts' && (
              <NatureDartsGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('nature_darts');
                }}
              />
            )}
            {activeGame === 'nature_fox' && (
              <NatureFoxGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('nature_fox');
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- GAME 10: L'HERBIER MAGIQUE (Silhouettes, fruits & légumes) -----------------
interface SilhItem {
  id: string;
  emoji: string;
  name: string;
  isPlaced: boolean;
}

function NatureShadowGame({ onWin }: { onWin: () => void }) {
  const [items, setItems] = useState<SilhItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [targets, setTargets] = useState<SilhItem[]>([]);
  const [complete, setComplete] = useState(false);

  // List of fruits, flowers, tree leaves
  const herbierPool = [
    { id: 'item1', emoji: '🍁', name: 'La Feuille d\'Érable' },
    { id: 'item2', emoji: '🍄', name: 'Le Champi des bois' },
    { id: 'item3', emoji: '🌻', name: 'Le Tournesol d\'été' },
    { id: 'item4', emoji: '🌰', name: 'La Châtaigne brune' },
    { id: 'item5', emoji: '🍎', name: 'La Pomme rouge' },
    { id: 'item6', emoji: '🌲', name: 'Le Sapin vert' },
  ];

  const startNewGame = () => {
    setComplete(false);
    setSelectedItemId(null);
    // Draw 4 random elements from pool
    const selected = [...herbierPool].sort(() => Math.random() - 0.5).slice(0, 4);

    const itemList = selected.map((it) => ({ ...it, isPlaced: false }));
    const targetList = [...itemList].sort(() => Math.random() - 0.5);

    setItems(itemList);
    setTargets(targetList);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSelectItem = (id: string) => {
    playClickSound();
    setSelectedItemId(id);
  };

  const handleMatchTarget = (targetId: string) => {
    if (!selectedItemId) return;

    if (selectedItemId === targetId) {
      // It is a match!
      playNatureChirp();
      
      setItems((prev) =>
        prev.map((it) => (it.id === targetId ? { ...it, isPlaced: true } : it))
      );
      setTargets((prev) =>
        prev.map((it) => (it.id === targetId ? { ...it, isPlaced: true } : it))
      );
      setSelectedItemId(null);

      // Check complete
      setItems((current) => {
        const checkDone = current.every((it) => it.isPlaced || it.id === targetId);
        if (checkDone) {
          setComplete(true);
          playCorrectSound();
          onWin();
        }
        return current;
      });
    } else {
      // False match
      playErrorSound();
      setSelectedItemId(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-6">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🍁 L'Herbier Magique
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Touche un objet végétal à gauche, puis touche son ombre grise correspondante à droite pour le ranger !
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl bg-slate-900/60 p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
        
        {/* Left column: colored raw elements */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#10b981] font-bold text-center mb-1">
            🌿 TON SAC D'EXPLORATEUR :
          </span>
          <div className="grid grid-cols-2 gap-3">
            {items.map((it) => {
              const isSelected = selectedItemId === it.id;
              
              if (it.isPlaced) {
                return (
                  <div
                    id={`bag-item-placed-${it.id}`}
                    key={it.id}
                    className="aspect-square bg-slate-800/30 border border-slate-800/55 text-slate-600 rounded-2xl flex items-center justify-center text-3xl opacity-30 select-none"
                  >
                    ✓
                  </div>
                );
              }

              return (
                <button
                  id={`bag-item-${it.id}`}
                  key={it.id}
                  onClick={() => handleSelectItem(it.id)}
                  className={`aspect-square rounded-2xl text-5xl flex flex-col items-center justify-center transition p-4 border shadow-md active:scale-95 outline-none touch-manipulation cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-white scale-105 ring-2 ring-emerald-400'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span>{it.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Target shadowy containers */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold text-center mb-1">
            🗂️ MON HERBIER :
          </span>
          <div className="grid grid-cols-2 gap-3">
            {targets.map((it) => {
              if (it.isPlaced) {
                return (
                  <motion.div
                    id={`herbier-placed-${it.id}`}
                    key={it.id}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="aspect-square bg-emerald-900/30 border-2 border-emerald-500 rounded-2xl flex items-center justify-center text-5xl shadow-md cursor-default select-none relative"
                  >
                    <span>{it.emoji}</span>
                    <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 text-[8px] font-bold">✓</div>
                  </motion.div>
                );
              }

              return (
                <button
                  id={`herbier-target-${it.id}`}
                  key={it.id}
                  onClick={() => handleMatchTarget(it.id)}
                  className="aspect-square bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl flex items-center justify-center text-5xl p-4 transition shadow-inner select-none outline-none filter contrast-[0.1] brightness-[0.4] active:scale-95 touch-manipulation cursor-pointer"
                  title="Touche ici pour aligner ton échantillon"
                >
                  <span>{it.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-8">
        <button
          id="btn-shadow-reset"
          onClick={startNewGame}
          className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Nouveaux objets</span>
        </button>
      </div>

    </div>
  );
}

// ----------------- GAME 11: SYMPHONIE FORESTIERE (Simon Says Audio Memory) -----------------
interface AnimalNode {
  id: number;
  emoji: string;
  name: string;
  color: string;
  freq: number;
}

function NatureAudioGame({ onWin }: { onWin: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'input' | 'won'>('idle');
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const animals: AnimalNode[] = [
    { id: 0, emoji: '🦉', name: 'Le Hibou', color: 'from-amber-600 to-amber-800', freq: 440 },       // A4
    { id: 1, emoji: '🐸', name: 'La Grenouille', color: 'from-emerald-500 to-emerald-700', freq: 330 }, // E4
    { id: 2, emoji: '🐦', name: 'L\'Oiseau', color: 'from-cyan-500 to-cyan-700', freq: 554 },     // C#5
    { id: 3, emoji: '🐿️', name: 'L\'Écureuil', color: 'from-orange-500 to-orange-700', freq: 659 },  // E5
  ];

  const startNewStage = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setGameState('idle');
  };

  useEffect(() => {
    startNewStage();
  }, []);

  const playSequence = async (currSeq: number[]) => {
    setGameState('playing');
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < currSeq.length; i++) {
      const animalIdx = currSeq[i];
      setActiveButton(animalIdx);
      playForestNote(animals[animalIdx].freq, 0.35);
      await new Promise((r) => setTimeout(r, 450));
      setActiveButton(null);
      await new Promise((r) => setTimeout(r, 150));
    }
    setGameState('input');
  };

  const handleStartRound = () => {
    playClickSound();
    playSequence(sequence);
  };

  const handleAnimalAction = async (idx: number) => {
    if (gameState !== 'input' || activeButton !== null) return;

    setActiveButton(idx);
    playForestNote(animals[idx].freq, 0.3);
    setTimeout(() => setActiveButton(null), 300);

    const checkSeq = [...playerSequence, idx];
    setPlayerSequence(checkSeq);

    // Validate index
    const currentStep = checkSeq.length - 1;
    if (idx !== sequence[currentStep]) {
      // Mistake!
      playErrorSound();
      setGameState('idle');
      setPlayerSequence([]);
      // Highlight correct list for a moment
      return;
    }

    if (checkSeq.length === sequence.length) {
      // Completed current pattern!
      playNatureChirp();
      setPlayerSequence([]);

      if (sequence.length >= 4) {
        // Grand victory (reached length of 4)
        setGameState('won');
        playCorrectSound();
        onWin();
      } else {
        // Next tier
        const nextTarget = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextTarget);
        setTimeout(() => {
          playSequence(nextTarget);
        }, 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🦉 Symphonie Forestière
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Chaque animal chante une note de musique magique. Écoute la chanson puis rejoue-la sans faire d'erreur !
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700/60 p-3 rounded-full text-xs font-mono text-emerald-400 mb-6 flex gap-4">
        <span>Longueur visée : <span className="font-bold">4 notes</span></span>
        <span>Mélodie actuelle : <span className="font-bold">{sequence.length} notes</span></span>
      </div>

      {gameState === 'idle' && (
        <button
          id="btn-play-simon-melody"
          onClick={handleStartRound}
          className="h-16 w-full max-w-xs bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-2xl font-sans font-extrabold text-md border-b-4 border-emerald-700 shadow-xl flex items-center justify-center gap-2 mb-8 transition cursor-pointer"
        >
          <Volume2 size={20} />
          <span>ÉCOUTER LA MÉLODIE</span>
        </button>
      )}

      {/* Main Animals Simon Matrix Panel */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm mb-6">
        {animals.map((an) => {
          const isActive = activeButton === an.id;

          return (
            <button
              id={`simon-animal-${an.id}`}
              key={an.id}
              disabled={gameState !== 'input'}
              onClick={() => handleAnimalAction(an.id)}
              className={`aspect-square rounded-3xl bg-gradient-to-br ${an.color} flex flex-col items-center justify-center p-6 border-2 shadow-lg transition active:scale-95 relative outline-none select-none touch-manipulation cursor-pointer ${
                isActive
                  ? 'brightness-150 scale-105 border-white ring-4 ring-amber-400'
                  : 'border-slate-800 hover:brightness-105'
              } ${gameState !== 'input' ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <span className="text-6xl sm:text-7xl mb-1">{an.emoji}</span>
              <span className="text-[10px] font-mono tracking-widest text-slate-100 uppercase brightness-90">
                {an.name}
              </span>
            </button>
          );
        })}
      </div>

      {gameState === 'playing' && (
        <div className="h-10 text-xs font-mono text-amber-400 animate-pulse text-center">
          🦉 ÉCOUTE BIEN LE CHANT DU BOIS...
        </div>
      )}
      {gameState === 'input' && (
        <div className="h-10 text-xs font-mono text-emerald-400 animate-bounce text-center">
          👆 À TOI DE REJOUER LA MÉLODIE ! (Note {playerSequence.length + 1} / {sequence.length})
        </div>
      )}

      {gameState === 'won' && (
        <div className="bg-emerald-900/30 p-4 border border-emerald-500 rounded-2xl flex flex-col items-center max-w-sm text-center">
          <span className="text-3xl animate-bounce">🦉📣</span>
          <p className="text-sm font-bold text-emerald-400">Parfait Magicien de la Forêt !</p>
          <p className="text-xs text-slate-300 mt-1">Tu as chanté en harmonie avec tous les animaux !</p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          id="btn-symphonie-reset"
          onClick={startNewStage}
          className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Réinitialiser la partition</span>
        </button>
      </div>

    </div>
  );
}

// ----------------- GAME 12: LE TIR AUX FLECHETTES (Darts count calculation game) -----------------
interface PlacedDart {
  x: number; // percentage coordinate on target from 0 to 100
  y: number; // percentage coordinate on target from 0 to 100
  score: number;
}

function NatureDartsGame({ onWin }: { onWin: () => void }) {
  const [stage, setStage] = useState(0); // 0 to 2
  const [darts, setDarts] = useState<PlacedDart[]>([]);
  const [targetScore, setTargetScore] = useState(5);
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState('');
  const [shaking, setShaking] = useState(false);

  // Targets logic
  const stagesList = [
    { target: 5, hint: "Touche par exemple un 3 et un 2 !" },
    { target: 7, hint: "Touche un 4 et un 3 !" },
    { target: 9, hint: "Choisis bien tes lancers pour faire 9 !" },
  ];

  useEffect(() => {
    setTargetScore(stagesList[stage].target);
    setDarts([]);
    setMessage('');
  }, [stage]);

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDone) return;
    if (darts.length >= 3) {
      playErrorSound();
      setMessage("⚠️ Maximum 3 fléchettes ! Retire-les pour rejouer.");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const centerX = w / 2;
    const centerY = h / 2;
    const dist = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
    const maxR = w / 2;

    const ratio = dist / maxR;

    if (ratio > 1.0) {
      // clicked wood boundary or outside, don't register
      return;
    }

    let score = 1;
    if (ratio <= 0.25) {
      score = 4; // Bullseye (Blue)
    } else if (ratio <= 0.50) {
      score = 3; // Inner ring (White)
    } else if (ratio <= 0.78) {
      score = 2; // Middle ring (orange-red)
    } else {
      score = 1; // Outer ring (White)
    }

    // Convert pixel to steady percentage position so resizing won't warp the darts position on screen
    const pctX = (clickX / w) * 100;
    const pctY = (clickY / h) * 100;

    playNatureChirp();
    setDarts((prev) => [...prev, { x: pctX, y: pctY, score }]);
    setMessage('');
  };

  const handleClear = () => {
    playClickSound();
    setDarts([]);
    setMessage('');
  };

  const totalSum = darts.reduce((s, d) => s + d.score, 0);

  const handleValidate = () => {
    if (darts.length === 0) {
      playErrorSound();
      setMessage("🎯 Touche la cible avec ton doigt pour lancer des fléchettes !");
      return;
    }

    if (totalSum === targetScore) {
      playCorrectSound();
      if (stage < 2) {
        setMessage("⭐️ Super ! Défi suivant...");
        setTimeout(() => {
          setStage((prev) => prev + 1);
        }, 1200);
      } else {
        setIsDone(true);
        setMessage("🎉 Exceptionnel ! Tu as réussi tous les lancers de fléchettes !");
        onWin();
      }
    } else {
      playErrorSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setMessage(`Oups ! Ton score fait ${totalSum}, mais on cherche ${targetScore} ! Retire les fléchettes pour réessayer.`);
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Title */}
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🎯 Le Tir aux Fléchettes
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Vise les numéros bleus, blancs et rouges pour obtenir le score demandé !
        </p>
      </div>

      {/* Target score requirement panel */}
      <div className="bg-slate-900 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center mb-6 w-full max-w-sm text-center">
        <span className="text-xs font-mono uppercase text-[#38bdf8] font-bold tracking-widest mb-1 select-none">
          🎯 DEFI {stage + 1} / 3 :
        </span>
        <h3 className="text-3xl font-black font-sans text-white uppercase tracking-tight flex items-center gap-1.5 leading-none mt-1">
          Fais le score : <span className="text-amber-400 font-black">{targetScore}</span> !
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-2 italic">
          {stagesList[stage].hint}
        </p>
      </div>

      {/* Main interactive Dartboard area */}
      <motion.div
        animate={shaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-72 h-72 sm:w-80 sm:h-80 bg-[#a15e34] rounded-full border-[10px] border-[#3e1f0e] shadow-2xl flex items-center justify-center select-none mb-6 cursor-crosshair group active:scale-[0.99] transition-transform"
      >
        {/* Clickable inner target areas */}
        <div
          onClick={handleTargetClick}
          className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        >
          {/* Outer ring (1) - White */}
          <div className="absolute inset-0 bg-[#f9f8f6] rounded-full border-4 border-[#3e1f0e]" />

          {/* Ring 2: Coral-red (2) */}
          <div className="absolute w-[78%] h-[78%] bg-[#f87171] rounded-full border-4 border-[#3e1f0e]" />

          {/* Ring 3: White (3) */}
          <div className="absolute w-[50%] h-[50%] bg-[#f9f8f6] rounded-full border-4 border-[#3e1f0e]" />

          {/* Center bullseye (4) - Blue */}
          <div className="absolute w-[25%] h-[25%] bg-[#3b82f6] rounded-full border-4 border-[#3e1f0e]" />

          {/* Vertical score labels aligned upwards exactly like the user's reference image */}
          <div className="absolute top-[4%] left-1/2 -translate-x-1/2 font-sans font-black text-lg sm:text-xl text-slate-950 pointer-events-none drop-shadow-sm select-none">
            1
          </div>
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 font-sans font-black text-lg sm:text-xl text-slate-950 pointer-events-none drop-shadow-sm select-none">
            2
          </div>
          <div className="absolute top-[32%] left-1/2 -translate-x-1/2 font-sans font-black text-lg sm:text-xl text-slate-950 pointer-events-none drop-shadow-sm select-none">
            3
          </div>
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 font-sans font-black text-lg sm:text-xl text-white pointer-events-none drop-shadow-sm select-none">
            4
          </div>

          {/* Render inserted absolute-positioned SVG darts */}
          {darts.map((dart, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: `${dart.x}%`,
                top: `${dart.y}%`,
                transform: "translate(0%, -10px) rotate(-18deg)", // centers the tip precisely on click
                pointerEvents: "none",
                zIndex: 40,
              }}
              className="drop-shadow-[0_4px_3px_rgba(0,0,0,0.6)] select-none"
            >
              <svg width="40" height="16" viewBox="0 0 50 20" fill="none">
                {/* Yellow tail/flight */}
                <path d="M35 10 L48 2 L50 2 L45 10 L50 18 L48 18 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                {/* Shaft */}
                <line x1="8" y1="10" x2="40" y2="10" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                {/* Steel pointer tip */}
                <path d="M0 10 L8 6 L8 14 Z" fill="#0f172a" />
              </svg>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress & Current Sum status */}
      <div className="w-full max-w-sm flex items-center justify-between bg-slate-900/60 py-3 px-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Fléchettes :</span>
          <span className="text-sm font-bold text-white">{darts.length} / 3 lancées</span>
        </div>
        
        {/* Calculation display */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Ton calcul actuel :</span>
          <span className="text-lg font-extrabold text-[#38bdf8]">
            {darts.length === 0 ? "0" : darts.map((d) => d.score).join(" + ")} = {totalSum}
          </span>
        </div>
      </div>

      {/* Helpful alerts & tips notifications */}
      {message && (
        <p className="text-center text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 py-2.5 px-4 rounded-xl mb-6 max-w-sm animate-pulse">
          {message}
        </p>
      )}

      {/* Interaction buttons bar */}
      <div className="flex items-center gap-4">
        <button
          id="btn-clear-dartboard"
          onClick={handleClear}
          className="bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 text-yellow-300 font-sans font-bold py-2.5 px-5 rounded-2xl text-xs transition border border-yellow-505/30 cursor-pointer"
        >
          🧹 Retirer les fléchettes
        </button>

        <button
          id="btn-validate-dartboard"
          disabled={isDone}
          onClick={handleValidate}
          className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-slate-950 font-sans font-black py-3 px-6 rounded-2xl text-xs transition border-b-4 border-emerald-700 cursor-pointer"
        >
          🎰 Valider le calcul !
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ----------------- GAME 13: LE RENARD AU TERRIER ("Path Guide") --------------
// ============================================================================
interface CoordPos {
  x: number;
  y: number;
}

function NatureFoxGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(1);
  const [foxPos, setFoxPos] = useState<CoordPos>({ x: 0, y: 0 });
  const [terrierPos, setTerrierPos] = useState<CoordPos>({ x: 4, y: 4 });
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState("Aide le renard à rentrer chez lui dans son terrier !");
  const [successThisLevel, setSuccessThisLevel] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [movesCount, setMovesCount] = useState(0);

  // Helper to generate coordinates randomly
  const generateLevel = (currentLvl: number) => {
    let fx = 0, fy = 0, tx = 4, ty = 4;
    let distance = 0;
    // Require a minimum Manhattan distance so it's a real puzzle
    while (distance < 2 + Math.min(currentLvl, 3)) {
      fx = Math.floor(Math.random() * 5);
      fy = Math.floor(Math.random() * 5);
      tx = Math.floor(Math.random() * 5);
      ty = Math.floor(Math.random() * 5);
      distance = Math.abs(fx - tx) + Math.abs(fy - ty);
    }
    setFoxPos({ x: fx, y: fy });
    setTerrierPos({ x: tx, y: ty });
    setSuccessThisLevel(false);
    setMovesCount(0);
    
    const welcomeTexts = [
      "Aide le gentil renard à retrouver son terrier !",
      "Regarde bien Jules, guide le renard vers sa cachette !",
      "En route vers le terrier ! Aide notre ami roux !",
      "Encore une petite marche, Jules !",
      "Dernier niveau ! Amène le renard à l'abri !"
    ];
    const speech = welcomeTexts[(currentLvl - 1) % welcomeTexts.length];
    setMessage(speech);
    speak(speech);
  };

  const speak = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech Synthesis blocked", e);
    }
  };

  useEffect(() => {
    generateLevel(level);
  }, [level]);

  // Handle movements
  const moveFox = (dx: number, dy: number) => {
    if (successThisLevel || isDone) return;
    
    const newX = foxPos.x + dx;
    const newY = foxPos.y + dy;

    // Boundary check
    if (newX < 0 || newX > 4 || newY < 0 || newY > 4) {
      playErrorSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      return;
    }

    // Play walk sound
    playForestNote(
      newX === terrierPos.x && newY === terrierPos.y ? 523.25 : 392.00
    );
    setFoxPos({ x: newX, y: newY });
    setMovesCount(prev => prev + 1);

    // If reached terrier
    if (newX === terrierPos.x && newY === terrierPos.y) {
      handleLevelWin();
    }
  };

  const handleLevelWin = () => {
    setSuccessThisLevel(true);
    playCorrectSound();
    
    if (level < 5) {
      const congrats = `Bravo Jules ! Le renard est rentré au chaud ! En route pour le niveau suivant.`;
      setMessage(congrats);
      speak(congrats);
      
      setTimeout(() => {
        setLevel(prev => prev + 1);
      }, 2300);
    } else {
      setIsDone(true);
      const winMessage = `Félicitations Jules ! Tu as ramené tous les renards chez eux, tu es un vrai Gardien de la Nature !`;
      setMessage(winMessage);
      speak(winMessage);
      setTimeout(() => {
        onWin();
      }, 3000);
    }
  };

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (successThisLevel || isDone) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveFox(0, -1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveFox(0, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveFox(-1, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveFox(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [foxPos, successThisLevel, isDone, terrierPos]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto py-2">
      {/* Target Level indicator panel */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-bold">
          🦊 Chemin de la Nature
        </span>
        <span className="text-xs bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold px-3 py-1 rounded-full">
          Défis {level} / 5
        </span>
      </div>

      <h2 className="text-sm sm:text-base font-sans font-black text-slate-100 text-center mb-4 leading-relaxed px-4 min-h-[40px]">
        {message}
      </h2>

      {/* Grid container */}
      <motion.div
        animate={shaking ? { x: [-6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-72 h-72 sm:w-80 sm:h-80 bg-slate-900/80 p-3 sm:p-4 rounded-3xl border border-slate-700/60 shadow-inner grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2 relative mb-6"
      >
        {Array.from({ length: 5 }).map((_, rIdx) =>
          Array.from({ length: 5 }).map((_, cIdx) => {
            const isFox = foxPos.x === cIdx && foxPos.y === rIdx;
            const isTerrier = terrierPos.x === cIdx && terrierPos.y === rIdx;
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`rounded-xl flex items-center justify-center relative transition-all duration-300 overflow-hidden ${
                  isFox
                    ? 'bg-amber-500/20 border-2 border-amber-500/80 scale-100 z-10 shadow-lg shadow-amber-500/10'
                    : isTerrier
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/80 z-10'
                    : 'bg-slate-800 hover:bg-slate-705/85 border border-slate-700/30'
                }`}
              >
                {/* Handcrafted Fox SVG drawing */}
                {isFox && (
                  <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center select-none"
                  >
                    <svg viewBox="0 0 64 64" className="w-9 h-9 sm:w-11 sm:h-11 filter drop-shadow">
                      <polygon points="32,54 12,24 52,24" fill="#f97316" />
                      <polygon points="12,14 16,30 26,24" fill="#ea580c" />
                      <polygon points="14,16 17,28 24,24" fill="#fee2e2" />
                      <polygon points="52,14 48,30 38,24" fill="#ea580c" />
                      <polygon points="50,16 47,28 40,24" fill="#fee2e2" />
                      <polygon points="32,54 12,24 24,38" fill="#ffffff" />
                      <polygon points="32,54 52,24 40,38" fill="#ffffff" />
                      <circle cx="22" cy="28" r="2.5" fill="#1e293b" />
                      <circle cx="42" cy="28" r="2.5" fill="#1e293b" />
                      <circle cx="21" cy="27" r="0.8" fill="#ffffff" />
                      <circle cx="41" cy="27" r="0.8" fill="#ffffff" />
                      <circle cx="32" cy="52" r="3.5" fill="#0f172a" />
                      <circle cx="17" cy="33" r="2.5" fill="#f43f5e" opacity="0.4" />
                      <circle cx="47" cy="33" r="2.5" fill="#f43f5e" opacity="0.4" />
                    </svg>
                  </motion.div>
                )}

                {/* Handcrafted Terrier SVG drawing */}
                {isTerrier && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: successThisLevel ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: successThisLevel ? Infinity : 0, duration: 2 }}
                    className="flex items-center justify-center select-none"
                  >
                    <svg viewBox="0 0 64 64" className="w-9 h-9 sm:w-11 sm:h-11 filter drop-shadow">
                      <ellipse cx="32" cy="52" rx="26" ry="8" fill="#22c55e" opacity="0.8" />
                      <path d="M12 52 C 12 28, 52 28, 52 52 Z" fill="#78350f" opacity="0.95" />
                      <path d="M16 52 C 16 34, 48 34, 48 52 Z" fill="#854d0e" opacity="0.4" />
                      <ellipse cx="32" cy="46" rx="11" ry="8" fill="#1e293b" />
                      <ellipse cx="32" cy="48" rx="7" ry="5" fill="#0f172a" />
                      <path d="M14 52 L14 48" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M11 48 Q14 44 17 48 Z" fill="#ef4444" />
                      <path d="M32 12 L33 15 L36 15 L34 17 L35 20 L32 18 L29 20 L30 17 L28 15 L31 15 Z" fill="#facc15" />
                    </svg>
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </motion.div>

      {/* Movement Controller */}
      <div className="flex flex-col items-center justify-center gap-2 select-none mb-4">
        {/* UP */}
        <button
          id="btn-fox-move-up"
          onClick={() => moveFox(0, -1)}
          disabled={successThisLevel || isDone}
          className="w-14 h-14 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-700 rounded-2xl flex items-center justify-center transition shadow-md cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl text-blue-400 font-bold">⬆️</span>
        </button>

        {/* LEFT / CENTER / RIGHT */}
        <div className="flex items-center gap-2">
          <button
            id="btn-fox-move-left"
            onClick={() => moveFox(-1, 0)}
            disabled={successThisLevel || isDone}
            className="w-14 h-14 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-700 rounded-2xl flex items-center justify-center transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <span className="text-2xl text-blue-400 font-bold">⬅️</span>
          </button>

          {/* Center emblem */}
          <div className="w-14 h-14 bg-slate-900 border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 64 64" className="w-8 h-8 opacity-85">
              <polygon points="32,54 12,24 52,24" fill="#f97316" />
              <polygon points="12,14 16,30 26,24" fill="#ea580c" />
              <circle cx="22" cy="28" r="2.5" fill="#1e293b" />
              <circle cx="42" cy="28" r="2.5" fill="#1e293b" />
              <circle cx="32" cy="52" r="3.5" fill="#0f172a" />
            </svg>
          </div>

          <button
            id="btn-fox-move-right"
            onClick={() => moveFox(1, 0)}
            disabled={successThisLevel || isDone}
            className="w-14 h-14 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-700 rounded-2xl flex items-center justify-center transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <span className="text-2xl text-blue-400 font-bold">➡️</span>
          </button>
        </div>

        {/* DOWN */}
        <button
          id="btn-fox-move-down"
          onClick={() => moveFox(0, 1)}
          disabled={successThisLevel || isDone}
          className="w-14 h-14 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-700 rounded-2xl flex items-center justify-center transition shadow-md cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl text-blue-400 font-bold">⬇️</span>
        </button>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4 mt-2">
        <button
          id="btn-voice-fox-guidance"
          onClick={() => speak(message)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <Volume2 size={13} className="text-emerald-400 animate-pulse" />
          <span>Réentendre la consigne</span>
        </button>

        <button
          id="btn-reset-fox-puzzle"
          onClick={() => generateLevel(level)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <RotateCcw size={13} className="text-yellow-400" />
          <span>Générer d'autres positions</span>
        </button>
      </div>
      
      <p className="font-mono text-[9px] text-slate-500 mt-4 leading-normal text-center max-w-[280px]">
        Astuces : Utilisez les boutons fléchés ou les touches directionnelles de votre clavier ! {movesCount > 1 && `(${movesCount} pas)`}
      </p>
    </div>
  );
}
