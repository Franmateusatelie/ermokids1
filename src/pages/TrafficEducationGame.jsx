import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import { soundEffects } from '@/components/kids/SoundEffects';

const QUESTIONS = [
  {
    question: 'O que significa o semáforo VERMELHO?',
    emoji: '🔴',
    options: ['Pare!', 'Atenção!', 'Siga!'],
    correct: 'Pare!',
    explanation: 'Vermelho significa PARE! Espere o sinal verde.'
  },
  {
    question: 'O que significa o semáforo AMARELO?',
    emoji: '🟡',
    options: ['Acelere!', 'Atenção!', 'Pare!'],
    correct: 'Atenção!',
    explanation: 'Amarelo significa ATENÇÃO! Prepare-se para parar.'
  },
  {
    question: 'O que significa o semáforo VERDE?',
    emoji: '🟢',
    options: ['Pare!', 'Atenção!', 'Siga!'],
    correct: 'Siga!',
    explanation: 'Verde significa SIGA! Você pode passar com segurança.'
  },
  {
    question: 'Para que serve a faixa de pedestres?',
    emoji: '🚶',
    options: ['Para carros', 'Para atravessar a rua', 'Para bicicletas'],
    correct: 'Para atravessar a rua',
    explanation: 'A faixa de pedestres é onde devemos atravessar a rua com segurança!'
  },
  {
    question: 'Onde devemos olhar antes de atravessar?',
    emoji: '👀',
    options: ['Para o chão', 'Para os dois lados', 'Para cima'],
    correct: 'Para os dois lados',
    explanation: 'Sempre olhe para os dois lados antes de atravessar a rua!'
  },
  {
    question: 'O que significa essa placa? 🛑',
    emoji: '🛑',
    options: ['Pare', 'Cuidado', 'Rápido'],
    correct: 'Pare',
    explanation: 'Esta é a placa de PARE. Todo veículo deve parar!'
  },
  {
    question: 'Onde é seguro brincar?',
    emoji: '⚽',
    options: ['Na rua', 'No parque', 'Na garagem'],
    correct: 'No parque',
    explanation: 'Brincar no parque ou área segura é sempre melhor!'
  },
  {
    question: 'No carro, onde devemos sentar?',
    emoji: '👶',
    options: ['No banco da frente', 'No banco de trás com cadeirinha', 'Em pé'],
    correct: 'No banco de trás com cadeirinha',
    explanation: 'Crianças devem sempre usar cadeirinha no banco de trás!'
  },
];

export default function TrafficEducationGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const handleAnswer = (answer) => {
    if (answer === question.correct) {
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-4 overflow-hidden relative">
      <FloatingElements />
      <StarExplosion show={showStars} onComplete={() => setShowStars(false)} />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🚦 Educação no Trânsito</h1>
          <div className="flex justify-center gap-4 text-white font-bold text-lg">
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
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {question.emoji}
              </motion.div>
              
              <p className="text-3xl font-black text-gray-800 mb-8">
                {question.question}
              </p>
            </div>

            {!showExplanation && (
              <div className="grid gap-4">
                {question.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <KidsButton
                      color={['red', 'yellow', 'green'][index]}
                      size="xl"
                      onClick={() => handleAnswer(option)}
                      className="w-full"
                    >
                      {option}
                    </KidsButton>
                  </motion.div>
                ))}
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
                  <div className="text-8xl mb-4">
                    {feedback === 'correct' ? '✅' : '❌'}
                  </div>
                  <div className={`text-2xl font-bold p-4 rounded-2xl ${
                    feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
              🏆
            </motion.div>
            <h2 className="text-4xl font-black text-orange-600 mb-4">
              Parabéns!
            </h2>
            <p className="text-2xl text-gray-600 mb-2">Você é um expert em segurança no trânsito!</p>
            <p className="text-xl text-gray-600 mb-6">Pontuação: {score}</p>
            <KidsButton color="orange" size="lg" onClick={restartGame}>
              Jogar Novamente
            </KidsButton>
          </motion.div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="blue" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}