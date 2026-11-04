// Xoay 360° bằng kéo chuột/ngón tay hoặc phím mũi tên; tự xoay chậm khi rảnh.
// Giai đoạn sau có thể thay bằng <model-viewer> khi có file .glb.
(() => {
  const stage = document.querySelector('[data-product3d]');
  if (!stage) return;
  const obj = stage.querySelector('.p3d__object');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ry = 0, rx = -6, dragging = false, startX = 0, startY = 0, base = 0, baseX = 0, visible = false, raf;

  const apply = () => { obj.style.setProperty('--ry', ry + 'deg'); obj.style.setProperty('--rx', rx + 'deg'); };
  const tick = () => {
    if (!dragging && !reduce) { ry += 0.25; apply(); }
    raf = visible ? requestAnimationFrame(tick) : 0;
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }).observe(stage);

  stage.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startY = e.clientY; base = ry; baseX = rx;
    stage.setPointerCapture(e.pointerId); stage.classList.add('is-drag');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    ry = base + (e.clientX - startX) * 0.5;
    rx = Math.max(-25, Math.min(15, baseX - (e.clientY - startY) * 0.15));
    apply();
  });
  const end = () => { dragging = false; stage.classList.remove('is-drag'); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { ry -= 15; apply(); }
    if (e.key === 'ArrowRight') { ry += 15; apply(); }
  });
  apply();
})();
