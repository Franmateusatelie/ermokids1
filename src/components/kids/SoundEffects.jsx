// Sistema de sons para o app
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playSuccess() {
    this.init();
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  playVictory() {
    this.init();
    const melody = [
      { freq: 523.25, duration: 0.15 },
      { freq: 659.25, duration: 0.15 },
      { freq: 783.99, duration: 0.15 },
      { freq: 1046.50, duration: 0.4 }
    ];
    
    let time = 0;
    melody.forEach((note) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle';
      
      const startTime = this.audioContext.currentTime + time;
      gainNode.gain.setValueAtTime(0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
      
      time += note.duration;
    });
  }

  playError() {
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}

export const soundEffects = new SoundEffects();