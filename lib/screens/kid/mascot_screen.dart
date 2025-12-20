import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class MascotScreen extends StatelessWidget {
  const MascotScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Meu Amiguinho 🐻',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 14),
        SectionCard(
          title: 'Mascote (protótipo)',
          child: Column(
            children: [
              const Icon(Icons.pets, size: 80),
              const SizedBox(height: 8),
              const Text('Oi! Eu sou seu amigo do ErmoKids!'),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.record_voice_over),
                label: const Text('Falar (em breve áudio)'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
