import { Response,Request, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";


export const validar_Microciclo_Sesion_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param('ID_Microciclo')
    .isInt({ gt: 0 }).withMessage('El ID no es valido ')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validar_Microciclo_Sesion_Body = async (req: Request,res: Response,next: NextFunction) => {
  await body('dia_Semana')
    .optional({ checkFalsy: true }) 
    .isInt({ min: 1, max: 7 }).withMessage('El día de la semana debe estar entre 1 (lunes) y 7 (domingo)')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};