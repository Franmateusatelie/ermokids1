import 'package:flutter/material.dart';
import 'kids_menu_screen.dart';
import 'parents_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/abc123.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const SizedBox(height: 40),
            Image.asset('assets/images/logo.png', height: 80),

            Column(
              children: [
                ElevatedButton(
                  child: const Text('Área da Criança'),
                  onPressed: () {
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const KidsMenuScreen()));
                  },
                ),
                ElevatedButton(
                  child: const Text('Área dos Pais'),
                  onPressed: () {
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const ParentsScreen()));
                  },
                ),
              ],
            ),

            const Padding(
              padding: EdgeInsets.all(12),
              child: Text(
                'Ermotech Solutions TI 2025',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
