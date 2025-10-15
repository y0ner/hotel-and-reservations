import { Request, Response } from "express";
import { Guest, GuestI } from "../models/Guest";

export class GuestController {

  // Get all guests with status "ACTIVE"
  public async getAllGuests(req: Request, res: Response) {
    try {
      const guests: GuestI[] = await Guest.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ guests });
    } catch (error) {
      res.status(500).json({ error: "Error fetching guests" });
    }
  }

  // Get a guest by ID
  public async getGuestById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const guest = await Guest.findOne({
        where: { id: pk, status: 'ACTIVE' },
      });
      if (guest) {
        res.status(200).json(guest);
      } else {
        res.status(404).json({ error: "Guest not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching guest" });
    }
  }
  
  // createGuest y updateGuest se mantienen similares, pero podemos estandarizarlos también
  public async createGuest(req: Request, res: Response) {
    const { name, documentNumber, phone, email } = req.body;
    try {
        let body: GuestI = { name, documentNumber, phone, email, status: 'ACTIVE' };
        const newGuest = await Guest.create({ ...body });
        res.status(201).json(newGuest);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }
  
  public async updateGuest(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { name, documentNumber, phone, email, status } = req.body;
    try {
        let body: GuestI = { name, documentNumber, phone, email, status };
        const guestExist = await Guest.findOne({ where: { id: pk, status: 'ACTIVE' } });

        if (guestExist) {
            await guestExist.update(body);
            res.status(200).json(guestExist);
        } else {
            res.status(404).json({ error: "Guest not found or inactive" });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }

  // Borrado físico (lo mantenemos pero lo usaremos menos)
  public async deleteGuest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const guestToDelete = await Guest.findByPk(id);

      if (guestToDelete) {
        await guestToDelete.destroy();
        res.status(200).json({ message: "Guest deleted successfully" });
      } else {
        res.status(404).json({ error: "Guest not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting guest" });
    }
  }

  // Borrado lógico (el que usaremos por defecto)
  public async deleteGuestAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const guestToUpdate = await Guest.findOne({ where: { id: pk, status: 'ACTIVE' }});

      if (guestToUpdate) {
        await guestToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Guest marked as inactive" });
      } else {
        res.status(404).json({ error: "Guest not found or already inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking guest as inactive" });
    }
  }
}