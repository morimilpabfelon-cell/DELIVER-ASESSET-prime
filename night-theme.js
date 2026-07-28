(() => {
  if (document.documentElement.dataset.theme === 'day') return;

  document.documentElement.dataset.theme = 'night';
  document.body.classList.add('theme-night');
  document.title = 'DELIVER ASSETS — Night Final';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#060708');

  const setText = (selector, value, root = document) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  const replaceCategoryIcon = (card, src) => {
    const current = card.querySelector('.category-icon');
    if (!current) return;
    const image = document.createElement('img');
    image.className = 'category-icon';
    image.src = src;
    image.alt = '';
    image.width = 44;
    image.height = 44;
    image.setAttribute('aria-hidden', 'true');
    current.replaceWith(image);
  };

  setText('.hero-lead', 'Una plataforma en movimiento para conectar personas, comercios y repartidores en tiempo real.');
  document.querySelector('.hero-slogan')?.setAttribute('hidden', '');

  setText('.categories .section-heading > p', '02 / QUÉ NECESITAS HOY');
  setText('#categories-title', '¿QUÉ NECESITAS HOY?');

  const categoryContent = {
    comida: {
      copy: 'Restaurantes y más.',
      icon: './assets/night-category-food.png',
    },
    mercado: {
      copy: 'Súper y tiendas.',
      icon: './assets/night-category-market.png',
    },
    farmacia: {
      copy: 'Salud y bienestar.',
      icon: './assets/night-category-pharmacy.png',
    },
    envios: {
      copy: 'Paquetes y documentos.',
      icon: './assets/night-category-shipping.png',
    },
  };

  document.querySelectorAll('.category-card').forEach((card) => {
    const content = categoryContent[card.dataset.category];
    if (!content) return;
    setText('p', content.copy, card);
    replaceCategoryIcon(card, content.icon);
  });

  setText('.manifesto .section-index', '03 / MANIFIESTO');
  setText('.manifesto-layout > p', 'Deliver Assets reúne pedidos, comercios y distribución de última milla bajo una experiencia directa, rápida y trazable.');
  setText('.product-lab .section-heading > p', '04 / EXPERIENCIA INTERACTIVA');
  setText('.process .section-heading > p', '05 / CÓMO FUNCIONA');
  setText('.business-panel > p:first-child', '06 / NEGOCIOS');
  setText('.rider-panel > p:first-child', '07 / REPARTIDORES');
  setText('.contact-cta > div > p', '08 / CONTACTO');

  const trustCards = [...document.querySelectorAll('.public-hub-grid > button')];
  const trustContent = [
    { action: 'coverage', mark: 'C', title: 'COBERTURA', copy: 'Estamos donde nos necesitas.' },
    { action: 'help', mark: 'S', title: 'SOPORTE', copy: 'Ayuda siempre disponible.' },
    { action: 'security', mark: 'D', title: 'DATOS SEGUROS', copy: 'Privacidad y protección.' },
    { action: 'contact', mark: 'D', title: 'DELIVER PRO', copy: 'Soluciones para negocios.' },
  ];

  trustCards.forEach((card, index) => {
    const content = trustContent[index];
    if (!content) return;
    card.dataset.openPublic = content.action;
    setText('h3', content.title, card);
    setText('p', content.copy, card);
    const link = card.querySelector('b');
    if (link) link.hidden = true;

    const icon = card.querySelector('.hub-icon');
    if (!icon) return;
    icon.replaceChildren();
    icon.setAttribute('viewBox', '0 0 56 56');
    icon.setAttribute('aria-hidden', 'true');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    circle.setAttribute('x', '1');
    circle.setAttribute('y', '1');
    circle.setAttribute('width', '54');
    circle.setAttribute('height', '54');
    circle.setAttribute('rx', '15');
    circle.setAttribute('fill', '#15191b');
    circle.setAttribute('stroke', '#2a2f31');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '28');
    label.setAttribute('y', '36');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#ffc400');
    label.setAttribute('font-family', 'Arial Black, Arial, sans-serif');
    label.setAttribute('font-size', '20');
    label.setAttribute('font-weight', '900');
    label.textContent = content.mark;
    icon.append(circle, label);
  });

  const processImages = [
    './assets/icon-order.svg',
    './assets/icon-track.svg',
    './assets/icon-receive.svg',
  ];
  document.querySelectorAll('.process-grid > li').forEach((card, index) => {
    const image = card.querySelector('img');
    if (!image || !processImages[index]) return;
    image.src = processImages[index];
  });

  const main = document.querySelector('main');
  if (main) {
    [
      '.hero',
      '.categories',
      '.public-hub',
      '.manifesto',
      '.product-lab',
      '.process',
      '.ecosystem',
      '.contact-cta',
    ].forEach((selector) => {
      const section = main.querySelector(selector);
      if (section) main.append(section);
    });
  }
})();