import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, forkJoin } from 'rxjs';

import { ReservationService } from '../../../services/Reservation.service';
import { ReservationResponseI } from '../../../models/Reservation';
import { ClienteService } from '../../../services/Client.service';
import { ClientResponseI } from '../../../models/Client';
import { RoomService } from '../../../services/Room.service';
import { RoomResponseI } from '../../../models/Room';
import { ReservationServiceModal } from '../../ReservationService/modal/modal';

@Component({
  selector: 'app-reservation-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DynamicDialogModule
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class Getall implements OnInit, OnDestroy {
  reservations: ReservationResponseI[] = [];
  clients: ClientResponseI[] = [];
  rooms: RoomResponseI[] = [];
  loading: boolean = false;
  private subscription = new Subscription();

  constructor(
    private reservationService: ReservationService,
    private clienteService: ClienteService,
    private roomService: RoomService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadInitialData(): void {
    this.loading = true;
    this.subscription.add(
      forkJoin({
        reservations: this.reservationService.getAll(),
        clients: this.clienteService.getAll(),
        rooms: this.roomService.getAll()
      }).subscribe({
        next: (data) => {
          this.reservations = data.reservations;
          this.clients = data.clients;
          this.rooms = data.rooms;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los datos iniciales'
          });
          this.loading = false;
        }
      })
    );
  }

  loadData(): void {
    this.loading = true;
    this.subscription.add(
      this.reservationService.getAll().subscribe({
        next: (data: any) => {
          this.reservations = data;
          this.loading = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los datos'
          });
          this.loading = false;
        }
      })
    );
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Desconocido';
  }

  getRoomNumber(roomId: number): string {
    const room = this.rooms.find(r => r.id === roomId);
    return room ? `N° ${room.number}` : 'Desconocida';
  }

  showServicesModal(reservation: ReservationResponseI): void {
    const ref = this.dialogService.open(ReservationServiceModal, {
      header: 'Servicios de la Reserva',
      width: '60%',
      data: { reservation }
    });

    ref?.onClose.subscribe(() => {
      this.loadData(); // Recargar los datos cuando se cierra el modal
    });
  }

  confirmDelete(item: ReservationResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el registro ${item.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteItem(item.id!);
      }
    });
  }

  deleteItem(id: number): void {
    this.subscription.add(
      this.reservationService.deleteLogic(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro eliminado correctamente'
          });
          this.loadData(); // Recargar datos después de eliminar
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el registro'
          });
        }
      })
    );
  }
}
