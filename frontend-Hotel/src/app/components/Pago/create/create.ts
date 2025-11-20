import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PaymentService } from '../../../services/Payment.service';
import { ReservationService } from '../../../services/Reservation.service';
import { ClienteService } from '../../../services/Client.service';
import { ReservationResponseI } from '../../../models/Reservation';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ToastModule,
    CardModule
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  reservations: ReservationResponseI[] = [];
  paymentMethods = [
    { label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
    { label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
    { label: 'Efectivo', value: 'CASH' }
  ];
  selectedReservationData: any = null;
  reservationIdParam: number | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private reservationService: ReservationService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      reservation_id: [null, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      method: [null, [Validators.required]],
      currency: ['USD', [Validators.required]],
      payment_date: [new Date(), [Validators.required]],
      reference: ['', []]
    });
  }

  ngOnInit(): void {
    // Obtener el ID de reserva de la ruta si existe
    this.route.params.subscribe(params => {
      if (params['reservationId']) {
        this.reservationIdParam = parseInt(params['reservationId'], 10);
      }
    });

    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reservations = data;
        
        // Si vino con parámetro de reserva, pre-cargar los datos
        if (this.reservationIdParam) {
          this.preloadReservationData(this.reservationIdParam);
          this.checkExistingPayment(this.reservationIdParam);
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las reservas' });
      }
    });
  }

  checkExistingPayment(reservationId: number): void {
    this.paymentService.getAll().subscribe({
      next: (payments) => {
        const existingPayment = payments.find(p => p.reservation_id === reservationId && p.status === 'ACTIVE');
        if (existingPayment) {
          this.messageService.add({ 
            severity: 'warn', 
            summary: 'Advertencia', 
            detail: 'Ya existe un pago registrado para esta reserva' 
          });
          setTimeout(() => {
            this.router.navigate(['/Pago']);
          }, 2000);
        }
      }
    });
  }

  preloadReservationData(reservationId: number): void {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (reservation) {
      this.selectedReservationData = reservation;
      this.form.patchValue({
        reservation_id: reservation.id,
        amount: reservation.total_amount
      });
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'No se encontró la reserva especificada' 
      });
    }
  }

  onReservationChange(reservationId: number): void {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (reservation) {
      this.selectedReservationData = reservation;
      this.form.patchValue({
        amount: reservation.total_amount
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.paymentService.create(this.form.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago creado correctamente' });
          setTimeout(() => {
            this.router.navigate(['/Pago']);
          }, 1000);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el pago' });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/Pago']);
  }
}