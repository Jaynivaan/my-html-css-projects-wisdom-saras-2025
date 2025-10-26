// reflectionChurn.js — robust "Look Beyond" ritual (summary click based)
export function initChurn() {
  console.log("reflectionChurn loaded");

  const section = document.querySelector('#churning');
  if (!section) return console.warn("❌ #churning not found");

  // Find Look Beyond block (inside #churning; if not, we’ll move it in)
  let lookBeyond = section.querySelector('details.skeleton') || document.getElementById('look-beyond');
  if (!lookBeyond) return console.warn("❌ LookBeyond <details> not found");

  if (!section.contains(lookBeyond)) {
    console.log("ℹ️ Moving LookBeyond inside #churning for wiring");
    section.querySelector('.container')?.appendChild(lookBeyond);
  }

  // Summary click (mobile-safe) — don’t rely on <details> toggle
  const summary = lookBeyond.querySelector('summary');
  if (!summary) return console.warn("❌ LookBeyond summary not found");

  // Build overlay once
  const overlay = buildOverlay();
  const codeEl  = overlay.querySelector('code');
  const win     = overlay.querySelector('.lb-window');
  const close   = overlay.querySelector('.lb-close');

  // Style the summary so it feels like a button
  summary.style.cursor = 'pointer';

  summary.addEventListener('click', (e) => {
    e.preventDefault();              // stop the default <details> opening
    lookBeyond.open = false;         // ensure it stays closed
    const src = (lookBeyond.querySelector('pre code')?.textContent || '').trim()
               || '<!-- awareness has no source, yet all code points to it -->';
    flickerThenDark(() => {
      // Clear & type with chaos, then Prism highlight + neon glow
      codeEl.textContent = '';
      openOverlay();
      typeWithMistakes(codeEl, src, () => {
        try { window.Prism?.highlightElement(codeEl); } catch {}
        win.classList.add('glow');
      }, 45);
    });
  });

  close.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });

  // ---------- helpers ----------
  function buildOverlay() {
    // inject minimal styles once
    if (!document.getElementById('lb-styles')) {
      const s = document.createElement('style');
      s.id = 'lb-styles';
      s.textContent = `
        .lb-overlay{position:fixed;inset:0;background:#000;display:none;align-items:center;justify-content:center;z-index:9999}
        .lb-window{background:rgba(10,10,15,.96);border:1px solid #0ff;border-radius:12px;padding:18px 18px 12px;width:min(92vw,900px);max-height:85vh;overflow:auto;color:#0ff;box-shadow:0 0 25px rgba(0,255,255,.35);font-family:monospace}
        .lb-window.glow{animation:lb-glow 2s ease-in-out infinite alternate}
        @keyframes lb-glow{from{box-shadow:0 0 18px #0ff,0 0 40px rgba(0,255,255,.25);color:#0ff}to{box-shadow:0 0 32px #0ff,0 0 110px rgba(0,255,255,.6);color:#fff}}
        .lb-close{position:absolute;top:10px;right:14px;border:none;background:transparent;color:#0ff;font-size:1.35rem;cursor:pointer}
        .lb-code pre{margin:0}
        .lb-code code{display:block;white-space:pre-wrap}
        .lb-code code.typing{position:relative}
        .lb-code code.typing::after{content:"";position:absolute;width:1ch;height:1em;border-right:2px solid currentColor;right:-2px;animation:lb-caret .9s steps(1,end) infinite}
        @keyframes lb-caret{50%{opacity:.25}}
        /* quick flicker keyframes */
        @keyframes lb-flick{0%,20%,40%,60%,80%,100%{opacity:1}10%,30%,50%,70%,90%{opacity:0}}
      `;
      document.head.appendChild(s);
    }

    const ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.innerHTML = `
      <div class="lb-window" role="dialog" aria-modal="true" aria-label="Look Beyond">
        <button class="lb-close" aria-label="Close overlay">✕</button>
        <div class="lb-code"><pre><code class="language-html"></code></pre></div>
      </div>
    `;
    document.body.appendChild(ov);
    return ov;
  }

  function openOverlay(){
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay(){
    overlay.querySelector('.lb-window').classList.remove('glow');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    const c = overlay.querySelector('code');
    c.classList.remove('typing');
    c.textContent = '';
  }

  function flickerThenDark(next){
    // full-screen flicker element
    const f = document.createElement('div');
    f.style.cssText = `
      position:fixed;inset:0;background:#000;z-index:9998;opacity:1;animation:lb-flick .6s steps(4,start)
    `;
    document.body.appendChild(f);
    setTimeout(()=>{ f.remove(); next?.(); }, 620);
  }

  // Human-paced typewriter with mistakes, backspaces, punctuation pauses
function typeWithMistakes(el, text, done, wpm = 45) {
  // WPM -> ms/char (WPM uses 5 chars per "word")
  const cps = (wpm * 5) / 60;          // chars per second
  const base = 1000 / cps;             // ms per char baseline

  el.classList.add('typing');           // keeps the blinking caret visible
  el.textContent = '';

  let i = 0;
  let mistakes = 0;

  function randomLetter() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  function step() {
    const ch = text[i] ?? '';

    // --- natural timing ---
    let delay = base * (0.85 + Math.random() * 0.4); // slight jitter
    if (',.;:!?'.includes(ch)) delay *= 2.2;         // pause at punctuation
    if (ch === '\n')            delay *= 1.6;        // pause at new lines
    if (ch === ' ')             delay *= 1.15;       // tiny pause at spaces

    // --- mistakes & corrections ---
    if (Math.random() < 0.05 && i > 4 && mistakes < 2) {
      // insert a wrong letter
      el.textContent += randomLetter();
      mistakes++;
      delay *= 0.6; // quicker right after a slip
    } else if (mistakes && Math.random() < 0.45) {
      // backspace a mistake
      el.textContent = el.textContent.slice(0, -1);
      mistakes--;
      delay *= 0.5;
    } else if (i < text.length) {
      // type next real character
      el.textContent += ch;
      i++;
    }

    // --- done? ---
    if (i >= text.length && !mistakes) {
      el.classList.remove('typing');   // caret stops after finishing
      done?.();
      return;
    }

    setTimeout(step, delay);
  }

  step();
}

}
