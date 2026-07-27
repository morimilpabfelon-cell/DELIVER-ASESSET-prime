(() => {
  document.querySelector('.demo-notice')?.remove();

  const utilitySupport = document.querySelector('.utility-bar [data-open-public="help"]');
  if (utilitySupport) {
    utilitySupport.textContent = '¿Necesitas ayuda? ';
    const supportLabel = document.createElement('b');
    supportLabel.textContent = 'Soporte 24/7';
    utilitySupport.append(supportLabel);
  }

  const liveChip = document.querySelector('.live-chip');
  if (liveChip) {
    liveChip.textContent = ' En vivo · 12 min estimados';
    const liveDot = document.createElement('span');
    liveDot.setAttribute('aria-hidden', 'true');
    liveChip.prepend(liveDot);
  }

  const trustItems = document.querySelectorAll('.hero-trust small');
  if (trustItems[2]) trustItems[2].textContent = 'Siempre disponible.';

  const labCopy = document.querySelector('.lab-intro > p');
  if (labCopy) labCopy.textContent = 'Explora cómo se conectan catálogo, pedido y seguimiento dentro de una sola experiencia.';

  const labButton = document.querySelector('.lab-intro [data-open-demo]');
  if (labButton) {
    labButton.textContent = 'ABRIR ECOSISTEMA COMPLETO ';
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    labButton.append(arrow);
  }

  const hubCopy = document.querySelector('.public-hub .section-heading > p:last-child');
  if (hubCopy) hubCopy.textContent = 'Cobertura, seguridad, soporte y estado operativo integrados en una misma plataforma.';

  const signupNote = document.querySelector('.signup-form [data-form-fields] small');
  if (signupNote) signupNote.textContent = 'Acceso anticipado para usuarios, negocios y repartidores.';

  const successCopy = document.querySelector('[data-form-success] p');
  if (successCopy) successCopy.textContent = 'Gracias por sumarte a la visión de DELIVER ASSETS.';
})();
