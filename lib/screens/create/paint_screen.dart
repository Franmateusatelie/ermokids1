import 'package:flutter/material.dart';

class PaintScreen extends StatefulWidget {
  const PaintScreen({super.key});

  @override
  State<PaintScreen> createState() => _PaintScreenState();
}

class _PaintScreenState extends State<PaintScreen> {
  List<Offset?> points = [];
  Color selectedColor = Colors.red;
  double strokeWidth = 6.0;
  bool showTemplate = true;

  final List<Color> colors = [
    Colors.red,
    Colors.blue,
    Colors.green,
    Colors.yellow,
    Colors.orange,
    Colors.purple,
    Colors.brown,
    Colors.black,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF8E1),
      appBar: AppBar(
        title: const Text('🎨 Pintar e Desenhar'),
        actions: [
          IconButton(
            tooltip: 'Limpar',
            icon: const Icon(Icons.delete),
            onPressed: () {
              setState(() => points.clear());
            },
          ),
          IconButton(
            tooltip: 'Molde',
            icon: Icon(showTemplate ? Icons.visibility : Icons.visibility_off),
            onPressed: () {
              setState(() => showTemplate = !showTemplate);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Área de desenho
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.black26),
              ),
              child: GestureDetector(
                onPanUpdate: (details) {
                  setState(() {
                    final box =
                        context.findRenderObject() as RenderBox;
                    points.add(
                      box.globalToLocal(details.globalPosition),
                    );
                  });
                },
                onPanEnd: (_) => points.add(null),
                child: CustomPaint(
                  painter: _PaintPainter(
                    points: points,
                    color: selectedColor,
                    strokeWidth: strokeWidth,
                    showTemplate: showTemplate,
                  ),
                  child: Container(),
                ),
              ),
            ),
          ),

          // Paleta de cores
          SizedBox(
            height: 80,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: colors.map((c) {
                return GestureDetector(
                  onTap: () => setState(() => selectedColor = c),
                  child: Container(
                    width: 50,
                    height: 50,
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      color: c,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: selectedColor == c
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

          const SizedBox(height: 10),

          // Espessura
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Fino'),
              Slider(
                value: strokeWidth,
                min: 3,
                max: 12,
                divisions: 3,
                onChanged: (v) {
                  setState(() => strokeWidth = v);
                },
              ),
              const Text('Grosso'),
            ],
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}

class _PaintPainter extends CustomPainter {
  final List<Offset?> points;
  final Color color;
  final double strokeWidth;
  final bool showTemplate;

  _PaintPainter({
    required this.points,
    required this.color,
    required this.strokeWidth,
    required this.showTemplate,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    // Molde (estrela grande)
    if (showTemplate) {
      final textPainter = TextPainter(
        text: const TextSpan(
          text: '⭐',
          style: TextStyle(fontSize: 200),
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

    // Desenho
    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        canvas.drawLine(points[i]!, points[i + 1]!, paint);
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
