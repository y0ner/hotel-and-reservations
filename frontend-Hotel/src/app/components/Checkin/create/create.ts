import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { CheckInService } from '../../../services/Checkin.service';
import { ReservationService } from '../../../services/Reservation.service';
import { ReservationResponseI } from '../../../models/Reservation';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkin-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TextareaModule
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create implements OnInit {
  loading = false;
  reservation: ReservationResponseI | null = null;
  reservationId: number | null = null;
  observation: string = '';

  constructor(
    private checkinService: CheckInService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reservationId) {
      this.loadReservationData(this.reservationId);
    }
  }

  loadReservationData(id: number): void {
    this.loading = true;
    this.reservationService.getById(id).subscribe({
      next: (data) => {
        this.reservation = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la reserva' });
      }
    });
  }

  confirmCheckin(): void {
    if (!this.reservationId) return;

    this.loading = true;
    const checkinData = {
      reservation_id: this.reservationId,
      time: new Date(),
      observation: this.observation
    };

    this.checkinService.create(checkinData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Check-in realizado correctamente' });
        setTimeout(() => this.router.navigate(['/Reserva']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el check-in' });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/Reserva']);
  }
}
