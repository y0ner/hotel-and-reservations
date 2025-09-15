// src/app/components/room/getall/getall.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { RoomI } from '../../../models/room';
import { RoomService } from '../../../services/room.service';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api'; // <-- IMPORTA ESTO

@Component({
  selector: 'app-getall-rooms',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, TagModule],
  templateUrl: './getall.html',
})
export class GetallRoomsComponent {
  rooms: RoomI[] = [];

  constructor(
    private roomService: RoomService,
    private confirmationService: ConfirmationService // <-- INYÉCTALO AQUÍ
  ) {
    this.roomService.rooms$.subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  // AÑADE ESTE MÉTODO COMPLETO
  confirmDelete(id: number | undefined) {
    if (id === undefined) return;

    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar esta habitación?',
        header: 'Confirmación de Eliminación',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.roomService.deleteRoom(id);
        }
    });
  }
}