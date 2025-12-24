import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

const DRESSES = [
  { id: 1, emoji: '👗', color: 'from-pink-300 to-pink-400', name: 'Vestido Rosa' },
  { id: 2, emoji: '👗', color: 'from-red-300 to-red-400', name: 'Vestido Vermelho' },
  { id: 3, emoji: '🩱', color: 'from-blue-300 to-blue-400', name: 'Maiô' },
  { id: 4, emoji: '👚', color: 'from-purple-300 to-purple-400', name: 'Blusa' },
  { id: 5, emoji: '👗', color: 'from-yellow-300 to-yellow-400', name: 'Vestido Amarelo' },
  { id: 6, emoji: '🥻', color: 'from-orange-300 to-orange-400', name: 'Sari' },
];

const ACCESSORIES = [
  { id: 1, emoji: '👑', name: 'Coroa' },
  { id: 2, emoji: '🎀', name: 'Laço' },
  { id: 3, emoji: '💄', name: 'Batom' },
  { id: 4, emoji: '💅', name: 'Esmalte' },
  { id: 5, emoji: '👒', name: 'Chapéu' },
  { id: 6, emoji: '🌸', name: 'Flor' },
];

const SHOES = [
  { id: 1, emoji: '👠', name: 'Salto' },
  { id: 2, emoji: '🩰', name: 'Sapatilha de Balé' },
  { id: 3, emoji: '🥿', name: 'Sapatilha' },
  { id: 4, emoji: '👢', name: 'Bota' },
  { id: 5, emoji: '🩴', name: 'Chinelo' },
  { id: 6, emoji: '👡', name: 'Sandália' },
];

export default function DressUpGame() {
  const [selectedDress, setSelectedDress] = useState(DRESSES[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [selectedShoe, setSelectedShoe] = useState(null);

  const selectItem = (item, setter) => {
    setter(item);
    soundEffects.playSuccess();
  };

  const clearAll = () => {
    setSelectedDress(DRESSES[0]);
    setSelectedAccessory(null);
    setSelectedShoe(null);
    soundEffects.playClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">👗 Vista a Menina</h1>
          <p className="text-white text-lg font-bold">Escolha roupas e acessórios!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Boneca */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                key={selectedDress.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-8xl mb-4"
              >
                👧
              </motion.div>
              
              <motion.div
                key={selectedDress.id + 'dress'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-7xl mb-4 bg-gradient-to-br ${selectedDress.color} rounded-full p-4 inline-block`}
              >
                {selectedDress.emoji}
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
                <KidsButton color="purple" size="md" onClick={clearAll}>
                  <Sparkles className="inline mr-2" />
                  Limpar Tudo
                </KidsButton>
              </div>
            </div>
          </motion.div>

          {/* Opções */}
          <div className="space-y-4">
            {/* Vestidos */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white shadow-xl"
            >
              <h3 className="text-xl font-black text-pink-600 mb-3">Roupas</h3>
              <div className="grid grid-cols-3 gap-2">
                {DRESSES.map((dress) => (
                  <motion.button
                    key={dress.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(dress, setSelectedDress)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedDress?.id === dress.id
                        ? 'bg-pink-200 ring-4 ring-pink-400'
                        : 'bg-white hover:bg-pink-50'
                    }`}
                  >
                    {dress.emoji}
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
              <h3 className="text-xl font-black text-purple-600 mb-3">Acessórios</h3>
              <div className="grid grid-cols-3 gap-2">
                {ACCESSORIES.map((accessory) => (
                  <motion.button
                    key={accessory.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(accessory, setSelectedAccessory)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedAccessory?.id === accessory.id
                        ? 'bg-purple-200 ring-4 ring-purple-400'
                        : 'bg-white hover:bg-purple-50'
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
              <h3 className="text-xl font-black text-blue-600 mb-3">Calçados</h3>
              <div className="grid grid-cols-3 gap-2">
                {SHOES.map((shoe) => (
                  <motion.button
                    key={shoe.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectItem(shoe, setSelectedShoe)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      selectedShoe?.id === shoe.id
                        ? 'bg-blue-200 ring-4 ring-blue-400'
                        : 'bg-white hover:bg-blue-50'
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
            <KidsButton color="pink" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}