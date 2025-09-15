// filepath: /home/jaider/app/dlloweb/2025iisem/html/frontend/src/app/components/layout/header/header.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TieredMenuModule, BadgeModule, InputTextModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{
  items: MenuItem[] | undefined;
     @Output() toggleAside = new EventEmitter<void>();


     ngOnInit() {
        this.items = [
            {
                label: 'Iniciar Sesion',
                icon: 'pi pi-user',
            },
            {
                label: 'Cerrar Sesion',
                icon: 'pi pi-sign-out',
            },
            {
                label: 'Perfil',
                icon: 'pi pi-cog',
            }
        ];
    }
}