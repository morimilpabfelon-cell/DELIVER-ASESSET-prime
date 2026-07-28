(() => {
  'use strict';

  const loadVisualAssets = async () => {
    const manifestResponse = await fetch('./assets/data/manifest.json');
    if (!manifestResponse.ok) throw new Error('No se pudo cargar el manifiesto visual');
    const manifest = await manifestResponse.json();
    for (const [name, count] of Object.entries(manifest)) {
      const chunks = await Promise.all(Array.from({ length: count }, async (_, index) => {
        const response = await fetch(`./assets/data/${name}-${index}.txt`);
        if (!response.ok) throw new Error(`No se pudo cargar el activo: ${name}-${index}`);
        return (await response.text()).trim();
      }));
      document.documentElement.style.setProperty(`--asset-${name}`, `url("data:image/webp;base64,${chunks.join('')}")`);
    }
  };
  loadVisualAssets().catch((error) => console.error('[assets]', error));


  const catalog = {
    comida: {
      imageClass: 'category-food',
      title: 'Combo Barrio',
      description: 'Hamburguesa, papas y bebida.',
      stores: [
        ['BB', 'Barrio Burger', '4.9 · 12 min'],
        ['CC', 'Cocina Central', '4.8 · 18 min'],
        ['PU', 'Punto Urbano', '4.7 · 20 min'],
      ],
    },
    mercado: {
      imageClass: 'category-market',
      title: 'Compra esencial',
      description: 'Frutas, verduras y productos diarios.',
      stores: [
        ['MC', 'Mercado Central', '4.9 · 16 min'],
        ['VB', 'Verde Barrio', '4.8 · 19 min'],
        ['DT', 'Despensa Total', '4.6 · 22 min'],
      ],
    },
    farmacia: {
      imageClass: 'category-pharmacy',
      title: 'Kit de bienestar',
      description: 'Productos esenciales con trazabilidad.',
      stores: [
        ['FE', 'Farma Express', '4.9 · 14 min'],
        ['PS', 'Punto Salud', '4.8 · 17 min'],
        ['BC', 'Bienestar Central', '4.7 · 21 min'],
      ],
    },
    envios: {
      imageClass: 'category-shipping',
      title: 'Envío urbano',
      description: 'Paquetes y documentos dentro de la ciudad.',
      stores: [
        ['DA', 'DELIVER Envíos', '4.9 · 15 min'],
        ['RU', 'Ruta Urbana', '4.8 · 18 min'],
        ['EP', 'Envío Prime', '4.7 · 24 min'],
      ],
    },
  };

  const state = { category: 'comida', items: 0 };
  const storeList = document.querySelector('[data-store-list]');
  const productImage = document.querySelector('[data-product-image]');
  const productCategory = document.querySelector('[data-product-category]');
  const productTitle = document.querySelector('[data-product-title]');
  const productDescription = document.querySelector('[data-product-description]');
  const itemCount = document.querySelector('[data-item-count]');
  const confirmButton = document.querySelector('[data-confirm-order]');
  const orderState = document.querySelector('[data-order-state]');

  const renderStores = () => {
    if (!storeList) return;
    storeList.replaceChildren();
    catalog[state.category].stores.forEach((store, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `store-card${index === 0 ? ' is-selected' : ''}`;
      const mark = document.createElement('span');
      mark.className = 'store-mark';
      mark.textContent = store[0];
      const copy = document.createElement('span');
      const strong = document.createElement('strong');
      strong.textContent = store[1];
      const small = document.createElement('small');
      small.textContent = index === 0 ? 'Seleccionado' : 'Ver comercio';
      copy.append(strong, small);
      const meta = document.createElement('span');
      meta.className = 'store-meta';
      meta.textContent = store[2];
      button.append(mark, copy, meta);
      button.addEventListener('click', () => {
        storeList.querySelectorAll('.store-card').forEach((node) => node.classList.remove('is-selected'));
        button.classList.add('is-selected');
      });
      storeList.append(button);
    });
  };

  const setCategory = (category) => {
    if (!catalog[category]) return;
    state.category = category;
    document.querySelectorAll('[data-tab]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.tab === category)));
    document.querySelectorAll('[data-category]').forEach((button) => button.classList.toggle('is-active', button.dataset.category === category));
    const product = catalog[category];
    if (productImage) { productImage.className = `product-visual ${product.imageClass}`; productImage.setAttribute('aria-label', product.title); }
    if (productCategory) productCategory.textContent = category.toUpperCase();
    if (productTitle) productTitle.textContent = product.title;
    if (productDescription) productDescription.textContent = product.description;
    renderStores();
    document.querySelector('.experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('[data-category], [data-tab]').forEach((button) => {
    button.addEventListener('click', () => setCategory(button.dataset.category || button.dataset.tab));
  });

  document.querySelector('[data-add-item]')?.addEventListener('click', () => {
    state.items += 1;
    if (itemCount) itemCount.textContent = String(state.items);
    if (confirmButton) confirmButton.disabled = false;
  });

  confirmButton?.addEventListener('click', () => {
    if (!state.items) return;
    orderState.textContent = 'CONFIRMADO';
    confirmButton.textContent = 'PEDIDO CONFIRMADO';
    confirmButton.disabled = true;
  });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  menuToggle?.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const info = {
    help: ['CENTRO DE AYUDA', 'Soporte para cada recorrido', 'La visión de DELIVER ASSETS contempla ayuda para clientes, negocios y repartidores durante toda la experiencia.'],
    coverage: ['COBERTURA', 'Una ciudad conectada por zonas', 'La cobertura se presenta como una red operativa que puede crecer por áreas y conectar demanda, comercios y repartidores.'],
    security: ['SEGURIDAD', 'Seguimiento y protección', 'La propuesta integra seguimiento del pedido, control de estados y una experiencia centrada en la protección de datos.'],
    contact: ['CONTACTO', 'Conoce la visión completa', 'Revisa el producto original de DELIVER ASSETS y la nueva dirección visual Prime desde el repositorio oficial.'],
    business: ['DELIVER PRO', 'Herramientas para negocios', 'La propuesta para negocios reúne catálogo, pedidos, visibilidad y operación bajo una sola identidad.'],
    rider: ['REPARTIDORES', 'Rutas claras y control operativo', 'La experiencia para repartidores conecta ofertas, rutas, estados de entrega y progreso dentro del ecosistema.'],
  };

  const infoModal = document.querySelector('[data-info-modal]');
  const modalEyebrow = document.querySelector('[data-modal-eyebrow]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalCopy = document.querySelector('[data-modal-copy]');
  document.querySelectorAll('[data-open-panel]').forEach((button) => button.addEventListener('click', () => {
    const entry = info[button.dataset.openPanel];
    if (!entry || !infoModal) return;
    modalEyebrow.textContent = entry[0];
    modalTitle.textContent = entry[1];
    modalCopy.textContent = entry[2];
    infoModal.showModal();
  }));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => infoModal?.close()));

  const ecosystemModal = document.querySelector('[data-ecosystem-modal]');
  document.querySelectorAll('[data-open-ecosystem]').forEach((button) => button.addEventListener('click', () => ecosystemModal?.showModal()));
  document.querySelector('[data-close-ecosystem]')?.addEventListener('click', () => ecosystemModal?.close());

  [infoModal, ecosystemModal].forEach((dialog) => dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }));

  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  renderStores();
})();
