import React, { useState } from 'react';
import {
  GraduationCap, Volume2, Play, Square, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  CheckCircle, Target, Sparkles, HelpCircle, AlertTriangle, Zap, Clock, BookOpen
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishLearnMorsePage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingKey, setPlayingKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlayAudio = (char, morse) => {
    setPlayingKey(char);
    audioEngine.playSequence({
      breakdown: [{ char, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingKey(null);
      }
    });
  };

  const faqs = [
    {
      q: "Mors alfabesini öğrenmek ne kadar sürer?",
      a: "Günde 15–20 dakika düzenli pratikle, Koch yöntemi kullanılarak temel 26 harfi 10–15 WPM hızında kulaktan tanımak ortalama 3 ila 6 hafta sürer. Akıcı bir telsiz operatörü seviyesine (20+ WPM) ulaşmak ise genellikle 2–4 aylık düzenli çalışma gerektirir."
    },
    {
      q: "Mors alfabesini öğrenmenin en etkili yöntemi nedir?",
      a: "Dünya genelinde telsiz amatörleri ve askeri eğitimlerce kanıtlanmış en etkili yöntem 'Koch Yöntemi' ve 'Farnsworth Zamanlaması' kombinasyonudur. Harfleri tam hedef hızında (en az 18–20 WPM) dinleyerek öğrenmek ve karakter aralarındaki boşlukları uzatmak, beynin noktaları saymasını engeller ve ses motifini refleks haline getirir."
    },
    {
      q: "Neden Mors kodunu gözle değil kulakla öğrenmeliyiz?",
      a: "Mors alfabesi görsel bir şifre değil, akustik bir ritim dilidir. Görsel tabloya bakarak 'A = nokta + çizgi' diye ezberlerseniz, telsizden gelen sesi duyduğunuzda önce zihninizde sese karşılık gelen noktaları hayal eder, sonra harfi bulursunuz. Bu çift aşamalı tercüme 5 WPM üzerindeki hızlarda beynin tıkanmasına yol açar. Kulaktan öğrenildiğinde 'di-dah' ritmi doğrudan A harfini çağrıştırır."
    },
    {
      q: "Koch yöntemi tam olarak nasıl çalışır?",
      a: "1936'da psikolog Ludwig Koch tarafından geliştirilen bu yöntemde, tüm alfabe yerine yalnızca iki harfle (genellikle K ve M) başlanır. Bu harfler tam hedef hızda (örn. 20 WPM) dinletilir. Dinleme testinde %90 doğruluk oranına ulaşıldığında üçüncü bir harf eklenir. Böylece her karakter sıfırdan yüksek hızda refleks olarak yerleşir."
    },
    {
      q: "Farnsworth zamanlaması nedir?",
      a: "Donald R. Farnsworth tarafından geliştirilen bu teknikte, harflerin kendi içindeki nokta-çizgi hızı yüksek (örneğin 18 WPM) tutulur, ancak harfler arasındaki sessizlik süresi uzatılarak efektif hız 5–8 WPM'e düşürülür. Öğrenci harfin gerçek ritmini bozulmadan dinlerken, harfi tanıması için zihnine yeterli düşünme süresi tanınmış olur."
    },
    {
      q: "Mors kodunu önce göndermeyi (tuşlamayı) mi yoksa almayı (dinlemeyi) mi öğrenmeliyim?",
      a: "Kesinlikle önce 'almayı' (dinleyip tanımayı) öğrenmelisiniz. Birçok acemi operatör önce maniple ile hızlıca tuşlama yapmayı öğrenir ancak aynı hızda gelen sinyalleri çözemez. Alma refleksi oturduktan sonra gönderme becerisi çok daha hızlı ve hatasız gelişir."
    },
    {
      q: "Harfleri dinlerken kaçırdığımda ne yapmalıyım?",
      a: "Asla kaçırdığınız harfe takılıp onu hatırlamaya çalışmayın! Kaçan harfe odaklandığınız anda arkasından gelen 3 harfi daha kaçırırsınız. Kaçan harfi hemen unutun, boşluk bırakın ve bir sonraki gelen sinyali yakalamaya odaklanın. Telsiz operatörlüğünün en kritik kuralı budur."
    },
    {
      q: "Mors kodunu öğrenmek için müzik kulağı gerekir mi?",
      a: "Hayır. Mors kodu müzikal nota perdesiyle değil, sadece kısa-uzun süre ritmiyle ilgilidir. Ritim duygusu olan veya düzenli pratik yapan herkes yaş farkı gözetmeksizin Mors alfabesini öğrenebilir."
    },
    {
      q: "Ezberlemeye hangi harflerle başlamalıyım?",
      a: "Başlangıç için E (tek nokta), T (tek çizgi), A (nokta-çizgi) ve N (çizgi-nokta) harfleri mükemmel bir gruptur. A ve N birbirinin ayna tersi olduğu için hafızada çok kolay yer eder."
    },
    {
      q: "Rakamları ve noktalama işaretlerini ne zaman öğrenmeliyim?",
      a: "26 temel harfte en az 12–15 WPM seviyesinde %90 başarıya ulaşana kadar rakam ve sembolleri eklemeyin. Harfler oturduktan sonra 5 elemanlı rakam merdiveni (1–0) çok kısa sürede öğrenilir."
    }
  ];

  return (
    <div className="learn-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Alfabesi Nasıl Öğrenilir</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <GraduationCap size={16} /> Kanıtlanmış Bilişsel Öğrenme Metodolojisi
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Alfabesi Nasıl Öğrenilir: Adım Adım Başlangıç Rehberi
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Mors alfabesini görsel tablolarla değil, doğrudan işitsel ritimle öğrenin. Koch yöntemi, Farnsworth boşlukları ve kanıtlanmış günlük pratik planı ile sıfırdan uzmanlığa adım atın.
        </p>
      </header>

      {/* Key Principle Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', border: '1px solid var(--border)', background: 'rgba(56, 189, 248, 0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
              1 Numaralı Altın Kural: Mors Kodunu Gözle Değil, Kulakla Öğrenin!
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Yeni başlayanların yaptığı en büyük hata noktaları ve çizgileri kağıt üzerinde saymaktır. Bir harfi duyduğunuzda zihninizde "nokta-çizgi" diye tercüme etmemelisiniz; onun yerine sesin genel ritmini (örneğin A harfi için <strong>di-dah</strong>) bir melodi gibi doğrudan tanımalısınız.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Starter Drills */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
          Başlangıç İçin İlk 6 Harfin Sesini Dinleyin (E, T, A, N, M, S)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { char: 'E', morse: '.', desc: 'Tek nokta (dit)', rhythm: 'dit' },
            { char: 'T', morse: '-', desc: 'Tek çizgi (dah)', rhythm: 'dah' },
            { char: 'A', morse: '.-', desc: 'Nokta-Çizgi', rhythm: 'di-dah' },
            { char: 'N', morse: '-.', desc: 'Çizgi-Nokta', rhythm: 'dah-dit' },
            { char: 'M', morse: '--', desc: 'İki çizgi', rhythm: 'dah-dah' },
            { char: 'S', morse: '...', desc: 'Üç nokta', rhythm: 'di-di-dit' }
          ].map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{item.char}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', margin: '0.25rem 0' }}>{item.morse}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{item.rhythm}</div>
              <button
                onClick={() => handlePlayAudio(item.char, item.morse)}
                className="btn"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                <Volume2 size={16} /> Sesi Dinle
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comprehensive Editorial Content */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: Sound vs Sight Cognitive Diagram */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            1. Bilişsel Tanıma: Neden Görsel Değil de İşitsel Yöntem?
          </h2>
          <p>
            Mors alfabesini bir tabloya bakarak görsel olarak ezberlediğinizde beyninizde 3 aşamalı hantal bir tercüme süreci oluşur:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '1.5rem 0' }}>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--signal)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> Doğru Yöntem (Refleks Odaklı)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, margin: '0.75rem 0', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.3rem 0.6rem', background: 'var(--surface)', borderRadius: '4px' }}>Ses / Ritim</span>
                <ArrowRight size={14} />
                <span style={{ padding: '0.3rem 0.6rem', background: 'var(--surface)', borderRadius: '4px' }}>Harf</span>
                <ArrowRight size={14} />
                <span style={{ padding: '0.3rem 0.6rem', background: 'var(--surface)', borderRadius: '4px' }}>Kelime</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Sesi doğrudan harfin adı olarak algılarsınız. Hız 20–30 WPM'e çıksa bile algı hızınız sinyale yetişir.
              </p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Hatalı Acemi Yöntemi (Görsel Tercüme)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, margin: '0.75rem 0', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '4px' }}>Ses</span>
                <ArrowRight size={12} />
                <span style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '4px' }}>Nokta/Çizgi</span>
                <ArrowRight size={12} />
                <span style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '4px' }}>Harf</span>
                <ArrowRight size={12} />
                <span style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '4px' }}>Kelime</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Beyin önce noktaları sayar, sonra harfe çevirir. Hız 8 WPM'i geçtiğinde işlemci kapasitesi çöker ve harfler kaçar.
              </p>
            </div>

          </div>
        </section>

        {/* Section 2: The Koch Method */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            2. Koch Yöntemi: Yüksek Hızda Aşamalı Öğrenme
          </h2>
          <p>
            Alman psikolog Ludwig Koch tarafından 1936'da geliştirilen <strong>Koch Yöntemi</strong>, Mors alfabesini en kısa sürede kalıcı refleks haline getiren bilimsel metodolojidir.
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.8 }}>
            <li><strong>Tam Hedef Hız (20 WPM):</strong> Harfler asla yavaşlatılmış seslerle öğretilmez. Ses en baştan itibaren profesyonel telgraf hızı olan 18–20 WPM'de dinletilir.</li>
            <li><strong>Yalnızca İki Harfle Başlayın:</strong> İlk gün sadece 2 harf (örneğin K ve M) seçilir. Bu iki harf karışık sıralarda dinlenir ve kağıda yazılır.</li>
            <li><strong>%90 Başarı Barajı:</strong> Yapılan 5 dakikalık testte başarı oranı %90'a ulaştığında listeye 1 yeni harf eklenir (K, M, R gibi).</li>
            <li><strong>Birer Birer İlerleme:</strong> Her yeni harf eklendiğinde yine %90 barajı aranır. Böylece 26 harfin tamamı yüksek hızda refleks olarak zihne kazınır.</li>
          </ul>
        </section>

        {/* Section 3: Farnsworth Timing */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            3. Farnsworth Zamanlaması: Harfi Hızlı Dinle, Boşlukta Düşün
          </h2>
          <p>
            Koch yöntemiyle çalışırken yeni başlayanların harfi tanıması için zamana ihtiyacı vardır. Çözüm harfin sesini yavaşlatmak değil, harfler arasındaki boşluğu uzatmaktır:
          </p>

          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div>
                <strong style={{ color: 'var(--primary)' }}>Karakter Hızı (18–20 WPM):</strong>
                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                  Nokta ve çizgilerin kendi içindeki süresi gerçektir. Karakterin melodisi bozulmaz.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--signal-bright)' }}>Efektif Hız (5–8 WPM):</strong>
                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                  Harften sonra verilen sessizlik uzatılır. Zihniniz duyduğu sesi işler ve harfi yazar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Daily Practice Routine Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            4. Örnek 15 Dakikalık Günlük Çalışma Programı
          </h2>
          <p>
            Haftada bir gün 2 saat çalışmak yerine, her gün düzenli 15 dakika ayırmak öğrenme süresini 3 kat hızlandırır:
          </p>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Çalışma Aşaması</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Önerilen Süre</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Faaliyet ve Odak Noktası</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>1. Isınma</td>
                  <td style={{ padding: '0.75rem 1rem' }}>2 Dakika</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Önceki günlerden iyi bildiğiniz 4–5 harfi rahat tempoda dinleyin.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--signal-bright)' }}>2. Kulaktan Tanıma</td>
                  <td style={{ padding: '0.75rem 1rem' }}>8 Dakika</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Mevcut Koch harf grubunu karışık sıralarda dinleyin ve anında kağıda yazın.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>3. Kelime Pratiği</td>
                  <td style={{ padding: '0.75rem 1rem' }}>3 Dakika</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Öğrendiğiniz harflerle kurulan kısa gerçek kelimeleri (örn. BEN, SEN, AD) dinleyin.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text)' }}>4. Gönderme (Tuşlama)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>2 Dakika</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Maniple simülatöründe öğrendiğiniz harfleri doğru ritimle tuşlayarak pekiştirin.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Common Mistakes */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            5. Yeni Başlayanları Yavaşlatan 5 Kritik Hata
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                title: 'Nokta ve Çizgileri Teker Teker Saymak',
                desc: 'Dit-dit-dit duyduğunuzda "bir, iki, üç nokta, demek ki S" hesabı yapmayın. Sesi bir bütün kelime veya zil melodisi gibi algılayın.'
              },
              {
                title: 'Dinleme Egzersizi Sırasında Tabloya Bakmak',
                desc: 'Gözleriniz tabloya kilitlendiğinde kulak ikinci plana düşer. Alıştırma yaparken gözlerinizi kapatın veya boş bir duvara bakın.'
              },
              {
                title: 'Kaçırılan Harfin Peşinden Koşmak',
                desc: 'Bir harfi kaçırdığınızda onu çözmeye çalışırsanız arkasından gelen 3 harfi daha kaçırırsınız. Kaçanı anında unutun ve yenisine odaklanın.'
              },
              {
                title: 'Çok Erken Dönemde Sayı ve Sembollere Geçmek',
                desc: '26 harf tam oturmadan rakam ve noktalama işaretlerini öğrenmeye çalışmak zihni aşırı yükler ve öğrenme sürecini kilitler.'
              },
              {
                title: 'Haftada Bir Gün Saatlerce Çalışmak',
                desc: 'Mors kas hafızası ve nöronal bağ kurma işidir. Pazar günü 2 saat çalışmak yerine haftanın her günü 15 dakika çalışmak çok daha kalıcıdır.'
              }
            ].map((m, idx) => (
              <div key={idx} style={{ background: 'var(--surface-sunken)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  ✗ {m.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>Önerilen İlgili Sayfalar</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/how-to-read-morse-code/" onClick={(e) => handleNav(e, 'tr-howtoread', '/tr/how-to-read-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Kodu Nasıl Okunur? →
            </a>
            <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              İşitsel Dinleme Antrenörü →
            </a>
            <a href="/tr/morse-code-keyer/" onClick={(e) => handleNav(e, 'tr-keyer', '/tr/morse-code-keyer/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Maniple Tuşlama Simülatörü →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Öğrenimi Hakkında Sıkça Sorulan Sorular
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
