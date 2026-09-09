import React, { useState } from 'react';
import {
  HelpCircle, BookOpen, Clock, Activity, Zap, CheckCircle, ShieldCheck, ArrowRight
} from 'lucide-react';

export function WhatIsMorseCodePage({ setActiveTab }) {
  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <HelpCircle size={16} /> Fundamental Guide & Overview
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          What is Morse Code? How It Works & History
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Explore the origins, technical mechanics, international timing standards, and modern uses of Morse code in telecommunications and aviation.
        </p>
      </header>

      {/* Section 1: Definition */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> Definition of Morse Code
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <strong>Morse Code</strong> is a character encoding scheme that allows text characters to be transmitted as a sequence of short and long signals (known as "dots" and "dashes" or "dits" and "dahs").
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Invented in the 1830s by Samuel Morse and Alfred Vail for the electrical telegraph, it revolutionized long-distance communication and formed the basis for modern digital data transmission.
        </p>
      </section>

      {/* Section 2: Precise Timing Engine */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> Standard International Morse Code Timing Rules
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          International Morse Code operates on strict mathematical proportions defined by ITU-R M.1677-1:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>DOT (DIT)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unit</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The basic unit of time measurement in Morse code.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>DASH (DAH)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Units</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Exactly three times the duration of a single dit.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>INTRA-CHARACTER GAP</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unit</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Pause between dits and dahs inside a character.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>WORD GAP</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>7 Units</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Pause between complete words.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
