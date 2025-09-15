// src/app/components/service/update/update.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea'; // Corregido a TextareaModule
import { InputNumberModule } from 'primeng/inputnumber';
import { ServiceService } from '../../../services/service.service';
import { ServiceI } from '../../../models/service';

@Component({
  selector: 'app-update-service',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, InputNumberModule],
  templateUrl: './update.html', // --- CORRECCIÓN 1: Asegurarse de que esta línea exista y sea correcta ---
})
export class UpdateComponent implements OnInit {
  form;
  serviceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.serviceId = +idParam;
      const service = this.serviceService.getServiceById(this.serviceId);
      if (service) {
        this.form.patchValue(service);
      }
    }
  }

  submit() {
    if (this.form.valid && this.serviceId) {
      const formValue = this.form.value;

      // --- CORRECCIÓN 2: Construir el objeto explícitamente ---
      const updatedService: ServiceI = {
        id: this.serviceId,
        name: formValue.name ?? '',
        description: formValue.description ?? '',
        price: formValue.price ?? 0,
      };

      this.serviceService.updateService(updatedService);
      this.router.navigate(['/services']);
    }
  }

  cancelar() {
    this.router.navigate(['/services']);
  }
}