// /backend/api/shared/prizes.js

const prizes = [
  { text: "10 soles de descuento", probability: 28 },
  { text: "50 soles de descuento", probability: 7 },
  { text: "100 soles de descuento", probability: 1 },
  { text: "Cargador de cigarrera", probability: 1 },
  { text: "Consola gratis", probability: 2 },
  { text: "Mica de vidrio gratis", probability: 8 },
  { text: "Parlantes gratis", probability: 2 },
  { text: "Un giro adicional", probability: 11 },
  { text: "RADIO 100% GRATIS", probability: 0 },
  { text: "20% de descuento", probability: 0 },
  { text: "Sigue intentando", probability: 34 },
  { text: "10% de descuento", probability: 10 },
  // { text: "50% de descuento", probability: 0.12 }, // Eliminado para sumar exactamente 100%
];

module.exports = prizes;
