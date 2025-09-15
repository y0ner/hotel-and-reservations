// src/app/services/report.service.ts

import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from './booking.service';
import { GuestService } from './guest.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // 1. Declara la propiedad aquí sin inicializarla
  reportData$: Observable<any>;

  constructor(
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService: RoomService
  ) {
    // 2. Mueve toda la lógica de inicialización al constructor
    this.reportData$ = combineLatest([
      this.bookingService.bookings$,
      this.guestService.guests$,
      this.roomService.rooms$
    ]).pipe(
      map(([bookings, guests, rooms]) => {
        const totalRevenue = bookings
          .filter(b => b.status === 'Pagada')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        const totalRooms = rooms.length;
        const occupiedRooms = rooms.filter(r => r.status === 'Ocupada').length;
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

        const activeGuests = guests.filter(g => g.status === 'ACTIVE').length;
        
        const monthlyRevenue: { [key: string]: number } = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        
        for (const booking of bookings.filter(b => b.status === 'Pagada')) {
          const month = new Date(booking.checkOutDate).getMonth();
          const monthName = monthNames[month];
          monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + booking.totalPrice;
        }

        const chartLabels = Object.keys(monthlyRevenue);
        const chartDataPoints = Object.values(monthlyRevenue);

        return {
          totalRevenue,
          occupancyRate,
          activeGuests,
          monthlyChart: {
              labels: chartLabels,
              datasets: [{
                  label: 'Ingresos Mensuales',
                  data: chartDataPoints,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              }]
          }
        };
      })
    );
  }
}