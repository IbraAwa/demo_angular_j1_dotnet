import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-directive-demo',
  styleUrl: './directive-demo.scss',
  templateUrl: './directive-demo.html',
})
export class DirectiveDemo {
  // nouveau tableau nameColonnes
  produits = signal<string[]>([
    "pomme",
    "poire",
    "banane",
    "Kiwi"
  ])
  stock = signal<number>(10)

  Destock(count : number) {
    this.stock.update((s) => s - count)
  }
}
