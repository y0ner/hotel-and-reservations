// src/app/components/room/update/update.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { RoomService } from '../../../services/room.service';
import { RoomI } from '../../../models/room';

@Component({
  selector: 'app-update-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, InputNumberModule],
  templateUrl: './update.html',
})
export class UpdateRoomComponent implements OnInit {
  form;
  roomId: number | null = null;
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
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private roomService: RoomService
  ) {
    this.form = this.fb.group({
      number: ['', Validators.required],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.roomId = +idParam;
      const room = this.roomService.getRoomById(this.roomId);
      if (room) {
        this.form.patchValue(room);
      }
    }
  }

  submit() {
    if (this.form.valid && this.roomId !== null) {
      const formValue = this.form.value;
      const updatedRoom: RoomI = {
        id: this.roomId,
        number: formValue.number ?? '',
        type: formValue.type as 'Individual' | 'Doble' | 'Suite',
        price: formValue.price ?? 0,
        status: formValue.status as 'Disponible' | 'Ocupada' | 'Mantenimiento'
      };
      this.roomService.updateRoom(updatedRoom);
      this.router.navigate(['/rooms']);
    }
  }

  cancelar() {
    this.router.navigate(['/rooms']);
  }
}