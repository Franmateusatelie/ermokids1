import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Cloud, Sparkles } from 'lucide-react';

export default function FloatingElements() {
  const elements = [
    { Icon: Star, color: 'text-yellow-400', delay: 0, x: '10%', size: 20 },
    { Icon: Heart, color: 'text-pink-400', delay: 0.5, x: '85%', size: 18 },
    { Icon: Cloud, color: 'text-blue-300', delay: 1, x: '25%', size: 28 },
    { Icon: Sparkles, color: 'text-purple-400', delay: 1.5, x: '70%', size: 16 },
    { Icon: Star, color: 'text-orange-400', delay: 2, x: '50%', size: 14 },
    { Icon: Heart, color: 'text-red-400', delay: 2.5, x: '15%', size: 16 },
    { Icon: Cloud, color: 'text-cyan-300', delay: 3, x: '90%', size: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.color}`}
          style={{ left: el.x, top: '-10%' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <el.Icon size={el.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}