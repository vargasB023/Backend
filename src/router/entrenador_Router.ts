import { Router } from 'express';
import { body, param } from 'express-validator';
import { Entrenador_controller } from '../controllers/entrenador_Controller';
import { validar_Entrenador_Email_Existente, validar_Entrenador_Existente,validar_Entrenador_Por_Id,validar_Entrenador_body } from '../middelware/entrenador_Mild';
import { handleInputErrors } from '../middelware/Validation';


const router = Router()

router.get('/',Entrenador_controller.traer_Entrenadores)

router.get('/:id',
    validar_Entrenador_Por_Id,
    handleInputErrors,
    Entrenador_controller.traer_Entrenador_Por_Id
)

router.post('/login',
    Entrenador_controller.traer_Entrenador_Por_Email
)

router.post('/',
    validar_Entrenador_Existente,
    validar_Entrenador_Email_Existente,
    validar_Entrenador_body,
    handleInputErrors,
    Entrenador_controller.crear_Entrenador
)

router.put('/:id',
    validar_Entrenador_Por_Id,
    validar_Entrenador_body,
    handleInputErrors,
    Entrenador_controller.actualizar_entrenador_Por_Id
);

router.delete('/:id',
    param('id').isInt().withMessage('ID NO VALIDO')
        .custom(value => value > 0 ).withMessage('ID NO VALIDO'),
    handleInputErrors,
    Entrenador_controller.eliminar_Entrenador_Por_Id
);

export default router