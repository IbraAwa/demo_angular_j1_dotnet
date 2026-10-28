import { Component, computed, linkedSignal, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-linked-signal-demo',
  styleUrl: './linked-signal-demo.scss',
  templateUrl: './linked-signal-demo.html',
})

// linkedSignal = computed et signal
// comme computed = sa valeur est recalculée quand le signal dont il dépend change
// comme un signal = on peut le modifier à la main (choix de l'user) via set() / update()
export class LinkedSignalDemo {
  categorie = signal<string>('Fruits');

  // si la catégorie est Fruits, la variable produits qui est un tableau
  // Pomme, Banane, Poire
  // SINON (donc ce ne sont pas des fruits)
  // Carotte, Poireau, Tomate
  produits = computed(() =>
    this.categorie() === 'Fruits'
    ? ['Pomme', 'Banane', 'Poire']
    : ['Carotte', 'Poireau', 'Tomate']
  )

  // mon linkedSignal fait comme un computed, il regarde qui est le premier de la liste
  // ça permet qu'à chaque fois que le signal produits change, mon choix
  // revient au premier élément de la liste
  // MAIS EN MÊME TEMPS
  // il laisse l'utilisateur faire son choix, contrairement à computed qui ne permet pas de SET ou UPDATE
  choix = linkedSignal(() => this.produits()[0]) // Pomme au départ, Carotte si on passe en Légumes

  changerCategorieEnFruit() : void {
    this.categorie.set('Fruits')
  }

  changerCategorieEnLegume() : void {
    this.categorie.set('Légumes')
  }

  choisirProduit(produit : string) : void {
    this.choix.set(produit)
  }
}
