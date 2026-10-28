import React from 'react';
import { Home, BookOpen, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

export function NotFoundPage({ setActiveTab }) {
  const isTr = typeof window !== 'undefined' && window.location.pathname.startsWith('/tr/');
  const isPt = typeof window !== 'undefined' && window.location.pathname.startsWith('/pt/');
  const isEs = typeof window !== 'undefined' && window.location.pathname.startsWith('/es/');

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.history.pushState({ tab }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    if (isPt) return "404 - Página Não Encontrada";
    if (isTr) return "404 - Sayfa Bulunamadı";
    if (isEs) return "404 - Página No Encontrada";
    return "404 - Page Not Found";
  };

  const getDesc = () => {
    if (isPt) return "A transmissão em código Morse que você procura não existe ou pode ter sido movida. Use os links abaixo para retornar ao tradutor ou explorar nossas referências.";
    if (isTr) return "Aradığınız Mors iletimi mevcut değil veya taşınmış olabilir. Aşağıdaki bağlantıları kullanarak çeviriciye dönebilir veya alfabemizi keşfedebilirsiniz.";
    if (isEs) return "La transmisión en código Morse que buscas no existe o ha sido movida. Utiliza los enlaces siguientes para volver al traductor o explorar nuestras referencias.";
    return "The Morse code transmission you are looking for does not exist or may have moved. Use the links below to return to the translator or explore our reference charts.";
  };

  return (
    <div className="not-found-container" style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)', marginBottom: '1.5rem' }}>
        <AlertTriangle size={48} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
        {getTitle()}
      </h1>

      <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        {getDesc()}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem', textAlign: 'left' }}>
        <a
          href={isPt ? "/pt/" : isTr ? "/tr/" : isEs ? "/es/" : "/"}
          onClick={(e) => handleNav(e, isPt ? 'portuguese' : isTr ? 'turkish' : isEs ? 'spanish' : 'translator', isPt ? '/pt/' : isTr ? '/tr/' : isEs ? '/es/' : '/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary)' }}>
            <Home size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>
            {isPt ? "Tradutor Morse" : isTr ? "Mors Çevirici" : isEs ? "Traductor Morse" : "Morse Translator"}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isPt ? "Converta texto e código Morse nos dois sentidos com áudio." : isTr ? "Metin ve Mors kodunu sesli olarak karşılıklı dönüştürün." : isEs ? "Convierte texto y código Morse en ambos sentidos con audio." : "Convert text to Morse and Morse to text with audio."}
          </span>
        </a>

        <a
          href={isPt ? "/pt/alfabeto-morse/" : isTr ? "/tr/morse-code-alphabet/" : isEs ? "/es/morse-code-alphabet/" : "/morse-code-alphabet/"}
          onClick={(e) => handleNav(e, isPt ? 'pt-alphabet' : isTr ? 'tr-alphabet' : isEs ? 'es-alphabet' : 'alphabet', isPt ? '/pt/alfabeto-morse/' : isTr ? '/tr/morse-code-alphabet/' : isEs ? '/es/morse-code-alphabet/' : '/morse-code-alphabet/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--signal)' }}>
            <BookOpen size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>
            {isPt ? "Alfabeto Morse" : isTr ? "Mors Alfabesi Harfleri" : isEs ? "Alfabeto Código Morse" : "Morse Alphabet"}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isPt ? "Tabela completa de letras, regras de tempo e sons." : isTr ? "A–Z harf tablosu, zamanlama kuralları ve sesli dinleme." : isEs ? "Tabla completa de letras A–Z y Ñ, reglas de tiempo y sonidos." : "Complete A–Z letters, timing rules, and sound clips."}
          </span>
        </a>

        <a
          href={isPt ? "/pt/decodificador-codigo-morse/" : isTr ? "/tr/morse-code-decoder/" : isEs ? "/es/morse-code-decoder/" : "/morse-code-decoder/"}
          onClick={(e) => handleNav(e, isPt ? 'pt-morsedecoder' : isTr ? 'tr-morsedecoder' : isEs ? 'es-morsedecoder' : 'morsedecoder', isPt ? '/pt/decodificador-codigo-morse/' : isTr ? '/tr/morse-code-decoder/' : isEs ? '/es/morse-code-decoder/' : '/morse-code-decoder/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
            <Activity size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>
            {isPt ? "Decodificador de Código Morse" : isTr ? "Mors Kodu Çözücü" : isEs ? "Decodificador Morse" : "Morse Decoder"}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isPt ? "Decodifique pontos e traços brutos e verifique o espaçamento." : isTr ? "Nokta ve çizgileri çözün, harf aralıklarını kontrol edin." : isEs ? "Decodifica puntos y rayas y verifica el espaciado." : "Decode raw dots and dashes and check spacing."}
          </span>
        </a>

        <a
          href={isPt ? "/learn-morse-code/" : isTr ? "/tr/learn-morse-code/" : isEs ? "/es/learn-morse-code/" : "/learn-morse-code/"}
          onClick={(e) => handleNav(e, isPt ? 'learn' : isTr ? 'tr-learn' : isEs ? 'es-learn' : 'learn', isPt ? '/learn-morse-code/' : isTr ? '/tr/learn-morse-code/' : isEs ? '/es/learn-morse-code/' : '/learn-morse-code/')}
          className="glass-panel"
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary-hover)' }}>
            <BookOpen size={22} />
            <ArrowRight size={16} />
          </div>
          <strong style={{ fontSize: '1.1rem' }}>
            {isPt ? "Aprender Código Morse (Inglês)" : isTr ? "Mors Alfabesi Nasıl Öğrenilir" : isEs ? "Aprender Código Morse" : "Learn Morse Code"}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isPt ? "Guia para iniciantes, métodos de áudio e dicas de prática." : isTr ? "Başlangıç rehberi, ses yöntemleri ve pratik önerileri." : isEs ? "Guía para principiantes, métodos de audio y consejos prácticos." : "Beginner guide, sound methods, and practice tips."}
          </span>
        </a>
      </div>

      <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Signal Status: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>404 NO_CARRIER</span> | --- ..- - / --- ..-. / -... --- ..- -. -.. ...
      </div>
    </div>
  );
}
