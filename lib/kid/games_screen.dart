import 'package:flutter/material.dart';
import '../../widgets/section_card.dart';

class GamesScreen extends StatelessWidget {
  const GamesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Jogos Educativos 🎮',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 10),
        const Text('Aqui já está pronto para você plugar os jogos reais depois.'),
        const SizedBox(height: 14),

        SectionCard(
          title: 'Começar agora',
          child: Column(
            children: [
              _GameButton(
                title: 'Números Vivos 🔢',
                subtitle: 'Conte e some com objetos animados',
                onTap: () => _show(context, 'Números Vivos', 'Em seguida eu coloco o jogo real com fases.'),
              ),
              const SizedBox(height: 10),
              _GameButton(
                title: 'Palavras Mágicas 🔤',
                subtitle: 'Letras com som e montar palavrinhas',
                onTap: () => _show(context, 'Palavras Mágicas', 'Vai ter leitura guiada com áudio.'),
              ),
              const SizedBox(height: 10),
              _GameButton(
                title: 'Cores & Emoções 🌈',
                subtitle: 'Aprender sentimentos de forma segura',
                onTap: () => _show(context, 'Cores & Emoções', 'Mini-jogos de empatia e identificação.'),
              ),
              const SizedBox(height: 10),
              _GameButton(
                title: 'Natureza 🌱',
                subtitle: 'Plantar, cuidar e reciclar',
                onTap: () => _show(context, 'Natureza', 'O parque da cidade fica mais verde conforme aprende.'),
              ),
              const SizedBox(height: 10),
              _GameButton(
                title: 'Tempo & Rotina 🕒',
                subtitle: 'Horas, dia/noite e hábitos',
                onTap: () => _show(context, 'Tempo & Rotina', 'Rotinas saudáveis com recompensas leves.'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _show(BuildContext context, String title, String msg) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(msg),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK')),
        ],
      ),
    );
  }
}

class _GameButton extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _GameButton({required this.title, required this.subtitle, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              const Icon(Icons.play_circle, size: 34),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                    const SizedBox(height: 2),
                    Text(subtitle),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}
