// src/app/app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config'; // <-- Importa desde 'primeng/config'
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // --- CORRECCIÓN AQUÍ ---
    // Deja el objeto de configuración vacío para un PrimeNG "sin estilo"
    providePrimeNG({}), 
    
    ConfirmationService,
    MessageService
  ]
};