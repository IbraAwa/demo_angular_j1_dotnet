import { Routes } from '@angular/router';
import { PageA } from './page-a';
import { Detail } from './detail/detail';

export const PAGE_A_ROUTES: Routes = [
  {
    path: '',
    component: PageA,
    children: [
      { path: 'detail', component: Detail },
    ],
  },
];
