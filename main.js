// ---------- Mobile menu ----------
(function () {
  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.burger');
  if (!nav || !btn) return;
  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
  nav.querySelectorAll('.menu a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
})();

// ---------- Footer year ----------
document.querySelectorAll('.yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });

// ---------- See-through header over the hero ----------
(function () {
  if (!document.querySelector('.hero')) return;
  var body = document.body;
  body.classList.add('has-hero');
  function onScroll() { body.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---------- Motion (skipped if the visitor prefers reduced motion) ----------
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  // Sections ease up as they come into view, items in a group one after another
  var groups = [
    '.split > *', '.head', '.tiles > *', '.why-grid > *', '.cta-card',
    '.svc', '.projs > *', '.steps > *', '.pts > *', '.work > *', '.vac', '.prose',
    '.feature', '.scope', '.sectors > *', '.expect > *', '.faq', '.figs', '.pgrid > *', '.cols2 > *'
  ];
  var items = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest('.hero') || el.closest('.page-hero')) return;
      var siblings = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(siblings, 4) * 0.1) + 's';
      items.push(el);
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });

  // Stats count up once when they come into view (placeholders like [XX] are left alone)
  var stats = document.querySelectorAll('.stat b');
  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      so.unobserve(e.target);
      var el = e.target;
      if (el.querySelector('.ph')) return;
      var m = el.textContent.match(/^(\D*)([\d,.]+)(.*)$/);
      if (!m) return;
      var prefix = m[1], target = parseFloat(m[2].replace(/,/g, '')), suffix = m[3];
      var decimals = (m[2].split('.')[1] || '').length;
      var start = null, dur = 1600;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        el.textContent = prefix + Number(val).toLocaleString('en-GB', { minimumFractionDigits: decimals }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  stats.forEach(function (el) { so.observe(el); });
})();