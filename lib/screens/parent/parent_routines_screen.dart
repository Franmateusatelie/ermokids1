import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ParentRoutinesScreen extends StatefulWidget {
  const ParentRoutinesScreen({super.key});

  @override
  State<ParentRoutinesScreen> createState() => _ParentRoutinesScreenState();
}

class _ParentRoutinesScreenState extends State<ParentRoutinesScreen> {
  final TextEditingController _controller = TextEditingController();
  List<String> routines = [];
  Set<String> done = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    setState(() {
      routines = p.getStringList('routines') ?? [];
      done = (p.getStringList('routines_done') ?? []).toSet();
    });
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    await p.setStringList('routines', routines);
    await p.setStringList('routines_done', done.toList());
  }

  void _addRoutine() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      routines.add(text);
      _controller.clear();
    });
    _save();
  }

  void _toggle(String r) {
    setState(() {
      if (done.contains(r)) {
        done.remove(r);
      } else {
        done.add(r);
      }
    });
    _save();
  }

  void _remove(String r) {
    setState(() {
      routines.remove(r);
      done.remove(r);
    });
    _save();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
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
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          hintText: 'Nova rotina (ex: Escovar os dentes)',
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle, color: Colors.green),
                      onPressed: _addRoutine,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView(
                children: routines.map((r) {
                  final checked = done.contains(r);
                  return Card(
                    child: ListTile(
                      leading: Icon(
                        checked
                            ? Icons.check_circle
                            : Icons.radio_button_unchecked,
                        color: checked ? Colors.green : Colors.grey,
                      ),
                      title: Text(
                        r,
                        style: TextStyle(
                          decoration: checked
                              ? TextDecoration.lineThrough
                              : null,
                        ),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _remove(r),
                      ),
                      onTap: () => _toggle(r),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
