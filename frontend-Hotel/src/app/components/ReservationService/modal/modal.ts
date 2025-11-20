import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ReservationServiceService } from '../../../services/ReservationService.service';
import { ServiceService } from '../../../services/Service.service';
import { ReservationI } from '../../../models/Reservation';
import { ServiceI } from '../../../models/Service';
import { ReservationServiceI } from '../../../models/ReservationService';

@Component({
  selector: 'app-reservation-service-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
    ToastModule
  ],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css'],
  providers: [MessageService]
})
export class ReservationServiceModal implements OnInit {
  reservation!: ReservationI;
  reservationServices: ReservationServiceI[] = [];
  availableServices: any[] = [];
  
  selectedServiceId: number | null = null;
  quantity: number = 1;
  
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private reservationServiceService: ReservationServiceService,
    private serviceService: ServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.reservation = this.config.data.reservation;
    this.loadReservationServices();
    this.loadAvailableServices();
  }

  loadReservationServices(): void {
    this.loading = true;
    this.reservationServiceService.getServicesByReservation(this.reservation.id!).subscribe({
      next: (data) => {
        this.reservationServices = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios de la reserva' });
        this.loading = false;
      }
    });
  }

  loadAvailableServices(): void {
    this.serviceService.getAll().subscribe({
      next: (data) => {
        this.availableServices = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios disponibles' });
      }
    });
  }

  addService(): void {
    if (!this.selectedServiceId || this.quantity <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un servicio y una cantidad válida' });
      return;
    }

    this.reservationServiceService.addServiceToReservation(this.reservation.id!, this.selectedServiceId, this.quantity).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio añadido correctamente' });
        this.loadReservationServices(); // Recargar la lista
        this.selectedServiceId = null;
        this.quantity = 1;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el servicio' });
      }
    });
  }

  removeService(reservationServiceId: number): void {
    this.reservationServiceService.removeServiceFromReservation(this.reservation.id!, reservationServiceId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio eliminado correctamente' });
        this.loadReservationServices(); // Recargar la lista
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el servicio' });
      }
    });
  }

  getTotalServicesCost(): number {
    return this.reservationServices.reduce((total, rs) => {
      const service = this.availableServices.find(s => s.id === rs.service_id);
      return total + (service ? service.price * rs.quantity : 0);
    }, 0);
  }

  closeDialog(data: any = null): void {
    this.ref.close(data);
  }
}
