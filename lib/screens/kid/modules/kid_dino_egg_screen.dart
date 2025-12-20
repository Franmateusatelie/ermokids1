import 'package:flutter/material.dart';

class KidDinoEggScreen extends StatelessWidget {
  const KidDinoEggScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ovinho do Dino')),
      body: const Center(
        child: Text(
          'Em breve: cuidar do ovo por 30 dias\n🍽️ Legumes • 🛁 Banho • 😴 Dormir\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
