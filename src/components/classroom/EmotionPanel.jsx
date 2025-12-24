import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';

const EMOTIONS = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '🤔', label: 'Pensando' },
  { emoji: '👍', label: 'Entendi' },
  { emoji: '❤️', label: 'Amei' },
  { emoji: '🙋', label: 'Pergunta' },
  { emoji: '⭐', label: 'Legal' },
  { emoji: '🎉', label: 'Parabéns' },
  { emoji: '📚', label: 'Estudando' },
];

export default function EmotionPanel({ onEmotionSend, recentEmotions = [] }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-purple-300 shadow-xl">
      <h3 className="text-lg font-black text-purple-600 mb-3 text-center">
        Como você está? 💭
      </h3>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {EMOTIONS.map((emotion) => (
          <motion.button
            key={emotion.emoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEmotionSend(emotion.emoji)}
            className="bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-xl p-3 border-2 border-purple-200 transition-all"
          >
            <div className="text-3xl">{emotion.emoji}</div>
            <div className="text-[10px] font-bold text-gray-700 mt-1">{emotion.label}</div>
          </motion.button>
        ))}
      </div>

      {recentEmotions.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
          <div className="text-xs font-bold text-purple-600 mb-2">Últimas reações:</div>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            <AnimatePresence>
              {recentEmotions.slice(0, 10).map((em, idx) => (
                <motion.div
                  key={em.id || idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-white px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1"
                >
                  <span className="text-lg">{em.emotion}</span>
                  <span className="text-[10px] font-bold text-gray-600">{em.student_name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}