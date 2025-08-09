import { body, param } from "express-validator";

export const validar_Lesion_Despues_Por_Id = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero mayor a 0"),
];

export const validar_Lesion_Despues_body = [
  body("ID_Deportista")
    .isInt({ gt: 0 })
    .withMessage("ID_Deportista es requerido y debe ser un número entero mayor a 0"),

  body("ID_Entrenador")
    .isInt({ gt: 0 })
    .withMessage("ID_Entrenador es requerido y debe ser un número entero mayor a 0"),

  body("fecha_lesion")
    .isISO8601()
    .withMessage("La fecha de la lesión debe tener un formato válido (YYYY-MM-DD)"),

  body("tipo_evento_producido")
    .isIn(["PARTIDO", "ENTRENAMIENTO"])
    .withMessage("El tipo de evento producido debe ser PARTIDO o ENTRENAMIENTO"),

  body("gravedad")
    .isIn(["LEVE", "GRAVE", "MODERADO"])
    .withMessage("La gravedad debe ser LEVE, GRAVE o MODERADO"),

  body("dolor_molestia")
    .isIn(["SI", "NO"])
    .withMessage("El campo dolor_molestia debe ser SI o NO"),

  body("primeros_auxilios")
    .isIn(["SI", "NO"])
    .withMessage("El campo primeros_auxilios debe ser SI o NO"),

  body("traslado_centro_medico")
    .isIn(["SI", "NO"])
    .withMessage("El campo traslado_centro_medico debe ser SI o NO"),
];
