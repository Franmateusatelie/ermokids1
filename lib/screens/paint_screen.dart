import 'package:flutter/material.dart';

class PaintScreen extends StatefulWidget {
  const PaintScreen({super.key});

  @override
  State<PaintScreen> createState() => _PaintScreenState();
}

class _PaintScreenState extends State<PaintScreen> {
  List<Offset?> points = [];
  Color selectedColor = Colors.black;
  double strokeWidth = 6;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pintar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => setState(() => points.clear()),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: GestureDetector(
              onPanUpdate: (details) {
                setState(() {
                  points.add(details.localPosition);
                });
              },
              onPanEnd: (_) => points.add(null),
              child: CustomPaint(
                painter: _PaintPainter(points, selectedColor, strokeWidth),
                child: Container(color: Colors.white),
              ),
            ),
          ),

          Container(
            padding: const EdgeInsets.all(8),
            color: Colors.grey.shade200,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _colorBtn(Colors.black),
                _colorBtn(Colors.red),
                _colorBtn(Colors.blue),
                _colorBtn(Colors.green),
                _colorBtn(Colors.orange),
                _colorBtn(Colors.purple),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _colorBtn(Color color) {
    return GestureDetector(
      onTap: () => setState(() => selectedColor = color),
      child: CircleAvatar(
        backgroundColor: color,
        radius: 18,
        child: selectedColor == color
            ? const Icon(Icons.check, color: Colors.white)
            : null,
      ),
    );
  }
}

class _PaintPainter extends CustomPainter {
  final List<Offset?> points;
  final Color color;
  final double strokeWidth;

  _PaintPainter(this.points, this.color, this.strokeWidth);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        canvas.drawLine(points[i]!, points[i + 1]!, paint);
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
