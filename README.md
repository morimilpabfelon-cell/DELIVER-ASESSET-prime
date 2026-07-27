# DELIVER ASSETS Prime

Rediseño público de DELIVER ASSETS para presentar la visión del producto con una composición 60/30/10, manteniendo la arquitectura de contenido y los mensajes del prototipo original.

## Fuente de verdad

- Contenido y narrativa: `DELIVER-ASSETS`.
- Diseño visual: `DELIVER-ASESSET-prime`.
- Publicación: GitHub Pages desde `main / (root)`.

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
node scripts/verify-site.mjs
python -m http.server 8080
```

Abrir `http://localhost:8080`.

## Restricciones

- Sitio estático sin dependencias de producción.
- No procesa pagos.
- No guarda formularios.
- No autentica usuarios.
- No presenta operaciones o métricas como reales.
