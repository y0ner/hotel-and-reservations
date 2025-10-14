import { Request, Response } from 'express';
import { Setting } from '../models/Setting';

export class SettingController {

    // Obtener todos los ajustes
    public async getSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await Setting.findAll();
            res.json(settings);
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener los ajustes', error });
        }
    }

    // Obtener un ajuste por su key
    public async getSettingByKey(req: Request, res: Response): Promise<void> {
        const { key } = req.params;
        try {
            const setting = await Setting.findOne({ where: { key } });
            if (setting) {
                res.json(setting);
            } else {
                res.status(404).json({ msg: `No se encontró un ajuste con la clave ${key}` });
            }
        } catch (error) {
            res.status(500).json({ msg: 'Error al obtener el ajuste', error });
        }
    }

    // Crear un nuevo ajuste
    public async createSetting(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const newSetting = await Setting.create(body);
            res.status(201).json(newSetting);
        } catch (error) {
            res.status(500).json({ msg: 'Error al crear el ajuste', error });
        }
    }

    // Actualizar un ajuste por su key
    public async updateSettingByKey(req: Request, res: Response): Promise<void> {
        const { key } = req.params;
        const { body } = req;
        try {
            const setting = await Setting.findOne({ where: { key } });
            if (!setting) {
                res.status(404).json({ msg: `No se encontró un ajuste con la clave ${key}` });
                return;
            }
            // Nos aseguramos de que solo se actualice el valor y no la clave
            await setting.update({ value: body.value });
            res.json(setting);
        } catch (error) {
            res.status(500).json({ msg: 'Error al actualizar el ajuste', error });
        }
    }

    // Eliminar un ajuste por su key
    public async deleteSettingByKey(req: Request, res: Response): Promise<void> {
        const { key } = req.params;
        try {
            const setting = await Setting.findOne({ where: { key } });
            if (!setting) {
                res.status(404).json({ msg: `No se encontró un ajuste con la clave ${key}` });
                return;
            }
            await setting.destroy();
            res.json({ msg: 'Ajuste eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ msg: 'Error al eliminar el ajuste', error });
        }
    }
}