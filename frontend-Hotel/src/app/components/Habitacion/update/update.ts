import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { RoomService } from '../../../services/Room.service';
import { HotelService } from '../../../services/Hotel.service';
import { RoomTypeService } from '../../../services/RoomType.service';
import { HotelResponseI } from '../../../models/Hotel';
import { RoomTypeResponseI } from '../../../models/RoomType';
import { RoomResponseI } from '../../../models/Room';

@Component({
  selector: 'app-room-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
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
  hotels: HotelResponseI[] = [];
  roomTypes: RoomTypeResponseI[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private hotelService: HotelService,
    private roomTypeService: RoomTypeService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      number: ['', [Validators.required]],
      floor: ['', [Validators.required]],
      description: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      base_price: [0, [Validators.required, Validators.min(0)]],
      available: [true, []],
      hotel_id: [null, [Validators.required]],
      roomtype_id: [null, [Validators.required]],
      status: ['ACTIVE', []],
    });
  }

  ngOnInit(): void {
    this.loadHotels();
    this.loadRoomTypes();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de habitación no proporcionado' });
    }
  }

  loadHotels(): void {
    this.hotelService.getAll().subscribe(data => this.hotels = data);
  }

  loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe(data => this.roomTypes = data);
  }

  loadData(): void {
    this.loading = true;
    this.roomService.getById(this.entityId).subscribe({
      next: (data: RoomResponseI) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de la habitación' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.roomService.update(this.entityId, formData).subscribe({
        next: (response: RoomResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Habitación actualizada correctamente' });
          setTimeout(() => this.router.navigate(['/Habitacion']), 1000);
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Error al actualizar la habitación' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/Habitacion']);
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