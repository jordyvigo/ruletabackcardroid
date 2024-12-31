// /backend/api/shared/prizes.js

const prizes = [
  { text: "10 soles de descuento", probability: 24 },      // De 28 a 24 (-4)
  { text: "50 soles de descuento", probability: 10 },      // De 7 a 10 (+3)
  { text: "100 soles de descuento", probability: 1 },      // Sin cambios
  { text: "Cargador de cigarrera", probability: 1 },      // Sin cambios
  { text: "Consola gratis", probability: 2 },              // Sin cambios
  { text: "Mica de vidrio gratis", probability: 7 },       // De 8 a 7 (-1)
  { text: "Parlantes gratis", probability: 2 },            // Sin cambios
  { text: "Un giro adicional", probability: 9 },           // De 11 a 9 (-2)
  { text: "RADIO 100% GRATIS", probability: 0 },           // Sin cambios
  { text: "20% de descuento", probability: 5 },            // De 0 a 5 (+5)
  { text: "Sigue intentando", probability: 26 },            // De 34 a 26 (-8)
  { text: "10% de descuento", probability: 10 },           // Sin cambios
];


module.exports = prizes;
