// src/app/components/billing/invoice/invoice.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BookingService } from '../../../services/booking.service';
import { GuestService } from '../../../services/guest.service';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './invoice.html',
  styleUrls: ['./invoice.css']
})
export class InvoiceComponent implements OnInit {
  invoice: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const bookingId = +idParam;
      const booking = this.bookingService.getBookingById(bookingId);
      if (booking) {
        const guest = this.guestService.getGuestById(booking.guestId);
        const room = this.roomService.getRoomById(booking.roomId);
        
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));

        this.invoice = {
          ...booking,
          guestName: guest?.name,
          guestDocument: guest?.documentNumber,
          guestEmail: guest?.email,
          roomNumber: room?.number,
          roomType: room?.type,
          roomPrice: room?.price,
          nights: nights
        };
      }
    }
  }

  printInvoice() {
    window.print();
  }
}