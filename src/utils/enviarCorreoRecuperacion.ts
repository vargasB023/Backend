import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const enviarCorreoRecuperacion = async (
  correoDestino: string,
  otp: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,               // ej: smtp.gmail.com
      port: Number(process.env.SMTP_PORT),       // ej: 587
      secure: false,                             // true si es 465, false si es 587
      auth: {
        user: process.env.SMTP_USER,             // tu correo
        pass: process.env.SMTP_PASS,             // contraseña de aplicación
      },
    });

    const asunto = "Tu código de verificación - GADDER";
    const mensajeHTML = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9fafb; color: #222;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #1a6f9d;">🔑 Código de Verificación</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>GADDER</strong>.</p>
          
          <p>Utiliza el siguiente código para continuar con el proceso:</p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #1a6f9d; color: #fff; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
              ${otp}
            </span>
          </div>

          <p>⚠️ Este código es válido durante <strong>10 minutos</strong>. Después de ese tiempo deberás solicitar uno nuevo.</p>
          <p>Si no realizaste esta solicitud, puedes ignorar este correo con seguridad.</p>

          <p style="font-size: 14px; color: #999;">Equipo GADDER 🏐</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GADDER" <${process.env.FROM_EMAIL}>`,
      to: correoDestino,
      subject: asunto,
      html: mensajeHTML,
    });

  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error);
  }
};
