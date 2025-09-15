// src/app/components/guest/getall.ts

import { Component, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { GuestI } from '../../../models/guest'; // Importamos GuestI
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { GuestService } from '../../../services/guest.service'; // Importamos GuestService
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-getall-guests', // Cambiamos el selector
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, TagModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None
})
export class Getall {
 guests: GuestI[] = [];

  constructor(
    private guestService: GuestService,
    private confirmationService: ConfirmationService // Inyéctalo aquí
  ) {
    this.guestService.guests$.subscribe(guests => {
      this.guests = guests;
    });
  }

  // Crea el método para eliminar
  confirmDelete(id: number | undefined) {
    if (id === undefined) return;

    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar este huésped?',
        header: 'Confirmación de Eliminación',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.guestService.deleteGuest(id);
        }
    });
  }
}