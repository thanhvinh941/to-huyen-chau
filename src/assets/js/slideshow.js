// Slideshow (hero) + track nav (collection). Nội dung nằm sẵn trong HTML; JS chỉ đổi class.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-slideshow]').forEach((root) => {
    const slides = [...root.querySelectorAll('.slide')];
    if (slides.length < 2) return;
    const cur = root.querySelector('[data-slide-current]');
    const pad = (n) => String(n).padStart(2, '0');
    let i = 0, timer;

    // Replay the active slide's entrance when returning to the hero.
    if ('IntersectionObserver' in window) {
      const visibility = new IntersectionObserver(([entry]) => {
        root.classList.toggle('is-offscreen', !entry.isIntersecting);
      }, { rootMargin: '80px 0px' });
      visibility.observe(root);
    }

    const go = (n) => {
      slides[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      if (cur) cur.textContent = pad(i + 1);
    };
    const play = () => {
      const ms = +root.dataset.autoplay;
      if (!ms) return; // autoplay là crossfade nhẹ nên vẫn chạy khi giảm chuyển động
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), ms);
    };
    root.querySelector('[data-slide-prev]')?.addEventListener('click', () => { go(i - 1); play(); });
    root.querySelector('[data-slide-next]')?.addEventListener('click', () => { go(i + 1); play(); });
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', play);
    play();

    // Parallax nhẹ cho ảnh slide đầu
    const par = root.querySelector('[data-parallax]');
    if (par && !reduce) {
      let frame = 0;
      addEventListener('scroll', () => {
        if (frame || root.classList.contains('is-offscreen')) return;
        frame = requestAnimationFrame(() => {
          par.style.transform = `translate3d(0, ${Math.min(scrollY, innerHeight) * 0.18}px, 0)`;
          frame = 0;
        });
      }, { passive: true });
    }
  });

  // Nút trái/phải cho track cuộn ngang
  document.querySelectorAll('[data-track-nav]').forEach((nav) => {
    const track = document.querySelector(nav.dataset.trackNav);
    if (!track) return;
    const step = () => (track.querySelector('li')?.offsetWidth || 300) + 20;
    nav.querySelector('[data-track-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nav.querySelector('[data-track-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
})();
