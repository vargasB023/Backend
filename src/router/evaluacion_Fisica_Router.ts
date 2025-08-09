import { Router } from 'express';
import { param } from 'express-validator';
import { EvaluacionFisica_controller } from '../controllers/evaluacion_Fisica_Controller';
import {validar_EvaluacionFisica_body,validar_EvaluacionFisica_Por_Id,} from '../middelware/evaluacion_Fisica_Mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', EvaluacionFisica_controller.traer_EvaluacionesFisicas);

router.get('/:id',
  validar_EvaluacionFisica_Por_Id,
  handleInputErrors,
  EvaluacionFisica_controller.traer_EvaluacionFisica_Por_Id
);

router.post('/',
  validar_EvaluacionFisica_body,
  handleInputErrors,
  EvaluacionFisica_controller.crear_EvaluacionFisica
);

router.put('/:id',
  validar_EvaluacionFisica_Por_Id,
  validar_EvaluacionFisica_body,
  handleInputErrors,
  EvaluacionFisica_controller.actualizar_EvaluacionFisica_Por_Id
);

router.delete('/:id',
  param('id').isInt().withMessage('ID NO VALIDO')
    .custom(value => value > 0).withMessage('ID NO VALIDO'),
  handleInputErrors,
  EvaluacionFisica_controller.eliminar_EvaluacionFisica_Por_Id
);

export default router;