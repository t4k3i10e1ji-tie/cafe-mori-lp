(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const HEADER_OFFSET = 76;

  /* ---------- header background on scroll ---------- */
  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- mobile nav toggle ---------- */
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const toggleNav = () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  };

  navToggle.addEventListener('click', toggleNav);

  /* ---------- smooth scroll with fixed-header offset ---------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      closeNav();

      const targetY = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      history.pushState(null, '', targetId);
    });
  });

  /* ---------- close mobile nav on Escape ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  /* ---------- scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
})();
