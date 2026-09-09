import React, { useState } from 'react';
import {
  Volume2, Play, Square, Download, Radio, Sliders, Activity,
  ChevronDown, ChevronUp, CheckCircle, Zap, Headphones, ShieldCheck, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, translateMorseToText, getCharacterBreakdown } from '../engine/morseEngine.js';
import { AudioDecoderModule } from './AudioDecoderModule.jsx';

export function MorseAudioTranslatorPage({ wpm, setWpm, frequency, setFrequency, volume, setVolume, showToast, setActiveTab }) {
  const [inputText, setInputText] = useState('MORSE AUDIO TRANSLATOR');
  const [farnsworthWpm, setFarnsworthWpm] = useState(wpm || 20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const morseText = translateTextToMorse(inputText);
  const breakdown = getCharacterBreakdown(inputText, morseText);

  const handlePlay = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: farnsworthWpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleDownloadWav = () => {
    if (!morseText) return;
    try {
      const blob = audioEngine.generateWavBlob({
        morse: morseText,
        wpm: wpm || 20,
        farnsworthWpm: farnsworthWpm || 20,
        frequency: frequency || 600,
        volume: volume || 0.5
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-audio-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('WAV Audio file downloaded successfully ✓');
    } catch (err) {
      if (showToast) showToast('Failed to export audio');
    }
  };

  const faqs = [
    {
      q: 'How does the Morse Audio Translator generate sound?',
      a: 'It utilizes the HTML5 Web Audio API to synthesize precise sine-wave audio tones in real time using standard ITU Morse code timing (1 dit unit, 3 dah units).'
    },
    {
      q: 'Can I export Morse code audio to MP3 or WAV?',
      a: 'Yes! You can instantly generate and export studio-quality uncompressed 44.1kHz WAV audio files directly in your browser without any server processing.'
    },
    {
      q: 'What pitch frequency is best for listening to Morse code?',
      a: 'Most experienced operators prefer side-tone frequencies between 500 Hz and 700 Hz (600 Hz is the ITU standard standard pitch for CW).'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Volume2 size={16} /> Audio Morse Generator & Player
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Morse Code Audio Translator
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Listen to Morse code audio playback, adjust pitch & speed controls, generate custom timing, download WAV audio, or decode sound via microphone.
        </p>
      </header>

      {/* Interactive Sound Generator Box */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Headphones style={{ color: 'var(--accent-primary)' }} /> Live Audio Generator
        </h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Text to Convert & Hear:</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'monospace' }}
          />
        </div>

        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Morse Output:</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
            {morseText || '...'}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={isPlaying ? handleStop : handlePlay}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
              background: isPlaying ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)',
              color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Stop Audio' : 'Play Audio Sound'}
          </button>

          <button
            onClick={handleDownloadWav}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
              background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Download size={18} /> Export WAV File
          </button>
        </div>
      </section>

      {/* Live Microphone Tone Decoder */}
      <section style={{ marginBottom: '2.5rem' }}>
        <AudioDecoderModule showToast={showToast} />
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Morse Audio Translator FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaqIdx === idx && (
                <div style={{ padding: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
