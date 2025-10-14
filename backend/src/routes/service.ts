import { Application } from 'express';
import { ServiceController } from '../controllers/service.controller';

export class ServiceRoutes {
    private serviceController: ServiceController = new ServiceController();

    public routes(app: Application): void {
        // Rutas para /services
        app.route('/services')
            .get(this.serviceController.getServices)
            .post(this.serviceController.createService);

        // Rutas para /services/:id
        app.route('/services/:id')
            .get(this.serviceController.getService)
            .put(this.serviceController.updateService)
            .delete(this.serviceController.deleteService);
    }
}