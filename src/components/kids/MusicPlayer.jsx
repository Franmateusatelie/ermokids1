import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Fun kid-friendly sound URL (royalty-free chiptune)
  const musicUrl = "https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3";

  useEffect(() => {
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked
        });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.button
      onClick={toggleMusic}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        fixed bottom-4 right-4 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-lg border-4 border-white/50
        ${isMuted 
          ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
          : 'bg-gradient-to-br from-pink-400 to-purple-500'
        }
      `}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-white" />
      ) : (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Music className="w-6 h-6 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}