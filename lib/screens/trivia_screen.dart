import 'package:flutter/material.dart';

class TriviaScreen extends StatefulWidget {
  const TriviaScreen({super.key});

  @override
  State<TriviaScreen> createState() => _TriviaScreenState();
}

class _TriviaScreenState extends State<TriviaScreen> {
  int index = 0;
  int score = 0;
  int selected = -1;

  final List<Map<String, dynamic>> questions = [
    {'q': 'Qual é o maior planeta do sistema solar?', 'a': ['Terra', 'Júpiter', 'Marte'], 'c': 1},
    {'q': 'Onde os peixes vivem?', 'a': ['No ar', 'Na água', 'Na terra'], 'c': 1},
    {'q': 'Qual animal faz miau?', 'a': ['Cachorro', 'Gato', 'Vaca'], 'c': 1},
    {'q': 'O sol é uma…', 'a': ['Lua', 'Estrela', 'Planeta'], 'c': 1},
    {'q': 'Qual animal vive no mar?', 'a': ['Baleia', 'Galinha', 'Leão'], 'c': 0},
    {'q': 'Qual planeta é vermelho?', 'a': ['Marte', 'Vênus', 'Netuno'], 'c': 0},
    {'q': 'Qual animal tem tromba?', 'a': ['Elefante', 'Cavalo', 'Gato'], 'c': 0},
    {'q': 'Onde vivem os pássaros?', 'a': ['Na água', 'No céu', 'No chão'], 'c': 1},
    {'q': 'Qual é o nosso planeta?', 'a': ['Terra', 'Saturno', 'Lua'], 'c': 0},
    {'q': 'O que brilha à noite?', 'a': ['Sol', 'Estrelas', 'Árvore'], 'c': 1},
    {'q': 'Qual animal é rei da selva?', 'a': ['Leão', 'Cachorro', 'Peixe'], 'c': 0},
    {'q': 'Onde cresce a árvore?', 'a': ['Na terra', 'No mar', 'No céu'], 'c': 0},
    {'q': 'Qual animal vive na fazenda?', 'a': ['Vaca', 'Tubarão', 'Golfinho'], 'c': 0},
    {'q': 'Qual planeta tem anéis?', 'a': ['Saturno', 'Marte', 'Terra'], 'c': 0},
    {'q': 'Quem vive no polo sul?', 'a': ['Leão', 'Pinguim', 'Macaco'], 'c': 1},
    {'q': 'O que precisamos para respirar?', 'a': ['Água', 'Ar', 'Terra'], 'c': 1},
    {'q': 'Qual animal late?', 'a': ['Gato', 'Cachorro', 'Pato'], 'c': 1},
    {'q': 'Onde vivem os golfinhos?', 'a': ['No rio', 'No mar', 'Na floresta'], 'c': 1},
    {'q': 'Qual astro ilumina o dia?', 'a': ['Lua', 'Sol', 'Estrela'], 'c': 1},
    {'q': 'Qual animal gosta de banana?', 'a': ['Macaco', 'Cachorro', 'Peixe'], 'c': 0},
    {'q': 'Qual planeta é o mais quente?', 'a': ['Vênus', 'Marte', 'Netuno'], 'c': 0},
    {'q': 'Onde vivem os ursos polares?', 'a': ['Deserto', 'Polo Norte', 'Selva'], 'c': 1},
    {'q': 'O que cai do céu quando chove?', 'a': ['Areia', 'Água', 'Pedra'], 'c': 1},
    {'q': 'Qual animal voa?', 'a': ['Pássaro', 'Cobra', 'Peixe'], 'c': 0},
    {'q': 'Qual é o satélite da Terra?', 'a': ['Sol', 'Lua', 'Marte'], 'c': 1},
    {'q': 'Onde vivem os leões?', 'a': ['Oceano', 'Savana', 'Gelo'], 'c': 1},
    {'q': 'O que vemos no céu à noite?', 'a': ['Nuvens', 'Estrelas', 'Árvores'], 'c': 1},
    {'q': 'Qual animal tem casco?', 'a': ['Tartaruga', 'Gato', 'Pássaro'], 'c': 0},
    {'q': 'Qual planeta é azul?', 'a': ['Terra', 'Mercúrio', 'Marte'], 'c': 0},
    {'q': 'O que usamos para ouvir?', 'a': ['Olhos', 'Ouvidos', 'Nariz'], 'c': 1},
  ];

  void answer(int i) {
    if (i == questions[index]['c']) score++;
    setState(() => selected = i);

    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        selected = -1;
        index++;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if (index >= questions.length) {
      return Scaffold(
        appBar: AppBar(title: const Text('Você Sabia?')),
        body: Center(
          child: Text(
            'Muito bem!\nPontuação: $score / ${questions.length}',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 24),
          ),
        ),
      );
    }

    final q = questions[index];

    return Scaffold(
      appBar: AppBar(title: const Text('Você Sabia?')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              q['q'],
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            ...List.generate(3, (i) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: ElevatedButton(
                  onPressed: selected == -1 ? () => answer(i) : null,
                  child: Text(q['a'][i]),
                ),
              );
            }),

            const SizedBox(height: 20),
            Text('Pergunta ${index + 1} de ${questions.length}'),
          ],
        ),
      ),
    );
  }
}
