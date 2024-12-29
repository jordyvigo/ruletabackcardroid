// /backend/api/health.js

const dbConnect = require("./utils/dbConnect");
const Cors = require("micro-cors");

// Configurar CORS
const cors = Cors({
  allowMethods: ["GET", "OPTIONS"],
  origin: "https://ruletafrontcrd.vercel.app", // Reemplaza "*" con la URL de tu frontend si lo deseas
});

const handler = async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido." });
  }

  try {
    await dbConnect();
    console.log("Conectado a MongoDB para /api/health");
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error en /api/health:", error.message);
    return res.status(500).send("Error en la conexión a MongoDB");
  }
};

module.exports = cors(handler);
