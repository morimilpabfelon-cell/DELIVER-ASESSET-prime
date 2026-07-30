(() => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');
  const dialog = document.querySelector('[data-dialog]');
  const closeButton = document.querySelector('[data-close]');
  const toast = document.querySelector('[data-toast]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('is-open', !expanded);
  });

  nav?.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    menu?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });

  const revealNodes = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    revealNodes.forEach((node) => observer.observe(node));
  }

  const states = [
    { label: 'CONFIRMADO', message: 'La solicitud fue registrada y espera asignación.', step: 0, eta: '—' },
    { label: 'RECOGIDO', message: 'El paquete está bajo custodia y listo para salir.', step: 1, eta: '28 MIN' },
    { label: 'EN CAMINO', message: 'El repartidor se dirige al punto de entrega.', step: 2, eta: '12 MIN' },
    { label: 'ENTREGADO', message: 'La entrega fue confirmada.', step: 3, eta: '0 MIN' },
  ];

  const sanitizeCode = (value) => value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);

  const updateTracking = (rawCode) => {
    const code = sanitizeCode(rawCode) || 'DA-0064';
    const seed = [...code].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const state = states[seed % states.length];

    document.querySelectorAll('[data-result-code]').forEach((node) => { node.textContent = code; });
    document.querySelectorAll('[data-result-status], [data-hero-status]').forEach((node) => { node.textContent = state.label; });
    document.querySelectorAll('[data-result-message]').forEach((node) => { node.textContent = state.message; });
    document.querySelectorAll('[data-eta]').forEach((node) => { node.textContent = state.eta; });

    document.querySelectorAll('[data-step]').forEach((node) => {
      const index = Number(node.dataset.step);
      node.classList.toggle('is-complete', index < state.step);
      node.classList.toggle('is-active', index === state.step);
    });

    const rider = document.querySelector('[data-rider]');
    if (rider) {
      const positions = ['translate(34 255)', 'translate(135 225)', 'translate(285 155)', 'translate(520 76)'];
      rider.setAttribute('transform', positions[state.step]);
    }

    showToast(`${code}: ${state.label}. ${state.message}`);
    document.querySelector('#tracking')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  };

  document.querySelectorAll('[data-tracking-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="code"]');
      updateTracking(input?.value || '');
    });
  });

  document.querySelectorAll('[data-accordion] article').forEach((article) => {
    const button = article.querySelector('button');
    const panel = article.querySelector('div');
    const symbol = button?.querySelector('span');
    button?.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
      if (symbol) symbol.textContent = expanded ? '+' : '−';
    });
  });

  const openDialog = () => {
    if (!dialog) return;
    document.body.classList.add('dialog-open');
    dialog.showModal();
  };
  const closeDialog = () => {
    if (!dialog) return;
    dialog.close();
    document.body.classList.remove('dialog-open');
  };

  document.querySelectorAll('[data-contact]').forEach((button) => button.addEventListener('click', openDialog));
  closeButton?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

  document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = document.querySelector('[data-form-note]');
    if (note) note.textContent = 'Formulario validado localmente. Falta conectar el canal de envío de producción.';
  });

  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
})();
