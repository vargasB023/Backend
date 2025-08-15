import { Router } from 'express';
import { plan_Entrenamiento_Controller } from '../controllers/plan_de_entrenamiento_Controller';
import { validar_Planes_Entrenamiento,  validar_Plan_Entrenamiento_Body } from '../middelware/plan_de_entrenamiento_mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', 
  validar_Planes_Entrenamiento,
  handleInputErrors,
  plan_Entrenamiento_Controller.traer_Planes_Entrenamiento
);

router.get('/:id',
  handleInputErrors,
  plan_Entrenamiento_Controller.traer_Plan_Entrenamiento_Por_Id
);

router.post('/',
  validar_Plan_Entrenamiento_Body,
  handleInputErrors,
  plan_Entrenamiento_Controller.crear_Plan_Entrenamiento
);

router.post('/asignar_microciclo',
  handleInputErrors,
  plan_Entrenamiento_Controller.asignar_microciclo
);

router.put('/:id',
  validar_Plan_Entrenamiento_Body,
  handleInputErrors,
  plan_Entrenamiento_Controller.actualizar_Plan_Entrenamiento_Por_Id
);

router.delete('/:id',
  handleInputErrors,
  plan_Entrenamiento_Controller.eliminar_Plan_Entrenamiento_Por_Id
);

export default router;