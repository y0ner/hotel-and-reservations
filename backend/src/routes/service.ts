import { Application } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authMiddleware } from "../middleware/auth"; // 1. Importar el middleware

export class ServiceRoutes {
  public serviceController: ServiceController = new ServiceController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN (PUBLIC) ==================
    app.route("/api/services/public")
      .get(this.serviceController.getAllServices)
      .post(this.serviceController.createService);

    app.route("/api/services/public/:id")
      .get(this.serviceController.getServiceById)
      .patch(this.serviceController.updateService)
      .delete(this.serviceController.deleteService); // Borrado físico

    app.route("/api/services/public/:id/logic")
      .delete(this.serviceController.deleteServiceAdv); // Borrado lógico

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/services")
      .get(authMiddleware, this.serviceController.getAllServices)
      .post(authMiddleware, this.serviceController.createService);

    app.route("/api/services/:id")
      .get(authMiddleware, this.serviceController.getServiceById)
      .patch(authMiddleware, this.serviceController.updateService)
      .delete(authMiddleware, this.serviceController.deleteService);

    app.route("/api/services/:id/logic")
      .delete(authMiddleware, this.serviceController.deleteServiceAdv);
  }
}