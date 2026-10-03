import React from 'react';
import { MorseSignal } from './MorseSignal.jsx';

export function TurkishHero() {
  return (
    <section className="hero-section">
      <MorseSignal sequence="...---..." speedMs={350} />

      <h1 className="hero-title">Mors Alfabesi Çeviri & Mors Kodu Çevirici</h1>
      <p className="hero-subtitle">
        Türkçe metinleri anında Mors koduna dönüştürün veya Mors kodlarını metne çevirin. Sesli dinleyin, kopyalayın, WAV formatında indirin ve Türkçe karakter kurallarını öğrenin.
      </p>
    </section>
  );
}
