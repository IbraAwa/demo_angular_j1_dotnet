# Synthèse : la communication Parent ➜ Enfant (`input` / `output` / `model`)

## C'est quoi ?

Un **composant parent** utilise un **composant enfant** dans son HTML, comme une balise :

```html
<app-menu-item [plat]="menuItem" (platAjouter)="AjouterCommande($event)" />
```

Et ils se parlent dans les **deux sens** :

| Sens | Outil | Dans l'enfant | Dans la balise chez le parent |
|---|---|---|---|
| Parent ➜ Enfant (je **donne** une info) | `input` | `plat = input.required<Plat>()` | `[plat]="menuItem"` |
| Enfant ➜ Parent (je **préviens** le parent) | `output` | `platAjouter = output<Plat>()` + `.emit(...)` | `(platAjouter)="AjouterCommande($event)"` |
| **Les deux** (je donne une valeur que l'enfant a le droit de **modifier**) | `model` | `quantite = model.required<number>()` + `.set(...)` | `[(quantite)]="commande.quantite"` |

Même logique que les bindings :
- `[ ]` = **j'envoie** une info ➜ input
- `( )` = **je reçois** une info ➜ output
- `[( )]` = la « banane dans la boîte » 🍌📦 = **les deux** ➜ model

**`model` = `input` + `output` en même temps.** L'enfant `Compteur` reçoit la quantité, fait `+1` / `-1`, et Angular **renvoie tout seul** la nouvelle valeur au parent (pas besoin d'écrire de `emit`). Côté parent, on donne le signal **sans parenthèses** (la boîte entière) pour que l'enfant puisse écrire dedans.

Et le **model** (`plat.model.ts`) c'est le **contrat** qui dit à quoi ressemble un `Plat` (nom, prix, description, végétarien). Parent et enfant parlent la même langue grâce à lui.

## Qui fait quoi ?

- **Le parent** (`Restaurant`) = le **Smart component** 🧠 : il possède les données (la carte, les commandes) et la logique (ajouter une commande). Plus tard c'est lui qui appellera l'API/le service.
- **L'enfant** (`MenuItem`) = le **Dumb component** 🎨 (composant de présentation) : il ne sait **rien** du restaurant. Il reçoit **un** plat, il l'affiche joliment, et quand on clique il **prévient** le parent. C'est tout.
- **L'enfant** (`Compteur`) = encore plus « bête » : il ne sait même **pas ce qu'il compte**. Il reçoit un nombre, fait `-1` / `+1`. C'est le restaurant qui sait que ce nombre = la quantité d'un plat. (Un compteur identique sert à compter des **voitures** dans l'exercice garage : la preuve qu'il est réutilisable.)

## Pourquoi ?

- **Réutiliser** : la carte d'un plat (`MenuItem`) peut servir sur la page de la carte, sur une page « Top 3 des plats », sur la page « Suggestion du chef »… **sans dupliquer** le HTML et le CSS.
- **Séparer les rôles** : l'enfant gère **l'affichage**, le parent gère **la logique**. Chacun son job, le code est plus clair.
- **L'enfant ne décide pas** : il dit juste « on a cliqué sur ce plat », et c'est le parent qui décide quoi faire (ajouter au panier, ouvrir un détail, etc.). Le même enfant peut donc servir à plein de choses différentes.

## Petit point important : le signal et la nouvelle référence

Pour ajouter une commande, on fait :

```ts
this.commandes.update(list => [...list, LigneCommande])
```

et **PAS** `this.commandes().push(LigneCommande)`.
Pourquoi ? Un signal détecte un changement quand il reçoit une **nouvelle référence** (un **nouveau** tableau), pas quand on modifie l'intérieur de l'ancien. `[...list, LigneCommande]` crée un **nouveau tableau** = ancien contenu + la nouvelle ligne.

⚠️ Dans notre démo, un `push` **semble** marcher quand même : la nouvelle ligne s'affiche. C'est parce que le clic sur « Commander » fait rafraîchir l'enfant **et** le parent, et le `@for` relit la liste à ce moment-là. C'est le **clic** qui sauve l'affichage, **pas** le signal. La preuve : le **total** (un `computed`), lui, reste **bloqué** sur l'ancien montant. Et sans clic (données qui arrivent d'une API, d'un `setTimeout`…), même la liste ne bougerait pas. Le détail est dans le tuto.

## Le total ➜ `computed`

```ts
total = computed(() =>
  this.commandes().reduce((somme, ligneCommande) => somme + ligneCommande.plat.prix * ligneCommande.quantite(), 0))
```

- `computed` = une valeur **calculée automatiquement** à partir des signals qu'elle lit.
- Il lit `commandes()` ➜ recalcul quand on **ajoute une ligne**.
- Il lit chaque `quantite()` ➜ recalcul quand on clique sur **`+` / `-`**.
- C'est pour ça que, dans `LigneCommande`, la quantité est un **`WritableSignal<number>`** et pas un simple `number` : sinon le compteur changerait le nombre sans sonner la cloche 🔕 et le total resterait faux.

## Exemple métier qui parle à tout le monde

Un **restaurant** 🍔 :
- Le **serveur** (parent) a la carte complète et le carnet de commandes.
- Chaque **fiche plat** plastifiée sur la table (enfant) affiche **un** plat : nom, description, prix, badge « végétarien ».
- Le serveur **donne** une fiche par plat (`[plat]`) ➜ **input**
- Le client tape sur « Commander » sur la fiche ➜ la fiche **prévient** le serveur (`(platAjouter)`) ➜ **output**
- Le serveur **note** la commande dans son carnet ➜ `AjouterCommande` dans le parent.
- Le client dit « finalement j'en veux 2 » ➜ le serveur corrige la quantité sur sa ligne ➜ **compteur** + `[(quantite)]` ➜ **model**
- L'addition se met à jour toute seule ➜ `total` ➜ **computed**

La fiche ne sait pas écrire dans le carnet. Elle dit juste « ce plat-là ! ». C'est le serveur qui gère.

➡️ Le pas à pas complet est dans [TUTO.md](TUTO.md)
