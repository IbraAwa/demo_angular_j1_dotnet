import { Component, computed, linkedSignal, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-linked-signal-demo',
  styleUrl: './linked-signal-demo.scss',
  templateUrl: './linked-signal-demo.html',
})

// linkedsignal = computed et signal
// comme computed = sa valeur est calculé quand le signe ou il est dépendant change
// comme un signal = on peut le modifier a la main via l'user set() / update()
export class LinkedSignalDemo {
  categorie = signal<string>('Fruits');

  // si la catégorie est des fruit la variable produits qui est un tableau
  // Banane Pomme Poire
  // SI NON (donc ce n'est pas des fruits)
  // Tomate, concombre, brocoli
  produits = computed(() =>
    this.categorie() === 'Fruits'
    ? ['Pomme', 'Banane', 'Poire']
    : ['Carotte', 'Poireau', 'Tomate']
  )

  // mon linkedSignal fait comme un compute il regarde c'est qui le premier de la liste
  // ça permet a chaque fois que le signal produits change mon choix
  // revient au premier élément de la liste
  // MAIS EN MEME TEMPS
  // il laisse l'utilisateur faire son choix contrairement a computed qui ne laisse pas de SET ou UPDATE
  choix = linkedSignal(() => this.produits()[0]) // POIREAU

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
