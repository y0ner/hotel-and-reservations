import { Request, Response } from 'express';
import { Service } from '../models/Service'; // Importamos el modelo de Service

export class ServiceController {

    // Obtener todos los servicios
    public async getServices(req: Request, res: Response): Promise<void> {
        try {
            const services = await Service.findAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener los servicios', error });
        }
    }

    // Obtener un servicio por ID
    public async getService(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const service = await Service.findByPk(id);
            if (service) {
                res.json(service);
            } else {
                res.status(404).json({ msg: `No se encontró un servicio con el id ${id}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el servicio', error });
        }
    }

    // Crear un nuevo servicio
    public async createService(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const newService = await Service.create(body);
            res.status(201).json(newService);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear el servicio', error });
        }
    }

    // Actualizar un servicio
    public async updateService(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        try {
            const service = await Service.findByPk(id);
            if (!service) {
                res.status(404).json({ msg: `No se encontró un servicio con el id ${id}` });
                return;
            }
            await service.update(body);
            res.json(service);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el servicio', error });
        }
    }

    // Eliminar un servicio
    public async deleteService(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const service = await Service.findByPk(id);
            if (!service) {
                res.status(404).json({ msg: `No se encontró un servicio con el id ${id}` });
                return;
            }
            await service.destroy();
            res.json({ msg: 'Servicio eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el servicio', error });
        }
    }
}