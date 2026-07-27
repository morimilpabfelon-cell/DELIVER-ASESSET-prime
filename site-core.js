const toggle = qs('[data-menu-toggle]');
const navigation = qs('[data-navigation]');
const year = qs('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const closeMenu = () => {
  toggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navigation?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement || event.target instanceof HTMLButtonElement) closeMenu();
});
window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
    closeMenu();
    toggle?.focus();
  }
});

const storeList = qs('[data-store-list]');
const selectedProduct = qs('[data-selected-product]');
const orderItem = qs('[data-order-item]');
const quantity = qs('[data-order-quantity]');
const cartCount = qs('[data-cart-count]');
const orderTotal = qs('[data-order-total]');
const deliveryFee = qs('[data-delivery-fee]');
const orderLabel = qs('[data-order-label]');
const orderDetail = qs('[data-order-detail]');
const liveStatus = qs('[data-live-status]');
const progress = qs('[data-progress]');
const map = qs('[data-demo-map]');
const confirmOrder = qs('[data-confirm-order]');
const resetOrder = qs('[data-reset-order]');
const consoleHint = qs('[data-console-hint]');
const currentStore = () => stores[state.category][state.storeIndex] ?? stores[state.category][0];
const clearTimers = () => {
  state.timers.forEach((timer) => window.clearTimeout(timer));
  state.timers = [];
};
