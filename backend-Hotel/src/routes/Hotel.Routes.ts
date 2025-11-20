import { Application } from "express";
import { HotelController } from "../controllers/Hotel.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class HotelRoutes {
  public hotelController: HotelController = new HotelController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Hotels/public")
    //   .get(this.hotelController.getAllHotels);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Hotels")
      .get(devAuthMiddleware, this.hotelController.getAllHotels)
      .post(devAuthMiddleware, this.hotelController.createHotel);

    app.route("/api/Hotels/:id")
      .get(devAuthMiddleware, this.hotelController.getHotelById)
      .patch(devAuthMiddleware, this.hotelController.updateHotel);

    app.route("/api/Hotels/:id/logic")
      .delete(devAuthMiddleware, this.hotelController.deleteHotelAdv);
  }
}
