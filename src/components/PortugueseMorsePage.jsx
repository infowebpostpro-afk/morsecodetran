import React, { useState, useEffect, useMemo } from 'react';
import { PortugueseHero } from './PortugueseHero.jsx';
import { PortugueseTranslator } from './PortugueseTranslator.jsx';
import { PortugueseCharacterBreakdown } from './PortugueseCharacterBreakdown.jsx';
import { PortugueseAdvancedControls } from './PortugueseAdvancedControls.jsx';
import { PortugueseArticleContent } from './PortugueseArticleContent.jsx';
import { ChromeExtensionBanner } from './ChromeExtensionBanner.jsx';
import { ImageDecoderModule } from './ImageDecoderModule.jsx';
import { AudioDecoderModule } from './AudioDecoderModule.jsx';
import { MorseKeyerModule } from './MorseKeyerModule.jsx';
import {
  translatePortugueseToMorse,
  translateMorseToPortuguese,
  getPortugueseCharacterBreakdown
} from '../engine/portugueseMorse.js';
import { detectInputType, calculateStatistics } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';

export function PortugueseMorsePage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast = () => {},
  setActiveTab = () => {}
}) {
  // Homepage specialist tool sub-tab: 'translator' | 'decoder' | 'keyer'
  const [currentToolTab, setCurrentToolTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#decoder' || hash === '#imagedecoder') return 'decoder';
      if (hash === '#keyer') return 'keyer';
    }
    return 'translator';
  });

  // Keep embedded tab state in sync with browser back/forward and hash changes
  useEffect(() => {
    const handlePopOrHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash === '#decoder' || hash === '#imagedecoder') {
          setCurrentToolTab('decoder');
        } else if (hash === '#keyer') {
          setCurrentToolTab('keyer');
        } else {
          setCurrentToolTab('translator');
        }
      }
    };
    window.addEventListener('popstate', handlePopOrHash);
    window.addEventListener('hashchange', handlePopOrHash);
    return () => {
      window.removeEventListener('popstate', handlePopOrHash);
      window.removeEventListener('hashchange', handlePopOrHash);
    };
  }, []);

  // Translator states
  const [mode, setMode] = useState('auto'); // 'auto' | 'text2morse' | 'morse2text'
  const [inputText, setInputText] = useState('OLA MUNDO');

  // Audio & Transmission options
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [waveform, setWaveform] = useState('sine');
  const [volume, setVolume] = useState(initialVol);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(false);
  const [highlightPlayback, setHighlightPlayback] = useState(true);
  const [showCharacters, setShowCharacters] = useState(true);
  const [isLooping, setIsLooping] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Auto-detect input type
  const detectedType = useMemo(() => {
    return detectInputType(inputText);
  }, [inputText]);

  // Compute translation output and normalization / validation feedback
  const { outputText, normalizedText, hasNormalization, error } = useMemo(() => {
    if (!inputText) {
      return { outputText: '', normalizedText: '', hasNormalization: false, error: null };
    }

    let effectiveDir = mode;
    if (mode === 'auto') {
      effectiveDir = detectedType === 'morse' ? 'morse2text' : 'text2morse';
    }

    if (effectiveDir === 'morse2text') {
      const decoded = translateMorseToPortuguese(inputText);
      return {
        outputText: decoded.text,
        normalizedText: '',
        hasNormalization: false,
        error: decoded.error
      };
    } else {
      const encoded = translatePortugueseToMorse(inputText);
      return {
        outputText: encoded.morseText,
        normalizedText: encoded.normalizedText,
        hasNormalization: encoded.hasNormalization,
        error: encoded.error
      };
    }
  }, [inputText, mode, detectedType]);

  // Character breakdown for visualization & sound
  const breakdown = useMemo(() => {
    let effectiveDir = mode;
    if (mode === 'auto') {
      effectiveDir = detectedType === 'morse' ? 'morse2text' : 'text2morse';
    }

    const textToAnalyze = effectiveDir === 'text2morse' ? inputText : outputText;
    return getPortugueseCharacterBreakdown(textToAnalyze);
  }, [inputText, outputText, mode, detectedType]);

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

  // Stop playback cleanly when unmounting or switching tools
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

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
      waveform,
      volume,
      flashEnabled,
      vibrateEnabled,
      loop: isLooping,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveCharIndex(-1);
        } else if (highlightPlayback) {
          setActiveCharIndex(idx);
        }
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
    handleStop();
    if (!outputText) return;
    setInputText(outputText);
    if (mode === 'auto') {
      // Auto will re-detect
    } else {
      setMode(mode === 'text2morse' ? 'morse2text' : 'text2morse');
    }
    showToast('Inverter direção: entrada e resultado trocados');
  };

  // Handle Copy
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => showToast('Copiado!'),
      () => showToast('Não foi possível copiar. Selecione o resultado e copie manualmente.')
    );
  };

  // Handle WAV download
  const handleDownloadWav = () => {
    if (!breakdown || breakdown.length === 0) return;
    try {
      let morseForWav = outputText;
      if (mode === 'morse2text' || (mode === 'auto' && detectedType === 'morse')) {
        morseForWav = inputText;
      }
      const wavBlob = audioEngine.generateWavBlob({
        morse: morseForWav,
        wpm,
        farnsworthWpm,
        frequency,
        volume
      });
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codigo-morse-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Baixar áudio WAV: download iniciado');
    } catch {
      showToast('Não foi possível gerar o áudio WAV.');
    }
  };

  // Handle Share URL
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.origin + '/pt/');
        url.searchParams.set('text', inputText);
        navigator.clipboard.writeText(url.toString()).then(
          () => showToast('Compartilhar: link copiado!'),
          () => showToast('Não foi possível compartilhar esta mensagem.')
        );
      } catch {
        showToast('Não foi possível compartilhar esta mensagem.');
      }
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
    <div className="portuguese-morse-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
      {/* 1. Short Hero */}
      <PortugueseHero />

      {/* Specialist Tool Tabs */}
      <div className="tools-tabs" aria-label="Ferramentas especializadas">
        <button
          className={`tab-btn ${currentToolTab === 'translator' ? 'active' : ''}`}
          onClick={() => {
            handleStop();
            setCurrentToolTab('translator');
            if (typeof window !== 'undefined' && window.location.hash) {
              window.history.pushState({ tab: 'portuguese', tool: 'translator' }, '', '/pt/');
            }
          }}
        >
          Tradutor
        </button>
        <button
          className={`tab-btn ${currentToolTab === 'decoder' ? 'active' : ''}`}
          onClick={() => {
            handleStop();
            setCurrentToolTab('decoder');
            if (typeof window !== 'undefined' && window.location.hash !== '#decoder') {
              window.history.pushState({ tab: 'portuguese', tool: 'decoder' }, '', '/pt/#decoder');
            }
          }}
        >
          Decodificador de imagem e áudio
        </button>
        <button
          className={`tab-btn ${currentToolTab === 'keyer' ? 'active' : ''}`}
          onClick={() => {
            handleStop();
            setCurrentToolTab('keyer');
            if (typeof window !== 'undefined' && window.location.hash !== '#keyer') {
              window.history.pushState({ tab: 'portuguese', tool: 'keyer' }, '', '/pt/#keyer');
            }
          }}
        >
          Manipulador Morse
        </button>
        <a
          href="/pt/alfabeto-morse/"
          className="tab-btn"
          onClick={(e) => {
            e.preventDefault();
            handleStop();
            if (setActiveTab) setActiveTab('pt-alphabet');
            if (typeof window !== 'undefined') {
              window.history.pushState({ tab: 'pt-alphabet' }, '', '/pt/alfabeto-morse/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          title="Alfabeto Morse (Referência completa em português)"
        >
          Alfabeto Morse
        </a>
        <a
          href="/learn-morse-code/"
          className="tab-btn"
          onClick={(e) => {
            e.preventDefault();
            handleStop();
            if (setActiveTab) setActiveTab('learn');
            if (typeof window !== 'undefined') {
              window.history.pushState({ tab: 'learn' }, '', '/learn-morse-code/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          title="Aprender Morse (Guia de estudo em inglês)"
        >
          Aprender Morse (Inglês)
        </a>
      </div>

      {currentToolTab === 'translator' && (
        <>
          {/* 2. Working Translator */}
          <PortugueseTranslator
            mode={mode}
            setMode={(m) => { handleStop(); setMode(m); }}
            detectedType={detectedType}
            inputText={inputText}
            setInputText={(txt) => { handleStop(); setInputText(txt); }}
            outputText={outputText}
            normalizedText={normalizedText}
            hasNormalization={hasNormalization}
            error={error}
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

          {/* 3. Example Presets and Character Breakdown */}
          {showCharacters && (
            <PortugueseCharacterBreakdown
              breakdown={breakdown}
              activeIndex={activeCharIndex}
              wpm={wpm}
              frequency={frequency}
              volume={volume}
              waveform={waveform}
            />
          )}

          {/* 4. Advanced Audio Settings */}
          <PortugueseAdvancedControls
            wpm={wpm}
            setWpm={setWpm}
            farnsworthWpm={farnsworthWpm}
            setFarnsworthWpm={setFarnsworthWpm}
            frequency={frequency}
            setFrequency={setFrequency}
            waveform={waveform}
            setWaveform={setWaveform}
            volume={volume}
            setVolume={setVolume}
            flashEnabled={flashEnabled}
            setFlashEnabled={setFlashEnabled}
            vibrateEnabled={vibrateEnabled}
            setVibrateEnabled={setVibrateEnabled}
            highlightPlayback={highlightPlayback}
            setHighlightPlayback={setHighlightPlayback}
            showCharacters={showCharacters}
            setShowCharacters={setShowCharacters}
            stats={stats}
          />

          {/* Chrome Extension Banner */}
          <ChromeExtensionBanner lang="pt" />

          {/* 5-8. Supporting Explanations, Tables, Troubleshooting & FAQs */}
          <PortugueseArticleContent
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            setActiveTab={setActiveTab}
            onSelectExample={(text) => {
              handleStop();
              setInputText(text);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {currentToolTab === 'decoder' && (
        <div style={{ marginTop: '2rem' }}>
          <ImageDecoderModule showToast={showToast} lang="pt" />
          <AudioDecoderModule showToast={showToast} lang="pt" />
          <ChromeExtensionBanner lang="pt" />
        </div>
      )}

      {currentToolTab === 'keyer' && (
        <div style={{ marginTop: '2rem' }}>
          <MorseKeyerModule
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            setFrequency={setFrequency}
            volume={volume}
            setVolume={setVolume}
            showToast={showToast}
            setActiveTab={setActiveTab}
            lang="pt"
          />
        </div>
      )}
    </div>
  );
}
