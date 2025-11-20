import { Application } from "express";
import { ResourceRoleController } from "../../controllers/authorization/resourceRole.controller";
import { authMiddleware, devAuthMiddleware } from '../../middleware/auth';

export class ResourceRoleRoutes {
  public resourceRoleController: ResourceRoleController = new ResourceRoleController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/resourceRoles/public")
      .get(this.resourceRoleController.getAllResourceRoles)
      .post(this.resourceRoleController.createResourceRole);

    app.route("/api/resourceRoles/public/:id")
      .get(this.resourceRoleController.getResourceRoleById)
      .patch(this.resourceRoleController.updateResourceRole)
      .delete(this.resourceRoleController.deleteResourceRole);

    app.route("/api/resourceRoles/public/:id/logic")
      .delete(this.resourceRoleController.deleteResourceRoleAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/resourceRoles")
      .get(authMiddleware, this.resourceRoleController.getAllResourceRoles)
      .post(devAuthMiddleware, this.resourceRoleController.createResourceRole);

    app.route("/api/resourceRoles/:id")
      .get(authMiddleware, this.resourceRoleController.getResourceRoleById)
      .patch(devAuthMiddleware, this.resourceRoleController.updateResourceRole)
      .delete(devAuthMiddleware, this.resourceRoleController.deleteResourceRole);

    app.route("/api/resourceRoles/:id/logic")
      .delete(devAuthMiddleware, this.resourceRoleController.deleteResourceRoleAdv);
  }
}