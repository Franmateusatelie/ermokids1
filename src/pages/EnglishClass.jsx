import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { ArrowLeft, Volume2, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function EnglishClass() {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: lessons = [] } = useQuery({
    queryKey: ['english-lessons'],
    queryFn: () => base44.entities.EnglishLesson.list('-created_date', 100),
  });

  const createLesson = useMutation({
    mutationFn: (lessonData) => base44.entities.EnglishLesson.create(lessonData),
    onSuccess: (newLesson) => {
      queryClient.invalidateQueries(['english-lessons']);
      setCurrentLesson(newLesson);
      setCurrentWordIndex(0);
      setShowEnglish(false);
      setIsGenerating(false);
      soundEffects.playSuccess();
    },
  });

  const categories = [
    { id: 'alfabeto', name: 'Alfabeto', emoji: '🔤' },
    { id: 'numeros', name: 'Números', emoji: '🔢' },
    { id: 'cores', name: 'Cores', emoji: '🎨' },
    { id: 'animais', name: 'Animais', emoji: '🦁' },
    { id: 'familia', name: 'Família', emoji: '👨‍👩‍👧‍👦' },
    { id: 'comida', name: 'Comida', emoji: '🍕' },
    { id: 'corpo', name: 'Corpo Humano', emoji: '👤' },
    { id: 'roupas', name: 'Roupas', emoji: '👕' },
    { id: 'casa', name: 'Casa', emoji: '🏠' },
    { id: 'escola', name: 'Escola', emoji: '🏫' },
    { id: 'frases_basicas', name: 'Frases Básicas', emoji: '💬' },
    { id: 'verbos', name: 'Verbos', emoji: '🏃' },
    { id: 'cumprimentos', name: 'Cumprimentos', emoji: '👋' },
  ];

  const generateLesson = async (category) => {
    setIsGenerating(true);
    soundEffects.playClick();

    try {
      const categoryName = categories.find(c => c.id === category)?.name || category;
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Crie uma aula de inglês para crianças sobre "${categoryName}".

A aula deve conter:
- 8-12 palavras relacionadas ao tema
- Para cada palavra: português, inglês, pronúncia fonética aproximada em português
- 3-5 frases exemplo usando essas palavras
- Uma curiosidade interessante sobre o tema ou cultura inglesa

Use vocabulário apropriado para crianças de 6-12 anos.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            words: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  portuguese: { type: "string" },
                  english: { type: "string" },
                  pronunciation: { type: "string" },
                  image_description: { type: "string" }
                }
              }
            },
            phrases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  portuguese: { type: "string" },
                  english: { type: "string" },
                  pronunciation: { type: "string" }
                }
              }
            },
            fun_fact: { type: "string" }
          }
        }
      });

      createLesson.mutate({
        title: response.title,
        category: category,
        level: 'iniciante',
        words: response.words,
        phrases: response.phrases || [],
        fun_fact: response.fun_fact
      });

    } catch (error) {
      alert('Erro ao gerar aula. Tente novamente!');
      console.error(error);
      setIsGenerating(false);
    }
  };

  const startRandomLesson = () => {
    if (lessons.length > 0) {
      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
      setCurrentLesson(randomLesson);
      setCurrentWordIndex(0);
      setShowEnglish(false);
      soundEffects.playSuccess();
    } else {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      generateLesson(randomCategory.id);
    }
  };

  const generateImage = async (description) => {
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Simple, colorful, child-friendly illustration of: ${description}. Cartoon style, bright colors, educational, no text.`
      });
      setImageUrl(result.url);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  useEffect(() => {
    if (currentLesson && currentLesson.words[currentWordIndex]) {
      const word = currentLesson.words[currentWordIndex];
      if (word.image_description) {
        generateImage(word.image_description);
      }
    }
  }, [currentWordIndex, currentLesson]);

  const handleNextWord = () => {
    if (currentWordIndex < currentLesson.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowEnglish(false);
      soundEffects.playClick();
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowEnglish(false);
      soundEffects.playClick();
    }
  };

  const handleRevealEnglish = () => {
    setShowEnglish(true);
    soundEffects.playSuccess();
  };

  const speakWord = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakPhrase = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.7;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentWord = currentLesson?.words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🇬🇧
          </motion.div>
          <h1 className="text-5xl font-black text-blue-900 mb-2 drop-shadow-lg">
            English Class
          </h1>
          <p className="text-blue-800 text-xl font-bold">
            Aprenda inglês com o Teacher! 👨‍🏫
          </p>
        </motion.div>

        {!currentLesson ? (
          <div className="space-y-6">
            {/* Teacher Welcome */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl text-center"
            >
              <div className="text-9xl mb-4">👨‍🏫</div>
              <h2 className="text-3xl font-black text-purple-600 mb-4">
                Hello, students! 👋
              </h2>
              <p className="text-gray-700 text-lg font-bold mb-6">
                Escolha um tema ou comece uma aula aleatória!
              </p>
              
              <KidsButton
                color="green"
                size="xl"
                onClick={startRandomLesson}
                disabled={isGenerating}
                className="mb-6"
              >
                {isGenerating ? (
                  <><Loader2 className="inline animate-spin w-6 h-6 mr-2" /> Preparando Aula...</>
                ) : (
                  <><Sparkles className="inline w-6 h-6 mr-2" /> Começar Aula Aleatória!</>
                )}
              </KidsButton>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl"
            >
              <h3 className="text-2xl font-black text-center text-purple-600 mb-4">
                Ou escolha um tema:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <KidsButton
                    key={cat.id}
                    color="blue"
                    size="md"
                    onClick={() => generateLesson(cat.id)}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {cat.emoji} {cat.name}
                  </KidsButton>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lesson Header */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">👨‍🏫</div>
                  <div>
                    <h2 className="text-3xl font-black text-purple-600">{currentLesson.title}</h2>
                    <p className="text-gray-600 font-bold">
                      Palavra {currentWordIndex + 1} de {currentLesson.words.length}
                    </p>
                  </div>
                </div>
                <KidsButton
                  color="orange"
                  size="md"
                  onClick={() => setCurrentLesson(null)}
                >
                  Nova Aula
                </KidsButton>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Word Card */}
              <motion.div
                key={currentWordIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
              >
                {/* Image */}
                {imageUrl && (
                  <div className="mb-6">
                    <img
                      src={imageUrl}
                      alt={currentWord.portuguese}
                      className="w-full h-64 object-cover rounded-2xl border-4 border-purple-200"
                    />
                  </div>
                )}

                {/* Portuguese Word */}
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-6 mb-4 border-4 border-blue-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-blue-600">🇧🇷 PORTUGUÊS</p>
                    <button
                      onClick={() => speakWord(currentWord.portuguese, 'pt-BR')}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-4xl font-black text-blue-900">{currentWord.portuguese}</p>
                </div>

                {/* English Word (Hidden/Revealed) */}
                {!showEnglish ? (
                  <KidsButton
                    color="green"
                    size="xl"
                    onClick={handleRevealEnglish}
                    className="w-full"
                  >
                    Ver em Inglês 🇬🇧
                  </KidsButton>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl p-6 border-4 border-green-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-green-600">🇬🇧 ENGLISH</p>
                        <button
                          onClick={() => speakWord(currentWord.english, 'en-US')}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-4xl font-black text-green-900">{currentWord.english}</p>
                    </div>
                    <div className="bg-purple-100 rounded-2xl p-4 border-4 border-purple-300">
                      <p className="text-sm font-bold text-purple-600 mb-1">🔊 PRONÚNCIA</p>
                      <p className="text-2xl font-black text-purple-900">{currentWord.pronunciation}</p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  <KidsButton
                    color="blue"
                    size="lg"
                    onClick={handlePrevWord}
                    disabled={currentWordIndex === 0}
                    className="flex-1"
                  >
                    ← Anterior
                  </KidsButton>
                  <KidsButton
                    color="blue"
                    size="lg"
                    onClick={handleNextWord}
                    disabled={currentWordIndex === currentLesson.words.length - 1}
                    className="flex-1"
                  >
                    Próxima →
                  </KidsButton>
                </div>
              </motion.div>

              {/* Phrases & Fun Fact */}
              <div className="space-y-6">
                {/* Phrases */}
                {currentLesson.phrases && currentLesson.phrases.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl"
                  >
                    <h3 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2">
                      💬 Frases Exemplo
                    </h3>
                    <div className="space-y-3">
                      {currentLesson.phrases.map((phrase, i) => (
                        <div key={i} className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-gray-700 font-bold mb-1">🇧🇷 {phrase.portuguese}</p>
                              <p className="text-orange-800 font-black text-lg mb-1">🇬🇧 {phrase.english}</p>
                              <p className="text-sm text-purple-600 italic">🔊 {phrase.pronunciation}</p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <button
                                onClick={() => speakPhrase(phrase.portuguese, 'pt-BR')}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors flex-shrink-0"
                                title="Ouvir em Português"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => speakPhrase(phrase.english, 'en-US')}
                                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors flex-shrink-0"
                                title="Ouvir em Inglês"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Fun Fact */}
                {currentLesson.fun_fact && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl"
                  >
                    <h3 className="text-2xl font-black text-pink-600 mb-3 flex items-center gap-2">
                      ✨ Did you know?
                    </h3>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {currentLesson.fun_fact}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
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