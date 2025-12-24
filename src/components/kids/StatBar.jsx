import React from 'react';
import { motion } from 'framer-motion';

export default function StatBar({ label, value, icon, color = 'pink' }) {
  const colors = {
    pink: 'from-pink-400 to-pink-500',
    blue: 'from-blue-400 to-blue-500',
    green: 'from-green-400 to-green-500',
    yellow: 'from-yellow-400 to-yellow-500',
    purple: 'from-purple-400 to-purple-500',
    orange: 'from-orange-400 to-orange-500',
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-bold text-gray-600">{label}</span>
        <span className="text-xs font-bold text-gray-500 ml-auto">{value}%</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}