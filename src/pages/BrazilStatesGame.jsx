import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

const BRAZILIAN_STATES = [
  { state: 'São Paulo', capital: 'São Paulo', region: 'Sudeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg/320px-Bandeira_do_estado_de_S%C3%A3o_Paulo.svg.png' },
  { state: 'Rio de Janeiro', capital: 'Rio de Janeiro', region: 'Sudeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg/320px-Bandeira_do_estado_do_Rio_de_Janeiro.svg.png' },
  { state: 'Minas Gerais', capital: 'Belo Horizonte', region: 'Sudeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Bandeira_de_Minas_Gerais.svg/320px-Bandeira_de_Minas_Gerais.svg.png' },
  { state: 'Bahia', capital: 'Salvador', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bandeira_da_Bahia.svg/320px-Bandeira_da_Bahia.svg.png' },
  { state: 'Paraná', capital: 'Curitiba', region: 'Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Bandeira_do_Paran%C3%A1.svg/320px-Bandeira_do_Paran%C3%A1.svg.png' },
  { state: 'Rio Grande do Sul', capital: 'Porto Alegre', region: 'Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Bandeira_do_Rio_Grande_do_Sul.svg/320px-Bandeira_do_Rio_Grande_do_Sul.svg.png' },
  { state: 'Pernambuco', capital: 'Recife', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Bandeira_de_Pernambuco.svg/320px-Bandeira_de_Pernambuco.svg.png' },
  { state: 'Ceará', capital: 'Fortaleza', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bandeira_do_Cear%C3%A1.svg/320px-Bandeira_do_Cear%C3%A1.svg.png' },
  { state: 'Pará', capital: 'Belém', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bandeira_do_Par%C3%A1.svg/320px-Bandeira_do_Par%C3%A1.svg.png' },
  { state: 'Santa Catarina', capital: 'Florianópolis', region: 'Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bandeira_de_Santa_Catarina.svg/320px-Bandeira_de_Santa_Catarina.svg.png' },
  { state: 'Goiás', capital: 'Goiânia', region: 'Centro-Oeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flag_of_Goi%C3%A1s.svg/320px-Flag_of_Goi%C3%A1s.svg.png' },
  { state: 'Maranhão', capital: 'São Luís', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandeira_do_Maranh%C3%A3o.svg/320px-Bandeira_do_Maranh%C3%A3o.svg.png' },
  { state: 'Amazonas', capital: 'Manaus', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bandeira_do_Amazonas.svg/320px-Bandeira_do_Amazonas.svg.png' },
  { state: 'Espírito Santo', capital: 'Vitória', region: 'Sudeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bandeira_do_Esp%C3%ADrito_Santo.svg/320px-Bandeira_do_Esp%C3%ADrito_Santo.svg.png' },
  { state: 'Paraíba', capital: 'João Pessoa', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Bandeira_da_Para%C3%ADba.svg/320px-Bandeira_da_Para%C3%ADba.svg.png' },
  { state: 'Rio Grande do Norte', capital: 'Natal', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bandeira_do_Rio_Grande_do_Norte.svg/320px-Bandeira_do_Rio_Grande_do_Norte.svg.png' },
  { state: 'Alagoas', capital: 'Maceió', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bandeira_de_Alagoas.svg/320px-Bandeira_de_Alagoas.svg.png' },
  { state: 'Piauí', capital: 'Teresina', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Bandeira_do_Piau%C3%AD.svg/320px-Bandeira_do_Piau%C3%AD.svg.png' },
  { state: 'Distrito Federal', capital: 'Brasília', region: 'Centro-Oeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg/320px-Bandeira_do_Distrito_Federal_%28Brasil%29.svg.png' },
  { state: 'Mato Grosso', capital: 'Cuiabá', region: 'Centro-Oeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Bandeira_de_Mato_Grosso.svg/320px-Bandeira_de_Mato_Grosso.svg.png' },
  { state: 'Mato Grosso do Sul', capital: 'Campo Grande', region: 'Centro-Oeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg/320px-Bandeira_de_Mato_Grosso_do_Sul.svg.png' },
  { state: 'Sergipe', capital: 'Aracaju', region: 'Nordeste', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Bandeira_de_Sergipe.svg/320px-Bandeira_de_Sergipe.svg.png' },
  { state: 'Rondônia', capital: 'Porto Velho', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Bandeira_de_Rond%C3%B4nia.svg/320px-Bandeira_de_Rond%C3%B4nia.svg.png' },
  { state: 'Tocantins', capital: 'Palmas', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Bandeira_do_Tocantins.svg/320px-Bandeira_do_Tocantins.svg.png' },
  { state: 'Acre', capital: 'Rio Branco', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bandeira_do_Acre.svg/320px-Bandeira_do_Acre.svg.png' },
  { state: 'Amapá', capital: 'Macapá', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bandeira_do_Amap%C3%A1.svg/320px-Bandeira_do_Amap%C3%A1.svg.png' },
  { state: 'Roraima', capital: 'Boa Vista', region: 'Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bandeira_de_Roraima.svg/320px-Bandeira_de_Roraima.svg.png' },
];

export default function BrazilStatesGame() {
  const [gameMode, setGameMode] = useState(null); // 'learn' or 'quiz'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentState = BRAZILIAN_STATES[currentIndex];

  const generateQuestion = () => {
    const types = ['capital', 'state'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const correctState = BRAZILIAN_STATES[Math.floor(Math.random() * BRAZILIAN_STATES.length)];
    const wrongStates = BRAZILIAN_STATES
      .filter(s => s.state !== correctState.state)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctState, ...wrongStates].sort(() => Math.random() - 0.5);

    if (type === 'capital') {
      return {
        type: 'capital',
        question: `Qual é a capital de ${correctState.state}?`,
        correctAnswer: correctState.capital,
        options: options.map(s => s.capital),
        flag: correctState.flag,
      };
    } else {
      return {
        type: 'state',
        question: `Qual estado tem a capital ${correctState.capital}?`,
        correctAnswer: correctState.state,
        options: options.map(s => s.state),
        flag: correctState.flag,
      };
    }
  };

  const startQuiz = () => {
    setGameMode('quiz');
    setScore(0);
    setLives(3);
    setGameOver(false);
    setQuestion(generateQuestion());
    soundEffects.playClick();
  };

  const startLearn = () => {
    setGameMode('learn');
    setCurrentIndex(0);
    soundEffects.playClick();
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      soundEffects.playSuccess();
      setScore(score + 10);
      setTimeout(() => {
        setQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
      }, 1500);
    } else {
      soundEffects.playError();
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives === 0) {
        setTimeout(() => {
          setGameOver(true);
          soundEffects.playVictory();
        }, 1500);
      } else {
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
        }, 1500);
      }
    }
  };

  const nextState = () => {
    if (currentIndex < BRAZILIAN_STATES.length - 1) {
      setCurrentIndex(currentIndex + 1);
      soundEffects.playClick();
    }
  };

  const prevState = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      soundEffects.playClick();
    }
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-yellow-300 to-blue-300 p-4 overflow-hidden relative">
        <FloatingElements />
        
        <div className="relative z-10 max-w-4xl mx-auto pt-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-4"
            >
              🇧🇷
            </motion.div>
            <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
              Estados do Brasil
            </h1>
            <p className="text-white text-xl font-bold">
              Aprenda os estados e suas capitais!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={startLearn}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl text-center"
              >
                <div className="text-8xl mb-4">📚</div>
                <h2 className="text-3xl font-black text-blue-600 mb-2">
                  Aprender
                </h2>
                <p className="text-gray-700 font-bold text-lg">
                  Conheça todos os estados e capitais brasileiras
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={startQuiz}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl text-center"
              >
                <div className="text-8xl mb-4">🎯</div>
                <h2 className="text-3xl font-black text-purple-600 mb-2">
                  Jogar Quiz
                </h2>
                <p className="text-gray-700 font-bold text-lg">
                  Teste seus conhecimentos sobre o Brasil
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <Link to={createPageUrl('KidsArea')}>
              <KidsButton color="orange" size="lg">
                <ArrowLeft className="inline mr-2" />
                Voltar
              </KidsButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-yellow-300 to-blue-300 p-4 overflow-hidden relative">
        <FloatingElements />
        
        <div className="relative z-10 max-w-4xl mx-auto pt-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
              🇧🇷 Conhecendo o Brasil
            </h1>
            <p className="text-white text-lg font-bold">
              Estado {currentIndex + 1} de {BRAZILIAN_STATES.length}
            </p>
          </motion.div>

          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl mb-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <img 
                  src={currentState.flag} 
                  alt={`Bandeira ${currentState.state}`}
                  className="w-64 h-auto mx-auto rounded-2xl border-4 border-white shadow-2xl"
                />
              </motion.div>

              <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl p-6 mb-4 border-4 border-green-300">
                <p className="text-sm font-bold text-green-600 mb-2">🏴 ESTADO</p>
                <p className="text-5xl font-black text-green-900">{currentState.state}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-4 border-4 border-blue-300">
                <p className="text-sm font-bold text-blue-600 mb-2">🏙️ CAPITAL</p>
                <p className="text-4xl font-black text-blue-900">{currentState.capital}</p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-4 border-orange-300">
                <p className="text-sm font-bold text-orange-600 mb-1">📍 REGIÃO</p>
                <p className="text-2xl font-black text-orange-900">{currentState.region}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-4 mb-6">
            <KidsButton
              color="blue"
              size="lg"
              onClick={prevState}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              ← Anterior
            </KidsButton>
            <KidsButton
              color="blue"
              size="lg"
              onClick={nextState}
              disabled={currentIndex === BRAZILIAN_STATES.length - 1}
              className="flex-1"
            >
              Próximo →
            </KidsButton>
          </div>

          <div className="flex justify-center">
            <KidsButton color="orange" size="lg" onClick={() => setGameMode(null)}>
              <ArrowLeft className="inline mr-2" />
              Voltar ao Menu
            </KidsButton>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'quiz') {
    if (gameOver) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 p-4 overflow-hidden relative">
          <FloatingElements />
          
          <div className="relative z-10 max-w-3xl mx-auto pt-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-white shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-9xl mb-6"
              >
                🏆
              </motion.div>
              <h1 className="text-5xl font-black text-purple-600 mb-4">
                Fim de Jogo!
              </h1>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-yellow-400 mb-6">
                <p className="text-lg font-bold text-gray-700 mb-2">Sua Pontuação:</p>
                <p className="text-6xl font-black text-orange-600">{score}</p>
              </div>
              <div className="flex gap-4">
                <KidsButton color="purple" size="xl" onClick={startQuiz} className="flex-1">
                  Jogar Novamente
                </KidsButton>
                <KidsButton color="orange" size="xl" onClick={() => setGameMode(null)} className="flex-1">
                  Menu Principal
                </KidsButton>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300 p-4 overflow-hidden relative">
        <FloatingElements />
        
        <div className="relative z-10 max-w-3xl mx-auto pt-10">
          {/* Header com Score e Vidas */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-6"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-3 border-4 border-white shadow-xl">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-black text-purple-600">{score}</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-3 border-4 border-white shadow-xl">
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i >= lives ? { scale: 0.5, opacity: 0.3 } : { scale: 1, opacity: 1 }}
                    className="text-3xl"
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quiz */}
          <motion.div
            key={question?.question}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src={question?.flag} 
                  alt="Bandeira do Estado"
                  className="w-48 h-auto mx-auto rounded-xl border-4 border-white shadow-2xl"
                />
              </motion.div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-4 border-purple-300 mb-6">
              <p className="text-2xl font-black text-gray-800 text-center">
                {question?.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question?.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: showResult ? 1 : 1.05 }}
                  whileTap={{ scale: showResult ? 1 : 0.95 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-6 rounded-2xl border-4 font-black text-xl transition-all ${
                    showResult && option === question.correctAnswer
                      ? 'bg-green-400 border-green-600 text-white'
                      : selectedAnswer === option && showResult
                      ? 'bg-red-400 border-red-600 text-white'
                      : selectedAnswer === option
                      ? 'bg-purple-400 border-purple-600 text-white'
                      : 'bg-white border-purple-300 text-gray-800 hover:bg-purple-50'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center mt-6"
              >
                {selectedAnswer === question.correctAnswer ? (
                  <div className="text-5xl">🎉</div>
                ) : (
                  <div className="text-5xl">💪</div>
                )}
              </motion.div>
            )}
          </motion.div>

          <div className="flex justify-center mt-6">
            <KidsButton color="orange" size="md" onClick={() => setGameMode(null)}>
              <ArrowLeft className="inline mr-2" />
              Sair do Quiz
            </KidsButton>
          </div>
        </div>
      </div>
    );
  }
}