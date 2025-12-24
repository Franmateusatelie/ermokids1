import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function BookShelf({ books, onBookClick }) {
  const getCoverColor = (category) => {
    const colors = {
      aventura: 'from-orange-400 to-orange-600',
      fantasia: 'from-purple-400 to-purple-600',
      ciencia: 'from-blue-400 to-blue-600',
      animais: 'from-green-400 to-green-600',
      contos: 'from-pink-400 to-pink-600',
      historia: 'from-yellow-400 to-yellow-600',
      espaco: 'from-indigo-400 to-indigo-600',
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {books.map((book, index) => (
        <motion.button
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBookClick(book)}
          className="relative"
        >
          <div className={`bg-gradient-to-br ${getCoverColor(book.category)} rounded-lg p-4 h-48 shadow-xl border-4 border-white flex flex-col justify-between`}>
            <div>
              <BookOpen className="w-6 h-6 text-white mb-2" />
              <h3 className="text-white font-black text-sm leading-tight line-clamp-3">
                {book.title}
              </h3>
            </div>
            <div className="text-white/80 text-xs font-bold">
              {book.category}
            </div>
          </div>
          {book.read_count > 0 && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black border-2 border-white">
              {book.read_count}
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}