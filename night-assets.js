(() => {
  if (document.documentElement.dataset.theme === 'day') return;

  const assetParts = [
    './assets/night-b64/hero-01.txt',
    './assets/night-b64/hero-02.txt',
    './assets/night-b64/hero-03.txt',
    './assets/night-b64/hero-04.txt',
    './assets/night-b64/hero-05.txt',
  ];

  const decodeBase64 = (base64) => {
    const binary = window.atob(base64.replace(/\s+/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  };

  Promise.all(assetParts.map(async (source) => {
    const response = await fetch(source, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`No se pudo cargar ${source}`);
    return response.text();
  }))
    .then((parts) => {
      const bytes = decodeBase64(parts.join(''));
      const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
      document.documentElement.style.setProperty('--night-hero-photo', `url("${objectUrl}")`);
      document.documentElement.dataset.nightAssets = 'ready';
      window.addEventListener('pagehide', () => URL.revokeObjectURL(objectUrl), { once: true });
    })
    .catch((error) => {
      console.warn('[deliver-prime] No se pudo reconstruir el hero nocturno de Figma.', error);
    });
})();