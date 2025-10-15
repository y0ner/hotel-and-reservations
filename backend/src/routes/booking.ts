import { Application } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth"; // 1. Importar el middleware

export class BookingRoutes {
  public bookingController: BookingController = new BookingController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN (PUBLIC) ==================
    app.route("/api/bookings/public")
      .get(this.bookingController.getAllBookings)
      .post(this.bookingController.createBooking);

    app.route("/api/bookings/public/:id")
      .get(this.bookingController.getBookingById)
      .patch(this.bookingController.updateBooking) // Usando PATCH
      .delete(this.bookingController.deleteBooking); // Borrado físico

    app.route("/api/bookings/public/:id/logic")
      .delete(this.bookingController.deleteBookingAdv); // Borrado lógico

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/bookings")
      .get(authMiddleware, this.bookingController.getAllBookings)
      .post(authMiddleware, this.bookingController.createBooking);

    app.route("/api/bookings/:id")
      .get(authMiddleware, this.bookingController.getBookingById)
      .patch(authMiddleware, this.bookingController.updateBooking)
      .delete(authMiddleware, this.bookingController.deleteBooking);

    app.route("/api/bookings/:id/logic")
      .delete(authMiddleware, this.bookingController.deleteBookingAdv);
  }
}