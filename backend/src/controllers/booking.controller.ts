import { Request, Response } from 'express';
import { Booking } from '../models/Booking'; // Modelo principal
import { Guest } from '../models/Guest';   // Modelo relacionado
import { Room } from '../models/Room';     // Modelo relacionado

export class BookingController {

    // Obtener todas las reservas con sus relaciones
    public async getBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await Booking.findAll({
                include: [Guest, Room] // Incluimos los modelos Guest y Room
            });
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener las reservas', error });
        }
    }

    // Obtener una reserva por ID con sus relaciones
    public async getBooking(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const booking = await Booking.findByPk(id, {
                include: [Guest, Room] // Incluimos los modelos Guest y Room
            });
            if (booking) {
                res.json(booking);
            } else {
                res.status(404).json({ msg: `No se encontró una reserva con el id ${id}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la reserva', error });
        }
    }

    // Crear una nueva reserva
    public async createBooking(req: Request, res: Response): Promise<void> {
        const { body } = req;
        // body debería incluir: checkInDate, checkOutDate, guestId, roomId
        try {
            const newBooking = await Booking.create(body);
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear la reserva', error });
        }
    }

    // Actualizar una reserva
    public async updateBooking(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        try {
            const booking = await Booking.findByPk(id);
            if (!booking) {
                res.status(404).json({ msg: `No se encontró una reserva con el id ${id}` });
                return;
            }
            await booking.update(body);
            res.json(booking);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar la reserva', error });
        }
    }

    // Eliminar una reserva
    public async deleteBooking(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const booking = await Booking.findByPk(id);
            if (!booking) {
                res.status(404).json({ msg: `No se encontró una reserva con el id ${id}` });
                return;
            }
            await booking.destroy();
            res.json({ msg: 'Reserva eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar la reserva', error });
        }
    }
}