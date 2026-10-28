# Synthèse : les Signals (`signal`, `computed`, `linkedSignal`)

> Fichiers :
> - `src/app/pages/signals/signal-demo/` ➜ `signal()` : la liste d'élèves
> - `src/app/pages/signals/computed-demo/` ➜ `computed()` : le panier et la livraison
> - `src/app/pages/signals/linked-signal-demo/` ➜ `linkedSignal()` : Fruits / Légumes
> - URLs : `/signals/signal`, `/signals/computed`, `/signals/linked-signal`

## C'est quoi ?

Un **signal**, c'est une **boîte** 📦 qui contient une valeur, avec une **cloche** 🔔 dessus.
Quand la valeur change, la cloche sonne et **tous ceux qui lisent la boîte** sont prévenus : le HTML se redessine, les valeurs calculées se recalculent.

Il y a 3 sortes de boîtes :

| Outil | Sa valeur… | `.set()` / `.update()` ? | Exemple de la démo |
|---|---|---|---|
| `signal` | on la **choisit** | ✅ oui | `eleves = signal<string[]>(["Alice", "Bob"])` |
| `computed` | est **calculée** à partir d'autres signals | ❌ non (lecture seule) | `total = computed(() => this.prix() * this.quantite())` |
| `linkedSignal` | est **calculée**, **mais** on peut la changer à la main | ✅ oui | `choix = linkedSignal(() => this.produits()[0])` |

Les gestes de base :
- **lire** ➜ `monSignal()` avec **parenthèses** (dans le TS **et** dans le HTML)
- **remplacer** ➜ `monSignal.set(nouvelleValeur)`
- **changer à partir de l'ancienne** ➜ `monSignal.update(ancienne => nouvelle)`

## `signal` ➜ la valeur qu'on choisit

```ts
eleves = signal<string[]>(["Alice", "Bob"])

AjouterEleve() : void {
  this.eleves.update((list) => [...list, this.nouveauEleve()])
}
```

⚠️ **Le piège des tableaux :** un signal compare l'ancienne et la nouvelle valeur pour savoir s'il sonne.
- `number`, `string`, `boolean` ➜ il compare **la valeur**
- tableau, objet ➜ il compare **la référence** (« est-ce le **même** tableau en mémoire ? »)

Donc `this.eleves().push(...)` ➜ même tableau ➜ **pas de cloche** 🔕 ➜ le nombre d'élèves reste bloqué.
Avec `[...list, nouveau]` ➜ **nouveau** tableau ➜ 🔔 ➜ tout se met à jour.

👉 **Règle d'or : avec un signal de tableau ou d'objet, toujours créer un nouveau tableau / un nouvel objet.**

## `computed` ➜ la valeur calculée (formule Excel)

```ts
total = computed(() => this.prix() * this.quantite())
livraisonGratuite = computed(() => this.total() >= 50 ? "Livraison gratuite" : "Livraison payante")
```

- Il **s'abonne tout seul** aux signals qu'il **lit** dans sa fonction (`prix()`, `quantite()`). Pas besoin de lui dire qui écouter.
- Un `computed` peut dépendre d'un autre `computed` ➜ chaîne de cloches : `quantite` 🔔 ➜ `total` 🔔 ➜ `livraisonGratuite`.
- **Lecture seule** : pas de `set` ni d'`update`. Sa valeur, c'est la formule qui la décide.
- **Malin** : il ne recalcule que si un de ses signals a changé, sinon il garde le résultat en mémoire.
- Le **type** est deviné tout seul : `this.total() >= 50` renvoie un boolean ➜ signal de `boolean`.

**`computed` VS variable normale :**

```ts
nombreEleves = computed(() => this.eleves().length)     // 2 ➜ 3 ➜ 4… suit la liste
nombreElevesSansComputed : number = this.eleves().length // 2 pour toujours : FIGÉ
```

La variable normale lit la longueur **une seule fois** à la création du composant. Elle n'est abonnée à rien.

## `linkedSignal` ➜ calculé PAR DÉFAUT, modifiable à la main

```ts
categorie = signal<string>('Fruits');
produits = computed(() => this.categorie() === 'Fruits' ? ['Pomme', 'Banane', 'Poire'] : ['Carotte', 'Poireau', 'Tomate'])
choix = linkedSignal(() => this.produits()[0])

choisirProduit(produit : string) : void {
  this.choix.set(produit) // impossible avec un computed !
}
```

- Comme un `computed` ➜ quand `produits` change, `choix` **revient** au premier produit de la nouvelle liste.
- Comme un `signal` ➜ l'utilisateur peut choisir un autre produit avec `set`.

**Pourquoi pas les autres ?**
- avec un `signal` ➜ on passe en Légumes et le choix reste sur « Banane » ❌
- avec un `computed` ➜ l'utilisateur ne peut pas choisir ❌
- avec un `linkedSignal` ➜ les deux ✅

## Pourquoi c'est si important ?

Notre appli est en Angular 22, **zoneless** : Angular ne surveille plus tout en permanence. Pour savoir qu'il doit redessiner l'écran, il écoute **les cloches des signals** (et les events du HTML comme `(click)`).
Une variable normale modifiée « en douce » (`setInterval`, réponse d'API…) ➜ pas de cloche ➜ l'écran ne bouge pas. Avec un signal ➜ l'écran suit **toujours**.

## Exemple métier qui parle à tout le monde

Un **magasin en ligne** 🛒 :
- le **prix** d'un article et la **quantité** dans le panier ➜ `signal` (c'est l'utilisateur ou le magasin qui les choisit)
- le **total** du panier ➜ `computed` (personne ne le tape à la main : c'est `prix x quantité`, point)
- « **livraison gratuite** dès 50 € » ➜ `computed` qui dépend du total
- la **taille** choisie pour un t-shirt ➜ `linkedSignal` : quand tu changes de modèle, la taille revient à la première taille **disponible** pour ce modèle… mais tu peux toujours en choisir une autre.

➡️ Le pas à pas complet est dans [TUTO.md](TUTO.md)
