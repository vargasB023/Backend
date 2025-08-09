import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Evaluacion_Tecnica from "../models/evaluacion_Tecnica";
import Evaluacion_Deportiva from "../models/evaluacion_Deportiva";

export const validar_EvaluacionTecnica_Por_Id = async ( req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un número entero mayor que 0')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  next();
};

export const validar_EvaluacionTecnica_Existente = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const evaluacion = await Evaluacion_Tecnica.findByPk(id);
  if (!evaluacion) {
    return res.status(404).json({ mensaje: `No existe evaluación técnica con el id ${id}` });
  }

  next();
};

export const validar_Evaluacion_Deportiva_Referenciada = async ( req: Request, res: Response, next: NextFunction) => {
  const { ID_Evaluacion_De } = req.body;

  const evaluacionDeportiva = await Evaluacion_Deportiva.findByPk(ID_Evaluacion_De);
  if (!evaluacionDeportiva) {
    return res.status(404).json({ mensaje: `No existe evaluación deportiva con el ID ${ID_Evaluacion_De}` });
  }

  next();
};

export const validar_EvaluacionTecnica_body = async ( req: Request, res: Response, next: NextFunction) => {

  await body('SAQUE')
    .notEmpty().withMessage('SAQUE es obligatorio')
    .isIn(['POTENCIA', 'TECNICA', 'CONSISTENCIA', 'DIFICULTAD'])
    .withMessage('SAQUE debe ser uno de: POTENCIA, TECNICA, CONSISTENCIA, DIFICULTAD')
    .run(req);

  const camposNumericos = [
    'potencia_1', 'tecnica_1', 'consistencia', 'dificultad',
    'tecnica_2', 'presicion', 'control', 'desplazamiento',
    'tecnica_3', 'potencia_2', 'direccion', 'colocacion', 'variedad_De_Golpes'
  ];

  for (const campo of camposNumericos) {
    await body(campo)
      .notEmpty().withMessage(`${campo} es obligatorio`)
      .isIn(['1', '2', '3']).withMessage(`${campo} debe ser '1', '2' o '3'`)
      .run(req);
  }

  await body('RECEPCION')
    .notEmpty().withMessage('RECEPCION es obligatoria')
    .isIn(['TECNICA', 'PRESICION', 'CONTROL', 'DESPLAZAMIENTO'])
    .withMessage('RECEPCION debe ser una de: TECNICA, PRESICION, CONTROL, DESPLAZAMIENTO')
    .run(req);

  await body('ATAQUE')
    .notEmpty().withMessage('ATAQUE es obligatorio')
    .isIn(['TECNICA', 'POTENCIA', 'DIRECCION', 'COLOCACION', 'VARIEDAD DE GOLPES'])
    .withMessage('ATAQUE debe ser una de: TECNICA, POTENCIA, DIRECCION, COLOCACION, VARIEDAD DE GOLPES')
    .run(req);

  await body('BLOQUEO')
    .optional({ nullable: true })
    .isIn(['1', '2', '3'])
    .withMessage('BLOQUEO debe ser "1", "2" o "3" si se proporciona')
    .run(req);

  await body('DEFENSA')
    .optional({ nullable: true })
    .isIn(['1', '2', '3'])
    .withMessage('DEFENSA debe ser "1", "2" o "3" si se proporciona')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  next();
};
