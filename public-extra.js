(() => {
  const { element, paragraph, article, modalHero, pageShell, cards, publicPages } = window.DeliverPublicKit;

  publicPages.help = () => {
    const page = pageShell();
    page.append(modalHero('PREGUNTAS FRECUENTES', 'RESPUESTAS CLARAS.', 'Conoce cómo se conectan pedidos, comercios, repartidores, cobertura y seguridad.', '?'));
    const list = element('section', 'faq-list');
    [
      ['¿Cómo funciona un pedido?', 'Seleccionas una categoría, eliges un comercio, agregas productos, confirmas la dirección y sigues el recorrido hasta la entrega.'],
      ['¿Cómo se integran los pagos?', 'La arquitectura contempla tokenización, proveedores autorizados y conciliación por pedido.'],
      ['¿Cómo se incorpora un negocio?', 'El flujo reúne identidad, datos fiscales, cuenta de liquidación, catálogo y condiciones comerciales.'],
      ['¿Cómo se activa la cobertura?', 'La apertura se organiza por densidad, comercios, repartidores, horarios y capacidad de soporte.'],
    ].forEach(([question, answer]) => {
      const details = element('details');
      details.append(element('summary', '', question), paragraph(answer));
      list.append(details);
    });
    page.append(list);
    return page;
  };

  publicPages.contact = () => {
    const page = pageShell();
    page.append(modalHero('CONTACTO', 'HABLEMOS DEL ECOSISTEMA.', 'DELIVER ASSETS busca conectar producto, operación, comercios y capital bajo una visión común.', 'DA'));
    page.append(cards(
      article('01', 'INVERSIONISTAS Y ALIADOS', 'Visión, producto, arquitectura y hoja de ruta.'),
      article('02', 'NEGOCIOS', 'Categorías, catálogo, operación y crecimiento comercial.'),
      article('03', 'REPARTIDORES', 'Incorporación, seguridad, rutas y experiencia operativa.'),
    ));
    const actions = element('div', 'modal-actions');
    const profile = element('a', '', 'CONTACTAR EN GITHUB ↗');
    profile.href = 'https://github.com/morimilpabfelon-cell';
    profile.target = '_blank';
    profile.rel = 'noreferrer';
    const repository = element('a', '', 'VER REPOSITORIO PRIME ↗');
    repository.href = 'https://github.com/morimilpabfelon-cell/DELIVER-ASESSET-prime';
    repository.target = '_blank';
    repository.rel = 'noreferrer';
    actions.append(profile, repository);
    page.append(actions);
    return page;
  };

  const legalPage = (privacy) => {
    const page = pageShell();
    page.append(modalHero(
      privacy ? 'PRIVACIDAD' : 'TÉRMINOS',
      privacy ? 'DATOS CON PROPÓSITO Y LÍMITES.' : 'REGLAS ANTES DE OPERAR.',
      privacy ? 'DELIVER ASSETS organiza el tratamiento de datos bajo propósito, consentimiento, seguridad y control de acceso.' : 'DELIVER ASSETS conecta clientes, comercios y repartidores mediante una plataforma tecnológica.',
      privacy ? 'ID' : '§',
    ));
    const copy = element('section', 'legal-copy');
    const items = privacy ? [
      ['1. Datos considerados', 'Identidad, contacto, ubicación, pedidos, dispositivo, actividad de cuenta, soporte y datos operativos asociados al rol.'],
      ['2. Finalidades', 'Crear cuentas, ejecutar pedidos, prevenir fraude, prestar soporte, liquidar operaciones y cumplir obligaciones aplicables.'],
      ['3. Ubicación', 'Debe utilizarse con consentimiento, durante el tiempo estrictamente necesario y con controles diferenciados.'],
      ['4. Seguridad', 'Se requieren cifrado, control de acceso, auditoría, gestión de incidentes y proveedores evaluados.'],
    ] : [
      ['1. Naturaleza del servicio', 'Plataforma tecnológica que conecta clientes, comercios y repartidores. Las responsabilidades contractuales deben definirse antes de operar.'],
      ['2. Pedidos', 'Precios, disponibilidad, preparación, entrega, cancelación y reembolso deben mostrarse antes de confirmar una operación.'],
      ['3. Pagos', 'La arquitectura de pagos requiere proveedores autorizados, tokenización, idempotencia y conciliación.'],
      ['4. Condiciones operativas', 'Cobertura, disponibilidad, cancelaciones y responsabilidades deben mostrarse con claridad antes de confirmar un pedido.'],
    ];
    items.forEach(([title, text]) => {
      const node = element('article');
      node.append(element('h3', '', title), paragraph(text));
      copy.append(node);
    });
    page.append(copy);
    return page;
  };

  publicPages.terms = () => legalPage(false);
  publicPages.privacy = () => legalPage(true);
})();
