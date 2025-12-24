import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, Megaphone } from 'lucide-react';

export default function NotificationBanner({ announcements, activeQuiz, onDismiss }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newNotifications = [];

    // Add active announcements
    announcements.forEach(announcement => {
      newNotifications.push({
        id: announcement.id,
        type: announcement.type,
        message: announcement.message,
        icon: getIcon(announcement.type),
        color: getColor(announcement.type),
        timestamp: announcement.created_date,
      });
    });

    // Add quiz notification if active
    if (activeQuiz) {
      const quizNotification = notifications.find(n => n.id === 'quiz-' + activeQuiz.id);
      if (!quizNotification) {
        newNotifications.push({
          id: 'quiz-' + activeQuiz.id,
          type: 'quiz_started',
          message: '📝 Novo Quiz Disponível: ' + activeQuiz.question_text,
          icon: CheckCircle,
          color: 'from-blue-500 to-blue-600',
          timestamp: new Date().toISOString(),
        });
      }
    }

    setNotifications(newNotifications);
  }, [announcements, activeQuiz]);

  const getIcon = (type) => {
    switch(type) {
      case 'quiz_started': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'announcement': return Megaphone;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'quiz_started': return 'from-blue-500 to-blue-600';
      case 'warning': return 'from-red-500 to-red-600';
      case 'break': return 'from-green-500 to-green-600';
      case 'announcement': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (onDismiss) onDismiss(id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`bg-gradient-to-r ${notification.color} rounded-2xl p-4 border-4 border-white shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-white font-bold text-sm leading-tight">
                    {notification.message}
                  </p>
                  <p className="text-white/80 text-xs mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-1 flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}