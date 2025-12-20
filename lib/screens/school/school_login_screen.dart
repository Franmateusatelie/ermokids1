import 'package:flutter/material.dart';

class SchoolLoginScreen extends StatefulWidget {
  const SchoolLoginScreen({super.key});

  @override
  State<SchoolLoginScreen> createState() => _SchoolLoginScreenState();
}

class _SchoolLoginScreenState extends State<SchoolLoginScreen> {
  final user = TextEditingController();
  final pass = TextEditingController();
  String error = '';

  @override
  void dispose() {
    user.dispose();
    pass.dispose();
    super.dispose();
  }

  void login() {
    // Login simples (mock). Depois trocamos por Firebase/servidor.
    if (user.text.trim() == 'escola' && pass.text.trim() == '1234') {
      Navigator.pushReplacementNamed(context, '/school');
    } else {
      setState(() => error = 'Login inválido. Use: escola / 1234');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Escola • Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: user,
              decoration: const InputDecoration(labelText: 'Usuário', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: pass,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Senha', border: OutlineInputBorder()),
              onSubmitted: (_) => login(),
            ),
            const SizedBox(height: 10),
            if (error.isNotEmpty) Text(error, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 10),
            ElevatedButton(onPressed: login, child: const Text('Entrar')),
            const SizedBox(height: 8),
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
