import 'dart:math';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class PuzzleScreen extends StatefulWidget {
  const PuzzleScreen({super.key});

  @override
  State<PuzzleScreen> createState() => _PuzzleScreenState();
}

class _PuzzleScreenState extends State<PuzzleScreen> {
  final List<_PuzzleItem> puzzles = List.generate(20, (i) {
    final idx = (i + 1).toString().padLeft(2, '0');
    return _PuzzleItem(
      title: _titles[i],
      assetPath: 'assets/puzzles/p$idx.png',
      // fallback theme
      theme: _themes[i],
    );
  });

  int selectedPuzzle = 0;
  int gridSize = 3; // 3x3 (bom para 5–12)
  late List<int> tiles; // 0 = vazio
  int moves = 0;
  bool won = false;

  @override
  void initState() {
    super.initState();
    _newGame();
  }

  void _newGame() {
    final n = gridSize * gridSize;
    tiles = List<int>.generate(n, (i) => i); // resolvido
    _shuffleSolvable();
    moves = 0;
    won = false;
    setState(() {});
  }

  void _shuffleSolvable() {
    final rnd = Random();
    final n = gridSize * gridSize;

    // embaralha até ficar solucionável e não-resolvido
    while (true) {
      final list = List<int>.generate(n, (i) => i);
      // shuffle
      for (int i = n - 1; i > 0; i--) {
        final j = rnd.nextInt(i + 1);
        final tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }

      if (_isSolvable(list, gridSize) && !_isSolved(list)) {
        tiles = list;
        return;
      }
    }
  }

  bool _isSolved(List<int> t) {
    for (int i = 0; i < t.length; i++) {
      if (t[i] != i) return false;
    }
    return true;
  }

  bool _isSolvable(List<int> arr, int size) {
    // conta inversões (ignorando 0)
    int inv = 0;
    for (int i = 0; i < arr.length; i++) {
      for (int j = i + 1; j < arr.length; j++) {
        if (arr[i] != 0 && arr[j] != 0 && arr[i] > arr[j]) inv++;
      }
    }

    if (size.isOdd) {
      return inv.isEven;
    } else {
      // linha do vazio a partir de baixo (1..size)
      final blankIndex = arr.indexOf(0);
      final blankRowFromTop = (blankIndex ~/ size) + 1;
      final blankRowFromBottom = size - blankRowFromTop + 1;

      if (blankRowFromBottom.isOdd) {
        return inv.isEven;
      } else {
        return inv.isOdd;
      }
    }
  }

  void _tapTile(int index) {
    if (won) return;

    final emptyIndex = tiles.indexOf(0);
    final r1 = index ~/ gridSize;
    final c1 = index % gridSize;
    final r2 = emptyIndex ~/ gridSize;
    final c2 = emptyIndex % gridSize;

    final isAdjacent = (r1 == r2 && (c1 - c2).abs() == 1) ||
        (c1 == c2 && (r1 - r2).abs() == 1);

    if (!isAdjacent) return;

    setState(() {
      final tmp = tiles[index];
      tiles[index] = 0;
      tiles[emptyIndex] = tmp;
      moves++;

      if (_isSolved(tiles)) {
        won = true;
        _showWinDialog();
      }
    });
  }

  void _showWinDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Parabéns! 🎉'),
        content: Text('Você completou em $moves movimentos!'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // próximo puzzle
              setState(() {
                selectedPuzzle = (selectedPuzzle + 1) % puzzles.length;
              });
              _newGame();
            },
            child: const Text('Próximo'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _newGame();
            },
            child: const Text('Jogar de novo'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final item = puzzles[selectedPuzzle];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quebra Cabeça'),
        actions: [
          IconButton(
            tooltip: 'Reiniciar',
            onPressed: _newGame,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: Column(
        children: [
          const SizedBox(height: 8),

          // Seletor de puzzle (20 opções)
          SizedBox(
            height: 56,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: puzzles.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final active = i == selectedPuzzle;
                return OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    backgroundColor: active ? Colors.white : null,
                    foregroundColor: active ? Colors.black : null,
                  ),
                  onPressed: () {
                    setState(() => selectedPuzzle = i);
                    _newGame();
                  },
                  child: Text(puzzles[i].short),
                );
              },
            ),
          ),

          const SizedBox(height: 8),

          // tamanho do grid
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Dificuldade:  '),
              ChoiceChip(
                label: const Text('3x3'),
                selected: gridSize == 3,
                onSelected: (_) {
                  setState(() => gridSize = 3);
                  _newGame();
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('4x4'),
                selected: gridSize == 4,
                onSelected: (_) {
                  setState(() => gridSize = 4);
                  _newGame();
                },
              ),
              const SizedBox(width: 14),
              Text('Movimentos: $moves'),
            ],
          ),

          const SizedBox(height: 10),

          Expanded(
            child: Center(
              child: AspectRatio(
                aspectRatio: 1,
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: _PuzzleBoard(
                    gridSize: gridSize,
                    tiles: tiles,
                    onTapIndex: _tapTile,
                    assetPath: item.assetPath,
                    fallbackTheme: item.theme,
                  ),
                ),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Text(
              item.title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

class _PuzzleBoard extends StatelessWidget {
  final int gridSize;
  final List<int> tiles;
  final void Function(int index) onTapIndex;
  final String assetPath;
  final _ThemePack fallbackTheme;

  const _PuzzleBoard({
    required this.gridSize,
    required this.tiles,
    required this.onTapIndex,
    required this.assetPath,
    required this.fallbackTheme,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: LayoutBuilder(
        builder: (context, c) {
          final size = min(c.maxWidth, c.maxHeight);

          return Stack(
            children: [
              // Fundo: imagem (se existir) ou fallback desenhado
              Positioned.fill(
                child: Image.asset(
                  assetPath,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => CustomPaint(
                    painter: _FallbackPainter(fallbackTheme),
                  ),
                ),
              ),

              // grade + tiles
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.18),
                ),
              ),

              GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: gridSize,
                  crossAxisSpacing: 2,
                  mainAxisSpacing: 2,
                ),
                itemCount: tiles.length,
                itemBuilder: (context, index) {
                  final tile = tiles[index];
                  final isEmpty = tile == 0;

                  if (isEmpty) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.25),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    );
                  }

                  // recorta a imagem por fração do tile
                  final r = tile ~/ gridSize;
                  final c2 = tile % gridSize;
                  final rect = Rect.fromLTWH(
                    c2 / gridSize,
                    r / gridSize,
                    1 / gridSize,
                    1 / gridSize,
                  );

                  return InkWell(
                    onTap: () => onTapIndex(index),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          // tile com a imagem/fallback
                          ShaderMask(
                            shaderCallback: (bounds) {
                              return const LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [Colors.white, Colors.white],
                              ).createShader(bounds);
                            },
                            blendMode: BlendMode.srcIn,
                            child: _FractionalImage(
                              assetPath: assetPath,
                              rect: rect,
                              fallbackTheme: fallbackTheme,
                            ),
                          ),

                          // borda
                          Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.white.withOpacity(0.6),
                                width: 1,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),

              // grade externa
              Positioned.fill(
                child: IgnorePointer(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white.withOpacity(0.35), width: 2),
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _FractionalImage extends StatelessWidget {
  final String assetPath;
  final Rect rect; // frações (0..1)
  final _ThemePack fallbackTheme;

  const _FractionalImage({
    required this.assetPath,
    required this.rect,
    required this.fallbackTheme,
  });

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      assetPath,
      fit: BoxFit.cover,
      alignment: Alignment(-1 + rect.left * 2, -1 + rect.top * 2),
      errorBuilder: (_, __, ___) => CustomPaint(
        painter: _FallbackPainter(fallbackTheme),
        child: const SizedBox.expand(),
      ),
    );
  }
}

class _FallbackPainter extends CustomPainter {
  final _ThemePack theme;
  _FallbackPainter(this.theme);

  @override
  void paint(Canvas canvas, Size size) {
    final bg = Paint()
      ..shader = ui.Gradient.linear(
        Offset(0, 0),
        Offset(size.width, size.height),
        theme.bg,
      );
    canvas.drawRect(Offset.zero & size, bg);

    final rnd = Random(theme.seed);
    final starPaint = Paint()..color = theme.fg.withOpacity(0.85);

    // estrelas/bolhas/folhas simples
    for (int i = 0; i < 30; i++) {
      final x = rnd.nextDouble() * size.width;
      final y = rnd.nextDouble() * size.height;
      final r = 3 + rnd.nextDouble() * 10;
      canvas.drawCircle(Offset(x, y), r, starPaint..color = theme.fg.withOpacity(0.25 + rnd.nextDouble() * 0.5));
    }

    // arco/rastro
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10
      ..color = theme.fg.withOpacity(0.35);
    final path = Path()
      ..moveTo(0, size.height * 0.75)
      ..quadraticBezierTo(size.width * 0.5, size.height * 0.45, size.width, size.height * 0.6);
    canvas.drawPath(path, p);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _PuzzleItem {
  final String title;
  final String assetPath;
  final _ThemePack theme;

  _PuzzleItem({required this.title, required this.assetPath, required this.theme});

  String get short {
    // reduz pra caber no botão
    if (title.length <= 10) return title;
    return title.substring(0, 10);
  }
}

class _ThemePack {
  final List<Color> bg;
  final Color fg;
  final int seed;
  const _ThemePack(this.bg, this.fg, this.seed);
}

// 20 títulos (natureza, galáxia, animais, mar...)
const List<String> _titles = [
  'Floresta',
  'Praia',
  'Oceano',
  'Cachoeira',
  'Montanha',
  'Safari',
  'Gatinho',
  'Cachorrinho',
  'Pinguim',
  'Tartaruga',
  'Galáxia',
  'Planetas',
  'Estrelas',
  'Foguete',
  'Arco-íris',
  'Jardim',
  'Corais',
  'Baleia',
  'Dinossauro',
  'Noite Mágica',
];

// 20 temas de fallback (caso não tenha imagens ainda)
const List<_ThemePack> _themes = [
  _ThemePack([Color(0xFFB7F7C9), Color(0xFF4CD964)], Color(0xFF0B3D2E), 11),
  _ThemePack([Color(0xFFFFE29F), Color(0xFFFFA751)], Color(0xFF7A3E00), 22),
  _ThemePack([Color(0xFFB3E5FC), Color(0xFF0288D1)], Color(0xFF003B57), 33),
  _ThemePack([Color(0xFFC8E6C9), Color(0xFF1B5E20)], Color(0xFFFFFFFF), 44),
  _ThemePack([Color(0xFFE1BEE7), Color(0xFF7B1FA2)], Color(0xFFFFFFFF), 55),
  _ThemePack([Color(0xFFFFCDD2), Color(0xFFD32F2F)], Color(0xFFFFFFFF), 66),
  _ThemePack([Color(0xFFFFF9C4), Color(0xFFFBC02D)], Color(0xFF3B2F00), 77),
  _ThemePack([Color(0xFFD7CCC8), Color(0xFF6D4C41)], Color(0xFFFFFFFF), 88),
  _ThemePack([Color(0xFFE0F7FA), Color(0xFF00ACC1)], Color(0xFF003C45), 99),
  _ThemePack([Color(0xFFBBDEFB), Color(0xFF1976D2)], Color(0xFFFFFFFF), 101),

  _ThemePack([Color(0xFF0D47A1), Color(0xFF311B92)], Color(0xFFFFF176), 111),
  _ThemePack([Color(0xFF4FC3F7), Color(0xFF9575CD)], Color(0xFFFFFFFF), 122),
  _ThemePack([Color(0xFF1A237E), Color(0xFF000000)], Color(0xFFFFD54F), 133),
  _ThemePack([Color(0xFFB39DDB), Color(0xFF7C4DFF)], Color(0xFFFFFFFF), 144),
  _ThemePack([Color(0xFFFFF59D), Color(0xFFFF8A65)], Color(0xFF2E2E2E), 155),
  _ThemePack([Color(0xFFC5E1A5), Color(0xFF8BC34A)], Color(0xFF2E3B00), 166),
  _ThemePack([Color(0xFF80DEEA), Color(0xFF26C6DA)], Color(0xFF003C45), 177),
  _ThemePack([Color(0xFF90CAF9), Color(0xFF1565C0)], Color(0xFFFFFFFF), 188),
  _ThemePack([Color(0xFFFFCCBC), Color(0xFFFF5722)], Color(0xFFFFFFFF), 199),
  _ThemePack([Color(0xFFB388FF), Color(0xFF00E5FF)], Color(0xFFFFFFFF), 202),
];
