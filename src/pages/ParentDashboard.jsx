import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Heart, TrendingUp, Calendar, StickyNote, Lightbulb, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import KidsButton from '@/components/kids/KidsButton';

const SECTIONS = [
  { title: 'Rotinas', icon: Clock, color: 'from-purple-400 to-purple-600', page: 'ParentRoutines' },
  { title: 'Tarefas Escolares', icon: BookOpen, color: 'from-blue-400 to-blue-600', page: 'ParentSchool' },
  { title: 'Saúde e Medicação', icon: Heart, color: 'from-red-400 to-red-600', page: 'ParentHealth' },
  { title: 'Crescimento', icon: TrendingUp, color: 'from-green-400 to-green-600', page: 'ParentGrowth' },
  { title: 'Agenda', icon: Calendar, color: 'from-orange-400 to-orange-600', page: 'ParentCalendar' },
  { title: 'Anotações', icon: StickyNote, color: 'from-yellow-400 to-yellow-600', page: 'ParentNotes' },
  { title: 'Dicas de Educação', icon: Lightbulb, color: 'from-pink-400 to-pink-600', page: 'ParentTips' },
  { title: 'Mensagens com Professores', icon: MessageCircle, color: 'from-teal-400 to-teal-600', page: 'ParentMessages' },
];

export default function ParentDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const parentEmail = urlParams.get('parent') || localStorage.getItem('parent_email');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">👨‍👩‍👧 Painel dos Pais</h1>
          <p className="text-white text-lg font-bold">Gerencie a vida familiar</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {SECTIONS.map((section, index) => (
            <Link 
              key={section.title} 
              to={section.page === 'ParentMessages' 
                ? createPageUrl(section.page) + '?parent=' + parentEmail 
                : createPageUrl(section.page)
              }
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${section.color} rounded-2xl p-6 border-4 border-white shadow-xl cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <section.icon className="w-12 h-12 text-white" />
                  <h2 className="text-2xl font-black text-white">{section.title}</h2>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar para o App
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}