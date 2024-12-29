// /backend/models/User.js

const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  expiry: { type: Date, required: true },
  claimed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    plate: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    spinsAvailable: { type: Number, default: 3 },
    lastSpinDate: { type: Date, default: null },
    lastShareDate: { type: Date, default: null },
    prizes: [prizeSchema],
  },
  { timestamps: true }
);

// Evitar redefinición del modelo si ya existe
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
