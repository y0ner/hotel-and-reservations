import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { RoomTypeService } from '../../../services/RoomType.service';

@Component({
  selector: 'app-roomtype-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    ToastModule,
    CardModule,
    RouterModule
  ],
  templateUrl: './create.html',
  styleUrl: './create.css',
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roomTypeService: RoomTypeService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      max_people: [1, [Validators.required, Validators.min(1)]],
      includes_breakfast: [false, []],
      status: ['ACTIVE', []],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.value;

      this.roomTypeService.create(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tipo de habitación creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/TipoHabitacion']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating RoomType:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al crear el tipo de habitación'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/TipoHabitacion']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) {
        return `El campo es requerido.`;
      }
      if (field.errors['min']) {
        return `El valor mínimo es ${field.errors['min'].min}.`;
      }
    }
    return '';
  }
}