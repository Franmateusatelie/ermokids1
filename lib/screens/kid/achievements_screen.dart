import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Conquistas 🏆',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 14),
        SectionCard(
          title: 'Medalhas (exemplo)',
          child: Column(
            children: const [
              ListTile(
                leading: Icon(Icons.emoji_events),
                title: Text('Primeiro Jogo'),
                subtitle: Text('Você jogou seu primeiro jogo!'),
              ),
              Divider(height: 1),
              ListTile(
                leading: Icon(Icons.star),
                title: Text('Curioso(a)'),
                subtitle: Text('Completou 3 desafios de letras.'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
