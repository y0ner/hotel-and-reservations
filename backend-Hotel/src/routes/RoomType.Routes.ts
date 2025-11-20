import { Application } from "express";
import { RoomTypeController } from "../controllers/RoomType.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class RoomTypeRoutes {
  public roomtypeController: RoomTypeController = new RoomTypeController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/RoomTypes/public")
    //   .get(this.roomtypeController.getAllRoomTypes);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/RoomTypes")
      .get(devAuthMiddleware, this.roomtypeController.getAllRoomTypes)
      .post(devAuthMiddleware, this.roomtypeController.createRoomType);

    app.route("/api/RoomTypes/:id")
      .get(devAuthMiddleware, this.roomtypeController.getRoomTypeById)
      .patch(devAuthMiddleware, this.roomtypeController.updateRoomType);

    app.route("/api/RoomTypes/:id/logic")
      .delete(devAuthMiddleware, this.roomtypeController.deleteRoomTypeAdv);
  }
}
