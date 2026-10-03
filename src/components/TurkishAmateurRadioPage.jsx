import React, { useState } from 'react';
import {
  Radio, Volume2, ShieldCheck, ChevronDown, ChevronUp, BookOpen,
  Award, Wifi, Zap, ExternalLink, HelpCircle
} from 'lucide-react';

export function TurkishAmateurRadioPage({ setActiveTab }) {
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const qCodes = [
    { code: 'QRM', meaning: 'Diğer istasyonların paraziti var', detail: 'Sinyaliniz başka yayınlarla karışıyor (1–5 arası derecelendirilir).' },
    { code: 'QRN', meaning: 'Doğal atmosferik gürültü / statik parazit var', detail: 'Yıldırım, güneş patlaması veya statik elektrik gürültüsü.' },
    { code: 'QRO', meaning: 'Verici gücünü artırın', detail: 'Yüksek çıkış gücüyle yayın yapma isteği veya durumu.' },
    { code: 'QRP', meaning: 'Verici gücünü düşürün (Düşük Güç)', detail: 'Genellikle 5 Watt veya daha düşük güçle yapılan DX iletişimi.' },
    { code: 'QTH', meaning: 'Konumunuz / Bulunduğunuz yer neresi?', detail: 'İstasyonun coğrafi konumu, şehri veya Maidenhead Grid lokatörü.' },
    { code: 'QSO', meaning: 'İki istasyon arasında doğrudan telsiz görüşmesi', detail: 'Kayıt altına alınan geçerli bir telsiz teması.' },
    { code: 'QSL', meaning: 'Alındı onayı veriyorum / Teyit kartı', detail: 'Görüşmenin gerçekleştiğini onaylayan basılı veya elektronik kart.' },
    { code: 'QRZ', meaning: 'Beni kim çağırıyor?', detail: 'Çağrı işaretini tam alamadığınızda istasyondan kimliğini tekrar isteme.' },
    { code: 'QSB', meaning: 'Sinyalinizde sönümlenme (fading) var', detail: 'İyonosferik dalgalanmalar nedeniyle sinyalin yükselip alçalması.' },
    { code: 'QSY', meaning: 'Frekans değiştirin', detail: 'Başka bir frekansa veya banda geçme talebi (örn: QSY 7.030).' },
    { code: 'QSK', meaning: 'Tam araya girme (Full Break-in) modu', detail: 'Kendi manipleniz basılı değilken karşı tarafın sinyalini dinleyebilme.' }
  ];

  const faqs = [
    {
      q: "Amatör telsizcilikte Mors kodu neden CW (Sürekli Dalga) olarak adlandırılır?",
      a: "CW (Continuous Wave), modüle edilmemiş saf bir radyo frekansı taşıyıcı dalgasının bir anahtarla (maniple) kesintili olarak açılıp kapatılması prensibine dayanır. Ses modülasyonu içermediği ve dalga sürekli olduğu için bu ad verilmiştir."
    },
    {
      q: "CW modu neden sesli (SSB/FM) modlara göre daha uzağa ulaşır?",
      a: "Sesli bir SSB yayını yaklaşık 2.400–3.000 Hz bant genişliği kaplarken, bir Mors (CW) sinyali yalnızca 100–150 Hz bant genişliği kaplar. Vericinin tüm enerjisi bu çok dar spektruma odaklandığı için, CW modu sese göre 15–20 dB daha güçlü bir sinyal/gürültü (SNR) avantajı sağlar ve en zayıf dip gürültüsünde bile iyonosferden yansıyarak kıtaları aşar."
    },
    {
      q: "RST sinyal raporu nedir ve 599 ne anlama gelir?",
      a: "RST; Okunabilirlik (Readability 1–5), Sinyal Gücü (Signal Strength 1–9) ve Ton Kalitesi (Tone 1–9) ölçütlerinin birleşimidir. '599', sinyalin tamamen net okunabilir (5), son derece güçlü (9) ve saf DC tonunda mükemmel (9) olduğunu ifade eden altın standart rapordur."
    },
    {
      q: "Türkiye'de amatör telsiz lisansı almak için Mors kodu bilmek zorunlu mudur?",
      a: "Hayır. 2003 Cenevre ITU Dünya Radyokomünikasyon Konferansı (WRC-03) kararları doğrultusunda Türkiye'de Kıyı Emniyeti Genel Müdürlüğü (KEGM) sınavlarında Mors kodu zorunluluğu kaldırılmıştır. Ancak Mors kodu (CW), frekans bantlarının en prestijli ve verimli bölümlerini kapsadığı için amatörler tarafından gönüllü olarak en çok öğrenilen moddur."
    },
    {
      q: "Bir CW görüşmesinde '73' ve '88' ne anlama gelir?",
      a: "'73', amatör telsizcilikte 'En iyi dileklerimle / Saygılarımla' anlamına gelen evrensel vedalaşma kodudur. '88' ise daha samimi dostluklar veya eşler arasında kullanılan 'Sevgi ve öpücükler' anlamına gelir."
    },
    {
      q: "Amatör telsizde Düz Maniple ile Elektronik Maniple (Paddle) arasındaki fark nedir?",
      a: "Düz manipleye (straight key) operatör her noktanın ve çizginin süresini kendi eliyle basar. Elektronik manipleye (iambic paddle) ise sağa basıldığında cihaz otomatik olarak kusursuz çizgiler, sola basıldığında otomatik noktalar üretir; bu da yorulmadan 25–40 WPM gibi çok yüksek hızlara çıkmayı sağlar."
    }
  ];

  return (
    <div className="amateurradio-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Amatör Telsizde Mors Kodu</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Radio size={16} /> CW İşletim Kuralları & Telsiz Protokolleri
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Amatör Telsizde Mors Kodu (CW İşletim Rehberi)
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Radyo amatörlüğünün kalbi Sürekli Dalga (CW) modunu öğrenin. Q-kodları tablosu, RST sinyal raporlama sistemi, standart QSO görüşme akışı ve KEGM/TRAC yönetmelikleri.
        </p>
      </header>

      {/* Advantage Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', border: '1px solid var(--border)', background: 'rgba(56, 189, 248, 0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
              Neden CW Modu? Sesin Geçemediği Yerden Mors Geçer!
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Bir Mors (CW) sinyali yalnızca ~100 Hz bant genişliği kaplar. Sesli iletişimin (3.000 Hz) dip gürültüsünde tamamen boğulduğu olumsuz iyonosferik koşullarda veya 5 Watt gibi düşük güçlerde (QRP), CW sinyali binlerce kilometre ötedeki bir istasyon tarafından rahatlıkla duyulabilir.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Editorial Guide */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: Q-Codes Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            1. En Çok Kullanılan Amatör Telsiz Q-Kodları
          </h2>
          <p>
            Q-kodları, farklı dilleri konuşan telsiz operatörlerinin dil engeline takılmadan saniyeler içinde teknik bilgi alışverişi yapmasını sağlayan 3 harfli uluslararası telgraf kısaltmalarıdır:
          </p>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Kod</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Standart Telsiz Anlamı</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Kullanım Amacı</th>
                </tr>
              </thead>
              <tbody>
                {qCodes.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{item.code}</td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--text)' }}>{item.meaning}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: RST Reporting System */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            2. RST Sinyal Raporlama Sistemi (599 Ne Demek?)
          </h2>
          <p>
            CW temaslarında karşı istasyona sinyalinin kalitesini bildirmek için 3 haneli <strong>RST</strong> kodu iletilir:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.35rem' }}>R — Readability (Okunabilirlik: 1–5)</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Sinyalin ne kadar net ayırt edilebildiğini belirtir. 1 = Okunamıyor, 5 = Mükemmel şekilde okunabilir.
              </p>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--signal-bright)', marginBottom: '0.35rem' }}>S — Signal Strength (Sinyal Gücü: 1–9)</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Telsiz alıcısının S-metre göstergesindeki sinyal gücü seviyesidir. 1 = Çok zayıf, 9 = Çok güçlü sinyal.
              </p>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--accent-amber)', marginBottom: '0.35rem' }}>T — Tone (Ton Kalitesi: 1–9)</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Sadece CW moduna özeldir; üretilen sesin saflığını gösterir. 9 = Tamamen saf, vızıltısız DC tonu.
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.95rem' }}>
            Dolayısıyla <strong>"UR RST 599"</strong> raporu, sinyalinizin pürüzsüz, maksimum güçlü ve kristal berraklığında alındığını ifade eder (Yarışmalarda kısaca <strong>5NN</strong> olarak yazılır).
          </p>
        </section>

        {/* Section 3: Anatomy of a Standard CW QSO */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            3. Standart Bir CW QSO (Telsiz Teması) Akışı
          </h2>
          <p>
            Amatör telsizde tipik bir CW teması evrensel bir şablonu takip eder. İşte TA1ABC ile DL2XYZ istasyonları arasındaki örnek temas:
          </p>

          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <div><span style={{ color: 'var(--primary)', fontWeight: 700 }}>1. Genel Çağrı:</span> CQ CQ CQ DE TA1ABC TA1ABC K</div>
            <div><span style={{ color: 'var(--signal-bright)', fontWeight: 700 }}>2. Karşı İstasyon Cevabı:</span> TA1ABC DE DL2XYZ DL2XYZ KN</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 700 }}>3. Rapor & Konum:</span> DL2XYZ DE TA1ABC GM UR RST 599 599 OP MEHMET QTH ISTANBUL BT HW CPY? DL2XYZ DE TA1ABC K</div>
            <div><span style={{ color: 'var(--signal-bright)', fontWeight: 700 }}>4. Karşı Rapor:</span> TA1ABC DE DL2XYZ TNX FER RPRT UR 589 OP HANS QTH MUNICH RIG 100W ANT DIPOLE 73 SK DL2XYZ DE TA1ABC TU</div>
          </div>
        </section>

        {/* Section 4: Equipment & Keys */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            4. CW Ekipmanları: Düz Maniple vs Elektronik Paddle
          </h2>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Düz Maniple (Straight Key):</strong> Operatörün bilek kas gücüyle çalışan geleneksel telgraf anahtarıdır. Nokta ve çizgi süresi tamamen operatörün kontrolündedir. Genellikle 5–18 WPM arası hızlar için uygundur.</li>
            <li><strong>İambik Çift Kollu Paddle (Paddles):</strong> İki kola sahiptir. Sağa basıldığında dah, sola basıldığında dit üretilir. Cihaz içindeki keyer devresi zamanlamayı kusursuz tutar. 20–45+ WPM yüksek hızlar için standarttır.</li>
          </ul>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Pratik Sayfaları</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/morse-code-keyer/" onClick={(e) => handleNav(e, 'tr-keyer', '/tr/morse-code-keyer/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              İnteraktif Maniple Simülatörü →
            </a>
            <a href="/tr/morse-code-phrases/" onClick={(e) => handleNav(e, 'tr-phrases', '/tr/morse-code-phrases/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Yaygın Telgraf Kısaltmaları →
            </a>
            <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              İşitsel Dinleme Antrenörü →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Amatör Telsizde Mors Kodu Hakkında Sıkça Sorulan Sorular
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
