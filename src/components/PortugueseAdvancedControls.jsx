import React, { useState } from 'react';
import { Sliders, Zap, Smartphone, ChevronDown, ChevronUp, RotateCcw, X, Eye, Volume2 } from 'lucide-react';

export function PortugueseAdvancedControls({
  wpm,
  setWpm,
  farnsworthWpm,
  setFarnsworthWpm,
  frequency,
  setFrequency,
  waveform,
  setWaveform,
  volume,
  setVolume,
  flashEnabled,
  setFlashEnabled,
  vibrateEnabled,
  setVibrateEnabled,
  highlightPlayback = true,
  setHighlightPlayback = () => {},
  showCharacters = true,
  setShowCharacters = () => {},
  stats
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    setWpm(20);
    setFarnsworthWpm(20);
    setFrequency(600);
    setWaveform('sine');
    setVolume(0.5);
    setFlashEnabled(false);
    setVibrateEnabled(false);
    if (setHighlightPlayback) setHighlightPlayback(true);
    if (setShowCharacters) setShowCharacters(true);
  };

  return (
    <section className="advanced-section" aria-label="Configurações avançadas de áudio">
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          aria-expanded={isOpen}
          aria-label="Configurações avançadas de áudio"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--primary)' }} />
            <span>Configurações avançadas de áudio</span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isOpen && (
          <div className="controls-grid" style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem 1.5rem' }}>
            {/* Speed / WPM Control */}
            <div className="control-group">
              <div className="control-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Velocidade (WPM):</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{wpm} WPM</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={wpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setWpm(val);
                  if (farnsworthWpm > val) setFarnsworthWpm(val);
                }}
                className="slider-input"
                aria-label="Velocidade (WPM)"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                WPM significa palavras por minuto.
              </span>
            </div>

            {/* Farnsworth Spacing */}
            <div className="control-group">
              <div className="control-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Espaçamento Farnsworth:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{farnsworthWpm} WPM</span>
              </div>
              <input
                type="range"
                min="5"
                max={wpm}
                value={farnsworthWpm}
                onChange={(e) => setFarnsworthWpm(parseInt(e.target.value))}
                className="slider-input"
                aria-label="Espaçamento Farnsworth"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Aumenta os intervalos entre caracteres mantendo a velocidade dos sinais.
              </span>
            </div>

            {/* Frequency (Hz) */}
            <div className="control-group">
              <div className="control-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Frequência (Hz):</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="400"
                max="1000"
                step="10"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="slider-input"
                aria-label="Frequência (Hz)"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Faixa padrão para audição e radiotelegrafia (400 - 1000 Hz)
              </span>
            </div>

            {/* Waveform Selector */}
            <div className="control-group">
              <div className="control-label" style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Forma de onda:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', marginTop: '0.25rem' }}>
                {[
                  { value: 'sine', label: 'Senoidal' },
                  { value: 'square', label: 'Quadrada' },
                  { value: 'triangle', label: 'Triangular' },
                  { value: 'sawtooth', label: 'Dente de serra' }
                ].map((wf) => (
                  <button
                    key={wf.value}
                    type="button"
                    className={`dir-btn ${waveform === wf.value ? 'active' : ''}`}
                    onClick={() => setWaveform(wf.value)}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', textAlign: 'center' }}
                  >
                    {wf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume */}
            <div className="control-group">
              <div className="control-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Volume:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="slider-input"
                aria-label="Volume"
              />
            </div>

            {/* Display & Playback Options */}
            <div className="control-group">
              <div className="control-label" style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Opções visuais e reprodução:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={highlightPlayback}
                    onChange={(e) => setHighlightPlayback(e.target.checked)}
                  />
                  <Eye size={14} style={{ color: 'var(--primary)' }} />
                  <span>Destacar durante a reprodução</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showCharacters}
                    onChange={(e) => setShowCharacters(e.target.checked)}
                  />
                  <span>Mostrar caracteres</span>
                </label>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={flashEnabled}
                      onChange={(e) => setFlashEnabled(e.target.checked)}
                    />
                    <Zap size={14} style={{ color: 'var(--accent-amber)' }} /> Sinal luminoso
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={vibrateEnabled}
                      onChange={(e) => setVibrateEnabled(e.target.checked)}
                    />
                    <Smartphone size={14} style={{ color: 'var(--signal)' }} /> Vibração
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Reset settings and Close */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary-action"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                aria-label="Restaurar configurações"
              >
                <RotateCcw size={14} /> Restaurar configurações
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary-action"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                aria-label="Fechar"
              >
                <X size={14} /> Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
