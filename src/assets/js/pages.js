(() => {
  const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  document.querySelectorAll('[data-catalog]').forEach((root) => {
    const search = root.querySelector('[data-search]');
    const category = root.querySelector('[data-category]');
    const sort = root.querySelector('[data-sort]');
    const list = root.querySelector('[data-product-list]');
    const cards = [...list.children];
    const update = () => {
      const query = normalize(search.value.trim());
      const ordered = [...cards].sort((a, b) => sort.value === 'name' ? a.dataset.name.localeCompare(b.dataset.name, 'vi') : +a.dataset.order - +b.dataset.order);
      let count = 0;
      ordered.forEach((card) => {
        card.hidden = !(normalize(card.dataset.name).includes(query) && (!category.value || category.value === card.dataset.category));
        if (!card.hidden) { count++; card.classList.add('is-in'); }
        list.append(card);
      });
      root.querySelector('[data-result-count]').textContent = `${count} sản phẩm`;
      root.querySelector('[data-empty]').hidden = count !== 0;
    };
    search.addEventListener('input', update);
    category.addEventListener('change', update);
    sort.addEventListener('change', update);
    root.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); update(); });
    root.querySelector('[data-reset]').addEventListener('click', () => { search.value = ''; category.value = ''; sort.value = 'featured'; update(); search.focus(); });
  });

  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const stage = gallery.querySelector('[data-gallery-stage]');
    const label = gallery.querySelector('[data-gallery-label]');
    const name = document.querySelector('#product-title').textContent;
    gallery.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
      gallery.querySelectorAll('[data-view]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      stage.dataset.angle = button.dataset.view;
      label.textContent = `${name} · ${button.dataset.view} · Ảnh mẫu`;
    }));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    stage.addEventListener('pointermove', (event) => {
      if (motion.matches || event.pointerType !== 'mouse') return;
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * 6}deg`);
      stage.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 6}deg`);
    });
    const reset = () => { stage.style.removeProperty('--tilt-x'); stage.style.removeProperty('--tilt-y'); };
    stage.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
  });

  document.querySelectorAll('[data-editorial-gallery]').forEach((gallery) => {
    const slides = [...gallery.querySelectorAll('.collection-frame')];
    const requested = Number(new URLSearchParams(location.search).get('anh'));
    let index = Number.isInteger(requested) && requested >= 1 && requested <= slides.length ? requested - 1 : 0;
    const go = (delta) => {
      index = (index + delta + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== index;
        slide.classList.toggle('is-current', i === index);
      });
      gallery.querySelector('[data-editorial-count]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    gallery.querySelector('[data-editorial-prev]').addEventListener('click', () => go(-1));
    gallery.querySelector('[data-editorial-next]').addEventListener('click', () => go(1));
    go(0);
    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    });
    gallery.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    });
    let touchStart;
    gallery.addEventListener('touchstart', (event) => {
      touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    gallery.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
    gallery.addEventListener('touchend', (event) => {
      if (!touchStart || event.touches.length) { touchStart = null; return; }
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > gallery.clientWidth * .12 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  });

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const slug = new URLSearchParams(location.search).get('san-pham');
    const names = { 'hoa-tai-lua': 'Hoa tai lụa', 'tram-cai-toc': 'Trâm cài tóc', 'quat-cam-tay': 'Quạt cầm tay' };
    if (names[slug]) form.elements.message.value = `Tôi muốn được tư vấn về sản phẩm ${names[slug]}.`;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      form.querySelector('[data-contact-text]').value = `Họ tên: ${values.get('name')}\nEmail: ${values.get('email')}\nĐiện thoại: ${values.get('phone') || 'Chưa cung cấp'}\nChủ đề: ${values.get('subject')}\n\n${values.get('message')}`;
      form.querySelector('[data-contact-output]').hidden = false;
      form.querySelector('[data-contact-status]').textContent = 'Đã soạn nội dung. Chưa gửi yêu cầu; hãy sao chép để dùng khi kênh liên hệ chính thức được cập nhật.';
    });
    form.querySelector('[data-copy-contact]').addEventListener('click', async () => {
      const field = form.querySelector('[data-contact-text]');
      try {
        await navigator.clipboard.writeText(field.value);
        form.querySelector('[data-contact-status]').textContent = 'Đã sao chép nội dung. Yêu cầu chưa được gửi.';
      } catch {
        field.focus(); field.select();
        form.querySelector('[data-contact-status]').textContent = 'Hãy nhấn Ctrl+C hoặc sao chép nội dung đã chọn. Yêu cầu chưa được gửi.';
      }
    });
  }
})();
