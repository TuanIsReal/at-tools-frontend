import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CheckTaxNumberComponent } from './pages/check-tax-number/check-tax-number.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'check-tax-number', component: CheckTaxNumberComponent },
  { path: '**', redirectTo: '' }
];

