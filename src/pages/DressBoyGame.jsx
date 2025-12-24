import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

const CLOTHES = [
  { id: 1, emoji: '👕', color: 'from-blue-300 to-blue-400', name: 'Camiseta' },
  { id: 2, emoji: '👔', color: 'from-gray-300 to-gray-400', name: 'Gravata' },
  { id: 3, emoji: '🧥', color: 'from-red-300 to-red-400', name: 'Jaqueta' },
  { id: 4, emoji: '🦺', color: 'from-orange-300 to-orange-400', name: 'Colete' },
  { id: 5, emoji: '🎽', color: 'from-green-300 to-green-400', name: 'Regata' },
  { id: 6, emoji: '🧥', color: 'from-purple-300 to-purple-400', name: 'Casaco' },
];

const ACCESSORIES = [
  { id: 1, emoji: '🎩', name: 'Cartola' },
  { id: 2, emoji: '🧢', name: 'Boné' },
  { id: 3, emoji: '⛑️', name: 'Capacete' },
  { id: 4, emoji: '🕶️', name: 'Óculos' },
  { id: 5, emoji: '⚽', name: 'Bola' },
  { id: 6, emoji: '🎸', name: 'Guitarra' },
];

const SHOES = [
  { id: 1, emoji: '👟', name: 'Tênis' },
  { id: 2, emoji: '👞', name: 'Sapato' },
  { id: 3, emoji: '👢', name: 'Bota' },
  { id: 4, emoji: '🥾', name: 'Coturno' },
  { id: 5, emoji: '🩴', name: 'Chinelo' },
  { id: 6, emoji: '⚽', name: 'Chuteira' },
];

export default function DressBoyGame() {
  const [selectedClothes, setSelectedClothes] = useState(CLOTHES[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [selectedShoe, setSelectedShoe] = useState(null);

  const selectItem = (item, setter) => {
    setter(item);
    soundEffects.playSuccess();
  };

  const clearAll = () => {
    setSelectedClothes(CLOTHES[0]);
    setSelectedAccessory(null);
    setSelectedShoe(null);
    soundEffects.playClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-300 to-indigo-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">🧒 Vista o Menino</h1>
          <p className="text-white text-lg font-bold">Escolha roupas e acessórios!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Boneco */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                key={selectedClothes.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-8xl mb-4"
              >
                👦
              </motion.div>
              
              <motion.div
                key={selectedClothes.id + 'clothes'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-7xl mb-4 bg-gradient-to-br ${selectedClothes.color} rounded-full p-4 inline-block`}
              >
                {selectedClothes.emoji}
              </motion.div>

              <div className="flex justify-center gap-4 mb-4">
                {selectedAccessory && (
                  <motion.div
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="text-5xl"
                  >
                    {selectedAccessory.emoji}
                  </motion.div>
                )}
              </div>

              {selectedShoe && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl"
                >
                  {selectedShoe.emoji}
                </motion.div>
              )}

              <div className="mt-6">
                <KidsButton color="blue" size="md" onClick={clearAll}>
                  <Sparkles className="inline mr-2" />
                  Limpar Tudo
                </KidsButton>
              </div>
            </div>
          </motion.div>

          {/* Opções */}
          <div className="space-y-4">
            {/* Roupas */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white shadow-xl"
            >
              <h3 className="text-xl font-black text-blue-600 mb-3">Roupas</h3>
              <div className="grid grid-cols-3 gap-2">
                {CLOTHES.map((clothes) => (
                  <motion.button
                    key={clothes.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(clothes, setSelectedClothes)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedClothes?.id === clothes.id
                        ? 'bg-blue-200 ring-4 ring-blue-400'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    {clothes.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Acessórios */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white shadow-xl"
            >
              <h3 className="text-xl font-black text-cyan-600 mb-3">Acessórios</h3>
              <div className="grid grid-cols-3 gap-2">
                {ACCESSORIES.map((accessory) => (
                  <motion.button
                    key={accessory.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(accessory, setSelectedAccessory)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedAccessory?.id === accessory.id
                        ? 'bg-cyan-200 ring-4 ring-cyan-400'
                        : 'bg-white hover:bg-cyan-50'
                    }`}
                  >
                    {accessory.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Sapatos */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white shadow-xl"
            >
              <h3 className="text-xl font-black text-indigo-600 mb-3">Calçados</h3>
              <div className="grid grid-cols-3 gap-2">
                {SHOES.map((shoe) => (
                  <motion.button
                    key={shoe.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(shoe, setSelectedShoe)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedShoe?.id === shoe.id
                        ? 'bg-indigo-200 ring-4 ring-indigo-400'
                        : 'bg-white hover:bg-indigo-50'
                    }`}
                  >
                    {shoe.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="cyan" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}