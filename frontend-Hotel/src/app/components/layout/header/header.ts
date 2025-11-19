import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { OverlayBadge } from 'primeng/overlaybadge';
import { TieredMenu } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserI, HotelDataI } from '../../../models/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayBadge, TieredMenu],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  isLoggedIn = false;
  currentUser: UserI | null = null;
  currentHotel: HotelDataI | null = null;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.updateMenuItems();
    });

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.Hotel) {
        this.currentHotel = user.Hotel;
      }
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.Hotel) {
      this.currentHotel = this.currentUser.Hotel;
    }
    this.updateMenuItems();
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  private updateMenuItems(): void {
    if (this.isLoggedIn) {
      this.items = [
        { label: 'Configuración', icon: 'pi pi-cog' },
        { label: 'Información', icon: 'pi pi-info-circle' },
        { separator: true },
        { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    } else {
      this.items = [
        { label: 'Iniciar sesión', icon: 'pi pi-sign-in', command: () => this.router.navigate(['/login']) },
        { label: 'Registrarse', icon: 'pi pi-user-plus', command: () => this.router.navigate(['/register']) }
      ];
    }
  }

  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
