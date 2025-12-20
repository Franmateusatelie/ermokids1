import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class CityScreen extends StatelessWidget {
  const CityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Minha Cidade ErmoKids 🌟',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 10),
        const Text('Aprenda nos jogos para desbloquear lugares na cidade!'),
        const SizedBox(height: 14),

        SectionCard(
          title: 'Progresso da Cidade',
          child: Column(
            children: const [
              _ProgressLine(label: 'Biblioteca (Letras)', value: 0.35),
              SizedBox(height: 8),
              _ProgressLine(label: 'Escola (Números)', value: 0.20),
              SizedBox(height: 8),
              _ProgressLine(label: 'Parque (Natureza)', value: 0.10),
              SizedBox(height: 8),
              _ProgressLine(label: 'Centro Social (Emoções)', value: 0.05),
            ],
          ),
        ),

        const SizedBox(height: 12),

        SectionCard(
          title: 'Lugares (em breve visual 2D)',
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            children: const [
              _PlaceChip(icon: Icons.menu_book, label: 'Biblioteca'),
              _PlaceChip(icon: Icons.calculate, label: 'Escola'),
              _PlaceChip(icon: Icons.park, label: 'Parque'),
              _PlaceChip(icon: Icons.favorite, label: 'Emoções'),
              _PlaceChip(icon: Icons.access_time, label: 'Rotina'),
              _PlaceChip(icon: Icons.science, label: 'Museu'),
            ],
          ),
        ),
      ],
    );
  }
}

class _ProgressLine extends StatelessWidget {
  final String label;
  final double value;

  const _ProgressLine({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(label)),
        const SizedBox(width: 12),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(value: value, minHeight: 10),
          ),
        ),
      ],
    );
  }
}

class _PlaceChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _PlaceChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Chip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
    );
  }
}
