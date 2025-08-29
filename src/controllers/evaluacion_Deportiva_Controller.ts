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
        console.log(" Body recibido en /api/evaluacion:", req.body);
        const evaluacion_Deportiva = await Evaluacion_Deportiva.create(req.body);

        await evaluacion_Deportiva.save();
        res.status(201).json({ mensaje: 'La Evaluacion deportiva se ha registrado correctamente' });
      }catch (error) {
  console.error("Error en crear_Evaluacion Deportiva:", error);
  res.status(500).json({ error: 'Hubo un error al registrar la Evaluacion deportiva' });}
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