// src/app/components/room/create/create.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { RoomService } from '../../../services/room.service';
import { RoomI } from '../../../models/room'; // <--- ¡AÑADE ESTA LÍNEA!

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule
  ],
  templateUrl: './create.html',
})
export class CreateRoomComponent {
  // ... el resto de tu código se mantiene igual
  form;
  roomTypes = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Doble', value: 'Doble' },
    { label: 'Suite', value: 'Suite' }
  ];
  roomStatuses = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'Ocupada', value: 'Ocupada' },
    { label: 'Mantenimiento', value: 'Mantenimiento' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roomService: RoomService
  ) {
    this.form = this.fb.group({
      number: ['', Validators.required],
      type: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      status: [null, Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const newRoom: RoomI = {
        number: formValue.number ?? '',
        type: formValue.type ?? 'Individual',
        price: formValue.price ?? 0,
        status: formValue.status ?? 'Disponible'
      };
      this.roomService.addRoom(newRoom);
      this.router.navigate(['/rooms']);
    }
  }

  cancelar() {
    this.router.navigate(['/rooms']);
  }
}