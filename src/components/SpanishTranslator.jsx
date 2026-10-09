import React from 'react';
import {
  Copy, Play, Square, Repeat, Share2, Download,
  ArrowRightLeft, Trash2, Clipboard, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { SPANISH_QUICK_EXAMPLES, detectSpanishCharacters } from '../engine/spanishMorse.js';

export function SpanishTranslator({
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
        showToast('Pegado del portapapeles');
      }
    } catch {
      showToast('Por favor, pega manualmente usando Ctrl+V');
    }
  };

  const handleRandomExample = () => {
    const random = SPANISH_QUICK_EXAMPLES[Math.floor(Math.random() * SPANISH_QUICK_EXAMPLES.length)];
    setInputText(random.text);
    showToast(`Ejemplo cargado: ${random.label}`);
  };

  const detectedEsChars = detectSpanishCharacters(inputText);
  const effectiveDirection = mode === 'auto'
    ? (detectedType === 'morse' ? 'Morse → Texto' : 'Texto → Morse')
    : (mode === 'text2morse' ? 'Texto → Morse' : 'Morse → Texto');

  return (
    <section className="translator-container" id="translator">
      {/* CONNECTED APPLICATION WORKSPACE CARD */}
      <div className="workspace-card">
        {/* Topbar Mode Selector & Telemetry Status */}
        <div className="workspace-topbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="direction-selector" aria-label="Dirección de traducción">
            <button
              className={`dir-btn ${mode === 'auto' ? 'active' : ''}`}
              onClick={() => setMode('auto')}
              aria-pressed={mode === 'auto'}
            >
              Detectar automáticamente
            </button>
            <button
              className={`dir-btn ${mode === 'text2morse' ? 'active' : ''}`}
              onClick={() => setMode('text2morse')}
              aria-pressed={mode === 'text2morse'}
            >
              Texto → Morse
            </button>
            <button
              className={`dir-btn ${mode === 'morse2text' ? 'active' : ''}`}
              onClick={() => setMode('morse2text')}
              aria-pressed={mode === 'morse2text'}
            >
              Morse → Texto
            </button>
          </div>

          {/* Spanish Character Handling Mode Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-sunken)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Regla de caracteres:</span>
            <button
              type="button"
              className={`dir-btn ${charMode === 'standard' ? 'active' : ''}`}
              onClick={() => setCharMode('standard')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Estándar ITU-R M.1677-1: los caracteres con acentos se normalizan al alfabeto latino"
            >
              ITU Estándar (Normalización)
            </button>
            <button
              type="button"
              className={`dir-btn ${charMode === 'extended' ? 'active' : ''}`}
              onClick={() => setCharMode('extended')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Extensión española: la letra �Ñ usa un código especial (--.--)"
            >
              Español Extendido
            </button>
          </div>

          <div className="telemetry-status" aria-live="polite">
            <span className="status-dot"></span>
            <span>{mode === 'auto' ? `Detectado automáticamente (${detectedType === 'morse' ? 'MORSE' : 'TEXTO'})` : effectiveDirection}</span>
          </div>
        </div>

        {/* Spanish Diacritics Informative Alert Banner */}
        {detectedEsChars.length > 0 && mode !== 'morse2text' && (
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
                  <strong style={{ color: 'var(--text)' }}>Caracteres españoles:</strong> Tu texto contiene <strong>{detectedEsChars.join(', ')}</strong>. Según el estándar internacional ITU-R M.1677-1, las vocales con tilde se normalizan (Á→A, É→E, Í→I, Ó→O, Ú→U, Ü→U). La Ñ se convierte a N. Para usar códigos especiales, selecciona <em>Español Extendido</em> arriba.
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="var(--signal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text)' }}>Modo Extendido Español:</strong> La letra Ñ en tu texto se codifica con el código especial <code>--.--</code>. Las vocales con tilde siguen normalizadas al estándar ITU (Á→A, É→E, etc.) ya que no tienen códigos oficiales únicos.
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
              <span>ENTRADA ({mode === 'auto' ? (detectedType === 'morse' ? 'Código Morse' : 'Texto') : (mode === 'text2morse' ? 'Texto' : 'Código Morse')})</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-icon" onClick={handlePaste} title="Pegar del portapapeles" aria-label="Pegar del portapapeles">
                  <Clipboard size={14} />
                </button>
                {inputText && (
                  <button className="btn-icon" onClick={() => setInputText('')} title="Borrar entrada" aria-label="Borrar entrada">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              className={`panel-textarea ${detectedType === 'morse' ? 'morse-font' : ''}`}
              placeholder={
                mode === 'auto'
                  ? "Escribe texto o pega código Morse (Ej: HOLA MUNDO o .... --- .-.. .-.. --- / -- ..- -. -.. ---)..."
                  : mode === 'text2morse'
                  ? "Escribe el texto que quieres convertir a código Morse..."
                  : "Escribe código Morse con puntos (.) y guiones (-) (1 espacio entre letras, / o 3 espacios entre palabras)..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck="false"
              aria-label="Texto o código Morse para traducir"
            />
          </div>

          {/* CENTERED CIRCULAR SWAP BUTTON */}
          <div className="swap-wrapper">
            <button className="btn-swap-circle" onClick={onSwap} title="Intercambiar entrada y salida" aria-label="Intercambiar entrada y salida">
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* OUTPUT PANEL */}
          <div className="output-panel">
            <div className="panel-title">
              <span>SALIDA ({mode === 'auto' ? (detectedType === 'morse' ? 'Texto' : 'Código Morse') : (mode === 'text2morse' ? 'Código Morse' : 'Texto')})</span>
              <button
                className="btn-icon"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? "Repetición activada" : "Reproducir en bucle"}
                aria-label={isLooping ? "Repetición activada" : "Reproducir en bucle"}
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
              aria-label="Resultado de la traducción"
            >
              {outputText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>El resultado de la traducción aparecerá aquí en tiempo real...</span>}
            </div>
          </div>
        </div>

        {/* WORKSPACE ACTION BAR */}
        <div className="workspace-actionbar">
          <div className="counter-badge">
            {inputText.length} caracteres entrada | {outputText.length} caracteres salida
          </div>

          <div className="action-group">
            {/* Primary Action Button: Play / Stop Audio */}
            {isPlaying ? (
              <button className="btn-primary-cta" onClick={onStop} style={{ background: '#ef4444' }}>
                <Square size={14} /> Detener
              </button>
            ) : (
              <button className="btn-primary-cta" onClick={onPlay} disabled={!outputText}>
                <Play size={14} fill="currentColor" /> Reproducir audio
                <div className={`waveform-bars ${isPlaying ? 'playing' : ''}`}>
                  <span></span><span></span><span></span><span></span>
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <button className="btn-secondary-action" onClick={() => onCopy(outputText, 'Traducción')} disabled={!outputText}>
              <Copy size={14} /> Copiar
            </button>

            <button className="btn-secondary-action" onClick={() => onCopy(`${inputText}\n---\n${outputText}`, 'Ambos')} disabled={!outputText}>
              Copiar ambos
            </button>

            <button className="btn-secondary-action" onClick={onDownloadWav} disabled={!outputText} title="Descargar archivo WAV de audio">
              <Download size={14} /> Descargar WAV
            </button>

            <button className="btn-secondary-action" onClick={onShare} disabled={!inputText} title="Compartir enlace de traducción">
              <Share2 size={14} /> Compartir
            </button>
          </div>
        </div>
      </div>

      {/* QUICK EXAMPLES CHIP BAR */}
      <div className="examples-bar" aria-label="Ejemplos rápidos">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Prueba un ejemplo:</span>
        {SPANISH_QUICK_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            className="example-chip"
            onClick={() => {
              setInputText(ex.text);
              showToast(`Ejemplo cargado: ${ex.label}`);
            }}
            title={ex.desc}
          >
            {ex.label}
          </button>
        ))}
        <button className="example-chip" onClick={handleRandomExample} style={{ borderColor: 'var(--primary)' }}>
          <Sparkles size={12} style={{ color: 'var(--primary)', marginRight: '4px' }} /> Aleatorio
        </button>
      </div>
    </section>
  );
}
