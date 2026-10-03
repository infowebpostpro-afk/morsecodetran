import React, { useState } from 'react';
import {
  BookOpen, HelpCircle, Volume2, ShieldAlert,
  Radio, CheckCircle2, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { TURKISH_EXTENDED_MAP } from '../engine/turkishMorse.js';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishArticleContent({ wpm = 20, frequency = 600, volume = 0.5, onSelectExample }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const playCharSound = (char, morse) => {
    audioEngine.playSequence({
      breakdown: [{ char, morse }],
      wpm,
      frequency,
      volume
    });
  };

  // Full Turkish Alphabet list: A-Z + Turkish letters
  const alphabetItems = [
    { char: 'A', morse: '.-', name: 'Alpha', note: 'Standart ITU' },
    { char: 'B', morse: '-...', name: 'Bravo', note: 'Standart ITU' },
    { char: 'C', morse: '-.-.', name: 'Charlie', note: 'Standart ITU' },
    { char: 'Ç', morse: '-.-..', name: 'Çankırı', note: 'Türkçe Genişletilmiş / ITU Sadeleştirme: C (-.-.)' },
    { char: 'D', morse: '-..', name: 'Delta', note: 'Standart ITU' },
    { char: 'E', morse: '.', name: 'Echo', note: 'Standart ITU' },
    { char: 'F', morse: '..-.', name: 'Foxtrot', note: 'Standart ITU' },
    { char: 'G', morse: '--.', name: 'Golf', note: 'Standart ITU' },
    { char: 'Ğ', morse: '--.-.', name: 'Yumuşak G', note: 'Türkçe Genişletilmiş / ITU Sadeleştirme: G (--.)' },
    { char: 'H', morse: '....', name: 'Hotel', note: 'Standart ITU' },
    { char: 'I / ı', morse: '..', name: 'Isparta', note: 'Noktasız I (Standart Mors I ile aynı: ..)' },
    { char: 'İ / i', morse: '..', name: 'İzmir', note: 'Noktalı İ (Standart Mors I ile aynı: ..)' },
    { char: 'J', morse: '.---', name: 'Juliett', note: 'Standart ITU' },
    { char: 'K', morse: '-.-', name: 'Kilo', note: 'Standart ITU' },
    { char: 'L', morse: '.-..', name: 'Lima', note: 'Standart ITU' },
    { char: 'M', morse: '--', name: 'Mike', note: 'Standart ITU' },
    { char: 'N', morse: '-.', name: 'November', note: 'Standart ITU' },
    { char: 'O', morse: '---', name: 'Oscar', note: 'Standart ITU' },
    { char: 'Ö', morse: '---.', name: 'Ödemiş', note: 'Türkçe Genişletilmiş / ITU Sadeleştirme: O (---)' },
    { char: 'P', morse: '.--.', name: 'Papa', note: 'Standart ITU' },
    { char: 'R', morse: '.-.', name: 'Romeo', note: 'Standart ITU' },
    { char: 'S', morse: '...', name: 'Sierra', note: 'Standart ITU' },
    { char: 'Ş', morse: '----', name: 'Şırnak', note: 'Türkçe Genişletilmiş / ITU Sadeleştirme: S (...)' },
    { char: 'T', morse: '-', name: 'Tango', note: 'Standart ITU' },
    { char: 'U', morse: '..-', name: 'Uniform', note: 'Standart ITU' },
    { char: 'Ü', morse: '..--', name: 'Ünye', note: 'Türkçe Genişletilmiş / ITU Sadeleştirme: U (..-)' },
    { char: 'V', morse: '...-', name: 'Victor', note: 'Standart ITU' },
    { char: 'Y', morse: '-.--', name: 'Yankee', note: 'Standart ITU' },
    { char: 'Z', morse: '--..', name: 'Zulu', note: 'Standart ITU' }
  ];

  // Numbers 0-9
  const numberItems = [
    { char: '0', morse: '-----' },
    { char: '1', morse: '.----' },
    { char: '2', morse: '..---' },
    { char: '3', morse: '...--' },
    { char: '4', morse: '....-' },
    { char: '5', morse: '.....' },
    { char: '6', morse: '-....' },
    { char: '7', morse: '--...' },
    { char: '8', morse: '---..' },
    { char: '9', morse: '----.' }
  ];

  // Common Punctuation
  const punctuationItems = [
    { char: 'Nokta (.)', morse: '.-.-.-' },
    { char: 'Virgül (,)', morse: '--..--' },
    { char: 'Soru İşareti (?)', morse: '..--..' },
    { char: 'Eğik Çizgi (/)', morse: '-..-.' },
    { char: 'Tire (-)', morse: '-....-' },
    { char: 'Eşittir (=)', morse: '-...-' },
    { char: 'Ünlem (!)', morse: '-.-.--' },
    { char: 'SOS Acil Sinyali (<SOS>)', morse: '...---...' }
  ];

  const faqs = [
    {
      q: 'Mors alfabesinde Türkçe karakterler (Ç, Ğ, İ, Ö, Ş, Ü) nasıl çevrilir?',
      a: 'Uluslararası Telekomünikasyon Birliği (ITU-R M.1677-1) standardı yalnızca temel 26 Latin harfini (A–Z) tanımlar. Bu nedenle uluslararası Mors haberleşmesinde Türkçe karakterler genellikle en yakın Latin karşılığına sadeleştirilir (Ç→C, Ğ→G, İ/ı→I, Ö→O, Ş→S, Ü→U). Ancak Türk amatör telsizcilik ve telgraf geleneğinde bu harfler için özel genişletilmiş kodlar da mevcuttur (Örneğin Ç: -.-.., Ğ: --.-., Ö: ---., Ş: ----, Ü: ..--). Çeviricimizde her iki yaklaşım da desteklenir ve seçtiğiniz kurala göre şeffaf uyarı verilir.'
    },
    {
      q: 'Mors kodunda harfler ve kelimeler arasındaki boşluklar nasıl bırakılır?',
      a: 'Mors alfabesinde zamanlama katı kurallara bağlıdır: Bir harfin içindeki nokta ve tireler arasında 1 birim, iki farklı harf arasında 3 birim (yazıda 1 standart boşluk), iki farklı kelime arasında ise 7 birim (yazıda eğik çizgi "/" veya 3 boşluk) bırakılır. Boşluksuz yazılan Mors kodu anlamsal karmaşaya (ambiguity) yol açar.'
    },
    {
      q: 'Boşluk bırakılmadan yazılan Mors kodu neden doğru çevrilemez?',
      a: 'Çünkü Mors alfabesi değişken uzunluklu bir koddur. Örneğin "... " ifadesi tek başına "S" harfidir. Ancak harfler arasında boşluk bırakılmazsa aynı "..." dizilimi "EEE" (üç tane E), "EI" veya "IE" olarak da okunabilir. Çözücünün harf sınırlarını anlayabilmesi için harfler arasına mutlaka en az bir boşluk konulmalıdır.'
    },
    {
      q: '"SOS" ile kesintisiz acil durum sinyali (<SOS>) arasındaki fark nedir?',
      a: 'Ayrı ayrı yazılan "S O S" harfleri aralarında standart 3 birimlik harf boşluğu barındırır (... --- ...). Oysa uluslararası denizcilik ve telsiz acil durum sinyali olan <SOS>, harf aralarında boşluk bırakılmadan tek bir kesintisiz simge (prosign) olarak iletilir (...---...). Çeviri aracımız her iki kullanımı da doğru tanır.'
    },
    {
      q: 'Mors kodunu ses dosyası (WAV) olarak indirebilir miyim?',
      a: 'Evet. Metninizi veya Mors kodunuzu girdikten sonra araç çubuğundaki "Ses İndir (WAV)" düğmesine basarak oluşturulan Mors sinyalini standart 44.1 kHz WAV ses dosyası olarak doğrudan bilgisayarınıza veya telefonunuza indirebilirsiniz.'
    },
    {
      q: 'WPM ve Farnsworth ayarı ne işe yarar?',
      a: 'WPM (Words Per Minute), dakikada iletilen standart kelime sayısını (PARIS standardı = 50 nokta birimi) temsil eder. Farnsworth ayarı ise harflerin kendi içindeki hızını yüksek tutarken harfler ve kelimeler arasındaki bekleme süresini uzatır. Bu yöntem, yeni öğrenenlerin harfleri nokta-tire sayarak değil, bir melodi olarak işitsel hafızaya kaydetmesini sağlar.'
    }
  ];

  return (
    <div className="article-container" style={{ marginTop: '3.5rem' }}>
      {/* SECTION 1: How to use the tool */}
      <section className="article-section">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Mors Alfabesi Çeviri Aracı Nasıl Kullanılır?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Çevrimiçi Mors alfabesi çeviricimiz, tarayıcınızın Web Audio API gücünü kullanarak iki yönlü, anlık ve gizlilik odaklı bir çeviri deneyimi sunar. Yazdığınız hiçbir metin harici bir sunucuya gönderilmez; tüm kodlama ve ses üretimi doğrudan cihazınızda gerçekleşir.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              1. Metni Mors Koduna Dönüştürme
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Metin kutusuna Türkçe veya yabancı bir cümle yazın ya da yapıştırın. Çevirici karakterleri anında Mors noktalarına (.) ve tirelerine (-) dönüştürür. Çıkan sonucu tek tıkla kopyalayabilir veya <strong>Sesi Oynat</strong> düğmesiyle dinleyebilirsiniz.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--signal)' }}>
              2. Mors Kodunu Metne Çözme
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Elinizdeki Mors kodu dizilimini giriş alanına yapıştırın. Harfler arasında tek boşluk, kelimeler arasında ise <code>/</code> veya 3 boşluk kullandığınızdan emin olun. Araç, Mors dizisini otomatik algılayarak Türkçe/Latin metne çevirir.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Turkish Character Handling Rules */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Mors Alfabesinde Türkçe Karakterler (Ç, Ğ, İ, Ö, Ş, Ü) Nasıl İşlenir?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Mors alfabesini öğrenenlerin ve kullananların en sık karşılaştığı soru, Türkçe'ye özgü harflerin uluslararası sistemde nasıl iletileceğidir. Uluslararası Telekomünikasyon Birliği’nin <strong>ITU-R M.1677-1</strong> tavsiye kararında temel Mors alfabesi 26 İngiliz Latin harfi üzerinden tanımlanmıştır.
        </p>

        <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} color="var(--primary)" /> İki Farklı Yaklaşım: Sadeleştirme vs. Genişletilmiş Kodlar
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            <li>
              <strong>1. Uluslararası Standart (Sadeleştirme):</strong> Küresel amatör telsizcilikte (CW) ve uluslararası mesajlaşmada Türkçe karakterler en yakın temel Latin harfine dönüştürülür: <code>Ç → C</code>, <code>Ğ → G</code>, <code>İ/ı → I</code>, <code>Ö → O</code>, <code>Ş → S</code>, <code>Ü → U</code>. Bu yöntem mesajın tüm dünyadaki alıcılar tarafından hatasız okunmasını garanti eder. Ancak Mors'tan metne geri çevrildiğinde orijinal Türkçe aksanların (şapka/nokta) otomatik geri gelmeyeceği bilinmelidir.
            </li>
            <li style={{ marginTop: '0.5rem' }}>
              <strong>2. Türkçe Genişletilmiş Kodlar (Telsiz ve Telgraf Geleneği):</strong> Yerel haberleşmede ve özel Türkçe Mors tablolarında bu harflere özgü özel kombinasyonlar kabul görmüştür. Çeviricimizin üst panelindeki <em>"Karakter Kuralı"</em> menüsünden bu iki mod arasında dilediğiniz gibi geçiş yapabilirsiniz.
            </li>
          </ul>
        </div>

        {/* Turkish Letters Comparative Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%', display: 'block' }}>
          <table style={{ width: '100%', minWidth: '450px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-elevated)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Türkçe Harf</th>
                <th style={{ padding: '0.75rem 1rem' }}>Genişletilmiş Mors Kodu</th>
                <th style={{ padding: '0.75rem 1rem' }}>Uluslararası ITU Sadeleştirmesi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dits & Dahs Okunuşu</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Ses</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ch: 'Ç', ext: '-.-..', std: 'C (-.-.)', sound: '-.-..', dit: 'dah-di-dah-di-dit' },
                { ch: 'Ğ', ext: '--.-.', std: 'G (--.)', sound: '--.-.', dit: 'dah-dah-di-dah-dit' },
                { ch: 'İ (Noktalı)', ext: '..', std: 'I (..)', sound: '..', dit: 'di-dit' },
                { ch: 'ı (Noktasız)', ext: '..', std: 'I (..)', sound: '..', dit: 'di-dit' },
                { ch: 'Ö', ext: '---.', std: 'O (---)', sound: '---.', dit: 'dah-dah-dah-dit' },
                { ch: 'Ş', ext: '----', std: 'S (...)', sound: '----', dit: 'dah-dah-dah-dah' },
                { ch: 'Ü', ext: '..--', std: 'U (..-)', sound: '..--', dit: 'di-di-dah-dah' },
              ].map((row, i) => (
                <tr key={row.ch} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-sunken)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text)' }}>{row.ch}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}><code>{row.ext}</code></td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{row.std}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.dit}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      className="btn-icon"
                      onClick={() => playCharSound(row.ch, row.sound)}
                      title={`${row.ch} sesini çal`}
                      aria-label={`${row.ch} sesini çal`}
                    >
                      <Volume2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Spacing & Ambiguity */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Mors Kodunda Boşluk Kuralları ve Boşluksuz Mors Karmaşası
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Mors alfabesi sadece noktalardan ve tirelerden ibaret değildir; zamanlama ve aralıklardaki sessizlikler de alfabenin ayrılmaz birer harfidir. Uluslararası standart zamanlama oranları şu şekildedir:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sembol İçi Boşluk</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: '0.25rem 0' }}>1 Nokta Birimi</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Aynı harfin nokta ve tireleri arasındaki sessizlik.</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Harf Arası Boşluk</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>3 Nokta Birimi</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>İki harfi ayırmak için bırakılan boşluk (yazıda 1 boşluk tuşu).</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Kelime Arası Boşluk</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--signal)', margin: '0.25rem 0' }}>7 Nokta Birimi</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>İki kelime arasındaki duraklama (yazıda <code>/</code> veya 3 boşluk).</p>
          </div>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem', color: 'var(--text)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={18} /> Boşluksuz Mors Neden Çözülemez?
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Mors alfabesi sabit bit uzunluğuna sahip bir kodlama değildir (Örn: E tek bir noktadır <code>.</code>, O üç tiredir <code>---</code>). Eğer harfler arasına boşluk bırakmadan örneğin <code>...</code> yazarsanız, bu dizi tek bir <strong>S</strong> harfi anlamına gelebileceği gibi, üç tane <strong>E</strong> harfi (<code>. . .</code>), bir <strong>E</strong> ve bir <strong>I</strong> (<code>. ..</code>) ya da bir <strong>I</strong> ve bir <strong>E</strong> (<code>.. .</code>) anlamına da gelebilir. Bu nedenle doğru bir çözümleme için harfler arasına mutlaka boşluk eklenmelidir.
          </p>
        </div>
      </section>

      {/* SECTION 4: Interactive Full Alphabet Reference Table */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Türkçe ve Uluslararası Mors Alfabesi Tablosu (A–Z, Sayılar & Semboller)
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Aşağıdaki interaktif referans tablosunda tüm harflerin Mors karşılıklarını inceleyebilir ve ses simgesine tıklayarak her bir karakterin Mors tonunu dinleyebilirsiniz.
        </p>

        {/* Letters Grid */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Harfler (A–Z ve Türkçe Ekler)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {alphabetItems.map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', position: 'relative', cursor: 'pointer' }}
              onClick={() => playCharSound(item.char, item.morse)}
              title={`${item.char} (${item.morse}) sesini çal`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playCharSound(item.char, item.morse);
                }
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{item.char}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '0.2rem 0' }}>{item.morse}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.name}</div>
              <div style={{ position: 'absolute', top: '6px', right: '6px', opacity: 0.5 }}>
                <Volume2 size={12} />
              </div>
            </div>
          ))}
        </div>

        {/* Numbers Grid */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Rakamlar (0–9)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {numberItems.map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => playCharSound(item.char, item.morse)}
              title={`${item.char} (${item.morse}) sesini çal`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playCharSound(item.char, item.morse);
                }
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{item.char}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{item.morse}</div>
            </div>
          ))}
        </div>

        {/* Punctuation Grid */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Noktalama & Özel İşaretler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {punctuationItems.map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => playCharSound(item.char, item.morse)}
              title={`${item.char} (${item.morse}) sesini çal`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playCharSound(item.char, item.morse);
                }
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{item.char}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--signal)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>{item.morse}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FAQs */}
      <section className="article-section" style={{ marginTop: '4rem' }} id="faq">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={24} color="var(--primary)" /> Sıkça Sorulan Sorular (SSS)
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Mors alfabesi çevirisi, ses üretimi ve Türkçe karakter desteği hakkında en çok merak edilen konular.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                    <p style={{ marginTop: '0.75rem' }}>{faq.a}</p>
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
