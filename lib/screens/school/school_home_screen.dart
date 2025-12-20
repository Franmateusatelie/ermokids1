import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class SchoolHomeScreen extends StatelessWidget {
  const SchoolHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Escola • Painel'),
        actions: [
          IconButton(
            tooltip: 'Sair',
            icon: const Icon(Icons.logout),
            onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/roles', (r) => false),
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SectionCard(
            title: 'Turmas (exemplo)',
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.group),
                  title: Text('Pré 1 - Manhã'),
                  subtitle: Text('25 alunos • Progresso médio: 18%'),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.group),
                  title: Text('Pré 2 - Tarde'),
                  subtitle: Text('22 alunos • Progresso médio: 24%'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SectionCard(
            title: 'Módulos ativos',
            child: Wrap(
              spacing: 10,
              runSpacing: 10,
              children: const [
                Chip(label: Text('Letras')),
                Chip(label: Text('Números')),
                Chip(label: Text('Emoções')),
                Chip(label: Text('Natureza')),
                Chip(label: Text('Rotina')),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SectionCard(
            title: 'Relatório rápido (mock)',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('• 47 alunos ativos esta semana'),
                Text('• Melhor módulo: Letras'),
                Text('• Pontos de atenção: Rotina/Tempo'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
