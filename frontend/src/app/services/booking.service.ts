// src/app/services/booking.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookingI } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsService = new BehaviorSubject<BookingI[]>([]);
  bookings$ = this.bookingsService.asObservable();

  constructor() { }

  addBooking(booking: BookingI) {
    const bookings = this.bookingsService.value;
    booking.id = bookings.length ? Math.max(...bookings.map(b => b.id ?? 0)) + 1 : 1;
    this.bookingsService.next([...bookings, booking]);
  }
   cancelBooking(bookingId: number) {
    const bookings = this.bookingsService.value.map(b => 
      b.id === bookingId ? { ...b, status: 'Cancelada' as const } : b
    );
    this.bookingsService.next(bookings);
  }
  getBookingById(id: number): BookingI | undefined {
    return this.bookingsService.value.find(b => b.id === id);
  }

  updateBooking(updatedBooking: BookingI) {
    const bookings = this.bookingsService.value.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    );
    this.bookingsService.next(bookings);
  }
   markAsPaid(bookingId: number) {
    const bookings = this.bookingsService.value.map(b => 
      b.id === bookingId ? { ...b, status: 'Pagada' as const } : b
    );
    this.bookingsService.next(bookings);
  }
}