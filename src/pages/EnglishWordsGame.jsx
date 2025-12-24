import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import { soundEffects } from '@/components/kids/SoundEffects';

const WORDS = [
  { word: 'Cat', emoji: '🐱' },
  { word: 'Dog', emoji: '🐶' },
  { word: 'Fish', emoji: '🐟' },
  { word: 'Bird', emoji: '🐦' },
  { word: 'Apple', emoji: '🍎' },
  { word: 'Banana', emoji: '🍌' },
  { word: 'Orange', emoji: '🍊' },
  { word: 'Sun', emoji: '☀️' },
  { word: 'Moon', emoji: '🌙' },
  { word: 'Star', emoji: '⭐' },
  { word: 'Tree', emoji: '🌳' },
  { word: 'Flower', emoji: '🌸' },
  { word: 'House', emoji: '🏠' },
  { word: 'Car', emoji: '🚗' },
  { word: 'Book', emoji: '📚' },
  { word: 'Heart', emoji: '❤️' },
  { word: 'Ball', emoji: '⚽' },
  { word: 'Water', emoji: '💧' },
];

const COLORS = [
  { word: 'Red', color: 'bg-red-500' },
  { word: 'Blue', color: 'bg-blue-500' },
  { word: 'Green', color: 'bg-green-500' },
  { word: 'Yellow', color: 'bg-yellow-400' },
  { word: 'Orange', color: 'bg-orange-500' },
  { word: 'Purple', color: 'bg-purple-500' },
  { word: 'Pink', color: 'bg-pink-400' },
  { word: 'Brown', color: 'bg-amber-700' },
  { word: 'Black', color: 'bg-black' },
  { word: 'White', color: 'bg-white border-4 border-gray-300' },
  { word: 'Gray', color: 'bg-gray-500' },
  { word: 'Cyan', color: 'bg-cyan-500' },
  { word: 'Magenta', color: 'bg-fuchsia-500' },
  { word: 'Lime', color: 'bg-lime-500' },
  { word: 'Indigo', color: 'bg-indigo-500' },
  { word: 'Teal', color: 'bg-teal-500' },
  { word: 'Gold', color: 'bg-yellow-500' },
  { word: 'Silver', color: 'bg-gray-400' },
  { word: 'Maroon', color: 'bg-red-900' },
  { word: 'Navy', color: 'bg-blue-900' },
  { word: 'Violet', color: 'bg-violet-500' },
  { word: 'Turquoise', color: 'bg-cyan-400' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const NUMBERS = Array.from({ length: 51 }, (_, i) => ({
  number: i,
  word: [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
    'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven', 'Twenty-eight', 'Twenty-nine', 'Thirty',
    'Thirty-one', 'Thirty-two', 'Thirty-three', 'Thirty-four', 'Thirty-five', 'Thirty-six', 'Thirty-seven', 'Thirty-eight', 'Thirty-nine', 'Forty',
    'Forty-one', 'Forty-two', 'Forty-three', 'Forty-four', 'Forty-five', 'Forty-six', 'Forty-seven', 'Forty-eight', 'Forty-nine', 'Fifty'
  ][i]
}));

const EXERCISES = [
  { type: 'complete', sentence: 'The sky is ___', options: ['blue', 'red', 'green'], correct: 'blue', emoji: '🌤️', audio: 'The sky is blue' },
  { type: 'complete', sentence: 'I have ___ eyes', options: ['two', 'three', 'four'], correct: 'two', emoji: '👀', audio: 'I have two eyes' },
  { type: 'complete', sentence: 'The sun is ___', options: ['yellow', 'blue', 'black'], correct: 'yellow', emoji: '☀️', audio: 'The sun is yellow' },
  { type: 'number', sentence: 'How many fingers? ✋', options: ['Five', 'Ten', 'Three'], correct: 'Five', emoji: '✋', audio: 'How many fingers? Five!' },
  { type: 'number', sentence: 'One plus one equals ___', options: ['Two', 'Three', 'Four'], correct: 'Two', emoji: '➕', audio: 'One plus one equals two' },
  { type: 'complete', sentence: 'Cats say ___', options: ['meow', 'woof', 'quack'], correct: 'meow', emoji: '🐱', audio: 'Cats say meow' },
  { type: 'complete', sentence: 'I ___ with my eyes', options: ['see', 'hear', 'smell'], correct: 'see', emoji: '👁️', audio: 'I see with my eyes' },
  { type: 'number', sentence: 'How many wheels on a car? 🚗', options: ['Four', 'Two', 'Six'], correct: 'Four', emoji: '🚗', audio: 'A car has four wheels' },
];

export default function EnglishWordsGame() {
  const [mode, setMode] = useState('menu');
  const [subMode, setSubMode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [level, setLevel] = useState(1);
  const [showStars, setShowStars] = useState(false);
  const [feedback, setFeedback] = useState('');

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startLearnWords = () => {
    setMode('learn');
    setSubMode('words');
    setCurrentIndex(0);
    setCurrentItem(WORDS[0]);
  };

  const startLearnAlphabet = () => {
    setMode('learn');
    setSubMode('alphabet');
    setCurrentIndex(0);
    setCurrentItem(ALPHABET[0]);
    speakText(ALPHABET[0]);
  };

  const startLearnNumbers = () => {
    setMode('learn');
    setSubMode('numbers');
    setCurrentIndex(0);
    setCurrentItem(NUMBERS[0]);
  };

  const startLearnColors = () => {
    setMode('learn');
    setSubMode('colors');
    setCurrentIndex(0);
    setCurrentItem(COLORS[0]);
  };

  const startQuiz = () => {
    setMode('quiz');
    setSubMode('words');
    setScore(0);
    setRound(0);
    generateQuizRound();
  };

  const startExercises = () => {
    setMode('exercise');
    setScore(0);
    setRound(0);
    setCurrentItem(EXERCISES[0]);
  };

  const generateQuizRound = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const wrongOptions = WORDS.filter((w) => w.word !== word.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const allOptions = [word, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentItem(word);
    setOptions(allOptions);
    setFeedback('');
    
    setTimeout(() => speakText(word.word), 500);
  };

  const handleQuizAnswer = (selectedWord) => {
    if (selectedWord.word === currentItem.word) {
      soundEffects.playSuccess();
      setFeedback('correct');
      setScore(score + 10);
      
      setTimeout(() => {
        const nextRound = round + 1;
        const roundsPerLevel = 5 + (level * 2);
        
        if (nextRound >= roundsPerLevel) {
          soundEffects.playVictory();
          setLevel(level + 1);
          setShowStars(true);
          setTimeout(() => {
            setShowStars(false);
            setRound(0);
            generateQuizRound();
          }, 2000);
        } else {
          setRound(nextRound);
          generateQuizRound();
        }
      }, 1000);
    } else {
      soundEffects.playError();
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('');
        speakText(currentItem.word);
      }, 1000);
    }
  };

  const handleExerciseAnswer = (answer) => {
    if (answer === currentItem.correct) {
      soundEffects.playSuccess();
      setFeedback('correct');
      setScore(score + 10);
      
      setTimeout(() => {
        if (round + 1 >= EXERCISES.length) {
          soundEffects.playVictory();
          setShowStars(true);
          setTimeout(() => {
            setShowStars(false);
            setRound(0);
            setCurrentItem(EXERCISES[0]);
          }, 2000);
        } else {
          setRound(round + 1);
          setCurrentItem(EXERCISES[round + 1]);
          setFeedback('');
        }
      }, 1500);
    } else {
      soundEffects.playError();
      setFeedback('wrong');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  const nextItem = () => {
    if (subMode === 'words') {
      const next = (currentIndex + 1) % WORDS.length;
      setCurrentIndex(next);
      setCurrentItem(WORDS[next]);
    } else if (subMode === 'alphabet') {
      const next = (currentIndex + 1) % ALPHABET.length;
      setCurrentIndex(next);
      setCurrentItem(ALPHABET[next]);
      speakText(ALPHABET[next]);
    } else if (subMode === 'numbers') {
      const next = (currentIndex + 1) % NUMBERS.length;
      setCurrentIndex(next);
      setCurrentItem(NUMBERS[next]);
    } else if (subMode === 'colors') {
      const next = (currentIndex + 1) % COLORS.length;
      setCurrentIndex(next);
      setCurrentItem(COLORS[next]);
    }
  };

  const prevItem = () => {
    if (subMode === 'words') {
      const prev = (currentIndex - 1 + WORDS.length) % WORDS.length;
      setCurrentIndex(prev);
      setCurrentItem(WORDS[prev]);
    } else if (subMode === 'alphabet') {
      const prev = (currentIndex - 1 + ALPHABET.length) % ALPHABET.length;
      setCurrentIndex(prev);
      setCurrentItem(ALPHABET[prev]);
      speakText(ALPHABET[prev]);
    } else if (subMode === 'numbers') {
      const prev = (currentIndex - 1 + NUMBERS.length) % NUMBERS.length;
      setCurrentIndex(prev);
      setCurrentItem(NUMBERS[prev]);
    } else if (subMode === 'colors') {
      const prev = (currentIndex - 1 + COLORS.length) % COLORS.length;
      setCurrentIndex(prev);
      setCurrentItem(COLORS[prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 overflow-hidden relative">
      <FloatingElements />
      <StarExplosion show={showStars} onComplete={() => {}} />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🌍 Learning English</h1>
          <p className="text-white text-lg font-bold">Learn English with fun!</p>
        </motion.div>

        {/* Menu */}
        {mode === 'menu' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startLearnWords}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">📖</div>
                <div>
                  <h2 className="text-2xl font-black text-blue-600">Learn Words</h2>
                  <p className="text-gray-600">Click and listen to words</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startLearnAlphabet}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔤</div>
                <div>
                  <h2 className="text-2xl font-black text-purple-600">Learn Alphabet</h2>
                  <p className="text-gray-600">A to Z in English</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startLearnNumbers}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔢</div>
                <div>
                  <h2 className="text-2xl font-black text-green-600">Learn Numbers</h2>
                  <p className="text-gray-600">0 to 50 in English</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startLearnColors}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎨</div>
                <div>
                  <h2 className="text-2xl font-black text-pink-600">Learn Colors</h2>
                  <p className="text-gray-600">22 colors in English</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startQuiz}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎯</div>
                <div>
                  <h2 className="text-2xl font-black text-pink-600">Quiz Mode</h2>
                  <p className="text-gray-600">Test your knowledge</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white shadow-2xl cursor-pointer" onClick={startExercises}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">✏️</div>
                <div>
                  <h2 className="text-2xl font-black text-orange-600">Exercises</h2>
                  <p className="text-gray-600">Practice English questions</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <Link to={createPageUrl('Home')}>
                <KidsButton color="orange" size="md">
                  <ArrowLeft className="inline mr-2" />
                  Back
                </KidsButton>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Learn Mode - Words */}
        {mode === 'learn' && subMode === 'words' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakText(currentItem.word)}
                className="text-9xl mb-6 cursor-pointer"
              >
                {currentItem.emoji}
              </motion.button>
              
              <motion.p className="text-6xl font-black text-blue-600 mb-6">
                {currentItem.word}
              </motion.p>

              <KidsButton color="blue" size="xl" onClick={() => speakText(currentItem.word)} className="mb-6">
                <Volume2 className="inline mr-2" size={32} />
                Listen
              </KidsButton>

              <div className="flex justify-center gap-4 mt-8">
                <KidsButton color="purple" size="lg" onClick={prevItem}>⬅️ Previous</KidsButton>
                <KidsButton color="purple" size="lg" onClick={nextItem}>Next ➡️</KidsButton>
              </div>

              <div className="flex justify-center mt-6">
                <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                  <ArrowLeft className="inline mr-2" />Back to Menu
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learn Mode - Alphabet */}
        {mode === 'learn' && subMode === 'alphabet' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakText(currentItem)}
                className="text-9xl mb-6 cursor-pointer font-black text-purple-600"
              >
                {currentItem}
              </motion.button>
              
              <KidsButton color="purple" size="xl" onClick={() => speakText(currentItem)} className="mb-6">
                <Volume2 className="inline mr-2" size={32} />
                Listen
              </KidsButton>

              <div className="grid grid-cols-6 gap-2 my-6">
                {ALPHABET.map((letter, idx) => (
                  <motion.button
                    key={letter}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setCurrentItem(letter);
                      speakText(letter);
                    }}
                    className={`text-3xl font-black p-3 rounded-xl ${
                      currentItem === letter ? 'bg-purple-200 ring-4 ring-purple-400' : 'bg-white hover:bg-purple-50'
                    }`}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <KidsButton color="blue" size="lg" onClick={prevItem}>⬅️</KidsButton>
                <KidsButton color="blue" size="lg" onClick={nextItem}>➡️</KidsButton>
              </div>

              <div className="flex justify-center mt-6">
                <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                  <ArrowLeft className="inline mr-2" />Back
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learn Mode - Numbers */}
        {mode === 'learn' && subMode === 'numbers' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.div className="text-9xl mb-6 font-black text-green-600">
                {currentItem.number}
              </motion.div>
              
              <motion.p className="text-5xl font-black text-blue-600 mb-6">
                {currentItem.word}
              </motion.p>

              <KidsButton color="green" size="xl" onClick={() => speakText(currentItem.word)} className="mb-6">
                <Volume2 className="inline mr-2" size={32} />
                Listen
              </KidsButton>

              <div className="flex justify-center gap-4">
                <KidsButton color="blue" size="lg" onClick={prevItem}>⬅️ Previous</KidsButton>
                <KidsButton color="blue" size="lg" onClick={nextItem}>Next ➡️</KidsButton>
              </div>

              <div className="flex justify-center mt-6">
                <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                  <ArrowLeft className="inline mr-2" />Back
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="flex justify-between text-white font-bold text-lg mb-6">
              <div className="bg-blue-500 px-4 py-2 rounded-full">Score: {score}</div>
              <div className="bg-purple-500 px-4 py-2 rounded-full flex items-center gap-2">
                <Trophy className="w-5 h-5" />Level {level}
              </div>
            </div>

            <div className="text-center mb-8">
              <motion.div className="text-9xl mb-6">{currentItem.emoji}</motion.div>
              <KidsButton color="blue" size="lg" onClick={() => speakText(currentItem.word)}>
                <Volume2 className="inline mr-2" />Listen Again
              </KidsButton>
              <p className="text-2xl text-gray-600 mt-6 font-bold">What word is this?</p>
            </div>

            <div className="grid gap-4">
              {options.map((option, index) => (
                <motion.div key={index} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
                  <KidsButton color={['purple', 'pink', 'blue'][index]} size="xl" onClick={() => handleQuizAnswer(option)} className="w-full">
                    {option.emoji} {option.word}
                  </KidsButton>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {feedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-center mt-6 text-6xl">✅</motion.div>}
              {feedback === 'wrong' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-center mt-6 text-6xl">❌</motion.div>}
            </AnimatePresence>

            <div className="flex justify-center mt-6">
              <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                <ArrowLeft className="inline mr-2" />Back
              </KidsButton>
            </div>
          </motion.div>
        )}

        {/* Learn Mode - Colors */}
        {mode === 'learn' && subMode === 'colors' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                className={`w-48 h-48 mx-auto rounded-3xl mb-6 ${currentItem.color}`}
                whileHover={{ scale: 1.05 }}
              />
              
              <motion.p className="text-6xl font-black text-gray-800 mb-6">
                {currentItem.word}
              </motion.p>

              <KidsButton color="pink" size="xl" onClick={() => speakText(currentItem.word)} className="mb-6">
                <Volume2 className="inline mr-2" size={32} />
                Listen
              </KidsButton>

              <div className="grid grid-cols-4 gap-2 my-6">
                {COLORS.map((color, idx) => (
                  <motion.button
                    key={color.word}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setCurrentItem(color);
                      speakText(color.word);
                    }}
                    className={`h-16 rounded-xl ${color.color} ${
                      currentItem.word === color.word ? 'ring-4 ring-black scale-110' : ''
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <KidsButton color="blue" size="lg" onClick={prevItem}>⬅️</KidsButton>
                <KidsButton color="blue" size="lg" onClick={nextItem}>➡️</KidsButton>
              </div>

              <div className="flex justify-center mt-6">
                <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                  <ArrowLeft className="inline mr-2" />Back
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Exercise Mode */}
        {mode === 'exercise' && currentItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="flex justify-between text-white font-bold text-lg mb-6">
              <div className="bg-orange-500 px-4 py-2 rounded-full">Score: {score}</div>
              <div className="bg-green-500 px-4 py-2 rounded-full">Question {round + 1}/{EXERCISES.length}</div>
            </div>

            <div className="text-center mb-8">
              <motion.div className="text-9xl mb-6">{currentItem.emoji}</motion.div>
              <p className="text-3xl font-black text-gray-700 mb-6">{currentItem.sentence}</p>
              <KidsButton color="blue" size="md" onClick={() => speakText(currentItem.audio)} className="mb-4">
                <Volume2 className="inline mr-2" />Listen
              </KidsButton>
            </div>

            <div className="grid gap-4">
              {currentItem.options.map((option, index) => (
                <motion.div key={index} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
                  <KidsButton color={['green', 'blue', 'purple'][index]} size="xl" onClick={() => handleExerciseAnswer(option)} className="w-full">
                    {option}
                  </KidsButton>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {feedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-center mt-6 text-6xl">✅</motion.div>}
              {feedback === 'wrong' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-center mt-6 text-6xl">❌</motion.div>}
            </AnimatePresence>

            <div className="flex justify-center mt-6">
              <KidsButton color="orange" size="md" onClick={() => setMode('menu')}>
                <ArrowLeft className="inline mr-2" />Back
              </KidsButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}