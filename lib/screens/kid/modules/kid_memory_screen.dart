import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';

class KidMemoryScreen extends StatefulWidget {
  const KidMemoryScreen({super.key});

  @override
  State<KidMemoryScreen> createState() => _KidMemoryScreenState();
}

class _KidMemoryScreenState extends State<KidMemoryScreen> {
  // Pode trocar/expandir depois (mantive leve para APK)
  final List<String> _animals = ['🐶', '🐱', '🐼', '🦁', '🐸', '🐵', '🦊', '🐰'];
  final List<Color> _cardColors = const [
    Color(0xFFFFCDD2),
    Color(0xFFBBDEFB),
    Color(0xFFC8E6C9),
    Color(0xFFFFF9C4),
    Color(0xFFD1C4E9),
    Color(0xFFFFCCBC),
  ];

  late List<_CardItem> _cards;
  int? _first;
  int? _second;
  bool _lock = false;

  int _moves = 0;
  int _matches = 0;

  @override
  void initState() {
    super.initState();
    _newGame();
  }

  void _newGame() {
    final rnd = Random();
    final selected = _animals.take(6).toList(); // 6 pares = 12 cartas (bom p/ 3–10)
    final pair = [...selected, ...selected]..shuffle(rnd);

    _cards = List.generate(pair.length, (i) {
      return _CardItem(
        id: pair[i],
        bg: _cardColors[i % _cardColors.length],
      );
    });

    _first = null;
    _second = null;
    _lock = false;
    _moves = 0;
    _matches = 0;

    setState(() {});
  }

  void _tap(int index) {
    if (_lock) return;
    final c = _cards[index];
    if (c.matched || c.revealed) return;

    setState(() => c.revealed = true);

    if (_first == null) {
      _first = index;
      return;
    }

    if (_second == null) {
      _second = index;
      _moves++;

      final a = _cards[_first!];
      final b = _cards[_second!];

      if (a.id == b.id) {
        // Acertou
        setState(() {
          a.matched = true;
          b.matched = true;
          _matches++;
        });

        _resetPick();

        if (_matches == 6) {
          _showWin();
        }
      } else {
        // Errou
        _lock = true;
        Timer(const Duration(milliseconds: 700), () {
          setState(() {
            a.revealed = false;
            b.revealed = false;
          });
          _resetPick();
          _lock = false;
        });
      }
    }
  }

  void _resetPick() {
    _first = null;
    _second = null;
  }

  void _showWin() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        title: const Text('🎉 Parabéns!'),
        content: Text('Você completou o jogo!\nJogadas: $_moves'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _newGame();
            },
            child: const Text('Jogar novamente'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Voltar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🧠 Jogo da Memória'),
        actions: [
          IconButton(
            tooltip: 'Recomeçar',
            onPressed: _newGame,
            icon: const Icon(Icons.refresh_rounded),
          )
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF9C4), Color(0xFFE1F5FE)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      const Text('⭐', style: TextStyle(fontSize: 20)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Encontre os pares iguais!',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                      ),
                      Chip(
                        label: Text('Jogadas: $_moves'),
                        backgroundColor: const Color(0xFFFFD54F),
                      )
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: GridView.builder(
                  itemCount: _cards.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                  ),
                  itemBuilder: (context, i) {
                    final card = _cards[i];
                    return _MemoryCard(
                      item: card,
                      onTap: () => _tap(i),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}

class _CardItem {
  final String id;
  final Color bg;
  bool revealed;
  bool matched;

  _CardItem({
    required this.id,
    required this.bg,
    this.revealed = false,
    this.matched = false,
  });
}

class _MemoryCard extends StatelessWidget {
  final _CardItem item;
  final VoidCallback onTap;

  const _MemoryCard({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final faceUp = item.revealed || item.matched;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: LinearGradient(
            colors: faceUp
                ? [item.bg, Colors.white]
                : [const Color(0xFF4FC3F7), const Color(0xFF81D4FA)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: const [
            BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
          ],
        ),
        child: Center(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            child: Text(
              faceUp ? item.id : '❓',
              key: ValueKey(faceUp),
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.w900,
                color: faceUp ? Colors.black : Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

