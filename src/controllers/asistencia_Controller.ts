import type { Request, Response } from "express";
import Asistencia from "../models/asistencia";
import Cronograma from "../models/Cronograma";
import Entrenador from "../models/entrenador";
import Deportista from "../models/deportista";
import Equipo from "../models/equipo";

export class asistencia_Controller {
  
 static traer_Asistencias = async (req: Request, res: Response) => {
  try {
    console.log('Desde get /api/asistencia');
    const asistencias = await Asistencia.findAll({
      order: [['createdAt', 'DESC']], // ✅ usar createdAt en vez de fecha
    });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al traer las asistencias' });
  }
}


  static traer_Asistencia_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        const error = new Error('Asistencia no encontrada');
        return res.status(404).json({ error: error.message });
      }
      res.json(asistencia);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer la asistencia' });
    }
  }
  
  static traer_Asistencia_Por_Cronograma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID_Cronograma
    const asistencias = await Asistencia.findAll({
      where: { ID_Cronograma: id },
      include: [Deportista],
      order: [["createdAt", "ASC"]]
    });

    if (!asistencias || asistencias.length === 0) {
      return res.status(404).json({ error: "No hay asistencias para este cronograma" });
    }

    const respuesta = {
      ID_Cronograma: Number(id),
      deportistas: asistencias.map(a => ({
        ID_Asistencia: a.ID_Asistencia,
        ID_Deportista: a.ID_Deportista,
        nombre_Completo: a.deportista?.nombre_Completo ?? null,
        estado: a.estado,
        observaciones: a.observaciones,
        createdAt: a.createdAt
      }))
    };

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al traer la asistencia por cronograma" });
  }}

  static traer_Asistencias_Por_Entrenador = async (req: Request, res: Response) => {
  try {
    const { ID_Entrenador } = req.params;

    const entrenador = await Entrenador.findByPk(ID_Entrenador, {
      attributes: ["ID_Entrenador", "Nombre_Completo"],
      include: [
        {
          model: Cronograma,attributes: ["ID_Cronograma", "nombre_Evento", "fecha","ID_Equipo"],
           where: { ID_Entrenador },required: false,
          include: [
            {model: Asistencia, attributes: ["ID_Asistencia", "estado", "observaciones","ID_Deportista"],
              required: false,
              order: [["fecha", "DESC"]],
            },
          ],
        }, 
      ]});

    if (!entrenador) {
      return res.status(404).json({ mensaje: "No se encontró el entrenador con ese ID" });
    }

    res.json(entrenador);
  } catch (error) {console.error(error); res.status(500).json({
      error: "Hubo un error al traer las asistencias del entrenador",
    });
  }
};

static traer_Asistencias_Por_Deportista = async (req: Request, res: Response) => {
  try {
    const { ID_Deportista } = req.params;
    const deportista = await Deportista.findByPk(ID_Deportista, {
      attributes: ["ID_Deportista", "Nombre_Completo"],
      include: [
        { model: Asistencia,attributes: ["ID_Asistencia", "estado", "observaciones"],
          required: false,include: [
            {
              model: Cronograma,attributes: ["ID_Cronograma", "nombre_Evento", "fecha", "ID_Equipo"],
            },
          ]}]});
    if (!deportista) {
      return res.status(404).json({ mensaje: "No se encontró el deportista con ese ID" });
    }

    const asistenciasOrdenadas = deportista.asistencia?.sort(
      (a: any, b: any) =>
        new Date(b.cronograma.fecha).getTime() - new Date(a.cronograma.fecha).getTime());

    res.json({
      ...deportista.toJSON(),asistencia: asistenciasOrdenadas,
    });
  } catch (error) {
    console.error("Error en traer_Asistencias_Por_Deportista:", error);
    res.status(500).json({ error: "Hubo un error al traer las asistencias del deportista" });
  }
};

static traer_Asistencias_Por_Equipo = async (req: Request, res: Response) => {
  try {
    const { ID_Equipo } = req.params;

    const equipo = await Equipo.findByPk(ID_Equipo, {
      attributes: ["ID_Equipo", "nombre_Equipo", "categoria", "liga"],
      include: [
        
           {
          model: Deportista,
          attributes: ["ID_Deportista", "Nombre_Completo"], 
          through: {
            attributes: ["ID_Relacion", "fecha_Asignacion", "estado"],
          },
          include: [
            {
              model: Asistencia,
              required: false,
              include: [
                {
                  model: Cronograma,
                  attributes: ["ID_Cronograma", "nombre_Evento", "fecha"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!equipo) return res.status(404).json({ mensaje: "No se encontró el equipo con ese ID" });
    res.json(equipo);
  } catch (error) {
    console.error("Error en traer_Asistencias_Por_Equipo:", error);
    res.status(500).json({ error: "Hubo un error al traer las asistencias del equipo" });
  }}


  static crear_Asistencia = async (req: Request, res: Response) => {
  try {
    const { ID_Cronograma, asistencias } = req.body;

    if (!ID_Cronograma || !Array.isArray(asistencias)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const resultados = [];

    for (const a of asistencias) {
      let asistencia = await Asistencia.findOne({
        where: { ID_Cronograma, ID_Deportista: a.ID_Deportista }
      });

      if (asistencia) {
        await asistencia.update({
          estado: a.estado,
          observaciones: a.observaciones
        });
        resultados.push(asistencia);
      } else {
        const nueva = await Asistencia.create({
          ...a,
          ID_Cronograma
        });
        resultados.push(nueva);
      }
    }

    res.status(201).json(resultados);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Hubo un error" });
  }
};


  static actualizar_Asistencia_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        const error = new Error('Asistencia no encontrada');
        return res.status(404).json({ error: error.message });
      }
      await asistencia.update(req.body);
      res.json('La asistencia se ha actualizado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar la asistencia' });
    }
  }

  static eliminar_Asistencia_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        const error = new Error('Asistencia no encontrada');
        return res.status(404).json({ error: error.message });
      }
      await asistencia.destroy();
      res.json('La asistencia se ha eliminado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al eliminar la asistencia' });
    }
  }
}