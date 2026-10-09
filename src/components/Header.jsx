import React, { useState, useEffect, useRef } from 'react';
import { MorseLogo } from './MorseLogo';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { navigationEn, navigationTr, navigationEs, isTurkishRoute, isSpanishRoute, getEquivalentRoute } from '../i18n/navigation.js';
import { ChromeIcon } from './ChromeIcon.jsx';
import { CHROME_EXTENSION_URL } from './ChromeExtensionBanner.jsx';

export function Header({ theme, toggleTheme, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenSections, setMobileOpenSections] = useState({});
  const headerRef = useRef(null);

  const isTr = isTurkishRoute(activeTab);
  const isEs = isSpanishRoute(activeTab);
  const currentNav = isTr ? navigationTr : (isEs ? navigationEs : navigationEn);
  const homeHref = isTr ? '/tr/' : (isEs ? '/es/' : '/');
  const homeTab = isTr ? 'turkish' : (isEs ? 'spanish' : 'translator');

  const enTarget = getEquivalentRoute(activeTab, 'en');
  const trTarget = getEquivalentRoute(activeTab, 'tr');
  const esTarget = getEquivalentRoute(activeTab, 'es');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
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
          aria-label={isTr ? "Mors Alfabesi Çeviri Ana Sayfa" : (isEs ? "Traductor de Código Morse Inicio" : "MorseCodeTranslatr Homepage")}
        >
          <MorseLogo size={36} showText={true} />
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label={isTr ? "Ana Menü" : (isEs ? "Navegación principal" : "Main Navigation")}>
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
              isTr
                ? "Google Chrome Mors Alfabesi Eklentisi — Ücretsiz İndir"
                : (isEs
                  ? "Extensión de Código Morse para Google Chrome — Gratis"
                  : "Google Chrome Morse Code Translator Extension — Free Download")
            }
            aria-label="Google Chrome Extension"
          >
            <ChromeIcon size={16} />
            <span className="nav-extension-text">
              {isTr ? "Eklenti" : (isEs ? "Extensión" : "Extension")}
            </span>
          </a>

          {/* Context-Preserving Crawlable Language Switcher */}
          <div className="language-switcher" aria-label={isTr ? "Dil Seçici" : (isEs ? "Selector de idioma" : "Language Selector")} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-sunken)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600 }}>
            <a
              href={enTarget.path}
              style={{
                color: !isTr && !isEs ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: !isTr && !isEs ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, enTarget.tab, enTarget.path)}
              title="English"
              aria-current={!isTr && !isEs ? 'page' : undefined}
            >
              English
            </a>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a
              href={trTarget.path}
              style={{
                color: isTr ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: isTr ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, trTarget.tab, trTarget.path)}
              title="Türkçe"
              aria-current={isTr ? 'page' : undefined}
            >
              Türkçe
            </a>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a
              href={esTarget.path}
              style={{
                color: isEs ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: isEs ? 700 : 500
              }}
              onClick={(e) => handleTabClick(e, esTarget.tab, esTarget.path)}
              title="Español"
              aria-current={isEs ? 'page' : undefined}
            >
              Español
            </a>
          </div>

          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label={isTr ? "Temayı Değiştir" : (isEs ? "Cambiar tema" : "Toggle theme")}
            title={isTr ? "Koyu/Açık Tema" : (isEs ? "Modo claro/oscuro" : "Toggle light/dark mode")}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={isTr ? "Mobil Menüyü Aç/Kapat" : (isEs ? "Abrir o cerrar menú móvil" : "Toggle Mobile Menu")}
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
                  {isTr ? "Chrome Eklentisi" : (isEs ? "Extensión Chrome" : "Chrome Extension")}
                </span>
                <span className="mobile-extension-sub">
                  {isTr
                    ? "Sağ tıkla her web sitesinde anında Mors çevirisi yapın"
                    : (isEs
                      ? "Traduce Morse en cualquier web con clic derecho"
                      : "Translate Morse on any page with a right-click")}
                </span>
              </div>
              <span className="mobile-extension-btn">
                {isTr ? "Ücretsiz Ekle" : (isEs ? "Gratis" : "Get Free")}
              </span>
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language / Dil / Idioma:</span>
            <a
              href={enTarget.path}
              style={{
                color: !isTr && !isEs ? 'var(--primary)' : 'var(--text)',
                fontWeight: !isTr && !isEs ? 700 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
              onClick={(e) => handleTabClick(e, enTarget.tab, enTarget.path)}
            >
              English
            </a>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a
              href={trTarget.path}
              style={{
                color: isTr ? 'var(--primary)' : 'var(--text)',
                fontWeight: isTr ? 700 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
              onClick={(e) => handleTabClick(e, trTarget.tab, trTarget.path)}
            >
              Türkçe
            </a>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a
              href={esTarget.path}
              style={{
                color: isEs ? 'var(--primary)' : 'var(--text)',
                fontWeight: isEs ? 700 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
              onClick={(e) => handleTabClick(e, esTarget.tab, esTarget.path)}
            >
              Español
            </a>
          </div>
          <nav className="mobile-nav" aria-label={isTr ? "Mobil Menü" : "Mobile Navigation"}>
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
