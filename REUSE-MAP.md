# Mapa de reutilización desde DELIVER-ASSETS

## Objetivo

Acelerar `DELIVER-ASESSET-prime` reutilizando activos propios del prototipo original sin importar su deuda técnica ni convertir la web institucional en otra aplicación monolítica.

## Reutilización aprobada

### Identidad y lenguaje

- Wordmark `DELIVER / ASSETS`.
- Proporción tipográfica compacta, interletraje negativo y apilado de marca.
- Frases de marca y lenguaje operativo que sean coherentes con la visión oficial.
- Secuencia `PIDE / MIRA / RECIBE` adaptada a `PIDE / SIGUE / RECIBE` cuando corresponda.

### Componentes visuales sin estado

- Iconos SVG de flecha, ubicación y movilidad.
- Patrones de botones y navegación.
- Tarjetas de categorías.
- Indicadores de estado visual.
- Composiciones de mapa, ruta y teléfono cuando no contengan lógica simulada.

### Contenido y estructura comercial

- Categorías: comida, mercado, farmacia y envíos.
- Mensajes sobre cliente, negocio, repartidor y administración.
- Descripciones generales de operación, cobertura, seguridad y trazabilidad.
- Estructuras de páginas públicas, ayuda y estado únicamente como referencia de contenido.

### Accesibilidad y responsive

- Navegación con teclado.
- Etiquetas ARIA válidas.
- Cierre de navegación con `Escape`.
- Estados `:focus-visible`.
- Regla `prefers-reduced-motion`.
- Breakpoints y patrones responsive que hayan demostrado utilidad.

## Reutilización prohibida

- Copiar `src/App.tsx` completo.
- Copiar `src/styles.css` completo.
- Autenticación simulada, códigos fijos o permisos en memoria.
- Pagos, saldos, tarjetas, liquidaciones o métricas ficticias presentadas como reales.
- Temporizadores que simulan pedidos o soporte.
- Datos personales ficticios, teléfonos, direcciones y perfiles operativos.
- Dependencia de Google Fonts mediante `@import`.
- Configuración obsoleta de Vite o GitHub Pages.
- Backend inexistente, estados locales o flujos de demo como si fueran producto real.

## Regla de integración

1. Una pieza reutilizable por objetivo.
2. Adaptarla al sistema 60/30/10 de Prime.
3. Mantener HTML semántico y funcionamiento sin dependencias externas.
4. Ejecutar `node scripts/verify-site.mjs`.
5. Confirmar GitHub Actions en verde.
6. No fusionar sin revisión visual.

## Extracciones completadas

- [x] Wordmark y tokens de marca consolidados en la página pública.
- [x] Secuencia operativa `PIDE / SIGUE / RECIBE`.
- [x] Iconos SVG propios de acción, ubicación y movilidad.
- [x] Patrones de navegación, foco visible y reducción de movimiento.

## Próximas extracciones

1. Revisar textos institucionales de categorías y ecosistema.
2. Incorporar una vista conceptual de cobertura y zonas.
3. Reutilizar componentes de confianza y soporte sin promesas operativas no verificadas.
4. Añadir una capa de evidencia para tesis, métricas y supuestos fechados.
