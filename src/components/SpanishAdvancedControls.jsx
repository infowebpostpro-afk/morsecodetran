import React, { useState } from 'react';
import { Sliders, Zap, Smartphone, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';

export function SpanishAdvancedControls({
  wpm,
  setWpm,
  farnsworthWpm,
  setFarnsworthWpm,
  frequency,
  setFrequency,
  volume,
  setVolume,
  flashEnabled,
  setFlashEnabled,
  vibrateEnabled,
  setVibrateEnabled,
  stats
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="advanced-section" aria-label="Ajustes avanzados de audio y velocidad">
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
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Ajustes avanzados de audio, velocidad y temporización (WPM y frecuencia)</span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isOpen && (
          <div className="controls-grid" style={{ borderTop: '1px solid var(--border-color)' }}>
            {/* WPM Control */}
            <div className="control-group">
              <div className="control-label">
                <span>Velocidad (WPM - Palabras por minuto):</span>
                <span style={{ color: 'var(--accent-primary)' }}>{wpm} WPM</span>
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
                aria-label="Ajuste de velocidad WPM"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Estándar internacional de velocidad de palabra PARIS (1 palabra = 50 unidades de punto)
              </span>
            </div>

            {/* Farnsworth Timing */}
            <div className="control-group">
              <div className="control-label">
                <span>Velocidad de espaciado Farnsworth:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{farnsworthWpm} WPM</span>
              </div>
              <input
                type="range"
                min="5"
                max={wpm}
                value={farnsworthWpm}
                onChange={(e) => setFarnsworthWpm(parseInt(e.target.value))}
                className="slider-input"
                aria-label="Ajuste de temporización Farnsworth"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Aumenta los espacios entre letras para facilitar el aprendizaje de escucha Morse
              </span>
            </div>

            {/* Audio Frequency */}
            <div className="control-group">
              <div className="control-label">
                <span>Frecuencia de tono:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="400"
                max="1000"
                step="10"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="slider-input"
                aria-label="Ajuste de frecuencia"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Estándar de escucha CW de radioaficionados (generalmente 550 - 700 Hz)
              </span>
            </div>

            {/* Audio Volume */}
            <div className="control-group">
              <div className="control-label">
                <span>Nivel de volumen:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="slider-input"
                aria-label="Nivel de volumen"
              />
            </div>

            {/* Visual & Haptic Toggles */}
            <div className="control-group">
              <div className="control-label">
                <span>Accesibilidad y notificaciones visuales:</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={flashEnabled}
                    onChange={(e) => setFlashEnabled(e.target.checked)}
                  />
                  <Zap size={14} style={{ color: 'var(--accent-warning)' }} /> Simulación de flash de luz
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={vibrateEnabled}
                    onChange={(e) => setVibrateEnabled(e.target.checked)}
                  />
                  <Smartphone size={14} style={{ color: 'var(--accent-success)' }} /> Vibración háptica (móvil)
                </label>
              </div>
            </div>

            {/* Transmission Metrics Panel */}
            <div className="control-group" style={{ gridColumn: '1 / -1' }}>
              <div className="control-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart2 size={16} /> Tiempo de transmisión y estadísticas del mensaje
                </span>
              </div>

              <div className="metrics-box">
                <div className="metric-stat">
                  <div className="metric-val">{stats.transmissionTimeSec}s</div>
                  <div className="metric-lbl">Tiempo estimado de reproducción</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dotsCount}</div>
                  <div className="metric-lbl">Número de puntos (.)</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dashesCount}</div>
                  <div className="metric-lbl">Número de guiones (-)</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dotDashRatio}</div>
                  <div className="metric-lbl">Relación punto/guion</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.characterCount}</div>
                  <div className="metric-lbl">Total de caracteres</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
