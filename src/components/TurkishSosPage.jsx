import React, { useState } from 'react';
import {
  AlertTriangle, Play, Square, Copy, Check, Radio, Volume2, ShieldCheck,
  ChevronDown, ChevronUp, Zap, HelpCircle, Flashlight, History, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const TIMELINE = [
  { year: '1905', title: 'Alman Telsiz Yönetmeliği', desc: 'Almanya ulusal telsiz yönetmeliğinde 3 nokta, 3 çizgi ve 3 noktadan oluşan acil imdat dizilimini yürürlüğe koydu.' },
  { year: '1906', title: 'Berlin Radyotelgraf Sözleşmesi', desc: 'Uluslararası Radyotelgraf Konferansı, SOS sinyalini küresel denizcilik acil durum işareti olarak resmen kabul etti.' },
  { year: '1908', title: 'Küresel Yürürlük Tarihi', desc: 'Berlin Sözleşmesi kararları 1 Temmuz 1908 tarihinde tüm dünyada uluslararası standart olarak yürürlüğe girdi.' },
  { year: '1912', title: 'Titanik Faciası', desc: 'Titanik telsiz operatörleri 15 Nisan 1912 gecesi hem eski CQD çağrısını hem de yeni resmi SOS sinyalini iletti.' },
  { year: '1999', title: 'GMDSS Sistemine Geçiş', desc: 'Küresel Deniz Tehlike ve Güvenlik Sistemi (GMDSS), ticari denizcilikte acil Mors haberleşmesinin yerini aldı.' }
];

const COMPARISON_TABLE = [
  { signal: 'SOS', type: 'Birleşik Mors Usul İşareti (Prosign)', use: 'Uluslararası Mors Acil İmdat Sinyali (...---...)', era: '1908–Günümüz' },
  { signal: 'CQD', type: 'Metin Tabanlı Mors Çağrısı', use: 'İlk Marconi Telsiz Acil Durum Sinyali', era: '1904–1910\'lar' },
  { signal: 'Mayday', type: 'Sesli Telsiz Prosedürü', use: 'Havacılık ve Denizcilik Sesli Acil Çağrısı', era: '1923–Günümüz' }
];

export function TurkishSosPage({ wpm = 15, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const sosMorseContinuous = '...---...';
  const sosMorseSpaced = '... --- ...';
  const sosText = 'SOS';

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
    const breakdown = getCharacterBreakdown(sosText, sosMorseSpaced);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 15,
      farnsworthWpm: wpm || 15,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: true,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast('SOS Mors kodu panoya kopyalandı ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast('SOS görsel ışık flaşı sinyali başlatıldı...');
    setTimeout(() => setIsFlashing(false), 4500);
  };

  const faqs = [
    {
      q: "SOS Mors kodunda nasıl yazılır?",
      a: "SOS Mors kodunda tam olarak '...---...' şeklinde yazılır: 3 kısa nokta, 3 uzun çizgi ve 3 kısa nokta. Telsiz aktarımında harfler arasında boşluk bırakılmadan tek bir birleşik sinyal gibi iletilir."
    },
    {
      q: "SOS neyin kısaltmasıdır?",
      a: "SOS hiçbir cümlenin veya ifadenin kısaltması (akronim) değildir! 'Save Our Souls' (Ruhlarımızı Kurtarın) veya 'Save Our Ship' (Gemimizi Kurtarın) ifadeleri sonradan uydurulmuş halk efsaneleridir (backronym). Sinyal, 3 nokta 3 çizgi 3 nokta ritminin telsiz parazitleri arasında en kolay ayırt edilen ve hata yapılması imkansız ritim olması nedeniyle seçilmiştir."
    },
    {
      q: "SOS ışıkla (fenerle) nasıl verilir?",
      a: "Bir el feneriyle: 3 kısa ışık çakması (nokta), 3 uzun tutulan ışık çakması (çizgi) ve 3 kısa ışık çakması (nokta) verilir. Birkaç saniye beklenip aynı döngü kurtarma ekipleri görene kadar tekrarlanır."
    },
    {
      q: "Bir yüzeye vurarak SOS verilebilir mi?",
      a: "Evet. Enkaz altında veya kapalı bir alanda kaldıysanız bir boruya veya duvara: 3 hızlı vuruş, 3 daha yavaş ve güçlü vuruş, ardından tekrar 3 hızlı vuruş yaparak sesli SOS gönderebilirsiniz."
    },
    {
      q: "Titanik gemisi SOS sinyali kullandı mı?",
      a: "Evet. 15 Nisan 1912 gecesi Titanik telsiz operatörleri Jack Phillips ve Harold Bride, gemi batarken hem eski İngiliz Marconi acil çağrısı olan CQD'yi hem de yeni kabul edilen resmi SOS sinyalini art arda iletmiştir."
    },
    {
      q: "SOS günümüzde denizcilikte hala kullanılıyor mu?",
      a: "Hayatta kalma ve fenerle görsel işaretleşmelerde SOS evrensel olarak tanınmaya devam etmektedir. Ancak modern denizcilikte ticari gemiler 1999 yılından bu yana Mors kodu yerine uydu ve dijital tabanlı GMDSS (Küresel Deniz Tehlike ve Güvenlik Sistemi) haberleşmesini kullanmaktadır."
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ef4444',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.35s infinite alternate'
        }}>
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', padding: '1rem' }}>
            🚨 ACİL İMDAT SİNYALİ: SOS (...---...)
          </div>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodunda SOS</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <AlertTriangle size={16} /> Uluslararası Acil İmdat Sinyali Rehberi
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Mors Kodunda SOS: Şablonu, Gerçek Anlamı ve Gönderme Yolları
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Dünyanın en bilinen acil imdat çağrısı olan <strong>SOS</strong> sinyalinin tam Mors kodu şablonu: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--danger)' }}>...---...</code>. 3 kısa nokta, 3 uzun çizgi ve 3 kısa nokta.
        </p>
      </header>

      {/* MAIN INTERACTIVE SOS MODULE */}
      <section style={{ background: 'var(--surface-elevated)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--danger)', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ULUSLARARASI TEHLİKE ÇAĞRISI
        </div>

        <div style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 900, color: 'var(--danger)', fontFamily: 'var(--font-mono)', letterSpacing: '6px', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
          {sosMorseContinuous}
        </div>

        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '1.5rem' }}>
          Yazılı Görsel Notasyon: {sosMorseSpaced}
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontWeight: 600 }}>
          3 kısa (dit) • 3 uzun (dah) • 3 kısa (dit)
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: isPlaying ? 'var(--danger)' : 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
            {isPlaying ? 'Sesi Durdur' : 'SOS Sesini Çal (Döngü)'}
          </button>

          <button
            onClick={handleFlashSignal}
            style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <Flashlight size={16} /> Işıkla Göster
          </button>

          <button
            onClick={() => handleCopy(sosMorseContinuous)}
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

          {/* CONTINUOUS PROSIGN VS SPACED */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Resmi Sinyal (...---...) ile Yazılı Notasyon (... --- ...) Farkı
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Resmi Telsiz Çağrısı (Prosign)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--signal-bright)' }}>...---...</div>
                <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0' }}>Harfler arasında duraklama olmaksızın, tek bir özel karakter gibi kesintisiz iletilir.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Okunabilir Metin Notasyonu</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text)' }}>... --- ...</div>
                <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0' }}>İnternette ve kitaplarda insanların S, O, S harflerini rahatça okuyabilmesi için boşluklu yazılır.</p>
              </div>
            </div>
            <p>
              1906 Berlin Radyotelgraf Sözleşmesi'nde bu sinyalin birleşik (aralıksız) iletilmesi şart koşulmuştur; bu sayede normal mesaj trafiğiyle karışması tamamen engellenmiştir.
            </p>
          </section>

          {/* MYTH BUSTER */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              SOS Gerçekte Ne Anlama Gelir? (Tarihi Efsanenin Sonu)
            </h2>
            <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '0.75rem' }}>
                Yanlış Bilinen Efsane: SOS "Save Our Souls" veya "Save Our Ship" Demek Değildir!
              </h3>
              <p style={{ margin: '0 0 1rem' }}>
                "Save Our Souls" (Ruhlarımızı Kurtarın) veya "Save Our Ship" (Gemimizi Kurtarın) ifadeleri, sinyal kabul edildikten yıllar sonra uydurulmuş sözcük yakıştırmalarıdır (backronym).
              </p>
              <p style={{ margin: 0 }}>
                SOS harfleri, tamamen <strong>3 nokta, 3 çizgi ve 3 nokta</strong> diziliminin sunduğu kusursuz simetri, akılda kalıcılık ve fırtınalı telsiz parazitleri arasında en acemi operatör tarafından dahi şüpheye yer bırakmayacak biçimde işitilebilmesi nedeniyle seçilmiştir.
              </p>
            </div>
          </section>

          {/* 4 WAYS TO SEND */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Acil Durumda SOS Nasıl Gönderilir?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>🔦 El Feneri</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>3 kısa çakma, 3 uzun çakma (3 kat süre), 3 kısa çakma. 5 saniye bekleyip tekrarlayın.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>🔊 Düdük / Ses</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>3 kısa düdük sesi, 3 uzun üfleme, 3 kısa düdük sesi.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>👉 Vurma / Tıklatma</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Enkazda boruya veya duvara: 3 hızlı vuruş, 3 kuvvetli yavaş vuruş, 3 hızlı vuruş.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>🪨 Yer İşaretleri</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Arazide taşlarla veya karda: 3 yuvarlak taş kümesi, 3 uzun çizgi, 3 yuvarlak taş kümesi.</p>
              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={22} color="var(--primary)" /> SOS Sinyalinin Tarihçesi
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {TIMELINE.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                    {item.year}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.25rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COMPARISON TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              SOS vs. CQD vs. Mayday Karşılaştırması
            </h2>
            <div className="table-responsive" style={{ marginTop: '1rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Sinyal</th>
                    <th style={{ padding: '0.75rem' }}>Türü</th>
                    <th style={{ padding: '0.75rem' }}>Kullanım Amacı</th>
                    <th style={{ padding: '0.75rem' }}>Dönemi</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--danger)' }}>{row.signal}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text)' }}>{row.type}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.use}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.era}</td>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Mors Alfabesini Detaylı Öğrenin</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              SOS sinyalinin ötesinde tüm harfleri, sayıları ve amatör telsiz kısaltmalarını öğrenmek için interaktif alıştırmalarımıza katılın.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-learn', '/tr/learn-morse-code/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Kodu Öğrenme Rehberi <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-phrases', '/tr/morse-code-phrases/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Yaygın Mors İfadeleri
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
