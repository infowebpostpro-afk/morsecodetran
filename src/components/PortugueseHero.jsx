import React from 'react';
import { MorseSignal } from './MorseSignal.jsx';

export function PortugueseHero() {
  return (
    <section className="hero-section">
      <MorseSignal sequence="...---..." speedMs={350} />

      <h1 className="hero-title">Tradutor de código Morse</h1>
      <p className="hero-subtitle">
        Converta texto em pontos e traços ou decodifique código Morse em texto. Ouça os sinais, copie o resultado e confira cada caractere.
      </p>
    </section>
  );
}
