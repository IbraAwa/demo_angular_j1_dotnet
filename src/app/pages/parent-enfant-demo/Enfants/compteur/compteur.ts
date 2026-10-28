import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-compteur',
  styleUrl: './compteur.scss',
  templateUrl: './compteur.html',
})
export class Compteur {
  // model permet un input que l'enfant a AUSSI le droit de modifier
  // en gros model = input et output en même temps
  // Angular crée automatiquement un output caché (quantiteChange) avec son emit
  // à chaque modification (set / update), l'enfant "emit" tout seul un event qui contient la nouvelle valeur pour le parent
  // exemple : le parent restaurant
  // () => reçoit un event avec une valeur de l'enfant
  // [] => dynamique et envoie une valeur à l'enfant
  quantite = model.required<number>();

  diminuer() : void {
    this.quantite.set(this.quantite() - 1)
  }

  augmenter() : void {
    this.quantite.set(this.quantite() + 1)
  }
}
