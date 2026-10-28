# Tuto pas à pas : les Signals (`signal`, `computed`, `linkedSignal`)

> Objectif : 3 petites pages pour comprendre les 3 outils de base des signals :
> - **`signal`** ➜ une liste d'élèves où on peut en ajouter, et le nombre d'élèves qui se met à jour tout seul
> - **`computed`** ➜ un panier `prix x quantité = total`, avec la livraison gratuite dès 50
> - **`linkedSignal`** ➜ on choisit une catégorie (Fruits / Légumes) puis un produit, et le choix se remet à zéro quand on change de catégorie
>
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `src/app/pages/signals/signal-demo/` ➜ la page `signal()`
- `src/app/pages/signals/computed-demo/` ➜ la page `computed()`
- `src/app/pages/signals/linked-signal-demo/` ➜ la page `linkedSignal()`
- `src/app/app.routes.ts` ➜ les 3 routes, rangées sous `/signals/...`

Commandes pour générer les 3 composants :

```bash
ng generate component pages/signals/signal-demo
ng generate component pages/signals/computed-demo
ng generate component pages/signals/linked-signal-demo
```

---

## PARTIE 0 : c'est quoi un signal ? (la boîte et la cloche 🔔)

Un **signal**, c'est une **boîte** 📦 qui contient **une valeur**. Avec une **cloche** 🔔 accrochée dessus.

- On **lit** ce qu'il y a dans la boîte ➜ `maBoite()` (avec des **parenthèses**)
- On **change** ce qu'il y a dans la boîte ➜ `maBoite.set(...)` ou `maBoite.update(...)`
- Quand le contenu change ➜ la cloche **sonne** 🔔 ➜ tous ceux qui **lisent** la boîte sont prévenus : le HTML se redessine, les `computed` se recalculent.

**Pourquoi c'est si important dans notre appli ?** Notre projet est en Angular 22, qui est **zoneless** par défaut : Angular ne surveille **plus tout** en permanence. Pour savoir qu'il doit redessiner l'écran, il écoute **les cloches des signals** (et les events du HTML comme `(click)`). Une variable normale qui change toute seule (dans un `setInterval`, une réponse d'API…) ➜ pas de cloche ➜ l'écran ne bouge pas. Tu l'as vu dans le tuto bindings avec le « compteur propriété » qui reste bloqué.

Les 3 outils :

| Outil | La boîte… | On peut faire `.set()` ? |
|---|---|---|
| `signal` | contient une valeur qu'on **choisit** | ✅ oui |
| `computed` | contient une valeur **calculée** à partir d'autres signals | ❌ non, jamais |
| `linkedSignal` | contient une valeur **calculée**… **mais** qu'on peut quand même changer à la main | ✅ oui |

---

## PARTIE 1 : `signal()` ➜ la page des élèves

### Étape 1 : créer les signals

Dans `signal-demo.ts` :

```ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-signal-demo',
  styleUrl: './signal-demo.scss',
  templateUrl: './signal-demo.html',
})
export class SignalDemo {
  compteur = signal<number>(0)

  eleves = signal<string[]>(["Alice", "Bob"])
  nouveauEleve = signal<string>('')
```

- `import { ..., signal } from '@angular/core'` ➜ `signal` est une **fonction** d'Angular, on l'importe.
- `FormsModule` dans `imports` ➜ parce qu'on va utiliser `[(ngModel)]` dans le HTML (voir le tuto bindings).
- `signal<string[]>(["Alice", "Bob"])` ➜ on crée une boîte qui contient **un tableau de textes**, avec Alice et Bob dedans au départ.
  - `<string[]>` ➜ on dit à TypeScript **ce qu'il y aura** dans la boîte.
  - `(["Alice", "Bob"])` ➜ la **valeur de départ**. Elle est **obligatoire** : une boîte n'est jamais vide.
- `nouveauEleve = signal<string>('')` ➜ la boîte qui va contenir **ce que l'utilisateur tape** dans l'input. Au départ : un texte vide.
- `compteur` ➜ pas utilisé dans la page, c'est juste un exemple d'un signal de type `number`.

---

### Étape 2 : relier l'input au signal ➜ `[(ngModel)]`

Dans `signal-demo.html` :

```html
<label>Rajouter un nouvel élève</label>
<input type="text" [(ngModel)]="nouveauEleve">
<button (click)="AjouterEleve()">Ajouter élève</button>
```

- `[(ngModel)]="nouveauEleve"` ➜ la « banane dans la boîte » 🍌📦 : ce que l'utilisateur tape est **rangé tout seul** dans le signal `nouveauEleve`, et inversement.
- ⚠️ `nouveauEleve` **sans parenthèses** ! On donne **la boîte entière** à `ngModel` pour qu'il puisse **écrire dedans**. Avec `nouveauEleve()` on lui donnerait juste le texte, dans lequel on ne peut pas écrire.
- `(click)="AjouterEleve()"` ➜ au clic, on appelle la méthode de l'étape 4.

---

### Étape 3 : le nombre d'élèves ➜ un `computed` VS une variable normale

Dans `signal-demo.ts` :

```ts
  nombreEleves = computed(() => this.eleves().length)

  nombreElevesSansComputed : number = this.eleves().length
```

Les deux lignes ont l'air pareilles… mais elles ne font **pas du tout** la même chose :

- `nombreEleves = computed(() => this.eleves().length)` ➜ une boîte **calculée** (on la voit en détail à la partie 2). Comme elle **lit** `this.eleves()` dans sa fonction, elle est **abonnée** à la cloche d'`eleves`. Un élève de plus ➜ 🔔 ➜ elle recalcule ➜ `3`.
- `nombreElevesSansComputed : number = this.eleves().length` ➜ une variable **normale**. Elle lit la longueur **une seule fois**, à la création du composant (`2`)… et puis c'est fini. Elle est **figée** : aucun abonnement, elle n'entend jamais la cloche.

Dans `signal-demo.html` :

```html
<p>Le nombre d'élèves est de <strong>{{nombreEleves()}}</strong></p>
<p>Le nombre d'élèves sans abonnement au signal : <strong>{{nombreElevesSansComputed}}</strong></p>
```

- `nombreEleves()` ➜ **avec** parenthèses : c'est un signal, on lit son contenu.
- `nombreElevesSansComputed` ➜ **sans** parenthèses : c'est un simple nombre.

**Teste :** ajoute un élève ➜ la 1re ligne passe à 3, 4, 5… la 2e reste **bloquée à 2**. C'est **toute** la différence entre « je calcule une fois » et « je reste abonné ».

---

### Étape 4 : ajouter un élève ➜ `update` + nouvelle référence

Dans `signal-demo.ts` :

```ts
  AjouterEleve() : void {
    this.eleves.update((list) => [...list, this.nouveauEleve()])
  }
```

On le construit en **3 étapes** (elles sont en commentaire dans le code) :

**ETAPE 1** ➜ `this.eleves.update((list) => [])`
- `update` ➜ « donne-moi ce qu'il y a dans la boîte (`list`), et je te rends **la nouvelle valeur** ».
- `[]` ➜ on rend un **nouveau tableau**. (Vide pour l'instant : on vient de perdre Alice et Bob 😅.)

**ETAPE 2** ➜ `this.eleves.update((list) => [...list])`
- `...list` ➜ le **spread** : on **recopie** tous les élèves de l'ancien tableau dans le nouveau. On a donc un **nouveau** tableau avec **le même contenu**.

**ETAPE 3** ➜ `this.eleves.update((list) => [...list, this.nouveauEleve()])`
- `, this.nouveauEleve()` ➜ on rajoute **à la fin** ce que l'utilisateur a tapé (avec parenthèses : on lit le signal).

**`set` ou `update` ?**
- `set(valeur)` ➜ « remplace tout par **cette** valeur ». Quand la nouvelle valeur **ne dépend pas** de l'ancienne (ex : `this.categorie.set('Fruits')`).
- `update(ancienne => nouvelle)` ➜ quand la nouvelle valeur **dépend** de l'ancienne (ajouter un élève, faire `+1`…).

---

### ⚠️ Le piège : pourquoi PAS `push` ?

```ts
// MAUVAIS
this.eleves().push(this.nouveauEleve())
```

**Pourquoi c'est faux ?** Un signal compare l'**ancienne** et la **nouvelle** valeur pour savoir s'il doit sonner :
- pour un `number` ou un `string` ➜ il compare **la valeur** (`2` ≠ `3` ➜ 🔔)
- pour un **tableau** ou un **objet** ➜ il compare **la référence**, c'est-à-dire « est-ce que c'est **le même** tableau en mémoire ? »

Avec `push`, on ajoute un élève **dans** le même tableau. Même tableau = même référence ➜ pour le signal, **rien n'a changé** ➜ pas de cloche 🔕.

Résultat si tu testes : `nombreEleves()` reste **bloqué** sur l'ancien nombre, car le `computed` n'a jamais été prévenu.

Avec `[...list, ...]`, on crée un **nouveau** tableau ➜ nouvelle référence ➜ 🔔 ➜ tout le monde se met à jour.

👉 **Règle d'or : avec un signal de tableau ou d'objet, toujours créer un nouveau tableau / un nouvel objet.**

---

## PARTIE 2 : `computed()` ➜ la page du panier

### Étape 5 : les signals de départ

Dans `computed-demo.ts` :

```ts
import { Component, computed, signal } from '@angular/core';

export class ComputedDemo {
  prix = signal<number>(10)
  quantite = signal<number>(1)
```

Deux boîtes normales : le prix (10) et la quantité (1). Ce sont **les seules** valeurs qu'on choisit. Tout le reste va se **calculer**.

---

### Étape 6 : le total ➜ `computed`

```ts
  total = computed(() => this.prix() * this.quantite())
```

**Quoi ?** `computed` = une boîte dont la valeur est **calculée automatiquement** à partir d'autres signals. Comme une **formule Excel** : `C1 = A1 * B1`. Tu changes A1 ➜ C1 se met à jour tout seul.

Décortiquons :
- `computed(() => ...)` ➜ on lui donne une **fonction** qui fait le calcul.
- `this.prix() * this.quantite()` ➜ le calcul. Et surtout : en **lisant** `prix()` et `quantite()` **dans** cette fonction, le `computed` s'**abonne** tout seul à leurs cloches. Pas besoin de lui dire « écoute prix et quantité » : il le **voit** en lisant.
- Si le prix change ➜ 🔔 ➜ total recalculé. Si la quantité change ➜ 🔔 ➜ total recalculé. Si les deux changent ➜ pareil.

**Et le type ?** On n'a pas écrit `computed<number>` : pas besoin ! `this.prix() * this.quantite()` renvoie un nombre, donc TypeScript devine tout seul que `total` est un signal de `number`.

**Pourquoi on ne peut pas faire `this.total.set(100)` ?** Parce qu'un `computed` est en **lecture seule**. Sa valeur, c'est **la formule** qui la décide. Si on pouvait écrire dedans, le total ne serait plus égal à `prix x quantité` et tout deviendrait faux. TypeScript refuse même de compiler : `set` n'existe pas sur un `computed`.

---

### Étape 7 : un `computed` qui dépend d'un `computed`

```ts
  EstLivraisonGratuite = computed(() =>  this.total() >= 50)

  livraisonGratuite = computed(() =>  this.total() >= 50 ? "Livraison gratuite" : "Livraison payante")
```

- `EstLivraisonGratuite` ➜ `this.total() >= 50` renvoie `true` ou `false` ➜ c'est un signal de **boolean**.
- `livraisonGratuite` ➜ avec le **ternaire** `condition ? siVrai : siFaux`, on renvoie un **texte** ➜ c'est un signal de **string**.
- Les deux **lisent** `this.total()` ➜ ils sont abonnés à `total`… qui est lui-même abonné à `prix` et `quantite`.

C'est une **chaîne de cloches** 🔔➜🔔➜🔔 : je clique sur `+` ➜ `quantite` sonne ➜ `total` se recalcule et sonne ➜ `EstLivraisonGratuite` et `livraisonGratuite` se recalculent ➜ l'écran se met à jour.

💡 Bonus : un `computed` est **malin**. Il ne recalcule que **quand on le lit** et **si** un de ses signals a changé. Sinon il garde son résultat en mémoire. Tu peux lire `total()` 100 fois dans le HTML : la multiplication n'est faite **qu'une fois**.

---

### Étape 8 : les boutons ➜ on ne touche QUE aux signals de départ

```ts
  augmenter() {
    this.quantite.update(q => q + 1)
  }

  diminuer() {
    if(this.quantite() <= 1) return;

    this.quantite.update(q => q - 1)
  }
```

- `update(q => q + 1)` ➜ la nouvelle quantité **dépend** de l'ancienne ➜ `update`.
- `if(this.quantite() <= 1) return;` ➜ on ne descend **pas sous 1** : si on est déjà à 1, on sort de la méthode sans rien faire.
- Remarque : on ne touche **jamais** à `total` ni à la livraison. On change juste la quantité, et **tout le reste suit** tout seul. C'est ça la force du `computed`.

Dans `computed-demo.html` :

```html
<p class="calcul">{{prix()}} x {{quantite()}} = <strong>{{total()}}</strong></p>

<button (click)="augmenter()">Augmenter +</button>
<button (click)="diminuer()">Diminuer -</button>

<h3>Livraison</h3>
<p>EstLivraisonGratuite() : <code>{{EstLivraisonGratuite()}}</code></p>
<p>livraisonGratuite() : <strong>{{livraisonGratuite()}}</strong></p>
```

**Teste :** clique 4 fois sur « Augmenter + » ➜ `10 x 5 = 50` ➜ `true` et « Livraison gratuite ». Redescends à 4 ➜ `false` et « Livraison payante ».

---

## PARTIE 3 : `linkedSignal()` ➜ la page Fruits / Légumes

### Le problème à résoudre

On veut :
1. une **catégorie** (Fruits ou Légumes)
2. la **liste des produits** de cette catégorie ➜ calculée ➜ `computed` ✅
3. le **produit choisi** par l'utilisateur… ➜ 🤔

Pour le choix :
- avec un `signal` ➜ l'utilisateur peut choisir ✅… mais si on passe de Fruits à Légumes, le choix reste sur « Banane » alors que Banane n'est **pas** un légume ❌
- avec un `computed` ➜ il se remet bien sur le 1er produit quand la catégorie change ✅… mais l'utilisateur ne peut **pas** choisir, car pas de `set` ❌

Il nous faut **les deux en même temps** ➜ c'est `linkedSignal`.

---

### Étape 9 : la catégorie et les produits

Dans `linked-signal-demo.ts` :

```ts
import { Component, computed, linkedSignal, signal } from '@angular/core';

export class LinkedSignalDemo {
  categorie = signal<string>('Fruits');

  produits = computed(() =>
    this.categorie() === 'Fruits'
    ? ['Pomme', 'Banane', 'Poire']
    : ['Carotte', 'Poireau', 'Tomate']
  )
```

- `categorie` ➜ un signal normal : c'est l'utilisateur qui la choisit avec les boutons.
- `produits` ➜ un `computed` : si la catégorie est `'Fruits'` ➜ Pomme, Banane, Poire. **Sinon** ➜ Carotte, Poireau, Tomate. Il lit `this.categorie()` ➜ il est abonné à sa cloche.

---

### Étape 10 : le choix ➜ `linkedSignal`

```ts
  choix = linkedSignal(() => this.produits()[0])
```

- `linkedSignal(() => ...)` ➜ comme un `computed` : on lui donne une fonction de calcul.
- `this.produits()[0]` ➜ le **premier** produit de la liste (index `0`). Au départ : `'Pomme'`.
- Il **lit** `this.produits()` ➜ il est abonné : à chaque fois que la liste change, il **revient** au premier élément.
- **MAIS** contrairement à `computed`, il a un `.set()` ➜ l'utilisateur peut choisir un autre produit.

Résumé : `linkedSignal` = « **par défaut** je suis calculé, mais tu as **le droit** de me changer à la main… jusqu'à ce que ce dont je dépends change, et là je me **recalcule** ».

---

### Étape 11 : les méthodes

```ts
  changerCategorieEnFruit() : void {
    this.categorie.set('Fruits')
  }

  changerCategorieEnLegume() : void {
    this.categorie.set('Légumes')
  }

  choisirProduit(produit : string) : void {
    this.choix.set(produit)
  }
```

- `this.categorie.set(...)` ➜ `set` car la nouvelle catégorie **ne dépend pas** de l'ancienne.
- `this.choix.set(produit)` ➜ **impossible** avec un `computed`, **possible** avec un `linkedSignal`. C'est la ligne qui fait toute la différence.

---

### Étape 12 : le HTML

Dans `linked-signal-demo.html` :

```html
<h3>Catégorie : {{categorie()}}</h3>
<button (click)="changerCategorieEnFruit()">Fruits</button>
<button (click)="changerCategorieEnLegume()">Légumes</button>

<h3>Choisis un produit</h3>
@for (produit of produits(); track $index) {
  <button class="produit" [class.choisi]="produit === choix()" (click)="choisirProduit(produit)">{{produit}}</button>
}

<p class="choix">CHOIX : <strong>{{choix()}}</strong></p>
```

- `@for (produit of produits(); ...)` ➜ un bouton **par produit** de la liste calculée (voir le [tuto control flow](../directive-demo/TUTO-control-flow.md)).
- `[class.choisi]="produit === choix()"` ➜ on met la classe CSS `choisi` (bouton coloré) **seulement** sur le produit actuellement choisi.
- `(click)="choisirProduit(produit)"` ➜ au clic, on range **ce** produit dans `choix`.

**Le trajet complet :**
1. Au départ ➜ catégorie `Fruits` ➜ produits `Pomme, Banane, Poire` ➜ choix `Pomme` (calculé)
2. Je clique sur « Banane » ➜ `choix.set('Banane')` ➜ choix `Banane` (changé à la main ✋)
3. Je clique sur « Légumes » ➜ `categorie` sonne 🔔 ➜ `produits` se recalcule ➜ `Carotte, Poireau, Tomate` ➜ sonne 🔔 ➜ `choix` se **recalcule** ➜ `Carotte`
4. Je clique sur « Poireau » ➜ choix `Poireau` (à la main ✋)

💡 Petit détail : si on est déjà sur Fruits et qu'on re-clique sur « Fruits », le choix **ne bouge pas**. Pourquoi ? `set('Fruits')` alors que la boîte contient déjà `'Fruits'` ➜ même valeur ➜ le signal **ne sonne pas** ➜ rien n'est recalculé.

---

## PARTIE 4 : les routes ➜ `/signals/...`

Dans `app.routes.ts`, les 3 pages sont **regroupées** sous un même préfixe avec `children` :

```ts
{
  path: 'signals',
  children: [
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
```

- `path: 'signals'` **sans composant** ➜ il sert juste de **préfixe** dans l'URL.
- `{ path: '', redirectTo: 'signal', ... }` ➜ si on tape juste `/signals`, on part sur `/signals/signal`.
- Le détail est dans le bonus du [tuto routing](../page-a/TUTO.md).

---

## Récap

| Je veux… | J'écris… |
|---|---|
| créer une boîte avec une valeur | `x = signal<number>(0)` |
| lire la valeur (TS ou HTML) | `x()` **avec parenthèses** |
| remplacer la valeur | `x.set(5)` |
| changer la valeur à partir de l'ancienne | `x.update(v => v + 1)` |
| ajouter dans un signal de tableau | `liste.update(l => [...l, nouveau])` (**jamais** `push`) |
| une valeur calculée, en lecture seule | `total = computed(() => this.a() * this.b())` |
| une valeur calculée qu'on peut aussi changer à la main | `choix = linkedSignal(() => this.liste()[0])` |
| relier un input à un signal | `[(ngModel)]="monSignal"` **sans parenthèses** |

➡️ La version courte est dans [SYNTHESE.md](SYNTHESE.md)
