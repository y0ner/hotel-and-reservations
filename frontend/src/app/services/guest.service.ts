// src/app/services/guest.service.ts
import { Injectable } from '@angular/core';
import { GuestI } from '../models/guest'; // Importamos el nuevo modelo
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

export class GuestService { // Renombramos la clase
private guestsService = new BehaviorSubject<GuestI[]>([ // Cambiamos el nombre y el tipo
    {
      id: 1,
      name: 'John Doe',
      documentNumber: '123456789',
      phone: '555-1234',
      email: 'john@example.com',
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Jane Smith',
      documentNumber: '987654321',
      phone: '555-5678',
      email: 'jane@example.com',
      status: 'INACTIVE'
    }
  ]);
  guests$ = this.guestsService.asObservable(); // Renombramos la variable

  getGuests() { // Renombramos el método
    return this.guestsService.value;
  }

  addGuest(guest: GuestI) { // Renombramos el método y el parámetro
    const guests = this.guestsService.value;
    guest.id = guests.length ? Math.max(...guests.map(g => g.id ?? 0)) + 1 : 1;
    this.guestsService.next([...guests, guest]);
  }
    deleteGuest(id: number) {
    let guests = this.guestsService.value;
    guests = guests.filter(g => g.id !== id);
    this.guestsService.next(guests);
  }
  getGuestById(id: number): GuestI | undefined {
    return this.guestsService.value.find(g => g.id === id);
  }

  updateGuest(updatedGuest: GuestI) {
    const guests = this.guestsService.value.map(g => 
      g.id === updatedGuest.id ? updatedGuest : g
    );
    this.guestsService.next(guests);
  }
}