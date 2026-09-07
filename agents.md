# AGENTS.md

## Project: Morse Code Translator

This file defines the engineering, product, UX, SEO, content, accessibility, performance, and quality standards for the entire Morse Code Translator project.

All AI coding agents and developers working on this repository MUST follow these instructions.

---

# 1. PROJECT OVERVIEW

Build a premium, fast, accurate, mobile-first **Morse Code Translator** website.

---

# CONSERVATIVE SEO VALIDATION & AUDITING STANDARD

All AI coding agents and developers working on this repository MUST follow these rules when reporting SEO scores, audits, or implementation statuses:

1. **Never Report 10/10 Merely Because Code Exists**:
   - A feature being implemented does not prove that it is effective or that rankings will change.
   - For every SEO score or audit category, explicitly distinguish between:
     - **IMPLEMENTED**: Code, metadata, or component has been written to disk.
     - **VERIFIED**: Empirical testing has been performed (e.g. `npm run build` succeeded, browser subagent tested, layout validated).
     - **INFERRED**: Logical deduction based on structure, but not backed by Search Console / SERP data.
     - **NOT VERIFIED**: Requires live production data, search indexing, or real-world user metrics.

2. **Never Guarantee SEO Outcomes**:
   - Never promise FAQ rich results, AI Overview inclusions, or specific rank #1 position. Structured data is structured-data hygiene, not a guaranteed SERP feature.
   - Build metrics (`npm run build` duration) prove compilation speed, NOT Core Web Vitals (LCP/INP/CLS). Actual CWV metrics require RUM or PageSpeed Insights on live staging/production servers.

3. **Topical Positioning & Cannibalization Prevention**:
   - **Morse Code Translator (`/`)**: Broad two-way general-purpose translator tool.
   - **Morse Code Decoder (`/morse-code-decoder/`)**: Decoding mechanics, spacing problems, ambiguous Morse, verification, invalid groups, and decoder troubleshooting.
   - **Morse Code to English (`/morse-code-to-english/`)**: Direct practical Morse → English conversion workflow.
   - **English to Morse Code (`/english-to-morse-code/`)**: Direct practical English/text → Morse Code generator.
   - **Morse Code Numbers (`/morse-code-numbers/`)**: 0–9 digit reference, staircase visualizer, practice drills.
   - **Morse Code Alphabet (`/morse-code-alphabet/`)**: A–Z reference, phonetic pronunciation, prosigns.

4. **100% Client-Side Privacy Verification**:
   - Maintain 0 network calls for translation, decoding, or audio synthesis.
   - Never transmit user input to external telemetry, analytics, or logging APIs.

---

# LIVE SEO VALIDATION RULE

Never consider a page's SEO performance "proven" from source-code inspection alone.

Source-code inspection can verify implementation.

It cannot prove:
- Google rankings
- organic traffic
- impressions
- CTR
- featured snippets
- AI Overview inclusion
- AI search citations
- Core Web Vitals in real-world usage
- absence of keyword cannibalization in live SERPs

After deployment, treat these as separate validation stages:

### STAGE 1 — CODE VALIDATION
Verify metadata, canonical, schema, sitemap, robots, links, rendering, accessibility, and page implementation.

### STAGE 2 — LIVE VALIDATION
Verify the deployed URL, HTTP status, canonical resolution, rendered HTML, robots accessibility, sitemap accessibility, and structured-data validity.

### STAGE 3 — SEARCH VALIDATION
After indexing, monitor Google Search Console for:
- impressions
- clicks
- CTR
- average position
- queries
- indexing status
- page-level performance

### STAGE 4 — CANNIBALIZATION VALIDATION
Monitor whether closely related pages begin receiving impressions for the same important queries.

### STAGE 5 — PERFORMANCE VALIDATION
Use real deployed-page performance data to evaluate LCP, INP, and CLS.

### STAGE 6 — CONTENT ITERATION
Only make SEO changes when supported by:
- search data
- user behavior
- ranking/query data
- technical evidence
- clear content gaps

Do not change titles, headings, URLs, or content simply because an AI audit score is below 10.

Never guarantee rankings or AI Overview visibility.

---

The primary purpose is to let users:

* Convert text to Morse code
* Convert Morse code to text
* Automatically detect the input type
* Translate in real time
* Listen to Morse code
* Inspect individual characters
* Copy and share results
* Export Morse audio
* Decode Morse from audio
* Decode Morse from images
* Practice and learn Morse code
* Understand the International Morse Code alphabet
* Use advanced timing and CW controls

The product should feel like a specialized professional tool rather than a generic blog.

The default experience must remain extremely simple.

Advanced functionality should be available without overwhelming first-time users.

---

# 2. PRIMARY PRODUCT POSITIONING

Primary positioning:

> A fast, accurate Morse Code Translator that lets you translate, hear, decode, and learn Morse code in one place.

Primary homepage keyword:

**Morse Code Translator**

Secondary semantic concepts include:

* Morse code translator online
* Morse code converter
* Morse code decoder
* Morse translator
* Text to Morse
* Morse to text
* English to Morse code
* Morse code to English
* Morse code alphabet
* Morse code numbers
* International Morse Code
* Morse code audio
* Morse code decoder online
* Morse code generator
* Morse code reader
* Morse code practice
* Learn Morse Code

Do NOT keyword-stuff the interface or content.

Write naturally for humans first.

---

# 3. CORE PRODUCT PRINCIPLE

The product follows this journey:

**Translate → Hear → Inspect → Export → Learn**

Every feature should support one of these stages.

Do not add features simply because competitors have them.

Prioritize:

1. Accuracy
2. Speed
3. Simplicity
4. Mobile usability
5. Accessibility
6. Privacy
7. Learning value
8. Advanced functionality

---

# 4. TARGET USERS

## Primary ICP: General Translator User

Goal:

> "I have Morse code or text and need the translation immediately."

Needs:

* Fast conversion
* Automatic detection
* Copy
* Clear
* Swap
* Mobile usability
* No signup
* No unnecessary explanation
* Accurate output

This user should understand the tool within seconds.

---

## Secondary ICP: Morse Learner

Needs:

* Alphabet
* Character breakdown
* Audio
* WPM
* Farnsworth timing
* Practice
* Speed testing
* Weak-character practice
* Learning guides

---

## Secondary ICP: Ham/CW User

Needs:

* WPM
* Farnsworth timing
* Tone frequency
* Volume
* Timing controls
* Prosigns
* Keyer
* Audio decoder
* Precise Morse timing

---

# 5. TECHNOLOGY PRINCIPLES

Preferred stack:

* Next.js
* App Router
* TypeScript
* React
* Modern CSS / Tailwind where appropriate
* Server Components by default
* Client Components only when interactivity requires them

Use a modular architecture.

Avoid unnecessary dependencies.

Do not install a package when a small, reliable native implementation is sufficient.

---

# 6. GENERAL CODING RULES

## TypeScript

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a documented and unavoidable reason.

Prefer explicit types.

Example:

```ts
interface MorseCharacter {
  character: string
  code: string
}
```

---

## React

Prefer:

* small components
* reusable hooks
* pure utility functions
* predictable state
* controlled inputs

Avoid giant components.

Do not put the entire application inside one component.

---

## Server vs Client Components

Use Server Components by default.

Use `"use client"` only when required for:

* text input
* real-time translation
* audio playback
* microphone
* image processing
* keyboard interaction
* vibration
* browser APIs
* local storage
* interactive controls

Do not convert entire pages to Client Components unnecessarily.

---

# 7. RECOMMENDED PROJECT STRUCTURE

Use a structure similar to:

```text
/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── morse-code-alphabet/
│   │   └── page.tsx
│   │
│   ├── morse-code-numbers/
│   │   └── page.tsx
│   │
│   ├── morse-code-to-english/
│   │   └── page.tsx
│   │
│   ├── english-to-morse-code/
│   │   └── page.tsx
│   │
│   ├── morse-code-decoder/
│   │   └── page.tsx
│   │
│   ├── morse-code-audio-translator/
│   │   └── page.tsx
│   │
│   ├── learn-morse-code/
│   │   └── page.tsx
│   │
│   ├── how-to-read-morse-code/
│   │   └── page.tsx
│   │
│   ├── morse-code-symbols/
│   │   └── page.tsx
│   │
│   ├── morse-code-phrases/
│   │   └── page.tsx
│   │
│   ├── sos-in-morse-code/
│   │   └── page.tsx
│   │
│   ├── i-love-you-in-morse-code/
│   │   └── page.tsx
│   │
│   ├── what-is-morse-code/
│   │   └── page.tsx
│   │
│   ├── history-of-morse-code/
│   │   └── page.tsx
│   │
│   └── morse-code-amateur-radio/
│       └── page.tsx
│
├── components/
│   ├── translator/
│   ├── audio/
│   ├── decoder/
│   ├── image-decoder/
│   ├── keyer/
│   ├── learning/
│   ├── alphabet/
│   ├── navigation/
│   ├── seo/
│   └── ui/
│
├── lib/
│   ├── morse/
│   │   ├── alphabet.ts
│   │   ├── translator.ts
│   │   ├── decoder.ts
│   │   ├── timing.ts
│   │   ├── audio.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── seo/
│   ├── analytics/
│   └── utils/
│
├── public/
│   ├── images/
│   └── icons/
│
├── content/
│   ├── guides/
│   └── data/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── AGENTS.md
├── package.json
├── tsconfig.json
└── README.md
```

The exact structure may evolve, but functionality must remain modular.

---

# 8. MORSE CODE STANDARD

Use **International Morse Code** as the default standard.

The implementation must be based on the internationally recognized Morse code standard.

The canonical mapping must cover:

* A-Z
* 0-9
* punctuation
* commonly supported symbols

Do not invent Morse mappings.

Do not silently use an incompatible national Morse system.

If a character is unsupported:

* do not silently corrupt it
* clearly indicate that it is unsupported
* preserve the original input when appropriate

---

# 9. MORSE DATA MODEL

The Morse mapping must have a single source of truth.

Example:

```ts
export const MORSE_CODE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--.."
}
```

Numbers and punctuation must be maintained in the same canonical data layer.

Do not duplicate Morse mappings across components.

---

# 10. TRANSLATOR CORE

The homepage translator is the most important component.

It must support:

### Text → Morse

Example:

```text
HELLO WORLD
```

becomes:

```text
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

---

### Morse → Text

Example:

```text
.... . .-.. .-.. ---
```

becomes:

```text
HELLO
```

---

# 11. INPUT DETECTION

Support automatic detection.

The user should be able to paste either:

```text
HELLO WORLD
```

or:

```text
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

and the tool should determine the likely direction.

Detection must be conservative.

If the input is ambiguous, provide an understandable control allowing the user to choose:

* Text → Morse
* Morse → Text
* Auto

Never produce a surprising translation silently.

---

# 12. REAL-TIME TRANSLATION

Translation should update as the user types.

Avoid visible lag.

Use efficient state updates.

Do not perform expensive processing on every keystroke if it can be avoided.

For very large inputs:

* debounce expensive operations
* avoid unnecessary React renders
* preserve cursor position
* do not freeze the UI

---

# 13. TRANSLATOR UI

Default homepage layout:

```text
------------------------------------------------
Morse Code Translator

Translate text ↔ Morse code instantly.

[ Auto ▼ ] [ Swap ]

Input
[                                      ]
[                                      ]

Output
[                                      ]
[                                      ]

[ Copy ] [ Play ] [ Share ] [ Clear ]

Characters: 12
Words: 2
------------------------------------------------
```

The interface should immediately communicate:

1. What the tool does
2. Where to enter content
3. What output will appear
4. How to copy/listen/share

---

# 14. DEFAULT UX MUST BE SIMPLE

Do not show every advanced control by default.

Basic controls:

* Auto
* Swap
* Copy
* Play
* Share
* Clear

Advanced controls can appear under:

**Audio Settings**

or

**Advanced**

Do not make users configure WPM before translating text.

---

# 15. SWAP FUNCTION

Swap must:

* exchange input/output direction
* preserve usable content
* update the mode
* work without page reload

Example:

Text → Morse

becomes:

Morse → Text

The swap action must be instant.

---

# 16. COPY FUNCTION

Copy buttons must:

* use the Clipboard API where available
* provide visible feedback
* work on mobile
* gracefully handle unsupported browsers

Example feedback:

```text
Copied!
```

Do not use intrusive alerts.

---

# 17. CLEAR FUNCTION

Clear must reset the translator safely.

If the user has meaningful input, consider avoiding accidental data loss through unnecessary UI behavior.

Clear should:

* clear input
* clear output
* reset character statistics
* reset playback state

---

# 18. CHARACTER BREAKDOWN

Provide an optional character breakdown.

Example:

```text
H → ....
E → .
L → .-..
L → .-..
O → ---
```

Useful controls:

* Hear character
* Highlight character
* Show Morse
* Show plaintext

Playback should synchronize with the breakdown.

---

# 19. PLAYBACK

Audio playback is a major product feature.

Support:

* play
* pause
* stop
* replay

Audio must follow correct Morse timing.

Basic timing:

```text
Dot = 1 unit
Dash = 3 units
Gap inside character = 1 unit
Gap between characters = 3 units
Gap between words = 7 units
```

Do not hard-code arbitrary delays.

Create a reusable timing engine.

---

# 20. WPM

Support Words Per Minute.

The default WPM should be reasonable for general users.

Allow users to change it.

The UI should explain WPM briefly.

Example:

```text
Speed
18 WPM
```

Avoid excessive technical explanations in the main interface.

---

# 21. FARNSWORTH TIMING

Support Farnsworth timing in advanced audio settings.

Farnsworth timing should affect spacing between characters/words while preserving character element timing appropriately.

Do not implement a fake slider that merely slows the entire audio track.

Timing must be mathematically consistent.

---

# 22. AUDIO CONTROLS

Advanced audio controls may include:

* WPM
* Farnsworth WPM
* frequency
* volume
* waveform
* sound style

Possible waveforms:

* sine
* square
* triangle

Possible sound styles:

* tone
* telegraph/sounder-style effect

Use sensible defaults.

Do not expose unnecessary controls on mobile by default.

---

# 23. WAV EXPORT

Allow users to export Morse audio where technically feasible.

Requirements:

* valid WAV file
* correct sample rate
* correct duration
* correct Morse timing
* no unexpected clipping
* sensible filename

Example:

```text
morse-code-hello-world.wav
```

Do not require an account.

---

# 24. PLAYBACK HIGHLIGHTING

During playback:

* highlight the active Morse character
* optionally highlight dot/dash elements
* keep the active item visible on mobile
* stop cleanly at the end

Never create distracting animations.

Respect:

```css
prefers-reduced-motion
```

---

# 25. FLASH / LIGHT MODE

Where supported, allow Morse to be represented visually using flashing light.

Use browser APIs carefully.

Never assume the device has a flashlight API.

If unavailable:

* hide the feature
* or provide an appropriate fallback

Never request unnecessary permissions.

---

# 26. VIBRATION

Where supported, allow Morse playback through vibration.

Use:

* dot = short vibration
* dash = longer vibration
* gaps = pauses

Check browser support.

Do not break the main translator if vibration is unavailable.

---

# 27. MORSE KEYER

Provide a Morse keyer as an advanced feature.

Support:

* mouse
* keyboard
* touch

The user should be able to key:

```text
dit
dah
```

and generate Morse.

The UI should show:

```text
Morse:
.... . .-.. .-.. ---
```

and optionally:

```text
Text:
HELLO
```

Avoid excessive complexity in the initial version.

---

# 28. AUDIO DECODER

Audio decoding is an advanced feature.

Possible input sources:

* microphone
* uploaded audio
* WAV
* supported browser audio formats

Pipeline:

```text
Audio
↓
Signal detection
↓
Noise filtering
↓
Tone detection
↓
Timing analysis
↓
Dot / dash detection
↓
Character grouping
↓
Morse decoding
↓
Editable result
```

Do not claim perfect decoding.

Real-world audio contains:

* noise
* fading
* multiple signals
* inconsistent timing
* background speech
* interference

Provide confidence or uncertainty where appropriate.

---

# 29. MICROPHONE PERMISSIONS

Never request microphone permission on page load.

Only request permission after explicit user interaction.

Example:

```text
Start Audio Decoder
```

Then request permission.

Explain why the microphone is required.

Stop microphone access when no longer needed.

---

# 30. IMAGE MORSE DECODER

Image decoding should be modular.

Possible pipeline:

```text
Image
↓
Preprocessing
↓
Grayscale
↓
Contrast
↓
Threshold
↓
Region detection
↓
Dot / dash analysis
↓
Morse reconstruction
↓
Text decoding
```

Support:

* uploaded images
* screenshots
* camera input where appropriate

Advanced controls:

* crop
* rotate
* threshold
* invert
* contrast

Do not load heavy image-processing libraries on the homepage unless required.

Lazy-load image decoding functionality.

---

# 31. IMAGE DECODER UX

Show:

```text
Upload Morse Image
```

Then:

```text
Preview
Detected Morse
Decoded Text
```

Allow editing of detected Morse before final decoding.

Never pretend OCR-style detection is guaranteed to be correct.

---

# 32. LEARNING FEATURES

Learning mode should eventually support:

* alphabet
* audio
* character drills
* Koch method
* Farnsworth method
* flashcards
* speed tests
* practice sessions
* weak-character detection
* progress tracking

The first implementation should prioritize quality over feature count.

---

# 33. KOCH METHOD

If implemented, the Koch trainer should introduce characters progressively.

Do not dump the entire alphabet on a beginner.

Practice should emphasize hearing and recognizing characters rather than memorizing visual dot/dash patterns alone.

---

# 34. MORSE CODE ALPHABET PAGE

Canonical URL:

```text
/morse-code-alphabet/
```

Primary topic:

**Morse Code Alphabet**

Include:

* A-Z
* Morse representation
* pronunciation guidance where useful
* audio
* examples
* numbers link
* punctuation link
* learning guidance

Do NOT create:

```text
/morse-code-letter-a/
/morse-code-letter-b/
/morse-code-letter-c/
```

Individual letters are too thin and create unnecessary URL duplication.

---

# 35. MORSE CODE NUMBERS PAGE

Canonical URL:

```text
/morse-code-numbers/
```

Include:

* 0-9
* visual chart
* audio
* examples
* connection to alphabet
* translator CTA

---

# 36. MORSE → ENGLISH PAGE

Canonical URL:

```text
/morse-code-to-english/
```

This page should focus on:

* Morse to English
* Morse to text
* decoding Morse
* examples
* translator tool

Do not create separate pages for every variation of:

* Morse to text
* Morse to English
* Morse translator to English

Use one canonical page.

---

# 37. ENGLISH → MORSE PAGE

Canonical URL:

```text
/english-to-morse-code/
```

Focus on:

* English to Morse
* text to Morse
* Morse generator functionality
* examples
* translator

---

# 38. DECODER PAGE

Canonical URL:

```text
/morse-code-decoder/
```

Focus on:

* decoding
* deciphering
* Morse recognition
* Morse decoder functionality

The decoder page should not compete directly with the homepage for every translator query.

---

# 39. AUDIO TRANSLATOR PAGE

Canonical URL:

```text
/morse-code-audio-translator/
```

Focus on:

* Morse audio
* playback
* audio settings
* WPM
* Farnsworth
* audio decoding

---

# 40. LEARNING PAGE

Canonical URL:

```text
/learn-morse-code/
```

Focus on:

* how to learn Morse
* practice
* Koch
* Farnsworth
* listening
* speed improvement

---

# 41. HOW TO READ PAGE

Canonical URL:

```text
/how-to-read-morse-code/
```

Focus on:

* reading Morse
* recognizing patterns
* dots and dashes
* character spacing
* word spacing
* beginner guidance

This page is educational.

It should not simply duplicate the decoder page.

---

# 42. SYMBOLS PAGE

Canonical URL:

```text
/morse-code-symbols/
```

Include:

* punctuation
* question mark
* comma
* period
* slash
* parentheses
* quotation marks
* common symbols

Use a comprehensive table.

---

# 43. PHRASES PAGE

Canonical URL:

```text
/morse-code-phrases/
```

Include useful examples such as:

* Hello
* Thank you
* I love you
* Help
* Yes
* No
* Good morning
* Good night
* Mayday
* CQ
* SOS

Do not create a separate URL for every phrase unless there is a strong strategic reason.

---

# 44. SOS PAGE

Canonical URL:

```text
/sos-in-morse-code/
```

Explain:

```text
SOS
...
---
...
```

Cover:

* meaning
* pronunciation
* history/context
* how to transmit
* how to decode

Avoid myths.

Do not claim that SOS officially stands for a particular phrase unless properly qualified.

---

# 45. I LOVE YOU PAGE

Canonical URL:

```text
/i-love-you-in-morse-code/
```

Include:

* Morse representation
* copy button
* audio
* breakdown
* translator CTA

Keep the page useful rather than thin.

---

# 46. WHAT IS MORSE CODE PAGE

Canonical URL:

```text
/what-is-morse-code/
```

Cover:

* definition
* how it works
* dots
* dashes
* spacing
* International Morse Code
* common uses
* relationship to telegraphy
* modern uses

---

# 47. HISTORY PAGE

Canonical URL:

```text
/history-of-morse-code/
```

Cover:

* origins
* Samuel Morse
* Alfred Vail
* telegraph history
* evolution
* international standardization
* modern use

Use reliable historical sources.

Do not invent dates or quotations.

---

# 48. AMATEUR RADIO PAGE

Canonical URL:

```text
/morse-code-amateur-radio/
```

Cover:

* CW
* ham radio
* WPM
* Farnsworth
* keying
* prosigns
* common abbreviations
* listening practice

This is an advanced/specialist page.

---

# 49. INFORMATION ARCHITECTURE

Primary structure:

```text
Homepage
│
├── Translator
│
├── Alphabet
│
├── Numbers
│
├── Morse → English
│
├── English → Morse
│
├── Decoder
│
├── Audio Translator
│
├── Learn Morse
│
├── How to Read Morse
│
├── Symbols
│
├── Phrases
│
├── SOS
│
├── I Love You
│
├── What Is Morse Code
│
├── History
│
└── Amateur Radio
```

Keep navigation understandable.

Do not create hundreds of thin pages.

---

# 50. CANONICAL URL RULES

Canonical pages:

```text
/
 /morse-code-alphabet/
 /morse-code-numbers/
 /morse-code-to-english/
 /english-to-morse-code/
 /morse-code-decoder/
 /morse-code-audio-translator/
 /learn-morse-code/
 /how-to-read-morse-code/
 /morse-code-symbols/
 /morse-code-phrases/
 /sos-in-morse-code/
 /i-love-you-in-morse-code/
 /what-is-morse-code/
 /history-of-morse-code/
 /morse-code-amateur-radio/
```

Do not create unnecessary pages for:

* "online"
* "website"
* "free"
* "converter"
* "translator online"
* spelling variants
* minor keyword variants
* individual letters

Use canonicalization where appropriate.

---

# 51. HOMEPAGE SEO

Homepage primary keyword:

**Morse Code Translator**

Recommended title:

```text
Morse Code Translator - Convert Text to Morse Code
```

Potential meta description:

```text
Use our free Morse Code Translator to convert text to Morse code and Morse code to text. Hear, copy, share, and decode Morse code online.
```

Do not force exact-match keywords into every heading.

---

# 52. HOMEPAGE CONTENT STRUCTURE

Recommended:

```text
H1: Morse Code Translator

Short introduction

Translator Tool

How the Morse Code Translator Works

Text to Morse Code

Morse Code to Text

Morse Code Audio

Morse Code Alphabet

Common Morse Code Examples

How to Read Morse Code

Who Uses Morse Code?

FAQ

Related Morse Code Tools & Guides
```

The tool should appear prominently above the fold.

Do not place a huge wall of text above the tool.

---

# 53. SEO CONTENT PRINCIPLES

Every page must satisfy search intent.

Content should demonstrate:

* usefulness
* accuracy
* first-hand product understanding
* clear explanations
* unique information
* strong internal linking
* trustworthy references

Avoid generic AI filler.

Avoid paragraphs that say nothing.

Avoid repeating the same explanation across pages.

---

# 54. INFORMATION GAIN

Every page should provide something useful beyond basic keyword targeting.

Examples:

Translator page:

* real-time conversion
* audio
* character breakdown
* advanced timing

Alphabet page:

* visual mapping
* audio
* examples
* learning guidance

Decoder page:

* decoding workflow
* ambiguity handling
* examples

Learning page:

* practical training methods
* speed progression
* practice strategy

---

# 55. INTERNAL LINKING

Internal links must be intentional.

Homepage should link to:

* Alphabet
* Numbers
* Decoder
* English → Morse
* Morse → English
* Learn Morse
* Audio Translator
* Symbols
* Phrases

Alphabet should link to:

* Numbers
* Symbols
* Translator
* Learn Morse

Learning pages should link back to the translator.

Do not spam internal links.

Use descriptive anchor text.

---

# 56. SEO CANNIBALIZATION RULE

Do not allow multiple pages to compete for the same primary intent.

Example:

The homepage owns:

```text
Morse Code Translator
Morse translator
Morse code converter
Morse code translator online
```

Do not create separate pages targeting each phrase.

Similarly:

```text
Morse to English
Morse to text
Translate Morse code to English
```

should be consolidated where appropriate.

---

# 57. SCHEMA

Use structured data only where it accurately describes the page.

Potential schema:

* WebSite
* WebApplication
* SoftwareApplication where appropriate
* Article
* BreadcrumbList
* FAQPage where eligible and appropriate

Do not add fake ratings.

Do not add fake reviews.

Do not add fake organization information.

Schema content must match visible content.

---

# 58. FAQ

FAQs should answer real user questions.

Examples:

### What is Morse code?

### How do I translate Morse code to English?

### How do I convert English to Morse code?

### What does SOS mean in Morse code?

### What is Morse code used for?

### How fast can Morse code be transmitted?

### What is Farnsworth timing?

### Can I listen to Morse code?

### Can Morse code be decoded from audio?

Answers should be concise and accurate.

Do not create FAQ spam.

---

# 59. ACCESSIBILITY

Target WCAG-friendly UX.

Requirements:

* keyboard navigation
* visible focus states
* semantic HTML
* accessible labels
* sufficient contrast
* screen-reader-friendly controls
* accessible textarea labels
* no color-only communication
* reduced motion support
* logical heading hierarchy

Buttons must have meaningful accessible names.

Icons alone are not enough.

---

# 60. MOBILE-FIRST

The majority of users may arrive from mobile devices.

Design mobile-first.

Requirements:

* large touch targets
* readable typography
* sticky or easily accessible controls where appropriate
* no horizontal overflow
* responsive textareas
* simple audio controls
* responsive tables
* accessible bottom spacing

Do not make desktop the primary design target.

---

# 61. RESPONSIVE BREAKPOINTS

Do not design around arbitrary device names.

Design based on content requirements.

Test:

* small mobile
* large mobile
* tablet
* laptop
* large desktop

The translator must remain usable at all sizes.

---

# 62. PERFORMANCE

Target excellent Core Web Vitals.

Prioritize:

* low JavaScript
* fast initial render
* optimized fonts
* optimized images
* lazy-loaded advanced features
* minimal third-party scripts
* no unnecessary animations

Heavy modules should not load until required.

Examples:

Image decoder:

```text
load only when opened
```

Audio decoder:

```text
load only when opened
```

Learning engine:

```text
load only when needed
```

---

# 63. HOMEPAGE JAVASCRIPT BUDGET

The homepage translator should remain lightweight.

Do not load:

* image processing libraries
* microphone libraries
* large learning engines
* unnecessary analytics libraries

unless needed.

Keep the default path fast.

---

# 64. PRIVACY

Prefer local processing whenever technically possible.

For:

* basic translation
* audio generation
* basic image processing

prefer browser-side processing.

Never send user-entered Morse/text to a server unnecessarily.

If a feature requires server processing:

* clearly explain it
* document what is sent
* avoid storing content by default

Never claim "100% private" unless technically verified.

---

# 65. STORAGE

Do not store user translations by default.

If localStorage is used for preferences:

* store only necessary settings
* do not store sensitive user content
* provide predictable behavior

Examples of acceptable preferences:

```text
WPM
volume
frequency
theme preference
last selected mode
```

---

# 66. ANALYTICS

Analytics must not interfere with core functionality.

Do not capture user-entered Morse/text as analytics events.

Acceptable events:

```text
translator_used
audio_played
copy_clicked
share_clicked
decoder_opened
image_decoder_used
audio_decoder_used
```

Do not send actual message content.

---

# 67. ADS

If advertising is introduced:

* never place ads inside the translator controls
* never interrupt translation
* never place deceptive buttons
* never make ads look like tool controls
* avoid ads above the primary translator experience

The tool must remain the primary product.

---

# 68. ERROR HANDLING

Errors should be human-readable.

Bad:

```text
Error: DOMException 12
```

Better:

```text
We couldn't access your microphone. Please check your browser permissions and try again.
```

Do not expose internal stack traces to users.

Log technical errors appropriately in development.

---

# 69. UNSUPPORTED CHARACTERS

When a character cannot be converted:

Example:

```text
Unsupported character: €
```

Do not silently replace it.

Provide a clear explanation.

Where appropriate, preserve the original text.

---

# 70. MORSE PARSING RULES

Support conventional separators.

Example:

```text
.... . .-.. .-.. ---
```

Characters separated by spaces.

Words separated by:

```text
/
```

or an equivalent documented representation.

The parser should tolerate reasonable whitespace.

Do not accept arbitrary punctuation as Morse separators without clear rules.

---

# 71. NORMALIZATION

Before decoding:

* trim unnecessary whitespace
* normalize repeated whitespace
* normalize supported separators
* preserve meaningful word boundaries

Do not modify Morse symbols incorrectly.

Allowed Morse symbols:

```text
.
-
```

and recognized separators.

---

# 72. VALIDATION

Validate Morse sequences before decoding.

Example:

```text
.-.-.- 
```

may represent punctuation if supported.

Unknown sequences should return a clear indication.

Do not randomly map unknown sequences to letters.

---

# 73. TESTING REQUIREMENTS

Every core Morse function must have automated tests.

Minimum unit tests:

```text
A → .-
B → -...
C → -.-.
...
Z → --..
```

Numbers:

```text
0 → -----
1 → .----
...
9 → ----.
```

Test:

* encoding
* decoding
* spaces
* words
* punctuation
* lowercase input
* unsupported characters
* empty input
* malformed Morse
* round-trip translation

---

# 74. ROUND-TRIP TESTING

For supported strings:

```text
text → morse → text
```

should return the expected normalized text.

Example:

```text
HELLO WORLD
```

→ Morse

→

```text
HELLO WORLD
```

Use automated regression tests.

---

# 75. AUDIO TESTING

Audio timing should be tested independently from the UI.

Test:

* dot duration
* dash duration
* character gap
* word gap
* WPM calculations
* Farnsworth spacing

Avoid relying only on manual listening.

---

# 76. E2E TESTS

Critical user journeys should have E2E tests.

Minimum:

### Test 1

Open homepage.

### Test 2

Enter:

```text
HELLO
```

Verify Morse output.

### Test 3

Switch direction.

### Test 4

Paste Morse.

Verify text output.

### Test 5

Copy output.

### Test 6

Play audio.

### Test 7

Clear.

### Test 8

Mobile viewport.

### Test 9

Keyboard navigation.

---

# 77. SEO TESTING

Verify:

* title
* description
* canonical
* robots
* sitemap
* Open Graph
* Twitter/X metadata
* structured data
* heading hierarchy
* internal links
* no accidental noindex

Every important page should have a unique title and meta description.

---

# 78. INDEXATION

Important pages must be indexable.

Avoid accidental:

```text
noindex
```

on canonical content.

Do not index meaningless parameter URLs.

Avoid duplicate query-string pages.

---

# 79. SITEMAP

Include canonical indexable pages.

Exclude:

* temporary URLs
* internal tools
* test pages
* duplicate parameters
* development routes

Update sitemap when new canonical pages are created.

---

# 80. ROBOTS

Do not block search engines from accessing:

* CSS
* necessary JavaScript
* important page resources

Do not accidentally block the entire website.

---

# 81. OPEN GRAPH

Every major page should have appropriate Open Graph metadata.

Images should be:

* relevant
* readable
* properly sized
* branded where appropriate

Do not generate generic stock-style graphics just for SEO.

---

# 82. CONTENT STYLE

Write in clear US English.

Target approximately 8th-grade readability.

Prefer:

* short sentences
* direct answers
* clear headings
* tables where useful
* examples
* concise explanations

Avoid:

* corporate fluff
* unnecessary jargon
* repetitive introductions
* keyword stuffing
* fake authority
* unsupported claims

---

# 83. AI CONTENT RULES

AI-generated content must be edited and fact-checked.

Never publish:

* fabricated statistics
* invented historical facts
* fake quotations
* fake user experiences
* fake reviews
* fake expert statements

AI should assist production, not replace verification.

---

# 84. SOURCE QUALITY

For technical Morse information, prioritize authoritative sources.

Useful source categories:

* ITU
* ARRL
* established amateur radio organizations
* reputable historical references
* official standards
* reliable technical documentation

Do not cite random SEO websites for technical standards when an authoritative source exists.

---

# 85. UI DESIGN SYSTEM

Design should feel:

* modern
* clean
* trustworthy
* technical
* friendly
* focused

Avoid:

* excessive gradients
* excessive glassmorphism
* distracting animations
* huge decorative illustrations
* unnecessary cards everywhere

The translator should visually dominate the homepage.

---

# 86. COLOR

Use a restrained color system.

Define semantic variables:

```css
--background
--foreground
--muted
--border
--primary
--primary-foreground
--success
--warning
--error
```

Do not hard-code colors repeatedly.

---

# 87. TYPOGRAPHY

Use highly readable typography.

Prioritize:

* clear hierarchy
* comfortable line height
* mobile readability
* distinguishable Morse characters

Morse code should use a readable monospace font when appropriate.

Example:

```css
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

---

# 88. ANIMATION

Animations should support understanding.

Good:

* copy feedback
* playback indicator
* subtle state changes

Avoid:

* constant bouncing
* excessive hover effects
* distracting page transitions
* animated backgrounds

Respect reduced-motion settings.

---

# 89. EMPTY STATES

The translator should have a useful empty state.

Example:

```text
Type text or paste Morse code here
```

Optional examples:

```text
SOS
HELLO WORLD
I LOVE YOU
```

Clicking an example should populate the tool.

---

# 90. EXAMPLE BUTTONS

Useful default examples:

```text
SOS
HELLO WORLD
I LOVE YOU
THANK YOU
MAYDAY
CQ
```

Examples should work instantly.

Do not require page reload.

---

# 91. SHARE FUNCTION

Share should use Web Share API where available.

Fallback:

* copy shareable text
* provide a useful message

Do not expose private content to external services automatically.

---

# 92. URL SHARING

If shareable links are implemented:

* encode content safely
* avoid exposing sensitive data unintentionally
* use URL-safe encoding
* prevent extremely large URLs
* document that shared URLs contain the encoded message

Do not store private messages on the server merely to support sharing unless explicitly designed.

---

# 93. SECURITY

Never use unsanitized user input in:

* HTML
* dangerouslySetInnerHTML
* database queries
* shell commands
* external requests

Avoid:

```tsx
dangerouslySetInnerHTML
```

unless there is a strong reason and content is sanitized.

---

# 94. DEPENDENCY RULES

Before adding a dependency ask:

1. Can native browser APIs solve this?
2. Is the dependency actively maintained?
3. Does it increase bundle size significantly?
4. Is it necessary for the product?
5. Does it introduce privacy/security concerns?

Do not add packages simply for convenience.

---

# 95. BUILD QUALITY

Before considering a feature complete, run:

```bash
npm run lint
npm run typecheck
npm run build
```

If available, also run:

```bash
npm test
npm run test:e2e
```

Do not mark a feature complete if the build is broken.

---

# 96. GIT PRACTICES

Use focused commits.

Examples:

```text
feat: add bidirectional Morse translator
feat: add Morse audio playback
feat: add Morse alphabet page
fix: correct word gap timing
fix: handle unsupported Morse characters
perf: lazy load image decoder
seo: improve Morse translator metadata
```

Do not mix unrelated changes in one commit.

---

# 97. DEVELOPMENT WORKFLOW

For every major task:

## Step 1 — Understand

Inspect existing architecture before changing code.

## Step 2 — Plan

Identify:

* affected files
* dependencies
* risks
* SEO implications
* accessibility implications

## Step 3 — Implement

Make the smallest clean change that solves the problem.

## Step 4 — Test

Run relevant tests.

## Step 5 — Review

Check:

* mobile
* accessibility
* performance
* SEO
* errors
* edge cases

## Step 6 — Build

Run the production build.

---

# 98. DO NOT REWRITE WORKING SYSTEMS

If an existing component works correctly:

Do not rewrite it simply because another architecture looks cleaner.

Prefer incremental improvements.

Before replacing a system:

* understand why it exists
* identify actual problems
* evaluate migration risk

---

# 99. DO NOT BREAK SEO

When modifying pages:

Never accidentally remove:

* H1
* title
* meta description
* canonical
* internal links
* structured data
* content
* indexability

If URLs change, configure proper redirects.

Never change canonical URLs casually.

---

# 100. DO NOT CREATE THIN PAGES

A page must exist because it satisfies a meaningful search intent.

Do not create pages such as:

```text
/morse-code-online/
/morse-code-translator-online/
/free-morse-code-translator/
/morse-code-converter-online/
```

unless there is a genuine product/content reason.

Consolidate overlapping intent.

---

# 101. NO KEYWORD STUFFING

Do not repeatedly use:

```text
Morse Code Translator
```

in every heading.

Use natural semantic language:

* translate Morse
* decode Morse
* convert text to Morse
* convert Morse to text
* Morse code tool
* Morse decoder

Search engines understand semantic relationships.

---

# 102. NO FAKE EEAT

Do not create fake:

* authors
* experts
* credentials
* reviews
* testimonials
* statistics
* company claims

EEAT must come from genuine quality and accurate information.

---

# 103. AI OVERVIEW / LLM OPTIMIZATION

Content should be easy for search engines and AI systems to understand.

Use:

* direct answers
* clear definitions
* tables
* structured sections
* explicit relationships
* concise explanations
* trustworthy references

Example:

```text
What is Morse code?

Morse code is a system that represents letters, numbers, and punctuation using combinations of dots and dashes.
```

Answer the question immediately.

Then expand.

---

# 104. FEATURE ROADMAP

## P0 — Core

Must have:

* Text → Morse
* Morse → Text
* Auto detection
* Real-time translation
* Swap
* Copy
* Clear
* Examples
* Character count
* Word count
* Alphabet
* Numbers
* Punctuation
* Audio playback
* WPM
* Farnsworth
* Frequency
* Volume
* Character breakdown
* Playback highlighting
* Share
* WAV export
* Mobile-first UI

---

## P1 — Enhanced

Add:

* flash
* vibration
* prosigns
* dit/dah pronunciation
* transmission time
* statistics
* Morse keyer
* advanced timing
* random examples
* PWA/offline support

---

## P2 — Advanced Decoding

Add:

* image Morse decoder
* screenshot support
* crop
* rotate
* threshold
* invert
* detection overlay
* audio file decoder
* microphone decoder
* automatic WPM estimation
* frequency detection
* confidence estimation
* editable detected Morse

---

## P3 — Learning Platform

Add:

* Koch trainer
* Farnsworth trainer
* flashcards
* character drills
* word drills
* speed test
* progress tracking
* weak-character detection
* practice history
* optional accounts

---

# 105. FEATURE PRIORITY RULE

Do not work on P2/P3 features while P0 functionality is unstable.

Correct order:

```text
Core Translator
↓
Audio
↓
Advanced Translator Controls
↓
Decoder
↓
Learning
```

Quality beats feature count.

---

# 106. HOMEPAGE PRODUCT FLOW

The ideal user journey:

```text
User arrives
↓
Immediately sees Morse Code Translator
↓
Enters text/Morse
↓
Automatic translation
↓
Copies result
↓
Optionally listens
↓
Optionally inspects characters
↓
Optionally exports/shares
↓
Discovers learning resources
```

Do not force users through a tutorial.

---

# 107. NAVIGATION

Primary navigation should remain short.

Possible:

```text
Translator
Alphabet
Decoder
Learn
Guides
```

Advanced resources can live inside relevant pages.

Avoid huge mega menus.

---

# 108. FOOTER

Footer may include:

```text
Morse Code Tools
Morse Code Alphabet
Morse Code Numbers
Morse Code Decoder
English to Morse
Morse to English
Learn Morse Code

Resources
What Is Morse Code?
History of Morse Code
How to Read Morse Code
Morse Code Symbols

About
Privacy
Terms
Contact
```

Keep it useful.

---

# 109. 404 PAGE

Create a helpful 404 page.

Include:

```text
Page not found.

Try the Morse Code Translator.
```

Add links to:

* Translator
* Alphabet
* Decoder
* Learn Morse

---

# 110. LOADING STATES

Loading states must be subtle.

Do not show unnecessary spinners for operations that complete instantly.

For heavier operations:

```text
Processing image...
Listening for Morse signal...
Generating audio...
```

Give users useful status information.

---

# 111. MOBILE AUDIO UX

On mobile:

* keep Play easily accessible
* avoid tiny sliders
* use touch-friendly controls
* make advanced settings collapsible
* avoid horizontal scrolling

Audio controls should remain understandable without technical knowledge.

---

# 112. DESKTOP UX

On desktop, take advantage of available width.

Possible layout:

```text
Input                Output
----------------    ----------------
textarea             textarea

controls centered below
```

But preserve a single clear visual flow.

---

# 113. ACCESSIBLE MORSE REPRESENTATION

Never rely only on:

* sound
* flashing
* color

Provide text equivalents.

For example:

```text
Audio playing:
HELLO
.... . .-.. .-.. ---
```

This allows users with different accessibility needs to use the same functionality.

---

# 114. REDUCED MOTION

If:

```css
prefers-reduced-motion: reduce
```

is enabled:

* reduce animations
* disable unnecessary flashing effects
* avoid rapid visual transitions

Morse flash functionality must be controllable independently.

---

# 115. FLASH SAFETY

Do not automatically activate flashing.

The user must explicitly enable visual flashing.

Provide an understandable warning or control where appropriate.

Never make flashing the default playback method.

---

# 116. AUDIO SAFETY

Do not autoplay audio.

Audio should begin after user interaction.

Provide volume control.

Remember browser autoplay restrictions.

---

# 117. BROWSER COMPATIBILITY

Core text translation must work without advanced browser APIs.

Advanced features should degrade gracefully.

Core:

```text
translation
copy
basic UI
```

must remain broadly compatible.

Advanced:

```text
microphone
vibration
flash
Web Share
```

may require feature detection.

---

# 118. FEATURE DETECTION

Use capability detection.

Example:

```ts
if ("vibrate" in navigator) {
  // enable vibration
}
```

Never assume an API exists.

---

# 119. OFFLINE SUPPORT

If PWA functionality is implemented:

Core translator should work offline.

Offline functionality should not compromise:

* caching strategy
* updates
* SEO
* security

Do not add a PWA solely for marketing.

---

# 120. FINAL QUALITY STANDARD

The website should feel like the best dedicated Morse Code tool available online.

A successful implementation should be:

### Fast

The translator responds immediately.

### Accurate

Morse mappings and timing are correct.

### Simple

A beginner can use it without instructions.

### Powerful

Advanced users can access WPM, Farnsworth, audio, decoding and keying tools.

### Accessible

Keyboard, screen readers, mobile users and users with different sensory needs can use it.

### Private

Basic translation should preferably happen locally.

### Search-friendly

Pages have clear intent, structure, metadata and internal links.

### Maintainable

The codebase is modular, typed and tested.

---

# 121. DEFINITION OF DONE

A feature is NOT complete until:

* [ ] It works on mobile
* [ ] It works on desktop
* [ ] TypeScript passes
* [ ] Lint passes
* [ ] Production build passes
* [ ] Core tests pass
* [ ] Accessibility has been considered
* [ ] Error states exist
* [ ] Loading states exist where necessary
* [ ] SEO is not damaged
* [ ] No unnecessary dependencies were added
* [ ] No console errors remain
* [ ] No obvious performance regression exists
* [ ] Existing functionality still works

---

# 122. AGENT BEHAVIOR RULES

AI coding agents working on this project must:

1. Inspect existing code before modifying it.
2. Reuse existing components where possible.
3. Avoid unnecessary rewrites.
4. Preserve working SEO.
5. Preserve existing URLs.
6. Keep the homepage focused on the translator.
7. Prioritize mobile UX.
8. Prefer local processing.
9. Validate Morse mappings.
10. Write tests for core logic.
11. Run lint/typecheck/build after major changes.
12. Never invent technical or historical facts.
13. Never add fake reviews or testimonials.
14. Never add unnecessary keyword-stuffed content.
15. Never create thin SEO pages just to target keyword variants.
16. Never expose user-entered text through analytics.
17. Never request browser permissions without user action.
18. Never autoplay audio.
19. Never make flashing effects automatic.
20. Never sacrifice translator usability for SEO.

---

# 123. WHEN UNSURE

When a technical or product decision is unclear:

Prefer the option that is:

```text
More accurate
↓
More useful
↓
Simpler
↓
Faster
↓
More accessible
↓
More maintainable
```

Do not optimize for feature count.

Do not optimize for keyword density.

Do not optimize for visual complexity.

Optimize for the user's actual job:

> "I need to translate, understand, hear, decode, or learn Morse code quickly and accurately."

---

# 124. PROJECT NORTH STAR

The project should ultimately become:

> **The fastest, most accurate, easiest-to-use Morse Code Translator and learning toolkit on the web.**

The homepage wins the user with simplicity.

The advanced tools win serious users with capability.

The supporting content wins search traffic with genuinely useful information.

The entire website should work together as one coherent Morse Code knowledge and tool ecosystem.
