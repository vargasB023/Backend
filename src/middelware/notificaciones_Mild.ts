import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validar_Notificacion_body = async (req: Request, res: Response, next: NextFunction) => {
  await body('fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)')
    .run(req);

  await body('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 255 }).withMessage('El título no puede superar los 255 caracteres')
    .run(req);

  await body('descripcion')
    .optional()
    .isLength({ max: 5000 }).withMessage('La descripción es muy larga')
    .run(req);

  await body('tipo')
    .notEmpty().withMessage('El tipo es obligatorio')
    .isLength({ max: 50 }).withMessage('El tipo no debe superar los 50 caracteres')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  next();
};

export const validar_ID_Notificacion = async (req: Request, res: Response, next: NextFunction) => {
  await param('id').isInt({ gt: 0 }).withMessage('El ID de notificación debe ser un entero positivo').run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};
