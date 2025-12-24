import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';
import KidsButton from './KidsButton';

const SONGS = [
  { id: 1, name: 'Música Alegre 1', url: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3', emoji: '🎵' },
  { id: 2, name: 'Música Divertida 2', url: 'https://assets.mixkit.co/music/preview/mixkit-little-adventure-8-bit-music-9.mp3', emoji: '🎶' },
  { id: 3, name: 'Música Feliz 3', url: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3', emoji: '🎼' },
];

export default function MusicSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(SONGS[currentSong].url);
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
  }, [currentSong]);

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
    setCurrentSong((prev) => (prev + 1) % SONGS.length);
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

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-6 border-4 border-white/50 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
        >
          <Music2 className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-black text-white">Músicas</h3>
      </div>

      {/* Current Song Display */}
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-4xl"
            animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
          >
            {SONGS[currentSong].emoji}
          </motion.span>
          <div>
            <p className="text-white font-bold text-lg">{SONGS[currentSong].name}</p>
            <p className="text-white/80 text-sm">
              {currentSong + 1} de {SONGS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="p-5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-purple-500 fill-purple-500" />
          ) : (
            <Play className="w-8 h-8 text-purple-500 fill-purple-500 ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
        >
          <SkipForward className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Song List */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {SONGS.map((song, index) => (
          <motion.button
            key={song.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentSong(index);
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                }
              }, 100);
            }}
            className={`
              py-2 px-3 rounded-xl text-2xl
              transition-all
              ${currentSong === index
                ? 'bg-white text-purple-500 shadow-lg'
                : 'bg-white/20 hover:bg-white/30'
              }
            `}
          >
            {song.emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}