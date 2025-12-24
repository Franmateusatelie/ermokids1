import React from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';
import { Lock, Star, CheckCircle } from 'lucide-react';

export default function ActivityCard({ 
  activity, 
  isUnlocked, 
  isCompleted, 
  onStart,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className={`relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 shadow-xl ${
        isCompleted ? 'border-green-400' : isUnlocked ? 'border-purple-400' : 'border-gray-300'
      }`}
    >
      {isCompleted && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 border-4 border-white shadow-lg">
          <CheckCircle className="w-6 h-6" />
        </div>
      )}

      <div className="text-center">
        <div className="text-6xl mb-3">{activity.icon}</div>
        <h3 className="text-xl font-black text-gray-800 mb-2">{activity.name}</h3>
        <p className="text-sm text-gray-600 font-bold mb-4">{activity.description}</p>

        <div className="flex items-center justify-center gap-2 mb-4">
          {[...Array(activity.stars)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ))}
        </div>

        {!isUnlocked ? (
          <div className="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Bloqueado
          </div>
        ) : isCompleted ? (
          <KidsButton color="green" size="sm" onClick={onStart}>
            Jogar Novamente
          </KidsButton>
        ) : (
          <KidsButton color="purple" size="sm" onClick={onStart}>
            Começar!
          </KidsButton>
        )}

        {!isUnlocked && (
          <p className="text-xs text-gray-500 mt-2 font-bold">
            Complete {activity.requiredStars} atividades para desbloquear
          </p>
        )}
      </div>
    </motion.div>
  );
}