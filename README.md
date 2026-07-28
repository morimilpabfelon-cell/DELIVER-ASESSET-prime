# DELIVER ASSETS Prime

Rediseño público de DELIVER ASSETS para presentar la visión del producto con una composición 60/30/10, manteniendo la arquitectura de contenido y los mensajes del prototipo original.

## Fuente de verdad

- Contenido y narrativa: `DELIVER-ASSETS`.
- Diseño visual: Figma `Strong Vision Master`.
- Implementación pública: `DELIVER-ASESSET-prime`.
- Publicación: GitHub Pages desde `main / (root)`.

## Variantes visuales

Las dos variantes comparten la misma estructura funcional, pero sus estilos permanecen aislados:

- Noche, variante existente y predeterminada: `/index.html`.
- Día, basada en `DAY FINAL` de Figma: `/day.html`.

`day-final.css` solo se activa cuando el documento contiene `data-theme="day"`. El render nocturno no recibe reglas visuales de la variante diurna.

## Ejecución local

```powershell
node --check catalog-data.js
node --check script.js
node --check site-core.js
node --check catalog.js
node --check order-demo.js
node --check public-pages.js
node --check public-extra.js
node --check dialogs.js
node --check day-theme.js
node scripts/verify-site.mjs
python -m http.server 8080
```

Abrir:

- Noche: `http://localhost:8080/`.
- Día: `http://localhost:8080/day.html`.

## Restricciones

- Sitio estático sin dependencias de producción.
- No procesa pagos.
- No guarda formularios.
- No autentica usuarios.
- No presenta operaciones o métricas como reales.
