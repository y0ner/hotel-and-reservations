import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CheckInService } from '../../../services/Checkin.service';
import { CheckinI } from '../../../models/Checkin';

@Component({
  selector: 'app-checkin-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class GetAllComponent implements OnInit, OnDestroy {
  checkins: CheckinI[] = [];
  loading: boolean = false;
  private subscription = new Subscription();

  constructor(
    private checkinService: CheckInService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.subscription.add(
      this.checkinService.getAll().subscribe({
        next: (data: any) => {
          this.checkins = data;
          this.checkinService.updateLocalData(data);
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

  confirmDelete(item: CheckinI): void {
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
      this.checkinService.delete(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro eliminado correctamente'
          });
          this.loadData();
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
