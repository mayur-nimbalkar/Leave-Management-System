import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'register', loadComponent: () => import('./register/register').then((m) => m.Register) },
  { path: 'login', loadComponent: () => import('./login-user/login-user').then((m) => m.LoginUser) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
