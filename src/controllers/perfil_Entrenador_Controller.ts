import type { Request, Response } from "express";
import { Perfil_Entrenador } from "../models/perfil_Entrenador";
import Entrenador from "../models/entrenador";
import cloudinary from '../Config/cloudinary'; 
import fs from "fs-extra";

export class perfil_Entrenador_controller {
  
  static traer_Perfil_Entrenadores = async (req: Request, res: Response) => {
    try{
      console.log('Desde get /api/perfil_Entrenador')
      const perfil_Entrenadores = await Perfil_Entrenador.findAll({
        order: [
          ['createdAT','ASC']
        ],
      
      })
      res.json(perfil_Entrenadores)
    }catch (error){
      //console.log(error)
      res.status(500).json({error: 'Hubo un error'})
    }
  }  

static traer_Perfil_Entrenador_Por_Id = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const { id } = req.params
    const perfil_Entrenador = await Perfil_Entrenador.findByPk(id)
    if (!perfil_Entrenador) {
      const error = new Error('El perfil del entrenador no encontrado')
      return res.status(404).json({ error: error.message })
    }

    const entrenador = await Entrenador.findByPk(perfil_Entrenador.ID_Entrenador)

    res.json({perfil_Entrenador,entrenador})
    //res.json(perfil_Entrenador)
    
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al traer el perfil del entrenador' })
  }
}

  static crear_Perfil_Entrenador = async (req: Request, res: Response) => {
    try {
      const perfil_Entrenador = new Perfil_Entrenador(req.body)
      await perfil_Entrenador.save()
      res.status(201).json({mensaje:'El perfil del entrenador se ha Creado correctamente'})

    } catch (error) {
      //console.log(error)
      res.status(500).json({error: 'Hubo un error al crear el perfil del entrenador'})
    }
  }

static actualizar_Perfil_Entrenador_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const perfil_Entrenador = await Perfil_Entrenador.findByPk(id);

    if (!perfil_Entrenador) {
      return res.status(404).json({ error: "Perfil del entrenador no encontrado" });
    }

    let dataToUpdate: any = { ...req.body };

    if (req.files && (req.files as any).foto_Perfil) {
      const file = (req.files as any).foto_Perfil;

      try {
        const resultado = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "perfilEntrenador",
          resource_type: "image",
        });
        await fs.unlink(file.tempFilePath);

        dataToUpdate.foto_Perfil = resultado.secure_url;
      } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        return res.status(500).json({ mensaje: "Error al subir la imagen" });
      }
    }

    await perfil_Entrenador.update(dataToUpdate);

    res.json({ mensaje: "El perfil del entrenador se ha actualizado correctamente", perfil_Entrenador });
  } catch (error) {
    console.error("Error en actualizar_Perfil_Entrenador_Por_Id:", error);
    res.status(500).json({ error: "Hubo un error al actualizar el perfil del Entrenador" });
  }
};

  static eliminar_Perfil_Entrenador_Por_Id = async (req: Request, res: Response) =>{
    try{
      const { id } = req.params
      const perfil_Entrenador = await Perfil_Entrenador.findByPk(id)
      if (!perfil_Entrenador){
        const error = new Error('Registro de entrenador no encontrado')
        return res.status(404).json({ error: error.message })
      }
      await perfil_Entrenador.destroy()
      res.json('El  perfil del entrenador se ha eliminado correctamente')
    } catch (error){
      res.status(500).json({error:'Hubo un error al eliminar el perfil del entrenador'})
    }
  }
}