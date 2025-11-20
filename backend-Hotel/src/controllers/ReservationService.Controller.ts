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

  public async getServicesByReservation(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;
      const services = await ReservationService.findAll({
        where: { reservation_id: reservationId },
        include: [{ model: Service }]
      });

      if (!services || services.length === 0) {
        return res.status(200).json([]); // Return empty array if no services found
      }

      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching services for reservation" });
    }
  }

  public async createReservationService(req: Request, res: Response) {
    const { reservationId } = req.params;
    const { service_id, quantity } = req.body;

    if (!service_id || !quantity) {
      return res.status(400).json({ error: "service_id and quantity are required" });
    }

    try {
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const service = await Service.findByPk(service_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check if the service is already added
      let reservationService = await ReservationService.findOne({
        where: { reservation_id: reservationId, service_id: service_id }
      });

      if (reservationService) {
        // If it exists, update quantity
        reservationService.quantity += quantity;
        await reservationService.save();
      } else {
        // If not, create a new one
        reservationService = await ReservationService.create({
          reservation_id: parseInt(reservationId, 10),
          service_id,
          quantity,
          status: 'ACTIVE',
        } as any);
      }

      // Update reservation total amount
      const serviceCost = service.price * quantity;
      reservation.total_amount = (reservation.total_amount || 0) + serviceCost;
      await reservation.save();

      res.status(201).json(reservationService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding service to reservation" });
    }
  }

  public async deleteReservationService(req: Request, res: Response) {
    const { reservationId, reservationServiceId } = req.params;

    try {
      const reservationService = await ReservationService.findOne({
        where: { id: reservationServiceId, reservation_id: reservationId },
        include: [Service, Reservation]
      });

      if (!reservationService) {
        return res.status(404).json({ error: "ReservationService not found" });
      }

      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({ error: "Parent reservation not found" });
      }
      
      const service = await Service.findByPk(reservationService.service_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Subtract the cost from the reservation's total amount
      const serviceCost = service.price * reservationService.quantity;
      reservation.total_amount -= serviceCost;
      await reservation.save();

      // Delete the reservation service entry
      await reservationService.destroy();

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting service from reservation" });
    }
  }
}
