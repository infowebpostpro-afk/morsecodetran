import React from 'react';
import {
  ShieldCheck, Lock, EyeOff, Server, HardDrive, Cpu,
  CheckCircle2, AlertCircle, Mail, Globe, Sparkles,
  ArrowRight
} from 'lucide-react';

export function TurkishPrivacyPolicyPage({ setActiveTab }) {
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
      <nav aria-label="Ekmek Kırıntısı Navigasyonu" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
          <li>
            <a
              href="/tr/"
              onClick={(e) => handleNav(e, 'turkish', '/tr/')}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Ana Sayfa
            </a>
          </li>
          <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
          <li style={{ color: 'var(--primary)', fontWeight: 600 }} aria-current="page">
            Gizlilik Politikası
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
          <span>İstemci Tarafı Gizlilik ve Sıfır Veri Toplama Garantisi</span>
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Gizlilik Politikası
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span><strong>Yürürlük Tarihi:</strong> 4 Ekim 2026</span>
          <span>•</span>
          <span><strong>Son Güncelleme:</strong> 4 Ekim 2026</span>
          <span>•</span>
          <span><strong>Kapsam:</strong> MorseCodeTranslatr.io Web Uygulaması ve Tarayıcı Eklentileri</span>
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
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>%100 Tarayıcı İçi İşlem</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Tüm metin çevirileri, Mors ses sentezleme (Web Audio API), kod çözme ve pratik testleri tamamen cihazınızın tarayıcısında yerel olarak yürütülür.
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
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Kullanıcı Verisi Kaydedilmez</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Yazdığınız, çevirdiğiniz veya dinlediğiniz hiçbir metin sunucularımıza gönderilmez, günlüğe kaydedilmez ve üçüncü taraflarla paylaşılmaz.
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
            <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Takip Çerezleri Yoktur</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Reklam çerezleri veya izleme pikselleri kullanmıyoruz. Tarayıcınızın yerel depolaması (localStorage) yalnızca tema ve hız tercihlerinizi hatırlar.
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
            <Lock size={20} color="var(--primary)" /> 1. Giriş ve Kapsam
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <strong>MorseCodeTranslatr.io</strong> (&ldquo;biz&rdquo;, &ldquo;sitemiz&rdquo; veya &ldquo;Hizmet&rdquo;) olarak gizliliğinize son derece önem veriyoruz. Bu Gizlilik Politikası; web sitemizi, eğitsel araçlarımızı, ses sentezleyicimizi ve Chrome Web Mağazası da dahil olmak üzere resmi tarayıcı eklentilerimizi kullandığınızda verilerin nasıl işlendiğini ve korunduğunu açıklar.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Hizmetimiz, gizliliği temel bir hak olarak kabul eden bir mimari ile tasarlanmıştır. Mors alfabesini öğrenirken veya çeviri yaparken girdiğiniz verilerin tamamen gizli kaldığından emin olabilirsiniz.
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
            <Cpu size={20} color="var(--signal)" /> 2. Toplamadığımız Bilgiler
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Kullanıcı metinlerini uzak sunucularda işleyen bulut tabanlı çeviri servislerinin aksine, MorseCodeTranslatr.io tamamen cihazınızda yerel çalışır:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Girdi İçeriği Kaydedilmez:</strong> Çeviriciye, kod çözücüye veya ses modülüne girdiğiniz Türkçe/İngilizce metinler ya da nokta-tire Mors dizilimleri yalnızca cihazınızın işlemcisinde JavaScript aracılığıyla işlenir. Bu veriler asla harici bir sunucuya ya da yapay zeka servisine iletilmez.
            </li>
            <li>
              <strong>Mikrofon veya Ses Kaydı Alınmaz:</strong> Mors sesleri W3C standardı Web Audio API ile cihazınızda anlık olarak sentezlenir. Ses çözücü algoritmaları yalnızca yüklediğiniz ses dosyasını yerel bellek içinde analiz eder, dış ortam dinlemesi yapmaz.
            </li>
            <li>
              <strong>Kişisel Tanımlayıcı Bilgi İstenmez:</strong> Ad, soyad, e-posta, telefon numarası veya ödeme bilgisi gibi kimliğinizi ortaya çıkaracak hiçbir kişisel veri talep edilmez ve saklanmaz.
            </li>
            <li>
              <strong>Kullanıcı Hesabı Gerektirmez:</strong> Sitemizi veya eklentilerimizi kullanmak için üye olmanız, giriş yapmanız veya parola oluşturmanız gerekmez.
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
            <HardDrive size={20} color="var(--accent-amber)" /> 3. Cihazınızda Yerel Olarak Saklanan Tercihler
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Kullanıcı deneyiminizi kolaylaştırmak için tarayıcınızın yerel depolama alanında (HTML5 <code>localStorage</code>) sadece temel arayüz tercihleri tutulur:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Depolama Anahtarı</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Kullanım Amacı</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Konum ve Süre</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>morse_theme</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Açık / koyu tema tercihinizi hatırlar.</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Yalnızca yerel cihazda tutulur; ağa aktarılmaz.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>morse_wpm_pref</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Tercih ettiğiniz WPM (kelime/dakika) hız ayarını saklar.</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Yalnızca yerel cihazda tutulur; ağa aktarılmaz.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', margin: 0 }}>
            Dilediğiniz zaman tarayıcı ayarlarınızdan (Ayarlar &rarr; Tarama Verilerini Temizle &rarr; Çerezler ve site verileri) bu verileri sıfırlayabilirsiniz.
          </p>
        </section>

        {/* Section 4: Chrome Web Mağazası ve Eklenti Politikaları */}
        <section style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="var(--signal-bright)" /> 4. Tarayıcı Eklentisi & Chrome Web Mağazası Politika Uyumluluğu
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Google Chrome Web Mağazası üzerinden dağıtılan resmi MorseCodeTranslatr eklentimiz, Google Geliştirici Programı Politikalarına ve Tek Amaç (Single Purpose) ilkesine tam uyumludur:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Tek ve Belirli Amaç:</strong> Eklentimiz yalnızca Uluslararası Mors alfabesini çevirmek, sesli dinletmek ve sembolleri çözümlemek amacıyla çalışır.
            </li>
            <li>
              <strong>Asgari İzin Prensibi:</strong> Eklenti yalnızca arayüz ve ses işlevleri için gereken asgari izinleri (tercihler için <code>storage</code> gibi) talep eder. Gezinme geçmişinizi okuma, diğer sitelerdeki form verilerini izleme veya web sayfalarını değiştirme gibi gereksiz izinler kesinlikle istenmez.
            </li>
            <li>
              <strong>Veri Satışı ve Paylaşımı Yoktur:</strong> Kullanıcı verileri, arama geçmişi veya kullanım metrikleri hiçbir reklam şirketine, veri komisyoncusuna veya üçüncü şahsa satılmaz, kiralanmaz ve devredilmez.
            </li>
            <li>
              <strong>Uzak Komut Dosyası Bulunmaz:</strong> Manifest V3 standartlarına uygun olarak tüm kodlar eklenti paketi içinde yer alır; dışarıdan çalıştırılabilir kod (remote code) indirilmez.
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
            <Server size={20} color="var(--primary)" /> 5. Sunucu Günlükleri ve Altyapı
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <code>morsecodetranslatr.io</code> adresini ziyaret ettiğinizde, web barındırma altyapımız (Cloudflare / statik CDN sağlayıcıları) ağ güvenliği ve teknik hata tespiti amacıyla standart web sunucusu günlüklerini tutabilir:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <li>IP adresi (DDoS koruması ve coğrafi yönlendirme amacıyla geçici olarak işlenir)</li>
            <li>Tarayıcı türü ve işletim sistemi (User-Agent)</li>
            <li>Erişilen sayfa yolu ve istek zamanı</li>
            <li>Sunucu yanıt kodu ve aktarılan bayt miktarı</li>
          </ul>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Bu teknik günlükler yalnızca altyapı güvenliği ve performans optimizasyonu için kullanılır; asla bireysel kimliklerle veya çeviri içerikleriyle eşleştirilmez.
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
            <Globe size={20} color="var(--accent-amber)" /> 6. Harici Yazı Tipleri (Google Fonts)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Sitemiz okunabilirliği artırmak amacıyla Google Fonts kütüphanesini (Inter, Plus Jakarta Sans, JetBrains Mono) kullanmaktadır. Yazı tipi dosyaları Google sunucularından indirilirken Google Fonts Gizlilik Politikası geçerlidir. Bu süreçte hiçbir kişisel veri kaydedilmez.
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
            <AlertCircle size={20} color="var(--signal)" /> 7. Çocukların Gizliliği (COPPA ve KVKK / GDPR)
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            MorseCodeTranslatr.io öğrenciler, izciler, telsiz meraklıları ve her yaştan kullanıcı için uygundur. Sistemimiz hiçbir kişisel veri toplamadığından, 6698 sayılı KVKK, AB Genel Veri Koruma Tüzüğü (GDPR Madde 8) ve ABD Çocukların Çevrimiçi Gizliliğini Koruma Yasası (COPPA) gerekliliklerini eksiksiz yerine getirmektedir.
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
            <CheckCircle2 size={20} color="var(--signal-bright)" /> 8. Kullanıcı Hakları ve Veri Silme
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili uluslararası mevzuat uyarınca kullanıcılar kişisel verilerinin silinmesini veya düzeltilmesini talep etme hakkına sahiptir.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            MorseCodeTranslatr.io veritabanında kişisel veriniz depolanmadığı için <strong>sunucularımızda silinecek, düzeltilecek veya aktarılacak bir kullanıcı kaydı bulunmamaktadır</strong>. Yerel cihazınızdaki ayarları silmek isterseniz tarayıcı geçmişini ve önbelleğini temizlemeniz yeterlidir.
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
            <Mail size={20} color="var(--primary)" /> 9. İletişim ve Geri Bildirim
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Gizlilik politikamız veya tarayıcı eklentimizle ilgili her türlü soru, görüş ve resmi bildirim için bizimle iletişime geçebilirsiniz:
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
              <strong>Proje Adı:</strong> MorseCodeTranslatr.io
            </div>
            <div>
              <strong>Resmi İnternet Sitesi:</strong>{' '}
              <a href="https://morsecodetranslatr.io/tr/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                https://morsecodetranslatr.io/tr/
              </a>
            </div>
            <div>
              <strong>Doğrudan İletişim E-postası:</strong>{' '}
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
            <Sparkles size={20} color="var(--accent-amber)" /> 10. Politika Değişiklikleri
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Bu Gizlilik Politikası, yeni araçlar eklendikçe veya platform gereklilikleri değiştikçe güncellenebilir. Değişiklik yapıldığında sayfanın başındaki &ldquo;Son Güncelleme&rdquo; tarihi yenilenir. Yapılan tüm güncellemeler, temel prensibimiz olan <strong>sıfır veri toplama ve tam istemci tarafı gizliliği</strong> esasına daima sadık kalacaktır.
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
          Mors alfabesini çevirmeye ve dinlemeye hazır mısınız?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          ITU-R standartlarına tam uyumlu çeviri aracımızı, ses sentezleyicimizi ve alıştırma modüllerimizi güvenle kullanabilirsiniz.
        </p>
        <a
          href="/tr/"
          onClick={(e) => handleNav(e, 'turkish', '/tr/')}
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
          <span>Mors Çeviriciyi Aç</span>
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}
