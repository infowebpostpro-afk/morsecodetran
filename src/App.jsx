import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { MainTranslator } from './components/MainTranslator.jsx';
import { CharacterBreakdown } from './components/CharacterBreakdown.jsx';
import { AdvancedControls } from './components/AdvancedControls.jsx';
import { ImageDecoderModule } from './components/ImageDecoderModule.jsx';
import { AudioDecoderModule } from './components/AudioDecoderModule.jsx';
import { MorseKeyerModule } from './components/MorseKeyerModule.jsx';
import { AlphabetGrid } from './components/AlphabetGrid.jsx';
import { MorseAlphabetPage } from './components/MorseAlphabetPage.jsx';
import { MorseNumbersPage } from './components/MorseNumbersPage.jsx';
import { MorseToEnglishTool } from './components/MorseToEnglishTool.jsx';
import { MorseToEnglishPage } from './components/MorseToEnglishPage.jsx';
import { EnglishToMorsePage } from './components/EnglishToMorsePage.jsx';
import { MorseCodeDecoderPage } from './components/MorseCodeDecoderPage.jsx';
import { LearnMorseCodePage } from './components/LearnMorseCodePage.jsx';
import { HowToReadMorseCodePage } from './components/HowToReadMorseCodePage.jsx';
import { MorseSymbolsPage } from './components/MorseSymbolsPage.jsx';
import { FaqSection } from './components/FaqSection.jsx';
import { ArticleContent } from './components/ArticleContent.jsx';
import { Footer } from './components/Footer.jsx';

import {
  detectInputType,
  translateTextToMorse,
  translateMorseToText,
  getCharacterBreakdown,
  calculateStatistics
} from './engine/morseEngine.js';
import { audioEngine } from './engine/audioEngine.js';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('morse_theme') || 'dark');

  // Navigation tab
  const [activeTab, setActiveTab] = useState('translator');

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
    localStorage.setItem('morse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Parse URL Hash & Pathname on load (for client-side routing and share links)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('morse-code-alphabet') || window.location.hash === '#alphabet') {
      setActiveTab('alphabet');
    } else if (path.includes('morse-code-numbers') || window.location.hash === '#numbers') {
      setActiveTab('numbers');
    } else if (path.includes('morse-code-symbols') || window.location.hash === '#symbols') {
      setActiveTab('symbols');
    } else if (path.includes('morse-code-to-english') || window.location.hash === '#morse-to-english') {
      setActiveTab('morse2english');
    } else if (path.includes('english-to-morse-code') || window.location.hash === '#english-to-morse') {
      setActiveTab('english2morse');
    } else if (path.includes('morse-code-decoder') || window.location.hash === '#morse-code-decoder' || window.location.hash === '#morsedecoder') {
      setActiveTab('morsedecoder');
    } else if (path.includes('how-to-read-morse-code') || window.location.hash === '#how-to-read') {
      setActiveTab('howtoread');
    } else if (path.includes('learn-morse-code') || window.location.hash === '#learn') {
      setActiveTab('learn');
    } else if (path.includes('morse-code-keyer') || window.location.hash === '#keyer') {
      setActiveTab('keyer');
    } else if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith('msg=')) {
        try {
          const decoded = decodeURIComponent(hash.replace('msg=', ''));
          if (decoded) setInputText(decoded);
        } catch (e) {}
      }
    }
  }, []);

  // Sync URL Pathname and history when activeTab changes
  useEffect(() => {
    let targetPath = '/';
    if (activeTab === 'alphabet') targetPath = '/morse-code-alphabet/';
    else if (activeTab === 'numbers') targetPath = '/morse-code-numbers/';
    else if (activeTab === 'symbols') targetPath = '/morse-code-symbols/';
    else if (activeTab === 'morse2english') targetPath = '/morse-code-to-english/';
    else if (activeTab === 'english2morse') targetPath = '/english-to-morse-code/';
    else if (activeTab === 'morsedecoder') targetPath = '/morse-code-decoder/';
    else if (activeTab === 'keyer') targetPath = '/morse-code-keyer/';
    else if (activeTab === 'learn') targetPath = '/learn-morse-code/';
    else if (activeTab === 'howtoread') targetPath = '/how-to-read-morse-code/';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: activeTab }, '', targetPath);
    }
  }, [activeTab]);

  // Handle browser Back & Forward button events (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('morse-code-alphabet')) setActiveTab('alphabet');
      else if (path.includes('morse-code-numbers')) setActiveTab('numbers');
      else if (path.includes('morse-code-symbols')) setActiveTab('symbols');
      else if (path.includes('morse-code-to-english')) setActiveTab('morse2english');
      else if (path.includes('english-to-morse-code')) setActiveTab('english2morse');
      else if (path.includes('morse-code-decoder')) setActiveTab('morsedecoder');
      else if (path.includes('keyer')) setActiveTab('keyer');
      else if (path.includes('learn')) setActiveTab('learn');
      else if (path.includes('how-to-read-morse-code')) setActiveTab('howtoread');
      else setActiveTab('translator');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Metadata management per active tab
  useEffect(() => {
    let title = "Morse Code Translator – Translate Morse to Text & More";
    let desc = "Use our free Morse Code Translator to convert text to Morse or Morse to text instantly. Decode messages, play Morse audio, copy results, and learn Morse code.";
    let canonical = "https://morsecodetranslatr.io/";
    let isArticlePage = false;

    if (activeTab === 'alphabet') {
      title = "Morse Code Alphabet: A–Z Letters, Numbers & Symbols";
      desc = "Explore the Morse Code Alphabet from A–Z, plus numbers and symbols. Hear each signal, learn timing rules, spot useful patterns, and master Morse code faster.";
      canonical = "https://morsecodetranslatr.io/morse-code-alphabet/";
      isArticlePage = true;
    } else if (activeTab === 'numbers') {
      title = "Morse Code Numbers: 0–9 Converter, Sound & Decoding Chart";
      desc = "Convert numbers 0–9 to Morse code, hear each signal, and decode Morse numbers instantly.";
      canonical = "https://morsecodetranslatr.io/morse-code-numbers/";
      isArticlePage = true;
    } else if (activeTab === 'symbols') {
      title = "Morse Code Symbols: Complete Chart & Meanings";
      desc = "Explore Morse code symbols with a complete chart of punctuation, special signs, meanings, and official International Morse references.";
      canonical = "https://morsecodetranslatr.io/morse-code-symbols/";
      isArticlePage = true;
    } else if (activeTab === 'morse2english') {
      title = "Morse Code to English Converter - Instant Morse Decoder";
      desc = "Convert Morse code to English text instantly. Accurate client-side decoding, audio playback, character breakdown, and real-time reverse translation.";
      canonical = "https://morsecodetranslatr.io/morse-code-to-english/";
    } else if (activeTab === 'english2morse') {
      title = "English to Morse Code Translator - Instant Morse Generator";
      desc = "Convert English text to International Morse Code instantly. Real-time encoding, audio playback, character breakdown, and custom speed controls.";
      canonical = "https://morsecodetranslatr.io/english-to-morse-code/";
    } else if (activeTab === 'morsedecoder') {
      title = "Morse Code Decoder - Decode Morse to Text Online";
      desc = "Decode Morse code into readable text instantly. Paste dots and dashes, verify character mappings, check spacing, and listen to Morse signals.";
      canonical = "https://morsecodetranslatr.io/morse-code-decoder/";
    } else if (activeTab === 'decoder') {
      title = "Morse Code Decoder – Audio & Optical Image Decoder";
      desc = "Decode Morse code from live audio signals or uploaded images. Instant spectrum audio tone analyzer and OCR visual dot-dash reader.";
      canonical = "https://morsecodetranslatr.io/morse-code-decoder/";
    } else if (activeTab === 'keyer') {
      title = "Morse Code Keyer – Practice Telegraph Key Online";
      desc = "Interactive Morse telegraph keyer. Practice keying dits and dahs with mouse, touch, or keyboard to test your speed and timing.";
      canonical = "https://morsecodetranslatr.io/morse-code-keyer/";
    } else if (activeTab === 'learn') {
      title = "How to Learn Morse Code: Beginner's Guide";
      desc = "Learn Morse code step by step with sound-based training, Koch and Farnsworth methods, daily practice, common mistakes, and useful tools.";
      canonical = "https://morsecodetranslatr.io/learn-morse-code/";
      isArticlePage = true;
    } else if (activeTab === 'howtoread') {
      title = "How to Read Morse Code: A Beginner's Guide";
      desc = "Learn how to read Morse code by sight and sound. Understand dots, dashes, spacing, timing, examples, common mistakes, and practice methods.";
      canonical = "https://morsecodetranslatr.io/how-to-read-morse-code/";
      isArticlePage = true;
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', desc);

    const linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) linkCanonical.setAttribute('href', canonical);

    // Dynamic JSON-LD Structured Data Schema update
    const jsonLdElement = document.getElementById('json-ld-schema');
    if (jsonLdElement) {
      const pageName = title.split('–')[0].split('-')[0].trim();
      const mainEntityId = isArticlePage ? `${canonical}#article` : `${canonical}#application`;

      const graphNodes = [
        {
          "@type": "WebSite",
          "@id": "https://morsecodetranslatr.io/#website",
          "url": "https://morsecodetranslatr.io/",
          "name": "MorseCodeTranslatr",
          "alternateName": "Morse Code Translator",
          "description": "Free online Morse Code Translator for converting text to Morse Code, decoding Morse Code to text, playing Morse audio, and learning International Morse Code.",
          "publisher": { "@id": "https://morsecodetranslatr.io/#organization" },
          "inLanguage": "en-US"
        },
        {
          "@type": "Organization",
          "@id": "https://morsecodetranslatr.io/#organization",
          "name": "MorseCodeTranslatr",
          "url": "https://morsecodetranslatr.io/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://morsecodetranslatr.io/#logo",
            "url": "https://morsecodetranslatr.io/images/morse-code-translator-interface.png",
            "contentUrl": "https://morsecodetranslatr.io/images/morse-code-translator-interface.png",
            "width": 512,
            "height": 512
          }
        },
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          "url": canonical,
          "name": title,
          "headline": pageName,
          "description": desc,
          "isPartOf": { "@id": "https://morsecodetranslatr.io/#website" },
          "about": { "@id": mainEntityId },
          "mainEntity": { "@id": mainEntityId },
          "publisher": { "@id": "https://morsecodetranslatr.io/#organization" },
          "inLanguage": "en-US"
        }
      ];

      if (isArticlePage) {
        graphNodes.push({
          "@type": "Article",
          "@id": `${canonical}#article`,
          "url": canonical,
          "headline": title,
          "description": desc,
          "inLanguage": "en-US",
          "isPartOf": { "@id": `${canonical}#webpage` },
          "publisher": { "@id": "https://morsecodetranslatr.io/#organization" },
          "mainEntityOfPage": { "@id": `${canonical}#webpage` }
        });
      } else {
        graphNodes.push({
          "@type": "WebApplication",
          "@id": `${canonical}#application`,
          "name": pageName,
          "alternateName": "MorseCodeTranslatr",
          "url": canonical,
          "description": desc,
          "applicationCategory": "EducationalApplication",
          "applicationSubCategory": "Morse Code Translator",
          "operatingSystem": "Any",
          "browserRequirements": "Requires a modern web browser with JavaScript enabled.",
          "availableOnDevice": ["Desktop", "Mobile", "Tablet"],
          "countriesSupported": "Worldwide",
          "inLanguage": "en-US",
          "isAccessibleForFree": true,
          "featureList": [
            "Morse Code to text conversion",
            "Text to Morse Code conversion",
            "Automatic direction detection",
            "Morse Code audio playback",
            "WPM speed control",
            "Farnsworth timing",
            "Character breakdown",
            "Copy and share results",
            "Morse Code learning resources",
            "Morse Code alphabet reference",
            "Morse Code numbers reference"
          ],
          "softwareHelp": {
            "@type": "WebPage",
            "url": "https://morsecodetranslatr.io/learn-morse-code/"
          },
          "publisher": { "@id": "https://morsecodetranslatr.io/#organization" },
          "mainEntityOfPage": { "@id": `${canonical}#webpage` }
        });
      }

      graphNodes.push({
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://morsecodetranslatr.io/" },
          ...(canonical !== "https://morsecodetranslatr.io/" ? [{ "@type": "ListItem", "position": 2, "name": pageName, "item": canonical }] : [])
        ]
      });

      const schemaData = {
        "@context": "https://schema.org",
        "@graph": graphNodes
      };
      jsonLdElement.textContent = JSON.stringify(schemaData, null, 2);
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
      </main>

      <Footer setActiveTab={setActiveTab} />

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
