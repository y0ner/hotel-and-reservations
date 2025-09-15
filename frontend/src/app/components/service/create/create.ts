// src/app/components/service/create/create.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ServiceService } from '../../../services/service.service';
import { ServiceI } from '../../../models/service';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, InputNumberModule], // <-- CORRECCIÓN AQUÍ
  templateUrl: './create.html',
})
export class CreateComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceService: ServiceService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const newService: ServiceI = {
        name: formValue.name ?? '',
        description: formValue.description ?? '',
        price: formValue.price ?? 0
      };
      this.serviceService.addService(newService);
      this.router.navigate(['/services']);
    }
  }

  cancelar() {
    this.router.navigate(['/services']);
  }
}