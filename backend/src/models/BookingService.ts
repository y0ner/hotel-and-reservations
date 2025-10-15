import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';
// No necesitamos importar Booking y Service aquí para definir la relación

export class BookingService extends Model {
    public quantity!: number;
}

BookingService.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'booking_services', // Estandaricemos el nombre de la tabla
    modelName: 'BookingService',
    timestamps: false
});

