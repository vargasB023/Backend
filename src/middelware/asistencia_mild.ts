import { NextFunction, Request, Response } from "express";
import { param, body, validationResult } from "express-validator";

export const validar_Asistencias = async (req: Request,res: Response,next: NextFunction) => {
  next();
};

export const validar_Asistencia_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validar_Asistencia_Body = async (req: Request,res: Response,next: NextFunction) => {
  await body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')
    .run(req);

  await body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['ASISTIO', 'NO_ASISTIO']).withMessage('El estado debe ser ASISTIO o NO_ASISTIO')
    .run(req);

  await body('observaciones')
    .optional()
    .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder los 500 caracteres')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};