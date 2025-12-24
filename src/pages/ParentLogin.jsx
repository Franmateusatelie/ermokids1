import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function ParentLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState('verify'); // verify, login, register
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childBirthdate, setChildBirthdate] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [error, setError] = useState('');

  // Captcha matemático
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const correctAnswer = num1 + num2;

  const { data: profiles = [] } = useQuery({
    queryKey: ['parentProfiles'],
    queryFn: () => base44.entities.ParentProfile.list(),
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.ParentProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentProfiles'] });
      soundEffects.playVictory();
      navigate(createPageUrl('ParentDashboard'));
    },
  });

  const handleVerify = () => {
    if (parseInt(mathAnswer) !== correctAnswer) {
      soundEffects.playError();
      setError('Resposta incorreta! Tente novamente.');
      return;
    }
    
    soundEffects.playSuccess();
    if (profiles.length > 0) {
      setStep('login');
    } else {
      setStep('register');
    }
  };

  const handleLogin = () => {
    const profile = profiles[0];
    if (password === profile.password) {
      soundEffects.playVictory();
      navigate(createPageUrl('ParentDashboard'));
    } else {
      soundEffects.playError();
      setError('Senha incorreta!');
    }
  };

  const handleRegister = () => {
    if (!password || password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      soundEffects.playError();
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      soundEffects.playError();
      return;
    }
    if (!childName) {
      setError('Digite o nome da criança');
      soundEffects.playError();
      return;
    }

    createProfileMutation.mutate({
      password,
      child_name: childName,
      child_birthdate: childBirthdate || null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-md mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            👨‍👩‍👧
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Área dos Pais</h1>
          <p className="text-white text-lg font-bold">Gerenciamento familiar</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
        >
          {step === 'verify' && (
            <div>
              <div className="text-center mb-6">
                <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">Verificação de Adulto</h2>
                <p className="text-gray-600">Por favor, resolva a questão:</p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
                <p className="text-4xl font-black text-center text-purple-600 mb-4">
                  {num1} + {num2} = ?
                </p>
                <Input
                  type="number"
                  placeholder="Digite a resposta"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  className="text-2xl text-center font-bold border-4"
                />
              </div>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <KidsButton color="purple" size="xl" onClick={handleVerify} className="w-full">
                Verificar
              </KidsButton>
            </div>
          )}

          {step === 'login' && (
            <div>
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">Login</h2>
                <p className="text-gray-600">Digite sua senha:</p>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xl border-4"
                />
              </div>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <KidsButton color="green" size="xl" onClick={handleLogin} className="w-full">
                Entrar
              </KidsButton>
            </div>
          )}

          {step === 'register' && (
            <div>
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">Primeiro Acesso</h2>
                <p className="text-gray-600">Crie sua senha de acesso:</p>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  type="text"
                  placeholder="Nome da criança"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="text-lg border-4"
                />
                <Input
                  type="date"
                  placeholder="Data de nascimento"
                  value={childBirthdate}
                  onChange={(e) => setChildBirthdate(e.target.value)}
                  className="text-lg border-4"
                />
                <Input
                  type="password"
                  placeholder="Criar senha (mín. 4 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-lg border-4"
                />
                <Input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-lg border-4"
                />
              </div>

              {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

              <KidsButton color="blue" size="xl" onClick={handleRegister} className="w-full">
                Criar Conta
              </KidsButton>
            </div>
          )}
        </motion.div>

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
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