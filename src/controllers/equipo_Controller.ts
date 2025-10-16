import type { Request, Response } from "express";
import Equipo from "../models/equipo";
import Deportista from "../models/deportista";
import cloudinary from "../Config/cloudinary";
import fs from "fs-extra";
import fileUpload from "express-fileupload";
import Cronograma from "../models/Cronograma";

export class Equipo_Controller {
  static traer_Equipos = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/equipo");
      const equipos = await Equipo.findAll({
        include: [{ model: Deportista }],
      });
      res.json(equipos);
    } catch (error) {
      //console.log(error)
      res.status(500).json({ error: error });
    }
  };

  static traer_equipo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findByPk(id, {
        include: [{ model: Deportista },{model:Cronograma}],
      });
      if (!equipo) {
        const error = new Error("Equipo no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(equipo);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer el equipo" });
    }
  };

  static traer_equipoEntrenador_Por_Id = async (req: Request,res: Response) => {
    try {
      const { ID_Entrenador } = req.params;
      const equipo = await Equipo.findAll({
        where: { ID_Entrenador },
        include: [{ model: Deportista }],
      });
      if (!equipo) {
        const error = new Error("Equipo no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(equipo);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer el equipo" });
    }
  };

  static crear_Equipo = async (req: Request, res: Response) => {
    try {
      const equipo = new Equipo(req.body);
      const deportistas = req.body.deportista;

      await equipo.save();
      res.status(201).json({ mensaje: "El equipo se ha Creado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error al crear el equipo" });
    }
  };
  
  static actualizar_Equipo_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id);
    if (!equipo) return res.status(404).json({ error: "Equipo no encontrado" });

    const body = req.body || {};
    const dataToUpdate = { ...body };
    delete dataToUpdate.deportista;

    if (req.files?.foto_Equipo) {
      const file = req.files.foto_Equipo as any;
      const resultado = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "fotoEquipos",
        resource_type: "image",
      });
      await fs.unlink(file.tempFilePath);
      dataToUpdate.foto_Equipo = resultado.secure_url;
    }

    if (Object.keys(dataToUpdate).length) await equipo.update(dataToUpdate);

    if (Array.isArray(body.deportista)) {
      await equipo.$set("deportista", body.deportista, {
        through: { fecha_Asignacion: new Date(), estado: "ACTIVO" },
      });
    }

    const equipoActualizado = await Equipo.findByPk(id, { include: ["deportista"] });
    res.json({ mensaje: "Equipo actualizado correctamente", equipo: equipoActualizado });
  } catch {
    res.status(500).json({ error: "Hubo un error al actualizar el equipo" });
  }
};


  static agregarDeportista = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findByPk(id);
      if (!equipo) {
        const error = new Error("Equipo no encontrado");
        return res.status(404).json({ error: error.message });
      }

      const deportista = req.body.deportista;

      await equipo.$add("deportista", deportista, {
        through: { fecha_Asignacion: new Date(), estado: "ACTIVO" },
      });

      res.json("El equipo se ha actualizado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({ error: "Hubo un error al actualizar los el equipo" });
    }
  };

  static eliminar_Equipo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findByPk(id);
      if (!equipo) {
        const error = new Error("Equipo no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await equipo.destroy();
      res.json("El equipo se ha eliminado correctamente");
    } catch (error) {
      //console.log(error)
      res.status(500).json({ error: "Hubo un error al eliminar al equipo" });
    }
  };
}
