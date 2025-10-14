import { Application } from 'express';
import { GuestController } from '../controllers/guest.controller';

export class GuestRoutes {
    private guestController: GuestController = new GuestController();

    public routes(app: Application): void {
        // Ruta para obtener todos los huéspedes y crear un nuevo huésped
        app.route('/guests')
            .get(this.guestController.getGuests)
            .post(this.guestController.createGuest);

        // Ruta para obtener, actualizar y eliminar un huésped por su ID
        app.route('/guests/:id')
            .get(this.guestController.getGuest)
            .put(this.guestController.updateGuest)
            .delete(this.guestController.deleteGuest);
    }
}