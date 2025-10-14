import { Application } from 'express';
import { RoomController } from '../controllers/room.controller';

export class RoomRoutes {
    private roomController: RoomController = new RoomController();

    public routes(app: Application): void {
        // Rutas para /rooms
        app.route('/rooms')
            .get(this.roomController.getRooms)
            .post(this.roomController.createRoom);

        // Rutas para /rooms/:id
        app.route('/rooms/:id')
            .get(this.roomController.getRoom)
            .put(this.roomController.updateRoom)
            .delete(this.roomController.deleteRoom);
    }
}