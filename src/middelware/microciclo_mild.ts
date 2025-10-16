import { NextFunction, Request, Response } from "express";
import { param, body, validationResult } from "express-validator";


export const validar_Microciclos = async (req: Request,res: Response,next: NextFunction) => next();

export const validar_Microciclo_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero mayor que 0")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

export const validar_Microciclo_Body = async (req: Request,res: Response,next: NextFunction) => {
  await body("nombre_Microciclo")
    .notEmpty().withMessage("El nombre del microciclo es obligatorio")
    .isLength({ max: 255 }).withMessage("El nombre no puede exceder los 255 caracteres")
    .run(req);

  await body("fecha_Inicio")
    .notEmpty().withMessage("La fecha de inicio es obligatoria")
    .isISO8601().withMessage("La fecha debe tener formato YYYY-MM-DD")
    .custom((value) => {
      const inicio = new Date(value);
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      if (inicio < hoy) throw new Error("La fecha de inicio no puede ser anterior a la actual");
      return true;
    })
    .run(req);

  await body("fecha_Fin")
    .notEmpty().withMessage("La fecha de fin es obligatoria")
    .isISO8601().withMessage("La fecha debe tener formato YYYY-MM-DD")
    .custom((value, { req }) => {
      const fin = new Date(value);
      const inicio = new Date(req.body.fecha_Inicio);
      if (fin <= inicio) throw new Error("La fecha de fin no puede ser anterior o igual a la de inicio");
      return true;
    })
    .run(req);

  await body("descripcion")
    .optional()
    .isLength({ max: 255 }).withMessage("La descripción no puede exceder los 255 caracteres")
    .run(req);

  await body("objetivos")
    .optional()
    .isLength({ max: 250 }).withMessage("Los objetivos no pueden exceder los 250 caracteres")
    .run(req);

  await body("intensidad")
    .optional()
    .isIn(["Alta", "Media", "Baja"]).withMessage("La intensidad debe ser Alta, Media o Baja")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};