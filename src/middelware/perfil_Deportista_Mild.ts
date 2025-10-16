import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Perfil_Deportista from '../models/perfil_Deportista';
import Deportista from '../models/deportista';


export const validar_Perfil_Deportista_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 }).withMessage('El ID del perfil debe ser un número entero mayor que 0')
    .custom(async (value) => {
      const perfil_deportista = await Perfil_Deportista.findByPk(value);
      if (!perfil_deportista) {
        throw new Error('No se encontró un perfil con ese ID');
      }
      return true;
    })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}  

export const validar_Perfil_Deportista_Body = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  await body('foto_Perfil')
    .optional()
    .isString().withMessage('La foto de perfil debe ser una cadena de texto')
    .isLength({ max: 255 }).withMessage('La URL de la foto no debe superar los 255 caracteres')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('La foto debe ser una imagen válida (jpg, jpeg, png, gif, webp)')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
