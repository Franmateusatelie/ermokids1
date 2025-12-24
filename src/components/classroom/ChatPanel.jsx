import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import KidsButton from '@/components/kids/KidsButton';
import { Send } from 'lucide-react';

export default function ChatPanel({ messages = [], onSendMessage, currentStudent }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-purple-300 shadow-xl flex flex-col h-[400px]">
      <h3 className="text-lg font-black text-purple-600 mb-3 text-center flex items-center justify-center gap-2">
        💬 Chat da Turma
      </h3>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const isMyMessage = msg.student_id === currentStudent?.id;
            return (
              <motion.div
                key={msg.id || idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    isMyMessage
                      ? 'bg-purple-500 text-white'
                      : 'bg-white border-2 border-purple-200'
                  }`}
                >
                  <div className="text-[10px] font-bold mb-1 opacity-70">
                    {msg.student_name}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          type="text"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={200}
          className="border-4 border-purple-300"
        />
        <KidsButton type="submit" color="purple" size="md" disabled={!newMessage.trim()}>
          <Send className="w-5 h-5" />
        </KidsButton>
      </form>
    </div>
  );
}