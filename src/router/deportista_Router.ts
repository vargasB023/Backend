import { Router } from "express";
import { Deportista_controller } from "../controllers/deportista_Controller";
import { validar_Deportista_body, validar_Deportista_Existente, validar_Deportista_Por_Id } from "../middelware/deportista_Mild";
import { handleInputErrors } from "../middelware/Validation";
import { param } from "express-validator";

const router = Router()

router.get('/',Deportista_controller.traer_Deportistas)

router.post('/login',
    Deportista_controller.traer_Deportista_Por_Email
)

router.get('/:id',
    validar_Deportista_Por_Id,
    handleInputErrors,
    Deportista_controller.traer_Deportista_Por_Id
)

router.post('/',
    validar_Deportista_Existente,
    validar_Deportista_body,
    handleInputErrors,
    Deportista_controller.crear_Deportista
)
router.put('/inactivar', Deportista_controller.inactivar
);

router.put('/:id',
    validar_Deportista_Por_Id,
    validar_Deportista_body,
    handleInputErrors,
    Deportista_controller.actualizar_Deportista_Por_Id
);



router.delete('/:id',
    param('id').isInt().withMessage('ID NO VALIDO')
        .custom(value => value > 0 ).withMessage('ID NO VALIDO'),
    handleInputErrors,
    Deportista_controller.eliminar_Deportista_Por_Id
);

export default router