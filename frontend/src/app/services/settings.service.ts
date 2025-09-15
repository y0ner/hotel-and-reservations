// src/app/services/settings.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsI } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<SettingsI>({
    hotelName: 'Hotel Uniguajira',
    address: 'Calle 1 #2-3, Riohacha, La Guajira',
    phone: '300 123 4567',
    taxId: '900.123.456-7'
  });
  settings$ = this.settingsSubject.asObservable();

  getSettings() {
    return this.settingsSubject.value;
  }

  updateSettings(newSettings: SettingsI) {
    this.settingsSubject.next(newSettings);
  }
}