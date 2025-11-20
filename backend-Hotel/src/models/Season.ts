import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Rate } from "./Rate";

export interface SeasonI {
  id?: number;
  name: string;
  start_date: Date;
  end_date: Date;
  price_multiplier: number;
  hotel_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Season extends Model<SeasonI> implements SeasonI {
  public name!: string;
  public start_date!: Date;
  public end_date!: Date;
  public price_multiplier!: number;
  public hotel_id!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Season.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price_multiplier: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Season",
    tableName: "seasons",
    timestamps: false,
  }
);
