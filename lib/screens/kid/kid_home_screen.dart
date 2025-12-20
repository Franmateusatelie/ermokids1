import 'package:flutter/material.dart';

import '../music/music_screen.dart';
import '../create/paint_screen.dart';
import 'modules/kid_math_screen.dart';
import 'modules/kid_portuguese_screen.dart';
import 'modules/kid_dino_egg_screen.dart';

class KidHomeScreen extends StatelessWidget {
  const KidHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD),
      appBar: AppBar(
        title: const Text('ErmoKids 🎈'),
        backgroundColor: Colors.blue,
      ),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        children: [
          _MenuButton(
            icon: Icons.calculate,
            label: 'Matemática',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const KidMathScreen()),
            ),
          ),
          _MenuButton(
            icon: Icons.menu_book,
            label: 'Português',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const KidPortugueseScreen()),
            ),
          ),
          _MenuButton(
            icon: Icons.palette,
            label: 'Pintar',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const PaintScreen()),
            ),
          ),
          _MenuButton(
            icon: Icons.music_note,
            label: 'Músicas',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const MusicScreen()),
            ),
          ),
          _MenuButton(
            icon: Icons.egg_alt,
            label: 'Ovinho do Dino',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const KidDinoEggScreen()),
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MenuButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: Colors.deepPurple),
            const SizedBox(height: 10),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}





