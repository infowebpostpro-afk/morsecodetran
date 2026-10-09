import React from 'react';
import { ChromeIcon } from './ChromeIcon.jsx';
import { ExternalLink, Zap, ShieldCheck, MousePointerClick, CheckCircle2, Sparkles } from 'lucide-react';
import { isTurkishRoute, isSpanishRoute } from '../i18n/navigation.js';

export const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/detail/morse-code-translator/hnnkhgpepcnlfdboenfhmajkbckimceo';

export function ChromeExtensionBanner({ activeTab, lang, className = '' }) {
  const isTr = lang === 'tr' || isTurkishRoute(activeTab);
  const isEs = lang === 'es' || isSpanishRoute(activeTab);

  const content = isTr
    ? {
        badge: 'RESMİ CHROME EKLENTİSİ',
        headline: 'Web’de Gezinirken Her Yerde Mors Kodu Çevirin',
        subheadline:
          'Resmi Google Chrome eklentimizle internetteki herhangi bir web sayfasında metni seçip sağ tıklayarak anında Mors koduna dönüştürün. Tarayıcınızdan çıkmadan tek tıkla çevirin ve kopyalayın.',
        features: [
          { icon: MousePointerClick, text: 'Sağ Tıkla Hızlı Çeviri (Seçili metni anında çevirir)' },
          { icon: ShieldCheck, text: '%100 Çevrimdışı & Güvenli (Sıfır veri toplama, tamamen yerel)' },
          { icon: Zap, text: 'Anında İki Yönlü Dönüştürücü (Metin ⇄ Mors Kodu)' }
        ],
        cta: "Chrome'a Ekle — Ücretsiz",
        subCta: 'Chrome Web Mağazası • Manifest V3 • Ücretsiz',
        rating: '5.0 ★★★★★ Resmi Yayın'
      }
    : isEs
    ? {
        badge: 'EXTENSIÓN OFICIAL PARA CHROME',
        headline: 'Traduce Código Morse en Cualquier Página Web',
        subheadline:
          'Instala nuestra extensión gratuita para Google Chrome. Selecciona cualquier texto en cualquier página web, haz clic derecho y tradúcelo al instante a código Morse sin salir de tu pestaña.',
        features: [
          { icon: MousePointerClick, text: 'Traducción con clic derecho en cualquier sitio web' },
          { icon: ShieldCheck, text: '100% Fuera de línea y privado (Sin rastreadores ni registro)' },
          { icon: Zap, text: 'Traducción bidireccional instantánea (Texto ⇄ Código Morse)' }
        ],
        cta: 'Añadir a Chrome — Gratis',
        subCta: 'Disponible en Chrome Web Store • Manifest V3 • Gratis',
        rating: '5.0 ★★★★★ Extensión Verificada'
      }
    : {
        badge: 'OFFICIAL CHROME EXTENSION',
        headline: 'Translate Morse Code Anywhere on the Web',
        subheadline:
          'Get our lightweight Google Chrome extension to translate text into Morse code and decode signals directly on any website with a simple right-click. Fast, offline, and completely private.',
        features: [
          { icon: MousePointerClick, text: 'Right-click highlighted text on any webpage to translate' },
          { icon: ShieldCheck, text: '100% Offline & Private (Zero tracking, runs purely in-browser)' },
          { icon: Zap, text: 'Instant Two-Way Translation (Text ⇄ Morse Code)' }
        ],
        cta: 'Add to Chrome — It’s Free',
        subCta: 'Chrome Web Store • Manifest V3 • Free Forever',
        rating: '5.0 ★★★★★ Verified Utility'
      };

  return (
    <section className={`chrome-extension-banner ${className}`} aria-label="Chrome Extension Promo">
      <div className="extension-banner-glow" aria-hidden="true" />
      <div className="extension-banner-content">
        <div className="extension-banner-header">
          <div className="extension-badge">
            <ChromeIcon size={18} />
            <span>{content.badge}</span>
            <span className="extension-badge-pill">
              <Sparkles size={12} /> New
            </span>
          </div>
          <h2 className="extension-title">{content.headline}</h2>
          <p className="extension-description">{content.subheadline}</p>
        </div>

        <div className="extension-features-list">
          {content.features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="extension-feature-item">
                <div className="extension-feature-icon-wrapper">
                  <Icon size={16} />
                </div>
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        <div className="extension-cta-row">
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="extension-primary-btn"
            id="chrome-extension-cta-btn"
          >
            <ChromeIcon size={22} />
            <span>{content.cta}</span>
            <ExternalLink size={16} className="btn-external-icon" />
          </a>

          <div className="extension-trust-meta">
            <span className="extension-trust-text">
              <CheckCircle2 size={15} className="trust-check-icon" />
              {content.subCta}
            </span>
            <span className="extension-stars">{content.rating}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
