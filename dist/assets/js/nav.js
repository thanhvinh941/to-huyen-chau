// Header: trong suốt trên hero, đặc khi cuộn; menu mobile.
(() => {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const burger = header.querySelector('[data-burger]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Trang không có hero (không có .hero) dùng header đặc ngay
  if (!document.querySelector('.hero')) header.classList.add('header--solid');

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  document.querySelectorAll('.mobile-menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
})();
