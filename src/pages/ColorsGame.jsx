import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

const COLORS = [
  { name: 'Vermelho', color: 'bg-red-500', hex: '#ef4444' },
  { name: 'Azul', color: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Verde', color: 'bg-green-500', hex: '#22c55e' },
  { name: 'Amarelo', color: 'bg-yellow-400', hex: '#facc15' },
  { name: 'Rosa', color: 'bg-pink-500', hex: '#ec4899' },
  { name: 'Laranja', color: 'bg-orange-500', hex: '#f97316' },
  { name: 'Roxo', color: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Ciano', color: 'bg-cyan-500', hex: '#06b6d4' },
];

export default function ColorsGame() {
  const [currentColor, setCurrentColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const maxRounds = 8;

  const generateRound = () => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentColor(correct);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (selectedColor) => {
    if (selectedColor.name === currentColor.name) {
      setScore(s => s + 1);
      setFeedback({ type: 'correct', message: 'Muito bem! 🌟' });
      setShowStars(true);
    } else {
      setFeedback({ type: 'wrong', message: `Essa é ${selectedColor.name}!` });
    }

    setTimeout(() => {
      setFeedback(null);
      setShowStars(false);
      
      if (round + 1 >= maxRounds) {
        setGameWon(true);
      } else {
        setRound(r => r + 1);
        generateRound();
      }
    }, 1500);
  };

  const restart = () => {
    setScore(0);
    setRound(0);
    setGameWon(false);
    generateRound();
  };

  const getStars = () => {
    const percentage = (score / maxRounds) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 50) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6948130c63a4aed964627876/aa01983f5_ChatGPTImage20_12_202513_48_59.png)',
        }}
      />
      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-pink-500/10 backdrop-blur-[1px]" />
      
      <FloatingElements />
      <MusicPlayer />
      <StarExplosion show={showStars} onComplete={() => {}} />

      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Home')}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-pink-600 font-bold bg-white/60 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Voltar
            </motion.div>
          </Link>
          
          <div className="bg-white/60 px-4 py-2 rounded-full font-bold text-pink-600">
            ⭐ {score} / {maxRounds}
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black text-pink-600">
            🎨 Cores Mágicas
          </h1>
          <p className="text-lg text-pink-500 font-bold mt-2">
            Rodada {round + 1} de {maxRounds}
          </p>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border-4 border-white/50 shadow-xl"
        >
          {currentColor && (
            <>
              {/* Color Display */}
              <div className="text-center mb-6">
                <p className="text-xl font-bold text-gray-600 mb-4">
                  Qual é essa cor?
                </p>
                <motion.div
                  key={currentColor.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-32 h-32 ${currentColor.color} rounded-full mx-auto shadow-xl border-8 border-white`}
                />
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-center text-2xl font-bold mb-4 ${
                      feedback.type === 'correct' ? 'text-green-500' : 'text-orange-500'
                    }`}
                  >
                    {feedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {options.map((color, index) => (
                  <motion.button
                    key={color.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(color)}
                    disabled={feedback !== null}
                    className={`
                      py-4 px-6 rounded-2xl font-bold text-lg
                      bg-gradient-to-r from-white to-gray-50
                      border-4 border-gray-200
                      shadow-lg hover:shadow-xl
                      transition-all duration-200
                      disabled:opacity-50
                      flex items-center justify-center gap-2
                    `}
                  >
                    <span className={`w-6 h-6 rounded-full ${color.color}`} />
                    {color.name}
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Win Modal */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-[2rem] p-8 text-center border-4 border-pink-400 shadow-2xl max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎨
                </motion.div>
                <h2 className="text-3xl font-black text-purple-600 mb-2">
                  Parabéns! 🎉
                </h2>
                <p className="text-purple-500 font-bold mb-2">
                  Você acertou {score} de {maxRounds}!
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map(i => (
                    <span key={i} className={`text-4xl ${i <= getStars() ? '' : 'opacity-30'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <KidsButton color="green" onClick={restart}>
                    Jogar de novo 🔄
                  </KidsButton>
                  <Link to={createPageUrl('Home')}>
                    <KidsButton color="purple">
                      Menu 🏠
                    </KidsButton>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 py-4"
        >
          <p className="text-xs text-pink-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}