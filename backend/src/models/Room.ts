import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Booking } from "./Booking";

// 1. Añadimos la interfaz 'RoomI'
export interface RoomI {
  id?: number;
  number: string;
  type: 'Individual' | 'Doble' | 'Suite';
  price: number;
  status: "ACTIVE" | "INACTIVE";
}

// 2. Definimos las propiedades como públicas en la clase
export class Room extends Model {
  public id!: number;
  public number!: string;
  public type!: 'Individual' | 'Doble' | 'Suite';
  public price!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Room.init(
  {
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('Individual', 'Doble', 'Suite'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // 3. Añadimos el campo 'status'
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Room", // Buena práctica
    tableName: "rooms",
    timestamps: false,
  }
);

// Mantener las asociaciones existentes
Room.hasMany(Booking, {
    foreignKey: "roomId",
    sourceKey: "id",
});
Booking.belongsTo(Room, {
    foreignKey: "roomId",
    targetKey: "id",
});