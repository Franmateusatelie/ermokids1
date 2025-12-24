import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Users } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function TeacherMessaging({ teacher }) {
  const [selectedParent, setSelectedParent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all students from teacher's sessions
  const { data: teacherSessions = [] } = useQuery({
    queryKey: ['teacher-sessions-messaging', teacher.id],
    queryFn: () => base44.entities.ClassroomSession.filter({ teacher_id: teacher.id }),
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ['all-students-from-sessions', teacher.id],
    queryFn: async () => {
      const sessionIds = teacherSessions.map(s => s.id);
      const studentsPromises = sessionIds.map(sessionId =>
        base44.entities.ClassroomStudent.filter({ session_id: sessionId })
      );
      const studentsArrays = await Promise.all(studentsPromises);
      return studentsArrays.flat();
    },
    enabled: teacherSessions.length > 0,
  });

  const { data: allMessages = [] } = useQuery({
    queryKey: ['teacher-messages', teacher.id],
    queryFn: () => base44.entities.ParentTeacherMessage.filter({ teacher_id: teacher.id }),
    refetchInterval: 5000,
  });

  const { data: parentProfiles = [] } = useQuery({
    queryKey: ['parent-profiles'],
    queryFn: () => base44.entities.ParentProfile.list(),
  });

  const sendMessage = useMutation({
    mutationFn: (data) => base44.entities.ParentTeacherMessage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-messages']);
      soundEffects.playSuccess();
      setNewMessage('');
      setBroadcastMessage('');
      setShowBroadcast(false);
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedParent) {
      sendMessage.mutate({
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        parent_email: selectedParent,
        message: newMessage,
        sender: 'teacher',
      });
    }
  };

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      sendMessage.mutate({
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        message: broadcastMessage,
        sender: 'teacher',
        is_broadcast: true,
      });
    }
  };

  // Group messages by parent
  const messagesByParent = allMessages
    .filter(msg => !msg.is_broadcast)
    .reduce((acc, msg) => {
      if (!acc[msg.parent_email]) {
        acc[msg.parent_email] = [];
      }
      acc[msg.parent_email].push(msg);
      return acc;
    }, {});

  const parentEmails = Object.keys(messagesByParent);

  const selectedMessages = selectedParent
    ? messagesByParent[selectedParent]?.sort(
        (a, b) => new Date(a.created_date) - new Date(b.created_date)
      ) || []
    : [];

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6">
      <h2 className="text-2xl font-black text-purple-600 mb-6 flex items-center gap-2">
        <MessageCircle className="w-8 h-8" />
        Mensagens com Pais
      </h2>

      <div className="mb-4">
        <KidsButton
          color="orange"
          size="md"
          onClick={() => setShowBroadcast(!showBroadcast)}
          className="w-full mb-4"
        >
          <Users className="inline mr-2 w-5 h-5" />
          Enviar Comunicado Geral
        </KidsButton>

        {showBroadcast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border-4 border-orange-200 mb-4"
          >
            <h3 className="text-lg font-black text-orange-600 mb-3">📢 Comunicado para Todos os Pais</h3>
            <Textarea
              placeholder="Digite o comunicado que será enviado para todos os pais..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="border-4 mb-3 min-h-24"
            />
            <div className="flex gap-2">
              <KidsButton color="green" size="md" onClick={handleBroadcast} className="flex-1">
                Enviar para Todos
              </KidsButton>
              <KidsButton
                color="orange"
                size="md"
                onClick={() => {
                  setShowBroadcast(false);
                  setBroadcastMessage('');
                }}
                className="flex-1"
              >
                Cancelar
              </KidsButton>
            </div>
          </motion.div>
        )}
      </div>

      {!selectedParent ? (
        <div>
          <p className="text-gray-600 font-bold mb-4">Conversas com Pais:</p>
          <div className="space-y-2">
            {parentEmails.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 font-bold">Nenhuma conversa ainda</p>
              </div>
            ) : (
              parentEmails.map((email) => {
                const unreadCount = messagesByParent[email].filter(
                  m => m.sender === 'parent' && !m.is_read
                ).length;
                const lastMessage = messagesByParent[email][messagesByParent[email].length - 1];
                
                return (
                  <motion.button
                    key={email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedParent(email)}
                    className="w-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-4 border-white text-left relative"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-purple-600">{email}</h3>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.message.substring(0, 50)}...
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-purple-600">{selectedParent}</h3>
            <KidsButton color="orange" size="sm" onClick={() => setSelectedParent(null)}>
              Voltar
            </KidsButton>
          </div>

          <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl p-4 border-4 border-purple-200 mb-4 max-h-96 overflow-y-auto">
            {selectedMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 font-bold">Nenhuma mensagem ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'teacher' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.sender === 'teacher'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'teacher' ? 'opacity-70' : 'text-gray-500'}`}>
                        {new Date(msg.created_date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-4"
            />
            <KidsButton color="purple" size="md" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-5 h-5" />
            </KidsButton>
          </div>
        </div>
      )}
    </div>
  );
}