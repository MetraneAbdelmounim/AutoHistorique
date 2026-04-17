import { Routes } from '@angular/router';

export const PRICING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pricing.component').then(m => m.PricingComponent)
  }
];
