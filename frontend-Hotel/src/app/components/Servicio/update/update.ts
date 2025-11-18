import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ServiceService } from '../../../services/Service.service';
import { ServiceResponseI } from '../../../models/Service';

@Component({
  selector: 'app-service-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ToastModule,
    CardModule,
    RouterModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  entityId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', []],
      price: [0, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', []],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de servicio no proporcionado' });
    }
  }

  loadData(): void {
    this.loading = true;
    this.serviceService.getById(this.entityId).subscribe({
      next: (data: ServiceResponseI) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos del servicio' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.serviceService.update(this.entityId, formData).subscribe({
        next: (response: ServiceResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio actualizado correctamente' });
          setTimeout(() => this.router.navigate(['/Servicio']), 1000);
        },
        error: (any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el servicio' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/Servicio']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) return 'El campo es requerido.';
      if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}.`;
    }
    return '';
  }
}