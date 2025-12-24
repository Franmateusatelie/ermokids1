import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import { soundEffects } from '@/components/kids/SoundEffects';

const LEVELS = [
  {
    id: 1,
    emoji: '🏠',
    items: ['🪟', '🚪', '🌳', '☀️', '🌈', '🦋', '🌺'],
    itemsDiff: ['🪟', '🚪', '🌳', '🌤️', '🌈', '🐛', '🌺'],
    differences: [3, 5],
  },
  {
    id: 2,
    emoji: '🌊',
    items: ['🐠', '🐙', '⛵', '🏖️', '🌴', '🦀', '🐚'],
    itemsDiff: ['🐟', '🐙', '⛵', '🏖️', '🌴', '🦞', '🐚'],
    differences: [0, 5],
  },
  {
    id: 3,
    emoji: '🌲',
    items: ['🦊', '🦌', '🍄', '🌸', '🦉', '🐿️', '🦝'],
    itemsDiff: ['🦊', '🦌', '🍄', '🌺', '🦉', '🐿️', '🐻'],
    differences: [3, 6],
  },
  {
    id: 4,
    emoji: '🏰',
    items: ['👑', '⚔️', '🐉', '🛡️', '💎', '🏹', '🗝️'],
    itemsDiff: ['👑', '⚔️', '🐉', '🛡️', '💍', '🏹', '🔑'],
    differences: [4, 6],
  },
  {
    id: 5,
    emoji: '🚀',
    items: ['🌟', '👽', '🛸', '🌍', '🪐', '☄️', '🌙'],
    itemsDiff: ['🌟', '👽', '🛸', '🌎', '🪐', '💫', '🌙'],
    differences: [3, 5],
  },
];

export default function SevenDifferencesGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [score, setScore] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [wrongClicks, setWrongClicks] = useState(0);

  const level = LEVELS[currentLevel];
  const differencesCount = level.differences.length;

  const handleClick = (index, isDifference) => {
    if (foundDifferences.includes(index)) return;

    if (isDifference) {
      soundEffects.playSuccess();
      const newFound = [...foundDifferences, index];
      setFoundDifferences(newFound);
      setScore(score + 20);

      if (newFound.length === differencesCount) {
        setTimeout(() => {
          soundEffects.playVictory();
          if (currentLevel + 1 >= LEVELS.length) {
            setShowWin(true);
          } else {
            setShowStars(true);
            setTimeout(() => {
              setShowStars(false);
              nextLevel();
            }, 2000);
          }
        }, 500);
      }
    } else {
      soundEffects.playError();
      setWrongClicks(wrongClicks + 1);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setFoundDifferences([]);
    setWrongClicks(0);
  };

  const restartGame = () => {
    setCurrentLevel(0);
    setFoundDifferences([]);
    setScore(0);
    setShowWin(false);
    setWrongClicks(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 p-4 overflow-hidden relative">
      <FloatingElements />
      <StarExplosion show={showStars} onComplete={() => {}} />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🔍 Jogo dos 7 Erros</h1>
          <div className="flex justify-center gap-4 text-white font-bold text-lg flex-wrap">
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Pontos: {score}
            </div>
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Nível {currentLevel + 1}/{LEVELS.length}
            </div>
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Encontrados: {foundDifferences.length}/{differencesCount}
            </div>
          </div>
        </motion.div>

        {!showWin && (
          <motion.div
            key={currentLevel}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                className="text-8xl mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {level.emoji}
              </motion.div>
              <p className="text-2xl font-bold text-gray-700">
                Encontre as {differencesCount} diferenças!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Imagem Original */}
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 border-4 border-blue-300">
                <p className="text-center text-lg font-bold text-blue-600 mb-4">Original</p>
                <div className="grid grid-cols-3 gap-3">
                  {level.items.map((item, index) => (
                    <div
                      key={`original-${index}`}
                      className="text-5xl bg-white rounded-xl p-4 text-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Imagem com Diferenças */}
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-6 border-4 border-pink-300">
                <p className="text-center text-lg font-bold text-pink-600 mb-4">Encontre as Diferenças</p>
                <div className="grid grid-cols-3 gap-3">
                  {level.itemsDiff.map((item, index) => {
                    const isDifference = level.differences.includes(index);
                    const isFound = foundDifferences.includes(index);
                    
                    return (
                      <motion.button
                        key={`difference-${index}`}
                        whileHover={{ scale: isFound ? 1 : 1.1 }}
                        whileTap={{ scale: isFound ? 1 : 0.9 }}
                        onClick={() => handleClick(index, isDifference)}
                        className={`text-5xl rounded-xl p-4 text-center relative transition-all ${
                          isFound
                            ? 'bg-green-200 ring-4 ring-green-500'
                            : 'bg-white hover:bg-yellow-100'
                        }`}
                        disabled={isFound}
                      >
                        {item}
                        {isFound && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-green-400/70 rounded-xl"
                          >
                            <CheckCircle className="w-12 h-12 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {wrongClicks > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center mt-4"
              >
                <p className="text-red-600 font-bold">Cliques errados: {wrongClicks}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {showWin && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-4xl font-black text-purple-600 mb-4">
              Você Completou Todos os Níveis!
            </h2>
            <p className="text-2xl text-gray-600 mb-6">Pontuação Final: {score}</p>
            <KidsButton color="blue" size="lg" onClick={restartGame}>
              Jogar Novamente
            </KidsButton>
          </motion.div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="purple" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
          <KidsButton color="orange" size="md" onClick={restartGame}>
            <RotateCcw className="inline mr-2" />
            Reiniciar
          </KidsButton>
        </div>
      </div>
    </div>
  );
}