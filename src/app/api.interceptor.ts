import { HttpInterceptorFn, HttpErrorResponse, HttpClient, HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, filter, switchMap, throwError } from 'rxjs'; // 🌟 Glöm inte att importera 'filter' här
import { Router } from '@angular/router';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const backend = inject(HttpBackend);

  // Om detta är bakgrunds-förnyelsen och den har en absolut URL, skicka den rakt igenom
  if (req.url.includes('person/refreshtoken') && (req.url.startsWith('http://') || req.url.startsWith('https://'))) {
    const refreshWithCookieReq = req.clone({ withCredentials: true });
    return next(refreshWithCookieReq);
  }

  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  // Skapa bas-anropet med din globala API-url och HttpOnly-cookies
  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url.replace(/^\//, '')}`,
    withCredentials: true
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401 && !apiReq.url.includes('person/loginuser')) {
        
        console.warn('Access-token har gått ut (401). Försöker förnya via refreshtoken...');

        const refreshUrl = `${environment.apiUrl}person/refreshtoken`.replace(/([^:]\/)\/+/g, "$1");

        const refreshRequest = new HttpRequest('POST', refreshUrl, {}, { 
          withCredentials: true 
        });

        return backend.handle(refreshRequest).pipe(
          // 🌟 RÄTTNING: Filtrera så att vi BARA lyssnar på HttpResponse (när servern svarat klart)
          filter((event): event is HttpResponse<any> => event instanceof HttpResponse),
          switchMap(() => {
            console.log('Refresh lyckades och cookies är uppdaterade! Kör om ursprungligt anrop...');
            // Nu kör vi om det ursprungliga anropet, och det har garanterat tillgång till de nya cookisarna!
            return next(apiReq);
          }),
          catchError((refreshError) => {
            console.error('Både access-token och refresh-token har gått ut. Loggar ut användaren.');
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
