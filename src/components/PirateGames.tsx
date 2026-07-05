import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Compass, Coins, Play, Trophy, ArrowLeft, RotateCcw, Volume2, Sparkles, Check } from 'lucide-react';
import { playCorrectSound, playErrorSound, playPirateCoinSound, playClickSound } from '../utils/audio';

interface PirateGamesProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onCompleteGame: (gameId: string) => void;
}

export default function PirateGames({ onBack, onAddStars, onCompleteGame }: PirateGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'pirate_treasure',
      title: 'Le Trésor du Capitaine',
      descr: 'Calcule juste pour faire avancer le bateau pirate jusqu\'au trésor d\'or !',
      emoji: '🏴‍☠️',
      color: 'from-amber-500 to-amber-700',
    },
    {
      id: 'pirate_counting',
      title: 'Le Compteur de Doublons',
      descr: 'Observe bien et compte les pièces d\'or et les bijoux du trésor !',
      emoji: '🪙',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'pirate_patterns',
      title: 'Le Code de la Boussole',
      descr: 'Trouve l\'objet logique manquant pour débloquer la suite de la carte !',
      emoji: '🧭',
      color: 'from-teal-500 to-emerald-600',
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
                id="btn-pirate-back-lobby"
                onClick={() => { playClickSound(); onBack(); }}
                className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-white py-2 px-4 rounded-full font-sans font-medium text-sm transition shadow-md touch-manipulation cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Retour au Village</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 py-1 px-3 rounded-full border border-amber-500/30">
                  🦜 ÎLE AUX PIRATES
                </span>
              </div>
            </div>

            {/* Hub Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none select-none text-9xl">
                🏴‍☠️
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight mb-2 flex items-center gap-3">
                <span>L'Île aux Pirates</span>
                <span className="text-2xl sm:text-3xl">🦜</span>
              </h1>
              <p className="text-amber-100 max-w-xl text-sm sm:text-base font-sans">
                Aide les pirates à déchiffrer les cartes au trésor et à compter les pièces d'or ! Idéal pour s'entraîner aux mathématiques.
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
                    Commencer l'exercice
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
                id="btn-exit-game-pirate"
                onClick={() => { playClickSound(); setActiveGame(null); }}
                className="flex items-center gap-1.5 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quitter le jeu</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏴‍☠️</span>
                <span className="text-white font-sans font-bold text-sm">
                  {games.find((g) => g.id === activeGame)?.title}
                </span>
              </div>
            </div>

            {/* Core game component */}
            {activeGame === 'pirate_treasure' && (
              <PirateTreasureGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('pirate_treasure');
                }}
              />
            )}
            {activeGame === 'pirate_counting' && (
              <PirateCountingGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('pirate_counting');
                }}
              />
            )}
            {activeGame === 'pirate_patterns' && (
              <PiratePatternsGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('pirate_patterns');
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- GAME 1: LE TRESOR DU CAPITAINE (Calcul et 4 Opérations) -----------------
function PirateTreasureGame({ onWin }: { onWin: () => void }) {
  const [step, setStep] = useState(0); // 0 to 5 (5 is victory)
  const [operator, setOperator] = useState<'+' | '-' | 'x' | '÷'>('+');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [shaking, setShaking] = useState(false);

  const generateQuestion = () => {
    setSelectedAnswer(null);
    const ops: ('+' | '-' | 'x' | '÷')[] = ['+', '-', 'x', '÷'];
    // For 5-year-old: select random operator, keeping numbers up to 10-12
    const currentOp = ops[Math.floor(Math.random() * ops.length)];
    setOperator(currentOp);

    let n1 = 0;
    let n2 = 0;
    let ans = 0;

    if (currentOp === '+') {
      n1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
      n2 = Math.floor(Math.random() * (12 - n1)) + 1; // n1 + n2 <= 12
      ans = n1 + n2;
    } else if (currentOp === '-') {
      n1 = Math.floor(Math.random() * 7) + 6; // 6 to 12
      n2 = Math.floor(Math.random() * n1) + 1; // n1 - n2 >= 0
      ans = n1 - n2;
    } else if (currentOp === 'x') {
      // 5-year-old simple multiplication (mostly by 1, 2, 3)
      n1 = Math.floor(Math.random() * 4) + 1; // 1 to 4
      n2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      ans = n1 * n2;
    } else {
      // '÷' simple divisions
      const divisors = [1, 2, 3];
      n2 = divisors[Math.floor(Math.random() * divisors.length)];
      ans = Math.floor(Math.random() * 4) + 1; // answer 1 to 4
      n1 = ans * n2; // ensures integer division
    }

    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(ans);

    // Generate options containing the answer
    const optsSet = new Set<number>();
    optsSet.add(ans);
    while (optsSet.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const candidate = ans + offset;
      if (candidate >= 0 && candidate <= 15) {
        optsSet.add(candidate);
      } else {
        optsSet.add(Math.floor(Math.random() * 12));
      }
    }
    setOptions(Array.from(optsSet).sort((a, b) => a - b));
  };

  useEffect(() => {
    generateQuestion();
  }, [step]);

  const handleOptionClick = (val: number) => {
    if (selectedAnswer !== null || isDone) return;
    setSelectedAnswer(val);

    if (val === correctAnswer) {
      playPirateCoinSound();
      if (step < 4) {
        setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 1200);
      } else {
        // Grand victory
        setStep(5);
        setIsDone(true);
        playCorrectSound();
        onWin();
      }
    } else {
      playErrorSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setIsDone(false);
    generateQuestion();
  };

  // SVG dimensions for the pirate track
  const percentComplete = (step / 5) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🚢 Le Navire du Trésor
        </h2>
        <p className="text-sm font-sans text-slate-300 mb-6">
          Trouve la bonne réponse pour faire naviguer le bateau. Remplis le coffre pour gagner !
        </p>
      </div>

      {/* Pirate Track Map */}
      <div className="w-full bg-slate-900 border border-slate-700/60 p-5 rounded-2xl mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>Départ 🏝️</span>
          <span>Coffre au Trésor 🏆</span>
        </div>

        <div className="relative h-12 bg-slate-950/80 rounded-full border border-slate-800 flex items-center px-4">
          {/* Blue water track */}
          <div className="absolute left-4 right-4 h-3 bg-blue-900/55 rounded-full overflow-hidden">
            <motion.div
              style={{ width: `${percentComplete}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              layout
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Stepping marks */}
          <div className="absolute left-4 right-4 flex justify-between px-2">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <div
                id={`track-step-${s}`}
                key={s}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow transition-colors ${
                  step > s
                    ? 'bg-amber-500 text-slate-950'
                    : step === s
                    ? 'bg-cyan-400 text-slate-950 scale-110 ring-2 ring-white/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Floating pirate ship */}
          <motion.div
            className="absolute z-10 text-3xl pointer-events-none"
            animate={{
              left: `calc(${percentComplete}% - ${percentComplete > 80 ? 32 : 12}px)`,
              y: [0, -4, 0],
            }}
            transition={{
              left: { duration: 0.6, type: 'spring', stiffness: 70 },
              y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
            }}
            style={{
              left: `${percentComplete}%`,
            }}
          >
            {step === 5 ? '🎉' : '⛵'}
          </motion.div>
        </div>

        {/* Big treasure chest icon at end */}
        <div className="absolute right-3 top-[32px] text-3xl pointer-events-none">
          {step === 5 ? '👑' : '💎'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div
            key="active-question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex flex-col items-center w-full max-w-md ${
              shaking ? 'animate-shake' : ''
            }`}
          >
            {/* Displaying visual coins/objects representing the math */}
            <div className="flex flex-wrap justify-center gap-1.5 p-4 bg-slate-900 border border-slate-800 rounded-2xl w-full mb-6 min-h-[70px]">
              {Array.from({ length: num1 }).map((_, i) => (
                <motion.span
                  key={`n1-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  🪙
                </motion.span>
              ))}
              <span className="text-xl font-bold flex items-center justify-center text-amber-400 px-2 select-none">
                {operator}
              </span>
              {Array.from({ length: num2 }).map((_, i) => (
                <motion.span
                  key={`n2-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  🪙
                </motion.span>
              ))}
            </div>

            {/* Math Question Board */}
            <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-2xl mb-6 w-full text-center">
              <span className="text-xs font-mono tracking-widest text-[#10b981] font-bold">
                QUESTION {step + 1} / 5
              </span>
              <p className="text-3xl sm:text-4xl font-sans font-extrabold text-white mt-2">
                {num1} {operator} {num2} = ?
              </p>
            </div>

            {/* Answers List */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {options.map((option) => {
                const isCorrect = option === correctAnswer;
                const isSelected = selectedAnswer === option;

                let btnBg = 'bg-slate-700/70 hover:bg-slate-700 border-slate-600';
                if (selectedAnswer !== null) {
                  if (isSelected) {
                    btnBg = isCorrect
                      ? 'bg-emerald-600 border-emerald-500 scale-105'
                      : 'bg-red-600 border-red-500';
                  } else if (isCorrect) {
                    btnBg = 'bg-emerald-600/50 border-emerald-600';
                  }
                }

                return (
                  <button
                    id={`btn-answer-op-${option}`}
                    key={option}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleOptionClick(option)}
                    className={`h-20 text-3xl font-sans font-bold border rounded-2xl transition duration-200 outline-none flex items-center justify-center text-white active:scale-95 touch-manipulation cursor-pointer ${btnBg}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-6 bg-amber-500/10 border-2 border-amber-500 border-dashed rounded-3xl max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg animate-bounce">
              👑
            </div>
            <h3 className="text-2xl font-bold font-sans text-amber-400 mb-2">
              Magnifique, Moussaillon !
            </h3>
            <p className="font-sans text-sm text-slate-200 mb-6">
              Tu as guidé le bateau pirate jusqu'au coffre et as récolté toutes les pièces d'or !
            </p>
            <div className="flex gap-4">
              <button
                id="btn-restart-treasure-game"
                onClick={handleRestart}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-sans font-medium py-2.5 px-5 rounded-full text-sm transition touch-manipulation cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Rejouer</span>
              </button>
              <button
                id="btn-win-treasure-back"
                onClick={onWin}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold py-2.5 px-5 rounded-full text-sm transition shadow-md touch-manipulation cursor-pointer"
              >
                <ShieldAlert size={16} />
                <span>Réclamer l'or (+5 ⭐️)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- GAME 2: LE COMPTEUR DE DOUBLONS (Dénombrement & Tri) -----------------
function PirateCountingGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(0); // 0 to 2
  const [targetType, setTargetType] = useState<'or' | 'violet' | 'bleu'>('or');
  const [items, setItems] = useState<{ id: number; type: 'or' | 'violet' | 'bleu'; isCounted: boolean }[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [countingStats, setCountingStats] = useState({ or: 0, violet: 0, bleu: 0 });

  const emojis = {
    or: '🪙',     // d'or
    violet: '💎', // violet
    bleu: '💙',   // bleu
  };

  const labelFR = {
    or: 'doublons d\'or 🪙',
    violet: 'cristaux violets 💎',
    bleu: 'diamants bleus 💙',
  };

  const generateScenario = () => {
    setSelectedAnswer(null);

    const types: ('or' | 'violet' | 'bleu')[] = ['or', 'violet', 'bleu'];
    const currentTarget = types[Math.floor(Math.random() * types.length)];
    setTargetType(currentTarget);

    // Dynamic counts
    const counts = {
      or: Math.floor(Math.random() * 5) + 2,      // 2 to 6
      violet: Math.floor(Math.random() * 5) + 2,  // 2 to 6
      bleu: Math.floor(Math.random() * 4) + 1,    // 1 to 4
    };
    setCountingStats(counts);

    const goldItems = Array.from({ length: counts.or }).map((_, i) => ({ id: i, type: 'or' as const, isCounted: false }));
    const purpleItems = Array.from({ length: counts.violet }).map((_, i) => ({ id: 10 + i, type: 'violet' as const, isCounted: false }));
    const blueItems = Array.from({ length: counts.bleu }).map((_, i) => ({ id: 20 + i, type: 'bleu' as const, isCounted: false }));

    // Concatenate & Shuffle
    const allItems = [...goldItems, ...purpleItems, ...blueItems].sort(() => Math.random() - 0.5);
    setItems(allItems);

    const targetAnswer = counts[currentTarget];
    setCorrectCount(targetAnswer);

    // Create unique choices
    const optsSet = new Set<number>();
    optsSet.add(targetAnswer);
    while (optsSet.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const candidate = targetAnswer + offset;
      if (candidate >= 1 && candidate <= 12) {
        optsSet.add(candidate);
      } else {
        optsSet.add(Math.floor(Math.random() * 10) + 1);
      }
    }
    setOptions(Array.from(optsSet).sort((a, b) => a - b));
  };

  useEffect(() => {
    generateScenario();
  }, [level]);

  const handleItemTap = (itemId: number) => {
    playClickSound();
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, isCounted: !it.isCounted } : it))
    );
  };

  const handleAnswer = (val: number) => {
    if (selectedAnswer !== null || isDone) return;
    setSelectedAnswer(val);

    if (val === correctCount) {
      playCorrectSound();
      if (level < 2) {
        setTimeout(() => {
          setLevel((prev) => prev + 1);
        }, 1500);
      } else {
        setIsDone(true);
        onWin();
      }
    } else {
      playErrorSound();
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setLevel(0);
    setIsDone(false);
    generateScenario();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          💎 Le Compteur de Doublons
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Aide le pirate à faire ses comptes ! Touche les objets pour les cocher et ne pas te tromper !
        </p>
      </div>

      {/* Level counter */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((lv) => (
          <div
            key={lv}
            className={`w-10 h-2.5 rounded-full ${
              level > lv ? 'bg-amber-500' : level === lv ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Question Text */}
      <div className="bg-slate-900 border-2 border-amber-500/30 p-4 rounded-2xl text-center w-full max-w-md mb-6 shadow-inner">
        <p className="text-lg font-sans font-medium text-slate-100 leading-snug">
          Trouve combien il y a de :
        </p>
        <p className="text-2xl font-sans font-extrabold text-[#f59e0b] mt-1 capitalize">
          {labelFR[targetType]}
        </p>
      </div>

      {/* Main Treasure Box Canvas */}
      <div className="w-full max-w-lg aspect-video bg-gradient-to-b from-[#78350f] to-[#451a03] border-4 border-[#b45309] rounded-3xl p-6 relative flex flex-wrap gap-4 items-center justify-center shadow-2xl min-h-[190px]">
        {/* Background shine / chest floor grid */}
        <div className="grid grid-cols-6 gap-3 w-full h-full p-2">
          {items.map((it) => (
            <button
               id={`counting-item-${it.id}`}
               key={it.id}
               onClick={() => handleItemTap(it.id)}
               className={`relative flex items-center justify-center text-4xl sm:text-5xl rounded-xl transition duration-150 transform hover:scale-110 select-none outline-none overflow-visible w-full aspect-square touch-manipulation cursor-pointer ${
                 it.isCounted ? 'bg-white/10 ring-2 ring-emerald-400' : 'bg-transparent'
               }`}
            >
              <span className="relative z-10">{emojis[it.type]}</span>
              {/* Count mark checkmark indicator */}
              {it.isCounted && (
                <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transform translate-x-1.5 -translate-y-1.5">
                  <Check size={10} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs font-mono text-slate-400 mt-2 mb-6">
        💡 Astuce : Tape sur un objet pour y coller un sticker de contrôle !
      </p>

      {/* Options Cards */}
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-4 gap-3">
          {options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === correctCount;

            let btnTheme = 'bg-slate-700/80 hover:bg-slate-700 text-white border-slate-600';
            if (selectedAnswer !== null) {
              if (isSelected) {
                btnTheme = isCorrect ? 'bg-emerald-600 border-emerald-500 text-white scale-105' : 'bg-red-600 border-red-500 text-white';
              } else if (isCorrect) {
                btnTheme = 'bg-emerald-600/50 border-emerald-500 text-emerald-200';
              }
            }

            return (
              <button
                id={`btn-count-choice-${option}`}
                key={option}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(option)}
                className={`h-16 text-2xl font-bold rounded-2xl border transition duration-150 flex items-center justify-center shadow-lg active:scale-95 touch-manipulation cursor-pointer ${btnTheme}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {isDone && (
        <div className="mt-8 flex justify-center">
          <button
            id="btn-count-won-restart"
            onClick={handleRestart}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Recommencer</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------- GAME 3: LE CODE DE LA BOUSSOLE (Suites logiques) -----------------
function PiratePatternsGame({ onWin }: { onWin: () => void }) {
  const [level, setLevel] = useState(0); // 0 to 2 (3 patterns to clear)
  const [sequence, setSequence] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctItem, setCorrectItem] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Pool of usable pirate emojis
  const itemPool = [
    { name: 'boussole', emoji: '🧭' },
    { name: 'perroquet', emoji: '🦜' },
    { name: 'bateau', emoji: '⛵' },
    { name: 'coffre', emoji: '🪙' },
    { name: 'chapeau', emoji: '🏴‍☠️' },
    { name: 'ancre', emoji: '⚓' },
    { name: 'carte', emoji: '🗺️' },
    { name: 'clef', emoji: '🔑' },
  ];

  const generatePattern = () => {
    setSelectedItem(null);
    const activePool = [...itemPool].sort(() => Math.random() - 0.5);

    const a = activePool[0].emoji;
    const b = activePool[1].emoji;
    const c = activePool[2].emoji;

    let seq: string[] = [];
    let correct = '';

    const patternType = level; // different styles of patterns

    if (patternType === 0) {
      // Simplest: A - B - A - B - A - [B]
      seq = [a, b, a, b, a];
      correct = b;
    } else if (patternType === 1) {
      // A - A - B - A - A - [B]
      seq = [a, a, b, a, a];
      correct = b;
    } else {
      // Three items: A - B - C - A - B - [C]
      seq = [a, b, c, a, b];
      correct = c;
    }

    setSequence(seq);
    setCorrectItem(correct);

    // Generate 4 randomized options
    const choices = new Set<string>();
    choices.add(correct);
    while (choices.size < 4) {
      const randEmoji = itemPool[Math.floor(Math.random() * itemPool.length)].emoji;
      choices.add(randEmoji);
    }
    setOptions(Array.from(choices).sort());
  };

  useEffect(() => {
    generatePattern();
  }, [level]);

  const handleChoice = (emoji: string) => {
    if (selectedItem !== null || isDone) return;
    setSelectedItem(emoji);

    if (emoji === correctItem) {
      playCorrectSound();
      if (level < 2) {
        setTimeout(() => {
          setLevel((prev) => prev + 1);
        }, 1500);
      } else {
        setIsDone(true);
        onWin();
      }
    } else {
      playErrorSound();
      setTimeout(() => setSelectedItem(null), 1000);
    }
  };

  const handleReset = () => {
    setLevel(0);
    setIsDone(false);
    generatePattern();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🧭 Le Code de la Boussole
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Trouve le bon emoji pirate pour compléter la suite logique !
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((lv) => (
          <div
            key={lv}
            className={`w-10 h-2.5 rounded-full ${
              level > lv ? 'bg-amber-500' : level === lv ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Sequence Board */}
      <div className="bg-slate-900/80 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg mb-8 shadow-inner flex flex-col items-center justify-center gap-6">
        <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap">
          {sequence.map((emoji, idx) => (
            <motion.div
              id={`pattern-item-${idx}`}
              key={idx}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md select-none"
            >
              {emoji}
            </motion.div>
          ))}

          {/* Missing Slot */}
          <motion.div
            id="pattern-missing-slot"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 border-2 border-dashed rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md ${
              selectedItem ? 'bg-slate-850 border-emerald-500' : 'bg-amber-500/10 border-amber-500/80'
            }`}
          >
            {selectedItem ? selectedItem : <span className="text-amber-500 font-sans font-extrabold text-2xl sm:text-3xl animate-pulse">?</span>}
          </motion.div>
        </div>

        <p className="text-xs font-mono text-slate-400">
          Trouve quel objet se cache sous le point d'interrogation !
        </p>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
        {options.map((emoji, i) => {
          const isSelected = selectedItem === emoji;
          const isCorrect = emoji === correctItem;

          let btnColor = 'bg-slate-700/80 hover:bg-slate-700 border-slate-600';
          if (selectedItem !== null) {
            if (isSelected) {
              btnColor = isCorrect ? 'bg-emerald-600 border-emerald-500 scale-105' : 'bg-red-600 border-red-500';
            } else if (isCorrect) {
              btnColor = 'bg-emerald-600/50 border-emerald-500';
            }
          }

          return (
            <button
              id={`btn-pattern-emoji-${i}`}
              key={i}
              disabled={selectedItem !== null}
              onClick={() => handleChoice(emoji)}
              className={`aspect-square text-3xl rounded-2xl border flex items-center justify-center shadow-lg active:scale-95 transition duration-150 touch-manipulation cursor-pointer ${btnColor}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {isDone && (
        <div className="mt-8 flex justify-center">
          <button
            id="btn-pattern-won-restart"
            onClick={handleReset}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Recommencer</span>
          </button>
        </div>
      )}
    </div>
  );
}
