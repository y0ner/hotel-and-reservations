// src/app/components/booking/create/create.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker'; // <-- CORRECCIÓN AQUÍ
import { InputNumberModule } from 'primeng/inputnumber';
import { GuestService } from '../../../services/guest.service';
import { RoomService } from '../../../services/room.service';
import { BookingService } from '../../../services/booking.service';
import { GuestI } from '../../../models/guest';
import { RoomI } from '../../../models/room';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule, // <-- CORRECCIÓN AQUÍ
    InputNumberModule
  ],
  templateUrl: './create.html',
})
export class CreateComponent implements OnInit {
  // ... (El resto del código de la clase se mantiene exactamente igual)
  form;
  guests: GuestI[] = [];
  availableRooms: RoomI[] = [];
  guestOptions: any[] = [];
  roomOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private guestService: GuestService,
    private roomService: RoomService,
    private bookingService: BookingService
  ) {
    this.form = this.fb.group({
      guestId: [null, Validators.required],
      roomId: [null, Validators.required],
      checkInDate: [null, Validators.required],
      checkOutDate: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.guests = this.guestService.getGuests();
    this.guestOptions = this.guests.map(g => ({ label: g.name, value: g.id }));

    this.availableRooms = this.roomService.getRooms().filter(r => r.status === 'Disponible');
    this.roomOptions = this.availableRooms.map(r => ({
      label: `N° ${r.number} - ${r.type}`,
      value: r.id
    }));
  }

   submit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    
    if (!formValue.guestId || !formValue.roomId || !formValue.checkInDate || !formValue.checkOutDate) {
      return; 
    }

    const room = this.availableRooms.find(r => r.id === formValue.roomId);

    // --- CORRECCIÓN FINAL AQUÍ ---
    // Hacemos toda la lógica dependiente de 'room' dentro de este 'if'.
    if (room) {
      const checkIn = new Date(formValue.checkInDate);
      const checkOut = new Date(formValue.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (days <= 0) {
          return;
      }
      const totalPrice = days * room.price;

      this.bookingService.addBooking({
        guestId: formValue.guestId,
        roomId: formValue.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: totalPrice,
        status: 'Confirmada'
      });
      
      this.roomService.updateRoomStatus(formValue.roomId, 'Ocupada');
      
      this.router.navigate(['/bookings']);
    }
  }

  cancelar() {
    this.router.navigate(['/bookings']);
  }
}