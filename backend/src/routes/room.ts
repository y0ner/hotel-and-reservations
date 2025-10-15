import { Application } from "express";
import { RoomController } from "../controllers/room.controller";
import { authMiddleware } from "../middleware/auth"; // 1. Importar el middleware

export class RoomRoutes {
  public roomController: RoomController = new RoomController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN (PUBLIC) ==================
    app.route("/api/rooms/public")
      .get(this.roomController.getAllRooms)
      .post(this.roomController.createRoom);

    app.route("/api/rooms/public/:id")
      .get(this.roomController.getRoomById)
      .patch(this.roomController.updateRoom)
      .delete(this.roomController.deleteRoom); // Borrado físico

    app.route("/api/rooms/public/:id/logic")
      .delete(this.roomController.deleteRoomAdv); // Borrado lógico

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/rooms")
      .get(authMiddleware, this.roomController.getAllRooms)
      .post(authMiddleware, this.roomController.createRoom);

    app.route("/api/rooms/:id")
      .get(authMiddleware, this.roomController.getRoomById)
      .patch(authMiddleware, this.roomController.updateRoom)
      .delete(authMiddleware, this.roomController.deleteRoom);

    app.route("/api/rooms/:id/logic")
      .delete(authMiddleware, this.roomController.deleteRoomAdv);
  }
}