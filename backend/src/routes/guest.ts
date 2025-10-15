import { Application } from "express";
import { GuestController } from "../controllers/guest.controller";
import { authMiddleware } from "../middleware/auth"; // 1. Importar el middleware

export class GuestRoutes {
  public guestController: GuestController = new GuestController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    // (Estas se quedan como estaban, pero les añadimos el /public para estandarizar)
    app.route("/api/guests/public")
      .get(this.guestController.getAllGuests)
      .post(this.guestController.createGuest);

    app.route("/api/guests/public/:id")
      .get(this.guestController.getGuestById)
      .patch(this.guestController.updateGuest) // Cambiado a PATCH por convención
      .delete(this.guestController.deleteGuest);

    app.route("/api/guests/public/:id/logic")
      .delete(this.guestController.deleteGuestAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    // (Estas son las nuevas rutas protegidas)
    app.route("/api/guests")
      .get(authMiddleware, this.guestController.getAllGuests)
      .post(authMiddleware, this.guestController.createGuest);

    app.route("/api/guests/:id")
      .get(authMiddleware, this.guestController.getGuestById)
      .patch(authMiddleware, this.guestController.updateGuest)
      .delete(authMiddleware, this.guestController.deleteGuest);

    app.route("/api/guests/:id/logic")
      .delete(authMiddleware, this.guestController.deleteGuestAdv);
  }
}