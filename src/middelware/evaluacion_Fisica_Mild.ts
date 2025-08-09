import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Evaluacion_Fisica from "../models/evaluacion_Fisica";
import Evaluacion_Deportiva from "../models/evaluacion_Deportiva";

export const validar_EvaluacionFisica_Por_Id = async ( req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID no es valido ')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validar_Evaluacion_Fisica_Existente = async (req: Request,res: Response,next: NextFunction) => {
  await body('ID_Evaluacion_De')
    .custom(async (value) => {
      const evaluacionExistente = await Evaluacion_Fisica.findOne({
        where: { ID_Evaluacion_De: value },
      });

      if (evaluacionExistente) {
        throw new Error('Ya existe una evaluación física para este deportista.');
      }
      return true;
    })
    .run(req);

  next();
};
export const validar_EvaluacionFisica_body = async ( req: Request, res: Response, next: NextFunction) => {

  await body('peso')
  .notEmpty().withMessage('El peso es obligatorio')
  .isFloat({ min: 20, max: 200 }).withMessage('El peso debe estar entre 20 y 200 kg')
  .run(req);

  await body('estatura')
    .notEmpty().withMessage('La estatura es obligatoria')
    .isFloat({ min: 1.0, max: 3.0 }).withMessage('La estatura debe ser un número entre 1.0 y 3.0 metros')
    .run(req);

await body('imc')
  .notEmpty().withMessage('El IMC es obligatorio')
  .isFloat({ min: 10, max: 40 }).withMessage('El IMC debe estar entre 10 y 40')
  .run(req);

  await body('tasa_Corporal')
  .notEmpty().withMessage('La tasa corporal es obligatoria')
  .isFloat({ min: 5, max: 50 }).withMessage('La tasa corporal debe estar entre 5.00% y 50.00%')
  .run(req);

  await body('sprint')
  .notEmpty().withMessage('El tiempo del sprint es obligatorio')
  .isFloat({ min: 3, max: 15 }).withMessage('El sprint debe estar entre 3.00 y 15.00 segundos')
  .run(req);

  await body('test_Course_Navette')
  .isInt({ min: 0.0, max: 30.0 }).withMessage('El valor del test Navette debe estar entre 0.0 y 21.0')
  .run(req);


  await body('flexibilidad_Hombro')
    .notEmpty().withMessage('La flexibilidad del hombro es obligatoria')
    .isString().isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
    .run(req);

  await body('agilidad')
  .notEmpty().withMessage('La agilidad es obligatoria')
  .isFloat({ min: 5, max: 30 }).withMessage('El tiempo de agilidad debe estar entre 5.00 y 30.00 segundos')
  .run(req);


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validar_Evaluacion_Deportiva_Referenciada = async ( req: Request, res: Response, next: NextFunction) => {
  const { ID_Evaluacion_De } = req.body;

  const evalDeportiva = await Evaluacion_Deportiva.findByPk(ID_Evaluacion_De);
  if (!evalDeportiva) {
    return res.status(404).json({ mensaje: `No existe evaluación deportiva con ID ${ID_Evaluacion_De}` });
  }

  next();
};
