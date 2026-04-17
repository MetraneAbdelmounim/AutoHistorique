import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'pricing',
    loadChildren: () => import('./features/pricing/pricing.routes').then(m => m.PRICING_ROUTES)
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES)
  },
  {
    path: 'report',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/report/report.routes').then(m => m.REPORT_ROUTES)
  },
  { path: '**', redirectTo: '/dashboard' }
];
