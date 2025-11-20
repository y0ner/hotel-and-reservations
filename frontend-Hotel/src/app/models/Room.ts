export interface RoomI {
  id?: number;
  number: number;
  floor: number;
  capacity: number;
  description: string;
  base_price: number;
  available: boolean;
  roomtype_id: number;
  hotel_id: number;
  status: "ACTIVE" | "INACTIVE";
}


export interface RoomResponseI {
  id?: number;
  number: number;
  floor: number;
  capacity: number;
  description: string;
  base_price: number;
  available: boolean;
  hotel_id: number;
  roomtype_id: number;
  status: "ACTIVE" | "INACTIVE";
}
