import { Router } from "express";
import { TokenController } from "../controllers/Token_controller";

const router = Router();

// Guardar o actualizar un token
router.post("/guardar", TokenController.guardarToken);

// Eliminar un token por ID
router.delete("/:id", TokenController.eliminarToken);

// Listar tokens de un deportista
router.get("/deportista/:ID_Deportista", TokenController.obtenerTokensDeportista);

// Listar tokens de un entrenador
router.get("/entrenador/:ID_Entrenador", TokenController.obtenerTokensEntrenador);

// Limpiar tokens huérfanos
router.delete("/limpiar", TokenController.limpiarTokensHuerfanos);

// Obtener todos los tokens (para debugging)
router.get("/todos", TokenController.obtenerTodosLosTokens);

export default router;
