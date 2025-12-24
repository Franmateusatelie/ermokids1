import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import BookShelf from '@/components/library/BookShelf';
import BookReader from '@/components/library/BookReader';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Loader2, BookOpen } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

const CATEGORIES = [
  { id: 'aventura', name: 'Aventura', emoji: '🗺️' },
  { id: 'fantasia', name: 'Fantasia', emoji: '🧙‍♂️' },
  { id: 'ciencia', name: 'Ciência', emoji: '🔬' },
  { id: 'animais', name: 'Animais', emoji: '🦁' },
  { id: 'contos', name: 'Contos', emoji: '📖' },
  { id: 'historia', name: 'História', emoji: '🏛️' },
  { id: 'espaco', name: 'Espaço', emoji: '🚀' },
];

export default function VirtualLibrary() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const queryClient = useQueryClient();

  const { data: books = [], refetch } = useQuery({
    queryKey: ['virtual-books', selectedCategory],
    queryFn: () => {
      if (selectedCategory) {
        return base44.entities.VirtualBook.filter({ category: selectedCategory });
      }
      return base44.entities.VirtualBook.list('-created_date', 50);
    },
  });

  const createBook = useMutation({
    mutationFn: (bookData) => base44.entities.VirtualBook.create(bookData),
    onSuccess: async (newBook) => {
      await queryClient.invalidateQueries(['virtual-books']);
      await refetch();
      soundEffects.playSuccess();
      setSelectedBook(newBook);
      setSearchQuery('');
      setIsGenerating(false);
    },
  });

  const updateReadCount = useMutation({
    mutationFn: ({ id, count }) => base44.entities.VirtualBook.update(id, { read_count: count }),
    onSuccess: () => {
      queryClient.invalidateQueries(['virtual-books']);
    },
  });

  const handleGenerateBook = async () => {
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    soundEffects.playClick();

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Crie uma história infantil completa e envolvente sobre: "${searchQuery}". 
        
A história deve:
- Ter entre 1500-2000 palavras
- Ser adequada para crianças de 6-12 anos
- Ter personagens cativantes
- Incluir uma lição moral ou mensagem positiva
- Ser dividida em início, meio e fim bem estruturados
- Usar linguagem clara e imaginativa

Escreva apenas a história, sem títulos de seção ou notas adicionais.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            category: { 
              type: "string",
              enum: ["aventura", "fantasia", "ciencia", "animais", "contos", "historia", "espaco"]
            },
            age_range: { type: "string" }
          }
        }
      });

      createBook.mutate({
        title: response.title,
        content: response.content,
        category: response.category,
        age_range: response.age_range || "6-12 anos",
        author: "IA - Biblioteca ErmoKids",
        read_count: 0,
      });

    } catch (error) {
      alert('Erro ao gerar livro. Tente novamente!');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBookClick = (book) => {
    soundEffects.playClick();
    setSelectedBook(book);
    updateReadCount.mutate({ id: book.id, count: (book.read_count || 0) + 1 });
  };

  const filteredBooks = books;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            📚
          </motion.div>
          <h1 className="text-5xl font-black text-amber-900 mb-2 drop-shadow-lg">
            Biblioteca Virtual
          </h1>
          <p className="text-amber-800 text-xl font-bold">
            Descubra histórias mágicas!
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
              placeholder="O que você quer ler? Ex: dragões, piratas, dinossauros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateBook()}
              className="text-lg border-4 flex-1"
            />
            <KidsButton
              color="blue"
              size="lg"
              onClick={handleGenerateBook}
              disabled={!searchQuery.trim() || isGenerating}
            >
              {isGenerating ? (
                <><Loader2 className="inline animate-spin w-5 h-5 mr-2" /> Criando...</>
              ) : (
                <><Search className="inline w-5 h-5 mr-2" /> Buscar</>
              )}
            </KidsButton>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex gap-2 flex-wrap justify-center">
            <KidsButton
              color={selectedCategory === null ? 'purple' : 'blue'}
              size="md"
              onClick={() => setSelectedCategory(null)}
            >
              <BookOpen className="inline w-4 h-4 mr-1" />
              Todos
            </KidsButton>
            {CATEGORIES.map((cat) => (
              <KidsButton
                key={cat.id}
                color={selectedCategory === cat.id ? 'purple' : 'blue'}
                size="md"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.emoji} {cat.name}
              </KidsButton>
            ))}
          </div>
        </motion.div>

        {/* Bookshelf */}
        <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-3xl p-6 border-4 border-amber-950 shadow-2xl mb-6">
          <div className="bg-amber-700 rounded-2xl p-2 mb-4">
            <div className="h-3 bg-amber-600 rounded-full"></div>
          </div>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">📖</div>
              <p className="text-amber-100 text-xl font-bold">
                Nenhum livro encontrado. Que tal criar um?
              </p>
            </div>
          ) : (
            <BookShelf books={filteredBooks} onBookClick={handleBookClick} />
          )}
        </div>

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

      {/* Book Reader Modal */}
      <AnimatePresence>
        {selectedBook && (
          <BookReader
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}