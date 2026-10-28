import { Component, input, output } from '@angular/core';
import { Voiture } from '../../voiture.model';

@Component({
  imports: [],
  selector: 'app-voiture-item',
  styleUrl: './voiture-item.scss',
  templateUrl: './voiture-item.html',
})

// composant enfant
export class VoitureItem {
  //input : permet au parent garage.html de faire
  //<app-voiture-item [voiture]="voiture"/>
  voiture = input.required<Voiture>();

  //output : permet d'envoyer un event au parent
  //<app-voiture-item (nomVariable)="commander($event)"/>
  voitureCommander = output<Voiture>();

  // coder la logique qui va utiliser l'output avec emit()
  // pour envoyer un event après une action utilisateur
  Commander(voiture : Voiture) {
    console.log(`enfant veut envoyer au papa ${voiture.marque}`)
    this.voitureCommander.emit(voiture);
  }
}
