import React from 'react';
import {
  Copy, Play, Square, Repeat, Share2, Download,
  ArrowRightLeft, Trash2, Clipboard, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { TURKISH_QUICK_EXAMPLES, detectTurkishCharacters } from '../engine/turkishMorse.js';

export function TurkishTranslator({
  mode,
  setMode,
  charMode,
  setCharMode,
  detectedType,
  inputText,
  setInputText,
  outputText,
  normalizedList = [],
  isPlaying,
  isLooping,
  setIsLooping,
  onPlay,
  onStop,
  onSwap,
  onCopy,
  onDownloadWav,
  onShare,
  showToast
}) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        showToast('Panodan yapıştırıldı');
      }
    } catch {
      showToast('Lütfen Ctrl+V kısayolu ile manuel yapıştırın');
    }
  };

  const handleRandomExample = () => {
    const random = TURKISH_QUICK_EXAMPLES[Math.floor(Math.random() * TURKISH_QUICK_EXAMPLES.length)];
    setInputText(random.text);
    showToast(`Örnek yüklendi: ${random.label}`);
  };

  const detectedTrChars = detectTurkishCharacters(inputText);
  const effectiveDirection = mode === 'auto'
    ? (detectedType === 'morse' ? 'Mors → Metin' : 'Metin → Mors')
    : (mode === 'text2morse' ? 'Metin → Mors' : 'Mors → Metin');

  return (
    <section className="translator-container" id="translator">
      {/* CONNECTED APPLICATION WORKSPACE CARD */}
      <div className="workspace-card">
        {/* Topbar Mode Selector & Telemetry Status */}
        <div className="workspace-topbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="direction-selector" aria-label="Çeviri Yönü">
            <button
              className={`dir-btn ${mode === 'auto' ? 'active' : ''}`}
              onClick={() => setMode('auto')}
              aria-pressed={mode === 'auto'}
            >
              Otomatik Algıla
            </button>
            <button
              className={`dir-btn ${mode === 'text2morse' ? 'active' : ''}`}
              onClick={() => setMode('text2morse')}
              aria-pressed={mode === 'text2morse'}
            >
              Metin → Mors
            </button>
            <button
              className={`dir-btn ${mode === 'morse2text' ? 'active' : ''}`}
              onClick={() => setMode('morse2text')}
              aria-pressed={mode === 'morse2text'}
            >
              Mors → Metin
            </button>
          </div>

          {/* Turkish Character Handling Mode Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-sunken)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Karakter Kuralı:</span>
            <button
              type="button"
              className={`dir-btn ${charMode === 'standard' ? 'active' : ''}`}
              onClick={() => setCharMode('standard')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Uluslararası ITU-R M.1677-1 standardı: Türkçe harfler Latin alfabesine sadeleştirilir"
            >
              ITU Standart (Sadeleştirme)
            </button>
            <button
              type="button"
              className={`dir-btn ${charMode === 'extended' ? 'active' : ''}`}
              onClick={() => setCharMode('extended')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Türkçe Telsiz/Telgraf Genişletilmiş Kodları: Ç, Ğ, Ö, Ş, Ü özel kodlarla çevrilir"
            >
              Türkçe Genişletilmiş
            </button>
          </div>

          <div className="telemetry-status" aria-live="polite">
            <span className="status-dot"></span>
            <span>{mode === 'auto' ? `Otomatik algılandı (${detectedType === 'morse' ? 'MORS' : 'METİN'})` : effectiveDirection}</span>
          </div>
        </div>

        {/* Turkish Diacritics Informative Alert Banner */}
        {detectedTrChars.length > 0 && mode !== 'morse2text' && (
          <div style={{
            margin: '0.75rem 1rem 0',
            padding: '0.65rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            background: charMode === 'standard' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${charMode === 'standard' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            fontSize: '0.825rem',
            lineHeight: 1.45,
            color: 'var(--text-secondary)'
          }}>
            {charMode === 'standard' ? (
              <>
                <AlertCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text)' }}>Türkçe Karakter Bildirimi:</strong> Metninizde yer alan <strong>{detectedTrChars.join(', ')}</strong> harfleri, uluslararası ITU-R M.1677-1 standardı gereğince Latin alfabesine (Ç→C, Ğ→G, İ/ı→I, Ö→O, Ş→S, Ü→U) sadeleştirilmiştir. Tersine çeviride (Mors → Metin) standart Latin harfleri üretilir. Özelleştirilmiş kodlar için yukarıdan <em>Türkçe Genişletilmiş</em> modunu seçebilirsiniz.
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="var(--signal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text)' }}>Türkçe Genişletilmiş Mod:</strong> Metninizdeki <strong>{detectedTrChars.join(', ')}</strong> karakterleri, Türkiye amatör telsiz ve telgraf kullanımında yer alan özel Mors kodlarıyla kodlanmaktadır (Ç: <code>-.-..</code>, Ğ: <code>--.-.</code>, Ö: <code>---.</code>, Ş: <code>----</code>, Ü: <code>..--</code>).
                </div>
              </>
            )}
          </div>
        )}

        {/* Workspace Grid (Input vs Output) */}
        <div className="workspace-grid">
          {/* INPUT PANEL */}
          <div className="input-panel">
            <div className="panel-title">
              <span>GİRİŞ ({mode === 'auto' ? (detectedType === 'morse' ? 'Mors Kodu' : 'Metin') : (mode === 'text2morse' ? 'Metin' : 'Mors Kodu')})</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-icon" onClick={handlePaste} title="Panodan Yapıştır" aria-label="Panodan Yapıştır">
                  <Clipboard size={14} />
                </button>
                {inputText && (
                  <button className="btn-icon" onClick={() => setInputText('')} title="Girişi Temizle" aria-label="Girişi Temizle">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              className={`panel-textarea ${detectedType === 'morse' ? 'morse-font' : ''}`}
              placeholder={
                mode === 'auto'
                  ? "Metin yazın veya Mors kodu yapıştırın (Örn: MERHABA DÜNYA veya -- . .-. .... .- -... .-)..."
                  : mode === 'text2morse'
                  ? "Çevirmek istediğiniz Türkçe veya yabancı metni girin..."
                  : "Nokta (.) ve tire (-) ile Mors kodunu girin (Harfler arası 1 boşluk, kelimeler arası / veya 3 boşluk)..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck="false"
              aria-label="Çevrilecek metin veya mors kodu"
            />
          </div>

          {/* CENTERED CIRCULAR SWAP BUTTON */}
          <div className="swap-wrapper">
            <button className="btn-swap-circle" onClick={onSwap} title="Giriş ve Çıktıyı Değiştir" aria-label="Giriş ve Çıktıyı Değiştir">
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* OUTPUT PANEL */}
          <div className="output-panel">
            <div className="panel-title">
              <span>ÇIKTI ({mode === 'auto' ? (detectedType === 'morse' ? 'Metin' : 'Mors Kodu') : (mode === 'text2morse' ? 'Mors Kodu' : 'Metin')})</span>
              <button
                className="btn-icon"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? "Döngü Açık" : "Döngüsel Oynat"}
                aria-label={isLooping ? "Döngü Açık" : "Döngüsel Oynat"}
                style={{ color: isLooping ? 'var(--primary)' : 'inherit' }}
              >
                <Repeat size={14} />
              </button>
            </div>

            <div
              className={`panel-textarea ${mode === 'text2morse' || (mode === 'auto' && detectedType === 'text') ? 'morse-font' : ''}`}
              style={{ overflowY: 'auto', userSelect: 'all' }}
              tabIndex={0}
              role="region"
              aria-label="Çeviri çıktısı"
            >
              {outputText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Çeviri sonucu anında burada görüntülenecektir...</span>}
            </div>
          </div>
        </div>

        {/* WORKSPACE ACTION BAR */}
        <div className="workspace-actionbar">
          <div className="counter-badge">
            {inputText.length} Giriş Karakteri | {outputText.length} Çıktı Karakteri
          </div>

          <div className="action-group">
            {/* Primary Action Button: Play / Stop Audio */}
            {isPlaying ? (
              <button className="btn-primary-cta" onClick={onStop} style={{ background: '#ef4444' }}>
                <Square size={14} /> Durdur
              </button>
            ) : (
              <button className="btn-primary-cta" onClick={onPlay} disabled={!outputText}>
                <Play size={14} fill="currentColor" /> Sesi Oynat
                <div className={`waveform-bars ${isPlaying ? 'playing' : ''}`}>
                  <span></span><span></span><span></span><span></span>
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <button className="btn-secondary-action" onClick={() => onCopy(outputText, 'Çeviri')} disabled={!outputText}>
              <Copy size={14} /> Kopyala
            </button>

            <button className="btn-secondary-action" onClick={() => onCopy(`${inputText}\n---\n${outputText}`, 'Her İkisi')} disabled={!outputText}>
              İkisini Kopyala
            </button>

            <button className="btn-secondary-action" onClick={onDownloadWav} disabled={!outputText} title="WAV Ses Dosyasını İndir">
              <Download size={14} /> Ses İndir (WAV)
            </button>

            <button className="btn-secondary-action" onClick={onShare} disabled={!inputText} title="Çeviri Bağlantısını Paylaş">
              <Share2 size={14} /> Paylaş
            </button>
          </div>
        </div>
      </div>

      {/* QUICK EXAMPLES CHIP BAR */}
      <div className="examples-bar" aria-label="Hızlı Örnekler">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Hızlı Örnek Seçin:</span>
        {TURKISH_QUICK_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            className="example-chip"
            onClick={() => {
              setInputText(ex.text);
              showToast(`Örnek yüklendi: ${ex.label}`);
            }}
            title={ex.desc}
          >
            {ex.label}
          </button>
        ))}
        <button className="example-chip" onClick={handleRandomExample} style={{ borderColor: 'var(--primary)' }}>
          <Sparkles size={12} style={{ color: 'var(--primary)', marginRight: '4px' }} /> Rastgele
        </button>
      </div>
    </section>
  );
}
