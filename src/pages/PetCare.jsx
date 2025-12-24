import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import PetDisplay from '@/components/kids/PetDisplay';
import StatBar from '@/components/kids/StatBar';
import KidsButton from '@/components/kids/KidsButton';
import StarExplosion from '@/components/kids/StarExplosion';
import MusicPlayer from '@/components/kids/MusicPlayer';
import { ArrowLeft, Utensils, Gamepad2, Bath, Moon, Heart } from 'lucide-react';

export default function PetCare() {
  const queryClient = useQueryClient();
  const [showStars, setShowStars] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list(),
  });

  const pet = pets[0];

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Pet.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setShowStars(true);
    },
  });

  const getMood = () => {
    if (!pet) return 'happy';
    const avg = (pet.happiness + pet.hunger + pet.energy + pet.cleanliness) / 4;
    if (avg < 30) return 'sad';
    if (pet.hunger < 30) return 'hungry';
    if (pet.energy < 30) return 'sleepy';
    return 'happy';
  };

  const handleAction = (action) => {
    if (!pet) return;

    let updates = {};
    let feedback = '';

    switch (action) {
      case 'feed':
        updates = { 
          hunger: Math.min(100, pet.hunger + 30),
          last_fed: new Date().toISOString()
        };
        feedback = '🍎 Humm, que delícia!';
        break;
      case 'play':
        updates = { 
          happiness: Math.min(100, pet.happiness + 25),
          energy: Math.max(0, pet.energy - 10),
          last_played: new Date().toISOString()
        };
        feedback = '🎾 Que divertido!';
        break;
      case 'bath':
        updates = { cleanliness: Math.min(100, pet.cleanliness + 40) };
        feedback = '🛁 Limpinho e cheiroso!';
        break;
      case 'sleep':
        updates = { energy: Math.min(100, pet.energy + 35) };
        feedback = '💤 Zzz... Bons sonhos!';
        break;
    }

    setActionFeedback(feedback);
    updatePetMutation.mutate({ id: pet.id, data: updates });
    
    setTimeout(() => setActionFeedback(null), 2000);
  };

  // Decay stats over time
  useEffect(() => {
    if (!pet) return;

    const interval = setInterval(() => {
      const updates = {
        hunger: Math.max(0, pet.hunger - 1),
        happiness: Math.max(0, pet.happiness - 0.5),
        energy: Math.max(0, pet.energy - 0.5),
        cleanliness: Math.max(0, pet.cleanliness - 0.5),
      };
      
      base44.entities.Pet.update(pet.id, updates);
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [pet?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center bg-white/70 rounded-3xl p-8">
          <p className="text-2xl font-bold text-purple-600 mb-4">
            Você ainda não tem um pet!
          </p>
          <Link to={createPageUrl('AdoptPet')}>
            <KidsButton color="purple">Adotar um amiguinho 🐾</KidsButton>
          </Link>
        </div>
      </div>
    );
  }

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
      <StarExplosion show={showStars} onComplete={() => setShowStars(false)} />

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

        {/* Pet Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-6 border-4 border-white/50 shadow-xl mb-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-purple-600 flex items-center justify-center gap-2">
              <Heart className="text-pink-500 fill-pink-500" />
              {pet.name}
            </h1>
          </div>

          <div className="flex justify-center mb-6">
            <PetDisplay type={pet.type} mood={getMood()} size="xl" />
          </div>

          {/* Action Feedback */}
          <AnimatePresence>
            {actionFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-2xl font-bold text-purple-600 mb-4"
              >
                {actionFeedback}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="grid gap-3 mb-6">
            <StatBar label="Fome" value={Math.round(pet.hunger)} icon="🍕" color="orange" />
            <StatBar label="Felicidade" value={Math.round(pet.happiness)} icon="😊" color="pink" />
            <StatBar label="Energia" value={Math.round(pet.energy)} icon="⚡" color="yellow" />
            <StatBar label="Limpeza" value={Math.round(pet.cleanliness)} icon="✨" color="blue" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <KidsButton 
              color="orange" 
              onClick={() => handleAction('feed')}
              disabled={updatePetMutation.isPending}
            >
              <Utensils className="inline mr-2" size={20} />
              Alimentar
            </KidsButton>
            
            <KidsButton 
              color="pink" 
              onClick={() => handleAction('play')}
              disabled={updatePetMutation.isPending}
            >
              <Gamepad2 className="inline mr-2" size={20} />
              Brincar
            </KidsButton>
            
            <KidsButton 
              color="blue" 
              onClick={() => handleAction('bath')}
              disabled={updatePetMutation.isPending}
            >
              <Bath className="inline mr-2" size={20} />
              Banho
            </KidsButton>
            
            <KidsButton 
              color="purple" 
              onClick={() => handleAction('sleep')}
              disabled={updatePetMutation.isPending}
            >
              <Moon className="inline mr-2" size={20} />
              Dormir
            </KidsButton>
          </div>
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