import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, Volume2 } from 'lucide-react';

const WORDS = [
  { word: 'GATO', image: '🐱', letter: 'G' },
  { word: 'BOLA', image: '⚽', letter: 'B' },
  { word: 'CASA', image: '🏠', letter: 'C' },
  { word: 'DADO', image: '🎲', letter: 'D' },
  { word: 'ELEFANTE', image: '🐘', letter: 'E' },
  { word: 'FLOR', image: '🌸', letter: 'F' },
  { word: 'MACACO', image: '🐒', letter: 'M' },
  { word: 'ÁRVORE', image: '🌳', letter: 'A' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function LettersGame() {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const maxRounds = 8;

  const generateRound = () => {
    const wordIndex = round % WORDS.length;
    const word = WORDS[wordIndex];
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (randomLetter !== word.letter && !wrongOptions.includes(randomLetter)) {
        wrongOptions.push(randomLetter);
      }
    }
    
    const allOptions = [word.letter, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentWord(word);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (selected) => {
    if (selected === currentWord.letter) {
      setScore(s => s + 1);
      setFeedback({ type: 'correct', message: 'Muito bem! 📚' });
      setShowStars(true);
    } else {
      setFeedback({ type: 'wrong', message: `É a letra ${currentWord.letter}!` });
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

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
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
      <div className="fixed inset-0 bg-green-500/10 backdrop-blur-[1px]" />
      
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
              className="flex items-center gap-2 text-green-600 font-bold bg-white/60 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Voltar
            </motion.div>
          </Link>
          
          <div className="bg-white/60 px-4 py-2 rounded-full font-bold text-green-600">
            ⭐ {score} / {maxRounds}
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black text-green-600">
            📚 ABC das Letras
          </h1>
          <p className="text-lg text-green-500 font-bold mt-2">
            Rodada {round + 1} de {maxRounds}
          </p>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border-4 border-white/50 shadow-xl"
        >
          {currentWord && (
            <>
              <div className="text-center mb-6">
                <p className="text-xl font-bold text-gray-600 mb-4">
                  Qual é a primeira letra?
                </p>
                
                {/* Word Display */}
                <motion.div
                  key={round}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-green-100 to-lime-100 rounded-2xl p-6 border-4 border-green-200 mb-4"
                >
                  <motion.span
                    className="text-7xl block mb-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {currentWord.image}
                  </motion.span>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-green-700">
                      {currentWord.word}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => speak(currentWord.word)}
                      className="p-2 bg-green-400 rounded-full text-white"
                    >
                      <Volume2 size={20} />
                    </motion.button>
                  </div>
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
                {options.map((letter, index) => (
                  <motion.button
                    key={`${round}-${letter}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(letter)}
                    disabled={feedback !== null}
                    className="py-6 rounded-2xl font-black text-5xl bg-gradient-to-r from-green-400 to-lime-400 text-white border-4 border-white/50 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {letter}
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
                className="bg-gradient-to-br from-green-200 to-lime-200 rounded-[2rem] p-8 text-center border-4 border-green-400 shadow-2xl max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  📚
                </motion.div>
                <h2 className="text-3xl font-black text-green-600 mb-2">
                  Parabéns! 🎉
                </h2>
                <p className="text-green-500 font-bold mb-2">
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
                    <KidsButton color="green">
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
          <p className="text-xs text-green-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}