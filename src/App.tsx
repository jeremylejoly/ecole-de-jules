import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, ChevronRight, Play, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PirateGames from './components/PirateGames';
import DinoGames from './components/DinoGames';
import PoliceLegoGames from './components/PoliceLegoGames';
import NatureGames from './components/NatureGames';
import { initAudioOnInteraction, playClickSound, playCorrectSound } from './utils/audio';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [activeWorld, setActiveWorld] = useState<'pirates' | 'dinosaures' | 'police' | 'nature' | null>(null);

  // States with localStorage persistence
  const [stars, setStars] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('edu_kids_stars');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [completedGames, setCompletedGames] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('edu_kids_completed');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleAddStars = (amount: number) => {
    setStars((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('edu_kids_stars', next.toString());
      } catch (e) {
        console.warn('Error saving stars', e);
      }
      return next;
    });
  };

  const handleCompleteGame = (gameId: string) => {
    setCompletedGames((prev) => {
      const next = { ...prev, [gameId]: true };
      try {
        localStorage.setItem('edu_kids_completed', JSON.stringify(next));
      } catch (e) {
        console.warn('Error saving completed games', e);
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    setStars(0);
    setCompletedGames({});
    try {
      localStorage.removeItem('edu_kids_stars');
      localStorage.removeItem('edu_kids_completed');
    } catch (e) {
      console.warn('Error resetting progress', e);
    }
  };

  const handleStartApp = () => {
    initAudioOnInteraction();
    playCorrectSound();
    setEntered(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900 pb-12 sm:pb-16 overflow-x-hidden antialiased">
      {/* Dynamic particles background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Main Content Arena */}
      <main className="w-full flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <AnimatePresence mode="wait">
          {!entered ? (
            /* Dynamic Enter Landing Screen (re-authorizes Safari / iPad sound stack safely as well) */
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl text-center bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Core visual layout */}
              <div className="flex flex-wrap justify-center gap-4 text-4xl mb-4 select-none">
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>🦖</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>🏴‍☠️</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>🧱</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>🚓</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}>🌲</motion.span>
              </div>

              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 font-mono text-xs uppercase tracking-wider py-1.5 px-3 rounded-full border border-amber-500/25 mb-4 font-bold select-none">
                <Sparkles size={12} fill="currentColor" /> Jeux Éducatifs Interactifs
              </span>

              <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-white mb-4 leading-tight">
                L'École de Jules
              </h1>

              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-8 max-w-md mx-auto">
                Bienvenue dans ton école amusante ! Apprenons ensemble en jouant !
              </p>

              <button
                id="btn-app-enter-play"
                onClick={handleStartApp}
                className="w-full max-w-xs h-16 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 rounded-2xl font-sans font-black text-lg transition duration-150 border-b-4 border-amber-700 hover:border-amber-600 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ENTRER DANS LE JEU</span>
                <Play size={18} fill="currentColor" />
              </button>

              <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500 select-none">
                <span>⚡ 12 Activités</span>
                <span>🔊 Synthèse Sonore</span>
                <span>💡 Design iPad</span>
              </div>
            </motion.div>
          ) : (
            /* Sub worlds routes */
            <motion.div
              key="active-app-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              {activeWorld === null ? (
                <Dashboard
                  stars={stars}
                  completedGames={completedGames}
                  onSelectWorld={setActiveWorld}
                  onResetProgress={handleResetProgress}
                />
              ) : activeWorld === 'pirates' ? (
                <PirateGames
                  onBack={() => setActiveWorld(null)}
                  onAddStars={handleAddStars}
                  onCompleteGame={handleCompleteGame}
                />
              ) : activeWorld === 'dinosaures' ? (
                <DinoGames
                  onBack={() => setActiveWorld(null)}
                  onAddStars={handleAddStars}
                  onCompleteGame={handleCompleteGame}
                />
              ) : activeWorld === 'police' ? (
                <PoliceLegoGames
                  onBack={() => setActiveWorld(null)}
                  onAddStars={handleAddStars}
                  onCompleteGame={handleCompleteGame}
                />
              ) : activeWorld === 'nature' ? (
                <NatureGames
                  onBack={() => setActiveWorld(null)}
                  onAddStars={handleAddStars}
                  onCompleteGame={handleCompleteGame}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
