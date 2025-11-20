import { Application } from "express";
import { ReservationServiceController } from "../controllers/ReservationService.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class ReservationServiceRoutes {
  public reservationserviceController: ReservationServiceController = new ReservationServiceController();

  public routes(app: Application): void {
    // Get all services for a specific reservation
    app.route("/api/reservations/:reservationId/services")
      .get(devAuthMiddleware, this.reservationserviceController.getServicesByReservation);

    // Add a service to a reservation
    app.route("/api/reservations/:reservationId/services")
      .post(devAuthMiddleware, this.reservationserviceController.createReservationService);

    // Delete a service from a reservation
    app.route("/api/reservations/:reservationId/services/:reservationServiceId")
      .delete(devAuthMiddleware, this.reservationserviceController.deleteReservationService);
  }
}
