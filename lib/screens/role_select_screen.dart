import 'package:flutter/material.dart';
import '../widgets/big_tile.dart';

class RoleSelectScreen extends StatelessWidget {
  const RoleSelectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Escolha o modo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            BigTile(
              icon: Icons.child_care,
              title: 'Criança',
              subtitle: 'Entrar no mundo ErmoKids',
              onTap: () => Navigator.pushNamed(context, '/kid'),
            ),
            const SizedBox(height: 12),
            BigTile(
              icon: Icons.family_restroom,
              title: 'Pais',
              subtitle: 'Controle e relatórios (PIN)',
              onTap: () => Navigator.pushNamed(context, '/parentLock'),
            ),
            const SizedBox(height: 12),
            BigTile(
              icon: Icons.school,
              title: 'Escola',
              subtitle: 'Turmas e progresso (institucional)',
              onTap: () => Navigator.pushNamed(context, '/schoolLogin'),
            ),
            const Spacer(),
            Text(
              'ErmoKids • ErmoTech Solutions TI',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
