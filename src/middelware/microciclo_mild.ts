import { NextFunction, Request, Response } from "express";
import { param, body, validationResult } from "express-validator";
import Microciclo from "../models/microciclo";
import Plan_De_Entrenamiento from "../models/plan_de_entrenamiento";

export const validar_Microciclos = async (req: Request,res: Response,next: NextFunction) => {
  next();
};

export const validar_Microciclo_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


export const validar_Microciclo_Body = async (req: Request,res: Response,next: NextFunction) => {
  
  await body('nombre_Microciclo')
    .notEmpty().withMessage('El nombre del microciclo es obligatorio')
    .isLength({ max: 255 }).withMessage('El nombre no puede exceder los 255 caracteres')
    .run(req);

  await body('fecha_Inicio')
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

  await body('fecha_Fin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')
    .custom((value, { req }) => {
      const fechaFin = new Date(value);
      const fechaInicio = new Date(req.body.fecha_Inicio);
      
      if (fechaFin <= fechaInicio) {
        throw new Error('La fecha de fin no puede ser anterior o igual a la fecha de inicio');
      }
      return true;
    })
    .run(req);

  await body('descripcion')
    .optional()
    .isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres')
    .run(req);

  await body('objetivos')
    .optional()
    .isLength({ max: 250 }).withMessage('Los objetivos no pueden exceder los 250 caracteres')
    .run(req);

  await body('intensidad')
    .optional()
    .isLength({ max: 50 }).withMessage('La intensidad no puede exceder los 50 caracteres')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};