import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Radio, CheckCircle, Volume2 } from 'lucide-react';
import { AudioMorseDecoder } from '../engine/audioDecoderEngine.js';
import { translateMorseToText } from '../engine/morseEngine.js';
import { translateMorseToPortuguese } from '../engine/portugueseMorse.js';

export function AudioDecoderModule({ showToast, lang = 'en' }) {
  const isPt = lang === 'pt';
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
      showToast(isPt ? 'Decodificação por microfone encerrada' : 'Microphone decoding stopped');
    } else {
      try {
        await decoderRef.current.startMicrophone((data) => {
          setSignalState(data);
        });
        setIsListening(true);
        showToast(isPt ? 'Microfone ativo — escutando áudio de código Morse CW' : 'Microphone active — listening for CW Morse audio');
      } catch (err) {
        showToast(isPt ? 'Acesso ao microfone negado ou navegador incompatível' : 'Microphone access denied or unsupported browser');
      }
    }
  };

  const decodedText = isPt ? translateMorseToPortuguese(signalState.detectedMorse).text : translateMorseToText(signalState.detectedMorse);

  return (
    <section className="breakdown-section" id="audio-decoder">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="section-title">
          <Activity className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>{isPt ? 'Decodificador de Código Morse por Áudio e Microfone (Ferramenta Especializada)' : 'Audio & Microphone Morse Decoder (Level 3 Specialist Tool)'}</span>
        </div>
        <p className="section-desc">
          {isPt
            ? 'Capture tons de áudio CW de rádio ou alto-falantes pelo microfone. O filtro de áudio rastreia os pulsos, estima a velocidade (WPM) e decodifica o código Morse em tempo real.'
            : 'Capture live radio CW tones or speaker audio via microphone. The Web Audio API bandpass filter tracks tone pulses, estimates speed (WPM), and decodes Morse in real-time.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {/* Controls & Signal Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              className={`btn-primary ${isListening ? 'active' : ''}`}
              onClick={toggleMicrophone}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                background: isListening ? 'var(--accent-danger)' : 'var(--accent-primary)',
                justifyContent: 'center'
              }}
            >
              {isListening ? (
                <>
                  <MicOff size={18} /> {isPt ? 'Parar Decodificador por Microfone' : 'Stop Microphone Decoder'}
                </>
              ) : (
                <>
                  <Mic size={18} /> {isPt ? 'Iniciar Decodificador por Microfone' : 'Start Microphone Decoder'}
                </>
              )}
            </button>

            {/* Signal Energy Visualizer Meter */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span>{isPt ? 'Medidor de pico de sinal:' : 'Signal Peak Meter:'}</span>
                <span style={{ color: signalState.isSignalActive ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                  {signalState.isSignalActive ? (isPt ? 'TOM DETECTADO' : 'TONE DETECTED') : (isPt ? 'EM ESPERA' : 'IDLE')}
                </span>
              </div>

              <div style={{ width: '100%', height: '16px', background: 'var(--bg-primary)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div
                  style={{
                    width: `${signalState.energyLevel}%`,
                    height: '100%',
                    background: signalState.isSignalActive ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))' : 'var(--text-muted)',
                    transition: 'width 0.05s linear'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <span>{isPt ? `Velocidade est.: ${signalState.estimatedWpm} WPM` : `Est. Speed: ${signalState.estimatedWpm} WPM`}</span>
                <span>{isPt ? `Frequência est.: ${signalState.estimatedFreq} Hz` : `Est. Frequency: ${signalState.estimatedFreq} Hz`}</span>
              </div>
            </div>
          </div>

          {/* Extracted Morse & Text Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {isPt ? 'Código Morse Extraído' : 'Extracted Morse Code'}
              </span>

              <textarea
                value={signalState.detectedMorse}
                onChange={(e) => setSignalState({ ...signalState, detectedMorse: e.target.value })}
                className="panel-textarea morse-font"
                placeholder={
                  isPt
                    ? 'Pontos (.) e traços (-) decodificados em tempo real aparecerão aqui conforme os tons de áudio forem recebidos...'
                    : 'Live decoded dots (.) and dashes (-) will stream here as audio tones are received...'
                }
                style={{ minHeight: '80px', fontSize: '1.1rem', marginTop: '0.5rem' }}
              />
            </div>

            <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {isPt ? 'Texto Decodificado' : 'Decoded Text Output'}
              </span>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                {decodedText || (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    {isPt ? 'Texto decodificado em tempo real...' : 'Live decoded English text...'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
