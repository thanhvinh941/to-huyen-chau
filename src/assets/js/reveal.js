// Scroll reveal: thêm class .is-in khi phần tử [data-reveal] vào khung nhìn.
(() => {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('is-in');
      // The viewport buffer starts entrances early and resets only well offscreen.
      else if (e.intersectionRatio === 0) e.target.classList.remove('is-in');
    });
  }, { threshold: 0, rootMargin: '80px 0px' });
  items.forEach((el) => io.observe(el));
})();
