import 'package:flutter/material.dart';

class PaintScreen extends StatefulWidget {
  const PaintScreen({super.key});

  @override
  State<PaintScreen> createState() => _PaintScreenState();
}

class _PaintScreenState extends State<PaintScreen> {
  List<Offset?> points = [];
  Color selectedColor = Colors.red;
  String template = '⭐';

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

  final List<String> templates = ['⭐', '🐶', '🚗'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF8E1),
      appBar: AppBar(
        title: const Text('🎨 Pintar Desenhos'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => setState(() => points.clear()),
          ),
        ],
      ),
      body: Column(
        children: [
          // Escolher molde
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: templates.map((t) {
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      template = t;
                      points.clear();
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: template == t
                          ? Colors.orangeAccent
                          : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.black26),
                    ),
                    child: Text(t, style: const TextStyle(fontSize: 28)),
                  ),
                );
              }).toList(),
            ),
          ),

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
                  painter: _Painter(
                    points: points,
                    color: selectedColor,
                    template: template,
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
              children: colors.map((c) {
                return GestureDetector(
                  onTap: () => setState(() => selectedColor = c),
                  child: Container(
                    width: 45,
                    height: 45,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
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
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

class _Painter extends CustomPainter {
  final List<Offset?> points;
  final Color color;
  final String template;

  _Painter({
    required this.points,
    required this.color,
    required this.template,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Molde
    final tp = TextPainter(
      text: TextSpan(
        text: template,
        style: const TextStyle(fontSize: 200),
      ),
      textDirection: TextDirection.ltr,
    );
    tp.layout();
    tp.paint(
      canvas,
      Offset(
        (size.width - tp.width) / 2,
        (size.height - tp.height) / 2,
      ),
    );

    // Desenho
    final paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 6;

    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        canvas.drawLine(points[i]!, points[i + 1]!, paint);
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}

