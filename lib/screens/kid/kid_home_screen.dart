import 'package:flutter/material.dart';

import 'modules/kid_math_screen.dart';
import 'modules/kid_portuguese_screen.dart';
import 'modules/kid_memory_screen.dart';
import 'modules/kid_paint_screen.dart';
import 'modules/kid_dino_egg_screen.dart';
import 'modules/kid_values_screen.dart';

class KidHomeScreen extends StatelessWidget {
  const KidHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Área da Criança'),
        actions: [
          IconButton(
            tooltip: 'Trocar usuário',
            onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/roles', (r) => false),
            icon: const Icon(Icons.home_rounded),
          )
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF9C4), Color(0xFFE1F5FE)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Image.asset('assets/images/logo.png', width: 64),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Escolha uma atividade:',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            _KidTile(
              emoji: '➕',
              title: 'Matemática (por nível)',
              subtitle: 'Somar, subtrair e desafios',
              color: const Color(0xFFFFF59D),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidMathScreen())),
            ),
            _KidTile(
              emoji: '🅰️',
              title: 'Português (por nível)',
              subtitle: 'Letras, palavras e frases',
              color: const Color(0xFFC8E6C9),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidPortugueseScreen())),
            ),
            _KidTile(
              emoji: '🧠',
              title: 'Jogo da Memória',
              subtitle: 'Animais e cores',
              color: const Color(0xFFBBDEFB),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidMemoryScreen())),
            ),
            _KidTile(
              emoji: '🎨',
              title: 'Pintar e Desenhar',
              subtitle: 'Pinte moldes e desenhe',
              color: const Color(0xFFFFCCBC),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidPaintScreen())),
            ),
            _KidTile(
              emoji: '🦖',
              title: 'Ovinho do Dinossauro (30 dias)',
              subtitle: 'Cuidar todo dia: banho, comida e dormir',
              color: const Color(0xFFD1C4E9),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidDinoEggScreen())),
            ),
            _KidTile(
              emoji: '🌱',
              title: 'Valores e Natureza',
              subtitle: 'Respeito, meio ambiente e animais',
              color: const Color(0xFFB2DFDB),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const KidValuesScreen())),
            ),

            const SizedBox(height: 10),
            const Text(
              'Dica: novos jogos e níveis serão liberados aqui.',
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

class _KidTile extends StatelessWidget {
  final String emoji;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _KidTile({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: onTap,
        child: Card(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              gradient: LinearGradient(
                colors: [color, Colors.white],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Row(
              children: [
                Text(emoji, style: const TextStyle(fontSize: 42)),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(subtitle, style: const TextStyle(fontSize: 13)),
                    ],
                  ),
                ),
                const Icon(Icons.play_circle_fill_rounded, size: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

