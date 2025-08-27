import type { Request, Response } from "express";
import cloudinary from "../Config/cloudinary";
import Entrenador from "../models/entrenador";
import Perfil_Entrenador from "../models/perfil_Entrenador";
import { enviarCorreoBienvenida } from "../utils/enviarCorreo";

import fs from 'fs-extra'

export class Entrenador_controller {
  static traer_Entrenadores = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/entrenador");
      const entrenadores = await Entrenador.findAll({
        order: [["createdAT", "ASC"]],
        //TODO: filtrar por el usuario autenticado
      });
      res.json(entrenadores);
    } catch (error) {
      //console.log(error)
      res.status(500).json({ error });
    }
  };

  static traer_Entrenador_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entrenador = await Entrenador.findByPk(id);
      if (!entrenador) {
        const error = new Error("Entrenador no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(entrenador);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer el entrenador" });
    }
  };

  static traer_Entrenador_Por_Email = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { Email, Contrasena } = req.body;
      const entrenadores = await Entrenador.findOne({
        where: { Email },
        include: [{ model: Perfil_Entrenador }],
      });

      if (!entrenadores) {
        const error = new Error("El entrenador no se ha encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (entrenadores.contrasena !== Contrasena) {
        const error = new Error("El Correo o contraseña es incorrecto");
        return res.status(401).json({ error: error.message });
      }

      res
        .status(200)
        .json({ mensaje: "iniciando la sesion", entrenador: entrenadores });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };


  static crear_Entrenador = async (req: Request, res: Response) => {
    try {

      if (req.files) {
        try {
          const path=req.files as any;
          console.log(path.certificacion.tempFilePath)
          const resultado = await cloudinary.uploader.upload(path.certificacion.tempFilePath, {
            folder: "certificados",
            resource_type: "auto", // permite PDF, imágenes, etc.
          });

          await fs.unlink(path.certificacion.tempFilePath);
          const urlCertificado = resultado.secure_url;
          req.body.certificacion= urlCertificado;
        } catch (error) {
          console.error("Error al subir archivo a Cloudinary:", error);
          return res.status(500).json({ mensaje: "Error al subir el archivo" });
        }
      }

      const entrenador = new Entrenador(req.body);
      const datosEntrenador = await entrenador.save();

      const perfil = new Perfil_Entrenador({
        ID_Entrenador: datosEntrenador.ID_Entrenador,
        foto_Perfil: "",
      });
      await perfil.save();

      //correo
      try {
        await enviarCorreoBienvenida(
          datosEntrenador.email,
          datosEntrenador.nombre_Completo,
          "entrenador"
        );
      } catch (correoError) {
        console.error("Error al enviar el correo de bienvenida:", correoError);
      }

      res.status(201).json({ mensaje: "El Entrenador se ha Creado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Hubo un error al crear el entrenador" });
    }
  };
  
  static actualizar_entrenador_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entrenador = await Entrenador.findByPk(id);
      if (!entrenador) {
        const error = new Error("Registro de entrenador no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await entrenador.update(req.body);
      res.json("El entrenador se ha actualizado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({ error: "Hubo un error al actualizar los el Entrenador" });
    }
  };

  //ELIMINAR
  static eliminar_Entrenador_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entrenador = await Entrenador.findByPk(id);
      if (!entrenador) {
        const error = new Error("Registro de entrenador no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await entrenador.destroy();
      res.json("El entrenador se ha eliminado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({ error: "Hubo un error al eliminar al entrenador" });
    }
  };
}
