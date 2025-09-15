// src/app/components/guest/create/create.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; // <-- IMPORTA ESTE MÓDULO
import { GuestService } from '../../../services/guest.service';
import { GuestI } from '../../../models/guest';

@Component({
  selector: 'app-create-guest',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule], // <-- AÑÁDELO AQUÍ
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class Create {
  form;
  // Define las opciones para el estado del huésped
  guestStatuses = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private guestService: GuestService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      documentNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required]
    });
  }

submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const newGuest: GuestI = {
        name: formValue.name ?? '',
        documentNumber: formValue.documentNumber ?? '',
        phone: formValue.phone ?? '',
        email: formValue.email ?? '',
        // AQUÍ ESTÁ LA CORRECCIÓN:
        status: formValue.status as "ACTIVE" | "INACTIVE"
      };
      this.guestService.addGuest(newGuest);
      this.router.navigate(['/guests']);
    }
  }

  cancelar() {
    this.router.navigate(['/guests']);
  }
}