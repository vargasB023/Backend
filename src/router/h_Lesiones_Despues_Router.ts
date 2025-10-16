import { Router } from "express";
import { h_Lesiones_Despues_Controller } from "../controllers/h_Lesiones_Despues_Controller";
import {
  validar_Lesion_Despues_Por_Id,
  validar_Lesion_Despues_body,
} from "../middelware/h_Lesiones_Despues_mild";
import { handleInputErrors } from "../middelware/Validation";

const router = Router();

router.get("/",
  h_Lesiones_Despues_Controller.validar_Registros_Lesiones_Despues
);

router.get("/:id",
  validar_Lesion_Despues_Por_Id,
  handleInputErrors,
  h_Lesiones_Despues_Controller.validar_Lesion_Despues_Por_Id
);

router.post("/",
  validar_Lesion_Despues_body,
  handleInputErrors,
  h_Lesiones_Despues_Controller.crear_Registro_Lesion_Despues
);

router.put(
  "/:id",
  validar_Lesion_Despues_Por_Id,
  validar_Lesion_Despues_body,
  handleInputErrors,
  h_Lesiones_Despues_Controller.actualizar_Registro_Lesion_Despues
);

router.delete(
  "/:id",
  validar_Lesion_Despues_Por_Id,
  handleInputErrors,
  h_Lesiones_Despues_Controller.eliminar_Registro_Lesion_Despues
);

export default router;