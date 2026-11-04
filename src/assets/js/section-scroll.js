// Gentle desktop assistance after a deliberate downward scroll, never a scroll lock.
(() => {
  const desktop = matchMedia('(min-width: 1024px) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('#main > section')];
  if (sections.length < 2) return;

  const idleMs = 180;
  const duration = 500;
  let idle, frame = 0, armed = false, lastY = scrollY;
  const enabled = () => desktop.matches && !reduced.matches;
  const cancel = () => {
    clearTimeout(idle);
    cancelAnimationFrame(frame);
    frame = 0;
    armed = false;
  };

  const assist = () => {
    if (!armed || !enabled()) return;
    armed = false;
    const header = document.querySelector('.header');
    const offset = header?.getBoundingClientRect().height || 0;
    for (let i = 0; i < sections.length - 1; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      // Long reading sections and product lists retain natural scrolling.
      if (section.querySelector('.pcard, .collection__track') || rect.height > innerHeight || rect.height <= 0) continue;
      const progress = (offset - rect.top) / rect.height;
      if (progress < 0.7 || progress >= 1) continue;
      const next = sections[i + 1].getBoundingClientRect();
      const start = scrollY;
      const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const target = Math.min(max, start + next.top - offset);
      if (target <= start + 2) return;
      const began = performance.now();
      const tick = (now) => {
        if (!enabled()) { cancel(); return; }
        const t = Math.min(1, (now - began) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        // Explicit instant behavior avoids competing with CSS smooth scrolling.
        window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' });
        lastY = scrollY;
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
      return;
    }
  };

  window.addEventListener('wheel', (event) => {
    cancel();
    if (!enabled() || event.ctrlKey || event.deltaY <= 0 || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    if (document.querySelector('.header.is-open')) return;
    // Leave nested scroll areas and controls in charge of their own gestures.
    if (event.target.closest('input, textarea, select, [contenteditable], [data-product3d], .collection__track')) return;
    for (let el = event.target; el && el !== document.body; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight && /auto|scroll/.test(getComputedStyle(el).overflowY)) return;
    }
    armed = true;
    idle = setTimeout(assist, idleMs);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const y = scrollY;
    if (!frame && y < lastY) cancel();
    lastY = y;
    if (!armed || frame) return;
    clearTimeout(idle);
    idle = setTimeout(assist, idleMs);
  }, { passive: true });
  ['pointerdown', 'touchstart', 'keydown', 'resize', 'blur'].forEach((type) => {
    window.addEventListener(type, cancel, { passive: true });
  });
  desktop.addEventListener('change', cancel);
  reduced.addEventListener('change', cancel);
})();
