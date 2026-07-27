import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];

const requiredFiles = [
  'index.html',
  'styles.css',
  'process.css',
  'trust.css',
  'evidence.css',
  'script.js',
  'assets/hero-vision.svg',
  'assets/icon-order.svg',
  'assets/icon-track.svg',
  'assets/icon-receive.svg',
  'assets/coverage-map.svg',
  '.nojekyll',
];

for (const file of requiredFiles) {
  const absolute = join(root, file);
  if (!existsSync(absolute)) {
    failures.push(`Falta el archivo requerido: ${file}`);
  } else if (file !== '.nojekyll' && statSync(absolute).size === 0) {
    failures.push(`El archivo está vacío: ${file}`);
  }
}

const htmlPath = join(root, 'index.html');
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  const requiredMarkers = [
    '<!doctype html>',
    'lang="es"',
    'id="contenido"',
    'id="como-funciona"',
    'id="cobertura"',
    'id="evidencia"',
    'href="./styles.css"',
    'href="./process.css"',
    'href="./trust.css"',
    'href="./evidence.css"',
    'src="./script.js"',
    'src="./assets/hero-vision.svg"',
    'src="./assets/icon-order.svg"',
    'src="./assets/icon-track.svg"',
    'src="./assets/icon-receive.svg"',
    'src="./assets/coverage-map.svg"',
    'No se promete 24/7 sin personal y SLA.',
    'No representa zonas activas ni cobertura comercial actual.',
    'SIN RESULTADOS PUBLICADOS',
    'No se publican proyecciones como resultados.',
  ];

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      failures.push(`index.html no contiene: ${marker}`);
    }
  }

  const localRefs = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map((match) => match[1]);
  for (const ref of localRefs) {
    const target = normalize(join(dirname(htmlPath), ref));
    if (!target.startsWith(root) || !existsSync(target)) {
      failures.push(`Referencia local inválida: ${ref}`);
    }
  }

  if (/href="\s*"|src="\s*"/.test(html)) {
    failures.push('index.html contiene referencias vacías');
  }

  if (/(?:TODO|FIXME|PLACEHOLDER)/.test(html)) {
    failures.push('index.html contiene marcadores pendientes');
  }
}

const scriptPath = join(root, 'script.js');
if (existsSync(scriptPath)) {
  const script = readFileSync(scriptPath, 'utf8');
  if (script.includes('eval(') || script.includes('innerHTML')) {
    failures.push('script.js usa una operación no permitida');
  }
}

if (existsSync(join(root, 'site'))) {
  failures.push('La carpeta legacy site/ todavía existe; Pages debe publicar desde el raíz');
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[verify:error] ${failure}`);
  }
  process.exit(1);
}

console.log('[verify] Sitio, confianza y marco de evidencia validados correctamente');
