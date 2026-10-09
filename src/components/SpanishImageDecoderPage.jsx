import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon, Upload, CheckCircle, AlertTriangle, Zap, Copy, Check,
  Play, Square, ShieldCheck, Eye, ChevronDown, ChevronUp, Camera, Sliders, ArrowRight, HelpCircle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToSpanish, translateSpanishToMorse, getSpanishCharacterBreakdown } from '../engine/spanishMorse.js';
import { processImageForMorse } from '../engine/imageDecoderEngine.js';

export function SpanishImageDecoderPage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
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
        if (showToast) showToast('Por favor sube un archivo de imagen válido (PNG, JPG, WEBP)');
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
      if (showToast) showToast('Detección óptica completada con éxito ✓');
    };
  };

  // Sample Image Loaders
  const loadSampleImage = (sampleType) => {
    let sampleText = '.... --- .-.. .- / -- ..- -. -.. ---';
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

  const decodedText = translateMorseToSpanish(detectedMorse);

  // Audio Playback Helper
  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateSpanishToMorse(textToPlay).morseText;
    const breakdown = getSpanishCharacterBreakdown(textToPlay);

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
  const handleCopy = (id, textToCopy, label = '¡Copiado al portapapeles!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Tab Navigation Helper
  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (path && typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: '¿Se puede decodificar código Morse directamente desde una imagen?',
      a: 'Sí. Un decodificador óptico de código Morse procesa fotografías, capturas de pantalla, planos escaneados y gráficos que contengan puntos y rayas visibles. Binariza los píxeles mediante un umbral de luminosidad, analiza la longitud relativa de los trazos y los espacios en blanco, genera la secuencia Morse intermedia y la traduce a texto legible en español.'
    },
    {
      q: '¿Es posible decodificar código Morse desde una captura de pantalla de un videojuego o acertijo?',
      a: 'Sí. De hecho, las capturas de pantalla digitales (especialmente en formato PNG sin compresión con pérdida) son la fuente con mayor tasa de acierto, ya que presentan bordes nítidos, alto contraste de píxeles y dimensiones regulares sin sombras ni desenfoque óptico.'
    },
    {
      q: '¿Puede el decodificador de imágenes leer código Morse escrito a mano?',
      a: 'El código Morse manuscrito puede decodificarse si los puntos y las rayas se dibujaron con un grosor uniforme y espaciados regulares. Sin embargo, las variaciones en la presión del trazo o las líneas inclinadas pueden generar confusiones entre puntos y rayas. Por ello, nuestra herramienta incluye un cuadro de texto intermedio editable para corregir manualmente cualquier símbolo impreciso.'
    },
    {
      q: '¿Cómo decodificar un tatuaje de código Morse desde una fotografía?',
      a: 'Para obtener el mejor resultado con un tatuaje, toma la foto de frente, perpendicular a la piel y bajo iluminación brillante y difusa (evitando brillos directos o sombras pronunciadas). Como la curvatura del brazo o las costillas puede distorsionar las proporciones entre puntos y rayas, siempre te recomendamos verificar la secuencia en el cuadro editable antes de tomar el texto como definitivo.'
    },
    {
      q: '¿Por qué la herramienta puede interpretar incorrectamente un punto como una raya?',
      a: 'Las causas más habituales son sombras suaves alrededor de un punto, baja resolución, desenfoque de movimiento o compresión JPEG que extiende los píxeles oscuros. Ajustando el control deslizante de umbral (Threshold) o recortando la imagen para aislar únicamente la línea telegráfica, se resuelve la gran mayoría de estos fallos.'
    },
    {
      q: '¿Cuál es la diferencia entre un decodificador de imágenes y un traductor de texto?',
      a: 'El decodificador de imágenes utiliza visión artificial y procesamiento de píxeles en Canvas para extraer símbolos gráficos visuales de una foto. El Traductor de Código Morse se utiliza cuando ya tienes los puntos y rayas escritos como texto (. y -) o cuando deseas convertir texto en español a señales sonoras.'
    },
    {
      q: '¿El decodificador de imágenes es lo mismo que un OCR tradicional?',
      a: 'No exactamente. Los motores OCR convencionales (como Tesseract) están entrenados para reconocer tipos de letra y caracteres tipográficos estándar (A–Z, 0–9). Nuestro motor óptico analiza longitudes físicas de píxeles negros continuos y proporciones métricas según la norma ITU-R M.1677-1, segmentando directamente puntos, rayas y silencios.'
    }
  ];

  return (
    <article className="article-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* HEADER SECTION */}
      <header className="article-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>
          <ImageIcon size={16} />
          <span>Herramienta de Visión Artificial Óptica en el Navegador</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '1rem' }}>
          Decodificador de Código Morse desde Imágenes y Fotos Online
        </h1>

        <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Si tienes una secuencia de código Morse en una fotografía, captura de pantalla, tatuaje o acertijo gráfico, transcribir manualmente cada punto y raya puede resultar tedioso y propenso a errores. Carga tu imagen y nuestro motor óptico local binarizará los píxeles en Canvas, extraerá los puntos y rayas, te permitirá editar la secuencia intermedia y la convertirá instantáneamente a texto en español.
        </p>

        {/* TRUST / PRIVACY BADGES */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0.85rem 1.15rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} style={{ color: '#10b981' }} />
            <span>Privacidad 100% Local (0 Subidas a Servidores)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--primary)' }} />
            <span>Binarización Instantánea en HTML5 Canvas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} style={{ color: '#f59e0b' }} />
            <span>Secuencia Intermedia Editable en Tiempo Real</span>
          </div>
        </div>
      </header>

      {/* ABOVE THE FOLD: INTERACTIVE IMAGE DECODER TOOL */}
      <section className="breakdown-section" id="image-decoder-tool" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface-elevated)' }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Decodificador Óptico Interactivo de Imágenes</span>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'var(--surface)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600 }}>
              Motor de Visión HTML5 Canvas
            </span>
          </div>

          <p className="section-desc" style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Sube cualquier imagen (PNG, JPG, WEBP) o captura de pantalla. Ajusta los controles de umbral de binarización y polaridad para inspeccionar los puntos, rayas y espacios detectados.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* LEFT COLUMN: UPLOAD & PREVIEW */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--surface)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Upload size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Haz clic o arrastra tu foto o captura aquí</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Admite PNG, JPG, WEBP o pegar desde el portapapeles</div>
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Probar ejemplos:</span>
                <button
                  type="button"
                  onClick={() => loadSampleImage('hello')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "Hola Mundo"
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleImage('sos')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "Señal SOS"
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleImage('cq')}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  "Llamada CQ"
                </button>
              </div>

              {/* Binarization Preview & Adjustments */}
              {imageSrc && (
                <div style={{ marginTop: '1.25rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Vista previa óptica binarizada:</span>
                    {isProcessing && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>Procesando píxeles...</span>}
                  </div>
                  <img
                    ref={imgRef}
                    src={processedCanvasUrl || imageSrc}
                    alt="Vista previa de procesamiento óptico"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#000' }}
                  />

                  {/* Preprocessing Sliders */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                      Umbral (Threshold): <strong>{threshold}</strong>
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
                        style={{ display: 'block', width: '110px', marginTop: '0.25rem', accentColor: 'var(--primary)' }}
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
                      Invertir polaridad (trazos claros sobre fondo oscuro)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETECTED MORSE & DECODED TEXT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Secuencia Morse Extraída (Editable)
                  </span>
                  {confidence > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: confidence > 70 ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {confidence > 70 ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                      Confianza: {confidence}%
                    </span>
                  )}
                </div>

                <textarea
                  value={detectedMorse}
                  onChange={(e) => setDetectedMorse(e.target.value)}
                  className="panel-textarea morse-font"
                  placeholder="Los puntos (.) y rayas (-) detectados aparecerán aquí. Puedes editar el texto manualmente si necesitas afinar la lectura óptica."
                  style={{ minHeight: '90px', fontSize: '1.15rem', fontFamily: 'monospace', letterSpacing: '0.05em', width: '100%', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleCopy('morse', detectedMorse, '¡Código Morse copiado!')}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-elevated)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text)' }}
                  >
                    {copiedId === 'morse' ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                    Copiar Morse
                  </button>
                </div>
              </div>

              {/* Decoded Output Box */}
              <div style={{ background: 'var(--surface)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Texto en Español Traducido
                  </span>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', wordBreak: 'break-word', minHeight: '40px' }}>
                    {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Sube o selecciona una imagen de ejemplo arriba para traducir...</span>}
                  </div>
                </div>

                {decodedText && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handlePlayMorse('decoded', decodedText)}
                      style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {playingId === 'decoded' ? <Square size={14} /> : <Play size={14} />}
                      {playingId === 'decoded' ? 'Detener Sonido' : 'Escuchar Audio Morse'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('text', decodedText, '¡Texto traducido copiado!')}
                      style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-elevated)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {copiedId === 'text' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                      Copiar Texto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK WORKFLOW SUMMARY (6-STEP PIPELINE) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Decodificar Código Morse desde una Imagen (Flujo en 6 Pasos)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          La decodificación óptica visual requiere convertir píxeles gráficos en duraciones físicas de señal según las normas internacionales. Nuestro proceso sigue seis etapas bien definidas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>1. Subir y Recortar</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Selecciona una foto, captura o escaneo. Recorta la imagen ajustándola a la línea de código Morse para excluir gráficos o textos secundarios.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>2. Binarización de Umbral</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Ajusta el deslizador de umbral para separar los trazos oscuros del fondo, generando siluetas nítidas en blanco y negro puro.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>3. Clasificación de Trazos</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              El motor mide las longitudes continuas de píxeles: los trazos cortos se clasifican como puntos (<code style={{ color: 'var(--primary)' }}>.</code>) y los largos como rayas (<code style={{ color: 'var(--primary)' }}>-</code>).
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>4. Análisis de Espacios y Silencios</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Las pausas blancas se analizan para distinguir silencios entre elementos (1 unidad), espacios entre letras (3 unidades) y separaciones entre palabras (<code style={{ color: 'var(--primary)' }}>/</code>, 7 unidades).
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>5. Revisión de Morse Extraído</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Revisa la caja de texto intermedia. Si una sombra o mancha convirtió erróneamente un punto en raya, puedes corregir el símbolo al instante.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>6. Traducción y Audio</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              La secuencia Morse validada se transforma en texto en español según el estándar internacional, lista para copiar o reproducir en audio.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IS A MORSE CODE IMAGE DECODER */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Qué es un Decodificador de Código Morse en Imágenes?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Un <strong>decodificador de código Morse para imágenes</strong> es una utilidad técnica especializada que extrae secuencias visuales de puntos y rayas a partir de fotografías, capturas de pantalla, documentos antiguos escaneados, tatuajes corporales y pistas de acertijos gráficos (ARGs), transformando esas marcas gráficas en texto alfanumérico comprensible.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          El Código Morse Internacional se rige bajo la recomendación oficial <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>ITU-R M.1677-1</a> de la Unión Internacional de Telecomunicaciones, la cual especifica relaciones de proporción matemática estrictas entre puntos, rayas y silencios. En una imagen estática digital, estas proporciones de tiempo se manifiestan físicamente como anchos de píxeles horizontales.
        </p>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', margin: '1.5rem 0' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>Estándar de Proporciones Oficial ITU-R M.1677-1</h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li><strong>Punto (Dit)</strong>: 1 unidad métrica de longitud física (o duración temporal).</li>
            <li><strong>Raya (Dah)</strong>: Exactamente 3 unidades de longitud (el triple de un punto).</li>
            <li><strong>Espacio entre elementos</strong>: 1 unidad de silencio entre puntos y rayas dentro de una misma letra.</li>
            <li><strong>Espacio entre letras</strong>: 3 unidades de silencio entre letras consecutivas.</li>
            <li><strong>Espacio entre palabras</strong>: 7 unidades de silencio entre palabras independientes.</li>
          </ul>
        </div>
      </section>

      {/* WHAT DOES AN IMAGE DECODER READ: GRAPHIC vs TYPED */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Qué Lee Realmente un Decodificador Óptico: Trazos Gráficos vs. Caracteres Tipográficos?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          El código Morse presente en una imagen suele pertenecer a una de dos categorías completamente diferentes. Conocer esta distinción es clave para entender el proceso de reconocimiento:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              1. Puntos y Rayas Gráficos (Formas Geométricas)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              La imagen contiene círculos impresos, barras rectangulares, líneas dibujadas o cortes grabados:
            </p>
            <div style={{ background: 'var(--surface)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
              ... --- ...
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              <strong>Método de reconocimiento</strong>: Visión artificial por análisis de formas. El motor analiza las relaciones de aspecto, los anchos de los cuadros delimitadores y el recuento de píxeles horizontales para clasificar puntos frente a rayas.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              2. Caracteres Tipográficos Escritos (Texto Impreso)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              La imagen contiene caracteres tipográficos digitales (puntos de teclado, guiones, barras diagonales):
            </p>
            <div style={{ background: 'var(--surface)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
              .... --- .-.. .-
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              <strong>Método de reconocimiento</strong>: Reconocimiento Óptico de Caracteres (OCR). Los modelos OCR clásicos reconocen puntos y guiones como caracteres ASCII estándar, que luego se transmiten a nuestro motor de traducción de texto.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IMAGE-BASED MORSE DECODING WORKS (6-STEP PIPELINE) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Funciona la Decodificación Óptica de Morse (Canalización Técnica)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          La visión computacional en el cliente transforma una imagen cruda en texto mediante un proceso de seis etapas consecutivas en memoria:
        </p>

        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Carga de Imagen y Renderizado en Canvas</strong>: El usuario carga el archivo. El navegador dibuja los píxeles en un contexto gráfico HTML5 Canvas fuera de pantalla (off-screen).
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Conversión a Escala de Grises y Realce de Contraste</strong>: Los tres canales de color RGB se condensan en luminancia utilizando la fórmula de ponderación de la norma ITU: <code style={{ color: 'var(--primary)' }}>Y = 0.299R + 0.587G + 0.114B</code>.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Binarización por Umbral (Thresholding)</strong>: Cada píxel se evalúa contra el valor del control deslizante (por defecto 128). Los píxeles con luminancia inferior se convierten en negro puro (trazo telegráfico); los superiores en blanco puro (fondo).
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Escaneo de Líneas Horizontales (Scanlines)</strong>: El motor recorre filas de píxeles a lo largo de la franja media de la imagen, registrando las longitudes continuas de píxeles negros y las pausas blancas intermedias.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Agrupamiento Estadístico (Punto vs. Raya)</strong>: Se calculan las longitudes mínimas y máximas de trazo. Aquellos trazos que superan el punto medio se catalogan como rayas (<code style={{ color: 'var(--primary)' }}>-</code>); los más breves como puntos (<code style={{ color: 'var(--primary)' }}>.</code>).
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>Segmentación de Espacios y Formato Morse</strong>: Las pausas blancas se comparan contra el ancho mínimo del punto. Espacios superiores a 2× el ancho del punto insertan separadores entre caracteres; espacios superiores a 5× insertan barras separadoras entre palabras (<code style={{ color: 'var(--primary)' }}>/</code>).
          </li>
        </ol>
      </section>

      {/* WHICH IMAGES WORK BEST CHECKLIST */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Qué Imágenes Funcionan Mejor? (Lista de Calidad y Consejos Prácticos)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          La precisión del reconocimiento óptico depende directamente de la claridad del material visual. Consulta esta lista práctica antes de procesar tu archivo:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #10b981' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={18} />
              Condiciones Ideales (Alta Confianza)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>Capturas de pantalla digitales en PNG con bordes nítidos.</li>
              <li>Trazos negros de alto contraste sobre fondo blanco limpio (o viceversa).</li>
              <li>Alineación horizontal recta sin inclinación pronunciada.</li>
              <li>Espacios físicos claramente distinguibles entre puntos y rayas.</li>
              <li>Imagen recortada ajustada únicamente a la línea que contiene el código Morse.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #f59e0b' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} />
              Condiciones Difíciles (Requieren Ajuste Manual)
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>Fotografías borrosas con fuerte compresión JPEG o ruido de sensor.</li>
              <li>Fotos con sombras diagonales duras, brillos de flash o reflejos de cristal.</li>
              <li>Tatuajes en zonas corporales curvas fotografiadas en ángulo oblicuo.</li>
              <li>Morse manuscrito con grosores de tinta desiguales o puntos fusionados.</li>
              <li>Imágenes con fondos texturizados o párrafos de texto impreso mezclados.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY YOU SHOULD REVIEW DETECTED MORSE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Por Qué Es Crucial Revisar la Secuencia Morse Detectada
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          El reconocimiento visual automatizado jamás debe operar como una caja negra inaccesible. Una leve sombra o mancha en la imagen puede hacer que un solo punto (<code style={{ color: 'var(--primary)' }}>.</code>) se prolongue y sea clasificado erróneamente como una raya (<code style={{ color: 'var(--primary)' }}>-</code>).
        </p>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1.25rem 0' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
            Ejemplo Real: Cómo una Sombra Cambia por Completo el Significado
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Secuencia Morse Original:</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginTop: '0.2rem' }}>.... --- .-.. .-</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Se traduce correctamente a: <strong>HOLA</strong></div>
            </div>
            <div>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>Raya Falsa por Sombra en la 'O':</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b', fontSize: '1.1rem', marginTop: '0.2rem' }}>.... -.-. .-.. .-</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Se traduce incorrectamente a: <strong>HCLA</strong></div>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Al ofrecer un <strong>área de texto intermedia editable</strong>, nuestro decodificador te permite corregir ese único símbolo impreciso en segundos sin tener que volver a recortar ni subir la imagen.
        </p>
      </section>

      {/* SCREENSHOTS vs TATTOOS PRACTICAL GUIDES */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Casos de Uso Especiales: Capturas de Juegos, Tatuajes y Acertijos ARG
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Decodificar Capturas de Videojuegos y Desafíos ARG
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Pistas en títulos como Battlefield, Call of Duty, puzzles de escape room y juegos de realidad alternativa (ARGs) ocultan mensajes en código Morse en pantallas o interfaces gráficas.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Guarda la captura como archivo <strong>PNG</strong> sin comprimir.</li>
              <li>Recorta barras de vida, minimapas o textos decorativos irrelevantes.</li>
              <li>Si el código Morse aparece en colores de neón claros sobre fondo negro, activa la casilla <strong>Invertir polaridad</strong>.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Decodificar Tatuajes de Código Morse
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              El código Morse es una opción muy popular para tatuajes discretos con nombres, fechas o mensajes personales en muñecas o costillas.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Fotografía el tatuaje de frente bajo iluminación natural y difusa.</li>
              <li>Estira suavemente la piel para evitar que la curvatura deforme las distancias.</li>
              <li>Verifica la secuencia obtenida contra nuestra <a href="/es/morse-code-alphabet/" onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Tabla del Alfabeto Morse</a> para confirmar su precisión.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TOOL COMPARISON TABLE (IMAGE vs TEXT vs AUDIO) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Comparativa: Decodificador de Imagen vs. Traductor de Texto vs. Decodificador de Audio
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Elige la herramienta adecuada según el formato en el que se encuentre tu mensaje en código Morse:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface-elevated)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Formato del Mensaje</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Herramienta Recomendada</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Función Principal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Foto, Captura, Tatuaje o Gráfico</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="/es/morse-code-image-decoder/" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>Decodificador de Imagen</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Binarización óptica y detección de trazos en píxeles</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Puntos y Rayas Escritos (<code style={{ color: 'var(--primary)' }}>.... --- .-.. .-</code>)</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="/es/morse-code-decoder/" onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Decodificador de Código Morse</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Traducción instantánea de Morse a texto y análisis de espacios</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Texto en Español</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="/es/english-to-morse-code/" onClick={(e) => handleNav(e, 'es-english2morse', '/es/english-to-morse-code/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Texto a Código Morse</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Conversión de texto a Morse con soporte de letra Ñ y descarga WAV</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Archivo de Audio, Grabación WAV/MP3</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="/es/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Traductor de Audio Morse</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Decodificación digital por AudioContext en memoria local</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Consulta de Letras o Números Individuales</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href="/es/morse-code-alphabet/" onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Alfabeto Código Morse</a>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Tabla de 27 letras (con Ñ) y reproducción de audio por tecla</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* HOW TO DECODE MANUALLY FALLBACK GUIDE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Decodificar una Imagen Manualmente (Método Alternativo de Respaldo)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Si una fotografía está demasiado deteriorada, borrosa o con bajo contraste para que la visión artificial automática la procese con precisión, puedes transcribir el mensaje de forma manual siguiendo este procedimiento paso a paso:
        </p>

        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Identifica los Símbolos Visuales</strong>: Examina cada trazo individual. Escribe un punto (<code style={{ color: 'var(--primary)' }}>.</code>) para los círculos o marcas cortas y un guion (<code style={{ color: 'var(--primary)' }}>-</code>) para las barras alargadas.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Marca los Espacios entre Letras</strong>: Identifica las pausas que equivalgan aproximadamente al triple del ancho de un punto. Deja un espacio simple (<code style={{ color: 'var(--primary)' }}> </code>) entre cada letra.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Marca los Espacios entre Palabras</strong>: Identifica los espacios más anchos que equivalgan aproximadamente a siete veces el ancho de un punto. Inserta una barra diagonal (<code style={{ color: 'var(--primary)' }}>/</code>) o tres espacios para separar palabras.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Pega la Secuencia en el Decodificador</strong>: Copia la cadena Morse limpia en nuestro <a href="/es/morse-code-decoder/" onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Decodificador de Código Morse</a> para obtener la traducción en español de forma instantánea.
          </li>
        </ol>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
          Preguntas Frecuentes sobre la Decodificación de Morse en Imágenes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA BAR */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Explora Otras Herramientas y Guías en Español
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Traductor de Código Morse
          </a>
          <a
            href="/es/morse-code-decoder/"
            onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Decodificador de Texto
          </a>
          <a
            href="/es/morse-code-audio-translator/"
            onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Traductor de Audio Morse
          </a>
          <a
            href="/es/morse-code-alphabet/"
            onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Alfabeto Código Morse
          </a>
          <a
            href="/es/how-to-read-morse-code/"
            onClick={(e) => handleNav(e, 'es-howtoread', '/es/how-to-read-morse-code/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Cómo Leer Código Morse
          </a>
        </div>
      </footer>
    </article>
  );
}

export default SpanishImageDecoderPage;
