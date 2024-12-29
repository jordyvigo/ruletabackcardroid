// /backend/api/spin-config.js

const dbConnect = require("./utils/dbConnect");
const prizes = require("./shared/prizes"); // Importar la lista de premios desde el módulo compartido

function getFillStyle(text) {
  const colorMap = {
    "10 soles de descuento": "#FF6347",
    "50 soles de descuento": "#32CD32",
    "100 soles de descuento": "#87CEEB",
    "Cargador de cigarrera": "#FFD700",
    "Consola gratis": "#8A2BE2",
    "Mica de vidrio gratis": "#555555",
    "Parlantes gratis": "#FFA07A",
    "Un giro adicional": "#20B2AA",
    "RADIO 100% GRATIS": "#FF1493",
    "20% de descuento": "#32CD32",
    "Sigue intentando": "#8B0000",
    "10% de descuento": "#4B0082",
    // "50% de descuento": "#FFA500", // Eliminado
  };

  return colorMap[text] || "#000000"; // Color por defecto si no se encuentra
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido." });
  }

  try {
    await dbConnect();
    console.log("Conectado a MongoDB para /api/spin-config");

    const segments = prizes.map((prize) => ({
      text: prize.text,
      fillStyle: getFillStyle(prize.text),
    }));

    // Validar segmentos
    const invalidSegments = segments.filter(
      (segment) => !segment.text || typeof segment.text !== "string"
    );
    if (invalidSegments.length > 0) {
      console.error("Segmentos inválidos encontrados:", invalidSegments);
      throw new Error("Se encontraron segmentos con texto inválido.");
    }

    return res.status(200).json({ segments });
  } catch (error) {
    console.error("Error en /api/spin-config:", error.message);
    return res.status(500).json({
      message: "Error al cargar la configuración de la ruleta.",
      error: error.message,
    });
  }
};
