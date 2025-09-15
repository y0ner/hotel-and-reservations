// src/app/components/guest/update/update.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GuestService } from '../../../services/guest.service';
import { GuestI } from '../../../models/guest';

@Component({
  selector: 'app-update', // El selector original es 'app-update'
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './update.html',
  styleUrl: './update.css' // Asumiendo que tienes este archivo
})
export class Update implements OnInit {
  form;
  guestId: number | null = null;
  guestStatuses = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private guestService: GuestService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      documentNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.guestId = +idParam;
      const guest = this.guestService.getGuestById(this.guestId);
      if (guest) {
        this.form.patchValue(guest);
      }
    }
  }

  submit() {
    if (this.form.valid && this.guestId !== null) {
      const formValue = this.form.value;
      const updatedGuest: GuestI = {
        id: this.guestId,
        name: formValue.name ?? '',
        documentNumber: formValue.documentNumber ?? '',
        phone: formValue.phone ?? '',
        email: formValue.email ?? '',
        status: formValue.status as "ACTIVE" | "INACTIVE"
      };
      this.guestService.updateGuest(updatedGuest);
      this.router.navigate(['/guests']);
    }
  }

  cancelar() {
    this.router.navigate(['/guests']);
  }
}