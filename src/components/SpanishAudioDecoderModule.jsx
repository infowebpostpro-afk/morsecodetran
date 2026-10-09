import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Radio, CheckCircle, Volume2 } from 'lucide-react';
import { AudioMorseDecoder } from '../engine/audioDecoderEngine.js';
import { translateMorseToSpanish } from '../engine/spanishMorse.js';

export function SpanishAudioDecoderModule({ showToast }) {
  const [isListening, setIsListening] = useState(false);
  const [signalState, setSignalState] = useState({
    isSignalActive: false,
    energyLevel: 0,
    detectedMorse: '',
    estimatedWpm: 18,
    estimatedFreq: 600,
    confidence: 0
  });

  const decoderRef = useRef(null);

  useEffect(() => {
    decoderRef.current = new AudioMorseDecoder();
    return () => {
      if (decoderRef.current) {
        decoderRef.current.stop();
      }
    };
  }, []);

  const toggleMicrophone = async () => {
    if (isListening) {
      decoderRef.current.stop();
      setIsListening(false);
      if (showToast) showToast('Decodificación por micrófono detenida');
    } else {
      try {
        await decoderRef.current.startMicrophone((data) => {
          setSignalState(data);
        });
        setIsListening(true);
        if (showToast) showToast('Micrófono activo — escuchando audio Morse CW');
      } catch (err) {
        if (showToast) showToast('Acceso al micrófono denegado o navegador no compatible');
      }
    }
  };

  const decodedText = translateMorseToSpanish(signalState.detectedMorse);

  return (
    <section className="breakdown-section" id="audio-decoder" style={{ marginTop: '2.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Activity size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Decodificador de Audio en Vivo por Micrófono (Herramienta Especializada CW)
          </h2>
        </div>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Captura tonos CW de radio o señales de audio desde tu altavoz a través del micrófono. El filtro pasabanda de la Web Audio API rastrea los pulsos de tono, estima la velocidad (WPM) y decodifica el código Morse en tiempo real.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Controls & Signal Visualizer */}
          <div>
            <button
              onClick={toggleMicrophone}
              className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                justifyContent: 'center',
                padding: '0.75rem',
                backgroundColor: isListening ? 'var(--danger, #ef4444)' : 'var(--accent-primary)'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isListening ? 'Detener Escucha por Micrófono' : 'Activar Micrófono para Decodificar'}</span>
            </button>

            {/* Signal Meter */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Nivel de energía del tono:</span>
                <span style={{ fontWeight: 700, color: signalState.isSignalActive ? 'var(--accent-primary)' : 'inherit' }}>
                  {signalState.isSignalActive ? 'TONO DETECTADO' : 'Silencio'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, signalState.energyLevel * 100)}%`,
                    backgroundColor: signalState.isSignalActive ? 'var(--success, #10b981)' : 'var(--accent-primary)',
                    transition: 'width 0.1s ease'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div>Velocidad estimada: <strong>{signalState.estimatedWpm} WPM</strong></div>
                <div>Frecuencia estimada: <strong>{signalState.estimatedFreq} Hz</strong></div>
              </div>
            </div>
          </div>

          {/* Real-time Decoded Output */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Código Morse capturado:
            </label>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontFamily: 'monospace',
                fontSize: '1rem',
                minHeight: '45px',
                color: 'var(--accent-primary)',
                wordBreak: 'break-all'
              }}
            >
              {signalState.detectedMorse || (isListening ? 'Escuchando pulsos...' : 'Inicia el micrófono para escuchar')}
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.75rem', marginBottom: '0.35rem' }}>
              Texto decodificado en tiempo real:
            </label>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '1.1rem',
                fontWeight: 700,
                minHeight: '45px',
                color: 'var(--text-primary)',
                wordBreak: 'break-word'
              }}
            >
              {decodedText || (isListening ? '...' : 'Esperando señal Morse...')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
