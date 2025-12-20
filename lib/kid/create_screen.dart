import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class CreateScreen extends StatelessWidget {
  const CreateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Criar 🎨',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 14),
        SectionCard(
          title: 'Desenho (em breve)',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('Aqui você pode colocar um mini canvas de desenho e salvar.'),
              SizedBox(height: 10),
              Text('Na próxima etapa eu te entrego esse módulo pronto.'),
            ],
          ),
        ),
      ],
    );
  }
}
