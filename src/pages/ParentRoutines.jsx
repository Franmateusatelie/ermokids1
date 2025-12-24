import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Clock, Bell, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function ParentRoutines() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    description: '',
    alarm_enabled: false,
    days_of_week: [],
  });

  const { data: routines = [] } = useQuery({
    queryKey: ['routines'],
    queryFn: () => base44.entities.Routine.list('-time'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Routine.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      setShowForm(false);
      setFormData({ title: '', time: '', description: '', alarm_enabled: false, days_of_week: [] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Routine.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });

  const toggleDayMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Routine.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });

  const toggleDay = (day) => {
    const days = formData.days_of_week.includes(day)
      ? formData.days_of_week.filter(d => d !== day)
      : [...formData.days_of_week, day];
    setFormData({ ...formData, days_of_week: days });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.time) {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <Clock className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Rotinas</h1>
          <p className="text-white text-lg font-bold">Organize o dia a dia</p>
        </motion.div>

        <div className="mb-6">
          <KidsButton color="green" size="lg" onClick={() => setShowForm(!showForm)} className="w-full">
            <Plus className="inline mr-2" />
            {showForm ? 'Cancelar' : 'Nova Rotina'}
          </KidsButton>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-6 border-4 border-white"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Título (ex: Escovar os dentes)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.alarm_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, alarm_enabled: checked })}
                  />
                  <label className="text-gray-700 font-bold flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Ativar alarme
                  </label>
                </div>

                <div>
                  <p className="text-gray-700 font-bold mb-2">Dias da semana:</p>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-full font-bold transition-all ${
                          formData.days_of_week.includes(day)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <KidsButton color="purple" size="lg" type="submit" className="w-full">
                  Salvar Rotina
                </KidsButton>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {routines.map((routine) => (
            <motion.div
              key={routine.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border-4 border-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-black text-purple-600">{routine.time}</span>
                    {routine.alarm_enabled && <Bell className="w-5 h-5 text-orange-500" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{routine.title}</h3>
                  {routine.description && (
                    <p className="text-gray-600 mb-2">{routine.description}</p>
                  )}
                  {routine.days_of_week && routine.days_of_week.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {routine.days_of_week.map((day) => (
                        <span key={day} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteMutation.mutate(routine.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {routines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl font-bold">Nenhuma rotina cadastrada ainda</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
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