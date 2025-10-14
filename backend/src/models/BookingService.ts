import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';
import { Booking } from './Booking';
import { Service } from './Service';

export class BookingService extends Model {}

BookingService.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'booking_service'
});

// Relationships
Booking.belongsToMany(Service, { through: BookingService });
Service.belongsToMany(Booking, { through: BookingService });