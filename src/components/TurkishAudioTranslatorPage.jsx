import React, { useState, useMemo } from 'react';
import {
  Volume2, Play, Square, Download, Copy, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Sliders, Music, HelpCircle, Headphones, Mic, Radio, Check
} from 'lucide-react';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';
import { AudioDecoderModule } from './AudioDecoderModule.jsx';

export function TurkishAudioTranslatorPage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast,
  setActiveTab
}) {
  const [inputText, setInputText] = useState('CQ CQ CQ DE TA1');
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const morseCode = useMemo(() => {
    if (!inputText.trim()) return '';
    return translateTextToMorse(inputText);
  }, [inputText]);

  const breakdown = useMemo(() => {
    if (!inputText.trim()) return [];
    return getCharacterBreakdown(inputText, morseCode);
  }, [inputText, morseCode]);

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleCopyMorse = () => {
    if (!morseCode) return;
    navigator.clipboard.writeText(morseCode);
    setCopied(true);
    if (showToast) showToast('Mors kodu panoya kopyalandı ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWav = () => {
    if (!morseCode) return;
    try {
      const blob = audioEngine.generateWavBlob({
        morse: morseCode,
        wpm,
        farnsworthWpm,
        frequency,
        volume
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-audio-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('WAV ses dosyası indirildi ✓');
    } catch {
      if (showToast) showToast('Ses dosyası oluşturulamadı.');
    }
  };

  const faqs = [
    {
      q: "Mors Kodu Sesli Çeviri aracı sesi nasıl üretir?",
      a: "Araç, HTML5 Web Audio API teknolojisini kullanarak doğrudan tarayıcınızda gerçek zamanlı sinüzoidal ses dalgaları üretir. Uluslararası ITU-R M.1677-1 standardına uygun olarak noktalar (1 birim) ve çizgiler (3 birim) milisaniye hassasiyetinde sentezlenir."
    },
    {
      q: "Oluşturulan Mors sesini WAV formatında indirebilir miyim?",
      a: "Evet! 'WAV Dosyası İndir' butonuna tıklayarak stüdyo kalitesinde, sıkıştırmasız 44.1 kHz WAV ses dosyasını anında cihazınıza kaydedebilirsiniz."
    },
    {
      q: "Mors kodu dinlemek için en ideal ses frekansı (perde) nedir?",
      a: "Deneyimli amatör telsiz operatörleri kulak yorgunluğunu önlemek için 500 Hz ile 700 Hz arasındaki frekansları tercih ederler. ITU standardında CW haberleşmesi için 600 Hz referans ton olarak kabul edilir."
    },
    {
      q: "Mikrofondan gerçek ortamdaki Mors kodunu çözebilir miyim?",
      a: "Evet. Sayfamızın altındaki 'Canlı Mikrofon Ton Çözücü' modülünü etkinleştirerek odadaki hoparlörden, telsizden veya çevreden gelen Mors bip seslerini mikrofonunuzla dinleyip anında ekranda metne dönüştürebilirsiniz."
    },
    {
      q: "Paris standardı ile Mors iletim hızı nasıl hesaplanır?",
      a: "Uluslararası standartta 1 WPM (dakikada 1 kelime), 'PARIS' kelimesinin 50 birimlik zamanlamasına dayanır. Formül: 1 Dit Süresi (ms) = 1200 / WPM. Örneğin 20 WPM hızında 1 nokta 60 milisaniye, 1 çizgi ise 180 milisaniye sürer."
    },
    {
      q: "Mors sesinde rahatsız edici 'tıklama' (key click) gürültüsü neden oluşmaz?",
      a: "Ses sentezleyicimiz sinyal başlangıç ve bitişlerine 5 milisaniyelik zarf eğrisi (attack/decay envelope) uygulayarak hoparlörden kaynaklanabilecek parazit tıklamalarını tamamen filtreler."
    }
  ];

  return (
    <div className="audiotranslator-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Sesli Çeviri</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <Headphones size={16} />
          <span>Akustik Sentezleyici &amp; Canlı Mikrofon Çözücü</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Sesli Çeviri ve Akustik Sentezleyici
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Metinleri gerçeğe uygun radyo sinyali seslerine dönüştürün. Hız (WPM), ton frekansı (Hz) ve Farnsworth boşluklarını ayarlayın, WAV olarak indirin veya canlı mikrofonla ortamdaki Mors seslerini çözün.
        </p>
      </header>

      {/* AUDIO GENERATOR PANEL */}
      <div className="glass-panel" style={{ background: 'var(--surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Seslendirilecek Metin:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Metin girin (örn: CQ CQ CQ DE TA1, SOS, MERHABA...)"
            style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        {/* Audio Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem', background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Hız (WPM):</span>
              <strong style={{ color: 'var(--primary)' }}>{wpm} WPM</strong>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Farnsworth Hızı:</span>
              <strong style={{ color: 'var(--primary)' }}>{farnsworthWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={farnsworthWpm}
              onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Frekans (Hz):</span>
              <strong style={{ color: 'var(--primary)' }}>{frequency} Hz</strong>
            </div>
            <input
              type="range"
              min="400"
              max="1000"
              step="25"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Ses Seviyesi:</span>
              <strong style={{ color: 'var(--primary)' }}>{Math.round(volume * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>

        {/* Morse Output Preview */}
        <div style={{ marginBottom: '1.5rem', padding: '0.85rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oluşturulan Mors Kodu:</span>
            {morseCode && (
              <button
                onClick={handleCopyMorse}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--signal-bright)', fontWeight: 700, wordBreak: 'break-word' }}>
            {morseCode || '—'}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {!isPlaying ? (
            <button
              onClick={handlePlayAudio}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', background: 'var(--primary)', color: '#fff', border: 'none' }}
            >
              <Play size={16} fill="currentColor" /> Sesi Dinle
            </button>
          ) : (
            <button
              onClick={handleStopAudio}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', background: 'var(--danger)', color: '#fff', border: 'none' }}
            >
              <Square size={16} fill="currentColor" /> Sesi Durdur
            </button>
          )}

          <button
            onClick={handleDownloadWav}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
          >
            <Download size={16} /> WAV Dosyası İndir
          </button>
        </div>
      </div>

      {/* LIVE MICROPHONE TONE DECODER */}
      <section style={{ marginBottom: '3rem' }}>
        <AudioDecoderModule showToast={showToast} />
      </section>

      {/* EDUCATIONAL GUIDE */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Sesi Sentezi ve Frekans Seçimi
          </h2>
          <p>
            Mors kodu sesli olarak dinlendiğinde, insan kulağı için en ideal frekans aralığı <strong>550 Hz ile 700 Hz</strong> arasındadır. Amatör telsiz operatörleri genellikle uzun süreli dinlemelerde kulak yorgunluğunu (auditory fatigue) önlemek için 600 Hz civarında saf sinüzoidal tonları tercih ederler.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Paris Standardı ile Hız (WPM) Hesabı
          </h3>
          <p>
            Mors iletim hızı uluslararası alanda <strong>PARIS</strong> kelimesi baz alınarak hesaplanır. "PARIS" kelimesi harf ve kelime boşluklarıyla birlikte tam olarak 50 zamanlama birimine (50 dit) eşittir:
          </p>
          <p style={{ background: 'var(--surface-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: 'var(--signal-bright)' }}>
            1 Dit Süresi (ms) = 1200 / WPM
          </p>
          <p>
            Örneğin 20 WPM hızında bir nokta tam olarak 60 milisaniye, bir çizgi ise 180 milisaniye sürer.
          </p>

          {/* Related Tools */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Ses ve Pratik Sayfaları</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                Mors Dinleme ve Pratik Eğitimi →
              </a>
              <a href="/tr/morse-code-keyer/" onClick={(e) => handleNav(e, 'tr-keyer', '/tr/morse-code-keyer/')} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                Mors Maniple Tuşlayıcı →
              </a>
              <a href="/tr/how-to-read-morse-code/" onClick={(e) => handleNav(e, 'tr-howtoread', '/tr/how-to-read-morse-code/')} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                Mors Kodu Kulakla Nasıl Okunur? →
              </a>
            </div>
          </div>

        </div>
      </article>

      {/* FAQ SECTION */}
      <section style={{ maxWidth: '900px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <HelpCircle size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Sıkça Sorulan Sorular
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--text)', fontWeight: 600, fontSize: '1rem' }}
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </button>
              {openFaqIdx === idx && (
                <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.925rem', borderTop: '1px solid var(--border)' }}>
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
