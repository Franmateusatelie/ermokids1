import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import { soundEffects } from '@/components/kids/SoundEffects';

const QUESTIONS = [
  {
    statement: 'Jogar lixo na rua',
    emoji: '🗑️',
    correct: false,
    explanation: 'ERRADO! Sempre jogue o lixo na lixeira para manter o planeta limpo!'
  },
  {
    statement: 'Plantar árvores',
    emoji: '🌳',
    correct: true,
    explanation: 'CERTO! Plantar árvores ajuda o meio ambiente e os animais!'
  },
  {
    statement: 'Machucar animais',
    emoji: '🐶',
    correct: false,
    explanation: 'ERRADO! Devemos tratar os animais com amor e respeito!'
  },
  {
    statement: 'Economizar água',
    emoji: '💧',
    correct: true,
    explanation: 'CERTO! A água é preciosa! Devemos economizar fechando a torneira!'
  },
  {
    statement: 'Gritar com as pessoas',
    emoji: '😡',
    correct: false,
    explanation: 'ERRADO! Devemos falar com calma e respeito com todo mundo!'
  },
  {
    statement: 'Ajudar os amigos',
    emoji: '🤝',
    correct: true,
    explanation: 'CERTO! Ajudar os amigos é muito importante! Somos mais felizes juntos!'
  },
  {
    statement: 'Poluir rios e mares',
    emoji: '🌊',
    correct: false,
    explanation: 'ERRADO! Poluir a água prejudica os peixes e toda a natureza!'
  },
  {
    statement: 'Reciclar materiais',
    emoji: '♻️',
    correct: true,
    explanation: 'CERTO! Reciclar ajuda o planeta e economiza recursos!'
  },
  {
    statement: 'Respeitar os idosos',
    emoji: '👴',
    correct: true,
    explanation: 'CERTO! Devemos respeitar e cuidar das pessoas mais velhas!'
  },
  {
    statement: 'Desperdiçar comida',
    emoji: '🍔',
    correct: false,
    explanation: 'ERRADO! Muitas pessoas têm fome. Não devemos desperdiçar comida!'
  },
  {
    statement: 'Cuidar dos passarinhos',
    emoji: '🐦',
    correct: true,
    explanation: 'CERTO! Os pássaros são nossos amigos e merecem cuidado!'
  },
  {
    statement: 'Deixar luzes acesas sem precisar',
    emoji: '💡',
    correct: false,
    explanation: 'ERRADO! Apague as luzes para economizar energia!'
  },
];

export default function RightWrongGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.correct;
    
    if (isCorrect) {
      soundEffects.playSuccess();
      setFeedback('correct');
      setScore(score + 10);
    } else {
      soundEffects.playError();
      setFeedback('wrong');
    }
    
    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 >= QUESTIONS.length) {
        soundEffects.playVictory();
        setShowWin(true);
        setShowStars(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setFeedback('');
        setShowExplanation(false);
      }
    }, 3000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setFeedback('');
    setShowExplanation(false);
    setShowWin(false);
    setShowStars(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 p-4 overflow-hidden relative">
      <FloatingElements />
      <StarExplosion show={showStars} onComplete={() => setShowStars(false)} />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">✅❌ Certo ou Errado</h1>
          <p className="text-white text-lg font-bold">Aprenda sobre respeito e meio ambiente!</p>
          <div className="flex justify-center gap-4 text-white font-bold text-lg mt-4">
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Pontos: {score}
            </div>
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {currentQuestion + 1}/{QUESTIONS.length}
            </div>
          </div>
        </motion.div>

        {!showWin && (
          <motion.div
            key={currentQuestion}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-9xl mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {question.emoji}
              </motion.div>
              
              <p className="text-4xl font-black text-gray-800 mb-8">
                {question.statement}
              </p>

              <p className="text-2xl font-bold text-purple-600 mb-6">
                Isso está CERTO ou ERRADO?
              </p>
            </div>

            {!showExplanation && (
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <KidsButton
                    color="green"
                    size="xl"
                    onClick={() => handleAnswer(true)}
                    className="w-full h-32 text-2xl"
                  >
                    <Check className="inline mr-2 w-12 h-12" />
                    CERTO
                  </KidsButton>
                </motion.div>

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <KidsButton
                    color="pink"
                    size="xl"
                    onClick={() => handleAnswer(false)}
                    className="w-full h-32 text-2xl"
                  >
                    <X className="inline mr-2 w-12 h-12" />
                    ERRADO
                  </KidsButton>
                </motion.div>
              </div>
            )}

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-9xl mb-4">
                    {feedback === 'correct' ? '🎉' : '💡'}
                  </div>
                  <div className={`text-2xl font-bold p-6 rounded-2xl ${
                    feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {question.explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              🌍💚
            </motion.div>
            <h2 className="text-4xl font-black text-green-600 mb-4">
              Você é incrível!
            </h2>
            <p className="text-2xl text-gray-600 mb-2">Aprendeu muito sobre respeito e meio ambiente!</p>
            <p className="text-xl text-gray-600 mb-6">Pontuação: {score}</p>
            <KidsButton color="green" size="lg" onClick={restartGame}>
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
        </div>
      </div>
    </div>
  );
}