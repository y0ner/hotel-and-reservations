import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { RoomTypeService } from '../../../services/RoomType.service';
import { RoomTypeResponseI } from '../../../models/RoomType';

@Component({
  selector: 'app-roomtype-update',
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de tipo de habitación no proporcionado' });
    }
  }

  loadData(): void {
    this.loading = true;
    this.roomTypeService.getById(this.entityId).subscribe({
      next: (data: RoomTypeResponseI) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.roomTypeService.update(this.entityId, formData).subscribe({
        next: (response: RoomTypeResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de habitación actualizado correctamente' });
          setTimeout(() => this.router.navigate(['/TipoHabitacion']), 1000);
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Error al actualizar' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/TipoHabitacion']);
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