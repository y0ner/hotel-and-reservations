// src/app/components/service/getall/getall.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ServiceI } from '../../../models/service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-getall-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule],
  templateUrl: './getall.html',
})
export class GetallComponent {
  services: ServiceI[] = [];

  constructor(
    private serviceService: ServiceService,
    private confirmationService: ConfirmationService
  ) {
    this.serviceService.services$.subscribe(data => this.services = data);
  }

  confirmDelete(id: number | undefined) {
    if (id === undefined) return;
    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar este servicio?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.serviceService.deleteService(id);
        }
    });
  }
}