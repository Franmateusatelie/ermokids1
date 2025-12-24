import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, Circle, Square, Triangle, Star, Heart, Hexagon } from 'lucide-react';

const SHAPES = [
  { name: 'Círculo', icon: Circle, color: 'text-red-500 fill-red-200' },
  { name: 'Quadrado', icon: Square, color: 'text-blue-500 fill-blue-200' },
  { name: 'Triângulo', icon: Triangle, color: 'text-green-500 fill-green-200' },
  { name: 'Estrela', icon: Star, color: 'text-yellow-500 fill-yellow-200' },
  { name: 'Coração', icon: Heart, color: 'text-pink-500 fill-pink-200' },
  { name: 'Hexágono', icon: Hexagon, color: 'text-purple-500 fill-purple-200' },
];

export default function ShapesGame() {
  const [currentShape, setCurrentShape] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const maxRounds = 8;

  const generateRound = () => {
    const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentShape(correct);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (selected) => {
    if (selected.name === currentShape.name) {
      setScore(s => s + 1);
      setFeedback({ type: 'correct', message: 'Perfeito! ⭐' });
      setShowStars(true);
    } else {
      setFeedback({ type: 'wrong', message: `É um ${currentShape.name}!` });
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
      <div className="fixed inset-0 bg-cyan-500/10 backdrop-blur-[1px]" />
      
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
              className="flex items-center gap-2 text-cyan-600 font-bold bg-white/60 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Voltar
            </motion.div>
          </Link>
          
          <div className="bg-white/60 px-4 py-2 rounded-full font-bold text-cyan-600">
            ⭐ {score} / {maxRounds}
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black text-cyan-600">
            ⭐ Formas Geométricas
          </h1>
          <p className="text-lg text-cyan-500 font-bold mt-2">
            Rodada {round + 1} de {maxRounds}
          </p>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border-4 border-white/50 shadow-xl"
        >
          {currentShape && (
            <>
              <div className="text-center mb-6">
                <p className="text-xl font-bold text-gray-600 mb-4">
                  Qual é essa forma?
                </p>
                
                {/* Shape Display */}
                <motion.div
                  key={round}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-4 border-gray-200 mb-4 inline-block"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <currentShape.icon 
                      size={120} 
                      className={currentShape.color}
                      strokeWidth={2}
                    />
                  </motion.div>
                </motion.div>
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
                {options.map((shape, index) => (
                  <motion.button
                    key={`${round}-${shape.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(shape)}
                    disabled={feedback !== null}
                    className="py-4 px-6 rounded-2xl font-bold text-lg bg-gradient-to-r from-white to-gray-50 border-4 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <shape.icon size={24} className={shape.color} strokeWidth={2} />
                    {shape.name}
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
                className="bg-gradient-to-br from-cyan-200 to-blue-200 rounded-[2rem] p-8 text-center border-4 border-cyan-400 shadow-2xl max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex justify-center gap-2 mb-4"
                >
                  <Circle className="w-12 h-12 text-red-500 fill-red-200" />
                  <Square className="w-12 h-12 text-blue-500 fill-blue-200" />
                  <Triangle className="w-12 h-12 text-green-500 fill-green-200" />
                </motion.div>
                <h2 className="text-3xl font-black text-cyan-600 mb-2">
                  Parabéns! 🎉
                </h2>
                <p className="text-cyan-500 font-bold mb-2">
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
                    <KidsButton color="blue">
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
          <p className="text-xs text-cyan-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}