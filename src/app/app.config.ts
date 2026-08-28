// app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router'; // 👈 Importeras som vanligt
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { apiInterceptor } from './api.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    
    // 🌟 RÄTTNING 1: Lägg till med Component Input Binding här i routern!
    provideRouter(routes, withComponentInputBinding()),
    
    // 🛠️ RÄTTNING 2: Rensa bort den extra provideRouter som låg inuti HttpClient
    provideHttpClient(
      withFetch(), // Optimizes SSR to use modern fetch architecture
      withInterceptors([apiInterceptor])
    )
  ]
};
