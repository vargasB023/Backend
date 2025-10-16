import { Response,Request, NextFunction, Router } from "express";
import { param,body, validationResult } from "express-validator";
import  Deportista  from "../models/deportista";

export const validar_Deportista_Por_Id = async (req: Request,res: Response,next: NextFunction) => {
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

export const validar_Deportista_Existente = async(req: Request, res: Response, next: NextFunction) =>{
    await body('no_Documento')
        .custom(async(value) =>{
                const deportista_Existente = await Deportista.findOne({
                    where: {no_Documento: value},
                });
                if (deportista_Existente){
                    throw new Error( 'Este numero de documento ya existe');
                }
                return true;
            })
            .run(req);
        next();    
};
export const validar_Deportista_body = async(req: Request, res: Response, next: NextFunction) =>{
    await body('no_Documento')
        .notEmpty().withMessage('El Numero de docuemnto del deportista no puede estar en blanco')
        .isNumeric().withMessage('El numero de deportista deber se numerico')
        .run(req);
    await body('nombre_Completo')
        .notEmpty().withMessage('El nombre del deportista no puede estar en blanco')
        .isLength({max: 60 }).withMessage('El nombre del deportista no puede tener mas de 100 caracteres')
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
    await body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .isLength({ max: 150 }).withMessage('El correo electrónico no debe superar los 150 caracteres')
        .run(req)

    await body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
        .withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo')
        .run(req);
    await body('eps')
    .notEmpty().withMessage('La EPS es obligatoria')
    .isLength({ max: 50 }).withMessage('La EPS no puede tener más de 50 caracteres')
    .run(req);
    await body('posicion')
        .notEmpty().withMessage('La posición es obligatoria')
        .isIn(['CENTRAL', 'REMATADOR', 'LIBERO', 'ARMADOR', 'ZAGUERO DERECHO', 'ZAGUERO IZQUIERDO'])
        .withMessage('La posición no es válida')
        .run(req);
    await body('dorsal')
        .optional({ checkFalsy: true }) // permite que esté vacío
        .isLength({ max: 3 }).withMessage('El dorsal no puede tener más de 3 caracteres')
        .isNumeric().withMessage('El dorsal debe ser un número')
        .run(req);
    await body('tipo_De_Sangre')
        .notEmpty().withMessage('El tipo de sangre es obligatorio')
        .isIn(['B+', 'B-', 'A+', 'A-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('El tipo de sangre no es válido')
        .run(req);
    await body('alergias')
        .notEmpty().withMessage('Debe especificar si tiene alergias o poner "Ninguna"')
        .isLength({ max: 100 }).withMessage('El campo de alergias no puede tener más de 100 caracteres')
        .run(req);
    await body("nombre_Contacto")
    .notEmpty()
    .withMessage("El Nombre del contacto no puede estar en blanco")
    .run(req);

  await body("parentesco_Contacto")
    .notEmpty().withMessage("El parentezco no puede estar en blanco")
    .isIn(["PADRE", "MADRE", "HERMANO", "HERMANA", "TUTOR LEGAL"]).withMessage("Parentesco no válido. Debe ser uno de: PADRE, MADRE, HERMANO, HERMANA, TUTOR LEGAL, OTRO" )
    .run(req);

  await body("telefono_Contacto")
    .notEmpty().withMessage("El Numero de telefono no puede estar en blanco")
    .matches(/^\d{7,15}$/)
    .withMessage("El teléfono debe contener entre 7 y 15 dígitos numéricos")
    .run(req);    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

