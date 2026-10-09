import React from 'react';
import { MorseSignal } from './MorseSignal.jsx';

export function SpanishHero() {
  return (
    <section className="hero-section">
      <MorseSignal sequence="...---..." speedMs={350} />

      <h1 className="hero-title">Traductor de Código Morse</h1>
      <p className="hero-subtitle">
        Convierte texto a código Morse y Morse a texto al instante. Escucha el audio, copia los resultados, descarga WAV y aprende el alfabeto Morse internacional.
      </p>
    </section>
  );
}
