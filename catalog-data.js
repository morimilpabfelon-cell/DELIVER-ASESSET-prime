const stores = {
  comida: [
    { name: 'BARRIO BURGER', descriptor: 'Smash burgers · papas · combos', item: 'Combo Doble DA', price: 31.9, eta: '18–26 MIN', rating: '4.8', symbol: 'B' },
    { name: 'CASA WOK', descriptor: 'Arroz · noodles · bowls', item: 'Wok Teriyaki', price: 27.5, eta: '22–30 MIN', rating: '4.7', symbol: 'W' },
    { name: 'PIZZA 33', descriptor: 'Pizza artesanal · bebidas', item: 'Pizza Pepperoni', price: 39.9, eta: '25–35 MIN', rating: '4.9', symbol: '33' },
  ],
  mercado: [
    { name: 'MERCADO 24', descriptor: 'Abarrotes · frutas · hogar', item: 'Canasta Esencial', price: 42.8, eta: '20–32 MIN', rating: '4.6', symbol: '24' },
    { name: 'FRESCO', descriptor: 'Frutas · verduras · orgánico', item: 'Pack Fresco', price: 34.6, eta: '24–36 MIN', rating: '4.8', symbol: 'F' },
    { name: 'BODEGA NORTE', descriptor: 'Bebidas · snacks · básicos', item: 'Pack Reunión', price: 29.9, eta: '15–22 MIN', rating: '4.5', symbol: 'BN' },
  ],
  farmacia: [
    { name: 'FARMA CENTRAL', descriptor: 'Cuidado · higiene · bienestar', item: 'Kit Esencial', price: 24.9, eta: '16–25 MIN', rating: '4.9', symbol: '+' },
    { name: 'VITA', descriptor: 'Dermocosmética · cuidado diario', item: 'Pack Cuidado', price: 46.2, eta: '23–31 MIN', rating: '4.7', symbol: 'V' },
    { name: 'BOTICA 7', descriptor: 'Higiene · bebés · primeros auxilios', item: 'Botiquín Casa', price: 38.7, eta: '17–28 MIN', rating: '4.6', symbol: '7' },
  ],
  envios: [
    { name: 'DA EXPRESS', descriptor: 'Documentos · paquetes pequeños', item: 'Envío inmediato', price: 12.9, eta: 'RECOJO 12 MIN', rating: '4.9', symbol: '↗' },
    { name: 'RUTA LOCAL', descriptor: 'Paquetes · entregas programadas', item: 'Ruta punto a punto', price: 16.5, eta: 'RECOJO 18 MIN', rating: '4.8', symbol: 'R' },
    { name: 'FLASH BOX', descriptor: 'Última milla · comercio local', item: 'Entrega prioritaria', price: 19.9, eta: 'RECOJO 10 MIN', rating: '4.7', symbol: 'F' },
  ],
};

const orderStates = [
  { label: 'ELIGE UN PRODUCTO', detail: 'El recorrido comienza cuando agregas un producto.', step: 0 },
  { label: 'PEDIDO LISTO', detail: 'Confirma para iniciar el recorrido.', step: 1 },
  { label: 'CONFIRMANDO', detail: 'El comercio está preparando tu pedido.', step: 2 },
  { label: 'REPARTIDOR ASIGNADO', detail: 'El repartidor ya va hacia el comercio.', step: 3 },
  { label: 'EN CAMINO', detail: 'Tu entrega está avanzando por la ciudad.', step: 4 },
  { label: 'ENTREGADO', detail: 'Pedido completado. Flujo cerrado.', step: 5 },
];

const state = { category: 'comida', storeIndex: 0, quantity: 0, orderStep: 0, timers: [] };
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const clear = (target) => { while (target?.firstChild) target.removeChild(target.firstChild); };
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
