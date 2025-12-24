import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import WorldView from '@/components/evolving-world/WorldView';
import ActivityCard from '@/components/evolving-world/ActivityCard';
import { ArrowLeft, Star, Sparkles, Award } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

const ACTIVITIES = [
  {
    id: 'letters-1',
    type: 'letters',
    name: 'ABC das Vogais',
    description: 'Aprenda as vogais A, E, I, O, U',
    icon: '📝',
    stars: 3,
    requiredStars: 0,
    unlocks: { type: 'library', items: ['🏫', '📚'] }
  },
  {
    id: 'numbers-1',
    type: 'numbers',
    name: 'Contando até 10',
    description: 'Aprenda os números de 1 a 10',
    icon: '🔢',
    stars: 3,
    requiredStars: 0,
    unlocks: { type: 'house', items: ['🏠', '👨‍👩‍👧'] }
  },
  {
    id: 'emotions-1',
    type: 'emotions',
    name: 'Sentimentos',
    description: 'Reconheça diferentes emoções',
    icon: '😊',
    stars: 3,
    requiredStars: 1,
    unlocks: { type: 'garden', items: ['🌺', '🌸', '🦋'] }
  },
  {
    id: 'music-1',
    type: 'music',
    name: 'Sons Musicais',
    description: 'Descubra instrumentos musicais',
    icon: '🎵',
    stars: 3,
    requiredStars: 2,
    unlocks: { type: 'music_plaza', items: ['🎠', '🎪'] }
  },
  {
    id: 'routine-1',
    type: 'routine',
    name: 'Hora do Dia',
    description: 'Aprenda sobre manhã, tarde e noite',
    icon: '🕐',
    stars: 3,
    requiredStars: 3,
    unlocks: { type: 'clock_tower', items: ['⏰', '☀️'] }
  },
  {
    id: 'environment-1',
    type: 'environment',
    name: 'Natureza',
    description: 'Conheça árvores e animais',
    icon: '🌳',
    stars: 3,
    requiredStars: 4,
    unlocks: { type: 'tree', items: ['🌳', '🦁', '🐘', '🦒'] }
  },
];

export default function EvolvingWorld() {
  const [worldProgress, setWorldProgress] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityQuestion, setActivityQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('day');

  const queryClient = useQueryClient();

  const { data: worlds = [] } = useQuery({
    queryKey: ['world-progress'],
    queryFn: () => base44.entities.WorldProgress.list(),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['world-activities'],
    queryFn: () => base44.entities.WorldActivity.list(),
    enabled: !!worldProgress,
  });

  const createWorld = useMutation({
    mutationFn: (worldData) => base44.entities.WorldProgress.create(worldData),
    onSuccess: (newWorld) => {
      queryClient.invalidateQueries(['world-progress']);
      setWorldProgress(newWorld);
      soundEffects.playSuccess();
    },
  });

  const updateWorld = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WorldProgress.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['world-progress']);
    },
  });

  const createActivity = useMutation({
    mutationFn: (activityData) => base44.entities.WorldActivity.create(activityData),
    onSuccess: () => {
      queryClient.invalidateQueries(['world-activities']);
      soundEffects.playVictory();
    },
  });

  useEffect(() => {
    if (worlds.length > 0) {
      setWorldProgress(worlds[0]);
    }
  }, [worlds]);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
  }, []);

  const handleCreateWorld = (name) => {
    createWorld.mutate({
      world_name: name,
      total_stars: 0,
      buildings: [],
      characters: ['👧'],
      decorations: [],
      activities_completed: 0,
      last_visit: new Date().toISOString(),
    });
  };

  const generateActivity = (activity) => {
    const questions = {
      'letters-1': [
        { question: 'Qual letra vem primeiro no alfabeto?', options: ['A', 'B', 'C', 'D'], correct: 0 },
        { question: 'Qual destas é uma vogal?', options: ['B', 'E', 'F', 'G'], correct: 1 },
        { question: 'Quantas vogais existem?', options: ['3', '4', '5', '6'], correct: 2 },
      ],
      'numbers-1': [
        { question: 'Quantos dedos você tem em uma mão?', options: ['3', '4', '5', '6'], correct: 2 },
        { question: 'Quanto é 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
        { question: 'Qual número vem depois do 5?', options: ['4', '6', '7', '8'], correct: 1 },
      ],
      'emotions-1': [
        { question: 'Como você se sente quando ganha um presente?', options: ['😢 Triste', '😊 Feliz', '😠 Bravo', '😴 Com sono'], correct: 1 },
        { question: 'O que sentimos quando perdemos algo?', options: ['😊 Feliz', '😢 Triste', '😄 Animado', '😴 Com sono'], correct: 1 },
        { question: 'Como ficamos ao brincar com amigos?', options: ['😠 Bravo', '😢 Triste', '😊 Feliz', '😴 Com sono'], correct: 2 },
      ],
      'music-1': [
        { question: 'Qual instrumento tem cordas?', options: ['🥁 Tambor', '🎸 Violão', '🎺 Trompete', '🎹 Piano'], correct: 1 },
        { question: 'O que fazemos com tambor?', options: ['Soprar', 'Bater', 'Apertar', 'Escrever'], correct: 1 },
        { question: 'Qual faz som alto?', options: ['🎻 Violino', '🎺 Trompete', '🎸 Violão', '🎹 Piano'], correct: 1 },
      ],
      'routine-1': [
        { question: 'Quando acordamos?', options: ['🌙 Noite', '🌅 Manhã', '🌆 Tarde', '🌃 Madrugada'], correct: 1 },
        { question: 'Quando almoçamos?', options: ['🌅 Manhã', '🌆 Tarde', '🌙 Noite', '🌃 Madrugada'], correct: 1 },
        { question: 'Quando dormimos?', options: ['🌅 Manhã', '🌆 Tarde', '🌙 Noite', '☀️ Meio-dia'], correct: 2 },
      ],
      'environment-1': [
        { question: 'O que as árvores produzem?', options: ['Água', 'Oxigênio', 'Pedra', 'Metal'], correct: 1 },
        { question: 'Onde vivem os leões?', options: ['No mar', 'Na savana', 'No gelo', 'Na cidade'], correct: 1 },
        { question: 'O que as plantas precisam?', options: ['TV', 'Água e sol', 'Doces', 'Brinquedos'], correct: 1 },
      ],
    };

    const activityQuestions = questions[activity.id] || [];
    const randomQuestion = activityQuestions[Math.floor(Math.random() * activityQuestions.length)];
    
    setActivityQuestion(randomQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const startActivity = (activity) => {
    setCurrentActivity(activity);
    generateActivity(activity);
    soundEffects.playClick();
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === activityQuestion.correct;
    setShowResult(true);

    if (isCorrect) {
      soundEffects.playSuccess();
      
      setTimeout(() => {
        const newBuildings = [...(worldProgress.buildings || [])];
        const buildingExists = newBuildings.find(b => b.type === currentActivity.unlocks.type);
        
        if (!buildingExists) {
          newBuildings.push({ type: currentActivity.unlocks.type, unlocked: true, level: 1 });
        }

        const newDecorations = [...(worldProgress.decorations || [])];
        currentActivity.unlocks.items.forEach(item => {
          if (!newDecorations.includes(item)) {
            newDecorations.push(item);
          }
        });

        updateWorld.mutate({
          id: worldProgress.id,
          data: {
            ...worldProgress,
            total_stars: (worldProgress.total_stars || 0) + currentActivity.stars,
            buildings: newBuildings,
            decorations: newDecorations,
            activities_completed: (worldProgress.activities_completed || 0) + 1,
            last_visit: new Date().toISOString(),
          },
        });

        createActivity.mutate({
          world_id: worldProgress.id,
          activity_type: currentActivity.type,
          activity_name: currentActivity.name,
          completed: true,
          stars_earned: currentActivity.stars,
          unlocked_items: currentActivity.unlocks.items,
        });

        setTimeout(() => {
          setCurrentActivity(null);
          setActivityQuestion(null);
        }, 2000);
      }, 1500);
    } else {
      soundEffects.playError();
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const isActivityCompleted = (activityId) => {
    return activities.some(a => a.activity_name === ACTIVITIES.find(act => act.id === activityId)?.name);
  };

  const isActivityUnlocked = (activity) => {
    const completedCount = worldProgress?.activities_completed || 0;
    return completedCount >= activity.requiredStars;
  };

  if (!worldProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 p-4 overflow-hidden relative">
        <FloatingElements />
        
        <div className="relative z-10 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-white shadow-2xl text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              🌍
            </motion.div>
            <h1 className="text-4xl font-black text-purple-600 mb-4">
              Mundo em Evolução
            </h1>
            <p className="text-xl text-gray-700 font-bold mb-8">
              Crie seu próprio mundo e veja ele crescer!
            </p>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Dê um nome ao seu mundo..."
                className="w-full px-6 py-4 rounded-2xl border-4 border-purple-300 text-xl font-bold text-center mb-4 focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleCreateWorld(e.target.value);
                  }
                }}
              />
              <KidsButton
                color="purple"
                size="xl"
                onClick={() => {
                  const input = document.querySelector('input');
                  if (input.value.trim()) {
                    handleCreateWorld(input.value);
                  }
                }}
              >
                <Sparkles className="inline mr-2" />
                Criar Meu Mundo!
              </KidsButton>
            </div>
          </motion.div>

          <div className="flex justify-center mt-6">
            <Link to={createPageUrl('KidsArea')}>
              <KidsButton color="orange" size="lg">
                <ArrowLeft className="inline mr-2" />
                Voltar
              </KidsButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentActivity && activityQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
        <FloatingElements />
        
        <div className="relative z-10 max-w-3xl mx-auto pt-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{currentActivity.icon}</div>
              <h2 className="text-3xl font-black text-purple-600 mb-2">
                {currentActivity.name}
              </h2>
            </div>

            <div className="bg-purple-100 rounded-2xl p-6 border-4 border-purple-300 mb-6">
              <p className="text-2xl font-bold text-gray-800 text-center">
                {activityQuestion.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activityQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`p-6 rounded-2xl border-4 font-black text-xl transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === activityQuestion.correct
                          ? 'bg-green-400 border-green-600 text-white'
                          : 'bg-red-400 border-red-600 text-white'
                        : 'bg-purple-400 border-purple-600 text-white'
                      : 'bg-white border-purple-300 text-gray-800 hover:bg-purple-50'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {!showResult && selectedAnswer !== null && (
              <KidsButton color="green" size="xl" onClick={checkAnswer} className="w-full">
                Confirmar Resposta
              </KidsButton>
            )}

            {showResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                {selectedAnswer === activityQuestion.correct ? (
                  <div>
                    <div className="text-7xl mb-4">🎉</div>
                    <p className="text-3xl font-black text-green-600 mb-2">Parabéns!</p>
                    <p className="text-xl font-bold text-gray-700">
                      +{currentActivity.stars} estrelas ⭐
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-7xl mb-4">💪</div>
                    <p className="text-3xl font-black text-orange-600 mb-2">Tente novamente!</p>
                    <p className="text-xl font-bold text-gray-700">Você consegue!</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            🌍 {worldProgress.world_name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white font-bold text-lg">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <span>{worldProgress.total_stars} Estrelas</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-300" />
              <span>{worldProgress.activities_completed} Atividades</span>
            </div>
          </div>
        </motion.div>

        {/* Mundo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <WorldView progress={worldProgress} timeOfDay={timeOfDay} />
        </motion.div>

        {/* Atividades */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6"
        >
          <h2 className="text-3xl font-black text-purple-600 mb-4 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Atividades Educativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isUnlocked={isActivityUnlocked(activity)}
                isCompleted={isActivityCompleted(activity.id)}
                onStart={() => startActivity(activity)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link to={createPageUrl('KidsArea')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}