import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { ReservationServiceI, ReservationServiceResponseI } from '../models/ReservationService';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceService {
  private baseUrl = 'http://localhost:4000/api/ReservationServices';
  private reservationServiceSubject = new BehaviorSubject<ReservationServiceResponseI[]>([]);
  public reservationServices$ = this.reservationServiceSubject.asObservable();

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

  getAll(): Observable<ReservationServiceResponseI[]> {
    return this.http.get<ReservationServiceResponseI[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        tap(data => {
          this.reservationServiceSubject.next(data);
        }),
        catchError(error => {
          console.error('Error fetching ReservationServices:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<ReservationServiceResponseI> {
    return this.http.get<ReservationServiceResponseI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching ReservationService with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  create(data: ReservationServiceI): Observable<ReservationServiceResponseI> {
    return this.http.post<ReservationServiceResponseI>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error('Error creating ReservationService:', error);
          return throwError(() => error);
        })
      );
  }

  update(id: number, data: Partial<ReservationServiceI>): Observable<ReservationServiceResponseI> {
    return this.http.patch<ReservationServiceResponseI>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error updating ReservationService with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error deleting ReservationService with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  refresh(): void {
    this.getAll().subscribe();
  }
}
