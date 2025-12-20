import 'package:flutter/material.dart';
import 'core/notification_service.dart';

import 'screens/splash_screen.dart';
import 'screens/role_select_screen.dart';
import 'screens/kid/kid_home_screen.dart';
import 'screens/parent/parent_lock_screen.dart';
import 'screens/parent/parent_home_screen.dart';
import 'screens/school/school_login_screen.dart';
import 'screens/school/school_home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
