import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { MainTranslator } from './components/MainTranslator.jsx';
import { CharacterBreakdown } from './components/CharacterBreakdown.jsx';
import { AdvancedControls } from './components/AdvancedControls.jsx';
import { ImageDecoderModule } from './components/ImageDecoderModule.jsx';
import { AudioDecoderModule } from './components/AudioDecoderModule.jsx';
import { MorseKeyerModule } from './components/MorseKeyerModule.jsx';
import { AlphabetGrid } from './components/AlphabetGrid.jsx';
import { MorseToEnglishTool } from './components/MorseToEnglishTool.jsx';
import { FaqSection } from './components/FaqSection.jsx';
import { ArticleContent } from './components/ArticleContent.jsx';
import { Footer } from './components/Footer.jsx';

// Lazy-loaded page components for route code-splitting
const MorseAlphabetPage = lazy(() => import('./components/MorseAlphabetPage.jsx').then(m => ({ default: m.MorseAlphabetPage })));
const MorseNumbersPage = lazy(() => import('./components/MorseNumbersPage.jsx').then(m => ({ default: m.MorseNumbersPage })));
const MorseSymbolsPage = lazy(() => import('./components/MorseSymbolsPage.jsx').then(m => ({ default: m.MorseSymbolsPage })));
const MorseToEnglishPage = lazy(() => import('./components/MorseToEnglishPage.jsx').then(m => ({ default: m.MorseToEnglishPage })));
const EnglishToMorsePage = lazy(() => import('./components/EnglishToMorsePage.jsx').then(m => ({ default: m.EnglishToMorsePage })));
const MorseCodeDecoderPage = lazy(() => import('./components/MorseCodeDecoderPage.jsx').then(m => ({ default: m.MorseCodeDecoderPage })));
const LearnMorseCodePage = lazy(() => import('./components/LearnMorseCodePage.jsx').then(m => ({ default: m.LearnMorseCodePage })));
const HowToReadMorseCodePage = lazy(() => import('./components/HowToReadMorseCodePage.jsx').then(m => ({ default: m.HowToReadMorseCodePage })));
const MorseAmateurRadioPage = lazy(() => import('./components/MorseAmateurRadioPage.jsx').then(m => ({ default: m.MorseAmateurRadioPage })));
const MorseImageDecoderPage = lazy(() => import('./components/MorseImageDecoderPage.jsx').then(m => ({ default: m.MorseImageDecoderPage })));
const MorseCodePracticePage = lazy(() => import('./components/MorseCodePracticePage.jsx').then(m => ({ default: m.MorseCodePracticePage })));
const MorseAudioTranslatorPage = lazy(() => import('./components/MorseAudioTranslatorPage.jsx').then(m => ({ default: m.MorseAudioTranslatorPage })));
const MorsePhrasesPage = lazy(() => import('./components/MorsePhrasesPage.jsx').then(m => ({ default: m.MorsePhrasesPage })));
const SosMorseCodePage = lazy(() => import('./components/SosMorseCodePage.jsx').then(m => ({ default: m.SosMorseCodePage })));
const ILoveYouMorseCodePage = lazy(() => import('./components/ILoveYouMorseCodePage.jsx').then(m => ({ default: m.ILoveYouMorseCodePage })));
const WhatIsMorseCodePage = lazy(() => import('./components/WhatIsMorseCodePage.jsx').then(m => ({ default: m.WhatIsMorseCodePage })));
const HistoryOfMorseCodePage = lazy(() => import('./components/HistoryOfMorseCodePage.jsx').then(m => ({ default: m.HistoryOfMorseCodePage })));
const TurkishMorsePage = lazy(() => import('./components/TurkishMorsePage.jsx').then(m => ({ default: m.TurkishMorsePage })));

const TurkishAlphabetPage = lazy(() => import('./components/TurkishAlphabetPage.jsx').then(m => ({ default: m.TurkishAlphabetPage })));
const TurkishNumbersPage = lazy(() => import('./components/TurkishNumbersPage.jsx').then(m => ({ default: m.TurkishNumbersPage })));
const TurkishMorseToEnglishPage = lazy(() => import('./components/TurkishMorseToEnglishPage.jsx').then(m => ({ default: m.TurkishMorseToEnglishPage })));
const TurkishEnglishToMorsePage = lazy(() => import('./components/TurkishEnglishToMorsePage.jsx').then(m => ({ default: m.TurkishEnglishToMorsePage })));
const TurkishDecoderPage = lazy(() => import('./components/TurkishDecoderPage.jsx').then(m => ({ default: m.TurkishDecoderPage })));
const TurkishAudioTranslatorPage = lazy(() => import('./components/TurkishAudioTranslatorPage.jsx').then(m => ({ default: m.TurkishAudioTranslatorPage })));
const TurkishLearnMorsePage = lazy(() => import('./components/TurkishLearnMorsePage.jsx').then(m => ({ default: m.TurkishLearnMorsePage })));
const TurkishHowToReadPage = lazy(() => import('./components/TurkishHowToReadPage.jsx').then(m => ({ default: m.TurkishHowToReadPage })));
const TurkishSymbolsPage = lazy(() => import('./components/TurkishSymbolsPage.jsx').then(m => ({ default: m.TurkishSymbolsPage })));
const TurkishPhrasesPage = lazy(() => import('./components/TurkishPhrasesPage.jsx').then(m => ({ default: m.TurkishPhrasesPage })));
const TurkishSosPage = lazy(() => import('./components/TurkishSosPage.jsx').then(m => ({ default: m.TurkishSosPage })));
const TurkishILoveYouPage = lazy(() => import('./components/TurkishILoveYouPage.jsx').then(m => ({ default: m.TurkishILoveYouPage })));
const TurkishWhatIsMorsePage = lazy(() => import('./components/TurkishWhatIsMorsePage.jsx').then(m => ({ default: m.TurkishWhatIsMorsePage })));
const TurkishHistoryPage = lazy(() => import('./components/TurkishHistoryPage.jsx').then(m => ({ default: m.TurkishHistoryPage })));
const TurkishAmateurRadioPage = lazy(() => import('./components/TurkishAmateurRadioPage.jsx').then(m => ({ default: m.TurkishAmateurRadioPage })));
const TurkishKeyerPage = lazy(() => import('./components/TurkishKeyerPage.jsx').then(m => ({ default: m.TurkishKeyerPage })));
const TurkishImageDecoderPage = lazy(() => import('./components/TurkishImageDecoderPage.jsx').then(m => ({ default: m.TurkishImageDecoderPage })));
const TurkishPracticePage = lazy(() => import('./components/TurkishPracticePage.jsx').then(m => ({ default: m.TurkishPracticePage })));


import {
  detectInputType,
  translateTextToMorse,
  translateMorseToText,
  getCharacterBreakdown,
  calculateStatistics
} from './engine/morseEngine.js';
import { NotFoundPage } from './components/NotFoundPage.jsx';
import { getRouteByPath, getRouteByTab, generateStructuredData, TAB_TO_PATH } from './routeRegistry.js';
import { audioEngine } from './engine/audioEngine.js';

export function App() {
  // Theme state
  // Theme state
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('morse_theme') || 'dark' : 'dark'));

  // Navigation tab initialized directly from current pathname for zero-flash routing
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'translator';
    const route = getRouteByPath(window.location.pathname);
    if (route) return route.tab;
    const hash = window.location.hash;
    if (hash === '#alphabet') return 'alphabet';
    if (hash === '#numbers') return 'numbers';
    if (hash === '#symbols') return 'symbols';
    if (hash === '#morse-to-english') return 'morse2english';
    if (hash === '#english-to-morse') return 'english2morse';
    if (hash === '#morse-code-decoder') return 'morsedecoder';
    if (hash === '#audio-translator') return 'audiotranslator';
    if (hash === '#keyer') return 'keyer';
    if (hash === '#learn') return 'learn';
    if (hash === '#how-to-read') return 'howtoread';
    if (hash === '#phrases') return 'phrases';
    if (hash === '#sos') return 'sos';
    if (hash === '#iloveyou') return 'iloveyou';
    if (hash === '#what-is-morse' || hash === '#whatismorse') return 'whatismorse';
    if (hash === '#history') return 'history';
    if (hash === '#amateur-radio') return 'amateurradio';
    if (hash === '#image-decoder' || hash === '#imagedecoder') return 'imagedecoder';
    if (hash === '#practice') return 'practice';
    if (hash === '#turkish' || hash === '#tr') return 'turkish';
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      return 'notfound';
    }
    return 'translator';
  });

  // Translator state
  const [mode, setMode] = useState('auto'); // auto, text2morse, morse2text
  const [inputText, setInputText] = useState('HELLO WORLD');
  
  // Audio & Transmission options
  const [wpm, setWpm] = useState(20);
  const [farnsworthWpm, setFarnsworthWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [volume, setVolume] = useState(0.5);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [vibrateEnabled, setVibrateEnabled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Playback & Highlight State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Toast System
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('morse_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync URL Pathname and history when activeTab changes
  useEffect(() => {
    const targetPath = TAB_TO_PATH[activeTab] || '/';
    if (activeTab !== 'notfound' && window.location.pathname !== targetPath) {
      window.history.pushState({ tab: activeTab }, '', targetPath);
    }
  }, [activeTab]);

  // Handle browser Back & Forward button events (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteByPath(window.location.pathname);
      if (route) {
        setActiveTab(route.tab);
      } else if (window.location.pathname === '/' || window.location.pathname === '') {
        setActiveTab('translator');
      } else {
        setActiveTab('notfound');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle hash-based message sharing #msg=
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith('msg=')) {
        try {
          const decoded = decodeURIComponent(hash.replace('msg=', ''));
          if (decoded) setInputText(decoded);
        } catch (e) {}
      }
    }
  }, []);

  // Sync route metadata to head
  useEffect(() => {
    const route = getRouteByTab(activeTab);
    if (!route) return;

    document.title = route.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', route.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', route.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', route.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', route.canonical);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', route.title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', route.description);

    const linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) linkCanonical.setAttribute('href', route.canonical);

    const jsonLdElement = document.getElementById('json-ld-schema');
    if (jsonLdElement) {
      jsonLdElement.textContent = JSON.stringify(generateStructuredData(route), null, 2);
    }
  }, [activeTab]);

  // Handle Translate Character Callback from Alphabet Detail Panel
  const handleTranslateCharacter = (char) => {
    setInputText(char);
    setActiveTab('translator');
    showToast(`Pre-filled "${char}" in Morse Translator`);
  };

  // Compute Auto-Detection & Translation in real-time
  const detectedType = useMemo(() => detectInputType(inputText), [inputText]);

  const outputText = useMemo(() => {
    if (!inputText) return '';

    if (mode === 'auto') {
      if (detectedType === 'morse') {
        return translateMorseToText(inputText);
      } else {
        return translateTextToMorse(inputText);
      }
    } else if (mode === 'text2morse') {
      return translateTextToMorse(inputText);
    } else {
      return translateMorseToText(inputText);
    }
  }, [inputText, mode, detectedType]);

  // Compute Character Breakdown Table
  const breakdown = useMemo(() => {
    if (mode === 'auto') {
      if (detectedType === 'morse') {
        // Input is morse -> text breakdown
        return getCharacterBreakdown(outputText, inputText);
      } else {
        // Input is text -> morse breakdown
        return getCharacterBreakdown(inputText, outputText);
      }
    } else if (mode === 'text2morse') {
      return getCharacterBreakdown(inputText, outputText);
    } else {
      return getCharacterBreakdown(outputText, inputText);
    }
  }, [inputText, outputText, mode, detectedType]);

  // Compute Message Transmission Statistics
  const stats = useMemo(() => {
    const isInputMorse = (mode === 'auto' && detectedType === 'morse') || mode === 'morse2text';
    const textVal = isInputMorse ? outputText : inputText;
    const morseVal = isInputMorse ? inputText : outputText;
    return calculateStatistics(textVal, morseVal, wpm, farnsworthWpm);
  }, [inputText, outputText, mode, detectedType, wpm, farnsworthWpm]);

  // Handle Play Audio
  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;

    setIsPlaying(true);

    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      loop: isLooping,
      onProgress: ({ activeCharIndex: idx, item, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveCharIndex(-1);
          return;
        }

        setActiveCharIndex(idx);

        // Haptic Vibration feedback if enabled
        if (vibrateEnabled && item && !item.isSpace && 'vibrate' in navigator) {
          navigator.vibrate(item.morse.includes('-') ? 150 : 50);
        }

        // Screen flash feedback if enabled
        if (flashEnabled && item && !item.isSpace) {
          document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          setTimeout(() => {
            document.body.style.backgroundColor = '';
          }, 80);
        }
      }
    });
  };

  // Handle Stop Audio
  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  // Handle Swap Button
  const handleSwap = () => {
    if (!inputText) return;
    setInputText(outputText);
    if (mode === 'text2morse') setMode('morse2text');
    else if (mode === 'morse2text') setMode('text2morse');
    showToast('Swapped Input & Output');
  };

  // Handle Copy to Clipboard
  const handleCopy = async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard ✓`);
    } catch (e) {
      showToast('Copy failed. Please copy manually.');
    }
  };

  // Handle Download WAV Audio
  const handleDownloadWav = () => {
    const morseVal = (mode === 'auto' && detectedType === 'morse') || mode === 'morse2text' ? inputText : outputText;
    if (!morseVal) return;

    try {
      const blob = audioEngine.generateWavBlob({
        morse: morseVal,
        wpm,
        farnsworthWpm,
        frequency,
        volume
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse_${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('WAV Audio exported successfully ✓');
    } catch (err) {
      showToast('Failed to export audio');
    }
  };

  // Handle Share URL
  const handleShare = () => {
    if (!inputText) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#msg=${encodeURIComponent(inputText)}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Shareable URL copied to clipboard ✓');
  };

  return (
    <div className="app-container">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main>
        <Suspense fallback={
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', margin: '2rem auto', maxWidth: '600px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading page content...
          </div>
        }>
        {activeTab === 'translator' && (
          <>
            <Hero />
            {/* Level 3 Specialist Tool Tabs */}
            <div className="tools-tabs">
              <button
                className={`tab-btn ${activeTab === 'translator' ? 'active' : ''}`}
                onClick={() => setActiveTab('translator')}
              >
                Morse Translator
              </button>
              <button
                className={`tab-btn ${activeTab === 'decoder' ? 'active' : ''}`}
                onClick={() => setActiveTab('decoder')}
              >
                Image & Audio Decoder
              </button>
              <button
                className={`tab-btn ${activeTab === 'keyer' ? 'active' : ''}`}
                onClick={() => setActiveTab('keyer')}
              >
                Telegraph Keyer
              </button>
              <button
                className={`tab-btn ${activeTab === 'alphabet' ? 'active' : ''}`}
                onClick={() => setActiveTab('alphabet')}
              >
                Morse Alphabet
              </button>
              <button
                className={`tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
                onClick={() => setActiveTab('learn')}
              >
                Learn Morse
              </button>
            </div>
          </>
        )}

        {/* Tab Content Display */}
        {activeTab === 'translator' && (
          <>
            <MainTranslator
              mode={mode}
              setMode={setMode}
              detectedType={detectedType}
              inputText={inputText}
              setInputText={setInputText}
              outputText={outputText}
              isPlaying={isPlaying}
              isLooping={isLooping}
              setIsLooping={setIsLooping}
              onPlay={handlePlayAudio}
              onStop={handleStopAudio}
              onSwap={handleSwap}
              onCopy={handleCopy}
              onDownloadWav={handleDownloadWav}
              onShare={handleShare}
              showToast={showToast}
            />

            <CharacterBreakdown
              breakdown={breakdown}
              activeIndex={activeCharIndex}
              wpm={wpm}
              frequency={frequency}
              volume={volume}
            />

            <AdvancedControls
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

            <ArticleContent setActiveTab={setActiveTab} />
            <FaqSection />
          </>
        )}

        {activeTab === 'decoder' && (
          <>
            <ImageDecoderModule showToast={showToast} />
            <AudioDecoderModule showToast={showToast} />
          </>
        )}

        {activeTab === 'keyer' && (
          <MorseKeyerModule
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            setFrequency={setFrequency}
            volume={volume}
            setVolume={setVolume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'alphabet' && (
          <MorseAlphabetPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            onTranslateCharacter={handleTranslateCharacter}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'numbers' && (
          <MorseNumbersPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            onTranslateCharacter={handleTranslateCharacter}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'symbols' && (
          <MorseSymbolsPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'morse2english' && (
          <MorseToEnglishPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'english2morse' && (
          <EnglishToMorsePage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'morsedecoder' && (
          <MorseCodeDecoderPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'learn' && (
          <LearnMorseCodePage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'howtoread' && (
          <HowToReadMorseCodePage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'amateurradio' && (
          <MorseAmateurRadioPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'audiotranslator' && (
          <MorseAudioTranslatorPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            setFrequency={setFrequency}
            volume={volume}
            setVolume={setVolume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'phrases' && (
          <MorsePhrasesPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'sos' && (
          <SosMorseCodePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'iloveyou' && (
          <ILoveYouMorseCodePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'whatismorse' && (
          <WhatIsMorseCodePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <HistoryOfMorseCodePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'imagedecoder' && (
          <MorseImageDecoderPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'practice' && (
          <MorseCodePracticePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'turkish' && (
          <TurkishMorsePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-alphabet' && (
          <TurkishAlphabetPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-numbers' && (
          <TurkishNumbersPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-morse2english' && (
          <TurkishMorseToEnglishPage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-english2morse' && (
          <TurkishEnglishToMorsePage
            wpm={wpm}
            setWpm={setWpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-morsedecoder' && (
          <TurkishDecoderPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-audiotranslator' && (
          <TurkishAudioTranslatorPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-learn' && (
          <TurkishLearnMorsePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-howtoread' && (
          <TurkishHowToReadPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-symbols' && (
          <TurkishSymbolsPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-phrases' && (
          <TurkishPhrasesPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-sos' && (
          <TurkishSosPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-iloveyou' && (
          <TurkishILoveYouPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-whatismorse' && (
          <TurkishWhatIsMorsePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-history' && (
          <TurkishHistoryPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-amateurradio' && (
          <TurkishAmateurRadioPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-keyer' && (
          <TurkishKeyerPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-imagedecoder' && (
          <TurkishImageDecoderPage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tr-practice' && (
          <TurkishPracticePage
            wpm={wpm}
            frequency={frequency}
            volume={volume}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'notfound' && (
          <NotFoundPage setActiveTab={setActiveTab} />
        )}
        </Suspense>
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
