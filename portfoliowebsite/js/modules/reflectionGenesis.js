//===================gam================================//
//reflectionGenesis.js- Genesis phase the fools reflection//
//======================================================//

export function initGenesis() {
    const section=document.querySelector('#genesis');
    if (!section) return;
    //create mirror container
    const mirror = document.createElement('div');
    mirror.className='mirror';
    mirror.innerHTML= `
        <div class="mirror-inner">
            <p class="mirror-text">sir.. you are looking at a square reflection of a fools portfolio..*gam*</p>
        </div>    
    `;
    section.appendChild(mirror);

    //movementResponse
    section.addEventListener('mousemove', e=> {
        const rect = section.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY -rect.top) / rect.height - 0.5;
        mirror.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
        mirror.style.filter = `hue-rotate(${$x * 90 + 7 * 90}deg)`;
    });

    section.addEventListener('mouseleave',() => {
        mirror.style.transform = 'rotateY(0deg) rotateX(deg)';
        mirror.style.filter = 'hue-rotate(0deg)';
    });

    //shimmer subtle loop

    let hue = 0;
    setInterval(() =>{
        hue = (hue + 0.5) % 360;
        mirror.style.background = `linear-gradient(135deg, 
        hsl(${hue}, 80%,60%),
        hsl(${(hue +60) % 360},80%, 60%),
        hsl(${(hue + 120) % 360}, 80%, 60%)
        )`;
    }, 60);

}
