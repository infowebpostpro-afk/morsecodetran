import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Info, Mail, Lock, X } from 'lucide-react';
import { MorseLogo } from './MorseLogo';
import { isTurkishRoute, isSpanishRoute, isPortugueseRoute, getEquivalentRoute, footerLinksEn, footerLinksTr, footerLinksEs, footerLinksPt } from '../i18n/navigation.js';
import { ChromeIcon } from './ChromeIcon.jsx';
import { CHROME_EXTENSION_URL } from './ChromeExtensionBanner.jsx';

export function Footer({ activeTab, setActiveTab }) {
  const [modalType, setModalType] = useState(null); // 'about' | 'privacy' | 'contact' | null
  const lastFocusedElementRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isTr = isTurkishRoute(activeTab);
  const isEs = isSpanishRoute(activeTab);
  const isPt = isPortugueseRoute(activeTab);
  const links = isTr ? footerLinksTr : (isEs ? footerLinksEs : (isPt ? footerLinksPt : footerLinksEn));
  const homeHref = isTr ? '/tr/' : (isEs ? '/es/' : (isPt ? '/pt/' : '/'));
  const homeTab = isTr ? 'turkish' : (isEs ? 'spanish' : (isPt ? 'portuguese' : 'translator'));

  const enTarget = getEquivalentRoute(activeTab, 'en');
  const trTarget = getEquivalentRoute(activeTab, 'tr');
  const esTarget = getEquivalentRoute(activeTab, 'es');
  const ptTarget = getEquivalentRoute(activeTab, 'pt');

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
            aria-label={isPt ? "Tradutor de código Morse Página Inicial" : (isTr ? "Mors Alfabesi Çeviri Ana Sayfa" : "Morse Code Translator Home")}
          >
            <MorseLogo size={34} showText={true} />
          </a>
        </div>

        {/* Primary Resource Links */}
        <nav aria-label={isPt ? "Navegação do Rodapé" : (isTr ? "Alt Bilgi Bağlantıları" : "Footer Navigation")} style={{ marginBottom: '2rem' }}>
          <ul className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem 1.25rem', listStyle: 'none', padding: 0, margin: '0 auto 1.5rem', maxWidth: '1000px', fontSize: '0.9rem' }}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.tab, link.href)}
                  style={{
                    color: link.tab === 'portuguese' || link.tab === 'turkish' || link.tab === 'spanish' || link.tab === 'translator' ? 'var(--primary)' : 'inherit',
                    fontWeight: link.tab === 'portuguese' || link.tab === 'turkish' || link.tab === 'spanish' || link.tab === 'translator' ? 600 : 400
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Context-Preserving Language Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Language / Dil / Idioma:</span>
          <a
            href={enTarget.path}
            onClick={(e) => handleNav(e, enTarget.tab, enTarget.path)}
            style={{
              color: !isTr && !isEs && !isPt ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: !isTr && !isEs && !isPt ? 700 : 500,
              textDecoration: 'none'
            }}
          >
            English
          </a>
          <span style={{ color: 'var(--border)' }}>·</span>
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
          <span style={{ color: 'var(--border)' }}>·</span>
          <a
            href={esTarget.path}
            onClick={(e) => handleNav(e, esTarget.tab, esTarget.path)}
            style={{
              color: isEs ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isEs ? 700 : 500,
              textDecoration: 'none'
            }}
          >
            Español
          </a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a
            href={ptTarget.path}
            onClick={(e) => handleNav(e, ptTarget.tab, ptTarget.path)}
            style={{
              color: isPt ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isPt ? 700 : 500,
              textDecoration: 'none'
            }}
          >
            Português (Brasil)
          </a>
        </div>

        {/* Chrome Extension Showcase in Footer */}
        <div className="footer-extension-showcase">
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-extension-card"
            aria-label={
              isPt
                ? "Extensão de Código Morse para Google Chrome"
                : (isTr
                  ? "Morse Code Translator Google Chrome Eklentisi"
                  : (isEs
                    ? "Extensión de Código Morse para Google Chrome"
                    : "Morse Code Translator Google Chrome Extension"))
            }
          >
            <div className="footer-extension-left">
              <ChromeIcon size={32} />
              <div className="footer-extension-details">
                <div className="footer-extension-headline">
                  <span>
                    {isPt
                      ? "Extensão Morse Code Translator para Chrome"
                      : (isTr
                        ? "Morse Code Translator Chrome Eklentisi"
                        : (isEs
                          ? "Extensión Morse Code Translator para Chrome"
                          : "Morse Code Translator Chrome Extension"))}
                  </span>
                  <span className="footer-ext-tag">Chrome Web Store</span>
                </div>
                <p className="footer-extension-desc">
                  {isPt
                    ? "Selecione texto em qualquer página da web e converta instantaneamente em código Morse com o botão direito. Leve, rápido e 100% privado."
                    : (isTr
                      ? "İnternetteki herhangi bir sayfada metinleri seçip sağ tıklayarak tek adımda Mors koduna çevirin. Çevrimdışı, hafif ve %100 gizli."
                      : (isEs
                        ? "Selecciona texto en cualquier página y tradúcelo al instante a código Morse con un clic derecho. Rápido, offline y privado."
                        : "Highlight text on any webpage and right-click to translate instantly to Morse code. Fast, offline, and 100% private."))}
                </p>
              </div>
            </div>
            <div className="footer-extension-cta-btn">
              <span>
                {isPt
                  ? "Adicionar ao Chrome (Grátis)"
                  : (isTr
                    ? "Chrome'a Ekle (Ücretsiz)"
                    : (isEs
                      ? "Añadir a Chrome (Gratis)"
                      : "Add to Chrome — Free"))}
              </span>
            </div>
          </a>
        </div>

        {/* Client-Side Privacy Notice */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--signal-bright)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.4rem 1rem', borderRadius: '999px', margin: '0.25rem 0 1.5rem', fontWeight: 500 }}>
          <ShieldCheck size={16} />
          <span>
            {isPt
              ? "Processamento Local no Navegador — A conversão Morse, a síntese de áudio e as ferramentas interativas funcionam inteiramente no seu dispositivo."
              : (isTr
                ? "Tarayıcı Tabanlı İşlem — Mors çevirisi, ses sentezi ve interaktif araçlar tamamen cihazınızda yerel olarak çalışır."
                : (isEs
                  ? "Procesamiento del lado del cliente — La traducción Morse, la síntesis de audio y las herramientas interactivas se ejecutan localmente en tu navegador."
                  : "Client-Side Processing — Morse translation, audio synthesis, and interactive tools execute locally in your browser."))}
          </span>
        </div>

        {/* Legal & Trust Meta Links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          <button
            onClick={() => openModal('about')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Info size={14} /> {isPt ? "Sobre o MorseCodeTranslatr" : (isTr ? "Hakkımızda" : (isEs ? "Acerca de MorseCodeTranslatr" : "About MorseCodeTranslatr"))}
          </button>
          <a
            href={isTr ? "/tr/privacy-policy/" : (isEs ? "/es/privacy-policy/" : "/privacy-policy/")}
            onClick={(e) => handleNav(e, isTr ? 'tr-privacy' : (isEs ? 'es-privacy' : 'privacy'), isTr ? '/tr/privacy-policy/' : (isEs ? '/es/privacy-policy/' : '/privacy-policy/'))}
            style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Lock size={14} /> {isPt ? "Política de Privacidade (Inglês)" : (isTr ? "Gizlilik Politikası" : (isEs ? "Política de Privacidad" : "Privacy Policy"))}
          </a>
          <button
            onClick={() => openModal('contact')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
          >
            <Mail size={14} /> {isPt ? "Contato e Sugestões" : (isTr ? "İletişim & Geri Bildirim" : (isEs ? "Contacto y Comentarios" : "Contact & Feedback"))}
          </button>
        </div>

        {/* Technical Standard & Copyright */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.5 }}>
          {isPt
            ? "Desenvolvido em estrita conformidade com a Recomendação UIT-R M.1677-1 da União Internacional de Telecomunicações. Criado para radioamadores, estudantes e praticantes de código Morse."
            : (isTr
              ? "Uluslararası Telekomünikasyon Birliği ITU-R M.1677-1 tavsiyesine tam uyumlu olarak geliştirilmiştir. Amatör telsizciler, öğrenciler ve eğitmenler için tasarlanmıştır."
              : (isEs
                ? "Desarrollado estrictamente según la Recomendación de la Unión Internacional de Telecomunicaciones ITU-R M.1677-1. Diseñado para radioaficionados, educadores, estudiantes y practicantes del código Morse."
                : "Built strictly according to International Telecommunication Union Recommendation ITU-R M.1677-1. Designed for radio amateurs, educators, students, and Morse code practitioners."))}
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
              aria-label={isPt ? "Fechar diálogo" : (isTr ? "Kapat" : (isEs ? "Cerrar diálogo" : "Close dialog"))}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {modalType === 'about' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={20} color="var(--primary)" /> {isPt ? "Sobre o MorseCodeTranslatr" : (isTr ? "Hakkımızda" : (isEs ? "Acerca de MorseCodeTranslatr" : "About MorseCodeTranslatr"))}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {isPt
                    ? "MorseCodeTranslatr.io é uma plataforma web moderna e gratuita dedicada ao estudo, conversão e aprendizado do código Morse internacional."
                    : (isTr
                      ? "MorseCodeTranslatr.io, Uluslararası Mors kodunun incelenmesi, çevrilmesi ve öğrenilmesi için tasarlanmış modern, ücretsiz ve açık bir web aracıdır."
                      : (isEs
                        ? "MorseCodeTranslatr.io es una utilidad web gratuita y moderna dedicada al estudio, traducción y práctica del código Morse internacional."
                        : "MorseCodeTranslatr.io is a free, modern, open web utility dedicated to the study, translation, and practice of International Morse Code."))}
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {isPt
                    ? "Seguimos com rigor a Recomendação UIT-R M.1677-1 e as fórmulas de temporização padrão PARIS. Nossas ferramentas operam diretamente no navegador por meio da Web Audio API e HTML5."
                    : (isTr
                      ? "Uluslararası Telekomünikasyon Birliği (ITU-R M.1677-1) standardına ve Paris zamanlama formüllerine sıkı sıkıya bağlıyız. Tüm araçlarımız modern web tarayıcılarında Web Audio API ve HTML5 ile tamamen istemci tarafında (cihazınızda) çalışır."
                      : (isEs
                        ? "Nos adherimos estrictamente a la recomendación de la Unión Internacional de Telecomunicaciones (ITU-R M.1677-1) y las fórmulas de tiempo de la palabra estándar PARIS. Todas nuestras herramientas se ejecutan en el navegador mediante Web Audio API y HTML5."
                        : "We adhere strictly to the International Telecommunication Union standard (ITU-R M.1677-1) and Paris word timing formulas. Our tools run completely client-side in modern web browsers using the Web Audio API and HTML5 canvas."))}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isPt
                    ? "Publicado e mantido pela equipe de engenharia do MorseCodeTranslatr."
                    : (isTr
                      ? "MorseCodeTranslatr mühendislik ekibi tarafından geliştirilmekte ve sürdürülmektedir."
                      : (isEs
                        ? "Publicado y mantenido por el equipo de ingeniería de MorseCodeTranslatr."
                        : "Published and maintained by the MorseCodeTranslatr engineering team."))}
                </p>
              </div>
            )}

            {modalType === 'privacy' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} color="var(--signal)" /> {isPt ? "Política de Privacidade" : (isTr ? "Gizlilik Politikası" : (isEs ? "Política de Privacidad" : "Privacy Policy"))}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong>{isPt ? "Processamento local no navegador:" : (isTr ? "Yerel İstemci Tarafı İşlem:" : (isEs ? "Procesamiento local en el cliente:" : "Local Client-Side Processing:"))}</strong>{' '}
                  {isPt
                    ? "Ao digitar ou colar texto em qualquer ferramenta deste site, a conversão, a análise e a geração de áudio ocorrem inteiramente no seu dispositivo. Suas mensagens não são enviadas para servidores externos."
                    : (isTr
                      ? "Bu sitedeki herhangi bir araca metin veya Mors kodu girdiğinizde, dönüştürme, analiz ve ses sentezi JavaScript ve Web Audio API aracılığıyla tamamen cihazınızda gerçekleşir. Girdiğiniz metinler asla harici bir sunucuya iletilmez."
                      : (isEs
                        ? "Cuando ingresas texto o código Morse en cualquier herramienta de este sitio, la conversión, análisis y generación de audio ocurren completamente en tu dispositivo mediante JavaScript y Web Audio API. Tu texto nunca se envía a servidores externos."
                        : "When you input text or Morse code into any tool on this site, conversion, analysis, and sound generation take place entirely on your device via JavaScript and the Web Audio API. Your text is never transmitted to a backend translation server."))}
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <strong>{isPt ? "Preferências:" : (isTr ? "Tercihler:" : (isEs ? "Preferencias:" : "Preferences:"))}</strong>{' '}
                  {isPt
                    ? "Utilizamos o armazenamento local (localStorage) apenas para lembrar sua escolha de tema (modo claro ou escuro)."
                    : (isTr
                      ? "Tarayıcınızın yerel depolama alanını (localStorage) yalnızca tema tercihinizi (koyu veya açık mod) hatırlamak için kullanırız."
                      : (isEs
                        ? "Utilizamos el almacenamiento local de tu navegador (localStorage) únicamente para recordar tu preferencia de tema visual (modo claro u oscuro)."
                        : "We use your browser's local storage solely to remember your preferred UI theme (dark or light mode)."))}
                </p>
              </div>
            )}

            {modalType === 'contact' && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} color="var(--accent-amber)" /> {isPt ? "Contato e Sugestões" : (isTr ? "İletişim & Geri Bildirim" : (isEs ? "Contacto y Comentarios" : "Contact & Feedback"))}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {isPt
                    ? "Tem sugestões, dúvidas sobre a temporização Morse ou feedback técnico? Ficamos felizes em receber a opinião da comunidade de radioamadores e estudantes."
                    : (isTr
                      ? "Mors zamanlaması, ITU uyumluluğu veya ses sentezleme hakkında bir öneriniz, hata bildiriminiz veya özellik talebiniz mi var? Telsiz operatörlerinden, öğrencilerden ve meraklılardan gelen geri bildirimleri memnuniyetle karşılıyoruz."
                      : (isEs
                        ? "¿Tienes alguna sugerencia, reporte de error o solicitud técnica sobre tiempos Morse, compatibilidad ITU o síntesis de audio? Agradecemos los comentarios de radioaficionados, estudiantes y docentes."
                        : "Have a suggestion, bug report, or feature request regarding Morse timing, ITU compliance, or audio synthesis? We welcome community feedback from operators, ham radio enthusiasts, and learners."))}
                </p>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text)' }}>
                  <div><strong>Email:</strong> <a href="mailto:infoniaziseo@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>infoniaziseo@gmail.com</a></div>
                  <div style={{ marginTop: '0.5rem' }}><strong>Web:</strong> <a href="https://morsecodetranslatr.io/pt/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>morsecodetranslatr.io/pt/</a></div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={closeModal}
                style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}
              >
                {isPt ? "Fechar" : (isTr ? "Kapat" : (isEs ? "Cerrar" : "Close"))}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
