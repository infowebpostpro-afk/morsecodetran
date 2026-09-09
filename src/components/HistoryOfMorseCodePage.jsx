import React from 'react';
import {
  Clock, BookOpen, ShieldCheck, Zap, Award, ExternalLink, Radio
} from 'lucide-react';

export function HistoryOfMorseCodePage({ setActiveTab }) {
  const timeline = [
    { year: '1837', title: 'Electrical Telegraph Patent', desc: 'Samuel Morse and Leonard Gale demonstrate electrical pulses over wire.' },
    { year: '1838', title: 'Alfred Vail & Dot-Dash System', desc: 'Alfred Vail creates the dot-dash system and assigns shorter signals to frequently used English letters like E and T.' },
    { year: '1844', title: 'First Historic Telegraph Message', desc: 'Samuel Morse sends the famous message "What hath God wrought" from Washington D.C. to Baltimore.' },
    { year: '1865', title: 'International Standardization', desc: 'The International Telegraph Union standardized Continental (International) Morse Code across Europe.' },
    { year: '1906', title: 'SOS Adopted at Berlin Convention', desc: 'SOS (... --- ...) was officially established as the universal international maritime distress signal.' },
    { year: '1912', title: 'Titanic Sinking & Maritime Radio Laws', desc: 'The Titanic transmitted both CQD and SOS signals, leading to mandatory 24/7 radio watch requirements for ships.' },
    { year: '1999', title: 'Global Maritime Distress Shift', desc: 'GMDSS satellite systems officially replaced Morse code as the mandatory international maritime safety standard.' }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Clock size={16} /> Historical Timeline & Origins
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          History of Morse Code: Samuel Morse to Modern Era
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Discover the complete historical evolution of Morse code, Samuel Morse and Alfred Vail's innovations, and how Morse code changed telecommunications forever.
        </p>
      </header>

      {/* Timeline Section */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Chronological Milestones
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          {timeline.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '90px', padding: '0.4rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '6px', fontWeight: 800, textAlign: 'center', fontSize: '1.1rem' }}>
                {item.year}
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
