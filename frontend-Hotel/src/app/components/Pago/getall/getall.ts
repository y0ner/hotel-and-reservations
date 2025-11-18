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

  createPayment(): void {
    this.router.navigate(['/Pago/new']);
  }

  editPayment(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/Pago/edit', id]);
  }

  confirmDelete(payment: PaymentResponseI): void {
    if (payment.id === undefined) return;
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el pago ${payment.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deletePayment(payment.id!);
      }
    });
  }

  deletePayment(id: number): void {
    this.paymentService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago eliminado correctamente' });
        this.loadPayments();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el pago' });
      }
    });
  }
}