import type { Request, Response } from "express";
import Microciclo from "../models/microciclo";
import Sesion from "../models/sesion";

export class microciclo_Controller {
  
  static traer_Microciclos = async (req: Request, res: Response) => {
    try {
      console.log('Desde get /api/microciclo');
      const microciclos = await Microciclo.findAll({
      include: [{model :Sesion}] 
      })
      res.json(microciclos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al traer los microciclos' });
    }
  }

  static traer_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
       const microciclo = await Microciclo.findByPk(id, {
        
      });
      if (!microciclo) {
        const error = new Error('Microciclo no encontrado');
        return res.status(404).json({ error: error.message });
      }
      res.json(microciclo);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al traer el microciclo' });
    }
  }

  static crear_Microciclo = async (req: Request, res: Response) => {
    try {
      const microciclo = new Microciclo(req.body);
      await microciclo.save();
      res.status(201).json({ mensaje: 'El Microciclo se ha creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al crear el microciclo' });
    }
  }

  static actualizar_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const microciclo = await Microciclo.findByPk(id);
      if (!microciclo) {
        const error = new Error('Registro de microciclo no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await microciclo.update(req.body);
      res.json('El microciclo se ha actualizado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el microciclo' });
    }
  }


  static asignarSesion = async (req: Request, res: Response) => {
    try {
      const microciclo = await Microciclo.findByPk(req.body.ID_Microciclo);
      if (!microciclo) {
        const error = new Error('Registro de microciclo no encontrado');
        return res.status(404).json({ error: error.message });
      }

      microciclo.$add("sesion", req.body.ID_Sesion,{
        through:{dia_Semana: req.body.dia_Semana}
      });

      res.json('El microciclo se ha actualizado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el microciclo' });
    }
  }

  static eliminar_Microciclo_Por_Id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const microciclo = await Microciclo.findByPk(id);
      if (!microciclo) {
        const error = new Error('Registro de microciclo no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await microciclo.destroy();
      res.json('El microciclo se ha eliminado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al eliminar el microciclo' });
    }
  }
}