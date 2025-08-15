import type { Request, Response } from "express";
import plan_De_Entrenamiento from "../models/plan_de_entrenamiento";
import Microciclo from "../models/microciclo";

export class plan_Entrenamiento_Controller {
  
  static traer_Planes_Entrenamiento = async (req: Request, res: Response) => {
    try {
      console.log('Desde get /api/plan-entrenamiento');
      const planes = await plan_De_Entrenamiento.findAll({
        include: [{model: Microciclo}]
      });
      
      res.json(planes);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer los planes de entrenamiento' });
    }
  }

  static traer_Plan_Entrenamiento_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await plan_De_Entrenamiento.findByPk(id, {
        include: [{model: Microciclo}]
      })
      if (!plan) {
        const error = new Error('Plan de entrenamiento no encontrado');
        return res.status(404).json({ error: error.message });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer el plan de entrenamiento' });
    }
  }

  static crear_Plan_Entrenamiento = async (req: Request, res: Response) => {
    try {
      const plan = new plan_De_Entrenamiento(req.body);
      await plan.save();
      res.status(201).json({ mensaje: 'El Plan de Entrenamiento se ha creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al crear el plan de entrenamiento' });
    }
  }

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