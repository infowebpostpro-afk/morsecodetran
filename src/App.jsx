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
    } else if (path.includes('morse-code-audio-translator') || window.location.hash === '#audio-translator') {
      setActiveTab('audiotranslator');
    } else if (path.includes('how-to-read-morse-code') || window.location.hash === '#how-to-read') {
      setActiveTab('howtoread');
    } else if (path.includes('learn-morse-code') || window.location.hash === '#learn') {
      setActiveTab('learn');
    } else if (path.includes('morse-code-keyer') || window.location.hash === '#keyer') {
      setActiveTab('keyer');
    } else if (path.includes('morse-code-phrases') || window.location.hash === '#phrases') {
      setActiveTab('phrases');
    } else if (path.includes('sos-in-morse-code') || window.location.hash === '#sos') {
      setActiveTab('sos');
    } else if (path.includes('i-love-you-in-morse-code') || window.location.hash === '#iloveyou') {
      setActiveTab('iloveyou');
    } else if (path.includes('what-is-morse-code') || window.location.hash === '#whatismorse') {
      setActiveTab('whatismorse');
    } else if (path.includes('history-of-morse-code') || window.location.hash === '#history') {
      setActiveTab('history');
    } else if (path.includes('morse-code-amateur-radio') || window.location.hash === '#amateur-radio') {
      setActiveTab('amateurradio');
    } else if (path.includes('morse-code-image-decoder') || window.location.hash === '#image-decoder' || window.location.hash === '#imagedecoder') {
      setActiveTab('imagedecoder');
    } else if (path.includes('morse-code-practice') || window.location.hash === '#practice' || window.location.hash === '#morse-code-practice') {
      setActiveTab('practice');
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
    else if (activeTab === 'audiotranslator') targetPath = '/morse-code-audio-translator/';
    else if (activeTab === 'keyer') targetPath = '/morse-code-keyer/';
    else if (activeTab === 'learn') targetPath = '/learn-morse-code/';
    else if (activeTab === 'howtoread') targetPath = '/how-to-read-morse-code/';
    else if (activeTab === 'phrases') targetPath = '/morse-code-phrases/';
    else if (activeTab === 'sos') targetPath = '/sos-in-morse-code/';
    else if (activeTab === 'iloveyou') targetPath = '/i-love-you-in-morse-code/';
    else if (activeTab === 'whatismorse') targetPath = '/what-is-morse-code/';
    else if (activeTab === 'history') targetPath = '/history-of-morse-code/';
    else if (activeTab === 'amateurradio') targetPath = '/morse-code-amateur-radio/';
    else if (activeTab === 'imagedecoder') targetPath = '/morse-code-image-decoder/';
    else if (activeTab === 'practice') targetPath = '/morse-code-practice/';

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
      else if (path.includes('morse-code-audio-translator')) setActiveTab('audiotranslator');
      else if (path.includes('keyer')) setActiveTab('keyer');
      else if (path.includes('learn')) setActiveTab('learn');
      else if (path.includes('how-to-read-morse-code')) setActiveTab('howtoread');
      else if (path.includes('morse-code-phrases')) setActiveTab('phrases');
      else if (path.includes('sos-in-morse-code')) setActiveTab('sos');
      else if (path.includes('i-love-you-in-morse-code')) setActiveTab('iloveyou');
      else if (path.includes('what-is-morse-code')) setActiveTab('whatismorse');
      else if (path.includes('history-of-morse-code')) setActiveTab('history');
      else if (path.includes('morse-code-amateur-radio')) setActiveTab('amateurradio');
      else if (path.includes('morse-code-image-decoder')) setActiveTab('imagedecoder');
      else if (path.includes('morse-code-practice')) setActiveTab('practice');
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
    } else if (activeTab === 'audiotranslator') {
      title = "Morse Code Audio Translator - Sound Generator & Audio Player";
      desc = "Convert text and Morse code into audio playback with customizable pitch and WPM speed. Download WAV sound files or decode audio signals.";
      canonical = "https://morsecodetranslatr.io/morse-code-audio-translator/";
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
    } else if (activeTab === 'phrases') {
      title = "Morse Code Phrases: Common Expressions, Greetings & Sound";
      desc = "Discover essential Morse code phrases for daily greetings, romantic messages, emergency calls, and ham radio expressions with audio.";
      canonical = "https://morsecodetranslatr.io/morse-code-phrases/";
      isArticlePage = true;
    } else if (activeTab === 'sos') {
      title = "SOS in Morse Code: Distress Signal Meaning, Pattern & Sound";
      desc = "Learn the SOS Morse code distress signal (... --- ...), its history, continuous prosign timing, flashlight transmission, and myths.";
      canonical = "https://morsecodetranslatr.io/sos-in-morse-code/";
      isArticlePage = true;
    } else if (activeTab === 'iloveyou') {
      title = "I Love You in Morse Code: Sound, Breakdown & Copy";
      desc = "Learn how to write and speak I Love You in Morse code. Listen to sound playback, copy the pattern for gifts, jewelry, or hidden messages.";
      canonical = "https://morsecodetranslatr.io/i-love-you-in-morse-code/";
      isArticlePage = true;
    } else if (activeTab === 'whatismorse') {
      title = "What Is Morse Code? How It Works & Why It Matters";
      desc = "What is Morse code? Learn how dots, dashes, timing, and spacing work, where Morse came from, and how it is still used today.";
      canonical = "https://morsecodetranslatr.io/what-is-morse-code/";
      isArticlePage = true;
    } else if (activeTab === 'history') {
      title = "History of Morse Code: From Telegraph to Modern Radio";
      desc = "Discover the history of Morse code: how Samuel Morse and Alfred Vail developed the electric telegraph, how International Morse evolved, SOS, and modern uses.";
      canonical = "https://morsecodetranslatr.io/history-of-morse-code/";
      isArticlePage = true;
    } else if (activeTab === 'amateurradio') {
      title = "Morse Code Amateur Radio: CW, QSO & Getting Started";
      desc = "Learn how Morse code works in amateur radio, what CW means, which equipment you need, common Q-codes, and how to make your first QSO.";
      canonical = "https://morsecodetranslatr.io/morse-code-amateur-radio/";
      isArticlePage = true;
    } else if (activeTab === 'imagedecoder') {
      title = "Morse Code Image Decoder: Decode Pictures to Text";
      desc = "Decode Morse code from images, photos, and screenshots. Upload an image, inspect detected dots and dashes, convert to text, and troubleshoot.";
      canonical = "https://morsecodetranslatr.io/morse-code-image-decoder/";
      isArticlePage = true;
    } else if (activeTab === 'practice') {
      title = "Morse Code Practice: Free Online Trainer & Drills";
      desc = "Practice Morse code online with listening drills, WPM controls, feedback, and focused exercises for letters, words, and real CW skills.";
      canonical = "https://morsecodetranslatr.io/morse-code-practice/";
      isArticlePage = true;
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      let ogT = title;
      if (activeTab === 'whatismorse') ogT = "What Is Morse Code? How It Works & Why It Matters";
      else if (activeTab === 'history') ogT = "History of Morse Code: From Telegraph to Modern Radio";
      else if (activeTab === 'amateurradio') ogT = "Morse Code in Amateur Radio: CW, QSO & Getting Started";
      else if (activeTab === 'imagedecoder') ogT = "Morse Code Image Decoder: Decode Pictures to Text";
      else if (activeTab === 'practice') ogT = "Morse Code Practice: Free Online Trainer & Drills";
      ogTitle.setAttribute('content', ogT);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      let ogD = desc;
      if (activeTab === 'whatismorse') ogD = "Learn what Morse code is, how dots and dashes work, why timing matters, where it came from, and where it is still used today.";
      else if (activeTab === 'history') ogD = "Discover the history of Morse code: Samuel Morse, Alfred Vail, the 1844 message, International Morse standardization, SOS, Titanic, and modern ham radio.";
      else if (activeTab === 'amateurradio') ogD = "Learn how ham-radio operators use Morse code, what CW means, what equipment you need, how QSO contacts work, and how to start learning.";
      else if (activeTab === 'imagedecoder') ogD = "Upload a picture, photo, or screenshot containing Morse code. Detect dots and dashes, inspect extracted Morse, and convert to text.";
      else if (activeTab === 'practice') ogD = "Listen to Morse, type what you hear, check your answer, and build recognition with adjustable speed, focused drills, and progressive practice.";
      ogDesc.setAttribute('content', ogD);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      let twT = title;
      if (activeTab === 'whatismorse') twT = "What Is Morse Code? A Simple Guide to Dots & Dashes";
      else if (activeTab === 'history') twT = "History of Morse Code: From Telegraph to Modern Radio";
      else if (activeTab === 'amateurradio') twT = "Morse Code in Amateur Radio: A Beginner's CW Guide";
      else if (activeTab === 'imagedecoder') twT = "Morse Code Image Decoder: Pictures to Text";
      else if (activeTab === 'practice') twT = "Morse Code Practice — Listen, Type & Improve";
      twitterTitle.setAttribute('content', twT);
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      let twD = desc;
      if (activeTab === 'whatismorse') twD = "Discover how Morse code works, why timing matters, who helped develop it, what SOS means, and how Morse is still used today.";
      else if (activeTab === 'history') twD = "Learn how Morse code was invented, how it evolved from American to International Morse, why SOS was chosen, and how it survives today.";
      else if (activeTab === 'amateurradio') twD = "Understand CW, Morse keys, Q-codes, QSO procedure, licensing, equipment, and the practical path to your first amateur-radio contact.";
      else if (activeTab === 'imagedecoder') twD = "Decode Morse code from photos and screenshots. Upload an image, check detected dots/dashes, and convert to text.";
      else if (activeTab === 'practice') twD = "Build Morse skills with listening drills, adjustable WPM, Farnsworth timing, accuracy feedback, and progressive character-to-word practice.";
      twitterDesc.setAttribute('content', twD);
    }

    const linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) linkCanonical.setAttribute('href', canonical);

    // Dynamic JSON-LD Structured Data Schema update
    const jsonLdElement = document.getElementById('json-ld-schema');
    if (jsonLdElement) {
      const pageName = title.split('–')[0].split('-')[0].split(':')[0].trim();
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

        if (activeTab === 'amateurradio') {
          graphNodes.push({
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            "isPartOf": { "@id": `${canonical}#webpage` },
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Morse code still used in amateur radio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Morse code remains an active amateur-radio operating mode, commonly called CW. ARRL continues to provide CW resources, and amateur operators continue making CW contacts, including during organized events such as Straight Key Night."
                }
              },
              {
                "@type": "Question",
                "name": "Is Morse code required for a U.S. ham-radio license?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. The FCC eliminated the Morse-code examination requirement in 2007 (Report & Order 06-178). You can become a U.S. amateur-radio operator without passing a Morse test."
                }
              },
              {
                "@type": "Question",
                "name": "What does CW mean in ham radio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CW means continuous wave. In amateur radio, the term is commonly used for Morse-code telegraphy transmitted by keying a radio carrier."
                }
              },
              {
                "@type": "Question",
                "name": "What is a QSO?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A QSO is a two-way amateur-radio contact between stations. It can be a short exchange or a longer conversation."
                }
              },
              {
                "@type": "Question",
                "name": "What is CQ in Morse code?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CQ is a general call used by an operator who is seeking another station to contact. A typical call may include CQ, the operator's callsign, and a signal inviting another station to respond."
                }
              },
              {
                "@type": "Question",
                "name": "What does QTH mean?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "QTH refers to a station's location. An operator can ask for another station's QTH or give their own location."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need a straight key to use CW?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. You can use a straight key, paddle with an electronic keyer, or other compatible keying equipment. The choice depends on your goals and operating style."
                }
              }
            ]
          });
        }

        if (activeTab === 'imagedecoder') {
          graphNodes.push({
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            "isPartOf": { "@id": `${canonical}#webpage` },
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Can I decode Morse code from an image?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. A Morse code image decoder analyzes a picture, photo, screenshot, scan, or graphic containing visible dots and dashes. It threshold-binarizes the pixels, segments marks and gaps, builds a Morse sequence, and translates it to readable text."
                }
              },
              {
                "@type": "Question",
                "name": "Can I decode Morse code from a screenshot?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Clear screenshots (especially PNG format) are often among the best input sources because they feature sharp edges, high contrast, and consistent pixel dimensions without severe compression artifacts or shadows."
                }
              },
              {
                "@type": "Question",
                "name": "Can a Morse code image decoder read handwriting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Handwritten Morse can be decoded if the dots and dashes are drawn clearly with consistent width and spacing. However, irregular stroke weights, merged symbols, or slanted lines may cause detection errors. Manual editing of detected Morse is recommended for handwritten sources."
                }
              },
              {
                "@type": "Question",
                "name": "Can I decode a Morse code tattoo from a photo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, provided the photo is shot straight-on under good lighting with minimal glare. Skin curvature and perspective angle can distort dot/dash width ratios, so reviewing the intermediate detected Morse sequence is essential before relying on the final text."
                }
              },
              {
                "@type": "Question",
                "name": "Why did the image decoder give me the wrong text?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Common causes include low image contrast, dark shadows, incorrect binarization threshold, merged dot/dash marks, background noise, or missing spaces between characters. Adjusting the threshold slider, toggling color inversion, or manually correcting detected dots/dashes will fix errors."
                }
              },
              {
                "@type": "Question",
                "name": "What is better: an image decoder or a Morse code translator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use an image decoder when Morse code exists inside a graphic or photo. Use the text Morse Code Translator when you already have typed dots and dashes or plain text. Use the Audio Translator when Morse code exists as sound."
                }
              },
              {
                "@type": "Question",
                "name": "Is a Morse code image decoder the same as OCR?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not entirely. Standard Optical Character Recognition (OCR) engines like Tesseract.js are trained to recognize typographic characters (A–Z, 0–9). A dedicated visual Morse detector analyzes pixel shapes, aspect ratios, and horizontal gap spacing to extract dot/dash sequences directly from graphical shapes."
                }
              }
            ]
          });
        }

        if (activeTab === 'practice') {
          graphNodes.push({
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            "isPartOf": { "@id": `${canonical}#webpage` },
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the best way to practice Morse code?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Practice by listening to Morse signals, answering without looking at a visual dot-and-dash chart, checking your answer, and repeating weak characters. Start with a small character set (like Starter 8) and gradually move to words, callsigns, and full sentences."
                }
              },
              {
                "@type": "Question",
                "name": "How many minutes a day should I practice Morse code?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A short, repeatable daily session of 10 to 15 minutes is much more effective than a single long session once a week. Short daily sessions prevent mental fatigue and build reliable auditory sound-recognition memory."
                }
              },
              {
                "@type": "Question",
                "name": "What WPM should a beginner use for Morse code practice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Modern Morse training recommends using a relatively brisk character speed (18–20 WPM) combined with slower Farnsworth spacing (8–12 WPM). This ensures you learn each character as a single rhythmic sound unit rather than an artificially slow series of counted dots and dashes."
                }
              },
              {
                "@type": "Question",
                "name": "Should I learn Morse code by sound or by looking at dots and dashes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For receiving practice, prioritize sound. Visual charts are helpful reference tools, but relying on visual dot/dash counting creates a mental bottleneck that prevents copying at higher speeds. ARRL specifically recommends sound-first learning for amateur radio CW."
                }
              },
              {
                "@type": "Question",
                "name": "What is the Koch method for Morse code?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Koch method, developed by German psychologist Ludwig Koch, introduces characters one by one at full target speed (e.g., 20 WPM). You practice a 2-character set until reaching 90% accuracy, then add a 3rd character, gradually building the full alphabet at target speed."
                }
              },
              {
                "@type": "Question",
                "name": "What is Farnsworth timing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Farnsworth timing preserves the fast internal dot-and-dash timing of individual characters while inserting extra spacing between characters and words. It gives beginners extra thinking time without forcing them to learn slow, distorted character rhythms."
                }
              },
              {
                "@type": "Question",
                "name": "Why can I recognize letters but not Morse words?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Word copying requires you to hold recognized letters in memory while simultaneously receiving the next incoming sound. Practice transitioning from single letters to 2-letter groups, then short 3-letter words (THE, AND, FOR), and finally full phrases."
                }
              },
              {
                "@type": "Question",
                "name": "Should I practice sending Morse code too?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, if your goal includes transmitting Morse code on amateur radio. However, receiving and sending build different auditory and motor skills. Most instructors recommend building solid receiving recognition before spending heavy time on keyer sending practice."
                }
              }
            ]
          });
        }
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
        </Suspense>
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
