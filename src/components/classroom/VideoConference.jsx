import React, { useState } from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';
import { Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';

export default function VideoConference({ 
  session, 
  currentStudent,
  students,
  isTeacher,
  onToggleTeacherMic,
  onToggleTeacherCamera,
  onRaiseHand,
  onToggleStudentMic
}) {
  const raisedHands = students.filter(s => s.hand_raised);
  const studentsWithMic = students.filter(s => s.mic_enabled);

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">📹</div>
        <h2 className="text-2xl font-black text-purple-600">Vídeo Conferência</h2>
      </div>

      {/* Teacher Video/Audio Controls */}
      {isTeacher && (
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-5 mb-4 border-4 border-orange-400 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">👩‍🏫</div>
              <div>
                <div className="text-xl font-black text-orange-900">🎯 Mesa do Professor</div>
                <div className="text-sm font-bold text-orange-700">{session.teacher_name} - Comandando a Sala</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 mb-3">
            <p className="text-sm font-bold text-gray-700 mb-2 text-center">🎤 Controles de Áudio e Vídeo</p>
            <div className="flex gap-2">
              <KidsButton
                color={session.teacher_mic_enabled ? 'green' : 'orange'}
                size="lg"
                onClick={onToggleTeacherMic}
                className="flex-1"
              >
                {session.teacher_mic_enabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                {session.teacher_mic_enabled ? ' Desativar Mic' : ' Ativar Mic'}
              </KidsButton>
              <KidsButton
                color={session.teacher_camera_enabled ? 'green' : 'orange'}
                size="lg"
                onClick={onToggleTeacherCamera}
                className="flex-1"
              >
                {session.teacher_camera_enabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                {session.teacher_camera_enabled ? ' Desligar Cam' : ' Ligar Cam'}
              </KidsButton>
            </div>
          </div>

          {/* Teacher Status */}
          <div className="flex gap-2 flex-wrap justify-center">
            {session.teacher_mic_enabled && (
              <div className="bg-green-500 px-4 py-2 rounded-full text-sm font-black text-white flex items-center gap-2 shadow-lg">
                <Mic className="w-5 h-5" /> MICROFONE LIGADO
              </div>
            )}
            {session.teacher_camera_enabled && (
              <div className="bg-blue-500 px-4 py-2 rounded-full text-sm font-black text-white flex items-center gap-2 shadow-lg">
                <Video className="w-5 h-5" /> CÂMERA LIGADA
              </div>
            )}
            {!session.teacher_mic_enabled && !session.teacher_camera_enabled && (
              <div className="bg-gray-400 px-4 py-2 rounded-full text-sm font-black text-white">
                Áudio e Vídeo Desligados
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Controls */}
      {!isTeacher && currentStudent && (
        <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-4 mb-4 border-4 border-pink-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-3xl">{currentStudent.avatar_emoji}</div>
              <div>
                <div className="font-black text-gray-800">{currentStudent.student_name}</div>
                <div className="text-sm text-gray-600">Cadeira {currentStudent.seat_number}</div>
              </div>
            </div>
          </div>
          
          <KidsButton
            color={currentStudent.hand_raised ? 'yellow' : 'blue'}
            size="lg"
            onClick={onRaiseHand}
            className="w-full"
          >
            <Hand className="w-5 h-5 inline mr-2" />
            {currentStudent.hand_raised ? '✋ Mão Levantada' : 'Levantar a Mão'}
          </KidsButton>

          {currentStudent.mic_enabled && (
            <div className="mt-3 bg-green-200 px-3 py-2 rounded-xl text-center">
              <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" />
                Seu microfone foi liberado!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Raised Hands - Teacher View */}
      {isTeacher && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-4 border-yellow-300">
            <h3 className="text-xl font-black text-orange-800 mb-3 flex items-center gap-2">
              <Hand className="w-6 h-6" />
              ✋ Alunos Pedindo para Falar ({raisedHands.length})
            </h3>
            {raisedHands.length > 0 ? (
              <div className="space-y-2">
                {raisedHands.map(student => (
                  <motion.div
                    key={student.id}
                    initial={{ scale: 0.9, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    className="bg-white rounded-xl p-4 border-4 border-yellow-400 flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="text-3xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        ✋
                      </motion.div>
                      <div className="text-2xl">{student.avatar_emoji}</div>
                      <div>
                        <div className="font-black text-gray-800">{student.student_name}</div>
                        <div className="text-xs font-bold text-gray-600">Cadeira {student.seat_number}</div>
                      </div>
                    </div>
                    <KidsButton
                      color={student.mic_enabled ? 'orange' : 'green'}
                      size="lg"
                      onClick={() => onToggleStudentMic(student)}
                    >
                      {student.mic_enabled ? (
                        <>🔇 Desativar Mic</>
                      ) : (
                        <>🎤 Liberar Mic</>
                      )}
                    </KidsButton>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="font-bold">Nenhum aluno pediu para falar ainda</p>
                <p className="text-sm">Os alunos devem clicar em "Levantar a Mão" ✋</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Speakers */}
      <div>
        <h3 className="text-lg font-black text-gray-700 mb-2">🎤 Falando Agora:</h3>
        <div className="space-y-2">
          {session.teacher_mic_enabled && (
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 border-2 border-blue-300 flex items-center gap-3">
              <div className="text-3xl">👩‍🏫</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{session.teacher_name}</div>
                <div className="text-xs text-gray-600">Professor(a)</div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Mic className="w-6 h-6 text-green-600" />
              </motion.div>
            </div>
          )}
          
          {studentsWithMic.map(student => (
            <div key={student.id} className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-3 border-2 border-green-300 flex items-center gap-3">
              <div className="text-3xl">{student.avatar_emoji}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{student.student_name}</div>
                <div className="text-xs text-gray-600">Cadeira {student.seat_number}</div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Mic className="w-6 h-6 text-green-600" />
              </motion.div>
            </div>
          ))}
          
          {!session.teacher_mic_enabled && studentsWithMic.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <MicOff className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="font-bold">Ninguém está falando no momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}