import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import ClassroomSeat from '@/components/classroom/ClassroomSeat';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

const AVATARS = ['👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '🧔', '👴', '👵'];

export default function StudentJoin() {
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCode = urlParams.get('invite');

  const [step, setStep] = useState('name'); // 'name', 'parent-auth', 'seat'
  const [studentName, setStudentName] = useState('');
  const [avatar, setAvatar] = useState('👦');
  const [parentPassword, setParentPassword] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch session by invite code
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ['session-invite', inviteCode],
    queryFn: async () => {
      const sessions = await base44.entities.ClassroomSession.filter({ invite_code: inviteCode });
      return sessions[0];
    },
    enabled: !!inviteCode,
  });

  // Fetch students in session
  const { data: students = [] } = useQuery({
    queryKey: ['students', session?.id],
    queryFn: () => base44.entities.ClassroomStudent.filter({ session_id: session.id }),
    enabled: !!session,
    refetchInterval: 3000,
  });

  // Fetch parent profile
  const { data: parentProfiles = [] } = useQuery({
    queryKey: ['parent-profiles'],
    queryFn: () => base44.entities.ParentProfile.list(),
    enabled: step === 'parent-auth',
  });

  const joinClassroom = useMutation({
    mutationFn: (data) => base44.entities.ClassroomStudent.create(data),
    onSuccess: (student) => {
      soundEffects.playSuccess();
      queryClient.invalidateQueries(['students']);
      // Save student ID in localStorage for reconnection
      localStorage.setItem(`classroom_student_${session.id}`, student.id);
      navigate(createPageUrl('VirtualClassroom') + '?session=' + session.id + '&student=' + student.id);
    },
  });

  const occupiedSeats = {};
  students.forEach(s => occupiedSeats[s.seat_number] = s);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Por favor, digite seu nome!');
      return;
    }
    setError('');
    setStep('parent-auth');
  };

  const handleParentAuth = () => {
    const parentProfile = parentProfiles[0];
    if (!parentProfile) {
      setError('Nenhum perfil de pais cadastrado! Peça aos seus pais para criar uma conta primeiro.');
      soundEffects.playError();
      return;
    }

    if (parentPassword === parentProfile.password) {
      soundEffects.playSuccess();
      setError('');
      setParentPassword('');
      setStep('seat');
    } else {
      setError('Senha incorreta! Peça ajuda aos seus pais.');
      soundEffects.playError();
      setParentPassword('');
    }
  };

  const handleSeatSelect = () => {
    if (!selectedSeat) {
      setError('Escolha uma cadeira primeiro!');
      return;
    }

    const seatTaken = students.some(s => s.seat_number === selectedSeat);
    if (seatTaken) {
      setError('Esta cadeira já está ocupada! Escolha outra.');
      soundEffects.playError();
      return;
    }

    joinClassroom.mutate({
      session_id: session.id,
      student_name: studentName,
      seat_number: selectedSeat,
      avatar_emoji: avatar,
      parent_authorized: true,
      is_online: true,
    });
  };

  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-purple-600 mb-4">Convite Necessário</h1>
          <p className="text-gray-600 font-bold mb-6">
            Você precisa de um convite do professor para entrar na sala!
          </p>
          <Link to={createPageUrl('ClassroomChoice')}>
            <KidsButton color="orange" size="lg">
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    );
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">⏳</div>
          <h1 className="text-3xl font-black text-white">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-purple-600 mb-4">Sala não encontrada</h1>
          <p className="text-gray-600 font-bold mb-6">
            Este convite não é válido ou a sala foi encerrada.
          </p>
          <Link to={createPageUrl('ClassroomChoice')}>
            <KidsButton color="orange" size="lg">
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🎒
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            Entrar na Sala
          </h1>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-3 inline-block border-4 border-white shadow-xl">
            <p className="text-lg font-black text-purple-600">📚 {session.title}</p>
            <p className="text-sm font-bold text-gray-600">👩‍🏫 {session.teacher_name}</p>
            <p className="text-sm text-gray-500">🏫 {session.school} • {session.subject}</p>
          </div>
        </motion.div>

        {/* Step 1: Name and Avatar */}
        {step === 'name' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-purple-600 mb-2">Qual é o seu nome?</h2>
              <p className="text-gray-600">E escolha seu avatar!</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Seu Nome:</label>
                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-xl border-4"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Escolha seu Avatar:</label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {AVATARS.map((av) => (
                    <motion.button
                      key={av}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatar(av)}
                      className={`text-4xl p-3 rounded-xl border-4 ${
                        avatar === av
                          ? 'bg-purple-200 border-purple-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {av}
                    </motion.button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3 text-center">
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <KidsButton type="submit" color="green" size="xl" className="w-full">
                Continuar ➡️
              </KidsButton>
            </form>
          </motion.div>
        )}

        {/* Step 2: Parent Authorization */}
        {step === 'parent-auth' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">🔒</div>
              <h2 className="text-3xl font-black text-purple-600 mb-2">Autorização dos Pais</h2>
              <p className="text-gray-600">Peça para seus pais digitarem a senha</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Senha dos Pais:</label>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={parentPassword}
                  onChange={(e) => setParentPassword(e.target.value)}
                  className="text-xl border-4"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3 text-center">
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <KidsButton
                  color="green"
                  size="lg"
                  onClick={handleParentAuth}
                  disabled={!parentPassword}
                  className="flex-1"
                >
                  Confirmar ✓
                </KidsButton>
                <KidsButton
                  color="orange"
                  size="lg"
                  onClick={() => {
                    setStep('name');
                    setParentPassword('');
                    setError('');
                  }}
                  className="flex-1"
                >
                  ← Voltar
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Seat Selection */}
        {step === 'seat' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">🪑</div>
              <h2 className="text-3xl font-black text-purple-600 mb-2">Escolha sua Cadeira</h2>
              <p className="text-gray-600">Clique na cadeira onde você quer sentar</p>
            </div>

            <div>
              <div className="grid grid-cols-5 md:grid-cols-6 gap-2 justify-items-center max-h-80 overflow-y-auto bg-purple-50 rounded-xl p-3 border-2 border-purple-200 mb-4">
                {Array.from({ length: session.max_students }, (_, i) => i + 1).map((seatNum) => (
                  <ClassroomSeat
                    key={seatNum}
                    seatNumber={seatNum}
                    student={occupiedSeats[seatNum]}
                    isSelected={selectedSeat === seatNum}
                    onClick={() => {
                      if (!occupiedSeats[seatNum]) {
                        setSelectedSeat(seatNum);
                        setError('');
                      }
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3 text-center mb-4">
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <KidsButton
                  color="green"
                  size="xl"
                  onClick={handleSeatSelect}
                  disabled={!selectedSeat}
                  className="flex-1"
                >
                  Entrar na Sala! 🎉
                </KidsButton>
                <KidsButton
                  color="orange"
                  size="xl"
                  onClick={() => {
                    setStep('parent-auth');
                    setSelectedSeat(null);
                    setError('');
                  }}
                  className="flex-1"
                >
                  ← Voltar
                </KidsButton>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('ClassroomChoice')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Cancelar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}