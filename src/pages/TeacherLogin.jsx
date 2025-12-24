import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

export default function TeacherLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    subject: '',
    school: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => base44.entities.Teacher.list(),
  });

  const createTeacher = useMutation({
    mutationFn: (data) => base44.entities.Teacher.create(data),
    onSuccess: (teacher) => {
      soundEffects.playSuccess();
      queryClient.invalidateQueries(['teachers']);
      navigate(createPageUrl('TeacherDashboard') + '?teacher=' + teacher.id);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login
      const teacher = teachers.find(
        t => t.email === formData.email && t.password === formData.password
      );
      if (teacher) {
        soundEffects.playSuccess();
        navigate(createPageUrl('TeacherDashboard') + '?teacher=' + teacher.id);
      } else {
        setError('Email ou senha incorretos!');
        soundEffects.playError();
      }
    } else {
      // Cadastro
      if (!formData.name || !formData.email || !formData.password || !formData.subject || !formData.school) {
        setError('Preencha todos os campos!');
        return;
      }
      
      const exists = teachers.some(t => t.email === formData.email);
      if (exists) {
        setError('Este email já está cadastrado!');
        return;
      }

      createTeacher.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-md mx-auto">
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
            👩‍🏫
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            {isLogin ? 'Login Professor' : 'Cadastro Professor'}
          </h1>
          <p className="text-white text-lg font-bold">Área exclusiva para professores</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo:</label>
                <Input
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg border-4"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email:</label>
              <Input
                type="email"
                placeholder="seu.email@escola.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-lg border-4"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha:</label>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="text-lg border-4"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Matéria:</label>
                  <Input
                    type="text"
                    placeholder="Ex: Matemática"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="text-lg border-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Escola:</label>
                  <Input
                    type="text"
                    placeholder="Ex: Escola Municipal"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="text-lg border-4"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3 text-center">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            <KidsButton type="submit" color="green" size="xl" className="w-full">
              <BookOpen className="inline mr-2" />
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </KidsButton>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="w-full text-center text-purple-600 font-bold hover:text-purple-800 transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Fazer login'}
            </button>
          </form>
        </motion.div>

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Voltar ao Início
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}