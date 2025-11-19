import { Request, Response } from "express";
import { ReservationService, ReservationServiceI } from "../models/ReservationService";
import { Reservation } from "../models/Reservation";
import { Service } from "../models/Service";

export class ReservationServiceController {

  public async getAllReservationServices(req: Request, res: Response) {
    try {
      const reservationservices = await ReservationService.findAll({
        include: [
          {
            model: Reservation,
            attributes: ['id', 'reservation_date', 'start_date', 'end_date']
          },
          {
            model: Service,
            attributes: ['id', 'name', 'price']
          }
        ]
      });
      res.status(200).json(reservationservices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching reservationservices" });
    }
  }

  public async getReservationServiceById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const reservationservice = await ReservationService.findOne({ where: { id: pk, status: 'ACTIVE' } });
      if (!reservationservice) {
        return res.status(404).json({ error: "ReservationService not found" });
      }
      res.status(200).json(reservationservice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching reservationservice" });
    }
  }

  public async createReservationService(req: Request, res: Response) {
    try {
      const body: ReservationServiceI = req.body;
      const newReservationService = await ReservationService.create(body);
      res.status(201).json(newReservationService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating reservationservice" });
    }
  }

  public async deleteReservationService(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const result = await ReservationService.destroy({ where: { id: pk } });
      if (result === 0) {
        return res.status(404).json({ error: "ReservationService not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting reservationservice" });
    }
  }
}
