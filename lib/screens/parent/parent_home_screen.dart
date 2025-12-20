import 'package:flutter/material.dart';
import '../../main.dart';
import '../../widgets/section_card.dart';

class ParentHomeScreen extends StatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  State<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends State<ParentHomeScreen> {
  String kidName = '...';
  int kidAge = 5;

  final nameCtrl = TextEditingController();
  final ageCtrl = TextEditingController();
  final pinCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    final n = await LocalStore.getKidName();
    final a = await LocalStore.getKidAge();
    setState(() {
      kidName = n;
      kidAge = a;
    });
    nameCtrl.text = n;
    ageCtrl.text = a.toString();
  }

  @override
  void dispose() {
    nameCtrl.dispose();
    ageCtrl.dispose();
    pinCtrl.dispose();
    super.dispose();
  }

  Future<void> saveProfile() async {
    final name = nameCtrl.text.trim().isEmpty ? 'Amiguinho' : nameCtrl.text.trim();
    final age = int.tryParse(ageCtrl.text.trim()) ?? 5;
    await LocalStore.setKidProfile(name: name, age: age.clamp(3, 10));
    await load();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Perfil salvo.')));
  }

  Future<void> changePin() async {
    final pin = pinCtrl.text.trim();
    if (pin.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('PIN deve ter 4+ dígitos.')));
      return;
    }
    await LocalStore.setParentPin(pin);
    pinCtrl.clear();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('PIN atualizado.')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pais • ErmoKids'),
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
            title: 'Perfil da Criança',
            child: Column(
              children: [
                TextField(
                  controller: nameCtrl,
                  decoration: const InputDecoration(labelText: 'Nome', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: ageCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Idade (3 a 10)', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  onPressed: saveProfile,
                  icon: const Icon(Icons.save),
                  label: const Text('Salvar'),
                ),
                const SizedBox(height: 6),
                Text('Atual: $kidName • $kidAge anos'),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SectionCard(
            title: 'PIN dos Pais',
            child: Column(
              children: [
                TextField(
                  controller: pinCtrl,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  decoration: const InputDecoration(labelText: 'Novo PIN', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  onPressed: changePin,
                  icon: const Icon(Icons.lock),
                  label: const Text('Atualizar PIN'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SectionCard(
            title: 'Relatório (exemplo offline)',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('• Tempo hoje: 12 min'),
                Text('• Letras: 3 desafios'),
                Text('• Números: 2 desafios'),
                Text('• Natureza: 1 desafio'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
