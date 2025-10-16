import { body, param } from "express-validator";

export const validar_Lesion_Antes_Por_Id = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero mayor a 0"),
];

export const validar_Lesion_Antes_body = [
  body("ID_Deportista")
    .isInt({ gt: 0 })
    .withMessage("ID_Deportista es requerido y debe ser un número entero mayor a 0"),

  body("añadir_Lesion_Antes")
    .notEmpty()
    .withMessage("El campo añadir_Lesion_Antes es obligatorio"),

  body("fecha")
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)"),

  body("tiempo_Fuera_Competencia")
    .isInt({ min: 0 })
    .withMessage("El tiempo fuera de competencia debe ser un número entero mayor o igual a 0"),

  body("gravedad")
    .isIn(["LEVE", "GRAVE", "MODERADO"])
    .withMessage("La gravedad debe ser LEVE, GRAVE o MODERADO"),

  body("recaidas")
    .isIn(["SI", "NO"])
    .withMessage("El campo recaidas debe ser SI o NO"),

  body("lesiones_Fuera")
    .isIn(["SI", "NO"])
    .withMessage("El campo lesiones_Fuera debe ser SI o NO"),

  body("dolor_Molestia")
    .isIn(["SI", "NO"])
    .withMessage("El campo dolor_Molestia debe ser SI o NO"),

  body("cirugias")
    .isIn(["SI", "NO"])
    .withMessage("El campo cirugias debe ser SI o NO"),

  body("posicion")
    .isIn([
      "CENTRAL",
      "REMATADOR",
      "LIBERO",
      "ARMADOR",
      "ZAGUERO DERECHO",
      "ZAGUERO IZQUIERDO",
    ])
    .withMessage(
      "La posición debe ser una de: CENTRAL, REMATADOR, LIBERO, ARMADOR, ZAGUERO DERECHO, ZAGUERO IZQUIERDO"
    ),
];