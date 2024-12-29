// /backend/api/spin.js

const dbConnect = require("./utils/dbConnect");
const User = require("./models/User");
const Cors = require("micro-cors");
const prizes = require("./shared/prizes"); // Importar la lista de premios desde el módulo compartido

// Configurar CORS
const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
  origin: "https://tu-frontend.vercel.app", // Reemplaza con la URL real de tu frontend
});

/**
 * Función para seleccionar un premio basado en las probabilidades.
 * @param {Array} prizes - Lista de premios con probabilidades.
 * @returns {Object} - Premio seleccionado.
 */
function getPrize(prizes) {
  const random = Math.random() * 100;
  let sum = 0;
  for (const prize of prizes) {
    sum += prize.probability;
    if (random <= sum) {
      return prize;
    }
  }
  // Por seguridad, retornar "Sigue intentando" si no se encuentra ningún premio
  return { text: "Sigue intentando", probability: 100 };
}

const handler = async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido." });
  }

  const { plate } = req.body;

  if (!plate) {
    return res.status(400).json({ message: "Placa es requerida." });
  }

  try {
    console.log(`Recibiendo solicitud de giro para la placa: ${plate}`);
    await dbConnect();
    const user = await User.findOne({ plate });
    if (!user) {
      console.warn(`Usuario no encontrado para la placa: ${plate}`);
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.spinsAvailable <= 0) {
      console.warn(`Usuario con placa ${plate} sin giros disponibles.`);
      return res.status(400).json({ message: "No tienes giros disponibles." });
    }

    user.spinsAvailable -= 1;
    console.log(`Usuario ${plate} tiene ${user.spinsAvailable} giros restantes.`);

    let prize = getPrize(prizes);

    if (!prize || !prize.text) {
      console.error("Premio generado inválido:", prize);
      prize = { text: "Sigue intentando", probability: 100 };
    }

    console.log(`Premio obtenido: ${prize.text}`);

    // Manejar giros adicionales y premios
    if (prize.text.toLowerCase() === "un giro adicional") {
      user.spinsAvailable += 1;
      console.log(`Usuario ${plate} ha recibido un giro adicional.`);
    } else if (
      prize.text.toLowerCase() !== "sigue intentando" &&
      prize.text.toLowerCase() !== "giro adicional"
    ) {
      // Verificar si el premio ya existe para evitar duplicados
      const existingPrize = user.prizes.find(
        (p) => p.text.toLowerCase() === prize.text.toLowerCase()
      );
      if (!existingPrize) {
        user.prizes.push({
          text: prize.text.trim(),
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días de validez
          claimed: false,
        });
        console.log(`Premio agregado para el usuario ${plate}: ${prize.text}`);
      } else {
        console.log(`Premio ya existente para el usuario ${plate}: ${prize.text}`);
      }
    }

    await user.save();
    console.log(`Usuario ${plate} actualizado exitosamente.`);

    // Calcular stopAngle basado en el índice del premio
    const prizeIndex = prizes.findIndex((p) => p.text === prize.text);
    if (prizeIndex === -1) {
      console.error("Premio no encontrado en la lista de premios:", prize.text);
      return res.status(500).json({ message: "Premio inválido." });
    }

    const segmentAngle = 360 / prizes.length;
    const pointerAngle = 270; // Alinear con el puntero en el lado izquierdo

    const prizeCenterAngle = prizeIndex * segmentAngle + segmentAngle / 2;
    // Fórmula corregida para dirección horaria
    const stopAngle = (prizeCenterAngle - pointerAngle + 360) % 360;

    console.log(`Prize Index: ${prizeIndex}, Prize Center Angle: ${prizeCenterAngle}°`);
    console.log(`Stop Angle Calculado para el premio "${prize.text}": ${stopAngle} grados`);

    // Respuesta exitosa con stopAngle y probability
    return res.status(200).json({
      message: "Giro procesado correctamente.",
      prize: { text: prize.text.trim(), probability: prize.probability },
      stopAngle: stopAngle,
      spinsAvailable: user.spinsAvailable,
      prizes: user.prizes,
    });
  } catch (err) {
    console.error("Error en /api/spin:", err.message);
    return res.status(500).json({
      message: "Error al procesar el giro.",
      error: err.message,
    });
  }
};

module.exports = cors(handler);
