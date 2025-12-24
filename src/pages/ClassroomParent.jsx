import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function ClassroomParent() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    teacher_name: '',
    max_students: 12,
  });

  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ['classroom-sessions'],
    queryFn: () => base44.entities.ClassroomSession.list('-created_date'),
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.ClassroomSession.create({
      ...data,
      status: 'active',
      start_time: new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['classroom-sessions']);
      soundEffects.playSuccess();
      setShowCreateForm(false);
      setFormData({ title: '', teacher_name: '', max_students: 12 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.teacher_name) {
      createSession.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-4xl mx-auto">
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
            👨‍👩‍👧‍👦
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Controle dos Pais</h1>
          <p className="text-white text-lg font-bold">Gerencie as salas de aula virtuais</p>
        </motion.div>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
              <Users className="w-8 h-8" />
              Salas Ativas
            </h2>
            <KidsButton
              color="green"
              size="md"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="inline mr-2" />
              Nova Sala
            </KidsButton>
          </div>

          {showCreateForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-4 border-purple-200"
            >
              <h3 className="text-xl font-black text-purple-600 mb-4">Criar Nova Sala</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Título da Aula:</label>
                  <Input
                    type="text"
                    placeholder="Ex: Matemática Divertida"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg border-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Professora:</label>
                  <Input
                    type="text"
                    placeholder="Ex: Professora Ana"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    className="text-lg border-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Máximo de Alunos:</label>
                  <Input
                    type="number"
                    min="4"
                    max="20"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="text-lg border-4"
                  />
                </div>

                <div className="flex gap-3">
                  <KidsButton type="submit" color="green" size="lg" className="flex-1">
                    Criar Sala
                  </KidsButton>
                  <KidsButton
                    type="button"
                    color="orange"
                    size="lg"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </KidsButton>
                </div>
              </div>
            </motion.form>
          )}

          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-600 font-bold">Nenhuma sala criada ainda</p>
              </div>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-4 border-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">🏫</div>
                      <div>
                        <h3 className="text-xl font-black text-purple-600">{session.title}</h3>
                        <p className="text-sm text-gray-600">👩‍🏫 {session.teacher_name}</p>
                        <p className="text-xs text-gray-500">
                          Máx: {session.max_students} alunos
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`🏫 Venha participar da sala de aula virtual!\n\n📚 ${session.title}\n👩‍🏫 ${session.teacher_name}\n\n🔗 ${window.location.origin}${createPageUrl('VirtualClassroom')}?session=${session.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <KidsButton color="green" size="md">
                          💬 Convidar
                        </KidsButton>
                      </a>
                      <Link to={createPageUrl('VirtualClassroom') + '?session=' + session.id}>
                        <KidsButton color="purple" size="md">
                          Entrar na Sala
                        </KidsButton>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link to={createPageUrl('ParentDashboard')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar ao Painel
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}