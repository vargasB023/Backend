import type { Request, Response } from "express";
import Evaluacion_Tecnica from "../models/evaluacion_Tecnica";

export class EvaluacionTecnica_controller {
  
  static traer_EvaluacionesTecnicas = async (req: Request, res: Response) => {
    try {
      const evaluaciones = await Evaluacion_Tecnica.findAll({ order: [['createdAt', 'ASC']] });
      res.json(evaluaciones);
    } catch (error) {
      console.error("Error al traer evaluaciones técnicas:", error);
      res.status(500).json({ error: 'Error al traer las evaluaciones técnicas' });
    }
  }

  static traer_EvaluacionTecnica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Tecnica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación técnica no encontrada' });
      res.json(evaluacion);
    } catch (error) {
      console.error("Error al buscar evaluación técnica:", error);
      res.status(500).json({ error: 'Error al buscar la evaluación técnica' });
    }
  }

  static crear_EvaluacionTecnica = async (req: Request, res: Response) => {
    try {
      const { ID_Evaluacion_De, SAQUE, potencia_1, tecnica_1, consistencia, dificultad, RECEPCION, tecnica_2, presicion, control, desplazamiento, ATAQUE, tecnica_3, potencia_2, direccion, colocacion, variedad_De_Golpes } = req.body;
      if (!ID_Evaluacion_De || !SAQUE || !potencia_1 || !tecnica_1 || !consistencia || !dificultad || !RECEPCION || !tecnica_2 || !presicion || !control || !desplazamiento || !ATAQUE || !tecnica_3 || !potencia_2 || !direccion || !colocacion || !variedad_De_Golpes) {
        return res.status(400).json({ error: "Faltan campos obligatorios en Evaluación Técnica" });
      }
      const evaluacion = await Evaluacion_Tecnica.create(req.body);
      res.status(201).json({ mensaje: 'Evaluación técnica creada correctamente', evaluacion });
    } catch (error) {
      console.error("Error al crear evaluación técnica:", error);
      res.status(500).json({ error: 'Error al crear la evaluación técnica' });
    }
  }

  static actualizar_EvaluacionTecnica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Tecnica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación técnica no encontrada' });
      await evaluacion.update(req.body);
      res.json('Evaluación técnica actualizada correctamente');
    } catch (error) {
      console.error("Error al actualizar evaluación técnica:", error);
      res.status(500).json({ error: 'Error al actualizar la evaluación técnica' });
    }
  }

  static eliminar_EvaluacionTecnica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Tecnica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación técnica no encontrada' });
      await evaluacion.destroy();
      res.json('Evaluación técnica eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar evaluación técnica:", error);
      res.status(500).json({ error: 'Error al eliminar la evaluación técnica' });
    }
  }
}