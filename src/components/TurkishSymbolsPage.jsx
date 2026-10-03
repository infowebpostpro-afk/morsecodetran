import React, { useState } from 'react';
import {
  Bookmark, Volume2, Copy, Play, Square, ShieldCheck, ChevronDown, ChevronUp,
  HelpCircle, Sparkles, BookOpen, ExternalLink
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export const TURKISH_PUNCTUATION_LIST = [
  { char: '.', name: 'Nokta (Period)', morse: '.-.-.-', ditDah: 'di-dah-di-dah-di-dah', desc: 'Cümle sonu işareti' },
  { char: ',', name: 'Virgül (Comma)', morse: '--..--', ditDah: 'dah-dah-di-di-dah-dah', desc: 'Cümle içi ayırıcı' },
  { char: '?', name: 'Soru İşareti (Question)', morse: '..--..', ditDah: 'di-di-dah-dah-di-dit', desc: 'Soru ve telsizde teyit talebi' },
  { char: '!', name: 'Ünlem İşareti (Exclamation)', morse: '-.-.--', ditDah: 'dah-di-dah-di-dah-dah', desc: 'Uyarı veya nida' },
  { char: ':', name: 'İki Nokta (Colon)', morse: '---...', ditDah: 'dah-dah-dah-di-di-dit', desc: 'Açıklama ve saat gösterimi' },
  { char: ';', name: 'Noktalı Virgül (Semicolon)', morse: '-.-.-.', ditDah: 'dah-di-dah-di-dah-dit', desc: 'Cümle bağlacı' },
  { char: "'", name: 'Kesme İşareti (Apostrophe)', morse: '.----.', ditDah: 'di-dah-dah-dah-dah-dit', desc: 'Özel isim eki ayırıcı' },
  { char: '"', name: 'Tırnak İşareti (Quotation)', morse: '.-..-.', ditDah: 'di-dah-di-di-dah-dit', desc: 'Alıntı ve doğrudan anlatım' },
  { char: '/', name: 'Eğik Çizgi (Slash)', morse: '-..-.', ditDah: 'dah-di-di-dah-dit', desc: 'Kesirli sayı ve kelime ayracı' },
  { char: '-', name: 'Tire / Eksi (Hyphen)', morse: '-....-', ditDah: 'dah-di-di-di-di-dah', desc: 'Kelime bağlama ve negatif sayılar' },
  { char: '_', name: 'Alt Tire (Underscore)', morse: '..--.-', ditDah: 'di-di-dah-dah-di-dah', desc: 'Metin altı çizgi notasyonu' },
  { char: '(', name: 'Sol Parantez (Left Parenthesis)', morse: '-.--.', ditDah: 'dah-di-dah-dah-dit', desc: 'Parantez açma' },
  { char: ')', name: 'Sağ Parantez (Right Parenthesis)', morse: '-.--.-', ditDah: 'dah-di-dah-dah-di-dah', desc: 'Parantez kapama' },
  { char: '=', name: 'Eşittir (Equals)', morse: '-...-', ditDah: 'dah-di-di-di-dah', desc: 'Eşitlik veya telgrafta paragraf ayrımı' },
  { char: '+', name: 'Artı (Plus)', morse: '.-.-.', ditDah: 'di-dah-di-dah-dit', desc: 'Toplama ve AR prosedür sinyali' },
  { char: '@', name: 'Et İşareti (At Sign)', morse: '.--.-.', ditDah: 'di-dah-dah-di-dah-dit', desc: '2004\'te ITU tarafından eklenen resmi e-posta işareti' },
  { char: '&', name: 'Ve İşareti (Ampersand)', morse: '.-...', ditDah: 'di-dah-di-di-dit', desc: 'ES işareti ve bağlantı' },
  { char: '$', name: 'Dolar İşareti (Dollar)', morse: '...-..-', ditDah: 'di-di-di-dah-di-di-dah', desc: 'Para birimi işareti' }
];

export const TURKISH_PROSIGNS_LIST = [
  { code: '<SOS>', morse: '...---...', name: 'Acil Durum Çağrısı', desc: 'Kesintisiz iletilen evrensel denizcilik ve can kurtarma tehlike sinyali.' },
  { code: '<AR>', morse: '.-.-.', name: 'Aktarım Sonu (Over)', desc: 'Mesajın bittiğini ve karşı taraftan yanıt beklendiğini bildirir.' },
  { code: '<AS>', morse: '.-...', name: 'Lütfen Bekleyin (Wait)', desc: 'Karşı istasyondan birkaç dakika beklemesini rica eder.' },
  { code: '<BT>', morse: '-...-', name: 'Yeni Paragraf / Ayraç', desc: 'Mesaj başlığı ile mesaj gövdesini veya paragrafları ayıran çizgi.' },
  { code: '<SK>', morse: '...-.-', name: 'Temas Sonu (Silent Key)', desc: 'Görüşmenin tamamen bittiğini ve istasyonun kapandığını ilan eder.' },
  { code: '<KN>', morse: '-.--.', name: 'Sadece Belirtilen İstasyon Cevap Versin', desc: 'Başka hiçbir istasyonun araya girmemesini emreder.' },
  { code: '<HH>', morse: '........', name: 'Hata (Error)', desc: 'Son kelimede hata yapıldığını, önceki kelimeden tekrar başlanacağını bildirir.' }
];

export function TurkishSymbolsPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingKey, setPlayingKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlayAudio = (char, morse) => {
    setPlayingKey(char);
    audioEngine.playSequence({
      breakdown: [{ char, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingKey(null);
      }
    });
  };

  const handleCopy = async (morse, label) => {
    try {
      await navigator.clipboard.writeText(morse);
      if (showToast) showToast(`${label} Mors kodu (${morse}) kopyalandı ✓`);
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  const faqs = [
    {
      q: "Mors alfabesinde semboller ve noktalama işaretleri neden harflerden daha uzundur?",
      a: "Harfler 1–4 eleman arasında, sayılar ise tam 5 elemandan oluşur. Karışıklığı tamamen önlemek için standart noktalama işaretleri genellikle 6 sinyal elemanından meydana gelir (örneğin nokta '.-.-.-' ve soru işareti '..--..'). Böylece alıcı bir harf mi yoksa cümle sonu işareti mi geldiğini anında anlar."
    },
    {
      q: "Prosign (Prosedür Sinyali) nedir ve normal harflerden farkı nedir?",
      a: "Prosign, iki harfin Mors kodunun aralarında hiçbir harf boşluğu bırakılmadan tek bir harf gibi kesintisiz çalınmasıdır. Örneğin 'SOS', S (...) ve O (---) ve S (...) harflerinin aralıksız birleşimi '...---...'dir. Matbaada bu özel sinyaller harflerin üzerine tek bir çizgi çekilerek veya <SOS>, <AR> şeklinde büyüktür-küçüktür işaretleri içinde gösterilir."
    },
    {
      q: "Mors alfabesine en son eklenen resmi işaret hangisidir?",
      a: "2004 yılında Uluslararası Telekomünikasyon Birliği (ITU), internet çağının gereği olarak e-posta adreslerinde kullanılan '@' (at / kuyruklu a) işaretini resmen Mors alfabesine eklemiştir. Kodu '.--.-.' olup, A (.-) ve C (-.-.) harflerinin birleşimidir. Bu, Mors alfabesine onlarca yıl sonra yapılan ilk resmi eklemedir."
    },
    {
      q: "Mors kodunda hata yapıldığında hangi işaret verilir?",
      a: "Bir Mors operatörü kelimeyi yazarken hata yaptığında 8 ardışık nokta ('........') gönderir (<HH> prosign'ı). Bu sinyal 'Son kelimeyi silin, baştan başlıyorum' anlamına gelir."
    },
    {
      q: "Telsiz telgrafında '=' (eşittir) işareti ne için kullanılır?",
      a: "Amatör telsizde '=' (<BT>) işareti genellikle matematiksel eşitlik için değil, cümle veya düşünce ayracı olarak kullanılır. Telsizciler konuşurken 'virgül' veya 'yeni satır' demek yerine araya '-...-' sinyali koyar."
    }
  ];

  return (
    <div className="symbols-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Alfabesi Sembolleri</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Bookmark size={16} /> Uluslararası Standart ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Alfabesi Sembolleri ve Noktalama İşaretleri Tablosu
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Nokta, virgül, soru işareti, eğik çizgi, 2004 '@' işareti ve tüm prosedür sinyallerinin (prosign) Mors kodlarını, sesli ritimlerini ve kullanım kurallarını keşfedin.
        </p>
      </header>

      {/* Prosigns Special Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} className="text-primary" /> Prosedür Sinyalleri (Prosigns)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Prosign'lar, aralarında harf boşluğu bırakılmadan <strong>tek bir kesintisiz sinyal bloğu</strong> halinde iletilen özel Mors komutlarıdır. Telsiz operatörleri mesaj sonunu, bekleme talebini ve acil durumları prosign'larla bildirir.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {TURKISH_PROSIGNS_LIST.map((p) => {
            const isPlayingThis = playingKey === p.code;
            return (
              <div
                key={p.code}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isPlayingThis ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isPlayingThis ? 'rgba(56, 189, 248, 0.08)' : 'var(--surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{p.code}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prosign</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '2px', marginBottom: '0.4rem' }}>
                    {p.morse}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                    {p.name}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handlePlayAudio(p.code, p.morse)}
                    className="btn"
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.45rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                  >
                    <Volume2 size={16} /> Dinle
                  </button>
                  <button
                    onClick={() => handleCopy(p.morse, p.code)}
                    className="btn"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                    title="Kodu Kopyala"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Punctuation Reference Table */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Tüm Noktalama İşaretleri Tablosu
        </h2>
        
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Sembol Adı</th>
                <th style={{ padding: '0.75rem 1rem' }}>Karakter</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mors Kodu</th>
                <th style={{ padding: '0.75rem 1rem' }}>Sesli Ritim</th>
                <th style={{ padding: '0.75rem 1rem' }}>Açıklama</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Dinle</th>
              </tr>
            </thead>
            <tbody>
              {TURKISH_PUNCTUATION_LIST.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</td>
                  <td style={{ padding: '0.65rem 1rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{item.char}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--signal-bright)', letterSpacing: '1px' }}><code>{item.morse}</code></td>
                  <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.ditDah}</td>
                  <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</td>
                  <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handlePlayAudio(item.char, item.morse)}
                      className="btn"
                      style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                      title={`${item.name} sesini dinle`}
                    >
                      <Volume2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comprehensive Editorial Content */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: Why 6-element codes */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Neden Noktalama İşaretleri 6 Elemanlıdır?
          </h2>
          <p>
            Uluslararası Mors alfabesinde karakter uzunlukları bilgi hiyerarşisine göre tasarlanmıştır:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Harfler:</strong> 1 ila 4 eleman (En sık kullanılanlar E: 1, T: 1; en nadir olanlar Q, Y, J: 4).</li>
            <li><strong>Sayılar:</strong> Kesinlikle 5 eleman (0–9 merdiven simetrisi).</li>
            <li><strong>Noktalama İşaretleri:</strong> Genellikle 6 elemandan oluşur (Örn: Nokta <code>.-.-.-</code>, Virgül <code>--..--</code>, Soru İşareti <code>..--..</code>).</li>
          </ul>
          <p>
            Bu uzunluk ayrımı, telsiz operatörünün gelen sinyali dinlerken hiçbir harf veya sayıyla karıştırmadan doğrudan bir noktalama veya duraklama işareti geldiğini anında ayırt etmesini sağlar.
          </p>
        </section>

        {/* Section 2: ITU 2004 @ Symbol Addition */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            2004 Yılında Mors Alfabesine Eklenen '@' (Et) İşareti
          </h2>
          <p>
            Mors alfabesinin statik ve donmuş bir sistem olduğu sanılır. Ancak 2004 yılında Uluslararası Telekomünikasyon Birliği (ITU), telgraf tarihinin en önemli güncellemelerinden birini yaparak e-posta adreslerinin telsiz üzerinden Mors koduyla iletilebilmesi için resmi <strong>'@' (At Sign)</strong> sembolünü sisteme eklemiştir.
          </p>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1rem 0' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>
              '@' İşaretinin Kodu: <code>.--.-.</code> (di-dah-dah-di-dah-dit). Bu kod, 'A' (<code>.-</code>) ile 'C' (<code>-.-.</code>) harflerinin birleşik kompozisyonudur ve 'Commercial At' kavramını simgeler.
            </p>
          </div>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Referans Sayfaları</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/morse-code-alphabet/" onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              A–Z Harf Tablosu →
            </a>
            <a href="/tr/morse-code-numbers/" onClick={(e) => handleNav(e, 'tr-numbers', '/tr/morse-code-numbers/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              0–9 Rakam Tablosu →
            </a>
            <a href="/tr/sos-in-morse-code/" onClick={(e) => handleNav(e, 'tr-sos', '/tr/sos-in-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              SOS Acil Durum Sinyali Analizi →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Sembolleri Hakkında Sıkça Sorulan Sorular
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
