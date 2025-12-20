import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class MusicScreen extends StatefulWidget {
  const MusicScreen({super.key});

  @override
  State<MusicScreen> createState() => _MusicScreenState();
}

class _MusicScreenState extends State<MusicScreen> {
  final player = AudioPlayer();
  final playlist = [
    'music1.mp3',
    'music2.mp3',
    'music3.mp3',
    'music4.mp3',
    'music5.mp3',
    'music6.mp3',
  ];
  int index = 0;

  void playNext() async {
    await player.play(AssetSource('music/${playlist[index]}'));
    player.onPlayerComplete.listen((_) {
      index = (index + 1) % playlist.length;
      playNext();
    });
  }

  @override
  void initState() {
    super.initState();
    playNext();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Música')),
      body: const Center(child: Text('Playlist tocando automaticamente')),
    );
  }
}
