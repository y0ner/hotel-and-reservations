import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { RateResponseI } from '../../../models/Rate';
import { RoomTypeResponseI } from '../../../models/RoomType';
import { SeasonResponseI } from '../../../models/Season';

@Component({
  selector: 'app-rate-update',
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
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  entityId: number = 0;
  roomTypes: RoomTypeResponseI[] = [];
  seasons: SeasonResponseI[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadRoomTypes();
      this.loadSeasons();
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de tarifa no proporcionado' });
    }
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

  loadData(): void {
    this.loading = true;
    this.rateService.getById(this.entityId).subscribe({
      next: (data: RateResponseI) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de la tarifa' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.rateService.update(this.entityId, formData).subscribe({
        next: (response: RateResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarifa actualizada correctamente' });
          setTimeout(() => this.router.navigate(['/Tarifa']), 1000);
        },
        error: (any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la tarifa' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/Tarifa']);
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