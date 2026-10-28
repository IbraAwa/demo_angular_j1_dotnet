# Synthèse : les Directives d'attribut (exemple `ColorButton`)

> Concept utilisé dans 2 dossiers :
> - `src/app/directives/` ➜ la directive `ColorButton` elle-même
> - `src/app/pages/directive-demo/` ➜ la page qui l'**utilise** sur des boutons

## C'est quoi ?

Une **directive d'attribut**, c'est un **super-pouvoir** que tu colles sur une balise HTML qui existe déjà, juste en ajoutant un **attribut**.

```html
<button appColorButton="red" hoverColor="cyan">Retirer du stock</button>
```

Ici le `<button>` reste un bouton normal, mais grâce à `appColorButton` il gagne un pouvoir : **il est rouge, et il devient cyan quand on passe la souris dessus**.

La différence avec un composant :
- un **composant** ➜ crée une **nouvelle balise** avec son propre HTML (`<app-menu-item>`)
- une **directive** ➜ **n'a pas de HTML**, elle modifie le **comportement ou le look** d'une balise existante

## Comment elle est construite ?

| Morceau | Rôle |
|---|---|
| `@Directive({ selector: 'button[appColorButton], a[appColorButton]' })` | sur **quelles balises** la directive s'active (ici les `<button>` et les `<a>` qui ont l'attribut `appColorButton`) |
| `host: { '(mouseenter)': ... }` | écouter des **événements** sur la balise (la souris entre, sort…) |
| `host: { '[style.backgroundColor]': ... }` | modifier des **propriétés/styles** de la balise |
| `input(...)` | recevoir des **valeurs** écrites dans la balise (`hoverColor="cyan"`) |
| `input(..., { alias: 'appColorButton' })` | l'attribut qui **active** la directive sert **aussi** à lui passer une valeur |
| `signal` + `computed` | retenir l'état (souris dessus ou pas) et **calculer** la couleur à afficher |

## Pourquoi ?

- **Ne pas se répéter** : sans directive, il faudrait réécrire la logique « couleur + survol » dans **chaque composant** qui a un bouton. Avec la directive, on l'écrit **une fois** et on la colle partout.
- **Personnalisable** : chaque bouton choisit ses couleurs grâce aux `input`.
- **Séparer les rôles** : le composant s'occupe de la logique métier (le stock), la directive s'occupe du look du bouton.

## Exemple métier qui parle à tout le monde

Dans une **appli de banque** :
- le bouton « Virement » est **vert** et devient **vert foncé** au survol
- le bouton « Supprimer le bénéficiaire » est **rouge** et devient **noir** au survol
- le lien « Voir le détail » est **bleu** et devient **violet** au survol

Au lieu de coder ça 50 fois dans 50 pages, on crée **une** directive `appColorButton` et on écrit juste :

```html
<button appColorButton="green" hoverColor="darkgreen">Virement</button>
<button appColorButton="red" hoverColor="black">Supprimer le bénéficiaire</button>
<a appColorButton="blue" hoverColor="purple">Voir le détail</a>
```

➡️ Le pas à pas complet est dans [TUTO-directive.md](TUTO-directive.md)
