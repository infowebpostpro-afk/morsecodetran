import React from 'react';

export function MorseLogo({ size = 38, showText = true, className = '' }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      <div className="brand-logo-mark" style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Outer box gradient */}
            <linearGradient id="mctBgGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#863bff" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* MCT Text Fill Gradient */}
            <linearGradient id="mctTextGrad" x1="0" y1="10" x2="44" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Signal dot glowing gradient */}
            <linearGradient id="mctSignalGrad" x1="0" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Neon Drop Glow Filter */}
            <filter id="mctGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glassmorphic Background Card */}
          <rect
            x="1.5"
            y="1.5"
            width="41"
            height="41"
            rx="12"
            fill="url(#mctBgGrad)"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />

          {/* Inner Dark Vignette Shading */}
          <rect
            x="1.5"
            y="1.5"
            width="41"
            height="41"
            rx="12"
            fill="black"
            fillOpacity="0.18"
          />

          {/* Top Morse Code Signal Track: dot - dash ( • — ) */}
          <circle cx="9" cy="8.5" r="1.75" fill="#38bdf8" filter="url(#mctGlow)" />
          <rect x="14" y="7.5" width="7" height="2" rx="1" fill="#ffffff" filter="url(#mctGlow)" />
          <circle cx="25" cy="8.5" r="1.75" fill="#a855f7" filter="url(#mctGlow)" />
          <rect x="30" y="7.5" width="6" height="2" rx="1" fill="#38bdf8" filter="url(#mctGlow)" />

          {/* Centered MCT Monogram Typography */}
          <text
            x="22"
            y="28.5"
            textAnchor="middle"
            fill="url(#mctTextGrad)"
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="-0.04em"
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
          >
            MCT
          </text>

          {/* Bottom Morse Signal Accent Line ( — • — ) */}
          <rect x="8" y="35.5" width="8" height="2.2" rx="1.1" fill="url(#mctSignalGrad)" filter="url(#mctGlow)" />
          <circle cx="22" cy="36.6" r="1.8" fill="#ffffff" filter="url(#mctGlow)" />
          <rect x="28" y="35.5" width="8" height="2.2" rx="1.1" fill="url(#mctSignalGrad)" filter="url(#mctGlow)" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="brand-logo-text" style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-hover, #a78bfa) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}>
              MCT
            </span>
            <span style={{ color: 'var(--text, #ffffff)', fontWeight: 800 }}>MorsePro</span>
            <span className="live-dot-pulse" title="Live Translator Engine" style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block',
              marginLeft: '2px'
            }} />
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>
            Morse Code Translator
          </span>
        </div>
      )}
    </div>
  );
}

export default MorseLogo;
