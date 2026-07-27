import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
const requiredFiles = [
  'index.html', 'styles.css', 'lab.css', 'order.css', 'ecosystem.css', 'conversion.css', 'modal.css', 'responsive.css',
  'script.js', 'catalog-data.js', 'site-core.js', 'catalog.js', 'order-demo.js', 'public-pages.js', 'public-extra.js', 'dialogs.js',
  '.nojekyll', 'assets/hero-vision.svg', 'assets/icon-order.svg', 'assets/icon-track.svg', 'assets/icon-receive.svg',
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
    'ARMA UN', 'TRES PASOS.', 'VENDE MÁS.', 'MUÉVETE.', 'MÁS QUE UNA APP.', 'ENTRA<br />ANTES',
    'Soporte 24/7', 'En vivo · 12 min estimados', 'data-public-modal', 'data-demo-modal',
  ];
  for (const marker of markers) if (!html.includes(marker)) failures.push(`index.html no contiene: ${marker}`);

  for (const forbidden of ['PROTOTIPO VISUAL', 'Sin operaciones, cobros ni métricas reales', 'demo-notice']) {
    if (html.includes(forbidden)) failures.push(`index.html conserva texto o estructura eliminada: ${forbidden}`);
  }

  const localRefs = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map((match) => match[1]);
  for (const ref of localRefs) {
    const target = normalize(join(dirname(htmlPath), ref));
    if (!target.startsWith(root) || !existsSync(target)) failures.push(`Referencia local inválida: ${ref}`);
  }
  if (/href="\s*"|src="\s*"/.test(html)) failures.push('index.html contiene referencias vacías');
  if (/<!--\s*(?:TODO|FIXME)/.test(html)) failures.push('index.html contiene marcadores pendientes');
}

const scriptFiles = ['script.js', 'catalog-data.js', 'site-core.js', 'catalog.js', 'order-demo.js', 'public-pages.js', 'public-extra.js', 'dialogs.js'];
const scripts = scriptFiles.filter((file) => existsSync(join(root, file))).map((file) => readFileSync(join(root, file), 'utf8')).join('\n');
if (scripts.includes('eval(') || scripts.includes('innerHTML')) failures.push('Los scripts usan una operación no permitida');
for (const marker of ['BARRIO BURGER', 'coverage', 'security', 'orderStates', 'openPublic']) {
  if (!scripts.includes(marker)) failures.push(`Los scripts no contienen: ${marker}`);
}

if (existsSync(join(root, 'organization.js'))) failures.push('organization.js ya no debe existir: el contenido quedó consolidado en HTML');

for (const legacy of ['process.css', 'trust.css', 'evidence.css', 'COVERAGE-TRUST.md', 'EVIDENCE-POLICY.md', 'REUSE-MAP.md', 'IMPLEMENTATION.md']) {
  if (existsSync(join(root, legacy))) failures.push(`Permanece un archivo de la interpretación anterior: ${legacy}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[verify:error] ${failure}`));
  process.exit(1);
}
console.log('[verify] Rediseño organizado, sin aviso y con paridad de contenido validado correctamente');
