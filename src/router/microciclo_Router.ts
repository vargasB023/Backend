import { Router } from 'express';
import { microciclo_Controller } from '../controllers/microciclo_Controller';
import { 
  validar_Microciclos, 
  validar_Microciclo_Por_Id, 
  validar_Microciclo_Body 
} from '../middelware/microciclo_mild';
import { handleInputErrors } from '../middelware/Validation';

const router = Router();

router.get('/', 
  validar_Microciclos,
  handleInputErrors,
  microciclo_Controller.traer_Microciclos
);

router.get('/:id',
  validar_Microciclo_Por_Id,
  handleInputErrors,
  microciclo_Controller.traer_Microciclo_Por_Id
);

router.post('/',
  validar_Microciclo_Body,
  handleInputErrors,
  microciclo_Controller.crear_Microciclo
);

router.put('/asignarSesion',
  handleInputErrors,
  microciclo_Controller.asignarSesion
);

// Actualizar un microciclo asignarSesion
router.put('/:id',
  validar_Microciclo_Por_Id,
  validar_Microciclo_Body,
  handleInputErrors,
  microciclo_Controller.actualizar_Microciclo_Por_Id
);

// Eliminar un microciclo
router.delete('/:id',
  validar_Microciclo_Por_Id,
  handleInputErrors,
  microciclo_Controller.eliminar_Microciclo_Por_Id
);

export default router;