import React from 'react';
import {
  ExternalLink, ShieldCheck
} from 'lucide-react';

export function SpanishArticleContent({ setActiveTab }) {
  const handleNav = (e, tab, path) => {
    if (e) e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (path && typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <article className="seo-article-container">
      {/* 1. INTRODUCCIÓN (Estilo PAS: 2 párrafos concisos y directos) */}
      <div className="article-intro-card">
        <p className="intro-paragraph">
          ¿Alguna vez has encontrado un mensaje compuesto por puntos y rayas y no has tenido idea de lo que significa? El código Morse parece simple a primera vista, pero un solo punto ausente, una raya adicional o un espaciado incorrecto pueden transformar por completo el resultado. Comprobar manualmente cada carácter consume tiempo y aumenta el riesgo de cometer equivocaciones, especialmente cuando se necesita una traducción rápida y confiable.
        </p>
        <p className="intro-paragraph">
          Ahí es donde nuestro Traductor de Código Morse resulta indispensable. Ingresa texto en español o en inglés para generar código Morse al instante, o pega una secuencia de puntos y rayas para decodificarla en texto legible. Podrás inspeccionar caracteres individuales, escuchar la señal acústica en tiempo real, copiar el resultado con un solo clic y verificar la precisión del mensaje antes de utilizarlo en una dedicatoria, proyecto escolar, diseño de tatuaje o comunicación por radio.
        </p>
      </div>

      {/* CUERPO DEL ARTÍCULO */}
      <div className="article-body-content">

        {/* SECCIÓN 1: ¿Qué es un Traductor de Código Morse? */}
        <section className="content-section">
          <h2>¿Qué es un Traductor de Código Morse?</h2>
          <p>
            Un Traductor de Código Morse es una herramienta bidireccional que convierte texto escrito en código Morse y traduce secuencias de código Morse de vuelta a texto legible.
          </p>
          <p>
            El código Morse representa cada letra, número y signo ortográfico mediante señales cortas y largas. En la notación escrita, estas señales se representan universalmente mediante puntos y rayas.
          </p>
          <p>
            Por ejemplo:
          </p>

          <div className="code-demo-box">
            <div className="demo-step">
              <span className="demo-label">Texto Claro:</span>
              <strong className="demo-val">SOS</strong>
            </div>
            <div className="demo-arrow">se convierte en:</div>
            <div className="demo-step">
              <span className="demo-label">Código Morse:</span>
              <code className="demo-val morse-font">... --- ...</code>
            </div>
          </div>

          <p>
            La misma secuencia puede ser decodificada en sentido inverso para devolver:
          </p>
          <p>
            <strong>SOS</strong>
          </p>
          <p>
            Un traductor especializado te permite:
          </p>
          <ul className="content-list">
            <li>Convertir texto en español e inglés a código Morse</li>
            <li>Convertir código Morse de vuelta a texto en español</li>
            <li>Verificar y corregir mensajes telegráficos dudosos</li>
            <li>Escuchar la reproducción de audio con tonos sinusoidales limpios</li>
            <li>Aprender los patrones rítmicos de cada letra y número</li>
            <li>Practicar telegrafía auditiva con espaciado Farnsworth</li>
            <li>Crear mensajes cifrados para acertijos, juegos y proyectos creativos</li>
          </ul>
        </section>

        {/* SECCIÓN 2: Cómo Utilizar Este Traductor de Código Morse */}
        <section className="content-section">
          <h2>Cómo Utilizar Este Traductor de Código Morse</h2>
          <p>
            No necesitas conocer el alfabeto Morse de memoria para empezar a utilizar esta herramienta. Su diseño intuitivo guía cada paso:
          </p>

          <h3>Ingresa tu Texto</h3>
          <p>
            Escribe o pega texto ordinario en el panel de entrada de la izquierda.
          </p>
          <p>
            Por ejemplo: <strong>HOLA MUNDO</strong>
          </p>
          <p>
            El traductor convertirá automáticamente cada palabra en su correspondiente secuencia telegráfica.
          </p>

          <h3>O Ingresa Código Morse Directamente</h3>
          <p>
            También puedes ingresar una secuencia compuesta por puntos y rayas directamente en el editor.
          </p>
          <p>
            Por ejemplo: <code className="morse-font">.... --- .-.. .-</code> significa <strong>HOLA</strong>.
          </p>
          <p>
            Los espacios son fundamentales: separan las letras individuales, mientras que las barras inclinadas (<code>/</code>) separan las palabras completas.
          </p>

          <h3>Detección Automática Inteligente</h3>
          <p>
            La función de Detección Automática es ideal cuando no estás seguro de en qué dirección traducir.
          </p>
          <p>
            Las letras y palabras convencionales se procesan como texto plano, mientras que las cadenas conformadas por puntos, rayas, guiones y barras se interpretan inmediatamente como código Morse.
          </p>
          <p>
            La autodetección funciona de manera óptima con entradas claras. Las secuencias ambiguas o combinaciones no estandarizadas pueden ajustarse seleccionando manualmente el sentido de la traducción.
          </p>

          <h3>Conversión en Tiempo Real</h3>
          <p>
            El motor de traducción actualiza el resultado de forma instantánea a medida que escribes cada tecla.
          </p>
          <p>
            Esto resulta muy cómodo para verificar palabras sueltas, frases, números telefónicos o fragmentos telegráficos breves.
          </p>
          <p>
            No necesitas recargar la página web, pulsar botones de envío ni cambiar de pestaña.
          </p>

          <h3>Reproducir Audio en Tiempo Real</h3>
          <p>
            El código Morse es, ante todo, un sistema de comunicación acústico.
          </p>
          <p>
            Haz clic en el botón de reproducción para escuchar las señales cortas y largas del mensaje traducido con un oscilador Web Audio puro.
          </p>
          <p>
            El entrenamiento por oído es el método más recomendado por las federaciones de radioaficionados, como la <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">ARRL <ExternalLink size={12} /></a> y la Unión de Radioaficionados Españoles (URE), ya que el código Morse se reconoce por su musicalidad y cadencia rítmica en lugar de contar puntos con los ojos.
          </p>

          <h3>Copiar Resultados al Portapapeles</h3>
          <p>
            Copia el texto traducido o los puntos y rayas con un simple clic cuando termines.
          </p>
          <p>
            Podrás pegar el resultado en aplicaciones de mensajería, documentos, regalos personalizados, pulseras artesanales, grabados en joyas o notas de estudio.
          </p>

          <figure className="article-figure">
            <picture>
              <source srcSet="/images/morse-code-translator-interface.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-interface.png?v=2"
                alt="Interfaz del Traductor de Código Morse en tiempo real convirtiendo texto a Morse con controles de audio y copia"
                width="1080"
                height="720"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              <strong>Figura 1:</strong> Interfaz del traductor de código Morse en tiempo real convirtiendo texto a código Morse conforme a la norma UIT-R, con reproductor de audio en vivo, exportación a WAV y botones de copia.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 3: Traductor vs. Decodificador vs. Generador */}
        <section className="content-section">
          <h2>Traductor de Código Morse vs. Decodificador vs. Generador</h2>
          <p>
            Aunque estos términos suelen emplearse indistintamente en internet, describen funciones técnicas bien diferenciadas:
          </p>

          <div className="table-responsive">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Herramienta</th>
                  <th>Propósito Principal</th>
                  <th>Tipo de Entrada Típica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Traductor de Código Morse</strong></td>
                  <td>Conversión bidireccional (Texto ↔ Morse)</td>
                  <td>Texto alfanumérico o puntos y rayas mecanografiados</td>
                </tr>
                <tr>
                  <td><strong>Convertidor de Código Morse</strong></td>
                  <td>Transforma una representación en otra</td>
                  <td>Texto, números o patrones en pantalla</td>
                </tr>
                <tr>
                  <td><strong>Decodificador de Código Morse</strong></td>
                  <td>Convierte señales Morse en texto legible</td>
                  <td>Secuencias de Morse escritas, señales de audio o fotos</td>
                </tr>
                <tr>
                  <td><strong>Generador de Código Morse</strong></td>
                  <td>Produce código Morse o audio a partir de texto</td>
                  <td>Texto claro para síntesis acústica o visual</td>
                </tr>
                <tr>
                  <td><strong>Decodificador de Audio Morse</strong></td>
                  <td>Detecta y extrae telegrafía desde archivos de sonido</td>
                  <td>Grabaciones de audio en formatos WAV, MP3 o micrófono</td>
                </tr>
                <tr>
                  <td><strong>Decodificador de Imágenes Morse</strong></td>
                  <td>Extrae puntos y rayas desde fotografías y capturas</td>
                  <td>Imágenes en JPG, PNG o WebP con visión artificial</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Un traductor convencional de texto procesa caracteres tipográficos limpios.
          </p>
          <p>
            Por su parte, un decodificador de audio o de imágenes enfrenta una tarea más compleja: debe primero aislar las señales útiles del ruido de fondo o de la iluminación antes de poder resolver el texto. Explora nuestra página especializada de <a href="/es/morse-code-decoder/" onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}>Decodificador de Código Morse</a> para conocer herramientas avanzadas de reconocimiento de señal.
          </p>
        </section>

        {/* SECCIÓN 4: Cómo Funciona la Codificación en Código Morse */}
        <section className="content-section">
          <h2>Cómo Funciona la Codificación en Código Morse</h2>
          <p>
            El código Morse asigna un patrón único de señales cortas y largas a cada letra, número y signo de puntuación.
          </p>
          <p>
            Un punto (dit) es una señal elemental corta.
          </p>
          <p>
            Una raya (dah) es una señal larga, equivalente a tres veces la duración de un punto.
          </p>
          <p>
            Ejemplos clave del alfabeto:
          </p>
          <ul className="code-list">
            <li><strong>E = .</strong> (una señal corta, la letra más frecuente)</li>
            <li><strong>T = -</strong> (una señal larga)</li>
            <li><strong>A = .-</strong> (un punto y una raya)</li>
            <li><strong>N = -.</strong> (una raya y un punto)</li>
            <li><strong>S = ...</strong> (tres puntos consecutivos)</li>
            <li><strong>O = ---</strong> (tres rayas consecutivas)</li>
            <li><strong>Ñ = --.--</strong> (carácter oficial del idioma español)</li>
          </ul>
          <p>
            El orden preciso de las señales define de manera inequívoca el carácter resultante.
          </p>
          <p>
            El espaciado es igualmente indispensable: define dónde concluye un símbolo y dónde comienza el siguiente.
          </p>
          <p>
            El código Morse se puede transmitir mediante impulsos de sonido, destellos de luz, pulsos eléctricos por cable, vibraciones táctiles o señales de radiofrecuencia (CW).
          </p>
        </section>

        {/* SECCIÓN 5: Cómo Leer y Escribir Código Morse */}
        <section className="content-section">
          <h2>Cómo Leer y Escribir Código Morse</h2>
          <p>
            Leer código Morse significa convertir patrones de señales en letras y palabras comprensibles.
          </p>
          <p>
            Escribir código Morse significa convertir letras y palabras en secuencias de puntos y rayas. Para un desglose didáctico completo, consulta nuestra guía sobre <a href="/es/how-to-read-morse-code/" onClick={(e) => handleNav(e, 'es-howtoread', '/es/how-to-read-morse-code/')}>cómo leer código Morse</a>.
          </p>

          <h3>El Proceso de Decodificación: Lectura del Código Morse</h3>
          <p>
            El primer paso consiste en segmentar el mensaje en grupos individuales delimitados por espacios:
          </p>
          <p>
            Por ejemplo: <code className="morse-font">.... --- .-.. .-</code>
          </p>
          <p>
            se lee separando cada carácter:
          </p>
          <ul className="content-list">
            <li><code className="morse-font">....</code> = H (cuatro puntos)</li>
            <li><code className="morse-font">---</code> = O (tres rayas)</li>
            <li><code className="morse-font">.-..</code> = L (un punto, una raya, dos puntos)</li>
            <li><code className="morse-font">.-</code> = A (un punto, una raya)</li>
          </ul>
          <p>
            El resultado decodificado es: <strong>HOLA</strong>
          </p>
          <p>
            Si se omiten los espacios entre caracteres, la secuencia se vuelve ambigua y puede generar combinaciones completamente erróneas.
          </p>

          <figure className="article-figure">
            <picture>
              <source srcSet="/images/morse-code-translator-character-breakdown.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-character-breakdown.png?v=2"
                alt="Desglose interactivo carácter por carácter mostrando el mapeo de letras, secuencias de puntos y rayas, ritmo fonético y controles de audio"
                width="1080"
                height="620"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              <strong>Figura 2:</strong> Desglose interactivo carácter por carácter que muestra cada letra asociada a su secuencia de puntos y rayas, pronunciación fonética (dits y dahs) y reproducción de audio individual.
            </figcaption>
          </figure>

          <h3>El Proceso de Codificación: Escritura del Código Morse</h3>
          <p>
            Para escribir en código Morse, traduce cada letra alfabética a su patrón correspondiente, insertando un espacio entre caracteres:
          </p>
          <p>
            Por ejemplo: <strong>SOL</strong> se convierte en <code className="morse-font">... --- .-..</code>
          </p>
          <p>
            Cada bloque representa una letra autónoma.
          </p>
          <p>
            Nuestro traductor automatiza este proceso en milisegundos, eliminando los errores de consulta manual en tablas impresas.
          </p>

          <h3>¡Domina el Ritmo! El Pulso Vital del Código Morse</h3>
          <p>
            El código Morse no es únicamente una combinación estática de puntos y rayas dibujados sobre un papel.
          </p>
          <p>
            El tiempo y la cadencia rítmica constituyen la verdadera esencia del sistema.
          </p>
          <p>
            Cuando el código se escucha como sonido, las duraciones relativas de las señales y los silencios crean una melodía inconfundible.
          </p>
          <p>
            Esta es la razón por la cual los telegrafistas y radioaficionados experimentados identifican letras completas de inmediato por su ritmo acústico, sin tener que contar cuántos puntos o rayas contiene cada carácter.
          </p>
        </section>

        {/* SECCIÓN 6: Temporización Oficial en el Código Morse */}
        <section className="content-section">
          <h2>Temporización Oficial en el Código Morse</h2>
          <p>
            La temporización matemática es el pilar que define la inteligibilidad del código Morse.
          </p>
          <p>
            La unidad elemental de tiempo (1 unidad) equivale exactamente a la duración de un punto (dit).
          </p>
          <p>
            Una raya (dah) dura exactamente tres unidades elementales (3 unidades).
          </p>
          <p>
            El intervalo de silencio entre elementos dentro de la misma letra es de una unidad (1 unidad).
          </p>
          <p>
            El intervalo de silencio entre letras distintas es de tres unidades (3 unidades).
          </p>
          <p>
            El intervalo de silencio entre palabras completas es de siete unidades (7 unidades).
          </p>
          <p>
            Esta rigurosa estructura temporal (regla 1-3-1-3-7) permite al oído discernir sin titubeos dónde termina una señal y dónde empieza la siguiente.
          </p>
          <p>
            En el texto mecanografiado, los espacios simples representan el silencio entre letras, y las barras (<code>/</code>) representan el silencio entre palabras.
          </p>
          <p>
            En la decodificación de audio, el software debe identificar con precisión estos intervalos a partir de la envolvente de la señal sonora.
          </p>
          <p>
            Por esta razón, una secuencia escrita con espaciado limpio se decodifica siempre con mayor facilidad que una señal de radio con estática o eco.
          </p>

          <figure className="article-figure">
            <picture>
              <source srcSet="/images/morse-code-transmission-settings-timing.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-transmission-settings-timing.png?v=2"
                alt="Ajustes avanzados de transmisión en código Morse mostrando velocidad WPM, espaciado Farnsworth, frecuencia de tono y métricas de pulsos"
                width="1080"
                height="760"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              <strong>Figura 3:</strong> Panel de control de transmisión avanzada con ajuste de velocidad WPM según el estándar PARIS, espaciado Farnsworth, frecuencia de tono en hercios y métricas de duración en milisegundos.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 7: Tabla Completa del Alfabeto en Código Morse */}
        <section className="content-section">
          <h2>Tabla Completa del Alfabeto en Código Morse</h2>
          <p>
            El Código Morse Internacional comprende el alfabeto latino básico, numerales, signos de puntuación y señales de procedimiento. La Unión Internacional de Telecomunicaciones regula este estándar mediante la <a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">Recomendación ITU-R M.1677-1 <ExternalLink size={12} /></a>, catalogada formalmente como <strong>En vigor (Principal)</strong>. Para el idioma español, se integra de forma canónica la letra <strong>Ñ</strong> (<code className="morse-font">--.--</code>).
          </p>

          <h3>Letras (A–Z y Ñ)</h3>
          <p>
            A continuación se presenta el alfabeto Morse internacional completo adaptado al español. Para consultar la guía visual detallada con reproducción interactiva de cada carácter, visita nuestra página del <a href="/es/morse-code-alphabet/" onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}>Alfabeto en Código Morse</a>.
          </p>
          <div className="table-responsive">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Letra</th>
                  <th>Código Morse</th>
                  <th>Cadencia Fonética (Dits y Dahs)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>A</strong></td><td><code className="morse-font">.-</code></td><td>di-dah</td></tr>
                <tr><td><strong>B</strong></td><td><code className="morse-font">-...</code></td><td>dah-di-di-dit</td></tr>
                <tr><td><strong>C</strong></td><td><code className="morse-font">-.-.</code></td><td>dah-di-dah-dit</td></tr>
                <tr><td><strong>D</strong></td><td><code className="morse-font">-..</code></td><td>dah-di-dit</td></tr>
                <tr><td><strong>E</strong></td><td><code className="morse-font">.</code></td><td>dit</td></tr>
                <tr><td><strong>F</strong></td><td><code className="morse-font">..-.</code></td><td>di-di-dah-dit</td></tr>
                <tr><td><strong>G</strong></td><td><code className="morse-font">--.</code></td><td>dah-dah-dit</td></tr>
                <tr><td><strong>H</strong></td><td><code className="morse-font">....</code></td><td>di-di-di-dit</td></tr>
                <tr><td><strong>I</strong></td><td><code className="morse-font">..</code></td><td>di-dit</td></tr>
                <tr><td><strong>J</strong></td><td><code className="morse-font">.---</code></td><td>di-dah-dah-dah</td></tr>
                <tr><td><strong>K</strong></td><td><code className="morse-font">-.-</code></td><td>dah-di-dah</td></tr>
                <tr><td><strong>L</strong></td><td><code className="morse-font">.-..</code></td><td>di-dah-di-dit</td></tr>
                <tr><td><strong>M</strong></td><td><code className="morse-font">--</code></td><td>dah-dah</td></tr>
                <tr><td><strong>N</strong></td><td><code className="morse-font">-.</code></td><td>dah-dit</td></tr>
                <tr style={{ background: 'rgba(217, 119, 6, 0.1)', fontWeight: 700 }}>
                  <td><strong>Ñ</strong> (Español)</td>
                  <td><code className="morse-font">--.--</code></td>
                  <td>dah-dah-di-dah-dah</td>
                </tr>
                <tr><td><strong>O</strong></td><td><code className="morse-font">---</code></td><td>dah-dah-dah</td></tr>
                <tr><td><strong>P</strong></td><td><code className="morse-font">.--.</code></td><td>di-dah-dah-dit</td></tr>
                <tr><td><strong>Q</strong></td><td><code className="morse-font">--.-</code></td><td>dah-dah-di-dah</td></tr>
                <tr><td><strong>R</strong></td><td><code className="morse-font">.-.</code></td><td>di-dah-dit</td></tr>
                <tr><td><strong>S</strong></td><td><code className="morse-font">...</code></td><td>di-di-dit</td></tr>
                <tr><td><strong>T</strong></td><td><code className="morse-font">-</code></td><td>dah</td></tr>
                <tr><td><strong>U</strong></td><td><code className="morse-font">..-</code></td><td>di-di-dah</td></tr>
                <tr><td><strong>V</strong></td><td><code className="morse-font">...-</code></td><td>di-di-di-dah</td></tr>
                <tr><td><strong>W</strong></td><td><code className="morse-font">.--</code></td><td>di-dah-dah</td></tr>
                <tr><td><strong>X</strong></td><td><code className="morse-font">-..-</code></td><td>dah-di-di-dah</td></tr>
                <tr><td><strong>Y</strong></td><td><code className="morse-font">-.--</code></td><td>dah-di-dah-dah</td></tr>
                <tr><td><strong>Z</strong></td><td><code className="morse-font">--..</code></td><td>dah-dah-di-dit</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Números (0–9)</h3>
          <p>
            Los numerales en código Morse constan de cinco elementos cada uno, organizados en una progresión aritmética perfecta. Consulta nuestra guía dedicada de <a href="/es/morse-code-numbers/" onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}>Números en Código Morse</a> para conocer trucos nemotécnicos y números abreviados (cut numbers).
          </p>
          <div className="table-responsive">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Código Morse</th>
                  <th>Estructura Simétrica</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>0</strong></td><td><code className="morse-font">-----</code></td><td>5 rayas consecutivas</td></tr>
                <tr><td><strong>1</strong></td><td><code className="morse-font">.----</code></td><td>1 punto inicial seguido de 4 rayas</td></tr>
                <tr><td><strong>2</strong></td><td><code className="morse-font">..---</code></td><td>2 puntos iniciales seguidos de 3 rayas</td></tr>
                <tr><td><strong>3</strong></td><td><code className="morse-font">...--</code></td><td>3 puntos iniciales seguidos de 2 rayas</td></tr>
                <tr><td><strong>4</strong></td><td><code className="morse-font">....-</code></td><td>4 puntos iniciales seguidos de 1 raya</td></tr>
                <tr><td><strong>5</strong></td><td><code className="morse-font">.....</code></td><td>5 puntos consecutivos (centro del sistema)</td></tr>
                <tr><td><strong>6</strong></td><td><code className="morse-font">-....</code></td><td>1 raya inicial seguida de 4 puntos</td></tr>
                <tr><td><strong>7</strong></td><td><code className="morse-font">--...</code></td><td>2 rayas iniciales seguidas de 3 puntos</td></tr>
                <tr><td><strong>8</strong></td><td><code className="morse-font">---..</code></td><td>3 rayas iniciales seguidas de 2 puntos</td></tr>
                <tr><td><strong>9</strong></td><td><code className="morse-font">----.</code></td><td>4 rayas iniciales seguidas de 1 punto</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECCIÓN 8: Signos de Puntuación y Símbolos en Código Morse */}
        <section className="content-section">
          <h2>Signos de Puntuación y Símbolos en Código Morse</h2>
          <p>
            El código Morse internacional normalizado por la UIT incorpora signos de puntuación fundamentales. Para una tabla exhaustiva con más de 25 caracteres especiales, visita <a href="/es/morse-code-symbols/" onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}>Símbolos en Código Morse</a>.
          </p>
          <p>
            Los signos más comunes en la práctica diaria son:
          </p>

          <div className="table-responsive">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Signo Ortográfico</th>
                  <th>Símbolo</th>
                  <th>Código Morse Oficial</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Punto</td><td><code className="inline-code">.</code></td><td><code className="morse-font">.-.-.-</code></td></tr>
                <tr><td>Coma</td><td><code className="inline-code">,</code></td><td><code className="morse-font">--..--</code></td></tr>
                <tr><td>Signo de interrogación de cierre</td><td><code className="inline-code">?</code></td><td><code className="morse-font">..--..</code></td></tr>
                <tr><td>Signo de interrogación de apertura (Español)</td><td><code className="inline-code">¿</code></td><td><code className="morse-font">..-.-</code></td></tr>
                <tr><td>Signo de exclamación de cierre</td><td><code className="inline-code">!</code></td><td><code className="morse-font">-.-.--</code></td></tr>
                <tr><td>Signo de exclamación de apertura (Español)</td><td><code className="inline-code">¡</code></td><td><code className="morse-font">--...-</code></td></tr>
                <tr><td>Barra oblicua (Slash)</td><td><code className="inline-code">/</code></td><td><code className="morse-font">-..-.</code></td></tr>
                <tr><td>Signo igual (Separador de párrafos)</td><td><code className="inline-code">=</code></td><td><code className="morse-font">-...-</code></td></tr>
                <tr><td>Signo más</td><td><code className="inline-code">+</code></td><td><code className="morse-font">.-.-.</code></td></tr>
                <tr><td>Arroba</td><td><code className="inline-code">@</code></td><td><code className="morse-font">.--.-.</code></td></tr>
                <tr><td>Dos puntos</td><td><code className="inline-code">:</code></td><td><code className="morse-font">---...</code></td></tr>
              </tbody>
            </table>
          </div>

          <p>
            La disponibilidad de signos depende del juego de caracteres admitido por cada aplicación.
          </p>
          <p>
            Cuando un símbolo no está estandarizado en la norma UIT, nuestro traductor lo señala claramente en lugar de convertirlo en una secuencia inventada o errónea.
          </p>
        </section>

        {/* SECCIÓN 9: Prosigns y Señales Especiales de Procedimiento */}
        <section className="content-section">
          <h2>Prosigns y Señales Especiales de Procedimiento</h2>
          <p>
            En telegrafía existen combinaciones emitidas de forma continua que actúan como señales de procedimiento operativo (prosigns), no como palabras comunes:
          </p>
          <ul className="content-list">
            <li><strong>&lt;SOS&gt;</strong>: <code className="morse-font">...---...</code> (señal internacional ininterrumpida de socorro marítimo)</li>
            <li><strong>&lt;AR&gt;</strong>: <code className="morse-font">.-.-.</code> (fin de mensaje o de transmisión)</li>
            <li><strong>&lt;SK&gt;</strong>: <code className="morse-font">...-.-</code> (fin definitivo de contacto o despedida final de sesión)</li>
            <li><strong>&lt;BT&gt;</strong>: <code className="morse-font">-...-</code> (separador de párrafos en telegramas y boletines)</li>
            <li><strong>&lt;HH&gt;</strong>: <code className="morse-font">........</code> (señal de error de 8 puntos para anular la última palabra)</li>
          </ul>
          <p>
            Estas señales tienen un valor protocolario esencial en las comunicaciones operativas.
          </p>
          <p>
            Los prosigns son de uso constante en la radioafición CW. Los boletines y manuales de práctica de la <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">ARRL <ExternalLink size={12} /></a> y las asociaciones iberoamericanas señalan que la transmisión de prosigns debe realizarse sin pausas intermedias entre las letras constitutivas.
          </p>
        </section>

        {/* SECCIÓN 10: Código Morse Internacional vs. Código Morse Americano */}
        <section className="content-section">
          <h2>Código Morse Internacional vs. Código Morse Americano</h2>
          <p>
            El Código Morse Internacional y el Código Morse Americano original son sistemas distintos:
          </p>
          <p>
            El Morse Americano fue inventado por Samuel Morse y Alfred Vail para las líneas telegráficas terrestres originales de Estados Unidos en la década de 1840. Empleaba rayas de diferentes longitudes e intervalos de silencio internos dentro de la misma letra.
          </p>
          <p>
            El Código Morse Internacional (creado en 1848 por Friedrich Clemens Gerke en Alemania y formalizado en París en 1865 por la Conferencia Telegráfica Internacional) unificó las longitudes de los pulsos para permitir la transmisión por cables submarinos y cables continentales europeos.
          </p>
          <p>
            Los dos sistemas difieren en caracteres fundamentales como la C, la F, la J, la L y los números.
          </p>
          <p>
            Esta distinción es crítica cuando se intenta descifrar documentos históricos, telegramas del siglo XIX o registros de la Guerra Civil estadounidense.
          </p>
          <p>
            Para cualquier aplicación moderna, el estándar vigente es el Código Morse Internacional recogido en la norma UIT-R M.1677-1.
          </p>
        </section>

        {/* SECCIÓN 11: El Sonido del Código Morse: La Música de la Comunicación */}
        <section className="content-section">
          <h2>El Sonido del Código Morse: La Música de la Comunicación</h2>
          <p>
            El código Morse es fundamentalmente una lengua auditiva.
          </p>
          <p>
            El punto es un tono corto y vivo.
          </p>
          <p>
            La raya es un tono sostenido tres veces más largo.
          </p>
          <p>
            Los silencios intercalados entre los tonos tejen una cadencia rítmica singular.
          </p>
          <p>
            Por ejemplo: la letra <strong>S</strong> suena como <code className="morse-font">...</code> (di-di-dit) y la <strong>O</strong> suena como <code className="morse-font">---</code> (dah-dah-dah). Juntas, la secuencia de socorro <strong>SOS</strong> resuena con un compás inconfundible: <code className="morse-font">... --- ...</code>.
          </p>

          <h3>La Melodía de los Puntos y Rayas</h3>
          <p>
            Cuando lees código Morse sobre una pantalla, observas símbolos gráficos estáticos.
          </p>
          <p>
            Cuando escuchas código Morse a través de unos auriculares, percibes un ritmo melódico dinámico.
          </p>
          <p>
            Aprender a reconocer esa melodía permite al operador decodificar texto en tiempo real sin traducir conscientemente cada sonido en puntos y rayas en su cabeza.
          </p>

          <h3>Escuchar el Código Cobrar Vida</h3>
          <p>
            Comienza escuchando palabras cortas de alta frecuencia.
          </p>
          <p>
            Escucha la señal con los ojos cerrados.
          </p>
          <p>
            Abre los ojos para cotejar los caracteres mostrados en pantalla.
          </p>
          <p>
            Vuelve a escuchar el mismo mensaje sin mirar la solución.
          </p>
          <p>
            Este ejercicio forja un vínculo neuroauditivo directo entre el sonido y la letra.
          </p>

          <h3>La Temporización: El Compañero Silencioso del Sonido</h3>
          <p>
            Los silencios son tan significativos como los tonos:
          </p>
          <p>
            Una emisión rápida a 25 WPM posee pausas muy breves que exigen reflejos auditivos ágiles.
          </p>
          <p>
            Una sesión de entrenamiento a 12 WPM brinda mayor tiempo para identificar cada carácter sin angustia mental.
          </p>
          <p>
            Por ello, los controles de velocidad y espaciado de nuestro traductor resultan esenciales tanto para principiantes como para telegrafistas veteranos.
          </p>
        </section>

        {/* SECCIÓN 12: Aprovecha al Máximo los Ajustes del Traductor */}
        <section className="content-section">
          <h2>Aprovecha al Máximo los Ajustes del Traductor</h2>
          <p>
            Una traducción sencilla de texto no requiere configurar parámetros complejos.
          </p>
          <p>
            Sin embargo, el panel de controles avanzados se vuelve invaluable cuando deseas entrenar el oído o simular condiciones de radioafición reales:
          </p>

          <h3>Velocidad en Palabras por Minuto (WPM)</h3>
          <p>
            WPM son las siglas de <strong>Words Per Minute</strong> (Palabras Por Minuto).
          </p>
          <p>
            Es la unidad estándar universal para medir la velocidad de transmisión en código Morse.
          </p>
          <p>
            Una velocidad más alta significa que los puntos y las rayas se emiten de forma más compacta y veloz.
          </p>
          <p>
            La velocidad nunca debe anteponerse a la precisión: cuando estés aprendiendo, concéntrate en identificar los caracteres sin fallar antes de subir el deslizador de WPM.
          </p>

          <h3>Frecuencia del Tono Acústico (Hz)</h3>
          <p>
            La frecuencia regula el tono o altura musical del pitido en hercios.
          </p>
          <p>
            El rango estándar en telegrafía oscila entre 550 Hz y 750 Hz.
          </p>
          <p>
            Un tono agradable previene la fatiga auditiva durante sesiones prolongadas de práctica.
          </p>

          <h3>Forma de Onda del Oscilador</h3>
          <p>
            La forma de onda define el timbre acústico:
          </p>
          <p>
            Una onda sinusoidal pura genera un tono suave y limpio, ideal para concentrarse en la recepción.
          </p>
          <p>
            Otras formas de onda (triangular, cuadrada) permiten recrear el tono áspero característico de transceptores históricos o generadores de audio analógicos.
          </p>

          <h3>Estándar de Código Morse</h3>
          <p>
            Nuestro traductor aplica el estándar oficial internacional UIT-R M.1677-1 con el repertorio extendido del idioma español (letra Ñ y signos de apertura).
          </p>
          <p>
            Esto garantiza que tus traducciones sean 100% compatibles con los estándares de telecomunicaciones globales y de la IARU.
          </p>

          <h3>Temporización Farnsworth</h3>
          <p>
            El método Farnsworth es una técnica pedagógica revolucionaria:
          </p>
          <p>
            Reproduce los caracteres a una velocidad ágil (por ejemplo, 20 WPM), pero extiende los silencios entre letras y palabras a un ritmo menor (por ejemplo, 12 WPM).
          </p>
          <p>
            De este modo, tu cerebro aprende la melodía auténtica del carácter a velocidad real, disponiendo de segundos adicionales para procesar lo escuchado sin adquirir el vicio de contar puntos.
          </p>

          <h3>Resaltado de Caracteres en Reproducción</h3>
          <p>
            El sistema de resaltado visual ilumina en tiempo real la letra exacta que está sonando en ese instante.
          </p>
          <p>
            Esta retroalimentación visual sincronizada acelera drásticamente la curva de aprendizaje en estudiantes principiantes.
          </p>

          <h3>Ocultar o Mostrar Caracteres</h3>
          <p>
            Puedes ocultar el texto traducido mientras escuchas la señal sonora para poner a prueba tu capacidad de decodificación mental («head copy»).
          </p>
        </section>

        {/* SECCIÓN 13: ¿Qué tan Preciso es un Traductor de Código Morse? */}
        <section className="content-section">
          <h2>¿Qué tan Preciso es un Traductor de Código Morse?</h2>
          <p>
            La traducción de texto plano a código Morse es 100% determinista y exacta cuando el texto original contiene caracteres estandarizados y se aplica el estándar correcto.
          </p>
          <p>
            Por ejemplo: la letra <strong>A</strong> siempre se convertirá en <code className="morse-font">.-</code>.
          </p>
          <p>
            El verdadero desafío de precisión ocurre cuando la entrada no proviene de un teclado, sino de señales físicas:
          </p>
          <p>
            En la decodificación de audio e imágenes intervienen múltiples factores de distorsión:
          </p>
          <ul className="content-list">
            <li>Ruido blanco estático y fading en bandas de radio</li>
            <li>Señales telegráficas débiles o entrecortadas</li>
            <li>Desviaciones en la temporización humana con manipuladores manuales</li>
            <li>Baja resolución o desenfoque en fotografías de tatuajes y joyas</li>
            <li>Iluminación desigual y bajo contraste en imágenes</li>
            <li>Ausencia de espacios claros entre letras contiguas</li>
            <li>Caracteres gráficos no reconocidos por la norma UIT</li>
          </ul>
          <p>
            Por ello, un traductor de texto y un decodificador de señal no deben considerarse bajo el mismo prisma técnico.
          </p>
          <p>
            Una herramienta seria y confiable debe alertar con honestidad sobre entradas ambiguas o caracteres no soportados en vez de generar traducciones falsas.
          </p>
        </section>

        {/* SECCIÓN 14: Por Qué tu Traducción en Morse Podría Ser Incorrecta */}
        <section className="content-section">
          <h2>Por Qué tu Traducción en Morse Podría Ser Incorrecta</h2>
          <p>
            Un resultado inesperado al decodificar no siempre significa que el software haya fallado.
          </p>
          <p>
            En la inmensa mayoría de los casos, la causa radica en una anomalía en el formato de entrada:
          </p>

          <h3>Espaciado Incorrecto o Ausente</h3>
          <p>
            El error más común en la telegrafía escrita es la omisión de los espacios entre letras.
          </p>
          <p>
            Por ejemplo: <code className="morse-font">.... ..</code> significa <strong>HI</strong> (dos letras separadas).
          </p>
          <p>
            Si se eliminan los espacios y se escribe <code className="morse-font">......</code>, el algoritmo no podrá determinar si se trata de 6 letras E seguidas, de dos letras S, o de un error de transmisión.
          </p>

          <h3>Falta un Punto o una Raya</h3>
          <p>
            Omitir un solo pulso altera por completo el significado de la letra.
          </p>
          <p>
            Por ejemplo: <code className="morse-font">...</code> es <strong>S</strong>, pero si olvidas un punto, <code className="morse-font">..</code> se convierte en <strong>I</strong>.
          </p>

          <h3>Sobra un Punto o una Raya</h3>
          <p>
            Agregar un pulso extra provoca el mismo problema:
          </p>
          <p>
            Añadir una raya a la letra <strong>A</strong> (<code className="morse-font">.-</code>) genera <code className="morse-font">.--</code>, que corresponde a la letra <strong>W</strong>.
          </p>

          <h3>Caracteres Especiales no Admitidos</h3>
          <p>
            Ciertos textos contienen elementos tipográficos modernos que no forman parte del estándar telegráfico tradicional:
          </p>
          <p>
            Emojis, glifos exóticos, caracteres cirílicos o símbolos matemáticos complejos deben ser señalados como no convertibles.
          </p>

          <h3>Símbolos Unicode Engañosos (Homóglifos)</h3>
          <p>
            Al copiar y pegar código Morse de foros o redes sociales, es muy frecuente encontrar caracteres Unicode que se parecen a puntos y rayas pero que internamente son puntos medios flotantes (•), viñetas de lista o guiones largos tipográficos (—).
          </p>
          <p>
            Para garantizar una decodificación óptima, utiliza siempre los caracteres estándar del teclado: el punto ordinario <code className="inline-code">.</code> y el guion medio <code className="inline-code">-</code>.
          </p>

          <h3>Uso del Estándar Morse Equivocado</h3>
          <p>
            Si estás intentando traducir un telegrama histórico del siglo XIX, es posible que haya sido transmitido en Código Morse Americano en lugar de Código Morse Internacional.
          </p>

          <h3>Podría No Ser Código Morse en Absoluto</h3>
          <p>
            Una hilera de puntos y rayas no siempre representa telegrafía válida.
          </p>
          <p>
            A menudo se trata de patrones de pasatiempos, secuencias binarias o cifrados criptográficos propios de juegos de escape room.
          </p>
        </section>

        {/* SECCIÓN 15: Cómo Verificar un Mensaje en Código Morse */}
        <section className="content-section">
          <h2>Cómo Verificar un Mensaje en Código Morse</h2>
          <p>
            La regla de oro para garantizar una traducción infalible es la verificación cruzada en cuatro pasos:
          </p>

          <div className="step-process">
            <div className="process-step">
              <span className="step-num">Paso 1</span>
              <div><strong>Comienza con Texto Claro:</strong> Ingresa tu mensaje en español (ej. HOLA).</div>
            </div>
            <div className="process-step">
              <span className="step-num">Paso 2</span>
              <div><strong>Codifícalo a Morse:</strong> Obtén la secuencia resultante (<code className="morse-font">.... --- .-.. .-</code>).</div>
            </div>
            <div className="process-step">
              <span className="step-num">Paso 3</span>
              <div><strong>Decodifícalo en Reversa:</strong> Pega los puntos y rayas en el panel inverso de decodificación.</div>
            </div>
            <div className="process-step">
              <span className="step-num">Paso 4</span>
              <div><strong>Compara los Resultados:</strong> Si el texto devuelto coincide carácter por carácter con el original, la conversión es 100% segura.</div>
            </div>
          </div>

          <p>
            Este sencillo protocolo de comprobación es indispensable antes de grabar una dedicatoria en una joya, encargar un tatuaje con tinta permanente, imprimir camisetas o enviar comunicados por radio.
          </p>
        </section>

        {/* SECCIÓN 16: Decodificación por Texto, Audio e Imágenes */}
        <section className="content-section">
          <h2>Decodificación por Texto, Audio e Imágenes</h2>
          <p>
            Cada modalidad de entrada requiere una herramienta especializada para su tratamiento:
          </p>

          <div className="table-responsive">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Tu Formato de Entrada</th>
                  <th>Herramienta Óptima Recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Texto normal en español</td><td>Traductor: Texto → Morse</td></tr>
                <tr><td>Puntos y rayas escritos a mano</td><td>Decodificador: Morse → Texto</td></tr>
                <tr><td>Archivo de audio con pitidos</td><td><a href="/es/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}>Traductor de Audio Morse</a></td></tr>
                <tr><td>Transmisión de telegrafía en vivo</td><td><a href="/es/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}>Traductor de Audio Morse</a></td></tr>
                <tr><td>Código grabado en una joya o foto</td><td><a href="/es/morse-code-image-decoder/" onClick={(e) => handleNav(e, 'es-imagedecoder', '/es/morse-code-image-decoder/')}>Decodificador de Código Morse desde Imágenes</a></td></tr>
                <tr><td>Captura de pantalla de un videojuego</td><td><a href="/es/morse-code-image-decoder/" onClick={(e) => handleNav(e, 'es-imagedecoder', '/es/morse-code-image-decoder/')}>Decodificador de Código Morse desde Imágenes</a></td></tr>
                <tr><td>Memorización de caracteres de oído</td><td><a href="/es/learn-morse-code/" onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}>Aprender Código Morse</a></td></tr>
                <tr><td>Entrenamiento auditivo con preguntas</td><td><a href="/es/morse-code-practice/" onClick={(e) => handleNav(e, 'es-practice', '/es/morse-code-practice/')}>Práctica de Código Morse</a></td></tr>
              </tbody>
            </table>
          </div>

          <h3>Decodificación de Audio Morse</h3>
          <p>
            Un decodificador acústico procesa el espectro de frecuencias de una pista de sonido para identificar el tono de la portadora, la duración de cada pulso y los umbrales de silencio. Visita nuestro <a href="/es/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}>Traductor de Audio Morse</a> para analizar grabaciones en WAV o MP3.
          </p>
          <p>
            Ningún software de audio garantiza el 100% de éxito ante señales muy degradadas por ruido atmosférico o interferencias adyacentes, pero una señal limpia se decodifica con total precisión.
          </p>

          <h3>Decodificación de Morse en Imágenes</h3>
          <p>
            El decodificador por visión artificial analiza los contornos oscuros y claros sobre brazaletes, ilustraciones o capturas de pantalla para identificar secuencias lineales de puntos y rayas. Conoce más en nuestro <a href="/es/morse-code-image-decoder/" onClick={(e) => handleNav(e, 'es-imagedecoder', '/es/morse-code-image-decoder/')}>Decodificador de Código Morse desde Imágenes</a>.
          </p>
        </section>

        {/* SECCIÓN 17: Aprende Código Morse con Sonido */}
        <section className="content-section">
          <h2>Aprende Código Morse con Sonido</h2>
          <p>
            Una tabla estática del alfabeto es una excelente referencia de consulta.
          </p>
          <p>
            Sin embargo, aprender telegrafía es un proceso muy diferente a memorizar una tabla impresa.
          </p>
          <p>
            Al entrenar, debes asociar de forma directa la impronta acústica unificada de cada carácter con la letra correspondiente.
          </p>
          <p>
            Por ejemplo, en lugar de pensar «punto, raya» para la letra <strong>A</strong>, entrena tu oído para reconocer de inmediato el ritmo cantarín <em>di-dah</em>.
          </p>
          <p>
            Tanto la ARRL como la Unión de Radioaficionados Españoles recomiendan insistir en el reconocimiento por sonido desde el primer día de estudio.
          </p>
        </section>

        {/* SECCIÓN 18: Aprende Código Morse Paso a Paso */}
        <section className="content-section">
          <h2>Aprende Código Morse Paso a Paso</h2>
          <p>
            No intentes memorizar las 27 letras del alfabeto de golpe. Sigue este itinerario gradual probado:
          </p>

          <h3>1. Comienza con las Letras Elementales E y T</h3>
          <p>
            La <strong>E</strong> es un solo punto (<code className="morse-font">.</code>) y la <strong>T</strong> es una sola raya (<code className="morse-font">-</code>). Son las dos raíces fundacionales del sistema telegráfico.
          </p>

          <h3>2. Añade Palabras Muy Cortas</h3>
          <p>
            Una vez que reconozcas letras de dos elementos (A, N, I, M), comienza a practicar palabras cortas cotidianas como <strong>HI</strong>, <strong>NO</strong>, <strong>SI</strong>, <strong>SOL</strong> o <strong>SOS</strong>.
          </p>

          <h3>3. Utiliza Sesiones de Audio Interactivas</h3>
          <p>
            Escucha la señal antes de mirar el texto escrito. Trata de adivinar mentalmente la letra antes de verificar la solución en el traductor.
          </p>

          <h3>4. Practica con Regularidad Diaria</h3>
          <p>
            Quince minutos de entrenamiento diario estructurado son inmensamente más eficaces que dos horas seguidas una vez por semana. La constancia consolida los reflejos neuromusculares en el cerebro.
          </p>

          <h3>5. Ponte a Prueba sin Lápiz ni Papel</h3>
          <p>
            Conforme ganes agilidad, practica el copiado mental («head copy»): escucha las frases completas comprendiendo el significado sobre la marcha, exactamente como escuchas una conversación hablada.
          </p>
        </section>

        {/* SECCIÓN 19: Cuándo Utilizar Este Traductor de Código Morse */}
        <section className="content-section">
          <h2>Cuándo Utilizar Este Traductor de Código Morse</h2>

          <h3>Preparación para Situaciones de Emergencia</h3>
          <p>
            La señal <strong>SOS</strong> es la llamada de socorro más universal de la historia: <code className="morse-font">... --- ...</code>. Aprende todos sus detalles en nuestra guía de <a href="/es/sos-in-morse-code/" onClick={(e) => handleNav(e, 'es-sos', '/es/sos-in-morse-code/')}>SOS en código Morse</a>. Saber emitir señales básicas con una linterna o silbato puede ser de gran ayuda en excursiones, montaña o navegación. Sin embargo, recuerda que un traductor web nunca sustituye a los servicios de rescate ni a los sistemas oficiales de radiocomunicación de emergencia.
          </p>

          <h3>Práctica de Radioafición y Comunicados CW</h3>
          <p>
            El código Morse sigue palpitando con enorme vigor en las bandas de radioaficionados como telegrafía de onda continua (CW). Los operadores emplean nuestras herramientas para verificar abreviaturas de concursos, códigos Q, indicativos y velocidades de manipulación. Conoce más en nuestra sección de <a href="/es/morse-code-amateur-radio/" onClick={(e) => handleNav(e, 'es-amateurradio', '/es/morse-code-amateur-radio/')}>Radioafición CW</a>.
          </p>

          <h3>Proyectos Escolares y Aprendizaje STEM</h3>
          <p>
            El código Morse es el ejemplo didáctico más intuitivo para comprender la digitalización de la información, la teoría de la información de Claude Shannon y la codificación binaria de datos en materias escolares de física y tecnología.
          </p>

          <h3>Diseño de Pulseras, Anillos y Tatuajes</h3>
          <p>
            El código Morse permite inmortalizar nombres propios, fechas de aniversario o mensajes íntimos como «Te amo» en un diseño gráfico minimalista y discreto. Verifica siempre la traducción en reversa antes de hacer un diseño permanente.
          </p>

          <h3>Resolución de Acertijos, Videojuegos y Escape Rooms</h3>
          <p>
            El código Morse es un recurso clásico en salas de escape room y videojuegos de misterio o temática militar. Utiliza el traductor para descifrar rápidamente pistas sonoras o pistas impresas en papel.
          </p>

          <h3>Accesibilidad y Métodos Alternativos de Comunicación</h3>
          <p>
            Gracias a su naturaleza binaria (pulsación corta vs. larga), el código Morse se adapta como sistema de entrada asistida para personas con dificultades de movilidad mediante conmutadores de un solo botón o parpadeos oculares.
          </p>
        </section>

        {/* SECCIÓN 20: Usos Modernos del Código Morse */}
        <section className="content-section">
          <h2>Usos Modernos del Código Morse en el Siglo XXI</h2>
          <p>
            Aunque el telégrafo eléctrico ya no es el canal principal de las telecomunicaciones comerciales, el código Morse conserva una vigencia fascinante en múltiples ámbitos modernos:
          </p>

          <h3>Radioafición Internacional (CW)</h3>
          <p>
            La telegrafía manual sigue siendo una de las modalidades más practicadas y respetadas por radioaficionados de todo el planeta, capaz de comunicar continentes enteros con antenas sencillas y potencias mínimas (QRP) a través de tormentas solares.
          </p>

          <h3>Radiobalizas de Navegación Aeronáutica (VOR e ILS)</h3>
          <p>
            Las estaciones terrestres de radionavegación aérea VOR y los sistemas de aterrizaje por instrumentos (ILS) siguen transmitiendo su indicativo de tres letras en código Morse continuo para que los pilotos identifiquen la frecuencia sintonizada.
          </p>

          <h3>Preservación Histórica y Patrimonio Cultural</h3>
          <p>
            El estudio del código Morse ofrece una ventana única al nacimiento de la era digital y a los albores de las comunicaciones instantáneas a larga distancia. Conoce su apasionante cronología en nuestra <a href="/es/history-of-morse-code/" onClick={(e) => handleNav(e, 'es-history', '/es/history-of-morse-code/')}>Historia del Código Morse</a>.
          </p>

          <h3>Cultura Popular, Videojuegos y ARG</h3>
          <p>
            Desde mensajes ocultos en películas hasta pistas de realidad alternativa en videojuegos de gran calibre, el código Morse continúa despertando la curiosidad y el ingenio de millones de personas.
          </p>
        </section>

        {/* SECCIÓN 21: Traducciones Comunes en Código Morse */}
        <section className="content-section">
          <h2>Traducciones Comunes en Código Morse</h2>
          <p>
            A continuación se detallan algunas de las expresiones y mensajes más populares traducidos al código Morse. Explora el repertorio completo en nuestra guía de <a href="/es/morse-code-phrases/" onClick={(e) => handleNav(e, 'es-phrases', '/es/morse-code-phrases/')}>Frases en Código Morse</a>:
          </p>

          <h3>SOS</h3>
          <p>
            <code className="morse-font">... --- ...</code> (La señal de socorro más universal de la historia; consulta nuestra guía dedicada de <a href="/es/sos-in-morse-code/" onClick={(e) => handleNav(e, 'es-sos', '/es/sos-in-morse-code/')}>SOS en código Morse</a>).
          </p>

          <h3>HOLA</h3>
          <p>
            <code className="morse-font">.... --- .-.. .-</code> (Saludo amistoso cotidiano compuesto por 4 letras y 10 elementos).
          </p>

          <h3>GRACIAS</h3>
          <p>
            <code className="morse-font">--. .-. .- -.-. .. .- ...</code> (Expresión universal de cortesía y gratitud).
          </p>

          <h3>AYUDA</h3>
          <p>
            <code className="morse-font">.- -.-- ..- -.. .-</code> (Petición de asistencia; en emergencias marítimas se utiliza siempre SOS).
          </p>

          <h3>TE AMO</h3>
          <p>
            <code className="morse-font">- . / .- -- ---</code> (El mensaje romántico más elegido para pulseras y anillos; consulta <a href="/es/morse-code-i-love-you/" onClick={(e) => handleNav(e, 'es-iloveyou', '/es/morse-code-i-love-you/')}>Te Amo en Código Morse</a>).
          </p>

          <h3>BUENOS DÍAS</h3>
          <p>
            <code className="morse-font">-... ..- . -. --- ... / -.. .. .- ...</code> (Saludo matutino con separación de palabras mediante barra diagonal).
          </p>
        </section>

        {/* SECCIÓN 22: Qué Abarca Este Traductor de Código Morse */}
        <section className="content-section">
          <h2>Qué Abarca Este Traductor de Código Morse</h2>
          <p>
            Nuestro traductor en línea pone a tu disposición un conjunto integral de herramientas avanzadas:
          </p>
          <ul className="content-list">
            <li>Traducción instantánea de texto alfanumérico a código Morse</li>
            <li>Decodificación de secuencias de puntos y rayas a texto claro</li>
            <li>Soporte completo para el alfabeto latino y la letra <strong>Ñ</strong> (<code className="morse-font">--.--</code>)</li>
            <li>Soporte para numerales del 0 al 9 y signos de puntuación de la norma UIT</li>
            <li>Reproductor de audio en vivo con síntesis Web Audio limpia y sin retardos</li>
            <li>Ajustes de velocidad de transmisión (WPM) y espaciado pedagógico Farnsworth</li>
            <li>Selección de tono acústico (frecuencia en Hz) y tipos de onda sinusoidal</li>
            <li>Descarga del mensaje traducido como archivo de audio WAV de alta fidelidad</li>
            <li>Copiado directo del resultado al portapapeles con confirmación visual</li>
            <li>Procesamiento 100% privado en el lado del cliente sin enviar datos a servidores externos</li>
          </ul>
        </section>

        {/* SECCIÓN 23: Qué Limitaciones Técnicas Debes Tener en Cuenta */}
        <section className="content-section">
          <h2>Qué Limitaciones Técnicas Debes Tener en Cuenta</h2>
          <p>
            Una herramienta informática honesta y rigurosa debe declarar con claridad sus límites operativos:
          </p>
          <p>
            Un traductor basado en texto requiere que el usuario ingrese caracteres definidos y espaciados válidos.
          </p>
          <p>
            La decodificación automática de archivos de audio puede fallar ante grabaciones con ruido de fondo excesivo o variaciones bruscas de velocidad manual.
          </p>
          <p>
            El reconocimiento de puntos y rayas en fotografías depende del contraste y la resolución de la imagen cargada.
          </p>
          <p>
            Los textos históricos pueden haber sido transmitidos en Morse Americano o claves locales antiguas que no coinciden con la norma internacional moderna.
          </p>
          <p>
            Conocer estas circunstancias te permitirá interpretar los resultados con criterio profesional y verificar siempre las secuencias críticas.
          </p>
        </section>

        {/* SECCIÓN 24: ¿Listo para Traducir tu Mensaje? */}
        <section className="content-section cta-banner">
          <h2>¿Listo para Traducir tu Mensaje en Código Morse?</h2>
          <p>
            Escribe tu texto o pega tu código Morse en el panel interactivo superior.
          </p>
          <p>
            Utiliza la opción <strong>Texto → Morse</strong> para generar un mensaje telegráfico nuevo.
          </p>
          <p>
            Utiliza <strong>Morse → Texto</strong> para descifrar una secuencia de puntos y rayas que hayas recibido.
          </p>
          <p>
            Activa la <strong>Detección Automática</strong> si prefieres que la herramienta identifique el sentido por sí misma.
          </p>
          <p>
            Escucha la señal acústica, ajusta la velocidad según tu nivel y copia el resultado para compartirlo.
          </p>
          <p>
            Para profundizar en cada disciplina, te invitamos a explorar nuestras guías dedicadas: el <a href="/es/morse-code-alphabet/" onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}>Alfabeto Morse Completo</a>, los <a href="/es/morse-code-numbers/" onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}>Números en Código Morse</a>, el <a href="/es/morse-code-decoder/" onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}>Decodificador de Texto</a>, el <a href="/es/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}>Traductor de Audio Morse</a>, la tabla de <a href="/es/morse-code-symbols/" onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}>Símbolos y Signos</a>, el simulador de <a href="/es/morse-code-keyer/" onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')}>Manipulador Telegráfico</a> y el portal para <a href="/es/learn-morse-code/" onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}>Aprender Código Morse</a>.
          </p>
          <div className="motto-box">
            <strong>Tradúcelo. Escúchalo. Compréndelo. Domínalo.</strong>
          </div>
        </section>

        {/* SECCIÓN 25: Nuestro Compromiso con el Rigor y la Exactitud Telegráfica (E-E-A-T) */}
        <section className="content-section eeat-box">
          <div className="eeat-header">
            <ShieldCheck size={22} className="text-accent-primary" />
            <h2>Nuestro Compromiso con el Rigor y la Exactitud Telegráfica</h2>
          </div>
          <p>
            Al diseñar y verificar nuestro motor de traducción de código Morse, el objetivo prioritario no fue únicamente mostrar puntos y rayas en una pantalla. La meta fue implementar un sistema riguroso que respete con exactitud matemática las normas de temporización, la gestión de caracteres especiales, el estándar PARIS, el espaciado Farnsworth y la compatibilidad con el idioma español.
          </p>
          <p>
            Por esta razón, nuestra plataforma toma como base las directrices oficiales de la Unión Internacional de Telecomunicaciones (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">Recomendación ITU-R M.1677-1 <ExternalLink size={12} /></a>), complementadas con las mejores prácticas pedagógicas de la <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">American Radio Relay League (ARRL) <ExternalLink size={12} /></a>, la Unión de Radioaficionados Españoles (URE) y la Federación Mexicana de Radioexperimentadores (FMRE).
          </p>
          <p>
            Te aconsejamos verificar siempre los mensajes de alta trascendencia antes de utilizarlos en soportes permanentes o publicaciones. Para el aprendizaje continuo, combina la escucha sonora con la lectura visual: esa simbiosis sensorial es el camino más rápido y placentero para dominar la telegrafía en el mundo contemporáneo.
          </p>
        </section>

      </div>
    </article>
  );
}

export default SpanishArticleContent;
