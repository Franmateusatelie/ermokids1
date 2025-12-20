import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/notification_service.dart';

class ParentRoutinesScreen extends StatefulWidget {
  const ParentRoutinesScreen({super.key});

  @override
  State<ParentRoutinesScreen> createState() => _ParentRoutinesScreenState();
}

class _ParentRoutinesScreenState extends State<ParentRoutinesScreen> {
  final TextEditingController _controller = TextEditingController();
  TimeOfDay? _time;

  List<Map<String, int>> routines = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    final list = p.getStringList('routines_v2') ?? [];

    setState(() {
      routines = list.map((e) {
        final parts = e.split('|');
        return {
          'hour': int.parse(parts[1]),
          'minute': int.parse(parts[2]),
        };
      }).toList();
    });
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    final list = routines
        .map((r) => '${_controller.text}|${r['hour']}|${r['minute']}')
        .toList();
    await p.setStringList('routines_v2', list);
  }

  Future<void> _addRoutine() async {
    if (_controller.text.isEmpty || _time == null) return;

    final now = DateTime.now();
    final date = DateTime(
      now.year,
      now.month,
      now.day,
      _time!.hour,
      _time!.minute,
    );

    await NotificationService.scheduleNotification(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: '⏰ Hora da rotina',
      body: _controller.text.trim(),
      dateTime: date,
    );

    routines.add({
      'hour': _time!.hour,
      'minute': _time!.minute,
    });

    await _save();

    _controller.clear();
    _time = null;

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('👨‍👩‍👧 Rotinas dos Pais'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: 'Ex: Escovar os dentes',
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _time == null
                                ? 'Escolher horário'
                                : 'Horário: ${_time!.format(context)}',
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.access_time),
                          onPressed: () async {
                            final picked = await showTimePicker(
                              context: context,
                              initialTime: TimeOfDay.now(),
                            );
                            if (picked != null) {
                              setState(() => _time = picked);
                            }
                          },
                        )
                      ],
                    ),
                    ElevatedButton(
                      onPressed: _addRoutine,
                      child: const Text('Adicionar rotina'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}



