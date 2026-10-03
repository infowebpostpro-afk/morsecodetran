import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon, Upload, CheckCircle, AlertTriangle, Zap, Copy, Check,
  Play, Square, ShieldCheck, Eye, ChevronDown, ChevronUp, Camera, Sliders, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToText, translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';
import { processImageForMorse } from '../engine/imageDecoderEngine.js';

export function TurkishImageDecoderPage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [threshold, setThreshold] = useState(128);
  const [contrast, setContrast] = useState(1.0);
  const [invert, setInvert] = useState(false);

  const [processedCanvasUrl, setProcessedCanvasUrl] = useState(null);
  const [detectedMorse, setDetectedMorse] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (showToast) showToast('Lütfen geçerli bir görsel dosyası yükleyin (PNG, JPG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        runDetection(event.target.result, { threshold, contrast, invert });
      };
      reader.readAsDataURL(file);
    }
  };

  const runDetection = (src, opts) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const result = processImageForMorse(img, opts);
      setProcessedCanvasUrl(result.processedDataUrl);
      setDetectedMorse(result.detectedMorse);
      setConfidence(result.confidence);
      setIsProcessing(false);
      if (showToast) showToast('Optik görsel analizi tamamlandı ✓');
    };
  };

  const loadSampleImage = (sampleType) => {
    let sampleText = '.... . .-.. .-.. --- / .-- --- .-. .-.. -..';
    if (sampleType === 'sos') sampleText = '... --- ...';
    if (sampleType === 'cq') sampleText = '-.-. --.- / -.-. --.-';
    
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sampleText, canvas.width / 2, canvas.height / 2);
    
    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    runDetection(dataUrl, { threshold, contrast, invert });
  };

  const decodedText = translateMorseToText(detectedMorse);

  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  const handleCopy = (id, textToCopy, label = 'Panoya kopyalandı!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const faqs = [
    {
      q: "Görsel veya fotoğraftaki Mors kodunu çözebilir miyim?",
      a: "Evet. Görsel Mors Kodu Çözücümüz fotoğraf, ekran görüntüsü veya çizimdeki görünür nokta ve çizgileri analiz eder. Pikselleri siyah-beyaz ikili formata dönüştürür, işaret ve boşluk uzunluklarını tespit eder ve anında okunabilir metne çevirir."
    },
    {
      q: "Ekran görüntüsündeki Mors kodu çözülebilir mi?",
      a: "Evet. Net ekran görüntüleri (özellikle PNG formatı) en ideal girdilerdir çünkü keskin kenarlara, yüksek kontrasta ve sıkıştırma parazitlerinden arındırılmış piksellere sahiptir."
    },
    {
      q: "Görsel çözücü el yazısıyla yazılmış Mors kodunu okuyabilir mi?",
      a: "Nokta ve çizgiler belirgin, eşit kalınlıkta ve aralıklı çizilmişse el yazısı da çözülebilir. Ancak eğri çizgiler veya birbirine yapışmış noktalar hata oluşturabilir. Tespit edilen Mors kodunu sağ panelden el ile düzenleyebilirsiniz."
    },
    {
      q: "Dövmedeki Mors kodunu fotoğraftan çözebilir miyim?",
      a: "Evet. Dövmenin fotoğrafı dik açıyla, iyi aydınlatılmış ve parlamasız olarak çekildiğinde araç noktaları ve çizgileri tespit eder. Derinin kıvrımından kaynaklanan sapmaları önlemek için fotoğrafı doğrudan karşıdan çekmeniz önerilir."
    },
    {
      q: "Görsel çözücü neden hatalı veya anlamsız metin üretti?",
      a: "Düşük kontrast, gölgeler, yanlış eşik (threshold) değeri veya harfler arasındaki boşlukların görselde ayırt edilememesi hatalara yol açabilir. Eşik kaydırıcısını ayarlayabilir, renk ters çevirmeyi açabilir veya tespit edilen ara Mors kodunu metin kutusundan el ile düzeltebilirsiniz."
    },
    {
      q: "Görsel çözücü ile metin tabanlı Mors çevirici arasındaki fark nedir?",
      a: "Mors kodu bir resim veya fotoğrafın içindeyse Görsel Çözücüyü kullanın. Elinizde zaten klavyeyle yazılmış nokta ve çizgiler varsa standart Mors Kodu Çözücü aracımızı tercih edin."
    },
    {
      q: "Bu araç standart OCR (Optik Karakter Tanıma) ile aynı mıdır?",
      a: "Tam olarak değil. Standart OCR motorları (Tesseract gibi) matbaa harflerini (A–Z) tanımaya odaklıdır. Görsel Mors motorumuz ise nokta-çizgi piksel genişliklerini ve boşluk oranlarını doğrudan geometrik olarak analiz eder."
    }
  ];

  return (
    <article className="article-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Görsel Mors Kodu Çözücü</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header className="article-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <ImageIcon size={16} />
          <span>Optik Bilgisayarlı Görü Aracı (Computer Vision)</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Görsel Mors Kodu Çözücü: Fotoğraf ve Resimlerden Mors Kodunu Çözün
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '850px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Bir resim, ekran görüntüsü veya fotoğrafta yer alan Mors kodlarını tek tek elle yazmakla uğraşmayın. Görselinizi yükleyin; istemci taraflı optik analiz motorumuz pikselleri ikiliye dönüştürsün, nokta ve çizgileri tespit edip anında metne çevirsin.
        </p>

        {/* PRIVACY BADGES */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', padding: '0.85rem 1.15rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>%100 Tarayıcı İçi Gizlilik (Görseller Sunucuya Gönderilmez)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--primary)' }} />
            <span>Anlık HTML5 Canvas Piksel İşleme</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} style={{ color: 'var(--accent-amber)' }} />
            <span>Düzenlenebilir Ara Mors Kodu Doğrulaması</span>
          </div>
        </div>
      </header>

      {/* INTERACTIVE TOOL CARD */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface-elevated)', boxShadow: 'var(--shadow-md)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={22} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>Etkileşimli Görsel Mors Çözücü</span>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'var(--surface)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600 }}>
              HTML5 Canvas Vision Engine
            </span>
          </div>

          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Herhangi bir görseli (PNG, JPG, WEBP) veya ekran görüntüsünü yükleyin. Eşik ve karşıtlık ayarlarıyla nokta ve çizgi ayrıştırmasını optimize edin.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            
            {/* LEFT COLUMN: UPLOAD & PREVIEW */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--surface)',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                <Upload size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Fotoğraf veya Ekran Görüntüsü Seçin</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PNG, JPG, WEBP veya Panodan Yapıştırma</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Sample Buttons */}
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Örnek Deneyin:</span>
                <button
                  onClick={() => loadSampleImage('hello')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "Hello World"
                </button>
                <button
                  onClick={() => loadSampleImage('sos')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "SOS Çağrısı"
                </button>
                <button
                  onClick={() => loadSampleImage('cq')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "CQ Genel Çağrı"
                </button>
              </div>

              {/* Binarization Preview */}
              {imageSrc && (
                <div style={{ marginTop: '1.25rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Piksel İkili Önizleme:</span>
                    {isProcessing && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>Pikseller taranıyor...</span>}
                  </div>
                  <img
                    ref={imgRef}
                    src={processedCanvasUrl || imageSrc}
                    alt="Optik İşleme Önizlemesi"
                    style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#000' }}
                  />

                  {/* Sliders */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                      Eşik: <strong>{threshold}</strong>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={threshold}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setThreshold(val);
                          if (imageSrc) runDetection(imageSrc, { threshold: val, contrast, invert });
                        }}
                        style={{ display: 'block', width: '110px', marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                      />
                    </label>

                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={invert}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setInvert(val);
                          if (imageSrc) runDetection(imageSrc, { threshold, contrast, invert: val });
                        }}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Renkleri Ters Çevir
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETECTED & DECODED OUTPUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Tespit Edilen Mors Kodu (Düzenlenebilir):
                  </label>
                  {detectedMorse && (
                    <button
                      onClick={() => handleCopy('morse', detectedMorse, 'Mors kodu kopyalandı ✓')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      {copiedId === 'morse' ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      {copiedId === 'morse' ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  )}
                </div>
                <textarea
                  value={detectedMorse}
                  onChange={(e) => setDetectedMorse(e.target.value)}
                  placeholder="Görsel yüklendiğinde optik olarak algılanan nokta ve çizgiler burada görünür..."
                  rows={4}
                  className="morse-font"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--signal-bright)', fontSize: '1.15rem', fontWeight: 700, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Çözümlenen Okunabilir Metin:
                  </label>
                  {decodedText && (
                    <button
                      onClick={() => handleCopy('text', decodedText, 'Metin kopyalandı ✓')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      {copiedId === 'text' ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      {copiedId === 'text' ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  )}
                </div>
                <div
                  style={{ width: '100%', minHeight: '90px', padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.25rem', fontWeight: 700, wordBreak: 'break-word', boxSizing: 'border-box' }}
                >
                  {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>Çözümleme sonucu burada görüntülenecektir...</span>}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {decodedText && (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handlePlayMorse('image-morse', decodedText)}
                    style={{ padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    {playingId === 'image-morse' ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
                    {playingId === 'image-morse' ? 'Sesi Durdur' : 'Mors Sesini Dinle'}
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* EDUCATIONAL ARTICLE */}
      <div className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* 1. PRINCIPLES & STANDARD */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Görsel Tabanlı Mors Çözümleme Nasıl Çalışır?
            </h2>
            <p>
              Uluslararası Mors Alfabesi (ITU-R M.1677-1 standardı), sinyallerin sürelerine dayalı katı oranlar belirler. Dijital bir görselde bu zamanlama oranları <strong>fiziksel piksel genişlikleri</strong> olarak tezahür eder:
            </p>
            <ul className="content-list" style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li><strong>Nokta (dit):</strong> 1 birim fiziksel piksel uzunluğu.</li>
              <li><strong>Çizgi (dah):</strong> Tam 3 birim fiziksel piksel uzunluğu (3 × nokta).</li>
              <li><strong>Harf içi öğe boşluğu:</strong> 1 birim beyaz boşluk.</li>
              <li><strong>Harfler arası boşluk:</strong> 3 birim beyaz boşluk.</li>
              <li><strong>Kelimeler arası boşluk:</strong> 7 birim beyaz boşluk.</li>
            </ul>
          </section>

          {/* 2. TECHNICAL PIPELINE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Optik Tarama Aşamaları (Teknik Boru Hattı)
            </h2>
            <ol className="content-list" style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li><strong>Görsel Yükleme:</strong> Tarayıcı, görsel verilerini HTML5 Canvas belleğine çizer.</li>
              <li><strong>Gri Tonlama (Grayscale):</strong> RGB kanalları standart lüminesans formülüyle (<code>Y = 0.299R + 0.587G + 0.114B</code>) tek bir parlaklık değerine indirgenir.</li>
              <li><strong>İkili Eşikleme (Binarization):</strong> Her piksel seçilen eşik değerine göre siyah veya beyaz olarak sınıflandırılır.</li>
              <li><strong>Yatay Tarama Çizgisi:</strong> Görselin orta bölgesinden yatay piksel serileri taranarak siyah işaretlerin ve beyaz boşlukların uzunlukları ölçülür.</li>
              <li><strong>Kümeleme Analizi:</strong> Kısa işaretler nokta (<code>.</code>), uzun işaretler ise çizgi (<code>-</code>) olarak etiketlenir.</li>
              <li><strong>Boşluk Ayrıştırması:</strong> Geniş beyaz aralıklar harf boşluğu veya kelime ayracı (<code>/</code>) olarak biçimlendirilir.</li>
            </ol>
          </section>

          {/* 3. INPUT QUALITY CHECKLIST */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Hangi Görseller En İyi Sonucu Verir?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)' }}>
                <strong style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={18} /> İdeal Girdi Koşulları
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <li>Keskin hatlı PNG ekran görüntüleri.</li>
                  <li>Yüksek kontrastlı siyah-beyaz zeminler.</li>
                  <li>Eğik olmayan, düz yatay metin çizgileri.</li>
                  <li>Noktalar ve çizgiler arasında net ayrım boşlukları.</li>
                </ul>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-amber)' }}>
                <strong style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={18} /> Dikkat Gerektiren Durumlar
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <li>Bulanık, düşük çözünürlüklü JPEG fotoğrafları.</li>
                  <li>Sert gölge ve flaş parlaması içeren çekimler.</li>
                  <li>Kıvrımlı cilt üzerindeki dövme fotoğrafları.</li>
                  <li>Düzensiz çizilmiş el yazısı Mors işaretleri.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. COMPARISON TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Görsel Çözücü vs. Metin Çözücü vs. Sesli Çeviri
            </h2>
            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Araç</th>
                    <th style={{ padding: '0.75rem' }}>Girdi Formatı</th>
                    <th style={{ padding: '0.75rem' }}>Kullanım Amacı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Görsel Mors Çözücü</td><td style={{ padding: '0.75rem' }}>Fotoğraf, PNG, JPG</td><td style={{ padding: '0.75rem' }}>Resim veya ekran görüntüsündeki Mors işaretlerini okumak</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>Mors Kodu Çözücü</td><td style={{ padding: '0.75rem' }}>Yazılı . ve - metinleri</td><td style={{ padding: '0.75rem' }}>Karakter boşluklarını denetleyip hatasız metne çevirmek</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Sesli Mors Çeviri</td><td style={{ padding: '0.75rem' }}>Ses tonları, WAV</td><td style={{ padding: '0.75rem' }}>Akustik sinyalleri dinleyip frekans zamanlamasını çözmek</td></tr>
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
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
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
                    {openFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {openFaqIdx === idx && (
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Metin Formatında Mors Kodunuz mu Var?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Nokta ve çizgilerle kopyaladığınız yazılı Mors kodlarını dönüştürmek için genel Mors Kodu Çözücümüzü kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-morsedecoder', '/tr/morse-code-decoder/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Kodu Çözücüye Git <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Mors Alfabesi Tablosu
              </button>
            </div>
          </section>

        </div>
      </div>

    </article>
  );
}
