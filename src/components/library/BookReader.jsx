import React, { useState } from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';

export default function BookReader({ book, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Split content into pages (approximately 500 characters per page)
  const pages = [];
  const charsPerPage = 500;
  let content = book.content;
  
  while (content.length > 0) {
    let endIndex = Math.min(charsPerPage, content.length);
    
    // Try to break at sentence end
    if (endIndex < content.length) {
      const lastPeriod = content.substring(0, endIndex).lastIndexOf('.');
      const lastQuestion = content.substring(0, endIndex).lastIndexOf('?');
      const lastExclamation = content.substring(0, endIndex).lastIndexOf('!');
      const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);
      
      if (breakPoint > charsPerPage * 0.7) {
        endIndex = breakPoint + 1;
      }
    }
    
    pages.push(content.substring(0, endIndex).trim());
    content = content.substring(endIndex).trim();
  }

  const totalPages = pages.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-8 border-amber-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-orange-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-100" />
            <div>
              <h2 className="text-2xl font-black text-white">{book.title}</h2>
              <p className="text-amber-100 text-sm">{book.author || 'Biblioteca Virtual'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Book Content */}
        <div className="p-8 min-h-[400px] max-h-[60vh] overflow-y-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-justify">
              {pages[currentPage]}
            </p>
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="bg-gradient-to-r from-amber-800 to-orange-800 p-4">
          <div className="flex items-center justify-between">
            <KidsButton
              color="orange"
              size="md"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="inline w-5 h-5 mr-1" />
              Anterior
            </KidsButton>
            
            <div className="text-white font-bold">
              Página {currentPage + 1} de {totalPages}
            </div>
            
            <KidsButton
              color="orange"
              size="md"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Próxima
              <ChevronRight className="inline w-5 h-5 ml-1" />
            </KidsButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}