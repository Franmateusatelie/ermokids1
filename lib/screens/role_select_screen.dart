import 'package:flutter/material.dart';

class RoleSelectScreen extends StatelessWidget {
  const RoleSelectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ErmoKids')),
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            const SizedBox(height: 10),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    Image.asset('assets/images/logo.png', width: 72),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Bem-vindo! Escolha quem vai usar:',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),

            _BigChoiceButton(
              emoji: '🧒',
              title: 'Área da Criança',
              subtitle: 'Jogos, pintura e aprender brincando',
              onTap: () => Navigator.pushReplacementNamed(context, '/kid'),
            ),
            const SizedBox(height: 14),
            _BigChoiceButton(
              emoji: '👨‍👩‍👧',
              title: 'Área dos Pais',
              subtitle: 'Rotinas, progresso e controles',
              onTap: () => Navigator.pushNamed(context, '/parentLock'),
            ),

            const Spacer(),
            const Text(
              'Idade: 3 a 10 anos • Conteúdo educativo',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 14),
          ],
        ),
      ),
    );
  }
}

class _BigChoiceButton extends StatelessWidget {
  final String emoji;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _BigChoiceButton({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          child: Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 44)),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(subtitle, style: const TextStyle(fontSize: 14)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded),
            ],
          ),
        ),
      ),
    );
  }
}

