import 'package:flutter/material.dart';

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
        children: const [
          KidMenuButton(icon: Icons.calculate, label: 'Matemática'),
          KidMenuButton(icon: Icons.menu_book, label: 'Português'),
          KidMenuButton(icon: Icons.brush, label: 'Desenhar'),
          KidMenuButton(icon: Icons.palette, label: 'Pintar'),
          KidMenuButton(icon: Icons.pets, label: 'Amiguinho'),
          KidMenuButton(icon: Icons.music_note, label: 'Músicas'),
        ],
      ),
    );
  }
}

class KidMenuButton extends StatelessWidget {
  final IconData icon;
  final String label;

  const KidMenuButton({
    super.key,
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () {},
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: Colors.deepPurple),
            const SizedBox(height: 12),
            Text(
              label,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


