import React from 'react';
import {
  ShieldCheck, Lock, EyeOff, Server, HardDrive, Cpu,
  CheckCircle2, AlertCircle, Mail, Globe, Sparkles,
  ArrowRight
} from 'lucide-react';

export function SpanishPrivacyPolicyPage({ setActiveTab }) {
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
    <article className="article-page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Miga de pan" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
          <li>
            <a
              href="/es/"
              onClick={(e) => handleNav(e, 'spanish', '/es/')}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Inicio
            </a>
          </li>
          <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
          <li style={{ color: 'var(--primary)', fontWeight: 600 }} aria-current="page">
            Política de Privacidad
          </li>
        </ol>
      </nav>

      {/* Header Banner */}
      <header style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={16} />
          <span>Privacidad 100% en el Lado del Cliente y Garantía de Cero Recopilación de Datos</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Política de Privacidad
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span><strong>Fecha de Entrada en Vigor:</strong> 4 de octubre de 2026</span>
          <span>•</span>
          <span><strong>Última Actualización:</strong> 4 de octubre de 2026</span>
          <span>•</span>
          <span><strong>Alcance:</strong> Plataforma Web MorseCodeTranslatr.io y Extensiones Oficiales</span>
        </div>
      </header>

      {/* Key Guarantees Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981' }}>
            <Cpu size={22} />
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>100% Procesamiento Local</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Todas las traducciones, síntesis de audio, decodificación por visión artificial y ejercicios de telegrafía se ejecutan exclusivamente en la memoria local de su navegador.
          </p>
        </div>

        <div style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
            <EyeOff size={22} />
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Cero Registro de Texto o Audio</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            No registramos, leemos, transferimos ni almacenamos en bases de datos lo que escribe o traduce. Sus textos personales nunca viajan a servidores remotos ni a modelos de IA externos.
          </p>
        </div>

        <div style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b' }}>
            <HardDrive size={22} />
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Sin Cookies de Rastreo</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            No utilizamos cookies de seguimiento publicitario ni tecnologías invasivas de huella digital. El almacenamiento local solo recuerda sus preferencias de velocidad y tema visual.
          </p>
        </div>
      </div>

      {/* Main Legal Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: 'var(--text)', lineHeight: 1.7 }}>
        
        {/* Section 1 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Lock size={20} color="var(--primary)" /> 1. Introducción y Alcance Legal
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Le damos la bienvenida a <strong>MorseCodeTranslatr.io</strong> («nosotros», «nuestro» o «el Servicio»). Esta Política de Privacidad describe nuestras prácticas rigurosas relativas al tratamiento, almacenamiento, transferencia y protección de datos al utilizar nuestras aplicaciones web, herramientas pedagógicas, sintetizadores de audio y extensiones para navegadores asociadas (incluidas las de Chrome Web Store y Firefox Add-ons).
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Operamos bajo una premisa inquebrantable de privacidad desde el diseño: <strong>consideramos que la privacidad es un derecho humano fundamental.</strong> Puede traducir texto, descifrar telegrafía, practicar con el manipulador y escuchar tonos con la certeza absoluta de que sus datos son estrictamente privados e inaccesibles para terceros.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={20} color="#10b981" /> 2. Información que NO Recopilamos
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            A diferencia de los traductores automáticos basados en la nube que envían sus textos a granjas de servidores corporativos para entrenamiento algorítmico, MorseCodeTranslatr.io funciona al 100% dentro del entorno de su navegador:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Sin Registro de Textos o Mensajes:</strong> Cuando introduce texto en español o inglés, números, signos de puntuación o secuencias de puntos y rayas en el traductor, decodificador o convertidor, esa información es procesada de forma exclusiva por la CPU de su propio dispositivo mediante JavaScript local. Jamás se envía a servidores de fondo ni a APIs de inteligencia artificial de terceros.
            </li>
            <li>
              <strong>Sin Grabación de Micrófono ni Transmisión de Audio:</strong> La síntesis sonora (pitidos, sidetone de CW) se genera en tiempo real empleando la Web Audio API estándar de la W3C. La decodificación acústica ocurre en la memoria volátil de su equipo sin capturar ni grabar flujos de audio externos.
            </li>
            <li>
              <strong>Sin Datos Personales Identificables (PII):</strong> No solicitamos, almacenamos ni procesamos nombres, correos electrónicos, números telefónicos, domicilios ni datos de pago para el uso de ninguna función de la plataforma.
            </li>
            <li>
              <strong>Sin Cuentas de Usuario ni Registro Obligatorio:</strong> No se requiere inicio de sesión, creación de perfiles ni tokens de autenticación para utilizar el sitio al 100% de sus capacidades.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HardDrive size={20} color="#f59e0b" /> 3. Datos Almacenados Localmente en su Dispositivo
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Nuestra aplicación almacena parámetros mínimos en el objeto estándar <code>localStorage</code> de su navegador, con la exclusiva finalidad de conservar sus preferencias entre visitas:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Clave de Almacenamiento</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Finalidad de Uso</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Permanencia y Ubicación</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>morse_theme</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Recuerda su selección de tema visual (modo oscuro o modo claro).</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Almacenado localmente en su equipo; nunca se transmite por red.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>morse_wpm_pref</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Recuerda su velocidad preferida en palabras por minuto (WPM).</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Almacenado localmente en su equipo; nunca se transmite por red.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', margin: 0 }}>
            Puede eliminar estos valores en cualquier momento borrando el almacenamiento local desde la configuración de su navegador (Configuración &rarr; Privacidad y seguridad &rarr; Borrar datos de navegación).
          </p>
        </section>

        {/* Section 4 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#10b981" /> 4. Cumplimiento con Políticas de Extensiones de Navegador y Chrome Web Store
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Si instala la extensión oficial de MorseCodeTranslatr desde Chrome Web Store, Microsoft Edge Add-ons o Mozilla Firefox Add-ons, aplican las siguientes garantías estrictas:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Propósito Único y Delimitado:</strong> La extensión tiene una única función pedagógica y de utilidad: traducir, sintetizar y decodificar código Morse internacional.
            </li>
            <li>
              <strong>Permisos Mínimos Necesarios:</strong> Solo solicita permisos indispensables para su interfaz y reproducción de audio (como <code>storage</code> para recordar temas). No solicita permisos invasivos para leer su historial de navegación, cookies de otras webs ni credenciales bancarias.
            </li>
            <li>
              <strong>Cero Venta de Datos:</strong> Bajo ninguna circunstancia vendemos, alquilamos ni transferimos información de usuarios a corredores de datos (data brokers), empresas publicitarias ni intermediarios comerciales.
            </li>
            <li>
              <strong>Sin Ejecución de Scripts Remotos:</strong> Todo el código y los cálculos temporales de la norma UIT están empaquetados en el instalador estático, cumpliendo estrictamente con la especificación de seguridad Manifest V3 de Google Chrome.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={20} color="var(--primary)" /> 5. Registros de Servidor Web e Infraestructura de CDN
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Al solicitar páginas desde <code>morsecodetranslatr.io</code>, nuestra red de distribución de contenidos estáticos (Cloudflare / CDN) registra temporalmente parámetros habituales de solicitudes HTTP con fines de seguridad y mitigación de ciberataques:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <li>Dirección IP pública del cliente (anonimizada o truncada para defensa anti-DDoS y enrutamiento geográfico óptimo)</li>
            <li>Cadena User-Agent (navegador y sistema operativo empleado)</li>
            <li>Ruta del recurso solicitado y marca de tiempo (timestamp)</li>
            <li>Código de respuesta HTTP y volumen de bytes transmitidos</li>
          </ul>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Estos registros de diagnóstico se conservan de forma transitoria para garantizar la estabilidad de la red y la protección contra ataques de denegación de servicio. Jamás se vinculan con identidades personales ni con los contenidos traducidos por los usuarios.
          </p>
        </section>

        {/* Section 6 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe size={20} color="#f59e0b" /> 6. Fuentes Tipográficas Externas (Google Fonts)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Para ofrecer una presentación tipográfica de alta legibilidad, el sitio vincula fuentes de Google Fonts (Inter, Plus Jakarta Sans y JetBrains Mono). Estas solicitudes son atendidas por los servidores de Google de conformidad con su política de privacidad pública. Google no recopila credenciales de usuario a través de la entrega de hojas de estilo de fuentes.
          </p>
        </section>

        {/* Section 7 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} color="#10b981" /> 7. Protección de la Privacidad de los Menores (COPPA y RGPD)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Nuestros recursos y herramientas pedagógicas son aptos para estudiantes, grupos scouts, radioaficionados y aficionados de todas las edades. Al no solicitar ni procesar datos de carácter personal de ningún tipo, cumplimos plenamente con la ley estadounidense de protección de la privacidad infantil en línea (COPPA), el Artículo 8 del Reglamento General de Protección de Datos de la Unión Europea (RGPD) y las legislaciones protectoras de Iberoamérica.
          </p>
        </section>

        {/* Section 8 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={20} color="#10b981" /> 8. Derechos de los Usuarios (RGPD de la UE y CCPA de California)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Conforme a las directivas de protección de datos internacionales, los usuarios gozan de derechos de acceso, rectificación, portabilidad, limitación y supresión de sus datos personales.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Dado que MorseCodeTranslatr.io no recopila, mantiene ni perfila datos personales en servidores centrales, <strong>no existen datos personales almacenados que rectificar o suprimir</strong>. Para purgar cualquier preferencia local en su equipo (como el modo oscuro o la velocidad de reproducción), basta con borrar el almacenamiento local de su propio navegador web en cualquier instante.
          </p>
        </section>

        {/* Section 9 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Mail size={20} color="var(--primary)" /> 9. Información de Contacto y Soporte Técnico
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Si tiene dudas, observaciones técnicas, solicitudes de auditoría de cumplimiento o comentarios sobre esta Política de Privacidad o nuestras extensiones web, puede comunicarse con nosotros a través de:
          </p>
          <div style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            fontSize: '0.95rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div>
              <strong>Proyecto:</strong> MorseCodeTranslatr.io
            </div>
            <div>
              <strong>Sitio Web Oficial:</strong>{' '}
              <a href="https://morsecodetranslatr.io" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                https://morsecodetranslatr.io
              </a>
            </div>
            <div>
              <strong>Correo Electrónico de Privacidad y Soporte:</strong>{' '}
              <a href="mailto:contact@morsecodetranslatr.io" style={{ color: '#10b981', textDecoration: 'underline' }}>
                contact@morsecodetranslatr.io
              </a>
            </div>
          </div>
        </section>

        {/* Section 10 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#f59e0b" /> 10. Modificaciones a Esta Política de Privacidad
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Podemos actualizar periódicamente esta Política de Privacidad para incorporar mejoras técnicas, nuevas herramientas interactivas o cambios normativos en las plataformas de extensiones de navegadores. Cualquier modificación actualizará la fecha de «Última Actualización» en la cabecera. Todo cambio mantendrá intacto nuestro principio rector: <strong>cero rastreo remoto, cero registro de entradas de usuario y procesamiento 100% en el lado del cliente.</strong>
          </p>
        </section>

      </div>

      {/* Return to Translator CTA */}
      <div style={{
        marginTop: '3.5rem',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
          ¿Listo para traducir y practicar código Morse con total tranquilidad?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Explore nuestras herramientas interactivas conformes a la norma ITU-R, sintetizadores acústicos y decodificadores con absoluta garantía de privacidad.
        </p>
        <a
          href="/es/"
          onClick={(e) => handleNav(e, 'spanish', '/es/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          <span>Abrir Traductor de Código Morse en Español</span>
          <ArrowRight size={18} />
        </a>
      </div>
    </article>
  );
}

export default SpanishPrivacyPolicyPage;
