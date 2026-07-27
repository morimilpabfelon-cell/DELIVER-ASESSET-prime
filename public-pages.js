(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clear = (target) => { while (target?.firstChild) target.removeChild(target.firstChild); };
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const paragraph = (text) => element('p', '', text);
  const article = (number, title, text) => {
    const node = element('article');
    node.append(element('span', '', number), element('h3', '', title), paragraph(text));
    return node;
  };
  const modalHero = (kicker, title, copy, symbol) => {
    const hero = element('section', 'modal-hero');
    const text = element('div');
    text.append(element('span', '', kicker), element('h2', '', title), paragraph(copy));
    hero.append(text, element('div', 'modal-symbol', symbol));
    return hero;
  };
  const pageShell = () => element('div', 'modal-page');
  const cards = (...items) => {
    const grid = element('section', 'modal-grid');
    grid.append(...items);
    return grid;
  };
  const publicPages = {};

  publicPages.coverage = () => {
    const page = pageShell();
    page.append(
      modalHero('COBERTURA CONCEPTUAL', 'LA CIUDAD, POR ZONAS.', 'Diseñamos una operación gradual: primero densidad, luego expansión. Las áreas mostradas todavía no representan servicio disponible.', '⌖'),
      cards(
        article('01', 'DENSIDAD ANTES QUE TAMAÑO', 'Una zona compacta permite mejores tiempos, disponibilidad de repartidores y costos controlados.'),
        article('02', 'CAPACIDAD MEDIBLE', 'La expansión debe depender de demanda, comercios, flota, soporte y seguridad.'),
        article('03', 'APERTURA GRADUAL', 'Las zonas pueden habilitarse por horarios, categorías o capacidad operativa.'),
      ),
    );
    return page;
  };

  publicPages.security = () => {
    const page = pageShell();
    page.append(
      modalHero('SEGURIDAD POR DISEÑO', 'CONFIANZA EN CADA PASO.', 'La seguridad no será una pantalla aislada. Debe cubrir identidad, pedidos, pagos, ubicación, soporte y operación física.', '✓'),
      cards(
        article('ID', 'IDENTIDAD', 'Verificación diferenciada para clientes, negocios, repartidores y administradores.'),
        article('2FA', 'ACCESO', 'Sesiones, permisos explícitos y verificación reforzada según el nivel de riesgo.'),
        article('DATA', 'PRIVACIDAD', 'Consentimiento, minimización, cifrado, retención limitada y trazabilidad.'),
      ),
    );
    return page;
  };

  publicPages.status = () => {
    const page = pageShell();
    page.append(
      modalHero('ESTADO DEL SISTEMA', 'VISIBILIDAD CUANDO ALGO FALLA.', 'La operación real deberá comunicar disponibilidad, mantenimiento, errores y recuperación sin ocultar incidentes.', '●'),
      cards(
        article('01', 'APLICACIÓN PÚBLICA', 'Interfaz conceptual disponible mediante GitHub Pages.'),
        article('02', 'PEDIDOS Y PAGOS', 'No operativos. Se mantienen como flujos de demostración.'),
        article('03', 'SOPORTE Y ALERTAS', 'Pendientes de infraestructura, responsables y acuerdos de servicio.'),
      ),
    );
    return page;
  };

  window.DeliverPublicKit = { qs, qsa, clear, element, paragraph, article, modalHero, pageShell, cards, publicPages };
})();
