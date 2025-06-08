import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component').then((c) => c.ChatComponent),
  },
  {path:'**',redirectTo:'/home'},
];
