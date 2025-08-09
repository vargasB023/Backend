import { NextFunction, Request, Response } from "express";
import { param, body, validationResult } from "express-validator";
import plan_De_Entrenamiento from "../models/plan_de_entrenamiento";

export const validar_Planes_Entrenamiento = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};



export const validar_Plan_Entrenamiento_Body = async (req: Request,res: Response,next: NextFunction) => {
  await body('nombre_Plan')
    .notEmpty().withMessage('El nombre del plan es obligatorio')
    .isLength({ max: 255 }).withMessage('El nombre no puede exceder los 255 caracteres')
    .run(req);

  await body('objetivo')
    .notEmpty().withMessage('El objetivo es obligatorio')
    .isLength({ max: 255 }).withMessage('El objetivo no puede exceder los 255 caracteres')
    .run(req);

  await body('duracion')
    .notEmpty().withMessage('La duración es obligatoria')
    .isInt({ gt: 0 }).withMessage('La duración debe ser un número entero mayor que 0')
    .run(req);

  await body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')
    
    .custom((value) => {
      const fechaInicio = new Date(value);
      const fechaActual = new Date();
      // Ajustamos la fecha actual para comparar solo día, mes y año
      fechaActual.setHours(0, 0, 0, 0);
      
      if (fechaInicio < fechaActual) {
        throw new Error('La fecha de inicio no puede ser anterior a la fecha actual');
      }
      return true;
    })

    .run(req);

  await body('fecha_fin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')
    .custom((value, { req }) => {
      const fechaFin = new Date(value);
      const fechaInicio = new Date(req.body.fecha_inicio);
      
      if (fechaFin <= fechaInicio) {
        throw new Error('La fecha de fin no puede ser anterior o igual a la fecha de inicio');
      }
      return true;
    })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
