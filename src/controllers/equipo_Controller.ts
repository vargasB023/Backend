import type { Request, Response } from "express";
import Equipo from "../models/equipo";
import Deportista from "../models/deportista";

export class Equipo_Controller {
  
  static traer_Equipos = async (req: Request, res: Response) => {
    try{
      console.log('Desde get /api/equipo')
      const equipos = await Equipo.findAll({
        include: [{model : Deportista}]
        
      })
      res.json( equipos)
    }catch (error){
      //console.log(error)
      res.status(500).json({error: error})
    }
  }

  static traer_equipo_Por_Id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const equipo = await Equipo.findByPk(id,{
      include: [{model : Deportista}]
    })
    if (!equipo) {
      const error = new Error('Equipo no encontrado')
      return res.status(404).json({ error: error.message })
    }
    res.json(equipo)
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al traer el equipo' })
  }
}

static traer_equipoEntrenador_Por_Id = async (req: Request, res: Response) => {
  try {
    const { ID_Entrenador} = req.params
    const equipo = await Equipo.findAll({
      where:{ID_Entrenador},
      include: [{model : Deportista}]
    })
    if (!equipo) {
      const error = new Error('Equipo no encontrado')
      return res.status(404).json({ error: error.message })
    }
    res.json(equipo)
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al traer el equipo' })
  }
}

  static crear_Equipo = async (req: Request, res: Response) => {
    try {
      const equipo = new Equipo(req.body)
      const deportistas= req.body.deportista;

      await equipo.save()     
      res.status(201).json({mensaje:'El equipo se ha Creado correctamente'})
    } catch (error) {
      console.log(error)
      res.status(500).json({error: 'Hubo un error al crear el equipo'})
    }
  }

  //ACTUALIZAR
  static actualizar_Equipo_Por_Id = async (req: Request, res: Response) => {
    try{
      const { id } = req.params
      const equipo= await Equipo.findByPk(id)
      if (!equipo){
        const error = new Error ('Equipo no encontrado')
        return res.status(404).json({ error: error.message })
      }
      await equipo.update(req.body)

      
      const deportistas= req.body.deportista;

      await equipo.$set("deportista",deportistas,{
        through: { fecha_Asignacion: new Date(), estado:"ACTIVO" }
      });

      res.json('El equipo se ha actualizado correctamente')
    }catch(error){
      //console.log(error)
      res.status(500).json({error: 'Hubo un error al actualizar los el equipo'})

    }  
  }


  //ACTUALIZAR
  static agregarDeportista = async (req: Request, res: Response) => {
    try{
      const { id } = req.params
      const equipo= await Equipo.findByPk(id)
      if (!equipo){
        const error = new Error ('Equipo no encontrado')
        return res.status(404).json({ error: error.message })
      } 

      
      const deportista= req.body.deportista;

      await equipo.$add("deportista",deportista,{
        through: { fecha_Asignacion: new Date(), estado:"ACTIVO" }
      });

      res.json('El equipo se ha actualizado correctamente')
    }catch(error){
      //console.log(error)
      res.status(500).json({error: 'Hubo un error al actualizar los el equipo'})

    }  
  }


  //ELIMINAR
  static eliminar_Equipo_Por_Id = async (req: Request, res: Response) =>{
    try{
      const { id } = req.params
      const equipo = await Equipo.findByPk(id)
      if (!equipo){
        const error = new Error('Equipo no encontrado')
        return res.status(404).json({ error: error.message })
      }
      //escribir los cambios del body
      await equipo.destroy()
      res.json('El equipo se ha eliminado correctamente')
    } catch (error){
      //console.log(error)
      res.status(500).json({error:'Hubo un error al eliminar al equipo'})
    }
  }
}