import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'Telemama - Continuous Maternal & Newborn Care'
  },
  {
    path: 'mother',
    loadComponent: () => import('./features/mother/mother-dashboard.component').then(m => m.MotherDashboard),
    title: 'Mother Care & Emergency SOS - Telemama'
  },
  {
    path: 'mother/enrol',
    loadComponent: () => import('./features/mother/mother-enrolment.component').then(m => m.MotherEnrolmentComponent),
    title: 'Enrol New Mother - Telemama'
  },
  {
    path: 'family',
    loadComponent: () => import('./features/family/family-dashboard.component').then(m => m.FamilyDashboard),
    title: 'Family & Support Person Portal - Telemama'
  },
  {
    path: 'health-worker',
    loadComponent: () => import('./features/health-worker/health-worker-dashboard.component').then(m => m.HealthWorkerDashboard),
    title: 'PHC Clinical Dashboard - Telemama'
  },
  {
    path: 'ussd',
    loadComponent: () => import('./features/ussd/ussd-simulator.component').then(m => m.UssdSimulator),
    title: 'USSD Feature Phone Simulator (*384*26#) - Telemama'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
