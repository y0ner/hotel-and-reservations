import { Request, Response } from "express";
import { Reservation, ReservationI } from "../models/Reservation";
import { Client } from "../models/Client";
import { Room } from "../models/Room";
import { Rate } from "../models/Rate";
import { Hotel } from "../models/Hotel";
import { Op } from "sequelize";

export class ReservationController {

  public async getAllReservations(req: Request, res: Response) {
    try {
      const reservations: ReservationI[] = await Reservation.findAll({ 
        where: { 
          status: { [Op.notIn]: ['INACTIVE', 'CANCELLED', 'CHECKED-OUT'] }
        }, 
        include: [
          { model: Client },
          { model: Room },
          { model: Rate },
          { model: Hotel }
        ]
      });
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Error fetching reservations" });
    }
  }

  public async getReservationById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const reservation = await Reservation.findByPk(pk);
      if (reservation) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ error: "Reservation not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching reservation" });
    }
  }

  /**
   * Comprueba si una habitación está disponible entre dos fechas
   * Query params: roomId, start_date, end_date
   */
  public async checkAvailability(req: Request, res: Response) {
    try {
      const { roomId, start_date, end_date, excludeId } = req.query as any;
      if (!roomId || !start_date || !end_date) {
        return res.status(400).json({ error: 'Se requieren roomId, start_date y end_date' });
      }

      const start = new Date(start_date);
      const end = new Date(end_date);

      const where: any = {
        room_id: roomId,
        status: { [Op.in]: ['PENDING', 'CONFIRMED', 'CHECKED-IN'] },
        [Op.and]: [
          { start_date: { [Op.lte]: end } },
          { end_date: { [Op.gte]: start } }
        ]
      };

      if (excludeId) {
        where.id = { [Op.ne]: excludeId };
      }

      const conflicts = await Reservation.findAll({ where });
      const available = conflicts.length === 0;

      res.status(200).json({ available, conflicts });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ error: 'Error checking availability' });
    }
  }

  public async createReservation(req: Request, res: Response) {
    const { client_id,room_id,reservation_date,start_date, end_date, checkin_date,checkout_date,number_of_guests,rate_id,hotel_id,status } = req.body;
    try {
      // Validación: comprobar disponibilidad
      const start = new Date(start_date as any);
      const end = new Date(end_date as any);
      // Asegurar que la habitación pertenezca al hotel indicado
      const room = await Room.findByPk(room_id);
      if (!room) return res.status(404).json({ error: 'Habitación no encontrada' });
      if (room.hotel_id !== Number(hotel_id)) {
        return res.status(400).json({ error: 'La habitación no pertenece al hotel seleccionado' });
      }

      const conflicts = await Reservation.findAll({
        where: {
          room_id: room_id,
          status: { [Op.in]: ['PENDING', 'CONFIRMED', 'CHECKED-IN'] },
          [Op.and]: [
            { start_date: { [Op.lte]: end } },
            { end_date: { [Op.gte]: start } }
          ]
        }
      });

      if (conflicts.length > 0) {
        return res.status(400).json({ error: 'La habitación no está disponible en las fechas seleccionadas', conflicts });
      }

      // Cálculo automático de total_amount
      const rate = await Rate.findByPk(rate_id);
      if (!rate) {
        return res.status(404).json({ error: 'Tarifa no encontrada' });
      }
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      const total_amount = nights * rate.amount * number_of_guests;


      let body: ReservationI = { client_id,room_id,reservation_date,start_date, end_date,checkin_date,checkout_date,number_of_guests,total_amount,rate_id,hotel_id, status };
      const newReservation = await Reservation.create(body as any);
      res.status(201).json(newReservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateReservation(req: Request, res: Response) {
  const { id: pk } = req.params;
  const { client_id,room_id,reservation_date,start_date, end_date,checkin_date,checkout_date,number_of_guests,rate_id,hotel_id,status } = req.body;
  try {
    const reservationExist = await Reservation.findByPk(pk);
    
      if (reservationExist) {
        // Validar que la habitación pertenezca al hotel
        const room = await Room.findByPk(room_id);
        if (!room) return res.status(404).json({ error: 'Habitación no encontrada' });
        if (room.hotel_id !== Number(hotel_id)) {
          return res.status(400).json({ error: 'La habitación no pertenece al hotel seleccionado' });
        }

        // Validar disponibilidad si cambian fechas o habitación
        const start = new Date(start_date as any);
        const end = new Date(end_date as any);
        const conflicts = await Reservation.findAll({
          where: {
            room_id: room_id,
            status: { [Op.in]: ['PENDING', 'CONFIRMED', 'CHECKED-IN'] },
            id: { [Op.ne]: pk },
            [Op.and]: [
              { start_date: { [Op.lte]: end } },
              { end_date: { [Op.gte]: start } }
            ]
          }
        });
        if (conflicts.length > 0) {
          return res.status(400).json({ error: 'La habitación no está disponible en las fechas seleccionadas', conflicts });
        }

        // Cálculo automático de total_amount
        const rate = await Rate.findByPk(rate_id);
        if (!rate) {
          return res.status(404).json({ error: 'Tarifa no encontrada' });
        }
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        const total_amount = nights * rate.amount * number_of_guests;

        let body: ReservationI = { client_id,room_id,reservation_date,start_date, end_date,checkin_date,checkout_date,number_of_guests,total_amount,rate_id,hotel_id, status };
        await reservationExist.update(body);
        res.status(200).json(reservationExist);
      } else {
        res.status(404).json({ error: "Reservation not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteReservationAdv(req: Request, res: Response) {
    const { id: pk } = req.params;
    try {
      const reservationToUpdate = await Reservation.findByPk(pk);
      if (reservationToUpdate) {
        await reservationToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Reservation marked as inactive" });
      } else {
        res.status(404).json({ error: "Reservation not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking reservation as inactive" });
    }
  }
}
