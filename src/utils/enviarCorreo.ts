import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const enviarCorreoBienvenida = async (
  correoDestino: string,
  nombre: string,
  tipo: 'deportista' | 'entrenador'
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO_GADDER,
        pass: process.env.CORREO_PASSWORD,
      },
    });

    let asunto = '';
    let mensajeHTML = '';

    if (tipo === 'deportista') {
      asunto = '¡Bienvenido a GADDER, deportista!';
      mensajeHTML = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f0f4f8; color: #222;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #3b82f6;">🏐 ¡Bienvenido a GADDER, ${nombre}!</h2>
            <p>Gracias por registrarte en nuestra plataforma especializada en <strong>voleibol</strong>.</p>

            <p>Con GADDER podrás:</p>
            <ul>
              <li>📊 Llevar el control de tus entrenamientos</li>
              <li>📅 Visualizar sesiones y objetivos</li>
              <li>📈 Hacer seguimiento a tu progreso deportivo</li>
              <li>💬 Estar conectado con tu entrenador</li>
            </ul>

            <p>¡Comienza tu camino hacia la excelencia deportiva!</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gadder" style="background-color: #3b82f6; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Ingresar a GADDER</a>
            </div>

            <p style="font-size: 14px; color: #555;">Nos emociona ser parte de tu crecimiento como deportista.</p>
            <p style="font-size: 14px; color: #999;">Equipo GADDER 🏐</p>
          </div>
        </div>
      `;
    } else if (tipo === 'entrenador') {
      asunto = '¡Bienvenido a GADDER, entrenador!';
      mensajeHTML = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f0f4f8; color: #222;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #3b82f6;">🏐 ¡Bienvenido a GADDER, ${nombre}!</h2>
            <p>Es un honor contar con tu experiencia y liderazgo en nuestra plataforma especializada en <strong>voleibol</strong>.</p>

            <p>Con GADDER podrás:</p>
            <ul>
              <li>📝 Crear y gestionar planes de entrenamiento personalizados</li>
              <li>📈 Hacer seguimiento al progreso de tus deportistas</li>
              <li>📋 Organizar microciclos, sesiones y ejercicios fácilmente</li>
              <li>📨 Comunicarte con tu equipo de forma clara y eficiente</li>
            </ul>

            <p>Estás a un paso de optimizar tu labor como entrenador. Haz clic en el botón para comenzar:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gadder" style="background-color: #10b981; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Ingresar a GADDER</a>
            </div>

            <p style="font-size: 14px; color: #555;">Gracias por unirte a nosotros. Juntos llevaremos el voleibol al siguiente nivel.</p>
            <p style="font-size: 14px; color: #999;">Equipo GADDER 🏐</p>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"GADDER" <${process.env.CORREO_GADDER}>`,
      to: correoDestino,
      subject: asunto,
      html: mensajeHTML,
    });

    console.log(`Correo de bienvenida enviado a ${correoDestino}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

