import {Request,Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

export const validar_Cronograma_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
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

export const validar_Cronograma_body = async(req: Request, res: Response, next: NextFunction) =>{
  await body("nombre_Evento")
    .notEmpty()
    .withMessage("El nombre del evento es obligatorio")
    .run(req)

  await body("fecha")
    .isISO8601()
    .withMessage("La fecha no tiene un formato válido (YYYY-MM-DD)")
    .run(req)

  await body("hora")
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("La hora debe tener el formato HH:mm:ss en formato 24 horas")
    .run(req)

  await body("tipo_Evento")
    .isIn(["ENTRENAMIENTO", "PARTIDO"])
    .withMessage("El tipo de evento debe ser ENTRENAMIENTO o PARTIDO")
     .run(req)

  await body("lugar")
    .notEmpty()
    .withMessage("El lugar del evento es obligatorio")
     .run(req)

  await body("descripcion")
    .notEmpty()
    .withMessage("La descripción del evento es obligatoria")
     .run(req)
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

