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

  Widget glowButton({
    required BuildContext context,
    required String image,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: () async {
        await playClick();
        onTap();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.yellow.withOpacity(0.7),
              blurRadius: 25,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Image.asset(
          image,
          width: 260,
        ),
      ),
    );
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

                // BOTÕES COM SOM + LUZ
                Column(
                  children: [
                    glowButton(
                      context: context,
                      image: 'assets/images/btn_crianca.png',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const KidsMenuScreen(),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 28),

                    glowButton(
                      context: context,
                      image: 'assets/images/btn_pais.png',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ParentsScreen(),
                          ),
                        );
                      },
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




