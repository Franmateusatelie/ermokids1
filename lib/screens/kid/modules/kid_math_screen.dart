import 'dart:math';
import 'package:flutter/material.dart';

class KidMathScreen extends StatefulWidget {
  const KidMathScreen({super.key});

  @override
  State<KidMathScreen> createState() => _KidMathScreenState();
}

class _KidMathScreenState extends State<KidMathScreen> {
  int level = 1;
  int score = 0;

  late int a;
  late int b;
  late int correctAnswer;

  final TextEditingController controller = TextEditingController();
  final Random random = Random();

  @override
  void initState() {
    super.initState();
    _generateQuestion();
  }

  void _generateQuestion() {
    final max = _maxByLevel(level);
    a = random.nextInt(max) + 1;
    b = random.nextInt(max) + 1;
    correctAnswer = a + b;
    controller.clear();
    setState(() {});
  }

  int _maxByLevel(int level) {
    if (level <= 3) return 5;
    if (level <= 6) return 10;
    if (level <= 9) return 20;
    return 50;
  }

  void _checkAnswer() {
    final answer = int.tryParse(controller.text);
    if (answer == correctAnswer) {
      score++;
      if (score % 5 == 0) level++;
      _showFeedback(true);
    } else {
      _showFeedback(false);
    }
  }

  void _showFeedback(bool correct) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(correct ? '🎉 Muito bem!' : '😕 Tente novamente'),
        content: Text(
          correct
              ? 'Você acertou!\nNível: $level'
              : 'Resposta correta: $correctAnswer',
          textAlign: TextAlign.center,
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _generateQuestion();
            },
            child: const Text('Continuar'),
          )
        ],
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF8E1),
      appBar: AppBar(
        title: const Text('🧮 Matemática'),
      ),
      body: Center(
        child: Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Nível $level',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),

                Text(
                  '$a + $b = ?',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 20),

                TextField(
                  controller: controller,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    hintText: 'Digite a resposta',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                ElevatedButton(
                  onPressed: _checkAnswer,
                  child: const Text('Responder'),
                ),

                const SizedBox(height: 20),

                Text(
                  'Pontuação: $score',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

