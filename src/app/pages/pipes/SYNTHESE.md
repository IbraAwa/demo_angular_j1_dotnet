# Synthèse : les Pipes

> Concept utilisé dans 2 dossiers :
> - `src/app/pages/pipes/` ➜ la page qui **utilise** les pipes
> - `src/app/pipes/` ➜ notre pipe **personnalisé** `ToFahrenheitPipe`

## C'est quoi ?

Un **pipe** c'est un **petit transformateur d'affichage**. Tu lui donnes une valeur, il te la rend **jolie** pour l'écran.
Il s'écrit avec le symbole `|` (la barre verticale, le « pipe » = le tuyau en anglais) :

```html
{{ valeur | nomDuPipe }}
{{ valeur | nomDuPipe : parametre }}
```

On peut voir ça comme un tuyau : la valeur rentre d'un côté, elle passe dans le tuyau, et elle ressort transformée de l'autre côté.

**Important :** le pipe ne change **PAS** ta variable dans le TS. Il change uniquement **ce qui est affiché**.

## Les pipes fournis par Angular (dans `@angular/common`)

| Pipe | Avant | Après |
|---|---|---|
| `uppercase` | `Salut les gars` | `SALUT LES GARS` |
| `date: 'dd/MM/yyyy'` | `Thu Oct 08 2026 00:00:00 GMT+0200…` | `08/10/2026` |
| `currency: 'EUR'` | `1250.5` | `€1,250.50` |

Et il y en a plein d'autres : `lowercase`, `percent`, `decimal`, `json`, `slice`…

## Et un pipe à nous ?

Quand Angular n'a pas le pipe qu'il nous faut, on le crée. Il suffit :
1. d'une classe avec `@Pipe({ name: 'leNomDansLeHtml' })`
2. qui implémente `PipeTransform`
3. avec une méthode `transform(valeur, ...parametres)` qui **retourne** la valeur transformée

C'est ce qu'on fait avec `toFahrenheit` : 21 °C ➜ `69.8 °F`.

## Pourquoi ?

- **Ne pas polluer le TS** : sans pipe, il faudrait créer une variable `prixAffiche`, `dateAffichee`, `messageEnMajuscules`… pour chaque donnée. Avec un pipe, on garde la donnée brute dans le TS et on la formate **au moment de l'afficher**.
- **Réutilisable partout** : tu écris le pipe une fois, tu l'utilises dans toutes tes pages.
- **Une seule source de vérité** : si demain le format de date change, tu le changes à un seul endroit.

## Exemple métier qui parle à tout le monde

Un **ticket de caisse** au supermarché :
- En base de données le prix c'est `1250.5` ➜ sur le ticket on veut voir `1 250,50 €` ➜ pipe `currency`
- La date est stockée en format machine ➜ sur le ticket on veut `08/10/2026` ➜ pipe `date`
- Le nom du magasin doit être en majuscules ➜ pipe `uppercase`

Et pour notre pipe perso : une **appli météo** utilisée par des Belges ET des Américains. La température est stockée en °C, mais pour les Américains on l'affiche en °F ➜ pipe `toFahrenheit`.

➡️ Le pas à pas complet est dans [TUTO.md](TUTO.md)
