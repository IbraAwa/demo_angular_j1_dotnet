import { Component, computed, signal, WritableSignal } from '@angular/core';
import { Plat, LISTE_PLATS } from '../../plat.model';
import { MenuItem } from '../../Enfants/menu-item/menu-item';
import { Compteur } from '../../Enfants/compteur/compteur';

export interface LigneCommande {
  plat: Plat;
  quantite: WritableSignal<number>
}

@Component({
  imports: [MenuItem, Compteur],
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
  commandes = signal<LigneCommande[]>([])

  //computed s'abonne/dépend d'un signal
  // dans notre cas : computed dépend du signal commandes
  total = computed(() =>
    this.commandes().reduce((somme, ligneCommande) => somme + ligneCommande.plat.prix * ligneCommande.quantite(), 0))


  AjouterCommande(plat : Plat) {
    // un signal capte l'event quand il y a une nouvelle référence
    // PAS ET SURTOUT PAS quand il y a une nouvelle valeur
    // si je rajoute un élément dans mon tableau commandes c'est une nouvelle valeur mais pas une nouvelle référence
    //this.commandes.update(list => [...list, plat])

    let LigneCommande : LigneCommande = {
      plat: plat,
      quantite: signal(1)
    }
    this.commandes.update(list => [...list, LigneCommande])
  }

  // this.commande.update on crée une nouvelle liste donc une nouvelle référence avec les ancienne
  // ancienne commande + la nouvelle commande
  // le signal vu qu'il recoit une nouvelle référence envoie l'information a tout le monde
  // mon computed qui est abonné/dépend grâce au this.commandes() à l'intérieur
  // réagit car le signal donne l'information et refait un nouveau calcule du total
}
