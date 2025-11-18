import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutI } from '../models/Checkout';
import { AuthService } from './auth.service';

interface CheckoutApiResponse {
  checkouts: CheckoutI[];
}

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {
  private baseUrl = 'http://localhost:4000/api/Checkouts';
  private CheckOutSubject = new BehaviorSubject<CheckoutI[]>([]);
  public CheckOut$ = this.CheckOutSubject.asObservable();

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

  getAll(): Observable<CheckoutI[]> {
    return this.http.get<CheckoutApiResponse>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.checkouts),
        tap(CheckOut => {
          this.CheckOutSubject.next(CheckOut);
        }),
        catchError(error => {
          console.error('Error fetching Checkout:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<CheckoutI> {
    return this.http.get<CheckoutI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching Checkout with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  create(data: CheckoutI): Observable<CheckoutI> {
    return this.http.post<CheckoutI>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error('Error creating Checkout:', error);
          return throwError(() => error);
        })
      );
  }

  update(id: number, data: Partial<CheckoutI>): Observable<CheckoutI> {
    return this.http.patch<CheckoutI>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error updating Checkout with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error deleting Checkout with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  refresh(): void {
    this.getAll().subscribe();
  }

  updateLocalData(CheckOut: CheckoutI[]): void {
    this.CheckOutSubject.next(CheckOut);
  }
}
