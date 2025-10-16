import { Router } from 'express';
import { microciclo_Controller } from '../controllers/microciclo_Controller';
import { validar_Microciclos, validar_Microciclo_Por_Id, validar_Microciclo_Body } from '../middelware/microciclo_mild';
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
// Microciclos en un rango de fechas
router.get('/filtros/fechas',
  handleInputErrors,
  microciclo_Controller.traer_Por_Fechas
);

// Microciclos que tengan sesiones en un día específico
router.get('/filtros/dia/:dia',
  handleInputErrors,
  microciclo_Controller.traer_Por_Dia
);

// Microciclos por intensidad (Alta, Media, Baja)
router.get('/filtros/intensidad/:intensidad',
  handleInputErrors,
  microciclo_Controller.traer_Por_Intensidad
);

export default router;