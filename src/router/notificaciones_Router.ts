import { Router } from "express";
import { Notificaciones_controller } from "../controllers/notificacion_Controller";

const notificaciones_Router = Router();

notificaciones_Router.get("/", Notificaciones_controller.traer_Notificaciones);
notificaciones_Router.get("/deportista/:ID_Deportista", Notificaciones_controller.traer_Notificaciones_Por_Deportista);
notificaciones_Router.get("/:id", Notificaciones_controller.traer_Notificacion_Por_Id);
notificaciones_Router.post("/", Notificaciones_controller.crear_Notificacion);
notificaciones_Router.put("/:id", Notificaciones_controller.actualizar_Notificacion);
notificaciones_Router.put("/:id/leida", Notificaciones_controller.marcar_Como_Leida);
notificaciones_Router.delete("/:id", Notificaciones_controller.eliminar_Notificacion);

export default notificaciones_Router;
