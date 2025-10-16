import type { Request, Response } from "express";
import Evaluacion_Fisica from "../models/evaluacion_Fisica";
import Evaluacion_Tecnica from "../models/evaluacion_Tecnica";
import Evaluacion_Deportiva from "../models/evaluacion_Deportiva";
import Deportista from "../models/deportista";
import Entrenador from "../models/entrenador";

export class EvaluacionDeportiva_controller {
  
  static traer_EvaluacionesDeportivas = async (req: Request, res: Response) => {
    try {
      const evaluaciones = await Evaluacion_Deportiva.findAll({
        include: [
          { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
          { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
          { model: Deportista, as: "deportista" },
          { model: Entrenador, as: "entrenador" },
        ],
        order: [["createdAt", "ASC"]],
      });
      res.json(evaluaciones);
    } catch (error) {
      console.error("Error al traer evaluaciones deportivas:", error);
      res.status(500).json({ error: "Error al traer las evaluaciones deportivas" });
    }
  };

  static traer_Evaluaciones_Por_Entrenador = async (req: Request, res: Response) => {
    try {
      const { id_entrenador } = req.params;
      const evaluaciones = await Evaluacion_Deportiva.findAll({
        where: { ID_Entrenador: id_entrenador },
        include: [
          { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
          { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
          { model: Deportista, as: "deportista" },
          { model: Entrenador, as: "entrenador" },
        ],
        order: [["fecha", "DESC"]],
      });
      res.json(evaluaciones);
    } catch (error) {
      console.error("Error al traer evaluaciones por entrenador:", error);
      res.status(500).json({ error: "Error al traer las evaluaciones del entrenador" });
    }
  };


static traer_Evaluaciones_Por_Deportista = async (req: Request, res: Response) => {
  try {
    const { id_deportista } = req.params;
    
    const todasEvaluaciones = await Evaluacion_Deportiva.findAll({
      where: { ID_Deportista: id_deportista },
      include: [
        { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
        { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
        { model: Entrenador, as: "entrenador", attributes: ['ID_Entrenador', 'nombre_Completo'] }
      ],
      order: [["fecha", "DESC"]],
    });

    // Obtener datos del deportista
    const deportista = await Deportista.findByPk(id_deportista, {
      attributes: ['ID_Deportista', 'nombre_Completo', 'no_Documento', 'posicion', 'dorsal', 'foto']
    });

    if (!deportista) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json({
      deportista: deportista,
      total_evaluaciones: todasEvaluaciones.length,
      evaluaciones: todasEvaluaciones.map(ev => ({
        evaluacion_deportiva: {
          ID_Evaluacion_De: ev.ID_Evaluacion_De,
          fecha: ev.fecha,
          resultados: ev.resultados,
          observaciones: ev.observaciones,
          tipo_Evaluacion: ev.tipo_Evaluacion,
        },
        entrenador: ev.entrenador,
        evaluacion_Fisica: ev.evaluacion_fisica,
        evaluacion_Tecnica: ev.evaluacion_tecnica,
      }))
    });
  } catch (error) {
    console.error("Error al traer evaluaciones por deportista:", error);
    res.status(500).json({ error: "Error al traer las evaluaciones del deportista" });
  }
};
  
  static traer_Deportistas_Con_Ultima_Evaluacion = async (req: Request, res: Response) => {
    try {
      const { id_entrenador } = req.params;
      const todasEvaluaciones = await Evaluacion_Deportiva.findAll({
        where: { ID_Entrenador: id_entrenador },
        include: [
          { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
          { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
          { model: Deportista, as: "deportista" },
          { model: Entrenador, as: "entrenador" },
        ],
        order: [["fecha", "DESC"]],
      });

      const deportistasUnicos = new Map();
      todasEvaluaciones.forEach(evaluacion => {
        const deportistaId = evaluacion.ID_Deportista;
        if (!deportistasUnicos.has(deportistaId)) {
          deportistasUnicos.set(deportistaId, evaluacion);
        }
      });

      res.json(Array.from(deportistasUnicos.values()));
    } catch (error) {
      console.error("Error al traer deportistas únicos:", error);
      res.status(500).json({ error: "Error al traer los deportistas" });
    }
  };

  static traer_Reporte_Evaluacion_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const evaluacionBase = await Evaluacion_Deportiva.findByPk(id, {
        include: [{ model: Deportista, as: "deportista", attributes: ['ID_Deportista', 'nombre_Completo', 'no_Documento'] }]
      });
      if (!evaluacionBase) return res.status(404).json({ error: "Evaluación deportiva no encontrada" });

      const deportistaId = evaluacionBase.ID_Deportista;
      if (!deportistaId) return res.status(404).json({ error: "Deportista no encontrado en la evaluación" });

      const todasEvaluaciones = await Evaluacion_Deportiva.findAll({
        where: { ID_Deportista: deportistaId },
        include: [
          { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
          { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
          { model: Entrenador, as: "entrenador", attributes: ['ID_Entrenador', 'nombre_Completo'] }
        ],
        order: [["fecha", "DESC"]],
      });

      res.json({
        deportista: evaluacionBase.deportista,
        total_evaluaciones: todasEvaluaciones.length,
        evaluaciones: todasEvaluaciones.map(ev => ({
          evaluacion_deportiva: {
            ID_Evaluacion_De: ev.ID_Evaluacion_De,
            fecha: ev.fecha,
            resultados: ev.resultados,
            observaciones: ev.observaciones,
            tipo_Evaluacion: ev.tipo_Evaluacion,
          },
          entrenador: ev.entrenador,
          evaluacion_Fisica: ev.evaluacion_fisica,
          evaluacion_Tecnica: ev.evaluacion_tecnica,
        }))
      });
    } catch (error) {
      console.error("Error al generar reporte de evaluación:", error);
      res.status(500).json({ error: "Error al generar el reporte de evaluación" });
    }
  };

  static traer_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id, {
        include: [
          { model: Evaluacion_Fisica, as: "evaluacion_fisica" },
          { model: Evaluacion_Tecnica, as: "evaluacion_tecnica" },
          { model: Deportista, as: "deportista" },
          { model: Entrenador, as: "entrenador" },
        ],
      });
      if (!evaluacion) return res.status(404).json({ error: "Evaluación deportiva no encontrada" });
      res.json(evaluacion);
    } catch (error) {
      console.error("Error al traer evaluación deportiva:", error);
      res.status(500).json({ error: "Error al buscar la evaluación deportiva" });
    }
  };

  static crear_EvaluacionDeportiva = async (req: Request, res: Response) => {
    try {
      if (!req.body.ID_Deportista || !req.body.ID_Entrenador || !req.body.tipo_Evaluacion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }
      
      const evaluacion_Deportiva = await Evaluacion_Deportiva.create(req.body);

      res.status(201).json({ 
        mensaje: 'La Evaluación deportiva se ha registrado correctamente', 
        ID_Evaluacion_De: evaluacion_Deportiva.ID_Evaluacion_De, 
        evaluacion_Deportiva: {
          ID_Evaluacion_De: evaluacion_Deportiva.ID_Evaluacion_De,
          ID_Deportista: evaluacion_Deportiva.ID_Deportista,
          ID_Entrenador: evaluacion_Deportiva.ID_Entrenador,
          fecha: evaluacion_Deportiva.fecha,
          resultados: evaluacion_Deportiva.resultados,
          observaciones: evaluacion_Deportiva.observaciones,
          tipo_Evaluacion: evaluacion_Deportiva.tipo_Evaluacion,
          createdAt: evaluacion_Deportiva.createdAt,
          updatedAt: evaluacion_Deportiva.updatedAt
        }
      });
    } catch (error) {
      console.error("Error en crear_Evaluacion Deportiva:", error);
      res.status(500).json({ error: 'Hubo un error al registrar la Evaluación deportiva' });
    }
  }

  static actualizar_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación deportiva no encontrada' });
      await evaluacion.update(req.body);
      res.json('Evaluación deportiva actualizada correctamente');
    } catch (error) {
      console.error("Error al actualizar evaluación deportiva:", error);
      res.status(500).json({ error: 'Error al actualizar la evaluación deportiva' });
    }
  }

  static eliminar_EvaluacionDeportiva_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Deportiva.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación deportiva no encontrada' });
      await evaluacion.destroy();
      res.json('Evaluación deportiva eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar evaluación deportiva:", error);
      res.status(500).json({ error: 'Error al eliminar la evaluación deportiva' });
    }
  }
}