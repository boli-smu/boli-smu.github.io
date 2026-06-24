/* Bo Li homepage motion layer. Pure vanilla JS, no dependencies. */
(function () {
  document.body.classList.add('anim-on');

  // ---- scroll reveal ----
  document.querySelectorAll('.page__content, .archive').forEach(function (scope) {
    scope.querySelectorAll(
      ':scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > ol, :scope > hr, :scope > blockquote, :scope > .list__item, :scope > .stats, :scope > .hero'
    ).forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 55, 360) + 'ms';
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ---- typing effect ----
  document.querySelectorAll('[data-type]').forEach(function (el) {
    var txt = el.getAttribute('data-type'), i = 0;
    el.textContent = '';
    el.classList.add('type-caret');
    (function step() {
      if (i <= txt.length) { el.textContent = txt.slice(0, i); i++; setTimeout(step, 95); }
    })();
  });

  // ---- count-up numbers ----
  function countUp(el) {
    var target = +el.getAttribute('data-count'), dur = 1100, start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // ---- hero particle network ----
  var c = document.querySelector('canvas.hero-particles');
  if (c && c.getContext) {
    var ctx = c.getContext('2d'), host = c.parentElement, pts = [], N = 46;
    function size() { c.width = host.offsetWidth; c.height = host.offsetHeight; }
    function init() {
      pts = [];
      for (var i = 0; i < N; i++) pts.push({
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
      });
    }
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283);
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 9000) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.18 * (1 - d / 9000)) + ')';
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    size(); init(); draw();
    window.addEventListener('resize', function () { size(); init(); });
  }
})();
