import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface AsideItem {
    label: string;
    icon: string;
    routerLink: string;
}

@Component({
    selector: 'app-aside',
    standalone: true,
    imports: [CommonModule, PanelMenuModule, RouterModule],
    templateUrl: './aside.html',
    styleUrl: './aside.css'
})
export class Aside implements OnInit {
    items: AsideItem[] = [];
    
    ngOnInit() {
        this.items = [
            {
                label: 'Hotel',
                icon: 'pi-building',
                routerLink: '/Hotel'
            },
            {
                label: 'TipoHabitacion',
                icon: 'pi-tag',
                routerLink: '/TipoHabitacion'
            },
            {
                label: 'Habitacion',
                icon: 'pi-home',
                routerLink: '/Habitacion'
            },
            {
                label: 'Temporada',
                icon: 'pi-calendar',
                routerLink: '/Temporada'
            },
            {
                label: 'Tarifa',
                icon: 'pi-dollar',
                routerLink: '/Tarifa'
            },
            {
                label: 'Cliente',
                icon: 'pi-user',
                routerLink: '/Cliente'
            },
            {
                label: 'Servicio',
                icon: 'pi-star',
                routerLink: '/Servicio'
            },
            {
                label: 'Reserva',
                icon: 'pi-book',
                routerLink: '/Reserva'
            },
            {
                label: 'Pago',
                icon: 'pi-credit-card',
                routerLink: '/Pago'
            }
        ];
    }

    getIconClass(icon: string): string {
        return `pi-fw ${icon}`;
    }
}
