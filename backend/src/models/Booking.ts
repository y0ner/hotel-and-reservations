import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Invoice } from "./Invoice";
import { Service } from './Service';
import { BookingService } from './BookingService';

// 1. Añadimos la interfaz 'BookingI'
export interface BookingI {
  id?: number;
  guestId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  booking_status: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Pagada'; // Renombrado
  status: 'ACTIVE' | 'INACTIVE'; // Nuevo campo para borrado lógico
}

// 2. Definimos las propiedades como públicas en la clase
export class Booking extends Model {
  public id!: number;
  public guestId!: number;
  public roomId!: number;
  public checkInDate!: Date;
  public checkOutDate!: Date;
  public totalPrice!: number;
  public booking_status!: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Pagada'; // Renombrado
  public status!: 'ACTIVE' | 'INACTIVE'; // Nuevo
}

Booking.init(
  {
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // 3. Renombramos el campo 'status' original a 'booking_status'
    booking_status: {
      type: DataTypes.ENUM('Confirmada', 'Pendiente', 'Cancelada', 'Pagada'),
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    // 4. Añadimos el nuevo campo 'status' para el borrado lógico
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: false,
  }
);

// Definición de la relación Muchos a Muchos
Booking.belongsToMany(Service, {
  through: BookingService,
  foreignKey: 'bookingId',
  otherKey: 'serviceId'
});

Service.belongsToMany(Booking, {
  through: BookingService,
  foreignKey: 'serviceId',
  otherKey: 'bookingId'
});