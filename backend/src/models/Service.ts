import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { BookingService } from "./BookingService";

// 1. Añadimos la interfaz 'ServiceI'
export interface ServiceI {
  id?: number;
  name: string;
  description: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// 2. Definimos las propiedades como públicas en la clase
export class Service extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public status!: 'ACTIVE' | 'INACTIVE';
}

Service.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: "Service",
    tableName: "services",
    timestamps: false,
  }
);

// Mantener las asociaciones existentes
Service.hasMany(BookingService, {
    foreignKey: 'serviceId',
    sourceKey: 'id'
});
BookingService.belongsTo(Service, {
    foreignKey: 'serviceId',
    targetKey: 'id'
});