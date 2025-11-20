import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReservationServiceI } from '../models/ReservationService';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceService {
  private baseUrl = 'http://localhost:4000/api/reservations';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getServicesByReservation(reservationId: number): Observable<ReservationServiceI[]> {
    return this.http.get<ReservationServiceI[]>(`${this.baseUrl}/${reservationId}/services`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching services for reservation ${reservationId}:`, error);
          return throwError(() => error);
        })
      );
  }

  addServiceToReservation(reservationId: number, service_id: number, quantity: number): Observable<ReservationServiceI> {
    const body = { service_id, quantity };
    return this.http.post<ReservationServiceI>(`${this.baseUrl}/${reservationId}/services`, body, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error adding service to reservation ${reservationId}:`, error);
          return throwError(() => error);
        })
      );
  }

  removeServiceFromReservation(reservationId: number, reservationServiceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reservationId}/services/${reservationServiceId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error deleting service ${reservationServiceId} from reservation ${reservationId}:`, error);
          return throwError(() => error);
        })
      );
  }

  getAll(): Observable<ReservationServiceI[]> {
    return this.http.get<ReservationServiceI[]>('http://localhost:4000/api/reservationservices', { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error fetching all reservation services:', error);
          return throwError(() => error);
        })
      );
  }

  create(reservationService: ReservationServiceI): Observable<ReservationServiceI> {
    return this.http.post<ReservationServiceI>('http://localhost:4000/api/reservationservices', reservationService, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error creating reservation service:', error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:4000/api/reservationservices/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error deleting reservation service ${id}:`, error);
          return throwError(() => error);
        })
      );
  }
}
