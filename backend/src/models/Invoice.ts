import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/db';
import { Booking } from './Booking';

export class Invoice extends Model {}

Invoice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    issueDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING, // E.g., 'Paid', 'Unpaid'
        defaultValue: 'Unpaid'
    }
}, {
    sequelize,
    modelName: 'invoice'
});

// Relationship
Invoice.belongsTo(Booking);
Booking.hasOne(Invoice);