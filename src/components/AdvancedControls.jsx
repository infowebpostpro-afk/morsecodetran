import React, { useState } from 'react';
import { Sliders, Zap, Smartphone, Clock, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';

export function AdvancedControls({
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
    <section className="advanced-section">
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
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Advanced Audio & Transmission Options (Level 2)</span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isOpen && (
          <div className="controls-grid" style={{ borderTop: '1px solid var(--border-color)' }}>
            {/* WPM Control */}
            <div className="control-group">
              <div className="control-label">
                <span>Speed (WPM):</span>
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
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Standard PARIS word speed (50 dot units per word)
              </span>
            </div>

            {/* Farnsworth Timing */}
            <div className="control-group">
              <div className="control-label">
                <span>Farnsworth Spacing:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{farnsworthWpm} WPM</span>
              </div>
              <input
                type="range"
                min="5"
                max={wpm}
                value={farnsworthWpm}
                onChange={(e) => setFarnsworthWpm(parseInt(e.target.value))}
                className="slider-input"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Slows character spacing for easier learning
              </span>
            </div>

            {/* Audio Frequency */}
            <div className="control-group">
              <div className="control-label">
                <span>Tone Frequency:</span>
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
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Common amateur CW listening range (400 - 1000 Hz)
              </span>
            </div>

            {/* Audio Volume */}
            <div className="control-group">
              <div className="control-label">
                <span>Volume:</span>
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
              />
            </div>

            {/* Visual & Haptic Toggles */}
            <div className="control-group">
              <div className="control-label">
                <span>Accessibility Modes:</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={flashEnabled}
                    onChange={(e) => setFlashEnabled(e.target.checked)}
                  />
                  <Zap size={14} style={{ color: 'var(--accent-warning)' }} /> Light Flash
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={vibrateEnabled}
                    onChange={(e) => setVibrateEnabled(e.target.checked)}
                  />
                  <Smartphone size={14} style={{ color: 'var(--accent-success)' }} /> Vibration
                </label>
              </div>
            </div>

            {/* Transmission Metrics Panel */}
            <div className="control-group" style={{ gridColumn: '1 / -1' }}>
              <div className="control-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart2 size={16} /> Transmission Time & Message Metrics
                </span>
              </div>

              <div className="metrics-box">
                <div className="metric-stat">
                  <div className="metric-val">{stats.transmissionTimeSec}s</div>
                  <div className="metric-lbl">Est. Duration</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dotsCount}</div>
                  <div className="metric-lbl">Dots (.)</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dashesCount}</div>
                  <div className="metric-lbl">Dashes (-)</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.dotDashRatio}</div>
                  <div className="metric-lbl">Dot/Dash Ratio</div>
                </div>
                <div className="metric-stat">
                  <div className="metric-val">{stats.characterCount}</div>
                  <div className="metric-lbl">Total Chars</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
