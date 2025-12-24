import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function GameCard({ title, icon, color, stars = 0, pageName, delay = 0 }) {
  const colors = {
    pink: 'from-pink-400 to-pink-500 border-pink-300',
    blue: 'from-blue-400 to-blue-500 border-blue-300',
    green: 'from-green-400 to-green-500 border-green-300',
    yellow: 'from-yellow-400 to-yellow-500 border-yellow-300',
    purple: 'from-purple-400 to-purple-500 border-purple-300',
    orange: 'from-orange-400 to-orange-500 border-orange-300',
    cyan: 'from-cyan-400 to-cyan-500 border-cyan-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
    >
      <Link to={createPageUrl(pageName)}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
          whileTap={{ scale: 0.95 }}
          className={`
            bg-gradient-to-br ${colors[color]}
            rounded-3xl p-6 cursor-pointer
            border-4 border-white/50
            shadow-xl hover:shadow-2xl
            transition-shadow duration-300
          `}
        >
          <div className="text-center">
            <motion.div 
              className="text-6xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: delay * 0.2 }}
            >
              {icon}
            </motion.div>
            <h3 className="text-white font-bold text-lg drop-shadow-lg mb-2">
              {title}
            </h3>
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={i <= stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/40'}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}