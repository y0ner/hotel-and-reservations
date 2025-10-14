import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';

export class Room extends Model {
    // Añade estas declaraciones de propiedades
    public id!: number;
    public roomNumber!: string;
    public type!: string;
    public price!: number;
    public status!: string;
}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roomNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Available'
    }
}, {
    sequelize,
    modelName: 'room'
});