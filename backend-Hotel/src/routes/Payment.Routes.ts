import { Application } from "express";
import { PaymentController } from "../controllers/Payment.Controller";
import { authMiddleware, devAuthMiddleware } from "../middleware/auth";

export class PaymentRoutes {
  public paymentController: PaymentController = new PaymentController();

  public routes(app: Application): void {

    // ================== RUTAS PÚBLICAS (EJEMPLO) ==================
    // Si necesitas rutas que no requieran autenticación, puedes añadirlas aquí
    // app.route("/api/Payments/public")
    //   .get(this.paymentController.getAllPayments);


    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/Payments")
      .get(devAuthMiddleware, this.paymentController.getAllPayments)
      .post(devAuthMiddleware, this.paymentController.createPayment);

    app.route("/api/Payments/:id")
      .get(devAuthMiddleware, this.paymentController.getPaymentById);

    // Cancelar un pago
    app.route("/api/Payments/:id/cancel")
      .patch(devAuthMiddleware, this.paymentController.cancelPayment);
  }
}
