// reflectionStillness.js — ultra-min test so we SEE it work
export function initStillness() {
  console.log("Stillness: init");                             // ✅ should log once

  const section = document.querySelector("#stillness");
  if (!section) { console.warn("Stillness: #stillness not found"); return; }

  // Make a visible mount box
  const slot = section.querySelector("#stillness-slot") || section;
  const box = document.createElement("div");
  box.style.cssText = `
    position:relative; margin:0 auto; max-width:900px;
    min-height:260px; border-radius:14px; overflow:hidden;
    background:#101622; border:1px solid rgba(255,255,255,.08);
    box-shadow:0 0 24px rgba(0,245,255,.35);
  `;
  slot.appendChild(box);

  // Add a canvas and a mantra so we can SEE movement
  const cv = document.createElement("canvas");
  cv.width = box.clientWidth * (window.devicePixelRatio||1);
  cv.height = 260 * (window.devicePixelRatio||1);
  cv.style.width = "100%";
  cv.style.height = "260px";
  box.appendChild(cv);

  const ctx = cv.getContext("2d");
  if (!ctx) { box.innerHTML = "<p class='p-3'>Canvas unavailable.</p>"; return; }

  // Simple floating dots — visible immediately
  const dots = Array.from({length: 60}, () => ({
    x: Math.random()*cv.width,
    y: Math.random()*cv.height,
    vx: (Math.random()-0.5)*0.6,
    vy: (Math.random()-0.5)*0.6,
    r: 2 + Math.random()*3,
    a: 0.4 + Math.random()*0.5
  }));

  let slow = 1;
  box.addEventListener("pointerenter", ()=> slow = 0.3);
  box.addEventListener("pointerleave", ()=> slow = 1);

  function tick(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.save();
    ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1);

    for (const d of dots){
      d.x += d.vx*slow; d.y += d.vy*slow;
      if (d.x<0) d.x=cv.width; if (d.x>cv.width) d.x=0;
      if (d.y<0) d.y=cv.height; if (d.y>cv.height) d.y=0;

      ctx.globalAlpha = d.a;
      ctx.fillStyle = "rgba(0,245,255,0.9)";
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r*(1/(window.devicePixelRatio||1)), 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(tick);
  }
  tick();

  // Silence veil (white fade) so you feel something when pressing the button
  let veil = document.querySelector(".silence-veil");
  if (!veil){
    veil = document.createElement("div");
    veil.className = "silence-veil";
    veil.style.cssText = "position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .6s;z-index:10000;";
    document.body.appendChild(veil);
  }
  const btn = section.querySelector("#btn-silence");
  if (btn){
    btn.addEventListener("click", ()=>{
      slow = 0.15; veil.style.opacity = "1";
      setTimeout(()=>{ veil.style.opacity = "0"; slow = 1; }, 1800);
    });
  }

  console.log("Stillness: mounted");                           // ✅ should log after render
}
