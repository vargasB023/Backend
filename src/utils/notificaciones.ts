// src/utils/notificaciones.ts
import admin from "../Config/firebase";
import Token from "../models/token";
import Cronograma from "../models/Cronograma";
import Equipo from "../models/equipo";
import Deportista from "../models/deportista";
import Notificaciones from "../models/notificaciones";
import { Op } from "sequelize";

interface NotificacionPayload {
  tokens: string[];
  titulo: string;
  cuerpo: string;
  data?: Record<string, string>;
}

export const enviarNotificacion = async ({
  tokens,
  titulo,
  cuerpo,
  data,
}: NotificacionPayload): Promise<any> => {
  try {
    if (!tokens || tokens.length === 0) {
      console.warn("⚠️ No hay tokens registrados para enviar notificación");
      return;
    }

    const message = {
      notification: { title: titulo, body: cuerpo },
      data: data || {},
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notificación enviada:", response);
    return response;
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    throw error;
  }
};

export const enviarNotificacionCronograma = async (
  idCronograma: number,
  accion: "CREAR" | "ACTUALIZAR" | "ELIMINAR"
) => {
  try {
    const cronograma = await Cronograma.findByPk(idCronograma, {
      include: [{ model: Equipo, include: [Deportista] }],
    });

    if (!cronograma) {
      console.warn("⚠️ Cronograma no encontrado para notificación");
      return { success: false, error: "Cronograma no encontrado" };
    }

    const idsDeportistas = cronograma.equipo?.deportista.map(
      (d) => d.ID_Deportista
    ) || [];

    if (idsDeportistas.length === 0) {
      console.warn("⚠️ No hay deportistas en el equipo para notificar");
      return { success: false, error: "No hay deportistas en el equipo" };
    }

    const tokensUsuarios = await Token.findAll({
      where: {
        ID_Deportista: { [Op.in]: idsDeportistas },
      },
      attributes: ["tokenFCM"],
    });

    const tokens = tokensUsuarios.map((t) => t.tokenFCM);

    if (tokens.length === 0) {
      console.warn("⚠️ No hay tokens registrados para los deportistas");
      return { success: false, error: "No hay tokens registrados" };
    }

    let titulo = "📢 Nuevo Evento";
    let cuerpo = "";

    switch (accion) {
      case "CREAR":
        titulo = "📢 Nuevo Evento";
        cuerpo = `Se programó un nuevo ${cronograma.tipo_Evento.toLowerCase()} para el equipo ${cronograma.equipo?.nombre_Equipo}`;
        break;
      case "ACTUALIZAR":
        titulo = "📝 Evento Actualizado";
        cuerpo = `El ${cronograma.tipo_Evento.toLowerCase()} del equipo ${cronograma.equipo?.nombre_Equipo} fue actualizado`;
        break;
      case "ELIMINAR":
        titulo = "❌ Evento Cancelado";
        cuerpo = `El ${cronograma.tipo_Evento.toLowerCase()} del equipo ${cronograma.equipo?.nombre_Equipo} fue cancelado`;
        break;
    }

    const data = {
      cronogramaId: String(cronograma.ID_Cronograma),
      tipo: "CRONOGRAMA",
      accion: accion,
      equipoId: String(cronograma.ID_Equipo),
      fecha: cronograma.fecha,
      hora: cronograma.hora,
      nombreEvento: cronograma.nombre_Evento,
    };

    const result = await enviarNotificacion({
      tokens,
      titulo,
      cuerpo,
      data,
    });

    // Guardar notificaciones en base de datos para cada deportista
    for (const deportistaId of idsDeportistas) {
      await Notificaciones.create({
        fecha: new Date(),
        titulo,
        descripcion: cuerpo,
        tipo: "CRONOGRAMA",
        ID_Deportista: deportistaId,
        ID_Entrenador: cronograma.ID_Entrenador,
        leida: false,
      });
    }

    console.log(`✅ Notificación ${accion} enviada a ${tokens.length} deportistas`);
    return { success: true, tokensEnviados: tokens.length };

  } catch (error) {
    console.error("❌ Error al enviar notificación de cronograma:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};
