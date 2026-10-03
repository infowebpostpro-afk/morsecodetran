import React, { useState } from 'react';
import {
  HelpCircle, Volume2, Play, Square, ShieldCheck, Clock, BookOpen,
  Sparkles, Radio, Compass, Heart, AlertCircle, Copy, Check, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishWhatIsMorsePage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingId, setPlayingId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlayMorse = (id, morse) => {
    if (playingId === id) {
      audioEngine.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown: [{ char: id, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  const handleCopy = (id, text, msg) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (showToast) showToast(msg || 'Kopyalandı!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const faqs = [
    {
      q: "Mors alfabesi bir dil midir, yoksa bir kodlama sistemi mi?",
      a: "Mors alfabesi bağımsız bir dil değildir; bir karakter kodlama ve telekomünikasyon protokolüdür. Kendi grameri, kelime dağarcığı veya sentaksı yoktur. Var olan doğal dillerdeki (Türkçe, İngilizce vb.) harfleri ses, ışık veya elektrik darbelerine dönüştürerek aktarır."
    },
    {
      q: "Mors alfabesini kim buldu?",
      a: "Mors alfabesi 1830'lu ve 1840'lı yıllarda Amerikalı mucit ve ressam Samuel F. B. Morse ile ortağı makine mühendisi Alfred Vail tarafından geliştirilmiştir. Harflerin nokta-çizgi kodlama mantığı ve telgraf kayıt cihazının mekanik tasarımı büyük ölçüde Alfred Vail'in katkılarıyla şekillenmiştir."
    },
    {
      q: "Mors kodunda ilk resmi mesaj ne zaman ve ne olarak iletildi?",
      a: "24 Mayıs 1844 tarihinde Samuel Morse, Washington D.C.'deki ABD Kongre Binası'ndan Baltimore'daki Alfred Vail'e ilk resmi telgraf mesajını iletti: 'What hath God wrought?' (Tanrı neler yarattı? - İncil, Sayılar 23:23). Bu mesaj Amerikan Kongre Kütüphanesi arşivlerinde kayıtlıdır."
    },
    {
      q: "Dit ve Dah ne demektir?",
      a: "'Dit' kısa nokta darbesinin, 'Dah' ise noktanın tam 3 katı süren uzun çizgi darbesinin sesli telaffuzudur. Operatörler morsu görsel şekillerle değil bu fonetik ritimlerle öğrenir."
    },
    {
      q: "Mors alfabesi günümüzde nerelerde kullanılır?",
      a: "Modern dünyada Mors kodu: 1) Havacılıkta VOR ve NDB radyo seyrüsefer istasyonlarının kimlik yayınlarında, 2) Dünya çapında amatör telsizcilikte (CW modu en zayıf sinyallerde bile iyonosferden yansıyarak kıtalararası iletişimi sağlar), 3) Denizcilikte acil durum fener sinyallerinde, 4) Engelli bireyler için tek tuşlu yardımcı erişim teknolojilerinde aktif olarak kullanılmaktadır."
    },
    {
      q: "Mors alfabesinde SOS sinyali ne anlama gelir?",
      a: "SOS ('...---...'), 1906 Berlin Uluslararası Telsiz Telgraf Konvansiyonu'nda uluslararası deniz acil durum çağrısı olarak kabul edilmiştir. Popüler kültürde 'Save Our Souls' (Ruhlarımızı Kurtarın) veya 'Save Our Ship' (Gemimizi Kurtarın) sanılsa da, aslında hiçbir kelimenin kısaltması değildir. Gürültülü telsiz frekanslarında en kolay tanınan kesintisiz ritim olduğu için seçilmiştir."
    },
    {
      q: "Uluslararası Mors Kodu ile Amerikan Mors Kodu arasındaki fark nedir?",
      a: "Orijinal Amerikan Mors kodu harf içinde değişken boşluklar ve farklı uzunlukta çizgiler içeriyordu. 1848'de Friedrich Clemens Gerke tarafından Hamburg'da geliştirilen ve 1865 Paris Konferansı'nda standartlaşan 'Kıtasal (Uluslararası) Mors Kodu', harf içi boşlukları kaldırarak günümüzdeki evrensel 1-3-1-3-7 oranlı sistemi oluşturdu."
    }
  ];

  return (
    <div className="whatismorse-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Alfabesi Nedir</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Uluslararası Standart ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Alfabesi Nedir? Çalışma Prensipleri ve Önemi
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Metin karakterlerini kısa ve uzun elektrik darbelerine dönüştüren dünyanın ilk dijital haberleşme protokolünü keşfedin. Zamanlama oranları, tarihçesi, çalışma prensibi ve modern kullanım alanları.
        </p>
      </header>

      {/* Core Concept Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', border: '1px solid var(--border)', background: 'rgba(56, 189, 248, 0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
              Mors Alfabesi Bir Dil Değil, Bir Kodlama ve İletim Sistemidir
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Mors alfabesi Türkçe veya İngilizce gibi bağımsız bir dil değildir; var olan dillerin harflerini ses dalgalarına, elektrik sinyallerine veya ışık çakımlarına çeviren <strong>ikili (binary) bir telekomünikasyon protokolüdür</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Example Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Canlı Sesli Örnek Çeviri
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>Türkçe: <strong>MERHABA</strong></span>
            <span style={{ margin: '0 0.75rem', color: 'var(--text-muted)' }}>➔</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '2px' }}>
              -- . .-. .... .- -... .-
            </span>
          </div>
          <button
            onClick={() => handlePlayMorse('merhaba', '-- . .-. .... .- -... .-')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
          >
            {playingId === 'merhaba' ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
            {playingId === 'merhaba' ? 'Durdur' : 'MERHABA Sesini Dinle'}
          </button>
        </div>
      </div>

      {/* Comprehensive Editorial Content */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: How Does It Work & Timing Ratios */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={24} style={{ color: 'var(--primary)' }} /> Mors Kodu Nasıl Çalışır? Standart Zamanlama Oranları
          </h2>
          <p>
            Mors kodunun temelinde iki ana sinyal öğesi bulunur: <strong>Nokta (dit)</strong> ve <strong>Çizgi (dah)</strong>. Ancak sistemin asıl gücü, sinyaller kadar aralarındaki sessizlik boşluklarının da matematiksel olarak tanımlanmış olmasından gelir:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Nokta (Dit)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>1 Birim</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temel süre birimi</div>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Çizgi (Dah)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>3 Birim</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Noktanın tam 3 katı</div>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Öğe Boşluğu</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>1 Birim</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Harf içi sessizlik</div>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Harf Boşluğu</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>3 Birim</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Harfler arası duraklama</div>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Kelime Boşluğu</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>7 Birim</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kelimeler arası duraklama</div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Bu oranlar Uluslararası Telekomünikasyon Birliği'nin yürürlükteki <strong>ITU-R M.1677-1</strong> tavsiye kararı ile dünya genelinde standartlaştırılmıştır.
          </p>
        </section>

        {/* Section 2: Phonetic Pronunciation Dit and Dah */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={24} style={{ color: 'var(--primary)' }} /> "Dit" ve "Dah" Ne Demektir?
          </h2>
          <p>
            Mors kodunu sesli olarak söylerken nokta için "dit", çizgi için "dah" ifadeleri kullanılır. Kelimenin en sonundaki nokta tam "dit" olarak telaffuz edilirken, harf içindeki noktalar akıcılık için "di-" şeklinde kısaltılır:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ background: 'var(--surface-sunken)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>A Harfi (<code>.-</code>):</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>di-dah</span>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>B Harfi (<code>-...</code>):</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>dah-di-di-dit</span>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>S Harfi (<code>...</code>):</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>di-di-dit</span>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>O Harfi (<code>---</code>):</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>dah-dah-dah</span>
            </div>
          </div>
        </section>

        {/* Section 3: History & First Message */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Tarihsel Köken: Samuel Morse ve Alfred Vail
          </h2>
          <p>
            Elektrikli telgraf 1830'lu yıllarda geliştirildi. Samuel Morse fikrin öncüsü ve patent sahibi olurken, mekanik telgraf anahtarını ve harflerin kullanım sıklığına göre kodlanmasını ortağı <strong>Alfred Vail</strong> tasarladı (Smithsonian Enstitüsü Arşivleri, SIA Acc. 13782).
          </p>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', margin: '1.25rem 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>İlk Resmi Telgraf Mesajı (24 Mayıs 1844)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
              "What Hath God Wrought?" (Tanrı neler yarattı?)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Washington D.C. Kongre Binası'ndan Baltimore B&O Tren Garı'na başarıyla aktarılmıştır (Kongre Kütüphanesi Arşivi).
            </p>
          </div>
        </section>

        {/* Section 4: Modern Applications */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Alfabesinin Günümüzdeki Kullanım Alanları
          </h2>
          <p>
            Günümüzde uydular ve dijital fiber hatlar yaygın olsa da, Mors kodu en zorlu şartlarda kesintisiz iletişim sağlayan eşsiz bir teknolojidir:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <Compass size={18} /> Havacılık Seyrüseferi (VOR/NDB)
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Dünya genelindeki havalimanı ve rota radyo seyrüsefer istasyonları (VOR, DME, NDB), pilotların doğru frekansta olduğunu teyit etmesi için kimlik kodlarını 3 harfli Mors sesiyle yayınlar.
              </p>
            </div>

            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--signal-bright)', marginBottom: '0.5rem' }}>
                <Radio size={18} /> Amatör Telsizcilik (CW Modu)
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Sesli iletişimin dip gürültüsünde kaybolduğu zayıf sinyallerde ve düşük güçte (QRP), tek frekanslı Mors sinyali iyonosferden yansıyarak kıtaları aşar.
              </p>
            </div>

            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>
                <Heart size={18} /> Yardımcı Erişim Teknolojileri
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Felçli veya motor becerilerini kaybetmiş bireyler, tek bir butona veya göz kırpma sensörüne basarak Mors koduyla bilgisayar ve iletişim cihazlarını kontrol edebilir.
              </p>
            </div>
          </div>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>Önerilen İlgili Konular</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/history-of-morse-code/" onClick={(e) => handleNav(e, 'tr-history', '/tr/history-of-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Alfabesinin Tarihi →
            </a>
            <a href="/tr/morse-code-alphabet/" onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              A–Z Harf Tablosu →
            </a>
            <a href="/tr/sos-in-morse-code/" onClick={(e) => handleNav(e, 'tr-sos', '/tr/sos-in-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Kodu ile SOS (... --- ...) →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Alfabesi Hakkında Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
