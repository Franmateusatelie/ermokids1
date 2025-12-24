import React from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';
import { Mic, MicOff, Video, VideoOff, Users, Megaphone } from 'lucide-react';

export default function TeacherControls({ 
  session, 
  onToggleMic, 
  onToggleCamera,
  studentsWithHandsRaised,
  onToggleStudentMic 
}) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">👩‍🏫</div>
        <h3 className="text-2xl font-black text-purple-600">Controles da Professora</h3>
      </div>

      {/* Teacher Audio/Video Controls */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-4 border-purple-200 mb-4">
        <p className="text-sm font-bold text-gray-700 mb-3">Seus Controles:</p>
        <div className="flex gap-3">
          <KidsButton
            color={session.teacher_mic_enabled ? 'green' : 'orange'}
            size="md"
            onClick={onToggleMic}
            className="flex-1"
          >
            {session.teacher_mic_enabled ? (
              <><Mic className="inline mr-2 w-5 h-5" /> Microfone ON</>
            ) : (
              <><MicOff className="inline mr-2 w-5 h-5" /> Microfone OFF</>
            )}
          </KidsButton>
          <KidsButton
            color={session.teacher_camera_enabled ? 'green' : 'orange'}
            size="md"
            onClick={onToggleCamera}
            className="flex-1"
          >
            {session.teacher_camera_enabled ? (
              <><Video className="inline mr-2 w-5 h-5" /> Câmera ON</>
            ) : (
              <><VideoOff className="inline mr-2 w-5 h-5" /> Câmera OFF</>
            )}
          </KidsButton>
        </div>
      </div>

      {/* Students with Hands Raised */}
      {studentsWithHandsRaised.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-4 border-yellow-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl">✋</div>
            <p className="text-lg font-black text-orange-800">
              Alunos com Mão Levantada ({studentsWithHandsRaised.length})
            </p>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {studentsWithHandsRaised.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-3 border-2 border-yellow-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{student.avatar_emoji}</span>
                  <span className="font-bold text-gray-800">{student.student_name}</span>
                </div>
                <KidsButton
                  color={student.mic_enabled ? 'orange' : 'green'}
                  size="sm"
                  onClick={() => onToggleStudentMic(student)}
                >
                  {student.mic_enabled ? (
                    <><MicOff className="inline w-4 h-4 mr-1" /> Desligar</>
                  ) : (
                    <><Mic className="inline w-4 h-4 mr-1" /> Permitir</>
                  )}
                </KidsButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}