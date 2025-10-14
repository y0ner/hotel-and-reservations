import { Application } from 'express';
import { BookingController } from '../controllers/booking.controller';

export class BookingRoutes {
    private bookingController: BookingController = new BookingController();

    public routes(app: Application): void {
        // Rutas para /bookings
        app.route('/bookings')
            .get(this.bookingController.getBookings)
            .post(this.bookingController.createBooking);

        // Rutas para /bookings/:id
        app.route('/bookings/:id')
            .get(this.bookingController.getBooking)
            .put(this.bookingController.updateBooking)
            .delete(this.bookingController.deleteBooking);
    }
}