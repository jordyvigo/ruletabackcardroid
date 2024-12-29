// /backend/api/share.js

const dbConnect = require("./utils/dbConnect");
const User = require("./models/User");
const Cors = require("micro-cors");

// Configurar CORS
const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
  origin: "*", // Reemplaza "*" con la URL de tu frontend
});

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
    console.log(`Recibiendo solicitud de share para la placa: ${plate}`);
    await dbConnect();
    const user = await User.findOne({ plate });
    if (!user) {
      console.warn(`Usuario no encontrado para la placa: ${plate}`);
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const today = new Date();
    const lastShareDate = user.lastShareDate
      ? new Date(user.lastShareDate)
      : null;

    if (
      lastShareDate &&
      lastShareDate.toDateString() === today.toDateString()
    ) {
      return res.status(400).json({
        message: "Ya has compartido hoy. Vuelve mañana para obtener más giros.",
      });
    }

    user.spinsAvailable += 3; // Añadir 3 giros
    user.lastShareDate = today;
    await user.save();

    console.log(
      `Usuario ${plate} ha compartido en Facebook y ha recibido 3 giros adicionales.`
    );

    return res.status(200).json({
      message: "¡Gracias por compartir! Se han añadido 3 giros adicionales.",
      spinsAvailable: user.spinsAvailable,
    });
  } catch (err) {
    console.error("Error en /api/share:", err.message);
    return res.status(500).json({
      message: "Error al procesar el share.",
      error: err.message,
    });
  }
};

module.exports = cors(handler);
