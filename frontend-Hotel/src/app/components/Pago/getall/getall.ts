import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentService } from '../../../services/Payment.service';
import { PaymentResponseI } from '../../../models/Payment';

@Component({
  selector: 'app-payment-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  providers: [MessageService, ConfirmationService]
})
export class Getall implements OnInit {
  payments: PaymentResponseI[] = [];
  loading: boolean = true;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pagos' });
      }
    });
  }

  confirmCancel(payment: PaymentResponseI): void {
    if (payment.id === undefined) return;
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea anular el pago ${payment.id}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Anulación de Pago',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.cancelPayment(payment.id!);
      }
    });
  }

  cancelPayment(id: number): void {
    this.paymentService.cancelPayment(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago anulado correctamente' });
        this.loadPayments();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo anular el pago' });
      }
    });
  }
}