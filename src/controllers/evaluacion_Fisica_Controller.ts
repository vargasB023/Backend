import type { Request, Response } from "express";
import Evaluacion_Fisica from "../models/evaluacion_Fisica";

export class EvaluacionFisica_controller {
  
  static traer_EvaluacionesFisicas = async (req: Request, res: Response) => {
    try {
      const evaluaciones = await Evaluacion_Fisica.findAll({ order: [['createdAt', 'ASC']] });
      res.json(evaluaciones);
    } catch (error) {
      console.error("Error al traer evaluaciones físicas:", error);
      res.status(500).json({ error: 'Hubo un error al traer las evaluaciones físicas' });
    }
  }

  static traer_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      res.json(evaluacion);
    } catch (error) {
      console.error("Error al buscar evaluación física:", error);
      res.status(500).json({ error: 'Error al buscar la evaluación física' });
    }
  }

  static crear_EvaluacionFisica = async (req: Request, res: Response) => {
    try {
      console.log("📥 Datos recibidos para evaluación física:", req.body);
      
      const { ID_Evaluacion_De, peso, estatura, tasa_Corporal, sprint, flexibilidad_Hombro, agilidad } = req.body;
      
      // Validar campos obligatorios (sin IMC)
      if (!ID_Evaluacion_De || !peso || !estatura || !tasa_Corporal || !sprint || !flexibilidad_Hombro || !agilidad) {
        return res.status(400).json({ 
          error: "Faltan campos obligatorios en Evaluación Física",
          campos_requeridos: ["ID_Evaluacion_De", "peso", "estatura", "tasa_Corporal", "sprint", "flexibilidad_Hombro", "agilidad"],
          campos_opcionales: ["imc", "test_Course_Navette"]
        });
      }

      // Calcular IMC automáticamente
      const pesoNum = parseFloat(peso);
      const estaturaNum = parseFloat(estatura);
      let imcCalculado = null;
      
      if (!isNaN(pesoNum) && !isNaN(estaturaNum) && estaturaNum > 0) {
        imcCalculado = (pesoNum / Math.pow(estaturaNum, 2)).toFixed(2);
      }

      const datosEvaluacion = {
        ...req.body,
        imc: imcCalculado || req.body.imc // Usar el calculado o el que viene
      };

      const evaluacion = await Evaluacion_Fisica.create(datosEvaluacion);
      
      res.status(201).json({ 
        mensaje: 'Evaluación física creada correctamente', 
        evaluacion 
      });
    } catch (error) {
      console.error("Error al crear evaluación física:", error);
    
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      res.status(500).json({ 
        error: 'Error al crear la evaluación física',
        detalle: errorMessage 
      });
    }
  }

  static actualizar_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      await evaluacion.update(req.body);
      res.json('Evaluación física actualizada correctamente');
    } catch (error) {
      console.error("Error al actualizar evaluación física:", error);
      
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({ error: 'Error al actualizar la evaluación física' });
    }
  }

  static eliminar_EvaluacionFisica_Por_Id = async (req: Request, res: Response) => {
    try {
      const evaluacion = await Evaluacion_Fisica.findByPk(req.params.id);
      if (!evaluacion) return res.status(404).json({ error: 'Evaluación física no encontrada' });
      await evaluacion.destroy();
      res.json('Evaluación física eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar evaluación física:", error);
      
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({ error: 'Error al eliminar la evaluación física' });
    }
  }
}