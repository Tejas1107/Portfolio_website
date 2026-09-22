(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle
  var themeBtn = document.getElementById('theme-toggle');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // Header border on scroll
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Count-up metrics
  function formatNum(n, el) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (el.getAttribute('data-format') === 'k') return Math.round(n).toLocaleString('en-IE');
    return n.toFixed(decimals);
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion) { el.textContent = formatNum(target, el); return; }
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(target * eased, el);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = formatNum(parseFloat(el.getAttribute('data-count')), el); });
  }

  // Active nav link
  var sections = document.querySelectorAll('main section[id]');
  var linkMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (!link || link.classList.contains('nav-cta')) return;
        if (entry.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }

  // Hero pipeline animation
  var steps = document.querySelectorAll('#pipeline li');
  var line = document.getElementById('terminal-line');
  var outputs = [
    'ingested <b>12,000+</b> docs across <b>40</b> tenants',
    'manual processing effort <b>−80%</b>',
    'embeddings → <b>pgvector</b> · Azure OpenAI',
    'retrieval_hit_rate: 72% → <b>88%</b> over 500+ queries',
    'p95 retrieval <b>&lt; 2s</b> · availability <b>99.9%</b>'
  ];
  if (steps.length && line && !reduceMotion) {
    var i = 0;
    function tick() {
      steps.forEach(function (s, idx) {
        s.classList.toggle('active', idx === i);
        s.classList.toggle('done', idx < i);
      });
      line.innerHTML = outputs[i];
      i = (i + 1) % steps.length;
    }
    tick();
    setInterval(tick, 2200);
  } else if (steps.length) {
    steps.forEach(function (s) { s.classList.add('done'); });
  }

  // Copy email
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var label = copyBtn.querySelector('span');
      function done(msg) {
        label.textContent = msg;
        setTimeout(function () { label.textContent = 'Copy email'; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done('Copied!'); }, function () { done(email); });
      } else {
        done(email);
      }
    });
  }
})();
