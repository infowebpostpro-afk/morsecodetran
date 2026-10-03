import React from 'react';
import { Home, BookOpen, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

export function NotFoundPage({ setActiveTab }) {
  const isTr = typeof window !== 'undefined' && window.location.pathname.startsWith('/tr/');

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.history.pushState({ tab }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="not-found-container" style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)', marginBottom: '1.5rem' }}>
        <AlertTriangle size={48} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
        {isTr ? "404 - Sayfa Bulunamadı" : "404 - Page Not Found"}
      </h1>

      <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        {isTr
          ? "Aradığınız Mors iletimi mevcut değil veya taşınmış olabilir. Aşağıdaki bağlantıları kullanarak çeviriciye dönebilir veya alfabemizi keşfedebilirsiniz."
          : "The Morse code transmission you are looking for does not exist or may have moved. Use the links below to return to the translator or explore our reference charts."}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem', textAlign: 'left' }}>
        <a
          href={isTr ? "/tr/" : "/"}
          onClick={(e) => handleNav(e, isTr ? 'turkish' : 'translator', isTr ? '/tr/' : '/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary)' }}>
            <Home size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>{isTr ? "Mors Çevirici" : "Morse Translator"}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isTr ? "Metin ve Mors kodunu sesli olarak karşılıklı dönüştürün." : "Convert text to Morse and Morse to text with audio."}
          </span>
        </a>

        <a
          href={isTr ? "/tr/morse-code-alphabet/" : "/morse-code-alphabet/"}
          onClick={(e) => handleNav(e, isTr ? 'tr-alphabet' : 'alphabet', isTr ? '/tr/morse-code-alphabet/' : '/morse-code-alphabet/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--signal)' }}>
            <BookOpen size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>{isTr ? "Mors Alfabesi Harfleri" : "Morse Alphabet"}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isTr ? "A–Z harf tablosu, zamanlama kuralları ve sesli dinleme." : "Complete A–Z letters, timing rules, and sound clips."}
          </span>
        </a>

        <a
          href={isTr ? "/tr/morse-code-decoder/" : "/morse-code-decoder/"}
          onClick={(e) => handleNav(e, isTr ? 'tr-morsedecoder' : 'morsedecoder', isTr ? '/tr/morse-code-decoder/' : '/morse-code-decoder/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
            <Activity size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>{isTr ? "Mors Kodu Çözücü" : "Morse Decoder"}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isTr ? "Nokta ve çizgileri çözün, harf aralıklarını kontrol edin." : "Decode raw dots and dashes and check spacing."}
          </span>
        </a>

        <a
          href={isTr ? "/tr/learn-morse-code/" : "/learn-morse-code/"}
          onClick={(e) => handleNav(e, isTr ? 'tr-learn' : 'learn', isTr ? '/tr/learn-morse-code/' : '/learn-morse-code/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary-hover)' }}>
            <BookOpen size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>{isTr ? "Mors Alfabesi Nasıl Öğrenilir" : "Learn Morse Code"}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isTr ? "Başlangıç rehberi, ses yöntemleri ve pratik önerileri." : "Beginner guide, sound methods, and practice tips."}
          </span>
        </a>
      </div>

      <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Signal Status: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>404 NO_CARRIER</span> | --- ..- - / --- ..-. / -... --- ..- -. -.. ...
      </div>
    </div>
  );
}
