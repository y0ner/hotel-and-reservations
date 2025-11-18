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
import { ClientResponseI } from '../../../models/Client';
import { RoomResponseI } from '../../../models/Room';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private clientService: ClienteService,
    private roomService: RoomService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      client_id: [null, [Validators.required]],
      room_id: [null, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      total_price: [0, [Validators.required, Validators.min(0)]],
      status: ['PENDING', []],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadRooms();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
      }
    });
  }

  loadRooms(): void {
    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las habitaciones' });
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.value;

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
}