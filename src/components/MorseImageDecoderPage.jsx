import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon, Upload, CheckCircle, AlertTriangle, Zap, Copy, Check,
  Play, Square, ShieldCheck, Eye, ChevronDown, ChevronUp, Camera
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToText, translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';
import { processImageForMorse } from '../engine/imageDecoderEngine.js';

export function MorseImageDecoderPage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  // Interactive Image Decoder State
  const [imageSrc, setImageSrc] = useState(null);
  const [threshold, setThreshold] = useState(128);
  const [contrast, setContrast] = useState(1.0);
  const [invert, setInvert] = useState(false);

  const [processedCanvasUrl, setProcessedCanvasUrl] = useState(null);
  const [detectedMorse, setDetectedMorse] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // Audio Playback & UI Helper States
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // File Upload & Detection Handlers
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (showToast) showToast('Please upload a valid image file (PNG, JPG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        runDetection(event.target.result, { threshold, contrast, invert });
      };
      reader.readAsDataURL(file);
    }
  };

  const runDetection = (src, opts) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const result = processImageForMorse(img, opts);
      setProcessedCanvasUrl(result.processedDataUrl);
      setDetectedMorse(result.detectedMorse);
      setConfidence(result.confidence);
      setIsProcessing(false);
      if (showToast) showToast('Image optical detection complete ✓');
    };
  };

  // Sample Image Loaders
  const loadSampleImage = (sampleType) => {
    let sampleText = '.... . .-.. .-.. --- / .-- --- .-. .-.. -..';
    if (sampleType === 'sos') sampleText = '... --- ...';
    if (sampleType === 'cq') sampleText = '-.-. --.- / -.-. --.-';
    
    // Generate synthetic sample image via Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sampleText, canvas.width / 2, canvas.height / 2);
    
    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    runDetection(dataUrl, { threshold, contrast, invert });
  };

  const decodedText = translateMorseToText(detectedMorse);

  // Audio Playback Helper
  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  // Clipboard Copy Helper
  const handleCopy = (id, textToCopy, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Tab Navigation Helper
  const handleNav = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Can I decode Morse code from an image?',
      a: 'Yes. A Morse code image decoder analyzes a picture, photo, screenshot, scan, or graphic containing visible dots and dashes. It threshold-binarizes the pixels, segments marks and gaps, builds a Morse sequence, and translates it to readable text.'
    },
    {
      q: 'Can I decode Morse code from a screenshot?',
      a: 'Yes. Clear screenshots (especially PNG format) are often among the best input sources because they feature sharp edges, high contrast, and consistent pixel dimensions without severe compression artifacts or shadows.'
    },
    {
      q: 'Can a Morse code image decoder read handwriting?',
      a: 'Handwritten Morse can be decoded if the dots and dashes are drawn clearly with consistent width and spacing. However, irregular stroke weights, merged symbols, or slanted lines may cause detection errors. Manual editing of detected Morse is recommended for handwritten sources.'
    },
    {
      q: 'Can I decode a Morse code tattoo from a photo?',
      a: 'Yes, provided the photo is shot straight-on under good lighting with minimal glare. Skin curvature and perspective angle can distort dot/dash width ratios, so reviewing the intermediate detected Morse sequence is essential before relying on the final text.'
    },
    {
      q: 'Why did the image decoder give me the wrong text?',
      a: 'Common causes include low image contrast, dark shadows, incorrect binarization threshold, merged dot/dash marks, background noise, or missing spaces between characters. Adjusting the threshold slider, toggling color inversion, or manually correcting detected dots/dashes will fix errors.'
    },
    {
      q: 'What is better: an image decoder or a Morse code translator?',
      a: 'Use an image decoder when Morse code exists inside a graphic or photo. Use the text Morse Code Translator when you already have typed dots and dashes or plain text. Use the Audio Translator when Morse code exists as sound.'
    },
    {
      q: 'Is a Morse code image decoder the same as OCR?',
      a: 'Not entirely. Standard Optical Character Recognition (OCR) engines like Tesseract.js are trained to recognize typographic characters (A–Z, 0–9). A dedicated visual Morse detector analyzes pixel shapes, aspect ratios, and horizontal gap spacing to extract dot/dash sequences directly from graphical shapes.'
    }
  ];

  return (
    <article className="article-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* HEADER SECTION */}
      <header className="article-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1rem' }}>
          <ImageIcon size={16} />
          <span>Visual Optical Computer Vision Tool</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Morse Code Image Decoder: Decode Morse from Pictures, Photos &amp; Screenshots
        </h1>

        <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          If Morse code is trapped inside a picture, manually copying every dot and dash can be frustrating. Upload a photo, screenshot, scan, or graphic containing visible Morse marks. Our client-side optical engine binarizes pixels, detects dots and dashes, exposes the editable intermediate Morse, and converts it into clean readable text.
        </p>

        {/* TRUST / PRIVACY BADGES */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0.85rem 1.15rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-success)' }} />
            <span>100% Client-Side Privacy (0 Server Uploads)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Instant HTML5 Canvas Pixel Binarization</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} style={{ color: 'var(--accent-warning)' }} />
            <span>Editable Intermediate Morse Inspection</span>
          </div>
        </div>
      </header>

      {/* ABOVE THE FOLD: INTERACTIVE IMAGE DECODER TOOL */}
      <section className="breakdown-section" id="image-decoder-tool" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera className="text-accent-primary" size={24} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Interactive Morse Image Decoder</span>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600 }}>
              HTML5 Canvas Vision Engine
            </span>
          </div>

          <p className="section-desc" style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Upload any image (PNG, JPG, WEBP) or screenshot. Adjust binarization threshold and polarity controls to inspect extracted dots, dashes, and spacing in real time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* LEFT COLUMN: UPLOAD & PREVIEW */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Upload size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--accent-primary)' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Click or Drag Photo / Screenshot Here</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Supports PNG, JPG, WEBP, or Clipboard Paste</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Sample Images Quick Buttons */}
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Try Sample:</span>
                <button
                  onClick={() => loadSampleImage('hello')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  "Hello World"
                </button>
                <button
                  onClick={() => loadSampleImage('sos')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  "SOS Signal"
                </button>
                <button
                  onClick={() => loadSampleImage('cq')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  "CQ Call"
                </button>
              </div>

              {/* Binarization Preview & Adjustments */}
              {imageSrc && (
                <div style={{ marginTop: '1.25rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Binarized Optical Preview:</span>
                    {isProcessing && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>Processing pixels...</span>}
                  </div>
                  <img
                    ref={imgRef}
                    src={processedCanvasUrl || imageSrc}
                    alt="Optical Processing Preview"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#000' }}
                  />

                  {/* Preprocessing Sliders */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Threshold: <strong>{threshold}</strong>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={threshold}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setThreshold(val);
                          if (imageSrc) runDetection(imageSrc, { threshold: val, contrast, invert });
                        }}
                        style={{ display: 'block', width: '110px', marginTop: '0.25rem' }}
                      />
                    </label>

                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginTop: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={invert}
                        onChange={(e) => {
                          setInvert(e.target.checked);
                          if (imageSrc) runDetection(imageSrc, { threshold, contrast, invert: e.target.checked });
                        }}
                      />
                      Invert Polarity (Light marks on dark)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETECTED MORSE & DECODED TEXT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Extracted Morse Sequence (Editable)
                  </span>
                  {confidence > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: confidence > 70 ? 'var(--accent-success)' : 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {confidence > 70 ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                      Confidence: {confidence}%
                    </span>
                  )}
                </div>

                <textarea
                  value={detectedMorse}
                  onChange={(e) => setDetectedMorse(e.target.value)}
                  className="panel-textarea morse-font"
                  placeholder="Detected Morse dots (.) and dashes (-) will appear here. Edit manually if optical binarization needs fine-tuning."
                  style={{ minHeight: '90px', fontSize: '1.15rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleCopy('morse', detectedMorse, 'Copied detected Morse!')}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {copiedId === 'morse' ? <Check size={12} style={{ color: 'var(--accent-success)' }} /> : <Copy size={12} />}
                    Copy Morse
                  </button>
                </div>
              </div>

              {/* Decoded Output Box */}
              <div style={{ background: 'var(--bg-card-hover)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Decoded Text Translation
                  </span>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.5rem', wordBreak: 'break-word', minHeight: '40px' }}>
                    {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Upload or select a sample image above to decode...</span>}
                  </div>
                </div>

                {decodedText && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handlePlayMorse('decoded', decodedText)}
                      style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {playingId === 'decoded' ? <Square size={14} /> : <Play size={14} />}
                      {playingId === 'decoded' ? 'Stop Audio' : 'Hear Decoded Morse'}
                    </button>
                    <button
                      onClick={() => handleCopy('text', decodedText, 'Copied translated text!')}
                      style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {copiedId === 'text' ? <Check size={14} style={{ color: 'var(--accent-success)' }} /> : <Copy size={14} />}
                      Copy Text
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK WORKFLOW SUMMARY */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Decode Morse Code from an Image
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Visual optical decoding requires converting pixels into physical signal durations. A reliable workflow follows six distinct stages:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>1. Upload &amp; Crop</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Select a photo, screenshot, or scan. Crop tightly around the Morse line to remove unrelated text or graphics.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>2. Threshold Binarization</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Adjust the threshold slider to separate dark Morse marks from the background, creating high-contrast black-and-white shapes.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>3. Mark Classification</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              The computer-vision engine measures run lengths. Short marks become dots (<code style={{ color: 'var(--accent-primary)' }}>.</code>); longer marks become dashes (<code style={{ color: 'var(--accent-primary)' }}>-</code>).
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>4. Gap Analysis</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Spaces between marks are analyzed to distinguish intra-character gaps, 3-unit letter gaps, and 7-unit word spaces (<code style={{ color: 'var(--accent-primary)' }}>/</code>).
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>5. Review Extracted Morse</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Inspect the intermediate Morse textarea. If lighting or blur misread a dot as a dash, edit the symbol directly.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>6. Translate &amp; Copy</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              The cleaned Morse sequence is mapped against International Morse Code, producing final readable text output.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IS A MORSE CODE IMAGE DECODER */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          What Is a Morse Code Image Decoder?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          A <strong>Morse code image decoder</strong> is a specialized utility that extracts visual Morse patterns from photos, screenshots, scanned documents, tattoos, puzzle clues, and ARG graphics, translating those visual marks into human-readable text.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          International Morse Code is maintained under <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>ITU-R Recommendation M.1677-1</a>, which specifies precise ratio relationships between dots, dashes, and inter-element pauses. In digital images, these timing relationships manifest as physical pixel widths.
        </p>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', margin: '1.5rem 0' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Standard ITU Morse Ratio Standard</h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li><strong>Dot (Dit)</strong>: 1 unit of physical length (or duration).</li>
            <li><strong>Dash (Dah)</strong>: Exactly 3 units of physical length.</li>
            <li><strong>Element Gap</strong>: 1 unit pause between dots/dashes within the same letter.</li>
            <li><strong>Letter Gap</strong>: 3 units pause between separate letters.</li>
            <li><strong>Word Gap</strong>: 7 units pause between separate words.</li>
          </ul>
        </div>
      </section>

      {/* WHAT DOES AN IMAGE DECODER READ: GRAPHIC vs TYPED */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          What Does an Image Morse Decoder Actually Read?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Morse code inside images generally falls into two distinct categories. Understanding the difference determines whether computer vision or text OCR is required:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              1. Graphic Dots &amp; Dashes (Visual Shapes)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              The image contains printed, drawn, or engraved visual marks like circles, bars, or lines:
            </p>
            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
              ... --- ...
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              <strong>Recognition Method</strong>: Visual shape detection. The engine analyzes aspect ratios, bounding box widths, and pixel horizontal gap counts to classify dots vs. dashes.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              2. Typed Morse Text Characters
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              The image contains printed text characters (periods, hyphens, slashes) forming Morse strings:
            </p>
            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
              .... . .-.. .-.. ---
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              <strong>Recognition Method</strong>: Optical Character Recognition (OCR). Standard OCR models (e.g. Tesseract.js) recognize periods and hyphens as ASCII text, which are then passed to the Morse engine.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IMAGE-BASED MORSE DECODING WORKS (6-STEP PIPELINE) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How Image-Based Morse Decoding Works (Technical Pipeline)
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Client-side computer vision decodes images through a multi-stage image processing sequence:
        </p>

        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Image Loading &amp; Canvas Rendering</strong>: The user selects an image file. The browser renders pixels onto an off-screen HTML5 Canvas context.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Grayscale Conversion &amp; Contrast Enhancement</strong>: RGB color channels are collapsed into luminance using the standard ITU formula: <code style={{ color: 'var(--accent-primary)' }}>Y = 0.299R + 0.587G + 0.114B</code>.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Binarization Thresholding</strong>: Every pixel luminance value is evaluated against the threshold slider (default 128). Pixels below threshold become black (foreground mark); pixels above become white (background).
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Horizontal Scanline Analysis</strong>: The engine scans horizontal pixel rows across the median region of the image, recording continuous black pixel run lengths and white gap lengths.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Cluster Classification (Dot vs. Dash)</strong>: The minimum and maximum mark lengths are computed. Mark lengths exceeding the mid-point threshold are classified as dashes (<code style={{ color: 'var(--accent-primary)' }}>-</code>); shorter runs become dots (<code style={{ color: 'var(--accent-primary)' }}>.</code>).
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Gap Segmentation &amp; Morse Formatting</strong>: White pixel runs are evaluated against the minimum dot width. Gaps exceeding 2× min dot width insert character spaces; gaps exceeding 5× insert word slashes (<code style={{ color: 'var(--accent-primary)' }}>/</code>).
          </li>
        </ol>
      </section>

      {/* WHICH IMAGES WORK BEST CHECKLIST */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Which Images Work Best? (Quality Checklist)
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Optical detection accuracy depends directly on image clarity. Follow this practical checklist before uploading:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-success)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={18} />
              Ideal Input Conditions (High Confidence)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>PNG digital screenshots with sharp vector edges.</li>
              <li>High-contrast black marks on solid white background (or vice versa).</li>
              <li>Straight, level horizontal alignment (no severe tilt).</li>
              <li>Clearly visible physical spaces between dots and dashes.</li>
              <li>Tightly cropped image focusing exclusively on the Morse line.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-warning)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-warning)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} />
              Challenging Conditions (Requires Adjustment)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>Blurry photos with heavy JPEG compression artifacts.</li>
              <li>Photographs featuring harsh shadows, lens glare, or flash reflections.</li>
              <li>Tattoos on curved skin surfaces shot at sharp perspective angles.</li>
              <li>Handwritten Morse with irregular stroke weights or merged dots.</li>
              <li>Decorated wallpapers or multi-line paragraphs with overlapping graphics.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY YOU SHOULD REVIEW DETECTED MORSE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Why You Should Review the Detected Morse
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Automated visual recognition should never operate as an uninspectable black box. A minor image artifact or shadow can easily cause a single dot (<code style={{ color: 'var(--accent-primary)' }}>.</code>) to be misread as a dash (<code style={{ color: 'var(--accent-primary)' }}>-</code>).
        </p>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', margin: '1.25rem 0' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
            Example: How a Single Mark Misread Changes Meaning
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>Original Image Morse:</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem', marginTop: '0.2rem' }}>.... . .-.. .-.. ---</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Decodes correctly to: <strong>HELLO</strong></div>
            </div>
            <div>
              <span style={{ color: 'var(--accent-warning)', fontWeight: 700 }}>Misread Dash (Shadow):</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', fontSize: '1.1rem', marginTop: '0.2rem' }}>.... - .-.. .-.. ---</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Decodes incorrectly to: <strong>HTLLO</strong></div>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          By providing an <strong>editable intermediate Morse textarea</strong>, our decoder lets you quickly spot and fix the single misread character without having to re-process or re-upload the entire image.
        </p>
      </section>

      {/* SCREENSHOTS vs TATTOOS PRACTICAL GUIDES */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Special Use Cases: Screenshots, Tattoos &amp; ARG Puzzles
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Decoding Screenshots &amp; Gaming ARGs
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              In-game clues, video game puzzles, and alternate reality games (ARGs) frequently embed Morse code in screenshots or UI graphics.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Save screenshots directly as lossless <strong>PNG</strong> files.</li>
              <li>Crop out health bars, minimaps, or unrelated dialogue boxes.</li>
              <li>If the Morse is rendered in light neon colors on a dark background, check <strong>Invert Polarity</strong>.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Decoding Morse Code Tattoos
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Morse code is a popular choice for personal tattoos on wrists, forearms, or ribs.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Photograph the tattoo straight-on under bright, diffused lighting.</li>
              <li>Flatten the skin naturally to prevent curvature distortion.</li>
              <li>Review the extracted dot/dash sequence against our <a href="#" onClick={(e) => handleNav(e, 'alphabet')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Morse Alphabet Chart</a> to confirm accuracy.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TOOL COMPARISON TABLE (IMAGE vs TEXT vs AUDIO) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Image Decoder vs. Text Decoder vs. Audio Decoder
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Select the correct tool based on the physical source of your Morse code material:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Source Material</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Recommended Tool</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Primary Feature</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Photo, Screenshot, Tattoo, Scan</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Morse Code Image Decoder</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Pixel binarization &amp; shape detection</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Typed Dots &amp; Dashes (<code style={{ color: 'var(--accent-primary)' }}>.-.-</code>)</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="#" onClick={(e) => handleNav(e, 'morsedecoder')} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Morse Code Decoder</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Direct Morse-to-Text conversion &amp; auto-detection</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Plain English Text</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="#" onClick={(e) => handleNav(e, 'english2morse')} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>English to Morse Code</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Text to Morse generator with sound export</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Audio Recording, WAV/MP3, Mic</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="#" onClick={(e) => handleNav(e, 'audiotranslator')} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Morse Code Audio Translator</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>DSP Goertzel tone filter &amp; mic listener</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Single Character Lookups</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="#" onClick={(e) => handleNav(e, 'alphabet')} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Morse Code Alphabet</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>A–Z reference chart &amp; prosign audio samples</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* HOW TO DECODE MANUALLY FALLBACK GUIDE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Decode a Morse Code Image Manually (Fallback Method)
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          If an image is too blurry or damaged for automatic computer vision, you can quickly transcribe and decode the message manually using this step-by-step fallback process:
        </p>

        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Identify Mark Shapes</strong>: Examine each visual symbol. Write down a period (<code style={{ color: 'var(--accent-primary)' }}>.</code>) for short dots and a hyphen (<code style={{ color: 'var(--accent-primary)' }}>-</code>) for elongated dashes.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Mark Letter Spaces</strong>: Identify gaps between symbol groups that are roughly 3× the width of a dot. Insert a single space between letter groups.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Mark Word Spaces</strong>: Identify wider gaps that are roughly 7× the width of a dot. Insert a forward slash (<code style={{ color: 'var(--accent-primary)' }}>/</code>) to separate words.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Paste Clean Morse into Text Decoder</strong>: Copy your typed Morse string into our <a href="#" onClick={(e) => handleNav(e, 'morsedecoder')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Morse Code Decoder</a> to instantly convert it into English.
          </li>
        </ol>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Frequently Asked Questions About Image Morse Decoding
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA BAR */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Explore Other Morse Code Tools &amp; References
        </h3>
        <div style={{ display: 'flex', justifyCenter: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button
            onClick={(e) => handleNav(e, 'translator')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Morse Code Translator
          </button>
          <button
            onClick={(e) => handleNav(e, 'morsedecoder')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Morse Code Decoder
          </button>
          <button
            onClick={(e) => handleNav(e, 'audiotranslator')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Audio Translator
          </button>
          <button
            onClick={(e) => handleNav(e, 'alphabet')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Morse Code Alphabet
          </button>
          <button
            onClick={(e) => handleNav(e, 'howtoread')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            How to Read Morse Code
          </button>
        </div>
      </footer>
    </article>
  );
}
