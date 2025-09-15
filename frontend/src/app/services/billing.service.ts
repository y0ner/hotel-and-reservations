// src/app/services/billing.service.ts

import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from './booking.service';
import { GuestService } from './guest.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  
  // Declara la propiedad aquí, pero no la inicialices
  invoices$: Observable<any[]>;

  constructor(
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService: RoomService
  ) {
    // --- CORRECCIÓN AQUÍ: Mueve la lógica de inicialización al constructor ---
    this.invoices$ = combineLatest([
      this.bookingService.bookings$,
      this.guestService.guests$,
      this.roomService.rooms$
    ]).pipe(
      map(([bookings, guests, rooms]) => {
      return bookings
        // --- CORRECCIÓN AQUÍ ---
        .filter(booking => booking.status === 'Confirmada' || booking.status === 'Pagada')
        .map(booking => {
            const guest = guests.find(g => g.id === booking.guestId);
            const room = rooms.find(r => r.id === booking.roomId);
            return {
              ...booking,
              guestName: guest?.name || 'N/A',
              roomNumber: room?.number || 'N/A',
            };
          });
      })
    );
  }
}