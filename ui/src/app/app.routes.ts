import { Routes } from '@angular/router';
import {TimelineComponent} from './timeline/timeline.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component').then((c) => c.ChatComponent),
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline.component').then((c) => c.TimelineComponent),
  },
  {
    path: 'terminal',
    loadComponent: () => import('./terminal/terminal.component').then((c) => c.TerminalComponent),
    data: { mode: 'fullscreen' },
  },
  {path:'**',redirectTo:'/home'},
];
