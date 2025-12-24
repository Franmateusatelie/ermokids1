import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { Input } from '@/components/ui/input';
import { soundEffects } from '@/components/kids/SoundEffects';
import { generatePixCode } from '@/components/utils/pixGenerator';

const SUGGESTED_VALUES = [1, 5, 10, 20, 50, 100];

export default function Donation() {
  const [customValue, setCustomValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSelectValue = (value) => {
    setSelectedValue(value);
    setCustomValue('');
    soundEffects.playClick();
  };

  const handleCustomValue = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomValue(value);
    if (value) {
      setSelectedValue(parseInt(value));
    }
  };

  const pixCnpj = '48230750000186';
  const [showPixDetails, setShowPixDetails] = useState(false);
  
  const pixCode = useMemo(() => {
    if (selectedValue && selectedValue >= 1) {
      return generatePixCode(pixCnpj, selectedValue);
    }
    return '';
  }, [selectedValue]);

  const handleDonate = () => {
    if (selectedValue && selectedValue >= 1) {
      soundEffects.playSuccess();
      setShowPixDetails(true);
    } else {
      soundEffects.playError();
      alert('Por favor, escolha um valor de pelo menos R$ 1,00');
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    soundEffects.playSuccess();
    alert('Código PIX copiado! Cole no seu app de pagamento.');
  };

  const handlePixComplete = () => {
    soundEffects.playVictory();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setShowPixDetails(false);
      setSelectedValue(null);
      setCustomValue('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            💝
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Ajude o ErmoKids</h1>
          <p className="text-white text-lg font-bold">Sua doação mantém o app gratuito para todas as crianças!</p>
        </motion.div>

        {showPixDetails ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-purple-600 mb-4">
                💳 Pagamento via PIX
              </h2>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl mb-6">
                <p className="text-2xl font-black text-gray-800 mb-2">
                  Valor: <span className="text-green-600">R$ {selectedValue},00</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-4 border-green-200 mb-6">
              <p className="text-center text-sm font-bold text-gray-700 mb-3">
                🔒 Código PIX Copia e Cola:
              </p>
              <div className="bg-gray-100 p-4 rounded-xl mb-4 max-h-32 overflow-y-auto">
                <p className="text-center font-mono text-xs text-gray-800 break-all leading-relaxed">
                  {pixCode}
                </p>
              </div>
              <KidsButton color="green" size="lg" onClick={copyPixCode} className="w-full mb-4">
                📋 Copiar Código PIX
              </KidsButton>
              <p className="text-center text-xs text-gray-500">
                ✅ Código seguro com valor já incluído
              </p>
            </div>

            <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-4 mb-6">
              <p className="text-center text-sm font-bold text-gray-700 mb-2">
                📱 Como fazer a doação:
              </p>
              <ol className="text-left text-sm text-gray-600 space-y-2 ml-4">
                <li>1. Clique em "Copiar Código PIX"</li>
                <li>2. Abra seu app de banco</li>
                <li>3. Escolha PIX → PIX Copia e Cola</li>
                <li>4. Cole o código copiado</li>
                <li>5. Confirme os dados e o valor</li>
                <li>6. Finalize o pagamento</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <KidsButton color="green" size="xl" onClick={handlePixComplete} className="w-full">
                ✅ Já fiz a doação!
              </KidsButton>
              <KidsButton color="orange" size="md" onClick={() => setShowPixDetails(false)} className="w-full">
                ⬅️ Voltar
              </KidsButton>
            </div>
          </motion.div>
        ) : !showThankYou ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-purple-600 mb-4 text-center">
                💖 Doação Voluntária
              </h2>
              <p className="text-gray-700 text-center mb-4">
                O ErmoKids é gratuito para todos! Mas você pode ajudar a manter o app com atualizações e novos jogos.
              </p>
              <p className="text-gray-600 text-center text-sm">
                Doação mínima: R$ 1,00
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Escolha um valor:
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {SUGGESTED_VALUES.map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectValue(value)}
                    className={`py-4 px-6 rounded-2xl font-bold text-xl transition-all ${
                      selectedValue === value
                        ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white ring-4 ring-pink-300'
                        : 'bg-white text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    R$ {value}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Ou digite outro valor:
              </h3>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-500 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Digite o valor (mínimo R$ 1)"
                  value={customValue}
                  onChange={handleCustomValue}
                  className="text-xl py-6 border-4"
                />
              </div>
              {customValue && parseInt(customValue) < 1 && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Valor mínimo é R$ 1,00
                </p>
              )}
            </div>

            {selectedValue && selectedValue >= 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl mb-6 text-center"
              >
                <p className="text-2xl font-black text-gray-800">
                  Você vai doar: <span className="text-green-600">R$ {selectedValue},00</span>
                </p>
              </motion.div>
            )}

            <div className="flex flex-col gap-4">
              <KidsButton
                color="pink"
                size="xl"
                onClick={handleDonate}
                className="w-full"
                disabled={!selectedValue || selectedValue < 1}
              >
                <Heart className="inline mr-2 fill-white" />
                Fazer Doação
              </KidsButton>

              <p className="text-xs text-gray-500 text-center">
                * Pagamento 100% seguro. Você será redirecionado para finalizar a doação.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-pink-400 shadow-2xl text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              🎉💖
            </motion.div>
            <h2 className="text-4xl font-black text-pink-600 mb-4">
              Muito Obrigado!
            </h2>
            <p className="text-2xl text-gray-700 mb-4">
              Sua doação de <span className="font-black text-green-600">R$ {selectedValue},00</span>
            </p>
            <p className="text-xl text-gray-600">
              Ajuda a manter o ErmoKids gratuito e com novos conteúdos para todas as crianças!
            </p>
          </motion.div>
        )}

        <div className="flex justify-center mt-6">
          <Link to={createPageUrl('Home')}>
            <KidsButton color="purple" size="md">
              <ArrowLeft className="inline mr-2" />
              Voltar
            </KidsButton>
          </Link>
        </div>
      </div>
    </div>
  );
}