# 🚗 Page GARAGE : la suite ➜ le composant Compteur

Maintenant qu'on a fait **`input` / `output`**, on passe à l'étape suivante : un enfant qui **reçoit** une valeur **et** qui la **renvoie modifiée** au parent.

> Prérequis : avoir terminé la première partie de l'exercice ➜ [exercice.md](exercice.md)

---

## 1. Composant Enfant (`Compteur`)

Je veux que vous créiez un composant enfant **compteur**.

* **Il ne sait pas ce qu'il compte** : des voitures, des plats, des billets de concert… il s'en fiche. Il manipule juste **un nombre**.
* **Son rôle :**
  * recevoir une **quantité de base** de la part du parent ;
  * appliquer **-1** ou **+1** selon le bouton cliqué par l'utilisateur.
* **Affichage :** un bouton `-`, la quantité, un bouton `+`.
* **Entrée ET sortie en même temps :** la quantité doit être un **`model()`** (et pas un `input()` + un `output()` séparés).

---

## 2. Composant Parent (`Garage`)

* **Envoie** la quantité de base au compteur.
* **Reçoit** la nouvelle quantité modifiée par l'enfant grâce au **two-way binding `[( )]`** (la « banane dans la boîte » 🍌📦).
* **Affiche** le compteur uniquement quand une voiture a été commandée, avec un message du genre :
  « Vous commandez **3** x **Porsche 911 Carrera** ».

---

💡 Indice : on a fait exactement la même chose dans la démo **restaurant** (le compteur des plats commandés).
