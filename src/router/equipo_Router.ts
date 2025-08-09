import { Router } from "express";
import { Equipo_Controller } from "../controllers/equipo_Controller";
import { validar_Equipo_Body, validar_Equipo_Por_Id } from "../middelware/equipo_Mild";
import { handleInputErrors } from "../middelware/Validation";
import { param } from "express-validator";

const router = Router();

router.get('/', Equipo_Controller.traer_Equipos);

router.get('/:id', Equipo_Controller.traer_equipo_Por_Id);

router.get('/entrenador/:ID_Entrenador', Equipo_Controller.traer_equipoEntrenador_Por_Id);

router.post('/', 
    validar_Equipo_Body,
    handleInputErrors,
    Equipo_Controller.crear_Equipo);

    router.put('/agregar/:id', 
    validar_Equipo_Por_Id, 
    handleInputErrors, 
    Equipo_Controller.agregarDeportista);


router.put('/:id', 
    validar_Equipo_Por_Id, 
    validar_Equipo_Body, 
    handleInputErrors, 
    Equipo_Controller.actualizar_Equipo_Por_Id);

router.delete('/:id', 
    param('id').isInt().withMessage('ID NO VÁLIDO')
    .custom(value => value > 0)
    .withMessage('ID debe ser mayor que 0'), 
    handleInputErrors, 
    Equipo_Controller.eliminar_Equipo_Por_Id);

export default router;