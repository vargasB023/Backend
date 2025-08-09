import { Request, Response } from "express";
import Cronograma from "../models/Cronograma";
import Equipo from "../models/equipo";


export class Cronograma_Controller {
  
   static traer_Cronogramas = async (req: Request, res: Response) => {
      try {
        console.log("Desde get /api/cronograma"); 
        const cronogramas = await Cronograma.findAll({
          order: [["createdAT", "ASC"]],
            include: [{model : Equipo}]
        });
        const respuesta = cronogramas.map((cronograma)=>{
          const datos ={...cronograma.toJSON(), nombre_Equipo:cronograma.equipo.nombre_Equipo, categoria:cronograma.equipo.categoria};
          delete datos.equipo;
          return  datos;
        });
        console.log(respuesta);
        res.json(respuesta);
      } catch (error) {
        //console.log(error)
        res
          .status(500)
          .json({ error: "Hubo un error al traer los entrenadores" });
      }
    };


   static traer_Cronograma_Por_Id = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const cronograma = await Cronograma.findByPk(id);
        if (!cronograma) {
          const error = new Error("cronograma no encontrado");
          return res.status(404).json({ error: error.message });
        }
        res.json(cronograma);
      } catch (error) {
        res.status(500).json({ error: "Hubo un error al traer el cronograma" });
      }
    };
  

  static crear_Cronograma = async (req: Request, res: Response) => {
    try {
      const nuevo = await Cronograma.create(req.body);
      const equipo = req.body.equipo;
      res.status(201).json({ mensaje: "Evento creado correctamente", data: nuevo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el evento" });
    }
  };

  static actualizar_Cronograma = async (req: Request, res: Response) => {
      try{
        const { id } = req.params
        const cronograma= await Cronograma.findByPk(id)
        if (!cronograma){
          const error = new Error ('cronograma no encontrado')
          return res.status(404).json({ error: error.message })
        }
        await cronograma.update(req.body)
        res.json('cronograma actualizado correctamente')
      }catch(error){
        console.log(error)
        res.status(500).json({error: 'Hubo un error al actualizar elcronograma'})
      }  
    }

  static eliminar_Cronograma = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const evento = await Cronograma.findByPk(id);
      if (!evento) return res.status(404).json({ error: "No encontrado" });
      await evento.destroy();
      res.json({ mensaje: "Evento eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el evento" });
    }
  };
}
