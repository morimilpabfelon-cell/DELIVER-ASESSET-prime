(() => {
  document.documentElement.classList.add('js');

  const refinementStylesheet = document.createElement('link');
  refinementStylesheet.rel = 'stylesheet';
  refinementStylesheet.href = './editorial-production-refinement.css';
  document.head.append(refinementStylesheet);

  const menu = document.querySelector('[data-menu]');
  const menuLabel = menu?.querySelector('.sr-only');
  const nav = document.querySelector('[data-nav]');
  const dialog = document.querySelector('[data-dialog]');
  const closeButton = document.querySelector('[data-close]');
  const toast = document.querySelector('[data-toast]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dialogOpener = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  const setMenuState = (open) => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (menuLabel) menuLabel.textContent = open ? 'Cerrar navegación' : 'Abrir navegación';
  };

  menu?.addEventListener('click', () => {
    setMenuState(menu.getAttribute('aria-expanded') !== 'true');
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuState(false);
  });

  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (nav.contains(event.target) || menu?.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      setMenuState(false);
      menu?.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenuState(false);
  });

  const route = document.querySelector('.route');
  const routeShadow = document.querySelector('.route-shadow');
  if (route && routeShadow && route.parentNode === routeShadow.parentNode) {
    route.parentNode.insertBefore(routeShadow, route);
  }

  document.querySelectorAll('.dashboard aside button').forEach((button) => {
    button.disabled = true;
    button.setAttribute('aria-hidden', 'true');
    button.tabIndex = -1;
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealNodes.forEach((node) => observer.observe(node));
  }

  const navLinks = [...document.querySelectorAll('[data-nav] a[href^="#"]')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58%', threshold: [0.05, 0.2, 0.5] });
    observedSections.forEach((section) => sectionObserver.observe(section));
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

    document.querySelectorAll('input[name="code"]').forEach((input) => { input.value = code; });
    document.querySelectorAll('[data-result-code]').forEach((node) => { node.textContent = code; });
    document.querySelectorAll('[data-result-status], [data-hero-status]').forEach((node) => { node.textContent = state.label; });
    document.querySelectorAll('[data-result-message]').forEach((node) => { node.textContent = state.message; });
    document.querySelectorAll('[data-eta]').forEach((node) => { node.textContent = state.eta; });

    document.querySelectorAll('[data-step]').forEach((node) => {
      const index = Number(node.dataset.step);
      node.classList.toggle('is-complete', index < state.step);
      node.classList.toggle('is-active', index === state.step);
      if (index === state.step) node.setAttribute('aria-current', 'step');
      else node.removeAttribute('aria-current');
    });

    const rider = document.querySelector('[data-rider]');
    if (rider) {
      const positions = [
        'translate(34px,255px)',
        'translate(135px,225px)',
        'translate(285px,155px)',
        'translate(520px,76px)',
      ];
      rider.style.transform = positions[state.step];
    }

    showToast(`${code}: ${state.label}. ${state.message}`);
    document.querySelector('#tracking')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  document.querySelectorAll('[data-tracking-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
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

  const openDialog = (event) => {
    if (!dialog) return;
    dialogOpener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement;
    if (typeof dialog.showModal !== 'function') {
      showToast('Este navegador no admite el diálogo de contacto.');
      return;
    }
    document.body.classList.add('dialog-open');
    dialog.showModal();
  };

  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
  };

  document.querySelectorAll('[data-contact]').forEach((button) => button.addEventListener('click', openDialog));
  closeButton?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (dialogOpener instanceof HTMLElement) dialogOpener.focus();
    dialogOpener = null;
  });

  document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const note = document.querySelector('[data-form-note]');
    if (note) note.textContent = 'Formulario validado localmente. Falta conectar el canal de envío de producción.';
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
