import 'pet_screen.dart';
import 'package:flutter/material.dart';
import 'music_screen.dart';
import 'math_screen.dart';
import 'puzzle_screen.dart';
import 'paint_screen.dart';
import 'words_screen.dart';
import 'trivia_screen.dart';

class KidsMenuScreen extends StatelessWidget {
  const KidsMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/kids_bg.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: GridView.count(
          crossAxisCount: 2,
          padding: const EdgeInsets.all(20),
          children: [
            _btn(context, 'Você Sabia?', const TriviaScreen()),
            _btn(context, 'Quebra Cabeça', const PuzzleScreen()),
            _btn(context, 'Matemática', const MathScreen()),
            _btn(context, 'Completar Palavras', const WordsScreen()),
            _btn(context, 'Música', const MusicScreen()),
            _btn(context, 'Animalzinho', const PetScreen()),
            _btn(context, 'Pintar', const PaintScreen()),
          ],
        ),
      ),
    );
  }

  Widget _btn(BuildContext c, String t, Widget s) {
    return ElevatedButton(
      onPressed: () => Navigator.push(c, MaterialPageRoute(builder: (_) => s)),
      child: Text(t, textAlign: TextAlign.center),
    );
  }
}
