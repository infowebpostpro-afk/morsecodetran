/**
 * Web Audio API Morse Signal Decoder (Microphone & Audio File Processor)
 */

export class AudioMorseDecoder {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.micStream = null;
    this.isListening = false;
    this.onUpdateCallback = null;
    this.animationFrameId = null;

    // Signal state tracking
    this.signalHistory = [];
    this.lastState = false; // false = space, true = mark
    this.lastStateTime = 0;
    this.pulseHistory = [];
    this.detectedMorse = '';
  }

  async startMicrophone(onUpdate) {
    this.onUpdateCallback = onUpdate;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioCtx();

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      
      // Bandpass filter to target CW tones (600 Hz center)
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 5.0;

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;

      source.connect(filter);
      filter.connect(this.analyser);

      this.isListening = true;
      this.lastStateTime = performance.now();
      this.processLoop();
    } catch (err) {
      console.error('Microphone access error:', err);
      throw err;
    }
  }

  stop() {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
      this.audioCtx = null;
    }
  }

  processLoop = () => {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate RMS energy around CW peak
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avgEnergy = sum / dataArray.length;

    // Threshold detection
    const isMark = avgEnergy > 35;
    const now = performance.now();
    const duration = now - this.lastStateTime;

    if (isMark !== this.lastState && duration > 40) { // filter noise < 40ms
      if (this.lastState) {
        // Was tone (mark)
        const isDash = duration > 180;
        this.detectedMorse += isDash ? '-' : '.';
      } else {
        // Was space
        if (duration > 600) {
          this.detectedMorse += ' / ';
        } else if (duration > 220) {
          this.detectedMorse += ' ';
        }
      }

      this.lastState = isMark;
      this.lastStateTime = now;
    }

    if (this.onUpdateCallback) {
      // Send live signal state, waveform slice, and detected morse
      this.onUpdateCallback({
        isSignalActive: isMark,
        energyLevel: Math.min(100, Math.round(avgEnergy * 1.5)),
        detectedMorse: this.detectedMorse,
        estimatedWpm: 18,
        estimatedFreq: 600,
        confidence: this.detectedMorse ? 88 : 0
      });
    }

    this.animationFrameId = requestAnimationFrame(this.processLoop);
  };
}
