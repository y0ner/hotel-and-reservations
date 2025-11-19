import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { ReservationResponseI } from '../../../models/Reservation';
import { PaymentResponseI } from '../../../models/Payment';

@Component({
  selector: 'app-payment-update',
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
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  paymentId: number | null = null;
  reservations: ReservationResponseI[] = [];
  paymentMethods = [
    { label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
    { label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
    { label: 'Efectivo', value: 'CASH' }
  ];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private reservationService: ReservationService,
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
    this.paymentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadReservations();
    if (this.paymentId) {
      this.loadPaymentData(this.paymentId);
    }
  }

  loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las reservas' });
      }
    });
  }

  loadPaymentData(id: number): void {
    this.paymentService.getById(id).subscribe({
      next: (data) => {
        // Asegurarse que la fecha es un objeto Date
        data.payment_date = new Date(data.payment_date);
        this.form.patchValue(data);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del pago' });
      }
    });
  }

  submit(): void {
    if (this.form.valid && this.paymentId) {
      this.loading = true;
      this.paymentService.update(this.paymentId, this.form.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago actualizado correctamente' });
          setTimeout(() => {
            this.router.navigate(['/Pago']);
          }, 1000);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el pago' });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/Pago']);
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