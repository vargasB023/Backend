import { Router } from 'express';
import { param } from 'express-validator';
import { EvaluacionTecnica_controller } from '../controllers/evaluacion_Tecnica_Controller';
import {validar_EvaluacionTecnica_body,validar_EvaluacionTecnica_Por_Id,} from '../middelware/evaluacion_Tecnica_Mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', EvaluacionTecnica_controller.traer_EvaluacionesTecnicas);

router.get('/:id',
  validar_EvaluacionTecnica_Por_Id,
  handleInputErrors,
  EvaluacionTecnica_controller.traer_EvaluacionTecnica_Por_Id
);

router.post('/',
  validar_EvaluacionTecnica_body,
  handleInputErrors,
  EvaluacionTecnica_controller.crear_EvaluacionTecnica
);

router.put('/:id',
  validar_EvaluacionTecnica_Por_Id,
  validar_EvaluacionTecnica_body,
  handleInputErrors,
  EvaluacionTecnica_controller.actualizar_EvaluacionTecnica_Por_Id
);

router.delete('/:id',
  param('id').isInt().withMessage('ID NO VALIDO')
    .custom(value => value > 0).withMessage('ID NO VALIDO'),
  handleInputErrors,
  EvaluacionTecnica_controller.eliminar_EvaluacionTecnica_Por_Id
);

export default router;