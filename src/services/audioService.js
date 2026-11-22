// Web Audio API based Ambient Sound & Melodic Chimes
class SoundController {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.waterGain = null;
    this.melodyTimer = null;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // 1. Generate gentle soothing water stream (Filtered Pink/Brown Noise)
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02; // brown noise
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter to simulate gentle water flow
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.waterGain = this.ctx.createGain();
      this.waterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.waterGain);
      this.waterGain.connect(this.ctx.destination);
      whiteNoise.start(0);
      this.whiteNoiseNode = whiteNoise;

      // 2. Schedule gentle Thai pentatonic bells (Ranad / Khim chime feeling)
      this.schedulePentatonicMelody();
    } catch (e) {
      console.warn('Audio start notice:', e);
    }
  }

  playChime(freq, duration = 2.5) {
    if (!this.ctx || this.isMuted || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Bell harmonics
      const oscHarmonic = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2.02, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.exponentialRampToValueAtTime(0.02, now + 0.03);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

      osc.connect(gain);
      oscHarmonic.connect(harmGain);
      gain.connect(this.ctx.destination);
      harmGain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration);
      oscHarmonic.stop(now + duration);
    } catch (err) {
      // ignore
    }
  }

  schedulePentatonicMelody() {
    // Thai traditional 7-tone or pentatonic frequencies (G, A, C, D, E)
    const scale = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

    const playRandomNote = () => {
      if (!this.isPlaying) return;
      const note = scale[Math.floor(Math.random() * scale.length)];
      this.playChime(note, 3.2);

      // Next chime in 3 to 7 seconds
      const nextDelay = 3000 + Math.random() * 4000;
      this.melodyTimer = setTimeout(playRandomNote, nextDelay);
    };

    playRandomNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.whiteNoiseNode) {
      try {
        this.whiteNoiseNode.stop();
      } catch (e) {}
      this.whiteNoiseNode = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const audioService = new SoundController();
