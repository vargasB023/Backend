import { Response,Request, NextFunction } from "express";
import { param,body, validationResult } from "express-validator";
import Entrenador from "../models/entrenador";

export const validar_Entrenador_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
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

export const validar_ID_Entrenador = body('ID_Entrenador')
  .notEmpty().withMessage('El ID del entrenador es obligatorio')
  .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
  .custom(async (id) => {
    const entrenador = await Entrenador.findByPk(id);
    if (!entrenador) {
      throw new Error('No existe un entrenador con ese ID');
    }
    return true;
  });


export const validar_Entrenador_Existente = async(req: Request, res: Response, next: NextFunction) =>{
    await body('no_Documento')
        .custom(async(value) =>{
                const entrenador_Existente = await Entrenador.findOne({
                    where: {no_Documento: value},
                });
                if (entrenador_Existente){
                    throw new Error( 'Este numero de documento ya existe');
                }
                return true;
            })
            .run(req);
        next();    
};

export const validar_Entrenador_Email_Existente = async(req: Request, res: Response, next: NextFunction) =>{
    await body('email')
        .custom(async(value) =>{
                const entrenador_Email_Existente = await Entrenador.findOne({
                    where: {email: value},
                });
                if (entrenador_Email_Existente){
                    throw new Error( 'Este email existe');
                }
                return true;
            })
            .run(req);
        next();    
};


export const validar_Entrenador_body = async(req: Request, res: Response, next: NextFunction) =>{
    await body('nombre_Completo')
        .notEmpty().withMessage('El nombre del entrenador no puede estar en blanco')
        .isLength({max: 60 }).withMessage('El nombre del entrenador no puede tener mas de 100 caracteres')
        .run(req);

    await body('no_Documento')
        .notEmpty().withMessage('El Numero de docuemnto del entrenador no puede estar en blanco')
        .isNumeric().withMessage('El numero de docuemnto deber se numerico')
        .run(req);

    await body('fecha_Nacimiento')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .isISO8601().withMessage('La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)')
        .run(req)

    await body('genero')
        .notEmpty().withMessage('El género es obligatorio')
        .isIn(['MASCULINO', 'FEMENINO']).withMessage('El género debe ser "MASCULINO" o "FEMENINO"')
        .run(req)

    await body('direccion')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ max: 100 }).withMessage('La dirección no puede tener más de 100 caracteres')
        .run(req)

    await body('telefono')
        .notEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^\d{7,15}$/).withMessage('El teléfono debe tener entre 7 y 15 dígitos')
        .run(req)

    await body('especialidad')
        .optional()
        .isLength({ max: 255 }).withMessage('La especialidad no puede tener más de 100 caracteres')
        .run(req)

    await body('certificacion')
        .optional()
        .isLength({ max: 250 }).withMessage('La certificación no debe superar los 250 caracteres')
        .run(req)

    await body('experiencia')
        .optional()
        .isLength({ max: 255 }).withMessage('La experiencia no debe superar los 255 caracteres')
        .run(req)

    await body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .isLength({ max: 150 }).withMessage('El correo electrónico no debe superar los 150 caracteres')
        .run(req);

    await body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
        .withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo')
        .run(req);
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

