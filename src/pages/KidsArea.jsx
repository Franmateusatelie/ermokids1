import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import FloatingElements from '@/components/kids/FloatingElements';
import GameCard from '@/components/kids/GameCard';
import PetDisplay from '@/components/kids/PetDisplay';
import KidsButton from '@/components/kids/KidsButton';

import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Heart, Gamepad2, ArrowLeft } from 'lucide-react';

export default function KidsArea() {
  const { data: pets = [] } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list(),
  });

  const hasPet = pets.length > 0;
  const currentPet = hasPet ? pets[0] : null;

  const games = [
    { title: 'Jogo da Memória', icon: '🧠', color: 'purple', pageName: 'MemoryGame', delay: 0 },
    { title: 'Cores Mágicas', icon: '🎨', color: 'pink', pageName: 'ColorsGame', delay: 1 },
    { title: 'Números Divertidos', icon: '🔢', color: 'blue', pageName: 'NumbersGame', delay: 2 },
    { title: 'ABC das Letras', icon: '📚', color: 'green', pageName: 'LettersGame', delay: 3 },
    { title: 'Quebra-Cabeça', icon: '🧩', color: 'orange', pageName: 'PuzzleGame', delay: 4 },
    { title: 'Formas Geométricas', icon: '⭐', color: 'cyan', pageName: 'ShapesGame', delay: 5 },
    { title: 'Cobrinha', icon: '🐍', color: 'green', pageName: 'SnakeGame', delay: 6 },
    { title: 'Corrida Maluca', icon: '🏎️', color: 'blue', pageName: 'RacingGame', delay: 7 },
    { title: 'Vista a Menina', icon: '👗', color: 'pink', pageName: 'DressUpGame', delay: 8 },
    { title: 'Vista o Menino', icon: '🧒', color: 'cyan', pageName: 'DressBoyGame', delay: 9 },
    { title: 'Aprendendo Inglês', icon: '🌍', color: 'purple', pageName: 'EnglishWordsGame', delay: 10 },
    { title: 'Jogo dos 7 Erros', icon: '🔍', color: 'orange', pageName: 'SevenDifferencesGame', delay: 11 },
    { title: 'Educação no Trânsito', icon: '🚦', color: 'yellow', pageName: 'TrafficEducationGame', delay: 12 },
    { title: 'Certo ou Errado', icon: '✅', color: 'green', pageName: 'RightWrongGame', delay: 13 },
    { title: 'Mundo em Evolução', icon: '🌍', color: 'purple', pageName: 'EvolvingWorld', delay: 14 },
    { title: 'Estados do Brasil', icon: '🇧🇷', color: 'yellow', pageName: 'BrazilStatesGame', delay: 15 },
    ];

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
      
      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
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
              className="w-64 md:w-80 mx-auto drop-shadow-2xl"
            />
          </motion.div>
          
          <p className="text-lg text-purple-600 font-bold mt-2">
            Aprenda brincando! ✨
          </p>
        </motion.div>

        {/* Pet Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-lg rounded-[2rem] p-6 mb-8 border-4 border-white/50 shadow-xl"
        >
          {hasPet ? (
            <Link to={createPageUrl('PetCare')}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <PetDisplay type={currentPet.type} mood="happy" size="md" />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-purple-600 flex items-center justify-center md:justify-start gap-2">
                    <Heart className="text-pink-500 fill-pink-500" />
                    {currentPet.name}
                  </h2>
                  <p className="text-gray-600 mb-4">Clique para cuidar do seu amiguinho!</p>
                  <KidsButton color="pink" size="md">
                    Visitar {currentPet.name} 💕
                  </KidsButton>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-center py-8">
              <motion.div 
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🐱🐶
              </motion.div>
              <h2 className="text-2xl font-bold text-purple-600 mb-2">
                Adote um amiguinho!
              </h2>
              <p className="text-gray-600 mb-4">
                Escolha um gatinho ou cachorrinho para cuidar!
              </p>
              <Link to={createPageUrl('AdoptPet')}>
                <KidsButton color="purple" size="lg">
                  <Sparkles className="inline mr-2" />
                  Adotar Agora!
                </KidsButton>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Virtual Library Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <Link to={createPageUrl('VirtualLibrary')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 border-4 border-white shadow-xl text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  📚
                </motion.div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-white drop-shadow-lg">
                    Biblioteca Virtual
                  </h3>
                  <p className="text-white/90 font-semibold">
                    Crie e leia histórias mágicas!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Você Sabia Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Link to={createPageUrl('DidYouKnow')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-3xl p-6 border-4 border-white shadow-xl text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  💡
                </motion.div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-white drop-shadow-lg">
                    Você Sabia?
                  </h3>
                  <p className="text-white/90 font-semibold">
                    Aprenda curiosidades incríveis!
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 mt-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Gamepad2 className="text-purple-500 w-8 h-8" />
            <h2 className="text-3xl font-bold text-purple-600 text-center">
              Jogos Educativos
            </h2>
            <Gamepad2 className="text-purple-500 w-8 h-8" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games.map((game, index) => (
              <GameCard
                key={game.pageName}
                title={game.title}
                icon={game.icon}
                color={game.color}
                pageName={game.pageName}
                delay={game.delay}
                stars={Math.floor(Math.random() * 4)}
              />
            ))}
          </div>
        </motion.div>

        {/* Rainbow Footer */}
        <motion.div
          className="h-4 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />

        {/* Back Button */}
        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar ao Menu
            </KidsButton>
          </Link>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 py-4"
        >
          <p className="text-sm text-purple-600 font-semibold">
            Desenvolvido por Ermotech Solutions TI
          </p>
        </motion.div>
      </div>
    </div>
  );
}