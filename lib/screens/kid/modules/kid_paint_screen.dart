import 'package:flutter/material.dart';

class KidPaintScreen extends StatelessWidget {
  const KidPaintScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pintar e Desenhar')),
      body: const Center(
        child: Text(
          'Em breve: Pintura com moldes + desenho livre\n\n✅ Base pronta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
