import { Request, Response } from 'express';
import { Room } from '../models/Room'; // Importamos el modelo de Room

export class RoomController {

    // Obtener todas las habitaciones
    public async getRooms(req: Request, res: Response): Promise<void> {
        try {
            const rooms = await Room.findAll();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener las habitaciones', error });
        }
    }

    // Obtener una habitación por ID
    public async getRoom(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const room = await Room.findByPk(id);
            if (room) {
                res.json(room);
            } else {
                res.status(404).json({ msg: `No se encontró una habitación con el id ${id}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la habitación', error });
        }
    }

    // Crear una nueva habitación
    public async createRoom(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const newRoom = await Room.create(body);
            res.status(201).json(newRoom);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear la habitación', error });
        }
    }

    // Actualizar una habitación
    public async updateRoom(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                res.status(404).json({ msg: `No se encontró una habitación con el id ${id}` });
                return;
            }
            await room.update(body);
            res.json(room);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar la habitación', error });
        }
    }

    // Eliminar una habitación
    public async deleteRoom(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                res.status(404).json({ msg: `No se encontró una habitación con el id ${id}` });
                return;
            }
            await room.destroy();
            res.json({ msg: 'Habitación eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar la habitación', error });
        }
    }
}