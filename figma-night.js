(() => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');
  const dialog = document.querySelector('[data-dialog]');
  const closeDialog = document.querySelector('[data-close]');

  const storeSets = {
    comida: ['BARRIO BURGER', 'POLLO URBANO', 'CAFÉ CENTRAL'],
    mercado: ['MERCADO CENTRAL', 'SUPER BARRIO', 'TIENDA EXPRESS'],
    farmacia: ['FARMA EXPRESS', 'SALUD 24', 'BOTICA CENTRAL'],
    envios: ['ENVÍO DIRECTO', 'PAQUETE URBANO', 'RUTA EXPRESS'],
  };

  const activateCategory = (category) => {
    const names = storeSets[category] || storeSets.comida;
    document.querySelectorAll('[data-tab]').forEach((tab) => {
      const active = tab.dataset.tab === category;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-store]').forEach((store, index) => {
      store.textContent = names[index] || names[0];
    });
  };

  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('is-open', !expanded);
  });

  nav?.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    menu?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });

  document.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => activateCategory(tab.dataset.tab));
  });

  document.querySelectorAll('[data-category]').forEach((card) => {
    card.addEventListener('click', () => {
      activateCategory(card.dataset.category);
      document.querySelector('#experiencia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const openDialog = () => {
    if (!dialog) return;
    document.body.classList.add('dialog-open');
    dialog.showModal();
  };

  const hideDialog = () => {
    if (!dialog) return;
    dialog.close();
    document.body.classList.remove('dialog-open');
  };

  document.querySelectorAll('[data-contact]').forEach((button) => button.addEventListener('click', openDialog));
  closeDialog?.addEventListener('click', hideDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) hideDialog();
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
})();