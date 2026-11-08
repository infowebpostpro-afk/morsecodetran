import React, { useState, useEffect, useRef } from 'react';
import { MorseLogo } from './MorseLogo';
import { Sun, Moon, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { navigationEn, navigationTr, navigationEs, navigationPt, isTurkishRoute, isSpanishRoute, isPortugueseRoute, getEquivalentRoute } from '../i18n/navigation.js';
import { ChromeIcon } from './ChromeIcon.jsx';
import { CHROME_EXTENSION_URL } from './ChromeExtensionBanner.jsx';

export function Header({ theme, toggleTheme, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenSections, setMobileOpenSections] = useState({});
  const headerRef = useRef(null);

  const isTr = isTurkishRoute(activeTab);
  const isEs = isSpanishRoute(activeTab);
  const isPt = isPortugueseRoute(activeTab);
  const currentNav = isTr ? navigationTr : (isEs ? navigationEs : (isPt ? navigationPt : navigationEn));
  const homeHref = isTr ? '/tr/' : (isEs ? '/es/' : (isPt ? '/pt/' : '/'));
  const homeTab = isTr ? 'turkish' : (isEs ? 'spanish' : (isPt ? 'portuguese' : 'translator'));

  const enTarget = getEquivalentRoute(activeTab, 'en');
  const trTarget = getEquivalentRoute(activeTab, 'tr');
  const esTarget = getEquivalentRoute(activeTab, 'es');
  const ptTarget = getEquivalentRoute(activeTab, 'pt');

  const currentLangCode = isTr ? 'TR' : (isEs ? 'ES' : (isPt ? 'PT' : 'EN'));
  const currentLangLabel = isTr ? 'Türkçe' : (isEs ? 'Español' : (isPt ? 'Português' : 'English'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMobileLangOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileLangOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleTabClick = (e, tab, href) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (href && window.location.pathname !== href) {
      window.history.pushState({ tab }, '', href);
    }
    setMobileMenuOpen(false);
    setMobileLangOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileSection = (label) => {
    setMobileOpenSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isCategoryActive = (category) => {
    return category.items.some(item => item.tab === activeTab);
  };

  return (
    <header className="navbar" ref={headerRef}>
      <div className="nav-container">
        <a
          href={homeHref}
          className="brand-logo"
          onClick={(e) => handleTabClick(e, homeTab, homeHref)}
          aria-label={isPt ? "Tradutor de código Morse Página Inicial" : (isTr ? "Mors Alfabesi Çeviri Ana Sayfa" : (isEs ? "Traductor de Código Morse Inicio" : "MorseCodeTranslatr Homepage"))}
        >
          <MorseLogo size={36} showText={true} />
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label={isPt ? "Navegação principal" : (isTr ? "Ana Menü" : (isEs ? "Navegación principal" : "Main Navigation"))}>
          <ul className="desktop-nav-list">
            {currentNav.map((category) => {
              const isActive = isCategoryActive(category);
              const isOpen = openDropdown === category.label;
              return (
                <li key={category.label} className="nav-item">
                  <button
                    className={`nav-button ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenDropdown(isOpen ? null : category.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {category.label}
                    <ChevronDown size={14} className="dropdown-icon" />
                  </button>

                  {isOpen && (
                    <div className="dropdown-menu">
                      <ul>
                        {category.items.map((item) => {
                          const isItemActive = activeTab === item.tab;
                          const Icon = item.icon;
                          return (
                            <li key={item.tab}>
                              <a
                                href={item.href}
                                className={`dropdown-item ${isItemActive ? 'active' : ''}`}
                                onClick={(e) => handleTabClick(e, item.tab, item.href)}
                                aria-current={isItemActive ? 'page' : undefined}
                              >
                                <div className="dropdown-item-icon">
                                  <Icon size={18} />
                                </div>
                                <div className="dropdown-item-content">
                                  <span className="dropdown-item-title">{item.label}</span>
                                  <span className="dropdown-item-desc">{item.desc}</span>
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Chrome Extension Direct Link */}
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-extension-badge"
            title={
              isPt
                ? "Extensão de Código Morse para Google Chrome — Grátis"
                : (isTr
                  ? "Google Chrome Mors Alfabesi Eklentisi — Ücretsiz İndir"
                  : (isEs
                    ? "Extensión de Código Morse para Google Chrome — Gratis"
                    : "Google Chrome Morse Code Translator Extension — Free Download"))
            }
            aria-label="Google Chrome Extension"
          >
            <ChromeIcon size={16} />
            <span className="nav-extension-text">
              {isPt ? "Extensão" : (isTr ? "Eklenti" : (isEs ? "Extensión" : "Extension"))}
            </span>
          </a>

          {/* Desktop Language Switcher (Full Horizontal Bar) */}
          <nav className="language-switcher-desktop" aria-label={isPt ? "Seletor de idioma" : (isTr ? "Dil Seçici" : (isEs ? "Selector de idioma" : "Language Selector"))}>
            <a
              href={enTarget.path}
              style={{
                color: !isTr && !isEs && !isPt ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: !isTr && !isEs && !isPt ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, enTarget.tab, enTarget.path)}
              title="English"
              aria-current={!isTr && !isEs && !isPt ? 'page' : undefined}
            >
              English
            </a>
            <span style={{ color: 'var(--border)' }}>·</span>
            <a
              href={trTarget.path}
              style={{
                color: isTr ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isTr ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, trTarget.tab, trTarget.path)}
              title="Türkçe"
              aria-current={isTr ? 'page' : undefined}
            >
              Türkçe
            </a>
            <span style={{ color: 'var(--border)' }}>·</span>
            <a
              href={esTarget.path}
              style={{
                color: isEs ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isEs ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, esTarget.tab, esTarget.path)}
              title="Español"
              aria-current={isEs ? 'page' : undefined}
            >
              Español
            </a>
            <span style={{ color: 'var(--border)' }}>·</span>
            <a
              href={ptTarget.path}
              style={{
                color: isPt ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isPt ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, ptTarget.tab, ptTarget.path)}
              title="Português (Brasil)"
              aria-current={isPt ? 'page' : undefined}
            >
              Português (Brasil)
            </a>
          </nav>

          {/* Mobile/Tablet Compact Language Pill with Dropdown */}
          <div className="language-switcher-mobile-wrapper" style={{ position: 'relative' }}>
            <button
              type="button"
              className="language-switcher-mobile-btn"
              onClick={() => {
                setMobileLangOpen(!mobileLangOpen);
                setOpenDropdown(null);
              }}
              aria-expanded={mobileLangOpen}
              aria-haspopup="true"
              aria-label={isPt ? `Idioma atual: ${currentLangLabel}` : (isTr ? `Geçerli dil: ${currentLangLabel}` : (isEs ? `Idioma actual: ${currentLangLabel}` : `Current language: ${currentLangLabel}`))}
              title={currentLangLabel}
            >
              <Globe size={14} />
              <span>{currentLangCode}</span>
              <ChevronDown size={12} style={{ transform: mobileLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {mobileLangOpen && (
              <div className="language-mobile-dropdown">
                <a
                  href={enTarget.path}
                  className={!isTr && !isEs && !isPt ? 'active' : ''}
                  onClick={(e) => { handleTabClick(e, enTarget.tab, enTarget.path); setMobileLangOpen(false); }}
                  aria-current={!isTr && !isEs && !isPt ? 'page' : undefined}
                >
                  <span>English</span>
                  {!isTr && !isEs && !isPt && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>}
                </a>
                <a
                  href={trTarget.path}
                  className={isTr ? 'active' : ''}
                  onClick={(e) => { handleTabClick(e, trTarget.tab, trTarget.path); setMobileLangOpen(false); }}
                  aria-current={isTr ? 'page' : undefined}
                >
                  <span>Türkçe</span>
                  {isTr && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>}
                </a>
                <a
                  href={esTarget.path}
                  className={isEs ? 'active' : ''}
                  onClick={(e) => { handleTabClick(e, esTarget.tab, esTarget.path); setMobileLangOpen(false); }}
                  aria-current={isEs ? 'page' : undefined}
                >
                  <span>Español</span>
                  {isEs && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>}
                </a>
                <a
                  href={ptTarget.path}
                  className={isPt ? 'active' : ''}
                  onClick={(e) => { handleTabClick(e, ptTarget.tab, ptTarget.path); setMobileLangOpen(false); }}
                  aria-current={isPt ? 'page' : undefined}
                >
                  <span>Português (Brasil)</span>
                  {isPt && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>}
                </a>
              </div>
            )}
          </div>

          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label={isPt ? "Alternar tema" : (isTr ? "Temayı Değiştir" : (isEs ? "Cambiar tema" : "Toggle theme"))}
            title={isPt ? "Modo claro/escuro" : (isTr ? "Koyu/Açık Tema" : (isEs ? "Modo claro/oscuro" : "Toggle light/dark mode"))}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileLangOpen(false);
            }}
            aria-label={isPt ? "Abrir ou fechar menu móvel" : (isTr ? "Mobil Menüyü Aç/Kapat" : (isEs ? "Abrir o cerrar menú móvil" : "Toggle Mobile Menu"))}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          {/* Mobile Chrome Extension Callout */}
          <div className="mobile-extension-cta">
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-extension-link"
            >
              <ChromeIcon size={24} />
              <div className="mobile-extension-info">
                <span className="mobile-extension-title">
                  {isTr ? "Chrome Eklentisi" : (isEs ? "Extensión Chrome" : (isPt ? "Extensão Chrome" : "Chrome Extension"))}
                </span>
                <span className="mobile-extension-sub">
                  {isTr
                    ? "Sağ tıkla her web sitesinde anında Mors çevirisi yapın"
                    : (isEs
                      ? "Traduce Morse en cualquier web con clic derecho"
                      : (isPt
                        ? "Traduza código Morse em qualquer site com clique direito"
                        : "Translate Morse on any page with a right-click"))}
                </span>
              </div>
              <span className="mobile-extension-btn">
                {isTr ? "Ücretsiz Ekle" : (isEs ? "Gratis" : (isPt ? "Grátis" : "Get Free"))}
              </span>
            </a>
          </div>

          {/* Clean Mobile Language Switcher Pills */}
          <div className="mobile-menu-languages">
            <span className="mobile-lang-label">
              <Globe size={14} /> {isPt ? "Idioma" : (isTr ? "Dil Seçimi" : (isEs ? "Idioma" : "Language"))}:
            </span>
            <div className="mobile-lang-pills">
              <a
                href={enTarget.path}
                className={`mobile-lang-pill ${!isTr && !isEs && !isPt ? 'active' : ''}`}
                onClick={(e) => handleTabClick(e, enTarget.tab, enTarget.path)}
                aria-current={!isTr && !isEs && !isPt ? 'page' : undefined}
              >
                English
              </a>
              <a
                href={trTarget.path}
                className={`mobile-lang-pill ${isTr ? 'active' : ''}`}
                onClick={(e) => handleTabClick(e, trTarget.tab, trTarget.path)}
                aria-current={isTr ? 'page' : undefined}
              >
                Türkçe
              </a>
              <a
                href={esTarget.path}
                className={`mobile-lang-pill ${isEs ? 'active' : ''}`}
                onClick={(e) => handleTabClick(e, esTarget.tab, esTarget.path)}
                aria-current={isEs ? 'page' : undefined}
              >
                Español
              </a>
              <a
                href={ptTarget.path}
                className={`mobile-lang-pill ${isPt ? 'active' : ''}`}
                onClick={(e) => handleTabClick(e, ptTarget.tab, ptTarget.path)}
                aria-current={isPt ? 'page' : undefined}
              >
                Português
              </a>
            </div>
          </div>
          <nav className="mobile-nav" aria-label={isPt ? "Menu Móvel" : (isTr ? "Mobil Menü" : "Mobile Navigation")}>
            <ul className="mobile-nav-list">
              {currentNav.map((category) => {
                const isActive = isCategoryActive(category);
                const isOpen = mobileOpenSections[category.label];
                return (
                  <li key={category.label} className="mobile-nav-item">
                    <button
                      className={`mobile-nav-button ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                      onClick={() => toggleMobileSection(category.label)}
                      aria-expanded={isOpen}
                    >
                      <span>{category.label}</span>
                      <ChevronDown size={16} className={`mobile-dropdown-icon ${isOpen ? 'open' : ''}`} />
                    </button>

                    {isOpen && (
                      <ul className="mobile-dropdown-list">
                        {category.items.map((item) => {
                          const isItemActive = activeTab === item.tab;
                          return (
                            <li key={item.tab}>
                              <a
                                href={item.href}
                                className={`mobile-dropdown-item ${isItemActive ? 'active' : ''}`}
                                onClick={(e) => handleTabClick(e, item.tab, item.href)}
                                aria-current={isItemActive ? 'page' : undefined}
                              >
                                {item.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
