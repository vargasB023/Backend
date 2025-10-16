import { Router } from "express";
import { handleInputErrors } from "../middelware/Validation";
import { sesion_Controller } from "../controllers/sesion_Controller";
import { validar_Sesion_body, validar_Sesion_Por_Id } from "../middelware/sesion_Mild";

const router = Router();

router.get('/',
  handleInputErrors,
  sesion_Controller.traer_Sesiones
);

router.get('/:id',
  validar_Sesion_Por_Id,
  handleInputErrors,
  sesion_Controller.traer_Sesion_Por_Id
);

router.post('/',
  validar_Sesion_body,
  handleInputErrors,
 sesion_Controller.crear_Sesion
);

router.put('/:id',
  validar_Sesion_Por_Id,
  validar_Sesion_body,
  handleInputErrors,
  sesion_Controller.actualizar_Sesion_Por_Id
);

router.delete('/:id',
  validar_Sesion_Por_Id,
  handleInputErrors,
  sesion_Controller.eliminar_Sesion_Por_Id)

export default router;