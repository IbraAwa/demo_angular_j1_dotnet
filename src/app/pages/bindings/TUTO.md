# Tuto pas à pas : les Bindings

> Objectif : construire une petite fiche produit (un clavier) où on peut voir le stock, en rajouter, commander, choisir une quantité et voir le total.
> On va avancer **ligne par ligne**, okay ? À chaque fois je te dis **quoi** on écrit et surtout **pourquoi**.

Fichiers utilisés :
- `bindings.ts` ➜ la logique (les données et les méthodes)
- `bindings.html` ➜ ce que l'utilisateur voit
- `bindings.scss` ➜ le style

---

## Étape 0 : importer `FormsModule`

Dans `bindings.ts` :

```ts
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bindings',
  imports: [FormsModule],
  ...
})
```

**Pourquoi ?** Plus tard on va utiliser `[(ngModel)]` sur un `<input>`. Ce `ngModel`, il n'est pas dans Angular « de base », il est rangé dans la boîte à outils `FormsModule`.
Si tu oublies de le mettre dans `imports: [...]`, Angular te dit qu'il ne connaît pas `ngModel` et ça plante.

👉 Règle à retenir : **tout composant, directive ou pipe que tu utilises dans le HTML, tu dois l'importer dans `imports` du composant. Qu'il vienne d'Angular (`FormsModule`, `RouterLink`…) ou de toi (`MenuItem`, `ColorButton`…).**
Seules exceptions : les balises HTML normales (`<p>`, `<button>`…) et le control flow (`@if`, `@for`…).

---

## Étape 1 : afficher le nom du produit ➜ l'interpolation `{{ }}`

### Dans le TS

```ts
productName = 'Clavier mécanique';
```

**Pourquoi une variable ?** Parce que le nom du produit, dans la vraie vie, il vient d'une base de données. On ne va pas l'écrire en dur dans le HTML. On le met dans une variable, et le HTML va **lire** cette variable.

**Pourquoi pas un signal ici ?** Parce que le nom du produit **ne change jamais** pendant qu'on est sur la page. Pas besoin de prévenir Angular d'un changement qui n'arrive jamais.

### Dans le HTML

```html
<h2>{{ productName }}</h2>
```

**Comment ça marche ?** Les doubles accolades `{{ }}` disent à Angular : « Va chercher la variable `productName` dans le TS et écris sa valeur ici, comme du texte. »

Résultat à l'écran : **Clavier mécanique**.

---

## Étape 2 : afficher la photo ➜ le property binding `[ ]`

### Dans le TS

```ts
imageUrl = 'https://picsum.photos/seed/clavier/200/120';
```

**Pourquoi ?** Même raison : l'adresse de l'image vient normalement de la base de données, donc on la range dans une variable.

### Dans le HTML

```html
<img [src]="imageUrl" alt="Photo du produit" />
```

**Pourquoi des crochets `[src]` ?** Parce que si tu écris `src="imageUrl"` sans crochets, le navigateur va chercher une image qui s'appelle littéralement **« imageUrl »**… qui n'existe pas.
Avec les crochets, tu dis à Angular : « Ce qu'il y a entre les guillemets, **ce n'est pas du texte, c'est du code TS** : va chercher la valeur de la variable `imageUrl`. »

👉 `[ ]` = **j'envoie** une info du TS vers une propriété de la balise.

---

## Étape 3 : le stock ➜ notre premier signal

### Dans le TS

```ts
stock = signal(0);
```

**Pourquoi un signal cette fois ?** Parce que le stock, **lui, il va changer** (on va cliquer sur des boutons pour en rajouter). Et quand il change, il faut que l'écran se mette à jour.
Un signal, c'est une boîte qui **sonne une cloche** 🔔 à chaque fois que son contenu change. Angular entend la cloche et redessine ce qu'il faut.

`signal(0)` ➜ on crée la boîte et on met **0** dedans au départ (le magasin est vide).

### Dans le HTML

```html
<p>Stock : {{ stock() }}</p>
```

**Pourquoi `stock()` avec des parenthèses ?** Parce que `stock` c'est **la boîte**, et `stock()` c'est **ce qu'il y a dans la boîte**. Pour lire un signal, on « l'appelle » avec `()`.
Si tu oublies les parenthèses, tu affiches la boîte elle-même et pas le nombre.

---

## Étape 4 : rajouter du stock ➜ l'event binding `( )` + `update`

### Dans le TS

```ts
restock(amount: number) {
  this.stock.update((s) => s + amount);
}
```

Ligne par ligne :

1. `restock(amount: number)` ➜ on crée une méthode qui reçoit **combien** on veut rajouter. Pourquoi un paramètre ? Comme ça on peut utiliser la **même** méthode pour le bouton +1 et le bouton +10. Pas besoin d'écrire deux méthodes.
2. `this.stock.update(...)` ➜ on veut changer la valeur du signal **en partant de l'ancienne valeur**. C'est exactement le rôle de `update`.
   - `set(...)` = « remplace par cette valeur-là » (on se fiche de l'ancienne)
   - `update(...)` = « prends l'ancienne valeur et calcule la nouvelle »
3. `(s) => s + amount` ➜ c'est une petite fonction (une fonction fléchée) :
   - `s` = l'ancienne valeur du stock (Angular nous la donne)
   - `s + amount` = la nouvelle valeur qu'on renvoie
   - Exemple : stock à 3, je clique sur +10 ➜ `s = 3`, on renvoie `3 + 10 = 13`.

### Dans le HTML

```html
<button (click)="restock(1)">+1</button>
<button (click)="restock(10)">+10</button>
```

**Pourquoi des parenthèses `(click)` ?** Parce que cette fois l'info va dans l'autre sens : c'est l'**utilisateur** qui fait un truc (il clique) et on veut **prévenir le TS**.
`(click)="restock(1)"` ➜ « Quand on clique, appelle la méthode `restock` avec 1. »

👉 `( )` = **je reçois** un événement de la balise.

Et comme `stock` est un signal, dès que `update` change la valeur, le `{{ stock() }}` de l'étape 3 se met à jour **tout seul**. Magique ✨

---

## Étape 5 : bloquer le bouton Commander si le stock est vide ➜ `[disabled]`

```html
<button [disabled]="stock() === 0">Commander</button>
```

**Pourquoi ?** On ne peut pas commander un produit qu'on n'a plus.
`[disabled]="stock() === 0"` ➜ Angular calcule `stock() === 0` :
- si c'est `true` ➜ le bouton est grisé
- si c'est `false` ➜ le bouton est cliquable

Encore des crochets, car on **envoie** une valeur (vrai/faux) vers la propriété `disabled` du bouton.

---

## Étape 6 : barrer « Disponibilité » en rouge ➜ `[class.xxx]`

### Dans le SCSS

```scss
.epuise { color: red; text-decoration: line-through; }
```

On prépare une classe CSS `epuise` : texte rouge et barré.

### Dans le HTML

```html
<p [class.epuise]="stock() === 0">Disponibilité</p>
```

**Pourquoi `[class.epuise]` ?** Ça veut dire : « Mets la classe `epuise` sur ce `<p>` **seulement si** la condition est vraie. »
Stock à 0 ➜ la classe est ajoutée ➜ texte rouge barré. Stock > 0 ➜ la classe est retirée ➜ texte normal.

---

## Étape 7 : une barre qui grandit avec le stock ➜ `[style.xxx]`

### Dans le SCSS

```scss
.barre { height: 10px; background: green; max-width: 100%; }
```

Une barre verte de 10px de haut, qui ne peut pas dépasser 100% de la largeur.

### Dans le HTML

```html
<div class="barre" [style.width.%]="stock() * 10"></div>
```

**Pourquoi `[style.width.%]` ?** On change **directement** un style CSS depuis le TS :
- `style.width` ➜ on touche à la largeur
- `.%` ➜ l'unité, ici des pourcentages
- `stock() * 10` ➜ stock à 3 ➜ largeur 30%. Stock à 10 ➜ 100%.

---

## Étape 8 : choisir une quantité et voir le total ➜ le two-way binding `[( )]`

### Dans le TS

```ts
quantity = signal(1);
```

**Pourquoi un signal ?** La quantité va changer quand le client tape dans l'input, et le total doit se recalculer. Donc on a besoin que ça prévienne Angular 🔔.
On met **1** au départ car commander 0 clavier, ça n'a pas trop de sens.

### Dans le HTML

```html
<input type="number" [(ngModel)]="quantity" />
<p>Total : {{ quantity() * 49.9 }}</p>
```

**Pourquoi `[(ngModel)]` ?** On veut que ça marche **dans les deux sens** :
- TS ➜ HTML : au départ l'input affiche `1` (la valeur du signal)
- HTML ➜ TS : quand le client tape `3`, le signal `quantity` passe à `3`

C'est `[ ]` + `( )` en même temps, d'où la « banane dans la boîte » `[( )]` 🍌📦.
(Et c'est pour ça qu'on a importé `FormsModule` à l'étape 0 !)

**Attention :** dans `[(ngModel)]="quantity"` on met le signal **sans** parenthèses, car on donne **la boîte entière** à `ngModel` pour qu'il puisse lire ET écrire dedans.
Par contre dans `{{ quantity() * 49.9 }}` on veut **lire** la valeur, donc avec parenthèses.

Le total se recalcule tout seul : quantité 3 ➜ `3 * 49.9 = 149.7`.

---

## Étape 9 : réagir à la touche Entrée ➜ `(keyup.enter)` + `$event`

### Dans le TS

```ts
onKey(event: Event) {
  console.log((event.target as HTMLInputElement).value);
}
```

Ligne par ligne :
1. `onKey(event: Event)` ➜ la méthode reçoit **l'événement** complet (toutes les infos sur ce qui vient de se passer).
2. `event.target` ➜ c'est **la balise** qui a déclenché l'événement, ici notre `<input>`.
3. `as HTMLInputElement` ➜ on dit à TypeScript : « T'inquiète, c'est un input », sinon il ne sait pas que ça possède un `.value`.
4. `.value` ➜ le texte tapé dedans. On l'affiche dans la console.

### Dans le HTML

```html
<input (keyup.enter)="onKey($event)" placeholder="Tapez puis Entrée" />
```

- `(keyup.enter)` ➜ Angular écoute uniquement quand on **relâche la touche Entrée**. Pas besoin de vérifier nous-mêmes quelle touche a été pressée.
- `$event` ➜ c'est un mot magique d'Angular : il contient l'événement, et on le passe à notre méthode.

---

## Étape 10 : LA preuve que les signals sont nécessaires

On va faire deux compteurs qui augmentent toutes les secondes : un **sans** signal et un **avec**.

### Dans le TS

```ts
secondsWrong = 0;
secondsRight = signal(0);
```

- `secondsWrong` ➜ une variable **classique**, pas de cloche 🔕
- `secondsRight` ➜ un **signal**, avec la cloche 🔔

```ts
startWrong() {
  setInterval(() => {
    this.secondsWrong++;
    console.log('secondsWrong =', this.secondsWrong);
  }, 1000);
}
```

- `setInterval(..., 1000)` ➜ exécute le code à l'intérieur **toutes les 1000 ms** (= chaque seconde).
- `this.secondsWrong++` ➜ on ajoute 1 à la variable classique.
- `console.log(...)` ➜ on l'affiche dans la console pour **prouver** que la valeur change bien.

```ts
startRight() {
  setInterval(() => {
    this.secondsRight.update((s) => s + 1);
  }, 1000);
}
```

- Pareil, sauf qu'on passe par `update` : ancienne valeur `s`, nouvelle valeur `s + 1`. Et `update` sonne la cloche 🔔.

### Dans le HTML

```html
<button (click)="startWrong()">Compteur propriété</button>
<p>Propriété simple : {{ secondsWrong }}</p>
<button (click)="startRight()">Compteur signal</button>
<p>Signal : {{ secondsRight() }}</p>
```

### Ce qu'on observe

⚠️ **L'ordre des clics compte !** Pour que la preuve marche, recharge la page et clique **d'abord et uniquement** sur « Compteur propriété ». On verra juste après pourquoi.

- **Compteur propriété (lancé tout seul)** ➜ dans la console ça monte, mais **à l'écran ça reste bloqué** sur 0.
- **Compteur signal** ➜ ça monte à l'écran : 1, 2, 3, 4…

**Pourquoi ?** Parce que personne ne prévient Angular que `secondsWrong` a changé. Angular ne va pas surveiller toutes tes variables en permanence, il attend qu'on sonne la cloche. Le signal, lui, sonne la cloche à chaque `update`.

#### Le comportement par défaut vs ce que tu vas peut-être voir

**La règle (comportement par défaut) :** une variable classique qui change **ne prévient pas** Angular ➜ l'écran ne se met pas à jour.

**Mais dans notre page, la propriété peut « se débloquer » dans 2 cas :**
1. **Tu cliques sur un bouton de la page** (`+1`, `+10`, « Compteur signal »…) ➜ un clic sur un bouton qui a un `(click)` fait toujours **redessiner tout le composant**. Au passage, Angular relit `secondsWrong`… et la valeur **saute d'un coup** à la vraie valeur (ex : 0 ➜ 12). Par contre, cliquer dans le vide ne fait rien.
2. **Le compteur signal tourne en même temps** ➜ à chaque seconde, le signal sonne et Angular redessine **tout le composant**, pas juste la ligne du signal. Du coup `secondsWrong` est relue aussi et **suit chaque seconde**. Elle profite de la cloche du voisin, comme un passager clandestin 🚌.

**La différence :** le signal met à jour l'écran **par lui-même**. La variable classique ne s'affiche à jour que **par chance**, quand quelque chose d'autre fait redessiner la page. Dès qu'elle est toute seule, elle reste bloquée.

👉 **Conclusion : une donnée qui change et qui est affichée = un signal.**

💡 Bonus, à tester :
- si tu cliques **2 fois** sur un bouton compteur, tu lances **2** `setInterval` ➜ le compteur va **2 fois plus vite**.
- si tu quittes la page, les `setInterval` **continuent de tourner** (regarde la console !). C'est exactement pour ça qu'il existe `ngOnDestroy` : le bon endroit pour arrêter un timer quand on quitte la page (voir [le tuto routing](../page-a/TUTO.md), partie 4).

---

## Récap

| Je veux… | J'écris… |
|---|---|
| afficher une valeur | `{{ variable }}` |
| remplir une propriété d'une balise | `[propriete]="variable"` |
| réagir à une action de l'utilisateur | `(evenement)="methode()"` |
| lier un input dans les deux sens | `[(ngModel)]="monSignal"` + `FormsModule` |
| mettre une classe sous condition | `[class.nomClasse]="condition"` |
| changer un style | `[style.propriete.unite]="valeur"` |
| créer une donnée qui change | `signal(valeurDeDepart)` |
| lire un signal | `monSignal()` |
| remplacer la valeur | `monSignal.set(nouvelleValeur)` |
| calculer à partir de l'ancienne | `monSignal.update(ancienne => nouvelle)` |

➡️ La version courte est dans [SYNTHESE.md](SYNTHESE.md)
