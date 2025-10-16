import { Response,Request, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

export const validar_Rel_Ejercicio_Sesion_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


export const validar_Ejercicio_Sesion_Body = async (req: Request,res: Response,next: NextFunction) => {

  await body('fase')
    .notEmpty().withMessage('La fase es obligatoria')
    .isIn(['CALENTAMIENTO', 'PARTE_PRINCIPAL', 'RECUPERACION'])
    .withMessage('La fase debe ser CALENTAMIENTO, PARTE_PRINCIPAL o RECUPERACION')
    .run(req);

  await body('orden')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('El orden debe ser un número entero positivo')
    .run(req);

  await body('series')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Las series deben ser un número entero positivo')
    .run(req);

  await body('repeticiones')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Las repeticiones deben ser un número entero positivo')
    .run(req);

  await body('duracion_min')
    .notEmpty().withMessage('La duración es obligatoria')
    .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo en minutos')
    .run(req);

  await body('observaciones')
    .optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage('Las observaciones no pueden superar los 255 caracteres')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};