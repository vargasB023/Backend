import type { Request, Response } from "express";
import Evaluacion_Deportiva from "../models/evaluacion_Deportiva";

export class EvaluacionDeportiva_controller {
  
  static traer_EvaluacionesDeportivas = async (req: Request, res: Response) => {
    try {
      const evaluaciones = await Evaluacion_Deportiva.findAll({ order: [['createdAt', 'ASC']] });
      res.json(evaluaciones);
    } catch {
      res.status(500).json({ error: 'Error al traer las evaluaciones deportivas' });
    }
  }

  static traer_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación deportiva no encontrada' });
      res.json(evaluacion);
    } catch {
      res.status(500).json({ error: 'Error al buscar la evaluación deportiva' });
    }
  }

  static crear_EvaluacionDeportiva = async (req: Request, res: Response) => {
    try {
      await Evaluacion_Deportiva.create(req.body);
      res.status(201).json({ mensaje: 'Evaluación deportiva creada correctamente' });
    } catch {
      res.status(500).json({ error: 'Error al crear la evaluación deportiva' });
    }
  }

  static actualizar_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación deportiva no encontrada' });
      await evaluacion.update(req.body);
      res.json('Evaluación deportiva actualizada correctamente');
    } catch {
      res.status(500).json({ error: 'Error al actualizar la evaluación deportiva' });
    }
  }

  static eliminar_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación deportiva no encontrada' });
      await evaluacion.destroy();
      res.json('Evaluación deportiva eliminada correctamente');
    } catch {
      res.status(500).json({ error: 'Error al eliminar la evaluación deportiva' });
    }
  }
}