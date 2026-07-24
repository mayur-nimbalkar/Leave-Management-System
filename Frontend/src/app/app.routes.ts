import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { hodGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login-user/login-user').then((m) => m.LoginUser),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'my-leaves',
    canActivate: [authGuard],
    loadComponent: () => import('./features/my-leaves/my-leaves').then((m) => m.MyLeaves),
  },
  {
    path: 'apply-leave',
    canActivate: [authGuard],
    loadComponent: () => import('./features/apply-leave/apply-leave').then((m) => m.ApplyLeave),
  },
  {
    path: 'approve-leaves',
    canActivate: [authGuard, hodGuard],
    loadComponent: () =>
      import('./features/approve-leaves/approve-leaves').then((m) => m.ApproveLeaves),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
