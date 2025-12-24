import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

export default function StarExplosion({ show, onComplete }) {
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.05,
  }));

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                x: Math.cos(star.angle) * 200,
                y: Math.sin(star.angle) * 200,
                opacity: [1, 1, 0],
                rotate: 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: star.delay,
                ease: 'easeOut',
              }}
              onAnimationComplete={star.id === 11 ? onComplete : undefined}
              className="absolute"
            >
              <Star 
                size={40} 
                className="text-yellow-400 fill-yellow-400 drop-shadow-lg" 
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl"
          >
            ⭐
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}