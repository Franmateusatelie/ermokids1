import 'package:flutter/material.dart';

class KidPortugueseScreen extends StatelessWidget {
  const KidPortugueseScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Português')),
      body: const Center(
        child: Text(
          'Em breve: Português por níveis\nLetras • Palavras • Frases\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
