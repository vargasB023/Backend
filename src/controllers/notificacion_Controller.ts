import { Request, Response } from "express";
import Notificaciones from "../models/notificaciones";

export class Notificaciones_controller {
  static traer_Notificaciones = async (req: Request, res: Response) => {
    try {
      const notificaciones = await Notificaciones.findAll();
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las notificaciones' });
    }
  }
  static traer_Notificacion_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notificacion = await Notificaciones.findByPk(id);
      if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });
      res.json(notificacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la notificación' });
    }
  }

  static crear_Notificacion = async (req: Request, res: Response) => {
    try {
      const notificacion = await Notificaciones.create(req.body);
      res.status(201).json({ mensaje: 'Notificación creada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la notificación' });
    }
  }

  static actualizar_Notificacion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notificacion = await Notificaciones.findByPk(id);
      if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });

      await notificacion.update(req.body);
      res.json({ mensaje: 'Notificación actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la notificación' });
    }
  }

  static eliminar_Notificacion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notificacion = await Notificaciones.findByPk(id);
      if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });

      await notificacion.destroy();
      res.json({ mensaje: 'Notificación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la notificación' });
    }
  }

  static traer_Notificaciones_Por_Deportista = async (req: Request, res: Response) => {
    try {
      const { ID_Deportista } = req.params;
      const notificaciones = await Notificaciones.findAll({
        where: { ID_Deportista },
        order: [['fecha', 'DESC']],
        limit: 50 // Últimas 50 notificaciones
      });
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las notificaciones del deportista' });
    }
  }

  static marcar_Como_Leida = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notificacion = await Notificaciones.findByPk(id);
      if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });

      await notificacion.update({ leida: true });
      res.json({ mensaje: 'Notificación marcada como leída' });
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar la notificación como leída' });
    }
  }
}
