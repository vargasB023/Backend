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
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 30px; color: #1e293b;">
          <div style="max-width: 650px; margin: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            
            <div style="background: linear-gradient(135deg, #3b82f6, #1a6f9d); padding: 25px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 24px;">🏐 ¡Bienvenido, ${nombre}!</h1>
            </div>

            <div style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Gracias por registrarte en <strong>GADDER</strong>, la plataforma especializada en voleibol.
              </p>

              <p style="margin: 20px 0 10px; font-weight: bold;">Con GADDER podrás:</p>
              <ul style="padding-left: 20px; margin: 0 0 20px; line-height: 1.6;">
                <li>📊 Controlar tus entrenamientos</li>
                <li>📅 Visualizar sesiones y objetivos</li>
                <li>📈 Hacer seguimiento a tu progreso</li>
                <li>💬 Mantenerte conectado con tu entrenador</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://gadder" 
                   style="display: inline-block; background: #3b82f6; padding: 14px 28px; color: #fff; border-radius: 10px; font-weight: 600; text-decoration: none; transition: background 0.3s;">
                   Ingresar a GADDER
                </a>
              </div>

              <p style="font-size: 14px; color: #64748b; text-align: center;">
                Nos emociona ser parte de tu crecimiento como deportista.
              </p>
              <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 10px;">
                Equipo GADDER 🏐
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (tipo === 'entrenador') {
      asunto = '¡Bienvenido a GADDER, entrenador!';
      mensajeHTML = `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 30px; color: #1e293b;">
          <div style="max-width: 650px; margin: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            
            <div style="background: linear-gradient(135deg, #1a6f9d, #185a90); padding: 25px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 24px;">🏐 ¡Bienvenido, ${nombre}!</h1>
            </div>

            <div style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Es un honor contar con tu experiencia en <strong>GADDER</strong>, la plataforma especializada en voleibol.
              </p>

              <p style="margin: 20px 0 10px; font-weight: bold;">Con GADDER podrás:</p>
              <ul style="padding-left: 20px; margin: 0 0 20px; line-height: 1.6;">
                <li>📝 Crear y gestionar planes personalizados</li>
                <li>📈 Monitorear el progreso de tus deportistas</li>
                <li>📋 Organizar microciclos y sesiones</li>
                <li>📨 Comunicarte con tu equipo eficientemente</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://gadder" 
                   style="display: inline-block; background: #1a6f9d; padding: 14px 28px; color: #fff; border-radius: 10px; font-weight: 600; text-decoration: none; transition: background 0.3s;">
                   Ingresar a GADDER
                </a>
              </div>

              <p style="font-size: 14px; color: #64748b; text-align: center;">
                Gracias por unirte a nosotros. Juntos llevaremos el voleibol al siguiente nivel.
              </p>
              <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 10px;">
                Equipo GADDER 🏐
              </p>
            </div>
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
