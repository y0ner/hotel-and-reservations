import { Application } from "express";
import { RoomController } from "../controllers/Room.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class RoomRoutes {
  public roomController: RoomController = new RoomController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Rooms/public")
    //   .get(this.roomController.getAllRooms);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Rooms")
      .get(devAuthMiddleware, this.roomController.getAllRooms)
      .post(devAuthMiddleware, this.roomController.createRoom);

    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas parametrizadas
    app.route("/api/Rooms/hotel/:hotelId")
      .get(devAuthMiddleware, this.roomController.getRoomsByHotel);

    app.route("/api/Rooms/:id")
      .get(devAuthMiddleware, this.roomController.getRoomById)
      .patch(devAuthMiddleware, this.roomController.updateRoom);

    app.route("/api/Rooms/:id/logic")
      .delete(devAuthMiddleware, this.roomController.deleteRoomAdv);
  }
}
