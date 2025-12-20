import 'package:flutter/material.dart';

import 'core/notification_service.dart';

import 'screens/splash_screen.dart';
import 'screens/role_select_screen.dart';
import 'screens/kid/kid_home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 🔔 Inicializa notificações (rotinas dos pais)
  await NotificationService.init();

  runApp(const ErmoKidsApp());
}

class ErmoKidsApp extends StatelessWidget {
  const ErmoKidsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ErmoKids',
      debugShowCheckedModeBanner: false,

      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4CAF50),
          brightness: Brightness.light,
        ),
      ),

      initialRoute: '/',
      routes: {
        '/': (_) => const SplashScreen(),
        '/roles': (_) => const RoleSelectScreen(),
        '/kid': (_) => const KidHomeScreen(),
      },
    );
  }
}
