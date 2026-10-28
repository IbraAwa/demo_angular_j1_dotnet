# Tuto pas à pas : le Routing

> Objectif : une appli avec un header, une sidebar de liens, un footer, et au milieu une zone qui change selon l'URL : Page A (avec une sous-page « détail »), Page B, etc.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `src/app/app.config.ts` ➜ on branche le routeur
- `src/app/app.routes.ts` ➜ le plan des routes
- `src/app/app.ts` et `app.html` ➜ la structure de l'appli + le `<router-outlet />`
- `src/app/components/header/`, `sidebar/`, `footer/` ➜ la structure fixe (la sidebar contient les liens)
- `src/app/pages/page-a/` ➜ la page A + son fichier de routes `page-a.routes.ts` + la sous-page `detail/`
- `src/app/pages/page-b/` ➜ la page B

Commandes pour générer les composants de structure et les pages :

```bash
ng generate component components/header
ng generate component components/sidebar
ng generate component components/footer
ng generate component pages/page-a
ng generate component pages/page-a/detail
ng generate component pages/page-b
```

---

## PARTIE 1 : brancher le routeur

### Étape 1 : `provideRouter` dans `app.config.ts`

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
```

**Pourquoi ?** Le routeur d'Angular, c'est un **service** qui surveille l'URL. Mais il ne démarre pas tout seul : il faut le **brancher** dans la config de l'appli.
- `provideRouter(...)` ➜ « Angular, active le routeur… »
- `(routes)` ➜ « …et voilà **le plan** à suivre » (le tableau qu'on écrit à l'étape suivante).
- `ApplicationConfig` et `provideBrowserGlobalErrorListeners` ➜ déjà générés par `ng new`, on n'y touche pas.

Sans cette ligne, l'appli **plante** : `<router-outlet />` et `routerLink` ont besoin du service routeur pour fonctionner. Angular ne le trouve pas et affiche une erreur dans la console (en gros : « je ne trouve pas le `Router` »).

---

### Étape 2 : le plan des routes `app.routes.ts`

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  ...
];
```

- `Routes` ➜ le type d'Angular pour « une liste de routes ». Grâce à lui, TypeScript vérifie qu'on écrit bien nos routes.
- `export` ➜ pour que `app.config.ts` puisse l'importer.
- Chaque objet `{ ... }` dans le tableau = **une route** = « telle URL ➜ tel composant ».

---

### Étape 3 : la redirection de départ ➜ `redirectTo`

```ts
{ path: '', redirectTo: 'page-a', pathMatch: 'full' },
```

**Pourquoi ?** Quand l'utilisateur arrive sur `http://localhost:4200/` (URL **vide**), on ne veut pas lui afficher une page blanche. On le **redirige** vers `page-a`.

- `path: ''` ➜ l'URL vide (rien après le `/`)
- `redirectTo: 'page-a'` ➜ « envoie-le vers `/page-a` »
- `pathMatch: 'full'` ➜ **obligatoire** quand on fait un `redirectTo` sur un path vide : « seulement si l'URL est **complètement** vide ». Sans ça, comme **toutes** les URLs commencent par « rien », Angular redirigerait tout le monde tout le temps 😅. D'ailleurs, si tu l'oublies, Angular refuse de démarrer et affiche une erreur dans la console.

---

### Étape 4 : une page en lazy loading ➜ `loadComponent`

```ts
{
  path: 'page-b',
  loadComponent: () =>
    import('./pages/page-b/page-b').then((m) => m.PageB),
},
```

**Pourquoi ?** On dit : « Quand l'URL est `/page-b`, affiche le composant `PageB`. »

**Mais pourquoi ce `loadComponent` compliqué au lieu de `component: PageB` ?** C'est le **lazy loading** (chargement paresseux 😴) :
- avec `component: PageB` ➜ le code de PageB est téléchargé **dès le démarrage** de l'appli, même si l'utilisateur n'y va jamais
- avec `loadComponent` ➜ le code de PageB est téléchargé **seulement quand** l'utilisateur va sur `/page-b`

Décortiquons :
- `() => ...` ➜ une fonction qu'Angular appellera **au moment** où on visite la page (pas avant !)
- `import('./pages/page-b/page-b')` ➜ un import **dynamique** : télécharge le fichier à ce moment-là
- `.then((m) => m.PageB)` ➜ une fois le fichier téléchargé (`m` = son contenu), on prend la classe `PageB` dedans

On fait **pareil** pour les autres pages : `bindings`, `pipes`, `directives`, `restaurant`.

👉 Remarque : l'URL et le nom du dossier ne sont **pas obligés** d'être pareils. `path: 'directives'` charge le composant `DirectiveDemo` du dossier `directive-demo`.

---

### Étape 5 : un groupe de routes en lazy loading ➜ `loadChildren`

```ts
{
  path: 'page-a',
  loadChildren: () =>
    import('./pages/page-a/page-a.routes').then((m) => m.PAGE_A_ROUTES),
},
```

**Pourquoi `loadChildren` et pas `loadComponent` ?** Parce que la page A n'est pas toute seule : elle a une **sous-page** `detail`. Au lieu de charger **un** composant, on charge **un fichier de routes** qui contient la page A **et** ses enfants.

- `import('./pages/page-a/page-a.routes')` ➜ on télécharge le fichier de routes de la page A
- `.then((m) => m.PAGE_A_ROUTES)` ➜ on prend le tableau de routes `PAGE_A_ROUTES` dedans

**Pourquoi un fichier de routes à part ?** Chaque « zone » de l'appli gère **ses propres routes**. Le `app.routes.ts` principal reste court et lisible, et tout ce qui concerne la page A est rangé dans **son** dossier.

---

## PARTIE 2 : les routes enfants de la page A

### Étape 6 : `page-a.routes.ts`

```ts
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
```

Ligne par ligne :
- `PAGE_A_ROUTES` en MAJUSCULES ➜ convention pour une constante. C'est **ce nom-là** qu'on récupère dans le `.then` de l'étape 5.
- `path: ''` ➜ **vide**, car le `page-a` est **déjà** dans l'URL grâce à `app.routes.ts`. Donc `''` ici = `/page-a`.
  Et ici **pas besoin** de `pathMatch: 'full'` : ce n'est pas une redirection (`redirectTo`), c'est juste « affiche `PageA` ». Le `pathMatch` n'est obligatoire qu'avec un `redirectTo` sur un path vide (étape 3).
- `component: PageA` ➜ ici on utilise `component` directement (pas `loadComponent`), car **tout ce fichier** est déjà chargé en lazy. Pas besoin de lazy dans le lazy.
- `children: [...]` ➜ les **sous-pages** de la page A.
- `{ path: 'detail', component: Detail }` ➜ `/page-a` + `/detail` = **`/page-a/detail`** affiche `Detail` **à l'intérieur** de `PageA`.

---

### Étape 7 : le trou pour l'enfant dans la page A

Dans `page-a.ts` :

```ts
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  ...
})
```

**Pourquoi ?** On va utiliser `<router-outlet />` dans le HTML de la page A. Ce n'est pas une balise HTML normale, c'est un **composant d'Angular**. Et comme tout composant, directive ou pipe utilisé dans le HTML (qu'il vienne d'Angular ou de nous), il faut l'**importer**.

Dans `page-a.html` :

```html
<h2>Page A</h2>
<router-outlet />
```

- `<h2>Page A</h2>` ➜ ça s'affiche **toujours** quand on est sur `/page-a` ou `/page-a/detail`.
- `<router-outlet />` ➜ le **trou** où la route **enfant** vient s'afficher.
  - sur `/page-a` ➜ pas d'enfant ➜ le trou reste vide
  - sur `/page-a/detail` ➜ le composant `Detail` s'affiche dans le trou ➜ « Détail de la page A »

C'est une **page dans une page** 🪆.

---

## PARTIE 3 : la structure de l'appli et la navigation

### Étape 8 : le trou principal dans `app.html`

D'abord, nos 3 composants de structure (générés au début) :

**Le header**, dans `header.ts` et `header.html` :

```ts
export class Header {
  title = 'Ma première application Angular';
}
```

```html
<header>
  <h1>{{ title }}</h1>
</header>
```

➜ Un titre affiché avec l'interpolation `{{ }}`.

**Le footer**, dans `footer.ts` :

```ts
@Component({
  selector: 'app-footer',
  imports: [],
  template: `<footer>© 2026 - Formation Angular</footer>`,
  styleUrl: './footer.scss',
})
export class Footer {}
```

➜ Remarque : ici on écrit le HTML **directement dans le TS** avec `template:` (et des backticks `` ` ``) au lieu de `templateUrl:`. C'est pratique pour un tout petit HTML d'une ligne : tu peux supprimer le fichier `footer.html`.

**La sidebar** ➜ elle contient les liens, on la remplit à l'étape 9.

Ensuite, dans `app.ts` :

```ts
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  ...
})
```

On importe `RouterOutlet` pour le trou, et nos 3 composants de structure.

Dans `app.html` :

```html
<app-header />
<div class="layout">
  <app-sidebar />
  <main>
    <router-outlet />
  </main>
</div>
<app-footer />
```

**Pourquoi cette structure ?**
- `<app-header />`, `<app-sidebar />`, `<app-footer />` ➜ **en dehors** du `<router-outlet />` ➜ ils restent **toujours** affichés, peu importe la page.
- `<router-outlet />` dans `<main>` ➜ le **trou principal** : c'est là qu'Angular met la page qui correspond à l'URL (`PageA`, `PageB`, `Bindings`…).

On a donc **2 niveaux de trous** : celui de `app.html` (la page) et celui de `page-a.html` (la sous-page).

---

### Étape 9 : les liens ➜ `routerLink`

Dans `sidebar.ts` :

```ts
import { RouterLink } from '@angular/router';

imports: [RouterLink],
```

**Pourquoi ?** `routerLink` est une **directive** d'Angular. Comme toute directive, on doit l'**importer** pour pouvoir l'utiliser dans le HTML.

Dans `sidebar.html` :

```html
<nav>
  <a routerLink="/page-a">Page A</a>
  <a routerLink="/page-a/detail">Page A - détail</a>
  <a routerLink="/page-b">Page B</a>
  ...
</nav>
```

**Pourquoi `routerLink` et pas `href` ?**
- `href="/page-a"` ➜ le navigateur **recharge toute l'appli** depuis zéro (tout clignote, on perd l'état)
- `routerLink="/page-a"` ➜ Angular **intercepte** le clic, change l'URL et remplace juste ce qu'il y a dans le `<router-outlet />`. Instantané ⚡

Le `/` au début ➜ chemin **absolu** : « depuis la racine de l'appli ».

### 💡 Bonus : regrouper des routes + montrer la page active

Quand l'appli grossit, on **range** les routes par thème. Dans `app.routes.ts`, les signals et les exercices sont regroupés :

```ts
{
  path: 'signals',
  children: [
    { path: '', redirectTo: 'signal', pathMatch: 'full' },
    { path: 'signal', loadComponent: () => import('./pages/signals/signal-demo/signal-demo').then((m) => m.SignalDemo) },
    { path: 'computed', loadComponent: () => import('./pages/signals/computed-demo/computed-demo').then((m) => m.ComputedDemo) },
    { path: 'linked-signal', loadComponent: () => import('./pages/signals/linked-signal-demo/linked-signal-demo').then((m) => m.LinkedSignalDemo) },
  ]
},
```

- Une route parent **sans composant** ➜ elle sert juste à mettre un **préfixe** dans l'URL : `/signals/signal`, `/signals/computed`…
- Pas de composant parent ➜ pas besoin d'un 2e `<router-outlet />` : les enfants s'affichent **directement** dans celui de `app.html`. (Différence avec la page A : là, `PageA` **est** un composant, donc il lui faut **son** trou pour afficher `Detail`.)
- `{ path: '', redirectTo: 'signal', ... }` ➜ si on tape juste `/signals`, on part sur le premier enfant.
- Même principe pour les exercices : `/exo/directive` et `/exo/garage`.

Et tout en bas, la route « attrape-tout » :

```ts
{ path: '**', redirectTo: 'page-a' }
```

`**` = **n'importe quelle URL**. Le routeur lit les routes **de haut en bas** et prend la **première** qui correspond : cette ligne doit donc être **la dernière**, sinon elle attraperait tout.

Dans la sidebar, on ajoute `RouterLinkActive` dans `imports` pour **surligner** la page en cours :

```html
<a routerLink="/page-a" routerLinkActive="actif" [routerLinkActiveOptions]="{ exact: true }">Page A</a>
<a routerLink="/signals/computed" routerLinkActive="actif">computed()</a>
```

- `routerLinkActive="actif"` ➜ Angular ajoute la classe CSS `actif` au lien quand on est sur sa page (le style est dans `sidebar.scss`).
- `{ exact: true }` ➜ sans ça, « Page A » resterait **aussi** surligné sur `/page-a/detail`, car l'URL commence pareil.

---

## PARTIE 4 : le cycle de vie (`ngOnInit` / `ngOnDestroy`)

### Étape 10 : la naissance et la mort d'une page

Dans `page-a.ts` (et pareil dans `page-b.ts`) :

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';

export class PageA implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('Page A : ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Page A : ngOnDestroy');
  }
}
```

- `implements OnInit, OnDestroy` ➜ un **contrat** : on promet à Angular d'avoir les méthodes `ngOnInit` et `ngOnDestroy`. Si on fait une faute de frappe dans le nom, TypeScript nous prévient.
- `ngOnInit()` ➜ Angular l'appelle **automatiquement** quand le composant **naît** (= quand on arrive sur la page). C'est **le** bon endroit pour, plus tard, charger des données depuis une API.
- `ngOnDestroy()` ➜ Angular l'appelle **automatiquement** quand le composant **meurt** (= quand on quitte la page). C'est le bon endroit pour **faire le ménage** (arrêter un timer, se désabonner…).
- `: void` ➜ ces méthodes ne retournent rien.

### Ce qu'on observe dans la console

1. On clique sur « Page A » ➜ `Page A : ngOnInit`
2. On clique sur « Page B » ➜ `Page A : ngOnDestroy` puis `Page B : ngOnInit`
3. On revient sur « Page A » ➜ `Page B : ngOnDestroy` puis `Page A : ngOnInit`… **encore** !

👉 **Conclusion : à chaque changement de page, l'ancien composant est détruit et le nouveau est recréé de zéro.** Les variables d'une page ne sont donc **pas** gardées quand on la quitte.

💡 Et entre `/page-a` et `/page-a/detail` ? Pas de `ngOnDestroy` de la page A ! Elle reste en vie, seul l'enfant dans son `<router-outlet />` change.

---

## Récap

| Je veux… | J'écris… |
|---|---|
| activer le routeur | `provideRouter(routes)` dans `app.config.ts` |
| URL ➜ composant | `{ path: 'xxx', component: Xxx }` |
| charger une page seulement quand on y va | `loadComponent: () => import('...').then(m => m.Xxx)` |
| charger un groupe de routes en lazy | `loadChildren: () => import('...routes').then(m => m.XXX_ROUTES)` |
| des sous-pages | `children: [ { path: 'detail', component: Detail } ]` |
| rediriger l'URL vide | `{ path: '', redirectTo: 'xxx', pathMatch: 'full' }` |
| l'endroit où la page s'affiche | `<router-outlet />` + `RouterOutlet` dans `imports` |
| un lien sans recharger | `<a routerLink="/xxx">` + `RouterLink` dans `imports` |
| regrouper des routes sous un préfixe | `{ path: 'xxx', children: [...] }` (sans composant) |
| attraper les URLs inconnues | `{ path: '**', redirectTo: 'xxx' }` **en dernier** |
| surligner le lien de la page en cours | `routerLinkActive="actif"` + `RouterLinkActive` dans `imports` |
| du code quand la page s'ouvre / se ferme | `ngOnInit()` / `ngOnDestroy()` |

➡️ La version courte est dans [SYNTHESE.md](SYNTHESE.md)
