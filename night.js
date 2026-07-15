(function(){
  const scene = document.getElementById('scene');

  /* ---------------- EMBEDDED IMAGE ASSETS (from user's reference photos) ---------------- */
  
  
  

  document.getElementById('boat-img').src = 'assets/ship.png';
  document.getElementById('boat-reflection-img').src = 'assets/ship.png';

  /* ---------------- CLOUDS (drifting left -> right, like the reference photos) ---------------- */
  const cloudLayers = [
    {w:520, top:'5%',   duration:150, delay:-10,  opacity:.7,  blur:'0px',   z:2},
    {w:380, top:'14%',  duration:125, delay:-55,  opacity:.6,  blur:'0.4px', z:2},
    {w:640, top:'24%',  duration:175, delay:-90,  opacity:.78, blur:'0px',   z:2},
    {w:300, top:'3%',   duration:105, delay:-30,  opacity:.5,  blur:'0.5px', z:0},
    {w:460, top:'29%',  duration:140, delay:-120, opacity:.68, blur:'0px',   z:2},
    {w:340, top:'19%',  duration:132, delay:-8,   opacity:.58, blur:'0.4px', z:2},
    {w:560, top:'9%',   duration:160, delay:-140, opacity:.72, blur:'0px',   z:2},
    {w:260, top:'36%',  duration:98,  delay:-60,  opacity:.4,  blur:'0.6px', z:0},
  ];
  cloudLayers.forEach(c=>{
    const wrap = document.createElement('div');
    wrap.className = 'cloud-fluffy';
    wrap.style.setProperty('--cloud-w', c.w+'px');
    wrap.style.top = c.top;
    wrap.style.left = '0';
    wrap.style.opacity = c.opacity;
    wrap.style.filter = c.blur !== '0px' ? 'blur('+c.blur+')' : '';
    wrap.style.zIndex = c.z;
    wrap.style.animation = 'cloudDrift '+c.duration+'s linear infinite';
    wrap.style.animationDelay = c.delay+'s';
    const img = document.createElement('img');
    img.src = 'assets/clouds.png';
    img.alt = '';
    wrap.appendChild(img);
    scene.appendChild(wrap);
  });

  /* ---------------- MOON REFLECTION BANDS (wave-broken shimmer) ---------------- */
  const reflectionEl = document.getElementById('reflection');
  const reflBands = [
    {top:4,  w:34, h:10, dur:3.2, delay:0,    blur:4},
    {top:12, w:46, h:9,  dur:3.8, delay:-0.6, blur:5},
    {top:20, w:30, h:8,  dur:3.1, delay:-1.4, blur:4},
    {top:27, w:54, h:10, dur:4.2, delay:-0.2, blur:6},
    {top:36, w:26, h:7,  dur:2.9, delay:-2.1, blur:3.5},
    {top:44, w:58, h:11, dur:4.6, delay:-1.7, blur:6.5},
    {top:53, w:32, h:8,  dur:3.4, delay:-0.9, blur:4},
    {top:62, w:66, h:12, dur:5.0, delay:-2.6, blur:7},
    {top:71, w:38, h:9,  dur:3.6, delay:-1.1, blur:5},
    {top:80, w:74, h:13, dur:5.4, delay:-3.0, blur:7.5},
    {top:90, w:44, h:10, dur:4.0, delay:-1.9, blur:5.5},
  ];
  reflBands.forEach(b=>{
    const band = document.createElement('div');
    band.className = 'refl-band';
    band.style.top = b.top + '%';
    band.style.width = b.w + '%';
    band.style.height = b.h + 'px';
    band.style.filter = 'blur(' + b.blur + 'px)';
    band.style.animationDuration = b.dur + 's';
    band.style.animationDelay = b.delay + 's';
    reflectionEl.appendChild(band);
  });

  /* ---------------- MESSAGES ---------------- */
  const messages = [
    "Jangan terlalu keras pada dirimu sendiri.",
    "Tidak semua hal harus selesai hari ini.",
    "Beristirahat bukan berarti menyerah.",
    "Semoga tahun ini membawa lebih banyak ketenangan daripada kecemasan.",
    "Kamu jauh lebih hebat daripada yang kamu pikirkan.",
    "Terima kasih karena selalu berusaha.",
    "Semoga semua doa yang belum sempat terucap menemukan jalannya."
  ];

  // positions as % of viewport, kept clear of moon (center top) and envelope area
  const msgPositions = [
    {x:12, y:20},{x:24, y:44},{x:8, y:60},
    {x:82, y:18},{x:90, y:38},{x:76, y:58},
    {x:50, y:66}
  ];
  const decoPositions = [
    {x:5,y:8},{x:18,y:10},{x:30,y:6},{x:44,y:14},{x:60,y:9},
    {x:70,y:7},{x:85,y:12},{x:95,y:22},{x:60,y:24},{x:40,y:30},
    {x:15,y:32},{x:88,y:50},{x:6,y:46}
  ];

  const starLayer = scene;
  const collected = new Set();

  function makeStar({x,y,size,glow,cls}){
    const el = document.createElement('div');
    el.className = 'star ' + cls;
    const s = size || (Math.random()*1.6+1.4);
    el.style.width = s+'px';
    el.style.height = s+'px';
    el.style.left = x+'%';
    el.style.top = y+'%';
    el.style.animationDelay = (Math.random()*4)+'s';
    scene.appendChild(el);
    return el;
  }

  decoPositions.forEach(p=>makeStar({x:p.x,y:p.y,cls:'deco'}));

  const msgStars = messages.map((msg,i)=>{
    const p = msgPositions[i];
    const el = makeStar({x:p.x,y:p.y,size:3.4,cls:'msg'});
    el.setAttribute('tabindex','0');
    el.setAttribute('role','button');
    el.setAttribute('aria-label','Bintang berisi pesan');
    el.addEventListener('click', ()=>openMessage(el, msg, i));
    el.addEventListener('keypress', e=>{ if(e.key==='Enter') openMessage(el, msg, i); });
    return el;
  });

  // final easter-egg star
  const finalStar = makeStar({x:50, y:12, size:6, cls:'final'});
  finalStar.setAttribute('aria-label','Bintang terakhir');

  /* ---------------- OPENING SEQUENCE ---------------- */
  const op1 = document.getElementById('op1');
  const op2 = document.getElementById('op2');
  const hint = document.getElementById('hint');
  op2.style.top = op1.offsetTop + 'px';

  setTimeout(()=>{ op1.style.transition='opacity 2.2s ease'; op1.style.opacity=1; }, 600);
  setTimeout(()=>{ op1.style.opacity=0; }, 4200);
  setTimeout(()=>{ op2.style.transition='opacity 2.2s ease'; op2.style.opacity=1; }, 5200);
  setTimeout(()=>{ op2.style.opacity=0; }, 8600);
  setTimeout(()=>{ hint.style.opacity=1; }, 9200);

  /* ---------------- POPUP ---------------- */
  const popupLayer = document.getElementById('popup-layer');
  const popupText = document.getElementById('popup-text');
  const popupClose = document.getElementById('popup-close');

  function openMessage(starEl, text, idx){
    popupText.textContent = text;
    popupLayer.classList.add('show');
    if(!collected.has(idx)){
      collected.add(idx);
      starEl.classList.add('done');
    }
    if(collected.size === messages.length){
      setTimeout(activateFinalStar, 900);
    }
  }
  popupClose.addEventListener('click', ()=> popupLayer.classList.remove('show'));
  popupLayer.addEventListener('click', e=>{ if(e.target===popupLayer) popupLayer.classList.remove('show'); });

  /* ---------------- FINAL STAR + FINALE ---------------- */
  function activateFinalStar(){
    finalStar.classList.add('active');
    hint.textContent = 'Satu bintang lagi menunggumu';
    hint.style.opacity = 1;
  }

  const finale = document.getElementById('finale');
  const finaleText = document.getElementById('finale-text');
  const meteor = document.getElementById('meteor');
  const envelopeWrap = document.getElementById('envelope-wrap');

  finalStar.addEventListener('click', runFinale);

  function runFinale(){
    if(!finalStar.classList.contains('active')) return;
    finalStar.classList.remove('active');
    hint.style.opacity = 0;

    document.querySelectorAll('.star').forEach((s,i)=>{
      setTimeout(()=> s.classList.add('flash'), i*15);
    });

    meteor.classList.add('run');

    setTimeout(()=>{
      finale.classList.add('show');
      finaleText.textContent = 'Terima kasih sudah menjelajahi seluruh langit malam ini.';
      requestAnimationFrame(()=> finaleText.style.opacity = 1);
    }, 1400);

    setTimeout(()=>{
      finaleText.style.opacity = 0;
    }, 4600);

    setTimeout(()=>{
      finaleText.classList.add('title');
      finaleText.textContent = 'Happy Birthday';
      finaleText.style.opacity = 1;
    }, 5500);

    setTimeout(()=>{
      finaleText.style.opacity = 0;
    }, 8500);

    setTimeout(()=>{
      finaleText.classList.remove('title');
      finaleText.textContent = 'Selamat ulang tahun. Semoga di usia yang baru, kamu menemukan lebih banyak ketenangan, kebahagiaan, dan alasan untuk tersenyum.';
      finaleText.style.opacity = 1;
    }, 9400);

    setTimeout(()=>{
      finale.classList.remove('show');
      envelopeWrap.classList.add('up');
    }, 13800);
  }

  /* ---------------- LETTER ---------------- */
  const letterLayer = document.getElementById('letter-layer');
  document.getElementById('letter-close').addEventListener('click', ()=> letterLayer.classList.remove('show'));
  envelopeWrap.addEventListener('click', ()=> letterLayer.classList.add('show'));
  letterLayer.addEventListener('click', e=>{ if(e.target===letterLayer) letterLayer.classList.remove('show'); });

  /* ---------------- AMBIENT SOUND (embedded audio file) ---------------- */
  const soundBtn = document.getElementById('sound-toggle');
  const bgAudio = document.getElementById('bg-audio');
  bgAudio.src = 'assets/bg-music.mp3';
  bgAudio.volume = 0;
  let playing = false;
  let fadeTimer = null;

  function fadeAudio(to, duration){
    clearInterval(fadeTimer);
    const steps = 30;
    const start = bgAudio.volume;
    const stepTime = duration / steps;
    let i = 0;
    fadeTimer = setInterval(()=>{
      i++;
      bgAudio.volume = Math.max(0, Math.min(1, start + (to-start)*(i/steps)));
      if(i>=steps){
        clearInterval(fadeTimer);
        if(to===0) bgAudio.pause();
      }
    }, stepTime*1000);
  }

  soundBtn.addEventListener('click', ()=>{
    if(!playing){
      bgAudio.play().catch(()=>{});
      fadeAudio(0.6, 2000);
      soundBtn.textContent = '🔈';
      playing = true;
    } else {
      fadeAudio(0, 1200);
      soundBtn.textContent = '🔊';
      playing = false;
    }
  });

  /* ---------------- ENTRY AND LEAVE TRANSITIONS ---------------- */
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('transition') === 'zoom-in') {
    scene.classList.add('entry-zoom-init');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scene.classList.add('entry-zoom-animate');
        scene.classList.remove('entry-zoom-init');
      });
    });
    setTimeout(() => {
      scene.classList.remove('entry-zoom-animate');
    }, 2500);

    // Auto-play music (if gesture is inherited, otherwise user clicks screen to enable)
    setTimeout(() => {
      bgAudio.play().then(() => {
        fadeAudio(0.6, 3000);
        soundBtn.textContent = '🔈';
        playing = true;
      }).catch(err => {
        console.log("Autoplay blocked:", err);
      });
    }, 1000);
  }

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      scene.classList.add('zoom-out-active');
      fadeAudio(0, 1500);
      setTimeout(() => {
        window.location.href = "index.html?back=true";
      }, 1600);
    });
  }

})();