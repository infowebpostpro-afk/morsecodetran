import React from 'react';
import { MorseSignal } from './MorseSignal.jsx';

export function Hero() {
  return (
    <section className="hero-section">
      <MorseSignal sequence="...---... .-.-. ...-.-" speedMs={350} />

      <h1 className="hero-title">Morse Code Translator</h1>
      <p className="hero-subtitle">
        Translate Morse Code instantly, convert text to Morse, decode messages, hear Morse audio, and learn the International Morse Code.
      </p>
    </section>
  );
}
