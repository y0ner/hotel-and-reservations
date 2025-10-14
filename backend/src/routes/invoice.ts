import { Application } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';

export class InvoiceRoutes {
    private invoiceController: InvoiceController = new InvoiceController();

    public routes(app: Application): void {
        // Rutas para /invoices
        app.route('/invoices')
            .get(this.invoiceController.getInvoices)
            .post(this.invoiceController.createInvoice);

        // Rutas para /invoices/:id
        app.route('/invoices/:id')
            .get(this.invoiceController.getInvoice)
            .put(this.invoiceController.updateInvoice)
            .delete(this.invoiceController.deleteInvoice);
    }
}