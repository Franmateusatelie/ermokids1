import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Loader2, BookOpen } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function Dictionary() {
  const [searchWord, setSearchWord] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!searchWord.trim()) return;

    setIsSearching(true);
    soundEffects.playClick();

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um dicionário em português brasileiro para crianças. 

Forneça o significado da palavra "${searchWord}" de forma clara e simples para crianças.

Inclua:
1. Definição simples e clara
2. Classe gramatical (substantivo, verbo, adjetivo, etc)
3. 2-3 exemplos de uso em frases
4. Sinônimos (se houver)
5. Uma curiosidade ou dica interessante sobre a palavra

Use linguagem apropriada para crianças de 6-12 anos.`,
        response_json_schema: {
          type: "object",
          properties: {
            word: { type: "string" },
            definition: { type: "string" },
            word_class: { type: "string" },
            examples: {
              type: "array",
              items: { type: "string" }
            },
            synonyms: {
              type: "array",
              items: { type: "string" }
            },
            fun_fact: { type: "string" }
          }
        }
      });

      setResult(response);
    } catch (error) {
      alert('Erro ao buscar palavra. Tente novamente!');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            📖
          </motion.div>
          <h1 className="text-5xl font-black text-blue-900 mb-2 drop-shadow-lg">
            Dicionário Português
          </h1>
          <p className="text-blue-800 text-xl font-bold">
            Descubra o significado das palavras!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 mb-6 border-4 border-white shadow-2xl"
        >
          <div className="flex gap-3">
            <Input
              placeholder="Digite uma palavra..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg border-4 flex-1"
              autoFocus
            />
            <KidsButton
              color="blue"
              size="lg"
              onClick={handleSearch}
              disabled={!searchWord.trim() || isSearching}
            >
              {isSearching ? (
                <><Loader2 className="inline animate-spin w-5 h-5 mr-2" /> Buscando...</>
              ) : (
                <><Search className="inline w-5 h-5 mr-2" /> Buscar</>
              )}
            </KidsButton>
          </div>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl mb-6"
          >
            {/* Word Header */}
            <div className="mb-6 pb-4 border-b-4 border-blue-200">
              <div className="flex items-center gap-4 mb-2">
                <BookOpen className="w-10 h-10 text-blue-600" />
                <div>
                  <h2 className="text-4xl font-black text-blue-900">{result.word}</h2>
                  <p className="text-blue-600 text-sm font-bold italic">{result.word_class}</p>
                </div>
              </div>
            </div>

            {/* Definition */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-purple-600 mb-3 flex items-center gap-2">
                💡 Significado
              </h3>
              <p className="text-gray-800 text-lg leading-relaxed bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                {result.definition}
              </p>
            </div>

            {/* Examples */}
            {result.examples && result.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-black text-green-600 mb-3 flex items-center gap-2">
                  📝 Exemplos
                </h3>
                <div className="space-y-2">
                  {result.examples.map((example, i) => (
                    <div key={i} className="bg-green-50 p-3 rounded-xl border-2 border-green-200">
                      <p className="text-gray-800">• {example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {result.synonyms && result.synonyms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-black text-orange-600 mb-3 flex items-center gap-2">
                  🔄 Palavras Parecidas (Sinônimos)
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {result.synonyms.map((synonym, i) => (
                    <span
                      key={i}
                      className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold border-2 border-orange-300"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Fact */}
            {result.fun_fact && (
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-5 rounded-2xl border-4 border-pink-300">
                <h3 className="text-2xl font-black text-pink-600 mb-2 flex items-center gap-2">
                  ✨ Curiosidade
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {result.fun_fact}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* No Result State */}
        {!result && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-4">🔍</div>
            <p className="text-blue-800 text-xl font-bold">
              Digite uma palavra para descobrir seu significado!
            </p>
          </motion.div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
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