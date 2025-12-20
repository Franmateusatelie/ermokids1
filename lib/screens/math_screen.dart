import 'package:flutter/material.dart';
import 'dart:math';

class MathScreen extends StatefulWidget {
  const MathScreen({super.key});

  @override
  State<MathScreen> createState() => _MathScreenState();
}

class _MathScreenState extends State<MathScreen> {
  int index = 0;
  int score = 0;
  int selected = -1;

  final List<Map<String, dynamic>> questions = [
    {'q': '2 + 3 = ?', 'a': [4, 5, 6], 'c': 1},
    {'q': '5 + 4 = ?', 'a': [9, 8, 7], 'c': 0},
    {'q': '6 + 2 = ?', 'a': [7, 8, 9], 'c': 1},
    {'q': '10 - 4 = ?', 'a': [5, 6, 7], 'c': 1},
    {'q': '9 - 3 = ?', 'a': [5, 6, 7], 'c': 1},
    {'q': '8 - 5 = ?', 'a': [2, 3, 4], 'c': 1},
    {'q': '2 x 2 = ?', 'a': [2, 3, 4], 'c': 2},
    {'q': '3 x 3 = ?', 'a': [6, 8, 9], 'c': 2},
    {'q': '4 x 2 = ?', 'a': [6, 8, 10], 'c': 1},
    {'q': '5 + 5 = ?', 'a': [9, 10, 11], 'c': 1},

    {'q': '7 + 6 = ?', 'a': [12, 13, 14], 'c': 1},
    {'q': '12 - 7 = ?', 'a': [4, 5, 6], 'c': 1},
    {'q': '6 x 3 = ?', 'a': [18, 16, 20], 'c': 0},
    {'q': '9 + 8 = ?', 'a': [16, 17, 18], 'c': 1},
    {'q': '15 - 5 = ?', 'a': [9, 10, 11], 'c': 1},
    {'q': '4 x 4 = ?', 'a': [12, 16, 20], 'c': 1},
    {'q': '20 - 10 = ?', 'a': [9, 10, 11], 'c': 1},
    {'q': '7 x 2 = ?', 'a': [12, 14, 16], 'c': 1},
    {'q': '3 + 9 = ?', 'a': [11, 12, 13], 'c': 1},
    {'q': '18 - 9 = ?', 'a': [8, 9, 10], 'c': 1},

    {'q': '6 + 7 = ?', 'a': [12, 13, 14], 'c': 1},
    {'q': '10 + 10 = ?', 'a': [18, 20, 22], 'c': 1},
    {'q': '5 x 3 = ?', 'a': [15, 12, 10], 'c': 0},
    {'q': '14 - 6 = ?', 'a': [6, 8, 10], 'c': 1},
    {'q': '8 x 2 = ?', 'a': [14, 16, 18], 'c': 1},
    {'q': '11 + 4 = ?', 'a': [14, 15, 16], 'c': 1},
    {'q': '16 - 8 = ?', 'a': [6, 8, 10], 'c': 1},
    {'q': '9 x 1 = ?', 'a': [8, 9, 10], 'c': 1},
    {'q': '2 + 9 = ?', 'a': [10, 11, 12], 'c': 1},
    {'q': '13 - 3 = ?', 'a': [9, 10, 11], 'c': 1},

    {'q': '4 + 6 = ?', 'a': [9, 10, 11], 'c': 1},
    {'q': '6 x 2 = ?', 'a': [10, 12, 14], 'c': 1},
    {'q': '15 - 7 = ?', 'a': [7, 8, 9], 'c': 1},
    {'q': '3 x 4 = ?', 'a': [10, 12, 14], 'c': 1},
    {'q': '12 + 3 = ?', 'a': [14, 15, 16], 'c': 1},
    {'q': '18 - 6 = ?', 'a': [10, 12, 14], 'c': 1},
    {'q': '7 + 7 = ?', 'a': [12, 14, 16], 'c': 1},
    {'q': '5 x 2 = ?', 'a': [8, 10, 12], 'c': 1},
    {'q': '20 - 5 = ?', 'a': [14, 15, 16], 'c': 1},
    {'q': '9 + 1 = ?', 'a': [9, 10, 11], 'c': 1},

    {'q': '6 + 4 = ?', 'a': [9, 10, 11], 'c': 1},
    {'q': '14 - 4 = ?', 'a': [9, 10, 11], 'c': 1},
    {'q': '8 x 1 = ?', 'a': [7, 8, 9], 'c': 1},
    {'q': '3 + 5 = ?', 'a': [7, 8, 9], 'c': 1},
    {'q': '10 - 2 = ?', 'a': [7, 8, 9], 'c': 1},
  ];

  void answer(int i) {
    if (i == questions[index]['c']) score++;
    setState(() {
      selected = i;
    });

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
        appBar: AppBar(title: const Text('Matemática')),
        body: Center(
          child: Text(
            'Parabéns!\nPontuação: $score / ${questions.length}',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 24),
          ),
        ),
      );
    }

    final q = questions[index];

    return Scaffold(
      appBar: AppBar(title: const Text('Matemática')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            q['q'],
            style: const TextStyle(fontSize: 28),
          ),
          const SizedBox(height: 20),
          for (int i = 0; i < 3; i++)
            ElevatedButton(
              onPressed: selected == -1 ? () => answer(i) : null,
              child: Text(q['a'][i].toString()),
            ),
          const SizedBox(height: 20),
          Text('Questão ${index + 1} de ${questions.length}'),
        ],
      ),
    );
  }
}
