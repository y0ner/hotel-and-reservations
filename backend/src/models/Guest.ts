import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Booking } from "./Booking"; // Asegúrate de que Booking esté importado

// 1. Añadimos la interfaz 'GuestI'
export interface GuestI {
  id?: number;
  name: string;
  documentNumber: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
}

// 2. Definimos las propiedades como públicas en la clase
export class Guest extends Model {
  public id!: number;
  public name!: string;
  public documentNumber!: string;
  public phone!: string;
  public email!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Guest.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    // 3. Añadimos el campo 'status'
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Guest", // Es una buena práctica definir el modelName
    tableName: "guests",
    timestamps: false,
  }
);

// Mantener las asociaciones existentes
Guest.hasMany(Booking, {
    foreignKey: "guestId",
    sourceKey: "id",
});
Booking.belongsTo(Guest, {
    foreignKey: "guestId",
    targetKey: "id",
});