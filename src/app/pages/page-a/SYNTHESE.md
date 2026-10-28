# Synthèse : le Routing (routes, lazy loading, routes enfants, cycle de vie)

> Concept utilisé dans plusieurs fichiers :
> - `src/app/app.routes.ts` ➜ la liste des routes de l'appli
> - `src/app/app.config.ts` ➜ on branche le routeur
> - `src/app/app.html` ➜ le `<router-outlet />` principal
> - `src/app/components/sidebar/` ➜ les liens `routerLink`
> - `src/app/pages/page-a/` ➜ une page **avec une route enfant** (`detail`)
> - `src/app/pages/page-b/` ➜ une page simple

## C'est quoi ?

Le **routing** c'est ce qui permet d'avoir **plusieurs pages** dans une application Angular… alors qu'en vrai il n'y a **qu'un seul** `index.html` !
Angular regarde l'**URL** dans la barre d'adresse (`/page-a`, `/pipes`, `/restaurant`…) et décide **quel composant afficher**.

| Morceau | Rôle |
|---|---|
| `Routes` (`app.routes.ts`) | le **plan** : quelle URL ➜ quel composant |
| `provideRouter(routes)` (`app.config.ts`) | on **branche** ce plan dans l'appli |
| `<router-outlet />` | le **trou** dans le HTML où la page choisie vient s'afficher |
| `routerLink="/page-a"` | un **lien** qui change de page **sans recharger** le navigateur |
| `loadComponent` | **lazy loading** d'une page : on télécharge son code **seulement** quand on y va |
| `loadChildren` | lazy loading d'un **groupe de routes** (une page + ses sous-pages) |
| `children` | des **routes enfants** : une page dans une page (`/page-a/detail`) |
| `redirectTo` | une **redirection** (l'URL vide `''` ➜ `page-a`) |
| `ngOnInit` / `ngOnDestroy` | le **cycle de vie** : le composant **naît** quand on arrive sur la page, **meurt** quand on la quitte |

## Pourquoi ?

- **Une vraie navigation** : l'utilisateur peut mettre une page en favori, partager le lien, utiliser le bouton « retour » du navigateur.
- **Pas de rechargement** : avec `routerLink`, on change de page instantanément, sans que tout l'écran clignote (c'est ça une SPA, *Single Page Application*).
- **Lazy loading = rapidité** : si l'appli a 50 pages, l'utilisateur ne télécharge pas les 50 au démarrage, seulement celle qu'il visite.
- **Routes enfants** : une partie de la page reste fixe (le titre « Page A ») et seule une zone change (le détail).
- **Cycle de vie** : `ngOnInit` = le bon moment pour charger des données quand on arrive sur une page, `ngOnDestroy` = le bon moment pour faire le ménage quand on la quitte.

## Exemple métier qui parle à tout le monde

Un **site de e-commerce** 🛒 :
- Le **header**, la **sidebar** avec le menu et le **footer** sont toujours là ➜ ils sont dans `app.html`, **autour** du `<router-outlet />`.
- On clique sur « Produits » ➜ l'URL devient `/produits` ➜ la liste des produits s'affiche **dans le trou** du milieu.
- On clique sur un produit ➜ `/produits/detail` ➜ la page produits reste, et le détail s'affiche **dans un second trou** à l'intérieur ➜ **route enfant**.
- Le code de la page « Mon compte » n'est téléchargé **que** si l'utilisateur clique dessus ➜ **lazy loading**.
- Quand on arrive sur « Produits », `ngOnInit` lance le chargement de la liste. Quand on part, `ngOnDestroy` arrête ce qui tournait.

➡️ Le pas à pas complet est dans [TUTO.md](TUTO.md)
