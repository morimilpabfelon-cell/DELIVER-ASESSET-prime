(() => {
  if (document.documentElement.dataset.theme !== 'day') return;

  document.body.classList.add('theme-day');
  document.title = 'DELIVER ASSETS — DAY FINAL';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f4f1e8');

  const text = (selector, value, root = document) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  text('.hero-lead', 'Una plataforma en movimiento para conectar personas, comercios y repartidores en tiempo real.');
  text('.categories .section-heading > p', '02 / QUÉ NECESITAS HOY');
  text('#categories-title', '¿QUÉ NECESITAS HOY?');
  text('.manifesto .section-index', '03 / MANIFIESTO');
  text('.manifesto-layout > p', 'Deliver Assets reúne pedidos, comercios y distribución de última milla bajo una experiencia directa, rápida y trazable.');
  text('.product-lab .section-heading > p', '04 / EXPERIENCIA INTERACTIVA');
  text('.process .section-heading > p', '05 / CÓMO FUNCIONA');
  text('.business-panel > p:first-child', '06 / NEGOCIOS');
  text('.rider-panel > p:first-child', '07 / REPARTIDORES');
  text('.contact-cta > div > p', '08 / CONTACTO');

  const hubCards = [...document.querySelectorAll('.public-hub-grid > button')];
  const hubContent = [
    { action: 'coverage', mark: 'C', title: 'COBERTURA', copy: 'Estamos donde nos necesitas.', link: 'ABRIR COBERTURA →' },
    { action: 'help', mark: 'S', title: 'SOPORTE', copy: 'Ayuda siempre disponible.', link: 'ABRIR SOPORTE →' },
    { action: 'security', mark: 'D', title: 'DATOS SEGUROS', copy: 'Privacidad y protección.', link: 'VER CONTROLES →' },
    { action: 'contact', mark: 'D', title: 'DELIVER PRO', copy: 'Soluciones para negocios.', link: 'CONVERSAR →' },
  ];

  hubCards.forEach((card, index) => {
    const content = hubContent[index];
    if (!content) return;
    card.dataset.openPublic = content.action;
    text('h3', content.title, card);
    text('p', content.copy, card);
    text('b', content.link, card);
    const icon = card.querySelector('.hub-icon');
    if (icon) {
      icon.replaceChildren();
      icon.setAttribute('viewBox', '0 0 64 64');
      icon.setAttribute('aria-hidden', 'true');
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '32');
      circle.setAttribute('cy', '32');
      circle.setAttribute('r', '29');
      circle.setAttribute('fill', '#15191b');
      circle.setAttribute('stroke', '#2a2f31');
      circle.setAttribute('stroke-width', '2');
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '32');
      label.setAttribute('y', '40');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#ffc400');
      label.setAttribute('font-family', 'Arial Black, Arial, sans-serif');
      label.setAttribute('font-size', '22');
      label.setAttribute('font-weight', '900');
      label.textContent = content.mark;
      icon.append(circle, label);
    }
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