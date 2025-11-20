import { Application } from "express";
import { ReservationController } from "../controllers/Reservation.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class ReservationRoutes {
  public reservationController: ReservationController = new ReservationController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Reservations/public")
    //   .get(this.reservationController.getAllReservations);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Reservations")
      .get(devAuthMiddleware, this.reservationController.getAllReservations)
      .post(devAuthMiddleware, this.reservationController.createReservation);

    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas parametrizadas
    app.route("/api/Reservations/availability")
      .get(devAuthMiddleware, this.reservationController.checkAvailability);

    app.route("/api/Reservations/:id/logic")
      .delete(devAuthMiddleware, this.reservationController.deleteReservationAdv);

    app.route("/api/Reservations/:id")
      .get(devAuthMiddleware, this.reservationController.getReservationById)
      .patch(devAuthMiddleware, this.reservationController.updateReservation);
  }
}
