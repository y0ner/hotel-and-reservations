import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { RateI, RateResponseI } from '../models/Rate';
import { AuthService } from './auth.service';
import { HotelContextService } from './hotel-context.service';

// Interfaz para la respuesta del backend (espera un objeto con una propiedad que es el array)
interface RateApiResponse {
  rates: RateResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private baseUrl = 'http://localhost:4000/api/Rates';
  private RateSubject = new BehaviorSubject<RateResponseI[]>([]);
  public Rate$ = this.RateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private hotelContextService: HotelContextService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAll(): Observable<RateResponseI[]> {
    return this.http.get<RateResponseI[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe( // Extraer el array de la propiedad
        tap(Rate => {
          this.RateSubject.next(Rate);
        }),
        catchError(error => {
          console.error('Error fetching Rate:', error);
          return throwError(() => error);
        })
      );
  }

  getAllByHotel(hotelId?: number): Observable<RateResponseI[]> {
    const hotel = hotelId || this.hotelContextService.getCurrentHotelId();
    if (!hotel) {
      return throwError(() => new Error('No hotel selected'));
    }
    return this.http.get<RateResponseI[]>(`${this.baseUrl}/hotel/${hotel}`, { headers: this.getHeaders() })
      .pipe(
        tap(Rate => {
          this.RateSubject.next(Rate);
        }),
        catchError(error => {
          console.error('Error fetching Rate by hotel:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<RateResponseI> {
    return this.http.get<RateResponseI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`Error fetching Rate with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  create(data: RateI): Observable<RateResponseI> {
    return this.http.post<RateResponseI>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error('Error creating Rate:', error);
          return throwError(() => error);
        })
      );
  }

  update(id: number, data: Partial<RateI>): Observable<RateResponseI> {
    return this.http.patch<RateResponseI>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error updating Rate with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error deleting Rate with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  deleteLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(error => {
          console.error(`Error logic-deleting Rate with id ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  refresh(): void {
    this.getAllByHotel().subscribe();
  }

  updateLocalData(Rate: RateResponseI[]): void {
    this.RateSubject.next(Rate);
  }

  /**
   * Encontrar tarifa automáticamente basada en temporada y tipo de habitación
   * @param roomTypeId - ID del tipo de habitación
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @param seasonId - (Opcional) ID de la temporada específica
   * @returns Observable con la tarifa encontrada o null
   */
  findRateBySeasonAndRoomType(
    roomTypeId: number,
    startDate: Date,
    endDate: Date,
    seasonId?: number
  ): Observable<RateResponseI | null> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.getAllByHotel().pipe(
      map(rates => {
        // Si se especifica una temporada, buscar tarifa para esa temporada
        if (seasonId) {
          const rate = rates.find(
            r => r.season_id === seasonId && r.roomtype_id === roomTypeId
          );
          return rate || null;
        }

        // Si no, buscar tarifa que se alinee con el período
        // Priorizar tarifas cuya temporada contenga el período
        const rate = rates.find(
          r => r.roomtype_id === roomTypeId
        );
        
        return rate || null;
      }),
      catchError(error => {
        console.error('Error finding rate by season and room type:', error);
        return throwError(() => error);
      })
    );
  }
}
