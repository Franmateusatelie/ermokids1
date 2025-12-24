import React from 'react';
import { motion } from 'framer-motion';
import { soundEffects } from './SoundEffects';

export default function KidsButton({ 
  children, 
  onClick, 
  color = 'pink',
  size = 'lg',
  className = '',
  disabled = false 
}) {
  const colors = {
    pink: 'from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 shadow-pink-300',
    blue: 'from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-blue-300',
    green: 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-green-300',
    yellow: 'from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-300',
    purple: 'from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-purple-300',
    orange: 'from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-orange-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const handleClick = (e) => {
    soundEffects.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        bg-gradient-to-b ${colors[color]} 
        ${sizes[size]}
        text-white font-bold rounded-full
        shadow-lg transform transition-all
        border-4 border-white/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}