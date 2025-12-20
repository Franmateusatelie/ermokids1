import 'package:flutter/material.dart';
import '../../main.dart';

class ParentLockScreen extends StatefulWidget {
  const ParentLockScreen({super.key});

  @override
  State<ParentLockScreen> createState() => _ParentLockScreenState();
}

class _ParentLockScreenState extends State<ParentLockScreen> {
  final ctrl = TextEditingController();
  String error = '';

  @override
  void dispose() {
    ctrl.dispose();
    super.dispose();
  }

  Future<void> check() async {
    final pin = await LocalStore.getParentPin();
    if (ctrl.text.trim() == pin) {
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/parent');
    } else {
      setState(() => error = 'PIN incorreto.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Área dos Pais')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Digite o PIN para entrar.'),
            const SizedBox(height: 10),
            TextField(
              controller: ctrl,
              keyboardType: TextInputType.number,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'PIN',
                border: OutlineInputBorder(),
              ),
              onSubmitted: (_) => check(),
            ),
            const SizedBox(height: 10),
            if (error.isNotEmpty) Text(error, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: check,
              child: const Text('Entrar'),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/roles', (r) => false),
              child: const Text('Voltar'),
            ),
          ],
        ),
      ),
    );
  }
}
