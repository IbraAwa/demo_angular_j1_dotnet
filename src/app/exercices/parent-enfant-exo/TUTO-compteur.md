# Tuto pas à pas : le Compteur avec `model()` et `[( )]`

> Objectif : un composant enfant **Compteur** (`-` 1 `+`) qui ne sait pas ce qu'il compte. Le **Garage** lui envoie une quantité de base et récupère la quantité choisie par le client grâce au two-way binding `[( )]`.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `enfants/compteur/` ➜ l'enfant : affiche et modifie **un nombre**
- `parents/garage/` ➜ le parent : la voiture commandée + la quantité

> Prérequis : la première partie de l'exercice (le `Garage` et les `VoitureItem` avec `input` / `output`) doit être terminée.

Commande pour générer le composant :

```bash
ng generate component exercices/parent-enfant-exo/enfants/compteur
```

> 💡 L'ordre logique : **1. l'enfant**, **2. le parent**. Pourquoi ? Parce que le parent a besoin de l'enfant pour l'afficher.

---

## PARTIE 1 : l'enfant `Compteur`

> Son job : afficher un nombre, faire `-1` / `+1`, et c'est tout. Il ne sait **pas** que ce nombre, c'est des voitures.

### Étape 1 : la quantité ➜ `model.required`

Dans `compteur.ts` :

```ts
import { Component, model } from '@angular/core';
```

```ts
export class Compteur {
  quantite = model.required<number>();
}
```

**Pourquoi un `model` et pas un `input` ?** Un `input`, c'est **en lecture seule** pour l'enfant : il le reçoit, il l'affiche, mais il n'a **pas le droit** de le modifier. Or notre compteur doit **changer** la quantité (+1, -1).
Un `model`, c'est un `input` que l'enfant a **aussi le droit de modifier**. Et à chaque modification, Angular **prévient le parent tout seul** avec la nouvelle valeur.

👉 En gros : **`model` = `input` + `output` en même temps.**

Décortiquons :
- `model` ➜ « cette variable arrive du parent **et** repart vers le parent »
- `.required` ➜ **obligatoire** : un compteur sans quantité de départ, ça n'a pas de sens. Si le parent oublie de la donner, Angular met une **erreur** tout de suite (comme `input.required` dans la première partie).
- `<number>` ➜ c'est **un nombre**, rien d'autre.

**Comment on lit la valeur ?** Comme un `input`, un `model` est un **signal** : on lit avec des parenthèses ➜ `quantite()`.

---

### Étape 2 : `-1` et `+1` ➜ `update`

```ts
diminuer() : void {
  this.quantite.update((q) => q - 1)
}

augmenter() : void {
  this.quantite.update((q) => q + 1)
}
```

**Pourquoi `update` ?** Parce que la nouvelle quantité **dépend de l'ancienne** : on part de l'ancienne valeur `q` et on enlève ou on ajoute 1.
(On pourrait aussi écrire `this.quantite.set(this.quantite() - 1)`, c'est d'ailleurs ce qui est fait dans le compteur de la démo restaurant. Les deux marchent, `update` est juste plus propre ici.)

**Et le parent, il est prévenu comment ?** C'est **la magie du `model`** ✨ : dès qu'on fait `update` (ou `set`) sur un `model`, Angular **envoie automatiquement** la nouvelle valeur au parent.
Pas besoin d'écrire un `output` ni un `.emit(...)` comme dans la première partie : Angular le fait **pour nous**.

---

### Étape 3 : le HTML de l'enfant

Dans `compteur.html` :

```html
<div class="compteur">
  <button class="btn" (click)="diminuer()">-</button>
  <span>{{ quantite() }}</span>
  <button class="btn" (click)="augmenter()">+</button>
</div>
```

- `(click)="diminuer()"` / `(click)="augmenter()"` ➜ au clic, on appelle nos méthodes.
- `{{ quantite() }}` ➜ on affiche la quantité, **avec parenthèses** car c'est un signal.

Tu remarques ? **Nulle part** on ne parle de voiture. Ce compteur pourrait compter n'importe quoi 😉.

---

### Étape 4 : le style de l'enfant

Dans `compteur.scss` :

```scss
.compteur {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  span {
    min-width: 25px;
    text-align: center;
    font-weight: bolder;
  }
}

.btn {
  width: 32px;
  height: 30px;
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  color: black;
}
```

- `.compteur` ➜ les 3 éléments **en ligne** (`flex` + `row`), centrés verticalement, avec 5px d'espace (`gap`).
- `span` **rangé dans** `.compteur` ➜ le nombre, en gras et centré. C'est le SCSS qui permet d'écrire un style **à l'intérieur** d'un autre : ce style s'applique aux `<span>` qui sont **dans** `.compteur`.
- `.btn` ➜ des petits boutons blancs aux coins arrondis.

---

## PARTIE 2 : le parent `Garage`

> Son job : savoir **ce qu'on compte** (des voitures commandées), donner la quantité de base, récupérer la quantité choisie, et appliquer **ses** règles.

### Étape 5 : importer l'enfant

Dans `garage.ts` :

```ts
import { Compteur } from '../../enfants/compteur/compteur';

@Component({
  imports: [VoitureItem, Compteur],
  ...
})
```

**Pourquoi ?** Comme pour `VoitureItem` : sinon le garage ne connaît pas la balise `<app-compteur>` et Angular met une **erreur**.

---

### Étape 6 : la quantité de base ➜ un signal

```ts
quantite = signal(1)
```

**Pourquoi `1` ?** C'est la **quantité de base** qu'on envoie au compteur : quand on commande une voiture, on en commande **au moins une**.

**Pourquoi un signal ?** Cette quantité va **changer** (c'est le compteur qui va la modifier), et le message « Vous commandez 3 x … » doit se mettre à jour 🔔.
👉 Règle d'or : **une donnée qui change et qui est affichée = un signal.**

**Pourquoi c'est le garage qui la possède, et pas le compteur ?** Parce que c'est le **garage** qui sait ce que ce nombre veut dire (« combien de fois on commande cette voiture »). Le compteur, lui, ne fait que la **modifier**.

---

### Étape 7 : la règle du garage ➜ une seule voiture à la fois

```ts
ajouterCommande(voitureParam : Voiture) {
  if (this.voitureCommander() !== voitureParam) {
    this.quantite.set(1)
  }
  this.voitureCommander.set(voitureParam)
}
```

**Le contexte du garage :** on peut commander **la même voiture plusieurs fois** (c'est le rôle du compteur), mais **pas plusieurs voitures différentes**.

Ligne par ligne :
1. `if (this.voitureCommander() !== voitureParam)` ➜ « est-ce que le client vient de choisir une **autre** voiture que celle déjà commandée ? »
2. `this.quantite.set(1)` ➜ si oui, on **repart de la quantité de base**. Logique : 3 Porsche, puis on choisit une Clio ➜ on ne veut pas 3 Clio d'office !
   `set` et pas `update` : on se fiche de l'ancienne quantité, on **remet** 1.
3. `this.voitureCommander.set(voitureParam)` ➜ la nouvelle voiture **remplace** l'ancienne (c'est le code de la première partie).

Si le client reclique sur la **même** voiture ➜ le `if` est faux ➜ on garde sa quantité.

👉 Tu vois la différence de rôle ? Cette règle, le compteur **ne pourrait pas** la gérer : il ne sait même pas qu'il compte des voitures !

---

### Étape 8 : afficher le compteur ➜ `@if ... as` et `[( )]`

Dans `garage.html`, en dessous de ce qu'on avait fait dans la première partie :

```html
@if (voitureCommander(); as voiture) {
  <app-compteur [(quantite)]="quantite" />
  <p>Vous commandez {{ quantite() }} x {{ voiture.marque }} {{ voiture.nom }}</p>
}
```

#### Le `@if (...; as voiture)`

- `@if (voitureCommander())` ➜ on affiche le compteur **seulement si** une voiture a été commandée. Au départ `voitureCommander()` vaut `null` ➜ rien ne s'affiche.
- `; as voiture` ➜ on donne un **petit nom** à la valeur testée. À l'intérieur des accolades, `voiture` = la voiture commandée, et TypeScript sait qu'elle **n'est pas `null`** (sinon on ne serait pas entré dans le `@if`).
  ➜ Résultat : on écrit `voiture.marque` tout simplement, au lieu de `voitureCommander()?.marque` avec des `?.` partout.

#### Le two-way binding `[(quantite)]="quantite"`

C'est **LA** ligne importante 🐢.

- `[ ]` ➜ le garage **envoie** la quantité au compteur (la quantité de base `1` au départ)
- `( )` ➜ le garage **reçoit** la nouvelle quantité quand le compteur la change
- `[( )]` ➜ les deux en même temps : la **banane dans la boîte** 🍌📦

Les deux `quantite` ne sont **pas** la même chose :
- à **gauche**, `[(quantite)]` ➜ le **nom du `model`** dans l'enfant (comme `[voiture]` = le nom de l'`input`)
- à **droite**, `"quantite"` ➜ le **signal** du garage

**Attention :** à droite on met le signal **sans parenthèses**. On donne **la boîte entière** au compteur pour qu'il puisse **lire ET écrire** dedans (exactement comme `[(ngModel)]="quantity"` dans le tuto bindings).
Par contre dans `{{ quantite() }}` on veut juste **lire** ➜ avec parenthèses.

#### Ce que `[( )]` fait en vrai (sous le capot)

`[( )]` n'est qu'un **raccourci**. Angular le transforme en :

```html
<app-compteur [quantite]="quantite()" (quantiteChange)="quantite.set($event)" />
```

- `[quantite]="quantite()"` ➜ un `input` classique : on envoie la valeur
- `(quantiteChange)` ➜ l'`output` **caché** qu'Angular a créé tout seul avec le `model` (son nom = le nom du model + `Change`)
- `quantite.set($event)` ➜ on range la nouvelle valeur dans le signal du garage

👉 Le `model` + `[( )]`, c'est ce qu'on faisait avec `input` + `output` dans la première partie… mais en **une seule ligne** de chaque côté.

---

### Le trajet complet d'un clic sur `+`

1. Le client a commandé la Porsche ➜ `quantite` du garage vaut `1` ➜ le compteur affiche `1`
2. Il clique sur `+` dans le compteur (enfant) ➜ `augmenter()`
3. ➜ `this.quantite.update((q) => q + 1)` : le `model` de l'enfant passe à `2`
4. ➜ Angular envoie **tout seul** `2` au parent (l'output caché `quantiteChange`)
5. ➜ le `[( )]` du garage range `2` dans **son** signal `quantite`
6. ➜ le signal sonne 🔔 ➜ « Vous commandez **2** x Porsche 911 Carrera »

---

💡 Pour aller plus loin : le compteur peut descendre à `0`, puis en **négatif** (-1, -2…). Commander -2 voitures, ça n'a pas de sens 😅. Essaie de bloquer le bouton `-` quand la quantité est à 1, avec un `[disabled]` (vu dans le tuto bindings).

---

## Récap

| Je veux… | J'écris… |
|---|---|
| une valeur reçue du parent **et** modifiable par l'enfant | enfant : `quantite = model.required<number>()` |
| modifier le model dans l'enfant | `this.quantite.update(q => q + 1)` ou `.set(...)` |
| prévenir le parent | rien à écrire : le `model` le fait **tout seul** |
| lier dans les deux sens chez le parent | parent : `<app-compteur [(quantite)]="monSignal" />` (signal **sans** parenthèses) |
| afficher seulement si la valeur existe, avec un petit nom | `@if (monSignal(); as valeur) { ... }` |

➡️ La version courte est dans [SYNTHESE-compteur.md](SYNTHESE-compteur.md)
