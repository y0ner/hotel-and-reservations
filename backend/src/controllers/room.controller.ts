import { Request, Response } from "express";
import { Room, RoomI } from "../models/Room";

export class RoomController {

  // Get all rooms with status "ACTIVE"
  public async getAllRooms(req: Request, res: Response) {
    try {
      const rooms: RoomI[] = await Room.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ rooms });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rooms" });
    }
  }

  // Get a room by ID
  public async getRoomById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const room = await Room.findOne({
        where: { id: pk, status: 'ACTIVE' },
      });
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(404).json({ error: "Room not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching room" });
    }
  }

  // Create a new room
  public async createRoom(req: Request, res: Response) {
    const { number, type, price } = req.body;
    try {
      let body: RoomI = { number, type, price, status: 'ACTIVE' };
      const newRoom = await Room.create({ ...body });
      res.status(201).json(newRoom);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a room
  public async updateRoom(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { number, type, price, status } = req.body;
    try {
      let body: RoomI = { number, type, price, status };
      const roomExist = await Room.findOne({ where: { id: pk, status: 'ACTIVE' } });

      if (roomExist) {
        await roomExist.update(body);
        res.status(200).json(roomExist);
      } else {
        res.status(404).json({ error: "Room not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a room physically
  public async deleteRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const roomToDelete = await Room.findByPk(id);

      if (roomToDelete) {
        await roomToDelete.destroy();
        res.status(200).json({ message: "Room deleted successfully" });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting room" });
    }
  }

  // Delete a room logically
  public async deleteRoomAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const roomToUpdate = await Room.findOne({ where: { id: pk, status: 'ACTIVE' }});

      if (roomToUpdate) {
        await roomToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Room marked as inactive" });
      } else {
        res.status(404).json({ error: "Room not found or already inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking room as inactive" });
    }
  }
}