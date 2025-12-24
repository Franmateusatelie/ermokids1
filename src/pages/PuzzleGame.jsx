import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, RotateCcw, Shuffle } from 'lucide-react';

const PUZZLES = [
  { image: '🦁', name: 'Leão' },
  { image: '🐼', name: 'Panda' },
  { image: '🦋', name: 'Borboleta' },
  { image: '🌈', name: 'Arco-íris' },
  { image: '🚀', name: 'Foguete' },
];

export default function PuzzleGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gridSize = 3;

  const initPuzzle = () => {
    const initialTiles = [];
    for (let i = 0; i < gridSize * gridSize - 1; i++) {
      initialTiles.push(i + 1);
    }
    initialTiles.push(0); // Empty tile

    // Shuffle tiles
    let shuffled = [...initialTiles];
    do {
      for (let i = shuffled.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (!isSolvable(shuffled) || isComplete(shuffled));

    setTiles(shuffled);
    setMoves(0);
    setGameWon(false);
  };

  const isSolvable = (puzzle) => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const isComplete = (puzzle) => {
    for (let i = 0; i < puzzle.length - 1; i++) {
      if (puzzle[i] !== i + 1) return false;
    }
    return puzzle[puzzle.length - 1] === 0;
  };

  useEffect(() => {
    initPuzzle();
  }, [currentPuzzle]);

  useEffect(() => {
    if (tiles.length > 0 && isComplete(tiles)) {
      setGameWon(true);
      setShowStars(true);
    }
  }, [tiles]);

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    // Check if adjacent
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
    }
  };

  const getStars = () => {
    if (moves <= 20) return 3;
    if (moves <= 35) return 2;
    return 1;
  };

  const nextPuzzle = () => {
    setShowStars(false);
    setCurrentPuzzle((currentPuzzle + 1) % PUZZLES.length);
  };

  const getTileColor = (tile) => {
    const colors = [
      'from-pink-400 to-pink-500',
      'from-blue-400 to-blue-500',
      'from-green-400 to-green-500',
      'from-yellow-400 to-yellow-500',
      'from-purple-400 to-purple-500',
      'from-orange-400 to-orange-500',
      'from-cyan-400 to-cyan-500',
      'from-red-400 to-red-500',
    ];
    return colors[(tile - 1) % colors.length];
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
      <div className="fixed inset-0 bg-orange-500/10 backdrop-blur-[1px]" />
      
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
              className="flex items-center gap-2 text-orange-600 font-bold bg-white/60 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Voltar
            </motion.div>
          </Link>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={initPuzzle}
            className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 rounded-full cursor-pointer shadow-lg"
          >
            <Shuffle size={20} />
            Embaralhar
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black text-orange-600">
            🧩 Quebra-Cabeça
          </h1>
          <p className="text-lg text-orange-500 font-bold mt-2">
            Movimentos: {moves}
          </p>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-4 border-4 border-white/50 shadow-xl mb-4 text-center"
        >
          <p className="text-gray-600 font-bold mb-2">Monte o número na ordem!</p>
          <div className="text-5xl">{PUZZLES[currentPuzzle].image}</div>
        </motion.div>

        {/* Puzzle Grid */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl p-4 border-4 border-white/50 shadow-xl"
        >
          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile, index) => (
              <motion.div
                key={`${index}-${tile}`}
                layout
                onClick={() => tile !== 0 && moveTile(index)}
                whileHover={tile !== 0 ? { scale: 1.05 } : {}}
                whileTap={tile !== 0 ? { scale: 0.95 } : {}}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center
                  text-3xl font-black cursor-pointer
                  transition-all duration-200
                  ${tile === 0 
                    ? 'bg-gray-100 border-2 border-dashed border-gray-300' 
                    : `bg-gradient-to-br ${getTileColor(tile)} text-white border-4 border-white/50 shadow-lg`
                  }
                `}
              >
                {tile !== 0 && tile}
              </motion.div>
            ))}
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
                className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-[2rem] p-8 text-center border-4 border-orange-400 shadow-2xl max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🧩
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
                <div className="flex gap-3 justify-center flex-wrap">
                  <KidsButton color="green" onClick={nextPuzzle}>
                    Próximo 🧩
                  </KidsButton>
                  <KidsButton color="orange" onClick={initPuzzle}>
                    Repetir 🔄
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
          <p className="text-xs text-orange-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}