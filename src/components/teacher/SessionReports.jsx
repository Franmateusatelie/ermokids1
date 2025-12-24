import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SessionReports({ session }) {
  const { data: students = [] } = useQuery({
    queryKey: ['report-students', session.id],
    queryFn: () => base44.entities.ClassroomStudent.filter({ session_id: session.id }),
  });

  const { data: answers = [] } = useQuery({
    queryKey: ['report-answers', session.id],
    queryFn: async () => {
      const questions = await base44.entities.ClassroomQuestion.filter({ session_id: session.id });
      const allAnswers = [];
      for (const question of questions) {
        const questionAnswers = await base44.entities.ClassroomAnswer.filter({ question_id: question.id });
        allAnswers.push(...questionAnswers);
      }
      return allAnswers;
    },
  });

  const { data: emotions = [] } = useQuery({
    queryKey: ['report-emotions', session.id],
    queryFn: () => base44.entities.ClassroomEmotion.filter({ session_id: session.id }),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['report-messages', session.id],
    queryFn: () => base44.entities.ClassroomMessage.filter({ session_id: session.id }),
  });

  // Calculate statistics
  const totalAnswers = answers.length;
  const correctAnswers = answers.filter(a => a.is_correct).length;
  const accuracyRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Student participation data
  const studentStats = students.map(student => {
    const studentAnswers = answers.filter(a => a.student_id === student.id);
    const studentCorrect = studentAnswers.filter(a => a.is_correct).length;
    const studentMessages = messages.filter(m => m.student_id === student.id).length;
    const studentEmotions = emotions.filter(e => e.student_id === student.id).length;

    return {
      name: student.student_name,
      respostas: studentAnswers.length,
      corretas: studentCorrect,
      mensagens: studentMessages,
      interacoes: studentEmotions,
    };
  });

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-2xl mb-6">
      <h2 className="text-2xl font-black text-purple-600 mb-6 flex items-center gap-2">
        📊 Relatório da Sala: {session.title}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 border-4 border-blue-300">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-black text-blue-800">{students.length}</div>
          <div className="text-sm font-bold text-blue-600">Alunos</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 border-4 border-green-300">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-black text-green-800">{accuracyRate}%</div>
          <div className="text-sm font-bold text-green-600">Acertos</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 border-4 border-purple-300">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-2xl font-black text-purple-800">{messages.length}</div>
          <div className="text-sm font-bold text-purple-600">Mensagens</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-4 border-4 border-yellow-300">
          <div className="text-3xl mb-2">😊</div>
          <div className="text-2xl font-black text-yellow-800">{emotions.length}</div>
          <div className="text-sm font-bold text-yellow-600">Reações</div>
        </div>
      </div>

      {/* Student Participation Chart */}
      {studentStats.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-800 mb-3">Participação dos Alunos</h3>
          <div className="bg-white rounded-xl p-4 border-4 border-gray-200">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="respostas" fill="#8b5cf6" name="Respostas" />
                <Bar dataKey="corretas" fill="#10b981" name="Corretas" />
                <Bar dataKey="mensagens" fill="#3b82f6" name="Mensagens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Student List */}
      <div>
        <h3 className="text-xl font-black text-gray-800 mb-3">Desempenho Individual</h3>
        <div className="space-y-2">
          {studentStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="font-bold">Nenhum aluno participou ainda</p>
            </div>
          ) : (
            studentStats.map((student, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-gray-800">{student.name}</h4>
                    <div className="flex gap-4 text-sm mt-1">
                      <span className="text-purple-600 font-bold">
                        📝 {student.respostas} respostas
                      </span>
                      <span className="text-green-600 font-bold">
                        ✅ {student.corretas} corretas
                      </span>
                      <span className="text-blue-600 font-bold">
                        💬 {student.mensagens} msgs
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-800">
                      {student.respostas > 0
                        ? Math.round((student.corretas / student.respostas) * 100)
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-600 font-bold">Aproveitamento</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}