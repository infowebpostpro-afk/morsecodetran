/**
 * High Performance Web Audio API Morse Generator & WAV Synthesizer
 */

class MorseAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentScheduleTimeout = null;
    this.activeNodes = [];
    this.onProgressCallback = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.currentScheduleTimeout) {
      clearTimeout(this.currentScheduleTimeout);
      this.currentScheduleTimeout = null;
    }
    this.activeNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
      try { node.disconnect(); } catch (e) {}
    });
    this.activeNodes = [];

    if (this.onProgressCallback) {
      this.onProgressCallback({ activeCharIndex: -1, isEnded: true });
    }
  }

  /**
   * Play single tone (dit or dah)
   */
  playSingleTone(durationSec, frequency = 600, volume = 0.5) {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Smooth envelope attack & decay (5ms ramps) to avoid clicks
    const attack = 0.005;
    const release = 0.005;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    gain.gain.setValueAtTime(volume, ctx.currentTime + Math.max(attack, durationSec - release));
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationSec);
  }

  /**
   * Play entire breakdown sequence with synchronized progress callbacks
   */
  playSequence({
    breakdown = [],
    wpm = 20,
    farnsworthWpm = 20,
    frequency = 600,
    volume = 0.5,
    loop = false,
    onProgress = null
  }) {
    this.stop();
    this.isPlaying = true;
    this.onProgressCallback = onProgress;

    const ctx = this.getAudioContext();
    const effectiveWpm = Math.min(wpm, farnsworthWpm || wpm);
    const useFarnsworth = farnsworthWpm < wpm;

    // Paris Formula timing
    const dotDuration = 1.2 / wpm; // seconds per dot symbol
    const spacingDotDuration = useFarnsworth ? (1.2 / effectiveWpm) : dotDuration;

    let currentTime = ctx.currentTime + 0.05; // small buffer start

    // Schedule all items
    const scheduleEvents = () => {
      let accumTimeSec = 0.05;

      breakdown.forEach((item, itemIdx) => {
        const itemStartTime = ctx.currentTime + accumTimeSec;

        // Schedule visual progress highlight callback
        const timeoutId = setTimeout(() => {
          if (this.isPlaying && this.onProgressCallback) {
            this.onProgressCallback({
              activeCharIndex: itemIdx,
              item,
              isEnded: false
            });
          }
        }, accumTimeSec * 1000);

        if (item.isSpace) {
          // Word space: 7 units of spacing speed
          accumTimeSec += 7 * spacingDotDuration;
        } else if (item.morse && item.morse !== '?') {
          // Play each dot/dash in morse symbol
          const morseChars = item.morse.split('');
          morseChars.forEach((symbol, symIdx) => {
            const isDash = symbol === '-';
            const duration = isDash ? dotDuration * 3 : dotDuration;
            const symStartTime = ctx.currentTime + accumTimeSec;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, symStartTime);

            // Envelope ramp (5ms)
            const ramp = 0.005;
            gain.gain.setValueAtTime(0, symStartTime);
            gain.gain.linearRampToValueAtTime(volume, symStartTime + ramp);
            gain.gain.setValueAtTime(volume, symStartTime + Math.max(ramp, duration - ramp));
            gain.gain.linearRampToValueAtTime(0, symStartTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(symStartTime);
            osc.stop(symStartTime + duration);
            this.activeNodes.push(osc);

            accumTimeSec += duration;

            // Inter-element space within character = 1 dot duration (at char speed)
            if (symIdx < morseChars.length - 1) {
              accumTimeSec += dotDuration;
            }
          });

          // Inter-character space = 3 units (at spacing speed)
          accumTimeSec += 3 * spacingDotDuration;
        }
      });

      // Completion timeout
      this.currentScheduleTimeout = setTimeout(() => {
        if (this.isPlaying) {
          if (loop) {
            scheduleEvents();
          } else {
            this.stop();
          }
        }
      }, accumTimeSec * 1000);
    };

    scheduleEvents();
  }

  /**
   * Client-Side WAV File Generator
   * Produces a 16-bit PCM WAV Blob for downloading generated audio
   */
  generateWavBlob({ morse, wpm = 20, farnsworthWpm = 20, frequency = 600, volume = 0.5 }) {
    const sampleRate = 44100;
    const effectiveWpm = Math.min(wpm, farnsworthWpm || wpm);
    const useFarnsworth = farnsworthWpm < wpm;

    const dotDuration = 1.2 / wpm;
    const spacingDotDuration = useFarnsworth ? (1.2 / effectiveWpm) : dotDuration;

    // Calculate total duration in samples
    let totalSamples = 0;
    const morseWords = morse.trim().split(/\s*\/\s*|\s{3,}/);

    morseWords.forEach((word, wIdx) => {
      const chars = word.trim().split(/\s+/);
      chars.forEach((c, cIdx) => {
        for (let i = 0; i < c.length; i++) {
          const isDash = c[i] === '-';
          totalSamples += Math.floor((isDash ? dotDuration * 3 : dotDuration) * sampleRate);
          if (i < c.length - 1) totalSamples += Math.floor(dotDuration * sampleRate);
        }
        if (cIdx < chars.length - 1) totalSamples += Math.floor(3 * spacingDotDuration * sampleRate);
      });
      if (wIdx < morseWords.length - 1) totalSamples += Math.floor(7 * spacingDotDuration * sampleRate);
    });

    // Allocate PCM buffer (16-bit Mono = 2 bytes per sample)
    const dataSize = totalSamples * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // Write WAV Header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true);  // AudioFormat (PCM)
    view.setUint16(22, 1, true);  // NumChannels (Mono)
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true);  // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Synthesize sine wave audio PCM samples into buffer
    let sampleOffset = 0;
    const writeSilence = (durationSec) => {
      const numSamples = Math.floor(durationSec * sampleRate);
      for (let i = 0; i < numSamples; i++) {
        if (sampleOffset >= totalSamples) break;
        view.setInt16(44 + sampleOffset * 2, 0, true);
        sampleOffset++;
      }
    };

    const writeTone = (durationSec) => {
      const numSamples = Math.floor(durationSec * sampleRate);
      const attackSamples = Math.floor(0.005 * sampleRate);
      const releaseSamples = Math.floor(0.005 * sampleRate);

      for (let i = 0; i < numSamples; i++) {
        if (sampleOffset >= totalSamples) break;

        let amp = volume * 32767;
        if (i < attackSamples) {
          amp *= (i / attackSamples);
        } else if (i > numSamples - releaseSamples) {
          amp *= ((numSamples - i) / releaseSamples);
        }

        const t = sampleOffset / sampleRate;
        const val = Math.sin(2 * Math.PI * frequency * t) * amp;
        view.setInt16(44 + sampleOffset * 2, Math.max(-32768, Math.min(32767, val)), true);
        sampleOffset++;
      }
    };

    morseWords.forEach((word, wIdx) => {
      const chars = word.trim().split(/\s+/);
      chars.forEach((c, cIdx) => {
        for (let i = 0; i < c.length; i++) {
          const isDash = c[i] === '-';
          writeTone(isDash ? dotDuration * 3 : dotDuration);
          if (i < c.length - 1) writeSilence(dotDuration);
        }
        if (cIdx < chars.length - 1) writeSilence(3 * spacingDotDuration);
      });
      if (wIdx < morseWords.length - 1) writeSilence(7 * spacingDotDuration);
    });

    return new Blob([buffer], { type: 'audio/wav' });
  }
}

export const audioEngine = new MorseAudioEngine();
