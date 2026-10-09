import React, { useState, useEffect, useMemo } from 'react';
import { SpanishHero } from './SpanishHero.jsx';
import { SpanishTranslator } from './SpanishTranslator.jsx';
import { SpanishCharacterBreakdown } from './SpanishCharacterBreakdown.jsx';
import { SpanishAdvancedControls } from './SpanishAdvancedControls.jsx';
import { SpanishArticleContent } from './SpanishArticleContent.jsx';
import { ChromeExtensionBanner } from './ChromeExtensionBanner.jsx';
import {
  translateSpanishToMorse,
  translateMorseToSpanish,
  getSpanishCharacterBreakdown
} from '../engine/spanishMorse.js';
import { detectInputType, calculateStatistics } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';

export function SpanishMorsePage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast = () => {},
  setActiveTab = () => {}
}) {
  // Translator states
  const [mode, setMode] = useState('auto'); // 'auto' | 'text2morse' | 'morse2text'
  const [charMode, setCharMode] = useState('standard'); // 'standard' (ITU) | 'extended' (Spanish)
  const [inputText, setInputText] = useState('HOLA MUNDO');

  // Audio & Transmission options
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Auto-detect input type
  const detectedType = useMemo(() => {
    return detectInputType(inputText);
  }, [inputText]);

  // Compute translation output
  const { outputText, normalizedList } = useMemo(() => {
    if (!inputText) return { outputText: '', normalizedList: [] };

    let effectiveDir = mode;
    if (mode === 'auto') {
      effectiveDir = detectedType === 'morse' ? 'morse2text' : 'text2morse';
    }

    if (effectiveDir === 'morse2text') {
      const decoded = translateMorseToSpanish(inputText, charMode);
      return { outputText: decoded, normalizedList: [] };
    } else {
      const { morseText, normalizedList } = translateSpanishToMorse(inputText, charMode);
      return { outputText: morseText, normalizedList };
    }
  }, [inputText, mode, detectedType, charMode]);

  // Character breakdown for visualization
  const breakdown = useMemo(() => {
    let effectiveDir = mode;
    if (mode === 'auto') {
      effectiveDir = detectedType === 'morse' ? 'morse2text' : 'text2morse';
    }

    const textToAnalyze = effectiveDir === 'text2morse' ? inputText : outputText;
    return getSpanishCharacterBreakdown(textToAnalyze, charMode);
  }, [inputText, outputText, mode, detectedType, charMode]);

  // Calculate timing statistics
  const stats = useMemo(() => {
    let morseForStats = outputText;
    let textForStats = inputText;
    if (mode === 'morse2text' || (mode === 'auto' && detectedType === 'morse')) {
      morseForStats = inputText;
      textForStats = outputText;
    }
    return calculateStatistics(textForStats, morseForStats, wpm, farnsworthWpm);
  }, [inputText, outputText, mode, detectedType, wpm, farnsworthWpm]);

  // Handle Playback
  const handlePlay = () => {
    if (!outputText) return;

    setIsPlaying(true);
    setActiveCharIndex(-1);

    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      flashEnabled,
      vibrateEnabled,
      isLooping,
      onProgress: (index) => {
        setActiveCharIndex(index);
      },
      onComplete: () => {
        setIsPlaying(false);
        setActiveCharIndex(-1);
      }
    });
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  // Handle Swap Input / Output
  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    if (mode === 'auto') {
      // Keep auto, it will re-detect
    } else {
      setMode(mode === 'text2morse' ? 'morse2text' : 'text2morse');
    }
    showToast('Entrada y salida intercambiadas');
  };

  // Handle Copy
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => showToast(`${label} copiado al portapapeles`),
      () => showToast('Error al copiar, por favor copia manualmente')
    );
  };

  // Handle WAV download
  const handleDownloadWav = () => {
    if (!breakdown || breakdown.length === 0) return;
    try {
      const wavBlob = audioEngine.generateWavBlob(breakdown, wpm, farnsworthWpm, frequency);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-traduccion-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Archivo WAV de audio descargado');
    } catch {
      showToast('No se pudo generar el archivo de audio');
    }
  };

  // Handle Share URL
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.origin + '/es/');
      url.searchParams.set('text', inputText);
      navigator.clipboard.writeText(url.toString()).then(
        () => showToast('Enlace de compartición copiado'),
        () => showToast('No se pudo copiar el enlace')
      );
    }
  };

  // Load from URL query on initial client load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryText = params.get('text');
      if (queryText) {
        setInputText(queryText);
      }
    }
  }, []);

  return (
    <div className="spanish-morse-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
      <SpanishHero />

      <SpanishTranslator
        mode={mode}
        setMode={setMode}
        charMode={charMode}
        setCharMode={setCharMode}
        detectedType={detectedType}
        inputText={inputText}
        setInputText={setInputText}
        outputText={outputText}
        normalizedList={normalizedList}
        isPlaying={isPlaying}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        onPlay={handlePlay}
        onStop={handleStop}
        onSwap={handleSwap}
        onCopy={handleCopy}
        onDownloadWav={handleDownloadWav}
        onShare={handleShare}
        showToast={showToast}
      />

      <SpanishCharacterBreakdown
        breakdown={breakdown}
        activeIndex={activeCharIndex}
        wpm={wpm}
        frequency={frequency}
        volume={volume}
      />

      <SpanishAdvancedControls
        wpm={wpm}
        setWpm={setWpm}
        farnsworthWpm={farnsworthWpm}
        setFarnsworthWpm={setFarnsworthWpm}
        frequency={frequency}
        setFrequency={setFrequency}
        volume={volume}
        setVolume={setVolume}
        flashEnabled={flashEnabled}
        setFlashEnabled={setFlashEnabled}
        vibrateEnabled={vibrateEnabled}
        setVibrateEnabled={setVibrateEnabled}
        stats={stats}
      />

      <ChromeExtensionBanner lang="es" />

      <SpanishArticleContent
        setActiveTab={setActiveTab}
        wpm={wpm}
        frequency={frequency}
        volume={volume}
        onSelectExample={(text) => {
          setInputText(text);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
