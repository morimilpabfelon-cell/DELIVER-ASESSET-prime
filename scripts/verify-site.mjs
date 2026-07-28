import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
const required = [
  'index.html', 'day.html', 'figma-night.css', 'figma-night.js',
  '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.nojekyll',
  'assets/favicon.svg', 'assets/og-deliver-assets.svg',
  'assets/figma-night/hero-desktop.png', 'assets/figma-night/hero-tablet.png', 'assets/figma-night/hero-mobile.png',
  'assets/figma-night/manifesto-desktop.png', 'assets/figma-night/manifesto-mobile.png',
  'assets/figma-night/map-desktop.png', 'assets/figma-night/map-tablet.png', 'assets/figma-night/map-mobile.png',
  'assets/figma-night/process-pide-desktop.png', 'assets/figma-night/process-mira-desktop.png', 'assets/figma-night/process-recibe-desktop.png',
  'assets/figma-night/process-pide-tablet.png', 'assets/figma-night/process-mira-tablet.png', 'assets/figma-night/process-recibe-tablet.png',
  'assets/figma-night/process-pide-mobile.png', 'assets/figma-night/process-mira-mobile.png', 'assets/figma-night/process-recibe-mobile.png',
  'assets/figma-night/business-desktop.png', 'assets/figma-night/rider-desktop.png',
  'assets/figma-night/business-tablet.png', 'assets/figma-night/rider-tablet.png',
  'assets/figma-night/business-mobile.png', 'assets/figma-night/rider-mobile.png',
];

for (const file of required) {
  const path = join(root, file);
  if (!existsSync(path)) failures.push(`Falta ${file}`);
  else if (file !== '.nojekyll' && statSync(path).size === 0) failures.push(`${file} está vacío`);
}

const read = (file) => readFileSync(join(root, file), 'utf8');
const html = existsSync(join(root, 'index.html')) ? read('index.html') : '';
const css = existsSync(join(root, 'figma-night.css')) ? read('figma-night.css') : '';
const js = existsSync(join(root, 'figma-night.js')) ? read('figma-night.js') : '';
const day = existsSync(join(root, 'day.html')) ? read('day.html') : '';

for (const marker of [
  'data-render="figma-night"', 'figma-night.css', 'figma-night.js',
  'ENTREGA ESTIMADA · 12 MIN', '¿QUÉ NECESITAS HOY?', '03 / MANIFIESTO',
  '04 / EXPERIENCIA INTERACTIVA', 'TRES PASOS. CERO RUIDO.',
  'VENDE MÁS.', 'MUÉVETE.', 'LLEVEMOS ESTA VISIÓN', 'data-dialog',
]) if (!html.includes(marker)) failures.push(`index.html no contiene ${marker}`);

for (const forbidden of ['script.js', 'styles.css', 'night-theme.js', 'night-assets.js', 'data-theme="night"']) {
  if (html.includes(forbidden)) failures.push(`index.html conserva dependencia heredada: ${forbidden}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const anchor of [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
  if (!ids.has(anchor)) failures.push(`Ancla sin destino: #${anchor}`);
}

for (const ref of [...html.matchAll(/(?:href|src)="(\.\/[^\"]+)"/g)].map((match) => match[1])) {
  const clean = ref.split('#')[0].split('?')[0];
  const target = normalize(join(dirname(join(root, 'index.html')), clean));
  if (!target.startsWith(root) || !existsSync(target)) failures.push(`Referencia local inválida: ${ref}`);
}

for (const marker of [
  'Desktop 2:77', 'Tablet 2:229', 'Mobile 2:381',
  'hero-desktop.png', 'hero-tablet.png', 'hero-mobile.png',
  'manifesto-desktop.png', 'manifesto-mobile.png',
  'map-desktop.png', 'map-tablet.png', 'map-mobile.png',
  'process-pide-desktop.png', 'process-pide-tablet.png', 'process-pide-mobile.png',
  'business-desktop.png', 'business-tablet.png', 'business-mobile.png',
  '@media (max-width: 900px)', '@media (max-width: 600px)', 'font-family: var(--display)',
]) if (!css.includes(marker)) failures.push(`figma-night.css no contiene ${marker}`);

for (const forbidden of ['Arial Black', 'hero-night-v2.svg', 'business-ops-v2.svg', 'rider-ops-v2.svg']) {
  if (css.includes(forbidden)) failures.push(`figma-night.css conserva sustituto: ${forbidden}`);
}

for (const marker of ['storeSets', 'activateCategory', 'showModal()', 'data-contact', 'aria-selected']) {
  if (!js.includes(marker)) failures.push(`figma-night.js no contiene ${marker}`);
}
if (js.includes('innerHTML') || js.includes('eval(')) failures.push('figma-night.js usa una operación no permitida');

for (const marker of ['data-theme="day"', '53791ae703a656f2f510e122cc387120324c3f40/index.html', 'DAY FINAL']) {
  if (!day.includes(marker)) failures.push(`day.html no contiene ${marker}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[verify:error] ${failure}`));
  process.exit(1);
}
console.log('[verify] Implementación nocturna dedicada y render de día aislado validados');