import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TarifaService } from '../../../services/Rate.service';
import { RoomTypeService } from '../../../services/RoomType.service';
import { SeasonService } from '../../../services/Season.service';
import { RoomTypeResponseI } from '../../../models/RoomType';
import { SeasonResponseI } from '../../../models/Season';

@Component({
  selector: 'app-rate-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
    CardModule,
    RouterModule
  ],
  templateUrl: './create.html',
  styleUrl: './create.css',
  providers: [MessageService]
})
export class Create implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  roomTypes: RoomTypeResponseI[] = [];
  seasons: SeasonResponseI[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rateService: TarifaService,
    private roomTypeService: RoomTypeService,
    private seasonService: SeasonService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      description: ['', []],
      price: [0, [Validators.required, Validators.min(0)]],
      room_type_id: [null, [Validators.required]],
      season_id: [null, [Validators.required]],
      status: ['ACTIVE', []],
    });
  }

  ngOnInit(): void {
    this.loadRoomTypes();
    this.loadSeasons();
  }

  loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe({
      next: (data) => {
        this.roomTypes = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de habitación' });
      }
    });
  }

  loadSeasons(): void {
    this.seasonService.getAll().subscribe({
      next: (data) => {
        this.seasons = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las temporadas' });
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.value;

      this.rateService.create(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tarifa creada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Tarifa']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating Rate:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al crear la tarifa'
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
    this.router.navigate(['/Tarifa']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
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