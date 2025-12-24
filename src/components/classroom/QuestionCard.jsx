import React from 'react';
import { motion } from 'framer-motion';
import KidsButton from '@/components/kids/KidsButton';

export default function QuestionCard({ question, onAnswer, hasAnswered, studentAnswers = [] }) {
  if (!question) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">👩‍🏫</div>
        <div>
          <h3 className="text-2xl font-black text-purple-600">Pergunta da Professora!</h3>
          <p className="text-sm text-gray-600">Clique na resposta certa</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-yellow-300">
        <p className="text-xl font-bold text-gray-800">{question.question_text}</p>
      </div>

      {hasAnswered ? (
        <div className="bg-green-100 border-4 border-green-400 rounded-2xl p-4 text-center">
          <div className="text-5xl mb-2">✅</div>
          <p className="text-lg font-bold text-green-700">Você já respondeu!</p>
          <p className="text-sm text-gray-600 mt-2">
            {studentAnswers.length} {studentAnswers.length === 1 ? 'aluno respondeu' : 'alunos responderam'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((option, idx) => (
            <KidsButton
              key={idx}
              color={['blue', 'pink', 'green', 'orange'][idx % 4]}
              size="lg"
              onClick={() => onAnswer(option)}
              className="w-full"
            >
              {String.fromCharCode(65 + idx)}) {option}
            </KidsButton>
          ))}
        </div>
      )}

      {studentAnswers.length > 0 && (
        <div className="mt-4 bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
          <div className="text-xs font-bold text-purple-600 mb-2">
            Já responderam ({studentAnswers.length}):
          </div>
          <div className="flex flex-wrap gap-1">
            {studentAnswers.map((ans, idx) => (
              <span key={idx} className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-600 border border-purple-200">
                {ans.student_name} {ans.is_correct ? '✅' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}