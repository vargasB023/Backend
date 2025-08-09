import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Sesion from "../models/sesion";


export const validar_Sesion_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
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

export const validar_Sesion_Existente = async (req: Request, res: Response, next: NextFunction) => {
    await body('ID_Sesion')
        .custom(async (value) => {
            const sesionExistente = await Sesion.findOne({
                where: { ID_Sesion: value },
            });

            if (sesionExistente) {
                throw new Error('Ya existe una sesión con este ID.');
            }

            return true;
        })
        .run(req);
    next();
};
 
export const validar_Sesion_body = async (req: Request, res: Response, next: NextFunction) => {
  await body('hora_Inicio')
  .notEmpty().withMessage('La hora de inicio es obligatoria')
  .matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).withMessage('La hora de inicio debe tener formato HH:MM:SS (24 horas)')
  .run(req);

await body('hora_Fin')
  .notEmpty().withMessage('La hora de fin es obligatoria')
  .matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).withMessage('La hora de fin debe tener formato HH:MM:SS (24 horas)')
  .custom((value, { req }) => {
    const [hI, mI, sI] = req.body.hora_Inicio.split(':').map(Number);
    const [hF, mF, sF] = value.split(':').map(Number);

    const inicioSeg = hI * 3600 + mI * 60 + sI;
    const finSeg = hF * 3600 + mF * 60 + sF;

    if (finSeg <= inicioSeg) {
      throw new Error('La hora de fin debe ser posterior a la de inicio');
    }
    return true;
  })
  .run(req);

  await body('objetivo')
    .optional()
    .isLength({ max: 255 }).withMessage('El objetivo no puede superar los 255 caracteres')
    .run(req);

  await body('observaciones')
    .optional()
    .isLength({ max: 255 }).withMessage('Las observaciones no pueden superar los 255 caracteres')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};