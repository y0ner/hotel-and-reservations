import { Request, Response } from "express";
import { Checkout } from "../models/Checkout";
import { Reservation } from "../models/Reservation";

export class CheckoutController {

  // Obtener todos los checkouts
  public async getAllCheckouts(req: Request, res: Response) {
    try {
      const checkouts = await Checkout.findAll();
      res.status(200).json({ checkouts });
    } catch (error) {
      res.status(500).json({ error: "Error fetching checkouts" });
    }
  }

  // Obtener checkout por ID
  public async getCheckoutById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const checkout = await Checkout.findOne({ where: { id: pk } });

      if (!checkout) {
        return res.status(404).json({ error: "Checkout not found" });
      }

      res.status(200).json(checkout);
    } catch (error) {
      res.status(500).json({ error: "Error fetching checkout" });
    }
  }

  // Crear un nuevo checkout
  public async createCheckout(req: Request, res: Response) {
    const { reservation_id, time, observation } = req.body;

    if (!reservation_id || !time) {
      return res.status(400).json({ error: "reservation_id and time are required" });
    }

    try {
      const reservation = await Reservation.findByPk(reservation_id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const newCheckout = await Checkout.create({
        reservation_id,
        time: new Date(time),
        observation: observation || null,
      });

      try {
        await reservation.update({
          status: 'CHECKED_OUT',
          checkout_date: new Date(time),
        });
      } catch (updateError: any) {
        console.error("Error updating reservation status:", updateError);
        // Si falla la actualización del estado, al menos devolvemos el checkout creado
      }

      res.status(201).json(newCheckout);
    } catch (error: any) {
      console.error("Error creating checkout:", error.message);
      res.status(500).json({ error: "Error creating checkout", details: error.message });
    }
  }
}
