import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Megaphone, X } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function AnnouncementPanel({ session, isTeacher }) {
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements', session.id],
    queryFn: () => base44.entities.ClassroomAnnouncement.filter({ 
      session_id: session.id, 
      is_active: true 
    }),
    refetchInterval: 3000,
  });

  const createAnnouncement = useMutation({
    mutationFn: (data) => base44.entities.ClassroomAnnouncement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      soundEffects.playSuccess();
      setNewAnnouncement('');
      setShowForm(false);
    },
  });

  const dismissAnnouncement = useMutation({
    mutationFn: (id) => base44.entities.ClassroomAnnouncement.update(id, { is_active: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      soundEffects.playClick();
    },
  });

  const handleSendAnnouncement = () => {
    if (newAnnouncement.trim()) {
      createAnnouncement.mutate({
        session_id: session.id,
        teacher_id: session.teacher_id,
        message: newAnnouncement,
        type: 'announcement',
      });
    }
  };

  const getAnnouncementStyle = (type) => {
    switch(type) {
      case 'quiz_started':
        return 'from-blue-400 to-blue-500';
      case 'break':
        return 'from-green-400 to-green-500';
      case 'warning':
        return 'from-red-400 to-red-500';
      default:
        return 'from-purple-400 to-purple-500';
    }
  };

  return (
    <div className="space-y-3">
      {isTeacher && (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-black text-purple-600">Fazer Anúncio</h3>
          </div>
          
          {!showForm ? (
            <KidsButton color="purple" size="sm" onClick={() => setShowForm(true)} className="w-full">
              + Novo Anúncio
            </KidsButton>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Digite seu anúncio..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className="border-4"
              />
              <div className="flex gap-2">
                <KidsButton 
                  color="green" 
                  size="sm" 
                  onClick={handleSendAnnouncement}
                  className="flex-1"
                >
                  Enviar
                </KidsButton>
                <KidsButton 
                  color="orange" 
                  size="sm" 
                  onClick={() => {
                    setShowForm(false);
                    setNewAnnouncement('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </KidsButton>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {announcements.map((announcement) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className={`bg-gradient-to-r ${getAnnouncementStyle(announcement.type)} rounded-2xl p-4 border-4 border-white shadow-xl relative`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">📢</div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{announcement.message}</p>
                <p className="text-white/80 text-xs mt-1">
                  {new Date(announcement.created_date).toLocaleTimeString('pt-BR')}
                </p>
              </div>
              {isTeacher && (
                <button
                  onClick={() => dismissAnnouncement.mutate(announcement.id)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}