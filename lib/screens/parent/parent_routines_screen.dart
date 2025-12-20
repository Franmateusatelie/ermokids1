import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/notification_service.dart';
import '../../core/star_manager.dart';

class ParentRoutinesScreen extends StatefulWidget {
  const ParentRoutinesScreen({super.key});

  @override
  State<ParentRoutinesScreen> createState() => _ParentRoutinesScreenState();
}

class _ParentRoutinesScreenState extends State<ParentRoutinesScreen> {
  final TextEditingController _controller = TextEditingController();
  TimeOfDay? _time;

  List<Map<String, dynamic>> routines = [];

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
          'title': parts[0],
          'hour': int.parse(parts[1]),
          'minute': int.parse(parts[2]),
        };
      }).toList();
    });
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    final list = routines
        .map((r) => '${r['title']}|${r['hour']}|${r['minute']}')
        .toList();
    await p.setStringList('routines_v2', list);
  }

  Future<void> _addRoutine() async {
    if (_controller.text.trim().isEmpty || _time == null) return;

    final routine = {
      'title': _controller.text.trim(),
      'hour': _time!.hour,
      'minute': _time!.minute,
    };

    routines.add(routine);
    await _save();

    final now = DateTime.now();
    final date = DateTime(
      now.year,
      now.month,
      now.day,
      routine['hour'],
      routine['minute'],
    );

    await NotificationService.scheduleNotification(
      id: routines.length,
      title: '⏰ Hora da Rotina',
      body: routine['title'],
      dateTime: date,
    );

    // ⭐ recompensa por rotina criada
    await StarManager.addStars(1);

    _controller.clear();
    _time = null;

    setState(() {});
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('👨‍👩‍👧 Rotinas dos Pais'),
        actions: [
          FutureBuilder<int>(
            future: StarManager.getStars(),
            builder: (context, snapshot) {
              final stars = snapshot.data ?? 0;
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(
                  child: Text(
                    '⭐ $stars',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              );
            },
          )
        ],
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
                    const SizedBox(height: 10),
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
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _addRoutine,
                      child: const Text('Adicionar rotina'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: routines.length,
                itemBuilder: (context, i) {
                  final r = routines[i];
                  return Card(
                    child: ListTile(
                      leading: const Icon(Icons.alarm),
                      title: Text(r['title']),
                      subtitle: Text(
                        'Horário: ${r['hour']}:${r['minute'].toString().padLeft(2, '0')}',
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}



