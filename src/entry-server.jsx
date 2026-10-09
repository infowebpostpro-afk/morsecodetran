import React from 'react';
import { renderToString } from 'react-dom/server';
import { getRouteByPath, getRouteByTab, generateStructuredData } from './routeRegistry.js';

// Layout components
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { MainTranslator } from './components/MainTranslator.jsx';
import { CharacterBreakdown } from './components/CharacterBreakdown.jsx';
import { AdvancedControls } from './components/AdvancedControls.jsx';
import { ArticleContent } from './components/ArticleContent.jsx';
import { FaqSection } from './components/FaqSection.jsx';
import { Footer } from './components/Footer.jsx';
import { NotFoundPage } from './components/NotFoundPage.jsx';
import { ChromeExtensionBanner } from './components/ChromeExtensionBanner.jsx';

// Direct synchronous page imports for full server-side prerendering
import { MorseAlphabetPage } from './components/MorseAlphabetPage.jsx';
import { MorseNumbersPage } from './components/MorseNumbersPage.jsx';
import { MorseSymbolsPage } from './components/MorseSymbolsPage.jsx';
import { MorseToEnglishPage } from './components/MorseToEnglishPage.jsx';
import { EnglishToMorsePage } from './components/EnglishToMorsePage.jsx';
import { MorseCodeDecoderPage } from './components/MorseCodeDecoderPage.jsx';
import { LearnMorseCodePage } from './components/LearnMorseCodePage.jsx';
import { HowToReadMorseCodePage } from './components/HowToReadMorseCodePage.jsx';
import { MorseAmateurRadioPage } from './components/MorseAmateurRadioPage.jsx';
import { MorseImageDecoderPage } from './components/MorseImageDecoderPage.jsx';
import { MorseCodePracticePage } from './components/MorseCodePracticePage.jsx';
import { MorseAudioTranslatorPage } from './components/MorseAudioTranslatorPage.jsx';
import { MorsePhrasesPage } from './components/MorsePhrasesPage.jsx';
import { SosMorseCodePage } from './components/SosMorseCodePage.jsx';
import { ILoveYouMorseCodePage } from './components/ILoveYouMorseCodePage.jsx';
import { WhatIsMorseCodePage } from './components/WhatIsMorseCodePage.jsx';
import { HistoryOfMorseCodePage } from './components/HistoryOfMorseCodePage.jsx';
import { MorseKeyerModule } from './components/MorseKeyerModule.jsx';
import { TurkishMorsePage } from './components/TurkishMorsePage.jsx';
import { TurkishAlphabetPage } from './components/TurkishAlphabetPage.jsx';
import { TurkishNumbersPage } from './components/TurkishNumbersPage.jsx';
import { TurkishMorseToEnglishPage } from './components/TurkishMorseToEnglishPage.jsx';
import { TurkishEnglishToMorsePage } from './components/TurkishEnglishToMorsePage.jsx';
import { TurkishDecoderPage } from './components/TurkishDecoderPage.jsx';
import { TurkishAudioTranslatorPage } from './components/TurkishAudioTranslatorPage.jsx';
import { TurkishLearnMorsePage } from './components/TurkishLearnMorsePage.jsx';
import { TurkishHowToReadPage } from './components/TurkishHowToReadPage.jsx';
import { TurkishSymbolsPage } from './components/TurkishSymbolsPage.jsx';
import { TurkishPhrasesPage } from './components/TurkishPhrasesPage.jsx';
import { TurkishSosPage } from './components/TurkishSosPage.jsx';
import { TurkishILoveYouPage } from './components/TurkishILoveYouPage.jsx';
import { TurkishWhatIsMorsePage } from './components/TurkishWhatIsMorsePage.jsx';
import { TurkishHistoryPage } from './components/TurkishHistoryPage.jsx';
import { TurkishAmateurRadioPage } from './components/TurkishAmateurRadioPage.jsx';
import { TurkishKeyerPage } from './components/TurkishKeyerPage.jsx';
import { TurkishImageDecoderPage } from './components/TurkishImageDecoderPage.jsx';
import { TurkishPracticePage } from './components/TurkishPracticePage.jsx';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage.jsx';
import { TurkishPrivacyPolicyPage } from './components/TurkishPrivacyPolicyPage.jsx';

import { SpanishMorsePage } from './components/SpanishMorsePage.jsx';
import { SpanishAlphabetPage } from './components/SpanishAlphabetPage.jsx';
import { SpanishNumbersPage } from './components/SpanishNumbersPage.jsx';
import { SpanishMorseToEnglishPage } from './components/SpanishMorseToEnglishPage.jsx';
import { SpanishEnglishToMorsePage } from './components/SpanishEnglishToMorsePage.jsx';
import { SpanishDecoderPage } from './components/SpanishDecoderPage.jsx';
import { SpanishAudioTranslatorPage } from './components/SpanishAudioTranslatorPage.jsx';
import { SpanishLearnMorsePage } from './components/SpanishLearnMorsePage.jsx';
import { SpanishHowToReadPage } from './components/SpanishHowToReadPage.jsx';
import { SpanishSymbolsPage } from './components/SpanishSymbolsPage.jsx';
import { SpanishPhrasesPage } from './components/SpanishPhrasesPage.jsx';
import { SpanishSosPage } from './components/SpanishSosPage.jsx';
import { SpanishILoveYouPage } from './components/SpanishILoveYouPage.jsx';
import { SpanishWhatIsMorsePage } from './components/SpanishWhatIsMorsePage.jsx';
import { SpanishHistoryPage } from './components/SpanishHistoryPage.jsx';
import { SpanishAmateurRadioPage } from './components/SpanishAmateurRadioPage.jsx';
import { SpanishKeyerPage } from './components/SpanishKeyerPage.jsx';
import { SpanishImageDecoderPage } from './components/SpanishImageDecoderPage.jsx';
import { SpanishPracticePage } from './components/SpanishPracticePage.jsx';
import { SpanishPrivacyPolicyPage } from './components/SpanishPrivacyPolicyPage.jsx';
import {
  detectInputType,
  translateTextToMorse,
  getCharacterBreakdown,
  calculateStatistics
} from './engine/morseEngine.js';

export function render(url) {
  const route = getRouteByPath(url) || getRouteByTab('notfound');
  const activeTab = route.tab;

  // Initial translator state for prerendering homepage
  const inputText = 'HELLO WORLD';
  const detectedType = 'text';
  const outputText = translateTextToMorse(inputText);
  const breakdown = getCharacterBreakdown(inputText, outputText);
  const stats = calculateStatistics(inputText, outputText, 20, 20);

  const appHtml = renderToString(
    <div className="app-container">
      <Header
        theme="dark"
        toggleTheme={() => {}}
        activeTab={activeTab}
        setActiveTab={() => {}}
      />

      <main>
        {activeTab === 'translator' && (
          <>
            <Hero />
            <div className="tools-tabs">
              <button className="tab-btn active">Morse Translator</button>
              <button className="tab-btn">Image & Audio Decoder</button>
              <button className="tab-btn">Telegraph Keyer</button>
              <button className="tab-btn">Morse Alphabet</button>
              <button className="tab-btn">Learn Morse</button>
            </div>

            <MainTranslator
              mode="auto"
              setMode={() => {}}
              detectedType={detectedType}
              inputText={inputText}
              setInputText={() => {}}
              outputText={outputText}
              isPlaying={false}
              isLooping={false}
              setIsLooping={() => {}}
              onPlay={() => {}}
              onStop={() => {}}
              onSwap={() => {}}
              onCopy={() => {}}
              onDownloadWav={() => {}}
              onShare={() => {}}
              showToast={() => {}}
            />

            <CharacterBreakdown
              breakdown={breakdown}
              activeIndex={-1}
              wpm={20}
              frequency={600}
              volume={0.5}
            />

            <AdvancedControls
              wpm={20}
              setWpm={() => {}}
              farnsworthWpm={20}
              setFarnsworthWpm={() => {}}
              frequency={600}
              setFrequency={() => {}}
              volume={0.5}
              setVolume={() => {}}
              flashEnabled={false}
              setFlashEnabled={() => {}}
              vibrateEnabled={false}
              setVibrateEnabled={() => {}}
              stats={stats}
            />

            <ChromeExtensionBanner activeTab={activeTab} />

            <ArticleContent setActiveTab={() => {}} />
            <FaqSection />
          </>
        )}

        {activeTab === 'alphabet' && (
          <MorseAlphabetPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            onTranslateCharacter={() => {}}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'numbers' && (
          <MorseNumbersPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            onTranslateCharacter={() => {}}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'symbols' && (
          <MorseSymbolsPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'morse2english' && (
          <MorseToEnglishPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'english2morse' && (
          <EnglishToMorsePage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'morsedecoder' && (
          <MorseCodeDecoderPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'audiotranslator' && (
          <MorseAudioTranslatorPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            setFrequency={() => {}}
            volume={0.5}
            setVolume={() => {}}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'keyer' && (
          <MorseKeyerModule
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            setFrequency={() => {}}
            volume={0.5}
            setVolume={() => {}}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'learn' && (
          <LearnMorseCodePage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'howtoread' && (
          <HowToReadMorseCodePage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'phrases' && (
          <MorsePhrasesPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'sos' && (
          <SosMorseCodePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'iloveyou' && (
          <ILoveYouMorseCodePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'whatismorse' && (
          <WhatIsMorseCodePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'history' && (
          <HistoryOfMorseCodePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'amateurradio' && (
          <MorseAmateurRadioPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'imagedecoder' && (
          <MorseImageDecoderPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'practice' && (
          <MorseCodePracticePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'turkish' && (
          <TurkishMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-alphabet' && (
          <TurkishAlphabetPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-numbers' && (
          <TurkishNumbersPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-morse2english' && (
          <TurkishMorseToEnglishPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-english2morse' && (
          <TurkishEnglishToMorsePage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-morsedecoder' && (
          <TurkishDecoderPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-audiotranslator' && (
          <TurkishAudioTranslatorPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-learn' && (
          <TurkishLearnMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-howtoread' && (
          <TurkishHowToReadPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-symbols' && (
          <TurkishSymbolsPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-phrases' && (
          <TurkishPhrasesPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-sos' && (
          <TurkishSosPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-iloveyou' && (
          <TurkishILoveYouPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-whatismorse' && (
          <TurkishWhatIsMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-history' && (
          <TurkishHistoryPage
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-amateurradio' && (
          <TurkishAmateurRadioPage
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-keyer' && (
          <TurkishKeyerPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-imagedecoder' && (
          <TurkishImageDecoderPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'tr-practice' && (
          <TurkishPracticePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyPage setActiveTab={() => {}} />
        )}

        {activeTab === 'tr-privacy' && (
          <TurkishPrivacyPolicyPage setActiveTab={() => {}} />
        )}

        {activeTab === 'spanish' && (
          <SpanishMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-alphabet' && (
          <SpanishAlphabetPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-numbers' && (
          <SpanishNumbersPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-morse2english' && (
          <SpanishMorseToEnglishPage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-english2morse' && (
          <SpanishEnglishToMorsePage
            wpm={20}
            setWpm={() => {}}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-morsedecoder' && (
          <SpanishDecoderPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-audiotranslator' && (
          <SpanishAudioTranslatorPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-learn' && (
          <SpanishLearnMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-howtoread' && (
          <SpanishHowToReadPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-symbols' && (
          <SpanishSymbolsPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-phrases' && (
          <SpanishPhrasesPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-sos' && (
          <SpanishSosPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-iloveyou' && (
          <SpanishILoveYouPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-whatismorse' && (
          <SpanishWhatIsMorsePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-history' && (
          <SpanishHistoryPage
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-amateurradio' && (
          <SpanishAmateurRadioPage
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-keyer' && (
          <SpanishKeyerPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-imagedecoder' && (
          <SpanishImageDecoderPage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-practice' && (
          <SpanishPracticePage
            wpm={20}
            frequency={600}
            volume={0.5}
            showToast={() => {}}
            setActiveTab={() => {}}
          />
        )}

        {activeTab === 'es-privacy' && (
          <SpanishPrivacyPolicyPage setActiveTab={() => {}} />
        )}

        {activeTab === 'notfound' && (
          <NotFoundPage setActiveTab={() => {}} />
        )}
      </main>

      <Footer activeTab={activeTab} setActiveTab={() => {}} />
    </div>
  );

  return {
    appHtml,
    route,
    schema: generateStructuredData(route)
  };
}
