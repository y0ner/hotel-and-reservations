import { Application } from "express";
import { ClientController } from "../controllers/Client.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class ClientRoutes {
  public clientController: ClientController = new ClientController();

  public routes(app: Application): void {
    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Clients/public")
    //   .get(this.clientController.getAllClients);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Clients")
      .get(devAuthMiddleware, this.clientController.getAllClients)
      .post(devAuthMiddleware, this.clientController.createClient);

    // IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas parametrizadas
    app.route("/api/Clients/hotel/:hotelId")
      .get(devAuthMiddleware, this.clientController.getClientsByHotel);

    app.route("/api/Clients/:id")
      .get(devAuthMiddleware, this.clientController.getClientById)
      .patch(devAuthMiddleware, this.clientController.updateClient);

    app.route("/api/Clients/:id/logic")
      .delete(devAuthMiddleware, this.clientController.deleteClientAdv);
  }
}
