import React from 'react';
import { motion } from 'framer-motion';

export default function PetDisplay({ type, mood = 'happy', size = 'lg', onClick }) {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const catEmojis = {
    happy: '😺',
    sad: '😿',
    hungry: '🙀',
    sleepy: '😸',
    playing: '😻',
  };

  const dogEmojis = {
    happy: '🐶',
    sad: '🐕',
    hungry: '🐕‍🦺',
    sleepy: '🦮',
    playing: '🐩',
  };

  const emojis = type === 'cat' ? catEmojis : dogEmojis;

  return (
    <motion.div
      onClick={onClick}
      className={`${sizes[size]} cursor-pointer`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-yellow-200 to-orange-200 rounded-full opacity-50"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-7xl md:text-8xl lg:text-9xl relative z-10">
          {emojis[mood]}
        </span>
      </div>
    </motion.div>
  );
}