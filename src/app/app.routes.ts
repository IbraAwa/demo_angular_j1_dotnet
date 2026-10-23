import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'page-a', pathMatch: 'full' },
  {
    path: 'page-a',
    loadChildren: () =>
      import('./pages/page-a/page-a.routes').then((m) => m.PAGE_A_ROUTES),
  },
  {
    path: 'page-b',
    loadComponent: () =>
      import('./pages/page-b/page-b').then((m) => m.PageB),
  },
  {
    path: 'bindings',
    loadComponent: () =>
      import('./pages/bindings/bindings').then((m) => m.Bindings),
  },
  {
    path: 'pipes',
    loadComponent: () =>
      import('./pages/pipes/pipes').then((m) => m.Pipes),
  },
  {
    path: 'directives',
    loadComponent: () => import('./pages/directive-demo/directive-demo').then((m) => m.DirectiveDemo)
  }
];
