import React from 'react';
import { motion } from 'framer-motion';

export default function WorldView({ progress, timeOfDay }) {
  const buildings = progress?.buildings || [];
  const characters = progress?.characters || [];
  const decorations = progress?.decorations || [];

  const skyColor = timeOfDay === 'night' 
    ? 'from-indigo-900 via-purple-800 to-blue-900'
    : 'from-blue-300 via-cyan-200 to-blue-400';

  const getBuildingEmoji = (type) => {
    const emojis = {
      library: '📚',
      school: '🏫',
      house: '🏠',
      building: '🏢',
      garden: '🌺',
      playground: '🎠',
      music_plaza: '🎵',
      clock_tower: '🕐',
      tree: '🌳',
    };
    return emojis[type] || '🏠';
  };

  return (
    <div className={`relative h-96 rounded-3xl overflow-hidden bg-gradient-to-b ${skyColor} border-4 border-white shadow-2xl`}>
      {/* Sol ou Lua */}
      <motion.div
        animate={{ 
          y: timeOfDay === 'night' ? [0, -5, 0] : [0, 10, 0],
          rotate: [0, 360]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-8 text-6xl"
      >
        {timeOfDay === 'night' ? '🌙' : '☀️'}
      </motion.div>

      {/* Estrelas (noite) */}
      {timeOfDay === 'night' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="absolute text-2xl"
              style={{
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 90}%`,
              }}
            >
              ⭐
            </motion.div>
          ))}
        </>
      )}

      {/* Nuvens */}
      {timeOfDay === 'day' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: [-50, 100] }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
              className="absolute text-4xl opacity-60"
              style={{
                top: `${20 + i * 15}%`,
              }}
            >
              ☁️
            </motion.div>
          ))}
        </>
      )}

      {/* Grama base */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-green-400 to-green-600" />

      {/* Decorações (árvores, flores) */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-around px-4">
        {decorations.map((dec, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-4xl"
          >
            {dec}
          </motion.div>
        ))}
      </div>

      {/* Construções */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-around px-8">
        {buildings.map((building, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ delay: i * 0.2, type: "spring" }}
            className="text-6xl cursor-pointer"
          >
            {getBuildingEmoji(building.type)}
          </motion.div>
        ))}
      </div>

      {/* Personagens */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-around px-12">
        {characters.map((char, i) => (
          <motion.div
            key={i}
            animate={{ 
              x: [0, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="text-5xl"
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Mensagem se mundo vazio */}
      {buildings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-white shadow-xl text-center">
            <p className="text-2xl font-black text-purple-600 mb-2">
              Seu mundo está esperando! 🌟
            </p>
            <p className="text-gray-700 font-bold">
              Complete atividades para construir!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}