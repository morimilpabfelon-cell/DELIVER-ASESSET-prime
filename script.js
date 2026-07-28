(() => {
  const styles = [
    './lab.css',
    './order.css',
    './ecosystem.css',
    './conversion.css',
    './modal.css',
    './responsive.css',
    './polish.css',
    './strong-vision.css',
    './strong-vision-hero.css',
    './strong-vision-experience.css',
    './night-final.css',
    './night-assets.css',
    './day-final.css',
  ];
  const modules = [
    './catalog-data.js',
    './site-core.js',
    './catalog.js',
    './order-demo.js',
    './public-pages.js',
    './public-extra.js',
    './dialogs.js',
    './night-assets.js',
    './night-theme.js',
    './day-theme.js',
  ];

  styles.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
  });

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