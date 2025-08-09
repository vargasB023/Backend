import { Router } from "express";
import { handleInputErrors } from "../middelware/Validation";
import {validar_Cronograma_Por_Id, validar_Cronograma_body } from "../middelware/Cronograma_mild";
import { Cronograma_Controller } from "../controllers/Cronograma_Controller";

const router = Router();

router.get(
  "/",
  Cronograma_Controller.traer_Cronogramas
);

router.get(
  "/:id",
  validar_Cronograma_Por_Id,
  handleInputErrors,
  Cronograma_Controller.traer_Cronograma_Por_Id
);

router.post(
  "/",
  validar_Cronograma_body,
  handleInputErrors,
  Cronograma_Controller.crear_Cronograma
);

router.put(
  "/:id",
  validar_Cronograma_Por_Id,
  validar_Cronograma_body,
  handleInputErrors,
  Cronograma_Controller.actualizar_Cronograma
);

router.delete(
  "/:id",
  validar_Cronograma_Por_Id,
  handleInputErrors,
  Cronograma_Controller.eliminar_Cronograma
);

export default router;
