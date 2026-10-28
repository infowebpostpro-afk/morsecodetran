import React from 'react';
import {
  Copy, Play, Square, Repeat, Share2, Download,
  ArrowRightLeft, Trash2, Clipboard, Sparkles, AlertCircle, Info
} from 'lucide-react';
import { PORTUGUESE_EXAMPLES } from '../engine/portugueseMorse.js';

export function PortugueseTranslator({
  mode,
  setMode,
  detectedType,
  inputText,
  setInputText,
  outputText,
  normalizedText = '',
  hasNormalization = false,
  error = null,
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
        showToast('Texto colado');
      }
    } catch {
      showToast('Por favor, cole manualmente usando Ctrl+V');
    }
  };

  const handleClear = () => {
    onStop();
    setInputText('');
    showToast('Entrada limpa');
  };

  const handleRandomExample = () => {
    const random = PORTUGUESE_EXAMPLES[Math.floor(Math.random() * PORTUGUESE_EXAMPLES.length)];
    setInputText(random.text);
    showToast(`Exemplo carregado: ${random.label}`);
  };

  const effectiveDirection = mode === 'auto'
    ? (detectedType === 'morse' ? 'Morse → Texto' : 'Texto → Morse')
    : (mode === 'text2morse' ? 'Texto → Morse' : 'Morse → Texto');

  const inputLabel = mode === 'auto'
    ? (detectedType === 'morse' ? 'Código Morse detectado' : 'Texto detectado')
    : (mode === 'text2morse' ? 'Texto' : 'Código Morse');

  const outputLabel = mode === 'auto'
    ? (detectedType === 'morse' ? 'Texto' : 'Código Morse')
    : (mode === 'text2morse' ? 'Código Morse' : 'Texto');

  const inputPlaceholder = mode === 'morse2text' || (mode === 'auto' && detectedType === 'morse')
    ? 'Cole os pontos e traços. Separe as letras com espaços e as palavras com /.'
    : 'Digite ou cole seu texto aqui.';

  // Singular/plural Portuguese formatting for character count
  const inputCount = inputText.length;
  const outputCount = outputText.length;
  const inputCountText = inputCount === 1 ? '1 caractere na entrada' : `${inputCount} caracteres na entrada`;
  const outputCountText = outputCount === 1 ? '1 caractere no resultado' : `${outputCount} caracteres no resultado`;

  return (
    <section className="translator-container" id="translator" aria-label="Tradutor de código Morse interativo">
      {/* CONNECTED APPLICATION WORKSPACE CARD */}
      <div className="workspace-card">
        {/* Topbar Mode Selector & Telemetry Status */}
        <div className="workspace-topbar" style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div className="direction-selector" aria-label="Direção da conversão">
            <button
              className={`dir-btn ${mode === 'auto' ? 'active' : ''}`}
              onClick={() => { onStop(); setMode('auto'); }}
              aria-pressed={mode === 'auto'}
            >
              Detectar automaticamente
            </button>
            <button
              className={`dir-btn ${mode === 'text2morse' ? 'active' : ''}`}
              onClick={() => { onStop(); setMode('text2morse'); }}
              aria-pressed={mode === 'text2morse'}
            >
              Texto → Morse
            </button>
            <button
              className={`dir-btn ${mode === 'morse2text' ? 'active' : ''}`}
              onClick={() => { onStop(); setMode('morse2text'); }}
              aria-pressed={mode === 'morse2text'}
            >
              Morse → Texto
            </button>
          </div>

          {/* Editorial Note beside conversion modes */}
          <div
            className="conversion-modes-note"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              lineHeight: 1.35,
              maxWidth: '520px',
              padding: '0.2rem 0.5rem',
              background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}
          >
            <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>O tradutor converte caracteres. Ele não traduz o significado de uma mensagem entre idiomas.</span>
          </div>

          <div className="telemetry-status" aria-live="polite">
            <span className="status-dot"></span>
            <span>{mode === 'auto' ? `${detectedType === 'morse' ? 'Código Morse detectado' : 'Texto detectado'}` : effectiveDirection}</span>
          </div>
        </div>

        {/* Normalization Information Banner */}
        {hasNormalization && mode !== 'morse2text' && (
          <div
            style={{
              margin: '0.75rem 1rem 0',
              padding: '0.65rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.825rem',
              lineHeight: 1.45,
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text)' }}>
                Para esta conversão, os acentos foram removidos e Ç foi convertido em C. Confira o texto usado na conversão.
              </span>
            </div>
            {normalizedText && (
              <div style={{ paddingLeft: '1.5rem', fontSize: '0.8rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Texto usado na conversão: </strong>
                <code style={{ background: 'var(--surface)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                  {normalizedText}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Error / Validation Banner */}
        {error && (
          <div
            role="alert"
            style={{
              margin: '0.75rem 1rem 0',
              padding: '0.65rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              lineHeight: 1.45,
              color: 'var(--text)'
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Workspace Grid (Input vs Output) */}
        <div className="workspace-grid">
          {/* INPUT PANEL */}
          <div className="input-panel">
            <div className="panel-title">
              <span>Entrada ({inputLabel})</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-icon" onClick={handlePaste} title="Colar da área de transferência" aria-label="Colar da área de transferência">
                  <Clipboard size={14} />
                </button>
                {inputText && (
                  <button className="btn-icon" onClick={handleClear} title="Limpar" aria-label="Limpar">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              className={`panel-textarea ${mode === 'morse2text' || (mode === 'auto' && detectedType === 'morse') ? 'morse-font' : ''}`}
              placeholder={inputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck="false"
              aria-label="Entrada de texto ou código Morse para converter"
            />
          </div>

          {/* CENTERED CIRCULAR SWAP BUTTON */}
          <div className="swap-wrapper">
            <button className="btn-swap-circle" onClick={onSwap} title="Inverter direção" aria-label="Inverter direção">
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* OUTPUT PANEL */}
          <div className="output-panel">
            <div className="panel-title">
              <span>Resultado ({outputLabel})</span>
              <button
                className="btn-icon"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? "Repetição ativada" : "Reproduzir em loop"}
                aria-label={isLooping ? "Repetição ativada" : "Reproduzir em loop"}
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
              aria-label="Resultado da conversão"
            >
              {outputText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>O resultado aparecerá aqui.</span>}
            </div>
          </div>
        </div>

        {/* WORKSPACE ACTION BAR */}
        <div className="workspace-actionbar">
          <div className="counter-badge" aria-label="Contagem de caracteres">
            {inputCountText} | {outputCountText}
          </div>

          <div className="action-group">
            {/* Primary Action Button: Play / Stop Audio */}
            {isPlaying ? (
              <button className="btn-primary-cta" onClick={onStop} style={{ background: '#ef4444' }} aria-label="Parar">
                <Square size={14} /> Parar
              </button>
            ) : (
              <button className="btn-primary-cta" onClick={onPlay} disabled={!outputText} aria-label="Reproduzir áudio">
                <Play size={14} fill="currentColor" /> Reproduzir áudio
                <div className={`waveform-bars ${isPlaying ? 'playing' : ''}`}>
                  <span></span><span></span><span></span><span></span>
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <button className="btn-secondary-action" onClick={() => onCopy(outputText, 'Resultado')} disabled={!outputText} aria-label="Copiar resultado">
              <Copy size={14} /> Copiar resultado
            </button>

            <button className="btn-secondary-action" onClick={() => onCopy(`${inputText}\n---\n${outputText}`, 'Entrada e resultado')} disabled={!outputText} aria-label="Copiar entrada e resultado">
              Copiar entrada e resultado
            </button>

            <button className="btn-secondary-action" onClick={onDownloadWav} disabled={!outputText} title="Baixar áudio WAV" aria-label="Baixar áudio WAV">
              <Download size={14} /> Baixar áudio WAV
            </button>

            <button className="btn-secondary-action" onClick={onShare} disabled={!inputText} title="Compartilhar" aria-label="Compartilhar">
              <Share2 size={14} /> Compartilhar
            </button>

            {inputText && (
              <button className="btn-secondary-action" onClick={handleClear} title="Limpar" aria-label="Limpar">
                <Trash2 size={14} /> Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUICK EXAMPLES CHIP BAR */}
      <div className="examples-bar" aria-label="Experimente um exemplo">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Experimente um exemplo:</span>
        {PORTUGUESE_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            className="example-chip"
            onClick={() => {
              onStop();
              setInputText(ex.text);
              showToast(`Exemplo carregado: ${ex.label}`);
            }}
            title={ex.desc}
          >
            {ex.label}
          </button>
        ))}
        <button className="example-chip" onClick={handleRandomExample} style={{ borderColor: 'var(--primary)' }}>
          <Sparkles size={12} style={{ color: 'var(--primary)', marginRight: '4px' }} /> Exemplo aleatório
        </button>
      </div>
    </section>
  );
}
