import { Application } from "express";
import { ResourceController } from "../../controllers/authorization/resource.controller";
import { authMiddleware, devAuthMiddleware } from '../../middleware/auth';

export class ResourceRoutes {
  public resourceController: ResourceController = new ResourceController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/resources/public")
      .get(this.resourceController.getAllResources)
      .post(this.resourceController.createResource);

    app.route("/api/resources/public/:id")
      .get(this.resourceController.getResourceById)
      .patch(this.resourceController.updateResource)
      .delete(this.resourceController.deleteResource);

    app.route("/api/resources/public/:id/logic")
      .delete(this.resourceController.deleteResourceAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/resources")
      .get(authMiddleware, this.resourceController.getAllResources)
      .post(devAuthMiddleware, this.resourceController.createResource);

    app.route("/api/resources/:id")
      .get(authMiddleware, this.resourceController.getResourceById)
      .patch(devAuthMiddleware, this.resourceController.updateResource)
      .delete(devAuthMiddleware, this.resourceController.deleteResource);

    app.route("/api/resources/:id/logic")
      .delete(devAuthMiddleware, this.resourceController.deleteResourceAdv);
  }
}