import { Component, signal } from '@angular/core';
import { Plat, LISTE_PLATS } from '../../plat.model';
import { MenuItem } from '../../Enfants/menu-item/menu-item';

@Component({
  imports: [MenuItem],
  selector: 'app-restaurant',
  styleUrl: './restaurant.scss',
  templateUrl: './restaurant.html',
})

// mon objectif en tant que parent c'est d'utiliser mon enfant
// pour afficher une carte jolie
// Pourquoi ? Pour savoir réutiliser mon enfant
// car imaginons on a un autre composant avec le top 3 des plats
// on veut pouvoir juste utiliser un composant enfant au lieu de dupliquer la logique d'affichage

// le parent est souvent :
// Smart component
// car il possède la logique d'appel api/store/service etc... mais pas de logique d'affichage
export class Restaurant {
  carte = signal<Plat[]>(LISTE_PLATS)
  commandes = signal<Plat[]>([])


  AjouterCommande(plat : Plat) {
    // un signal capte l'event quand il y'a une nouvelle réference
    // PAS  ET SURTOUT PAS quand il y'a une nouvelle valuer
    // si je rajoute un élément dans mon tableau commandes c'est une nouvelle valeur mais pas une nouvelle référence
    this.commandes.update(list => [...list, plat])
  }
}
