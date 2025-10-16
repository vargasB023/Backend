import { Request, Response } from "express"
import Perfil_Deportista from "../models/perfil_Deportista"
import Equipo from "../models/equipo"
import cloudinary from "../Config/cloudinary"
import fs from "fs-extra";
import Deportista from "../models/deportista";

export class perfil_Deportista_Controller{
  
  static traer_Perfil_Deportistas = async (req: Request, res: Response) => {
    try{
      console.log('Desde get /api/perfil_Deportista')
      const perfil_Deportistas = await Perfil_Deportista.findAll({
        order: [
          ['createdAT','ASC']
        ],
        //TODO: filtrar por el usuario autenticado
      })
      res.json(perfil_Deportistas)
    }catch (error){
      //console.log(error)
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static traer_Perfil_Deportista_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const perfil_Deportista = await Perfil_Deportista.findByPk(id)
    if (!perfil_Deportista) {
      const error = new Error('El perfil del deportista no encontrado')
      return res.status(404).json({ error: error.message })
    }
    
    const deportista = await Deportista.findByPk(perfil_Deportista.ID_Deportista)

    res.json({perfil_Deportista, deportista})
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al traer el perfil del deportista' })
  }
}

  static crear_Perfil_Deportista = async (req: Request, res: Response) => {
    try {
      const perfil_Deportista = new Perfil_Deportista(req.body)
      await perfil_Deportista.save()
      res.status(201).json({mensaje:'El perfil del deportista se ha Creado correctamente'})

    } catch (error) {
      //console.log(error)
      res.status(500).json({error: 'Hubo un error al crear el perfil del deportista'})
    }
  }


  static actualizar_Perfil_Deportista_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const perfil_Deportista = await Perfil_Deportista.findByPk(id);

    if (!perfil_Deportista) {
      return res.status(404).json({ error: "Perfil del deportista no encontrado" });
    }

    let dataToUpdate: any = { ...req.body };

    if (req.files && (req.files as any).foto_Perfil) {
      const file = (req.files as any).foto_Perfil;

      try {
        const resultado = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "perfilDeportista",
          resource_type: "image",
        });

        await fs.unlink(file.tempFilePath);

        dataToUpdate.foto_Perfil = resultado.secure_url;
      } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        return res.status(500).json({ mensaje: "Error al subir la imagen" });
      }
    }

    await perfil_Deportista.update(dataToUpdate);

    res.json({ mensaje: "El perfil del deportista se ha actualizado correctamente", perfil_Deportista });
  } catch (error) {
    console.error("Error en actualizar_Perfil_Deportista_Por_Id:", error);
    res.status(500).json({ error: "Hubo un error al actualizar el perfil del deportista" });
  }
};

  static eliminar_Perfil_Deportista_Por_Id = async (req: Request, res: Response) =>{
    try{
      const { id } = req.params
      const perfil_Deportista = await Perfil_Deportista.findByPk(id)
      if (!perfil_Deportista){
        const error = new Error('deportista no encontrado')
        return res.status(404).json({ error: error.message })
      }

      //escribir los cambios del body
      await perfil_Deportista.destroy()
      res.json('El  perfil del deportista se ha eliminado correctamente')
    } catch (error){
      //console.log(error)
      res.status(500).json({error:'Hubo un error al eliminar el perfil del entrenador'})
    }
  }
}