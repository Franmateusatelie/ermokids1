import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/notification_service.dart';

class ParentRoutinesScreen extends StatefulWidget {
  const ParentRoutinesScreen({super.key});

  @override
  State<ParentRoutinesScreen> createState() => _ParentRoutinesScreenState();
}

class _ParentRoutinesScreenState extends State<ParentRoutinesScreen> {
  static const _key = 'parent_routines_v1';
  List<Map<String, dynamic>> routines = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    final raw = p.getString(_key);
    if (raw == null) {
      setState(() => routines = []);
      return;
    }
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    setState(() => routines = list);
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_key, jsonEncode(routines));
  }

  int _newId() {
    final ids = routines.map((e) => (e['id'] as int?) ?? 0).toList();
    ids.sort();
    return (ids.isEmpty ? 1000 : ids.last + 1);
  }

  Future<void> _addRoutine() async {
    final titleCtrl = TextEditingController();
    TimeOfDay time = const TimeOfDay(hour: 8, minute: 0);

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Nova rotina'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleCtrl,
              decoration: const InputDecoration(
                labelText: 'Título (ex: Escovar os dentes)',
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text('Horário: '),
                TextButton(
                  onPressed: () async {
                    final picked = await showTimePicker(
                      context: ctx,
                      initialTime: time,
                    );
                    if (picked != null) {
                      time = picked;
                      // força rebuild do dialog
                      (ctx as Element).markNeedsBuild();
                    }
                  },
                  child: Text('${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Vai tocar todos os dias nesse horário.'),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Salvar')),
        ],
      ),
    );

    if (ok != true) return;

    final title = titleCtrl.text.trim();
    if (title.isEmpty) return;

    final id = _newId();
    final routine = <String, dynamic>{
      'id': id,
      'title': title,
      'hour': time.hour,
      'minute': time.minute,
    };

    routines.add(routine);
    await _save();

    await NotificationService.scheduleDaily(
      id: id,
      title: 'Rotina',
      body: title,
      hour: time.hour,
      minute: time.minute,
    );

    setState(() {});
  }

  Future<void> _removeRoutine(int id) async {
    routines.removeWhere((r) => (r['id'] as int) == id);
    await _save();
    await NotificationService.cancel(id);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rotinas dos Pais'),
        actions: [
          IconButton(
            onPressed: _addRoutine,
            icon: const Icon(Icons.add),
            tooltip: 'Nova rotina',
          )
        ],
      ),
      body: routines.isEmpty
          ? const Center(
              child: Text(
                'Nenhuma rotina criada.\nToque em + para adicionar.',
                textAlign: TextAlign.center,
              ),
            )
          : ListView.builder(
              itemCount: routines.length,
              itemBuilder: (context, i) {
                final r = routines[i];
                final id = r['id'] as int;
                final title = (r['title'] ?? '').toString();
                final hour = (r['hour'] ?? 0) as int;
                final minute = (r['minute'] ?? 0) as int;

                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: ListTile(
                    leading: const Icon(Icons.alarm),
                    title: Text(title),
                    subtitle: Text('${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')} (todos os dias)'),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_forever),
                      onPressed: () => _removeRoutine(id),
                      tooltip: 'Remover rotina',
                    ),
                  ),
                );
              },
            ),
    );
  }
}









