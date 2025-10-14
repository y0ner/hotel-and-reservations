import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';

export class Guest extends Model {
    // Añade estas declaraciones de propiedades
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public phone!: string;
}

Guest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'guest'
});