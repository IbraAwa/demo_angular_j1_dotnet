# Synthèse : le Control Flow (`@if`, `@for`, `@switch`, `@let`)

## C'est quoi ?

Le **control flow**, ce sont les **if, boucles et switch… mais directement dans le HTML**.
Ton HTML n'est plus juste une page figée : il peut **décider** quoi afficher et **répéter** des morceaux automatiquement.

| Syntaxe | Rôle | Équivalent C# |
|---|---|---|
| `@if (condition) { ... } @else { ... }` | afficher un bloc **seulement si** la condition est vraie | `if / else` |
| `@for (item of liste(); track ...) { ... } @empty { ... }` | **répéter** un bloc pour chaque élément d'un tableau | `foreach` |
| `@switch (valeur) { @case (x) { ... } @default { ... } }` | afficher un bloc différent **selon une valeur** | `switch / case / default` |
| `@let nom = expression;` | créer une **petite variable** directement dans le HTML (en **lecture seule** : elle se recalcule toute seule, on ne peut pas la réassigner) | `var nom = ...;` (mais sans pouvoir la réassigner) |

Les petits bonus du `@for` :
- `track` ➜ **obligatoire** : dit à Angular comment **reconnaître** chaque élément (un id, ou la valeur elle-même si elle est unique)
- `$index` ➜ la position de l'élément dans le tableau (commence à **0**)
- `@empty` ➜ ce qu'on affiche si le tableau est **vide**

## Pourquoi ?

- **Afficher selon la situation** : un message d'alerte seulement quand il faut (`@if`).
- **Ne pas copier-coller du HTML** : 100 produits = **un seul** bloc `@for`, pas 100 `<tr>` écrits à la main.
- **Les données pilotent l'affichage** : on ajoute un produit dans le tableau du TS ➜ une ligne apparaît toute seule dans le tableau HTML.
- **`track` = performance** : quand la liste change, Angular sait quelle ligne est quelle ligne et ne redessine que ce qui a changé.

## Exemple métier qui parle à tout le monde

La **gestion de stock d'une épicerie** :
- `@for` ➜ afficher la liste des fruits en rayon dans un tableau (pomme, poire, banane, kiwi)
- `@empty` ➜ si le rayon est vide : « votre tableau est vide »
- `@if` ➜ si le stock descend à 3 ou moins : « Votre stock est bas » ⚠️
- `@switch` ➜ stock à 10 : « au maximum », stock à 5 : « à la moitié », sinon on affiche le nombre
- `@let` ➜ on calcule `estBas` une seule fois en haut du HTML pour ne pas réécrire `stock() <= 3` partout

C'est exactement ce que fait la page `directive-demo` (et l'exercice `directive-bonus` avec une liste de tâches).

➡️ Le pas à pas complet est dans [TUTO-control-flow.md](TUTO-control-flow.md)
