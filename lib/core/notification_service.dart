import 'dart:async';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const settings = InitializationSettings(android: android);
    await _plugin.initialize(settings);
  }

  /// 🔔 Notificação simples (sem timezone, sem schedule)
  static Future<void> showNotification({
    required int id,
    required String title,
    required String body,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'rotinas_channel',
      'Rotinas',
      channelDescription: 'Notificações de rotinas do ErmoKids',
      importance: Importance.max,
      priority: Priority.high,
    );

    await _plugin.show(
      id,
      title,
      body,
      const NotificationDetails(android: androidDetails),
    );
  }

  /// ⏱️ Dispara notificação no horário escolhido (app aberto)
  static void scheduleInApp({
    required int id,
    required String title,
    required String body,
    required DateTime dateTime,
  }) {
    final duration = dateTime.difference(DateTime.now());
    if (duration.isNegative) return;

    Timer(duration, () {
      showNotification(id: id, title: title, body: body);
    });
  }
}



