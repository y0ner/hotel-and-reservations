import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";


export interface ReservationI {
  id?: number;
  reservation_date?: Date | null;
  start_date?: Date | null;
  end_date?: Date | null;
  checkin_date?: Date | null;
  checkout_date?: Date | null;
  number_of_guests: number;
  total_amount: number;
  client_id: number;
  room_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Reservation extends Model<ReservationI> implements ReservationI {
  public reservation_date!: Date | null;
  public start_date!: Date | null;
  public end_date!: Date | null;
  public checkin_date!: Date | null;
  public checkout_date!: Date | null;
  public number_of_guests!: number;
  public total_amount!: number;
  public client_id!: number;
  public room_id!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Reservation.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reservation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    checkin_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checkout_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    number_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Reservation",
    tableName: "reservations",
    timestamps: false,
  }
);
