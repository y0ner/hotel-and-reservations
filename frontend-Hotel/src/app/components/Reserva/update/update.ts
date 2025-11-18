import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { ClienteService } from '../../../services/Client.service';
import { RoomService } from '../../../services/Room.service';
import { ReservationService } from '../../../services/Reservation.service';
import { ClientI } from '../../../models/Client';
import { RoomI } from '../../../models/Room';
import { ReservationI, ReservationResponseI } from '../../../models/Reservation';

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
    ButtonModule
  ],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
  providers: [MessageService]
})
export class Update implements OnInit {
  form!: FormGroup;
  clients: ClientI[] = [];
  rooms: RoomI[] = [];
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
    private clientService: ClienteService,
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
      checkin_date: [null, Validators.required],
      checkout_date: [null, Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data: ClientI[]) => {
        this.clients = data;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load clients' });
        console.error('Error loading clients:', error);
      }
    });
  }

  loadRooms(): void {
    this.roomService.getAll().subscribe({
      next: (data: RoomI[]) => {
        this.rooms = data;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load rooms' });
        console.error('Error loading rooms:', error);
      }
    });
  }

  loadReservation(id: number): void {
    this.reservationService.getById(id).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          client_id: data.client_id,
          room_id: data.room_id,
          checkin_date: new Date(data.checkin_date),
          checkout_date: new Date(data.checkout_date),
          total_amount: data.total_amount,
          status: data.status
        });
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reservation' });
        console.error('Error loading reservation:', error);
        this.router.navigate(['/reservas']);
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const reservation: ReservationI = {
        ...this.form.value,
        id: this.reservationId,
        checkin_date: this.form.value.checkin_date.toISOString().split('T')[0],
        checkout_date: this.form.value.checkout_date.toISOString().split('T')[0]
      };

      this.reservationService.update(this.reservationId, reservation).subscribe({
        next: (data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation updated successfully' });
          this.loading = false;
          this.router.navigate(['/reservas']);
        },
        error: (error: any) => {
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