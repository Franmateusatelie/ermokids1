import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingElements from '@/components/kids/FloatingElements';
import KidsButton from '@/components/kids/KidsButton';
import { soundEffects } from '@/components/kids/SoundEffects';

const CATEGORIES = [
  {
    name: 'Planetas',
    emoji: '🪐',
    color: 'from-purple-400 to-blue-500',
    facts: [
      'Júpiter é o maior planeta do Sistema Solar! É tão grande que cabem 1.300 Terras dentro dele! 🪐',
      'Saturno tem anéis feitos de gelo e rochas! São tão bonitos que parece um chapéu gigante! 💍',
      'Marte é chamado de Planeta Vermelho por causa da poeira vermelha que cobre sua superfície! 🔴',
      'A Terra é o único planeta conhecido que tem água líquida e vida! Somos especiais! 🌍',
      'Vênus é o planeta mais quente do Sistema Solar, mais quente até que Mercúrio! 🔥',
      'Netuno tem ventos super fortes, os mais rápidos de todo o Sistema Solar! 💨',
    ]
  },
  {
    name: 'Estrelas',
    emoji: '⭐',
    color: 'from-yellow-400 to-orange-500',
    facts: [
      'O Sol é uma estrela! Ele nos dá luz e calor todos os dias! ☀️',
      'As estrelas brilham porque são feitas de gases muito quentes que fazem luz! ✨',
      'Existem bilhões e bilhões de estrelas no universo! É impossível contar todas! 🌟',
      'As estrelas têm cores diferentes: algumas são azuis, outras amarelas ou vermelhas! 🎨',
      'As estrelas cadentes não são estrelas de verdade, são pedrinhas espaciais brilhando! 💫',
      'A estrela mais próxima da Terra (depois do Sol) está a 4 anos-luz de distância! 🚀',
    ]
  },
  {
    name: 'Mar',
    emoji: '🌊',
    color: 'from-blue-400 to-cyan-500',
    facts: [
      'O oceano cobre mais de 70% da superfície da Terra! É muuuita água! 🌊',
      'As baleias azuis são os maiores animais que já existiram, maiores que os dinossauros! 🐋',
      'Os corais são animais vivos que formam casas coloridas para muitos peixinhos! 🪸',
      'O peixe-palhaço (como o Nemo) vive dentro de anêmonas do mar sem se machucar! 🐠',
      'Os golfinhos são super inteligentes e conversam entre si com sons especiais! 🐬',
      'O fundo do mar tem montanhas e vales, como na terra, mas debaixo dágua! 🏔️',
    ]
  },
  {
    name: 'Floresta',
    emoji: '🌳',
    color: 'from-green-400 to-emerald-500',
    facts: [
      'A Floresta Amazônica é a maior floresta tropical do mundo! É chamada de pulmão do planeta! 🌳',
      'Nas florestas vivem mais da metade de todas as espécies de animais e plantas do mundo! 🦋',
      'As árvores conversam entre si através de suas raízes debaixo da terra! 🌲',
      'Alguns animais da floresta nunca descem ao chão, vivem sempre nas árvores! 🐒',
      'As florestas produzem oxigênio para respirarmos e limpam o ar que a gente respira! 🍃',
      'Na floresta amazônica chove quase todos os dias! Por isso é tão verde e cheio de vida! ☔',
    ]
  },
  {
    name: 'História do Brasil',
    emoji: '🇧🇷',
    color: 'from-green-500 to-yellow-500',
    facts: [
      'O Brasil foi descoberto por Pedro Álvares Cabral em 22 de abril de 1500! 🇧🇷',
      'Os índios foram os primeiros habitantes do Brasil, muito antes dos portugueses chegarem! 🪶',
      'O nome "Brasil" vem de uma árvore chamada pau-brasil, que tinha madeira vermelha! 🌳',
      'A Princesa Isabel assinou a Lei Áurea em 1888, libertando todos os escravos! ✍️',
      'O Brasil foi um império por muitos anos, com reis e princesas de verdade! 👑',
      'A bandeira do Brasil tem 27 estrelas, uma para cada estado brasileiro! ⭐',
    ]
  },
  {
    name: 'Animais',
    emoji: '🦁',
    color: 'from-orange-400 to-red-500',
    facts: [
      'As girafas têm o pescoço comprido para alcançar as folhas mais altas das árvores! 🦒',
      'Os elefantes nunca esquecem e reconhecem amigos mesmo depois de muitos anos! 🐘',
      'Os gatos passam 70% da vida dormindo! São campeões de soneca! 😺',
      'Os cachorros têm o olfato 100.000 vezes melhor que o dos humanos! 🐕',
      'As borboletas sentem o gosto das coisas com os pés! 🦋',
      'Os pinguins são pássaros, mas não voam! Eles nadam super bem! 🐧',
    ]
  },
  {
    name: 'Cidades Pequenas',
    emoji: '🏘️',
    color: 'from-teal-400 to-cyan-500',
    facts: [
      {
        city: 'Serra da Saudade - MG',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Bandeira_de_Serra_da_Saudade.png',
        population: '815 habitantes',
        age: '62 anos (fundada em 1963)',
        story: 'A MENOR CIDADE DO BRASIL! Fica a 1.200m de altitude na Serra da Canastra. O prefeito conhece todos pelo nome! Todo mundo trabalha junto e a cidade é super unida. Curiosidade: tem mais vacas que pessoas! 🐄'
      },
      {
        city: 'Borá - SP',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Bor%C3%A1.png',
        population: '839 habitantes',
        age: '34 anos (emancipada em 1991)',
        story: 'A 2ª MENOR! Nome vem do tupi "Mborá" = habitante. Curiosidade: a escola tem apenas 80 alunos e todo mundo estuda junto! Famosa pelo café delicioso e quitandas caseiras. Não tem semáforo! 🚦❌'
      },
      {
        city: 'Araguainha - MT',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Bandeira_de_Araguainha.png',
        population: '1.092 habitantes',
        age: '46 anos (fundada em 1979)',
        story: 'Tem a MAIOR CRATERA DE METEORO da América do Sul! 40km de diâmetro! O meteoro caiu há 250 milhões de anos. Cientistas do mundo todo visitam! A cidade vive do turismo científico. 🪐'
      },
      {
        city: 'Anhanguera - GO',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Bandeira_de_Anhanguera.png',
        population: '1.020 habitantes',
        age: '37 anos (fundada em 1988)',
        story: 'Nome indígena significa "espírito velho"! Curiosidade: só tem 3 ruas principais! A padaria é o ponto de encontro da cidade. Todo mundo cultiva horta em casa. Pacata e acolhedora! 🌾'
      },
      {
        city: 'André da Rocha - RS',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_de_Andr%C3%A9_da_Rocha.png',
        population: '1.234 habitantes',
        age: '33 anos (emancipada em 1992)',
        story: 'A "Terra das Cachoeiras"! Tem descendência italiana, fazem festa da uva todo ano! No inverno neva e chega a -5°C! Produzem maçã e pêssego. Curiosidade: tem mais cavalos que carros! 🐴'
      },
      {
        city: 'Nova Castilho - SP',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Bandeira_de_Nova_Castilho.png',
        population: '1.125 habitantes',
        age: '66 anos (fundada em 1959)',
        story: 'Nome homenageia Castilla (Espanha)! Curiosidade: a cidade inteira para no jogo de futebol do domingo! Famosa pela carne de sol e hospitalidade. Tem churrasco comunitário todo mês! 🥩'
      },
      {
        city: 'Ermo - SC',
        flag: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6948130c63a4aed964627876/a8f821bf4_ermo.png',
        population: '2.050 habitantes',
        age: '31 anos (emancipada em 29/12/1993)',
        story: 'Extremo sul de SC! Nome significa "deserto" mas é cheia de vida e natureza! Produz arroz de alta qualidade. Curiosidade: 90% da renda vem da agricultura familiar. Cidade pacata e acolhedora! 🌾'
      },
      {
        city: 'Cedro do Abaeté - MG',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Cedro_do_Abaet%C3%A9.png',
        population: '1.203 habitantes',
        age: '30 anos (fundada em 1995)',
        story: 'Muitas árvores de cedro! Fica no Rio Abaeté. Curiosidade: o artesanato local é feito com madeira de cedro e é vendido em todo Brasil! Famosa pela cerâmica e doces caseiros! 🏺'
      },
      {
        city: 'Oliveira de Fátima - TO',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Bandeira_de_Oliveira_de_F%C3%A1tima.png',
        population: '1.050 habitantes',
        age: '28 anos (emancipada em 1997)',
        story: 'Muito religiosa! Festa de N. Sra. de Fátima reúne a cidade toda! Curiosidade: a igreja é maior que a prefeitura! Produzem gado e soja. Tem procissão todo domingo! ⛪'
      },
      {
        city: 'Miguel Leão - PI',
        flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Bandeira_de_Miguel_Le%C3%A3o.png',
        population: '1.400 habitantes',
        age: '30 anos (fundada em 1995)',
        story: 'Homenagem a político local! Curiosidade: é a maior produtora de mel da região! Também produz castanha de caju. Calor o ano todo (até 40°C)! As crianças nadam no rio depois da aula! 🍯'
      }
    ]
  },
];

export default function DidYouKnow() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentFactIndex(0);
    soundEffects.playClick();
  };

  const nextFact = () => {
    if (selectedCategory) {
      const nextIndex = (currentFactIndex + 1) % selectedCategory.facts.length;
      setCurrentFactIndex(nextIndex);
      soundEffects.playClick();
    }
  };

  const prevFact = () => {
    if (selectedCategory) {
      const prevIndex = (currentFactIndex - 1 + selectedCategory.facts.length) % selectedCategory.facts.length;
      setCurrentFactIndex(prevIndex);
      soundEffects.playClick();
    }
  };

  const backToMenu = () => {
    setSelectedCategory(null);
    setCurrentFactIndex(0);
    soundEffects.playClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4 overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            💡
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Você Sabia?</h1>
          <p className="text-white text-lg font-bold">Aprenda curiosidades incríveis!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="menu"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="grid gap-4"
            >
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectCategory(category)}
                  className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 border-4 border-white shadow-xl cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{category.emoji}</div>
                    <div>
                      <h2 className="text-2xl font-black text-white drop-shadow-lg">
                        {category.name}
                      </h2>
                      <p className="text-white/90 font-semibold">
                        {category.facts.length} curiosidades
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-center mt-4">
                <Link to={createPageUrl('Home')}>
                  <KidsButton color="purple" size="md">
                    <ArrowLeft className="inline mr-2" />
                    Voltar
                  </KidsButton>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fact"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  {selectedCategory.emoji}
                </motion.div>
                <h2 className="text-3xl font-black text-purple-600 mb-2">
                  {selectedCategory.name}
                </h2>
                <div className="flex justify-center gap-2 text-sm text-gray-600">
                  <span className="bg-purple-100 px-3 py-1 rounded-full font-bold">
                    {currentFactIndex + 1} de {selectedCategory.facts.length}
                  </span>
                </div>
              </div>

              <motion.div
                key={currentFactIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-4 border-yellow-200 mb-6"
              >
                {selectedCategory.name === 'Cidades Pequenas' ? (
                  <div className="text-center">
                    <motion.img
                      src={selectedCategory.facts[currentFactIndex].flag}
                      alt={`Bandeira de ${selectedCategory.facts[currentFactIndex].city}`}
                      className="w-56 h-auto mx-auto mb-4 rounded-xl border-4 border-white shadow-2xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <h3 className="text-3xl font-black text-teal-600 mb-3">
                      {selectedCategory.facts[currentFactIndex].city}
                    </h3>
                    <div className="flex justify-center gap-3 mb-4">
                      <div className="bg-teal-100 rounded-xl px-4 py-2">
                        <p className="text-base font-bold text-teal-800">
                          👥 {selectedCategory.facts[currentFactIndex].population}
                        </p>
                      </div>
                      <div className="bg-orange-100 rounded-xl px-4 py-2">
                        <p className="text-base font-bold text-orange-800">
                          🎂 {selectedCategory.facts[currentFactIndex].age}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-800 font-bold leading-relaxed px-2">
                      {selectedCategory.facts[currentFactIndex].story}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl text-gray-800 font-bold leading-relaxed text-center">
                    {selectedCategory.facts[currentFactIndex]}
                  </p>
                )}
              </motion.div>

              <div className="flex justify-center mb-6">
                <KidsButton
                  color="blue"
                  size="lg"
                  onClick={() => {
                    const text = selectedCategory.name === 'Cidades Pequenas' 
                      ? `${selectedCategory.facts[currentFactIndex].city}. ${selectedCategory.facts[currentFactIndex].population}. ${selectedCategory.facts[currentFactIndex].age}. ${selectedCategory.facts[currentFactIndex].story}`
                      : selectedCategory.facts[currentFactIndex];
                    speakText(text);
                  }}
                >
                  <Volume2 className="inline mr-2" />
                  Ouvir
                </KidsButton>
              </div>

              <div className="flex justify-between gap-4 mb-6">
                <KidsButton color="purple" size="lg" onClick={prevFact}>
                  <ChevronLeft className="inline" />
                  Anterior
                </KidsButton>
                <KidsButton color="purple" size="lg" onClick={nextFact}>
                  Próxima
                  <ChevronRight className="inline" />
                </KidsButton>
              </div>

              <div className="flex justify-center">
                <KidsButton color="orange" size="md" onClick={backToMenu}>
                  <ArrowLeft className="inline mr-2" />
                  Voltar ao Menu
                </KidsButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}