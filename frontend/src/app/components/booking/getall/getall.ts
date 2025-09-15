// src/app/components/booking/getall/getall.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { BookingService } from '../../../services/booking.service';
import { GuestService } from '../../../services/guest.service';
import { RoomService } from '../../../services/room.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-getall-bookings',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, TagModule],
  templateUrl: './getall.html',
})
export class GetallComponent {
  bookingsForTable: any[] = [];

  constructor(
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService: RoomService,
    private confirmationService: ConfirmationService
  ) {
    this.bookingService.bookings$.subscribe(bookings => {
      const guests = this.guestService.getGuests();
      const rooms = this.roomService.getRooms();

      // Combinamos los datos para mostrarlos en la tabla
      this.bookingsForTable = bookings.map(booking => ({
        ...booking,
        guestName: guests.find(g => g.id === booking.guestId)?.name,
        roomNumber: rooms.find(r => r.id === booking.roomId)?.number
      }));
    });
  }
  confirmCancel(booking: any) { // Recibimos el booking completo
    if (!booking || !booking.id) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de cancelar la reserva del huésped ${booking.guestName}? La habitación ${booking.roomNumber} quedará libre.`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bookingService.cancelBooking(booking.id);
        // Liberamos la habitación
        this.roomService.updateRoomStatus(booking.roomId, 'Disponible');
      }
    });
  }
}