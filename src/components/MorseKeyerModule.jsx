import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Radio, Volume2, VolumeX, Trash2, Undo2, Copy, Play, RefreshCw,
  CheckCircle2, XCircle, Settings, Award, Clock, Zap, Target,
  Sliders, Info, HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToText } from '../engine/morseEngine.js';

// Preset target messages for practice modes
const PRESET_CATEGORIES = {
  beginner: [
    { label: 'Letter E', text: 'E' },
    { label: 'Letter T', text: 'T' },
    { label: 'Letter A', text: 'A' },
    { label: 'Letter N', text: 'N' },
    { label: 'Letter S', text: 'S' },
    { label: 'Letter O', text: 'O' }
  ],
  common: [
    { label: 'SOS', text: 'SOS' },
    { label: 'HELLO', text: 'HELLO' },
    { label: 'TEST', text: 'TEST' },
    { label: 'CQ', text: 'CQ' },
    { label: 'RADIO', text: 'RADIO' }
  ],
  phrases: [
    { label: 'HELLO WORLD', text: 'HELLO WORLD' },
    { label: 'GOOD MORNING', text: 'GOOD MORNING' },
    { label: 'THANK YOU', text: 'THANK YOU' },
    { label: 'BEST REGARDS', text: 'BEST REGARDS' }
  ]
};

export function MorseKeyerModule({
  wpm = 20,
  frequency = 600,
  setFrequency,
  volume = 0.5,
  setVolume,
  showToast,
  setActiveTab
}) {
  // Keyer Input State
  const [keyedMorse, setKeyedMorse] = useState('');
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [lastSymbol, setLastSymbol] = useState(null); // { type: 'dit'|'dah', duration: number }
  const [recentSignals, setRecentSignals] = useState([]); // Array of last 8 signals
  
  // Audio & Threshold Settings
  const [keySoundEnabled, setKeySoundEnabled] = useState(true);
  const [dashThreshold, setDashThreshold] = useState(160); // ms threshold
  const [showSettings, setShowSettings] = useState(false);
  const [keyFrequency, setKeyFrequency] = useState(frequency || 600);
  const [keyVolume, setKeyVolume] = useState(volume || 0.5);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sync settings when props change
  useEffect(() => {
    if (frequency) setKeyFrequency(frequency);
  }, [frequency]);
  useEffect(() => {
    if (volume !== undefined) setKeyVolume(volume);
  }, [volume]);

  // Practice Modes & Target State
  const [practiceMode, setPracticeMode] = useState('free'); // 'free', 'guided', 'challenge'
  const [difficulty, setDifficulty] = useState('beginner'); // 'beginner', 'intermediate', 'advanced'
  const [targetText, setTargetText] = useState('HELLO');
  const [practiceStatus, setPracticeStatus] = useState('idle'); // 'idle', 'countdown', 'active', 'completed'
  const [countdown, setCountdown] = useState(3);

  // Session Statistics State
  const [totalDots, setTotalDots] = useState(0);
  const [totalDashes, setTotalDashes] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDurationSec, setSessionDurationSec] = useState(0);
  const [completedPracticeStats, setCompletedPracticeStats] = useState(null);

  // Internal References for Timing and Audio
  const pressStartTime = useRef(0);
  const activeOscillator = useRef(null);
  const timerIntervalRef = useRef(null);

  // Sound Synth Functions
  const startKeySound = () => {
    if (!keySoundEnabled) return;
    try {
      const ctx = audioEngine.getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(keyFrequency, ctx.currentTime);
      gain.gain.setValueAtTime(keyVolume, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      activeOscillator.current = { osc, gain };
    } catch (e) {
      // Gracefully handle browser AudioContext restriction
    }
  };

  const stopKeySound = () => {
    if (activeOscillator.current) {
      try {
        const { osc, gain } = activeOscillator.current;
        const ctx = audioEngine.getAudioContext();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (err) {}
        }, 15);
      } catch (e) {}
      activeOscillator.current = null;
    }
  };

  // Session Duration Timer
  useEffect(() => {
    if (sessionStartTime && practiceStatus !== 'completed') {
      timerIntervalRef.current = setInterval(() => {
        setSessionDurationSec(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [sessionStartTime, practiceStatus]);

  // Key Event Handlers (Mouse, Touch, Keyboard)
  const handleKeyDown = () => {
    if (isKeyDown) return;

    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }

    setIsKeyDown(true);
    pressStartTime.current = performance.now();
    startKeySound();
  };

  const handleKeyUp = () => {
    if (!isKeyDown) return;

    setIsKeyDown(false);
    stopKeySound();

    const duration = Math.round(performance.now() - pressStartTime.current);

    // Filter out accidental micro-taps (<20ms)
    if (duration < 25) return;

    const isDash = duration >= dashThreshold;
    const symbol = isDash ? '-' : '.';

    if (isDash) setTotalDashes((prev) => prev + 1);
    else setTotalDots((prev) => prev + 1);

    const signalData = {
      type: isDash ? 'dah' : 'dit',
      symbol,
      duration,
      time: Date.now()
    };

    setLastSymbol(signalData);
    setRecentSignals((prev) => [signalData, ...prev.slice(0, 7)]);
    setKeyedMorse((prev) => prev + symbol);
  };

  // Keyboard Spacebar Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(activeTag)) {
        e.preventDefault();
        handleKeyDown();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    const handleGlobalKeyUp = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(activeTag)) {
        e.preventDefault();
        handleKeyUp();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [isKeyDown, dashThreshold, keySoundEnabled, keyFrequency, keyVolume]);

  // Derived Decoded Text
  const decodedText = useMemo(() => translateMorseToText(keyedMorse), [keyedMorse]);

  // Practice Accuracy & Completion Calculation
  const practiceMetrics = useMemo(() => {
    if (practiceMode === 'free' || !targetText) return null;

    const cleanTarget = targetText.trim().toUpperCase();
    const cleanDecoded = decodedText.trim().toUpperCase();

    let correctCount = 0;
    const targetLength = cleanTarget.length;

    const matchArray = cleanTarget.split('').map((char, idx) => {
      const userChar = cleanDecoded[idx] || '';
      const isCorrect = userChar === char;
      if (isCorrect) correctCount++;
      return {
        targetChar: char,
        userChar,
        status: !userChar ? 'pending' : isCorrect ? 'correct' : 'incorrect'
      };
    });

    const accuracy = targetLength > 0 ? Math.round((correctCount / targetLength) * 100) : 100;
    const isFinished = cleanDecoded.length >= targetLength && targetLength > 0;

    return {
      matchArray,
      correctCount,
      totalCount: targetLength,
      accuracy,
      isFinished
    };
  }, [practiceMode, targetText, decodedText]);

  // Watch practice completion
  useEffect(() => {
    if (
      practiceMode !== 'free' &&
      practiceStatus === 'active' &&
      practiceMetrics &&
      practiceMetrics.isFinished
    ) {
      setPracticeStatus('completed');
      setCompletedPracticeStats({
        accuracy: practiceMetrics.accuracy,
        correctCount: practiceMetrics.correctCount,
        totalCount: practiceMetrics.totalCount,
        durationSec: sessionDurationSec,
        estimatedWpm: estimatedWpmNum
      });
      if (showToast) {
        showToast(`Practice Complete! Accuracy: ${practiceMetrics.accuracy}% 🎉`);
      }
    }
  }, [practiceMetrics, practiceStatus, practiceMode, sessionDurationSec]);

  // Estimated WPM Calculation
  const estimatedWpmNum = useMemo(() => {
    const totalChars = decodedText.replace(/[^A-Z0-9]/gi, '').length;
    if (totalChars < 2 || sessionDurationSec < 3) return null;
    const minutes = sessionDurationSec / 60;
    const words = totalChars / 5; // Standard 5 chars per word
    return Math.round(words / minutes);
  }, [decodedText, sessionDurationSec]);

  // Controls Handlers
  const handleUndo = () => {
    setKeyedMorse((prev) => {
      if (!prev) return '';
      // If ends with ' / ', remove 3 chars, if ' ' remove 1 char, else remove 1 char
      if (prev.endsWith(' / ')) return prev.slice(0, -3);
      if (prev.endsWith(' ')) return prev.slice(0, -1);
      return prev.slice(0, -1);
    });
  };

  const handleAddCharSpace = () => {
    setKeyedMorse((prev) => (prev.endsWith(' ') ? prev : prev + ' '));
  };

  const handleAddWordSpace = () => {
    setKeyedMorse((prev) => (prev.endsWith(' / ') ? prev : prev + ' / '));
  };

  const handleClear = () => {
    setKeyedMorse('');
    setLastSymbol(null);
    setRecentSignals([]);
    setSessionStartTime(null);
    setSessionDurationSec(0);
    setCompletedPracticeStats(null);
    if (practiceStatus === 'completed') setPracticeStatus('idle');
  };

  // Start Guided or Speed Practice Session
  const startPracticeSession = (targetMsg) => {
    if (targetMsg) setTargetText(targetMsg);
    setKeyedMorse('');
    setLastSymbol(null);
    setRecentSignals([]);
    setSessionStartTime(null);
    setSessionDurationSec(0);
    setCompletedPracticeStats(null);

    setPracticeStatus('countdown');
    setCountdown(3);

    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          setPracticeStatus('active');
          setSessionStartTime(Date.now());
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  // Copy Morse / Decoded Text to Clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      if (showToast) showToast(`Copied ${label} to clipboard! ✓`);
    } catch (e) {
      if (showToast) showToast('Copy failed. Please copy manually.');
    }
  };

  // Format Duration seconds into mm:ss
  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="keyer-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem' }}>
      
      {/* PAGE HEADER SECTION (Step 3) */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
          <Radio size={16} /> Morse Telegraph Workstation & Practice Trainer
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, margin: '0 0 0.5rem' }}>
          Interactive Morse Telegraph Keyer
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          Practice sending Morse code with a virtual telegraph key or your keyboard. Tap for dots, hold for dashes, and see your Morse decoded in real time.
        </p>
      </div>

      {/* MODE SELECTION TABS (Step 12 & Step 32) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', background: 'var(--surface-card)', padding: '0.3rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', gap: '0.25rem' }}>
          {[
            { id: 'free', label: 'Free Keying', icon: Radio, desc: 'Send any Morse message freely' },
            { id: 'guided', label: 'Guided Practice', icon: Target, desc: 'Key against a target message' },
            { id: 'challenge', label: 'Speed Challenge', icon: Zap, desc: 'Test sending speed & accuracy' }
          ].map((modeItem) => {
            const Icon = modeItem.icon;
            const isActive = practiceMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                onClick={() => {
                  setPracticeMode(modeItem.id);
                  if (modeItem.id !== 'free' && practiceStatus === 'idle') {
                    setTargetText('HELLO');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#000000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                <span>{modeItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TOOL WORKSTATION GRID (Step 4, Step 35, Step 36) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* LEFT COLUMN: VIRTUAL TELEGRAPH KEY (Step 5) */}
        <div style={{ background: 'var(--surface-card)', padding: '1.75rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '1rem', left: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Radio size={14} style={{ color: 'var(--accent-primary)' }} /> TELEGRAPH KEY
          </div>

          {/* Settings Collapsible Toggle */}
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            title="Key Settings"
            style={{ position: 'absolute', top: '0.85rem', right: '1.25rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.35rem 0.65rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
          >
            <Settings size={14} /> Settings {showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* TELEGRAPH KEY PAD */}
          <div style={{ margin: '1.5rem 0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onMouseDown={handleKeyDown}
              onMouseUp={handleKeyUp}
              onMouseLeave={handleKeyUp}
              onTouchStart={(e) => { e.preventDefault(); handleKeyDown(); }}
              onTouchEnd={(e) => { e.preventDefault(); handleKeyUp(); }}
              onTouchCancel={(e) => { e.preventDefault(); handleKeyUp(); }}
              aria-label="Telegraph Key - Press to transmit dot or hold for dash"
              style={{
                width: '170px',
                height: '170px',
                borderRadius: '50%',
                background: isKeyDown
                  ? 'radial-gradient(circle, var(--accent-primary) 0%, #7e22ce 100%)'
                  : 'radial-gradient(circle, var(--surface-hover) 0%, rgba(30, 41, 59, 0.9) 100%)',
                border: isKeyDown ? '4px solid #c084fc' : '4px solid var(--accent-primary)',
                boxShadow: isKeyDown
                  ? '0 0 40px rgba(168, 85, 247, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4)'
                  : '0 10px 25px rgba(0, 0, 0, 0.3)',
                color: isKeyDown ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transform: isKeyDown ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.05s ease, background 0.05s ease, box-shadow 0.05s ease'
              }}
            >
              <Radio size={36} style={{ filter: isKeyDown ? 'drop-shadow(0 0 8px #fff)' : 'none' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em' }}>
                {isKeyDown ? 'KEY DOWN' : 'PRESS & HOLD'}
              </span>
              <span style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 500 }}>
                (Mouse / Touch / Spacebar)
              </span>
            </button>
          </div>

          {/* REAL-TIME KEY STATUS INDICATOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: isKeyDown
                ? 'rgba(168, 85, 247, 0.2)'
                : lastSymbol
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              color: isKeyDown
                ? 'var(--accent-primary)'
                : lastSymbol
                ? 'var(--accent-warning)'
                : 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isKeyDown ? 'var(--accent-primary)' : lastSymbol ? 'var(--accent-warning)' : 'var(--text-muted)'
              }} />
              {isKeyDown
                ? 'TRANSMITTING...'
                : lastSymbol
                ? `LAST SIGNAL: ${lastSymbol.type.toUpperCase()} (${lastSymbol.symbol}) — ${lastSymbol.duration}ms`
                : 'READY TO KEY'}
            </span>
          </div>

          {/* Quick Sound Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <button
              onClick={() => setKeySoundEnabled((prev) => !prev)}
              style={{ background: 'none', border: 'none', color: keySoundEnabled ? 'var(--accent-success)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
            >
              {keySoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              Sound: {keySoundEnabled ? 'ON' : 'MUTED'}
            </button>
            <span>•</span>
            <span>Threshold: {dashThreshold}ms</span>
          </div>

        </div>

        {/* RIGHT COLUMN: PRACTICE & LIVE WORKSTATION (Step 14, Step 15, Step 16) */}
        <div style={{ background: 'var(--surface-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {practiceMode === 'free' ? <Radio size={18} style={{ color: 'var(--accent-primary)' }} /> : <Target size={18} style={{ color: 'var(--accent-warning)' }} />}
                {practiceMode === 'free' ? 'Free Keying Mode' : practiceMode === 'guided' ? 'Guided Practice Mode' : 'Speed Challenge Mode'}
              </h3>
              
              {practiceMode !== 'free' && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', padding: '0.2rem 0.6rem', borderRadius: '0.35rem' }}>
                  Target: {targetText}
                </span>
              )}
            </div>

            {/* GUIDED / CHALLENGE PRACTICE TARGET UI */}
            {practiceMode !== 'free' ? (
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                
                {practiceStatus === 'countdown' ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GET READY TO KEY</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-primary)', margin: '0.2rem 0' }}>
                      {countdown > 0 ? countdown : 'GO!'}
                    </div>
                  </div>
                ) : practiceStatus === 'completed' && completedPracticeStats ? (
                  <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-success)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      <Award size={20} /> Practice Complete!
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', margin: '0.5rem 0 1rem' }}>
                      <div style={{ background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-success)' }}>{completedPracticeStats.accuracy}%</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACCURACY</div>
                      </div>
                      <div style={{ background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
                          {completedPracticeStats.estimatedWpm ? `${completedPracticeStats.estimatedWpm} WPM` : '—'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED SPEED</div>
                      </div>
                      <div style={{ background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatTime(completedPracticeStats.durationSec)}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TIME</div>
                      </div>
                    </div>
                    <button
                      onClick={() => startPracticeSession(targetText)}
                      style={{ padding: '0.5rem 1.25rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Practice Target Characters
                    </div>

                    {/* Character Match Grid */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      {practiceMetrics && practiceMetrics.matchArray.map((m, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '0.5rem',
                          background: m.status === 'correct' ? 'rgba(16, 185, 129, 0.2)' : m.status === 'incorrect' ? 'rgba(239, 68, 68, 0.2)' : 'var(--surface-hover)',
                          border: `1px solid ${m.status === 'correct' ? 'var(--accent-success)' : m.status === 'incorrect' ? 'var(--accent-danger)' : 'var(--border-color)'}`
                        }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.targetChar}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: m.status === 'correct' ? 'var(--accent-success)' : m.status === 'incorrect' ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                            {m.status === 'correct' ? '✓' : m.status === 'incorrect' ? '✕' : '•'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {practiceStatus === 'idle' && (
                      <button
                        onClick={() => startPracticeSession(targetText)}
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <Play size={16} /> Start Practice Countdown
                      </button>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Free Keying allows you to send any Morse message using mouse, touch, or spacebar. Your dots and dashes will decode live in real time below.
              </p>
            )}

            {/* PRESETS SELECTOR (Step 16) */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Practice Message Presets
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {PRESET_CATEGORIES.common.concat(PRESET_CATEGORIES.phrases.slice(0, 2)).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetText(p.text);
                      if (practiceMode === 'free') setPracticeMode('guided');
                      startPracticeSession(p.text);
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.4rem',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      background: targetText === p.text && practiceMode !== 'free' ? 'rgba(56, 189, 248, 0.2)' : 'var(--surface-hover)',
                      color: targetText === p.text && practiceMode !== 'free' ? 'var(--accent-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Shortcut hint */}
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Shortcut: <strong>Spacebar</strong> = Key</span>
            <span><strong>Ctrl+Z</strong> = Undo</span>
          </div>

        </div>

      </div>

      {/* COLLAPSIBLE KEY SETTINGS PANEL (Step 23) */}
      {showSettings && (
        <div style={{ background: 'var(--surface-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sliders size={16} style={{ color: 'var(--accent-primary)' }} /> Key & Audio Settings
          </h4>

          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', display: 'grid', gap: '1.25rem' }}>
            {/* Dash Threshold */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Dash Threshold: <strong style={{ color: 'var(--accent-primary)' }}>{dashThreshold} ms</strong>
              </label>
              <input
                type="range"
                min="90"
                max="300"
                step="10"
                value={dashThreshold}
                onChange={(e) => setDashThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Press duration to distinguish dash (-) from dot (.)</span>
            </div>

            {/* Frequency */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Tone Frequency: <strong style={{ color: 'var(--accent-primary)' }}>{keyFrequency} Hz</strong>
              </label>
              <input
                type="range"
                min="400"
                max="900"
                step="10"
                value={keyFrequency}
                onChange={(e) => {
                  setKeyFrequency(Number(e.target.value));
                  if (setFrequency) setFrequency(Number(e.target.value));
                }}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audio tone pitch frequency</span>
            </div>

            {/* Volume */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Tone Volume: <strong style={{ color: 'var(--accent-primary)' }}>{Math.round(keyVolume * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={keyVolume}
                onChange={(e) => {
                  setKeyVolume(Number(e.target.value));
                  if (setVolume) setVolume(Number(e.target.value));
                }}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audio tone output level</span>
            </div>
          </div>
        </div>
      )}

      {/* LIVE MORSE & DECODED OUTPUT PANELS (Step 9 & Step 10 & Step 11) */}
      <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* YOUR MORSE PANEL */}
        <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                YOUR KEYED MORSE CODE
              </span>
              <button
                onClick={() => copyToClipboard(keyedMorse, 'Morse Code')}
                title="Copy Morse"
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.775rem', fontWeight: 600 }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>

            <div className="morse-font" style={{ minHeight: '70px', padding: '0.85rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '1.35rem', color: 'var(--accent-warning)', wordBreak: 'break-all', letterSpacing: '2px', lineHeight: 1.5 }}>
              {keyedMorse || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', letterSpacing: 'normal' }}>Your keyed dots and dashes will appear here...</span>}
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={handleUndo}
              disabled={!keyedMorse}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: keyedMorse ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: keyedMorse ? 'pointer' : 'not-allowed' }}
            >
              <Undo2 size={14} /> Undo (Ctrl+Z)
            </button>
            <button
              onClick={handleAddCharSpace}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              + Char Space
            </button>
            <button
              onClick={handleAddWordSpace}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              + Word Space (/)
            </button>
            <button
              onClick={handleClear}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* LIVE DECODED TEXT PANEL */}
        <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                LIVE DECODED TEXT
              </span>
              <button
                onClick={() => copyToClipboard(decodedText, 'Decoded Text')}
                title="Copy Text"
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.775rem', fontWeight: 600 }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>

            <div style={{ minHeight: '70px', padding: '0.85rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', fontWeight: 400 }}>Start pressing the key to see your decoded message...</span>}
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Decoded Characters: {decodedText.replace(/ /g, '').length}</span>
            <span style={{ color: 'var(--accent-success)' }}>100% Client-Side Real-Time Decoding</span>
          </div>
        </div>

      </div>

      {/* SESSION STATISTICS & TIMING VISUALIZER (Step 19, Step 21, Step 22) */}
      <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', display: 'grid', gap: '1.5rem' }}>
        
        {/* SESSION STATS */}
        <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={16} style={{ color: 'var(--accent-primary)' }} /> SESSION STATISTICS
          </h4>

          <div style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '0.75rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {decodedText.replace(/ /g, '').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Characters</div>
            </div>

            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {totalDots} / {totalDashes}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Dots / Dashes</div>
            </div>

            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
                {estimatedWpmNum ? `${estimatedWpmNum} WPM` : '—'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Estimated WPM</div>
            </div>

            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                {practiceMetrics ? `${practiceMetrics.accuracy}%` : '100%'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Accuracy</div>
            </div>

            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatTime(sessionDurationSec)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Session Time</div>
            </div>

            <div style={{ background: 'var(--surface-hover)', padding: '0.75rem 0.5rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: practiceMetrics ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                {practiceMetrics ? (practiceMetrics.totalCount - practiceMetrics.correctCount) : 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Errors</div>
            </div>
          </div>
        </div>

        {/* TIMING VISUALIZER & FEEDBACK */}
        <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={16} style={{ color: 'var(--accent-primary)' }} /> RECENT TIMING VISUALIZER
            </h4>

            {recentSignals.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>
                Key signals to inspect press durations (ms)...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {recentSignals.map((sig, idx) => {
                  const barWidthPct = Math.min(100, Math.max(15, (sig.duration / 350) * 100));
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                      <span style={{ width: '40px', fontWeight: 700, color: sig.type === 'dah' ? 'var(--accent-warning)' : 'var(--accent-primary)', fontFamily: 'monospace' }}>
                        {sig.type === 'dah' ? 'DAH —' : 'DIT ·'}
                      </span>
                      <div style={{ flex: 1, background: 'rgba(15, 23, 42, 0.6)', height: '14px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${barWidthPct}%`,
                          height: '100%',
                          background: sig.type === 'dah' ? 'var(--accent-warning)' : 'var(--accent-primary)',
                          borderRadius: '4px',
                          transition: 'width 0.2s ease'
                        }} />
                      </div>
                      <span style={{ width: '50px', fontSize: '0.775rem', color: 'var(--text-secondary)', textAlign: 'right', fontFamily: 'monospace' }}>
                        {sig.duration}ms
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Friendly Timing Feedback */}
          <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Timing Advice:</strong> {
              !lastSymbol
                ? 'Press key briefly (<160ms) for Dot (.), hold longer for Dash (-).'
                : lastSymbol.type === 'dah' && lastSymbol.duration < 140
                ? 'Dash was on the shorter side. Try holding key slightly longer.'
                : lastSymbol.type === 'dit' && lastSymbol.duration > 130
                ? 'Dit was nearly a Dash. Tap key quicker for concise dits.'
                : 'Good rhythm! Maintain consistent timing gaps between elements.'
            }
          </div>
        </div>

      </div>

      {/* EDUCATIONAL CONTENT GUIDE SECTION (Tool-First Architecture) */}
      <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
        
        {/* Intro Overview */}
        <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Sending Morse Code vs. Reading Code
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Sending Morse code is different from simply looking up dots and dashes. You need to control the length of each signal and the spaces between them.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            The <strong>Morse Code Keyer</strong> lets you practice that process directly in your browser. Tap or press the virtual key to send a dot, hold it longer to create a dash, and watch your Morse decode as you send it. It gives you a simple way to practice sending without needing a physical telegraph key.
          </p>
        </section>

        {/* 1. How to Use the Morse Code Keyer */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            How to Use the Morse Code Keyer
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The keyer is designed to be simple and intuitive:
          </p>

          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', display: 'grid', gap: '1.25rem' }}>
            <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>1. Press the Key</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                On a desktop computer, hold the <strong>Spacebar</strong> or click the on-screen key with your mouse. On a phone or tablet, press and hold the keyer button.
              </p>
            </div>

            <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '0.35rem' }}>2. Make Dots & Dashes</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                A short press produces a <strong>dot (.)</strong>. A longer press (over the classified threshold) produces a <strong>dash (-)</strong>.
              </p>
            </div>

            <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '0.35rem' }}>3. Watch Your Morse</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Your dots and dashes appear live in sequence (e.g. <code>.... . .-.. .-.. ---</code>).
              </p>
            </div>

            <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>4. Check Decoded Text</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                The keyer decodes the signal in real time into readable text (e.g. <strong>HELLO</strong>), giving immediate practice feedback.
              </p>
            </div>
          </div>
        </section>

        {/* 2. How a Morse Code Keyer Works */}
        <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            How a Morse Code Keyer Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            A telegraph key is essentially a switch. The operator controls when the electrical or simulated signal starts and stops. A <strong>straight key</strong> uses one lever: you press it down to close the contact and release it to stop the signal.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            With a browser-based keyer, your mouse, touchscreen, or spacebar acts as that input lever. The crucial skill is controlling <strong>duration and spacing</strong>.
          </p>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-primary)', margin: '1.25rem 0' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1rem' }}>
              ITU-R M.1677-1 Standard Ratio Principles
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
              A short signal is a dot. A signal about three times as long is a dash. The spaces between signals determine where one Morse character ends and the next begins. The International Telecommunication Union defines these exact timing relationships in recommendation <strong>ITU-R M.1677-1</strong>.
            </p>
          </div>
        </section>

        {/* 3. Morse Code Timing: Dots, Dashes, and Gaps */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Morse Code Timing: Dots, Dashes, and Gaps
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Good Morse sending depends on rhythm. International Morse uses a standard mathematical timing ratio:
          </p>

          {/* Timing Ratios Table */}
          <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Morse Part</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Standard Length</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Ratio Context</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Dot (.)</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>1 unit</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Base time unit (dit)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-warning)' }}>Dash (-)</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>3 units</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Three times dot duration (dah)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Gap between elements</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>1 unit</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pause between dots/dashes inside a letter</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Gap between letters</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>3 units</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pause separating individual characters</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Gap between words</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>7 units</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pause separating complete words</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            These ratios (1:3:1:3:7) are more important than attempting to key as fast as possible. Clean timing prevents separate characters from running together and becoming undecodable.
          </p>
        </section>

        {/* 4. Practice Sending Morse Code */}
        <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Practice Sending Morse Code
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            The easiest way to build sending skill is to start with short, high-frequency characters:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { char: 'E', code: '.' },
              { char: 'T', code: '-' },
              { char: 'A', code: '.-' },
              { char: 'N', code: '-.' },
              { char: 'S', code: '...' },
              { char: 'O', code: '---' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{item.char}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{item.code}</span>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Once these individual characters feel comfortable, combine them into short words like <strong>SOS</strong> (<code>... --- ...</code>) and <strong>HELLO</strong> (<code>.... . .-.. .-.. ---</code>).
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            To expand your practice, explore our detailed guide on <a href="#learn" onClick={(e) => { e.preventDefault(); if (setActiveTab) setActiveTab('learn'); }} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>how to learn Morse code</a> or view the complete <a href="#alphabet" onClick={(e) => { e.preventDefault(); if (setActiveTab) setActiveTab('alphabet'); }} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Morse Code Alphabet</a> reference.
          </p>
        </section>

        {/* 5. How to Improve Your Morse Sending */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            How to Improve Your Morse Code Sending
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'Start slowly', text: 'A slower speed gives you complete control over your keying. Do not rush to achieve high WPM early, as poor timing habits at high speeds are difficult to unlearn.' },
              { title: 'Listen while you send', text: 'Enable key audio feedback to listen to the tone. Sending should produce a steady, musical rhythm rather than erratic short and long bursts.' },
              { title: 'Practice short daily sessions', text: '5 to 10 minutes of daily keying practice is far more effective than an occasional hour-long marathon session.' },
              { title: 'Practice complete characters', text: 'Think of ".-" as the complete acoustic character A, rather than calculating "dot, pause, dash" in your head.' },
              { title: 'Check your live decoded text', text: 'Use the live decoder output as your objective instructor. If your target is HELLO but the output produces HELO, your timing or letter spacing needs adjustment.' }
            ].map((step, idx) => (
              <div key={idx} style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem' }}>{idx + 1}</span>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem', fontWeight: 700, fontSize: '1rem' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.925rem', lineHeight: 1.6 }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Common Morse Code Keying Mistakes */}
        <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Common Morse Code Keying Mistakes
          </h2>

          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', display: 'grid', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>1. Holding the Key Too Long</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                If a dot is held too long, the keyer will classify it as a dash. Keep your dot taps light and brief.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>2. Making Dashes Too Short</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                A dash must be roughly 3 times the duration of a dot. Short dashes make characters ambiguous.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>3. Forgetting Letter Gaps</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                <code>...</code> is S, but <code>. . .</code> represents three Es. Inter-character pauses carry essential information.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>4. Word Gaps Too Short</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Words require 7 timing units of pause compared to 3 units for letters.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Straight Key vs Paddle vs Electronic Keyer */}
        <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Straight Key vs. Paddle vs. Electronic Keyer
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            In physical amateur radio telegraphy, three main types of keying hardware are used:
          </p>

          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Straight Key:</strong> Uses a single lever. The operator manually controls both dot and dash durations and element spacing. This web keyer simulates a straight-key experience.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Paddle (Iambic):</strong> Uses separate left/right levers for dots and dashes.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Electronic Keyer:</strong> An electronic circuit that automatically generates perfectly timed dits and dahs when triggered by a paddle.
            </li>
          </ul>
        </section>

        {/* 8. Morse Code Keyer vs. Morse Code Translator */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Morse Code Keyer vs. Morse Code Translator
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            These tools fulfill different jobs in your Morse learning journey:
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Tool</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Main Purpose</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Primary User Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Morse Code Keyer</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Practice sending Morse code manually</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tap/hold key lever to produce signals</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <a href="#translator" onClick={(e) => { e.preventDefault(); if (setActiveTab) setActiveTab('translator'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Morse Code Translator</a>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Convert text to Morse or Morse to text</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Type text or paste Morse strings</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <a href="#morse-code-decoder" onClick={(e) => { e.preventDefault(); if (setActiveTab) setActiveTab('morsedecoder'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Morse Code Decoder</a>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Decode Morse patterns & inspect symbols</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Paste dots/dashes to troubleshoot code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Frequently Asked Questions Accordion */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle style={{ color: 'var(--accent-primary)' }} />
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { q: 'What is a Morse code keyer?', a: 'A Morse code keyer is a device or software tool used to generate Morse code signals. A browser-based keyer can use a keyboard, mouse, or touchscreen to simulate a telegraph key.' },
              { q: 'How do you use a Morse code keyer?', a: 'Press the virtual key briefly for a dot and hold it longer for a dash. Release the key between signals and use appropriate pauses between characters and words.' },
              { q: 'Can I practice Morse code without a real telegraph key?', a: 'Yes. A virtual keyer lets you practice basic sending rhythm with a keyboard, mouse, or touchscreen before investing in physical radio equipment.' },
              { q: 'What is the difference between a dot and a dash?', a: 'A dot is one basic timing unit. A dash is three timing units. The International Morse timing standard (ITU-R M.1677-1) also defines the gaps between elements, characters, and words.' },
              { q: 'What speed should I use when practicing Morse?', a: 'Use a speed that lets you produce clean, consistent signals. Do not increase speed simply to reach a higher WPM number. Once your timing becomes reliable, increase the speed gradually.' },
              { q: 'What does CW mean in Morse code?', a: 'CW means continuous wave. In amateur radio, the term is commonly used for radio communication using Morse code, where the carrier wave is switched on and off.' },
              { q: 'Can a Morse keyer decode what I send?', a: 'Yes! Our digital keyer decodes your input in real time, giving you immediate objective feedback to compare what you intended to send with what your timing produced.' }
            ].map((faq, idx) => (
              <div key={idx} style={{ background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '1.1rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </button>

                {openFaqIndex === idx && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Takeaway & External References */}
        <section style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Practice Morse Code With the Keyer
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            The best way to improve Morse sending is to practice the physical rhythm of dots, dashes, and gaps. Start with simple characters, keep your timing consistent, and monitor the live decoded output.
          </p>

          {/* External References */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            <span>
              Official Timing Standard:{' '}
              <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                ITU-R M.1677-1 Recommendation
              </a>
            </span>
            <span>
              Amateur Radio Authority:{' '}
              <a href="https://www.arrl.org/files/file/Technology/x9004008.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                ARRL Morse Timing Standard
              </a>
            </span>
          </div>
        </section>

      </div>

    </div>
  );
}
