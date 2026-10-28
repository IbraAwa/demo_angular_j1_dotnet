# Tuto pas à pas : le Control Flow (`@if`, `@for`, `@switch`, `@let`)

> Objectif : une petite gestion de stock. Un bouton retire du stock, des messages s'affichent selon le niveau du stock, et un tableau liste les produits.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `directive-demo.ts` ➜ les données et la méthode
- `directive-demo.html` ➜ l'affichage avec le control flow

> 💡 `@if`, `@for`, `@switch` et `@let` font partie d'Angular directement : **pas besoin de les importer**, contrairement aux pipes et aux directives.

---

## PARTIE 1 : le stock avec `@let`, `@if` et `@switch`

### Étape 1 : le stock ➜ un signal

Dans `directive-demo.ts` :

```ts
stock = signal<number>(10)
```

**Pourquoi un signal ?** Le stock va **diminuer** quand on clique sur le bouton, et les messages à l'écran doivent changer en même temps. Le signal prévient Angular 🔔 à chaque changement.

**Pourquoi `<number>` ?** On dit clairement à TypeScript : « Dans cette boîte, il n'y aura **que des nombres**. » Si quelqu'un essaie d'y mettre du texte, TypeScript râle tout de suite.

**Pourquoi 10 ?** On démarre avec un stock plein.

```ts
stockDemo = 15
```

Une variable classique qui n'est pas utilisée dans le HTML. Elle est là pour comparer : elle, ce n'est **pas** un signal.

---

### Étape 2 : retirer du stock ➜ `update`

```ts
Destock(count : number) {
  this.stock.update((s) => s - count)
}
```

Ligne par ligne :
1. `Destock(count : number)` ➜ une méthode qui reçoit **combien** on retire. Pourquoi un paramètre ? Pour pouvoir retirer 1, 5, 10… avec la **même** méthode.
2. `this.stock.update(...)` ➜ on change le signal **en partant de l'ancienne valeur**.
3. `(s) => s - count` ➜ `s` = l'ancien stock, on renvoie `s - count`. Stock à 10, on retire 1 ➜ `10 - 1 = 9`.

**Et avec `set`, on pourrait ?** Oui ! Ça marche aussi :

```ts
this.stock.set(this.stock() - count)
```

On lit l'ancien stock nous-mêmes avec `this.stock()`, on calcule, et on **remplace** par le résultat.
Mais `update` est **plus propre** ici : Angular te **donne** directement l'ancienne valeur (`s`), pas besoin d'aller la relire toi-même. C'est plus court, et en lisant `update` on comprend tout de suite : « je pars de l'ancienne valeur ».

**Alors, quand utiliser l'un ou l'autre ?**
- `set(valeur)` ➜ quand la nouvelle valeur **ne dépend pas** de l'ancienne. On s'en fiche de ce qu'il y avait avant.
  Ex : `this.stock.set(10)` pour remettre le stock au max, `hovered.set(true)` dans la directive `ColorButton`.
- `update(ancienne => nouvelle)` ➜ quand la nouvelle valeur **se calcule à partir** de l'ancienne.
  Ex : retirer 1 du stock, ajouter 10, ajouter un élément dans un tableau (`[...list, plat]`).

Dans `directive-demo.html` :

```html
<button (click)="Destock(1)" ...>Retirer du stock</button>
```

À chaque clic ➜ `Destock(1)` ➜ le stock baisse de 1.

---

### Étape 3 : une variable dans le HTML ➜ `@let`

Tout en haut de `directive-demo.html` :

```html
@let estBas = stock() <= 3;
```

**Pourquoi ?** On veut savoir si le stock est « bas » (3 ou moins). Au lieu de réécrire `stock() <= 3` partout dans le HTML, on le calcule **une fois** et on lui donne un **nom clair** : `estBas`.

Décortiquons :
- `@let` ➜ « je crée une variable dans le HTML »
- `estBas` ➜ son nom
- `stock() <= 3` ➜ sa valeur : `true` si le stock est à 3 ou moins, sinon `false`
- `;` ➜ **obligatoire** à la fin, ne l'oublie pas !

Et comme `stock()` est un signal, `estBas` se **recalcule tout seul** quand le stock change.

⚠️ Une variable `@let` est en **lecture seule** : tu ne peux **pas** la modifier toi-même dans le HTML (pas de `estBas = true` dans un `(click)` par exemple). Elle se recalcule **toute seule** à partir de son expression. Si tu veux une valeur que tu modifies, c'est un **signal** dans le TS.

---

### Étape 4 : afficher une alerte ➜ `@if`

```html
@if(estBas) {
  <p>Votre stock est bas</p>
}
```

**Pourquoi ?** Le message « Votre stock est bas » ne doit apparaître **que** quand c'est vrai. Sinon ça n'a pas de sens.

- `@if(estBas)` ➜ « si `estBas` est `true`… »
- `{ ... }` ➜ « …alors affiche ce qu'il y a entre les accolades »
- Si c'est `false` ➜ le `<p>` **n'existe pas du tout** dans la page (il n'est pas caché, il n'est **pas créé**).

On peut aussi ajouter un `@else` (on le voit dans l'exercice `directive-bonus`) :

```html
@if (EstToutTerminer()) {
  <p>Toutes les tâches sont faites.</p>
} @else {
  <p>Il y a encore des choses à faire.</p>
}
```

---

### Étape 5 : un message selon la valeur ➜ `@switch`

```html
@switch(stock()) {
  @case(10) { <p>Votre stock est au maximum</p>}
  @case(5) { <p>Vous êtes à la moitié de votre stock</p>}
  @default { <p>votre stock est  {{stock()}} </p>}
}
```

**Pourquoi un `@switch` et pas plein de `@if` ?** Quand on compare **la même valeur** à plusieurs possibilités, le switch est beaucoup plus lisible.

Décortiquons :
- `@switch(stock())` ➜ « regarde la valeur du stock »
- `@case(10)` ➜ « si c'est **exactement** 10 ➜ affiche ça »
- `@case(5)` ➜ « si c'est **exactement** 5 ➜ affiche ça »
- `@default` ➜ « dans **tous les autres cas** ➜ affiche ça ». Ici on affiche le nombre avec `{{stock()}}`.

**Seul UN bloc s'affiche à la fois.** Clique et regarde : 10 ➜ « au maximum », 9 ➜ « votre stock est 9 », …, 5 ➜ « à la moitié », etc.

---

## PARTIE 2 : le tableau avec `@for`

### Étape 6 : les données du tableau ➜ des signals de tableaux

Dans `directive-demo.ts` :

```ts
nameColonnes = signal<string[]>([
  "Numéro de produit",
  "Nom produit",
])
```

**Pourquoi ?** Plutôt que d'écrire les titres de colonnes **en dur** dans le HTML, on les range dans un tableau. Comme ça, ajouter une colonne = ajouter **une ligne** dans le TS.

**Pourquoi `<string[]>` ?** `string[]` = « un tableau de textes ». On dit à TypeScript ce qu'il y aura dedans.

```ts
produits = signal<string[]>(["pomme", "poire", "banane", "Kiwi"])
// INDEX                        0        1        2        3
```

**Pourquoi ?** C'est la liste des produits à afficher. Dans la vraie vie, elle viendrait d'une API.
Le commentaire `INDEX` rappelle que **les positions commencent à 0** : `pomme` est en position 0, `Kiwi` en position 3.

---

### Étape 7 : les titres des colonnes ➜ premier `@for`

Dans `directive-demo.html` :

```html
<table border="3">
  <thead>
    <tr>
      @for(nameColonne of nameColonnes(); track nameColonne) {
        <th>{{nameColonne}}</th>
      }
    </tr>
  </thead>
```

- `<table>`, `<thead>`, `<tr>` ➜ du HTML classique : un tableau, son en-tête, **une ligne** (`tr` = table row).
- `@for(nameColonne of nameColonnes(); ...)` ➜ « **pour chaque** élément du tableau `nameColonnes()`, appelle-le `nameColonne` et… »
  - `nameColonnes()` avec **parenthèses** car c'est un signal, on lit son contenu
  - `nameColonne` (sans s) ➜ c'est **un seul** élément à chaque tour de boucle, on choisit le nom qu'on veut
- `track nameColonne` ➜ **obligatoire**. On dit à Angular : « Pour reconnaître chaque élément, utilise sa valeur. » Ça marche ici car deux colonnes n'ont jamais le même nom.
- `<th>{{nameColonne}}</th>` ➜ « …crée une case de titre avec son nom ».

Résultat : la boucle tourne 2 fois ➜ 2 `<th>` : « Numéro de produit » et « Nom produit ».

**Pourquoi `track` est obligatoire ?** Imagine que tu supprimes « poire » de la liste. Sans `track`, Angular ne sait pas quelle ligne a disparu et risque de tout redessiner. Avec `track`, il sait exactement laquelle retirer. C'est une question de **performance**.

---

### Étape 8 : les lignes des produits ➜ `@for` avec `$index`

```html
  <tbody>
    @for(produit of produits(); track produit; let i = $index) {
      <tr>
        <td>{{i}}</td>
        <td>{{produit}}</td>
      </tr>
    }
```

- `@for(produit of produits(); track produit; ...)` ➜ pareil : pour chaque produit, et on le reconnaît par sa valeur.
- `let i = $index` ➜ **nouveau** : `$index` est une variable magique d'Angular qui donne **la position** de l'élément dans le tableau. On la range dans `i` pour l'utiliser.
- `<tr>` ➜ **une ligne par produit** (cette fois le `<tr>` est **dans** la boucle, car on veut une ligne à chaque tour).
- `<td>{{i}}</td>` ➜ 1re colonne : le numéro (0, 1, 2, 3)
- `<td>{{produit}}</td>` ➜ 2e colonne : le nom du produit

Résultat :

| Numéro de produit | Nom produit |
|---|---|
| 0 | pomme |
| 1 | poire |
| 2 | banane |
| 3 | Kiwi |

💡 Si tu veux que ça commence à 1 pour l'utilisateur : `{{ i + 1 }}` (c'est ce qui est fait dans l'exercice `directive-bonus`).

---

### Étape 9 : le tableau est vide ➜ `@empty`

```html
    } @empty {
      <p>votre tableau est vide</p>
    }
  </tbody>
</table>
```

**Pourquoi ?** Si `produits()` est un tableau vide `[]`, la boucle ne tourne pas du tout et l'utilisateur voit un tableau vide sans explication. `@empty` permet d'afficher un message à la place.

**Comment tester ?** Remplace `["pomme", "poire", "banane", "Kiwi"]` par `[]` dans le TS.

💡 Petit conseil : dans un `<tbody>`, le navigateur s'attend à des `<tr>`. C'est plus propre de faire comme dans l'exercice `directive-bonus` :

```html
} @empty {
  <tr>
    <td [attr.colspan]="nameColonnes().length">Pas de tâche en cours</td>
  </tr>
}
```

`[attr.colspan]` ➜ la case prend toute la largeur du tableau (autant de colonnes qu'il y a de titres).

---

## Récap

| Je veux… | J'écris… |
|---|---|
| créer une variable dans le HTML | `@let nom = expression;` |
| afficher sous condition | `@if (cond) { ... } @else { ... }` |
| choisir selon une valeur | `@switch (val) { @case (x) { ... } @default { ... } }` |
| répéter pour chaque élément | `@for (item of liste(); track item.id) { ... }` |
| connaître la position | `let i = $index` (commence à 0) |
| gérer le tableau vide | `} @empty { ... }` |

➡️ La version courte est dans [SYNTHESE-control-flow.md](SYNTHESE-control-flow.md)
