// js/modules/reflectionGenesis.js
// Genesis phase — the fool's reflection

export function initGenesis() {
  const section = document.querySelector('#genesis');
  if (!section) return;

  const slot = section.querySelector('#mirror-slot') || section;

  const mirror = document.createElement('div');
  mirror.className = 'mirror';
  mirror.innerHTML = `
    <div class="mirror-inner">
      <p class="mirror-text">sir.. you are looking at a square reflection of a fool's portfolio.. *gam*</p>
    </div>
  `;
  slot.appendChild(mirror);

  // interactive tilt + hue shift
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mirror.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    mirror.style.filter = `hue-rotate(${x * 90 + y * 90}deg)`;
  });

  section.addEventListener('mouseleave', () => {
    mirror.style.transform = 'rotateY(0deg) rotateX(0deg)';
    mirror.style.filter = 'hue-rotate(0deg)';
  });

  // subtle color shimmer
  let hue = 0;
  setInterval(() => {
    hue = (hue + 0.5) % 360;
    mirror.style.background = `linear-gradient(135deg,
      hsl(${hue},80%,60%),
      hsl(${(hue + 60) % 360},80%,60%),
      hsl(${(hue + 120) % 360},80%,60%)
    )`;
  }, 60);
}
