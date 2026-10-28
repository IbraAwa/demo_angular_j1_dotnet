# Tuto pas à pas : créer une directive d'attribut (`ColorButton`)

> Objectif : quand je passe ma souris sur le bouton, il prend une couleur choisie dans `hoverColor`. Quand je ne suis plus dessus, il reprend sa couleur de base choisie directement avec `appColorButton`.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `src/app/directives/color-button.ts` ➜ la directive
- `src/app/pages/directive-demo/directive-demo.ts` et `.html` ➜ la page qui l'utilise

Commande pour générer le fichier :

```bash
ng generate directive directives/color-button
```

---

## Étape 0 : les imports

Tout en haut de `color-button.ts` :

```ts
import { computed, Directive, input, signal } from "@angular/core";
```

**Pourquoi ?** Le CLI n'importe que `Directive`. Mais on va aussi utiliser `signal` (étape 2), `input` (étapes 3 et 4) et `computed` (étape 5). Tout vient de `@angular/core`, donc on les ajoute dans la même ligne.

---

## Étape 1 : le décorateur `@Directive` et le `selector`

```ts
@Directive({
  selector: 'button[appColorButton], a[appColorButton]',
  ...
})
```

**Pourquoi `@Directive` et pas `@Component` ?** Parce qu'on ne crée pas une nouvelle balise avec son HTML. On veut juste **ajouter un pouvoir** à des balises qui existent déjà. Une directive n'a **pas de template**.

👉 Le CLI a généré `selector: '[appColorButton]'` (toutes les balises). On le **remplace** par celui ci-dessus.

**Pourquoi ce selector bizarre ?** Le selector dit **sur quelles balises** la directive s'active. Lisons-le :
- `button[appColorButton]` ➜ « un `<button>` qui possède l'attribut `appColorButton` »
- `,` ➜ « OU »
- `a[appColorButton]` ➜ « un `<a>` (un lien) qui possède l'attribut `appColorButton` »

Les crochets `[ ]` dans un selector CSS veulent dire « qui a cet attribut ». Donc :

```html
<button appColorButton="red">OK</button>   ✅ la directive s'active
<button>OK</button>                         ❌ rien ne se passe
<div appColorButton="red">OK</div>          ❌ rien non plus, ce n'est ni un button ni un a
```

**Pourquoi limiter à `button` et `a` ?** Parce que ça n'a pas de sens de mettre un effet de bouton sur un paragraphe. On protège la directive contre une mauvaise utilisation.

---

## Étape 2 : se souvenir si la souris est dessus ➜ `signal`

```ts
export class ColorButton {
  hovered = signal(false)
```

**Pourquoi cette variable ?** La directive doit **se souvenir** d'une info : « Est-ce que la souris est sur le bouton en ce moment ? » Oui ou non ➜ un booléen.

**Pourquoi `false` au départ ?** Quand la page s'affiche, personne n'a encore la souris dessus.

**Pourquoi un signal ?** Parce que cette valeur va **changer** (la souris entre, sort, entre…) et la couleur doit changer **en même temps**. Le signal prévient Angular 🔔 et tout ce qui dépend de lui se recalcule.

---

## Étape 3 : la couleur de base ➜ `input` avec un `alias`

```ts
couleur = input("green", { alias: "appColorButton" })
```

**Pourquoi un `input` ?** Parce qu'on veut que **celui qui utilise la directive** choisisse la couleur, directement **dans la balise**. Un `input` = une variable qui est **remplie depuis la balise HTML**.

**Pourquoi `"green"` ?** Le premier paramètre d'`input()` = la **valeur par défaut**, celle qu'on a si personne ne donne de valeur.
⚠️ Petit piège : ici l'attribut `appColorButton` est **obligatoire** pour activer la directive (c'est le selector). Donc si quelqu'un écrit `<button appColorButton>` sans `="..."`, la variable reçoit une **chaîne vide** `""` et pas `"green"`. Retiens juste la règle : premier paramètre d'`input()` = valeur de départ.

**Pourquoi `alias: "appColorButton"` ?** Là c'est le truc malin 🧠.
`appColorButton` sert déjà à **activer** la directive (c'est le selector). Avec l'alias, on lui donne **un deuxième rôle** : sa valeur remplit la variable `couleur`.

```html
<button appColorButton="red">
```

veut dire en même temps :
1. « active la directive ColorButton sur ce bouton »
2. « et mets `"red"` dans la variable `couleur` »

Sans alias, on devrait écrire `<button appColorButton couleur="red">`, c'est plus long et moins joli.

---

## Étape 4 : la couleur au survol ➜ `input` simple

```ts
hoverColor = input('')
```

**Pourquoi ?** On veut aussi choisir la couleur **quand la souris est dessus**, depuis la balise.

**Pourquoi pas d'alias cette fois ?** Parce que le nom de la variable `hoverColor` est déjà parfait comme nom d'attribut. Sans alias, **le nom de l'attribut dans le HTML = le nom de la variable**.

```html
<button appColorButton="red" hoverColor="cyan">
```

➜ `hoverColor` vaut `"cyan"`.

**Pourquoi `''` ?** Valeur par défaut : une chaîne vide. Si on ne donne pas de `hoverColor`, au survol la directive n'impose **aucune** couleur de fond : le bouton reprend son **gris par défaut** du navigateur… mais le texte reste **blanc** (étape 7) ➜ quasi illisible 😬. Donc pense à toujours donner un `hoverColor`.

---

## Étape 5 : calculer la couleur à afficher ➜ `computed`

```ts
color = computed(() => this.hovered() ? this.hoverColor() : this.couleur())
```

**Pourquoi `computed` ?** On a 3 infos (`hovered`, `hoverColor`, `couleur`) et on veut **en déduire** une 4e : la couleur à afficher **maintenant**.
`computed` = une **variable calculée automatiquement** à partir d'autres signals. Et dès qu'un des signals utilisés dedans change, `computed` **se recalcule tout seul**.

C'est comme une formule Excel : `=SI(A1; B1; C1)`. Tu changes A1, le résultat se met à jour tout seul.

Décortiquons :
- `() => ...` ➜ la formule de calcul
- `this.hovered()` ➜ la souris est dessus ?
- `? this.hoverColor()` ➜ si **oui**, on prend la couleur de survol
- `: this.couleur()` ➜ si **non**, on prend la couleur de base

Exemple avec `appColorButton="red" hoverColor="cyan"` :
- souris dehors ➜ `hovered()` = false ➜ `color()` = `"red"`
- souris dessus ➜ `hovered()` = true ➜ `color()` = `"cyan"`

**Pourquoi pas une méthode ?** On pourrait, mais `computed` garde le résultat en mémoire et ne recalcule **que** quand un signal dont il dépend change. C'est plus efficace et c'est fait pour ça.

---

## Étape 6 : écouter la souris ➜ `host` avec `( )`

```ts
host: {
  '(mouseenter)': 'hovered.set(true)',
  '(mouseleave)': 'hovered.set(false)',
  ...
}
```

**C'est quoi `host` ?** Le « host », c'est **la balise sur laquelle la directive est posée** (notre `<button>`). Dans `host` on écrit des bindings comme si on les écrivait **directement sur le bouton**.

**Pourquoi `(mouseenter)` ?** Les parenthèses = **on écoute un événement**, comme `(click)`.
- `mouseenter` ➜ la souris **entre** sur le bouton ➜ on fait `hovered.set(true)`
- `mouseleave` ➜ la souris **sort** du bouton ➜ on fait `hovered.set(false)`

**Pourquoi `set` et pas `update` ?** Parce qu'on se fiche de l'ancienne valeur : on veut juste **mettre** `true` ou `false`. `update` c'est quand la nouvelle valeur **dépend** de l'ancienne.

Et comme `hovered` change ➜ `color` (le `computed`) se recalcule ➜ la couleur change.

---

## Étape 7 : appliquer la couleur ➜ `host` avec `[ ]`

```ts
host: {
  ...
  '[style.backgroundColor]': 'color()',
  '[style.color]': "'white'"
}
```

**Pourquoi des crochets ?** Comme `[style.width.%]` dans les bindings : on **envoie** une valeur vers un style de la balise.

- `'[style.backgroundColor]': 'color()'` ➜ la couleur de fond du bouton = le résultat de notre `computed`. Avec des **parenthèses** car on **lit** le signal.
- `'[style.color]': "'white'"` ➜ le texte du bouton est toujours blanc.
  ⚠️ Remarque les **doubles guillemets + simples guillemets** `"'white'"` : ce qui est entre guillemets est du **code**. Si on écrivait `'white'` tout seul, Angular chercherait une **variable** qui s'appelle `white`. Avec `"'white'"` on lui dit : c'est le **texte** `white`.

---

## Étape 8 : utiliser la directive dans une page

### Dans `directive-demo.ts`

```ts
import { ColorButton } from '../../directives/color-button';

@Component({
  imports: [ColorButton],
  ...
})
```

(L'exercice bonus `DirectiveBonus` n'est plus affiché en bas de cette page : il a maintenant **sa propre route** `/exo/directive`. Donc ici on n'a besoin que de `ColorButton` dans `imports`.)

**Pourquoi ?** Comme pour les pipes : une directive n'est **pas** disponible automatiquement. Si tu oublies de la mettre dans `imports`, Angular voit l'attribut `appColorButton` comme un attribut HTML normal et **il ne se passe rien** (et en plus il ne te met même pas d'erreur, donc attention !).

### Dans `directive-demo.html`

```html
<button (click)="Destock(1)" appColorButton="red" hoverColor="cyan">Retirer du stock</button>
<button (click)="Destock(1)" appColorButton="green" hoverColor="red">Retirer du stock 1</button>
```

- 1er bouton ➜ rouge, cyan au survol
- 2e bouton ➜ vert, rouge au survol
- Et le `(click)` continue de marcher normalement : la directive **ajoute** un pouvoir, elle n'enlève rien au bouton.

**Même directive, deux looks différents** : c'est tout l'intérêt des `input`.

---

## Bonus : `stockDirective`

```ts
stockDirective = input<string>("0")
```

Cet input n'est pas utilisé dans la démo. Il montre juste qu'on peut **typer** un input avec `<string>` et qu'une directive peut avoir **autant d'inputs qu'on veut**. Pour s'en servir on écrirait `<button appColorButton="red" stockDirective="5">`.

---

## Le code final complet

Tout `color-button.ts` assemblé, pour vérifier que tu n'as rien oublié :

```ts
import { computed, Directive, input, signal } from "@angular/core";

@Directive({
  selector: 'button[appColorButton], a[appColorButton]',
  host: {
    '(mouseenter)' : 'hovered.set(true)',
    '(mouseleave)' : 'hovered.set(false)',
    '[style.backgroundColor]' : 'color()',
    '[style.color]' : "'white'"
  }
})
export class ColorButton {
  hovered = signal(false)
  couleur = input("green" , {alias : "appColorButton"})
  hoverColor = input('')
  color = computed(() => this.hovered() ? this.hoverColor() : this.couleur())

  stockDirective = input<string>("0")
}
```

---

## Récap

| Je veux… | J'écris… |
|---|---|
| créer une directive | `@Directive({ selector: '...' })` |
| l'activer sur des balises précises | `selector: 'button[appX], a[appX]'` |
| recevoir une valeur depuis la balise | `maVar = input(valeurParDefaut)` |
| que l'attribut d'activation donne aussi une valeur | `input(..., { alias: 'appX' })` |
| écouter un événement sur la balise | `host: { '(evenement)': '...' }` |
| changer un style de la balise | `host: { '[style.xxx]': '...' }` |
| calculer une valeur à partir de signals | `computed(() => ...)` |
| l'utiliser dans un composant | l'ajouter dans `imports: [...]` |

➡️ La version courte est dans [SYNTHESE-directive.md](SYNTHESE-directive.md)
