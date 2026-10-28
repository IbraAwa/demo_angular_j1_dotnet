import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-compteur',
  styleUrl: './compteur.scss',
  templateUrl: './compteur.html',
})
export class Compteur {
  // model permet un input que l'enfant a AUSSI le droit de modifier
  // en gros model = input et ouput en même temps
  // Angular crée automatiquement un output caché avec son emit
  // a chaque modification l'enfant "emit" un event qui est na nouvelle valeur au parent et tout seul
  // exemple le parent restaurant
  // () => recoit un event avec une valeur de lenfant
  // [] => dynamique et envoie une valeur a l'enfant
  quantite = model.required<number>();

  diminuer() : void {
    this.quantite.set(this.quantite() - 1)
  }

  augmenter() : void {
    this.quantite.set(this.quantite() + 1)
  }
}
