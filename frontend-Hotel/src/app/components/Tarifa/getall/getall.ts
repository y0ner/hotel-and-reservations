import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TarifaService } from '../../../services/Rate.service';
import { SeasonService } from '../../../services/Season.service';
import { RoomTypeService } from '../../../services/RoomType.service';
import { RateResponseI } from '../../../models/Rate';
import { SeasonResponseI } from '../../../models/Season';
import { RoomTypeResponseI } from '../../../models/RoomType';

@Component({
  selector: 'app-rate-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    ToastModule,
    CardModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  providers: [MessageService, ConfirmationService]
})
export class Getall implements OnInit {
  rates: RateResponseI[] = [];
  seasons: SeasonResponseI[] = [];
  roomTypes: RoomTypeResponseI[] = [];
  loading: boolean = true;

  constructor(
    private tarifaService: TarifaService,
    private seasonService: SeasonService,
    private roomTypeService: RoomTypeService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadRates();
    this.loadSeasons();
    this.loadRoomTypes();
  }

  loadRates(): void {
    this.loading = true;
    this.tarifaService.getAllByHotel().subscribe({
      next: (data) => {
        this.rates = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las tarifas' });
      }
    });
  }

  loadSeasons(): void {
    this.seasonService.getAllByHotel().subscribe({
      next: (data) => {
        this.seasons = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las temporadas' });
      }
    });
  }

  loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe({
      next: (data) => {
        this.roomTypes = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de habitación' });
      }
    });
  }

  getSeasonName(seasonId: number): string {
    const season = this.seasons.find(s => s.id === seasonId);
    return season ? season.name : 'Desconocida';
  }

  getRoomTypeName(roomTypeId: number): string {
    const roomType = this.roomTypes.find(r => r.id === roomTypeId);
    return roomType ? roomType.name : 'Desconocido';
  }

  createRate(): void {
    this.router.navigate(['/Tarifa/new']);
  }

  editRate(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/Tarifa/edit', id]);
  }

  confirmDelete(rate: RateResponseI): void {
    if (rate.id === undefined) return;
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la tarifa ${rate.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteRate(rate.id!);
      }
    });
  }

  deleteRate(id: number): void {
    this.tarifaService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarifa eliminada correctamente' });
        this.loadRates(); // Recargar la lista
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la tarifa' });
      }
    });
  }
}