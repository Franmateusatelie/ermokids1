import 'package:flutter/material.dart';

class WordsScreen extends StatefulWidget {
  const WordsScreen({super.key});

  @override
  State<WordsScreen> createState() => _WordsScreenState();
}

class _WordsScreenState extends State<WordsScreen> {
  int index = 0;
  int score = 0;
  int selected = -1;

  final List<Map<String, dynamic>> words = [
    {'w': 'C_CHORRO', 'o': ['A', 'O', 'U'], 'c': 1},
    {'w': 'G_TO', 'o': ['A', 'O', 'E'], 'c': 1},
    {'w': 'C_SA', 'o': ['A', 'O', 'E'], 'c': 0},
    {'w': 'B_LA', 'o': ['O', 'E', 'A'], 'c': 2},
    {'w': 'S_L', 'o': ['O', 'A', 'E'], 'c': 0},
    {'w': 'L_VRO', 'o': ['I', 'E', 'A'], 'c': 0},
    {'w': 'B_CICLETA', 'o': ['I', 'E', 'A'], 'c': 0},
    {'w': 'P_TO', 'o': ['A', 'O', 'E'], 'c': 1},
    {'w': 'S_PATO', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'F_CE', 'o': ['A', 'O', 'E'], 'c': 2},

    {'w': 'M_R', 'o': ['A', 'E', 'O'], 'c': 2},
    {'w': 'C_LO', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'L_NA', 'o': ['U', 'I', 'A'], 'c': 1},
    {'w': 'B_LA', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'C_RRO', 'o': ['A', 'E', 'A'], 'c': 0},
    {'w': 'T_BA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'P_TA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'C_MIDA', 'o': ['O', 'A', 'E'], 'c': 0},
    {'w': 'M_LA', 'o': ['E', 'A', 'I'], 'c': 1},
    {'w': 'F_LOR', 'o': ['A', 'E', 'O'], 'c': 0},

    {'w': 'S_L', 'o': ['O', 'A', 'E'], 'c': 0},
    {'w': 'B_RCO', 'o': ['A', 'O', 'E'], 'c': 1},
    {'w': 'P_XE', 'o': ['E', 'I', 'O'], 'c': 1},
    {'w': 'C_RRO', 'o': ['A', 'E', 'I'], 'c': 0},
    {'w': 'R_TA', 'o': ['A', 'E', 'I'], 'c': 0},
    {'w': 'L_PIS', 'o': ['A', 'E', 'I'], 'c': 2},
    {'w': 'C_O', 'o': ['A', 'E', 'O'], 'c': 2},
    {'w': 'N_VE', 'o': ['U', 'A', 'I'], 'c': 1},
    {'w': 'C_U', 'o': ['A', 'O', 'U'], 'c': 2},
    {'w': 'P_LA', 'o': ['A', 'O', 'E'], 'c': 0},

    {'w': 'R_SA', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'B_LA', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'S_PA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'C_MPO', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'T_RRA', 'o': ['E', 'A', 'O'], 'c': 1},
    {'w': 'P_NEL', 'o': ['A', 'E', 'I'], 'c': 1},
    {'w': 'S_P', 'o': ['O', 'A', 'E'], 'c': 0},
    {'w': 'C_VALO', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'B_LA', 'o': ['A', 'E', 'O'], 'c': 0},
    {'w': 'M_NTA', 'o': ['O', 'A', 'E'], 'c': 1},

    {'w': 'S_LA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'P_LA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'L_UA', 'o': ['U', 'A', 'E'], 'c': 0},
    {'w': 'N_VEM', 'o': ['U', 'A', 'E'], 'c': 1},
    {'w': 'E_TRELA', 'o': ['S', 'C', 'T'], 'c': 0},
    {'w': 'F_GUETE', 'o': ['O', 'A', 'E'], 'c': 0},
    {'w': 'G_LAXIA', 'o': ['A', 'O', 'E'], 'c': 0},
    {'w': 'M_R', 'o': ['A', 'E', 'O'], 'c': 2},
    {'w': 'P_RTA', 'o': ['O', 'A', 'E'], 'c': 1},
    {'w': 'J_GO', 'o': ['O', 'A', 'E'], 'c': 0},
  ];

  void answer(int i) {
    if (i == words[index]['c']) score++;

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
    if (index >= words.length) {
      return Scaffold(
        appBar: AppBar(title: const Text('Completar Palavras')),
        body: Center(
          child: Text(
            'Parabéns!\nPontuação: $score / ${words.length}',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 24),
          ),
        ),
      );
    }

    final w = words[index];

    return Scaffold(
      appBar: AppBar(title: const Text('Completar Palavras')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            w['w'],
            style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          for (int i = 0; i < 3; i++)
            ElevatedButton(
              onPressed: selected == -1 ? () => answer(i) : null,
              child: Text(w['o'][i]),
            ),
          const SizedBox(height: 20),
          Text('Palavra ${index + 1} de ${words.length}'),
        ],
      ),
    );
  }
}
