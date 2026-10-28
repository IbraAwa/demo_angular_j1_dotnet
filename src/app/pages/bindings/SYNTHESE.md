# Synthèse : les Bindings (et les signals)

## C'est quoi ?

Un **binding** c'est le **câble** entre ton fichier `.ts` (la logique, les données) et ton fichier `.html` (ce que l'utilisateur voit).

Il y a 4 sortes de câbles, et il faut juste retenir **le sens** dans lequel l'info voyage :

| Syntaxe | Nom | Sens | Exemple |
|---|---|---|---|
| `{{ maVariable }}` | Interpolation | TS ➜ HTML (on affiche du texte) | `<h2>{{ productName }}</h2>` |
| `[propriete]="..."` | Property binding | TS ➜ HTML (on remplit une propriété de la balise) | `<img [src]="imageUrl" />` |
| `(evenement)="..."` | Event binding | HTML ➜ TS (l'utilisateur fait un truc, on prévient le TS) | `<button (click)="restock(1)">` |
| `[(ngModel)]="..."` | Two-way binding | TS ⇄ HTML (dans les deux sens) | `<input [(ngModel)]="quantity" />` |

Petit moyen mnémotechnique :
- `[ ]` = **j'envoie** une info vers la balise
- `( )` = **je reçois** une info de la balise
- `[( )]` = la « banane dans la boîte » 🍌📦 = **les deux en même temps**

Et il y a les variantes de `[ ]` qui sont super pratiques :
- `[class.epuise]="condition"` ➜ ajoute la classe CSS `epuise` **seulement si** la condition est vraie
- `[style.width.%]="nombre"` ➜ met directement un style, ici une largeur en %
- `[disabled]="condition"` ➜ désactive le bouton si la condition est vraie

## Et les signals dans tout ça ?

Un **signal** c'est une variable **qui prévient Angular quand elle change**.

- `signal(0)` ➜ je crée la boîte avec 0 dedans
- `stock()` ➜ je **lis** ce qu'il y a dans la boîte (avec les parenthèses !)
- `stock.set(5)` ➜ je **remplace** le contenu par 5
- `stock.update(s => s + 1)` ➜ je **calcule** la nouvelle valeur à partir de l'ancienne

## Pourquoi ?

- Sans binding, ton HTML serait figé, genre une page HTML de 1999. Le binding rend la page **vivante**.
- Sans signal, Angular ne sait pas **quand** il doit mettre à jour l'écran. La démo le montre bien : le compteur `secondsWrong` (variable classique) change dans la console mais **pas à l'écran**, alors que `secondsRight` (signal) se met à jour toutes les secondes.
  ⚠️ Lance `secondsWrong` **en premier et tout seul**. Si tu cliques sur un autre bouton de la page, ou si le compteur signal tourne, Angular redessine **tout** le composant et la variable classique « se débloque » **par chance** (pas grâce à elle). Le détail est dans le tuto.

## Exemple métier qui parle à tout le monde

Imagine la fiche d'un produit sur un site de vente, genre un **clavier** :

- Le **nom** et la **photo** du produit viennent de la base de données ➜ `{{ }}` et `[src]`
- Le vendeur clique sur « +10 » pour réapprovisionner ➜ `(click)`
- Si le stock est à 0, le bouton « Commander » est grisé et « Disponibilité » est barré en rouge ➜ `[disabled]` et `[class.epuise]`
- Une barre verte montre visuellement le niveau du stock ➜ `[style.width.%]`
- Le client tape la quantité voulue et le **total** se recalcule tout seul ➜ `[(ngModel)]`

C'est exactement ce que fait la page `bindings` 😉

➡️ Le pas à pas complet est dans [TUTO.md](TUTO.md)
