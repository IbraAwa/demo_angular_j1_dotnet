# Tuto pas à pas : Parent ➜ Enfant avec `input` / `output` / `model`

> Objectif : une page **Restaurant** (le parent) qui affiche la carte avec une jolie fiche par plat (l'enfant `MenuItem`). Quand on clique sur « Commander » dans une fiche, le plat s'ajoute à la liste des plats commandés. Chaque plat commandé a un **compteur** `-` 1 `+` (l'enfant `Compteur`) pour choisir sa quantité, et un **total** se calcule tout seul.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `plat.model.ts` ➜ le model (à quoi ressemble un plat) + les données de test
- `Enfants/menu-item/` ➜ l'enfant : affiche **un** plat
- `Enfants/compteur/` ➜ l'enfant : affiche et modifie **une quantité** (partie 4)
- `Parents/restaurant/` ➜ le parent : la carte + les commandes + le total

Commandes pour générer les composants :

```bash
ng generate component pages/parent-enfant-demo/Enfants/menu-item
ng generate component pages/parent-enfant-demo/Enfants/compteur
ng generate component pages/parent-enfant-demo/Parents/restaurant
```

> 💡 L'ordre logique : **1. le model**, **2. l'enfant**, **3. le parent**. Pourquoi ? Parce que le parent a besoin de l'enfant, et les deux ont besoin du model.

---

## PARTIE 1 : le model `plat.model.ts`

### Étape 1 : créer le fichier

On crée **à la main** un fichier `plat.model.ts` dans `pages/parent-enfant-demo/`.
Pourquoi à cet endroit ? Parce que le parent **et** l'enfant vont l'utiliser, donc on le met dans le dossier qui les contient tous les deux.

Le `.model.ts` à la fin, c'est une **convention** : en voyant le nom du fichier, on sait tout de suite qu'il contient la **forme des données**, pas un composant.

---

### Étape 2 : l'interface `Plat`

```ts
export interface Plat {
  nom : string
  prix : number
  description : string
  vegetarien : boolean
}
```

**C'est quoi une interface ?** C'est un **contrat**, un **moule** : « Un `Plat`, c'est **obligatoirement** un objet avec un `nom` (texte), un `prix` (nombre), une `description` (texte) et un `vegetarien` (vrai/faux). »

Ligne par ligne :
- `export` ➜ pour pouvoir l'importer dans d'autres fichiers (le parent et l'enfant). Sans `export`, le model reste enfermé dans son fichier.
- `interface Plat` ➜ on crée le type `Plat`. Majuscule au début, c'est la convention pour les types.
- `nom : string` ➜ le nom du plat, du texte.
- `prix : number` ➜ le prix, un nombre (pas `"16.50 €"` en texte ! le € c'est de l'**affichage**, pas de la donnée).
- `description : string` ➜ la description, du texte.
- `vegetarien : boolean` ➜ `true` ou `false`, rien d'autre.

**Pourquoi une interface et pas une classe ?** On veut juste **décrire la forme** des données. Pas de méthodes, pas de logique. L'interface est parfaite pour ça et elle disparaît complètement une fois compilée en JavaScript (elle ne pèse rien).

**Pourquoi c'est utile ?** Si tu écris `plat.nomm` (faute de frappe) ou si tu oublies le prix en créant un plat, TypeScript te le dit **tout de suite**, avant même de lancer l'appli.

---

### Étape 3 : les données de test `LISTE_PLATS`

```ts
export const LISTE_PLATS: Plat[] = [
  {
    nom: "Burger Comtois",
    prix: 16.50,
    description: "Steak haché de bœuf, comté AOP fondu, ...",
    vegetarien: false
  },
  ...
];
```

- `export` ➜ pour que le parent puisse l'importer.
- `const` ➜ cette liste de départ ne sera jamais remplacée.
- `LISTE_PLATS` ➜ en MAJUSCULES : c'est la convention pour une **constante** de données.
- `: Plat[]` ➜ « c'est un **tableau de `Plat`** ». Grâce à ça, **chaque** objet dans le tableau doit respecter le contrat de l'interface. Oublie un `vegetarien` ➜ erreur rouge direct.

**Pourquoi des fausses données ?** On n'a pas encore d'API. Ça nous permet de construire et tester l'affichage **maintenant**. Plus tard on remplacera juste ça par un appel API.

---

## PARTIE 2 : l'enfant `MenuItem`

> Son job : afficher **UN** plat sous forme de card, et **prévenir** le parent quand on clique sur « Commander ». C'est tout.

### Étape 4 : importer `input`, `output` et le model

Dans `menu-item.ts` :

```ts
import { Component, input, output } from '@angular/core';
import { Plat } from '../../plat.model';
```

- `input` ➜ pour **recevoir** une info du parent.
- `output` ➜ pour **envoyer** une info au parent.
- `Plat` ➜ notre model, pour dire « je reçois un `Plat` » et pas n'importe quoi.

---

### Étape 5 : recevoir le plat ➜ `input.required`

```ts
plat = input.required<Plat>();
```

**Pourquoi un `input` ?** L'enfant ne sait **pas** quel plat afficher, c'est le **parent** qui le lui donne. `input` = « cette variable sera **remplie depuis la balise** chez le parent ».

Chez le parent on écrira :

```html
<app-menu-item [plat]="menuItem" />
```

- `[plat]` ➜ **même nom** que la variable dans l'enfant. C'est ce qui fait le lien.
- `[ ]` ➜ on **envoie** une info.
- `"menuItem"` ➜ la valeur envoyée (un plat de la liste).

**Pourquoi `.required` ?** Sans plat, l'enfant n'a **rien** à afficher, ça n'a aucun sens. Avec `required`, si quelqu'un écrit `<app-menu-item />` sans `[plat]`, Angular met une **erreur** tout de suite. On se protège.

**Pourquoi `<Plat>` ?** On dit que ce qu'on reçoit **doit** être un `Plat`. Si le parent envoie un texte ou un nombre ➜ erreur.

**Comment on lit la valeur ?** Un `input` est un **signal** ! Donc on lit avec des parenthèses : `plat()`.

---

### Étape 6 : prévenir le parent ➜ `output`

```ts
platAjouter = output<Plat>();
```

**Pourquoi un `output` ?** Quand on clique sur « Commander », l'enfant doit **prévenir** le parent. Mais l'enfant ne connaît pas le parent, il ne peut pas aller modifier sa liste de commandes lui-même. Alors il **émet un événement**, comme une sonnette 🛎️, et le parent qui écoute réagit.

**Pourquoi `<Plat>` ?** C'est le **type de ce qu'on envoie** avec l'événement : on dit au parent « on a cliqué, et voici **le plat** concerné ».

Chez le parent on écrira :

```html
<app-menu-item (platAjouter)="AjouterCommande($event)" />
```

- `(platAjouter)` ➜ **même nom** que l'output dans l'enfant.
- `( )` ➜ on **reçoit** un événement.

---

### Étape 7 : la méthode qui émet

```ts
AjouterACommande(plat : Plat) : void {
  this.platAjouter.emit(plat)
}
```

- `AjouterACommande(plat : Plat)` ➜ la méthode appelée au clic, elle reçoit le plat.
- `: void` ➜ elle ne retourne rien, elle fait juste une action.
- `this.platAjouter.emit(plat)` ➜ **on sonne** 🛎️ ! `emit` = « envoie l'événement au parent, avec ce plat dedans ».

---

### Étape 8 : le HTML de l'enfant

Dans `menu-item.html` :

```html
<article class="wrapper-plat">
```
La card. Le style est dans `.wrapper-plat` du SCSS (fond, bordure arrondie, ombre au survol) : on le voit juste après le HTML.

```html
  <h3>{{plat().nom}}</h3>
  <p class="description">{{plat().description}}</p>
  <p class="prix">{{plat().prix}}</p>
```
On affiche les infos du plat. **`plat()` avec parenthèses** car c'est un signal (l'input), **puis** `.nom` pour aller chercher la propriété dans l'objet.

```html
  <span [className]="plat().vegetarien ? 'vegetarien' : 'nonvegetarien'">
    {{plat().vegetarien ? "végétarien" : "non végétarien"}}
  </span>
```
Le badge végétarien. On utilise le **ternaire** `condition ? siVrai : siFaux` deux fois :
- `[className]="..."` ➜ on choisit la **classe CSS** : `vegetarien` (badge vert) ou `nonvegetarien` (badge rouge). Crochets car on **envoie** une valeur calculée.
- `{{ ... }}` ➜ on choisit le **texte** affiché : « végétarien » ou « non végétarien ».

```html
  <button class="btn" (click)="AjouterACommande(plat())">Commander</button>
</article>
```
Au clic ➜ on appelle `AjouterACommande` en lui donnant **le plat de cette card** (`plat()`). Et la méthode va `emit` vers le parent.

### Le SCSS de l'enfant

Dans `menu-item.scss` :

```scss
.wrapper-plat {
  max-width: 350px;
  padding: 20px;
  margin: 16px 0;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: box-shadow 0.2s ease;
}

.wrapper-plat:hover{
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12)
}

.vegetarien {
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #dcfce7;
  color: #15803d;
}

.nonvegetarien {
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #fee2e2;
  color: #b91c1c;
}

.btn {
  display: block;
  margin-top: 16px;
  padding: 6px 14px;
  background-color: black;
  border-radius: 12px;
  color: white;
}
```

- `.wrapper-plat` ➜ la card : fond blanc, fine bordure grise, coins arrondis.
- `.wrapper-plat:hover` ➜ une **ombre** apparaît (en douceur grâce à `transition`) quand la souris passe sur la card.
- `.vegetarien` / `.nonvegetarien` ➜ les 2 badges (vert / rouge) choisis par le `[className]` du HTML.
- `.btn` ➜ le bouton « Commander » noir, `display: block` pour qu'il passe **sous** le badge.

---

## PARTIE 3 : le parent `Restaurant`

> Son job : avoir les données (la carte, les commandes), afficher un enfant par plat, et **réagir** quand un enfant dit « on m'a commandé ».

### Étape 9 : importer le model, les données et l'enfant

Dans `restaurant.ts` :

```ts
import { Component, computed, signal, WritableSignal } from '@angular/core';
import { Plat, LISTE_PLATS } from '../../plat.model';
import { MenuItem } from '../../Enfants/menu-item/menu-item';

@Component({
  imports: [MenuItem],
  ...
})
```

- `signal` ➜ pour nos données qui changent. `WritableSignal` (étape 11) et `computed` (partie 5), on les explique quand on s'en sert.
- `Plat` ➜ le type, pour typer nos signals.
- `LISTE_PLATS` ➜ les données de test.
- `MenuItem` dans `imports` ➜ **obligatoire** ! Sinon le parent ne connaît pas la balise `<app-menu-item>` et Angular met une erreur. Un composant enfant doit **toujours** être importé dans le parent qui l'utilise.

---

### Étape 10 : la carte ➜ un signal

```ts
carte = signal<Plat[]>(LISTE_PLATS)
```

**Pourquoi ?** C'est la liste des plats à afficher. On la met dans un signal car plus tard elle viendra d'une API et pourra changer.
`<Plat[]>` ➜ un tableau de `Plat`. On démarre avec `LISTE_PLATS`.

---

### Étape 11 : les commandes ➜ une `LigneCommande` + un signal vide

Une commande, ce n'est pas juste un plat : c'est **un plat + sa quantité** (2 Burgers, 1 Risotto…). On crée donc la forme d'une **ligne de commande**, tout en haut de `restaurant.ts` (au-dessus du `@Component`) :

```ts
export interface LigneCommande {
  plat: Plat;
  quantite: WritableSignal<number>
}
```

- `plat: Plat` ➜ le plat commandé (notre model).
- `quantite: WritableSignal<number>` ➜ la quantité de **cette ligne**… et c'est un **signal** ! `WritableSignal<number>` = « un signal qui contient un nombre et qu'on a le droit de modifier » (c'est le type de ce que renvoie `signal(1)`).

**Pourquoi la quantité est un signal, et pas un simple `number` ?** Parce qu'elle va **changer** (avec le compteur de la partie 4) et que le **total** (partie 5) doit être **prévenu** 🔔 à chaque `+` ou `-`. Avec un simple `number`, personne ne sonnerait la cloche et le total resterait bloqué. On y revient en détail dans la partie 5.

**Pourquoi un signal par ligne ?** Chaque plat commandé a **sa propre** quantité : 2 Burgers et 1 Risotto, ce sont 2 compteurs **indépendants**.

Ensuite, dans la classe :

```ts
commandes = signal<LigneCommande[]>([])
```

**Pourquoi ?** On a besoin d'une liste pour **retenir** les lignes de commande et les afficher.
**Pourquoi `[]` ?** Au début, personne n'a rien commandé : tableau **vide**.
**Pourquoi un signal ?** Cette liste va **grandir** à chaque commande, et l'affichage doit suivre 🔔.

---

### Étape 12 : ajouter une commande ➜ `update` et le spread `...`

```ts
AjouterCommande(plat : Plat) {
  let LigneCommande : LigneCommande = {
    plat: plat,
    quantite: signal(1)
  }
  this.commandes.update(list => [...list, LigneCommande])
}
```

C'est **LA** méthode importante, on prend le temps 🐢.

**Ce qu'on veut :** créer une nouvelle ligne de commande avec le plat cliqué, et l'ajouter à la fin de la liste.

**1. On fabrique la ligne :**
- `let LigneCommande : LigneCommande = { ... }` ➜ un objet qui respecte le contrat `LigneCommande` (étape 11).
  💡 La variable porte le **même nom** que l'interface. Ça marche (TypeScript fait la différence entre un **type** et une **variable**), mais par convention on écrirait plutôt la variable en minuscule (`ligneCommande`) pour ne pas confondre.
- `plat: plat` ➜ le plat reçu de l'enfant.
- `quantite: signal(1)` ➜ un **nouveau** signal qui démarre à **1** : quand on commande, on commande au moins un plat.

**2. On l'ajoute ➜ `update` + spread :**

**Pourquoi `update` ?** Parce que la nouvelle liste **dépend de l'ancienne** : on veut garder ce qui était déjà commandé **+** la nouvelle ligne.
- `list` ➜ l'ancienne liste (Angular nous la donne)
- ce qu'on **renvoie** ➜ devient la nouvelle valeur du signal

**Pourquoi `[...list, LigneCommande]` ?** Décortiquons :
- `[ ... ]` ➜ on crée un **NOUVEAU** tableau
- `...list` ➜ le **spread** (« étaler ») : on vide tout le contenu de l'ancienne liste dedans
- `, LigneCommande` ➜ et on ajoute la nouvelle ligne à la fin

Exemple :
```
list                      = [Burger x1]
LigneCommande             = Risotto x1
[...list, LigneCommande]  = [Burger x1, Risotto x1]   ← un tout nouveau tableau
```

**Mais pourquoi pas juste `this.commandes().push(LigneCommande)` ?? 🤔**
Parce qu'un signal détecte le changement quand il reçoit une **nouvelle référence**, **PAS ET SURTOUT PAS** quand le contenu de l'ancien tableau change.

Imagine une **boîte à chaussures** 📦 :
- `push` ➜ tu ouvres **la même boîte** et tu mets une chaussure de plus dedans. De l'extérieur, c'est **la même boîte**. Le signal regarde la boîte, se dit « c'est la même », et **ne sonne pas** 🔕.
- `[...list, LigneCommande]` ➜ tu prends une **nouvelle boîte**, tu mets toutes les anciennes chaussures dedans + la nouvelle. Le signal voit **une autre boîte** ➜ il **sonne** 🔔 ➜ l'écran se met à jour.

#### ⚠️ Attention : si tu testes `push` dans cette démo, le plat va quand même s'afficher !

Pas de panique, le tuto ne ment pas 😉. Il faut séparer deux choses :

**1. Le comportement par défaut (la règle) :** avec `push`, le signal **ne sonne pas**. Personne ne prévient Angular, donc **rien ne garantit** que l'écran se mette à jour.

**2. Ce qui se passe dans notre cas précis :** le `push` arrive **juste après un clic** (le bouton « Commander »). Or, en Angular, **un clic sur un bouton qui a un `(click)` fait toujours rafraîchir le composant** où se trouve ce bouton (l'enfant `MenuItem`) **et tous ses parents** (donc `Restaurant`). Pendant ce rafraîchissement, le `@for` **relit le tableau `commandes()`** élément par élément… et il trouve le nouveau plat. L'écran se met à jour **grâce au clic, pas grâce au signal**. C'est de la chance.

**La différence, concrètement :** imagine que le plat n'arrive pas d'un clic, mais d'une **API** ou d'un `setTimeout` (aucun clic) :
- avec `push` ➜ pas de clic, pas de cloche ➜ l'écran **reste bloqué** 🔕
- avec `[...list, LigneCommande]` ➜ le signal sonne ➜ l'écran se met à jour 🔔

Et même dans notre démo, tout ce qui **dépend** du signal ne serait **pas** prévenu avec `push`. Notre `total` (partie 5) est un `computed` qui additionne les prix des commandes : avec `push`, la nouvelle ligne **apparaîtrait** à l'écran (grâce au clic)… mais le total resterait **bloqué sur l'ancien montant** ❌, car un `computed` n'écoute **que** la cloche du signal. Teste-le, c'est la meilleure preuve !

👉 **Règle d'or avec les signals de tableaux : toujours créer un nouveau tableau.** Ne compte jamais sur la chance d'un clic.

---

### Étape 13 : afficher un enfant par plat ➜ `@for` + `[input]` + `(output)`

Dans `restaurant.html` :

```html
<section class="carte">
@for (menuItem of carte(); track $index) {
  <app-menu-item [plat]="menuItem" (platAjouter)="AjouterCommande($event)" />
}
</section>
```

Ligne par ligne :
- `@for (menuItem of carte(); track $index)` ➜ pour **chaque plat** de la carte, on l'appelle `menuItem` (voir [le tuto control flow](../directive-demo/TUTO-control-flow.md) pour le `@for`).
- `<app-menu-item ... />` ➜ on crée **un enfant par plat**. 4 plats ➜ 4 cards. On a écrit le HTML de la card **une seule fois** dans l'enfant !
- `[plat]="menuItem"` ➜ **INPUT** : on **donne** à l'enfant le plat qu'il doit afficher.
- `(platAjouter)="AjouterCommande($event)"` ➜ **OUTPUT** : quand l'enfant sonne 🛎️, on appelle **notre** méthode `AjouterCommande`.
  - `$event` ➜ c'est **ce que l'enfant a mis dans son `emit(...)`**, donc le plat cliqué.

Et pour que les cards se mettent **côte à côte**, dans `restaurant.scss` :

```scss
.carte{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
```

- `display: flex` + `flex-direction: row` ➜ les cards se rangent **en ligne**.
- `flex-wrap: wrap` ➜ s'il n'y a plus de place, elles passent **à la ligne suivante**.
- `justify-content: space-around` ➜ de l'espace **réparti** autour de chaque card.

**Le trajet complet d'un clic :**
1. Le client clique sur « Commander » dans la card du Risotto (enfant)
2. ➜ `AjouterACommande(plat())` dans l'enfant
3. ➜ `this.platAjouter.emit(plat)` : l'enfant sonne avec le Risotto
4. ➜ le parent entend `(platAjouter)` et appelle `AjouterCommande($event)` avec `$event` = le Risotto
5. ➜ on crée la ligne « Risotto x1 » et `this.commandes.update(list => [...list, LigneCommande])` : nouveau tableau avec cette ligne
6. ➜ le signal sonne 🔔 ➜ la liste des commandes se met à jour à l'écran

---

### Étape 14 : afficher les commandes

```html
<section>
  <h1>les plats commandés</h1>
@for (commande of commandes(); track $index) {
  <h3>{{commande.plat.nom}}</h3>
  <p>{{commande.plat.prix}} €</p>
  <!-- le compteur arrive à la partie 4 -->
}
</section>
```

- `@for (commande of commandes(); ...)` ➜ pour chaque **ligne** de commande.
- `track $index` ➜ ici on suit par **position**, car on peut commander **deux fois le même plat** (deux lignes Burger) : la valeur n'est donc pas unique, mais la position oui.
- `{{commande.plat.nom}}` ➜ `commande` est une `LigneCommande`, donc on passe par **`.plat`** pour aller chercher le nom du plat. **Pas de parenthèses** après `commande` ni après `plat` : ce sont de simples objets, pas des signals. (Les parenthèses c'était pour `commandes()`, le signal.)
- `{{commande.plat.prix}} €` ➜ le prix + le symbole €.

---

## PARTIE 4 : l'enfant `Compteur` ➜ `model()` et `[( )]`

> Son job : afficher **une quantité**, faire `-1` / `+1`, et c'est tout. Il ne sait **pas** que ce sont des plats : il pourrait compter des voitures, des billets… (c'est d'ailleurs ce qu'on fait dans l'exercice garage 😉).

### Étape 15 : la quantité ➜ `model.required`

Dans `compteur.ts` :

```ts
import { Component, model } from '@angular/core';

export class Compteur {
  quantite = model.required<number>();
}
```

**Pourquoi un `model` et pas un `input` ?** Un `input`, c'est **en lecture seule** pour l'enfant : il le reçoit, il l'affiche, mais il n'a **pas le droit** de le modifier. Or notre compteur doit **changer** la quantité.
Un `model`, c'est un `input` que l'enfant a **aussi le droit de modifier**. Et à chaque modification, Angular **renvoie tout seul** la nouvelle valeur au parent (il crée un `output` **caché** pour nous, avec son `emit`).

👉 En gros : **`model` = `input` + `output` en même temps.**

- `.required` ➜ **obligatoire** : un compteur sans quantité, ça n'a pas de sens. Si le parent oublie de la donner ➜ erreur tout de suite.
- `<number>` ➜ c'est un nombre.
- Comme un `input`, un `model` est un **signal** ➜ on le lit avec `quantite()`.

---

### Étape 16 : `-1` et `+1`

```ts
diminuer() : void {
  this.quantite.set(this.quantite() - 1)
}

augmenter() : void {
  this.quantite.set(this.quantite() + 1)
}
```

- `this.quantite()` ➜ on **lit** la quantité actuelle
- `- 1` / `+ 1` ➜ on calcule la nouvelle
- `this.quantite.set(...)` ➜ on la **range** dans le `model`… et Angular **prévient le parent tout seul** ✨. Pas de `output`, pas de `.emit(...)` à écrire !

💡 Ici on lit le signal **à l'intérieur de son propre `set`** : c'est un `update` déguisé. Ça marche très bien, mais on pourrait aussi écrire `this.quantite.update((q) => q + 1)` (c'est ce qui est fait dans le corrigé de l'exercice garage). Pour savoir quand utiliser `set` ou `update`, regarde [la synthèse du compteur](../../exercices/parent-enfant-exo/SYNTHESE-compteur.md).

---

### Étape 17 : le HTML et le style de l'enfant

Dans `compteur.html` :

```html
<div class="compteur">
  <button class='btn' (click)="diminuer()">-</button>
  <span>{{quantite()}}</span>
  <button class='btn' (click)="augmenter()">+</button>
</div>
```

- `(click)` ➜ au clic, on appelle `diminuer()` ou `augmenter()`.
- `{{quantite()}}` ➜ on affiche la quantité, **avec parenthèses** car c'est un signal.
- Nulle part on ne parle de plat : ce compteur peut compter **n'importe quoi**.

Dans `compteur.scss` :

```scss
.compteur {
  display: flex;
  flex-direction: row;
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

- `.compteur` ➜ les 3 éléments **en ligne**, avec 5px d'espace entre eux (`gap`).
- `span` **rangé dans** `.compteur` ➜ le nombre, en gras et centré. En SCSS, écrire un bloc **à l'intérieur** d'un autre veut dire « les `<span>` qui sont **dans** `.compteur` ».
  ⚠️ Attention à **où** tu le ranges : si on le mettait dans `.btn`, ça viserait les `<span>` **à l'intérieur d'un bouton**… et il n'y en a pas (notre `<span>` est **à côté** des boutons). Le style ne s'appliquerait jamais.
- `.btn` ➜ des petits boutons blancs aux coins arrondis.

---

### Étape 18 : utiliser le compteur dans le parent ➜ `[( )]`

Dans `restaurant.ts`, on ajoute l'enfant dans les `imports` :

```ts
import { Compteur } from '../../Enfants/compteur/compteur';

@Component({
  imports: [MenuItem, Compteur],
  ...
})
```

Dans `restaurant.html`, à la place du commentaire de l'étape 14, **dans** le `@for` des commandes :

```html
  <!--Sans composant enfant-->
  <!--<p>Quantité {{commande.quantite()}}</p>-->
  <app-compteur [(quantite)]="commande.quantite"/>
```

- Le code en commentaire ➜ c'est la version **sans composant enfant** : on affichait juste la quantité, sans pouvoir la changer.
- `<app-compteur ... />` ➜ **un compteur par ligne** de commande.

**Pourquoi `[(quantite)]` ?** C'est le **two-way binding**, la « banane dans la boîte » 🍌📦 (comme `[(ngModel)]` dans le tuto bindings) :
- `[ ]` ➜ le parent **envoie** la quantité de la ligne au compteur
- `( )` ➜ le parent **reçoit** la nouvelle quantité quand le compteur la change
- `[( )]` ➜ les deux en même temps

Les deux `quantite` ne sont **pas** la même chose :
- à **gauche**, `[(quantite)]` ➜ le **nom du `model`** dans l'enfant
- à **droite**, `"commande.quantite"` ➜ le **signal de la ligne** de commande (étape 11)

**Attention :** à droite on met le signal **sans parenthèses**. On donne **la boîte entière** au compteur pour qu'il puisse **lire ET écrire** dedans. (Avec `commande.quantite()` on donnerait juste un nombre, dans lequel on ne peut pas écrire : Angular refuse même de compiler.)

#### Ce que `[( )]` fait en vrai (sous le capot)

`[( )]` n'est qu'un **raccourci**. Angular le transforme en :

```html
<app-compteur [quantite]="commande.quantite()" (quantiteChange)="commande.quantite.set($event)" />
```

- `[quantite]="commande.quantite()"` ➜ un `input` classique : on envoie la valeur
- `(quantiteChange)` ➜ l'`output` **caché** créé par le `model` (son nom = le nom du model + `Change`)
- `commande.quantite.set($event)` ➜ on range la nouvelle valeur dans le signal de la ligne

👉 C'est ce qu'on a fait avec `input` + `output` pour `MenuItem`… mais en **une seule ligne** de chaque côté.

---

## PARTIE 5 : le total ➜ `computed`

### Étape 19 : calculer le total tout seul

Dans `restaurant.ts` :

```ts
total = computed(() =>
  this.commandes().reduce((somme, ligneCommande) => somme + ligneCommande.plat.prix * ligneCommande.quantite(), 0))
```

Dans `restaurant.html`, après le `@for` des commandes :

```html
<h3>Total : {{total()}}</h3>
```

**Pourquoi `computed` ?** Le total, on ne le **choisit** pas : on le **déduit** des commandes. `computed` = une **variable calculée automatiquement** à partir d'autres signals (comme une formule Excel, voir le [tuto directive](../../directives/TUTO-directive.md)). Dès qu'un signal **lu dedans** change, le total se **recalcule tout seul**.

**Le `reduce`, décortiqué :** `reduce` parcourt le tableau et **accumule** un résultat, case par case.
- `0` (tout à la fin) ➜ la valeur de **départ** de `somme`
- `(somme, ligneCommande) => ...` ➜ pour **chaque** ligne : `somme` = ce qu'on a déjà additionné, `ligneCommande` = la ligne en cours
- `somme + ligneCommande.plat.prix * ligneCommande.quantite()` ➜ on ajoute **prix × quantité** de la ligne

Exemple avec Burger (16.50 €) x2 et Risotto (14 €) x1 :
```
départ                          somme = 0
ligne Burger  : 0  + 16.5 * 2 ➜ somme = 33
ligne Risotto : 33 + 14   * 1 ➜ somme = 47   ← le total
```

**De quoi dépend ce `computed` ?** De **tous les signals qu'il lit** :
- `this.commandes()` ➜ il se recalcule quand on **ajoute une ligne** (nouveau tableau, étape 12)
- `ligneCommande.quantite()` ➜ il se recalcule quand on clique sur **`+` ou `-`** dans un compteur

👉 Et voilà **pourquoi** la quantité est un `WritableSignal` dans `LigneCommande` (étape 11) ! Si c'était un simple `number`, le `[(quantite)]` ferait juste `commande.quantite = 3` : personne ne sonnerait la cloche 🔕, et le total resterait **bloqué** sur l'ancien montant.

💡 Petit piège des nombres à virgule en JavaScript : 3 Pavés de Saumon (18.90 €) donnent `56.699999999999996` au lieu de `56.7` 😅. Pour un affichage propre, on utiliserait le pipe `currency` (voir le tuto pipes) : `{{ total() | currency: 'EUR' }}` (pas fait dans la démo).

---

### Le trajet complet d'un clic sur `+`

1. Le client a commandé un Burger ➜ la ligne « Burger » a `quantite = signal(1)` ➜ le compteur affiche `1`, le total vaut `16.5`
2. Il clique sur `+` dans le compteur (enfant) ➜ `augmenter()`
3. ➜ `this.quantite.set(this.quantite() + 1)` : le `model` de l'enfant passe à `2`
4. ➜ Angular envoie **tout seul** `2` au parent (l'output caché `quantiteChange`)
5. ➜ le `[( )]` range `2` dans le signal de la ligne : `commande.quantite.set(2)`
6. ➜ ce signal sonne 🔔 ➜ le `computed` `total` qui le lit se recalcule ➜ `33`
7. ➜ l'écran affiche le compteur à `2` et « Total : 33 »

---

## Récap

| Je veux… | J'écris… |
|---|---|
| décrire la forme d'une donnée | `export interface Plat { ... }` dans un `.model.ts` |
| que l'enfant **reçoive** une info | enfant : `plat = input.required<Plat>()` / parent : `[plat]="..."` |
| lire un input | `plat()` (c'est un signal) |
| que l'enfant **prévienne** le parent | enfant : `platAjouter = output<Plat>()` + `.emit(plat)` |
| que le parent **écoute** | parent : `(platAjouter)="maMethode($event)"` |
| que l'enfant **reçoive ET modifie** une valeur | enfant : `quantite = model.required<number>()` / parent : `[(quantite)]="monSignal"` (signal **sans** parenthèses) |
| utiliser un enfant dans le parent | `imports: [MenuItem, Compteur]` |
| ajouter dans un signal de tableau | `monSignal.update(list => [...list, nouvelElement])` |
| une valeur calculée à partir de signals | `total = computed(() => ...)` |
| additionner tout un tableau | `tableau.reduce((somme, element) => somme + ..., 0)` |

➡️ La version courte est dans [SYNTHESE.md](SYNTHESE.md)
