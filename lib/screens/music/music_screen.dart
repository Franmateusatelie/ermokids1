import 'dart:math';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class MusicScreen extends StatefulWidget {
  const MusicScreen({super.key});

  @override
  State<MusicScreen> createState() => _MusicScreenState();
}

class _MusicScreenState extends State<MusicScreen>
    with SingleTickerProviderStateMixin {
  final AudioPlayer _player = AudioPlayer();
  late AnimationController _anim;

  int _index = 0;
  bool _playing = false;

  final List<Map<String, String>> _musics = [
    {'title': 'Música Feliz', 'file': 'music/musica1.mp3'},
    {'title': 'Hora de Brincar', 'file': 'music/musica2.mp3'},
    {'title': 'Canção Alegre', 'file': 'music/musica3.mp3'},
  ];

  @override
  void initState() {
    super.initState();

    _anim = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    /// quando acabar a música → próxima
    _player.onPlayerComplete.listen((event) {
      _next(auto: true);
    });
  }

  @override
  void dispose() {
    _anim.dispose();
    _player.dispose();
    super.dispose();
  }

  Future<void> _play() async {
    await _player.stop();
    await _player.play(
      AssetSource(_musics[_index]['file']!),
    );
    _anim.repeat();
    setState(() => _playing = true);
  }

  Future<void> _pause() async {
    await _player.pause();
    _anim.stop();
    setState(() => _playing = false);
  }

  void _next({bool auto = false}) {
    _index = (_index + 1) % _musics.length;
    _play();
    if (!auto) setState(() {});
  }

  void _previous() {
    _index = (_index - 1 + _musics.length) % _musics.length;
    _play();
  }

  @override
  Widget build(BuildContext context) {
    final music = _musics[_index];

    return Scaffold(
      backgroundColor: const Color(0xFFFFF8E1),
      appBar: AppBar(
        title: const Text('🎵 Músicas'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedBuilder(
            animation: _anim,
            builder: (context, _) {
              return Stack(
                alignment: Alignment.center,
                children: List.generate(8, (i) {
                  final angle = (i / 8) * 2 * pi;
                  final radius = 60 + (_anim.value * 20);
                  return Transform.translate(
                    offset: Offset(
                      cos(angle) * radius,
                      sin(angle) * radius,
                    ),
                    child: Icon(
                      Icons.music_note,
                      color: Colors.primaries[i % Colors.primaries.length],
                      size: 24,
                    ),
                  );
                }),
              );
            },
          ),

          const SizedBox(height: 30),

          const Icon(
            Icons.child_friendly,
            size: 80,
            color: Colors.deepPurple,
          ),

          const SizedBox(height: 20),

          Text(
            music['title']!,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 30),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                iconSize: 60,
                icon: const Icon(Icons.skip_previous),
                onPressed: _previous,
              ),
              IconButton(
                iconSize: 80,
                icon: Icon(
                  _playing
                      ? Icons.pause_circle
                      : Icons.play_circle,
                ),
                onPressed: _playing ? _pause : _play,
              ),
              IconButton(
                iconSize: 60,
                icon: const Icon(Icons.skip_next),
                onPressed: _next,
              ),
            ],
          ),
        ],
      ),
    );
  }
}



