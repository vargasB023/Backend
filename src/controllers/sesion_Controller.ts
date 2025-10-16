import { Request, Response } from "express";
import Sesion from "../models/sesion";
import Ejercicio from "../models/ejercicio";
import { body } from "express-validator";
import { Model } from "sequelize-typescript";
import rel_Ejercicio_Sesion from "../models/rel_Ejercicio_Sesion";

export class sesion_Controller {
  static traer_Sesiones = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/sesion");

      const sesiones = await Sesion.findAll({
        include: [
          {
            model: Ejercicio,
            through: {
              attributes: [
                "fase",
                "orden",
                "series",
                "repeticiones",
                "duracion_min",
                "observaciones",
              ],
            },
          },
        ],
      });

      res.json(sesiones);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer las sesiones" });
    }
  };

  static traer_Sesion_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const sesion = await Sesion.findByPk(id, {
        include: [
          {
            model: Ejercicio,
            through: {
              attributes: [
                "fase",
                "orden",
                "series",
                "repeticiones",
                "duracion_min",
                "observaciones",
              ],
            },
          },
        ],
      });

      if (!sesion) {
        return res.status(404).json({ error: "Sesion no encontrada" });
      }

      res.json(sesion);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer la sesion" });
    }
  };

  static crear_Sesion = async (req: Request, res: Response) => {
  try {
    const { ID_Entrenador, nombre_Sesion, hora_Inicio, hora_Fin, objetivo, observaciones, ejercicios = [] } = req.body;

    // Validaciones defensivas
    if (!ID_Entrenador || isNaN(Number(ID_Entrenador))) {
      return res.status(400).json({ error: "ID_Entrenador inválido" });
    }
    if (!nombre_Sesion?.trim()) {
      return res.status(400).json({ error: "El nombre de la sesión es obligatorio" });
    }

    const normalizarHora = (h: string) =>
      h && /^\d{2}:\d{2}$/.test(h) ? `${h}:00` : h;

    const sesion = await Sesion.create({
      ID_Entrenador: Number(ID_Entrenador),
      nombre_Sesion: nombre_Sesion.trim(),
      hora_Inicio: normalizarHora(hora_Inicio),
      hora_Fin: normalizarHora(hora_Fin),
      objetivo,
      observaciones,
    });
    for (const [i, ejer] of ejercicios.entries()) {
      const idEj = Number(ejer.ID_Ejercicio);
      const faseValida = ["CALENTAMIENTO", "PARTE_PRINCIPAL", "RECUPERACION"];

      if (!idEj) {
        return res.status(400).json({ error: `Ejercicio #${i + 1} con ID_Ejercicio inválido` });
      }
      if (!faseValida.includes(ejer.fase)) {
        return res.status(400).json({ error: `Fase inválida en ejercicio #${i + 1}` });
      }

      await sesion.$add("ejercicio", idEj, {
        through: {
          fase: ejer.fase,
          orden: Number(ejer.orden) || null,
          series: Number(ejer.series) || null,
          repeticiones: Number(ejer.repeticiones) || null,
          duracion_min: Number(ejer.duracion_min) || 0,
          observaciones: ejer.observaciones ?? null,
        },
      });
    }

    res.status(201).json({ mensaje: "La sesión se ha creado correctamente", sesion });

  } catch (error: any) {
    console.error("Error crear sesión:", error?.message || error);
    res.status(500).json({ error: "Hubo un error al crear la sesión", detalle: error?.message || String(error) });
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
