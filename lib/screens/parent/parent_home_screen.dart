import 'package:flutter/material.dart';

class ParentHomeScreen extends StatelessWidget {
  const ParentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Área dos Pais'),
        actions: [
          IconButton(
            tooltip: 'Voltar',
            onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/roles', (r) => false),
            icon: const Icon(Icons.home_rounded),
          )
        ],
      ),
      body: const Padding(
        padding: EdgeInsets.all(18),
        child: Center(
          child: Text(
            'Em breve:\n📅 Rotinas\n⭐ Recompensas\n⏱️ Tempo de tela\n\n✅ Base pronta',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
        ),
      ),
    );
  }
}

