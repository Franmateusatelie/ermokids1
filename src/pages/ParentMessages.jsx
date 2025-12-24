import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import ParentMessaging from '@/components/parent/ParentMessaging';
import KidsButton from '@/components/kids/KidsButton';
import { ArrowLeft } from 'lucide-react';

export default function ParentMessages() {
  const urlParams = new URLSearchParams(window.location.search);
  const parentEmail = urlParams.get('parent') || localStorage.getItem('parent_email');

  const { data: parentProfile } = useQuery({
    queryKey: ['parent-profile', parentEmail],
    queryFn: async () => {
      const profiles = await base44.entities.ParentProfile.filter({ created_by: parentEmail });
      return profiles[0];
    },
    enabled: !!parentEmail,
  });

  if (!parentEmail || !parentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-white">Acesso negado</h1>
          <Link to={createPageUrl('ParentLogin')}>
            <KidsButton color="orange" size="lg" className="mt-4">
              Fazer Login
            </KidsButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            💬
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            Mensagens com Professores
          </h1>
          <p className="text-white text-lg font-bold">
            Comunicação segura e direta
          </p>
        </motion.div>

        <ParentMessaging parentEmail={parentEmail} />

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('ParentDashboard') + '?parent=' + parentEmail}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}