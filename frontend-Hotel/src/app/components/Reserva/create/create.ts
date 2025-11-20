import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ReservationService } from '../../../services/Reservation.service';
import { ClienteService } from '../../../services/Client.service';
import { RoomService } from '../../../services/Room.service';
import { TarifaService } from '../../../services/Rate.service';
import { AuthService } from '../../../services/auth.service';
import { ClientResponseI } from '../../../models/Client';
import { RoomResponseI } from '../../../models/Room';
import { RateResponseI } from '../../../models/Rate';

@Component({
  selector: 'app-reservation-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
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
  clients: ClientResponseI[] = [];
  rooms: RoomResponseI[] = [];
  rates: RateResponseI[] = [];
  calculatedPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private clientService: ClienteService,
    private roomService: RoomService,
    private rateService: TarifaService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      client_id: [null, [Validators.required]],
      room_id: [null, [Validators.required]],
      rate_id: [null, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      number_of_guests: [1, [Validators.required, Validators.min(1)]],
      status: ['PENDING', []],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadRooms();
    this.loadRates();
    
    // Escuchar cambios en el formulario para calcular precio
    this.form.get('rate_id')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('start_date')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('end_date')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  loadClients(): void {
    this.clientService.getAllByHotel().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
      }
    });
  }

  loadRooms(): void {
    this.roomService.getAllByHotel().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las habitaciones' });
      }
    });
  }

  loadRates(): void {
    this.rateService.getAllByHotel().subscribe({
      next: (data) => {
        this.rates = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las tarifas' });
      }
    });
  }

  calculatePrice(): void {
    const rateId = this.form.get('rate_id')?.value;
    const startDate = this.form.get('start_date')?.value;
    const endDate = this.form.get('end_date')?.value;

    if (!rateId || !startDate || !endDate) {
      this.calculatedPrice = 0;
      return;
    }

    // Encontrar la tarifa seleccionada
    const selectedRate = this.rates.find(r => r.id === rateId);
    if (!selectedRate) {
      this.calculatedPrice = 0;
      return;
    }

    // Calcular número de noches
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      this.calculatedPrice = 0;
      return;
    }

    // Calcular precio total: tarifa × número de noches
    this.calculatedPrice = selectedRate.amount * nights;
  }

  submit(): void {
    if (this.form.valid && this.calculatedPrice > 0) {
      this.loading = true;
      const hotelId = this.authService.getCurrentHotel();

      if (!hotelId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se ha seleccionado un hotel'
        });
        this.loading = false;
        return;
      }

      const formData = {
        ...this.form.value,
        total_amount: this.calculatedPrice,
        hotel_id: hotelId,
        reservation_date: new Date()
      };

      // Primero validar disponibilidad
      this.reservationService.checkAvailability(formData.room_id, formData.start_date, formData.end_date).subscribe({
        next: (avail) => {
          if (!avail.available) {
            const conflict = avail.conflicts && avail.conflicts.length > 0 ? avail.conflicts[0] : null;
            const conflictMsg = conflict ? `Conflicta con reserva: ${new Date(conflict.start_date).toLocaleDateString()} - ${new Date(conflict.end_date).toLocaleDateString()}` : 'La habitación no está disponible en las fechas seleccionadas';
            this.messageService.add({
              severity: 'error',
              summary: 'No disponible',
              detail: conflictMsg
            });
            this.loading = false;
            return;
          }

          // Si está disponible, crear la reserva
          this.reservationService.create(formData).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Reserva creada correctamente'
              });
              setTimeout(() => {
                this.router.navigate(['/Reserva']);
              }, 1000);
            },
            error: (error) => {
              console.error('Error creating Reservation:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error?.message || 'Error al crear la reserva'
              });
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error checking availability:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al verificar la disponibilidad'
          });
          this.loading = false;
        }
      });
      
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos y verifique que las fechas sean válidas'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/Reserva']);
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

  getPricePerNight(): number {
    const rateId = this.form.get('rate_id')?.value;
    if (!rateId) return 0;
    const selectedRate = this.rates.find(r => r.id === rateId);
    return selectedRate ? selectedRate.amount : 0;
  }
}