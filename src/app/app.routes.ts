import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'page-a', pathMatch: 'full' },

  // ----- LES BASES -----
  {
    path: 'shoppingList',
    loadComponent: () => import('./pages/service-injection-demo/shopping-list/shopping-list').then((m) => m.ShoppingList)
  },
  {
    path: 'reactiveForm',
    loadComponent: () => import('./pages/form-demo/reactive-form-demo/reactive-form-demo').then((m) => m.ReactiveFormDemo)
  },
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
  },
  {
    path: 'restaurant',
    loadComponent: () => import('./pages/parent-enfant-demo/Parents/restaurant/restaurant').then((m) => m.Restaurant)
  },

  // ----- LES SIGNALS -----
  // une route parent SANS composant : elle sert juste à regrouper ses enfants sous /signals/...
  // pas besoin de <router-outlet /> en plus : les enfants s'affichent direct dans celui de app.html
  {
    path: 'signals',
    children: [
      // /signals tout court => on redirige vers le premier enfant
      { path: '', redirectTo: 'signal', pathMatch: 'full' },
      {
        path: 'signal', // => /signals/signal
        loadComponent: () => import('./pages/signals/signal-demo/signal-demo').then((m) => m.SignalDemo),
      },
      {
        path: 'computed', // => /signals/computed
        loadComponent: () => import('./pages/signals/computed-demo/computed-demo').then((m) => m.ComputedDemo)
      },
      {
        path: 'linked-signal', // => /signals/linked-signal
        loadComponent: () => import('./pages/signals/linked-signal-demo/linked-signal-demo').then((m) => m.LinkedSignalDemo)
      },
    ]
  },

  // ----- LES EXERCICES -----
  // même principe : tous les exos sont rangés sous /exo/...
  {
    path: 'exo',
    children: [
      { path: '', redirectTo: 'directive', pathMatch: 'full' },
      {
        path: 'directive', // => /exo/directive (liste de tâches avec @for / @if / @switch)
        loadComponent: () => import('./exercices/directive-exo/directive-bonus/directive-bonus').then((m) => m.DirectiveBonus)
      },
      {
        path: 'garage', // => /exo/garage (parent / enfant : input, output, model)
        loadComponent: () => import('./exercices/parent-enfant-exo/parents/garage/garage').then((m) => m.Garage)
      },
    ]
  },

  // toujours EN DERNIER : n'importe quelle URL inconnue => retour à l'accueil
  // (le routeur lit les routes de haut en bas et prend la PREMIÈRE qui correspond)
  { path: '**', redirectTo: 'page-a' },
];
