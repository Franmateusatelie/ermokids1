import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function RacingGame() {
  const [carPosition, setCarPosition] = useState(2);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(50);
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev.map((obs) => ({ ...obs, y: obs.y + 5 })).filter((obs) => obs.y < 400);
        
        // Adiciona novo obstáculo
        if (Math.random() < 0.02) {
          updated.push({
            x: Math.floor(Math.random() * 3),
            y: -50,
            id: Date.now(),
          });
        }
        
        return updated;
      });

      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore % 500 === 0 && newScore > 0) {
          const newLevel = level + 1;
          setLevel(newLevel);
          setSpeed(Math.max(30, 50 - newLevel * 2));
          soundEffects.playVictory();
        }
        return newScore;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, speed, level]);

  useEffect(() => {
    obstacles.forEach((obs) => {
      if (obs.y > 300 && obs.y < 350 && obs.x === carPosition) {
        soundEffects.playError();
        setGameOver(true);
      }
    });
  }, [obstacles, carPosition]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && carPosition > 0) {
        setCarPosition(carPosition - 1);
        soundEffects.playClick();
      } else if (e.key === 'ArrowRight' && carPosition < 2) {
        setCarPosition(carPosition + 1);
        soundEffects.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [carPosition]);

  const moveLeft = () => {
    if (carPosition > 0) setCarPosition(carPosition - 1);
  };

  const moveRight = () => {
    if (carPosition < 2) setCarPosition(carPosition + 1);
  };

  const resetGame = () => {
    setCarPosition(2);
    setObstacles([]);
    setScore(0);
    setLevel(1);
    setSpeed(50);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🏎️ Corrida Maluca</h1>
          <div className="flex justify-center gap-6 text-white font-bold text-lg">
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Distância: {score}m
            </div>
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Nível {level}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-700 rounded-3xl p-6 border-4 border-white shadow-2xl overflow-hidden"
          ref={gameRef}
          style={{ height: '500px', position: 'relative' }}
        >
          {/* Pista */}
          <div className="relative w-full h-full bg-gray-800 rounded-2xl overflow-hidden">
            {/* Faixas da pista */}
            <div className="absolute inset-0 flex">
              {[0, 1, 2].map((lane) => (
                <div key={lane} className="flex-1 border-r-2 border-dashed border-white/30" />
              ))}
            </div>

            {/* Carro do jogador */}
            <motion.div
              animate={{ x: carPosition * 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-10"
              style={{ left: '20px', fontSize: '48px', transform: 'rotate(-90deg) scaleX(-1)' }}
            >
              🏎️
            </motion.div>

            {/* Obstáculos */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                className="absolute text-3xl"
                style={{
                  left: obs.x * 100 + 20,
                  top: obs.y,
                }}
              >
                🚧
              </div>
            ))}

            {/* Game Over */}
            {gameOver && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl"
              >
                <div className="text-center">
                  <p className="text-white text-3xl font-bold mb-4">💥 Bateu!</p>
                  <p className="text-white text-xl mb-4">Distância: {score}m</p>
                  <KidsButton color="blue" onClick={resetGame}>
                    Jogar Novamente
                  </KidsButton>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Controles */}
        <div className="flex justify-center gap-4 mt-6">
          <KidsButton color="cyan" size="lg" onClick={moveLeft}>
            ⬅️ Esquerda
          </KidsButton>
          <KidsButton color="cyan" size="lg" onClick={moveRight}>
            Direita ➡️
          </KidsButton>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="purple" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
          <KidsButton color="orange" size="md" onClick={resetGame}>
            <RotateCcw className="inline mr-2" />
            Reiniciar
          </KidsButton>
        </div>
      </div>
    </div>
  );
}