import 'package:flutter/material.dart';
import 'dart:async';

class PetScreen extends StatefulWidget {
  const PetScreen({super.key});

  @override
  State<PetScreen> createState() => _PetScreenState();
}

class _PetScreenState extends State<PetScreen> {
  int hunger = 100;
  int hygiene = 100;
  int happiness = 100;
  int energy = 100;

  int days = 1;
  String stage = 'Bebê 🍼';

  Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(const Duration(seconds: 5), (_) => decay());
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void decay() {
    setState(() {
      hunger -= 3;
      hygiene -= 2;
      happiness -= 2;
      energy -= 3;

      hunger = hunger.clamp(0, 100);
      hygiene = hygiene.clamp(0, 100);
      happiness = happiness.clamp(0, 100);
      energy = energy.clamp(0, 100);

      if (days < 90) days++;
      updateStage();
    });
  }

  void updateStage() {
    if (days < 30) {
      stage = 'Bebê 🍼';
    } else if (days < 60) {
      stage = 'Criança 🧒';
    } else if (days < 90) {
      stage = 'Adolescente 👦';
    } else {
      stage = 'Adulto 🧑';
    }
  }

  void feed() => setState(() => hunger = 100);
  void bath() => setState(() => hygiene = 100);
  void play() => setState(() => happiness = 100);
  void sleep() => setState(() => energy = 100);

  Widget bar(String label, int value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$label: $value'),
        LinearProgressIndicator(
          value: value / 100,
          color: color,
          backgroundColor: Colors.grey.shade300,
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Meu Animalzinho')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              stage,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text('Dia: $days / 90'),
            const SizedBox(height: 16),

            const Text('🐶', style: TextStyle(fontSize: 80)),

            bar('Fome', hunger, Colors.orange),
            bar('Higiene', hygiene, Colors.blue),
            bar('Felicidade', happiness, Colors.pink),
            bar('Energia', energy, Colors.green),

            const SizedBox(height: 10),

            Wrap(
              spacing: 10,
              children: [
                ElevatedButton.icon(
                  onPressed: feed,
                  icon: const Icon(Icons.restaurant),
                  label: const Text('Comer'),
                ),
                ElevatedButton.icon(
                  onPressed: bath,
                  icon: const Icon(Icons.bathtub),
                  label: const Text('Banho'),
                ),
                ElevatedButton.icon(
                  onPressed: play,
                  icon: const Icon(Icons.sports_esports),
                  label: const Text('Brincar'),
                ),
                ElevatedButton.icon(
                  onPressed: sleep,
                  icon: const Icon(Icons.bed),
                  label: const Text('Dormir'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
