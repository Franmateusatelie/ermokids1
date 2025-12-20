import 'package:flutter/material.dart';

class KidMathScreen extends StatelessWidget {
  const KidMathScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Matemática')),
      body: const Center(
        child: Text(
          'Em breve: Matemática por níveis (3–10 anos)\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
