import React from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';
import { Hand, Mic, MicOff } from 'lucide-react';

export default function StudentControls({ currentStudent, onRaiseHand }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{currentStudent.avatar_emoji}</span>
        <div>
          <h3 className="text-2xl font-black text-purple-600">{currentStudent.student_name}</h3>
          <p className="text-sm text-gray-600">Cadeira {currentStudent.seat_number}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Raise Hand Button */}
        <KidsButton
          color={currentStudent.hand_raised ? 'orange' : 'blue'}
          size="lg"
          onClick={onRaiseHand}
          className="w-full"
        >
          <Hand className="inline mr-2 w-6 h-6" />
          {currentStudent.hand_raised ? 'Baixar Mão' : 'Levantar Mão'}
        </KidsButton>

        {/* Mic Status Indicator */}
        <div className={`rounded-2xl p-4 border-4 ${
          currentStudent.mic_enabled 
            ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-300' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {currentStudent.mic_enabled ? (
              <>
                <Mic className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Microfone Ativo</span>
              </>
            ) : (
              <>
                <MicOff className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-800">Microfone Desligado</span>
              </>
            )}
          </div>
          {currentStudent.hand_raised && !currentStudent.mic_enabled && (
            <p className="text-xs text-center text-gray-600 mt-2">
              Aguarde a professora liberar seu microfone
            </p>
          )}
        </div>
      </div>
    </div>
  );
}