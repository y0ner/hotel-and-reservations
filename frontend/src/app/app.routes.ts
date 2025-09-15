// src/app/app.routes.ts

import { Routes } from '@angular/router';
// Huéspedes
import { Getall as GetAllGuests } from './components/guest/getall/getall';
import { Create as CreateGuest } from './components/guest/create/create';
import { Update as UpdateGuest } from './components/guest/update/update';
// Habitaciones
import { GetallRoomsComponent } from './components/room/getall/getall';
import { CreateRoomComponent } from './components/room/create/create';
import { UpdateRoomComponent } from './components/room/update/update'; // <-- ASEGÚRATE DE QUE ESTA LÍNEA EXISTA Y SEA CORRECTA

import { GetallComponent as GetAllBookings } from './components/booking/getall/getall';
import { CreateComponent as CreateBooking } from './components/booking/create/create';

import { UpdateComponent as UpdateBooking } from './components/booking/update/update'; // <-- AÑADE ESTA LÍNEA
import { GetallComponent as GetAllBilling } from './components/billing/getall/getall';

import { InvoiceComponent } from './components/billing/invoice/invoice';

import { GetallComponent as GetAllServices } from './components/service/getall/getall';

import { CreateComponent as CreateService } from './components/service/create/create'; // <-- AÑADE ESTA LÍNEA
import { UpdateComponent as UpdateService } from './components/service/update/update'; // <-- AÑADE ESTA LÍNEA

import { GetallComponent as GetAllReports } from './components/report/getall/getall';

import { FormComponent as SettingsForm } from './components/settings/form/form';

import { DashboardComponent } from './components/dashboard/dashboard';


export const routes: Routes = [
    { path: '', redirectTo: 'guests', pathMatch: 'full' },
    { path: "guests", component: GetAllGuests },
    { path: "guests/new", component: CreateGuest },
    { path: "guests/edit/:id", component: UpdateGuest },
    { path: "rooms", component: GetallRoomsComponent },
    { path: "rooms/new", component: CreateRoomComponent },
    { path: "rooms/edit/:id", component: UpdateRoomComponent }, 
     { path: "bookings", component: GetAllBookings },
    { path: "bookings/new", component: CreateBooking },
    { path: "bookings/edit/:id", component: UpdateBooking },
    { path: "billing", component: GetAllBilling },
    { path: "billing/invoice/:id", component: InvoiceComponent },
    { path: "services", component: GetAllServices },
    { path: "services/new", component: CreateService },     // <-- AÑADE ESTA LÍNEA
    { path: "services/edit/:id", component: UpdateService },
    { path: "services/edit/:id", component: UpdateService },
    { path: "reports", component: GetAllReports },
    { path: "settings", component: SettingsForm },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // <-- MODIFICA ESTA LÍNEA
    { path: 'dashboard', component: DashboardComponent }, 
];