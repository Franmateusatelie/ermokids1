import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';

class MemoryGameScreen extends StatefulWidget {
  const MemoryGameScreen({super.key});

  @override
  State<MemoryGameScreen> createState() => _MemoryGameScreenState();
}

class _MemoryGameScreenState extends State<MemoryGameScreen> {
  final List<String> _emojis = [
    '🐶', '🐱', '🐼', '🦁', '🐸', '🐵'
  ];

  late List<String> _cards;
  List<int> _selected = [];
  List<bool> _revealed = [];

  @override
  void initState() {
    super.initState();
    _startGame();
  }

  void _startGame() {
    _cards = [..._emojis, ..._emojis]..shuffle(Random());
    _revealed = List.generate(_cards.length, (_) => false);
    _selected.clear();
    setState(() {});
  }

  void _onTap(int index) {
    if (_revealed[index] || _selected.length == 2) return;

    setState(() {
      _selected.add(index);
    });

    if (_selected.length == 2) {
      final a = _selected[0];
      final b = _selected[1];

      if (_cards[a] == _cards[b]) {
        setState(() {
          _revealed[a] = true;
          _revealed[b] = true;
        });
        _selected.clear();

        if (_revealed.every((e) => e)) {
          _showWin();
        }
      } else {
        Timer(const Duration(milliseconds: 800), () {
          _selected.clear();
          setState(() {});
        });
      }
    }
  }

  void _showWin() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('🎉 Parabéns!'),
        content: const Text('Você encontrou todos os animais!'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _startGame();
            },
            child: const Text('Jogar novamente'),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🧠 Jogo da Memória'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.builder(
          itemCount: _cards.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
          ),
          itemBuilder: (context, index) {
            final isVisible =
                _revealed[index] || _selected.contains(index);

            return GestureDetector(
              onTap: () => _onTap(index),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                decoration: BoxDecoration(
                  color: isVisible ? Colors.white : Colors.blueAccent,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 4,
                    )
                  ],
                ),
                child: Center(
                  child: Text(
                    isVisible ? _cards[index] : '❓',
                    style: const TextStyle(fontSize: 40),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
