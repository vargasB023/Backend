import type { Request, Response } from "express";
import Ejercicio from "../models/ejercicio";
import Sesion from "../models/sesion";

export class ejercicio_Controller {
  
  static traer_Ejercicios = async (req: Request, res: Response) => {
    try {
      console.log('Desde get /api/ejercicio');
      const ejercicios = await Ejercicio.findAll();
      res.json(ejercicios);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer los ejercicios' });
    }
  }

  static traer_Ejercicio_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ejercicio = await Ejercicio.findByPk(id,
        {include: {model:Sesion}}
      );
      if (!ejercicio) {
        const error = new Error('Ejercicio no encontrado');
        return res.status(404).json({ error: error.message });
      }
      res.json(ejercicio);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer el ejercicio' });
    }
  }

  static crear_Ejercicio = async (req: Request, res: Response) => {
    try {
      console.log("REQ BODY:", req.body); 
      const ejercicio = new Ejercicio(req.body);
      await ejercicio.save();
      res.status(201).json({ mensaje: 'El Ejercicio se ha creado correctamente' });
    } catch (error) {
        console.error(" Error al guardar el ejercicio:", error);
      res.status(500).json({ error: 'Hubo un error al crear el ejercicio' });
    }
  }

 static actualizar_Ejercicio_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ejercicio = await Ejercicio.findByPk(id);
    if (!ejercicio) return res.status(404).json({ error: "Ejercicio no encontrado" });

    await ejercicio.update(req.body);
    return res.json({ mensaje: "El ejercicio se ha actualizado correctamente", ejercicio });
  } catch (error) {
    console.error("Error al actualizar el ejercicio:", error);
    return res.status(500).json({ error: "Hubo un error al actualizar el ejercicio" });
  }
};

  static eliminar_Ejercicio_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ejercicio = await Ejercicio.findByPk(id);
      if (!ejercicio) {
        const error = new Error('Ejercicio no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await ejercicio.destroy();
      res.json('El ejercicio se ha eliminado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al eliminar el ejercicio' });
    }
  }
}