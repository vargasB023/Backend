import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validar_Contacto_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
  await param("id")
    .isInt()
    .withMessage("El ID no es valido")
    .custom((value) => value > 0)
    .withMessage("ID no es valido ")
    .run(req);
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validar_Contacto_Emergencia_body = async (req: Request,res: Response,next: NextFunction) => {
  await body("nombre_Contacto")
    .notEmpty()
    .withMessage("El Nombre del contacto no puede estar en blanco")
    .run(req);

  await body("parentesco_Contacto")
    .withMessage("El parentezco no puede estar en blanco")
    .isIn(["PADRE", "MADRE", "HERMANO", "HERMANA", "TUTOR LEGAL", "OTRO"])
    .withMessage(
      "Parentesco no válido. Debe ser uno de: PADRE, MADRE, HERMANO, HERMANA, TUTOR LEGAL, OTRO"
    )
    .run(req);

  await body("telefono_Contacto")
    .withMessage("El Numero de telefono no puede estar en blanco")
    .matches(/^\d{7,15}$/)
    .withMessage("El teléfono debe contener entre 7 y 15 dígitos numéricos")
    .run(req);
  const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();  
}
