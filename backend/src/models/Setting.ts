import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';

export class Setting extends Model {}

Setting.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Nos aseguramos de que cada 'key' sea única
    },
    value: {
        type: DataTypes.TEXT, // Usamos TEXT para dar flexibilidad al valor
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'setting'
});