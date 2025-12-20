import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class MusicScreen extends StatefulWidget {
  const MusicScreen({super.key});

  @override
  State<MusicScreen> createState() => _MusicScreenState();
}

class _MusicScreenState extends State<MusicScreen> {
  final AudioPlayer _player = AudioPlayer();
  int _index = 0;
  bool _playing = false;

  final List<Map<String, String>> _musics = [
    {'title': 'Música Feliz', 'file': 'music/musica1.mp3'},
    {'title': 'Hora de Brincar', 'file': 'music/musica2.mp3'},
    {'title': 'Canção Alegre', 'file': 'music/musica3.mp3'},
  ];

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  Future<void> _play() async {
    await _player.play(
      AssetSource(_musics[_index]['file']!),
    );
    setState(() => _playing = true);
  }

  Future<void> _pause() async {
    await _player.pause();
    setState(() => _playing = false);
  }

  void _next() {
    _index = (_index + 1) % _musics.length;
    _play();
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
          const Icon(
            Icons.music_note,
            size: 100,
            color: Colors.deepPurple,
          ),
          const SizedBox(height: 20),

          Text(
            music['title']!,
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

