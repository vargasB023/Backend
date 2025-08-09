import type { Request, Response } from "express";
import Asistencia from "../models/asistencia";

export class asistencia_Controller {
  
  static traer_Asistencias = async (req: Request, res: Response) => {
    try {
      console.log('Desde get /api/asistencia');
      const asistencias = await Asistencia.findAll({
        order: [
          ['fecha', 'DESC']
        ],
      });
      res.json(asistencias);
    } catch (error) {
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

  static crear_Asistencia = async (req: Request, res: Response) => {
    try {
      const asistencia = new Asistencia(req.body);
      await asistencia.save();
      res.status(201).json({ mensaje: 'La Asistencia se ha registrado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al registrar la asistencia' });
    }
  }

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