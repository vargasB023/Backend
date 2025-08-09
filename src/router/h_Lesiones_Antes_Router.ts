import { Router } from "express";
import { h_Lesiones_Antes_Controller } from "../controllers/h_Lesiones_Antes_Controller";
import {
  validar_Lesion_Antes_Por_Id,
  validar_Lesion_Antes_body,
} from "../middelware/h_Lesiones_Antes_mild";
import { handleInputErrors } from "../middelware/Validation";

const router = Router();

router.get(
  "/",
  h_Lesiones_Antes_Controller.validar_Registros_Lesiones_Antes
);

router.get(
  "/:id",
  validar_Lesion_Antes_Por_Id,
  handleInputErrors,
  h_Lesiones_Antes_Controller.validar_Lesion_Antes_Por_Id
);

router.post(
  "/",
  validar_Lesion_Antes_body,
  handleInputErrors,
  h_Lesiones_Antes_Controller.crear_Registro_Lesion_Antes
);

router.put(
  "/:id",
  validar_Lesion_Antes_Por_Id,
  validar_Lesion_Antes_body,
  handleInputErrors,
  h_Lesiones_Antes_Controller.actualizar_Registro_Lesion_Antes
);

router.delete(
  "/:id",
  validar_Lesion_Antes_Por_Id,
  handleInputErrors,
  h_Lesiones_Antes_Controller.eliminar_Registro_Lesion_Antes
);

export default router;
