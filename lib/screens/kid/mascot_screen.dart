import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// MascotScreen = Amiguinho Virtual (substitui Dino/Ovo)
/// - Escolhe Cachorro ou Gatinho
/// - Ações: Comer, Banho, Dormir, Brincar
/// - Estados: fome, sujeira, sono, humor
/// - Crescimento até 60 dias (4 fases)
class MascotScreen extends StatefulWidget {
  const MascotScreen({super.key});

  @override
  State<MascotScreen> createState() => _MascotScreenState();
}

class _MascotScreenState extends State<MascotScreen> {
  // ====== MODELO (salvo em SharedPreferences) ======
  static const _kPetType = 'pet_type'; // dog | cat
  static const _kStartDateMs = 'pet_start_ms'; // quando começou
  static const _kHunger = 'pet_hunger'; // 0..100 (100 = cheio)
  static const _kClean = 'pet_clean'; // 0..100 (100 = limpinho)
  static const _kEnergy = 'pet_energy'; // 0..100 (100 = descansado)
  static const _kMood = 'pet_mood'; // 0..100 (100 = feliz)
  static const _kLastUpdateMs = 'pet_last_update_ms';

  String? petType; // null = não escolhido ainda

  int hunger = 80;
  int clean = 80;
  int energy = 80;
  int mood = 80;

  int startDateMs = 0;
  int lastUpdateMs = 0;

  bool loading = true;

  // ====== AJUSTES DE DECAY (baseado em tempo real) ======
  // A cada hora passa:
  // - fome cai, energia cai, limpeza cai levemente
  // - humor acompanha os outros
  // Valores foram escolhidos para ficar “infantil” e sem ficar impossível.
  static const int hungerDropPerHour = 6;
  static const int energyDropPerHour = 5;
  static const int cleanDropPerHour = 3;

  @override
  void initState() {
    super.initState();
    _load();
  }

  int _clamp(int v) => v.clamp(0, 100);

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();

    petType = p.getString(_kPetType);

    startDateMs = p.getInt(_kStartDateMs) ?? 0;
    hunger = p.getInt(_kHunger) ?? 80;
    clean = p.getInt(_kClean) ?? 80;
    energy = p.getInt(_kEnergy) ?? 80;
    mood = p.getInt(_kMood) ?? 80;

    lastUpdateMs = p.getInt(_kLastUpdateMs) ?? 0;

    // Se já existe pet, aplica “passagem do tempo” ao abrir
    if (petType != null && lastUpdateMs > 0) {
      _applyTimeDecay(DateTime.now().millisecondsSinceEpoch);
      await _save();
    }

    setState(() => loading = false);
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    if (petType != null) {
      await p.setString(_kPetType, petType!);
    }
    await p.setInt(_kStartDateMs, startDateMs);
    await p.setInt(_kHunger, hunger);
    await p.setInt(_kClean, clean);
    await p.setInt(_kEnergy, energy);
    await p.setInt(_kMood, mood);
    await p.setInt(_kLastUpdateMs, lastUpdateMs);
  }

  void _applyTimeDecay(int nowMs) {
    final elapsedMs = max(0, nowMs - lastUpdateMs);
    final elapsedHours = (elapsedMs / (1000 * 60 * 60)).floor();

    if (elapsedHours <= 0) return;

    hunger = _clamp(hunger - hungerDropPerHour * elapsedHours);
    energy = _clamp(energy - energyDropPerHour * elapsedHours);
    clean = _clamp(clean - cleanDropPerHour * elapsedHours);

    // Humor depende do “pior” dos três
    final minNeed = min(hunger, min(clean, energy));
    // puxa mood para perto do minNeed (sem despencar demais)
    mood = _clamp(((mood * 2 + minNeed) / 3).round());

    lastUpdateMs = nowMs;
  }

  Future<void> _choosePet(String type) async {
    petType = type;
    final now = DateTime.now().millisecondsSinceEpoch;
    startDateMs = now;
    lastUpdateMs = now;

    hunger = 85;
    clean = 85;
    energy = 85;
    mood = 90;

    await _save();
    setState(() {});
  }

  // ====== AÇÕES ======
  Future<void> _feed() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    _applyTimeDecay(now);

    hunger = _clamp(hunger + 30);
    mood = _clamp(mood + 8);

    // se estiver muito sujo, comer não deixa 100% feliz
    if (clean < 40) mood = _clamp(mood - 4);

    lastUpdateMs = now;
    await _save();
    setState(() {});
  }

  Future<void> _bath() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    _applyTimeDecay(now);

    clean = _clamp(clean + 45);
    mood = _clamp(mood + 10);

    lastUpdateMs = now;
    await _save();
    setState(() {});
  }

  Future<void> _sleep() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    _applyTimeDecay(now);

    energy = _clamp(energy + 40);
    mood = _clamp(mood + 6);

    lastUpdateMs = now;
    await _save();
    setState(() {});
  }

  Future<void> _play() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    _applyTimeDecay(now);

    // brincar gasta energia e suja um pouco, mas melhora humor
    mood = _clamp(mood + 18);
    energy = _clamp(energy - 10);
    clean = _clamp(clean - 5);

    lastUpdateMs = now;
    await _save();
    setState(() {});
  }

  Future<void> _resetPet() async {
    final p = await SharedPreferences.getInstance();
    await p.remove(_kPetType);
    await p.remove(_kStartDateMs);
    await p.remove(_kHunger);
    await p.remove(_kClean);
    await p.remove(_kEnergy);
    await p.remove(_kMood);
    await p.remove(_kLastUpdateMs);

    setState(() {
      petType = null;
      startDateMs = 0;
      lastUpdateMs = 0;
      hunger = 80;
      clean = 80;
      energy = 80;
      mood = 80;
    });
  }

  // ====== CRESCIMENTO (0..60 dias) ======
  int get _ageDays {
    if (startDateMs == 0) return 0;
    final start = DateTime.fromMillisecondsSinceEpoch(startDateMs);
    final now = DateTime.now();
    return now.difference(start).inDays.clamp(0, 60);
  }

  String get _stageName {
    final d = _ageDays;
    if (d <= 15) return 'Bebê';
    if (d <= 30) return 'Filhote';
    if (d <= 45) return 'Jovem';
    return 'Adulto';
  }

  String get _petEmoji {
    if (petType == 'dog') return '🐶';
    return '🐱';
  }

  String get _moodFace {
    // combina humor + necessidades
    final minNeed = min(hunger, min(clean, energy));
    final score = (mood + minNeed) ~/ 2;

    if (score >= 80) return '😄';
    if (score >= 60) return '😊';
    if (score >= 40) return '😕';
    return '😢';
  }

  // ====== UI helpers ======
  Color _barColor(int v) {
    if (v >= 70) return const Color(0xFF2ECC71);
    if (v >= 40) return const Color(0xFFF1C40F);
    return const Color(0xFFE74C3C);
  }

  Widget _statRow(String label, int value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 18, color: _barColor(value)),
        const SizedBox(width: 8),
        SizedBox(width: 90, child: Text(label, style: const TextStyle(fontWeight: FontWeight.w700))),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: value / 100,
              minHeight: 10,
              backgroundColor: Colors.black.withOpacity(0.06),
              valueColor: AlwaysStoppedAnimation<Color>(_barColor(value)),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Text('$value%', style: const TextStyle(fontWeight: FontWeight.w800)),
      ],
    );
  }

  Widget _actionButton({
    required String text,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon),
      label: Text(text),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        elevation: 3,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    // TELA DE ESCOLHA
    if (petType == null) {
      return _PickPetView(
        onPickDog: () => _choosePet('dog'),
        onPickCat: () => _choosePet('cat'),
      );
    }

    // TELA PRINCIPAL DO AMIGUINHO
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFFFF3E0), Color(0xFFE3F2FD)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // CARD PRINCIPAL (pet)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.9),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  blurRadius: 18,
                  offset: const Offset(0, 10),
                  color: Colors.black.withOpacity(0.08),
                ),
              ],
            ),
            child: Column(
              children: [
                Text(
                  'Meu Amiguinho',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Colors.pink.shade400,
                  ),
                ),
                const SizedBox(height: 10),

                // Pet “fofo” (emoji) + humor
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(_petEmoji, style: const TextStyle(fontSize: 64)),
                    const SizedBox(width: 12),
                    Text(_moodFace, style: const TextStyle(fontSize: 48)),
                  ],
                ),

                const SizedBox(height: 8),
                Text(
                  'Fase: $_stageName • ${_ageDays}/60 dias',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 14),

                _statRow('Fome', hunger, Icons.restaurant),
                const SizedBox(height: 10),
                _statRow('Banho', clean, Icons.shower),
                const SizedBox(height: 10),
                _statRow('Sono', energy, Icons.bedtime),
                const SizedBox(height: 10),
                _statRow('Humor', mood, Icons.favorite),

                const SizedBox(height: 16),

                // Mensagem “educacional”
                _tipCard(),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // AÇÕES
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              SizedBox(
                width: (MediaQuery.of(context).size.width - 16 * 2 - 12) / 2,
                child: _actionButton(
                  text: 'Dar comida',
                  icon: Icons.restaurant_menu,
                  color: const Color(0xFF2ECC71),
                  onTap: () {
                    _feed();
                    _snack('Você deu comidinha! 🍎🥕');
                  },
                ),
              ),
              SizedBox(
                width: (MediaQuery.of(context).size.width - 16 * 2 - 12) / 2,
                child: _actionButton(
                  text: 'Banho',
                  icon: Icons.shower,
                  color: const Color(0xFF3498DB),
                  onTap: () {
                    _bath();
                    _snack('Banho tomado! 🚿✨');
                  },
                ),
              ),
              SizedBox(
                width: (MediaQuery.of(context).size.width - 16 * 2 - 12) / 2,
                child: _actionButton(
                  text: 'Dormir',
                  icon: Icons.bedtime,
                  color: const Color(0xFF9B59B6),
                  onTap: () {
                    _sleep();
                    _snack('Hora do soninho 😴');
                  },
                ),
              ),
              SizedBox(
                width: (MediaQuery.of(context).size.width - 16 * 2 - 12) / 2,
                child: _actionButton(
                  text: 'Brincar',
                  icon: Icons.sports_esports,
                  color: const Color(0xFFE67E22),
                  onTap: () {
                    _play();
                    _snack('Vocês brincaram! 🎾⭐');
                  },
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Configuração (reset)
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.85),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(Icons.settings, color: Color(0xFF34495E)),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Trocar amiguinho',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
                TextButton(
                  onPressed: () async {
                    await _resetPet();
                    if (context.mounted) {
                      _snack('Vamos escolher um novo amiguinho! 🐾');
                    }
                  },
                  child: const Text('Trocar'),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _tipCard() {
    // Dica com base no que está pior
    final minNeed = min(hunger, min(clean, energy));
    String tip;
    IconData ic;
    Color c;

    if (minNeed == hunger) {
      tip = 'Dica: quando a barriguinha está vazia, a gente fica tristinho. Que tal dar comidinha?';
      ic = Icons.restaurant;
      c = const Color(0xFF2ECC71);
    } else if (minNeed == clean) {
      tip = 'Dica: banho deixa a gente cheirosinho e feliz! Vamos tomar banho?';
      ic = Icons.shower;
      c = const Color(0xFF3498DB);
    } else {
      tip = 'Dica: dormir faz bem pro coração e dá energia pra brincar! Vamos descansar?';
      ic = Icons.bedtime;
      c = const Color(0xFF9B59B6);
    }

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: c.withOpacity(0.10),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: c.withOpacity(0.25)),
      ),
      child: Row(
        children: [
          Icon(ic, color: c),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              tip,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  void _snack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class _PickPetView extends StatelessWidget {
  final VoidCallback onPickDog;
  final VoidCallback onPickCat;

  const _PickPetView({
    required this.onPickDog,
    required this.onPickCat,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFFFFDE7), Color(0xFFE8F5E9)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Container(
          width: min(MediaQuery.of(context).size.width * 0.92, 420),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.92),
            borderRadius: BorderRadius.circular(26),
            boxShadow: [
              BoxShadow(
                blurRadius: 20,
                offset: const Offset(0, 12),
                color: Colors.black.withOpacity(0.10),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Escolha seu amiguinho! 🐾',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Colors.pink.shade400,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Cuide dele todos os dias:\ncomida 🍎 • banho 🚿 • dormir 😴 • brincar 🎾',
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onPickDog,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2ECC71),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      ),
                      child: const Text('🐶 Cachorrinho', style: TextStyle(fontWeight: FontWeight.w900)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onPickCat,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF3498DB),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      ),
                      child: const Text('🐱 Gatinho', style: TextStyle(fontWeight: FontWeight.w900)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                'Ele cresce em 60 dias! ⭐',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  color: Colors.orange.shade700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

