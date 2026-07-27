(() => {
  const modules = [
    './catalog-data.js',
    './site-core.js',
    './catalog.js',
    './order-demo.js',
    './public-pages.js',
    './public-extra.js',
    './dialogs.js',
  ];

  const load = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
    document.head.append(script);
  });

  modules.reduce((chain, src) => chain.then(() => load(src)), Promise.resolve())
    .catch((error) => console.error('[deliver-prime]', error));
})();
