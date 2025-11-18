import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { ClientService } from '../../../services/Client.service';
import { RoomService } from '../../../services/Room.service';
import { ReservationService } from '../../../services/Reservation.service';
import { Client } from '../../../models/Client';
import { Room } from '../../../models/Room';
import { Reservation } from '../../../models/Reservation';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
  providers: [MessageService]
})
export class Update implements OnInit {
  form!: FormGroup;
  clients: Client[] = [];
  rooms: Room[] = [];
  statuses: any[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  loading: boolean = false;
  reservationId!: number;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private clientService: ClientService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadClients();
    this.loadRooms();
    this.loadReservation(this.reservationId);
  }

  initForm(): void {
    this.form = this.fb.group({
      client_id: [null, Validators.required],
      room_id: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      total_price: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load clients' });
        console.error('Error loading clients:', error);
      }
    });
  }

  loadRooms(): void {
    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load rooms' });
        console.error('Error loading rooms:', error);
      }
    });
  }

  loadReservation(id: number): void {
    this.reservationService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          client_id: data.client_id,
          room_id: data.room_id,
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          total_price: data.total_price,
          status: data.status
        });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reservation' });
        console.error('Error loading reservation:', error);
        this.router.navigate(['/reservas']);
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const reservation: Reservation = {
        ...this.form.value,
        id: this.reservationId,
        start_date: this.form.value.start_date.toISOString().split('T')[0],
        end_date: this.form.value.end_date.toISOString().split('T')[0]
      };

      this.reservationService.update(this.reservationId, reservation).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation updated successfully' });
          this.loading = false;
          this.router.navigate(['/reservas']);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update reservation' });
          console.error('Error updating reservation:', error);
          this.loading = false;
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
    }
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'This field is required.';
      }
      if (control.errors?.['min']) {
        return 'Value must be greater than or equal to 0.';
      }
    }
    return null;
  }

  cancelar(): void {
    this.router.navigate(['/reservas']);
  }
}