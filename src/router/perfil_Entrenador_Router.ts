import { Router } from "express";
import { perfil_Entrenador_controller } from "../controllers/perfil_Entrenador_Controller";
import { validar_Perfil_Entrenador_Body, validar_Perfil_Entrenador_Por_Id } from "../middelware/perfil_Entrenador_mild";
import { handleInputErrors } from "../middelware/Validation";
import { param } from "express-validator";

const router = Router()
router.get('/',perfil_Entrenador_controller.traer_Perfil_Entrenadores)

router.get('/:id',
    validar_Perfil_Entrenador_Por_Id,
    handleInputErrors,
    perfil_Entrenador_controller.traer_Perfil_Entrenador_Por_Id
)

router.post("/", validar_Perfil_Entrenador_Body,
    perfil_Entrenador_controller.crear_Perfil_Entrenador);


router.put('/:id',
    validar_Perfil_Entrenador_Por_Id,
    validar_Perfil_Entrenador_Body,
    handleInputErrors,
    perfil_Entrenador_controller.actualizar_Perfil_Entrenador_Por_Id
);

router.delete('/:id',
    param('id').isInt().withMessage('ID NO VALIDO')
        .custom(value => value > 0 ).withMessage('ID NO VALIDO'),
    handleInputErrors,
    perfil_Entrenador_controller.eliminar_Perfil_Entrenador_Por_Id
);

export default router