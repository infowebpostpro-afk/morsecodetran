import React, { useState } from 'react';
import {
  History, Clock, ShieldCheck, ChevronDown, ChevronUp, BookOpen,
  Calendar, ExternalLink, Radio, Compass, Anchor, Sparkles
} from 'lucide-react';

export function TurkishHistoryPage({ setActiveTab }) {
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: "Mors alfabesini kim ve ne zaman icat etti?",
      a: "Mors alfabesi, 1830'lu yılların başında Amerikalı ressam ve mucit Samuel F. B. Morse tarafından tasarlandı ve mekanik ortağı Alfred Vail ile birlikte 1837–1844 yılları arasında New Jersey Morristown'daki Speedwell Ironworks atölyesinde mükemmelleştirildi."
    },
    {
      q: "Samuel Morse telgrafı geliştirmeye neden karar verdi?",
      a: "1825 yılında Samuel Morse Washington D.C.'de çalışırken, Connecticut'taki eşinin ağır hastalandığı haberi atlı ulakla kendisine ulaştı. Morse eve vardığında eşi çoktan vefat etmiş ve defnedilmişti. Bu derin kişisel trajedi, Morse'u mesafeleri saniyeler içinde aşabilecek elektrikli bir iletişim sistemi geliştirmeye adadı."
    },
    {
      q: "Alfred Vail'in Mors alfabesindeki gerçek rolü nedir?",
      a: "Smithsonian Enstitüsü arşiv belgelerine göre Alfred Vail, telgrafın mekanik kolunu ve kayıt düzeneğini tasarlayan kişidir. Ayrıca yerel bir matbaayı ziyaret ederek kurşun harf kasalarını incelemiş, İngilizcede en sık kullanılan harflere (E ve T) en kısa Mors kodlarını atayarak alfabenin verimliliğini sağlayan deha olmuştur."
    },
    {
      q: "İlk resmi telgraf mesajı nedir ve ne zaman iletildi?",
      a: "24 Mayıs 1844 tarihinde Samuel Morse, Washington D.C. Kongre Binası'ndan Baltimore tren istasyonunda bekleyen Alfred Vail'e ilk resmi telgraf mesajını iletti: 'What hath God wrought?' (Tanrı neler yarattı?). Mesaj Kongre Kütüphanesi arşivinde saklanmaktadır."
    },
    {
      q: "Amerikan Mors Kodu ile Uluslararası Mors Kodu arasındaki fark nedir?",
      a: "Orijinal Amerikan Mors kodu harf içinde değişken boşluklar (örneğin C harfi iki nokta ve bir ara boşluktu) ve farklı uzunlukta çizgiler içeriyordu. 1848'de Alman müfettiş Friedrich Clemens Gerke, bu iç boşlukları kaldırarak alfabeyi sadeleştirdi. 1865 Paris Konferansı'nda bu sistem 'Uluslararası Mors Kodu' (Continental Morse) olarak standartlaştı."
    },
    {
      q: "Titanic faciasının Mors kodu tarihindeki önemi nedir?",
      a: "14 Nisan 1912 gecesi RMS Titanic batarken telsiz operatörleri Jack Phillips ve Harold Bride, eski 'CQD' çağrısının yanı sıra yeni kabul edilen 'SOS' sinyalini kullandı. Yakındaki Carpathia gemisi bu Mors sinyalini duyarak 700'den fazla insanı kurtardı. Bu facia, 1914 SOLAS Sözleşmesi ile tüm gemilerde 24 saat kesintisiz telsiz nöbetini zorunlu kıldı."
    },
    {
      q: "Mors kodu resmi denizcilikte ne zaman sonlandırıldı?",
      a: "Uluslararası Denizcilik Örgütü (IMO), 1 Şubat 1999 tarihinde Mors kodu kullanım zorunluluğunu resmi olarak kaldırdı ve yerini uydu tabanlı Küresel Denizde Tehlike ve Güvenlik Sistemi'ne (GMDSS) bıraktı."
    }
  ];

  return (
    <div className="history-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Alfabesinin Tarihi</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <History size={16} /> 1830'lardan Günümüze Telekomünikasyon Tarihi
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Alfabesinin Tarihi: Telgraftan Modern Telsiz İletişimine
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Samuel Morse'un kişisel trajedisinden 1844 ilk mesajına, Friedrich Gerke'nin uluslararası revizyonundan Titanic faciasına ve 1999 GMDSS dönüşümüne kadar Mors alfabesinin kronolojik yolculuğu.
        </p>
      </header>

      {/* Comprehensive History Content */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Chapter 1: 1830s Origins & Samuel Morse Trajectory */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            1. 1830'lar: İletişim Krizi ve Bir Ressamın İlhamı
          </h2>
          <p>
            19. yüzyılın başlarında kıtalararası veya şehirlerarası haberleşme yalnızca atlı postacılar, gemiler ve optik kuleler (semafor) ile sınırlıydı. Bilginin bir şehirden diğerine ulaşması günler veya haftalar sürüyordu.
          </p>
          <p>
            1825 yılında tanınmış bir portre ressamı olan <strong>Samuel Finley Breese Morse</strong>, Washington D.C.'de Lafayette'in portresini yaparken New Haven'daki babasından bir mektup aldı: Eşi Lucretia aniden hastalanmıştı. Morse derhal yola çıktı ancak at sırtındaki yolculuk bittiğinde eşi çoktan defnedilmişti. Bu acı gecikme, Morse'un hayatının geri kalanını elektrikle anlık mesaj ileten bir mekanizmaya adamasına yol açtı.
          </p>
        </section>

        {/* Chapter 2: Alfred Vail Partnership */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            2. Alfred Vail ve Kodun Mekanik Doğuşu
          </h2>
          <p>
            Samuel Morse elektrik akımını açıp kapatarak kağıt üzerinde iz bırakma fikrini geliştirdi ancak pratik mekanik cihazları üretmekte zorlanıyordu. 1837'de New Jersey'deki Speedwell Ironworks'ün varisi yetenekli makine mühendisi <strong>Alfred Vail</strong> ile ortaklık kurdu.
          </p>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1rem 0' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Alfred Vail'in Kritik Katkısı (Smithsonian Arşivleri)</h4>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Vail, yerel bir gazete matbaasını ziyaret ederek kurşun harf kasalarındaki harf yoğunluğunu saydı. İngilizce metinlerde en çok 'E' ve 'T' harflerinin kullanıldığını fark ederek, en çok kullanılan harflere en kısa kodları atadı (E: tek nokta, T: tek çizgi). Bu frekans analizi, Mors kodunun günümüze kadar ulaşan yüksek verimlilik temelini oluşturdu.
            </p>
          </div>
        </section>

        {/* Chapter 3: 1844 Historic Baltimore First Message */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            3. 24 Mayıs 1844: "What Hath God Wrought?"
          </h2>
          <p>
            ABD Kongresi'nden alınan 30.000 dolarlık ödenekle Washington D.C. ile Baltimore (Maryland) arasına 61 kilometrelik ilk telgraf hattı çekildi. 24 Mayıs 1844 sabahı Yüksek Mahkeme salonunda Samuel Morse anahtara bastı ve kağıt şeride noktalar ve çizgiler basıldı:
          </p>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', margin: '1.25rem 0' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
              ".-- .... .- - / .... .- - .... / --. --- -.. / .-- .-. --- ..- --. .... - / ?"
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              "Tanrı neler yarattı?" — İncil, Sayılar 23:23 (Kongre Kütüphanesi Koleksiyonu).
            </p>
          </div>
          <p>
            Mesaj Baltimore'daki Alfred Vail tarafından hatasız çözüldü ve elektrikli telekomünikasyon çağı resmen başladı.
          </p>
        </section>

        {/* Chapter 4: Friedrich Gerke Revision & Paris 1865 */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            4. 1848 Friedrich Gerke Revizyonu ve 1865 Paris Konvansiyonu
          </h2>
          <p>
            İlk Amerikan Mors alfabesinde harf içi boşluklar ve üç farklı uzunlukta çizgiler vardı. Bu karmaşıklık Avrupa'da kafa karışıklığı yaratıyordu. 1848'de Hamburg-Cuxhaven telgraf hattının kurucusu <strong>Friedrich Clemens Gerke</strong>, alfabeyi kökten revize etti:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.8 }}>
            <li>Harf içi karmaşık boşluklar kaldırıldı.</li>
            <li>Çizgi süresi kesin olarak noktanın 3 katı olarak sabitlendi.</li>
            <li>Sayılar 5 elemanlı simetrik merdiven düzenine getirildi.</li>
          </ul>
          <p>
            1865 yılında 20 ülkenin katılımıyla toplanan Paris Konferansı'nda Uluslararası Telekomünikasyon Birliği (ITU) kuruldu ve Gerke'nin revize ettiği sistem <strong>Uluslararası Mors Kodu</strong> adıyla küresel standart ilan edildi.
          </p>
        </section>

        {/* Chapter 5: Marconi, Titanic & Maritime Distress */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            5. Guglielmo Marconi, Denizcilik ve Titanic Faciası (1912)
          </h2>
          <p>
            1890'ların sonunda Guglielmo Marconi'nin telsiz telgrafı (kablosuz iletişim) icat etmesiyle Mors kodu karalardan açık denizlere taşındı. 1901'de ilk transatlantik telsiz yayını gerçekleştirildi.
          </p>
          <p>
            <strong>14 Nisan 1912 Titanic Faciası:</strong> Bir buzdağına çarpan RMS Titanic'in telsiz operatörleri Jack Phillips ve Harold Bride, saatlerce durmaksızın geleneksel İngiliz deniz tehlike kodu <code>CQD</code> ve yeni kabul edilen <code>...---...</code> (SOS) sinyallerini gönderdi. 90 km uzaktaki RMS Carpathia bu çağrıyı alarak olay yerine ulaştı ve 705 yolcunun hayatını kurtardı.
          </p>
          <p>
            Bu felaketin ardından 1914 yılında ilk Denizde Can Emniyeti Uluslararası Sözleşmesi (SOLAS) imzalandı ve tüm yolcu gemilerinde 24 saat kesintisiz Mors telsiz nöbeti zorunlu hale getirildi.
          </p>
        </section>

        {/* Chapter 6: GMDSS and 21st Century */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            6. 1999 GMDSS Dönüşümü ve 21. Yüzyılda Mors
          </h2>
          <p>
            1 Şubat 1999 tarihinde Uluslararası Denizcilik Örgütü (IMO), deniz ticareti ve güvenliğinde 500 kHz Mors dinleme nöbetini resmi olarak sonlandırdı ve uydulu dijital GMDSS sistemine geçti. Fransız Donanması son Mors mesajını 1997'de iletti: <em>"Tüm istasyonlara. Bu bizim ebedi sessizlik öncesi son feryadımızdır."</em>
          </p>
          <p>
            Ancak Mors kodu ölmedi. Günümüzde:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
            <li>Dünya çapındaki 3 milyondan fazla lisanslı amatör telsizci (CW modu) tarafından günlük olarak yaşatılmaktadır.</li>
            <li>Küresel havacılık seyrüsefer istasyonları (VOR, DME, NDB) Mors kimlik sinyalleri yayınlamaya devam etmektedir.</li>
            <li>Askeri özel kuvvetler ve acil durum ekipleri, elektronik karıştırmaların (jammer) tüm uyduları kilitlediği durumlarda en dayanıklı analog yedek olarak Mors kodunu korumaktadır.</li>
          </ul>
        </section>

        {/* Chronological Timeline Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Alfabesinin Kronolojik Zaman Çizelgesi
          </h2>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Yıl</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Tarihi Olay ve Gelişme</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1832', 'Samuel Morse, Sully gemisi seyahatinde elektrikle anlık mesaj iletimi fikrini not defterine çizdi.'],
                  ['1837', 'Speedwell Ironworks atölyesinde Alfred Vail ile ortaklık kuruldu; mekanik maniple geliştirildi.'],
                  ['1844', '24 Mayıs: Washington-Baltimore hattında ilk resmi telgraf mesajı iletildi ("What hath God wrought?").'],
                  ['1848', 'Friedrich Clemens Gerke, harf içi boşlukları kaldırarak günümüz Uluslararası Mors Alfabesini tasarladı.'],
                  ['1865', 'Paris Konferansı ile Uluslararası Telekomünikasyon Birliği (ITU) kuruldu ve standart kabul edildi.'],
                  ['1901', 'Guglielmo Marconi, İngiltere Cornwall ile Kanada St. John\'s arasında ilk transatlantik Mors telsiz bağlantısını kurdu.'],
                  ['1906', 'Berlin Radyotelgraf Konvansiyonu\'nda SOS (... --- ...) uluslararası resmi tehlike çağrısı seçildi.'],
                  ['1912', 'RMS Titanic faciasında Mors SOS sinyalleri ile 700\'den fazla insan kurtarıldı; 24 saat telsiz nöbeti yasalaştı.'],
                  ['1999', '1 Şubat: Denizcilikte Mors kodu nöbeti kaldırıldı; uydu tabanlı GMDSS sistemine geçildi.'],
                  ['Günümüz', 'Havacılık VOR/NDB seyrüseferi, amatör telsizcilik (CW) ve engelli yardımcı teknolojilerinde aktif kullanım.']
                ].map(([year, evt], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{year}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{evt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Tarihsel Konular</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/what-is-morse-code/" onClick={(e) => handleNav(e, 'tr-whatismorse', '/tr/what-is-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Alfabesi Nedir? →
            </a>
            <a href="/tr/sos-in-morse-code/" onClick={(e) => handleNav(e, 'tr-sos', '/tr/sos-in-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              SOS Acil Durum Sinyali Tarihi →
            </a>
            <a href="/tr/morse-code-amateur-radio/" onClick={(e) => handleNav(e, 'tr-amateurradio', '/tr/morse-code-amateur-radio/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Amatör Telsizde Mors (CW) →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Alfabesi Tarihi Hakkında Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
