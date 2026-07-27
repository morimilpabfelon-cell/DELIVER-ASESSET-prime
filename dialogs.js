(() => {
  const { publicPages, qs, qsa, clear } = window.DeliverPublicKit;
  const publicModal = qs('[data-public-modal]');
  const publicContent = qs('[data-public-content]');
  const demoModal = qs('[data-demo-modal]');
  let lastFocused = null;

  const closeDialog = (dialog) => {
    if (!dialog?.open) return;
    dialog.close();
    document.body.classList.remove('modal-open');
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };
  const openPublic = (name, trigger) => {
    const renderer = publicPages[name];
    if (!renderer || !publicModal || !publicContent) return;
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    clear(publicContent);
    publicContent.append(renderer());
    publicModal.showModal();
    document.body.classList.add('modal-open');
    qs('[data-close-modal]', publicModal)?.focus();
  };
  qsa('[data-open-public]').forEach((button) => button.addEventListener('click', () => openPublic(button.dataset.openPublic, button)));
  qs('[data-close-modal]')?.addEventListener('click', () => closeDialog(publicModal));
  publicModal?.addEventListener('click', (event) => { if (event.target === publicModal) closeDialog(publicModal); });

  const openDemo = (trigger) => {
    if (!demoModal) return;
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    demoModal.showModal();
    document.body.classList.add('modal-open');
    qs('[data-close-demo]', demoModal)?.focus();
  };
  qsa('[data-open-demo]').forEach((button) => button.addEventListener('click', () => openDemo(button)));
  qs('[data-close-demo]')?.addEventListener('click', () => closeDialog(demoModal));
  demoModal?.addEventListener('click', (event) => { if (event.target === demoModal) closeDialog(demoModal); });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (publicModal?.open) closeDialog(publicModal);
    else if (demoModal?.open) closeDialog(demoModal);
  });
})();
