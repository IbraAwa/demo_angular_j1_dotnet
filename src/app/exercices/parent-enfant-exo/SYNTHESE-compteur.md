# Synthèse : le Compteur ➜ `model()` et le two-way binding `[( )]`

> Concept utilisé dans 2 dossiers :
> - `src/app/exercices/parent-enfant-exo/enfants/compteur/` ➜ l'enfant `Compteur`
> - `src/app/exercices/parent-enfant-exo/parents/garage/` ➜ le parent `Garage` qui l'utilise

## C'est quoi `model()` ?

Jusqu'ici on avait 2 outils pour parler entre parent et enfant :

| Sens | Outil | Dans l'enfant | Dans la balise chez le parent |
|---|---|---|---|
| Parent ➜ Enfant | `input` | `voiture = input.required<Voiture>()` | `[voiture]="voiture"` |
| Enfant ➜ Parent | `output` | `voitureCommander = output<Voiture>()` + `.emit(...)` | `(voitureCommander)="ajouterCommande($event)"` |
| **Les deux en même temps** | **`model`** | `quantite = model.required<number>()` | `[(quantite)]="quantite"` |

Un **`model`**, c'est un `input` que l'enfant a **aussi le droit de modifier**. En gros : **`model` = `input` + `output` en même temps**.

- Le parent **envoie** la quantité de base ➜ comme un `input` `[ ]`
- L'enfant fait `+1` / `-1` avec `.update(...)` ➜ Angular **renvoie tout seul** la nouvelle valeur au parent ➜ comme un `output` `( )`, mais **sans écrire de `emit`**
- Côté parent on écrit `[( )]` : la **banane dans la boîte** 🍌📦 (comme `[(ngModel)]` dans les bindings)

## La limite entre le Compteur et le Garage (qui fait quoi ?)

**Le Compteur (l'enfant) = le Dumb component** 🎨
- Il **ne sait pas ce qu'il compte**. Des voitures ? Des plats ? Des billets ? Il s'en fiche.
- Son **seul** rôle : recevoir une quantité de base et faire **-1** ou **+1** quand l'utilisateur clique.

**Le Garage (le parent) = le Smart component** 🧠
- **Lui** est dans le **contexte**. Il sait que ce nombre veut dire : **combien de fois on commande la voiture**.
- **Lui** connaît la **règle métier** : on peut commander **la même voiture plusieurs fois**, mais **pas plusieurs voitures différentes**.
  ➜ Si on clique sur « Commander » sur une **autre** voiture, elle **remplace** l'ancienne et la quantité **repart à 1**.
- **Lui** envoie la quantité de base (`1`) et **reçoit** la quantité choisie par le client.

👉 Le compteur ne pourrait **pas** gérer cette règle : il ne sait même pas qu'il compte des voitures ! C'est pour ça que la règle est dans le garage.

## Pourquoi un composant enfant et pas directement dans le Garage ?

On **aurait pu** mettre les boutons `-` / `+` directement dans `garage.html`. Ça marche. Mais :

- **Réutiliser** : le compteur du garage fait **exactement la même chose** que celui de la démo **restaurant**. Là-bas il compte des **plats** 🍔, ici des **voitures** 🚗, demain des billets de concert 🎫. C'est **justement parce qu'il ne sait pas ce qu'il compte** qu'il marche partout.
  ⚠️ Dans l'exercice, on le **recrée** dans le dossier du garage pour s'entraîner : c'est donc une **copie**. Dans un vrai projet, on ne le copierait **pas** : on le rangerait **une seule fois** dans un dossier partagé (par exemple `src/app/shared/compteur/`), et le restaurant **et** le garage importeraient **le même fichier**. On l'écrit une fois, on le corrige une fois.
- **Séparer les rôles** : le garage s'occupe de la **logique métier** (quelle voiture, quelle règle), le compteur s'occupe d'**un petit morceau d'affichage** (les boutons + le nombre).
- **Un garage plus lisible** : dans `garage.html`, une seule ligne `<app-compteur [(quantite)]="quantite" />` au lieu de 2 boutons, 2 méthodes et leur style.

## `set()` ou `update()` : lequel choisir ?

Les deux **changent** la valeur d'un signal (ou d'un `model`). Les deux **sonnent la cloche** 🔔. La seule différence, c'est **comment** on donne la nouvelle valeur :

| | `set(valeur)` | `update(ancienne => nouvelle)` |
|---|---|---|
| Ça veut dire | « **remplace** par cette valeur-là » | « **prends l'ancienne** valeur et calcule la nouvelle » |
| L'ancienne valeur | on s'en **fiche** | on en a **besoin** |
| Dans notre exo | `this.quantite.set(1)` ➜ on **remet** la quantité de base | `this.quantite.update(q => q + 1)` ➜ on **ajoute** 1 à ce qu'il y avait |

### Technique n°1 : la question magique 🪄

> **« Est-ce que j'ai besoin de l'ancienne valeur pour calculer la nouvelle ? »**

- **Non** ➜ `set`
- **Oui** ➜ `update`

### Technique n°2 : dis-le en français 🗣️

Dis ce que tu veux faire à voix haute, et écoute le **verbe** :

| Si tu dis… | C'est… | Exemple du cours |
|---|---|---|
| « **mets** », « **remets à** », « **remplace par** », « **choisis** » | `set` | `hovered.set(true)` (directive), `quantite.set(1)`, `voitureCommander.set(voiture)` |
| « **ajoute** », « **enlève** », « **augmente** », « **diminue** », « **rajoute dans la liste** », « **inverse** » | `update` | `quantite.update(q => q + 1)`, `stock.update(s => s - count)`, `commandes.update(list => [...list, LigneCommande])` |

### Technique n°3 : le détecteur de `update` déguisé 🕵️

Si tu te surprends à écrire le signal **des deux côtés** :

```ts
this.quantite.set(this.quantite() + 1)   // 🤔 je relis quantite() pour la remettre dans quantite
```

➜ C'est un **`update` déguisé** ! Ça marche (c'est ce que fait le compteur de la démo restaurant), mais c'est plus propre d'écrire :

```ts
this.quantite.update(q => q + 1)          // ✅ Angular me donne l'ancienne valeur dans q
```

👉 Règle : **si tu lis le signal à l'intérieur de son propre `set(...)`, passe à `update`.**

### Technique n°4 : le cas des tableaux 📦

Ajouter / retirer un élément dans un tableau, ça **dépend toujours** de l'ancien tableau ➜ toujours `update`, avec un **nouveau** tableau :

```ts
this.commandes.update(list => [...list, nouvelleCommande])   // ✅ ajouter
this.commandes.set([])                                        // ✅ vider : on se fiche de l'ancien ➜ set
```

## Exemple métier qui parle à tout le monde

Le **compteur de quantité** sur un site e-commerce 🛒 :
- Sur la page d'un **t-shirt**, il compte des t-shirts.
- Dans le **panier**, il compte chaque article.
- Sur un site de **cinéma**, il compte des places.

C'est **toujours le même** petit composant `- 1 +`. C'est la **page** (le parent) qui sait ce qu'on compte et quelles sont les règles (stock maximum, une seule séance à la fois…).

➡️ Le pas à pas complet est dans [TUTO-compteur.md](TUTO-compteur.md)
➡️ L'énoncé est dans [exercice-suite.md](exercice-suite.md)
