import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-directive-demo',
  styleUrl: './directive-demo.scss',
  templateUrl: './directive-demo.html',
})
export class DirectiveDemo {
  // nouveau tableau nameColonnes
  nameColonnes = signal<string[]>([
    "Numéro de produit",
    "Nom produit",
  ])

  produits = signal<string[]>(["pomme", "poire", "banane","Kiwi"])
  // INDEX                        0        1        2        3
  stock = signal<number>(10)

  Destock(count : number) {
    this.stock.update((s) => s - count)
  }
}
