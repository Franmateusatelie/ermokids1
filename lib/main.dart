import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(const ErmoKidsApp());
}

class ErmoKidsApp extends StatelessWidget {
  const ErmoKidsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ErmoKids',
      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
    );
  }
}






