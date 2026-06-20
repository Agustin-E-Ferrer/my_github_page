/* ═══════════════════════════════════════════════
   AGUSTÍN FERRER — PORTFOLIO SCRIPT
   Vanilla JS · No dependencies beyond AOS
═══════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   AOS INIT
──────────────────────────────────────────────── */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ────────────────────────────────────────────────
   PARTICLE CANVAS
──────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#4f8ef7', '#9b59ff', '#00d4ff', '#7aaeff'];
  let particles = [];
  let W, H, animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.5 + 0.15;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function spawnParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#4f8ef7';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  resize();
  spawnParticles(Math.min(90, Math.floor((W * H) / 12000)));
  loop();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    spawnParticles(Math.min(90, Math.floor((W * H) / 12000)));
    loop();
  });
})();

/* ────────────────────────────────────────────────
   TYPED TEXT EFFECT
──────────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Problem Solver',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const word = words[wordIdx];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; schedule(); }, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }

    if (!pause) schedule();
  }

  function schedule() {
    const speed = deleting ? 45 : 90;
    setTimeout(type, speed);
  }

  schedule();
})();

/* ────────────────────────────────────────────────
   NAVBAR SCROLL + ACTIVE LINK
──────────────────────────────────────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ────────────────────────────────────────────────
   MOBILE NAV TOGGLE
──────────────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
})();

/* ────────────────────────────────────────────────
   SKILL BARS ANIMATION
──────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        // Delay slightly for visual effect
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ────────────────────────────────────────────────
   ANIMATED STAT COUNTERS
──────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function animateCounter(el, target, duration) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = target > 100 ? 2200 : 1600;
        animateCounter(el, target, duration);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ────────────────────────────────────────────────
   PROJECT FILTER
──────────────────────────────────────────────── */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card, i) => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 60}ms`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ────────────────────────────────────────────────
   CONTACT FORM → MAILTO
──────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = form.nombre.value.trim();
    const email   = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !email || !mensaje) {
      showFormFeedback(form, 'Por favor completá todos los campos.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Portfolio — Mensaje de ${nombre}`);
    const body    = encodeURIComponent(
      `Hola Agustín,\n\nTe escribo desde tu portfolio.\n\n${mensaje}\n\n---\nDe: ${nombre}\nEmail: ${email}`
    );
    window.location.href = `mailto:agustin.ezequiel.ferrer@gmail.com?subject=${subject}&body=${body}`;

    showFormFeedback(form, '¡Listo! Tu cliente de email se abrirá ahora.', 'success');
    form.reset();
  });

  function showFormFeedback(form, msg, type) {
    let fb = form.querySelector('.form-feedback');
    if (!fb) {
      fb = document.createElement('p');
      fb.className = 'form-feedback';
      form.appendChild(fb);
    }
    fb.textContent = msg;
    fb.style.cssText = `
      margin-top: 10px;
      font-size: 0.82rem;
      font-family: var(--ff-mono);
      color: ${type === 'success' ? '#3ecf8e' : '#ff4d6d'};
      text-align: center;
    `;
    setTimeout(() => { if (fb) fb.remove(); }, 4000);
  }
})();

/* ────────────────────────────────────────────────
   BACK TO TOP
──────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ────────────────────────────────────────────────
   DOWNLOAD CV (placeholder alert)
──────────────────────────────────────────────── */
(function initDownloadCV() {
  const btn = document.getElementById('downloadCV');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Reemplazar href por la ruta real al PDF del CV cuando esté disponible
    // e.g.: window.open('cv-agustin-ferrer.pdf', '_blank');
    const tip = document.createElement('div');
    tip.textContent = '📄 Agregá tu CV como cv.pdf y actualiza el href de este botón.';
    tip.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: #111128; border: 1px solid rgba(79,142,247,0.4);
      color: #fff; padding: 12px 22px; border-radius: 10px;
      font-size: 0.82rem; font-family: monospace;
      box-shadow: 0 0 20px rgba(79,142,247,0.3);
      z-index: 9999; white-space: nowrap;
    `;
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 3500);
  });
})();

/* ────────────────────────────────────────────────
   SMOOTH SCROLL for anchor links
──────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ────────────────────────────────────────────────
   CURSOR GLOW EFFECT (subtle, desktop only)
──────────────────────────────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px; height: 320px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(79,142,247,0.05) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
