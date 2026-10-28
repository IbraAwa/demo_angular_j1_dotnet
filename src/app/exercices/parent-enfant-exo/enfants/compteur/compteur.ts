import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-compteur',
  styleUrl: './compteur.scss',
  templateUrl: './compteur.html',
})

// composant enfant "bête" (dumb component)
// il ne sait PAS ce qu'il compte (des voitures, des plats, des billets...)
// son seul rôle : recevoir une quantité de base et faire -1 ou +1
export class Compteur {
  // model = input ET output en même temps
  // [ ] le parent envoie la quantité de base
  // ( ) à chaque modification, l'enfant renvoie tout seul la nouvelle valeur au parent
  // dans le parent garage.html : <app-compteur [(quantite)]="quantite" />
  quantite = model.required<number>();

  // update car la nouvelle valeur dépend de l'ancienne
  diminuer() : void {
    this.quantite.update((q) => q - 1)
  }

  augmenter() : void {
    this.quantite.update((q) => q + 1)
  }
}
