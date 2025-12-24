import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Play } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function QuizManager({ session, teacherId }) {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizData, setQuizData] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
  });

  const queryClient = useQueryClient();

  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes', session.id],
    queryFn: () => base44.entities.ClassroomQuestion.filter({ session_id: session.id }),
    enabled: !!session,
  });

  const createQuiz = useMutation({
    mutationFn: (data) => base44.entities.ClassroomQuestion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['quizzes']);
      soundEffects.playSuccess();
      setShowQuizForm(false);
      setQuizData({ question_text: '', options: ['', '', '', ''], correct_answer: '' });
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: (quizId) => base44.entities.ClassroomQuestion.delete(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries(['quizzes']);
      soundEffects.playSuccess();
    },
  });

  const launchQuiz = useMutation({
    mutationFn: async (quizId) => {
      // Deactivate all other quizzes first
      const activeQuizzes = quizzes.filter(q => q.is_active);
      for (const quiz of activeQuizzes) {
        await base44.entities.ClassroomQuestion.update(quiz.id, { is_active: false });
      }
      // Activate selected quiz
      return base44.entities.ClassroomQuestion.update(quizId, { is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['quizzes']);
      soundEffects.playSuccess();
      alert('Quiz lançado para os alunos!');
    },
  });

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    const filteredOptions = quizData.options.filter(opt => opt.trim() !== '');
    if (quizData.question_text && filteredOptions.length >= 2 && quizData.correct_answer) {
      createQuiz.mutate({
        session_id: session.id,
        question_text: quizData.question_text,
        options: filteredOptions,
        correct_answer: quizData.correct_answer,
        is_active: false,
      });
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
          📝 Quizzes da Sala
        </h2>
        <KidsButton color="green" size="md" onClick={() => setShowQuizForm(!showQuizForm)}>
          <Plus className="inline mr-2" />
          Novo Quiz
        </KidsButton>
      </div>

      {showQuizForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitQuiz}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-4 border-blue-200"
        >
          <h3 className="text-xl font-black text-blue-600 mb-4">Criar Novo Quiz</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pergunta:</label>
              <Input
                type="text"
                placeholder="Digite a pergunta"
                value={quizData.question_text}
                onChange={(e) => setQuizData({ ...quizData, question_text: e.target.value })}
                className="text-lg border-4"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Opções de Resposta:</label>
              {quizData.options.map((option, index) => (
                <Input
                  key={index}
                  type="text"
                  placeholder={`Opção ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...quizData.options];
                    newOptions[index] = e.target.value;
                    setQuizData({ ...quizData, options: newOptions });
                  }}
                  className="text-lg border-4 mb-2"
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Resposta Correta:</label>
              <Input
                type="text"
                placeholder="Digite a resposta correta (exatamente como está nas opções)"
                value={quizData.correct_answer}
                onChange={(e) => setQuizData({ ...quizData, correct_answer: e.target.value })}
                className="text-lg border-4"
              />
            </div>

            <div className="flex gap-3">
              <KidsButton type="submit" color="green" size="lg" className="flex-1">
                Criar Quiz
              </KidsButton>
              <KidsButton
                type="button"
                color="orange"
                size="lg"
                onClick={() => setShowQuizForm(false)}
                className="flex-1"
              >
                Cancelar
              </KidsButton>
            </div>
          </div>
        </motion.form>
      )}

      <div className="space-y-3">
        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 font-bold">Nenhum quiz criado ainda</p>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-4 border-4 ${
                quiz.is_active
                  ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-400'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-lg font-black text-gray-800 mb-2">{quiz.question_text}</h4>
                  <div className="space-y-1">
                    {quiz.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`text-sm px-3 py-1 rounded-lg ${
                          option === quiz.correct_answer
                            ? 'bg-green-200 font-bold text-green-800'
                            : 'bg-white text-gray-600'
                        }`}
                      >
                        {option} {option === quiz.correct_answer && '✓'}
                      </div>
                    ))}
                  </div>
                  {quiz.is_active && (
                    <div className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-block">
                      🟢 ATIVO - Alunos estão respondendo
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!quiz.is_active && (
                    <KidsButton
                      color="blue"
                      size="sm"
                      onClick={() => launchQuiz.mutate(quiz.id)}
                    >
                      <Play className="w-4 h-4" />
                    </KidsButton>
                  )}
                  <KidsButton
                    color="orange"
                    size="sm"
                    onClick={() => {
                      if (confirm('Excluir este quiz?')) {
                        deleteQuiz.mutate(quiz.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </KidsButton>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}