const updateOrder = () => {
  const store = currentStore();
  const current = orderStates[state.orderStep];
  const total = state.quantity ? store.price * state.quantity + 4.9 : 0;

  if (orderItem) orderItem.textContent = store.item;
  if (quantity) quantity.textContent = String(state.quantity);
  if (cartCount) cartCount.textContent = String(state.quantity);
  if (orderTotal) orderTotal.textContent = `S/ ${total.toFixed(2)}`;
  if (deliveryFee) deliveryFee.textContent = state.quantity ? 'S/ 4.90' : '—';
  if (orderLabel) orderLabel.textContent = current.label;
  if (orderDetail) orderDetail.textContent = current.detail;
  if (liveStatus) liveStatus.textContent = state.orderStep === 0 ? '● LISTO' : '● EN VIVO';
  if (progress) qsa('i', progress).forEach((bar, index) => bar.classList.toggle('is-done', current.step >= index + 1));
  if (map) {
    map.className = 'demo-map';
    if (current.step) map.classList.add(`is-progress-${current.step}`);
  }
  if (confirmOrder) {
    confirmOrder.disabled = state.orderStep !== 1;
    confirmOrder.hidden = state.orderStep === 5;
  }
  if (resetOrder) resetOrder.hidden = state.orderStep !== 5;
  if (consoleHint) {
    consoleHint.textContent = state.orderStep === 0
      ? 'Agrega un producto para iniciar la simulación.'
      : state.orderStep === 1
        ? 'El pedido está listo para confirmar.'
        : state.orderStep === 5
          ? 'La simulación terminó correctamente.'
          : 'El estado cambia automáticamente.';
  }
};

qs('[data-add-item]')?.addEventListener('click', () => {
  if (state.orderStep > 1) return;
  state.quantity += 1;
  state.orderStep = 1;
  updateOrder();
});
confirmOrder?.addEventListener('click', () => {
  if (state.orderStep !== 1) return;
  clearTimers();
  [2, 3, 4, 5].forEach((nextStep, index) => {
    const timer = window.setTimeout(() => {
      state.orderStep = nextStep;
      updateOrder();
    }, 700 + index * 950);
    state.timers.push(timer);
  });
});
resetOrder?.addEventListener('click', () => {
  clearTimers();
  state.quantity = 0;
  state.orderStep = 0;
  updateOrder();
});

const signupForm = qs('[data-signup-form]');
signupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  qs('[data-form-fields]', signupForm).hidden = true;
  qs('[data-form-success]', signupForm).hidden = false;
});
qs('[data-form-reset]')?.addEventListener('click', () => {
  if (!signupForm) return;
  signupForm.reset();
  qs('[data-form-fields]', signupForm).hidden = false;
  qs('[data-form-success]', signupForm).hidden = true;
});

renderStores();
