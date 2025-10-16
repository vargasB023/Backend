import type { Request, Response } from "express";
import { Op } from "sequelize";
import plan_De_Entrenamiento from "../models/plan_de_entrenamiento";
import Microciclo from "../models/microciclo";
import Sesion from "../models/sesion";
import Rel_Plan_Microciclo from "../models/rel_Plan_Microciclo";
import Equipo from "../models/equipo";
import Ejercicio from "../models/ejercicio";
import Entrenador from "../models/entrenador";

const calcularEstado = (plan: any) => {
  const hoy = new Date();
  if (hoy < new Date(plan.fecha_inicio)) return "Pendiente";
  if (hoy > new Date(plan.fecha_fin)) return "Finalizado";
  return "En curso";
};

export class plan_Entrenamiento_Controller {

  static traer_Planes_Entrenamiento = async (req: Request, res: Response) => {
    try {
      const { idEntrenador, desde, hasta, intensidad } = req.query;
      const where: any = {};
      if (idEntrenador) where.ID_Entrenador = idEntrenador;
      if (desde && hasta) where.fecha_inicio = { [Op.between]: [desde, hasta] };

      const planes = await plan_De_Entrenamiento.findAll({
        where,
        include: [{
          model: Microciclo,
          through: { attributes: [] },
          where: intensidad ? { intensidad } : undefined,
        }],
      });

      res.json(planes.map(p => ({ ...p.toJSON(), estado: calcularEstado(p) })));
    } catch (error) {
      res.status(500).json({ error: "Error al traer los planes de entrenamiento" });
    }
  };

  static traer_Planes_Por_Entrenador = async (req: Request, res: Response) => {
    try {
      const { ID_Entrenador } = req.params;

      const planes = await plan_De_Entrenamiento.findAll({
        where: { ID_Entrenador },
        include: [
          {
            model: Microciclo,
            through: { attributes: [] },
          },
          {
            model: Equipo, // ✅ Incluimos el equipo asociado
            attributes: ["ID_Equipo", "nombre_Equipo"], // solo los campos que te interesan
          },
        ],
        order: [["fecha_Inicio", "ASC"]],
      });

      res.json(planes.map((p) => ({ ...p.toJSON(), estado: calcularEstado(p) })));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al traer los planes del entrenador" });
    }
  };

  static traer_Plan_Entrenamiento_Por_Id = async (req: Request, res: Response) => {
    try {
      const plan = await plan_De_Entrenamiento.findByPk(req.params.id, {
        include: [{ model: Microciclo, through: { attributes: [] } }],
      });
      if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
      res.json({ ...plan.toJSON(), estado: calcularEstado(plan) });
    } catch {
      res.status(500).json({ error: "Error al traer el plan de entrenamiento" });
    }
  };

  static traer_Planes_Por_Equipo = async (req: Request, res: Response) => {
  try {
    const { ID_Equipo } = req.params;

    const planes = await plan_De_Entrenamiento.findAll({
      where: { ID_Equipo },
      include: [
        {
          model: Microciclo,
          through: { attributes: [] }, // relación Plan ↔ Microciclo
          include: [
            {
              model: Sesion,
              include: [
                {
                  model: Ejercicio,
                  through: {
                    attributes: [
                      "fase",
                      "orden",
                      "series",
                      "repeticiones",
                      "duracion_min",
                      "observaciones"
                    ]
                  }
                }
              ],
              through: {
                attributes: ["dia_Semana"] 
              }
            }
          ]
        },
        {
          model: Equipo,
          attributes: ["Nombre_Equipo"]
        }
      ]
    });

    if (!planes || planes.length === 0) {
      return res.status(404).json({ mensaje: "No hay planes para este equipo" });
    }

    res.json(
      planes.map((p) => {
        const planJson = p.toJSON();
        return {
          ...planJson,
          nombre_equipo: planJson.Equipo?.Nombre_Equipo || null,
          estado: calcularEstado(p)
        };
      })
    );
  } catch (error) {
    console.error("Error al traer planes por equipo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};


  static traer_Plan_Completo = async (req: Request, res: Response) => {
    try {
      const plan = await plan_De_Entrenamiento.findByPk(req.params.id, {
        include: [{
          model: Microciclo,
          through: { attributes: [] },
          include: [{ model: Sesion}],
        }],
      });
      if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
      res.json({ ...plan.toJSON(), estado: calcularEstado(plan) });
    } catch {
      res.status(500).json({ error: "Error al traer el plan completo" });
    }
  };

 static crear_Plan_Entrenamiento = async (req: Request, res: Response) => {
  try {
    const { ID_Entrenador, ID_Equipo, nombre_Plan, objetivo, duracion, fecha_Inicio, fecha_fin, microciclos } = req.body;

    const hoy = new Date(), ini = new Date(fecha_Inicio), fin = new Date(fecha_fin);
    const estado = hoy < ini ? "PENDIENTE" : hoy <= fin ? "EN CURSO" : "FINALIZADO";

    const plan = await plan_De_Entrenamiento.create({
      ID_Entrenador, ID_Equipo, nombre_Plan, objetivo, duracion,
      fecha_inicio: fecha_Inicio, fecha_fin: fecha_fin, estado
    });

    if (Array.isArray(microciclos) && microciclos.length)
      await Rel_Plan_Microciclo.bulkCreate(
        microciclos.map((m: { ID_Microciclo: number }) => ({
          ID_Plan: plan.ID_Plan, ID_Microciclo: m.ID_Microciclo
        }))
      );

    res.status(201).json({ mensaje: "Plan creado correctamente", plan });
  } catch (error) {
    console.error("❌ Error al crear el plan:", error);
    res.status(500).json({ error: "Error al crear el plan de entrenamiento" });
  }
};


  static asignar_microciclo = async (req: Request, res: Response) => {
    console.log("Holi", req.body);
    try {
      const { ID_Plan, ID_Microciclo } = req.body;

      const plan = await plan_De_Entrenamiento.findByPk(ID_Plan);
      if (!plan) {
        return res.status(404).json({ error: 'Plan de entrenamiento no encontrado' });
      }

      const microciclo = await Microciclo.findByPk(ID_Microciclo);
      if (!microciclo) {
        return res.status(404).json({ error: 'Microciclo no encontrado' });
      }
      await plan.$add('microciclo', ID_Microciclo);

      res.json({ mensaje: 'Microciclo asignado al plan correctamente' });
    } catch (error) {
      console.error('Error al asignar microciclo:', error);
      res.status(500).json({ error: 'Error del servidor al asignar microciclo' });
    }
  }

  static actualizar_Plan_Entrenamiento_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await plan_De_Entrenamiento.findByPk(id,{
        include: [{model: Microciclo}]
      })
      if (!plan) {
        const error = new Error('Plan de entrenamiento no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await plan.update(req.body);
      res.json('El plan de entrenamiento se ha actualizado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el plan de entrenamiento' });
    }
  }

  static eliminar_Plan_Entrenamiento_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await plan_De_Entrenamiento.findByPk(id);
      if (!plan) {
        const error = new Error('Plan de entrenamiento no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await plan.destroy();
      res.json('El plan de entrenamiento se ha eliminado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al eliminar el plan de entrenamiento' });
    }
  }
}