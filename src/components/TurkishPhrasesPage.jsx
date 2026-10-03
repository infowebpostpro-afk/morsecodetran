import React, { useState, useMemo } from 'react';
import {
  MessageSquare, Play, Square, Copy, Check, Radio, Volume2,
  ChevronDown, ChevronUp, BookOpen, Sparkles, Filter, ShieldCheck,
  HelpCircle, ArrowRight, Search
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const MASTER_PHRASES = [
  { text: 'MERHABA', morse: '-- . .-. .... .- -... .-', category: 'Selamlaşma', use: 'Standart dostça selamlama' },
  { text: 'HELLO', morse: '.... . .-.. .-.. ---', category: 'Selamlaşma', use: 'Uluslararası standart selamlama' },
  { text: 'GUNAYDIN', morse: '--. ..- -. .- -.-- -.. .. -.', category: 'Selamlaşma', use: 'Sabah selamlaşması' },
  { text: 'IYI GECELER', morse: '.. -.-- .. / --. . -.-. . .-.. . .-.', category: 'Selamlaşma', use: 'Akşam vedalaşması' },
  { text: 'HOSCAKAL', morse: '.... --- ... -.-. .- -.- .- .-..', category: 'Selamlaşma', use: 'Ayrılma ve vedalaşma' },
  { text: 'TESEKKUR EDERIM', morse: '- . ... . -.- -.- ..- .-. / . -.. . .-. .. --', category: 'Selamlaşma', use: 'Şükran ve teşekkür ifadesi' },
  { text: 'LUTFEN', morse: '.-.. ..- - ..-. . -.', category: 'Selamlaşma', use: 'Kibar rica' },
  { text: 'OZUR DILERIM', morse: '--- --.. ..- .-. / -.. .. .-.. . .-. .. --', category: 'Selamlaşma', use: 'Özür beyanı' },

  { text: 'SENI SEVIYORUM', morse: '... . -. .. / ... . ...- .. -.-- --- .-. ..- --', category: 'Sevgi & Duygusal', use: 'Romantik sevgi ilanı' },
  { text: 'I LOVE YOU', morse: '.. / .-.. --- ...- . / -.-- --- ..-', category: 'Sevgi & Duygusal', use: 'Evrensel aşk ifadesi' },
  { text: 'SENI OZLEDIM', morse: '... . -. .. / --- --.. .-.. . -.. .. --', category: 'Sevgi & Duygusal', use: 'Hasret ve özlem ifadesi' },
  { text: 'SONSUZA DEK', morse: '... --- -. ... ..- --.. .- / -.. . -.-', category: 'Sevgi & Duygusal', use: 'Sonsuz bağlılık sözü' },
  { text: 'BENIM OL', morse: '-... . -. .. -- / --- .-..', category: 'Sevgi & Duygusal', use: 'Romantik teklif' },

  { text: 'SOS', morse: '... --- ...', category: 'Acil Durum', use: 'Evrensel Mors acil imdat çağrısı' },
  { text: 'IMDAT', morse: '.. -- -.. .- -', category: 'Acil Durum', use: 'Türkçe acil yardım çağrısı' },
  { text: 'HELP', morse: '.... . .-.. .--.', category: 'Acil Durum', use: 'İngilizce yardım talebi' },
  { text: 'TEHLIKE', morse: '- . .... .-.. .. -.- .', category: 'Acil Durum', use: 'Tehlike uyarısı' },
  { text: 'YARDIM GONDERIN', morse: '-.-- .- .-. -.. .. -- / --. --- -. -.. . .-. .. -.', category: 'Acil Durum', use: 'Acil destek talebi' },

  { text: 'DOGUM GUNUN KUTLU OLSUN', morse: '-.. --- --. ..- -- / --. ..- -. ..- -. / -.- ..- - .-.. ..- / --- .-.. ... ..- -.', category: 'Kutlama', use: 'Doğum günü tebriği' },
  { text: 'TEBRIKLER', morse: '- . -... .-. .. -.- .-.. . .-.', category: 'Kutlama', use: 'Başarı kutlaması' },
  { text: 'IYI SANSLAR', morse: '.. -.-- .. / ... .- -. ... .-.. .- .-.', category: 'Kutlama', use: 'Dilek ve teşvik' },
  { text: 'HOS GELDINIZ', morse: '.... --- ... / --. . .-.. -.. .. -. .. --..', category: 'Kutlama', use: 'Sıcak karşılama' },

  { text: 'EVET', morse: '. ...- . -', category: 'Temel Yanıtlar', use: 'Olumlu yanıt' },
  { text: 'HAYIR', morse: '.... .- -.-- .. .-.', category: 'Temel Yanıtlar', use: 'Olumsuz yanıt' },
  { text: 'TAMAM', morse: '- .- -- .- --', category: 'Temel Yanıtlar', use: 'Onaylama' },
  { text: 'YAKINDA GORUSURUZ', morse: '-.-- .- -.- .. -. -.. .- / --. --- .-. ..- ... ..- .-. ..- --..', category: 'Temel Yanıtlar', use: 'Ayrılık selamı' },

  { text: 'CQ', morse: '-.-. --.-', category: 'Amatör Telsiz (CW)', use: 'Tüm istasyonlara genel çağrı' },
  { text: 'QTH', morse: '--.- - ....', category: 'Amatör Telsiz (CW)', use: 'Konumum şurasıdır...' },
  { text: 'QSL', morse: '--.- ... .-..', category: 'Amatör Telsiz (CW)', use: 'Mesaj alındı ve onaylandı' },
  { text: '73', morse: '--... ...--', category: 'Amatör Telsiz (CW)', use: 'En iyi dileklerimle (kapanış)' },
  { text: '88', morse: '---.. ---..', category: 'Amatör Telsiz (CW)', use: 'Sevgi ve öpücüklerle' },
  { text: 'DE', morse: '-.. .', category: 'Amatör Telsiz (CW)', use: 'Buradan (çağrı işareti ön eki)' },
  { text: 'SK', morse: '...-.-', category: 'Amatör Telsiz (CW)', use: 'Görüşme sonu usul işareti' }
];

export function TurkishPhrasesPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingText, setPlayingText] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = ['Tümü', 'Selamlaşma', 'Sevgi & Duygusal', 'Acil Durum', 'Kutlama', 'Temel Yanıtlar', 'Amatör Telsiz (CW)'];

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredPhrases = useMemo(() => {
    return MASTER_PHRASES.filter(item => {
      const matchCat = selectedCategory === 'Tümü' || item.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.morse.includes(searchQuery) ||
        item.use.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePlaySound = (item) => {
    if (playingText === item.text) {
      audioEngine.stop();
      setPlayingText(null);
      return;
    }
    setPlayingText(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingText(null);
      }
    });
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    if (showToast) showToast(`"${text}" panoya kopyalandı ✓`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const faqs = [
    {
      q: "En popüler Mors kodu ifadeleri hangileridir?",
      a: "Dünya genelinde en çok kullanılan Mors ifadeleri arasında SOS, HELLO, SENİ SEVİYORUM, MERHABA, TEŞEKKÜR EDERİM, GÜNAYDIN ve İYİ GECELER yer alır. Amatör telsizcilikte ise CQ (genel çağrı), QTH (konum), QSL (onay) ve 73 (selamlar) en sık duyulan kalıplardır."
    },
    {
      q: "Mors alfabesinde cümle veya ifade nasıl yazılır?",
      a: "Her harf ayrı ayrı Mors koduna çevrilir. Harfler arasında standart olarak 1 boşluk bırakılır. Kelimelerin birbirine karışmaması için kelimeler arasına eğik çizgi ('/') konulur."
    },
    {
      q: "Mors kodunda 'SENİ SEVİYORUM' nasıl yazılır?",
      a: "'SENİ SEVİYORUM' Mors kodunda '... . -. .. / ... . ...- .. -.-- --- .-. ..- --' olarak yazılır. İngilizce 'I LOVE YOU' ise '.. / .-.. --- ...- . / -.-- --- ..-' şeklindedir."
    },
    {
      q: "Mors kodunda 'MERHABA' nasıl yazılır?",
      a: "'MERHABA' Mors kodunda '-- . .-. .... .- -... .-' olarak kodlanır. 7 harf grubunun her biri arasında bir boşluk bulunur."
    },
    {
      q: "Dövme veya bileklik tasarımlarında Mors kodları kullanılabilir mi?",
      a: "Evet! Mors kodu sade ve estetik nokta-çizgi dizilimleriyle zarif dövme ve takı tasarımları oluşturmak için çok popülerdir. Ancak tasarımı kalıcı hale getirmeden önce mutlaka harf sayısını, nokta-çizgi doğruluğunu ve kelime boşluklarını teyit edin."
    },
    {
      q: "Gerçek acil durumlarda HELP yerine SOS mi kullanılmalı?",
      a: "Evet. Denizcilikte ve havacılıkta 'HELP' kelimesi yerine uluslararası acil imdat prosign'ı olan '... --- ...' (SOS) kullanılır. SOS kesintisiz ve tek parça iletildiği için en gürültülü frekanslarda dahi derhal ayırt edilir."
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Yaygın Mors Kodu İfadeleri</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-card)', color: 'var(--primary)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <MessageSquare size={16} /> Keşif ve Referans Merkezi
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Yaygın Mors Kodu İfadeleri: Anlamları, Ritimleri ve Sözlüğü
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Günlük konuşma, sevgi mesajları, acil durum sinyalleri ve amatör telsiz kalıplarından oluşan zengin Mors ifadeleri koleksiyonunu keşfedin. Sinyalleri sesli dinleyin ve tek tıkla kopyalayın.
        </p>
      </header>

      {/* FILTER & SEARCH CARD */}
      <section style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 240px)' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İfade, Mors kodu veya anlam ara..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>{filteredPhrases.length}</strong> ifade bulundu
          </span>
        </div>

        {/* CATEGORY PILLS */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
                color: selectedCategory === cat ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.825rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PHRASES GRID */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
          {filteredPhrases.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface-elevated)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    {item.text}
                  </h3>
                  <span style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)' }}>
                    {item.category}
                  </span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--signal-bright)', wordBreak: 'break-word', marginBottom: '0.5rem' }}>
                  {item.morse}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {item.use}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handlePlaySound(item)}
                  style={{ flex: 1, padding: '0.5rem', background: playingText === item.text ? 'var(--danger)' : 'var(--surface)', color: playingText === item.text ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {playingText === item.text ? <Square size={14} /> : <Play size={14} />}
                  {playingText === item.text ? 'Durdur' : 'Dinle'}
                </button>

                <button
                  onClick={() => handleCopy(item.morse, idx)}
                  style={{ padding: '0.5rem 0.75rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {copiedIndex === idx ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  {copiedIndex === idx ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATIONAL GUIDE */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* HOW TO READ */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Mors Kodu İfadeleri Nasıl Okunur?
            </h2>
            <p>
              Mors kodu harfleri ve sayıları noktalar (dit) ve çizgilerle (dah) ifade eder. Yazılı Mors alfabesinde her harf grubu arasına tek bir boşluk, kelimeler arasına ise karışıklığı önlemek için eğik çizgi (<code>/</code>) konulur:
            </p>

            <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--signal-bright)', marginBottom: '1rem' }}>
              MERHABA = -- . .-. .... .- -... .-<br />
              SENI SEVIYORUM = ... . -. .. / ... . ...- .. -.-- --- .-. ..- --
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <em>Not:</em> Eğik çizgi (<code>/</code>) yazılı metinde görsel ayrımı sağlamak için kullanılır. Gerçek telsiz aktarımında kelimeler arasına 7 birimlik sessizlik (bekleme) konulur.
            </p>
          </section>

          {/* TAXONOMY */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              İfade vs. Usul İşareti (Prosign) vs. Q-Kodu
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>💬 Standart İfade</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Doğal dildeki kelimelerin harf harf kodlanmasıdır. Örn: <code>TESEKKURLER</code>.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>⚡ Usul İşareti (Prosign)</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Harfler arasında boşluk bırakılmadan tek bir simge gibi birleşik iletilen telsiz komutlarıdır. Örn: <code>SOS</code> (<code>...---...</code>), <code>SK</code> (<code>...-.-</code>).</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>📻 Q-Kodları ve Kısaltmalar</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Telsiz trafiğini hızlandırmak için kullanılan 3 harfli standart kodlar (<code>QTH</code> = konum, <code>QSL</code> = onay, <code>73</code> = selamlar).</p>
              </div>
            </div>
          </section>

          {/* TATTOO CHECKLIST */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Dövme ve Takı Tasarımları İçin Doğrulama Listesi
            </h2>
            <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} className="text-success" /> Kalıcı Hale Getirmeden Önce 7 Adımlı Kontrol:
              </h3>
              <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
                <li>Yazılacak Türkçe veya İngilizce ifadeyi tam olarak netleştirin.</li>
                <li>Uluslararası ITU-R M.1677-1 tablosundan her harfin kodunu kontrol edin.</li>
                <li>Nokta ve çizgi sayılarını tek tek sayarak doğrulayın.</li>
                <li>Harfler arasındaki boşlukların (veya farklı boncukların) korunduğundan emin olun.</li>
                <li>Kelimeler arasına belirgin bir boşluk ayracı koyun.</li>
                <li>Mors sesini dinleyerek ritmin kulakta doğru duyulduğunu teyit edin.</li>
                <li>Elinizdeki çizimi Mors → Metin çözücümüze yapıştırıp orijinal metinle birebir eşleştiğini görün.</li>
              </ol>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Özel Bir Cümleyi Mors Koduna mı Çevirmek İstiyorsunuz?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Buradaki kalıpların dışında kendi özel mesajlarınızı ve metinlerinizi çevirmek için Türkçe ve Uluslararası Mors çeviricimizi kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'turkish', '/tr/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Kodu Çeviriciyi Aç <ArrowRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
