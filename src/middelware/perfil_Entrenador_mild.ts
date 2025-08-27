import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Entrenador from '../models/entrenador';
import { Perfil_Entrenador } from '../models/perfil_Entrenador';

export const validar_Perfil_Entrenador_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 }).withMessage('El ID del perfil debe ser un número entero mayor que 0')
    .custom(async (value) => {
      const perfil_entrenador = await Perfil_Entrenador.findByPk(value);
    
  
      if (!perfil_entrenador) {
        throw new Error('No se encontró un perfil con ese ID');
      }

      return true;
    })
    .run(req);

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}  

export const validar_Perfil_Entrenador_Body = async (req: Request,res: Response,next: NextFunction) => {
  
  await body('foto_Perfil')
    .optional()
    .isString().withMessage('La foto de perfil debe ser una cadena de texto')
    .isLength({ max: 255 }).withMessage('La URL de la foto no debe superar los 255 caracteres')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('La foto debe ser una imagen válida (jpg, jpeg, png, gif, webp)')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Errores de validación al crear o actualizar el perfil.",
      detalles: errors.array()
    });
  }
  next();
}
