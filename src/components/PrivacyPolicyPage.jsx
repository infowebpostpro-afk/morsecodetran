import React from 'react';
import {
  ShieldCheck, Lock, EyeOff, Server, HardDrive, Cpu,
  CheckCircle2, AlertCircle, Mail, Globe, Sparkles,
  ArrowRight
} from 'lucide-react';

export function PrivacyPolicyPage({ setActiveTab }) {
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
    <div className="article-page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
          <li>
            <a
              href="/"
              onClick={(e) => handleNav(e, 'translator', '/')}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Home
            </a>
          </li>
          <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
          <li style={{ color: 'var(--primary)', fontWeight: 600 }} aria-current="page">
            Privacy Policy
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
          color: 'var(--signal-bright)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={16} />
          <span>Client-Side Privacy & Zero-Data-Collection Guarantee</span>
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Privacy Policy
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span><strong>Effective Date:</strong> October 4, 2026</span>
          <span>•</span>
          <span><strong>Last Updated:</strong> October 4, 2026</span>
          <span>•</span>
          <span><strong>Application:</strong> MorseCodeTranslatr.io Web App & Browser Extensions</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--signal-bright)' }}>
            <Cpu size={22} />
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>100% In-Browser Execution</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every translation, audio tone synthesis, Morse code decoding, and practice drill runs entirely in your local browser JavaScript and Web Audio engine.
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
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Zero User Data Logged</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We do not log, inspect, store, or transmit what you type, translate, or listen to. No personal text or audio input ever touches a remote database.
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-amber)' }}>
            <HardDrive size={22} />
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>No Tracking Cookies</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We do not use tracking cookies, advertising pixels, or cross-site monitoring beacons. Your browser localStorage only saves your display theme and speed preferences.
          </p>
        </div>
      </div>

      {/* Main Legal Content Sections */}
      <article style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: 'var(--text)', lineHeight: 1.7 }}>
        
        {/* Section 1 */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Lock size={20} color="var(--primary)" /> 1. Introduction and Scope
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Welcome to <strong>MorseCodeTranslatr.io</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Service&rdquo;). This Privacy Policy explains our practices regarding the collection, handling, storage, and protection of information when you access or use our web applications, educational utilities, audio synthesizers, and any affiliated browser extensions (including Chrome Web Store extensions).
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            We are committed to operating a privacy-first utility. In short: <strong>we believe privacy is a fundamental human right.</strong> You can translate, decode, and practice Morse code with full confidence that your inputs are strictly private and never collected.
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
            <Cpu size={20} color="var(--signal)" /> 2. Information We Do Not Collect
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Unlike cloud-based machine translation services that transmit text to remote processing servers, MorseCodeTranslatr.io functions entirely within your browser environment:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>No Input Content Logging:</strong> When you input English text, numbers, punctuation, or Morse code dits and dahs into the translator, converter, audio player, or decoder, that content is processed exclusively by your device&apos;s processor via client-side JavaScript. It is never sent to our servers or any third-party AI APIs.
            </li>
            <li>
              <strong>No Audio or Microphone Recording:</strong> Audio playback (beeps, CW sidetone) is synthesized on-the-fly using the W3C standard Web Audio API. Audio decoder analysis takes place in local memory without capturing or recording external audio feeds.
            </li>
            <li>
              <strong>No Personal Identifiable Information (PII):</strong> We do not ask for, collect, or store your name, email address, physical address, phone number, social media profiles, or financial credentials to use any feature of this tool.
            </li>
            <li>
              <strong>No Account Registration:</strong> No account creation, login, or authentication token is required or supported.
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
            <HardDrive size={20} color="var(--accent-amber)" /> 3. Data Handled Locally on Your Device
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Our application stores minimal preferences in your browser&apos;s HTML5 <code>localStorage</code> purely to enhance your immediate user experience across sessions:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Storage Key</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Purpose</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Lifespan & Location</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>morse_theme</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Remembers your visual theme choice (dark mode or light mode).</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Stored locally in browser; never sent over network.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>morse_wpm_pref</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Remembers your preferred Words Per Minute (WPM) speed.</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Stored locally in browser; never sent over network.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', margin: 0 }}>
            You can clear these values at any time using your browser settings (Settings &rarr; Clear Browsing Data &rarr; Cookies and site data).
          </p>
        </section>

        {/* Section 4: Chrome Web Store & Browser Extension Disclosures */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="var(--signal-bright)" /> 4. Browser Extension & Chrome Web Store Policy Compliance
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            If you install or use the official MorseCodeTranslatr extension from the Google Chrome Web Store, Microsoft Edge Add-ons, or Firefox Add-ons repository, the following strict guidelines govern its operation:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Single Purpose:</strong> The extension serves one dedicated educational and utility purpose: translating, decoding, and synthesizing International Morse Code signals.
            </li>
            <li>
              <strong>Minimal Permissions:</strong> The extension requests only permissions necessary for its core UI and audio playback functionality (such as <code>storage</code> for theme and speed settings). It does not request broad permissions to inspect, modify, or read your browsing history, web pages, or credentials on other websites.
            </li>
            <li>
              <strong>Zero Data Selling:</strong> We do not sell, rent, monetize, or transfer any user data, browsing metrics, or inputs to data brokers, advertisers, or third-party networks under any circumstances.
            </li>
            <li>
              <strong>No Remote Script Execution:</strong> All scripts, converters, and ITU timing calculations are bundled in the extension package or served via verified static assets, strictly in compliance with Chrome Extension Manifest V3 security rules.
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
            <Server size={20} color="var(--primary)" /> 5. Web Server Logs & Third-Party Infrastructure
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            When you load pages from <code>morsecodetranslatr.io</code>, our web hosting provider (e.g. Cloudflare / static CDN hosting) automatically logs standard, transient HTTP request information customary for web security and network diagnostics:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <li>Client IP address (anonymized/truncated for DDoS mitigation and geolocation routing)</li>
            <li>HTTP User-Agent (browser type and operating system version)</li>
            <li>Requested URL path and timestamp</li>
            <li>HTTP response status code and byte count</li>
          </ul>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            These diagnostic logs are retained only for temporary operational security, DDoS defense, and infrastructure reliability. They are never tied to individual identities or user translation sessions.
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
            <Globe size={20} color="var(--accent-amber)" /> 6. External Fonts & CDNs
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            We serve clean typography using Google Fonts (Inter, Plus Jakarta Sans, and JetBrains Mono). Requests for font stylesheets and font files are handled directly by Google servers in accordance with the standard Google Fonts Privacy Policy. Google does not collect user credentials through font loading.
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
            <AlertCircle size={20} color="var(--signal)" /> 7. Children&apos;s Online Privacy Protection (COPPA & GDPR-K)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Our website and educational tools are suitable for general audiences, students, scouts, and hobbyists of all ages. Because we do not collect any personal data whatsoever, we comply fully with the United States Children&apos;s Online Privacy Protection Act (COPPA), the EU General Data Protection Regulation regarding children (GDPR Article 8), and related global standards.
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
            <CheckCircle2 size={20} color="var(--signal-bright)" /> 8. Your Legal Rights (GDPR & CCPA/CPRA)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Under data protection regulations including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA), users possess rights regarding the access, rectification, portability, and erasure of personal data.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Because MorseCodeTranslatr.io does not collect, maintain, or profile personal data on our servers, there is <strong>no stored personal data to delete, inspect, or correct</strong>. If you wish to purge stored local settings (such as dark mode preferences), you can clear your browser&apos;s local storage immediately at any time.
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
            <Mail size={20} color="var(--primary)" /> 9. Contact Information & Developer Feedback
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            If you have any questions, inquiries, compliance audit requests, or feedback regarding this Privacy Policy or our Chrome Extension operations, please contact us:
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
              <strong>Project:</strong> MorseCodeTranslatr.io
            </div>
            <div>
              <strong>Official Website:</strong>{' '}
              <a href="https://morsecodetranslatr.io" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                https://morsecodetranslatr.io
              </a>
            </div>
            <div>
              <strong>Direct Privacy & Support Email:</strong>{' '}
              <a href="mailto:infoniaziseo@gmail.com" style={{ color: 'var(--signal-bright)', textDecoration: 'underline' }}>
                infoniaziseo@gmail.com
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
            <Sparkles size={20} color="var(--accent-amber)" /> 10. Updates to This Policy
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            We may periodically review and update this Privacy Policy to reflect technical improvements, new web utilities, or evolving browser platform policies. When modifications occur, the &ldquo;Last Updated&rdquo; date at the top of this page will be revised accordingly. Any changes remain faithful to our core guarantee: <strong>zero remote tracking, zero input logging, and complete client-side processing.</strong>
          </p>
        </section>

      </article>

      {/* Return to Translator CTA */}
      <div style={{
        marginTop: '3.5rem',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Ready to translate and practice Morse code?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Explore our interactive ITU-R compliant tools, sound generator, and audio decoders with complete peace of mind.
        </p>
        <a
          href="/"
          onClick={(e) => handleNav(e, 'translator', '/')}
          className="btn-primary"
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
          <span>Open Morse Translator</span>
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
