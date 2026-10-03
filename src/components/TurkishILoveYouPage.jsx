import React, { useState } from 'react';
import {
  Heart, Play, Square, Copy, Check, Volume2, Sparkles, BookOpen,
  ChevronDown, ChevronUp, Flashlight, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const ROMANTIC_PHRASES = [
  { phrase: 'Seni Seviyorum', morse: '... . -. .. / ... . ...- .. -.-- --- .-. ..- --' },
  { phrase: 'I Love You', morse: '.. / .-.. --- ...- . / -.-- --- ..-' },
  { phrase: 'Aşkım', morse: '.- ... -.- .. --' },
  { phrase: 'Seni Özledim', morse: '... . -. .. / --- --.. .-.. . -.. .. --' },
  { phrase: 'Benim Ol', morse: '-... . -. .. -- / --- .-..' },
  { phrase: 'Öp Beni', morse: '--- .--. / -... . -. ..' }
];

export function TurkishILoveYouPage({ wpm = 18, frequency = 550, volume = 0.5, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState(null);

  const phraseText = 'SENI SEVIYORUM';
  const phraseMorse = '... . -. .. / ... . ...- .. -.-- --- .-. ..- --';
  const breakdown = getCharacterBreakdown(phraseText, phraseMorse);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handlePlayPhrase = (item, index) => {
    if (playingPhraseIndex === index) {
      audioEngine.stop();
      setPlayingPhraseIndex(null);
      return;
    }
    const itemBreakdown = getCharacterBreakdown(item.phrase.toUpperCase(), item.morse);
    setPlayingPhraseIndex(index);
    audioEngine.playSequence({
      breakdown: itemBreakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingPhraseIndex(null);
      }
    });
  };

  const handleCopy = (text, label = 'Mors kodu') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast(`${label} panoya kopyalandı ✓`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast('"SENİ SEVİYORUM" ışık flaşı sinyali başlatıldı...');
    setTimeout(() => setIsFlashing(false), 4000);
  };

  const faqs = [
    {
      q: "Mors kodunda 'Seni Seviyorum' nasıl yazılır?",
      a: "Türkçe 'SENİ SEVİYORUM' ifadesi Mors kodunda '... . -. .. / ... . ...- .. -.-- --- .-. ..- --' olarak yazılır. İngilizce 'I LOVE YOU' ise '.. / .-.. --- ...- . / -.-- --- ..-' şeklindedir. Kelimeler arasına karışmaması için eğik çizgi ('/') konulur."
    },
    {
      q: "Mors kodunda sadece 'AŞK' veya 'LOVE' nasıl yazılır?",
      a: "İngilizce LOVE kelimesi '.-.. --- ...- .' olarak yazılır. L (.-..), O (---), V (...-) ve E (.) harflerinden oluşur."
    },
    {
      q: "El feneriyle ışıkla 'Seni Seviyorum' gönderilebilir mi?",
      a: "Evet! Noktalar için kısa ışık çakmaları, çizgiler için 3 kat uzun tutulan ışık çakmaları verilir. Harfler arasında kısa, kelimeler arasında ise daha uzun duraklama yapılır."
    },
    {
      q: "Mors kodu bileklik veya dövme için uygun mudur?",
      a: "Mors kodu, dışarıdan sadece şık bir çizgi-nokta deseni gibi görünen ancak ardında gizli bir anlam taşıyan takı ve dövme tasarımları için idealdir. Tasarımı kalıcı hale getirmeden önce mutlaka harf sayısını ve boşlukları teyit edin."
    },
    {
      q: "'143' sayısı Mors kodunda 'Seni Seviyorum' demek midir?",
      a: "Hayır. 143 sayısı İngilizce kelimelerin harf sayısına dayanan (I=1, LOVE=4, YOU=3) bir çağrı cihazı kısaltmasıdır. Mors kodundaki gerçek harf dizilimiyle hiçbir ilgisi yoktur."
    },
    {
      q: "'Seni Seviyorum' Mors kodunda kaç sinyalden oluşur?",
      a: "'SENİ SEVİYORUM' toplam 13 harften oluşur ve aralardaki boşluklarla birlikte zengin bir melodik ritim oluşturur."
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ffffff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.4s infinite alternate'
        }}>
          <div style={{ color: '#000', fontWeight: 900, fontSize: '2rem' }}>
            ⚡ IŞIK SİNYALİ: SENİ SEVİYORUM
          </div>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodunda Seni Seviyorum</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.12)', color: 'var(--accent-pink, #ec4899)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
          <Heart size={16} fill="var(--accent-pink, #ec4899)" /> Romantik Mors Kodu İfadesi
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Mors Kodunda Seni Seviyorum: Dinle, Kopyala ve Gönder
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Bazen en özel mesajlar gizli kaldığında daha anlamlıdır. Mors kodu, sevgi cümlenizi nokta ve çizgilerden oluşan zarif ve gizli bir şifreye dönüştürür.
        </p>
      </header>

      {/* MAIN INTERACTIVE CARD */}
      <section style={{ background: 'var(--surface-elevated)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-pink, #ec4899)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          MORS KODU ŞABLONU: SENİ SEVİYORUM
        </div>
        <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', wordBreak: 'break-all', marginBottom: '1.75rem', padding: '1.25rem', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          {phraseMorse}
        </div>

        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>İngilizce Eşdeğeri (I LOVE YOU):</span>
          <code className="morse-font" style={{ color: 'var(--signal-bright)', fontWeight: 700 }}>.. / .-.. --- ...- . / -.-- --- ..-</code>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: isPlaying ? 'var(--danger)' : 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
            {isPlaying ? 'Durdur' : 'Sesi Dinle'}
          </button>

          <button
            onClick={handleFlashSignal}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <Flashlight size={16} /> Işıkla Göster
          </button>

          <button
            onClick={() => handleCopy(phraseMorse, '"SENİ SEVİYORUM" Mors kodu')}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.95rem' }}
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            {copied ? 'Kopyalandı' : 'Kodu Kopyala'}
          </button>
        </div>
      </section>

      {/* EDUCATIONAL GUIDE */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* LETTER BREAKDOWN */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Harf Harf Çözümleme Dökümü
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { letter: 'S', code: '...' },
                { letter: 'E', code: '.' },
                { letter: 'N', code: '-.' },
                { letter: 'I', code: '..' },
                { letter: '[BOŞLUK]', code: '/' },
                { letter: 'S', code: '...' },
                { letter: 'E', code: '.' },
                { letter: 'V', code: '...-' },
                { letter: 'I', code: '..' },
                { letter: 'Y', code: '-.--' },
                { letter: 'O', code: '---' },
                { letter: 'R', code: '.-.' },
                { letter: 'U', code: '..-' },
                { letter: 'M', code: '--' }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'var(--surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>{item.letter}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--signal-bright)', marginTop: '0.2rem' }}>{item.code}</div>
                </div>
              ))}
            </div>
            <p>
              Harfler arasında standart 3 birimlik boşluk bırakılır; iki kelime arasındaki boşluk ise eğik çizgi (<code>/</code>) ile temsil edilir.
            </p>
          </section>

          {/* 4 METHODS TO SEND */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              "Seni Seviyorum" Mesajını Göndermenin 4 Romantik Yolu
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>⌨️ Metinle Gönderin</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Yukarıdaki Mors kodunu kopyalayıp WhatsApp, SMS veya bir mektubun sonuna gizli not olarak ekleyin.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>👉 Dokunarak Tıklatın</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Elinizi tutarken parmağınızla hafifçe avucuna vurun: 3 hızlı dokunuş (S), 1 dokunuş (E)...</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>🔦 Işıkla Flaşlayın</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Pencereden veya cep telefonu feneriyle kısa ve uzun ışık çakmalarıyla gizli mesaj gönderin.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>💎 Bileklik &amp; Kolye</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Yuvarlak boncukları nokta, uzun silindir boncukları çizgi yaparak özel tasarım takı hazırlayın.</p>
              </div>
            </div>
          </section>

          {/* JEWELRY & TATTOO CHECKLIST */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Dövme ve Takı Tasarımları İçin Kontrol Listesi
            </h2>
            <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} className="text-success" /> Kalıcı Tasarım Öncesi Doğrulama:
              </h3>
              <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
                <li>Hangi dilde yazacağınıza karar verin: Türkçe (<code>SENİ SEVİYORUM</code>) veya İngilizce (<code>I LOVE YOU</code>).</li>
                <li>Harflerin nokta ve çizgi adetlerini tek tek sayın.</li>
                <li>Harfler arasında net boşluk (farklı renkli boncuk veya boşluk) bırakıldığından emin olun. Bitişik yazılan noktalar harfi tamamen değiştirir.</li>
                <li>İki kelime arasına daha belirgin bir ayraç koyun.</li>
                <li>Hazırladığınız tasarımı sitemizdeki Mors Çözücüye girerek orijinal cümlenin çıktığını doğrulayın.</li>
              </ol>
            </div>
          </section>

          {/* 143 MYTH */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              143 Sayısı Mors Kodunda Ne Demektir?
            </h2>
            <p>
              Sosyal medyada <strong>143</strong> sayısının "Seni Seviyorum" anlamına geldiği sıkça görülür. Ancak <strong>143 bir Mors kodu değildir!</strong>
            </p>
            <p>
              143, İngilizcedeki kelimelerin harf adedinden türetilmiş eski bir çağrı cihazı (pager) kısaltmasıdır:
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0' }}>
              <div style={{ background: 'var(--surface-sunken)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, border: '1px solid var(--border)' }}>I = 1 harf</div>
              <div style={{ background: 'var(--surface-sunken)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, border: '1px solid var(--border)' }}>LOVE = 4 harf</div>
              <div style={{ background: 'var(--surface-sunken)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, border: '1px solid var(--border)' }}>YOU = 3 harf</div>
            </div>
            <p>
              143 sayısını Mors koduna çevirdiğinizde elde edeceğiniz kod (<code>.---- ....- ...--</code>) sadece rakamları temsil eder; "Seni Seviyorum" anlamına gelmez.
            </p>
          </section>

          {/* MORE ROMANTIC PHRASES */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Diğer Romantik Mors İfadeleri
            </h2>
            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>İfade</th>
                    <th style={{ padding: '0.75rem' }}>Mors Kodu</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Ses</th>
                  </tr>
                </thead>
                <tbody>
                  {ROMANTIC_PHRASES.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>{item.phrase}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--signal-bright)' }}>{item.morse}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handlePlayPhrase(item, idx)}
                          style={{ padding: '0.35rem 0.75rem', background: playingPhraseIndex === idx ? 'var(--danger)' : 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          {playingPhraseIndex === idx ? <Square size={12} /> : <Play size={12} />} {playingPhraseIndex === idx ? 'Durdur' : 'Dinle'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Sıkça Sorulan Sorular
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-elevated)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'inherit' }}>{faq.q}</h3>
                    {activeFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {activeFaq === idx && (
                    <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="content-section cta-banner" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Kendi Özel Sevgi Mesajınızı Çevirin</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Sevdiğiniz kişinin ismini, özel bir tarihi veya romantik bir cümleyi Mors koduna dönüştürmek için çeviricimizi açın.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'turkish', '/tr/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Kodu Çeviriciyi Aç <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-phrases', '/tr/morse-code-phrases/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Tüm Mors İfadeleri
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
