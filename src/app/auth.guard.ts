import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // 👈 Hämta nuvarande plattforms-id (Server eller Browser)

  // 1. Om vi körs på Servern (SSR), låter vi den passera tillfälligt 
  // så att komponenten kan för-renderas i bakgrunden utan krasch.
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // 2. Nu vet vi säkert att vi är i Webbläsaren, så nu kan vi använda sessionStorage säkert!
  const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';

  if (isLoggedIn) {
    return true;
  }

  // Om vi är i webbläsaren och inte är inloggade, skicka till login
  console.warn('Ej inloggad användare blockerad från skyddad rutt.');
  router.navigate(['/login']);
  return false;
};
