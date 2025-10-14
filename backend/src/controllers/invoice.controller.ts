import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice'; // Modelo principal
import { Booking } from '../models/Booking'; // Modelo relacionado
import { Guest } from '../models/Guest';   // Modelo anidado
import { Room } from '../models/Room';     // Modelo anidado

export class InvoiceController {

    // Obtener todas las facturas
    public async getInvoices(req: Request, res: Response): Promise<void> {
        try {
            const invoices = await Invoice.findAll({
                include: [{
                    model: Booking,
                    include: [Guest, Room] // Incluimos Guest y Room dentro de Booking
                }]
            });
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener las facturas', error });
        }
    }

    // Obtener una factura por ID
    public async getInvoice(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const invoice = await Invoice.findByPk(id, {
                include: [{
                    model: Booking,
                    include: [Guest, Room]
                }]
            });
            if (invoice) {
                res.json(invoice);
            } else {
                res.status(404).json({ msg: `No se encontró una factura con el id ${id}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener la factura', error });
        }
    }

    // Crear una nueva factura
    public async createInvoice(req: Request, res: Response): Promise<void> {
        const { body } = req;
        // body debería incluir: totalAmount, bookingId, status (opcional)
        try {
            const newInvoice = await Invoice.create(body);
            res.status(201).json(newInvoice);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear la factura', error });
        }
    }

    // Actualizar una factura
    public async updateInvoice(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) {
                res.status(404).json({ msg: `No se encontró una factura con el id ${id}` });
                return;
            }
            await invoice.update(body);
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar la factura', error });
        }
    }

    // Eliminar una factura
    public async deleteInvoice(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) {
                res.status(404).json({ msg: `No se encontró una factura con el id ${id}` });
                return;
            }
            await invoice.destroy();
            res.json({ msg: 'Factura eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar la factura', error });
        }
    }
}