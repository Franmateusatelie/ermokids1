import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function ParentMessaging({ parentEmail }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  // Get all sessions where parent's children are students
  const { data: allSessions = [] } = useQuery({
    queryKey: ['all-sessions-parent'],
    queryFn: () => base44.entities.ClassroomSession.list(),
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ['all-students-parent'],
    queryFn: async () => {
      const sessionIds = allSessions.map(s => s.id);
      const studentsPromises = sessionIds.map(sessionId =>
        base44.entities.ClassroomStudent.filter({ session_id: sessionId })
      );
      const studentsArrays = await Promise.all(studentsPromises);
      return studentsArrays.flat();
    },
    enabled: allSessions.length > 0,
  });

  // Get unique teacher IDs from sessions where children participate
  const relevantTeacherIds = [...new Set(
    allSessions
      .filter(session => 
        allStudents.some(student => student.session_id === session.id)
      )
      .map(session => session.teacher_id)
  )];

  const { data: allTeachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => base44.entities.Teacher.list(),
  });

  // Filter only teachers from relevant sessions
  const teachers = allTeachers.filter(teacher => relevantTeacherIds.includes(teacher.id));

  const { data: messages = [] } = useQuery({
    queryKey: ['parent-messages', parentEmail, selectedTeacher?.id],
    queryFn: () => base44.entities.ParentTeacherMessage.filter({
      parent_email: parentEmail,
      teacher_id: selectedTeacher?.id,
    }),
    enabled: !!selectedTeacher && !!parentEmail,
    refetchInterval: 5000,
  });

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['broadcast-messages', selectedTeacher?.id],
    queryFn: () => base44.entities.ParentTeacherMessage.filter({
      teacher_id: selectedTeacher?.id,
      is_broadcast: true,
    }),
    enabled: !!selectedTeacher,
    refetchInterval: 5000,
  });

  const sendMessage = useMutation({
    mutationFn: (data) => base44.entities.ParentTeacherMessage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['parent-messages']);
      soundEffects.playSuccess();
      setNewMessage('');
    },
  });

  const markAsRead = useMutation({
    mutationFn: (messageId) => base44.entities.ParentTeacherMessage.update(messageId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['parent-messages']);
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTeacher) {
      sendMessage.mutate({
        teacher_id: selectedTeacher.id,
        teacher_name: selectedTeacher.name,
        parent_email: parentEmail,
        message: newMessage,
        sender: 'parent',
      });
    }
  };

  const allMessages = [...messages, ...broadcasts].sort(
    (a, b) => new Date(a.created_date) - new Date(b.created_date)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl"
      >
        <h2 className="text-2xl font-black text-purple-600 mb-6 flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          Mensagens com Professores
        </h2>

        {!selectedTeacher ? (
          <div>
            <p className="text-gray-600 font-bold mb-4">Selecione um professor:</p>
            <div className="grid gap-3">
              {teachers.map((teacher) => (
                <motion.button
                  key={teacher.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTeacher(teacher)}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-4 border-white text-left"
                >
                  <h3 className="text-lg font-black text-purple-600">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">📖 {teacher.subject} • 🏫 {teacher.school}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-purple-600">{selectedTeacher.name}</h3>
                <p className="text-sm text-gray-600">{selectedTeacher.subject} - {selectedTeacher.school}</p>
              </div>
              <KidsButton color="orange" size="sm" onClick={() => setSelectedTeacher(null)}>
                Voltar
              </KidsButton>
            </div>

            {/* Messages Display */}
            <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl p-4 border-4 border-purple-200 mb-4 max-h-96 overflow-y-auto">
              {allMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-600 font-bold">Nenhuma mensagem ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.sender === 'parent' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          msg.is_broadcast
                            ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-4 border-yellow-400'
                            : msg.sender === 'parent'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border-2 border-gray-300'
                        }`}
                      >
                        {msg.is_broadcast && (
                          <div className="text-xs font-bold text-orange-800 mb-1">📢 COMUNICADO GERAL</div>
                        )}
                        <p className={`text-sm ${msg.is_broadcast ? 'text-gray-800 font-bold' : ''}`}>
                          {msg.message}
                        </p>
                        <p className={`text-xs mt-1 ${msg.sender === 'parent' || msg.is_broadcast ? 'opacity-70' : 'text-gray-500'}`}>
                          {new Date(msg.created_date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-4"
              />
              <KidsButton color="blue" size="md" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-5 h-5" />
              </KidsButton>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}