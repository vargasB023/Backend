import { Request, Response } from "express";
import h_Lesiones_Antes from "../models/h_Lesiones_Antes";
import Deportista from "../models/deportista";

export class h_Lesiones_Antes_Controller {
  static validar_Registros_Lesiones_Antes = async (req: Request, res: Response) => {
    try {
      const lesiones = await h_Lesiones_Antes.findAll({
      include: [{ model: Deportista } ]
      });
      res.json(lesiones);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener lesiones anteriores" });
    }
  };

  static validar_Lesion_Antes_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const lesion = await h_Lesiones_Antes.findByPk(id);
      if (!lesion) return res.status(404).json({ error: "Lesión no encontrada" });
      res.json(lesion);
    } catch (error) {
      res.status(500).json({ error: "Error al buscar la lesión" });
    }
  };

  static crear_Registro_Lesion_Antes = async (req: Request, res: Response) => {
    try {
      const nueva = await h_Lesiones_Antes.create(req.body);
      res.status(201).json({ mensaje: "Lesión registrada correctamente", data: nueva });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar la lesión" });
    }
  };

  static actualizar_Registro_Lesion_Antes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const lesion = await h_Lesiones_Antes.findByPk(id);
      if (!lesion) return res.status(404).json({ error: "No encontrada" });
      await lesion.update(req.body);
      res.json({ mensaje: "Lesión actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la lesión" });
    }
  };

  static eliminar_Registro_Lesion_Antes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const lesion = await h_Lesiones_Antes.findByPk(id);
      if (!lesion) return res.status(404).json({ error: "No encontrada" });
      await lesion.destroy();
      res.json({ mensaje: "Lesión eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la lesión" });
    }
  };
}
