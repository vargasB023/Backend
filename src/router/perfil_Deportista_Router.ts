import { Router } from "express";
import { perfil_Deportista_Controller } from "../controllers/perfil_Deportista_Controller";
import { validar_Deportista_Por_Id } from "../middelware/deportista_Mild";
import { handleInputErrors } from "../middelware/Validation";
import { validar_Perfil_Deportista_Body } from "../middelware/perfil_Deportista_Mild";
import { param } from "express-validator";

const router = Router()
router.get('/',perfil_Deportista_Controller.traer_Perfil_Deportistas)

router.get('/:id',
    validar_Deportista_Por_Id,
    handleInputErrors,
    perfil_Deportista_Controller.traer_Perfil_Deportista_Por_Id
)

router.put('/:id',
    validar_Deportista_Por_Id,
    validar_Perfil_Deportista_Body,
    handleInputErrors,
    perfil_Deportista_Controller.actualizar_Perfil_Deportista_Por_Id
);

router.delete('/:id',
    param('id').isInt().withMessage('ID NO VALIDO')
        .custom(value => value > 0 ).withMessage('ID NO VALIDO'),
    handleInputErrors,
    perfil_Deportista_Controller.eliminar_Perfil_Deportista_Por_Id
);

export default router