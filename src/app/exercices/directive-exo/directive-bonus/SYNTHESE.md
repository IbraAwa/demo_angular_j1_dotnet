# Exercice directive-bonus : liste de tâches

Cet exercice **reprend** le concept du **control flow** (`@for`, `track`, `$index`, `@empty`, `@switch`, `@if` / `@else`) vu dans la démo `directive-demo`.

➡️ Synthèse : [SYNTHESE-control-flow.md](../../../pages/directive-demo/SYNTHESE-control-flow.md)
➡️ Tuto pas à pas : [TUTO-control-flow.md](../../../pages/directive-demo/TUTO-control-flow.md)

Pour le model `Tache` (l'interface), regarde comment on crée un model dans le tuto parent-enfant (partie 1) :
➡️ [TUTO.md parent-enfant](../../../pages/parent-enfant-demo/TUTO.md)

## Le petit nouveau : le `type` union `Priorite`

Dans `Tache.ts` :

```ts
export type Priorite = 'haute' | 'moyenne' | 'basse';

export interface Tache {
  id: number;
  titre: string;
  done: boolean;
  priorite: Priorite;
}
```

- `type Priorite = ...` ➜ on crée **notre propre type**, avec un nom clair.
- `'haute' | 'moyenne' | 'basse'` ➜ le `|` veut dire **« OU »** : une priorité ne peut être **que** l'un de ces 3 textes, rien d'autre.
- `priorite: Priorite` ➜ dans l'interface, on utilise ce type au lieu d'un simple `string`.

**Pourquoi pas juste `priorite: string` ?** Avec `string`, on pourrait écrire `priorite: 'urgent'` ou `'Haute'` (avec une majuscule) sans erreur… et le `@switch` du HTML tomberait dans le `@default` sans prévenir. Avec `Priorite`, TypeScript **râle tout de suite** 🚨 si on écrit autre chose que `'haute'`, `'moyenne'` ou `'basse'`.

👉 Différence avec l'interface : une **interface** décrit la forme d'un **objet** (plusieurs propriétés). Un **type union** décrit une **liste fermée de valeurs possibles**.

Pour le `update((list) => [...list])` dans `Termine()` (pourquoi on crée un **nouveau tableau** pour que le signal réagisse) :
➡️ [TUTO.md parent-enfant, étape 12](../../../pages/parent-enfant-demo/TUTO.md)
