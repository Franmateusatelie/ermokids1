import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'kids_menu_screen.dart';
import 'parents_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static final AudioPlayer _player = AudioPlayer();

  Future<void> playClick() async {
    await _player.play(AssetSource('music/click.mp3'));
  }

  Widget img(String path, {double? width, BoxFit fit = BoxFit.contain}) {
    return Image.asset(
      path,
      width: width,
      fit: fit,
      errorBuilder: (context, error, stack) {
        return Container(
          padding: const EdgeInsets.all(12),
          color: Colors.white,
          child: Text(
            'ASSET NÃO ENCONTRADO:\n$path',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.red),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // FUNDO
            Positioned.fill(
              child: img(
                'assets/images/abc123.png',
                fit: BoxFit.cover,
              ),
            ),

            Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // LOGO TOPO
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Center(
                    child: img(
                      'assets/images/logo.png',
                      width: 90,
                    ),
                  ),
                ),

                // BOTÕES (SEM EFEITO)
                Column(
                  children: [
                    GestureDetector(
                      onTap: () async {
                        await playClick();
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const KidsMenuScreen(),
                          ),
                        );
                      },
                      child: img(
                        'assets/images/btn_crianca.png',
                        width: 260,
                      ),
                    ),

                    const SizedBox(height: 24),

                    GestureDetector(
                      onTap: () async {
                        await playClick();
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ParentsScreen(),
                          ),
                        );
                      },
                      child: img(
                        'assets/images/btn_pais.png',
                        width: 260,
                      ),
                    ),
                  ],
                ),

                // RODAPÉ
                const Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: Text(
                    'Ermotech Solutions TI 2025',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}





