import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

const CELL_SIZE = 20;
const GRID_SIZE = 20;

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(150);
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Colisão com parede
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          soundEffects.playError();
          setGameOver(true);
          return prevSnake;
        }

        // Colisão com o próprio corpo
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          soundEffects.playError();
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Comeu a comida
        if (newHead.x === food.x && newHead.y === food.y) {
          soundEffects.playSuccess();
          const newScore = score + 10;
          setScore(newScore);
          
          // Aumenta nível a cada 50 pontos
          if (newScore % 50 === 0 && newScore > 0) {
            const newLevel = level + 1;
            setLevel(newLevel);
            setSpeed(Math.max(50, 150 - newLevel * 10));
            soundEffects.playVictory();
          }
          
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameOver, food, score, level, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
      } else if (key === 'arrowdown' || key === 's') {
        if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
      } else if (key === 'arrowleft' || key === 'a') {
        if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
      } else if (key === 'arrowright' || key === 'd') {
        if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(150);
  };

  const changeDirection = (newDir) => {
    const currentDir = directionRef.current;
    if (newDir.x !== 0 && currentDir.x === 0) setDirection(newDir);
    if (newDir.y !== 0 && currentDir.y === 0) setDirection(newDir);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🐍 Jogo da Cobrinha</h1>
          <div className="flex justify-center gap-6 text-white font-bold text-lg">
            <div className="bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Pontos: {score}
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
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl flex flex-col items-center"
        >
          <div 
            className="bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-600 rounded-2xl relative"
            style={{ width: CELL_SIZE * GRID_SIZE, height: CELL_SIZE * GRID_SIZE }}
          >
            {/* Cobra */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-md ${index === 0 ? 'bg-green-600' : 'bg-green-500'}`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                }}
              />
            ))}
            
            {/* Comida */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute text-2xl"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
              }}
            >
              🍎
            </motion.div>

            {/* Game Over */}
            {gameOver && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl"
              >
                <div className="text-center">
                  <p className="text-white text-3xl font-bold mb-4">Fim de Jogo!</p>
                  <p className="text-white text-xl mb-4">Pontos: {score}</p>
                  <KidsButton color="green" onClick={resetGame}>
                    Jogar Novamente
                  </KidsButton>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controles Mobile */}
          <div className="mt-6 grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div />
            <KidsButton color="green" size="md" onClick={() => changeDirection({ x: 0, y: -1 })}>
              ⬆️
            </KidsButton>
            <div />
            <KidsButton color="green" size="md" onClick={() => changeDirection({ x: -1, y: 0 })}>
              ⬅️
            </KidsButton>
            <KidsButton color="green" size="md" onClick={() => changeDirection({ x: 0, y: 1 })}>
              ⬇️
            </KidsButton>
            <KidsButton color="green" size="md" onClick={() => changeDirection({ x: 1, y: 0 })}>
              ➡️
            </KidsButton>
          </div>
        </motion.div>

        <div className="flex justify-center gap-4 mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="blue" size="md">
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