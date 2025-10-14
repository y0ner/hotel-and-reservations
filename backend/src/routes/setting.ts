import { Application } from 'express';
import { SettingController } from '../controllers/setting.controller';

export class SettingRoutes {
    private settingController: SettingController = new SettingController();

    public routes(app: Application): void {
        // Rutas para /settings
        app.route('/settings')
            .get(this.settingController.getSettings)
            .post(this.settingController.createSetting);

        // Rutas para un ajuste específico por su clave (key)
        app.route('/settings/:key')
            .get(this.settingController.getSettingByKey)
            .put(this.settingController.updateSettingByKey)
            .delete(this.settingController.deleteSettingByKey);
    }
}