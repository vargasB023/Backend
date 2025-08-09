import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Evaluacion_Deportiva from "../models/evaluacion_Deportiva";

export const validar_EvaluacionDeportiva_Por_Id = async ( req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validar_Evaluacion_Deportiva_Existente = async ( req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const evaluacion = await Evaluacion_Deportiva.findByPk(id);
  if (!evaluacion) {
    return res.status(404).json({ mensaje: `No existe evaluación con el id ${id}` });
  }

  next();
};

export const validar_Evaluacion_Deportiva_body = async ( req: Request, res: Response,next: NextFunction) => {
  await body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')
    .run(req);

  await body('resultados')
    .notEmpty().withMessage('Los resultados no pueden estar vacíos')
    .isLength({ max: 255 }).withMessage('Los resultados no pueden superar los 255 caracteres')
    .run(req);

  await body('observaciones')
    .optional({ nullable: true })
    .isLength({ max: 255 }).withMessage('Las observaciones no pueden superar los 255 caracteres')
    .run(req);

  await body('tipo_Evaluacion')
    .notEmpty().withMessage('El tipo de evaluación es obligatorio')
    .isIn(['FISICA', 'TECNICA', 'TACTICA'])
    .withMessage('El tipo de evaluación debe ser FISICA, TECNICA o TACTICA')
    .run(req);
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

