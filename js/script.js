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

  /* ---------- contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = [
      {
        input: document.getElementById('contactName'),
        error: document.getElementById('contactNameError'),
        validate: (value) => (value === '' ? 'お名前を入力してください。' : ''),
      },
      {
        input: document.getElementById('contactEmail'),
        error: document.getElementById('contactEmailError'),
        validate: (value) => {
          if (value === '') return 'メールアドレスを入力してください。';
          if (!EMAIL_PATTERN.test(value)) return 'メールアドレスの形式が正しくありません。';
          return '';
        },
      },
      {
        input: document.getElementById('contactMessage'),
        error: document.getElementById('contactMessageError'),
        validate: (value) => (value === '' ? 'お問い合わせ内容を入力してください。' : ''),
      },
    ];

    const setFieldError = (field, message) => {
      field.error.textContent = message;
      field.input.closest('.form-group').classList.toggle('has-error', Boolean(message));
      field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    fields.forEach((field) => {
      field.input.addEventListener('input', () => {
        setFieldError(field, field.validate(field.input.value.trim()));
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let firstInvalid = null;

      fields.forEach((field) => {
        const message = field.validate(field.input.value.trim());
        setFieldError(field, message);
        if (message && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      alert('送信しました');
      contactForm.reset();
      fields.forEach((field) => setFieldError(field, ''));
    });
  }
})();
