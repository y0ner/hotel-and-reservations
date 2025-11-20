import { Application } from "express";
import { SeasonController } from "../controllers/Season.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class SeasonRoutes {
  public seasonController: SeasonController = new SeasonController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Seasons/public")
    //   .get(this.seasonController.getAllSeasons);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas parametrizadas

    app.route("/api/Seasons")
      .get(devAuthMiddleware, this.seasonController.getAllSeasons)
      .post(devAuthMiddleware, this.seasonController.createSeason);

    // Rutas específicas ANTES de rutas con parámetro
    app.route("/api/Seasons/hotel/:hotelId")
      .get(devAuthMiddleware, this.seasonController.getSeasonsByHotel);

    // Encontrar temporada por rango de fechas
    app.route("/api/Seasons/find/byDateRange")
      .get(devAuthMiddleware, this.seasonController.findByDateRange);

    app.route("/api/Seasons/:id/logic")
      .delete(devAuthMiddleware, this.seasonController.deleteSeasonAdv);

    app.route("/api/Seasons/:id")
      .get(devAuthMiddleware, this.seasonController.getSeasonById)
      .patch(devAuthMiddleware, this.seasonController.updateSeason);
  }
}
