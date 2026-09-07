import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, RefreshCw, CheckCircle, AlertTriangle, Edit3, ArrowRight } from 'lucide-react';
import { processImageForMorse } from '../engine/imageDecoderEngine.js';
import { translateMorseToText } from '../engine/morseEngine.js';

export function ImageDecoderModule({ showToast }) {
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

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file (PNG/JPG/WEBP)');
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
    };
  };

  const decodedText = translateMorseToText(detectedMorse);

  return (
    <section className="breakdown-section" id="image-decoder">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="section-title">
          <ImageIcon className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>Image Morse Decoder (Level 3 Specialist Tool)</span>
        </div>
        <p className="section-desc">
          Upload an image, screenshot, or graphic containing Morse code dots & dashes. The client-side optical OCR engine thresholds pixels and extracts editable Morse code.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {/* Left: Upload & Image Canvas Preview */}
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--accent-primary)' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Click or Drop Image Here</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PNG, JPG, WEBP or Screenshot</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {imageSrc && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Optical Binarized Output:</div>
                <img
                  ref={imgRef}
                  src={processedCanvasUrl || imageSrc}
                  alt="Optical Processing Preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />

                {/* Preprocessing controls */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Threshold: {threshold}
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
                      style={{ display: 'block', width: '100px' }}
                    />
                  </label>

                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={invert}
                      onChange={(e) => {
                        setInvert(e.target.checked);
                        if (imageSrc) runDetection(imageSrc, { threshold, contrast, invert: e.target.checked });
                      }}
                    />
                    Invert Colors
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Right: Detected Evidence & Editable Morse Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Detected Morse Code
                </span>
                {confidence > 0 && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: confidence > 70 ? 'var(--accent-success)' : 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {confidence > 70 ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    Estimated Confidence: {confidence}%
                  </span>
                )}
              </div>

              <textarea
                value={detectedMorse}
                onChange={(e) => setDetectedMorse(e.target.value)}
                className="panel-textarea morse-font"
                placeholder="Detected Morse sequence will appear here. You can edit dots & dashes manually if optical detection requires fine-tuning."
                style={{ minHeight: '80px', fontSize: '1.1rem' }}
              />
            </div>

            <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Decoded Text Result
              </span>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Decoded message output...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
