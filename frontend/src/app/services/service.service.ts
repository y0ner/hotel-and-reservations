// src/app/services/service.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceI } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private servicesSubject = new BehaviorSubject<ServiceI[]>([
    { id: 1, name: 'Lavandería', description: 'Servicio de lavado por prenda', price: 15000 },
    { id: 2, name: 'Bebida Minibar', description: 'Gaseosa o agua del minibar', price: 8000 },
    { id: 3, name: 'Tour a la Playa', description: 'Transporte y guía a la playa cercana', price: 50000 }
  ]);
  services$ = this.servicesSubject.asObservable();

  getServices() {
    return this.servicesSubject.value;
  }

  addService(service: ServiceI) {
    const services = this.getServices();
    service.id = services.length ? Math.max(...services.map(s => s.id ?? 0)) + 1 : 1;
    this.servicesSubject.next([...services, service]);
  }

  updateService(updatedService: ServiceI) {
    const services = this.getServices().map(s => 
      s.id === updatedService.id ? updatedService : s
    );
    this.servicesSubject.next(services);
  }

  deleteService(id: number) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    this.servicesSubject.next(services);
  }
  getServiceById(id: number): ServiceI | undefined {
        return this.getServices().find(s => s.id === id);
    }
}