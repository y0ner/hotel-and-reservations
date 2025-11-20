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
import { SeasonService } from '../../../services/Season.service';
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
  suggestedRate: RateResponseI | null = null; // Tarifa sugerida automáticamente

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private clientService: ClienteService,
    private roomService: RoomService,
    private rateService: TarifaService,
    private seasonService: SeasonService,
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
    this.form.get('start_date')?.valueChanges.subscribe(() => this.onDatesChanged());
    this.form.get('end_date')?.valueChanges.subscribe(() => this.onDatesChanged());
    this.form.get('room_id')?.valueChanges.subscribe(() => this.onRoomOrDatesChanged());
    this.form.get('number_of_guests')?.valueChanges.subscribe(() => this.validateGuestCapacity());
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

  /**
   * Cuando cambian las fechas, buscar automáticamente la tarifa
   */
  private onDatesChanged(): void {
    const startDate = this.form.get('start_date')?.value;
    const endDate = this.form.get('end_date')?.value;
    const roomId = this.form.get('room_id')?.value;

    if (startDate && endDate && roomId) {
      this.autoSelectRate(startDate, endDate, roomId);
    }

    this.calculatePrice();
  }

  /**
   * Cuando cambia la habitación, validar capacidad y buscar tarifa
   */
  private onRoomOrDatesChanged(): void {
    this.validateGuestCapacity();
    this.onDatesChanged();
  }

  /**
   * Buscar automáticamente la tarifa según la temporada y tipo de habitación
   */
  private autoSelectRate(startDate: Date, endDate: Date, roomId: number): void {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    // Buscar la temporada que contenga estas fechas
    this.seasonService.findSeasonByDateRange(startDate, endDate).subscribe({
      next: (season) => {
        if (season) {
          // Buscar tarifa para esta temporada y tipo de habitación
          const suggestedRate = this.rates.find(
            r => r.season_id === season.id && r.roomtype_id === room.room_type_id
          );

          if (suggestedRate && suggestedRate.id) {
            this.suggestedRate = suggestedRate;
            this.form.patchValue({ rate_id: suggestedRate.id }, { emitEvent: false });
            this.messageService.add({
              severity: 'info',
              summary: 'Tarifa detectada',
              detail: `Se seleccionó automáticamente la tarifa para la temporada "${season.name}"`
            });
          }
        }
      },
      error: (error) => {
        console.error('Error al buscar temporada:', error);
      }
    });
  }

  /**
   * Validar que el número de huéspedes no exceda la capacidad de la habitación
   */
  private validateGuestCapacity(): void {
    const roomId = this.form.get('room_id')?.value;
    const numberOfGuests = this.form.get('number_of_guests')?.value;

    if (!roomId || !numberOfGuests) return;

    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    if (numberOfGuests > room.capacity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Capacidad excedida',
        detail: `La habitación N° ${room.number} tiene capacidad para ${room.capacity} huéspedes`
      });
      this.form.patchValue({ number_of_guests: room.capacity });
    }
  }

  calculatePrice(): void {
    const rateId = this.form.get('rate_id')?.value;
    const startDate = this.form.get('start_date')?.value;
    const endDate = this.form.get('end_date')?.value;
    const numberOfGuests = this.form.get('number_of_guests')?.value || 1;

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

    // Calcular precio total: tarifa × número de noches × número de huéspedes
    this.calculatedPrice = selectedRate.amount * nights * numberOfGuests;
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

  getRoomCapacity(): number {
    const roomId = this.form.get('room_id')?.value;
    if (!roomId) return 0;
    const room = this.rooms.find(r => r.id === roomId);
    return room ? room.capacity : 0;
  }
}