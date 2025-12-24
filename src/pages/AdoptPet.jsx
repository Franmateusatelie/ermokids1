import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import PetDisplay from '@/components/kids/PetDisplay';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdoptPet() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState('');
  const [showStars, setShowStars] = useState(false);

  const createPetMutation = useMutation({
    mutationFn: (data) => base44.entities.Pet.create(data),
    onSuccess: () => {
      setShowStars(true);
    },
  });

  const handleAdopt = () => {
    createPetMutation.mutate({
      type: selectedPet,
      name: petName,
      happiness: 100,
      hunger: 100,
      energy: 100,
      cleanliness: 100,
      last_fed: new Date().toISOString(),
      last_played: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  };

  const handleStarsComplete = () => {
    navigate(createPageUrl('PetCare'));
  };

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
      <MusicPlayer />
      <StarExplosion show={showStars} onComplete={handleStarsComplete} />
      
      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-4"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6948130c63a4aed964627876/86064cad5_ChatGPTImage20dedezde202502_07_51-Photoroom.png"
            alt="ErmoKids"
            className="w-48 mx-auto drop-shadow-xl"
          />
        </motion.div>

        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex items-center gap-2 text-purple-600 font-bold mb-6 bg-white/60 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Voltar
          </motion.div>
        </Link>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-8 border-4 border-white/50 shadow-xl"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎉
                </motion.div>
                <h1 className="text-3xl font-black text-purple-600 mb-4">
                  Escolha seu Amiguinho!
                </h1>
                <p className="text-gray-600 mb-8">
                  Quem vai ser seu novo melhor amigo?
                </p>

                <div className="flex justify-center gap-8 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPet('cat')}
                    className={`
                      p-6 rounded-3xl cursor-pointer transition-all
                      ${selectedPet === 'cat' 
                        ? 'bg-gradient-to-br from-pink-300 to-purple-300 border-4 border-pink-400 shadow-xl' 
                        : 'bg-white/50 border-4 border-white/50 hover:border-pink-300'
                      }
                    `}
                  >
                    <PetDisplay type="cat" mood="happy" size="md" />
                    <p className="text-lg font-bold text-purple-600 mt-2">Gatinho</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPet('dog')}
                    className={`
                      p-6 rounded-3xl cursor-pointer transition-all
                      ${selectedPet === 'dog' 
                        ? 'bg-gradient-to-br from-blue-300 to-cyan-300 border-4 border-blue-400 shadow-xl' 
                        : 'bg-white/50 border-4 border-white/50 hover:border-blue-300'
                      }
                    `}
                  >
                    <PetDisplay type="dog" mood="happy" size="md" />
                    <p className="text-lg font-bold text-blue-600 mt-2">Cachorrinho</p>
                  </motion.div>
                </div>

                <KidsButton
                  color={selectedPet === 'cat' ? 'pink' : selectedPet === 'dog' ? 'blue' : 'purple'}
                  onClick={() => selectedPet && setStep(2)}
                  disabled={!selectedPet}
                >
                  Próximo ➡️
                </KidsButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <PetDisplay type={selectedPet} mood="happy" size="lg" />
                
                <h2 className="text-2xl font-bold text-purple-600 mb-4 mt-4">
                  Qual será o nome?
                </h2>
                
                <div className="max-w-xs mx-auto mb-6">
                  <Input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Digite o nome..."
                    className="text-center text-xl font-bold border-4 border-purple-200 rounded-2xl h-14 focus:border-purple-400"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <KidsButton color="gray" onClick={() => setStep(1)}>
                    ⬅️ Voltar
                  </KidsButton>
                  <KidsButton
                    color="green"
                    onClick={handleAdopt}
                    disabled={!petName.trim() || createPetMutation.isPending}
                  >
                    {createPetMutation.isPending ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ⭐
                      </motion.span>
                    ) : (
                      <>
                        <Heart className="inline mr-2 fill-white" />
                        Adotar!
                      </>
                    )}
                  </KidsButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
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