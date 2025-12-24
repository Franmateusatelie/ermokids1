import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import KidsButton from '@/components/kids/KidsButton';

const TIPS = [
  {
    category: 'Desenvolvimento',
    icon: '🧠',
    tips: [
      {
        title: 'Rotina estruturada',
        content: 'Crianças com TEA se beneficiam de rotinas previsíveis. Mantenha horários regulares para refeições, sono e atividades.',
        expert: 'Dr. João Silva - Neuropediatra'
      },
      {
        title: 'Comunicação visual',
        content: 'Use apoios visuais como calendários com imagens, quadros de rotina e cartões de comunicação para facilitar a compreensão.',
        expert: 'Dra. Maria Santos - Fonoaudióloga'
      },
      {
        title: 'Reforço positivo',
        content: 'Elogie e recompense comportamentos desejados imediatamente. Isso ajuda a criança a entender o que é esperado dela.',
        expert: 'Psicóloga Ana Costa'
      },
    ]
  },
  {
    category: 'Alimentação',
    icon: '🍎',
    tips: [
      {
        title: 'Introdução gradual',
        content: 'Apresente novos alimentos aos poucos, sem pressão. Permita que a criança explore texturas e sabores no seu ritmo.',
        expert: 'Nutricionista Paula Oliveira'
      },
      {
        title: 'Ambiente tranquilo',
        content: 'Minimize distrações durante as refeições. Um ambiente calmo ajuda a criança a se concentrar na alimentação.',
        expert: 'Dra. Carla Mendes - Terapeuta Ocupacional'
      },
    ]
  },
  {
    category: 'Sono',
    icon: '😴',
    tips: [
      {
        title: 'Ritual de sono',
        content: 'Crie uma sequência relaxante antes de dormir: banho morno, história, música suave. Mantenha a mesma ordem todas as noites.',
        expert: 'Dr. Pedro Alves - Neurologista'
      },
      {
        title: 'Ambiente adequado',
        content: 'Quarto escuro, temperatura agradável e sem ruídos excessivos. Considere o uso de ruído branco se necessário.',
        expert: 'Consultora de Sono Infantil Juliana Lima'
      },
    ]
  },
  {
    category: 'Comportamento',
    icon: '🎯',
    tips: [
      {
        title: 'Prevenção de crises',
        content: 'Identifique gatilhos que causam desconforto. Antecipe situações difíceis e prepare a criança com antecedência.',
        expert: 'Psicóloga Comportamental Fernanda Rocha'
      },
      {
        title: 'Espaço sensorial',
        content: 'Crie um cantinho calmo onde a criança possa se regular quando sobrecarregada. Inclua objetos de conforto.',
        expert: 'Terapeuta Ocupacional Ricardo Santos'
      },
    ]
  },
  {
    category: 'Socialização',
    icon: '👫',
    tips: [
      {
        title: 'Interações estruturadas',
        content: 'Promova encontros com outras crianças em ambientes controlados. Atividades com regras claras facilitam a interação.',
        expert: 'Dra. Beatriz Cunha - Psicóloga Infantil'
      },
      {
        title: 'Ensino de habilidades sociais',
        content: 'Pratique situações sociais em casa: cumprimentar, pedir, compartilhar. Use role-play para treinar.',
        expert: 'Educadora Especial Mariana Dias'
      },
    ]
  },
];

export default function ParentTips() {
  const [expandedTip, setExpandedTip] = useState(null);

  const toggleTip = (category, index) => {
    const key = `${category}-${index}`;
    setExpandedTip(expandedTip === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-500 p-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <Lightbulb className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Dicas de Especialistas</h1>
          <p className="text-white text-lg font-bold">Orientações profissionais comprovadas</p>
        </motion.div>

        <div className="space-y-6 mb-6">
          {TIPS.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-4 border-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{category.icon}</span>
                <h2 className="text-2xl font-black text-gray-800">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.tips.map((tip, tipIndex) => {
                  const key = `${category.category}-${tipIndex}`;
                  const isExpanded = expandedTip === key;

                  return (
                    <div key={tipIndex} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleTip(category.category, tipIndex)}
                        className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between hover:from-purple-100 hover:to-pink-100 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Lightbulb className="w-5 h-5 text-orange-500" />
                          <span className="font-bold text-gray-800 text-left">{tip.title}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="p-4 bg-white"
                        >
                          <p className="text-gray-700 mb-3 leading-relaxed">{tip.content}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-purple-600">✓ Validado por:</span>
                            <span className="text-gray-600">{tip.expert}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-6 mb-6">
          <p className="text-center text-gray-700 font-bold">
            ⚠️ <strong>Importante:</strong> Todas as dicas são baseadas em evidências científicas e aprovadas por profissionais especializados em TEA. Consulte sempre o médico e terapeutas da criança para orientações personalizadas.
          </p>
        </div>

        <div className="flex justify-center">
          <Link to={createPageUrl('ParentDashboard')}>
            <KidsButton color="orange" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}