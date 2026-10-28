En Angular, voici la présentation simple de l'architecture pour la page **GARAGE** :

---

# 🚗 Spécifications de la Page GARAGE

Ce document décrit l'organisation et la communication entre les composants de la page **Garage**.

---

## 1. Modèle de données (`voiture.model.ts`)

Le modèle définit la structure de données d'un véhicule ainsi qu'un tableau de test contenant plusieurs voitures.

* **Propriétés de l'interface `Voiture` :**
* **nom** *(texte)* : Le nom du modèle
* **marque** *(texte)* : La marque du constructeur
* **litrEssenceMaximum** *(nombre)* : La capacité maximale du réservoir en litres
* **IsLuxe** *(booléen)* : Indique s'il s'agit d'un véhicule de luxe


* **Données de test :**
Un tableau exporté contenant une liste d'exemples de voitures prêtes à être affichées.

---

## 2. Composant Enfant (`VoitureItem`)

Ce composant est responsable de l'affichage individuel d'un véhicule et de l'action de commande.

* **Entrée (`input.required<Voiture>()`) :** Reçoit l'objet `Voiture` transmis par le composant parent.
* **Sortie (`output<Voiture>()`) :** Déclenche un événement (avec `.emit(...)`) qui renvoie l'objet `Voiture` sélectionné au parent lorsque l'utilisateur clique sur le bouton de commande.

> ⚠️ On utilise les fonctions **`input()` / `output()`** (la syntaxe moderne en signals, comme dans la démo `restaurant`), **pas** les anciens décorateurs `@Input()` / `@Output()` + `EventEmitter` que tu trouveras dans de vieux tutos sur Internet.
* **Affichage :** Présente le nom, la marque, la capacité du réservoir et un indicateur si le véhicule est de luxe, accompagné d'un bouton pour commander.

---

## 3. Composant Parent (`Garage`)

Ce composant gère l'affichage global du garage et la réception des commandes.

* **Données :** Récupère le tableau de voitures depuis le fichier modèle.
* **Affichage :** Parcourt la liste des véhicules et génère un composant enfant `VoitureItem` pour chaque voiture.
* **Écoute d'événement :** Renseigne la propriété d'entrée de chaque enfant et s'abonne à son événement de sortie.
* **Traitement de la commande :** Récupère l'information transmise par l'enfant lors d'une commande pour afficher un message de confirmation avec le véhicule sélectionné.

---

➡️ La suite de l'exercice (le composant Compteur avec `model()`) : [exercice-suite.md](exercice-suite.md)
