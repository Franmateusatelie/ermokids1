import React from 'react';
import { motion } from 'framer-motion';

export default function ClassroomSeat({ seatNumber, student, isSelected, onClick }) {
  const isEmpty = !student;
  
  return (
    <motion.div
      whileHover={isEmpty ? { scale: 1.05 } : {}}
      whileTap={isEmpty ? { scale: 0.95 } : {}}
      onClick={isEmpty ? onClick : undefined}
      className={`
        relative w-20 h-20 rounded-xl flex flex-col items-center justify-center
        border-4 cursor-pointer transition-all
        ${isEmpty 
          ? 'bg-white border-purple-300 hover:border-purple-500 hover:bg-purple-50' 
          : 'bg-gradient-to-br from-pink-400 to-purple-500 border-white shadow-lg'
        }
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
      `}
    >
      {isEmpty ? (
        <div className="text-center">
          <div className="text-2xl mb-1">🪑</div>
          <div className="text-xs font-bold text-gray-600">{seatNumber}</div>
        </div>
      ) : (
        <div className="text-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl mb-1"
          >
            {student.avatar_emoji}
          </motion.div>
          <div className="text-[10px] font-bold text-white truncate w-full px-1">
            {student.student_name}
          </div>
          {student.is_online && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>
      )}
    </motion.div>
  );
}