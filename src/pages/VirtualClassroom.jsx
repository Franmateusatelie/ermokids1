import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import ClassroomSeat from '@/components/classroom/ClassroomSeat';
import EmotionPanel from '@/components/classroom/EmotionPanel';
import QuestionCard from '@/components/classroom/QuestionCard';
import ChatPanel from '@/components/classroom/ChatPanel';
import VideoConference from '@/components/classroom/VideoConference';
import AnnouncementPanel from '@/components/classroom/AnnouncementPanel';
import NotificationBanner from '@/components/classroom/NotificationBanner';
import TeacherControls from '@/components/classroom/TeacherControls';
import StudentControls from '@/components/classroom/StudentControls';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { soundEffects } from '@/components/kids/SoundEffects';

const AVATARS = ['👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '🦸‍♀️', '🦸‍♂️'];

export default function VirtualClassroom() {
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCode = urlParams.get('invite');
  const sessionId = urlParams.get('session');
  const studentIdParam = urlParams.get('student');
  
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(true);
  const [showParentAuth, setShowParentAuth] = useState(false);
  const [parentPassword, setParentPassword] = useState('');
  const [joinData, setJoinData] = useState({ name: '', avatar: '👦' });
  const [selectedSeat, setSelectedSeat] = useState(null);

  const queryClient = useQueryClient();

  // Fetch session by invite code or session ID
  const { data: session } = useQuery({
    queryKey: ['session', inviteCode || sessionId],
    queryFn: async () => {
      if (inviteCode) {
        const sessions = await base44.entities.ClassroomSession.filter({ invite_code: inviteCode });
        return sessions[0];
      } else if (sessionId) {
        const sessions = await base44.entities.ClassroomSession.filter({ id: sessionId });
        return sessions[0];
      }
      return null;
    },
    enabled: !!(inviteCode || sessionId),
  });

  const actualSessionId = session?.id;

  // Fetch students - auto refresh every 3s
  const { data: students = [] } = useQuery({
    queryKey: ['students', actualSessionId],
    queryFn: () => base44.entities.ClassroomStudent.filter({ session_id: actualSessionId }),
    enabled: !!actualSessionId,
    refetchInterval: 3000,
  });

  // Fetch active question
  const { data: questions = [] } = useQuery({
    queryKey: ['questions', actualSessionId],
    queryFn: () => base44.entities.ClassroomQuestion.filter({ session_id: actualSessionId, is_active: true }),
    enabled: !!actualSessionId,
    refetchInterval: 3000,
  });

  const activeQuestion = questions[0];

  // Fetch answers for active question
  const { data: answers = [] } = useQuery({
    queryKey: ['answers', activeQuestion?.id],
    queryFn: () => base44.entities.ClassroomAnswer.filter({ question_id: activeQuestion.id }),
    enabled: !!activeQuestion,
    refetchInterval: 2000,
  });

  // Fetch recent emotions
  const { data: emotions = [] } = useQuery({
    queryKey: ['emotions', actualSessionId],
    queryFn: () => base44.entities.ClassroomEmotion.list('-created_date', 20),
    enabled: !!actualSessionId,
    refetchInterval: 2000,
  });

  // Fetch chat messages
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', actualSessionId],
    queryFn: () => base44.entities.ClassroomMessage.filter({ session_id: actualSessionId }),
    enabled: !!actualSessionId,
    refetchInterval: 2000,
  });

  // Fetch announcements for notifications
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements', actualSessionId],
    queryFn: () => base44.entities.ClassroomAnnouncement.filter({ 
      session_id: actualSessionId, 
      is_active: true 
    }),
    enabled: !!actualSessionId,
    refetchInterval: 3000,
  });

  // Fetch parent profile for password verification
  const { data: parentProfiles = [] } = useQuery({
    queryKey: ['parent-profiles'],
    queryFn: () => base44.entities.ParentProfile.list(),
    enabled: showParentAuth,
  });

  const joinClassroom = useMutation({
    mutationFn: (data) => base44.entities.ClassroomStudent.create(data),
    onSuccess: (student) => {
      setCurrentStudent(student);
      setShowJoinForm(false);
      soundEffects.playSuccess();
      localStorage.setItem(`classroom_student_${actualSessionId}`, student.id);
      queryClient.invalidateQueries(['students']);
    },
  });

  const updateStudent = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClassroomStudent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });

  const updateSession = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClassroomSession.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['session']);
    },
  });

  // Check for existing student on mount
  useEffect(() => {
    if (actualSessionId && !currentStudent && studentIdParam) {
      // Try to fetch existing student
      base44.entities.ClassroomStudent.filter({ id: studentIdParam, session_id: actualSessionId })
        .then(result => {
          if (result && result.length > 0) {
            setCurrentStudent(result[0]);
            setShowJoinForm(false);
          }
        })
        .catch(() => {
          console.log('Student not found');
        });
    }
  }, [actualSessionId, studentIdParam, currentStudent]);

  const sendEmotion = useMutation({
    mutationFn: (emotion) => base44.entities.ClassroomEmotion.create({
      session_id: actualSessionId,
      student_id: currentStudent.id,
      student_name: currentStudent.student_name,
      emotion,
      timestamp: new Date().toISOString(),
    }),
    onSuccess: () => {
      soundEffects.playClick();
      queryClient.invalidateQueries(['emotions']);
    },
  });

  const sendMessage = useMutation({
    mutationFn: (message) => base44.entities.ClassroomMessage.create({
      session_id: actualSessionId,
      student_id: currentStudent.id,
      student_name: currentStudent.student_name,
      message,
      timestamp: new Date().toISOString(),
    }),
    onSuccess: () => {
      soundEffects.playClick();
      queryClient.invalidateQueries(['messages']);
    },
  });

  const submitAnswer = useMutation({
    mutationFn: (answer) => base44.entities.ClassroomAnswer.create({
      question_id: activeQuestion.id,
      student_id: currentStudent.id,
      student_name: currentStudent.student_name,
      answer,
      is_correct: answer === activeQuestion.correct_answer,
    }),
    onSuccess: (data) => {
      if (data.is_correct) {
        soundEffects.playSuccess();
      } else {
        soundEffects.playError();
      }
      queryClient.invalidateQueries(['answers']);
    },
  });

  const handleRequestJoin = () => {
    if (joinData.name && selectedSeat) {
      const seatTaken = students.some(s => s.seat_number === selectedSeat);
      if (seatTaken) {
        alert('Esta cadeira já está ocupada! Escolha outra.');
        return;
      }
      setShowParentAuth(true);
    }
  };

  const handleParentAuth = () => {
    const parentProfile = parentProfiles[0];
    if (!parentProfile) {
      alert('Nenhum perfil de pais cadastrado! Por favor, cadastre primeiro.');
      return;
    }

    if (parentPassword === parentProfile.password) {
      joinClassroom.mutate({
        session_id: actualSessionId,
        student_name: joinData.name,
        seat_number: selectedSeat,
        avatar_emoji: joinData.avatar,
        parent_authorized: true,
        is_online: true,
      });
      setShowParentAuth(false);
      setParentPassword('');
    } else {
      alert('Senha incorreta! Peça ajuda aos seus pais.');
      setParentPassword('');
    }
  };

  const occupiedSeats = students.reduce((acc, student) => {
    acc[student.seat_number] = student;
    return acc;
  }, {});

  const hasAnswered = currentStudent && answers.some(a => a.student_id === currentStudent.id);

  const isTeacher = session && session.teacher_id && urlParams.get('teacher') === session.teacher_id;

  const studentsWithHandsRaised = students.filter(s => s.hand_raised);

  const handleRaiseHand = () => {
    if (currentStudent) {
      updateStudent.mutate({
        id: currentStudent.id,
        data: { hand_raised: !currentStudent.hand_raised }
      });
      soundEffects.playClick();
    }
  };

  const handleToggleStudentMic = (student) => {
    updateStudent.mutate({
      id: student.id,
      data: { mic_enabled: !student.mic_enabled }
    });
    soundEffects.playClick();
  };

  const handleToggleTeacherMic = () => {
    updateSession.mutate({
      id: actualSessionId,
      data: { teacher_mic_enabled: !session.teacher_mic_enabled }
    });
    soundEffects.playClick();
  };

  const handleToggleTeacherCamera = () => {
    updateSession.mutate({
      id: actualSessionId,
      data: { teacher_camera_enabled: !session.teacher_camera_enabled }
    });
    soundEffects.playClick();
  };

  if ((!inviteCode && !sessionId) || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-white">Sala não encontrada ou convite inválido</h1>
          <Link to={createPageUrl('Home')} className="mt-4 inline-block">
            <KidsButton color="orange" size="lg">
              Voltar ao Início
            </KidsButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 overflow-hidden relative">
      <FloatingElements />
      
      {/* Notification Banner */}
      {!showJoinForm && !showParentAuth && (
        <NotificationBanner
          announcements={announcements}
          activeQuiz={activeQuestion}
        />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-4 mb-4 border-4 border-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🏫</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-purple-600">{session.title}</h1>
                <p className="text-sm md:text-base text-gray-600">👩‍🏫 {session.teacher_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-600">Alunos Online:</p>
                <p className="text-2xl font-black text-green-600">{students.length}/{session.max_students}</p>
              </div>
              {!showJoinForm && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`🏫 Venha participar da sala de aula virtual!\n\n📚 ${session.title}\n👩‍🏫 ${session.teacher_name}\n📖 ${session.subject}\n🏫 ${session.school}\n\n🔗 ${window.location.origin}${createPageUrl('VirtualClassroom')}?invite=${session.invite_code}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <KidsButton color="green" size="md">
                    💬 Convidar
                  </KidsButton>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {showParentAuth ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl max-w-md mx-auto"
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
                />
              </div>

              <div className="flex gap-3">
                <KidsButton
                  color="green"
                  size="lg"
                  onClick={handleParentAuth}
                  disabled={!parentPassword}
                  className="flex-1"
                >
                  Confirmar
                </KidsButton>
                <KidsButton
                  color="orange"
                  size="lg"
                  onClick={() => {
                    setShowParentAuth(false);
                    setParentPassword('');
                  }}
                  className="flex-1"
                >
                  Voltar
                </KidsButton>
              </div>
            </div>
          </motion.div>
        ) : showJoinForm ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">👋</div>
              <h2 className="text-3xl font-black text-purple-600 mb-2">Bem-vindo à Sala!</h2>
              <p className="text-gray-600">Digite seu nome e escolha uma cadeira</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Seu Nome:</label>
                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={joinData.name}
                  onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
                  className="text-xl border-4"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Escolha seu Avatar:</label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {AVATARS.map((avatar) => (
                    <motion.button
                      key={avatar}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setJoinData({ ...joinData, avatar })}
                      className={`text-4xl p-3 rounded-xl border-4 ${
                        joinData.avatar === avatar
                          ? 'bg-purple-200 border-purple-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {avatar}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">Escolha sua Cadeira:</label>
                <div className="grid grid-cols-5 md:grid-cols-6 gap-2 justify-items-center max-h-64 overflow-y-auto bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
                  {Array.from({ length: session.max_students }, (_, i) => i + 1).map((seatNum) => (
                    <ClassroomSeat
                      key={seatNum}
                      seatNumber={seatNum}
                      student={occupiedSeats[seatNum]}
                      isSelected={selectedSeat === seatNum}
                      onClick={() => setSelectedSeat(seatNum)}
                    />
                  ))}
                </div>
              </div>

              <KidsButton
                color="green"
                size="xl"
                onClick={handleRequestJoin}
                disabled={!joinData.name || !selectedSeat}
                className="w-full"
              >
                Pedir Autorização dos Pais 👨‍👩‍👧
              </KidsButton>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Left Column - Classroom & Video */}
            <div className="md:col-span-2 space-y-4">
              {/* Teacher/Student Controls */}
              {isTeacher ? (
                <TeacherControls
                  session={session}
                  onToggleMic={handleToggleTeacherMic}
                  onToggleCamera={handleToggleTeacherCamera}
                  studentsWithHandsRaised={studentsWithHandsRaised}
                  onToggleStudentMic={handleToggleStudentMic}
                />
              ) : currentStudent && (
                <StudentControls
                  currentStudent={currentStudent}
                  onRaiseHand={handleRaiseHand}
                />
              )}
              {/* Classroom Seats */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-4 border-white shadow-xl">

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">🎓</div>
                  <h2 className="text-2xl font-black text-purple-600">Sala de Aula</h2>
                </div>
                
                {/* Teacher's Desk */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl p-4 border-4 border-yellow-400 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-5xl">👩‍🏫</div>
                      <div>
                        <div className="text-lg font-black text-orange-800">Mesa da Professora</div>
                        <div className="text-sm font-bold text-orange-600">{session.teacher_name}</div>
                      </div>
                      <div className="text-4xl">📚</div>
                    </div>
                  </motion.div>
                </div>

                {/* Students Seats */}
                <div className="grid grid-cols-5 md:grid-cols-6 gap-2 justify-items-center max-h-80 overflow-y-auto bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl p-3 border-2 border-purple-200">
                  {Array.from({ length: session.max_students }, (_, i) => i + 1).map((seatNum) => (
                    <ClassroomSeat
                      key={seatNum}
                      seatNumber={seatNum}
                      student={occupiedSeats[seatNum]}
                      isSelected={currentStudent?.seat_number === seatNum}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              {activeQuestion && (
                <QuestionCard
                  question={activeQuestion}
                  onAnswer={(answer) => submitAnswer.mutate(answer)}
                  hasAnswered={hasAnswered}
                  studentAnswers={answers}
                />
              )}

              {!activeQuestion && (
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border-4 border-purple-200 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-xl font-bold text-gray-600">
                    Aguardando a próxima pergunta da professora...
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Emotions & Chat */}
            <div className="space-y-4">
              {isTeacher && (
                <AnnouncementPanel
                  session={session}
                  isTeacher={isTeacher}
                />
              )}
              <EmotionPanel
                onEmotionSend={(emotion) => sendEmotion.mutate(emotion)}
                recentEmotions={emotions}
              />
              <ChatPanel
                messages={messages}
                onSendMessage={(message) => sendMessage.mutate(message)}
                currentStudent={currentStudent}
              />
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="orange" size="lg">
              <ArrowLeft className="inline mr-2" />
              Sair da Sala
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}