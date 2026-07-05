import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Award, Check, Shuffle } from 'lucide-react';
import { playCorrectSound, playErrorSound, playDinoRoar, playClickSound } from '../utils/audio';

interface DinoGamesProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onCompleteGame: (gameId: string) => void;
}

export default function DinoGames({ onBack, onAddStars, onCompleteGame }: DinoGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'dino_fossil_hunt',
      title: 'La Chasse aux Fossiles',
      descr: 'Retrouve les paires de dinosaures et leurs squelettes dans ce jeu de mémoire !',
      emoji: '🦴',
      color: 'from-orange-500 to-amber-700',
    },
    {
      id: 'dino_feeding',
      title: 'Le Son des Dinos',
      descr: 'Écoute la lettre et touche le dessin où tu entends le son comme [A], [O], [I], [R] !',
      emoji: '🦖',
      color: 'from-green-500 to-emerald-700',
    },
    {
      id: 'dino_jigsaw',
      title: 'Le Puzzle du Petit T-Rex',
      descr: 'Échange les morceaux d\'image mélangés pour reconstituer le bébé dinosaure !',
      emoji: '🥚',
      color: 'from-sky-500 to-indigo-600',
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
                id="btn-dino-back-lobby"
                onClick={() => { playClickSound(); onBack(); }}
                className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 active:scale-95 text-white py-2 px-4 rounded-full font-sans font-medium text-sm transition shadow-md touch-manipulation cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Retour au Village</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-mono bg-green-500/20 text-green-300 py-1 px-3 rounded-full border border-green-500/30">
                  🦖 VALLÉE DES DINOSAURES
                </span>
              </div>
            </div>

            {/* Hub Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-800 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none select-none text-9xl">
                🦕
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight mb-2 flex items-center gap-3">
                <span>La Vallée des Dinos</span>
                <span className="text-2xl sm:text-3xl">🥦</span>
              </h1>
              <p className="text-emerald-100 max-w-xl text-sm sm:text-base font-sans">
                Explore le monde de la préhistoire ! Retrouve des fossiles enfouis et amuse-toi avec les lettres du dictionnaire jurassique !
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
                  <h3 className="font-sans font-bold text-lg text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4 flex-grow">
                    {game.descr}
                  </p>
                  <span className="flex items-center gap-2 text-emerald-400 font-sans font-semibold text-xs mt-auto">
                    <Play size={12} fill="currentColor" />
                    Explorer l'exercice
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
                id="btn-exit-game-dino"
                onClick={() => { playClickSound(); setActiveGame(null); }}
                className="flex items-center gap-1.5 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quitter le jeu</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">🦕</span>
                <span className="text-white font-sans font-bold text-sm">
                  {games.find((g) => g.id === activeGame)?.title}
                </span>
              </div>
            </div>

            {/* Core game component */}
            {activeGame === 'dino_fossil_hunt' && (
              <DinoFossilHuntGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('dino_fossil_hunt');
                }}
              />
            )}
            {activeGame === 'dino_feeding' && (
              <DinoFeedingGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('dino_feeding');
                }}
              />
            )}
            {activeGame === 'dino_jigsaw' && (
              <DinoJigsawGame
                onWin={() => {
                  onAddStars(5);
                  onCompleteGame('dino_jigsaw');
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- GAME 4: LA CHASSE AUX FOSSILES (Memory Pair) -----------------
interface MemoryCard {
  id: number;
  pairId: number;
  displayItem: string; // emoji or fossil symbol
  isFlipped: boolean;
  isMatched: boolean;
}

function DinoFossilHuntGame({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [guesses, setGuesses] = useState(0);

  // 6 pairs: Dinosaur illustration vs Fossil skeleton
  const fPairs = [
    { id: 1, live: '🦖', fossil: '🦕 Squelette T-Rex' },
    { id: 2, live: '🐉', fossil: '🦖 Squelette Dino volant' },
    { id: 3, live: '🐢', fossil: '🐚 Coquillage Fossile' },
    { id: 4, live: '🥚', fossil: '🐣 Bébé Éclos' },
    { id: 5, live: '🌋', fossil: '🪨 Pierre volcanique' },
    { id: 6, live: '🌿', fossil: '🍂 Feuille fossilisée' },
  ];

  const initializeDeck = () => {
    const deck: MemoryCard[] = [];
    fPairs.forEach((pair, idx) => {
      // Create first card element
      deck.push({
        id: idx * 2,
        pairId: pair.id,
        displayItem: pair.live,
        isFlipped: false,
        isMatched: false,
      });
      // Create second card element (fossil matching)
      deck.push({
        id: idx * 2 + 1,
        pairId: pair.id,
        displayItem: pair.fossil.split(' ')[0], // just emoji for simplification
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setIsDone(false);
    setGuesses(0);
  };

  useEffect(() => {
    initializeDeck();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2 || isDone) return;
    playClickSound();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Update state to flip card
    setCards((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setGuesses((g) => g + 1);
      const [idx1, idx2] = newFlipped;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.pairId === card2.pairId) {
        // Correct match!
        playDinoRoar();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === idx1 || idx === idx2 ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);

          // Check for complete victory
          setCards((currentCards) => {
            const allMatched = currentCards.every((c) => c.isMatched || c.id === card1.id || c.id === card2.id);
            if (allMatched) {
              setIsDone(true);
              playCorrectSound();
              onWin();
            }
            return currentCards;
          });
        }, 500);
      } else {
        // Mismatch, reset after buffer
        setTimeout(() => {
          playErrorSound();
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === idx1 || idx === idx2 ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-6">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🦴 La Chasse aux Fossiles
        </h2>
        <p className="text-sm font-sans text-slate-300">
          Chaque dinosaure a son double ou son élément préhistorique caché ! Retrouve-les tous !
        </p>
      </div>

      <div className="bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/60 text-xs font-mono text-emerald-400 mb-6 flex gap-4">
        <span>Essais : <span className="font-bold">{guesses}</span></span>
        <span>Paires trouvées : <span className="font-bold">{cards.filter(c => c.isMatched).length / 2} / 6</span></span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md w-full mb-8">
        {cards.map((card, idx) => {
          const showFace = card.isFlipped || card.isMatched;

          return (
            <button
              id={`memory-card-${idx}`}
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square w-full rounded-2xl transition-all duration-350 shadow-lg transform flex items-center justify-center outline-none select-none relative overflow-visible touch-manipulation cursor-pointer ${
                showFace
                  ? 'bg-gradient-to-br from-amber-700 to-orange-500 border-2 border-amber-300 rotate-0 scale-100'
                  : 'bg-slate-750 border-2 border-slate-650 hover:bg-slate-700 active:scale-95 text-4xl'
              }`}
            >
              {showFace ? (
                <div className="text-4xl sm:text-5xl">{card.displayItem}</div>
              ) : (
                <div className="text-emerald-500 font-sans font-extrabold text-2xl">🦕</div>
              )}

              {card.isMatched && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transform translate-x-1 translate-y-[-4px]">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          id="btn-fossil-reset"
          onClick={initializeDeck}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Mélanger & Rejouer</span>
        </button>
      </div>
    </div>
  );
}

// ----------------- GAME 5: LE SON DES DINOS (Letter-to-Sound Matching) -----------------
function PhonicIllustration({ word }: { word: string }) {
  const normWord = word.toLowerCase().trim();

  switch (normWord) {
    case 'avion':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#e0f2fe" />
          <path d="M12 36 L48 24 L52 27 L16 41 Z" fill="#94a3b8" />
          <path d="M16 35 L48 24 C54 22 54 18 48 20 L16 30 Z" fill="#f1f5f9" />
          <path d="M28 27 L20 12 L26 10 L36 24 Z" fill="#3b82f6" />
          <path d="M24 32 L16 48 L22 50 L30 31 Z" fill="#2563eb" />
          <path d="M14 31 L8 22 L12 20 L18 29 Z" fill="#ef4444" />
        </svg>
      );
    case 'ours':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fef3c7" />
          <circle cx="18" cy="22" r="8" fill="#b45309" />
          <circle cx="18" cy="22" r="4" fill="#f43f5e" />
          <circle cx="46" cy="22" r="8" fill="#b45309" />
          <circle cx="46" cy="22" r="4" fill="#f43f5e" />
          <circle cx="32" cy="34" r="18" fill="#d97706" />
          <circle cx="32" cy="38" r="8" fill="#fef3c7" />
          <ellipse cx="32" cy="35" rx="3" ry="2" fill="#1e293b" />
          <path d="M30 39 Q32 41 34 39" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="26" cy="30" r="2.5" fill="#1e293b" />
          <circle cx="38" cy="30" r="2.5" fill="#1e293b" />
          <circle cx="22" cy="36" r="2.5" fill="#f43f5e" opacity="0.6" />
          <circle cx="42" cy="36" r="2.5" fill="#f43f5e" opacity="0.6" />
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#ffedd5" />
          <path d="M15 32 L15 14 L30 25 Z" fill="#ea580c" />
          <path d="M18 29 L18 18 L27 25 Z" fill="#fda4af" />
          <path d="M49 32 L49 14 L34 25 Z" fill="#ea580c" />
          <path d="M46 29 L46 18 L37 25 Z" fill="#fda4af" />
          <circle cx="32" cy="35" r="17" fill="#f97316" />
          <ellipse cx="25" cy="32" rx="2.5" ry="3.5" fill="#1e293b" />
          <ellipse cx="39" cy="32" rx="2.5" ry="3.5" fill="#1e293b" />
          <circle cx="24" cy="31" r="1" fill="#ffffff" />
          <circle cx="38" cy="31" r="1" fill="#ffffff" />
          <polygon points="32,36 29,34 35,34" fill="#f43f5e" />
          <path d="M30 39 Q32 41 34 39" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <line x1="18" y1="36" x2="10" y2="35" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="39" x2="11" y2="40" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="36" x2="54" y2="35" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="39" x2="53" y2="40" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'baleine':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#f0f9ff" />
          <path d="M30 18 Q30 8 26 10" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M32 18 Q32 6 34 8" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M42 34 Q56 34 54 22 C52 22 47 28 44 31 Z" fill="#0284c7" />
          <ellipse cx="28" cy="36" rx="16" ry="11" fill="#0ea5e9" />
          <ellipse cx="26" cy="41" rx="12" ry="5" fill="#ffffff" />
          <circle cx="18" cy="33" r="2.5" fill="#1e293b" />
          <circle cx="17.5" cy="32" r="0.8" fill="#ffffff" />
          <path d="M26 40 Q30 48 35 44 Z" fill="#0284c7" />
          <path d="M14 38 Q18 41 22 38" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'grenouille':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
          <circle cx="21" cy="21" r="7" fill="#22c55e" />
          <circle cx="21" cy="21" r="5" fill="#ffffff" />
          <circle cx="21" cy="21" r="2.5" fill="#0f172a" />
          <circle cx="43" cy="21" r="7" fill="#22c55e" />
          <circle cx="43" cy="21" r="5" fill="#ffffff" />
          <circle cx="43" cy="21" r="2.5" fill="#0f172a" />
          <ellipse cx="32" cy="36" rx="19" ry="14" fill="#22c55e" />
          <ellipse cx="32" cy="36" rx="16" ry="11" fill="#4ade80" />
          <circle cx="19" cy="36" r="3" fill="#ec4899" opacity="0.6" />
          <circle cx="45" cy="36" r="3" fill="#ec4899" opacity="0.6" />
          <path d="M22 37 Q32 46 42 37" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'girafe':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fffbeb" />
          <line x1="26" y1="20" x2="24" y2="10" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="9" r="3" fill="#ca8a04" />
          <line x1="38" y1="20" x2="40" y2="10" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="9" r="3" fill="#ca8a04" />
          <path d="M21 21 L14 17 L18 25 Z" fill="#eab308" />
          <path d="M43 21 L50 17 L46 25 Z" fill="#eab308" />
          <rect x="26" y="32" width="12" height="24" fill="#facc15" rx="3" />
          <path d="M22 24 C22 18 42 18 42 24 L42 36 C42 42 22 42 22 36 Z" fill="#facc15" />
          <circle cx="26" cy="24" r="2" fill="#d97706" />
          <circle cx="38" cy="28" r="2.5" fill="#d97706" />
          <circle cx="29" cy="35" r="2" fill="#d97706" />
          <circle cx="31" cy="46" r="3" fill="#d97706" />
          <circle cx="28" cy="25" r="2" fill="#0f172a" />
          <circle cx="36" cy="25" r="2" fill="#0f172a" />
          <ellipse cx="32" cy="35" rx="9" ry="5" fill="#fef08a" />
          <circle cx="30" cy="35" r="1" fill="#854d0e" />
          <circle cx="34" cy="35" r="1" fill="#854d0e" />
        </svg>
      );
    case 'tortue':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
          <circle cx="20" cy="22" r="5" fill="#4ade80" />
          <circle cx="44" cy="22" r="5" fill="#4ade80" />
          <circle cx="20" cy="46" r="5" fill="#4ade80" />
          <circle cx="44" cy="46" r="5" fill="#4ade80" />
          <circle cx="32" cy="15" r="7" fill="#4ade80" />
          <circle cx="30" cy="13" r="1" fill="#0f172a" />
          <circle cx="34" cy="13" r="1" fill="#0f172a" />
          <circle cx="32" cy="34" r="16" fill="#15803d" />
          <circle cx="32" cy="34" r="13" fill="#166534" />
          <circle cx="32" cy="34" r="9" fill="#15803d" />
        </svg>
      );
    case 'renard':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fff7ed" />
          <polygon points="12,14 14,35 30,28" fill="#ea580c" />
          <polygon points="16,18 17,31 27,27" fill="#ffffff" />
          <polygon points="52,14 50,35 34,28" fill="#ea580c" />
          <polygon points="48,18 47,31 37,27" fill="#ffffff" />
          <polygon points="32,50 14,24 50,24" fill="#f97316" />
          <polygon points="32,50 14,24 26,38" fill="#ffffff" />
          <polygon points="32,50 50,24 38,38" fill="#ffffff" />
          <circle cx="23" cy="28" r="2" fill="#0f172a" />
          <circle cx="41" cy="28" r="2" fill="#0f172a" />
          <circle cx="32" cy="48" r="3" fill="#0f172a" />
        </svg>
      );
    case 'donut':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#faf5ff" />
          <circle cx="32" cy="32" r="20" fill="#fcd34d" />
          <circle cx="32" cy="32" r="17" fill="#f43f5e" />
          <circle cx="28" cy="26" r="4" fill="#f43f5e" />
          <circle cx="38" cy="28" r="4" fill="#f43f5e" />
          <circle cx="30" cy="38" r="4" fill="#f43f5e" />
          <circle cx="32" cy="32" r="7" fill="#faf5ff" />
          <line x1="22" y1="26" x2="25" y2="28" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="24" x2="40" y2="28" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="25" y1="38" x2="28" y2="36" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="38" x2="41" y2="39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="21" x2="33" y2="24" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'île':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#e0f2fe" />
          <path d="M4 42 Q32 36 60 42 L60 60 L4 60 Z" fill="#0284c7" />
          <path d="M12 44 C20 36 44 36 52 44 Z" fill="#fef08a" />
          <path d="M42 44 Q36 32 38 22" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 22 Q24 20 20 26" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 22 Q46 16 52 20" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 22 Q34 10 32 14" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 22 Q44 28 42 34" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="38" cy="24" r="2" fill="#78350f" />
          <circle cx="41" cy="23" r="1.5" fill="#78350f" />
        </svg>
      );
    case 'hibou':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#faf5ff" />
          <ellipse cx="16" cy="36" rx="6" ry="12" fill="#6d28d9" transform="rotate(-15 16 36)" />
          <ellipse cx="48" cy="36" rx="6" ry="12" fill="#6d28d9" transform="rotate(15 48 36)" />
          <ellipse cx="32" cy="36" rx="15" ry="17" fill="#7c3aed" />
          <ellipse cx="32" cy="38" rx="10" ry="11" fill="#edd9ff" />
          <path d="M28 38 Q30 40 32 38 Q34 40 36 38" fill="none" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="25" r="7" fill="#ffffff" />
          <circle cx="24" cy="25" r="3" fill="#1e293b" />
          <circle cx="23" cy="24" r="1" fill="#ffffff" />
          <circle cx="40" cy="25" r="7" fill="#ffffff" />
          <circle cx="40" cy="25" r="3" fill="#1e293b" />
          <circle cx="39" cy="24" r="1" fill="#ffffff" />
          <polygon points="32,28 29,33 35,33" fill="#fb923c" />
          <circle cx="26" cy="52" r="3" fill="#fb923c" />
          <circle cx="38" cy="52" r="3" fill="#fb923c" />
        </svg>
      );
    case 'ballon':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fff1f2" />
          <path d="M25 36 Q30 48 32 54" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M37 34 Q33 46 32 54" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="37" cy="26" rx="8" ry="11" fill="#facc15" transform="rotate(10 37 26)" />
          <polygon points="37,36 35,40 39,40" fill="#d97706" transform="rotate(10 37 26)" />
          <ellipse cx="25" cy="24" rx="9" ry="12" fill="#ef4444" transform="rotate(-10 25 24)" />
          <polygon points="25,35 23,39 27,39" fill="#b91c1c" transform="rotate(-10 25 24)" />
        </svg>
      );
    case 'fraise':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fff5f5" />
          <path d="M22 17 Q32 23 42 17" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 18 L32 10" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M18 22 C18 16 46 16 46 22 L38 48 C34 54 30 54 26 48 Z" fill="#ef4444" />
          <path d="M22 24 C22 20 42 20 42 24 L36 44 C33 48 31 48 28 44 Z" fill="#dc2626" />
          <circle cx="26" cy="26" r="1" fill="#fef08a" />
          <circle cx="38" cy="26" r="1" fill="#fef08a" />
          <circle cx="32" cy="32" r="1.2" fill="#fef08a" />
          <circle cx="27" cy="38" r="1" fill="#fef08a" />
          <circle cx="37" cy="38" r="1" fill="#fef08a" />
          <circle cx="32" cy="44" r="1" fill="#fef08a" />
        </svg>
      );
    case 'robot':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#ecfeff" />
          <line x1="32" y1="20" x2="32" y2="8" stroke="#475569" strokeWidth="3" />
          <circle cx="32" cy="7" r="3" fill="#ef4444" />
          <rect x="12" y="28" width="4" height="12" fill="#ef4444" rx="1" />
          <rect x="48" y="28" width="4" height="12" fill="#ef4444" rx="1" />
          <rect x="16" y="16" width="32" height="32" fill="#94a3b8" rx="6" stroke="#475569" strokeWidth="2.5" />
          <rect x="20" y="20" width="24" height="16" fill="#1e293b" rx="3" />
          <circle cx="27" cy="28" r="3.5" fill="#22d3ee" className="animate-pulse" />
          <circle cx="37" cy="28" r="3.5" fill="#22d3ee" className="animate-pulse" />
          <path d="M24 40 L40 40" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'lion':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fffbeb" />
          <ellipse cx="32" cy="32" rx="24" ry="24" fill="#d97706" />
          <ellipse cx="32" cy="32" rx="21" ry="21" fill="#ea580c" />
          <circle cx="20" cy="18" r="6" fill="#fcc34d" />
          <circle cx="44" cy="18" r="6" fill="#fcc34d" />
          <circle cx="32" cy="34" r="15" fill="#facc15" />
          <ellipse cx="32" cy="38" rx="5" ry="3.5" fill="#ffffff" />
          <polygon points="32,36 29,33 35,33" fill="#1e293b" />
          <path d="M30 40 Q32 42 34 40" stroke="#1e293b" strokeWidth="2" fill="none" />
          <circle cx="27" cy="29" r="2" fill="#1e293b" />
          <circle cx="37" cy="29" r="2" fill="#1e293b" />
        </svg>
      );
    case 'mouton':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#f8fafc" />
          <rect x="24" y="44" width="4" height="10" fill="#475569" rx="1.5" />
          <rect x="36" y="44" width="4" height="10" fill="#475569" rx="1.5" />
          <circle cx="24" cy="32" r="11" fill="#e2e8f0" />
          <circle cx="40" cy="32" r="11" fill="#e2e8f0" />
          <circle cx="32" cy="25" r="11" fill="#e2e8f0" />
          <circle cx="32" cy="38" r="11" fill="#e2e8f0" />
          <circle cx="32" cy="32" r="12" fill="#f1f5f9" />
          <ellipse cx="32" cy="32" rx="10" ry="8" fill="#fed7aa" />
          <circle cx="28" cy="31" r="1.5" fill="#1e293b" />
          <circle cx="36" cy="31" r="1.5" fill="#1e293b" />
          <path d="M21 30 L16 35 L21 34 Z" fill="#fed7aa" />
          <path d="M43 30 L48 35 L43 34 Z" fill="#fed7aa" />
          <circle cx="32" cy="24" r="5" fill="#ffffff" />
        </svg>
      );
    case 'pomme':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fffbeb" />
          <path d="M32 20 Q35 11 40 10" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 14 Q44 14 42 6 Q31 9 34 14" fill="#22c55e" />
          <path d="M32 22 Q20 18 16 32 Q14 48 32 52 Q50 48 48 32 Q44 18 32 22 Z" fill="#ef4444" />
          <path d="M32 24 Q24 21 20 32 Q18 45 32 49 Q46 45 44 32 Q40 21 32 24 Z" fill="#dc2626" />
          <ellipse cx="24" cy="29" rx="3" ry="5" fill="#ffffff" opacity="0.4" transform="rotate(-15 24 29)" />
        </svg>
      );
    case 'vélo':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#f0fdff" />
          <circle cx="20" cy="40" r="10" stroke="#334155" strokeWidth="3" fill="none" />
          <circle cx="20" cy="40" r="4" fill="#94a3b8" />
          <circle cx="44" cy="40" r="10" stroke="#334155" strokeWidth="3" fill="none" />
          <circle cx="44" cy="40" r="4" fill="#94a3b8" />
          <path d="M20 40 L28 28 L40 28 L44 40 L34 40 L28 28 Z" fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="28" x2="20" y2="40" stroke="#06b6d4" strokeWidth="3.5" />
          <line x1="28" y1="28" x2="26" y2="24" stroke="#06b6d4" strokeWidth="3" />
          <line x1="22" y1="24" x2="29" y2="24" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="28" x2="38" y2="20" stroke="#06b6d4" strokeWidth="3" />
          <line x1="35" y1="20" x2="41" y2="20" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'abeille':
      return (
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle cx="32" cy="32" r="28" fill="#fffdf0" />
          <ellipse cx="28" cy="18" rx="6" ry="10" fill="#e0f2fe" opacity="0.8" transform="rotate(-20 28 18)" />
          <ellipse cx="38" cy="18" rx="6" ry="10" fill="#e0f2fe" opacity="0.8" transform="rotate(20 38 18)" />
          <line x1="28" y1="24" x2="24" y2="16" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="15" r="1.5" fill="#475569" />
          <line x1="36" y1="24" x2="40" y2="16" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="15" r="1.5" fill="#475569" />
          <ellipse cx="32" cy="34" rx="14" ry="11" fill="#facc15" />
          <path d="M28 24 Q32 25 36 24 C36 43 28 43 28 24 Z" fill="#1e293b" />
          <path d="M34 24 Q36 25 38 24 C38 43 34 43 34 24 Z" fill="#1e293b" opacity="0.8" />
          <polygon points="45,34 49,32 45,30" fill="#1e293b" />
          <circle cx="24" cy="33" r="1.5" fill="#1e293b" />
          <path d="M21 36 Q23 38 25 36" stroke="#1e293b" strokeWidth="1.5" fill="none" />
        </svg>
      );
    default:
      return <span className="text-3xl">❓</span>;
  }
}

// ----------------- GAME 5: LE SON DES DINOS (Letter-to-Sound Matching) -----------------
interface SoundQuestion {
  letter: string;
  soundName: string;
  hint: string;
  choices: {
    emoji: string;
    word: string;
    isCorrect: boolean;
  }[];
}

function DinoFeedingGame({ onWin }: { onWin: () => void }) {
  const [round, setRound] = useState(1); // 1 to 5
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  const questions: Record<number, SoundQuestion> = {
    1: {
      letter: "A",
      soundName: "A",
      hint: "Où entends-tu le son [A] ?",
      choices: [
        { emoji: "✈️", word: "Avion", isCorrect: true },
        { emoji: "🧸", word: "Ours", isCorrect: false },
        { emoji: "🐱", word: "Chat", isCorrect: false },
        { emoji: "🐋", word: "Baleine", isCorrect: false },
      ],
    },
    2: {
      letter: "O",
      soundName: "O",
      hint: "Où entends-tu le son [O] ?",
      choices: [
        { emoji: "🐸", word: "Grenouille", isCorrect: false },
        { emoji: "🐻", word: "Ours", isCorrect: true },
        { emoji: "🦒", word: "Girafe", isCorrect: false },
        { emoji: "🐢", word: "Tortue", isCorrect: false },
      ],
    },
    3: {
      letter: "I",
      soundName: "I",
      hint: "Où entends-tu le son [I] ?",
      choices: [
        { emoji: "🦊", word: "Renard", isCorrect: false },
        { emoji: "🍩", word: "Donut", isCorrect: false },
        { emoji: "🏝️", word: "Île", isCorrect: true },
        { emoji: "🦉", word: "Hibou", isCorrect: false },
      ],
    },
    4: {
      letter: "R",
      soundName: "R",
      hint: "Où entends-tu le son [R] ?",
      choices: [
        { emoji: "🎈", word: "Ballon", isCorrect: false },
        { emoji: "🍓", word: "Fraise", isCorrect: false },
        { emoji: "🤖", word: "Robot", isCorrect: true },
        { emoji: "🦁", word: "Lion", isCorrect: false },
      ],
    },
    5: {
      letter: "M",
      soundName: "M",
      hint: "Où entends-tu le son [M] ?",
      choices: [
        { emoji: "🐑", word: "Mouton", isCorrect: true },
        { emoji: "🍎", word: "Pomme", isCorrect: false },
        { emoji: "🚲", word: "Vélo", isCorrect: false },
        { emoji: "🐝", word: "Abeille", isCorrect: false },
      ],
    },
  };

  const currentQ = questions[round];

  const speak = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech Synthesis blocked", e);
    }
  };

  // Pronounce round when it triggers
  useEffect(() => {
    setSelectedWord(null);
    setMessage(currentQ.hint);
    
    // Auto speak: "Où entends-tu le son A ?"
    speak(currentQ.hint);
  }, [round]);

  const handleChoiceSelect = (choice: { emoji: string; word: string; isCorrect: boolean }) => {
    if (selectedWord !== null || isDone) return;
    setSelectedWord(choice.word);

    // Speak the item name
    speak(choice.word);

    if (choice.isCorrect) {
      playDinoRoar();
      setMessage(`🌟 Bravo ! Oui ! Dans "${choice.word}" tu entends bien le son [${currentQ.letter}] !`);
      
      // Voice feedback
      setTimeout(() => {
        speak(`Bravo ! ${choice.word} avec le son ${currentQ.letter} !`);
      }, 700);

      if (round < 5) {
        setTimeout(() => {
          setRound((prev) => prev + 1);
        }, 2200);
      } else {
        setIsDone(true);
        playCorrectSound();
        onWin();
      }
    } else {
      playErrorSound();
      setMessage(`Oups ! Dans "${choice.word}", on n'entend pas le son [${currentQ.letter}]. Réessaie !`);
      speak(`Dans ${choice.word}, pas de son ${currentQ.letter}`);
      setTimeout(() => setSelectedWord(null), 1800);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setIsDone(false);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Target Title */}
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🦖 Le Son des Dinos
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Écoute la lettre demandée et touche le dessin où tu entends son son précieux !
        </p>
      </div>

      {/* Rounds tracking indicators */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((r) => (
          <div
            key={r}
            className={`w-10 h-2.5 rounded-full ${
              round > r ? 'bg-emerald-500' : round === r ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Voice Assistant speech bubble */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 mb-6 shadow-inner">
        <button
          id="btn-speak-voice-command"
          onClick={() => speak(currentQ.hint)}
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow active:scale-95 text-lg"
          title="Écouter la consigne out loud"
        >
          🔊
        </button>
        <p className="text-xs sm:text-sm font-black text-emerald-300 text-left leading-tight">
          {message}
        </p>
      </div>

      {/* Main Target Board showing Big Letter and Dino card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center w-full max-w-xl bg-slate-900/60 p-6 rounded-3xl border border-slate-700 mb-8 shadow-inner">
        {/* Cute Baby Dino column */}
        <div className="flex flex-col items-center justify-center bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/40">
          <motion.div
            animate={selectedWord ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl sm:text-8xl select-none"
          >
            🦖
          </motion.div>
          <div className="mt-4 text-center">
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 py-1 px-3 rounded-full border border-emerald-500/20">
              EXPLORATEUR 🌟
            </span>
          </div>
        </div>

        {/* Big Letter Card */}
        <button
          id="btn-pronounce-letter-board"
          onClick={() => speak(`Le son ${currentQ.letter}`)}
          className="flex flex-col items-center justify-center bg-slate-850 p-6 rounded-2xl text-center shadow-md border border-slate-750 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase">LE SON DE LA LETTRE :</span>
          <motion.h1
            key={currentQ.letter}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl sm:text-8xl font-sans font-black text-amber-500 my-2 select-none"
          >
            {currentQ.letter}
          </motion.h1>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 py-0.5 px-2 rounded-full font-mono mt-1">
            📢 Cliquez pour écouter
          </span>
        </button>
      </div>

      {/* Choice grid cards with speaker buttons */}
      <div className="w-full max-w-md">
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">
          Touche la carte où tu entends le son {currentQ.letter} :
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {currentQ.choices.map((choice) => {
            const isSelected = selectedWord === choice.word;
            const isCorrect = choice.isCorrect;

            let cardStyle = 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-emerald-500 text-white';
            if (selectedWord !== null) {
              if (isSelected) {
                cardStyle = isCorrect ? 'bg-emerald-600 border-emerald-400 text-white scale-102 shadow-lg ring-4 ring-emerald-500/30' : 'bg-red-600 border-red-500 text-white';
              } else if (isCorrect) {
                cardStyle = 'bg-emerald-650/30 border-emerald-500 text-emerald-100 opacity-60';
              } else {
                cardStyle = 'opacity-40';
              }
            }

            return (
              <button
                id={`btn-sound-choice-${choice.word}`}
                key={choice.word}
                disabled={selectedWord !== null}
                onClick={() => handleChoiceSelect(choice)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition shadow-md hover:shadow-xl active:scale-[0.98] relative overflow-hidden h-32 select-none cursor-pointer ${cardStyle}`}
              >
                {/* Visual Speaker Helper Overlay */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/50 flex items-center justify-center text-[10px] text-slate-300">
                  🔊
                </div>
                
                {/* Handcrafted Interactive SVG drawing */}
                <div className="w-14 h-14 mb-1.5 flex items-center justify-center select-none pointer-events-none">
                  <PhonicIllustration word={choice.word} />
                </div>
                
                {/* Word label */}
                <span className="font-sans font-black text-sm tracking-wide capitalize">
                  {choice.word}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completed restart block */}
      {isDone && (
        <div className="mt-8">
          <button
            id="btn-sound-game-restart"
            onClick={handleRestart}
            className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Recommencer au début</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------- GAME 6: LE PUZZLE DU T-REX (Puzzle de permutation) -----------------
interface PuzzleTile {
  id: number;
  correctIndex: number;
  currentEmoji: string;
}

function DinoJigsawGame({ onWin }: { onWin: () => void }) {
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [moves, setMoves] = useState(0);

  // 9 tiles representing a cute dino pattern
  // Row 1: 🌴, 🐣, 🌋
  // Row 2: 🦴, 🦖, 🌿
  // Row 3: 🦕, 🌻, 🐚
  const puzzleLayout = [
    { id: 0, emoji: '🌴' }, { id: 1, emoji: '🐣' }, { id: 2, emoji: '🌋' },
    { id: 3, emoji: '🦴' }, { id: 4, emoji: '🦖' }, { id: 5, emoji: '🌿' },
    { id: 6, emoji: '🦕' }, { id: 7, emoji: '🌻' }, { id: 8, emoji: '🐚' },
  ];

  const initializePuzzle = () => {
    setSelectedIndex(null);
    setIsDone(false);
    setMoves(0);

    let shuffled: PuzzleTile[] = [];
    do {
      shuffled = puzzleLayout
        .map((unit) => ({
          id: unit.id,
          correctIndex: unit.id,
          currentEmoji: unit.emoji,
        }))
        .sort(() => Math.random() - 0.5);
    } while (checkIfCorrect(shuffled)); // ensure it starts mixed!

    setTiles(shuffled);
  };

  const checkIfCorrect = (array: PuzzleTile[]) => {
    return array.every((tile, idx) => tile.id === idx);
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  const handleTileClick = (index: number) => {
    if (isDone) return;
    playClickSound();

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex === index) {
        setSelectedIndex(null);
        return;
      }

      // Swap tile elements
      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex];
      newTiles[selectedIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIndex(null);
      setMoves((m) => m + 1);

      if (checkIfCorrect(newTiles)) {
        setIsDone(true);
        playDinoRoar();
        playCorrectSound();
        onWin();
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center max-w-lg mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2 flex items-center justify-center gap-2">
          🥚 Le Puzzle du Bébé Dino
        </h2>
        <p className="text-xs sm:text-sm font-sans text-slate-300">
          Les morceaux du dessin préhistorique ont été soufflés par le volcan ! Échange les cases pour replacer chaque dessin à sa place d'origine !
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700/60 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 mb-6">
        <span>Mouvements de pièces : {moves}</span>
      </div>

      {/* Target Preview Board */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl flex flex-col items-center w-full max-w-sm mb-6 shadow-inner">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-2 font-bold">MODELE A REPRODUIRE :</span>
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-xl">
          {puzzleLayout.map((unit) => (
            <div key={unit.id} className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs select-none">
              {unit.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Main Puzzle Interactive Board */}
      <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-emerald-800 to-green-950 border-4 border-emerald-900 rounded-3xl p-5 w-full max-w-sm aspect-square shadow-2xl relative">
        {tiles.map((tile, idx) => {
          const isSelected = selectedIndex === idx;
          const isAtCorrectPlace = tile.id === idx;

          return (
            <button
              id={`puzzle-tile-${idx}`}
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`aspect-square rounded-2xl text-4xl sm:text-5xl flex items-center justify-center transition border-2 transform select-none outline-none relative touch-manipulation cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 border-white scale-105 shadow-xl rotate-3 z-10'
                  : isAtCorrectPlace
                  ? 'bg-slate-900/90 border-emerald-500 shadow-md scale-98'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-750 active:scale-95'
              }`}
            >
              <span>{tile.currentEmoji}</span>

              {/* Little lock badge when in correct position */}
              {isAtCorrectPlace && (
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          id="btn-puzzle-scramble"
          onClick={initializePuzzle}
          className="flex items-center gap-2 bg-slate-750 hover:bg-slate-700 text-white font-sans font-semibold py-2.5 px-6 rounded-full text-sm transition touch-manipulation cursor-pointer"
        >
          <Shuffle size={16} />
          <span>Mélanger à nouveau</span>
        </button>
      </div>
    </div>
  );
}
