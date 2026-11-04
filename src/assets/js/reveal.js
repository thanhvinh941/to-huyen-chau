// Scroll reveal: thêm class .is-in khi phần tử [data-reveal] vào khung nhìn.
(() => {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('is-in');
      // Reset only outside the viewport, avoiding flicker near the reveal threshold.
      else if (e.intersectionRatio === 0) e.target.classList.remove('is-in');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
})();
