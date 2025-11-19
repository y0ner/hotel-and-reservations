import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';
import { ReservationServiceService } from '../../../services/ReservationService.service';
import { ServiceService } from '../../../services/Service.service';
import { ServiceResponseI } from '../../../models/Service';
import { ReservationServiceResponseI } from '../../../models/ReservationService';

@Component({
  selector: 'app-reservation-service-manage',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PickListModule,
    ToastModule
  ],
  templateUrl: './manage.html',
  styleUrls: ['./manage.css'],
  providers: [MessageService]
})
export class Manage implements OnInit {
  loading = true;
  reservationId!: number;
  
  allServices: ServiceResponseI[] = [];
  sourceServices: ServiceResponseI[] = [];
  targetServices: ServiceResponseI[] = [];

  // Mapa para rastrear los IDs de ReservationService para los servicios en la lista de destino
  private targetReservationServiceIds = new Map<number, number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationServiceService: ReservationServiceService,
    private serviceService: ServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reservationId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      allServices: this.serviceService.getAll(),
      assignedReservationServices: this.reservationServiceService.getAll()
    }).subscribe({
      next: ({ allServices, assignedReservationServices }) => {
        this.allServices = allServices;
        
        const assignedForThisReservation = assignedReservationServices.filter(
          (rs: ReservationServiceResponseI) => rs.reservation_id === this.reservationId
        );

        const assignedServiceIds = new Set<number>();
        this.targetReservationServiceIds.clear();

        this.targetServices = assignedForThisReservation.map((rs: ReservationServiceResponseI) => {
          const service = this.allServices.find(s => s.id === rs.service_id);
          assignedServiceIds.add(rs.service_id);
          this.targetReservationServiceIds.set(rs.service_id, rs.id!);
          return service;
        }).filter((s?: ServiceResponseI): s is ServiceResponseI => !!s);

        this.sourceServices = this.allServices.filter(s => !assignedServiceIds.has(s.id!));
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
      }
    });
  }

  onMoveToTarget(event: { items: ServiceResponseI[] }): void {
    event.items.forEach(service => {
      const reservationService = {
        reservation_id: this.reservationId,
        service_id: service.id!,
        quantity: 1, // Cantidad por defecto
        status: 'ACTIVE' as const
      };
      this.reservationServiceService.create(reservationService).subscribe({
        next: (createdRs: ReservationServiceResponseI) => {
          this.targetReservationServiceIds.set(service.id!, createdRs.id!);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Servicio '${service.name}' añadido.` });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo añadir el servicio '${service.name}'.` });
          // Revertir el movimiento en la UI
          this.sourceServices.push(service);
          this.targetServices = this.targetServices.filter(s => s.id !== service.id);
        }
      });
    });
  }

  onMoveToSource(event: { items: ServiceResponseI[] }): void {
    event.items.forEach(service => {
      const reservationServiceId = this.targetReservationServiceIds.get(service.id!);
      if (reservationServiceId) {
        this.reservationServiceService.delete(reservationServiceId).subscribe({
          next: () => {
            this.targetReservationServiceIds.delete(service.id!);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Servicio '${service.name}' eliminado.` });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el servicio '${service.name}'.` });
            // Revertir el movimiento en la UI
            this.targetServices.push(service);
            this.sourceServices = this.sourceServices.filter(s => s.id !== service.id);
          }
        });
      }
    });
  }

  done(): void {
    this.router.navigate(['/Reserva']);
  }
}
