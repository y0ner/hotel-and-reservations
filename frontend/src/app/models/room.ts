// src/app/models/room.ts

export interface RoomI {
  id?: number;
  number: string;
  type: 'Individual' | 'Doble' | 'Suite';
  price: number;
  status: 'Disponible' | 'Ocupada' | 'Mantenimiento';
}