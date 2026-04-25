/* ============================================================
   script.js — Alex Mercer Portfolio
   Handles: navbar scroll, mobile menu, theme toggle,
            typing animation, scroll reveal, custom cursor
   ============================================================ */

'use strict';

/* ---------- DOM REFERENCES ---------- */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const typedText   = document.getElementById('typedText');
const cursorDot   = document.getElementById('cursorDot');
const cursorRing  = document.getElementById('cursorRing');
const yearSpan    = document.getElementById('year');

/* ---------- FOOTER YEAR ---------- */
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ============================================================
   1. STICKY NAVBAR — adds .scrolled class on scroll
   ============================================================ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   3. DARK / LIGHT THEME TOGGLE
   ============================================================ */
// Persist preference in localStorage
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('portfolio-theme', next);
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ============================================================
   4. TYPING ANIMATION
   ============================================================ */
const roles = [
  'Web Developer',
  'CSE Student',
  'Full-Stack Engineer',
  'Open Source Contributor',
  'UI Enthusiast',
];

let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingDelay = 120;  // ms per character
const pauseTime = 1800; // pause at full word

function typeLoop() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Finished typing — pause then start deleting
      isDeleting = true;
      setTimeout(typeLoop, pauseTime);
      return;
    }
    setTimeout(typeLoop, typingDelay);
  } else {
    // Deleting backward (faster)
    typedText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Finished deleting — move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeLoop, typingDelay / 2);
  }
}

// Start typing after a short delay
setTimeout(typeLoop, 800);

/* ============================================================
   5. SCROLL REVEAL — animate sections into view
   ============================================================ */
// Add .reveal class to elements we want to animate
const revealTargets = [
  '.about-grid',
  '.skill-group',
  '.project-card',
  '.contact-card',
  '.about-stats',
];

// Attach the class to each matched element
revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children inside groups
    el.style.transitionDelay = `${i * 80}ms`;
  });
});

// IntersectionObserver to trigger animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   6. CUSTOM CURSOR (desktop only)
   ============================================================ */
// Only run custom cursor when mouse is available
if (window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Track cursor position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  });

  // Ring follows with smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const interactives = 'a, button, .project-card, .contact-card, .badge';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.7)';
      cursorRing.style.opacity   = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.opacity   = '0.5';
    });
  });

  // Hide native cursor
  document.body.style.cursor = 'none';

  // Show/hide custom cursor on window leave/enter
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '0.5';
  });
}

/* ============================================================
   7. SMOOTH SCROLLING (fallback for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset    = 70; // navbar height
    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ============================================================
   8. ACTIVE NAV LINK HIGHLIGHT on scroll
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
