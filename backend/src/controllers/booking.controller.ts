import { Request, Response } from "express";
import { Booking, BookingI } from "../models/Booking";

export class BookingController {

  // Get all bookings with status "ACTIVE"
  public async getAllBookings(req: Request, res: Response) {
    try {
      const bookings: BookingI[] = await Booking.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ error: "Error fetching bookings" });
    }
  }

  // Get a booking by ID
  public async getBookingById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const booking = await Booking.findOne({
        where: { id: pk, status: 'ACTIVE' },
      });
      if (booking) {
        res.status(200).json(booking);
      } else {
        res.status(404).json({ error: "Booking not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching booking" });
    }
  }

  // Create a new booking
  public async createBooking(req: Request, res: Response) {
    // El cuerpo ahora espera 'booking_status'
    const { guestId, roomId, checkInDate, checkOutDate, totalPrice, booking_status } = req.body;
    try {
      let body: BookingI = { guestId, roomId, checkInDate, checkOutDate, totalPrice, booking_status, status: 'ACTIVE' };
      const newBooking = await Booking.create({ ...body });
      res.status(201).json(newBooking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a booking
  public async updateBooking(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { guestId, roomId, checkInDate, checkOutDate, totalPrice, booking_status, status } = req.body;
    try {
      let body: BookingI = { guestId, roomId, checkInDate, checkOutDate, totalPrice, booking_status, status };
      const bookingExist = await Booking.findOne({ where: { id: pk, status: 'ACTIVE' } });

      if (bookingExist) {
        await bookingExist.update(body);
        res.status(200).json(bookingExist);
      } else {
        res.status(404).json({ error: "Booking not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a booking physically
  public async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingToDelete = await Booking.findByPk(id);

      if (bookingToDelete) {
        await bookingToDelete.destroy();
        res.status(200).json({ message: "Booking deleted successfully" });
      } else {
        res.status(404).json({ error: "Booking not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting booking" });
    }
  }

  // Delete a booking logically
  public async deleteBookingAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const bookingToUpdate = await Booking.findOne({ where: { id: pk, status: 'ACTIVE' }});

      if (bookingToUpdate) {
        await bookingToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Booking marked as inactive" });
      } else {
        res.status(404).json({ error: "Booking not found or already inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking booking as inactive" });
    }
  }
}