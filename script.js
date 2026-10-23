const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// ===== NAV =====
const nav = $('#nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const navLinkEls = $$('.nav-links a');
const sectionIds = ['about','music','videos','shows','gallery','contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinkEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => io.observe(s));

// ===== MOBILE MENU =====
const burger = $('.burger');
const navLinks = $('.nav-links');
burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});
navLinks?.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// ===== SMOOTH SCROLL =====
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id.length > 1) {
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
$$('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== YOUTUBE PLAYER =====
const playerEmbedWrap = $('#playerEmbedWrap');
const playerEmbed = $('#playerEmbed');
const playerTrack = $('#playerTrack');
const playerArtist = $('#playerArtist');
const playBtn = $('#playBtn');
const iconPlay = playBtn.querySelector('.icon-play');
const iconPause = playBtn.querySelector('.icon-pause');

let currentVideoId = 'vrQWhFysPKY';

function setPlayerVideo(videoId, title, artist) {
  currentVideoId = videoId;
  playerTrack.textContent = title || 'Unknown';
  playerArtist.textContent = artist || 'Yung Lean';
  playerEmbed.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  playerEmbedWrap.classList.add('open');
  iconPlay.style.display = 'none';
  iconPause.style.display = '';
}
function togglePlayer() {
  if (playerEmbedWrap.classList.contains('open')) {
    playerEmbedWrap.classList.remove('open');
    playerEmbed.src = '';
    iconPlay.style.display = '';
    iconPause.style.display = 'none';
  } else {
    setPlayerVideo(currentVideoId, playerTrack.textContent, playerArtist.textContent);
  }
}
playBtn.addEventListener('click', togglePlayer);

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.track-play');
  if (!btn) return;
  e.preventDefault();
  const parent = btn.closest('[data-video-id]');
  if (!parent) return;
  setPlayerVideo(parent.dataset.videoId, parent.dataset.title, parent.dataset.artist);
  $('#music').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== ALBUM EXPAND =====
$$('.album-expand').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    if (!list) return;
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// ===== VIDEO MODAL =====
const videoModal = $('#videoModal');
const vmFrame = $('#vmFrame');
$$('.video').forEach(v => {
  v.addEventListener('click', () => {
    const videoId = v.dataset.videoId;
    if (!videoId) return;
    vmFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
  });
});
function closeVideo() {
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden', 'true');
  vmFrame.src = '';
}
$('.vm-close')?.addEventListener('click', closeVideo);
videoModal?.addEventListener('click', (e) => { if (e.target === videoModal) closeVideo(); });

// ===== GALLERY LIGHTBOX =====
const lightbox = $('#lightbox');
const lbImg = $('#lbImg');
$$('.gal').forEach(g => {
  g.addEventListener('click', () => {
    lbImg.src = g.dataset.full || g.querySelector('img')?.src || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
}
$('.lb-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ===== ESC =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideo();
    closeLightbox();
    if (playerEmbedWrap.classList.contains('open')) {
      playerEmbedWrap.classList.remove('open');
      playerEmbed.src = '';
      iconPlay.style.display = '';
      iconPause.style.display = 'none';
    }
  }
});

// ===== CONTACT FORM =====
const form = $('#contactForm');
const statusEl = $('#formStatus');
function setFieldError(label, hasError) {
  label.classList.toggle('has-error', hasError);
  const input = label.querySelector('input, textarea');
  if (input) input.classList.toggle('invalid', hasError);
}
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  ['name','email','subject','message'].forEach(name => {
    const input = form.elements[name];
    const label = input.closest('label');
    let err = false;
    if (!input.value.trim()) err = true;
    if (name === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) err = true;
    if (name === 'name' && input.value && input.value.trim().length < 2) err = true;
    if (name === 'subject' && input.value && input.value.trim().length < 3) err = true;
    if (name === 'message' && input.value && input.value.trim().length < 10) err = true;
    setFieldError(label, err);
    if (err) valid = false;
  });
  if (!valid) {
    statusEl.textContent = '⚠ Проверьте выделенные поля.';
    statusEl.className = 'form-status err';
    return;
  }
  statusEl.textContent = '✓ Сообщение отправлено. Мы ответим в течение 1–2 рабочих дней.';
  statusEl.className = 'form-status ok';
  form.reset();
  setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 6000);
});
form?.addEventListener('input', (e) => {
  const label = e.target.closest('label');
  if (!label) return;
  label.classList.remove('has-error');
  e.target.classList.remove('invalid');
});

// ===========================================================
// ================== SAKURA PETALS ==========================
// Лепестки появляются при скролле, падают, плавно затухают
// ===========================================================
const canvas = document.getElementById('sakuraCanvas');
const ctx = canvas.getContext('2d');
let petals = [];
let lastScroll = window.scrollY;
let spawnCooldown = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PETAL_COLORS = ['#ff4d94', '#ff7eb3', '#ffb0cc', '#ffd1e0', '#ff6ea8'];

function createPetal() {
  return {
    x: Math.random() * canvas.width,
    y: -30 - Math.random() * 50,
    size: 6 + Math.random() * 10,
    speedY: 0.8 + Math.random() * 1.6,
    speedX: -0.6 + Math.random() * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (-0.02 + Math.random() * 0.04),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.015 + Math.random() * 0.025,
    wobbleAmp: 0.3 + Math.random() * 0.6,
    opacity: 0.85 + Math.random() * 0.15,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  };
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  // Лепесток сакуры: 5 «долек» через два bezier-контура
  const s = p.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.9, s * 0.4, 0, s);
  ctx.bezierCurveTo(-s * 0.9, s * 0.4, -s * 0.9, -s * 0.7, 0, -s);
  // Выемка на верхушке
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.18, -s * 0.65, 0, -s * 0.5);
  ctx.quadraticCurveTo(-s * 0.18, -s * 0.65, 0, -s);

  ctx.fillStyle = p.color;
  ctx.fill();

  // Тонкая прожилка
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.lineTo(0, s * 0.9);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();
}

function updatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const H = canvas.height;

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    p.wobble += p.wobbleSpeed;
    p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    // Плавное затухание в нижней четверти экрана
    const fadeStart = H * 0.72;
    if (p.y > fadeStart) {
      const tail = (p.y - fadeStart) / (H - fadeStart);
      p.opacity = Math.max(0, 0.9 * (1 - tail));
    }

    // Удаляем за пределами экрана или когда полностью исчез
    if (p.y > H + 40 || p.opacity <= 0.01) {
      petals.splice(i, 1);
      continue;
    }

    drawPetal(p);
  }

  requestAnimationFrame(updatePetals);
}

// Стартовая порция лепестков — чтобы атмосфера была с самого начала
for (let i = 0; i < 6; i++) {
  const p = createPetal();
  p.y = Math.random() * canvas.height * 0.6;
  petals.push(p);
}
updatePetals();

// Спавн новых лепестков при скролле (с троттлингом и лимитом)
const MAX_PETALS = 60;
const SPAWN_INTERVAL = 90; // ms
const SCROLL_THRESHOLD = 4; // px — минимальный сдвиг, чтобы сработал спавн

window.addEventListener('scroll', () => {
  const now = performance.now();
  const delta = Math.abs(window.scrollY - lastScroll);
  lastScroll = window.scrollY;

  if (delta < SCROLL_THRESHOLD) return;
  if (now - spawnCooldown < SPAWN_INTERVAL) return;
  spawnCooldown = now;

  // Чем больше проскроллили, тем больше лепестков добавим (но не больше 3 за раз)
  const count = Math.min(3, 1 + Math.floor(delta / 150));
  for (let i = 0; i < count; i++) {
    if (petals.length < MAX_PETALS) petals.push(createPetal());
  }
}, { passive: true });

// Уважаем настройку prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  canvas.style.display = 'none';
}