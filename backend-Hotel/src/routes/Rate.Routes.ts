import { Application } from "express";
import { RateController } from "../controllers/Rate.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class RateRoutes {
  public rateController: RateController = new RateController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Rates/public")
    //   .get(this.rateController.getAllRates);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Rates")
      .get(devAuthMiddleware, this.rateController.getAllRates)
      .post(devAuthMiddleware, this.rateController.createRate);

    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas parametrizadas
    app.route("/api/Rates/hotel/:hotelId")
      .get(devAuthMiddleware, this.rateController.getRatesByHotel);

    app.route("/api/Rates/:id")
      .get(devAuthMiddleware, this.rateController.getRateById)
      .patch(devAuthMiddleware, this.rateController.updateRate);

    app.route("/api/Rates/:id/logic")
      .delete(devAuthMiddleware, this.rateController.deleteRateAdv);
  }
}
