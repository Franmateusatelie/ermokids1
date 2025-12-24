import React from 'react';
import { motion } from 'framer-motion';
import FloatingElements from '@/components/kids/FloatingElements';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6948130c63a4aed964627876/aa01983f5_ChatGPTImage20_12_202513_48_59.png)',
        }}
      />
      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px]" />
      
      <FloatingElements />
      
      <div className="relative z-10 px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6948130c63a4aed964627876/86064cad5_ChatGPTImage20dedezde202502_07_51-Photoroom.png"
              alt="ErmoKids"
              className="w-72 md:w-96 mx-auto drop-shadow-2xl"
            />
          </motion.div>
          
          <p className="text-2xl text-purple-600 font-black mt-4">
            Bem-vindo ao ErmoKids! ✨
          </p>
        </motion.div>

        {/* Main Menu Cards */}
        <div className="grid gap-6 mb-8">
          {/* Kids Area */}
          <Link to={createPageUrl('KidsArea')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  🎮
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Área das Crianças
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Jogos, músicas, histórias e muito mais!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Parent Area */}
          <Link to={createPageUrl('ParentLogin')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-8xl"
                >
                  👨‍👩‍👧
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Área dos Pais
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Rotinas, saúde, escola e muito mais!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Virtual Library */}
          <Link to={createPageUrl('VirtualLibrary')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  📚
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Biblioteca Virtual
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Crie e leia histórias mágicas!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* English Class */}
          <Link to={createPageUrl('EnglishClass')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  🇬🇧
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Aula de Inglês
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Aprenda com o Teacher!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Dictionary */}
          <Link to={createPageUrl('Dictionary')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.75 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="text-8xl"
                >
                  📖
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Dicionário Português
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Descubra o significado das palavras!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Virtual Classroom */}
          <Link to={createPageUrl('ClassroomChoice')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  🏫
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Sala de Aula Virtual
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Professores e Alunos
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Donation */}
          <Link to={createPageUrl('Donation')}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-400 to-orange-500 rounded-3xl p-8 border-4 border-white shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-8xl"
                >
                  💝
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    Apoie o ErmoKids
                  </h2>
                  <p className="text-xl text-white/90 font-bold">
                    Doe e ajude a manter o app gratuito!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
          </div>

        {/* Rainbow Footer */}
        <motion.div
          className="h-6 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 mb-6"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-4"
        >
          <p className="text-sm text-purple-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}