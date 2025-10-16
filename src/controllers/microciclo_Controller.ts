import type { Request, Response } from "express";
import Microciclo from "../models/microciclo";
import Sesion from "../models/sesion";
import { Op } from "sequelize";
import Rel_Microciclo_Sesion from "../models/rel_Microciclo_Sesion";

export class microciclo_Controller {
static traer_Microciclos = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/microciclo");
      const microciclos = await Microciclo.findAll({
        include: [
          {
            model: Sesion,
            through: { attributes: ["dia_Semana"] },
          },
        ],
        order: [["fecha_Inicio", "ASC"]],
      });
      res.json(microciclos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error al traer los microciclos" });
    }
  };

  // 🔹 Traer uno por ID
  static traer_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const microciclo = await Microciclo.findByPk(id, {
        include: [
          {
            model: Sesion,
            through: { attributes: ["dia_Semana"] },
          },
        ],
      });
      if (!microciclo) {
        return res.status(404).json({ error: "Microciclo no encontrado" });
      }
      res.json(microciclo);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer el microciclo" });
    }
  };

  // 🔹 Traer microciclos en un rango de fechas
  static traer_Por_Fechas = async (req: Request, res: Response) => {
    try {
      const { inicio, fin } = req.query;
      const microciclos = await Microciclo.findAll({
        where: {
          fecha_Inicio: { [Op.gte]: inicio },
          fecha_Fin: { [Op.lte]: fin },
        },
        include: [
          {
            model: Sesion,
            through: { attributes: ["dia_Semana"] },
          },
        ],
        order: [["fecha_Inicio", "ASC"]],
      });
      res.json(microciclos);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al filtrar por fechas" });
    }
  };

  // 🔹 Traer microciclos por día de sesión (ej: lunes = 1)
  static traer_Por_Dia = async (req: Request, res: Response) => {
    try {
      const { dia } = req.params;
      const microciclos = await Microciclo.findAll({
        include: [
          {
            model: Sesion,
            through: {
              attributes: ["dia_Semana"],
              where: { dia_Semana: dia },
            },
          },
        ],
        order: [[Sesion, "dia_Semana", "ASC"]],
      });
      res.json(microciclos);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al filtrar por día" });
    }
  };

  // 🔹 Traer microciclos por intensidad (Alta, Media, Baja)
  static traer_Por_Intensidad = async (req: Request, res: Response) => {
    try {
      const { intensidad } = req.params;
      const microciclos = await Microciclo.findAll({
        where: { intensidad },
        include: [
          {
            model: Sesion,
            through: { attributes: ["dia_Semana"] },
          },
        ],
        order: [["fecha_Inicio", "ASC"]],
      });
      res.json(microciclos);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al filtrar por intensidad" });
    }
  };

  static crear_Microciclo = async (req: Request, res: Response) => {
    try {
      const { sesiones, ...datosMicro } = req.body;
      const microciclo = await Microciclo.create(datosMicro);

      if (Array.isArray(sesiones)) {
        await Promise.all(
          sesiones.map(async ({ ID_Sesion, dia_Semana }) => {
            const sesion = await Sesion.findByPk(ID_Sesion);
            if (sesion) {
              await Rel_Microciclo_Sesion.create({
                ID_Microciclo: microciclo.ID_Microciclo, 
                ID_Sesion,
                dia_Semana,
              });
            }}));}

      res.status(201).json({ mensaje: "Microciclo creado", microciclo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear el microciclo" });
    }
  };

  static actualizar_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const microciclo = await Microciclo.findByPk(id);
      if (!microciclo) {
        const error = new Error("Registro de microciclo no encontrado");
        return res.status(404).json({ error: error.message });
      }
      await microciclo.update(req.body);
      res.json("El microciclo se ha actualizado correctamente");
    } catch (error) {
      res
        .status(500)
        .json({ error: "Hubo un error al actualizar el microciclo" });
    }
  };

  static asignarSesion = async (req: Request, res: Response) => {
    try {
      const microciclo = await Microciclo.findByPk(req.body.ID_Microciclo);
      if (!microciclo) {
        const error = new Error("Registro de microciclo no encontrado");
        return res.status(404).json({ error: error.message });
      }

      microciclo.$add("sesion", req.body.ID_Sesion, {
        through: { dia_Semana: req.body.dia_Semana },
      });

      res.json("El microciclo se ha actualizado correctamente");
    } catch (error) {
      res
        .status(500)
        .json({ error: "Hubo un error al actualizar el microciclo" });
    }
  };

  static eliminar_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const microciclo = await Microciclo.findByPk(id);
      if (!microciclo) {
        const error = new Error("Registro de microciclo no encontrado");
        return res.status(404).json({ error: error.message });
      }
      await microciclo.destroy();
      res.json("El microciclo se ha eliminado correctamente");
    } catch (error) {
      res
        .status(500)
        .json({ error: "Hubo un error al eliminar el microciclo" });
    }
  };
}
