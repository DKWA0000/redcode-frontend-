import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard] 
  },
    { 
    path: 'add-book', 
    loadComponent: () => import('./pages/add-book/add-book').then(m => m.AddBook),
    canActivate: [authGuard]
  },
  { 
    path: 'edit-book/:id', 
    loadComponent: () => import('./pages/edit-book/edit-book').then(m => m.EditBook),
    canActivate: [authGuard]
  },
    { 
    path: 'books/:id/quotes', 
    loadComponent: () => import('./pages/show-quotes/show-quotes').then(m => m.ShowQuotes),
    canActivate: [authGuard]
  },
    { 
    path: 'books/:bookId/add-quote', 
    loadComponent: () => import('./pages/add-quote/add-quote').then(m => m.AddQuote),
    canActivate: [authGuard]
  },
  { 
    path: 'books/:id/edit-quote/:quoteId', 
    loadComponent: () => import('./pages/edit-quote/edit-quote').then(m => m.EditQuote),
    canActivate: [authGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/create-user/create-user').then(m => m.CreateUser)
  }
];
