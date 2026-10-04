import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Info, Mail, Lock, X } from 'lucide-react';
import { MorseLogo } from './MorseLogo';
import { isTurkishRoute, getEquivalentRoute, footerLinksEn, footerLinksTr } from '../i18n/navigation.js';

export function Footer({ activeTab, setActiveTab }) {
  const [modalType, setModalType] = useState(null); // 'about' | 'privacy' | 'contact' | null
  const lastFocusedElementRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isTr = isTurkishRoute(activeTab);
  const links = isTr ? footerLinksTr : footerLinksEn;
  const homeHref = isTr ? '/tr/' : '/';
  const homeTab = isTr ? 'turkish' : 'translator';

  const enTarget = getEquivalentRoute(activeTab, 'en');
  const trTarget = getEquivalentRoute(activeTab, 'tr');

  const openModal = (type) => {
    if (typeof document !== 'undefined') {
      lastFocusedElementRef.current = document.activeElement;
    }
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
      lastFocusedElementRef.current.focus();
    }
  };

  useEffect(() => {
    if (!modalType) return;

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalType]);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '3.5rem 1.5rem 2.5rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <a
            href={homeHref}
            onClick={(e) => handleNav(e, homeTab, homeHref)}
            style={{ textDecoration: 'none' }}
            aria-label={isTr ? "Mors Alfabesi Çeviri Ana Sayfa" : "Morse Code Translator Home"}
          >
            <MorseLogo size={34} showText={true} />
          </a>
        </div>

        {/* Primary Resource Links */}
        <nav aria-label={isTr ? "Alt Bilgi Bağlantıları" : "Footer Navigation"} style={{ marginBottom: '2rem' }}>
          <ul className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem 1.25rem', listStyle: 'none', padding: 0, margin: '0 auto 1.5rem', maxWidth: '1000px', fontSize: '0.9rem' }}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.tab, link.href)}
                  style={{
                    color: link.tab === 'turkish' || link.tab === 'translator' ? 'var(--primary)' : 'inherit',
                    fontWeight: link.tab === 'turkish' || link.tab === 'translator' ? 600 : 400
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Context-Preserving Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Language / Dil:</span>
          <a
            href={enTarget.path}
            onClick={(e) => handleNav(e, enTarget.tab, enTarget.path)}
            style={{
              color: !isTr ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: !isTr ? 700 : 500,
              textDecoration: 'none'
            }}
          >
            English
          </a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a
            href={trTarget.path}
            onClick={(e) => handleNav(e, trTarget.tab, trTarget.path)}
            style={{
              color: isTr ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isTr ? 700 : 500,
              textDecoration: 'none'
            }}
          >
            Türkçe
          </a>
        </div>

        {/* Client-Side Privacy Notice */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--signal-bright)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.4rem 1rem', borderRadius: '999px', margin: '0.25rem 0 1.5rem', fontWeight: 500 }}>
          <ShieldCheck size={16} />
          <span>
            {isTr
              ? "Tarayıcı Tabanlı İşlem — Mors çevirisi, ses sentezi ve interaktif araçlar tamamen cihazınızda yerel olarak çalışır."
              : "Client-Side Processing — Morse translation, audio synthesis, and interactive tools execute locally in your browser."}
          </span>
        </div>

        {/* Legal & Trust Meta Links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          <button
            onClick={() => openModal('about')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Info size={14} /> {isTr ? "Hakkımızda" : "About MorseCodeTranslatr"}
          </button>
          <a
            href={isTr ? "/tr/privacy-policy/" : "/privacy-policy/"}
            onClick={(e) => handleNav(e, isTr ? 'tr-privacy' : 'privacy', isTr ? '/tr/privacy-policy/' : '/privacy-policy/')}
            style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Lock size={14} /> {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
          </a>
          <button
            onClick={() => openModal('contact')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Mail size={14} /> {isTr ? "İletişim & Geri Bildirim" : "Contact & Feedback"}
          </button>
        </div>

        {/* Technical Standard & Copyright */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.5 }}>
          {isTr
            ? "Uluslararası Telekomünikasyon Birliği ITU-R M.1677-1 tavsiyesine tam uyumlu olarak geliştirilmiştir. Amatör telsizciler, öğrenciler ve eğitmenler için tasarlanmıştır."
            : "Built strictly according to International Telecommunication Union Recommendation ITU-R M.1677-1. Designed for radio amateurs, educators, students, and Morse code practitioners."}
        </p>
      </div>

      {/* Accessible Informational Dialogs */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={closeModal}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: '560px', width: '100%', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'left', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              aria-label={isTr ? "Kapat" : "Close dialog"}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {modalType === 'about' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={20} color="var(--primary)" /> {isTr ? "Hakkımızda" : "About MorseCodeTranslatr"}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {isTr
                    ? "MorseCodeTranslatr.io, Uluslararası Mors kodunun incelenmesi, çevrilmesi ve öğrenilmesi için tasarlanmış modern, ücretsiz ve açık bir web aracıdır."
                    : "MorseCodeTranslatr.io is a free, modern, open web utility dedicated to the study, translation, and practice of International Morse Code."}
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {isTr
                    ? "Uluslararası Telekomünikasyon Birliği (ITU-R M.1677-1) standardına ve Paris zamanlama formüllerine sıkı sıkıya bağlıyız. Tüm araçlarımız modern web tarayıcılarında Web Audio API ve HTML5 ile tamamen istemci tarafında (cihazınızda) çalışır."
                    : "We adhere strictly to the International Telecommunication Union standard (ITU-R M.1677-1) and Paris word timing formulas. Our tools run completely client-side in modern web browsers using the Web Audio API and HTML5 canvas."}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isTr
                    ? "MorseCodeTranslatr mühendislik ekibi tarafından geliştirilmekte ve sürdürülmektedir."
                    : "Published and maintained by the MorseCodeTranslatr engineering team."}
                </p>
              </div>
            )}

            {modalType === 'privacy' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} color="var(--signal)" /> {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong>{isTr ? "Yerel İstemci Tarafı İşlem:" : "Local Client-Side Processing:"}</strong>{' '}
                  {isTr
                    ? "Bu sitedeki herhangi bir araca metin veya Mors kodu girdiğinizde, dönüştürme, analiz ve ses sentezi JavaScript ve Web Audio API aracılığıyla tamamen cihazınızda gerçekleşir. Girdiğiniz metinler asla harici bir sunucuya iletilmez."
                    : "When you input text or Morse code into any tool on this site, conversion, analysis, and sound generation take place entirely on your device via JavaScript and the Web Audio API. Your text is never transmitted to a backend translation server."}
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong>{isTr ? "Tercihler:" : "Preferences:"}</strong>{' '}
                  {isTr
                    ? "Tarayıcınızın yerel depolama alanını (localStorage) yalnızca tema tercihinizi (koyu veya açık mod) hatırlamak için kullanırız."
                    : "We use your browser's local storage solely to remember your preferred UI theme (dark or light mode)."}
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong>{isTr ? "Sunucu Kayıtları:" : "Server Hosting:"}</strong>{' '}
                  {isTr
                    ? "Standart web barındırma altyapısı, ağ güvenliği amacıyla IP adreslerini ve statik varlık isteklerini günlükleyebilir. Yazı tipleri Google Fonts üzerinden sunulur."
                    : "Standard web hosting infrastructure logs IP addresses and asset requests as part of ordinary web server operation and security. Fonts are served via Google Fonts."}
                </p>
              </div>
            )}

            {modalType === 'contact' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} color="var(--accent-amber)" /> {isTr ? "İletişim & Geri Bildirim" : "Contact & Feedback"}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {isTr
                    ? "Mors zamanlaması, ITU uyumluluğu veya ses sentezleme hakkında bir öneriniz, hata bildiriminiz veya özellik talebiniz mi var? Telsiz operatörlerinden, öğrencilerden ve meraklılardan gelen geri bildirimleri memnuniyetle karşılıyoruz."
                    : "Have a suggestion, bug report, or feature request regarding Morse timing, ITU compliance, or audio synthesis? We welcome community feedback from operators, ham radio enthusiasts, and learners."}
                </p>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text)' }}>
                  <div><strong>E-posta:</strong> <a href="mailto:infoniaziseo@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>infoniaziseo@gmail.com</a></div>
                  <div style={{ marginTop: '0.5rem' }}><strong>Web:</strong> <a href="https://morsecodetranslatr.io" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>morsecodetranslatr.io</a></div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={closeModal}
                style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}
              >
                {isTr ? "Kapat" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
