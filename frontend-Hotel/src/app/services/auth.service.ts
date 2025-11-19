import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { LoginI, LoginResponseI, RegisterI, RegisterResponseI, UserI } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private currentHotelKey = 'current_hotel';
  
  private authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public authState$ = this.authStateSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<UserI | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private currentHotelSubject = new BehaviorSubject<number | null>(this.getStoredHotel());
  public currentHotel$ = this.currentHotelSubject.asObservable();

  constructor(private http: HttpClient) {
    // Inicializar hotel desde el usuario si está disponible
    const user = this.getStoredUser();
    if (user && user.hotel_id) {
      this.currentHotelSubject.next(user.hotel_id);
    }
  }

  login(credentials: LoginI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token && response.user) {
            this.setToken(response.token);
            this.setCurrentUser(response.user);
            this.setCurrentHotel(response.user.hotel_id);
            this.authStateSubject.next(true);
          }
        })
      );
  }

  register(userData: RegisterI): Observable<RegisterResponseI> {
    return this.http.post<RegisterResponseI>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token && response.user) {
            this.setToken(response.token);
            this.setCurrentUser(response.user);
            this.setCurrentHotel(response.user.hotel_id);
            this.authStateSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.currentHotelKey);
    this.authStateSubject.next(false);
    this.currentUserSubject.next(null);
    this.currentHotelSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getCurrentUser(): UserI | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: UserI): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): UserI | null {
    const storedUser = localStorage.getItem(this.userKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  getCurrentHotel(): number | null {
    return this.currentHotelSubject.value;
  }

  setCurrentHotel(hotelId: number): void {
    localStorage.setItem(this.currentHotelKey, hotelId.toString());
    this.currentHotelSubject.next(hotelId);
  }

  private getStoredHotel(): number | null {
    const storedHotel = localStorage.getItem(this.currentHotelKey);
    return storedHotel ? parseInt(storedHotel, 10) : null;
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
