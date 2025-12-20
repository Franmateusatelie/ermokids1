import 'package:flutter/material.dart';
import 'city_screen.dart';
import 'games_screen.dart';
import 'achievements_screen.dart';
import 'create_screen.dart';
import 'mascot_screen.dart';

class KidHomeScreen extends StatefulWidget {
  const KidHomeScreen({super.key});

  @override
  State<KidHomeScreen> createState() => _KidHomeScreenState();
}

class _KidHomeScreenState extends State<KidHomeScreen> {
  int index = 0;

  final pages = const [
    CityScreen(),
    GamesScreen(),
    AchievementsScreen(),
    CreateScreen(),
    MascotScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ErmoKids'),
        actions: [
          IconButton(
            tooltip: 'Voltar',
            icon: const Icon(Icons.home),
            onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/roles', (r) => false),
          )
        ],
      ),
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.location_city), label: 'Cidade'),
          NavigationDestination(icon: Icon(Icons.sports_esports), label: 'Jogos'),
          NavigationDestination(icon: Icon(Icons.emoji_events), label: 'Conquistas'),
          NavigationDestination(icon: Icon(Icons.brush), label: 'Criar'),
          NavigationDestination(icon: Icon(Icons.pets), label: 'Amiguinho'),
        ],
      ),
    );
  }
}
