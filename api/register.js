// /backend/api/register.js

const dbConnect = require("../utils/dbConnect");
const User = require("../models/User");
const Cors = require("micro-cors");

// Configurar CORS para permitir solicitudes desde tu frontend
const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
  origin: "*", // Reemplaza "*" con la URL de tu frontend, por ejemplo: "https://tu-frontend.vercel.app"
});

const handler = async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido." });
  }

  const { plate, email, phone } = req.body;

  if (!plate || !email || !phone) {
    return res.status(400).json({ message: "Placa, email y teléfono son requeridos." });
  }

  try {
    console.log(`Recibiendo solicitud de registro para la placa: ${plate}`);
    await dbConnect();
    let user = await User.findOne({ plate });

    if (user) {
      user.email = email;
      user.phone = phone;
      // Filtrar premios expirados
      user.prizes = user.prizes.filter((p) => p.expiry > new Date());
      // Añadir 3 giros al actualizar
      user.spinsAvailable += 3;
      await user.save();
      console.log(`Usuario existente actualizado: ${plate}`);
      return res.status(200).json({
        message: "Usuario actualizado exitosamente.",
        user,
      });
    }

    const newUser = new User({ plate, email, phone, spinsAvailable: 3 }); // Asignar 3 giros
    await newUser.save();
    console.log(`Nuevo usuario registrado: ${plate}`);

    return res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: newUser,
    });
  } catch (err) {
    console.error("Error en /api/register:", err.message);
    // Manejar errores de duplicados de placa
    if (err.code === 11000) {
      // Código de error de duplicado en MongoDB
      return res.status(409).json({ message: "La placa ya está registrada." });
    }
    return res.status(500).json({
      message: "Error al registrar el usuario.",
      error: err.message,
    });
  }
};

module.exports = cors(handler);
