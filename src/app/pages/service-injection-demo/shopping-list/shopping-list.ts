import { Component, inject, signal } from '@angular/core';
import { PanierService } from '../service-demo/panier.service';

@Component({
  imports: [],
  selector: 'app-shopping-list',
  styleUrl: './shopping-list.scss',
  templateUrl: './shopping-list.html',
})
export class ShoppingList {

  // grâce a mon @Injectable je peux faire:
  panierService = inject(PanierService)

  produits = signal<string[]>(['Clavier', 'Souris', 'Ecran', 'Casque'])

  AjouterAuPanier(produit : string) {
    console.log("avant le rajout " + this.panierService.articles())
    this.panierService.ajouter(produit)
    console.log("après le rajout " + this.panierService.articles())
  }

}
