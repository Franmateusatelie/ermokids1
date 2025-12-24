import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, BookOpen } from 'lucide-react';

const STORIES = [
  { id: 1, name: 'Os Três Porquinhos', emoji: '🐷', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: 'from-pink-400 to-rose-400' },
  { id: 2, name: 'Chapeuzinho Vermelho', emoji: '🧒', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: 'from-red-400 to-orange-400' },
  { id: 3, name: 'A Bela Adormecida', emoji: '👸', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: 'from-purple-400 to-pink-400' },
  { id: 4, name: 'João e o Pé de Feijão', emoji: '🌱', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', color: 'from-green-400 to-emerald-400' },
  { id: 5, name: 'A Pequena Sereia', emoji: '🧜‍♀️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', color: 'from-cyan-400 to-blue-400' },
  { id: 6, name: 'Peter Pan', emoji: '🧚', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', color: 'from-yellow-400 to-amber-400' },
];

export default function StoriesSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(STORIES[currentStory].url);
    audioRef.current.loop = false;
    audioRef.current.volume = 0.4;

    audioRef.current.addEventListener('ended', () => {
      handleNext();
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentStory]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStory((prev) => (prev + 1) % STORIES.length);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const selectStory = (index) => {
    setClickedButton(index);
    setTimeout(() => setClickedButton(null), 300);
    setIsPlaying(false);
    setCurrentStory(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl p-6 border-4 border-white/50 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: isPlaying ? [0, 5, -5, 0] : 0 }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
        >
          <BookOpen className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-black text-white">Histórias</h3>
      </div>

      {/* Current Story Display */}
      <motion.div 
        className={`bg-gradient-to-r ${STORIES[currentStory].color} rounded-2xl p-6 mb-4 border-4 border-white`}
        animate={{ 
          scale: isPlaying ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            className="text-6xl drop-shadow-lg"
            animate={{ 
              scale: isPlaying ? [1, 1.2, 1] : 1,
              rotate: isPlaying ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.8, repeat: isPlaying ? Infinity : 0 }}
          >
            {STORIES[currentStory].emoji}
          </motion.span>
          <div>
            <p className="text-white font-black text-2xl drop-shadow-lg">{STORIES[currentStory].name}</p>
            <p className="text-white/90 text-lg font-bold">
              {isPlaying ? '🔊 Tocando agora...' : '⏸️ Pausado'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.85, rotate: -5 }}
          onClick={toggleMute}
          className="p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all border-4 border-white/50"
          animate={{
            boxShadow: isMuted ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          {isMuted ? (
            <VolumeX className="w-7 h-7 text-red-500" />
          ) : (
            <Volume2 className="w-7 h-7 text-blue-500" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={togglePlay}
          className="p-6 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all border-4 border-yellow-300"
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
            boxShadow: isPlaying 
              ? ['0 0 20px rgba(34, 197, 94, 0.5)', '0 0 40px rgba(34, 197, 94, 0.8)', '0 0 20px rgba(34, 197, 94, 0.5)']
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 text-orange-500 fill-orange-500" />
          ) : (
            <Play className="w-10 h-10 text-green-500 fill-green-500 ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.85, rotate: 5 }}
          onClick={handleNext}
          className="p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all border-4 border-white/50"
        >
          <SkipForward className="w-7 h-7 text-purple-500" />
        </motion.button>
      </div>

      {/* Story List */}
      <div className="grid grid-cols-3 gap-3">
        {STORIES.map((story, index) => (
          <motion.button
            key={story.id}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.9, rotate: -2 }}
            onClick={() => selectStory(index)}
            className={`
              py-4 px-2 rounded-2xl
              transition-all border-4
              ${currentStory === index
                ? `bg-gradient-to-br ${story.color} border-white shadow-2xl`
                : 'bg-white/30 border-white/50 hover:bg-white/40 shadow-lg'
              }
            `}
            animate={{
              scale: clickedButton === index ? [1, 1.2, 1] : 1,
              rotate: clickedButton === index ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-3xl mb-2 drop-shadow-lg"
              animate={{
                scale: currentStory === index && isPlaying ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: currentStory === index && isPlaying ? Infinity : 0 }}
            >
              {story.emoji}
            </motion.div>
            <div className={`text-xs font-black ${currentStory === index ? 'text-white drop-shadow-md' : 'text-white'}`}>
              {story.name}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}