import { NextFunction, Request, Response } from "express";
import { param, body, validationResult } from "express-validator";

export const validar_Ejercicios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export const validar_Ejercicio_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validar_Ejercicio_Body = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  await body('nombre_Ejer')
    .notEmpty().withMessage('El nombre del ejercicio es obligatorio')
    .isLength({ max: 200 }).withMessage('El nombre no puede exceder los 200 caracteres')
    .run(req);

  await body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres')
    .run(req);

  await body('tipo_Ejer')
    .notEmpty().withMessage('El tipo de ejercicio es obligatorio')
    .isIn(['TECNICO', 'TACTICO', 'FISICO','CALENTAMIENTO','RECUPERACION']).withMessage('El tipo debe ser TECNICO, TACTICO o FISICO')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};