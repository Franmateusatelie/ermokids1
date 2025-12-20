import 'package:flutter/material.dart';

class KidValuesScreen extends StatelessWidget {
  const KidValuesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Valores e Natureza')),
      body: const Center(
        child: Text(
          'Em breve:\n🌱 Meio ambiente\n🤝 Respeito às pessoas\n🐾 Não maltratar animais\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
