// Smooth-scroll for in-page links (respects reduced motion)
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href');
  if (id.length < 2) return;
  var el = document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navH = document.querySelector('.nav').offsetHeight;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: reduce ? 'auto' : 'smooth' });
});