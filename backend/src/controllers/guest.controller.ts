import { Request, Response } from 'express';
import { Guest } from '../models/Guest'; // Importamos el modelo

export class GuestController {

    // Obtener todos los huéspedes
    public async getGuests(req: Request, res: Response): Promise<void> {
        try {
            const guests = await Guest.findAll();
            res.json(guests);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener los huéspedes', error });
        }
    }

    // Obtener un huésped por ID
    public async getGuest(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const guest = await Guest.findByPk(id);
            if (guest) {
                res.json(guest);
            } else {
                res.status(404).json({ msg: `No se encontró un huésped con el id ${id}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el huésped', error });
        }
    }

    // Crear un nuevo huésped
    public async createGuest(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const newGuest = await Guest.create(body);
            res.status(201).json(newGuest);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear el huésped', error });
        }
    }

    // Actualizar un huésped
    public async updateGuest(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        try {
            const guest = await Guest.findByPk(id);
            if (!guest) {
                res.status(404).json({ msg: `No se encontró un huésped con el id ${id}` });
                return;
            }
            await guest.update(body);
            res.json(guest);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el huésped', error });
        }
    }

    // Eliminar un huésped
    public async deleteGuest(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const guest = await Guest.findByPk(id);
            if (!guest) {
                res.status(404).json({ msg: `No se encontró un huésped con el id ${id}` });
                return;
            }
            await guest.destroy();
            res.json({ msg: 'Huésped eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el huésped', error });
        }
    }
}