import { Request, Response } from "express";
import Sesion from "../models/sesion";
import Ejercicio from "../models/ejercicio";
import { body } from "express-validator";

export class sesion_Controller {
  static traer_Sesiones = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/sesion");
      const sesiones = await Sesion.findAll({
        include: [{ model: Ejercicio }],
      });
      res.json(sesiones);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer las sesiones" });
    }
  };

  static traer_Sesion_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sesion = await Sesion.findByPk(id);
      include: [{ model: Ejercicio }];
      if (!sesion) {
        const error = new Error("Sesion no encontrada");
        return res.status(404).json({ error: error.message });
      }
      res.json(sesion);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer la sesion" });
    }
  };

  static crear_Sesion = async (req: Request, res: Response) => {
    try {
      const sesion = new Sesion(req.body);
      console.log(req.body);
      const ejercicios = req.body.ejercicios;

      await sesion.save();

      ejercicios.map(async (ejer: any) =>  {
        await sesion.$add("ejercicio", ejer.ID_Ejercicio, {
          through: {
            fase: ejer.fase,
            orden: ejer.orden,
            series: ejer.series,
            repeticiones: ejer.repeticiones,
            duracion_min: ejer.duracion_min,
            observaciones: ejer.observaciones,
          },
        });
      });

      res.status(201).json({ mensaje: "La sesion se ha creado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al crear la sesion" });
    }
  };

  static actualizar_Sesion_Por_Id = async (req: Request, res: Response) => {
    try {
      const sesion = await Sesion.findByPk(req.params.id);
      if (!sesion)
        return res.status(404).json({ error: "Sesion no encontrada" });
      await sesion.update(req.body);
      res.json("Sesion actualizada correctamente");
    } catch {
      res.status(500).json({ error: "Error al actualizar la sesion" });
    }
  };

  static eliminar_Sesion_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sesion = await Sesion.findByPk(id);
      if (!sesion) {
        const error = new Error("La sesion no se ha encontrado");
        return res.status(404).json({ error: error.message });
      }
      await sesion.destroy();
      res.json("La sesion se ha eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al eliminar la sesion " });
    }
  };
}
