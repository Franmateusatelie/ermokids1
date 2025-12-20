import 'package:flutter/material.dart';
import '../core/sound_manager.dart';

class RoleSelectScreen extends StatelessWidget {
  const RoleSelectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 🔹 FUNDO
          Positioned.fill(
            child: Image.asset(
              'assets/images/background_abc.png',
              fit: BoxFit.cover,
            ),
          ),

          // 🔹 CAMADA SUAVE (para leitura melhor)
          Positioned.fill(
            child: Container(
              color: Colors.white.withOpacity(0.25),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 16),

                // 🔹 LOGO TOPO
                Image.asset(
                  'assets/images/logo_ermokids.png',
                  height: 110,
                  fit: BoxFit.contain,
                ),

                const SizedBox(height: 24),

                // 🔹 BOTÕES
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _imageButton(
                          context,
                          image: 'assets/images/btn_area_crianca.png',
                          onTap: () async {
                            await SoundManager.playClick();
                            Navigator.pushReplacementNamed(context, '/kid');
                          },
                        ),
                        const SizedBox(height: 24),
                        _imageButton(
                          context,
                          image: 'assets/images/btn_area_pais.png',
                          onTap: () async {
                            await SoundManager.playClick();
                            Navigator.pushReplacementNamed(context, '/parent');
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _imageButton(
    BuildContext context, {
    required String image,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 130,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.25),
              blurRadius: 10,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: Image.asset(
            image,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}













