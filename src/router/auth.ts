import express from "express";
import crypto from "crypto";
import moment from "moment-timezone";
import bcrypt from "bcryptjs";
import { enviarCorreoRecuperacion } from "../utils/enviarCorreoRecuperacion";
import Entrenador from "../models/entrenador";
import Deportista from "../models/deportista";

const router = express.Router();
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("Entré en /forgot-password");
    const { email, rol } = req.body;
    console.log("Email y rol recibidos:", email, rol);

    if (!email || !rol) {
      return res.status(400).json({ message: "Email y rol son obligatorios" });
    }

    let user: any;
    if (rol === "entrenador") {
      user = await Entrenador.findOne({ where: { email } });
    } else if (rol === "deportista") {
      user = await Deportista.findOne({ where: { email } });
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const nowBogota = moment().tz("America/Bogota");
    const otpExpiry = nowBogota.clone().add(15, "minutes").toDate();

    user.resetCode = otp;
    user.resetCodeExpires = otpExpiry;
    await user.save();

    let correoEnviado = true;
    try {
      await enviarCorreoRecuperacion(user.email, otp);
    } catch (err) {
      console.error("Error al enviar correo de recuperación:", err);
      correoEnviado = false;
    }

    return res.json({
      message: correoEnviado
        ? "Se envió un código de verificación a tu correo"
        : "OTP generado correctamente, pero no se pudo enviar el correo",
      otp: correoEnviado ? undefined : otp, // opcional, solo para pruebas
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { otp, nuevaContrasena } = req.body;

    if (!otp || !nuevaContrasena) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    let user: any = await Entrenador.findOne({ where: { resetCode: otp } });

    if (!user) {
      user = await Deportista.findOne({ where: { resetCode: otp } });
    }

    if (!user) {
      return res.status(404).json({ message: "Código inválido o usuario no encontrado" });
    }

    const now = new Date();
    if (now > new Date(user.resetCodeExpires)) {
      return res.status(400).json({ message: "Código expirado" });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    user.contrasena = hashedPassword;

    user.resetCode = null;
    user.resetCodeExpires = null;

    await user.save();

    return res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});


export default router;
