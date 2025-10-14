import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';
import { Guest } from './Guest';
import { Room } from './Room';

export class Booking extends Model {
    // Añade estas declaraciones de propiedades
    public id!: number;
    public checkInDate!: Date;
    public checkOutDate!: Date;
    public status!: string;
    public guestId!: number; // Clave foránea
    public roomId!: number;  // Clave foránea
}

Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    checkInDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    checkOutDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed'
    }
}, {
    sequelize,
    modelName: 'booking'
});

// Relationships
Booking.belongsTo(Guest);
Guest.hasMany(Booking);

Booking.belongsTo(Room);
Room.hasMany(Booking);