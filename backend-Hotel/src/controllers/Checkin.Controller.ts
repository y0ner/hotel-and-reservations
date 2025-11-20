import { Request, Response } from "express";
import { Checkin } from "../models/Checkin";
import { Reservation } from "../models/Reservation";

export class CheckinController {

  // Obtener todos los checkins
  public async getAllCheckins(req: Request, res: Response) {
    try {
      const checkins = await Checkin.findAll();
      res.status(200).json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Error fetching checkins" });
    }
  }

  // Obtener checkin por ID
  public async getCheckinById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const checkin = await Checkin.findOne({ where: { id: pk } });

      if (!checkin) {
        return res.status(404).json({ error: "Checkin not found" });
      }

      res.status(200).json(checkin);
    } catch (error) {
      res.status(500).json({ error: "Error fetching checkin" });
    }
  }

  // Crear un nuevo checkin
  public async createCheckin(req: Request, res: Response) {
    const { reservation_id, time, observation } = req.body;

    if (!reservation_id || !time) {
      return res.status(400).json({ error: "reservation_id and time are required" });
    }

    try {
      const reservation = await Reservation.findByPk(reservation_id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const newCheckin = await Checkin.create({
        reservation_id,
        time: new Date(time),
        observation: observation || null,
      });

      await reservation.update({
        status: 'CHECKED-IN',
        checkin_date: new Date(time),
      });

      res.status(201).json(newCheckin);
    } catch (error) {
      console.error("Error creating checkin:", error);
      res.status(500).json({ error: "Error creating checkin" });
    }
  }
}
