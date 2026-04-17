/* =========================================================
   Endura — main script
   ========================================================= */

(() => {
  // Плавный скролл по якорям с учётом высоты шапки
  const NAV_OFFSET = 76;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
        behavior: 'smooth'
      });
    });
  });

  // Появление блоков при скролле (.reveal → .reveal.in)
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Клик по кнопке пакета → подставить выбор в форму
  document.querySelectorAll('a[data-package]').forEach(a => {
    a.addEventListener('click', () => {
      const sel = document.getElementById('f-package');
      if (!sel) return;
      const val = a.getAttribute('data-package');
      const match = Array.from(sel.options).find(o => o.value === val);
      if (match) sel.value = val;
      const nameInput = document.getElementById('f-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 600);
    });
  });

  // Форма заявки → mailto
  const form = document.getElementById('lead-form');
  if (form) {
    const success = document.getElementById('form-success');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const phone = (data.get('phone') || '').trim();
      const pkg = (data.get('package') || '').trim();
      const message = (data.get('message') || '').trim();
      const subscribe = form.querySelector('#f-subscribe')?.checked;

      if (!name || !email) {
        form.reportValidity();
        return;
      }

      const subject = `Заявка с сайта · ${name}${pkg ? ' · ' + pkg : ''}`;
      const body = [
        `Имя: ${name}`,
        `Email: ${email}`,
        phone && `Телефон: ${phone}`,
        pkg && `Пакет: ${pkg}`,
        `Согласие на рассылку: ${subscribe ? 'да' : 'нет'}`,
        '',
        message ? `Комментарий:\n${message}` : ''
      ].filter(Boolean).join('\n');

      const href = `mailto:aitdaur@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;

      if (success) success.classList.add('show');
    });
  }
})();
