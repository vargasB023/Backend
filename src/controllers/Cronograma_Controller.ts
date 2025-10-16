import { Request, Response } from "express";
import Cronograma from "../models/Cronograma";
import Equipo from "../models/equipo";
import { Op } from "sequelize";
import Deportista from "../models/deportista";
import Asistencia from "../models/asistencia";
import { enviarNotificacion, enviarNotificacionCronograma } from "../utils/notificaciones";

export class Cronograma_Controller {
  static traer_Cronogramas = async (req: Request, res: Response) => {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const cronogramas = await Cronograma.findAll({
        where: {fecha: { [Op.gte]: hoy },},
        order: [["fecha", "ASC"]],
        include: [
          { model: Equipo },
          { model: Asistencia, include: [Deportista], },
        ],
      });
      const respuesta = cronogramas.map((cronograma) => {
        const datos = {
          ...cronograma.toJSON(),
          nombre_Equipo: cronograma.equipo?.nombre_Equipo,
          categoria: cronograma.equipo?.categoria,
          asistencias: cronograma.asistencias?.map((a) => ({
            ID_Asistencia: a.ID_Asistencia,
            estado: a.estado,
            observaciones: a.observaciones,
            ID_Deportista: a.ID_Deportista,
            deportista: a.deportista
              ? {
                  ID_Deportista: a.deportista.ID_Deportista,
                  nombre_Completo: a.deportista.nombre_Completo,
                }
              : null,
          })),
        };

        delete datos.equipo;
        delete datos.asistencia;

        return datos;
      });

      console.log(respuesta);
      res.json(respuesta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error al traer los cronogramas" });
    }
  };

  static traer_Cronogramas_Por_Equipo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const cronogramas = await Cronograma.findAll({
        where: {
          ID_Equipo: id,
          fecha: { [Op.gte]: hoy },
        },
        order: [["fecha", "ASC"]],
        include: [{ model: Equipo }],
      });

      if (!cronogramas.length) {
        return res
          .status(404)
          .json({ error: "No se encontraron cronogramas para este equipo" });
      }

      const respuesta = cronogramas.map((c) => {
        const datos = {
          ...c.toJSON(),
          nombre_Equipo: c.equipo?.nombre_Equipo,
          categoria: c.equipo?.categoria,
        };
        delete datos.equipo;
        return datos;
      });

      res.json(respuesta);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer los cronogramas" });
    }
  };

  static traer_Cronogramas_Deportista = async (req: Request, res: Response) => {
  try {
    const { ID_Deportista } = req.params;

    const cronogramas = await Cronograma.findAll({
      include: [
        {
          model: Equipo,
          include: [
            {
              model: Deportista,
              where: { ID_Deportista: Number(ID_Deportista) }, // 👈 casteo a número
              through: {
                attributes: [],
                where: { estado: "ACTIVO" },
              },
              required: true, // 👈 fuerza el filtro
            },
          ],
          required: true,
        },
      ],
      order: [["fecha", "ASC"]],
    });

    res.json(cronogramas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al traer cronogramas del deportista" });
  }
};


  static traer_Cronograma_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const cronograma = await Cronograma.findByPk(id, {
        include: [
          { model: Equipo },{model: Asistencia,include: [Deportista],},
        ],
      });
      if (!cronograma) {
        return res.status(404).json({ error: "cronograma no encontrado" });
      }

      // Transformamos la respuesta
      const datos = {
        ...cronograma.toJSON(),
        asistencia: {
          ID_Cronograma: cronograma.ID_Cronograma,
          deportistas: cronograma.asistencias.map((a) => ({
            ID_Deportista: a.deportista.ID_Deportista,
            nombre_Completo: a.deportista.nombre_Completo,
            estado: a.estado,
            observaciones: a.observaciones,
          })),
        },
      };

      // eliminamos la lista plana de asistencias
      delete datos.asistencias;

      res.json(datos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error al traer el cronograma" });
    }
  };

  static traer_cronogramaEntrenador_Por_Id = async (req: Request,res: Response) => {
    try {
      const { ID_Entrenador } = req.params;

      const cronogramas = await Cronograma.findAll({
        where: { ID_Entrenador },
        include: [
          {model: Equipo, include: [{ model: Deportista }], },
        ],
      });

      if (!cronogramas || cronogramas.length === 0) {
        return res.status(404).json({error: "No se encontraron cronogramas para este entrenador",});
      }res.json(cronogramas);
    } catch (error) { console.error(error);
      res.status(500).json({ error: "Hubo un error al traer los cronogramas" });
    }
  };

  static actualizar_Cronograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cronograma = await Cronograma.findByPk(id);
    if (!cronograma) return res.status(404).json({ error: "cronograma no encontrado" });

    await cronograma.update(req.body);
    await enviarNotificacionCronograma(Number(id), "ACTUALIZAR");

    res.json({ mensaje: "Cronograma actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al actualizar el cronograma" });
  }
};

static eliminar_Cronograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Cronograma.findByPk(id);
    if (!evento) return res.status(404).json({ error: "No encontrado" });

    await evento.destroy();
    await enviarNotificacionCronograma(Number(id), "ELIMINAR");

    res.json({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};

static crear_Cronograma = async (req: Request, res: Response) => {
  try {
    const nuevo = await Cronograma.create(req.body);
    
    // Enviar notificación push
    const notificacionResult = await enviarNotificacionCronograma(nuevo.ID_Cronograma, "CREAR");
    
    if (notificacionResult.success) {
      console.log(`✅ Evento creado y notificación enviada a ${notificacionResult.tokensEnviados} deportistas`);
    } else {
      console.warn(`⚠️ Evento creado pero falló la notificación: ${notificacionResult.error}`);
    }

    res.status(201).json({ 
      mensaje: "Evento creado correctamente", 
      data: nuevo,
      notificacion: notificacionResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};
}