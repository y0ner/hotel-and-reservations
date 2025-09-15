// src/app/components/billing/getall/getall.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BillingService } from '../../../services/billing.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router'; // <-- AÑADE ESTA LÍNEA
import { BookingService } from '../../../services/booking.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-getall-billing',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, RouterModule], // <-- Y AÑÁDELO AQUÍ
  templateUrl: './getall.html',
})
export class GetallComponent {
  invoices$: Observable<any[]>;

  constructor(
    private billingService: BillingService,
    private bookingService: BookingService,
    private confirmationService: ConfirmationService
  ) {
    this.invoices$ = this.billingService.invoices$;
  }

  markAsPaid(invoice: any) {
    this.confirmationService.confirm({
        message: `¿Confirmas que la factura FAC-00${invoice.id} ha sido pagada?`,
        header: 'Confirmar Pago',
        icon: 'pi pi-check-circle',
        accept: () => {
          this.bookingService.markAsPaid(invoice.id);
        }
    });
  }
}