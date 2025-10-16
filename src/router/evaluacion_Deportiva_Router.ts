import { Router } from 'express';
import { param } from 'express-validator';
import { EvaluacionDeportiva_controller } from '../controllers/evaluacion_Deportiva_Controller';
import {validar_Evaluacion_Deportiva_body,validar_Evaluacion_Deportiva_Existente} from '../middelware/evaluacion_Deportiva_Mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', EvaluacionDeportiva_controller.traer_EvaluacionesDeportivas);


// 🔹 RUTA ACTUALIZADA: Deportistas únicos con última evaluación (para lista principal)
router.get('/entrenador/:id_entrenador/deportistas',
  param('id_entrenador').isInt().withMessage('ID de entrenador no válido')
    .custom(value => value > 0).withMessage('ID de entrenador debe ser mayor a 0'),
  handleInputErrors,
  EvaluacionDeportiva_controller.traer_Deportistas_Con_Ultima_Evaluacion
);

// 🔹 RUTA MANTENIDA: Todas las evaluaciones (para otros usos)
router.get('/entrenador/:id_entrenador',
  param('id_entrenador').isInt().withMessage('ID de entrenador no válido')
    .custom(value => value > 0).withMessage('ID de entrenador debe ser mayor a 0'),
  handleInputErrors,
  EvaluacionDeportiva_controller.traer_Evaluaciones_Por_Entrenador
);

// 🔹 RUTA MANTENIDA: Reporte completo
router.get('/reporte/:id',
  param('id').isInt().withMessage('ID NO VALIDO')
    .custom(value => value > 0).withMessage('ID NO VALIDO'),
  handleInputErrors,
  EvaluacionDeportiva_controller.traer_Reporte_Evaluacion_Por_Id
);

router.get('/:id',
  handleInputErrors,
  EvaluacionDeportiva_controller.traer_EvaluacionDeportiva_Por_Id
);


router.get('/deportista/:id_deportista',
  param('id_deportista').isInt().withMessage('ID de deportista no válido')
    .custom(value => value > 0).withMessage('ID de deportista debe ser mayor a 0'),
  handleInputErrors,
  EvaluacionDeportiva_controller.traer_Evaluaciones_Por_Deportista
);

router.post('/',
  validar_Evaluacion_Deportiva_body,
  handleInputErrors,
  EvaluacionDeportiva_controller.crear_EvaluacionDeportiva
);

router.put('/:id',
  validar_Evaluacion_Deportiva_body,
  handleInputErrors,
  EvaluacionDeportiva_controller.actualizar_EvaluacionDeportiva_Por_Id
);

router.delete('/:id',
  param('id').isInt().withMessage('ID NO VALIDO')
    .custom(value => value > 0).withMessage('ID NO VALIDO'),
  handleInputErrors,
  EvaluacionDeportiva_controller.eliminar_EvaluacionDeportiva_Por_Id
);

export default router;