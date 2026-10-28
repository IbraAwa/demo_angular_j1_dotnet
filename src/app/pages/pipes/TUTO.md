# Tuto pas à pas : les Pipes

> Objectif : afficher un message en majuscules, une date bien formatée, un prix en euros, et créer **notre propre pipe** qui convertit des °C en °F.
> On avance **ligne par ligne**, okay ? À chaque fois : **quoi** et **pourquoi**.

Fichiers utilisés :
- `src/app/pages/pipes/pipes.ts` et `pipes.html` ➜ la page qui utilise les pipes
- `src/app/pipes/to-fahrenheit-pipe.ts` ➜ notre pipe perso

---

## PARTIE 1 : utiliser les pipes d'Angular

### Étape 1 : préparer les données brutes dans le TS

Dans `pipes.ts` :

```ts
message = 'Salut les gars';
today = new Date(2026, 9, 8);
price = 1250.5;
```

**Pourquoi ces 3 variables ?** Ce sont nos **données brutes**, comme elles arriveraient d'une base de données. Elles ne sont pas « jolies » et c'est normal : le TS stocke, le pipe formatera.

- `message` ➜ un texte normal
- `today = new Date(2026, 9, 8)` ➜ une vraie date JavaScript.
  ⚠️ **Piège** : les mois commencent à **0** en JavaScript ! `0` = janvier, `1` = février… donc `9` = **octobre**. C'est le 8 octobre 2026.
- `price = 1250.5` ➜ un simple nombre, sans symbole € ni rien.

**Pourquoi pas de signal ?** Ces valeurs ne changent pas pendant la démo, on veut juste les afficher.

---

### Étape 2 : importer les pipes

Dans `pipes.ts` :

```ts
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-pipes',
  imports: [UpperCasePipe, DatePipe, CurrencyPipe, ToFahrenheitPipe],
  ...
})
```

**Pourquoi ?** Les pipes d'Angular sont rangés dans `@angular/common`. Mais Angular ne les met pas automatiquement à disposition de ton composant : **tu dois dire lesquels tu utilises** dans `imports: [...]`.
Si tu oublies, Angular te dit : « Je ne connais pas le pipe `uppercase` » et ça plante.

👉 Remarque : le **nom de la classe** (`UpperCasePipe`) c'est ce qu'on importe dans le TS, et le **nom du pipe** (`uppercase`) c'est ce qu'on écrit dans le HTML.

(`ToFahrenheitPipe` c'est notre pipe à nous, on le crée dans la partie 2.)

---

### Étape 3 : `uppercase`

Dans `pipes.html` :

```html
<p>{{ message | uppercase }}</p>
```

**Comment ça se lit ?** « Prends `message`, fais-le passer dans le tuyau `uppercase`, et affiche le résultat. »

Résultat : **SALUT LES GARS**.
Et dans le TS, `message` vaut toujours `'Salut les gars'` : le pipe ne modifie **que l'affichage**.

---

### Étape 4 : `date` avec un paramètre

```html
<p>{{ today | date: 'dd/MM/yyyy' }}</p>
```

**Pourquoi `: 'dd/MM/yyyy'` ?** Certains pipes acceptent des **paramètres**, et on les donne après `:`. Ici on dit dans **quel format** on veut la date :
- `dd` ➜ le jour sur 2 chiffres
- `MM` ➜ le mois sur 2 chiffres (avec des **M majuscules**, car `mm` en minuscules ce sont les **minutes** !)
- `yyyy` ➜ l'année sur 4 chiffres

Résultat : **08/10/2026**. Sans le pipe, on aurait eu un truc illisible genre `Thu Oct 08 2026 00:00:00 GMT+0200`.

---

### Étape 5 : `currency`

```html
<p>{{ price | currency: 'EUR' }}</p>
```

**Pourquoi `'EUR'` ?** Le pipe `currency` doit savoir **quelle monnaie** afficher. `'EUR'` ➜ le symbole €, et il ajoute automatiquement les 2 décimales.

Résultat : **€1,250.50** (le format dépend de la langue configurée dans l'appli, par défaut l'anglais).

---

## PARTIE 2 : créer notre propre pipe `toFahrenheit`

> Angular n'a pas de pipe pour convertir des degrés. Pas grave, on le fabrique !

Commande pour générer le fichier :

```bash
ng generate pipe pipes/to-fahrenheit
```

### Étape 6 : le décorateur `@Pipe`

Dans `src/app/pipes/to-fahrenheit-pipe.ts` :

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFahrenheit',
})
```

**Pourquoi `@Pipe` ?** C'est l'étiquette qui dit à Angular : « Cette classe, ce n'est pas un composant, c'est un **pipe**. »

**Pourquoi `name: 'toFahrenheit'` ?** C'est **le nom qu'on va écrire dans le HTML** après le `|`. C'est ce qui fait le lien entre le HTML et cette classe.

---

### Étape 7 : la classe et `PipeTransform`

```ts
export class ToFahrenheitPipe implements PipeTransform {
```

**Pourquoi `implements PipeTransform` ?** C'est un **contrat** : on promet à Angular que notre classe aura bien une méthode `transform`. Si on l'oublie, TypeScript nous le rappelle tout de suite. C'est un filet de sécurité.

---

### Étape 8 : la méthode `transform`

```ts
transform(value: number, decimals = 1): string {
```

C'est **LA** méthode qu'Angular appelle à chaque fois qu'on utilise le pipe. Décortiquons :

- `value: number` ➜ **la valeur à gauche du `|`**. Dans `{{ 21 | toFahrenheit }}`, `value` vaut `21`.
- `decimals = 1` ➜ **le paramètre après le `:`**. Si on n'en donne pas, il vaut **1 par défaut**. Dans `{{ 21 | toFahrenheit: 2 }}`, `decimals` vaut `2`.
- `: string` ➜ ce qu'on **renvoie** : du texte, car on veut ajouter « °F » derrière.

```ts
  const f = (value * 9) / 5 + 32;
```

**Pourquoi ?** C'est la formule de conversion °C ➜ °F : on multiplie par 9, on divise par 5, on ajoute 32.
Exemple : `21 * 9 = 189`, `189 / 5 = 37.8`, `37.8 + 32 = 69.8`.

```ts
  return f.toFixed(decimals) + ' °F';
}
```

- `f.toFixed(decimals)` ➜ arrondit le nombre au nombre de décimales voulu et le transforme en texte. `69.8.toFixed(2)` ➜ `"69.80"`.
- `+ ' °F'` ➜ on colle l'unité derrière.
- `return` ➜ ce texte, c'est **ce qui sera affiché** à l'écran.

---

### Étape 9 : importer notre pipe dans la page

Dans `pipes.ts` :

```ts
import { ToFahrenheitPipe } from '../../pipes/to-fahrenheit-pipe';

imports: [UpperCasePipe, DatePipe, CurrencyPipe, ToFahrenheitPipe],
```

**Pourquoi ?** Exactement comme pour les pipes d'Angular : si on ne le met pas dans `imports`, la page ne le connaît pas. Ce n'est pas parce qu'on l'a créé qu'il est disponible partout automatiquement.

---

### Étape 10 : l'utiliser dans le HTML

```html
<p>{{ 21 | toFahrenheit }}</p>
<p>{{ 21 | toFahrenheit: 2 }}</p>
```

- 1re ligne ➜ pas de paramètre ➜ `decimals` vaut 1 par défaut ➜ **69.8 °F**
- 2e ligne ➜ `: 2` ➜ `decimals` vaut 2 ➜ **69.80 °F**

---

## Récap

| Je veux… | J'écris… |
|---|---|
| utiliser un pipe | `{{ valeur \| nomDuPipe }}` |
| lui donner un paramètre | `{{ valeur \| nomDuPipe : param }}` |
| rendre un pipe dispo dans un composant | le mettre dans `imports: [...]` |
| créer mon pipe | `@Pipe({ name: '...' })` + `implements PipeTransform` + `transform()` |
| que le pipe affiche quelque chose | le `return` de `transform()` |

➡️ La version courte est dans [SYNTHESE.md](SYNTHESE.md)
