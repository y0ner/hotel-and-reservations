import { Request, Response } from "express";
import { Service, ServiceI } from "../models/Service";

export class ServiceController {

  // Get all services with status "ACTIVE"
  public async getAllServices(req: Request, res: Response) {
    try {
      const services: ServiceI[] = await Service.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ services });
    } catch (error) {
      res.status(500).json({ error: "Error fetching services" });
    }
  }

  // Get a service by ID
  public async getServiceById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const service = await Service.findOne({
        where: { id: pk, status: 'ACTIVE' },
      });
      if (service) {
        res.status(200).json(service);
      } else {
        res.status(404).json({ error: "Service not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching service" });
    }
  }

  // Create a new service
  public async createService(req: Request, res: Response) {
    const { name, description, price } = req.body;
    try {
      let body: ServiceI = { name, description, price, status: 'ACTIVE' };
      const newService = await Service.create({ ...body });
      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a service
  public async updateService(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { name, description, price, status } = req.body;
    try {
      let body: ServiceI = { name, description, price, status };
      const serviceExist = await Service.findOne({ where: { id: pk, status: 'ACTIVE' } });

      if (serviceExist) {
        await serviceExist.update(body);
        res.status(200).json(serviceExist);
      } else {
        res.status(404).json({ error: "Service not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a service physically
  public async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const serviceToDelete = await Service.findByPk(id);

      if (serviceToDelete) {
        await serviceToDelete.destroy();
        res.status(200).json({ message: "Service deleted successfully" });
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting service" });
    }
  }

  // Delete a service logically
  public async deleteServiceAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const serviceToUpdate = await Service.findOne({ where: { id: pk, status: 'ACTIVE' }});

      if (serviceToUpdate) {
        await serviceToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Service marked as inactive" });
      } else {
        res.status(404).json({ error: "Service not found or already inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking service as inactive" });
    }
  }
}