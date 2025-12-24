import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Users, Trash2, Calendar, BarChart, BookOpen, MessageCircle } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';
import QuizManager from '@/components/teacher/QuizManager';
import SessionReports from '@/components/teacher/SessionReports';
import TeacherMessaging from '@/components/teacher/TeacherMessaging';

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function TeacherDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = urlParams.get('teacher');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState('sessions'); // 'sessions', 'quizzes', 'reports', 'messages'
  const [formData, setFormData] = useState({
    title: '',
    duration_minutes: 30,
    max_students: 30,
    scheduled_date: '',
  });

  const queryClient = useQueryClient();

  const { data: teacher } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const teachers = await base44.entities.Teacher.filter({ id: teacherId });
      return teachers[0];
    },
    enabled: !!teacherId,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['teacher-sessions', teacherId],
    queryFn: () => base44.entities.ClassroomSession.filter({ teacher_id: teacherId }),
    enabled: !!teacherId,
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.ClassroomSession.create({
      ...data,
      teacher_id: teacherId,
      teacher_name: teacher.name,
      subject: teacher.subject,
      school: teacher.school,
      invite_code: generateInviteCode(),
      status: data.scheduled_date ? 'waiting' : 'active',
      start_time: data.scheduled_date || new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-sessions']);
      soundEffects.playSuccess();
      setShowCreateForm(false);
      setFormData({ title: '', duration_minutes: 30, max_students: 30, scheduled_date: '' });
    },
  });

  const deleteSession = useMutation({
    mutationFn: (sessionId) => base44.entities.ClassroomSession.delete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-sessions']);
      soundEffects.playSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title) {
      createSession.mutate(formData);
    }
  };

  const getInviteUrl = (session) => {
    return `${window.location.origin}${createPageUrl('VirtualClassroom')}?invite=${session.invite_code}`;
  };

  const getWhatsAppInvite = (session) => {
    const studentLink = `${window.location.origin}${createPageUrl('StudentJoin')}?invite=${session.invite_code}`;
    const message = `🏫 *Convite para Aula Virtual*\n\n📚 ${session.title}\n👩‍🏫 Professor(a): ${session.teacher_name}\n📖 Matéria: ${session.subject}\n🏫 Escola: ${session.school}\n⏱️ Duração: ${session.duration_minutes} minutos\n\n🔗 Entre aqui:\n${studentLink}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-white">Professor não encontrado</h1>
        </div>
      </div>
    );
  }

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
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            👩‍🏫
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Painel do Professor</h1>
          <p className="text-white text-lg font-bold">Olá, {teacher.name}!</p>
          <p className="text-white text-sm">📖 {teacher.subject} • 🏫 {teacher.school}</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-4 border-4 border-white shadow-2xl mb-6">
          <div className="flex gap-2 flex-wrap">
            <KidsButton
              color={viewMode === 'sessions' ? 'purple' : 'blue'}
              size="md"
              onClick={() => setViewMode('sessions')}
            >
              <Users className="inline mr-2 w-5 h-5" />
              Minhas Salas
            </KidsButton>
            <KidsButton
              color={viewMode === 'quizzes' ? 'purple' : 'blue'}
              size="md"
              onClick={() => {
                if (selectedSession) {
                  setViewMode('quizzes');
                } else {
                  alert('Selecione uma sala primeiro!');
                }
              }}
              disabled={!selectedSession}
            >
              <BookOpen className="inline mr-2 w-5 h-5" />
              Quizzes
            </KidsButton>
            <KidsButton
              color={viewMode === 'reports' ? 'purple' : 'blue'}
              size="md"
              onClick={() => {
                if (selectedSession) {
                  setViewMode('reports');
                } else {
                  alert('Selecione uma sala primeiro!');
                }
              }}
              disabled={!selectedSession}
            >
              <BarChart className="inline mr-2 w-5 h-5" />
              Relatórios
            </KidsButton>
            <KidsButton
              color={viewMode === 'messages' ? 'purple' : 'blue'}
              size="md"
              onClick={() => setViewMode('messages')}
            >
              <MessageCircle className="inline mr-2 w-5 h-5" />
              Mensagens
            </KidsButton>
          </div>
        </div>

        {viewMode === 'sessions' && (
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
                <Users className="w-8 h-8" />
                Minhas Salas
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
                    placeholder="Ex: Matemática - Frações"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg border-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Duração da Aula:</label>
                  <Select
                    value={formData.duration_minutes.toString()}
                    onValueChange={(value) => setFormData({ ...formData, duration_minutes: parseInt(value) })}
                  >
                    <SelectTrigger className="text-lg border-4 bg-white">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="15" className="cursor-pointer">15 minutos</SelectItem>
                      <SelectItem value="30" className="cursor-pointer">30 minutos</SelectItem>
                      <SelectItem value="45" className="cursor-pointer">45 minutos</SelectItem>
                      <SelectItem value="60" className="cursor-pointer">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Máximo de Alunos:</label>
                  <Input
                    type="number"
                    min="10"
                    max="30"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="text-lg border-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Agendar para Data/Hora (opcional):
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="text-lg border-4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deixe em branco para iniciar imediatamente
                  </p>
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
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">🏫</div>
                      <div className="flex-1">
                       <h3 className="text-xl font-black text-purple-600">{session.title}</h3>
                       <p className="text-sm text-gray-600">⏱️ {session.duration_minutes} minutos</p>
                       <p className="text-xs text-gray-500">
                         Máx: {session.max_students} alunos • Código: {session.invite_code}
                       </p>
                       {session.status === 'waiting' && (
                         <p className="text-xs font-bold text-orange-600 mt-1">
                           📅 Agendada: {new Date(session.start_time).toLocaleString('pt-BR')}
                         </p>
                       )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`${window.location.origin}${createPageUrl('StudentJoin')}?invite=${session.invite_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(`${window.location.origin}${createPageUrl('StudentJoin')}?invite=${session.invite_code}`);
                          alert('Link copiado! Envie para seus alunos.');
                        }}
                      >
                        <KidsButton color="blue" size="md" className="w-full">
                          📋 Copiar Link
                        </KidsButton>
                      </a>
                      <a
                        href={getWhatsAppInvite(session)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <KidsButton color="green" size="md" className="w-full">
                          💬 WhatsApp
                        </KidsButton>
                      </a>
                       <Link to={createPageUrl('VirtualClassroom') + '?invite=' + session.invite_code + '&teacher=' + teacherId} className="flex-1">
                        <KidsButton color="purple" size="md" className="w-full">
                          Entrar na Sala
                        </KidsButton>
                      </Link>
                      <KidsButton 
                        color="blue" 
                        size="md" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedSession(session);
                          setViewMode('quizzes');
                        }}
                      >
                        <BookOpen className="inline w-4 h-4 mr-1" />
                        Quizzes
                      </KidsButton>
                      <KidsButton 
                        color="green" 
                        size="md" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedSession(session);
                          setViewMode('reports');
                        }}
                      >
                        <BarChart className="inline w-4 h-4 mr-1" />
                        Relatórios
                      </KidsButton>
                      <KidsButton 
                        color="orange" 
                        size="md" 
                        className="flex-1"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita!')) {
                            deleteSession.mutate(session.id);
                          }
                        }}
                      >
                        <Trash2 className="inline w-4 h-4 mr-1" />
                        Excluir
                      </KidsButton>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        )}

        {viewMode === 'quizzes' && selectedSession && (
          <QuizManager session={selectedSession} teacherId={teacherId} />
        )}

        {viewMode === 'reports' && selectedSession && (
          <SessionReports session={selectedSession} />
        )}

        {viewMode === 'messages' && (
          <TeacherMessaging teacher={teacher} />
        )}

        <div className="flex justify-center">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar ao Início
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}