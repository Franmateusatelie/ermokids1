import 'package:flutter/material.dart';

class ParentsScreen extends StatelessWidget {
  ParentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Área dos Pais'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Área dos Pais',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Text(
              'Aqui os pais podem acompanhar e orientar o uso do aplicativo.',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 12),
            Text('• App educativo para crianças de 5 a 12 anos'),
            Text('• Jogos de matemática, palavras, pintura e curiosidades'),
            Text('• Animalzinho virtual com evolução de 90 dias'),
            Text('• Conteúdo 100% offline'),
            SizedBox(height: 20),
            Text(
              'Desenvolvido por ErmoTech Solutions TI',
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
