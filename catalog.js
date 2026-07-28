const renderSelectedProduct = () => {
  const store = currentStore();
  if (!selectedProduct) return;
  const first = selectedProduct.children[0];
  const second = selectedProduct.children[1];
  qs('h3', first).textContent = store.item;
  qs('p', first).textContent = `${store.name} · entrega estimada ${store.eta.toLowerCase()}`;
  qs('strong', second).textContent = `S/ ${store.price.toFixed(2)}`;
  updateOrder();
};

const renderStores = () => {
  if (!storeList) return;
  clear(storeList);
  stores[state.category].forEach((store, index) => {
    const button = element('button', `store-card${index === state.storeIndex ? ' is-selected' : ''}`);
    button.type = 'button';
    const categoryLabel = {
      comida: 'COMIDA',
      mercado: 'MERCADO',
      farmacia: 'FARMACIA',
      envios: 'ENVÍOS',
    }[state.category];
    const mark = element('span', `store-mark store-mark-${state.category}`);
    mark.setAttribute('aria-hidden', 'true');
    mark.append(element('b', '', store.symbol), element('small', '', categoryLabel));
    const info = element('span');
    info.append(element('strong', '', store.name), element('small', '', store.descriptor));
    const meta = element('span', 'store-meta');
    meta.append(element('b', '', `★ ${store.rating}`), element('small', '', store.eta));
    button.append(mark, info, meta);
    button.addEventListener('click', () => {
      state.storeIndex = index;
      state.quantity = 0;
      state.orderStep = 0;
      clearTimers();
      renderStores();
      renderSelectedProduct();
    });
    storeList.append(button);
  });
  renderSelectedProduct();
};

const chooseCategory = (category) => {
  if (!Object.hasOwn(stores, category)) return;
  state.category = category;
  state.storeIndex = 0;
  state.quantity = 0;
  state.orderStep = 0;
  clearTimers();
  qsa('[data-tab]').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.tab === category)));
  qsa('[data-category]').forEach((card) => card.classList.toggle('is-active', card.dataset.category === category));
  renderStores();
};

qsa('[data-tab]').forEach((tab) => tab.addEventListener('click', () => chooseCategory(tab.dataset.tab)));
qsa('[data-category]').forEach((card) => card.addEventListener('click', () => {
  chooseCategory(card.dataset.category);
  qs('.product-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
