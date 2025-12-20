import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/splash_screen.dart';
import 'screens/role_select_screen.dart';
import 'screens/kid/kid_home_screen.dart';
import 'screens/parent/parent_lock_screen.dart';
import 'screens/parent/parent_home_screen.dart';
import 'screens/school/school_login_screen.dart';
import 'screens/school/school_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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
        colorSchemeSeed: const Color(0xFF2ECC71), // verde alegre
        brightness: Brightness.light,
      ),
      routes: {
        '/': (_) => const SplashScreen(),
        '/roles': (_) => const RoleSelectScreen(),
        '/kid': (_) => const KidHomeScreen(),
        '/parentLock': (_) => const ParentLockScreen(),
        '/parent': (_) => const ParentHomeScreen(),
        '/schoolLogin': (_) => const SchoolLoginScreen(),
        '/school': (_) => const SchoolHomeScreen(),
      },
    );
  }
}

/// Helpers simples para guardar PIN e dados mínimos offline.
class LocalStore {
  static const _pinKey = 'parent_pin';
  static const _kidNameKey = 'kid_name';
  static const _kidAgeKey = 'kid_age';

  static Future<String> getParentPin() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_pinKey) ?? '1234'; // PIN padrão
  }

  static Future<void> setParentPin(String pin) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_pinKey, pin);
  }

  static Future<String> getKidName() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_kidNameKey) ?? 'Amiguinho';
  }

  static Future<int> getKidAge() async {
    final p = await SharedPreferences.getInstance();
    return p.getInt(_kidAgeKey) ?? 5;
  }

  static Future<void> setKidProfile({required String name, required int age}) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_kidNameKey, name);
    await p.setInt(_kidAgeKey, age);
  }
}

