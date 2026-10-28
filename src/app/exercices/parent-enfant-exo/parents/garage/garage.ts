import { Component, signal } from '@angular/core';
import { VoitureItem } from '../../enfants/voiture-item/voiture-item';
import { Compteur } from '../../enfants/compteur/compteur';
import { Voiture, VOITURES } from '../../voiture.model';

@Component({
  imports: [VoitureItem, Compteur],
  selector: 'app-garage',
  styleUrl: './garage.scss',
  templateUrl: './garage.html',
})
export class Garage {
 voitures = signal<Voiture[]>(VOITURES);

 voitureCommander = signal<Voiture | null>(null)

 // SUITE : la quantité de base envoyée au compteur (1 voiture)
 // c'est le GARAGE qui sait ce que ce nombre veut dire :
 // combien de fois on commande LA MÊME voiture
 // signal car le compteur (enfant) va la modifier via [(quantite)]
 quantite = signal(1)

 ajouterCommande(voitureParam : Voiture) {
    // le contexte du garage : une seule voiture à la fois
    // si on commande une AUTRE voiture, elle remplace l'ancienne
    // et on repart de la quantité de base
    if (this.voitureCommander() !== voitureParam) {
      this.quantite.set(1)
    }
    this.voitureCommander.set(voitureParam)
 }
}
