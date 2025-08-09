import type { Request, Response } from "express";
import Evaluacion_Fisica from "../models/evaluacion_Fisica";

export class EvaluacionFisica_controller {
  
  static traer_EvaluacionesFisicas = async (req: Request, res: Response) => {
    try {
      const evaluaciones = await Evaluacion_Fisica.findAll({ order: [['createdAt', 'ASC']] });
      res.json(evaluaciones);
    } catch {
      res.status(500).json({ error: 'Hubo un error al traer las evaluaciones físicas' });
    }
  }

  static traer_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      res.json(evaluacion);
    } catch {
      res.status(500).json({ error: 'Error al buscar la evaluación física' });
    }
  }

  static crear_EvaluacionFisica = async (req: Request, res: Response) => {
    try {
      await Evaluacion_Fisica.create(req.body);
      res.status(201).json({ mensaje: 'Evaluación física creada correctamente' });
    } catch {
      res.status(500).json({ error: 'Error al crear la evaluación física' });
    }
  }

  static actualizar_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      await evaluacion.update(req.body);
      res.json('Evaluación física actualizada correctamente');
    } catch {
      res.status(500).json({ error: 'Error al actualizar la evaluación física' });
    }
  }

  static eliminar_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      await evaluacion.destroy();
      res.json('Evaluación física eliminada correctamente');
    } catch {
      res.status(500).json({ error: 'Error al eliminar la evaluación física' });
    }
  }
}