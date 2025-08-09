import { Request, Response } from "express"
import Perfil_Deportista from "../models/perfil_Deportista"
import Equipo from "../models/equipo"

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
    res.json(perfil_Deportista)
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

  //ACTUALIZAR
  static actualizar_Perfil_Deportista_Por_Id = async (req: Request, res: Response) => {
    try{
      const { id } = req.params
      const perfil_Deportista = await Perfil_Deportista.findByPk(id)
      if (!perfil_Deportista){
        const error = new Error ('Pefil del deportista no encontrado')
        return res.status(404).json({ error: error.message })
      }
      //escribir los cambios del body 
      await perfil_Deportista.update(req.body)
      res.json('El perfil del deportista se ha actualizado correctamente')
    }catch(error){
      //console.log(error)
      res.status(500).json({error: 'Hubo un error al actualizar el perfil del deportista'})

    }  
  }

  //ELIMINAR
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