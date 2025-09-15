// src/app/components/booking/update/update.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { BookingService } from '../../../services/booking.service';
import { GuestService } from '../../../services/guest.service';
import { RoomService } from '../../../services/room.service';
import { BookingI } from '../../../models/booking';
import { RoomI } from '../../../models/room';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule, DatePickerModule],
  templateUrl: './update.html',
})
export class UpdateComponent implements OnInit {
  form;
  bookingId: number | null = null;
  originalRoomId: number | null = null;
  
  guestOptions: any[] = [];
  roomOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private guestService: GuestService,
    private roomService: RoomService
  ) {
    // --- CORRECCIÓN 1: Definir el formulario con tipos explícitos ---
    this.form = this.fb.group({
      guestId: [null as number | null, Validators.required],
      roomId: [null as number | null, Validators.required],
      checkInDate: [null as Date | null, Validators.required],
      checkOutDate: [null as Date | null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.guestOptions = this.guestService.getGuests().map(g => ({ label: g.name, value: g.id }));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookingId = +idParam;
      const booking = this.bookingService.getBookingById(this.bookingId);
      
      if (booking) {
        this.originalRoomId = booking.roomId;
        const availableRooms = this.roomService.getRooms().filter(r => r.status === 'Disponible' || r.id === booking.roomId);
        this.roomOptions = availableRooms.map(r => ({ label: `N° ${r.number} - ${r.type}`, value: r.id }));
        
        this.form.patchValue({
            ...booking,
            checkInDate: new Date(booking.checkInDate),
            checkOutDate: new Date(booking.checkOutDate)
        });
      }
    }
  }

  submit() {
    if (this.form.invalid || !this.bookingId) return;

    const formValue = this.form.value;

    // --- CORRECCIÓN 2: Verificar que los valores no sean nulos ---
    if (!formValue.guestId || !formValue.roomId || !formValue.checkInDate || !formValue.checkOutDate) {
        return;
    }

    const room = this.roomService.getRoomById(formValue.roomId);

    if (room) {
      const checkIn = new Date(formValue.checkInDate);
      const checkOut = new Date(formValue.checkOutDate);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      
      if (days <= 0) return;

      const updatedBooking: BookingI = {
        id: this.bookingId,
        guestId: formValue.guestId,
        roomId: formValue.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: days * room.price,
        status: 'Confirmada'
      };
      
      this.bookingService.updateBooking(updatedBooking);

      if (this.originalRoomId !== formValue.roomId) {
        if(this.originalRoomId) {
            this.roomService.updateRoomStatus(this.originalRoomId, 'Disponible');
        }
        this.roomService.updateRoomStatus(formValue.roomId, 'Ocupada');
      }

      this.router.navigate(['/bookings']);
    }
  }
  
  cancelar() {
    this.router.navigate(['/bookings']);
  }
}