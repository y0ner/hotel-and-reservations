import { Application } from "express";
import { RoleUserController } from '../../controllers/authorization/role_user.controller';
import { authMiddleware, devAuthMiddleware } from '../../middleware/auth';

export class RoleUserRoutes {
  public roleUserController: RoleUserController = new RoleUserController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/roleUsers/public")
      .get(this.roleUserController.getAllRoleUsers)
      .post(this.roleUserController.createRoleUser);

    app.route("/api/roleUsers/public/:id")
      .get(this.roleUserController.getRoleUserById)
      .patch(this.roleUserController.updateRoleUser)
      .delete(this.roleUserController.deleteRoleUser);

    app.route("/api/roleUsers/public/:id/logic")
      .delete(this.roleUserController.deleteRoleUserAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/roleUsers")
      .get(authMiddleware, this.roleUserController.getAllRoleUsers)
      .post(devAuthMiddleware, this.roleUserController.createRoleUser);

    app.route("/api/roleUsers/:id")
      .get(authMiddleware, this.roleUserController.getRoleUserById)
      .patch(devAuthMiddleware, this.roleUserController.updateRoleUser)
      .delete(devAuthMiddleware, this.roleUserController.deleteRoleUser);

    app.route("/api/roleUsers/:id/logic")
      .delete(devAuthMiddleware, this.roleUserController.deleteRoleUserAdv);
  }
}