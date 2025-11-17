import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckinI } from '../models/Checkin';
import { AuthService } from './auth.service';

interface CheckinApiResponse {
  checkins: CheckinI[];
}

@Injectable({
  providedIn: 'root'
})

export class CheckInService {
  private baseUrl = 'http://localhost:4000/api/Checkin';
  private CheckInSubject = new BehaviorSubject<CheckinI[]>([]);
  public CheckIn$ = this.CheckInSubject.asObservable();

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

  getAll(): Observable<CheckinI[]> {
    return this.http.get<CheckinApiResponse>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.checkins),
        tap(CheckIn => {
          this.CheckInSubject.next(CheckIn);
        }),
        catchError(error => {
          console.error('Error fetching Checkin:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<CheckinI> {
    return this.http.get<CheckinI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching Checkin with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  create(data: CheckinI): Observable<CheckinI> {
    return this.http.post<CheckinI>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error('Error creating Checkin:', error);
          return throwError(() => error);
        })
      );
  }

  update(id: number, data: Partial<CheckinI>): Observable<CheckinI> {
    return this.http.patch<CheckinI>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error updating Checkin with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error deleting Checkin with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  refresh(): void {
    this.getAll().subscribe();
  }

  updateLocalData(CheckIn: CheckinI[]): void {
    this.CheckInSubject.next(CheckIn);
  }
}
