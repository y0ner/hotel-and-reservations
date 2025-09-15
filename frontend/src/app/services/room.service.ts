// src/app/services/room.service.ts

import { Injectable } from '@angular/core';
import { RoomI } from '../models/room';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomsService = new BehaviorSubject<RoomI[]>([
    { id: 1, number: '101', type: 'Individual', price: 150000, status: 'Disponible' },
    { id: 2, number: '102', type: 'Doble', price: 250000, status: 'Ocupada' },
    { id: 3, number: '201', type: 'Suite', price: 500000, status: 'Mantenimiento' }
  ]);
  rooms$ = this.roomsService.asObservable();

  getRooms() {
    return this.roomsService.value;
  }

  addRoom(room: RoomI) {
    const rooms = this.roomsService.value;
    room.id = rooms.length ? Math.max(...rooms.map(r => r.id ?? 0)) + 1 : 1;
    this.roomsService.next([...rooms, room]);
  }
  deleteRoom(id: number) {
    let rooms = this.roomsService.value;
    rooms = rooms.filter(r => r.id !== id);
    this.roomsService.next(rooms);
  }
  getRoomById(id: number): RoomI | undefined {
    return this.roomsService.value.find(r => r.id === id);
  }

  updateRoom(updatedRoom: RoomI) {
    const rooms = this.roomsService.value.map(r => 
      r.id === updatedRoom.id ? updatedRoom : r
    );
    this.roomsService.next(rooms);
  }
  updateRoomStatus(roomId: number, status: 'Disponible' | 'Ocupada' | 'Mantenimiento') {
    const rooms = this.getRooms().map(room => 
      room.id === roomId ? { ...room, status: status } : room
    );
    this.roomsService.next(rooms);
  }
}