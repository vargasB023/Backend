import { Router } from "express"
import { asistencia_Controller } from "../controllers/asistencia_Controller"
import { validar_Asistencia_Body, validar_Asistencia_Por_Id } from "../middelware/asistencia_mild"
import { handleInputErrors } from "../middelware/Validation"
import { param } from "express-validator"

const router = Router()

router.get('/',asistencia_Controller.traer_Asistencias)

router.get('/:id',
    validar_Asistencia_Por_Id,
    handleInputErrors,
    asistencia_Controller.traer_Asistencia_Por_Id
)

router.post('/',
    validar_Asistencia_Body,
    handleInputErrors,
    asistencia_Controller.crear_Asistencia
)

router.put('/:id',
    validar_Asistencia_Por_Id,
    validar_Asistencia_Body,
    handleInputErrors,
    asistencia_Controller.actualizar_Asistencia_Por_Id
);

router.delete('/:id',
    param('id').isInt().withMessage('ID NO VALIDO')
        .custom(value => value > 0 ).withMessage('ID NO VALIDO'),
    handleInputErrors,
    asistencia_Controller.eliminar_Asistencia_Por_Id
);

export default router