import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Servicio para manejar el contexto del hotel actual en la aplicación.
 * Todos los servicios que filtren datos por hotel deben usar este servicio
 * para obtener el hotel_id actual del usuario autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class HotelContextService {

  constructor(private authService: AuthService) { }

  /**
   * Obtiene el ID del hotel actual del usuario autenticado
   */
  getCurrentHotelId(): number | null {
    return this.authService.getCurrentHotel();
  }

  /**
   * Observable del hotel actual
   */
  getCurrentHotel$(): Observable<number | null> {
    return this.authService.currentHotel$;
  }

  /**
   * Valida que exista un hotel activo
   */
  hasActiveHotel(): boolean {
    return this.getCurrentHotelId() !== null;
  }
}
