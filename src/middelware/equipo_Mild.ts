import { NextFunction, Request,Response } from "express";
import { body, param, validationResult } from "express-validator";
import { validar_ID_Entrenador } from "./entrenador_Mild";

export const validar_Equipo_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id').isInt().withMessage('El ID no es valido')
    .custom(value => value > 0)
    .withMessage('ID no es valido ')
    .run(req);
    let errors =validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
}
  next();
};

export const validar_Equipo_Body = async (req: Request,res: Response,next: NextFunction) => {

  await validar_ID_Entrenador.run(req);

  await body('nombre_Equipo')
    .notEmpty().withMessage('El nombre del equipo es obligatorio')
    .isString().withMessage('El nombre del equipo debe ser texto')
    .isLength({ max: 30 }).withMessage('El nombre del equipo no debe superar los 30 caracteres')
    .run(req);

  await body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isIn(['INFANTIL', 'JUVENIL', 'MAYOR']).withMessage('Categoría no válida')
    .run(req);

  await body('foto_Equipo')
    .optional()
    .isString().withMessage('La foto de perfil debe ser una cadena de texto')
    .isLength({ max: 255 }).withMessage('La URL de la foto no debe superar los 255 caracteres')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('La foto debe ser una imagen válida (jpg, jpeg, png, gif, webp)')
    .run(req);

  await body('liga')
    .notEmpty().withMessage('La liga es obligatoria')
    .isIn(['MASCULINO', 'FEMENINO', 'MIXTO']).withMessage('Liga no válida')
    .run(req);

  await body('estado_Equipo')
    .optional()
    .isIn(['ACTIVO', 'INACTIVO']).withMessage('Estado del equipo no válido')
    .run(req);

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }

  next();
};
