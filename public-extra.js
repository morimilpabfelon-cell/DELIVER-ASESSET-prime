(() => {
  const { element, paragraph, article, modalHero, pageShell, cards, publicPages } = window.DeliverPublicKit;

  publicPages.help = () => {
    const page = pageShell();
    page.append(modalHero('PREGUNTAS FRECUENTES', 'RESPUESTAS CLARAS.', 'El producto debe explicar qué existe, qué se simula y qué falta antes de operar.', '?'));
    const list = element('section', 'faq-list');
    [
      ['¿Cómo funciona un pedido?', 'Seleccionas una categoría, eliges un comercio, agregas productos, confirmas la dirección y completas un pago simulado.'],
      ['¿Los pagos ya funcionan?', 'No. Todos los métodos y saldos son simulados. No se procesan tarjetas, transferencias ni dinero real.'],
      ['¿Cómo se registra un negocio?', 'El prototipo contempla identidad, datos fiscales, cuenta bancaria, catálogo y contrato comercial.'],
      ['¿En qué zonas opera?', 'La cobertura mostrada es conceptual y se concentra en distritos de Lima Central. No representa disponibilidad comercial real.'],
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
    page.append(modalHero('CONTACTO', 'HABLEMOS DEL ECOSISTEMA.', 'Los canales comerciales y de soporte se habilitarán cuando existan responsables, procesos y condiciones verificadas.', 'DA'));
    page.append(cards(
      article('01', 'INVERSIONISTAS Y ALIADOS', 'Revisión de visión, producto, arquitectura y hoja de ruta.'),
      article('02', 'NEGOCIOS', 'Interés comercial, categorías, catálogo y operación futura.'),
      article('03', 'REPARTIDORES', 'Modelo de incorporación, seguridad y condiciones por validar.'),
    ));
    return page;
  };

  const legalPage = (privacy) => {
    const page = pageShell();
    page.append(modalHero(
      privacy ? 'PRIVACIDAD' : 'TÉRMINOS',
      privacy ? 'DATOS CON PROPÓSITO Y LÍMITES.' : 'REGLAS ANTES DE OPERAR.',
      privacy ? 'Esta página define una estructura conceptual para informar cómo DELIVER ASSETS podría tratar datos personales.' : 'DELIVER ASSETS se diseña como una plataforma tecnológica que conecta clientes, comercios y repartidores.',
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
      ['3. Pagos', 'El prototipo no procesa dinero. Una versión real deberá usar proveedores autorizados, tokenización y conciliación.'],
      ['4. Limitaciones', 'La versión actual es una demostración visual sin disponibilidad comercial, garantías operativas ni obligaciones de entrega.'],
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
