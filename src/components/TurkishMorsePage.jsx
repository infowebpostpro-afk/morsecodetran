import React, { useState, useEffect, useMemo } from 'react';
import { TurkishHero } from './TurkishHero.jsx';
import { TurkishTranslator } from './TurkishTranslator.jsx';
import { TurkishCharacterBreakdown } from './TurkishCharacterBreakdown.jsx';
import { TurkishAdvancedControls } from './TurkishAdvancedControls.jsx';
import { TurkishArticleContent } from './TurkishArticleContent.jsx';
import { ChromeExtensionBanner } from './ChromeExtensionBanner.jsx';
import {
  translateTurkishToMorse,
  translateMorseToTurkish,
  getTurkishCharacterBreakdown
} from '../engine/turkishMorse.js';
import { detectInputType, calculateStatistics } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishMorsePage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast = () => {},
  setActiveTab = () => {}
}) {
  // Translator states
  const [mode, setMode] = useState('auto'); // 'auto' | 'text2morse' | 'morse2text'
  const [charMode, setCharMode] = useState('standard'); // 'standard' (ITU) | 'extended' (Turkish)
  const [inputText, setInputText] = useState('MERHABA DÜNYA');

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
      const decoded = translateMorseToTurkish(inputText, charMode);
      return { outputText: decoded, normalizedList: [] };
    } else {
      const { morseText, normalizedList } = translateTurkishToMorse(inputText, charMode);
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
    return getTurkishCharacterBreakdown(textToAnalyze, charMode);
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
    showToast('Giriş ve çıktı yer değiştirildi');
  };

  // Handle Copy
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => showToast(`${label} panoya kopyalandı!`),
      () => showToast('Kopyalama başarısız oldu, lütfen manuel kopyalayın.')
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
      a.download = `morse-ceviri-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('WAV ses dosyası indirildi');
    } catch {
      showToast('Ses dosyası oluşturulamadı');
    }
  };

  // Handle Share URL
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.origin + '/tr/');
      url.searchParams.set('text', inputText);
      navigator.clipboard.writeText(url.toString()).then(
        () => showToast('Paylaşım bağlantısı kopyalandı!'),
        () => showToast('Bağlantı kopyalanamadı.')
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
    <div className="turkish-morse-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
      <TurkishHero />

      <TurkishTranslator
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

      <TurkishCharacterBreakdown
        breakdown={breakdown}
        activeIndex={activeCharIndex}
        wpm={wpm}
        frequency={frequency}
        volume={volume}
      />

      <TurkishAdvancedControls
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

      <ChromeExtensionBanner lang="tr" />

      <TurkishArticleContent
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
