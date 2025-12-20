import 'package:flutter/material.dart';

class KidMemoryScreen extends StatelessWidget {
  const KidMemoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Jogo da Memória')),
      body: const Center(
        child: Text(
          'Em breve: Jogo da Memória (Animais + Cores)\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
