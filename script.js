/* ============================================================
   KORA SAMYUKTHA — NEON PORTFOLIO
   script.js
   ============================================================ */

// ============================================================
// 1. PARTICLE BACKGROUND
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT  = 80;
  const COLORS = ['#00f0ff', '#9b5de5', '#0077ff', '#ffffff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Create a particle
  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  // Draw connecting lines between nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ============================================================
// 2. NAVBAR — shrink on scroll + hamburger toggle
// ============================================================
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ============================================================
// 3. TYPED TEXT EFFECT (hero title cycling)
// ============================================================
(function initTyped() {
  const el     = document.querySelector('.typed-text');
  const titles = [
    'AI Developer',
    'Data Scientist',
    'Web Developer',
    'ML Engineer',
    'Problem Solver',
  ];
  let ti = 0, ci = 0, deleting = false;

  function type() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
      }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();
})();

// ============================================================
// 4. SCROLL REVEAL ANIMATIONS
// ============================================================
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children slightly for a cascade effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

// ============================================================
// 5. STAGGER CHILD ANIMATIONS (cards inside revealed sections)
// ============================================================
(function initChildStagger() {
  const groups = [
    '.projects-grid .project-card',
    '.skills-grid .skill-group',
    '.exp-grid .exp-card',
    '.timeline-item',
  ];

  groups.forEach(selector => {
    const items = document.querySelectorAll(selector);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(items).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity    = '1';
            entry.target.style.transform  = 'translateY(0)';
          }, idx * 120);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(item => {
      item.style.opacity    = '0';
      item.style.transform  = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      obs.observe(item);
    });
  });
})();

// ============================================================
// 6. CONTACT FORM (simple validation + fake send)
// ============================================================
(function initForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = '⚡ Sending...';
    note.style.color = 'var(--cyan)';

    // Simulate async send
    setTimeout(() => {
      note.textContent = '✅ Message sent! I\'ll get back to you soon.';
      note.style.color = '#00e676';
      form.reset();
      setTimeout(() => { note.textContent = ''; }, 4000);
    }, 1200);
  });
})();

// ============================================================
// 7. NEON CURSOR TRAIL (subtle glow dot following mouse)
// ============================================================
(function initCursorTrail() {
  const dots = [];
  const COUNT = 8;

  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${8 - i}px;
      height: ${8 - i}px;
      background: rgba(0,240,255,${0.6 - i * 0.07});
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%,-50%);
      transition: opacity 0.3s;
      box-shadow: 0 0 6px #00f0ff;
    `;
    document.body.appendChild(dot);
    dots.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateTrail() {
    let px = mx, py = my;
    dots.forEach((dot, i) => {
      const delay = i * 0.15;
      dot.x += (px - dot.x) * (0.35 - delay * 0.02);
      dot.y += (py - dot.y) * (0.35 - delay * 0.02);
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
      px = dot.x; py = dot.y;
    });
    requestAnimationFrame(animateTrail);
  })();
})();

// ============================================================
// 8. ACTIVE NAV LINK on scroll
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
})();
