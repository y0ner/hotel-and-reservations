import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeasonI, SeasonResponseI } from '../models/Season';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private baseUrl = 'http://localhost:4000/api/Seasons'; // Corregido: plural
  private SeasonSubject = new BehaviorSubject<SeasonResponseI[]>([]);
  public Season$ = this.SeasonSubject.asObservable();

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

  getAll(): Observable<SeasonResponseI[]> {
    return this.http.get<SeasonResponseI[]>(this.baseUrl, { headers: this.getHeaders() }) // Corregido: no se necesita SeasonApiResponse
      .pipe(
        tap(Season => {
          this.SeasonSubject.next(Season);
        }),
        catchError(error => {
          console.error('Error fetching Season:', error);
          return throwError(() => error);
        })
      );
  }

  getAllByHotel(hotelId?: number): Observable<SeasonResponseI[]> {
    const hotel = hotelId || this.authService.getCurrentHotel();
    if (!hotel) {
      return throwError(() => new Error('No hotel selected'));
    }
    return this.http.get<SeasonResponseI[]>(`${this.baseUrl}/hotel/${hotel}`, { headers: this.getHeaders() })
      .pipe(
        tap(Season => this.SeasonSubject.next(Season)),
        catchError(error => {
          console.error('Error fetching Season by hotel:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<SeasonResponseI> {
    return this.http.get<SeasonResponseI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching Season with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  create(data: SeasonI): Observable<SeasonResponseI> {
    return this.http.post<SeasonResponseI>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error('Error creating Season:', error);
          return throwError(() => error);
        })
      );
  }

  update(id: number, data: Partial<SeasonI>): Observable<SeasonResponseI> {
    return this.http.patch<SeasonResponseI>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error updating Season with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.deleteLogic(id); // Corregido: usar borrado lógico
  }

  deleteLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error logic-deleting Season with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  refresh(): void {
    this.getAll().subscribe();
  }

  updateLocalData(Season: SeasonResponseI[]): void {
    this.SeasonSubject.next(Season);
  }

  /**
   * Encontrar temporada que contenga las fechas especificadas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Observable con la temporada encontrada o null
   */
  findSeasonByDateRange(startDate: Date, endDate: Date): Observable<SeasonResponseI | null> {
    const hotelId = this.authService.getCurrentHotel();
    
    if (!hotelId) {
      return throwError(() => new Error('No hotel selected'));
    }

    const params = {
      startDate: startDate instanceof Date ? startDate.toISOString() : new Date(startDate).toISOString(),
      endDate: endDate instanceof Date ? endDate.toISOString() : new Date(endDate).toISOString(),
      hotelId: hotelId.toString()
    };

    return this.http.get<SeasonResponseI | null>(`${this.baseUrl}/find/byDateRange`, { 
      headers: this.getHeaders(),
      params 
    }).pipe(
      catchError(error => {
        // Si no hay temporada para esas fechas, devolver null en lugar de error
        if (error.status === 404) {
          return new Observable<SeasonResponseI | null>(observer => {
            observer.next(null);
            observer.complete();
          });
        }
        console.error('Error finding season by date range:', error);
        return throwError(() => error);
      })
    );
  }
}
