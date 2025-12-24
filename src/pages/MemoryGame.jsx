import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

const EMOJIS = ['🦁', '🐸', '🦋', '🌺', '🌈', '⭐', '🎈', '🍎'];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    const pairs = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
    }));
    setCards(shuffleArray(pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (matched.length === EMOJIS.length * 2 && matched.length > 0) {
      setGameWon(true);
      setShowStars(true);
    }
  }, [matched]);

  const handleCardClick = (cardId) => {
    if (flipped.length === 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const getStars = () => {
    if (moves <= 10) return 3;
    if (moves <= 15) return 2;
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
      <div className="fixed inset-0 bg-purple-500/10 backdrop-blur-[1px]" />
      
      <FloatingElements />
      <MusicPlayer />
      <StarExplosion show={showStars} onComplete={() => setShowStars(false)} />

      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Home')}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-purple-600 font-bold bg-white/60 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Voltar
            </motion.div>
          </Link>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={initGame}
            className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 rounded-full cursor-pointer shadow-lg"
          >
            <RotateCcw size={20} />
            Reiniciar
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black text-purple-600">
            🧠 Jogo da Memória
          </h1>
          <p className="text-lg text-purple-500 font-bold mt-2">
            Movimentos: {moves}
          </p>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-4 border-4 border-white/50 shadow-xl"
        >
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
              
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square cursor-pointer"
                >
                  <motion.div
                    className="w-full h-full rounded-2xl flex items-center justify-center text-4xl shadow-lg border-4"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {isFlipped ? (
                      <motion.div
                        className={`w-full h-full rounded-2xl flex items-center justify-center ${
                          matched.includes(card.id) 
                            ? 'bg-gradient-to-br from-green-300 to-green-400 border-green-400' 
                            : 'bg-gradient-to-br from-pink-300 to-purple-300 border-purple-400'
                        }`}
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        {card.emoji}
                      </motion.div>
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 border-purple-400 flex items-center justify-center">
                        <span className="text-white text-2xl">❓</span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
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
                className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-[2rem] p-8 text-center border-4 border-yellow-400 shadow-2xl max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  <Trophy className="mx-auto text-yellow-500 w-20 h-20" />
                </motion.div>
                <h2 className="text-3xl font-black text-orange-600 mb-2">
                  Parabéns! 🎉
                </h2>
                <p className="text-orange-500 font-bold mb-2">
                  Você completou em {moves} movimentos!
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map(i => (
                    <span key={i} className={`text-4xl ${i <= getStars() ? '' : 'opacity-30'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <KidsButton color="green" onClick={initGame}>
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
          <p className="text-xs text-purple-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}