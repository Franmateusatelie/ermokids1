import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { ArrowLeft } from 'lucide-react';

export default function ClassroomChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl mb-4"
          >
            🏫
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
            Sala de Aula Virtual
          </h1>
          <p className="text-white text-xl font-bold">Escola, Professores e Alunos</p>
        </motion.div>

        <div className="grid gap-6 mb-8">
          {/* Professor Login */}
          <Link to={createPageUrl('TeacherLogin')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-8xl"
                >
                  👩‍🏫
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Professores
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Criar e gerenciar salas de aula
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Student Join */}
          <Link to={createPageUrl('StudentJoin')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-400 to-orange-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  🎒
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Alunos
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Entrar na sala de aula com convite
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        <div className="flex justify-center">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar ao Início
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}