import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
const requiredFiles = [
  'index.html', 'day.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
  'styles.css', 'lab.css', 'order.css', 'ecosystem.css', 'conversion.css', 'modal.css', 'responsive.css', 'polish.css',
  'strong-vision.css', 'strong-vision-hero.css', 'strong-vision-experience.css', 'day-final.css',
  'script.js', 'catalog-data.js', 'site-core.js', 'catalog.js', 'order-demo.js', 'public-pages.js', 'public-extra.js', 'dialogs.js', 'day-theme.js',
  '.nojekyll', 'assets/hero-official.svg', 'assets/hero-strong-v2.webp', 'assets/hero-night-v2.svg',
  'assets/business-ops-v2.svg', 'assets/rider-ops-v2.svg',
  'assets/og-deliver-assets.svg', 'assets/favicon.svg', 'assets/icon-order.svg', 'assets/icon-track.svg', 'assets/icon-receive.svg',
];

for (const file of requiredFiles) {
  const absolute = join(root, file);
  if (!existsSync(absolute)) failures.push(`Falta el archivo requerido: ${file}`);
  else if (file !== '.nojekyll' && statSync(absolute).size === 0) failures.push(`El archivo está vacío: ${file}`);
}

const htmlPath = join(root, 'index.html');
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  const markers = [
    '<!doctype html>', 'lang="es"', 'id="contenido"',
    'PIDE LO QUE QUIERAS.', 'MUÉVELO SIN VUELTAS.', 'NO ES SOLO', 'TODO CABE EN EL MISMO',
    'ARMA UN', 'TRES PASOS.', 'VENDE MÁS.', 'MUÉVETE.', 'MÁS QUE UNA APP.',
    'ENTREGA ESTIMADA · 12 MIN', 'assets/hero-official.svg', 'LLEVEMOS<br />ESTA VISIÓN',
    'data-open-public="contact"', 'data-public-modal', 'data-demo-modal',
    'rel="canonical"', 'site.webmanifest', 'assets/favicon.svg', 'assets/og-deliver-assets.svg',
  ];
  for (const marker of markers) if (!html.includes(marker)) failures.push(`index.html no contiene: ${marker}`);

  const forbidden = [
    'PROTOTIPO VISUAL',
    'Sin operaciones, cobros ni métricas reales',
    'ABRIR DEMO',
    'DEMO / PEDIDO',
    'Simulación de pedido',
    'La simulación',
    'data-signup-form',
    'REGISTRO RECIBIDO',
    'Soporte 24/7',
    'Siempre disponible.',
    '🍔',
    '🛒',
  ];
  for (const text of forbidden) if (html.includes(text)) failures.push(`index.html conserva texto o activo retirado: ${text}`);

  const localRefs = [...html.matchAll(/(?:href|src)="(\.\/[^\"]+)"/g)].map((match) => match[1]);
  for (const ref of localRefs) {
    const fileRef = ref.split('#')[0].split('?')[0];
    const target = normalize(join(dirname(htmlPath), fileRef));
    if (!target.startsWith(root) || !existsSync(target)) failures.push(`Referencia local inválida: ${ref}`);
  }

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const anchor of anchors) if (!ids.has(anchor)) failures.push(`Ancla sin destino: #${anchor}`);

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!/\salt="[^"]*"/.test(tag)) failures.push(`Imagen sin atributo alt: ${tag.slice(0, 90)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) failures.push(`Imagen sin dimensiones: ${tag.slice(0, 90)}`);
  }
  for (const match of html.matchAll(/<svg\b[^>]*class="(?:category-icon|tab-icon|hub-icon)"[^>]*>/g)) {
    const tag = match[0];
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) failures.push(`Icono SVG sin dimensiones: ${tag.slice(0, 90)}`);
  }

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/\srel="[^"]*noreferrer[^"]*"/.test(match[0])) failures.push('Existe un enlace target="_blank" sin rel="noreferrer"');
  }

  if (!html.includes('https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-prime/')) failures.push('Falta la URL pública canónica');
  if (/href="\s*"|src="\s*"/.test(html)) failures.push('index.html contiene referencias vacías');
  if (/<!--\s*(?:TODO|FIXME)/.test(html)) failures.push('index.html contiene marcadores pendientes');
}

const dayPath = join(root, 'day.html');
if (existsSync(dayPath)) {
  const day = readFileSync(dayPath, 'utf8');
  for (const marker of ['data-theme="day"', "fetch('./index.html'", 'DELIVER ASSETS — DAY FINAL', 'noindex, follow']) {
    if (!day.includes(marker)) failures.push(`day.html no contiene: ${marker}`);
  }
  if (day.includes('hero-night-v2.svg')) failures.push('day.html no debe acoplarse directamente al activo nocturno');
}

const manifestPath = join(root, 'site.webmanifest');
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (manifest.name !== 'DELIVER ASSETS') failures.push('site.webmanifest tiene un nombre inesperado');
    if (manifest.start_url !== './' || manifest.scope !== './') failures.push('site.webmanifest no está limitado al proyecto Pages');
    if (!Array.isArray(manifest.icons) || !manifest.icons.some((icon) => icon.src === './assets/favicon.svg')) failures.push('site.webmanifest no referencia el favicon');
  } catch {
    failures.push('site.webmanifest no contiene JSON válido');
  }
}

const robots = existsSync(join(root, 'robots.txt')) ? readFileSync(join(root, 'robots.txt'), 'utf8') : '';
if (!robots.includes('Allow: /') || !robots.includes('/DELIVER-ASESSET-prime/sitemap.xml')) failures.push('robots.txt no contiene reglas y sitemap válidos');

const sitemap = existsSync(join(root, 'sitemap.xml')) ? readFileSync(join(root, 'sitemap.xml'), 'utf8') : '';
if (!sitemap.includes('<urlset') || !sitemap.includes('https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-prime/')) failures.push('sitemap.xml no contiene la URL pública');

const notFound = existsSync(join(root, '404.html')) ? readFileSync(join(root, '404.html'), 'utf8') : '';
if (!notFound.includes('ERROR 404') || !notFound.includes('/DELIVER-ASESSET-prime/') || !notFound.includes('name="robots" content="noindex"')) failures.push('404.html no ofrece recuperación y noindex válidos');

const og = existsSync(join(root, 'assets/og-deliver-assets.svg')) ? readFileSync(join(root, 'assets/og-deliver-assets.svg'), 'utf8') : '';
if (!og.includes('width="1200"') || !og.includes('height="630"') || !og.includes('DELIVER ASSETS')) failures.push('La imagen Open Graph SVG no cumple 1200×630');

for (const iconClass of ['category-icon', 'tab-icon', 'hub-icon']) {
  if (!readFileSync(htmlPath, 'utf8').includes(`class="${iconClass}"`)) failures.push(`Falta iconografía inline: ${iconClass}`);
}

const scriptFiles = ['script.js', 'catalog-data.js', 'site-core.js', 'catalog.js', 'order-demo.js', 'public-pages.js', 'public-extra.js', 'dialogs.js', 'day-theme.js'];
const scripts = scriptFiles.filter((file) => existsSync(join(root, file))).map((file) => readFileSync(join(root, file), 'utf8')).join('\n');
if (scripts.includes('eval(') || scripts.includes('innerHTML')) failures.push('Los scripts usan una operación no permitida');
for (const marker of ['polish.css', 'strong-vision.css', 'strong-vision-hero.css', 'strong-vision-experience.css', 'day-final.css', 'day-theme.js', 'BARRIO BURGER', 'store-mark', 'store-meta', 'coverage', 'security', 'contact', 'orderStates', 'openPublic', 'data-theme']) {
  if (!scripts.includes(marker)) failures.push(`Los scripts no contienen: ${marker}`);
}
for (const text of ['La simulación', 'demostración visual', 'No operativos', 'data-signup-form']) {
  if (scripts.includes(text)) failures.push(`Los scripts conservan texto o lógica retirada: ${text}`);
}

const visionPath = join(root, 'strong-vision.css');
if (existsSync(visionPath)) {
  const vision = readFileSync(visionPath, 'utf8');
  for (const marker of ['hero-strong-v2.webp', '¿QUÉ NECESITAS HOY?', '.public-hub-grid', '@media (max-width: 580px)']) {
    if (!vision.includes(marker)) failures.push(`strong-vision.css no contiene: ${marker}`);
  }
}

const heroStylePath = join(root, 'strong-vision-hero.css');
if (existsSync(heroStylePath)) {
  const heroStyle = readFileSync(heroStylePath, 'utf8');
  for (const marker of ['hero-night-v2.svg', '.hero-visual', '@media (max-width: 580px)']) {
    if (!heroStyle.includes(marker)) failures.push(`strong-vision-hero.css no contiene: ${marker}`);
  }
}

const experienceStylePath = join(root, 'strong-vision-experience.css');
if (existsSync(experienceStylePath)) {
  const experienceStyle = readFileSync(experienceStylePath, 'utf8');
  for (const marker of ['.product-lab', '.process-grid', 'business-ops-v2.svg', 'rider-ops-v2.svg', '@media (max-width: 580px)', 'prefers-reduced-motion']) {
    if (!experienceStyle.includes(marker)) failures.push(`strong-vision-experience.css no contiene: ${marker}`);
  }
}

const dayStylePath = join(root, 'day-final.css');
if (existsSync(dayStylePath)) {
  const dayStyle = readFileSync(dayStylePath, 'utf8');
  for (const marker of ['html[data-theme="day"]', 'hero-official.svg', '.public-hub-grid', '.manifesto', '.product-lab', '.process-grid', '.ecosystem-panel', '@media (max-width: 860px)', 'prefers-reduced-motion']) {
    if (!dayStyle.includes(marker)) failures.push(`day-final.css no contiene: ${marker}`);
  }
  const unscopedSelector = dayStyle.split('\n').find((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('@')) return false;
    if (!/\.(?:hero|categories|public-hub|manifesto|product-lab|process|ecosystem|contact-cta|site-footer)\b/.test(trimmed)) return false;
    return !trimmed.startsWith('html[data-theme="day"]');
  });
  if (unscopedSelector) failures.push(`day-final.css contiene selector no encapsulado: ${unscopedSelector.trim()}`);
}

const heroVectorPath = join(root, 'assets/hero-night-v2.svg');
if (existsSync(heroVectorPath)) {
  const heroVector = readFileSync(heroVectorPath, 'utf8');
  for (const marker of ['width="1200"', 'height="900"', 'DELIVER ASSETS', 'EN CAMINO']) {
    if (!heroVector.includes(marker)) failures.push(`hero-night-v2.svg no contiene: ${marker}`);
  }
}

for (const [file, markers] of [
  ['assets/business-ops-v2.svg', ['width="1200"', 'height="800"', 'Panel operativo para negocios']],
  ['assets/rider-ops-v2.svg', ['width="1200"', 'height="800"', 'Ruta operativa para repartidores']],
]) {
  const path = join(root, file);
  if (existsSync(path)) {
    const asset = readFileSync(path, 'utf8');
    for (const marker of markers) if (!asset.includes(marker)) failures.push(`${file} no contiene: ${marker}`);
  }
}

if (existsSync(join(root, 'organization.js'))) failures.push('organization.js no debe existir');
for (const legacy of ['process.css', 'trust.css', 'evidence.css', 'COVERAGE-TRUST.md', 'EVIDENCE-POLICY.md', 'REUSE-MAP.md', 'IMPLEMENTATION.md']) {
  if (existsSync(join(root, legacy))) failures.push(`Permanece un archivo de la interpretación anterior: ${legacy}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[verify:error] ${failure}`));
  process.exit(1);
}
console.log('[verify] Night, DAY FINAL, experiencia, SEO y Pages validados correctamente');
