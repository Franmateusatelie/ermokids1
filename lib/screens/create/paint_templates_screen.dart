import 'package:flutter/material.dart';

class PaintTemplatesScreen extends StatefulWidget {
  const PaintTemplatesScreen({super.key});

  @override
  State<PaintTemplatesScreen> createState() => _PaintTemplatesScreenState();
}

class _PaintTemplatesScreenState extends State<PaintTemplatesScreen> {
  final List<Offset?> _points = [];
  Color _currentColor = Colors.red;
  String _template = '🐶';

  final List<Color> _colors = [
    Colors.red,
    Colors.blue,
    Colors.green,
    Colors.yellow,
    Colors.orange,
    Colors.purple,
    Colors.brown,
    Colors.black,
  ];

  final List<String> _templates = ['🐶', '🚗', '⭐'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🎨 Pintar Desenhos'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Escolha de molde
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: _templates.map((t) {
                final selected = t == _template;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _template = t;
                      _points.clear();
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: selected ? Colors.orangeAccent : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.black26),
                    ),
                    child: Text(
                      t,
                      style: const TextStyle(fontSize: 32),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Área de pintura
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.black26),
              ),
              child: GestureDetector(
                onPanUpdate: (details) {
                  setState(() {
                    final box = context.findRenderObject() as RenderBox;
                    _points.add(box.globalToLocal(details.globalPosition));
                  });
                },
                onPanEnd: (_) => _points.add(null),
                child: CustomPaint(
                  painter: _PaintPainter(
                    points: _points,
                    color: _currentColor,
                    template: _template,
                  ),
                  child: Container(),
                ),
              ),
            ),
          ),

          // Paleta de cores
          SizedBox(
            height: 70,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: _colors.map((c) {
                return GestureDetector(
                  onTap: () => setState(() => _currentColor = c),
                  child: Container(
                    width: 50,
                    height: 50,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    decoration: BoxDecoration(
                      color: c,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: _currentColor == c
                            ? Colors.black
                            : Colors.transparent,
                        width: 3,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Botão limpar
          Padding(
            padding: const EdgeInsets.all(12),
            child: ElevatedButton.icon(
              onPressed: () => setState(() => _points.clear()),
              icon: const Icon(Icons.delete),
              label: const Text('Limpar desenho'),
            ),
          ),
        ],
      ),
    );
  }
}

class _PaintPainter extends CustomPainter {
  final List<Offset?> points;
  final Color color;
  final String template;

  _PaintPainter({
    required this.points,
    required this.color,
    required this.template,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 6;

    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        canvas.drawLine(points[i]!, points[i + 1]!, paint);
      }
    }

    // Desenha o molde (emoji grande)
    final textPainter = TextPainter(
      text: TextSpan(
        text: template,
        style: const TextStyle(fontSize: 180),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(
      canvas,
      Offset(
        (size.width - textPainter.width) / 2,
        (size.height - textPainter.height) / 2,
      ),
    );
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
