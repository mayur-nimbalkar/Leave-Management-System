import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'register', loadComponent: () => import('./features/register/register').then((m) => m.Register) },
  { path: 'login', loadComponent: () => import('./features/login-user/login-user').then((m) => m.LoginUser) },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'apply-leave',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/apply-leave/apply-leave').then((m) => m.ApplyLeave),
  },
  {
    path: 'my-leaves',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/my-leaves/my-leaves').then((m) => m.MyLeaves),
  },
  {
    path: 'approve-leaves',
    canActivate: [AuthGuard, RoleGuard],
    loadComponent: () => import('./features/approve-leaves/approve-leaves').then((m) => m.ApproveLeaves),
  },
  {
    path: 'employees',
    canActivate: [AuthGuard, RoleGuard],
    loadComponent: () => import('./features/employee-management/employee-management').then((m) => m.EmployeeManagement),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
