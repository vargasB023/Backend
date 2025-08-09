import type { Request, Response } from "express";
import Deportista from "../models/deportista";
import Equipo from "../models/equipo";
import Rel_Deportista_Equipo from "../models/rel_Deportista_Equipo";
import Perfil_Deportista from "../models/perfil_Deportista";
import { enviarCorreoBienvenida } from "../utils/enviarCorreo";

export class Deportista_controller {
  static traer_Deportistas = async (req: Request, res: Response) => {
    try {
      console.log("Desde get /api/deportista");
      const deportistas = await Deportista.findAll({
        order: [["createdAT", "ASC"]],
        include: [{ model: Equipo }],
      });
      res.json(deportistas);
    } catch (error) {
      //console.log(error)
      res.status(500).json({ error: "Hubo un error al traer los deportistas" });
    }
  };

  static traer_Deportista_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deportista = await Deportista.findByPk(id, {});
      if (!deportista) {
        const error = new Error("Deportista no encontrado");

        return res.status(404).json({ error: error.message });
      }
      res.json(deportista);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al traer el deportista" });
    }
  };

  static traer_Deportista_Por_Email = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { email, Contrasena } = req.body;
      const deportistas = await Deportista.findOne({
        where: { email },
        include: [{ model: Perfil_Deportista }],
      });

      if (!deportistas) {
        const error = new Error("El deportista no se ha encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (deportistas.contrasena !== Contrasena) {
        const error = new Error("El Correo o contraseña es incorrecto");
        return res.status(401).json({ error: error.message });
      }

      res
        .status(200)
        .json({ mensaje: "iniciando la sesion", deportista: deportistas });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static crear_Deportista = async (req: Request, res: Response) => {
    try {
      const deportistas = new Deportista(req.body);
      const datosDeportista = await deportistas.save();

      const perfilDe = new Perfil_Deportista({
        ID_Deportista: datosDeportista.ID_Deportista,
        foto_perfil: "",
      });

      await perfilDe.save();

      // Enviar correo de bienvenida
      await enviarCorreoBienvenida(
        datosDeportista.email,
        datosDeportista.nombre_Completo,
        "deportista"
      );
      res
        .status(201)
        .json({ mensaje: "El deportista se ha Creado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Hubo un error al crear el deportista" });
    }
  };

  static actualizar_Deportista_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deportista = await Deportista.findByPk(id);
      if (!deportista) {
        const error = new Error("Registro del deportista no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await deportista.update(req.body);
      res.json("El deportista se ha actualizado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({ error: "Hubo un error al actualizar el deportista" });
    }
  };

  static inactivar = async (req: Request, res: Response) => {
    try {
      const { ID_Deportista, ID_Equipo } = req.body;
      const relacion = await Rel_Deportista_Equipo.findOne({
        where: { ID_Deportista, ID_Equipo },
      });
      if (!relacion) {
        const error = new Error(
          "No hay relacion entre el equipo y el deportista"
        );
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await relacion.update({ ...relacion, estado: "INACTIVO" });
      res.json("El deportista se ha actualizado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({
          error:
            "Hubo un error al actualizar el estado del deportista en el equipo",
        });
    }
  };

  //ELIMINAR
  static eliminar_Deportista_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deportista = await Deportista.findByPk(id);
      if (!deportista) {
        const error = new Error("Registro de deportista no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //escribir los cambios del body
      await deportista.destroy();
      res.json("El deportista se ha eliminado correctamente");
    } catch (error) {
      //console.log(error)
      res
        .status(500)
        .json({ error: "Hubo un error al eliminar al deportista" });
    }
  };
}
