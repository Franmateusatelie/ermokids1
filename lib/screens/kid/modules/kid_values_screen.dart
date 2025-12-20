import 'dart:math';
import 'package:flutter/material.dart';

class KidValuesScreen extends StatefulWidget {
  const KidValuesScreen({super.key});

  @override
  State<KidValuesScreen> createState() => _KidValuesScreenState();
}

class _KidValuesScreenState extends State<KidValuesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF8E1),
      appBar: AppBar(
        title: const Text('🌟 Valores e Natureza'),
        bottom: TabBar(
          controller: _tab,
          tabs: const [
            Tab(text: '🌱 Ambiente'),
            Tab(text: '🤝 Respeito'),
            Tab(text: '🐾 Animais'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tab,
        children: const [
          _QuizPage(
            title: '🌱 Cuidando do Meio Ambiente',
            intro: 'Vamos aprender a cuidar do planeta!',
            questions: [
              _Q('Jogar lixo no chão é certo.', false),
              _Q('Economizar água é importante.', true),
              _Q('Plantar árvores ajuda a natureza.', true),
              _Q('Deixar a torneira aberta sem usar é bom.', false),
              _Q('Reciclar pode ajudar o mundo.', true),
              _Q('Apagar a luz ao sair do quarto é certo.', true),
            ],
          ),
          _QuizPage(
            title: '🤝 Respeito às Pessoas',
            intro: 'Ser gentil deixa todo mundo feliz!',
            questions: [
              _Q('Falar “por favor” e “obrigado” é bom.', true),
              _Q('Zoar um colega é uma brincadeira legal.', false),
              _Q('Ouvir quando alguém fala é respeitoso.', true),
              _Q('Empurrar para passar na frente é certo.', false),
              _Q('Ajudar alguém que caiu é bom.', true),
              _Q('Pedir desculpas quando errar é importante.', true),
            ],
          ),
          _QuizPage(
            title: '🐾 Cuidado com os Animais',
            intro: 'Animais merecem carinho e respeito!',
            questions: [
              _Q('Maltratar animais é errado.', true),
              _Q('Dar água e comida para o pet é importante.', true),
              _Q('Puxar o rabo do animal é engraçado.', false),
              _Q('Levar o pet no veterinário ajuda ele.', true),
              _Q('Assustar animais na rua é correto.', false),
              _Q('Dar carinho com cuidado é bom.', true),
            ],
          ),
        ],
      ),
    );
  }
}

class _QuizPage extends StatefulWidget {
  final String title;
  final String intro;
  final List<_Q> questions;

  const _QuizPage({
    required this.title,
    required this.intro,
    required this.questions,
  });

  @override
  State<_QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<_QuizPage> {
  final Random _rnd = Random();
  late List<_Q> _qs;

  int index = 0;
  int points = 0;
  bool finished = false;

  @override
  void initState() {
    super.initState();
    _qs = List<_Q>.from(widget.questions)..shuffle(_rnd);
  }

  void _answer(bool value) {
    final q = _qs[index];
    final correct = (value == q.answer);

    setState(() {
      if (correct) points++;
      if (index < _qs.length - 1) {
        index++;
      } else {
        finished = true;
      }
    });

    _showFeedback(correct, q);
  }

  void _restart() {
    setState(() {
      _qs = List<_Q>.from(widget.questions)..shuffle(_rnd);
      index = 0;
      points = 0;
      finished = false;
    });
  }

  void _showFeedback(bool correct, _Q q) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(correct ? '🎉 Certo!' : '😕 Ops!'),
        content: Text(
          correct
              ? 'Muito bem! ✅'
              : 'Na verdade, o certo é: ${q.answer ? "CERTO ✅" : "ERRADO ❌"}',
          textAlign: TextAlign.center,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Continuar'),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFFFF9C4), Color(0xFFE1F5FE)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  children: [
                    Text(
                      widget.title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.intro,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            if (!finished) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    children: [
                      Text(
                        'Pergunta ${index + 1} de ${_qs.length}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _qs[index].text,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _BigButton(
                    label: '✅ CERTO',
                    color: const Color(0xFF4CAF50),
                    onTap: () => _answer(true),
                  ),
                  const SizedBox(width: 12),
                  _BigButton(
                    label: '❌ ERRADO',
                    color: const Color(0xFFF44336),
                    onTap: () => _answer(false),
                  ),
                ],
              ),

              const SizedBox(height: 14),
              Chip(
                label: Text('⭐ Pontos: $points'),
                backgroundColor: const Color(0xFFFFD54F),
              ),
            ] else ...[
              const SizedBox(height: 10),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    children: [
                      const Text(
                        '🏆 Muito bem!',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Você fez $points de ${_qs.length} pontos!',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        onPressed: _restart,
                        child: const Text('Jogar de novo'),
                      ),
                    ],
                  ),
                ),
              )
            ],
          ],
        ),
      ),
    );
  }
}

class _BigButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _BigButton({
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        onPressed: onTap,
        child: Text(label),
      ),
    );
  }
}

class _Q {
  final String text;
  final bool answer;
  const _Q(this.text, this.answer);
}

