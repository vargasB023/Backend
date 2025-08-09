import { Router } from 'express';
import { ejercicio_Controller } from '../controllers/ejercicio_Controller';
import { validar_Ejercicios, validar_Ejercicio_Por_Id, validar_Ejercicio_Body } from '../middelware/ejercicio_mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', 
  validar_Ejercicios,
  handleInputErrors,
  ejercicio_Controller.traer_Ejercicios
);

router.get('/:id',
  validar_Ejercicio_Por_Id,
  handleInputErrors,
  ejercicio_Controller.traer_Ejercicio_Por_Id
);

router.post('/',
  validar_Ejercicio_Body,
  handleInputErrors,
 ejercicio_Controller.crear_Ejercicio
);

router.put('/:id',
  validar_Ejercicio_Por_Id,
  validar_Ejercicio_Body,
  handleInputErrors,
  ejercicio_Controller.actualizar_Ejercicio_Por_Id
);

router.delete('/:id',
  validar_Ejercicio_Por_Id,
  handleInputErrors,
  ejercicio_Controller.eliminar_Ejercicio_Por_Id
);

export default router;