import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

import { ClienteService } from '../../../services/Client.service';
import { RoomService } from '../../../services/Room.service';
import { ReservationService } from '../../../services/Reservation.service';
import { TarifaService } from '../../../services/Rate.service';
import { AuthService } from '../../../services/auth.service';
import { ClientResponseI } from '../../../models/Client';
import { RoomResponseI } from '../../../models/Room';
import { RateResponseI } from '../../../models/Rate';
import { ReservationI } from '../../../models/Reservation';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
  providers: [MessageService]
})
export class Update implements OnInit {
  form!: FormGroup;
  clients: ClientResponseI[] = [];
  rooms: RoomResponseI[] = [];
  rates: RateResponseI[] = [];
  statuses: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];
  loading: boolean = false;
  reservationId!: number;
  calculatedPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private clientService: ClienteService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private rateService: TarifaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadClients();
    this.loadRooms();
    this.loadRates();
    this.loadReservation(this.reservationId);

    // Escuchar cambios para calcular precio
    this.form.get('rate_id')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('start_date')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('end_date')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('number_of_guests')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  initForm(): void {
    this.form = this.fb.group({
      client_id: [null, Validators.required],
      room_id: [null, Validators.required],
      rate_id: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      number_of_guests: [1, [Validators.required, Validators.min(1)]],
      status: ['PENDING', Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getAllByHotel().subscribe({
      next: (data) => { this.clients = data; },
      error: (error) => this.handleError('cargar los clientes')
    });
  }

  loadRooms(): void {
    this.roomService.getAllByHotel().subscribe({
      next: (data) => { this.rooms = data; },
      error: (error) => this.handleError('cargar las habitaciones')
    });
  }

  loadRates(): void {
    this.rateService.getAllByHotel().subscribe({
      next: (data) => { this.rates = data; },
      error: (error) => this.handleError('cargar las tarifas')
    });
  }

  loadReservation(id: number): void {
    this.reservationService.getById(id).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          client_id: data.client_id,
          room_id: data.room_id,
          rate_id: data.rate_id,
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          number_of_guests: data.number_of_guests,
          status: data.status
        });
        // Una vez cargados los datos, calcular el precio inicial
        this.calculatePrice();
      },
      error: (error) => {
        this.handleError('cargar la reserva');
        this.router.navigate(['/Reserva']);
      }
    });
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

    const selectedRate = this.rates.find(r => r.id === rateId);
    if (!selectedRate) {
      this.calculatedPrice = 0;
      return;
    }

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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha seleccionado un hotel' });
        this.loading = false;
        return;
      }

      const formData = {
        ...this.form.value,
        hotel_id: hotelId,
      };

      this.reservationService.checkAvailability(formData.room_id, formData.start_date, formData.end_date, this.reservationId).subscribe({
        next: (avail) => {
          if (!avail.available) {
            this.messageService.add({ severity: 'error', summary: 'No disponible', detail: 'La habitación no está disponible en las fechas seleccionadas' });
            this.loading = false;
            return;
          }

          this.reservationService.update(this.reservationId, formData).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva actualizada correctamente' });
              setTimeout(() => this.router.navigate(['/Reserva']), 1000);
            },
            error: (error) => {
              this.handleError('actualizar la reserva', error);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          this.handleError('verificar la disponibilidad', err);
          this.loading = false;
        }
      });

    } else {
      this.markFormGroupTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos' });
    }
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

  getPricePerNight(): number {
    const rateId = this.form.get('rate_id')?.value;
    if (!rateId) return 0;
    const selectedRate = this.rates.find(r => r.id === rateId);
    return selectedRate ? selectedRate.amount : 0;
  }

  handleError(action: string, error?: any): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action}` });
    console.error(`Error al ${action}:`, error);
  }

  cancelar(): void {
    this.router.navigate(['/Reserva']);
  }
}